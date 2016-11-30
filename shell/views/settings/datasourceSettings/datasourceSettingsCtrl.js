routerApp.controller('datasourceSettingsCtrl',[ '$scope','$rootScope','$mdDialog','$http','$state','notifications','Digin_Engine_API','Digin_Domain', function ($scope,$rootScope,$mdDialog,$http,$state,notifications,Digin_Engine_API,Digin_Domain) {
	//Theme config for md-tabs-wrapper
	if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
	{
		$('md-tabs-wrapper').css('background-color',"rgb(48,48,48)", 'important');
	}else{
		$('md-tabs-wrapper').css('background-color',"white", 'important');
	}

	// Settings of md-steppers
	$scope.selectedStep = 0;
	$scope.status = false;
	$scope.testStatus = false;
	$scope.goToNextStep = function()
	{
		console.log("next");
		$scope.selected = 1;
	}
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
	// Get user details
	// $scope.submitUserDetails = function()
	// {
		
	// }
}]);