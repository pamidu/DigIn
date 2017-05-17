/*!
* Histogram: v0.0.1
* Authour: Dilshan
*/

'use strict';

var HistogramModule = angular.module('Histogram',['DiginServiceLibrary']);


HistogramModule.directive('histogram',['$rootScope','notifications','generateHistogram', function($rootScope,notifications,generateHistogram) {
	return {
         restrict: 'E',
         template: '<highchart id="{{idSelector}}" config="config"></highchart>',
         scope: {
            config: '=',
            idSelector: '@'

          },
         link: function(scope,element){

            console.log(scope.idSelector);
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

HistogramModule.directive('histogramSettings',['$rootScope','notifications','generateHistogram','$compile', function($rootScope,notifications,generateHistogram,$compile) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Histogram/histogramSettings.html',
         scope: {
			histogramSettings: '=',
			widgetConfig: '=',
			submitForm: '&'
          },
         link: function(scope,element){
			 
			console.log(scope.histogramSettings);

			if (angular.equals(scope.widgetConfig, {})) {
				scope.widgetConfig = generateHistogram.initializeChartObject(scope.chartType);
				var newElement = $compile('<histogram config="widgetConfig"></histogram>')(scope);
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
					legend: {
			        itemStyle: {
			            color: chartFontColor
			        	}
			    	}
				},
				xAxis: {
					lineColor: chartFontColor,
					tickColor: chartFontColor,
					categories:[],
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
				series: [
					{
				        data: [],  
				    }
				]
			};
			return highchartObject;
		},
    	generate: function(selectedDB, datasource_name, datasource_id, selectedMeasure,widgetConfig, callback) {
			
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

			   		var data = result.data.Result;
					for (var key in data) {
                        widgetConfig.series[0].data.push(parseFloat(data[key][0]));
                        //var category = data[key][].splice(1, 1);
                        var category = data[key][1];
                        widgetConfig.xAxis.categories.push(category);
                    }

					callback(widgetConfig);
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


