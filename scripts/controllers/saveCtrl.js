routerApp.controller('saveCtrl', ['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', 'ObjectStoreService', 'DashboardService',

function ($scope, $http, $objectstore, $mdDialog, $rootScope, ObjectStoreService, DashboardService) {
        alert('test');
        $scope.closeDialog = function () {
            // Easily hides most recent dialog shown...
            // no specific instance reference is needed.
            $mdDialog.hide();
        };

        $scope.dashboardName = "";
        $scope.dashboardType = $rootScope.dashboard.dashboardType;
        $scope.dashboardCulture = $rootScope.dashboard.dashboardCulture;
        $scope.dashboardDate = $rootScope.dashboard.dashboardDate;

        $scope.saveDashboardDetails = function (type) {
            console.log("Dashboard saving...");
            $rootScope.dashboard.dashboardName = $scope.dashboardName;


            var dashboardObj = {
                name: $scope.dashboardName,
                type: $scope.dashboardType,
                culture: $scope.dashboardCulture,
                date: $scope.dashboardDate,
                customDuoDash: true, //will be useful when filtering these dashboards with pentaho dashboards
                data: $rootScope.dashboard.widgets,
                storyboard: false;
            };

            if (type == "saveAll") {
                console.log("saving the whole story board");
                dashboardObj.data = $rootScope.Dashboards;
                dashboardObj.storyboard = true;
            };
            console.log(dashboardObj);
            var client = ObjectStoreService.initialize("duodigin_dashboard");
            console.log(JSON.stringify(dashboardObj));
            ObjectStoreService.saveObject(client, dashboardObj, "name", function (data) {
                if (data.state === 'error') {
                    $mdDialog.hide();
                    $mdDialog.show({
                        controller: 'errorCtrl',
                        templateUrl: 'views/dialog_error.html',
                        resolve: {

                        }
                    })
                } else {
                    DashboardService.getDashboards(dashboardObj);
                    $mdDialog.hide();
                    $mdDialog.show({
                        controller: 'successCtrl',
                        templateUrl: 'views/dialog_success.html',
                        resolve: {

                        }
                    })
                }
            });

            //localStorage.setItem('dasboardsObject', JSON.stringify(dashboardsObj));

            //   $mdDialog.show({
            //         controller: 'successCtrl',
            //   templateUrl: 'views/dialog_success.html',
            //     resolve: {

            //     }
            // })

            //   var client = $objectstore.getClient("com.duosoftware.com","duodigin_dashboard");
            //   client.onComplete(function(data){
            //        $mdDialog.hide();
            //         $mdDialog.show({
            //         controller: 'successCtrl',
            //   templateUrl: 'views/dialog_success.html',
            //     resolve: {

            //     }
            // })
            //   });
            //   client.onError(function(data){
            //         $mdDialog.hide();
            //         $mdDialog.show({
            //         controller: 'errorCtrl',
            //   templateUrl: 'views/dialog_error.html',
            //     resolve: {

            //     }
            // })
            //   });


            //   client.insert([$rootScope.dashboard], {KeyProperty:"dashboardName"});


            //   }
        }


}]);
