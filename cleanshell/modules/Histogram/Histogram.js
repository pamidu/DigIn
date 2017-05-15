/*!
* Histogram: v0.0.1
* Authour: Dilshan
*/

'use strict';

var HistogramModule = angular.module('Histogram',['DiginServiceLibrary']);


HistogramModule.directive('histogram',['$rootScope','notifications','generateHistogram', function($rootScope,notifications,generateHistogram) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Histogram/histogram.html',
         scope: {
           widgetTemplateObj: '='
          },
         link: function(scope,element){

         } //end of link
    };
}]);

HistogramModule.directive('histogramSettings',['$rootScope','notifications','generateHistogram', function($rootScope,notifications,generateHistogram) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Histogram/histogramSettings.html',
         scope: {
			histogramSettings: '=',
			submitForm: '&'
          },
         link: function(scope,element){
			 
			console.log(scope.histogramSettings);

			if (angular.equals(scope.widgetConfig, {})) {
				scope.widgetConfig = generateHistogram.initializeChartObject(scope.chartType);
				var newElement = $compile('<digin-high-chart config="widgetConfig" ></digin-high-chart>')(scope);
				element.find('.currentChart').append(newElement);
         	}
			scope.submit = function()
			{
				if(scope.histogramSettingsForm.$valid)
				{
					console.log(scope.histogramSettings);
					scope.submitForm();
				}else{
					console.log("invalid");
				}
			}
			
			scope.restoreSettings = function()
			{
				scope.submitForm();
			}



         } //end of link
    };
}]);

HistogramModule.factory('generateHistogram', ['$rootScope','notifications','Digin_Engine_API','$http', function($rootScope,notifications,Digin_Engine_API,$http) {
    

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
						type: 'column',
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
    	generate: function(selectedDB, datasource_name, datasource_id, selectedMeasure, callback) {
			
			console.log(selectedMeasure);
			if (selectedDB == "MSSQL") {
                    selectedMeasure = "'[" + selectedMeasure + "]'";
            } else {
                    selectedMeasure = "'" + selectedMeasure + "'";
            }

            //start of forming url
			var histogramURL = "";
            histogramURL = Digin_Engine_API+"generatehist?q=[{'"+datasource_name+"':["+selectedMeasure+"]}]&dbtype="+selectedDB+"&bins=&datasource_config_id="+datasource_id+"&datasource_id="+datasource_id+"&SecurityToken="+$rootScope.authObject.SecurityToken;
            console.log(histogramURL);

			//end of forming url
			
			$http.get(histogramURL)
			   .then(function(result) {
					callback(result.data);
				},function errorCallback(response) {
					console.log(response);
				});//end of $http
			
		
        },histogramValidations: function(selectedMeasures){
			
			var isValid = true;
            if(selectedMeasures.length == 0 || selectedMeasures.length > 1) {
                notifications.toast(2, "Please select one measure in order to generate Histogram widget.");
                isValid = false;
            }

			return isValid;
		}//end of highchartValidations
	}
}]);//END OF generateWhatIf
