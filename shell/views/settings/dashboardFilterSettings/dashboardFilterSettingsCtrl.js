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

	$scope.stepData = [{
	    step: 1,
	    completed: false,
	    optional: false,
	    data: {},
	    busyText: ""
	}, {
	    step: 2,
	    completed: false,
	    optional: false,
	    data: {},
	    busyText: ""
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
	$scope.selectedStep = $scope.stepData[0]-1;

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
	// move to the previous stepper
	$scope.decrementStep = function()
	{
		$scope.selectedStep--;
	}

}]);