/*
----------------------Summary-------------------------------
| Controllers listed below are here                        |
------------------------------------------------------------
|      DashboardCtrl                                       |
|      ReportCtrl                                          |
|      analyticsCtrl                                       | 
|      d3PluginCtrl                                        |
|      ExtendedanalyticsCtrl                               | 
|      ExtendedReportCtrl                                  |
|      ExtendedDashboardCtrl                               |
|      summarizeCtrl                                       |
------------------------------------------------------------
*/

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
    //start dynamically creating the object array
    $scope.dataArray = [];
    $scope.dataObj = {};
    $scope.dataObj['a'] = "Category";
    var currChar = "a";
    for(i=0;i<$scope.series.length;i++){
        currChar = nextChar(currChar);
        $scope.dataObj[currChar] = $scope.series[i].name;
    }

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

};


routerApp.controller('ReportCtrl', ['$scope', '$mdSidenav','$sce', 'ReportService', 
'$timeout','$log','cssInjector', function($scope, $mdSidenav, $sce,ReportService, $timeout, 
$log,cssInjector) {
 var allMuppets = [];
  $scope.selected = null;
  $scope.muppets = allMuppets;
  $scope.selectMuppet = selectMuppet;
   
  loadMuppets();
  $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
  $scope.applyCSS = function() {
        cssInjector.add("/styles/css/style1.css");
  }
  //*******************
  // Internal Methods
  //*******************
  function loadMuppets() {
    ReportService.loadAll()
      .then(function(muppets){
        allMuppets = muppets;
        $scope.muppets = [].concat(muppets);
        $scope.selected = $scope.muppets[0];
      })
  }
 
  function toggleSidenav(name) {
    $mdSidenav(name).toggle();
  }

  
  function selectMuppet(muppet) {
    $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;
  
    $scope.toggleSidenav('left');
  }
}])

  routerApp.controller('analyticsCtrl', ['$scope','$sce', 'AnalyticsService', 
'$timeout','$log','$mdDialog',function($scope,$sce,AnalyticsService, $timeout,$log,mdDialog) {

    $scope.products=[];
      var allMuppets = [];
  $scope.selected = null;
  $scope.muppets = allMuppets;
  $scope.selectMuppet = selectMuppet;
   
  loadMuppets();
  $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
     function selectMuppet(muppet) {
    $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;
  
    $scope.toggleSidenav('left');
  }

   function loadMuppets() {
    AnalyticsService.loadAll()
      .then(function(muppets){
        allMuppets = muppets;
        $scope.muppets = [].concat(muppets);
        $scope.selected = $scope.muppets[0];
      })
  }
  
    
     

}])

  routerApp.controller('d3PluginCtrl', ['$scope','$sce', 'd3Service', 
'$timeout','$log',function($scope,$sce,d3Service, $timeout,$log) {

  $scope.products=[];
      var allMuppets = [];
  $scope.selected = null;
  $scope.muppets = allMuppets;
  $scope.selectMuppet = selectMuppet;
   
  loadMuppets();
  $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
     function selectMuppet(muppet) {
    $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;
  
    $scope.toggleSidenav('left');
  }

   function loadMuppets() {
    d3Service.loadAll()
      .then(function(muppets){
        allMuppets = muppets;
        $scope.muppets = [].concat(muppets);
        $scope.selected = $scope.muppets[0];
      })
  }
  
    
     

}])

 routerApp.controller('ExtendedanalyticsCtrl', ['$scope', '$mdSidenav','$sce', 'ExtendedAnalyticsService', 
'$timeout','$log','cssInjector', function($scope, $mdSidenav, $sce,ExtendedAnalyticsService, $timeout, 
$log,cssInjector) {
 var allMuppets = [];
  $scope.selected = null;
  $scope.muppets = allMuppets;
  $scope.selectMuppet = selectMuppet;
   
  loadMuppets();
  $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
  $scope.applyCSS = function() {
        cssInjector.add("/styles/css/style1.css");
        console.log("loaded css dynamically");
  }
  //*******************
  // Internal Methods
  //*******************
  function loadMuppets() {
    ExtendedAnalyticsService.loadAll()
      .then(function(muppets){
        allMuppets = muppets;
        $scope.muppets = [].concat(muppets);
        $scope.selected = $scope.muppets[0];
      })
  }
 
  function toggleSidenav(name) {
    $mdSidenav(name).toggle();
  }

  
  function selectMuppet(muppet) {
    $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;
  
    $scope.toggleSidenav('left');
  }
}])

 routerApp.controller('RealTimeController', ['$scope','$sce', 'RealTimeService', 
'$timeout','$log','$mdDialog',function($scope,$sce,RealTimeService, $timeout,$log,mdDialog) {

    $scope.products=[];
      var allMuppets = [];
  $scope.selected = null;
  $scope.muppets = allMuppets;
  $scope.selectMuppet = selectMuppet;
   
  loadMuppets();
  $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
     function selectMuppet(muppet) {
    $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;
  
    $scope.toggleSidenav('left');
  }

   function loadMuppets() {
    RealTimeService.loadAll()
      .then(function(muppets){
        allMuppets = muppets;
        $scope.muppets = [].concat(muppets);
        $scope.selected = $scope.muppets[0];
      })
  }
  
     
}])

  routerApp.controller('ExtendedanalyticsCtrl', ['$scope', '$timeout', '$rootScope','$mdDialog','$sce','$objectstore','Digin_Extended_Analytics',
                                       function($scope, $timeout, $rootScope, $mdDialog,$sce,$objectstore,Digin_Extended_Analytics) {

 $scope.AnalyticsReportURL = Digin_Extended_Analytics;
 
  $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
 

    }
    ]);
  routerApp.controller('ExtendedReportCtrl', ['$scope', '$timeout', '$rootScope','$mdDialog','$sce','$objectstore','Digin_Extended_Reports',
    function($scope, $timeout, $rootScope, $mdDialog,$sce,$objectstore,Digin_Extended_Reports) {
  
   $scope.AnalyticsReportURL = Digin_Extended_Reports;
 
  $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
 
 
  
  }
 ]);

    routerApp.controller('ExtendedDashboardCtrl', ['$scope', '$timeout', '$rootScope','$mdDialog','$sce','$objectstore','Digin_Extended_Dashboard',
    function($scope, $timeout, $rootScope, $mdDialog,$sce,$objectstore,Digin_Extended_Dashboard) {
  
   $scope.AnalyticsDashboardURL = Digin_Extended_Dashboard;
 
  $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
 
 
  
  }
 ]);

 routerApp.controller('summarizeCtrl', ['$scope','$http','$objectstore','$mdDialog','$rootScope','$q','$timeout',
 function ($scope,$http,$objectstore,$mdDialog,$rootScope,$q,$timeout)
 {
       $scope.indexes = [];
 
     var self = this;
     self.selectedItem  = null;
     self.searchText    = null;
     self.querySearch   = querySearch;
     self.simulateQuery = false;
     self.isDisabled    = false; 
   
     $scope.selectedFields = [];
     var parameter = "";
     $scope.products = [];
    
     
        $scope.getFields = function(index){
           $scope.selectedFields = [];
        var client = $objectstore.getClient("com.duosoftware.com",index.display);
       client.onGetMany(function(data){
      if (data){               
              $scope.selectedFields = data;
              var client = $objectstore.getClient("com.duosoftware.com",index.display);
              client.onGetMany(function(datae){
                if (datae){ 
                    $scope.products = [];
                   for (var i = 0; i <datae.length; i++) {
                         var data = datae[i],
                         product = {};
                         for (var j = 0; j < $scope.selectedFields.length; j++) {
                         var field = $scope.selectedFields[j];
                         product[field] = data[field];
                        }
                       $scope.products.push(product);
                  }
                  pivotUi() ;
                 }
               });
             client.getByFiltering("*");

         }
      });
     
     client.getFields("com.duosoftware.com",index.display);
      }  
       $scope.remove = function() {
            // Easily hides most recent dialog shown...
           // no specific instance reference is needed.
            $mdDialog.hide();
        };
  
        function pivotUi() {
        var renderers = $.extend($.pivotUtilities.renderers, $.pivotUtilities.gchart_renderers, $.pivotUtilities.d3_renderers);
            $("#tableoutput").pivotUI($scope.products, {
                 renderers: renderers,
                rows: [$scope.selectedFields[0]],
                cols:[$scope.selectedFields[1]],
              
                rendererName: "Table"         
            });
        }
        function querySearch (query) {
      var results = query ? $rootScope.indexes.filter( createFilterFor(query) ) : [],
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
}]);

routerApp.controller('settingsCtrl', ['$scope','$rootScope', '$http', '$state','$mdDialog','Digin_Base_URL',function($scope,$rootScope,$http,$state,$mdDialog,Digin_Base_URL) {
    var featureObj = localStorage.getItem("featureObject");
    getJSONData($http,'features',function(data){
      $scope.featureOrigin = data;
      var obj = JSON.parse(featureObj);      
      if(featureObj === null){ 
        $scope.features =data;
        $scope.selected = [];
      }
      else {
        $scope.selected = [];
        for(i=0;i<obj.length;i++){
          if(obj[i].stateStr === "Enabled")
            $scope.selected.push(obj[i]);
        }
        $scope.features = obj;
        
      }
    });

          $scope.toggle = function (item, list) {
    
            var idx = list.indexOf(item);
            if (idx > -1) {
          list.splice(idx, 1);
          item.state = false;
          item.stateStr = "Disabled";
        }
            else{
          list.push(item);
          item.state = true;
          item.stateStr = "Enabled";
        } 
          };

      $scope.test = function (item) {
       
        return false;
      };

      $scope.finish = function(){
        for(i=0;i<$scope.selected.length;i++){
          for(j=0;j<$scope.featureOrigin.length;j++){
            if($scope.featureOrigin[j].title == $scope.selected[i].title){
              $scope.featureOrigin[j].state = true;
              $scope.featureOrigin[j].stateStr = "Enabled";
            }
          }
        }

        getJSONData($http,'menu',function(data){

            var orignArray = [];
            for(i=0;i<$scope.featureOrigin.length;i++){
              if($scope.featureOrigin[i].state==true)
                orignArray.push($scope.featureOrigin[i]);
            }
            $scope.menu = orignArray.concat(data);
             
        });
        localStorage.setItem("featureObject", JSON.stringify($scope.featureOrigin));
        $mdDialog.show({
            controller: 'settingsCtrl',
      templateUrl: 'views/settings-save.html',
        resolve: {
          
        }
    })
        
      };

      $scope.saveSettingsDetails = function(){
        window.location = Digin_Base_URL + "home.html";
      };

      $scope.closeDialog = function(){
        $mdDialog.hide();
      };
    }
    ]);
   

