DiginApp.controller('createDashboardCtrl',[ '$scope','$mdDialog', function ($scope,$mdDialog){
	
	$scope.content = {dashboard: "", page: "Default"};
	$scope.addPage = function()
	{
		$mdDialog.hide($scope.content);
	}

}])