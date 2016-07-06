routerApp.controller('socialAnalysisCtrl', function ($scope,$mdDialog,$location,$http,$state,ngToast) {

	getJSONData($http,'widgets',function(data){
     $scope.Widgets=data;
    });

	$scope.selected = "Social Media";

	$scope.navigateToSocialMedia = function(state){

		if(state != undefined){
			$state.go(state);
			$mdDialog.hide();
		}	
		else{
			ngToast.dismiss();
			ngToast.create({
                    className: 'danger',
                    content: 'This feature is under development !',
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    dismissOnClick: true
            });
		}
	}

    $scope.close = function () {
       
         $mdDialog.hide();       
    } 
    
    
});