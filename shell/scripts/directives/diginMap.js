 routerApp.directive('myMap', function(DB, $timeout) {

   return {
     restrict: 'E',
     template: '<div class="chart"></div>',
     replace: true,

     scope: {
       mydata: '=',
       header: '=',
       mapconfigured: '=',
     },
     link: function(scope, elem, attrs) {
       var data = {
         core: Highcharts.geojson(Highcharts.maps['custom/world-continents']),
         mydata: scope.mydata
       };
       var small = $('#container').width() < 400;

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
                       },

                       dataLabels: {
                         enabled: true,
                         formatter: function() {
                           return this.point.value + '%';
                         }
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
                       data: DB.getCountryData(),
                       dataLabels: {
                         enabled: true,
                         formatter: function() {
                           return this.point.value + '%';
                         }
                       }

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

                       ],
                       dataLabels: {
                         enabled: true,
                         formatter: function() {
                           return this.point.value + '%';
                         }
                       }

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
                       }],
                       dataLabels: {
                         enabled: true,
                         formatter: function() {
                           return this.point.value + '%';
                         }
                       }

                     });
                     break;

                   case "North America":
                     chart.addSeriesAsDrilldown(e.point, {
                       mapData: Highcharts.maps['custom/north-america'],
                       joinBy: 'hc-key',
                       data: [{
                         'hc-key': 'us',
                         value: 4
                       }],
                       dataLabels: {
                         enabled: true,
                         formatter: function() {
                           return this.point.value + '%';
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
           text: scope.header,
           style: {
             color: '#bf360c'
           }
         },

         subtitle: {
           text: 'USA',
           floating: true,
           align: 'right',
           y: 50,
           style: {
             fontSize: '16px',
             color: '#78909c'
           }
         },

         legend: small ? {} : {
           layout: 'vertical',
           align: 'right',
           verticalAlign: 'middle'
         },

         colorAxis: {
           min: 0,
           minColor: '#fbe9e7',
           maxColor: '#dd2c00'
         },

         mapNavigation: {
           enabled: false,
           buttonOptions: {
             verticalAlign: 'bottom'
           }
         },

         plotOptions: {
           series: {
             point: {
               events: {
                 click: function() {
                   if (this.name) {
                     // alert(this.name);
                   }
                 }
               }
             }
           }
         },

         series: [{
           name: 'World',
           data: DB.getContinentData(),
           mapData: Highcharts.maps['custom/world-continents'],
           joinBy: 'hc-key',
           dataLabels: {
             enabled: true,
             format: '{point.name}' + '<br />' + ' {point.value}' + '%'
           }
         }],

         tooltip: {
           backgroundColor: {
             linearGradient: [0, 0, 0, 60],
             stops: [
               [0, '#FFFFFF'],
               [1, '#E0E0E0']
             ]
           },
           borderWidth: 1,
           borderColor: '#AAA',
           borderRadius: 10,
           headerFormat: '<span style="font-size:10px">{series.name}</span><br/>',
           pointFormat: '<span style="font-size:16px">{point.name}: {point.value}</span><br/>',
           footerFormat: ''
         }


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

 routerApp.factory('DB', function($http) {
     var mapData = [];
     var drilledConfig ={};
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
     var continentData = [

         {
             'code': 'north-america',
             value: 20
         }

     ]
     var countryData = {
         'na': [

             {
                 'code': 'us',
                 value: 20
             }

         ]
     }


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


     setMapConfig = function(val) {
         mapConfig = val; //And changed here
         return mapConfig;
     };
    setData = function(val) {
         mapData = val; //And changed here
         return mapData;
     };

     setDrillDownSettingsConfig = function(val){
           drilledConfig = val;
           return drilledConfig;
       
     }
     setDrilledDataConfig = function(val)
     {
         drilleddataConfig = val;
           return drilleddataConfig;

     }


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
         getContryData: function(continent) {
             return countiesData[state]
         },
         setMapConfig: setMapConfig,
         setData:setData,
         setDrillDownSettingsConfig:setDrillDownSettingsConfig,
         setDrilledDataConfig :setDrilledDataConfig,          
         getConfig: function() {
             return mapConfig
         }
     }
 });
