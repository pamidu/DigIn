routerApp.controller('ThemeCtrl', ['$scope','$rootScope','$objectstore','$mdDialog','cssInjector', function ($scope,$rootScope,
$objectstore,$mdDialog,cssInjector) {

  $scope.panels = ["Side Panel","Background"];

  $scope.closeDialog = function() {
            // Easily hides most recent dialog shown...
           // no specific instance reference is needed.
            $mdDialog.hide();
        };

  $scope.applyIndigoCSS = function() {
            cssInjector.removeAll();
            cssInjector.add("/Digin12/styles/css/style1.css");
            
  };
    
  $scope.applyMinimalCSS = function() {
            cssInjector.removeAll();
            cssInjector.add("/Digin12/styles/css/style3.css");
            
  };  
         
  $scope.applyVioletCSS = function() {
            cssInjector.removeAll();
            cssInjector.add("/Digin12/styles/css/style.css");
              
  };
   
}]);

