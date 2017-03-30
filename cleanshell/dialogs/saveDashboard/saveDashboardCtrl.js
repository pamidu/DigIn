DiginApp.controller('saveDashboardCtrl',[ '$scope','$rootScope','$mdDialog' ,
	function ($scope,$rootScope,$mdDialog){
 
		 $scope.content = {};

		 $scope.content.dashboardName = angular.copy($rootScope.currentDashboard.compName);
		 $scope.content.refreshInterval = 300;

		 
		 $scope.saveDashboard = function()
		 {
		  	$mdDialog.hide($scope.content);
		 }
		 
}])