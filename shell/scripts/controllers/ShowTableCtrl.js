routerApp.controller('ShowTableCtrl', ['$scope','$rootScope','$mdDialog', function($scope,$rootScope,$mdDialog){
  $scope.toggleSearch = false;
  $rootScope.header  = [];
  $scope.header =  $rootScope.header;
  $scope.dataTobeShowed = $rootScope.DashboardData;
   $scope.closeDialog = function() {
      // Easily hides most recent dialog shown...
      // no specific instance reference is needed.
      
      $mdDialog.hide();

    };
    }
  ]);
