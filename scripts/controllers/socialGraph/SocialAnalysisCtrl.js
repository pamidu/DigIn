routerApp.controller('socialAnalysisCtrl', function ($scope,$mdDialog,$location) {
    $scope.close = function () {
      
         $( "md-tabs.footer-bar > md-tabs-wrapper" ).children().show();
        $( "md-tabs.footer-bar > md-tabs-wrapper" ).css( "background-color","rgba(0, 0, 0, 0.14)" );
         $mdDialog.hide();
       
    } 
    
    
});