routerApp.controller('DatasourceSettingsCtrl',[ '$scope','$state','$rootScope','notifications','datasourceFactory', function ($scope,$state,$rootScope,notifications,datasourceFactory) {
	//Theme config for md-tabs-wrapper
	if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
	{
		$('md-tabs-wrapper').css('background-color',"rgb(48,48,48)", 'important');
	} else
	{
		$('md-tabs-wrapper').css('background-color',"white", 'important');
	}

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
	$scope.loginStatus = false;
	$scope.submitLogin = false;
	$scope.testStatus = false;
	$scope.testRequest = false;
	$scope.connectionStatus = false;
	$scope.connectionNotAvailable = false;
	$scope.saveRequest = false;
	$scope.existingConnections = [];
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
	}];

	var securityToken = JSON.parse(decodeURIComponent(getCookie('authData'))).SecurityToken;

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
		$state.go('home.welcomeSearch');
	}

	//get all connections
	$scope.getAllconnections = function()
	{
		$scope.connectionStatus = false;
		datasourceFactory.getAllConnections(securityToken).success(function(data){
			if(data.Is_Success)
			{	
				$scope.connectionStatus = true;
				$scope.existingConnections = data.Result;
				if($scope.existingConnections.length == 0)
				{
					$scope.connectionNotAvailable = true;
				}
				notifications.toast('1',data.Custom_Message);
			} else 
			{
				$scope.connectionStatus = true;
				notifications.toast('0',data.Custom_Message);
			}
		}).error(function(data){
			console.log(data);
			$scope.connectionStatus = true;
			notifications.toast('0','Request failed.Please try again.');
		});
	}
	// Create new connection
	$scope.createConnection = function()
	{
		if($scope.selectedStep == 0)
		{
			$scope.incrementStep();
		} else if ($scope.selectedStep == 2)
		{
			$scope.decrementStep();
		}
		$scope.clearDetails();
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
		if ($scope.host == '' || $scope.username == '' || $scope.password == '' || $scope.port == '')
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
		datasourceFactory.getAllDatabases(securityToken,reqParam).success(function(data){
			if(data.Is_Success)
			{
				$scope.databaseType = "";
				$scope.databaseName = "";
				$scope.authType = "";
				$scope.connName = "";
				$scope.loginStatus = true;
				$scope.submitLogin = false;
				$scope.dbNames = data.Result.sort();
				notifications.toast('1',data.Custom_Message);
			} else
			{
				$scope.submitLogin = false;
				notifications.toast('0',data.Custom_Message);
			}
		}).error(function(data){
			$scope.submitLogin = false;
			notifications.toast('0','Request failed.Please try again.');
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
			if (key.connection_name == $scope.connName && key.database_name == $scope.databaseName && key.host_name == $scope.host)
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
		datasourceFactory.testConnection(securityToken,reqParam).success(function(data){
			if(data.Is_Success)
			{
				$scope.testRequest = false;
				$scope.testStatus = true;
				notifications.toast('1',data.Custom_Message);
			} else 
			{
				$scope.testRequest = false;
				notifications.toast('0',data.Custom_Message);
			}
		}).error(function(data){
			$scope.testRequest = false;
			notifications.toast('0','Request failed.Please try again.');
		});
	}

	//Save the created connection
	$scope.saveConnection = function()
	{
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
		$scope.saveRequest = true;
		datasourceFactory.saveConnection(securityToken,reqParam).success(function(res){
			if(res.Is_Success)
			{
				// Call getAllConnections to get the connections after saving 
				datasourceFactory.getAllConnections(securityToken).success(function(data){
					if(data.Is_Success)
					{	
						$scope.saveRequest = false;
						$scope.incrementStep();
						notifications.toast('1',res.Custom_Message);
						$scope.existingConnections = data.Result;
					} else 
					{
						$scope.saveRequest = false;
						$scope.incrementStep();
						notifications.toast('1',res.Custom_Message);
					}
				}).error(function(data){
					$scope.saveRequest = false;
					$scope.incrementStep();
					notifications.toast('1',res.Custom_Message);
				});
			} else 
			{
				$scope.saveRequest = false;
				notifications.toast('0',res.Custom_Message);
			}
		}).error(function(data){
			notifications.toast('0','Request failed.Please try again.');
		});
	}

}]);