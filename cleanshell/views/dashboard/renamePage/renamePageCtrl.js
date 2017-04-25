DiginApp.controller('renamePageCtrl',[ '$scope','$mdDialog', 'pageName', function ($scope,$mdDialog,pageName){
	$scope.add = pageName;
	$scope.addPage = function()
	{
		$mdDialog.hide($scope.add);
	}
	
	$scope.cancel = function()
	{
		$mdDialog.cancel();
	}
}])