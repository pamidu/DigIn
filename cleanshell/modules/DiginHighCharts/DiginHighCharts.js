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
			if(scope.idSelector == widget.widget.widgetData.widgetID)
			{
				var height = widget.element[0].clientHeight - 50;
				var width = widget.element[0].clientWidth;
				$('#'+widget.widget.widgetData.widgetID).highcharts().setSize(width, height, true);
			}
			
		});
	} //end of link
  };
}]);

//This directive runs whenever a gridster item is initialized
DiginHighChartsModule.directive('gridsterItemInitalizeWatcher',['$timeout', function ($timeout) {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
			scope.chartType = "";
			attrs.$observe('widgetType', function(result) {
				scope.chartType = result;
			});
            scope.$on('gridster-item-initialized', function (event, item) {
				
				$timeout(function(){ //wait 100 milliseconds until the dom element is added
					var widgetID="";
					if(scope.chartType == "highCharts" || scope.chartType == 'forecast' || scope.chartType == "histogram" )
					{
						widgetID = item.$element[0].children[2].children[0].children[0].getAttribute('id');
						$('#'+widgetID).highcharts().setSize(item.getElementSizeX(), item.getElementSizeY() - 50, true);
					}else if(scope.chartType == 'metric'){
						widgetID = item.$element[0].children[2].children[0].getAttribute('id-selector');
						$('#'+widgetID).highcharts().setSize(item.getElementSizeX() / 1.8, item.getElementSizeY() - 50, true);
					}else if(scope.chartType == 'whatif'){
						var height = item.getElementSizeY() - 50;
						var whatIfId = item.$element[0].children[2].children[0].getAttribute('id-selector');
						angular.element('#'+whatIfId).css('height',height+'px');
					}else if(scope.chartType == 'tabular'){
						var height = item.getElementSizeY() - 50;
						var tabularId = item.$element[0].children[2].children[0].getAttribute('id-selector');
						angular.element('#'+tabularId).css('height',height+'px');
					}
				}, 100);
				
				$timeout(function(){ //wait 100 milliseconds until the dom element is added
				     var widgetID="";
				     if(scope.chartType == "highCharts" || scope.chartType == 'forecast' || scope.chartType == "histogram")
				     {
				      widgetID = item.$element[0].children[2].children[0].children[0].getAttribute('id');
				      $('#'+widgetID).highcharts().setSize(item.getElementSizeX(), item.getElementSizeY() - 50, true);
				     }else if(scope.chartType == 'metric'){
				      widgetID = item.$element[0].children[2].children[0].getAttribute('id-selector');
				      $('#'+widgetID).highcharts().setSize(item.getElementSizeX() / 1.8, item.getElementSizeY() - 50, true);
				     }else if(scope.chartType == 'whatif'){
						var height = item.getElementSizeY() - 50;
						var whatIfId = item.$element[0].children[2].children[0].getAttribute('id-selector');
						angular.element('#'+whatIfId).css('height',height+'px');
					 }else if(scope.chartType == 'tabular'){
						var height = item.getElementSizeY() - 50;
						var tabularId = item.$element[0].children[2].children[0].getAttribute('id-selector');
						angular.element('#'+tabularId).css('height',height+'px');
					}
				}, 1500);

            });
        }
    };
}]);

DiginHighChartsModule.directive('diginHighchartsSettings',['$rootScope','$compile','notifications', 'generateHighchart', 
	function($rootScope,$compile,notifications,generateHighchart) {
    return {
         restrict: 'E',
         templateUrl: 'modules/DiginHighCharts/highChartsSettings.html',
         scope: {
			highchartSetting: '=',
			groupBySortarray : '=',
			selectedAttributes: '=',
			widgetConfig: '=',
			chartType: '=',
			submitForm: '&',
			selectedSerie: '='
          },
         link: function(scope,element){

         	if (angular.equals(scope.widgetConfig, {})) {
				scope.widgetConfig = generateHighchart.initializeChartObject(scope.chartType);
				var newElement = $compile('<digin-high-chart config="widgetConfig" ></digin-high-chart>')(scope);
				element.find('.currentChart').append(newElement);
         	}
			scope.submit = function()
			{
				// set the sries colour from settingsConfig
				  for(var i=0; i < scope.widgetConfig.series.length; i++){
				  	scope.widgetConfig.series[i].color = scope.highchartSetting.seriescolourArr[i].color;
				  }
				if(scope.hightChartSettingsForm.$valid)
				{
					scope.submitForm();
				}else{
					notifications.toast(2,"Invalid form");
				}
			}
			scope.groupBySortarray;
			scope.restoreSettings = function()
			{
				scope.highchartSetting.widgetName = "Default";
				scope.switch = false;

				angular.forEach(scope.highchartSetting.seriescolourArr, function(series, key){
				 	series.color = "#7cb5ec";
				 	series.name = scope.selectedSerie[key].name;
				});

				scope.widgetConfig.xAxis.title.text ="";
				scope.widgetConfig.yAxis.title.text ="";

				angular.forEach(scope.groupBySortarray, function(arr, key){
				 	arr.sortName = arr.displayName;
				});

			}

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
                                color: chartFontColor,
                                format: '<b> {point.name}</b>',
				                style: {
				                    textShadow: false,
				                    textOutline: false
				                }
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b> ( {point.y:,.0f} )',
                                    color: chartFontColor,
                                    softConnector: true
                                }
                            },
                            showInLegend: false,
                            tooltip: {
                                pointFormat: '{series.name}: {point.percentage:,.2f}%'
                            }
                        }
                    },
					legend: {
			        itemStyle: {
			            color: chartFontColor
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
					type: 'category',
					title: {
						style: {
							color: chartFontColor
						},
						text: ''
					}
				},
				title: {
					text: '',
					style: {
						color: chartFontColor
					}
				},
                yAxis: {
					lineColor: chartFontColor,
					tickColor: chartFontColor,
					labels: {
						style: {
							color: chartFontColor
						}
					},
                    lineWidth: 1,
					title: {
						style: {
							color: chartFontColor
						},
						text: ''
					}
                },
                credits: {
                    enabled: false
                },
				series: []
			};
			return highchartObject;
		},
		generateCustomQuery: function(query,chartObj, highChartType, tableName, limit, selectedDB, callback){

			if (typeof query != "undefined") {

			}
		},
		// build the highchart with data
		generate: function(chartObj, highChartType, tableName, selectedSeries, selectedCategory,limit, selectedDB, isDrilled,groupBySortArray, callback, connection, allFields,reArangeArr,isCreate) {
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

			var table = "";
			var datasource = "";
			
			table = tableName.datasource_name;
			datasource = tableName.datasource_id;

			if(!isDrilled){
				$diginengine.getClient(selectedDB).getAggData(table, fieldArr, limit, datasource, function(res, status, query) {
					if (status) {

						if(groupBySortArray[0].displayName != groupBySortArray[0].sortName){
							for(var g=0; g< res.length; g++){
				            	delete res[g][groupBySortArray[0].sortName];
				            }
						}

						var series = [];
						series = chartUtilitiesFactory.mapChartData(res,groupBySortArray[0].displayName,isDrilled);
						// highcharts-ng internally calls the setSeries API when series is set
						if (isCreate)
							chartObj.series = series;
						else
							chartUtilitiesFactory.updateSeries(res,groupBySortArray[0].displayName,isDrilled,chartObj);


						
						callback(chartObj,query);
					} else {
						notifications.toast(0,'Error. Please try again.');
						callback(chartObj,'');
					}
				},groupBySortArray[0].displayName,connection,groupBySortArray[0].sortName);
			} else {

				var catArr = [];
				var drillOrderArr = [];

				selectedCategory.forEach(function(cat) {
				    catArr.push("%27" +cat.name +"%27");
				});

				$diginengine.getClient(selectedDB).getHighestLevel(table, catArr.toString() ,datasource,function(res, status){
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

                    	$diginengine.getClient(selectedDB).getAggData(table, fieldArr, limit, datasource, function(res, status, query) {

                    		if(groupBySortArray[0].displayName != groupBySortArray[0].sortName){
								for(var g=0; g< res.length; g++){
					            	delete res[g][groupBySortArray[0].sortName];
					            }
							}

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
					                currentLevel: 1,
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
				                            id = "",
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
				                        // todo
				                        // do not send if value has been already selected in the previous level
				                        if (connection != '') {
				                        	conStr += ' And ' + connection;
				                        }

				                        chart.options.lang.drillUpText = "Back to " + highestLvl;
				                        // Show the loading label
				                        chart.showLoading("Retrieving data for '" + clickedPoint.toString().toLowerCase() + "' grouped by '" + nextLevel + "'");
				                        //aggregate method
				                        $diginengine.getClient(selectedDB).getAggData(table, fieldArr, limit, datasource, function(res, status, query) {
				                            if (status) {
				                                drillDownConfig["level"+(level+1)+"Query"] = query;
				                                // filter only the selected fields from the result returned by the service
				                                //filterService.filterAggData(res, $scope.sourceData.filterFields);
				                                angular.forEach(chartObj.series, function(series) {
				                                    if (series.name == selectedSeries) {
				                                        id = series.id;
				                                        serName = series.name;
				                                    }
				                                });
				                                for (var key in res[0]) {
				                                    if (Object.prototype.hasOwnProperty.call(res[0], key)) {
				                                        if (key != nextLevel && key == id) {
				                                            drillObj = {
				                                                name: serName,
				                                                data: [],
				                                                id: key,
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
				                                                y: parseFloat(key[drillObj.id]),
				                                                drilldown: true
				                                            });
				                                        } else {
				                                            drillObj.data.push({
				                                                name: key[nextLevel],
				                                                y: parseFloat(key[drillObj.id])
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

							callback(chartObj,query,drillDownConfig);





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
		assignChartEvents: function (chartObj,fieldArr,drillDownConfig,groupBySortArray,allFields,connection) {
			chartObj.options.chart.events = {
            	drilldown: function(e) {
                    if (!e.seriesOptions) {
                        var srcTbl = drillDownConfig.srcTbl,
                            fields = fieldArr,
                            drillOrdArr = drillDownConfig.drillOrdArr,
                            chart = this,
                            clientObj = drillDownConfig.clientObj,
                            clickedPoint = e.point.name,
                            nextLevel = "",
                            highestLvl = this.options.customVar,
                            drillObj = {},
                            isLastLevel = false,
                            selectedSeries = e.point.series.name,
                            id = "",
                            tempArrStr = "",
                            serName = "";
                            var conStr = "";
                            var level;
                            var tempArray = [];
                            var isDate;
                            var groupBy;
                            var orderBy;
                            var table,datasource_id;
			
                        // var cat = [];
                        for (var i = 0; i < drillOrdArr.length; i++) {
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
							table = drillDownConfig.srcTbl.datasource_name;
							datasource_id = drillDownConfig.srcTbl.datasource_id;
                            if (drillDownConfig.dataSrc == "MSSQL") {
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
                        // todo
                        // do not send if value has been already selected in the previous level
                        if (connection != '') {
                        	conStr += ' And ' + connection;
                        }

                        chart.options.lang.drillUpText = "Back to " + highestLvl;
                        // Show the loading label
                        chart.showLoading("Retrieving data for '" + clickedPoint.toString().toLowerCase() + "' grouped by '" + nextLevel + "'");
                        //aggregate method
                        $diginengine.getClient(drillDownConfig.dataSrc).getAggData(table, drillDownConfig.fields, 1000, datasource_id, function(res, status, query) {
                            if (status) {
                                drillDownConfig["level"+(level+1)+"Query"] = query;
                                // filter only the selected fields from the result returned by the service
                                //filterService.filterAggData(res, $scope.sourceData.filterFields);
                                angular.forEach(chartObj.series, function(series) {
                                    if (series.name == selectedSeries) {
                                        id = series.id;
                                        serName = series.name;
                                    }
                                });
                                for (var key in res[0]) {
                                    if (Object.prototype.hasOwnProperty.call(res[0], key)) {
                                        if (key != nextLevel && key == id) {
                                            drillObj = {
                                                name: serName,
                                                data: [],
                                                id: key,
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
                                                y: parseFloat(key[drillObj.id]),
                                                drilldown: true
                                            });
                                        } else {
                                            drillObj.data.push({
                                                name: key[nextLevel],
                                                y: parseFloat(key[drillObj.id])
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
			}
		}
		
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
					if (c.toLowerCase() != category.toLowerCase())
					{
						// maintain id to map with server response - static
						// maintain name to give flexibility to the user - variable
						serArr.push({
							id: c,
							name: c,
							data: []
						})
					}
				}
			}
			// fill the series data
			angular.forEach(res,function(value){
				angular.forEach(serArr,function(series){
					series.data.push({
						name: value[category].toString(),
						y: parseFloat(value[series.id]),
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
			for(var i = 0; i < chart.series.length; i++) {
				chart.series[i].setData([]);
			}
		},
		//set data points
		setDataPoints: function(chartObj,res) {
			var chart = chartObj.getHighcharts();
		},
		updateSeries: function(res,category,isDrilled,widgetConfig) {
            // send drilled parameter as false - temporary
            var seriesArray = this.mapChartData(res,category,isDrilled);

            // get all the chart object
            var chartObject = widgetConfig.getHighcharts();

            angular.forEach(seriesArray,function(newSeries) {
                angular.forEach(widgetConfig.series,function(series) {
                    if (newSeries.id == series.id) {
                        // get the relevant series and update data retaining all configs
                        chartObject.get(series.id).setData(newSeries.data);
                    }
                });
            });
		}
	}
}]);
//END OF DiginServices
