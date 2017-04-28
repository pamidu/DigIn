DiginApp.controller('addWidgetDashboardCtrl', ['$scope', '$rootScope', '$mdDialog','DiginServices','datasourceServices','$diginengine','$state','notifications', function($scope,$rootScope, $mdDialog,DiginServices,datasourceServices,$diginengine,$state,notifications) {


	$scope.selectedDB = "";
	$scope.selectedConnection = "";
	$scope.selectedFileOrFolder = "";
	$scope.selectedTable = "";
	

	$scope.loadingTables = false;
	$scope.loadingConnections = false;
	$scope.loadingConnectionTable = false;
	$scope.showConnections = false;
	$scope.sourceType = [];
	$scope.showTableReloadBtn = false;
	
	$scope.files = [];
	$scope.folders = [];
	$scope.connections = [];
	$scope.tables = [];
	
	$scope.chartTypes = [];
	
	var dataBaseFiledTypes=[{type:"nvarchar",category:"att"},{type:"varchar",category:"att"},{type:"char",category:"att"},{type:"bit",category:"att"},{type:"STRING",category:"att"},{type:"DATETIME",category:"att"},{type:"DATE",category:"att"},{type:"TIMESTAMP",category:"att"},{type:"int",category:"mes"},{type:"decimal",category:"mes"},{type:"money",category:"mes"},{type:"INTEGER",category:"mes"},{type:"FLOAT",category:"mes"},{type:"smallint",category:"mes"},{type:"bigint",category:"mes"},{type:"numeric",category:"mes"},{type:"real",category:"mes"},{type:"double precision",category:"mes"},{type:"smallserial",category:"mes"},{type:"serial",category:"mes"},{type:"bigserial",category:"mes"},{type:"character varying",category:"att"},{type:"character",category:"att"},{type:"VARCHAR2",category:"att"},{type:"NVARCHAR2",category:"att"},{type:"NUMBER",category:"mes"},{type:"LONG",category:"mes"}];

	DiginServices.getDBConfigs().then(function(data) {
		angular.forEach(data,function(src,index)
		{
			if (src.name != 'DuoStore' && src.name != 'postgresql' && src.name != 'CSV Upload')
			{
				$scope.sourceType.push(src);
			}
		})
	});
	
	$scope.selectSource = function(ev,type, retriveAgain)
	{
		if($scope.selectedDB != type || retriveAgain)
		{
			
			//reset arrays
			$scope.files = [];
			$scope.folders = [];
			$scope.tables = "";
			$scope.connections = [];
			$scope.selectedTable = "";
			$scope.selectedConnection = "";
			$scope.selectedFileOrFolder = "";
			
			if(type == "BigQuery" || type == "memsql")
			{	
				$scope.showConnections = false;
				$scope.loadingTables = true;
				$scope.showTableReloadBtn = true;
				
				$scope.selectedDB = type;
			
				$diginengine.getClient(type).getTables(function(res, status) {
					
					if(status) {
						
						$scope.loadingTables = false;

						if(res.length != 0)
						{
							for(var i = 0; i < res.length; i++){
								if(res[i].upload_type == "csv-singlefile"){
								  $scope.files.push(res[i]);
								}else{
								  $scope.folders.push(res[i]);
								}
							}
						}else{
							notifications.toast(2, "No Tables");
						}
					} else {
						$scope.loadingTables = false;
						notifications.toast('0', 'Error occured. Please try again.');
					}
				});
			}else if(type == "MSSQL" || type == "Oracle"){
				$scope.showConnections = true;
				$scope.loadingConnections = true;
				$scope.showTableReloadBtn = false;
				
				$scope.selectedDB = type;
				
				datasourceServices.getAllConnections($rootScope.authObject.SecurityToken,type).then(function(res){
					//$scope.connectSource_selected = 1;
					if(res.Is_Success){
						$scope.loadingConnections = false;
						if(res.Result.length != 0)
						{
							for(var i = 0; i < res.Result.length; i++){
							
								$scope.connections.push(res.Result[i]);

							}
							console.log($scope.connections);
						}else{
							notifications.toast(2, "No Tables");
						}
					}else{
						$scope.loadingConnections = false;
						notifications.toast('0', 'Error occured. Please try again.');
					}
					
				});
			}
		}else{
			notifications.toast(2, "Already Selected");
		}
	}
	
	$scope.getTables = function(ev,connection, retriveAgain){
		$scope.tables = [];
		$scope.selectedTable = "";
		$scope.selectedFileOrFolder = "";
		$scope.showTableReloadBtn = true;
		$scope.selectedConnection = connection;
		console.log(connection);
		$scope.loadingTables = true;
		$diginengine.getClient($scope.selectedDB).getConnectionTables(connection.ds_config_id,$scope.selectedDB,function(res){
			$scope.loadingTables = false;
			for(var i = 0; i < res.length; i++){
				
				$scope.tables.push(res[i]);
			}
			
			
		});

	};
	
	$scope.attributes = [];
	$scope.measures = [];
	
	$scope.selectTable = function(ev,fileOrFolder)
	{
		$scope.selectedFileOrFolder = fileOrFolder;
		$scope.attributes = [];
		$scope.measures = [];
		console.log($scope.selectedFileOrFolder);
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
	
	
	$scope.updateTables = function(ev, selectedDb, connection, retriveAgain)
	{
		if(connection)
		{
			$scope.getTables(ev,connection,retriveAgain );
		}else{
			$scope.selectSource(ev, selectedDb, retriveAgain)
		}
	}
	
	$scope.getConnectionTable = function(ev,table)
	{
		$scope.loadingConnectionTable = true;
		$scope.selectedFileOrFolder = "";
		$scope.selectedTable = "";
		$scope.attributes = [];
		$scope.measures = [];
		
		//get all fields
		$diginengine.getClient($scope.selectedDB).getMSSQLFields(table, $scope.selectedConnection.ds_config_id ,function(data, status) {
			if(status){
				$scope.loadingConnectionTable = false;
				$scope.selectedTable = table;
				for(var i=0; i < data.length; i++){
					for(var j=0; j < dataBaseFiledTypes.length; j++){
						if((data[i].FieldType).toUpperCase() == (dataBaseFiledTypes[j].type).toUpperCase()){
							var obj = {
								"name": data[i].Fieldname,
								"type": data[i].FieldType
							}
							$scope.attributes.push(obj);

							if(dataBaseFiledTypes[j].category == "mes"){
								$scope.measures.push(obj);
							}
						}
					}
				}
				
				console.log($scope.measures);
				console.log($scope.attributes);

				$scope.selectedFileOrFolder = {
					"datasource_id" : $scope.selectedConnection.ds_config_id,
					"src": $scope.selectedDB,
					"datasource_name": table

				}

			}else{
				$scope.loadingConnectionTable = false;
			}

		});
		
	}
	
	$scope.selectChartType = function(chartIndex)
	{
			var widgetData = {
			'chartType' : null,
			'selectedFileOrFolder' : null,
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
		console.log($scope.selectedFileOrFolder);
		console.log($scope.dataconfig);
		$state.go('query_builder', 
		{ 
		  'allAttributes': $scope.attributes, 
		  'allMeasures':$scope.measures, 
		  'selectedFile':$scope.selectedFileOrFolder, 
		  'DesignTimeFilter': [],
		  'RuntimeFilter': [],
		  'selectedDB': $scope.selectedDB,
		  'selectedAttributes': [],
		  'selectedMeasures': [],
		  'widget':widget,
		  'chartType':chartIndex
		});
		
		$mdDialog.hide();
	}

	DiginServices.getChartTypes().then(function(data) {
		$scope.chartTypes = data;
	});

	
}]);// END OF 'addWidgetDashboardCtrl'