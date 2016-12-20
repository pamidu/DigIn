routerApp.controller('homeCtrl',[ '$scope', '$rootScope','$mdDialog', function ($scope,$rootScope,$mdDialog){
  $scope.$parent.currentView = "Home";

  console.log("came home");
  

}])