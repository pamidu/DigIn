DiginApp.controller('addWidgetDashboardCtrl', ['$scope', '$rootScope', '$mdDialog','DiginServices','datasourceServices','$state','notifications','lastPath', function($scope,$rootScope, $mdDialog,DiginServices,datasourceServices,$state,notifications,lastPath) {


	$scope.selectedDB = "";
	$scope.selectedConnection = "";
	//$scope.selectedTable = "";
	

	$scope.loadingTables = false;
	$scope.loadingConnections = false;
	$scope.loadingConnectionTable = false;
	$scope.showConnections = false;
	$scope.sourceType = [];
	$scope.showTableReloadBtn = false;
	
	$scope.lastPath = lastPath;
	console.log($scope.lastPath);
	
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
			//reset arrays
			$scope.files = [];
			$scope.folders = [];
			$scope.tables = "";
			$scope.connections = [];
			//$scope.selectedTable = "";
			$scope.selectedConnection = "";
			$scope.lastPath.table = undefined;
			
			if(type == "BigQuery" || type == "memsql")
			{	
				$scope.showConnections = false;
				$scope.loadingTables = true;
				$scope.showTableReloadBtn = true;
				
				datasourceServices.getTables($scope.lastPath.dataSource, type, retriveAgain, function(data) {
					$scope.lastPath.dataSource = type;
					$scope.selectedDB = type;
					$scope.loadingTables = false;
					var res = data.Result;
					if(data.Is_Success)
					{
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
					}else{
						notifications.toast('0', 'Error occured. Please try again.');
					}
				})

			}else if(type == "MSSQL" || type == "Oracle"){
				
				$scope.showConnections = true;
				$scope.loadingConnections = true;
				$scope.showTableReloadBtn = false;
				
				datasourceServices.getAllConnectionsCb($scope.lastPath.dataSource, type, retriveAgain, function(data) {
					$scope.lastPath.dataSource = type;
					var res = data.Result;
					
					if(data.Is_Success){
						$scope.loadingConnections = false;
						if(res.length != 0)
						{
							for(var i = 0; i < res.length; i++){
							
								$scope.connections.push(res[i]);

							}
							console.log($scope.connections);
						}else{
							notifications.toast(2, "No Tables");
						}
					}else{
						$scope.loadingConnections = false;
						notifications.toast('0', 'Error occured. Please try again.');
					}
				})
			}
	}
	
	//(function (){

	//})();
	
	$scope.getTables = function(ev,connection, retriveAgain){

			$scope.tables = [];
			//$scope.selectedTable = "";
			//$scope.selectedFileOrFolder = "";
			$scope.showTableReloadBtn = true;
			$scope.selectedConnection = connection;

			$scope.loadingTables = true;
			
			datasourceServices.getConnectionTables($scope.lastPath.dataSource, connection.ds_config_id, retriveAgain, function(data){
				var res = data.Result;
				$scope.lastPath.connection = connection;
				console.log(connection);
				$scope.loadingTables = false;
				for(var i = 0; i < res.length; i++){
					
					$scope.tables.push(res[i]);
				}
			})
	};
	
	$scope.attributes = [];
	$scope.measures = [];
	
	$scope.selectTable = function(ev,fileOrFolder)
	{
		$scope.selectedFileOrFolder = fileOrFolder;
		$scope.lastPath.table =  fileOrFolder;
		$scope.attributes = [];
		$scope.measures = [];
		//console.log($scope.selectedFileOrFolder);
		for(var i = 1; i < fileOrFolder.schema.length; i++){
			if( fileOrFolder.schema[i].type == "INTEGER" ||  fileOrFolder.schema[i].type == "FLOAT" ){
				$scope.measures.push(fileOrFolder.schema[i]);	
			}
			
			if( fileOrFolder.schema[i].name != "_index_id" && fileOrFolder.schema[i].type != "integer" )
			{
				$scope.attributes.push(fileOrFolder.schema[i]);
			}
		}
		console.log($scope.lastPath);
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
		console.log("getConnectionTable");
		/*if($scope.selectedFileOrFolder.datasource_name != table)
		{*/
			$scope.loadingConnectionTable = true;
			//$scope.selectedFileOrFolder = "";
			//$scope.selectedTable = "";
			$scope.attributes = [];
			$scope.measures = [];
			
			datasourceServices.getConnectionTable($scope.lastPath.dataSource, table,$scope.lastPath.connection.ds_config_id, function(data){
				
				var res = data.Result;
				console.log(data);
				
				if(data.Is_Success){
					$scope.loadingConnectionTable = false;
					//$scope.selectedTable = table;
					$scope.lastPath.connectionTable = table;
					for(var i=0; i < res.length; i++){
						for(var j=0; j < dataBaseFiledTypes.length; j++){
							if((res[i].FieldType).toUpperCase() == (dataBaseFiledTypes[j].type).toUpperCase()){
								var obj = {
									"name": res[i].Fieldname,
									"type": res[i].FieldType
								}
								$scope.attributes.push(obj);

								if(dataBaseFiledTypes[j].category == "mes"){
									$scope.measures.push(obj);
								}
							}
						}
					}

					$scope.selectedFileOrFolder = {
						"datasource_id" : $scope.lastPath.connection.ds_config_id,
						"src": $scope.lastPath.dataSource,
						"datasource_name": table

					}

				}else{
					$scope.loadingConnectionTable = false;
				}
			});

		/*}else{
			notifications.toast(2, "Already Selected");
		}*/
		
	}
	
	
		if($scope.lastPath.dataSource){
			$scope.selectSource(null,$scope.lastPath.dataSource, false);
			console.log("retrive");
		}else{
			console.log("nothing to retrive");
		}
		
		if($scope.lastPath.table){
			$scope.selectTable(null,$scope.lastPath.table);
			console.log("retrive");
		}else{
			console.log("nothing to retrive");
		}
		
		if($scope.lastPath.connection){
			$scope.getTables(null,$scope.lastPath.connection, false);
			console.log("retrive");
		}else{
			console.log("nothing to retrive");
		}
		
		if($scope.lastPath.connectionTable){
			$scope.getConnectionTable(null,$scope.lastPath.connectionTable);
			console.log("retrive");
		}else{
			console.log("nothing to retrive");
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
		console.log($scope.lastPath.table);
		console.log($scope.lastPath.connectionTable);
		console.log($scope.selectedFileOrFolder);
		$state.go('query_builder', 
		{ 
		  'allAttributes': $scope.attributes, 
		  'allMeasures':$scope.measures, 
		  'selectedFile':$scope.selectedFileOrFolder, 
		  'DesignTimeFilter': [],
		  'RuntimeFilter': [],
		  'selectedDB': $scope.lastPath.dataSource,
		  'selectedAttributes': [],
		  'selectedMeasures': [],
		  'widget':widget,
		  'chartType':chartIndex
		});
		
		$mdDialog.hide($scope.lastPath);
	}

	DiginServices.getChartTypes().then(function(data) {
		$scope.chartTypes = data;
	});

	$scope.close = function()
	{
		$mdDialog.hide($scope.lastPath);
	}	
	
}]);// END OF 'addWidgetDashboardCtrl'