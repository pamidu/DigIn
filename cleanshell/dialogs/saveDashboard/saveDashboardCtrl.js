DiginApp.controller('saveDashboardCtrl',[ '$scope','$rootScope','$mdDialog', function ($scope,$rootScope,$mdDialog){
	
	$scope.content = {};
	
	(function (){

		//if dashboard is already saved one get its name and display
		if ($rootScope.currentDashboard.compID) { // dashboard is a saved one

			$scope.content.dashboardName = $rootScope.currentDashboard.compName;
			//$scope.content.dashboardType = $rootScope.currentDashboard.compType;
			$scope.content.refreshInterval = $rootScope.currentDashboard.refreshInterval.toString();
		}
	})();
	
	
	$scope.saveDashboard = function()
	{
		$mdDialog.hide($scope.content);
	}
/*


        //insert records into pouchdb
        //call the service here 

        $scope.saveDashboard = function() {

            // if(saveDashboardService.IsSavingINprogress == false){

                    if ($scope.dashboardName && $scope.refreshInterval) {

                        var noDuplicate = true;
                        //to check weather the newpage is allready exist
                        noDuplicate = saveDashboardService.checkDashboardName($scope.dashboardName);

                        if (noDuplicate) {
                            $scope.isLoadingDashBoardSave = true;
                            $scope.isButtonDashBoardSave = false;
                            //if dashboard name type refreshinterval should be assigned to proceed
                            ngToast.create({
                                className: 'info',
                                content: 'Saving dashboard...',
                                horizontalPosition: 'center',
                                verticalPosition: 'top',
                                dismissOnClick: true
                            });
                            //save dashboard
                            saveDashboardService.saveDashboard($scope.dashboardName, $scope.refreshInterval, 'dashboard', $scope);


                        } else { // one of the fields not filled
                            ngToast.create({
                                className: 'danger',
                                content: 'You can not duplicate the name..',
                                horizontalPosition: 'center',
                                verticalPosition: 'top',
                                dismissOnClick: true
                            });
                        }
                    } else {
                        ngToast.create({
                            className: 'danger',
                            content: 'Please fill all the fields and try again!',
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            dismissOnClick: true
                        });
                    }
        }
    */
	
}])