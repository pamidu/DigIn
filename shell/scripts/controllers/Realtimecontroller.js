 routerApp.controller('RealTimeController', ['$scope','$sce', 'RealTimeService', 
'$timeout','$log','$mdDialog',function($scope,$sce,RealTimeService, $timeout,$log,mdDialog) {

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
    RealTimeService.loadAll()
      .then(function(muppets){
        allMuppets = muppets;
        $scope.muppets = [].concat(muppets);
        $scope.selected = $scope.muppets[0];
      })
  }
  
     


}])