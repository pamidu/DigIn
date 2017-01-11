routerApp.controller('user_assistanceCtrl',[ '$scope','$rootScope','$mdDialog','Upload','Digin_Engine_API','$diginengine','notifications', '$location','$anchorScroll', function ($scope,$rootScope,$mdDialog,Upload,Digin_Engine_API,$diginengine,notifications,$location,$anchorScroll){
		$scope.$parent.currentView = "User Assistance";
		var chartBackgroundColor = "";
		
		if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
		{
			chartBackgroundColor = "rgb(48,48,48)";
		}else{
			chartBackgroundColor = "white";
		}
		
		$scope.files = []; //Files imported array
		$scope.Folders = [];
		$scope.FileName;
		var uploadFlag = false;
		$scope.uploadPreLoader = false;
		$scope.insertPreLoader = false;
		$scope.isExist = false;
		$scope.is_first_try = 'True';
		$scope.selectedPath ="File";
		$scope.schemaCollection = [];
		$scope.progressPercentage = 0;
		$scope.folderName;
		$scope.uploadedFiles = [];
		$scope.datasource_id = '';
		$scope.selectedFolder = "";
		$scope.client = $diginengine.getClient("BigQuery");
		$scope.fieldTypeObj = ["STRING","BYTES","INTEGER","FLOAT","BOOLEAN","TIMESTAMP","DATE","TIME","DATETIME"];
		//Upload Types
		$scope.uploadTypes = [{name:"File", icon:"ti-file"},{name:"Folder",icon:"ti-folder"}];
		
		$scope.disableFolerName = function(type)
		{
			$scope.selectedPath = type;
			$scope.submitCurrentStep($scope.stepData[0]);
		}

		//start of page one Folder name configuring
		$scope.currentNavItem = 'page1';
		$scope.newCollection = false;

		$scope.goto = function() {

				$scope.step1.$setUntouched();
				$scope.step1.$setPristine();
				$scope.newCollection = !$scope.newCollection;
			}
			//end of page one Folder name configuring

		//start of configuring pages
		$scope.currentStep = 0;
		$scope.schema = [];
		$scope.selectedStep = 0;
		$scope.stepProgress = 1;
		$scope.maxStep = 3;
		$scope.showBusyText = false;
		$scope.stepData = [{
			step: 1,
			completed: false,
			optional: false,
			data: {},
			busyText: "Proceeding to step 2"
		}, {
			step: 2,
			completed: false,
			optional: false,
			data: {},
			busyText: "Uploading File"
		}, {
			step: 3,
			completed: false,
			optional: false,
			data: {}
		}, ];

		$scope.enableNextStep = function nextStep() {

			if ($scope.selectedPath == "File" && uploadFlag == false) {
				$scope.stepProgress = 2;
				$scope.selectedStep = 2;
				$scope.schema = [];
				return;

			} else {
				//do not exceed into max step
				if ($scope.selectedStep >= $scope.maxStep) {
					return;
				}
				//do not increment $scope.stepProgress when submitting from previously completed step
				if ($scope.selectedStep === $scope.stepProgress - 1) {
					$scope.stepProgress = $scope.stepProgress + 1;
				}
				$scope.selectedStep = $scope.selectedStep + 1;
				$scope.stepProgress = $scope.selectedStep;
			}
		}

		//auto select the folder name
		$scope.$watch("folderName",function(newValue, oldValue){
			var existStatus = false;
			if (newValue != oldValue){
				for(var i=0;i<$scope.Folders.length;i++){
					if (newValue == $scope.Folders[i].name){
						existStatus = true;
						break;
					}
				}
				if(existStatus){
					$scope.selectFile($scope.Folders[i]);
				} else{
					$scope.selectedFolder = "";
					$scope.isExist = false;                
				}
			}
		});

		$scope.selectFile = function(folder) {
			$scope.selectedFolder = folder;
			$scope.folderName = folder.name;
			$scope.isExist = true;
		}

		$scope.moveToPreviousStep = function moveToPreviousStep() {

				if ($scope.selectedPath == "File" && uploadFlag == false) {

					$scope.selectedStep = $scope.selectedStep - 2;
					$scope.files = [];
					$scope.schema = [];
					$scope.schemaCollection = [];
					$scope.progressPercentage = 0;
					$scope.uploadPreLoader = false;
					$scope.insertPreLoader = false;
					$scope.preloader = false;
					$scope.isExist = false;
					$scope.selectedFolder = "";

				} else if ($scope.selectedPath == "Folder" && uploadFlag == false) {
					if ($scope.selectedStep > 0) $scope.selectedStep = $scope.selectedStep - 1;
					if ($scope.selectedStep == 1 ){
						$scope.Folders = [];
						$scope.client.getTables(function(res, status) {
							if(status) {
								angular.forEach(res,function(key) {
									if (key.upload_type == 'csv-directory') {
										$scope.Folders.push({
											name : key.datasource_name,
											files : key.file_uploads,
											id : key.datasource_id
										});
									}
								})
							}
						});
					}
					$scope.files = [];
					$scope.schema = [];
					$scope.schemaCollection = [];
					$scope.progressPercentage = 0;
					$scope.uploadPreLoader = false;
					$scope.insertPreLoader = false;
					$scope.preloader = false;
					$scope.isExist = false;
					$scope.selectedFolder = "";

				} else if ($scope.selectedStep > 0) {
					$scope.selectedStep = $scope.selectedStep - 1;
				}
			}
			//end of configuring pages


		$scope.submitCurrentStep = function submitCurrentStep(stepData, isSkip) {
			// Validation for file name
			if ($scope.selectedPath == "Folder" && uploadFlag == false && $scope.selectedStep == 1) {
				console.log($scope.folderName);
				if ($scope.folderName === undefined) {
					notifications.toast('0','Folder name should not contain spaces and special characters.');
					$location.hash('report-top');
					$anchorScroll();
					return;
				}
			}
			$scope.currentStep = stepData.step - 1;

			$scope.showBusyText = true;

			//based on the selected level, call the necessary method
			if($scope.selectedPath == "File" && uploadFlag == false){
				$scope.client.getTables(function(res, status) {
					if(status){
						$scope.uploadedFiles = [];
						angular.forEach(res,function(key) {
							if (key.upload_type == 'csv-singlefile') {
								$scope.uploadedFiles.push({
									file_name : key.datasource_name,
									upload_id : key.datasource_id
								});
							}
						})
						stepData.completed = true;
						$scope.showBusyText = false;
						stepData.data.completed = true;
						$scope.enableNextStep();
					}else{
						stepData.completed = true;
						$scope.showBusyText = false;
						stepData.data.completed = true;                    
						$scope.enableNextStep();
					}
				});
			} else if($scope.selectedPath == "Folder" && uploadFlag == false && $scope.selectedStep == 0){
				$scope.client.getTables(function(res, status) {
					if(status){
						$scope.Folders = [];
						angular.forEach(res,function(key) {
							if (key.upload_type == 'csv-directory') {
								$scope.Folders.push({
									name : key.datasource_name,
									files : key.file_uploads,
									id : key.datasource_id
								});
							}
						})
						stepData.completed = true;
						$scope.showBusyText = false;
						stepData.data.completed = true;
						$scope.enableNextStep();
					}else{
						stepData.completed = true;
						$scope.showBusyText = false;
						stepData.data.completed = true;
						$scope.enableNextStep();
					}
				});
			} else if($scope.selectedPath == "Folder" && uploadFlag == false && $scope.selectedStep == 1){
				$scope.uploadedFiles = [];
				$scope.isExist = false;
				angular.forEach($scope.Folders,function(folder){
					if (folder.name == $scope.folderName){
						$scope.isExist = true;
						$scope.uploadedFiles = folder.files;
						$scope.datasource_id = folder.id;
						// $scope.uploadedFiles["upload_id"] = folder.id;
					}
				})
				if (!$scope.isExist) $scope.datasource_id = '';
				stepData.completed = true;
				$scope.showBusyText = false;
				stepData.data.completed = true;
				$scope.enableNextStep();
			}
		}


		$scope.validate = function(files) {
			var duplicateflag = false;
			var fileName;
			angular.forEach(files,function(file) {
				if($scope.selectedPath == "File") {
					fileName = file.name.replace(/\.[^/.]+$/, ""); //remove the extension
					fileName = fileName.replace(/ /g,"_"); //replace space with underscore
					fileName = fileName.replace(/[^a-zA-Z_0-9]/g,'').toLowerCase(); //remove special characters
				} else{
					fileName = file.name;
				}
				angular.forEach($scope.uploadedFiles,function(f){
					if (fileName == f.file_name) {
						duplicateflag = true;
						// if ($scope.selectedPath == "File") $scope.datasource_id = f.upload_id;
					}
				});
				// if ($scope.selectedPath == "Folder") {
				//     if ($scope.isExist) {
				//         console.log($scope.datasource_id);
				//     }
				// }
				if ($scope.selectedPath == "File") $scope.datasource_id = '';
			});
			if (duplicateflag) {
				$scope.showConfirmBox(files,$scope);
			} else {
				// if ($scope.selectedPath == "File") $scope.datasource_id = '';
				$scope.upload(files);
			}
		}

		$scope.showConfirmBox = function(files, scope) {
			$mdDialog.show({
				controller: function confirmUpload($scope, $mdDialog) {
					$scope.confirm = function () {
						$mdDialog.cancel();
						scope.upload(files);
					};
					$scope.cancel = function () {
						$mdDialog.cancel();
						scope.files = [];
						scope.progressPercentage = 0;
						scope.uploadPreLoader = false;
						scope.preloader = false;                    
						return;
					};
				},
				templateUrl: 'views/widgets/excelFileUpload/excelUploadConfirm.html',
				parent: angular.element(document.body)
			});
		}

		$scope.validateType = function(newType,currentType,index) {
			var oldTtype = $scope.originalSchema[index].type.toUpperCase();
			if ( newType == "FLOAT" && oldTtype == "INTEGER" ) {
				notifications.toast('0','Invalid data type conversion.');
				$scope.schema[index].type = currentType;
			} else if ( newType == "STRING" && oldTtype == "INTEGER" ) {
				notifications.toast('0','Invalid data type conversion.');
				$scope.schema[index].type = currentType;
			} else if ( newType == "STRING" && oldTtype == "FLOAT" ) {
				notifications.toast('0','Invalid data type conversion.');
				$scope.schema[index].type = currentType;
			} else if ( newType == "FLOAT" && oldTtype == "DATE" ) {
				notifications.toast('0','Invalid data type conversion.');
				$scope.schema[index].type = currentType;
			} else if ( newType == "DATE" && oldTtype == "TIME" ) {
				notifications.toast('0','Invalid data type conversion.');
				$scope.schema[index].type = currentType;
			} else if ( newType == "TIME" && oldTtype == "DATE" ) {
				notifications.toast('0','Invalid data type conversion.');
				$scope.schema[index].type = currentType;
			}
		}

		$scope.upload = function(files) {
			$scope.files = files;
			$scope.progressPercentage = 0;
			var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
			var uploadFlag;
			var storeFlag;
			$scope.schemaCollection = [];
			if (files && files.length) {
				$scope.preloader = true;
				$scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
				if ($scope.selectedPath == "File") {
					$scope.otherdata = {
						"file_type": "datasource",
						"folder_name": null
					};
				} else {
					$scope.otherdata = {
						"file_type": "datasource",
						"folder_name": $scope.folderName.toLowerCase()
					};

				}
				for (var i = 0; i < files.length; i++) {
					var lim = i == 0 ? "" : "-" + i;
					$scope.FileName = files[i].name;
					$scope.uploadFile = Upload.upload({
						url: Digin_Engine_API + 'file_upload',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						data: {
							file: files[i],
							db: 'BigQuery',
							SecurityToken: userInfo.SecurityToken,
							filename: files[i].name,
							other_data: JSON.stringify($scope.otherdata),
							datasource_id : $scope.datasource_id
						}

					}).then(function (data) {
						$scope.is_first_try = 'True';
						if (data.data.Is_Success){
							$scope.schema = data.data.Result;
							$scope.originalSchema = angular.copy($scope.schema);
							angular.forEach($scope.schema,function(key){
								key.type = key.type.toUpperCase();
							});
							$scope.schemaCollection.push($scope.schema);
							uploadFlag = true;
							notifications.toast(1, "Schema retrieved  successfully");
						} else {
							uploadFlag = false;
							notifications.toast('0', 'Error uploading file!');
							$scope.diginLogo = 'digin-logo-wrapper2';
						}
						$scope.uploadPreLoader = false;
						$scope.preloader = false;
					}, function (data) {
						$scope.is_first_try = 'True';
						uploadFlag = false;
						notifications.toast('0', 'Error uploading file!');
						$scope.uploadPreLoader = false;
						$scope.preloader = false;
						$scope.diginLogo = 'digin-logo-wrapper2';
					}, function (evt) {
						$scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
						if ( $scope.progressPercentage == 100 ) {
							$scope.uploadPreLoader = true;
						}
						//console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.filename);
					});
				}
			}
		};

		$scope.UploadWithUpdate = function(stepData) {
			if ($scope.files.length <= 0) {
				notifications.toast(0, "Please add a file!");
				return;
			}
			//$location.hash('report-top');
			$anchorScroll();
			var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
			$scope.insertPreLoader = true;
			if ($scope.selectedPath == "File") {
				$scope.folderName = '';
				$scope.folder_type = 'singlefile';
			} else {
				if ($scope.isExist) {
					$scope.folder_type = 'exist';
					// $scope.schema = [];
				} else {
					$scope.folder_type = 'new';
				}
			}
			for (var i = 0; i < $scope.files.length; i++) {
				Upload.upload({
					url: Digin_Engine_API + 'insert_data',
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					data: {
						schema: JSON.stringify($scope.schema),
						db: 'BigQuery',
						SecurityToken: userInfo.SecurityToken,
						filename: $scope.files[i].name,
						folder_name: $scope.folderName.toLowerCase(),
						folder_type: $scope.folder_type,
						datasource_id : $scope.datasource_id,
						is_first_try : $scope.is_first_try
					}
				}).then(function (data) {
					$scope.is_first_try = 'False';
					$scope.insertPreLoader = false;
					if (data.data.Is_Success){
						uploadFlag = true;
						notifications.toast(1, "Successfully uploaded to the datawarehouse");
						stepData.data.completed = true;
						$scope.enableNextStep();
					} else {
						uploadFlag = false;
						notifications.toast(0, data.data.Custom_Message);
						$scope.diginLogo = 'digin-logo-wrapper2';
					}
					console.log(data);
				}, function (data) {
					$scope.insertPreLoader = false;
					uploadFlag = false;
					notifications.toast(0, "Error Uploading File!");
					$scope.diginLogo = 'digin-logo-wrapper2';
				});
			}
		};

		$scope.goToDashboard = function() {
			$state.go("home.Dashboards");
			$mdSidenav('right').toggle();
		}


		$scope.getFileDetails = function(e) {

			$scope.files = [];
			$scope.$apply(function() {

				// STORE THE FILE OBJECT IN AN ARRAY.
				for (var i = 0; i < e.files.length; i++) {
					$scope.files.push(e.files[i])
				}

			});
		};

		// UPDATE PROGRESS BAR.
		function updateProgress(e) {
			if (e.lengthComputable) {
				document.getElementById('pro').setAttribute('value', e.loaded);
				document.getElementById('pro').setAttribute('max', e.total);
			}
		}

		// CONFIRMATION.
		function transferComplete(e) {
			alert("Files uploaded successfully.");
		}
		
		//Submit four in Upload Source
		$scope.goToNext = function()
		{
			console.log("next");
			$scope.assist_selected = 1;
		}
		
		/*
		//initialize the forms
		$scope.upload_step1 = {};
		$scope.upload_step1.completed = true;
		$scope.upload_step2 = {};
		$scope.upload_step2.disabled = true;
		$scope.upload_step3 = {};
		
		
		//Upload Types
		$scope.uploadTypes = [{name:"File", icon:"ti-file"},{name:"Folder",icon:"ti-folder"}];
		
		//Submit one in Upload Source
		$scope.disableFolerName = function(type)
		{
			if(type == "File")
			{
				$scope.upload_step2.disabled = true;
			}else{
				$scope.upload_step2.disabled = false;
			}
			$scope.upload_selected = 1;
			$scope.upload_step1.completed = true;
		}
		
		//start of page one Folder name configuring
		$scope.currentNavItem = 'page1';
		$scope.newCollection = false;

		$scope.goto = function() {

			$scope.folderForm.$setUntouched();
			$scope.folderForm.$setPristine();
			$scope.newCollection = !$scope.newCollection;
		}
		//end of page one Folder name configuring
		
		//Submit two in Upload Source
		$scope.submitFolderStep = function()
		{
			$scope.upload_selected = 2;
			$scope.upload_step2.completed = true;	
		}
		
		//Submit three in Upload Source
		$scope.submitUploadDetails = function()
		{
			$scope.upload_selected = 3;
			$scope.upload_step3.completed = true;	
			//$scope.upload_step2.completed = true;	
		}
		
		//Go To Previous Upload Source Step
		$scope.goToPreviousUploadSourceStep = function()
		{
			--$scope.upload_selected;
		}
		
		//Submit four in Upload Source
		$scope.goToNext = function()
		{
			console.log("next");
			$scope.assist_selected = 1;
		}
		*/
		
		
		
		
		
		
		
		//Connect Source		
		
		//initialize the forms
		
		$scope.connectSource_step1 = {};
		$scope.connectSource_step2 = {};
		
		$scope.sourceType = [
			{name: "Big Query", icon: "biq-query"},
			//{name: "Postgre SQL", icon: "views/user_assistance/connectSource/postgress.png"},
			{name: "Microsoft SQL", icon: "mssql"},
			{name: "memsql", icon: "memsql"}
		];
		$scope.files = [];
		$scope.folders = [];
		//Submit one in Upload Source
		$scope.selectSource = function(type)
		{
			//alert(type);
			if(type == "Big Query")
			{
				$diginengine.getClient("BigQuery").getTables(function(res, status) {
					
					if(status) {
						$scope.connectSource_selected = 1;
						$scope.connectSource_step1.completed = true;
						console.log(res);
						
						for(var i = 0; i < res.length; i++){
							if(res[i].upload_type == "csv-singlefile"){
							  $scope.files.push(res[i]);
							}else{
							  $scope.folders.push(res[i]);
							}
						}
					} else {
						notifications.toast('0', 'Error occured. Please try again.');
					}
				});
				
			}else{
				notifications.alertDialog("Sorry","Not connected yet");
			}
		}
		$scope.attributes = [];
		$scope.measures = []
		$scope.selectTable = function(fileOrFolder)
		{
			console.log(fileOrFolder.schema);
			for(var i = 1; i < fileOrFolder.schema.length; i++){
				if( fileOrFolder.schema[i].type == "INTEGER" ||  fileOrFolder.schema[i].type == "FLOAT" ){
					$scope.measures.push(fileOrFolder.schema[i]);	
				}
				
				if( fileOrFolder.schema[i].name != "_index_id" && fileOrFolder.schema[i].type != "integer" )
				{
					$scope.attributes.push(fileOrFolder.schema[i]);
				}
			}
			$scope.connectSource_selected = 2;
			$scope.connectSource_step2.completed = true;
			
		}		
		
		$scope.goToPreviousConnectSourceStep = function()
		{
			--$scope.connectSource_selected;
		}
		
		//$scope.attributes = ['GUStoreID','GUChangeID','StoreCode', 'StoreName','BuildingNumber', 'StreetName', 'City', 'PostalCode','ZipCode', 'Phone1','Phone2','Fax','Status','CreatedUser','CreatedDate','ModifiedUser','ModifiedDate','GUDepotID','GUDepotChgID','MiniStore','GUVehicleID','GUVehicleChgID','GUDeptID'];
		$scope.selectAllAttributes = false;
		$scope.selectedAttributes = [];
		$scope.selectAttribute = function (item) {

			var idx = $scope.selectedAttributes.indexOf(item);
			if (idx > -1) {
			 $scope.selectedAttributes.splice(idx, 1);
			}
			else {
			  $scope.selectedAttributes.push(item);
			  console.log($scope.selectedAttributes);
			}
		};
		$scope.attributesExists = function (item) {
			return $scope.selectedAttributes.indexOf(item) > -1;
		};

	  
		$scope.toggleAllAttributes = function() {
			if ($scope.selectedAttributes.length === $scope.attributes.length) {
				$scope.selectedAttributes = [];
			} else if ($scope.selectedAttributes.length === 0 || $scope.selectedAttributes.length > 0) {
				$scope.selectedAttributes = $scope.attributes.slice(0);
			}
		};
		
		//$scope.measures = ['LocationID','CompanyID', 'BranchID','DeptID','StoreID','CityID','Country','PeriodID'];
		$scope.selectAllMeasures= false;
		$scope.selectedMeasures= [];
		$scope.selectMeasure = function (item) {

			var idx = $scope.selectedMeasures.indexOf(item);
			if (idx > -1) {
			  $scope.selectedMeasures.splice(idx, 1);
			}
			else {
			  $scope.selectedMeasures.push(item);
			  console.log($scope.selectedMeasures);
			}
		};
		$scope.measuresExists = function (item) {
			return $scope.selectedMeasures.indexOf(item) > -1;
		};
		
		$scope.toggleAllMeasures = function() {
			if ($scope.selectedMeasures.length === $scope.measures.length) {
				$scope.selectedMeasures = [];
			} else if ($scope.selectedMeasures.length === 0 || $scope.selectedMeasures.length > 0) {
				$scope.selectedMeasures = $scope.measures.slice(0);
			}
		};
		
		$scope.aggregations = ["AVG","SUM","COUNT","MIN","MAX"];
		
		$scope.series = [
							{click: false,filedName: 'PO',id:0,type:'integer'},
							{click: false,filedName: 'QUANTITY',id:0,type:'integer'},
							{click: false,filedName: 'AMOUNT',id:0,type:'integer'}
						];
							
		$scope.category = [	"CITY","PROVINCE","COUNTRY","ITEM","ITEMGROUP","QUANTITY","AMOUNT"];
		
		$scope.selectedSeries = [];
		$scope.selectedCategory = [];
		
		$scope.pushSeries = function(item, aggregation)
		{
			var pushObj = angular.copy(item);
			pushObj.aggType = aggregation;
			
			$scope.selectedSeries.push(pushObj);
			console.log($scope.series[0]);
			console.log($scope.selectedSeries[0]);
		}
		
		$scope.pushCateory = function(index, item)
		{
			console.log(item);
			$scope.selectedCategory.push(item);
		}
		
		setTimeout(function(){
			Highcharts.chart('container', {
				  title: {
					text: 'Sales'
				  },
				  chart: {
					type: "bar",
					backgroundColor: chartBackgroundColor
					
					},

				  xAxis: {
					categories: ['Sep', 'Oct', 'Nov', 'Dec']
				  },

				  series: [{
					data: [8750.0, 11650.0, 6970.0, 21755.0]
				  }]
			});
		}, 1000);
		
		
}])