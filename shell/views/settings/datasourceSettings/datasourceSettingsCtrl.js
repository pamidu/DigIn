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
	$scope.loginStatus = false;
	$scope.testStatus = false;
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
	$scope.moveToPreviousStep = function()
	{
	    $scope.selectedStep--;
	}
	// route to home
	$scope.goHome = function()
	{
		$state.go('home.welcomeSearch');
	}

	//get all connections
	$scope.getAllconnections = function()
	{
		datasourceFactory.getAllConnections(securityToken).success(function(data){
			console.log(data);
			data.Is_Success = false;
			if(data.Is_Success)
			{
				notifications.toast('1',data.Custom_Message);
			} else 
			{
				notifications.toast('0',data.Custom_Message);
			}
		}).error(function(data){
			console.log(data);
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
			$scope.moveToPreviousStep();
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
		$scope.loginStatus = false;
		$scope.testStatus = false;		
	}

	$scope.submitUserDetails = function()
	{
		var reqParam = {
			host: $scope.host, 
			username: $scope.userName,
			password: $scope.password,
			port: $scope.port
		}
		datasourceFactory.getAllDatabases(securityToken,reqParam).success(function(data){
			if(data.Is_Success)
			{
				loginStatus = true;
				notifications.toast('1',data.Custom_Message);
			} else 
			{
				notifications.toast('0',data.Custom_Message);
			}
		}).error(function(data){
			console.log(data);
			notifications.toast('0','Request failed.Please try again.');
		});
	}
	// Get user details
	// $scope.submitUserDetails = function()
	// {
		
	// }
}]);