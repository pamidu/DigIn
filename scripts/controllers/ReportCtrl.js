routerApp.controller('ReportCtrl', ['$scope', '$mdSidenav','$sce', 'ReportService', 
'$timeout','$log','cssInjector', function($scope, $mdSidenav, $sce,ReportService, $timeout, 
$log,cssInjector) {
 var allMuppets = [];
  $scope.selected = null;
  $scope.muppets = allMuppets;
  $scope.selectMuppet = selectMuppet;
   
  loadMuppets();
  $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
  $scope.applyCSS = function() {
        cssInjector.add("/styles/css/style1.css");
        console.log("loaded css dynamically");
  }
  //*******************
  // Internal Methods
  //*******************
  function loadMuppets() {
    ReportService.loadAll()
      .then(function(muppets){
        allMuppets = muppets;
        $scope.muppets = [].concat(muppets);
        $scope.selected = $scope.muppets[0];
      })
  }
 
  function toggleSidenav(name) {
    $mdSidenav(name).toggle();
  }

  
  function selectMuppet(muppet) {
    $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;
  
    $scope.toggleSidenav('left');
  }
}])