window.devportal.partials.create = function($scope, $dev, $auth, $state, $fileReader){
	$dev.navigation().title();
	$dev.states().setIdle();
	
	$scope.wizardPages = ["requirements", "description","templates"];
	$scope.projectTypes = ["template", "upload", "bundle"];//, "clone","export"];
	$scope.appCategories = window.devportal.categories;

	var lsState = localStorage.getItem("createProjectState");
	if (lsState) {
		$scope.projectState = JSON.parse(lsState);
	}
	else {
		$scope.projectState = {
			state:"predevelop",
			pdparams: { projectType:"template", description: {},requirements: {}, templates:{}}
		};	
	}

	$scope.$watch("projectState.pdparams.templates.category", function(){
		if ($scope.projectState.pdparams.templates.category)
		$dev.templates()
			.templates($scope.projectState.pdparams.templates.category.folder)
			.success(function(data){$scope.catTemplates = data;})
			.error(function(data){$scope.error = "";});
	});

	$dev.templates()
		.categories()
		.success(function(data){$scope.categories = data;})
		.error(function(data){$scope.error = "";});

	$scope.selectCategory = function(cat){$scope.projectState.pdparams.templates.category = cat;}
	$scope.selectTemplate = function(cat){$scope.projectState.pdparams.templates.template = cat;}

	$scope.$watch("projectState.pdparams.wpi", function(){ 
		if (!$scope.projectState.pdparams.wpi) $scope.projectState.pdparams.wpi = 0; 
		$scope.projectState.pdparams.wizardPage = $scope.wizardPages[$scope.projectState.pdparams.wpi]; 
		localStorage.setItem("createProjectState", JSON.stringify($scope.projectState));
	});

	$scope.finalizeWizard = function(){

		function nav(key){
			localStorage.removeItem("createProjectState");
			if ($scope.projectState.pdparams.projectType =="bundle") $state.go("bundle",{appKey:key});
			else $state.go("edit",{appKey:key});
		}

		$scope.projectState.pdparams.requirements.people = $scope.contacts ? $scope.contacts : [];
		
		$dev.project()
			.create($scope.projectState)
			.success(function(data){
				var key = $scope.projectState.pdparams.description.appKey;
		    	$dev.project().iconUpload(key,$scope.fileForm ? $scope.fileForm : "N/A").success(function(){
		    		var ptype = $scope.projectState.pdparams.projectType;
		    		switch (ptype){
		    			case "upload":
							$dev.editor().upload(key, "/upload.zip", $scope.zipFileForm).success(function(){
								nav(key);
							}).error(function(){
								$dev.dialog().alert ("Error Uploading Zip File");
							});		
		    				break;
		    			default:
		    				nav(key);
		    				break;
		    		}

		    	}).error(function(){
					$dev.dialog().alert ("Error uploading icon");
		    	});

			})
			.error(function(data){
				$dev.dialog().alert ("Error Creating Project");
				$scope.error = "";
			});
	}

	$scope.nextText = "Next";
	$scope.wizardStep = function(v) { 
		var cs = $scope.projectState.pdparams.wpi + v;
		var np = (cs == -1) ? 0  : cs;
		
		//&& !validate()
		if (cs!=np)
			return;
		
		if (np == $scope.wizardPages.length) {
			if (validate()) $scope.finalizeWizard();
		}
		else{
			$scope.projectState.pdparams.wpi = np;
			$scope.nextText = (cs == $scope.wizardPages.length -1) ? "Finish" : "Next";			
		}
	}

	$scope.navWizardPage = function(v){
		$scope.projectState.pdparams.wpi = v;
		$scope.nextText = (v == $scope.wizardPages.length -1) ? "Finish" : "Next";
	}

	$scope.navHome = function(){
		$state.go('home');
	}


	function Validation(){
		return {
			ib: function(str){ return !(!str || /^\s*$/.test(str));},
			cs: function(a){ if (!a) return true; for (ai in a) if(angular.isString(a[ai]))return false; return true;},
			ic: function(){},
			nc: function(v){return (v != undefined);},
			v: function(ar){
				var el;
				for (ai in ar) for (ci in ar[ai].ch)
					if (!this[ar[ai].ch[ci].c](ar[ai].a)){
						if (!el) el = ""; el += (ar[ai].ch[ci].b);
						break;
					}
				return el;
			}
		}
	}

	var validation = new Validation();

	function validate(){
		var descObj = $scope.projectState.pdparams.description;
		//var reqObj = $scope.projectState.pdparams.requirements;
		
		console.log($scope.contacts);

		var vr = [
			{a:$scope.contacts, ch:[{b:"Invalid stakeholder selected<br/>", c:"cs"}]},
			{a:descObj.title, ch:[{b:"Please enter app title<br/>", c:"ib"}]},
			{a:descObj.appKey, ch:[{b:"App key not generated<br/>", c:"ib"}]},
			{a:descObj.secretKey, ch:[{b:"Secret key not generated<br/>", c:"ib"}]},
			{a:descObj.description, ch:[{b:"Please enter description<br/>", c:"ib"}]}
		];

		switch ($scope.projectState.pdparams.projectType){
			case "template":
					var tempObj = $scope.projectState.pdparams.templates;
					vr = vr.concat([{a:tempObj.category, ch:[{b:"Please select a template category for app<br/>", c:"ib"}]},
					{a:tempObj.template, ch:[{b:"Please select template for app<br/>", c:"ib"}]}]); 
				break;
			case "upload":
					vr = vr.concat([{a:$scope.zipFileForm, ch:[{b:"Please select a zip file to upload<br/>", c:"nc"}]}]); 
				break;
		}

		var el = validation.v(vr);
		if (el) $dev.dialog().alert ("<div>You have the following errors<br/>" + el + "</div>");
		return (el == undefined);
	}

	$scope.getKeys = function(){
		$dev.project()
		.getKeys($scope.projectState.pdparams.description.title)
		.success(function(data){
			$scope.projectState.pdparams.description.appKey = data.app;
			$scope.projectState.pdparams.description.secretKey= data.secret;
		})
		.error(function(data){
			$dev.dialog().alert ("Error getting app/secret keys");
		});
	}

    $scope.getFile = function () { };

    $scope.onFileSelect = function(file){
    	$scope.fileForm = file;
        $fileReader.readAsDataUrl(file, $scope).then(function(result,b,c) {
      		$scope.imageSrc = result;
      	});
    }

	$scope.onUploadFileSelect = function(file){ $scope.zipFileForm = file;}

    $scope.projectState.pdparams.requirements.owner = $auth.getUserName();

    function querySearch (query) {return query ? $scope.allContacts.filter(createFilterFor(query)) : [];}
    function createFilterFor(query) { return function filterFn(contact) {return (contact._lowername.indexOf(angular.lowercase(query)) != -1);};}
   
    $dev.project().getShareUsers().success(function(data){
    	$scope.allContacts = data.map(function (c, index) {
        var contact = {
          name: c.Name,
          email: c.EmailAddress,
          image:'views/images/user.png'
        };
        contact._lowername = contact.name.toLowerCase();
        return contact;
      });

    }).error (function(){
    	$dev.dialog().alert ("Error retrieving users");
    });

    $scope.querySearch = querySearch;
    $scope.allContacts = [];
    $scope.contacts = [];
    $scope.filterSelected = true;

    $scope.getColor = function(p){
    	return ($scope.projectState.pdparams.wpi == p) ? "black" : "white";
    }
}