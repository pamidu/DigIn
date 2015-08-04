 routerApp.controller('analyticsCtrl', ['$scope','$sce', 'AnalyticsService', 
'$timeout','$log','$mdDialog',function($scope,$sce,AnalyticsService, $timeout,$log,mdDialog) {

 	$scope.products=[];
      var allMuppets = [];
  $scope.selected = null;
  $scope.muppets = allMuppets;
  $scope.selectMuppet = selectMuppet;
   
  loadMuppets();
  $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
     function selectMuppet(muppet) {
    $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;
  
    $scope.toggleSidenav('left');
  }

   function loadMuppets() {
    AnalyticsService.loadAll()
      .then(function(muppets){
        allMuppets = muppets;
        $scope.muppets = [].concat(muppets);
        $scope.selected = $scope.muppets[0];
      })
  }
  
    
     

}])

  routerApp.controller('d3PluginCtrl', ['$scope','$sce', 'd3Service', 
'$timeout','$log',function($scope,$sce,d3Service, $timeout,$log) {

  $scope.products=[];
      var allMuppets = [];
  $scope.selected = null;
  $scope.muppets = allMuppets;
  $scope.selectMuppet = selectMuppet;
   
  loadMuppets();
  $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
     function selectMuppet(muppet) {
    $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;
  
    $scope.toggleSidenav('left');
  }

   function loadMuppets() {
    d3Service.loadAll()
      .then(function(muppets){
        allMuppets = muppets;
        $scope.muppets = [].concat(muppets);
        $scope.selected = $scope.muppets[0];
      })
  }
  
    
     

}])

 routerApp.controller('ExtendedanalyticsCtrl', ['$scope', '$mdSidenav','$sce', 'ExtendedAnalyticsService', 
'$timeout','$log','cssInjector', function($scope, $mdSidenav, $sce,ExtendedAnalyticsService, $timeout, 
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
    ExtendedAnalyticsService.loadAll()
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