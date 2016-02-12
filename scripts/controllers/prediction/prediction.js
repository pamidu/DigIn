 

 routerApp.controller('predictionCtrl', ['$scope','$sce', 'AnalyticsService', 
'$timeout','$log','$mdDialog',function($scope,$sce,AnalyticsService, $timeout,$log,mdDialog) {
  $scope.trustSrc = function() {
       return $sce.trustAsResourceUrl("http://localhost:3000/");
    }
}]);