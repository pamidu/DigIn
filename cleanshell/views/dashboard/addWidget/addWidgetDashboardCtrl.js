DiginApp.controller('addWidgetDashboardCtrl', ['$scope', '$mdDialog','DiginServices','$diginengine','$state', function($scope, $mdDialog,DiginServices,$diginengine,$state) {

	$scope.sourceType = [];
	
	$scope.files = [];
	$scope.folders = [];
	$scope.conections = [];
	
	$scope.chartTypes = [];

	DiginServices.getDBConfigs().then(function(data) {
		angular.forEach(data,function(src,index)
		{
			if (src.name != 'DuoStore' && src.name != 'postgresql' && src.name != 'CSV Upload')
			{
				$scope.sourceType.push(src);
			}
		})
	});
	
	$scope.selectedDB = "";
	
	$scope.selectSource = function(ev,type)
	{
		//reset arrays
		$scope.files = [];
		$scope.folders = [];
		$scope.conections = [];
		
		if(type == "BigQuery" || type == "memsql")
		{
			$scope.selectedDB = type;
		
			$diginengine.getClient(type).getTables(function(res, status) {
				
				if(status) {
					$scope.showBusyText = false;
					
					for(var i = 0; i < res.length; i++){
						if(res[i].upload_type == "csv-singlefile"){
						  $scope.files.push(res[i]);
						}else{
						  $scope.folders.push(res[i]);
						}
					}
				} else {
					$scope.showBusyText = false;
					notifications.toast('0', 'Error occured. Please try again.');
				}
			});
		}else if(type == "MSSQL" || type == "Oracle"){
			datasourceServices.getAllConnections($rootScope.authObject.SecurityToken,type).then(function(res){
			
				$scope.showBusyText = false;
				$scope.connectSource_selected = 1;
				$scope.connectSource_step1.completed = true;
				notifications.finishLoading();

				if(res.Is_Success){
					for(var i = 0; i < res.Result.length; i++){
					
						$scope.conections.push(res.Result[i]);

					}
				}else{
					$scope.showBusyText = false;
					notifications.toast('0', 'Error occured. Please try again.');
				}
				
			});
		}
	}
	
	$scope.attributes = [];
	$scope.measures = [];
	$scope.selectedFile = {};
	
	$scope.selectTable = function(ev,fileOrFolder)
	{
		$scope.selectedFile = fileOrFolder;
		for(var i = 1; i < fileOrFolder.schema.length; i++){
			if( fileOrFolder.schema[i].type == "INTEGER" ||  fileOrFolder.schema[i].type == "FLOAT" ){
				$scope.measures.push(fileOrFolder.schema[i]);	
			}
			
			if( fileOrFolder.schema[i].name != "_index_id" && fileOrFolder.schema[i].type != "integer" )
			{
				$scope.attributes.push(fileOrFolder.schema[i]);
			}
		}

	}
	
	$scope.selectChartType = function()
	{
		loadChartDesinger($scope.selectedFile);
	}
	
	var loadChartDesinger = function(selectedFile){
		console.log(selectedFile);
			var widgetData = {
			'chartType' : null,
			'selectedFile' : null,
			'Measures' : null,
			'XAxis': null,
			'allMeasures' : null,
			'allXAxis' : null,
			'DesignTimeFilter': null,
			'RuntimeFilter' : null,
			'widgetConfig' : {},
			'settingConfig': {},
			'selectedDB' : null,
			'widgetID' :  null,
			'query' : null,
			'groupBySortArray':null		
		};

		var widget = {
			'widgetID' : null,
			'widgetName' : null,
			'widgetData' : widgetData,
			'col':null,
			'row':null,
			'sizeX':null,
			'sizeY':null
		};

		$state.go('query_builder', 
		{ 
		  'allAttributes': $scope.attributes, 
		  'allMeasures':$scope.measures, 
		  'selectedFile':selectedFile, 
		  'DesignTimeFilter': [],
		  'RuntimeFilter': [],
		  'selectedDB': $scope.selectedDB,
		  'selectedAttributes': [],
		  'selectedMeasures': [],
		  'widget':widget,
		  'chartType':{}
		});
		
		$mdDialog.hide();
	}

	DiginServices.getChartTypes().then(function(data) {
		$scope.chartTypes = data;
	});

	
}]);// END OF 'addWidgetDashboardCtrl'