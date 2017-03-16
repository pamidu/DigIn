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

DiginHighChartsModule.factory('generateHighchart', ['$rootScope','$diginengine','DiginServicesM','notifications', function($rootScope,$diginengine,DiginServicesM,notifications) {
	return {
		generate: function(highChartType, tableName, selectedSeries, selectedCategory,limit, datasourceId, selectedDB, callback) {
			
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
			
			//format selected series
			var fieldArr = [];
			for(var i = 0; i < selectedSeries.length; i++){
				fieldArr.push({
					field: selectedSeries[i].name,
					agg: selectedSeries[i].aggType
				});
			}
			
			
			$diginengine.getClient(selectedDB).getAggData(tableName, fieldArr, limit, datasourceId, function(res, status, query) {
				if (status) {
					var categories = [];
					var series = [];
					for(var i = 0; i < res.length; i++){
						categories.push(res[i][selectedCategory[0].name]);
						series.push(res[i][selectedSeries[0].aggType.toLowerCase()+"_"+selectedSeries[0].name]);
					}
					var res = createChartObject(categories, series);
					callback(res);
					//return categories;
				}else{
					console.log(res);
				}

			},[selectedCategory[0].name]);
			
			var highchartObject = {};
			
			function createChartObject(categories, series)
			{

				highchartObject = {
					options: {
						  chart: {
								type: highChartType,
								backgroundColor: chartBackgroundColor
							}
					},
						  xAxis: {
							categories: categories,
							lineColor: chartFontColor,
							tickColor: chartFontColor,
							labels: {
								 style: {
									color: chartFontColor
								 }
							}
						  },
					  series: [{
						data: series,
						style: {
							color: chartFontColor
						 },
						 labels: {
								 style: {
									color: chartFontColor
								 }
							}
					  }],
					title: {
						text: 'Sales',
						style: {
							color: chartFontColor
						}
					}
				};
				return highchartObject;
			};
				
			
			// return DiginServicesM.addOne(2);
		},//end of generate
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
}]);//END OF DiginServices