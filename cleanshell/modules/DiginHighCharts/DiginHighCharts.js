/*!
* DiginHighCharts: v0.0.1
* Authour: Dilshan Liyanage
*/

'use strict';

var DiginHighChartsModule = angular.module('DiginHighCharts',['DiginServiceLibrary','directivelibrary']);

DiginHighChartsModule.directive('diginHighChart',['$rootScope','notifications','$state', function($rootScope,notifications,$state) {
  return {
	restrict: 'E',
	template: '<highchart id="{{idSelector}}" config="config"></highchart>',
	scope: {
			config: '=',
			idSelector: '@'
		},
	link: function(scope,element){
		console.log(element);
		
		if($state.current.name == "query_builder"){
			//scope.$apply(function(){
			//});
		}
		
		scope.$on('widget-resized', function(element, widget) {
			var height = widget.element[0].clientHeight - 50;
			var width = widget.element[0].clientWidth;
			$('#'+widget.element[0].children[2].children[0].getAttribute('id-selector')).highcharts().setSize(width, height, true);
			
		});
		
		
	} //end of link
  };
}]);

DiginHighChartsModule.factory('generateHighchart', ['$rootScope','$diginengine','DiginServicesM','notifications', 'chartUtilitiesFactory',
	function($rootScope,$diginengine,DiginServicesM,notifications,chartUtilitiesFactory) {
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
		generate: function(chartObj, highChartType, tableName, selectedSeries, selectedCategory,limit, datasourceId, selectedDB, isDrilled, callback, connection) {
			// chartObj - Chart configuration Object, highChartType - chart type String
			//format selected series
			var fieldArr = [];
			for(var i = 0; i < selectedSeries.length; i++) {
				fieldArr.push({
					field: selectedSeries[i].name,
					agg: selectedSeries[i].aggType
				});
			}
			$diginengine.getClient(selectedDB).getAggData(tableName, fieldArr, limit, datasourceId, function(res, status, query) {
				if (status) {
					var series = [];
					series = chartUtilitiesFactory.mapChartData(res,selectedCategory[0].name,isDrilled);
					// highcharts-ng internally calls the setSeries API when series is set
					chartObj.series = series;
					callback(chartObj,query);
				} else {
					notifications.toast(0,'Error. Please try again.');
					callback(chartObj,'');
				}
			},[selectedCategory[0].name],connection);
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
		highchartValidations: function(highChartType, selectedSeries, selectedCategory){ //this function will validate all the prerequirments needs to satisfy to create a given highcart type 
			
			var isChartConditionsOk = false;

			switch (highChartType) {
                case "pie":
                	if(selectedSeries.length == 1 && selectedCategory.length > 0 )
                   		isChartConditionsOk = true;
                   	else
                   		notifications.toast(2,"you can't generate a pie chart for more than one series");
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