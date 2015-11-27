routerApp.service('DynamicVisualization',['$objectstore', function($objectstore, $timeout){

   /*Summary:
		   synchronizes or get data per widget
		   @widget : widget that need to get updated
		   @callback : callback function on initialization of the widget (optional)
        */	
   this.syncWidget = function(widget, callback){
   		var seriesAttributes = null;
   		var mappedArray = [];
        var arrayAttributes = [];
        var filtering = null;
   		

    	eval(widget.initCtrl+'(widget, function(data){callback(data);})');

    	//dynamic vis widget
        function elasticInit(widget, callback){
        	var selectedClass = widget.widConfig.selectedClass;
            var selectedFields = widget.widConfig.selFields;
            var seriesAttributes = null;
            var parameter = "";

            for (i = 0; i < selectedFields.length; i++) {
               parameter += " " + selectedFields[i].name;
            }

            if (window.Worker) {
               var w = new Worker("scripts/webworkers/elasticWorker11.js", {
                  type: 'text/javascript'
               });
               w.postMessage(selectedClass + "," + parameter);
               w.addEventListener('message', function(event) {
                  console.log('data received');
                  // widget.syncState = true;

                  callback(mapRetrieved(event, widget));

               });
            }


            //mapping the retreived data
        function mapRetrieved(event, widget) {
         var obj = JSON.parse(event.data);
            //creating the array to map dynamically            
            for (var key in obj[0]) {
               if (Object.prototype.hasOwnProperty.call(obj[0], key)) {
                  var val = obj[0][key];
                  mappedArray[key] = {
                     name: key,
                     data: [],
                     unique: 0,
                     isNaN: true
                  };
                  arrayAttributes.push(key);
               }
            }

            //mapping the dynamically created array
            for (i = 0; i < obj.length; i++) {
               for (var key in obj[i]) {
                  if (Object.prototype.hasOwnProperty.call(obj[i], key)) {
                     var val = obj[i][key];
                     var parsedVal = parseFloat(val);
                     if (!isNaN(parsedVal)) {
                        mappedArray[key].data.push(parsedVal);
                        mappedArray[key].isNaN = false;
                     } else {
                        mappedArray[key].data.push(val);
                     }
                  }
               }
            }

            //getting the unique score to determine the hierarchy
            for (var key in mappedArray) {
               if (Object.prototype.hasOwnProperty.call(mappedArray, key)) {
                  if (mappedArray[key].isNaN) {
                     mappedArray[key].unique = Enumerable.From(mappedArray[key].data).Select().Distinct().ToArray().length;
                  }
               }
            }

            if(widget.widConfig.query.drilled)
            return orderByDrilledCat(widget, mappedArray);
            else return orderByCategory(widget, mappedArray);
        };


        //building chart
        function orderByCategory(widget, mappedArray){
         var chartCategory = widget.widConfig.chartCat;
            var cat = Enumerable.From(eval('mappedArray.' + chartCategory.groupField + '.data')).Select().Distinct().ToArray();
            var orderedObjArray = [];
            var seriesArray = widget.widConfig.series;
            

            for (i = 0; i < seriesArray.length; i++) {
               var serMappedData = eval('mappedArray.' + seriesArray[i].serName + '.data');
               var catMappedData = eval('mappedArray.' + chartCategory.groupField + '.data');
               var orderedArrayObj = {};
               var orderedObj = {};
               var data = [];

               for (k = 0; k < cat.length; k++) {
                   orderedObj[cat[k]] = {
                       val: 0,
                       count: 0
                   };
               }

               if(filtering == null){
                   filterData(seriesArray[i].filter);
               }
               filtering.calculate(orderedObj, catMappedData, serMappedData);

               for (var key in orderedObj) {
                   if (Object.prototype.hasOwnProperty.call(orderedObj, key)) {
                       data.push({
                           name: key,
                           y: orderedObj[key].val
                       });
                   }
               }

               orderedArrayObj["data"] = data;
               orderedArrayObj["name"] = seriesArray[i].name;
               orderedArrayObj["color"] = seriesArray[i].color;
               orderedArrayObj["type"] = seriesArray[i].type;
               orderedObjArray.push(orderedArrayObj);
           }

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
               
               series: orderedObjArray,
               title: {
                   text: ''
               },
               size: {
                   width: widget.highchartsNG.size.width,
                   height: widget.highchartsNG.size.height
               }
           };

           return widget;
        };


        function orderByDrilledCat(widget) {
            var drilledSeries = [];
            var chartCategory = widget.widConfig.chartCat;
            var cat = Enumerable.From(eval('mappedArray.' + chartCategory.groupField + '.data')).Select().Distinct().ToArray();
            var orderedObjArray = [];
            var drilledCat = Enumerable.From(eval('mappedArray.' + widget.widConfig.chartCat.drilledField + '.data')).Select().Distinct().ToArray();
            var seriesArray = widget.widConfig.series;

            for (i = 0; i < seriesArray.length; i++) {
               var serMappedData = eval('mappedArray.' + seriesArray[i].serName + '.data');
               var catMappedData = eval('mappedArray.' + chartCategory.groupField + '.data');
               var drillData = eval('mappedArray.' + chartCategory.drilledField + '.data');

               var orderedArrayObj = {};
               var orderedObj = {};
               var drilledObj = {};
               var data = [];

               for (k = 0; k < cat.length; k++) {

                  orderedObj[cat[k]] = {
                     val: 0,
                     arr: []
                  };
               }

               for (k = 0; k < drilledCat.length; k++) {
                  drilledObj[drilledCat[k]] = {
                     val: 0,
                     count: 0
                  };
               }

               filterData(seriesArray[i].filter);


               filtering.calculate(orderedObj, catMappedData, serMappedData, drillData);

               for (var key in orderedObj) {
                  if (Object.prototype.hasOwnProperty.call(orderedObj, key)) {

                     var drilledArray = filtering.calculate(orderedObj[key].arr, drilledObj, null, null);

                     var drilledSeriesObj = [];
                     for (var key1 in drilledArray) {
                        if (Object.prototype.hasOwnProperty.call(drilledArray, key1)) {
                           if (drilledArray[key1].val > 0)
                              drilledSeriesObj.push([key1, drilledArray[key1].val]);
                        }
                     }

                     var test = {
                        id: '',
                        data: []
                     };
                     test.id = key;
                     test.data = drilledSeriesObj;

                     drilledSeries.push(test);

                     data.push({
                        name: key,
                        y: orderedObj[key].val,
                        drilldown: key
                     });
                  }
               }

               orderedArrayObj["data"] = data;
               orderedArrayObj["name"] = seriesArray[i].name;
               orderedArrayObj["color"] = seriesArray[i].color;
               orderedArrayObj["type"] = seriesArray[i].type;
               orderedObjArray.push(orderedArrayObj);
            }

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
               series: orderedObjArray,
               drilldown: {
                  series: drilledSeries,
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
                              fill: '#bbda11'
                           },
                           select: {
                              stroke: '#039',
                              fill: '#bbda11'
                           }
                        }
                     }

                  }
               },
               title: {
                  text: ''
               },
               size: {
                  width: widget.highchartsNG.size.width,
                  height: widget.highchartsNG.size.height
               }
            };

            return widget;
        };


        function filterData(c) {
            var filter = eval('new ' + c.toUpperCase() + '();');
            filtering = new Filtering();
            filtering.setFilter(filter);
            seriesAttributes = filtering.filterFields();
        };

        /* Strategy1 begin */
         var Filtering = function() {
            this.filter = "";
         };

         Filtering.prototype = {
            setFilter: function(filter) {
               this.filter = filter;
            },

            calculate: function(orderedObj, catMappedData, serMappedData, drillData) {
               return this.filter.calculate(orderedObj, catMappedData, serMappedData, drillData);
            },

            filterFields: function() {
               return this.filter.filterFields();
            }
         };

         var SUM = function() {
            this.calculate = function(orderedObj, catMappedData, serMappedData, drillData) {
               console.log("calculations... for the sum filter");
               if (typeof drillData == 'undefined') {
                  for (j = 0; j < serMappedData.length; j++) {
                     orderedObj[catMappedData[j]].val += serMappedData[j];
                  }
               } else if (serMappedData == null) {
                  for (j = 0; j < orderedObj.length; j++) {
                     catMappedData[orderedObj[j].drill].val += orderedObj[j].val;
                  }
                  return catMappedData;
               } else {
                  for (j = 0; j < serMappedData.length; j++) {
                     orderedObj[catMappedData[j]].val += serMappedData[j];
                     orderedObj[catMappedData[j]].arr.push({
                        val: serMappedData[j],
                        drill: drillData[j]
                     });
                  }
               }
            }

            this.filterFields = function() {
               return getFilteredFields(false);
            }
         };

         var AVERAGE = function() {
            this.calculate = function(orderedObj, catMappedData, serMappedData, drillData) {
               console.log("calculations... for the average filter");
               if (typeof drillData == 'undefined') {
                  for (j = 0; j < serMappedData.length; j++) {
                     orderedObj[catMappedData[j]].val += serMappedData[j];
                     orderedObj[catMappedData[j]].count += 1;
                  }
                  for (attr in orderedObj) {
                     if (Object.prototype.hasOwnProperty.call(orderedObj, attr)) {
                        orderedObj[attr].val = Number((orderedObj[attr].val / orderedObj[attr].count).toFixed(2));
                     }
                  }
               } else if (serMappedData == null) {
                  for (j = 0; j < orderedObj.length; j++) {
                     catMappedData[orderedObj[j].drill].val += orderedObj[j].val;
                     catMappedData[orderedObj[j].drill].count += 1;
                  }
                  for (attr in catMappedData) {
                     if (Object.prototype.hasOwnProperty.call(catMappedData, attr)) {
                        catMappedData[attr].val = Number((catMappedData[attr].val / catMappedData[attr].count).toFixed(2));
                     }
                  }
                  return catMappedData;
               } else {
                  for (j = 0; j < serMappedData.length; j++) {
                     orderedObj[catMappedData[j]].val += serMappedData[j];
                     orderedObj[catMappedData[j]].arr.push({
                        val: serMappedData[j],
                        drill: drillData[j]
                     });
                  }
                  for (attr in orderedObj) {
                     if (Object.prototype.hasOwnProperty.call(orderedObj, attr)) {
                        orderedObj[attr].val = Number((orderedObj[attr].val / orderedObj[attr].arr.length).toFixed(2));
                     }
                  }
               }
            }

            this.filterFields = function() {
               return getFilteredFields(false);
            }
         };

         var PERCENTAGE = function() {
            this.calculate = function(orderedObj, catMappedData, serMappedData, drillData) {
               console.log("calculations... for the prcentage filter");
               var total;
               if (typeof drillData == 'undefined') {
                  total = 0;
                  for (j = 0; j < serMappedData.length; j++) {
                     orderedObj[catMappedData[j]].val += serMappedData[j];
                     total += serMappedData[j];
                  }
                  for (attr in orderedObj) {
                     if (Object.prototype.hasOwnProperty.call(orderedObj, attr)) {
                        orderedObj[attr].val = Number(((orderedObj[attr].val / total) * 100).toFixed(2));
                     }
                  }
               } else if (serMappedData == null) {
                  total = 0;
                  for (j = 0; j < orderedObj.length; j++) {
                     catMappedData[orderedObj[j].drill].val += orderedObj[j].val;
                     total += orderedObj[j].val;
                  }
                  for (attr in catMappedData) {
                     if (Object.prototype.hasOwnProperty.call(catMappedData, attr)) {
                        catMappedData[attr].val = Number(((catMappedData[attr].val / total) * 100).toFixed(2));
                     }
                  }
                  return catMappedData;
               } else {
                  total = 0;
                  for (j = 0; j < serMappedData.length; j++) {
                     orderedObj[catMappedData[j]].val += serMappedData[j];
                     total += serMappedData[j];
                     orderedObj[catMappedData[j]].arr.push({
                        val: serMappedData[j],
                        drill: drillData[j]
                     });
                  }
                  for (attr in orderedObj) {
                     if (Object.prototype.hasOwnProperty.call(orderedObj, attr)) {
                        orderedObj[attr].val = Number(((orderedObj[attr].val / total) * 100).toFixed(2));
                     }
                  }
               }
            }

            this.filterFields = function() {
               return getFilteredFields(false);
            }
         };

         var COUNT = function() {
            this.calculate = function(orderedObj, catMappedData, serMappedData, drillData) {
               console.log("calculations... for the count filter");
               if (typeof drillData == 'undefined') {
                  for (j = 0; j < serMappedData.length; j++) {
                     orderedObj[catMappedData[j]].val += 1;
                  }
               } else if (serMappedData == null) {
                  for (j = 0; j < orderedObj.length; j++) {
                     catMappedData[orderedObj[j].drill].val += 1;
                  }
                  return catMappedData;
               } else {
                  for (j = 0; j < serMappedData.length; j++) {
                     orderedObj[catMappedData[j]].val += 1;
                     orderedObj[catMappedData[j]].arr.push({
                        val: serMappedData[j],
                        drill: drillData[j]
                     });
                  }
               }
            }

            this.filterFields = function() {
               return getFilteredFields(true);
            }
         };

         //returns the series array according to the filter selected
         function getFilteredFields(isNaN) {
            var objArr = [];
            for (var key in mappedArray) {
               if (Object.prototype.hasOwnProperty.call(mappedArray, key)) {
                  if (!isNaN) !mappedArray[key].isNaN && objArr.push(mappedArray[key].name);
                  else objArr.push(mappedArray[key].name);
               }
            }
            return objArr;
         };
         /* Strategy1 end */

        };

        function metricInit(widget, callback){
            var selectedClass = widget.widConfig.selectedClass;
            var selectedField = widget.widConfig.selField.name;
            var selectedFilter = widget.widConfig.selFilter;
            var mappedArrayMet = [];
            var arrayAttributesMet = [];
            var fieldRetrieved = "";
            var filtering = null;
            var filtersAvailable = [];
            var seriesAttributesMet = [];
            widget.syncState = false;

            if (window.Worker) {
               var w1 = new Worker("scripts/webworkers/elasticWorker11.js", {
                  type: 'text/javascript'
               });
               w1.postMessage(selectedClass + "," + selectedField);
               w1.addEventListener('message', function(event) {
                  console.log('data received');
                  callback(mapRetrieved(event, widget));
               });
            }

            function mapRetrieved(event, widget){
               var obj = JSON.parse(event.data);
               
               //creating the array to map dynamically
               for (var key in obj[0]) {
                   if (Object.prototype.hasOwnProperty.call(obj[0], key)) {
                       var val = obj[0][key];
                       console.log(key);
                       mappedArrayMet[key] = {
                           name: key,
                           data: [],
                           isNaN: true
                       };
                       arrayAttributesMet.push(key);
                   }
               }

               //mapping the dynamically created array
               for (i = 0; i < obj.length; i++) {
                   for (var key in obj[i]) {
                       if (Object.prototype.hasOwnProperty.call(obj[i], key)) {
                           var val = obj[i][key];
                           var parsedVal = parseFloat(val);
                           if (!isNaN(parsedVal)) {
                               mappedArrayMet[key].data.push(parsedVal);
                               mappedArrayMet[key].isNaN = false;
                           } else {
                               mappedArrayMet[key].data.push(val);
                           }
                           fieldRetrieved = mappedArrayMet[key].name;
                       }
                   }
               }

               //getFilters();
               filterDataMet(selectedFilter);
               var dataObject = mappedArrayMet[fieldRetrieved].data;
               widget.widData['value'] = filtering.calculate(dataObject);
               return widget;
            }

            function getFilters() {
                 for (var key in mappedArrayMet) {
                     if (Object.prototype.hasOwnProperty.call(mappedArrayMet, key)) {
                         if(mappedArrayMet[key].isNaN) filtersAvailable = ['Count'];
                         else filtersAvailable = filterAttributes;
                     }
                 }
             };

            function filterDataMet(c) {
               var filter = eval('new ' + c.toUpperCase() + '();');
               filtering = new Filtering();
               filtering.setFilter(filter);
               seriesAttributesMet = filtering.filterFields();
            };

             /* Strategy1 begin */
    var Filtering = function () {
        this.filter = "";
    };

    Filtering.prototype = {
        setFilter: function (filter) {
            this.filter = filter;
        },

        calculate: function (dataObject) {
            return this.filter.calculate(dataObject);
        },

        filterFields: function () {
            return this.filter.filterFields();
        }
    };

    var SUM = function () {
        this.calculate = function (dataObject) {
            console.log("calculations... for the sum filter");
            var sum = 0;
                for (j = 0; j < dataObject.length; j++) {
                    sum += dataObject[j];
                }
            return sum;
        }

        this.filterFields = function () {
            return getFilteredFields(false);
        }
    };

    var AVERAGE = function () {
        this.calculate = function (dataObject) {
            console.log("calculations... for the average filter");
                var sum = 0;
                for (j = 0; j < dataObject.length; j++) {
                    sum += dataObject[j];
                }
                return sum/dataObject.length;                
            }

        this.filterFields = function () {
            return getFilteredFields(false);
        }
    };

    var PERCENTAGE = function () {
        this.calculate = function (dataObject) {
            console.log("calculations... for the prcentage filter");
            var sum = 0;
            for (j = 0; j < dataObject.length; j++) {
                    sum += dataObject[j];
                }
            return (sum/dataObject.length)*100;            
        }

        this.filterFields = function () {
            return getFilteredFields(false);
        }
    };

    var COUNT = function () {
        this.calculate = function (dataObject) {
            console.log("calculations... for the count filter");
            return dataObject.length;
        }

        this.filterFields = function () {
            return getFilteredFields(true);
        }
    };

    var UNIQUE = function () {
        this.calculate = function (dataObject) {
            console.log("calculations... for the unique filter");            
            return Enumerable.From(dataObject).Select().Distinct().ToArray().length;;
        }

        this.filterFields = function () {
            return getFilteredFields(true);
        }
    };

    //returns the series array according to the filter selected
    function getFilteredFields(isNaN) {
        var objArr = [];
        for (var key in mappedArrayMet) {
            if (Object.prototype.hasOwnProperty.call(mappedArrayMet, key)) {
                if (!isNaN) !mappedArrayMet[key].isNaN && objArr.push(mappedArrayMet[key].name);
                else objArr.push(mappedArrayMet[key].name);
            }
        }
        return objArr;
    };

    /* Strategy1 end */

        };//metricInit end
        
    };


        
}]);