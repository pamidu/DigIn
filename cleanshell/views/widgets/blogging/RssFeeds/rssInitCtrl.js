DiginApp.controller('rssInitCtrl',['$scope', '$http', '$mdDialog', 'widgetID', '$rootScope','DiginServices','notifications',
    function ($scope, $http, $mdDialog, widgetID, $rootScope,DiginServices,notifications) {

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.finish = function(){
			console.log($scope.rssAddress);
			google.load("feeds", "1");
			
			var feed = new google.feeds.Feed($scope.rssAddress);
            feed.setNumEntries(100);

            feed.load(function(result) {
				console.log(result);
				if (!result.error) {

                    var ObjectIndex = DiginServices.getRootObjectById(widgetID,$rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets);
                    $rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets[ObjectIndex].widgetData.widData.feeds = result.feed.entries;
                    $scope.$apply();
                    $mdDialog.hide();   
                }
                else{
					notifications.toast(0, 'The specified feed URL is invalid');
                }
			})
        }
        //complete config  

    }
]);