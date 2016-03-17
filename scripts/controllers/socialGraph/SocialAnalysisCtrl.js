routerApp.controller('socialAnalysisCtrl', function ($scope,$mdDialog,$location,$http,$state) {

	getJSONData($http,'widgets',function(data){
     $scope.Widgets=data;
    });

	$scope.selected = "Social Media";

	$scope.navigateToSocialMedia = function(state){

		if(state != undefined){
			$state.go(state);
			$mdDialog.hide();
		}		
	}

    $scope.close = function () {
       
         $mdDialog.hide();       
    } 
    
    
});