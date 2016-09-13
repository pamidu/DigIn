DiginApp.controller('imInitCtrl',['$scope', '$http', '$rootScope', '$mdDialog','widgetID','DiginServices',function ($scope, $http, $rootScope, $mdDialog, widgetID, DiginServices) {
	console.log(widgetID);
    $scope.cancel = function() {
        $mdDialog.hide();
    };
    //complete config  
    $scope.finish = function() {
		
		console.log($rootScope.currentDashboard);
		
        var objIndex = DiginServices.getRootObjectById( widgetID, $rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets);
        
       // $rootScope.image = $scope.image;
       $rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets[objIndex].widgetData.widData = $scope.image;
        
        $mdDialog.hide();
    };
}]);