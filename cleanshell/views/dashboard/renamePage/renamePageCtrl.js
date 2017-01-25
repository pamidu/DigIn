DiginApp.controller('renamePageCtrl',[ '$scope','$mdDialog', function ($scope,$mdDialog){
	
	$scope.addPage = function()
	{
		$mdDialog.hide($scope.add);
	}
	
	$scope.cancel = function()
	{
		$mdDialog.cancel();
	}
}])