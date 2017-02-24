////////////////////////////////
// File : DatasourceSettingsCtrl
// Owner  : Dilani Maheswaran
// Last changed date : 2017/01/09
// Version : 3.1.0.5
// Modified By : Dilani Maheswaran
////////////////////////////////

DiginApp.controller('datasourceSettingsCtrl',[ '$scope','$state','$rootScope','notifications','datasourceFactory','colorManager','$timeout', function ($scope,$state,$rootScope,notifications,datasourceFactory,colorManager,$timeout) {
	
	$scope.$parent.currentView = "Datasource Settings";

	// Settings of md-steppers
	$scope.selectedStep = 0;
	$scope.host = "";
	$scope.port = "";
	$scope.userName = "";
	$scope.password = "";
	$scope.databaseType = "";
	$scope.databaseName = "";
	$scope.authType = "";
	$scope.connName = "";
	$scope.action = "";
	$scope.connectionID = "";
	$scope.loginStatus = false;
	$scope.submitLogin = false;
	$scope.testStatus = false;
	$scope.testRequest = false;
	$scope.connectionStatus = false;
	$scope.connectionNotAvailable = false;
	$scope.saveRequest = false;
	$scope.existingConnections = [];
	$scope.stepData = [{
	    step: 0,
	    completed: false,
	    optional: false,
	    data: {},
	    busyText: "Proceeding to step 2"
	},
	{
	    step: 1,
	    completed: false,
	    optional: false,
	    data: {},
	    busyText: "Proceeding to step 3"
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
	}];

	var securityToken = JSON.parse(decodeURIComponent(getCookie('authData'))).SecurityToken;

	$scope.sources = [{
		type:"MSSQL",
		isSelected:false
	},{
		type:"ORACLE",
		isSelected:false
	},{
		type:"hiveql",
		isSelected:false
	}];

	$scope.onSelectDataBase;

	$scope.onSelectDataSource = function(source){
		for (i = 0; i < $scope.sources.length; i++) {
            $scope.sources[i].isSelected = false;
            if($scope.sources[i].type == source.type ){
            	$scope.sources[i].isSelected = true;
            	$scope.onSelectDataBase = source.type;
            	$scope.incrementStep();
            	$scope.getAllconnections();
            }
        }
	}

	$scope.submitCurrentStep = function(stepData)
	{
	    // stepData.completed = true;
	    // stepData.data.completed = true;
	    $scope.incrementStep();
	}
	$scope.incrementStep = function()
	{
	    $scope.selectedStep++;
	}
	$scope.decrementStep = function()
	{
		$scope.selectedStep--;
	}
	$scope.moveToPreviousStep = function()
	{
	    //call getAllConnections
	    $scope.existingConnections = [];
	    $scope.decrementStep();
	    $scope.getAllconnections();
	}
	// route to home
	$scope.goHome = function()
	{
		$state.go('home');
	}

	//get all connections
	$scope.getAllconnections = function()
	{
		$scope.connectionStatus = false;
		datasourceFactory.getAllConnections(securityToken,$scope.onSelectDataBase).then(function(data) {
			if(data.Is_Success)
			{
				$timeout(function() {
					colorManager.reinforceTheme();
				}, 100);
				console.log(data);
				$scope.connectionStatus = true;
				$scope.existingConnections = data.Result;
				notifications.toast('1',data.Custom_Message);
			}else{
				$scope.connectionStatus = true;
				notifications.toast('0',data.Custom_Message);
			}
		});
	}
	// Create new connection
	$scope.createConnection = function()
	{
		$scope.connectionID = "";
		$scope.action="Create";
		if($scope.selectedStep == 1)
		{
			$scope.incrementStep();
		} else if ($scope.selectedStep == 3)
		{
			$scope.decrementStep();
		}
		$scope.clearDetails();
	}
	// Edit a connection
	$scope.editConnection = function(connection)
	{
		$scope.connectionID = connection.ds_config_id;
		$scope.action="Edit";
		if($scope.selectedStep == 1)
		{
			$scope.incrementStep();
		}
		$scope.clearDetails();
		$scope.host = connection.host_name;
		$scope.port = connection.port;
		$scope.userName = connection.user_name;
		$scope.password = "";
		$scope.databaseType = "MSSQL";
		$scope.databaseName = connection.database_name;
		$scope.authType = 'sql';
		$scope.connName = connection.connection_name;
	}
	// clear all fields
	$scope.clearDetails = function()
	{
		$scope.host = "";
		$scope.port = "";
		$scope.userName = "";
		$scope.password = "";
		$scope.databaseType = "";
		$scope.databaseName = "";
		$scope.authType = "";
		$scope.connName = "";
		$scope.loginStatus = false;
		$scope.testStatus = false;
		$scope.testRequest = false;
		$scope.submitLogin = false;
		$scope.connectionStatus = true;
		$scope.saveRequest = false;
		$scope.connectionNotAvailable = false;
	}

	// Submit user details to get the database names
	$scope.submitUserDetails = function()
	{
		// validation
		if ($scope.host == '' || $scope.username == '' || ($scope.password == '' && $scope.onSelectDataBase !='hiveql') || ($scope.port == '' && $scope.onSelectDataBase !='hiveql'))
		{
			notifications.toast('0', 'Please fill in all required fields.');
			return;
		}
		var reqParam = {
			host: $scope.host, 
			username: $scope.userName,
			password: $scope.password,
			port: $scope.port
		}
		$scope.submitLogin = true;
		$scope.loginStatus = false;
		$scope.testStatus = false;
		$scope.testRequest = false;

		
		datasourceFactory.getAllDatabases(securityToken,reqParam,$scope.onSelectDataBase).then(function(data) {
			if(data.Is_Success)
			{
				if ($scope.action == "Create")
				{
					$scope.databaseType = "";
					$scope.databaseName = "";
					$scope.authType = "";
					$scope.connName = "";
				}
				
				$scope.loginStatus = true;
				$scope.submitLogin = false;
				$scope.dbNames = data.Result.sort();
				notifications.toast('1',data.Custom_Message);
			}else{
				$scope.connectionStatus = true;
				$scope.submitLogin = false;
				notifications.toast('0',data.Custom_Message);
			}
			
		});
		
	}

	//Test the connection with the selected database name
	$scope.testConnection = function()
	{
		var isExist = false;
		// Add validation
		if ($scope.databaseName == '' || $scope.connName == '' || $scope.databaseType == '' || $scope.host == '' || $scope.username == '' || $scope.password == '' || $scope.port == '')
		{
			notifications.toast('0', 'Please fill in all required fields.');
			return;
		}
		angular.forEach($scope.existingConnections,function(key){
			console.log(key);
			if (key.connection_name == $scope.connName && 
				key.database_name == $scope.databaseName && 
				key.host_name == $scope.host && 
				key.user_name == $scope.userName &&
				key.port == $scope.port)
			{
				notifications.toast('1','connection already exist');
				$scope.port = key.port;
				isExist = true;
			}
		})
		// return if the conenction already exists
		if (isExist) return;
		var reqParam = {
			host: $scope.host, 
			username: $scope.userName,
			password: $scope.password,
			port: $scope.port,
			databaseName: $scope.databaseName
		}
		$scope.testRequest = true;
		$scope.testStatus = false;
		
		datasourceFactory.testConnection(securityToken,reqParam,$scope.onSelectDataBase).then(function(data) {
			if(data.Is_Success)
			{
				$scope.testRequest = false;
				$scope.testStatus = true;
				notifications.toast('1',data.Custom_Message);
			} else 
			{
				$scope.testRequest = false;
				$scope.testStatus = true;
				notifications.toast('0',data.Custom_Message);
			}
		})
	}

	//Save the created connection
	$scope.saveConnection = function()
	{
		// Add validation
		if ($scope.databaseName == '' || $scope.connName == '' || $scope.databaseType == '' || $scope.host == '' || $scope.username == '' || $scope.password == '' || $scope.port == '')
		{
			notifications.toast('0', 'Please fill in all required fields.');
			return;
		}
		var reqParam = {
			host_name: $scope.host,
			user_name: $scope.userName,
			password: $scope.password,
			port: $scope.port,
			database_name: $scope.databaseName,
			connection_type: "MSSQL",
			connection_name: $scope.connName,
			ds_config_id: null,
			others: {}
		}
		if ($scope.action == "Create")
		{
			reqParam.ds_config_id = null;
		} else if ($scope.action == "Edit")
		{
			reqParam.ds_config_id = $scope.connectionID;
		}
		$scope.saveRequest = true;
		$scope.testStatus = false;
		
		datasourceFactory.saveConnection(securityToken,reqParam).then(function(res) {
			if(res.Is_Success)
			{
				console.log(res);
				// Call getAllConnections to get the connections after saving 
				datasourceFactory.getAllConnections(securityToken,$scope.onSelectDataBase).then(function(data){
					if(data.Is_Success)
					{	
						$scope.saveRequest = false;
						$scope.testStatus = true;
						$scope.incrementStep();
						notifications.toast('1',res.Custom_Message);
						$scope.existingConnections = data.Result;
					} else 
					{
						$scope.saveRequest = false;
						$scope.incrementStep();
						notifications.toast('1',res.Custom_Message);
					}
				})
			} else 
			{
				$scope.saveRequest = false;
				notifications.toast('0',res.Custom_Message);
			}
		})
	}

}]);