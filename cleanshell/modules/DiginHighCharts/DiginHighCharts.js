/*!
* DiginHighCharts: v0.0.1
* Authour: Dilshan Liyanage
*/

'use strict';

var DiginHighChartsModule = angular.module('DiginHighCharts',['DiginServiceLibrary']);

DiginHighChartsModule.directive('diginHighChart',['$rootScope', function($rootScope) {
  return {
	restrict: 'E',
	template: '<highchart config="config"></highchart>',
	//templateUrl: 'modules/DiginHighCharts/highChartWidget.html',
	scope: {
			config: '='
		},
	link: function(scope,element){
		//console.log(scope.config);
		scope.$apply(function(){
			console.log(scope.config);
		});
		
		
	} //end of link
  };
}]);

DiginHighChartsModule.factory('generateHighchart', ['$rootScope','$diginengine','DiginServicesM', function($rootScope,$diginengine,DiginServicesM) {
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
				chartBackgroundColor = "white";
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
			
		}
		
   }
}]);//END OF DiginServices