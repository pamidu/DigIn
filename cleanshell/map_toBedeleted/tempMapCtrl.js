
 DiginApp.controller('tempMapCtrl', function($scope, DB) {

   $scope.mydata = DB.getContinentData();
   $scope.mapconfigured = {};
  });

DiginApp.directive('myMap', function(DB, $timeout) {

   return {
     restrict: 'E',
     template: '<div class="chart" style="width:{{width}} ; height:{{height}}"></div>',
     replace: true,

     scope: {
       mydata: '=',
       header: '=',
       mapconfigured: '=',
       width: '@',
       height:'@'
     },
     link: function(scope, elem, attrs) {
       var data = {
         core: Highcharts.geojson(Highcharts.maps['custom/world-continents']),
         mydata: scope.mydata
       };
       var small = $('#container').width();


        scope.$watch("width",function (newValue,OldValue) {
          if(newValue != OldValue){
            var map = $('.chart').highcharts();
						console.log(scope.width,scope.height);
			map.setSize(scope.width,scope.height)

          }
        });

        scope.$watch("height",function (newValue,OldValue) {
          if(newValue != OldValue){
             var map = $('.chart').highcharts();
         map.setSize(scope.width,scope.height)
          }
        });

       var mapConfig = {
         chart: {
           width: scope.width,
           height: scope.height,
           events: {

             drilldown: function(e) {
               // alert(e.point.name);
               if (!e.seriesOptions) {
                 //alert(e.point);
                 var chart = this,
                   pointWithLatLon = function(point, latLon) {
                     return Highcharts.merge(point, chart.transformFromLatLon(latLon,
                       Highcharts.maps['custom/world']['hc-transform']['default']));
                   };

                 var continent;
                 var contName;
                 switch (e.point.name) {
                   case "Asia":
                     chart.addSeriesAsDrilldown(e.point, {
                       mapData: Highcharts.maps['custom/asia'],
                       joinBy: 'hc-key',
                       click: function() {
                         alert('Hello');
                       },
                       data: [{
                         'hc-key': 'lk',
                          value: 32,
                          drilldown: true
                       },
                       {      
                         'hc-key': 'in',
                          value: 35,
                          drilldown: true
                       },
                       {      
                         'hc-key': 'ru',
                          value: 10,
                          drilldown: true
                       },
                       {      
                         'hc-key': 'id',
                          value: 23,
                          drilldown: true
                       }],
                       dataLabels: {
                         enabled: true,
                         formatter: function() {
                          if(typeof this.point.value == 'number')
                           return this.point.value + '%';
                         }
                       }

                     });
                     break;
                   case "Sri Lanka":
                     chart.addSeriesAsDrilldown(e.point, {
                       mapData: Highcharts.maps['countries/lk/lk-all'],
                       joinBy: 'hc-key',
                       name: e.point.name,
                       click: function() {
                         alert('Hello');
                       },
                       
                       data: [        
                        {
                            "hc-key": "lk-bc",
                            "value": .5
                        },
                        {
                            "hc-key": "lk-mb",
                            "value": 9
                        },
                        {
                            "hc-key": "lk-ja",
                            "value": 12
                        },
                        {
                            "hc-key": "lk-kl",
                            "value": 7
                        },
                        {
                            "hc-key": "lk-ky",
                            "value": 9
                        },
                        {
                            "hc-key": "lk-mt",
                            "value": 8
                        },
                        {
                            "hc-key": "lk-nw",
                            "value": 4
                        },
                        {
                            "hc-key": "lk-ap",
                            "value": 9
                        },
                        {
                            "hc-key": "lk-pr",
                            "value": 8
                        },
                        {
                            "hc-key": "lk-tc",
                            "value": 5
                        },
                        {
                            "hc-key": "lk-ad",
                            "value": 10
                        },
                        {
                            "hc-key": "lk-va",
                            "value": 11
                        },
                        {
                            "hc-key": "lk-mp",
                            "value": 20
                        },
                        {
                            "hc-key": "lk-kg",
                            "value": 13
                        },
                        {
                            "hc-key": "lk-px",
                            "value": 14
                        },
                        {
                            "hc-key": "lk-rn",
                            "value": 10
                        },
                        {
                            "hc-key": "lk-gl",
                            "value": 17
                        },
                        {
                            "hc-key": "lk-hb",
                            "value": 19
                        },
                        {
                            "hc-key": "lk-mh",
                            "value": 5
                        },
                        {
                            "hc-key": "lk-bd",
                            "value": 19
                        },
                        {
                            "hc-key": "lk-mj",
                            "value": 2
                        },
                        {
                            "hc-key": "lk-ke",
                            "value": 8
                        },
                        {
                            "hc-key": "lk-co",
                            "value": 6
                        },
                        {
                            "hc-key": "lk-gq",
                            "value": 7
                        },
                        {
                            "hc-key": "lk-kt",
                            "value": 16
                        }

                       ],
                       dataLabels: {
                         enabled: true,
                         formatter: function() {
                          if(typeof this.point.value == 'number')
                           return this.point.value + 'K';
                         }
                       }

                     });
                     break;
                 }
               }
             }
           }
         },

         title: {
           text:'',
           style: {
             color: '#bf360c'
           }
         },
          credits: {
            enabled: false
          },
         colorAxis: {
           min: 0,
           minColor: '#fbe9e7',
           maxColor: 'rgb(2, 181, 226)'
         },

         mapNavigation: {
           enabled: false,
           buttonOptions: {
             verticalAlign: 'bottom'
           }
         },

         // plotOptions: {
         //   series: {
         //     point: {
         //       events: {
         //         click: function() {
         //           if (this.name) {

         //           }
         //         }
         //       }
         //     }
         //   }
         // },

         series: [{
           name: 'World',
           data: DB.getContinentData(),
           mapData: Highcharts.maps['custom/world-continents'],
           joinBy: 'hc-key',
           dataLabels: {
             enabled: true,
             format: '{point.name}' + '<br />' //+ ' {point.value} %'  
           }
         }]
       };

       // Instanciate the map
       $(elem).highcharts('Map', mapConfig);
       $timeout(function() {
         scope.mapconfigured = mapConfig;
         DB.setMapConfig(mapConfig);
       });
     }
   };
 });

 DiginApp.factory('DB', function($http) {
   var mapConfig = {};
   var continentData = [{
       'hc-key': 'eu',
      // drilldown: true,
       value: 20 
     },
     {
       'hc-key': 'as',
       drilldown: true,
       value: 50
     },
     {
       'hc-key': 'sa',
      // drilldown: true,
       value: 5
     },
     {
       'hc-key': 'na',
      // drilldown: true,
       value: 18
     },
     {
       'hc-key': 'oc',
      // drilldown: true,
       value: 7
     },
     {
      'hc-key': 'af',
      value: 1
     }

   ];
   


   setMapConfig = function(val) {
     mapConfig = val; //And changed here
     return mapConfig;
   };



   return {
     getStatesData: function(county) {
       return statesData
     },
     getCountyData: function(state) {
       return countiesData[state]
     },
     getContinentData: function() {
       return continentData
     },
     getCountryData: function(continent) {
       return countryData[continent]
     },
     setMapConfig: setMapConfig,
     getConfig: function() {
       return mapConfig
     }
   }
 });