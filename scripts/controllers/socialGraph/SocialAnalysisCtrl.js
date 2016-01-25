routerApp.controller('socialAnalysisCtrl', function ($scope,$mdDialog,$location,$http) {

	getJSONData($http,'widgets',function(data){
     $scope.Widgets=data;
    });

	$scope.selected = "Social Media";

    $scope.close = function () {
      
         $( "md-tabs.footer-bar > md-tabs-wrapper" ).children().show();
        $( "md-tabs.footer-bar > md-tabs-wrapper" ).css( "background-color","rgba(0, 0, 0, 0.14)" );
         $mdDialog.hide();
       
    } 
    
    
});