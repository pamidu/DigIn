routerApp.controller('homeCtrl',[ '$scope', '$rootScope','$mdDialog','colorManager', function ($scope,$rootScope,$mdDialog,colorManager){
  $scope.$parent.currentView = "Home";
  colorManager.changeTheme('default');
}])