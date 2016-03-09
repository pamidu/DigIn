routerApp.controller('socialAnalysisCtrl', function ($scope,$mdDialog,$location,$http) {

	getJSONData($http,'widgets',function(data){
     $scope.Widgets=data;
    });

	$scope.selected = "Social Media";

    $scope.close = function () {
       
         $mdDialog.hide();       
    } 
    
    
});