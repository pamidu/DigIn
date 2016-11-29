routerApp.controller('datasourceSettingsCtrl',[ '$scope','$rootScope','$mdDialog','$http','$state','notifications','Digin_Engine_API','Digin_Domain', function ($scope,$rootScope,$mdDialog,$http,$state,notifications,Digin_Engine_API,Digin_Domain) {

	// Settings of md-steppers in Database Connections section
	$scope.selectedStep = 0;
	$scope.status = false;
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
	    stepData.completed = true;
	    stepData.data.completed = true;
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


}]);