   routerApp.directive('myMap', function($timeout) {

       return {
           restrict: 'EA',
           template: '<div class="chart"  ng-controller="queryBuilderCtrl"></div>',
           scope: {
               config: '=config'

           },
           link: function(scope, elem, attrs) {
               var small = $('#container').width() < 600;
               scope.$watch('config', function(newValue, oldValue, scope) {

                   newValue.mapdata[0].data.forEach(function(e) {
                                   e["hc-key"] = e.name;
                                   e.value = e.y;
                                   delete e.name;
                                   delete e.y;
                               });
                   if (newValue.mapType == 'World') {
                       {
                           if (newValue.drilled) {
                               mapDataNew = Highcharts.maps['custom/world-continents'];

                               scope.drawMap(newValue);

                           } else {
                               mapDataNew = Highcharts.maps['custom/world'];
                               scope.drawMap(newValue);
                           }
                       }

                   }
                   if (newValue.mapType == 'Country') {

                       if (newValue.selectedCountry == 'lk') {
                           mapDataNew = Highcharts.maps['countries/lk/lk-all'];
                           scope.drawMap(newValue);
                       }
                       if (newValue.selectedCountry == 'us') {
                           mapDataNew = Highcharts.maps['countries/us/us-all'];

                           scope.drawMap(newValue);
                       }

                   }

               });

               scope.drawMap = function(mydata) {
                   var mapConfig = {
                       chart: {
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
                                           case "Sri Lanka":
                                               chart.addSeriesAsDrilldown(e.point, {
                                                   mapData: Highcharts.maps['countries/lk/lk-all'],
                                                   joinBy: 'hc-key',
                                                   click: function() {
                                                       alert('Hello');
                                                   }

                                                  

                                               });
                                               break;
                                           case "Asia":
                                               chart.addSeriesAsDrilldown(e.point, {
                                                   mapData: Highcharts.maps['custom/asia'],
                                                   joinBy: 'hc-key',
                                                   click: function() {
                                                       alert('Hello');
                                                   },
                                                   data: [{
                                                       'hc-key': 'lk',
                                                       value: 4,
                                                       drilldown: true
                                                   }] 
                                               });
                                               break;
                                           case "Sri Lanka":
                                               chart.addSeriesAsDrilldown(e.point, {
                                                   mapData: Highcharts.maps['countries/lk/lk-all'],
                                                   joinBy: 'hc-key',
                                                   click: function() {
                                                       alert('Hello');
                                                   },
                                                   data: [{
                                                           'hc-key': 'lk-kl',
                                                           drilldown: true,
                                                           value: 4
                                                       }, {
                                                           'hc-key': 'lk-ky',
                                                           drilldown: true,
                                                           value: 12
                                                       }, {
                                                           'hc-key': 'lk-mt',
                                                           value: 25
                                                       }

                                                   ] 

                                               });
                                               break;
                                           case "Europe":
                                               chart.addSeriesAsDrilldown(e.point, {
                                                   mapData: Highcharts.maps['custom/europe'],
                                                   joinBy: 'hc-key',
                                                   data: [{
                                                       'hc-key': 'dk',
                                                       value: 4
                                                   }, {
                                                       'hc-key': 'cz',
                                                       value: 17
                                                   }]
                                                   
                                               });
                                               break;

                                           case "North America":
                                               chart.addSeriesAsDrilldown(e.point, {
                                                   mapData: Highcharts.maps['custom/north-america'],
                                                   joinBy: 'hc-key',
                                                   data: [{
                                                       'hc-key': 'us',
                                                       value: 4
                                                   }] 

                                               });
                                               break;
                                       }




                                   }
                               }
                           }
                       },

                       title: {
                           text: '',
                           style: {
                               color: '#bf360c'
                           }
                       },
                       credits: {
                           enabled: false
                       },
                       colorAxis: {
                           min: 0,
                           minColor: mydata.minColor,
                           maxColor: mydata.maxColor
                       },

                    

                       series: [{
                           name: 'World',
                           data: mydata.mapdata[0].data,
                           mapData: mapDataNew,
                           joinBy: 'hc-key',
                           dataLabels: {
                               enabled: true,
                               format: '{point.name}' + '<br />' + ' {point.value}'
                           }
                       }]




                   };

                   // Instanciate the map
                   $(elem).highcharts('Map', mapConfig);

               }
           }
       };
   });

   routerApp.factory('DB', function($http) {
       var mapPlotData = [];
       var drilledConfig = {};
       var drilleddataConfig = [];
       var statesData = {
           'us': [{
               'code': 'us-ma',
               value: 20
           }, {
               'code': 'us-ny',
               value: 30
           }, {
               'code': 'us-tx',
               value: 13
           }]
       };
       var mapConfig = {};


       var countiesData = {
           'us-ny': [{
               'code': 'us-ny-063',
               value: 20
           }, {
               'code': 'us-ny-1192929391923',
               value: 20
           }],
           'us-ma': [{
               'code': 'us-ma-001',
               value: 20
           }, ]
       };


       setMapConfig = function(mapconfig) {
           mapConfig = mapconfig;
           return mapConfig;

       }

       setDrillDownSettingsConfig = function(drilleddata, data, mapconfig) {
           mapConfig = mapconfig;
           drilleddataConfig = drilleddata;
           mapPlotData = data[0].data;
           mapPlotData.forEach(function(e) {
               e["hc-key"] = e.name;
               e.value = e.y;
               delete e.name;
               delete e.y;
           });


           return mapPlotData;

       }



       return {
           getStatesData: function(county) {
               return statesData
           },
           getCountyData: function(state) {
               return countiesData[state]
           },
           getContinentData: function() {
               return mapPlotData
           },
           getContryData: function(continent) {
               return countiesData[state]
           },
           setMapConfig: setMapConfig,
           setDrillDownSettingsConfig: setDrillDownSettingsConfig,

           getConfig: function() {
               return mapConfig
           }
       }
   });
