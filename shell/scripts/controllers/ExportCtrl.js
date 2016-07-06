routerApp.controller('ExportCtrl', ['$scope','$objectstore','$mdDialog','$rootScope', function ($scope,

$objectstore,$mdDialog,$rootScope) {
	$scope.dashboard =[];
	 $scope.dashboard = {
   
       widgets: [

      ]
    

  };
 $scope.dashboard.widgets =$rootScope.dashboard["1"].widgets;

  $scope.closeDialog = function() {
            // Easily hides most recent dialog shown...
           // no specific instance reference is needed.
            $mdDialog.hide();
        };
 $scope.export = function(widget) {
          var chart = $('#'+widget.id).highcharts(); 
            chart.exportChart();
        };

}]);
 