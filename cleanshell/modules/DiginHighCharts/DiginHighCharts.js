/*!
* DiginHighCharts: v0.0.1
* Authour: Dilshan Liyanage
*/

'use strict';

var DiginHighChartsModule = angular.module('DiginHighCharts',['DiginServiceLibrary','directivelibrary']);

DiginHighChartsModule.directive('diginHighChart',['$rootScope','notifications','$state','$timeout', function($rootScope,notifications,$state,$timeout) {
  return {
	restrict: 'E',
	template: '<highchart id="{{idSelector}}" config="config"></highchart>',
	scope: {
			config: '=',
			idSelector: '@'
		},
	link: function(scope,element){

		scope.$on('widget-resized', function(element, widget) {
			var height = widget.element[0].clientHeight - 50;
			var width = widget.element[0].clientWidth;
			$('#'+widget.element[0].children[2].children[0].getAttribute('id-selector')).highcharts().setSize(width, height, true);
			
		});
	} //end of link
  };
}]);

//This directive runs whenever a gridster item is initialized
DiginHighChartsModule.directive('gridsterItemInitalizeWatcher',['$timeout', function ($timeout) {
    return {
        restrict: 'AE',
        link: function (scope) {
            scope.$on('gridster-item-initialized', function (event, item) {
				$timeout(function(){ //wait 100 milliseconds until the dom element is added
					var widgetID = item.$element[0].children[2].children[0].children[0].getAttribute('id');
					$('#'+widgetID).highcharts().setSize(item.getElementSizeX(), item.getElementSizeY(), true);
				}, 100);
            });
        }
    };
}]);

DiginHighChartsModule.directive('diginHighchartsSettings',['$rootScope','notifications', function($rootScope,notifications) {
    return {
         restrict: 'E',
         templateUrl: 'modules/DiginHighCharts/highChartsSettings.html',
         scope: {
           forecastObj: '='
          },
         link: function(scope,element){
			scope.$on('press-submit', function(event, args) {
				scope.inputForm.$setSubmitted();
				if(scope.inputForm.$valid)
				{
					args.callbackFunction(true);
				}else{
					args.callbackFunction(false);
				}
			 })
         } //end of link
    };
}]);

DiginHighChartsModule.factory('generateHighchart', ['$rootScope','$diginengine','DiginServicesM','notifications', 'chartUtilitiesFactory','$filter',
	function($rootScope,$diginengine,DiginServicesM,notifications,chartUtilitiesFactory,$filter) {
	return {
		initializeChartObject: function(highChartType) {

			//Change chart background colours according to theme
			var chartBackgroundColor = "";
			var chartFontColor = "";
			
			if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
			{
				chartBackgroundColor = "rgb(48,48,48)";
				chartFontColor = '#fff';
			}else{
				chartBackgroundColor = "rgb(250,250,250)";
			}

			//Create the chart object
			var highchartObject = {};
			highchartObject = {
				options: {
					chart: {
						type: highChartType,
						backgroundColor: chartBackgroundColor
					},
                    tooltip: {
                        pointFormat: '{point.y:,.0f}'
                    },
                    exporting: {
                        sourceWidth: 600,
                        sourceHeight: 400
                    },
                    xAxis: {
                        showEmpty: false
                    },
                    yAxis: {
                        showEmpty: false
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                format: '<b> {point.name}</b>'
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b> ( {point.y:,.0f} )',
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                    softConnector: true
                                }
                            },
                            showInLegend: false,
                            tooltip: {
                                pointFormat: '{series.name}: {point.percentage:,.2f}%'
                            }
                        }
                    }
				},
				xAxis: {
					lineColor: chartFontColor,
					tickColor: chartFontColor,
					labels: {
						style: {
							color: chartFontColor
						}
					},
					type: 'category'
				},
				title: {
					text: '',
					style: {
						color: chartFontColor
					}
				},
                yAxis: {
                    lineWidth: 1
                },
                credits: {
                    enabled: false
                },
				series: []
			};
			return highchartObject;
		},
		// method by: Dilani Maheswaran
		// build the highchart with data
		generate: function(chartObj, highChartType, tableName, selectedSeries, selectedCategory,limit, datasourceId, selectedDB, isDrilled,groupBySortArray, callback, connection, allFields,reArangeArr) {
			// chartObj - Chart configuration Object, highChartType - chart type String
			//format selected series

			var client = $diginengine.getClient(selectedDB);
			var fieldArr = [];
			for(var i = 0; i < selectedSeries.length; i++) {
				fieldArr.push({
					field: selectedSeries[i].name,
					agg: selectedSeries[i].aggType
				});
			}

			if(!isDrilled){
				$diginengine.getClient(selectedDB).getAggData(tableName, fieldArr, limit, datasourceId, function(res, status, query) {
					if (status) {
						var series = [];
						series = chartUtilitiesFactory.mapChartData(res,groupBySortArray[0].displayName,isDrilled);
						// highcharts-ng internally calls the setSeries API when series is set
						chartObj.series = series;
						callback(chartObj,query);
					} else {
						notifications.toast(0,'Error. Please try again.');
						callback(chartObj,'');
					}
				},groupBySortArray[0].displayName,connection,groupBySortArray[0].sortName);
			}else{

				var catArr = [];
				var drillOrderArr = [];

				selectedCategory.forEach(function(cat) {
				    catArr.push("%27" +cat.name +"%27");
				});

				$diginengine.getClient(selectedDB).getHighestLevel(tableName, catArr.toString() ,datasourceId,function(res, status){
					if(status){

						var highestLevel = "";
                    	res = $filter('orderBy')(res, 'level');

                    	for (i = 0; i < res.length; i++) {
	                        if (typeof res[i + 1] != "undefined") {
	                            drillOrderArr.push({
	                                name: res[i].value,
	                                nextLevel: res[i + 1].value,
	                                level: res[i].level
	                            });
	                        } else {
	                            drillOrderArr.push({
	                                name: res[i].value,
	                                level: res[i].level
	                            });
	                        }
	                        if (res[i].level == 1) 
	                        	highestLevel = res[i].value;
                    	}

                    	//change the order of sort array and the cat array before send the request
                    	var sortTempArr = [];
                    	var atrbTempArr = [];

                    	res.forEach(function(entry) {
							groupBySortArray.forEach(function(elm) {
							   if(entry.value == elm.displayName)
                    				sortTempArr.push(elm);
							});
						});

                    	groupBySortArray = sortTempArr;

                    	res.forEach(function(entry) {
							selectedCategory.forEach(function(elm) {
							   if(entry.value == elm.name)
                    				atrbTempArr.push(elm);
							});
						});

                    	selectedCategory = atrbTempArr;

                    	reArangeArr(selectedCategory,groupBySortArray);
                    	// -----------------

                    	$diginengine.getClient(selectedDB).getAggData(tableName, fieldArr, limit, datasourceId, function(res, status, query) {

                    		var series = [];
                    		series = chartUtilitiesFactory.mapChartData(res,highestLevel,true);
                    		chartObj.series = series;


							chartObj.series.forEach(function(key) {
				                key['turboThreshold'] = 0;
				                key['cropThreshold'] = key.data.length;
				            });

							var drillDownConfig = {
					                dataSrc: selectedDB,
					                clientObj: client,
					                srcTbl: tableName,
					                drillOrdArr: drillOrderArr,
					                highestLvl: highestLevel,
					                fields: fieldArr,
					                level1Query: query,
					                currentLevel: 1
					        };

					        if (chartObj.xAxis !== undefined){
				                chartObj.xAxis["title"] = {
				                    text: highestLevel
				                };
				            }

				            chartObj.options['customVar'] = highestLevel;

				            chartObj.options.chart['events'] = {
				            	drilldown: function(e) {
				                    if (!e.seriesOptions) {
				                        var srcTbl = tableName,
				                            fields = fieldArr,
				                            drillOrdArr = drillOrderArr,
				                            chart = this,
				                            clientObj = client,
				                            clickedPoint = e.point.name,
				                            nextLevel = "",
				                            highestLvl = this.options.customVar,
				                            drillObj = {},
				                            isLastLevel = false,
				                            selectedSeries = e.point.series.name,
				                            origName = "",
				                            tempArrStr = "",
				                            serName = "";
				                            var conStr = "";
				                            var level;
				                            var tempArray = [];
				                            var isDate;
				                            var groupBy;
				                            var orderBy;
				                        // var cat = [];
				                        for (i = 0; i < drillOrdArr.length; i++) {
				                            if (drillOrdArr[i].name == highestLvl) {
				                                nextLevel = drillOrdArr[i].nextLevel;
				                                groupBy = groupBySortArray[i+1].displayName;
				                                orderBy = groupBySortArray[i+1].sortName;
				                                drillOrdArr[i].clickedPoint = clickedPoint;
				                                level = drillOrdArr[i].level;
				                                if (!drillOrdArr[i + 1].nextLevel) isLastLevel = true;
				                            }
				                        }
				                        //get the selected point of each level
				                        for(var c = 0; c<level;c++){
				                            tempArrStr = "";
				                            isDate = false;
				                            angular.forEach(allFields,function(key){
				                                if (key.name == drillOrdArr[c].name){
				                                    if (key.dataType !== undefined){
				                                        if (key.dataType == 'DATE' || key.dataType == 'Date'){
				                                            isDate = true;
				                                        }
				                                    }
				                                }
				                            });
				                            if (selectedDB == "MSSQL") {
				                                if (typeof drillOrdArr[c].clickedPoint == 'number') {
				                                    if (isDate){
				                                        tempArrStr = 'Date(['+drillOrdArr[c].name + "]) = " + drillOrdArr[c].clickedPoint;
				                                    }else{
				                                        tempArrStr = '[' + drillOrdArr[c].name + "] = " + drillOrdArr[c].clickedPoint;
				                                    }
				                                } else {
				                                if (isDate){
				                                        tempArrStr = 'Date(['+drillOrdArr[c].name + "]) = '" + drillOrdArr[c].clickedPoint + "'";
				                                    }else{
				                                        tempArrStr = '[' + drillOrdArr[c].name + "] = '" + drillOrdArr[c].clickedPoint + "'";
				                                    }
				                                }
				                            } else {
				                                if (typeof drillOrdArr[c].clickedPoint == 'number') {
				                                    if (isDate){
				                                        tempArrStr = 'Date('+drillOrdArr[c].name + ") = " + drillOrdArr[c].clickedPoint;
				                                    }else{
				                                        tempArrStr = drillOrdArr[c].name + " = " + drillOrdArr[c].clickedPoint;
				                                    }
				                                } else {
				                                    if (isDate){
				                                        tempArrStr = 'Date('+drillOrdArr[c].name + ") = '" + drillOrdArr[c].clickedPoint + "'";
				                                    }else{
				                                        tempArrStr = drillOrdArr[c].name + " = '" + drillOrdArr[c].clickedPoint + "'";
				                                    }
				                                }
				                            }
				                            tempArray.push(tempArrStr);
				                        }
				                        if (tempArray.length > 0 ) {
				                            conStr = tempArray.join( ' And ');
				                        }
				                        chart.options.lang.drillUpText = "Back to " + highestLvl;
				                        // Show the loading label
				                        chart.showLoading("Retrieving data for '" + clickedPoint.toString().toLowerCase() + "' grouped by '" + nextLevel + "'");
				                        //aggregate method
				                        $diginengine.getClient(selectedDB).getAggData(tableName, fieldArr, limit, datasourceId, function(res, status, query) {
				                            if (status) {
				                                drillDownConfig["level"+(level+1)+"Query"] = query;
				                                // filter only the selected fields from the result returned by the service
				                                //filterService.filterAggData(res, $scope.sourceData.filterFields);
				                                angular.forEach(chartObj.series, function(series) {
				                                    if (series.name == selectedSeries) {
				                                        origName = series.origName;
				                                        serName = series.name;
				                                    }
				                                });
				                                for (var key in res[0]) {
				                                    if (Object.prototype.hasOwnProperty.call(res[0], key)) {
				                                        if (key != nextLevel && key == origName) {
				                                            drillObj = {
				                                                name: serName,
				                                                data: [],
				                                                origName: key,
				                                                turboThreshold: 0
				                                            };
				                                        }
				                                    }
				                                }
				                                if (res.length > 0) {
				                                    res.forEach(function(key) {
				                                        if (!isLastLevel) {
				                                            drillObj.data.push({
				                                                name: key[nextLevel],
				                                                y: parseFloat(key[drillObj.origName]),
				                                                drilldown: true
				                                            });
				                                        } else {
				                                            drillObj.data.push({
				                                                name: key[nextLevel],
				                                                y: parseFloat(key[drillObj.origName])
				                                            });
				                                        }
				                                    });
				                                    drillObj['cropThreshold'] = drillObj.data.length;
				                                }
				                                // console.log(JSON.stringify(drillObj));
				                                // $scope.dataToBeBind.receivedQuery = query;
				                                //$scope.$apply();
				                                chart.addSeriesAsDrilldown(e.point, drillObj);
				                            } else {
				                                e.preventDefault();
				                            }

				                            chart.xAxis[0].setTitle({
				                                text: nextLevel
				                            });

				                            chart.yAxis[0].setTitle({
				                                text: selectedSeries
				                            });
				                            
				                            chart.options.customVar = nextLevel;
				                            chart.hideLoading();
				                        }, groupBy, conStr,orderBy);
				                    }
				                },
				                drillup: function(e) {

					                    var chart = this;
					                    drillDownConfig.drillOrdArr.forEach(function(key) {
					                        if (key.nextLevel && key.nextLevel == chart.options.customVar) {
					                            chart.options.customVar = key.name;
					                            chart.xAxis[0].setTitle({
					                                text: chart.options.customVar
					                            });
					                        }
					                    });
					                    // set x and y axis titles (DUODIGIN-914)
					                    var flag = false;
					                    drillDownConfig.drillOrdArr.forEach(function(key) {
					                        if (chart.options.customVar == key.nextLevel) {
					                            chart.options.lang.drillUpText = " Back to " + key.name;
					                            flag = true;
					                        }
					                    });
					                    if (!flag) {
					                        chart.yAxis[0].setTitle({
					                            text: 'values'
					                        });
					                    }
					                },
					                beforePrint: function() {
					                    this.setTitle({
					                        text: this.options.exporting.chartOptions.title.text
					                    })
					                    this.heightPrev = this.chartHeight;
					                    this.widthPrev = this.chartWidth;
					                    if (this.drillUpButton !== undefined) this.drillUpButton = this.drillUpButton.destroy();
					                    this.setSize(800, 600, false);
					                },
					                afterPrint: function() {
					                    this.setTitle({
					                        text: null
					                    })
					                    this.setSize(this.widthPrev, this.heightPrev, true);
					                    if (this.drilldownLevels.length != 0) this.showDrillUpButton();
					                }
				            	
				            };

							callback(chartObj,query);





                    	},groupBySortArray[0].displayName,connection,groupBySortArray[0].sortName);

					}
				});
			}
			
		},
		// execute query to generate chart
		// method by: Dilani Maheswaran
		executeQuery: function(chartObj, query, datasourceId, limit, offset, selectedDB,callback) {
			$diginengine.getClient(selectedDB).getExecQuery(query, datasourceId, function(res, status, message){
				var category = "";
				var series, c;
                for (c in res[0]) {
                    if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                        if (typeof res[0][c] == "string") category = c;
                    }
                }
				// send drilled parameter as false
				series = chartUtilitiesFactory.mapChartData(res,category,false);
				chartObj.series = series;
				callback(chartObj);
			},limit,offset)
		},
		reRender: function(highChartType, highchartObject, callback) {
			highchartObject.options.chart.type = highChartType;
			callback(highchartObject);
			
		},
		getHighestLevel: function(){

		},
		highchartValidations: function(highChartType, selectedSeries, selectedCategory){ //this function will validate all the prerequirments needs to satisfy to create a given highcart type 
			
			var isChartConditionsOk = false;

			switch (highChartType) {
                case "pie":
						if(selectedSeries.length == 1 && selectedCategory.length > 0 )
							isChartConditionsOk = true;
						else
							notifications.toast(2,"Please check the requirements for generate a pie chart");
                  break;
                 case "bar":
						if(selectedSeries.length > 0 && selectedCategory.length > 0 )
							isChartConditionsOk = true;
						else
							notifications.toast(2,"Please check the requirements for generate a "+highChartType+" chart");
                   	break;
                  case "column":
						if(selectedSeries.length > 0 && selectedCategory.length > 0 )
							isChartConditionsOk = true;
						else
							notifications.toast(2,"Please check the requirements for generate a "+highChartType+" chart");
                   	break;
                   case "line":
						if(selectedSeries.length > 0 && selectedCategory.length > 0 )
							isChartConditionsOk = true;
						else
							notifications.toast(2,"Please check the requirements for generate a "+highChartType+" chart");
                   	break;
                   	case "spline":
						if(selectedSeries.length > 0 && selectedCategory.length > 0 )
							isChartConditionsOk = true;
						else
							notifications.toast(2,"Please check the requirements for generate a "+highChartType+" chart");
                   	break;
                   	case "area":
						if(selectedSeries.length > 0 && selectedCategory.length > 0 )
							isChartConditionsOk = true;
						else
							notifications.toast(2,"Please check the requirements for generate a "+highChartType+" chart");
                   	break;
                   	case "areaspline":
						if(selectedSeries.length > 0 && selectedCategory.length > 0 )
							isChartConditionsOk = true;
						else
							notifications.toast(2,"Please check the requirements for generate a "+highChartType+" chart");
                   	break;
                   	case "scatter":
						if(selectedSeries.length > 0 && selectedCategory.length > 0 )
							isChartConditionsOk = true;
						else
							notifications.toast(2,"Please check the requirements for generate a "+highChartType+" chart");
                   	break;
                default:
	                break;
	        }


			return isChartConditionsOk;
		},//end of highchartValidations
		
   }
}]);

// utility services for highcharts
// owner : Dilani Maheswaran
// Date: 13/03/2017
DiginHighChartsModule.factory('chartUtilitiesFactory',[function(){
	return{
		// set chart series
		mapChartData: function(res, category,isDrilled) {
			// res : result array from getAggData and getExecQuery
			// category : x-axis value string
			// isDrilled : enable / disable drilldown
			var serArr = [];
			for (var c in res[0]) {
				if (Object.prototype.hasOwnProperty.call(res[0], c)) {
					if (c.toLowerCase() != category)
					{
						// maintain origName to map with server response - static
						// maintain name to give flexibility to the user - variable
						serArr.push({
							name: c,
							data: [],
							origName: c
						})
					}
				}
			}
			// fill the series data
			angular.forEach(res,function(value){
				console.log(value);
				angular.forEach(serArr,function(series){
					series.data.push({
						name: value[category].toString(),
						y: parseFloat(value[series.origName]),
						drilldown: isDrilled
					})
				})
			})
			return(serArr);
		},
		//remove all series of highcharts
		removeAllSeries: function(chartObj) {
			var chart = chartObj.getHighcharts();
			for(var i = 0; i < chart.series.length; i++) {
				chart.series[i].remove();
			}
			return(chartObj);
		},
		//remove data from chart
		removeDataPoints: function(chartObj) {
			var chart = chartObj.getHighcharts();
		},
		//set data points
		setDataPoints: function(chartObj,res) {
			var chart = chartObj.getHighcharts();
		}
	}
}]);
//END OF DiginServices
