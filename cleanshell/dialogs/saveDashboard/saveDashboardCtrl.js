DiginApp.controller('saveDashboardCtrl',[ '$scope','$rootScope','$mdDialog', 'DiginDashboardSavingServices' ,
	function ($scope,$rootScope,$mdDialog,DiginDashboardSavingServices){
 
		 $scope.content = {}; 
		 $scope.content.refreshInterval = 300;
		 

		 
		 $scope.saveDashboard = function()
		 {

		  	$mdDialog.hide($scope.content);

		  	DiginDashboardSavingServices.saveDashboard();

		 }
		 
}])