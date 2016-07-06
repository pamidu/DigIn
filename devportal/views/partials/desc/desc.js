window.devportal.partials.desc = function($scope,$rootScope, $http, $dev, $state, $rootScope, $stateParams, $auth, $objectstore,$helpers, $fileReader, $helpers){
	$scope.appKey = $stateParams.appKey;
	$scope.appCategories = window.devportal.categories;
	$scope.imageSrc = "appicons/default.png";

	$dev.project().get($stateParams.appKey).success(function(data){
		$scope.appDesc = data;
		$scope.imageSrc = "appicons/" + $scope.appKey +".png";
		console.log($scope.imageSrc);
		$dev.states().setIdle();
	}).error(function(data){
		$dev.dialog().alert ("Error Retrieving Project Details");
		$dev.states().setIdle();
	});


	$dev.project().settings($stateParams.appKey).success(function(data){
		$scope.appSettings = data;
		var canIdle = true;
		if (data.template)
			if (data.template.category && data.template.id){
				canIdle = false;
				getTemplateSettings(data.template.category, data.template.id);
			}
		
		if (canIdle)
			$dev.states().setIdle();
	}).error(function(data){
		$dev.dialog().alert ("Error Retrieving Project Settings");
		$dev.states().setIdle();
	});

	$dev.project().getScope($stateParams.appKey).success(function(data){
		$scope.appScope = data;
		$dev.states().setIdle();
	}).error(function(data){
		$dev.dialog().alert ("Error Retrieving Project Settings");
		$dev.states().setIdle();
	});
	

	function getTemplateSettings(cid, tid){
		$dev.templates().settings(cid,tid).success(function(data){
			$scope.templateSettings = data;
			$dev.states().setIdle();
		}).error(function(data){
			$dev.states().setIdle();
		});	
	}


	$scope.edit = function(){$dev.navigation().edit($scope.appKey);}
	$scope.save = function(){
	    $helpers.setCookie("DescUpdated", true, 1);
		$dev.project().edit($scope.appKey,{desc: $scope.appDesc, settings:$scope.appSettings, scope:$scope.appScope}).success(function(){
			localStorage.setItem("project:" + $scope.appKey, JSON.stringify($scope.appDesc));

			if ($scope.fileForm)
			$dev.project().iconUpload($scope.appKey,$scope.fileForm).success(angular.noop).error(function(){
				$dev.dialog().alert("Error uploading app icon");
			});
		}).error(function(){
			$dev.dialog().alert("Error updating app description");
		});
	}

    $scope.onFileSelect = function(file){
    	$scope.fileForm = file;
        $fileReader.readAsDataUrl(file, $scope).then(function(result,b,c) {
      		$scope.imageSrc = result;
      	});
    }

    $scope.getType = function(o){
		var oType = typeof(o)

		if (oType === "object")
			if(o.constructor === Array)
				oType = "array";

    	return oType;
    }


    $scope.appendToArray = function(k, a){
    	if (!$scope.appSettings.data[k])
    		$scope.appSettings.data[k] = [];

    	var newObj = JSON.parse(JSON.stringify(a[0]));
    	$scope.appSettings.data[k].push(newObj);
    }

	$scope.deleteFromArray = function(a, obj){
		var ri;
		for(ai in a)
		if (a[ai] == obj){
			ri = ai;
			break;
		}
		
		if (ri)		
			a.splice(ri,1);
	}

	$scope.deleteScope = function(arr, item){
		for (var i=arr.length-1; i>=0; i--) {
		    if (arr[i] == item) {
		        arr.splice(i, 1);
		        break;
		    }
		}

	}

	$scope.addScope = function(arr,item){
		if (typeof arr === "string"){

			if (arr.indexOf(".") == -1){
				if (!$scope.appScope.scope[arr])
					$scope.appScope.scope[arr] = [];
				arr = $scope.appScope.scope[arr];				
			}else{
				var splitData = arr.split(".");
				if (!$scope[splitData[0]])
					$scope[splitData[0]] = {};

				if (!$scope[splitData[0]][splitData[1]])
					$scope[splitData[0]][splitData[1]] = [];

				arr = $scope[splitData[0]][splitData[1]];
			}

		}

		var val = $scope[item];

		if (!val)
			return;
		if (typeof val === "string")
			if (val.length ==0 )
				return;

		for (var i=arr.length-1; i>=0; i--)
		    if (arr[i] == val){
				$scope[item] = "";
		    	return;
		    }

		arr.push($scope[item]);
		$scope[item] = "";
	}

	$dev.navigation().title($scope.appKey);
}