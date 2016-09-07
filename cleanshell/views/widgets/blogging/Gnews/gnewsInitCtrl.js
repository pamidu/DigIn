// google news search is no more continue, so as the best alternative option 
DiginApp.controller('gnewsInitCtrl',['$scope', '$http', '$mdDialog', 'widgetID', '$rootScope', 'DiginServices','notifications',function ($scope, $http, $mdDialog, widgetID, $rootScope,DiginServices,notifications) {

    $scope.cancel = function() {
        $mdDialog.cancel();
    };    
  
    $scope.finish = function() {

		$scope.entryArray = [];

		$http.get('https://bingapis.azure-api.net/api/v5/search/',{params: { q: $scope.gnewsrequest ,count:50 },headers: {'Ocp-Apim-Subscription-Key': '0c2e8372aeab41539540cc61edac0c3f'}})
		.success(function(data) {
				 if(!angular.isUndefined(data.webPages)){

						 for (var i = 0; i < data.webPages.value.length; i++) {

								var entry = data.webPages.value[i];
								entry.displayUrl = "http://"+entry.displayUrl;
								$scope.entryArray.push(entry);
								//$scope.$apply();
							}

							var ObjectIndex = DiginServices.getRootObjectById(widgetID,$rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets);
							$rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets[ObjectIndex].widgetData.widData.news = $scope.entryArray;

							$mdDialog.hide();
                }else{
					notifications.toast(0, 'Sorry, no results for the above search');
                }
            })
            .error(function(err) {
				notifications.toast(0, 'Sorry, no results for the above search');
            });   
    };
}]);