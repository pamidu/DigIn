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

       var small = $('#container').width() < 400;
       scope.$watch('mydata', function(newValue, oldValue) {
        if (newValue) {
          scope.drawMap(newValue);
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
                     data: [{
                       'hc-key': 'lk',
                       value: 4,
                       drilldown: true
                     }],
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
           text:'',
           style: {
             color: '#bf360c'
           }
         },
         credits: {
          enabled: false
        },


        legend: small ? {} : {
         layout: 'vertical',
         align: 'right',
         verticalAlign: 'middle'
       },

       
       series: [{
         name: 'World',
         data: mydata,
         mapData: Highcharts.maps['custom/world-continents'],
         joinBy: 'hc-key',
         dataLabels: {
           enabled: true,
           format: '{point.name}' + '<br />' + ' {point.value}'  
         }
       }],

       


     };

       // Instanciate the map
       $(elem).highcharts('Map', mapConfig);
       $timeout(function() {
         scope.mapconfigured = mapConfig;
         DB.setMapConfig(mapConfig);
       });
     }
   }
 };
});

 routerApp.factory('DB', function($http) {
   var mapPlotData = [];
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


       setDrillDownSettingsConfig = function(drilled,drilleddata,data){

         drilledConfig = drilled;
         drilleddataConfig = drilleddata;
         data[0].data.forEach(function(e) {
          e["hc-key"] = e.name;
          e.value = e.y;

          delete e.name;   
          delete e.y;   
        });

         mapPlotData = data[0].data;
         return drilledConfig;

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
         setDrillDownSettingsConfig:setDrillDownSettingsConfig,

         getConfig: function() {
           return mapConfig
         }
       }
     });
