////////////////////////////////
// File : dashboardFilterSettingsCtrl
// Owner  : Dilani Maheswaran
// Last changed date : 2017/02/09
// Version : 3.1.0.5
// Modified By : Dilani Maheswaran
////////////////////////////////

routerApp.controller('dashboardFilterSettingsCtrl',['$scope','$rootScope','$state',function($scope,$rootScope,$state){


	//Theme config for md-tabs-wrapper
	if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
	{
		$('md-tabs-wrapper').css('background-color',"rgb(48,48,48)", 'important');
	} else
	{
		$('md-tabs-wrapper').css('background-color',"white", 'important');
	}
	$scope.selectedFilterOption = "configure";
	$scope.selectedDatasource = "bigquery";
	$scope.stepData = [{
	    step: 0,
	    completed: false,
	    optional: false,
	    data: {},
	    busyText: ""
	}, {
	    step: 1,
	    completed: false,
	    optional: false,
	    data: {},
	    busyText: ""
	}, {
	    step: 2,
	    completed: false,
	    optional: false,
	    data: {}
	}, {
		step: 3,
		completed: false,
		optional: false,
		data: {}
	}, {
		step: 4,
		completed: false,
		optional: false,
		data: {}
	}, {
		step: 5,
		completed: false,
		optional: false,
		data: {}
	}];
	$scope.selectedStep = 0;

	// route to home
	$scope.goHome = function()
	{
		$state.go('home.welcomeSearch');
	}

	// move to the next stepper
	$scope.incrementStep = function()
	{
	    $scope.selectedStep++;
	}

	$scope.incrementTwoStep = function()
	{
		$scope.selectedStep += 2;
	}
	// move to the previous stepper
	$scope.decrementStep = function()
	{
		$scope.selectedStep--;
	}
	// next button at step one
	$scope.stepOne = function()
	{
		if ($scope.selectedFilterOption == "custom")
		{
			$scope.selectedStep += 4;
		} else
		{
			$scope.incrementStep();
		}
	}
	// go to level one 
	$scope.GoToStepOne = function()
	{
		$scope.selectedStep = 0;
	}

	$scope.selectDatasource = function(datasource)
	{
		$scope.selectedDatasource = datasource;	
	}

}]);