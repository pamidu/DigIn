routerApp.controller('DashboardCtrl', ['$scope',

    '$rootScope', '$mdDialog', '$objectstore', '$sce','AsTorPlotItems',
    function($scope, $rootScope, $mdDialog, $objectstore, $sce,AsTorPlotItems) {



        $('#pagePreLoader').hide();

        

        $scope.showData = function(widget) {
            $mdDialog.show({
                controller: 'DashboardCtrl',
                templateUrl: 'views/D3Plugin/DataPreview.html',
            })
        }

        $scope.convertCSVtoJson = function(src) {
        AsTorPlotItems.then(function(data){
           $scope.items = data;
        });
        }
       $scope.showAdvanced = function(ev, widget) {
            $mdDialog.show({
                controller: 'chartSettingsCtrl',
                templateUrl: 'views/chart_settings.html',
                targetEvent: ev,
                resolve: {
                    widget: function() {
                        return widget;
                    }
                }
            })

        };
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }
        $scope.getIndexes = function() {
            var client = $objectstore.getClient("com.duosoftware.com");
            client.onGetMany(function(data) {
                data.forEach(function(entry) {

                    $rootScope.indexes.push({
                        value: entry,
                        display: entry
                    });

                });


            });
            client.getClasses("com.duosoftware.com");
        }


       $scope.closeDialog = function() {
            $mdDialog.hide();
        };
        $scope.clear = function() {
            $scope.dashboard.widgets = [];
        };

        $scope.remove = function(widget) {
            $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
        };


        $scope.alert = '';


        $scope.config = {}; // use defaults
        $scope.model = {};



        //   $scope.$watch('selectedDashboardId', function(newVal, oldVal) {
        //   if (newVal !== oldVal) {
        //     $scope.dashboard = $scope.dashboard[newVal];
        //   } else {
        //     $scope.dashboard = $scope.dashboard[1];
        //   }
        // });

        // init dashboard
        $scope.selectedDashboardId = '1';


    }
])
