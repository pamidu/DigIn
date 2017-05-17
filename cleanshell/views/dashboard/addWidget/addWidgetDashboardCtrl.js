DiginApp.controller('addWidgetDashboardCtrl', ['$scope', '$rootScope', '$mdDialog','DiginServices','datasourceServices','$state','notifications','lastPath', function($scope,$rootScope, $mdDialog,DiginServices,datasourceServices,$state,notifications,lastPath) {

	$scope.lastPath = lastPath;
	console.log($scope.lastPath);
	$scope.sourceType = [];
	
	//reset arrays
	$scope.files = [];
	$scope.folders = [];
	$scope.tables = [];
	$scope.connections = [];
	
	$scope.showConnections = false;
	
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
		$scope.tables = [];
		$scope.connections = [];
		
		$scope.loadingTables = true;
		$scope.loadingConnections = true;
		$scope.showTableReloadBtn = false;
		$scope.showConnections = false;
		$scope.showCharts = false;
		
		//$scope.lastPath.connectionTable = undefined;
		
		if(type == "BigQuery" || type == "memsql")
		{
			$scope.lastPath.connection = undefined;
			
			datasourceServices.getTables($scope.lastPath.dataSource, type, retriveAgain, function(data) {
				$scope.lastPath.dataSource = type;
				$scope.loadingTables = false;
				$scope.loadingConnections = false;
				$scope.showTableReloadBtn = true;
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
			$scope.loadingTables = false;
			
			datasourceServices.getAllConnectionsCb($scope.lastPath.dataSource, type, retriveAgain, function(data) {
				$scope.lastPath.dataSource = type;
				$scope.lastPath.table = undefined;

				$scope.loadingConnections = false;
				
				console.log(data);
				
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
	$scope.multiSearch = "";
	$scope.currentArrayName = "";
	
	$scope.search = function(ev, searchProperty, searchType)
	{
		if(searchProperty == 'table')
		{
	
			if($scope.lastPath.dataSource == "BigQuery" || $scope.lastPath.dataSource == "memsql")
			{
				searchProperty = 'datasource_name';
			}else if($scope.lastPath.dataSource == "MSSQL" || $scope.lastPath.dataSource == "Oracle"){
				searchProperty = 'table'
			}
		}
		
		$scope.searchField = searchProperty;
		$scope.currentArrayName = searchType;
		alert("search "+$scope.searchField)
		angular.element('#searchFields').trigger('focus');
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
	
	$scope.getTables = function(ev,connection, retriveAgain){

		$scope.tables = [];
		//$scope.selectedTable = "";
		//$scope.selectedFileOrFolder = "";
		$scope.showTableReloadBtn = true;
		$scope.showCharts = false;

		$scope.loadingTables = true;
		
		var lastConfigID = "";
		if($scope.lastPath.connection)
		{
			lastConfigID = $scope.lastPath.connection.ds_config_id;
		}
		
		datasourceServices.getConnectionTables($scope.lastPath.dataSource, connection.ds_config_id, lastConfigID , retriveAgain, function(data){
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
	$scope.selectedFileOrFolder = {};
	$scope.showCharts = false;
	
	$scope.selectTable = function(ev,fileOrFolder)
	{
		$scope.showCharts = true;
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
	
	$scope.getConnectionTable = function(ev,table)
	{
		console.log("getConnectionTable");

		$scope.showCharts = false;
		$scope.loadingConnectionTable = true;
		$scope.attributes = [];
		$scope.measures = [];
		
		var lastTable = "";
		if($scope.lastPath.connectionTable)
		{
			lastTable = $scope.lastPath.connectionTable;
		}
		
		datasourceServices.getConnectionTable($scope.lastPath.dataSource, table, lastTable,$scope.lastPath.connection.ds_config_id, function(data){
			
			var res = data.Result;
			console.log(data);
			
			if(data.Is_Success){
				$scope.showCharts = true;
				$scope.loadingConnectionTable = false;
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
	
	}
	
	
	
	//AUTO POPULATE
	if($scope.lastPath.dataSource){
		$scope.selectSource(null,$scope.lastPath.dataSource, false);
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
	
	if($scope.lastPath.connectionTable && $scope.lastPath.connection){
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


DiginApp.filter('ordinal', function() {

  return function(items, searchProperty, searchKeyword, currentArrayName, filterArrayName) {
	  console.log(items, searchProperty, searchKeyword, currentArrayName, filterArrayName);
	  if(!searchKeyword)
		  return items
	  
	  if(currentArrayName != filterArrayName)
		  return items;
	  
	  var filteredItems = items.filter(function(item){
		  if(typeof(item) == 'object')
			  return item[searchProperty].indexOf(searchKeyword) != -1
		  else
			return item.indexOf(searchKeyword) != -1
	  }); 
	  
	  return filteredItems;
  }
  
})