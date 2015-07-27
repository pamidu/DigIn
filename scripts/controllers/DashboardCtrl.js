routerApp.controller('DashboardCtrl', ['$scope',

    '$rootScope', '$mdDialog', '$objectstore', '$sce', 'AsTorPlotItems','$log', 'TTSConfig', 'TTSAudio', 'TTS_EVENTS',
    function($scope, $rootScope, $mdDialog, $objectstore, $sce, AsTorPlotItems,$log, TTSConfig, TTSAudio, TTS_EVENTS) {



        $('#pagePreLoader').hide();

        $scope.showData = function(widget) {
            $mdDialog.show({
                    controller: 'DashboardCtrl',
                    templateUrl: 'views/D3Plugin/DataPreview.html',


                }


            )

        }

        $scope.convertCSVtoJson = function(src) {
            AsTorPlotItems.then(function(data) {
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
        $scope.commentary = function(widget) {
            var comment = "";
             var chunks = [];
            widget.chartSeries.forEach(function(entry) {
           

                  comment += "Your sales for the year "+ entry.name + " is"+ " " + entry.data[0] + " " + "dollars";
                  comment +=" ";
            });
            for (var i = 0, charsLength = comment.length; i < charsLength; i += 130) {
                     chunks.push(comment.substring(i, i + 130));
            }
      
             comment =  comment.substring(0,130)
             TTSConfig.url = 'http://tts.peterjurkovic.com/tts-backend/index.php';
                var tts = new TTSAudio();

                tts.speak({
                    text:   comment,
                    lang: 'en'
                        // you can add additional params which will send to server
                });

                // triggered after speaking
                $scope.$on(TTS_EVENTS.SUCCESS, function() {
                    $log.info('Successfully done!')
                });

                // triggered in case error
                $scope.$on(TTS_EVENTS.ERROR, function() {
                    $log.info('An unexpected error has occurred');
                });

                // before loading and speaking
                $scope.$on(TTS_EVENTS.PENDING, function(text) {
                    $log.info('Speaking: ' + text);
                });

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
