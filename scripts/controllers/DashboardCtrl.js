routerApp.controller('DashboardCtrl', ['$scope',

    '$rootScope', '$mdDialog', '$objectstore', '$sce', 'AsTorPlotItems','$log', 'TTSConfig', 'TTSAudio', 'TTS_EVENTS',
    function($scope, $rootScope, $mdDialog, $objectstore, $sce, AsTorPlotItems,$log, TTSConfig, TTSAudio, TTS_EVENTS) {



        $('#pagePreLoader').hide();
    $scope.test = function() {
        alert("test");
    };


        $scope.showData = function(widget,ev) {
                 $mdDialog.show({
      controller: eval(widget.dataCtrl),
      templateUrl: 'views/'+widget.dataView+'.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals: {wid : widget}
    })
    .then(function() {
      //$mdDialog.hide();
    }, function() {
      //$mdDialog.hide();
    });
   };

        $scope.convertCSVtoJson = function(src) {
            AsTorPlotItems.then(function(data) {
                $scope.items = data;
            });
        }
        $scope.showAdvanced = function(ev, widget) {
            // $mdDialog.show({
            //     controller: 'chartSettingsCtrl',
            //     templateUrl: 'views/chart_settings.html',
            //     targetEvent: ev,
            //     resolve: {
            //         widget: function() {
            //             return widget;
            //         }
            //     }
            // })


             $mdDialog.show({
      controller: eval(widget.initCtrl),
      templateUrl: 'views/'+widget.initTemplate+'.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals: {widId : widget.id}
    })
    .then(function() {
      //$mdDialog.hide();
    }, function() {
      //$mdDialog.hide();
    });



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
             TTSConfig.url = 'http://tts.peterjurkovic.com/tts-backend/index.php';
    var tts = new TTSAudio();
    tts.speak({
        text : 'Hello',
        lang : 'en'
    });

    // triggered after speaking
    $scope.$on(TTS_EVENTS.SUCCESS, function(){
        $log.info('Successfully done!')
    });

    $scope.$on(TTS_EVENTS.ERROR, function(){
        $log.info('An unexpected error has occurred');
    });

    // triggered before speaking
    $scope.$on(TTS_EVENTS.PENDING, function(text){
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
]);

function elasticDataCtrl($scope,$mdDialog,wid){

    $scope.closeDialog = function() {
            $mdDialog.hide();
        };

    $scope.series = wid.chartConfig.series;
    $scope.categories = wid.chartConfig.xAxis.categories;
    console.log('series:'+ JSON.stringify($scope.series));
    console.log('categories:'+ $scope.categories);
    $scope.mappedSeries = [];
    for(i=0;i<$scope.series.length;i++){
        var seriesObj = {name: $scope.series[i].name,
                         data : []}; 
        for(j=0;j<$scope.series[i].data.length;j++){
            var dataObj = {val : $scope.series[i].data[j],
                           cat : $scope.categories[j]};
            seriesObj.data.push(dataObj);
        }       
        $scope.mappedSeries.push(seriesObj);
    }
    
    //map data to eport to excel
    console.log('mapped:'+ JSON.stringify($scope.mappedSeries));
    //start dynamically creating the object array
    $scope.dataArray = [];
    $scope.dataObj = {};
    $scope.dataObj['a'] = "Category";
    var currChar = "a";
    for(i=0;i<$scope.series.length;i++){
        currChar = nextChar(currChar);
        $scope.dataObj[currChar] = $scope.series[i].name;
    }
    console.log(JSON.stringify($scope.dataObj));

    $scope.dataArray.push($scope.dataObj);

    for(i=0;i<$scope.categories.length;i++){
        $scope.dataObj = {};
        $scope.dataObj['a'] = $scope.categories[i];
        currChar = 'a';
        for(j=0;j<$scope.series.length;j++){
            currChar = nextChar(currChar);
            $scope.dataObj[currChar] = $scope.series[j].data[i];            
        }
        $scope.dataArray.push($scope.dataObj);        
    }

    $scope.fileName = wid.uniqueType;

    console.log(JSON.stringify($scope.dataArray));
};


