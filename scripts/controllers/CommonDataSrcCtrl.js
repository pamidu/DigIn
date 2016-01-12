routerApp.controller('commonDataSrcInit', ['$scope', '$mdSidenav', '$log', 'CommonDataSrc', '$mdDialog', '$rootScope', '$http', 'Digin_Engine_API', function($scope, $mdSidenav, $log, CommonDataSrc, $mdDialog, $rootScope, $http, Digin_Engine_API) {

   $scope.fieldArray = [];
   $scope.selTable = "";
   $scope.selSrc = "";
   $scope.icon = "bower_components/material-design-icons/navigation/svg/production/ic_chevron_left_18px.svg";

   $scope.datasources = [{
      name: "DuoStore"
   }, {
      name: "BigQuery"
   }, {
      name: "CSV/Excel"
   }, {
      name: "Rest/SOAP Service"
   }, {
      name: "SpreadSheet"
   }];

   // $scope.toggleRight = buildToggler('right');
   $scope.toggleLeft = buildToggler('custom');

   $scope.modelContainer=[];
   // angular.forEach($scope.dataFields,function(item){
   //   $scope.modelContainer.push({item:item});
   // });

   $scope.FilterData = function(evt){
      console.log("$scope.modelContainer");
      console.log($scope.modelContainer);
   }

   $scope.isOpenRight = function() {
      return $mdSidenav('right').isOpen();
   };
   $scope.isOpenRight = function() {
      return $mdSidenav('custom').isOpen();
   };

   $scope.onChangeSource = function(src) {
      $scope.selSrc = src;
      CommonDataSrc.getTables(src, function(data) {
         $scope.dataTables = data;
      });
   };

   $scope.onChangeTable = function(tbl) {
      $scope.selTable = tbl;
      CommonDataSrc.getFields(tbl, function(data) {
         $scope.dataFields = data;
         //$compile(div)(scope);
      });
   };

   function buildToggler(navID) {
      return function() {
         $mdSidenav(navID)
            .toggle()
            .then(function() {
               $log.debug("toggle " + navID + " is done");
            });
      }
   };

   $scope.toggleCheck = function(field) {
      var i = $scope.fieldArray.indexOf(field);
      if (i > -1) {
         $scope.fieldArray.splice(i, 1);
         $scope.modelContainer.splice(i, 1);
      } else {
         $scope.fieldArray.push(field);
         $scope.modelContainer.push(field);
      }
   };

   $scope.configGraph = function(evt) {
      $scope.fieldString = [];
      //building the fields string
      for(i=0;i<$scope.fieldArray.length;i++){
         $scope.fieldString.push("'"+$scope.fieldArray[i]+"'");
      }

      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function(e) {
         console.log(this);
         if (xhr.readyState === 4) {
            if (xhr.status === 200) {
               $scope.currWidget = {
                  widData: {},
                  widView: "views/ViewCommonSrc.html",
                  dataView: "ViewElasticData",
                  dataCtrl: "elasticDataCtrl",
                  initTemplate: "InitConfigCommonSrc",
                  initCtrl: "commonSrcInit",
                  uniqueType: "Common Source",
                  syncState: true,
                  expanded: true,
                  seriesname: "",
                  externalDataURL: "",
                  dataname: "",
                  d3plugin: "",
                  divider: false,
                  id: "chart" + Math.floor(Math.random() * (100 - 10 + 1) + 10),
                  type: "Visualization",
                  width: '370px',
                  height: '300px',
                  mheight: '100%',
                  highchartsNG: {
                     size: {
                        height: 220,
                        width: 300
                     }
                  },
                  commonSrcConfig: {
                     src: $scope.selSrc,
                     tbl: $scope.selTable,
                     fields: $scope.fieldArray
                  }
               };
               var data = JSON.parse(xhr.response);

               $rootScope.dashboard.widgets.push($scope.currWidget);
               $mdDialog.show({
                     controller: 'commonSrcInit',
                     templateUrl: 'views/InitConfigCommonSrc.html',
                     targetEvent: evt,
                     locals: {
                        widId: $scope.currWidget.id,
                        fieldData: data
                     }
                  })
                  .then(function() {
                     //$mdDialog.hide();
                  }, function() {
                     //$mdDialog.hide();
                  });

            } else {
               console.error("XHR didn't work: ", xhr.status);
            }
         }
      }
      xhr.ontimeout = function() {
         console.error("request timedout: ", xhr);
      }
      //alert($scope.selTable.split(":")[1]);
      xhr.open("get", Digin_Engine_API + "gethighestlevel?tablename=[" + Digin_Engine_API_Namespace +"."+ $scope.selTable + "]&id=1&levels=[" + $scope.fieldString.toString() + "]&plvl=All", /*async*/ true);

      xhr.send();

   };

}]);

// $scope.getDataByFields = function(evt) {
//       $scope.fieldString = [];
//       //building the fields string
//       for(i=0;i<$scope.fieldArray.length;i++){
//          $scope.fieldString.push("'"+$scope.fieldArray[i]+"'");
//       }
      
//       var xhr = new XMLHttpRequest();

//       xhr.onreadystatechange = function(e) {
//          console.log(this);
//          if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//               console.log(xhr.response);
//             } else {
//                console.error("XHR didn't work: ", xhr.status);
//             }
//          }
//       }
//       xhr.ontimeout = function() {
//          console.error("request timedout: ", xhr);
//       }
      
//       var queryString = ""
//       // xhr.open("get", Digin_Engine_API + "executeQuery?tablename=[" + $scope.selTable.split(":")[1] + "]&id=1&levels=[" + $scope.fieldString.toString() + "]&plvl=All", /*async*/ true);
//       // xhr.open("get", Digin_Engine_API + "executeQuery?SELECT*FROM ", /*async*/ true);

//       // xhr.send();

//    };

// }]);


routerApp.controller('commonSrcInit', ['$scope', '$mdDialog', '$rootScope', 'widId', '$state', 'fieldData','Digin_Engine_API','Digin_Engine_API_Namespace', function($scope, $mdDialog, $rootScope, widId, $state, fieldData, Digin_Engine_API, Digin_Engine_API_Namespace) {
   var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
   $scope.widget = $rootScope.dashboard.widgets[objIndex];
   $scope.arrayAttributes = fieldData;
   $scope.fieldSelection = true;
   $scope.mappedArray = {};
   $scope.seriesArray = [{
      name: 'series1',
      serName: '',
      filter: '',
      type: 'area',
      color: ''
   }];
   $scope.chartCategory = {
      groupField: '',
      drilledField: '',
      drilledArray: []
   };
   $scope.filterAttributes = ['Sum', 'Average', 'Percentage', 'Count'];
   $scope.chartTypes = [{
      name: "Area",
      type: "area"
   }, {
      name: "Smooth area",
      type: "areaspline"
   }, {
      name: "Line",
      type: "line"
   }, {
      name: "Smooth line",
      type: "spline"
   }, {
      name: "Column",
      type: "column"
   }, {
      name: "Bar",
      type: "bar"
   }, {
      name: "Pie",
      type: "pie"
   }, {
      name: "Scatter",
      type: "scatter"
   }];

   //adds new series to the chart
   $scope.addSeries = function() {
      $scope.seriesArray.push({
         name: 'series1',
         serName: '',
         filter: '',
         type: 'area',
         color: '',
         drilled: false
      });
   }


   //removes the clicked series
   $scope.removeSeries = function(ind) {
      $scope.seriesArray.splice(ind, 1);
   }

   $scope.getDrillArray = function() {
      var uniqueScore = eval('$scope.mappedArray.' + $scope.chartCategory.groupField + '.unique');
      console.log('unique score:' + uniqueScore);
      for (var key in $scope.mappedArray) {
         if (Object.prototype.hasOwnProperty.call($scope.mappedArray, key)) {
            if ($scope.mappedArray[key].unique > uniqueScore && $scope.mappedArray[key].unique != 0)
               $scope.chartCategory.drilledArray.push($scope.mappedArray[key].name);
         }
      }
   };


   //builds the chart
   $scope.buildchart = function(widget) {
      widget.chartSeries = [];

      if ($scope.catItem != '') {
         $scope.widgetValidity = 'fade-out';
         if ($scope.seriesArray[0].serName != '') {
            if ($scope.queryDrilled) {
               if ($scope.drillItem != '') {
                  $scope.orderByDrilledCat(widget);
                  $state.go('Dashboards');
                  $mdDialog.hide();
                  //$scope.widgetValidity = 'fade-out';
               } else {
                  //$scope.validationMessage = "Please select the category to drill-down from";
                  //$scope.widgetValidity = 'fade-in';
               }
            } else {
               $scope.orderByCat(widget);
               $state.go('Dashboards');
               $mdDialog.hide();
               //$scope.widgetValidity = 'fade-out';
            }
         } else {
            //$scope.validationMessage = "Please select a series";
            //$scope.widgetValidity = 'fade-in';
         }
      } else {
         //$scope.validationMessage = "Please select a category";
         //$scope.widgetValidity = 'fade-in';
      }
   }
   
   //generate workers parameters
   $scope.generateParamArr = function(httpMethod, host, tbl, method, gBy, agg, aggF, cons, oBy){
      return {webMethod: httpMethod,
              host: host,
              method: method,
              params: [
                 {name: 'tablename', value: "["+tbl+"]"},
                 {name: 'group_by', value: "{'"+gBy+"':1}"},
                 {name: 'agg', value: agg.toLowerCase()},
                 {name: 'agg_f', value: "['"+aggF+"']"},
                 {name: 'cons', value: cons},
                 {name: 'order_by', value: oBy}
              ]};
   };

   //order by category
   $scope.orderByCat = function(widget) {
      $scope.seriesArray.forEach(function(entry) {
         var tblVal = Digin_Engine_API_Namespace + '.' + widget.commonSrcConfig.tbl;
         entry['data'] = [];
         var paramArr = $scope.generateParamArr('get',Digin_Engine_API, widget.commonSrcConfig.tbl,'aggregatefields', $scope.catItem.value, entry.filter,entry.serName.value);
         var w = new Worker("scripts/webworkers/commonSrcWorker.js");
         w.postMessage(JSON.stringify(paramArr));
         w.addEventListener('message', function(event) {
            var objArr = [];
            var evData = JSON.parse(event.data);
            for(i=0;i<evData.length;i++){
               entry['data'].push({name: evData[i][$scope.catItem.value],
                            y: evData[i]['f0_']});               
            }  
        });
      });
      widget.highchartsNG = {
         options: {
            drilldown: {
               drillUpButton: {
                  relativeTo: 'plotBox',
                  position: {
                     y: 0,
                     x: 0
                  },
                  theme: {
                     fill: 'white',
                     'stroke-width': 1,
                     stroke: 'silver',
                     r: 0,
                     states: {
                        hover: {
                           fill: '#303F9F'
                        },
                        select: {
                           stroke: '#039',
                           fill: '#303F9F'
                        }
                     }
                  }

               },
               series: [],
               plotOptions: {
                  series: {
                     borderWidth: 0,
                     dataLabels: {
                        enabled: true,
                     }
                  }
               }
            }
         },
         xAxis: {
            type: 'category'
         },
         credits: {
            enabled: false
         },
         legend: {
            enabled: false
         },

         series: $scope.seriesArray,
         title: {
            text: ''
         },
         size: {
            width: 300,
            height: 220
         }
      };
   };

   //order by category (drilled)
//order by category (drilled)
   $scope.orderByDrilledCat = function(widget) {
      $scope.objArr = [];
      $scope.orderedArrayObj = [];
	  var requestCounter = $scope.seriesArray.length;		//main request completion counter
      
      $scope.seriesArray.forEach(function(entry) {
         var serObj = {name:'',color:'',type:'',data:[]};         
         entry['data'] = [];
         var tblVal = Digin_Engine_API_Namespace + '.' + widget.commonSrcConfig.tbl;
         var paramArr = $scope.generateParamArr('get',Digin_Engine_API, tblVal,'aggregatefields', $scope.catItem.value, entry.filter,entry.serName.value);
         var w = new Worker("scripts/webworkers/commonSrcWorker.js");
         requestCounter--;
         w.postMessage(JSON.stringify(paramArr));
         w.addEventListener('message', function(event) {

            var evData = JSON.parse(event.data);
            serObj.name = entry.name;
            serObj.type = entry.type;
            serObj.color = entry.color;
            for(i=0;i<evData.length;i++){
               serObj.data.push({
                  drilldown: evData[i][$scope.catItem.value],
                  name: evData[i][$scope.catItem.value],
                  y: evData[i]['f0_']});
               entry['data'].push({
                  drilldown: evData[i][$scope.catItem.value],
                  name: evData[i][$scope.catItem.value],
                  y: evData[i]['f0_']});
            }
			if(requestCounter == 0){
               setWidget();
            }
        });
         $scope.orderedArrayObj.push(serObj);
      });
	  
	  function setWidget(){
        var requestCounter = 0;   
		$scope.seriesArray.forEach(function(entry) {
			requestCounter = entry.data.length;
			entry.data.forEach(function(enData){
				var con = "WHERE " + $scope.catItem.value + "='" + enData.name + "'";
                var drillParams = $scope.generateParamArr('get',Digin_Engine_API, widget.commonSrcConfig.tbl,'aggregatefields', $scope.drillItem.value, entry.filter,entry.serName.value, con);
                //alert(JSON.stringify(drillParams));
                var w1 = new Worker("scripts/webworkers/commonSrcWorker.js");
                   
                w1.postMessage(JSON.stringify(drillParams));
                w1.addEventListener('message', function(event) {
                  requestCounter--; 
				  var drilledData = JSON.parse(event.data);
//                  console.log('drilleed data:'+ JSON.stringify(drilledData)); 
                  var dataArr = [];
//                  alert(JSON.stringify(drilledData));
                  for(j=0;j<drilledData.length;j++){
                     dataArr.push([
                        drilledData[j][$scope.drillItem.value],
                        drilledData[j]['f0_']
                     ]);
                  }
                  $scope.objArr.push({
                        id: enData.name,
                        data: dataArr
                     });
                   
                   if(requestCounter==0){
                      alert(widget.id);
//                      var widgetElem = document.getElementById(widget.id);
                  widget.highchartsNG = {
         chart: {
            type: 'column'
         },

         plotOptions: {
            series: {
               borderWidth: 0,
               dataLabels: {
                  enabled: true,
               }
            }
         },

         title: {
            text: widget.uniqueType
         },
         xAxis: {
            type: 'category'
         },
         credits: {
            enabled: false
         },
         legend: {
            enabled: false
         },
         series: $scope.orderedArrayObj,
         drilldown: {
            series: $scope.objArr,
            drillUpButton: {
               relativeTo: 'spacingBox',
               position: {
                  y: 0,
                  x: 0
               },
               theme: {
                  fill: 'white',
                  'stroke-width': 1,
                  stroke: 'silver',
                  r: 0,
                  states: {
                     hover: {
                        fill: '#bada55'
                     },
                     select: {
                        stroke: '#039',
                        fill: '#bada55'
                     }
                  }
               }

            }
         },
         title: {
            text: ''
         },
         size: {
            width: 300,
            height: 220
         }
      };    
                  //widget.highchartsNG = ;
                      console.log('highchartng:'+JSON.stringify(widget.highchartsNG));
                }
                   
                   
//                  widget.highchartsNG.drilldown.series.push({
//                        id: enData.name,
//                        data: dataArr
//                     }); 
				});
               
               
               
			});
           
           
           
		});
		
	  }
   };

}]);