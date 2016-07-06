


routerApp.controller('DataCtrl', ['$scope', '$http','$objectstore','$mdDialog','$rootScope','DashboardService', 'dashboard',

function ($scope, $http,$objectstore,$mdDialog,$rootScope,DashboardService,dashboard) {
  $scope.saveDashboard = [];
  $scope.ExistingDashboardDetails =[];
  $scope.selectedDasbhoard = [];
      
     
       $scope.closeDialog = function() {    
      $mdDialog.hide();
    };
  
      var client = $objectstore.getClient("com.duosoftware.com","duodigin_dashboard");
       client.onGetMany(function(data){
      if (data){           
          $scope.ExistingDashboardDetails = data;
      }
      }); 
     client.getByFiltering("*");
    
     $scope.LoadSelected = function(dasbhoard){
      var client = $objectstore.getClient("com.duosoftware.com","duodigin_dashboard");
       client.onGetMany(function(data){
      if (data){
          $scope.selectedDasbhoard = data;
          dashboard = $scope.selectedDasbhoard[0];
           $scope.dashboard.widgets =      dashboard["1"].widgets;
          $scope.$apply();
      }
      }); 
     client.getByFiltering(dasbhoard.dashboardName);
      };


}]);