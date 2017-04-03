/*!
* DiginHighCharts: v0.0.1
* Authour: Dilshan
*/

'use strict';

var MetricModule = angular.module('Metric',['DiginServiceLibrary']);


MetricModule.directive('metric',['$rootScope','notifications','generateMetric','$timeout', function($rootScope,notifications,generateMetric,$timeout) {
	return {
        restrict: 'E',
        templateUrl: 'modules/Metric/metric.html',
        scope: {
           	config: '=',
           	settings:'=',
           	notification_data:'=',
			idSelector: '@'
         },
        link: function(scope,element){
    		$timeout(function(){ //wait 100 milliseconds until the dom element is added

				//var widgetID = item.$element[0].children[2].children[0].children[0].getAttribute('id');
				$('#'+scope.idSelector).highcharts().setSize(200, 150, true);
				
			}, 200);

        } //end of link
    };
}]);

MetricModule.directive('metricSettings',['$rootScope','notifications','generateMetric', function($rootScope,notifications,generateMetric) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Metric/metricSettings.html',
         scope: {
			metricSettings: '=',
			attr:'=',
			submitForm: '&'
          },
         link: function(scope,element){
			console.log(scope.metricSettings);


			var keys = Object.keys(scope.metricSettings);
            var len = keys.length;

            if(len !=1 ){

            }
            else
            {
               var metricSettings={};
               scope.metricSettings = {
               		widgetName : scope.metricSettings.widgetName,
               		scale:'',
               		scalePosition:'Back',
               		decimal:2,
               		format:'General',
               		actualValue:0,
               		targetValue:0,
               		groupBy:'Month',
               		timeAttribute:'',
               		notificataionValue:0,
               		colorType:'high',
               		colorTheme:'rog',
               		dateAttrs:scope.attr
               }
           	}
			
			scope.submit = function()
			{
				if(scope.metricSettingsForm.$valid)
				{
					console.log(scope.mapSettings);
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

MetricModule.factory('generateMetric', ['$rootScope','$diginengine','notifications', function($rootScope,$diginengine,notifications) {    
    return {
		doSomething : function(param) {
			return true;
        },
        metricValidations: function(settings){
			var isChartConditionsOk = false;

			if(!settings.actual){
				notifications.toast(2,"Please select actual value");
			}
			else if(!settings.target){
				notifications.toast(2,"Please select target value");
			}
			else if(settings.actual.length>1){
				notifications.toast(2,"Please select only one actual value");
			}
			else if(settings.target.length>1){
				notifications.toast(2,"Please select only one target value");
			}
			else if (settings.groupBy.length > 0 ) {
	            if (settings.timeAttribute == "") {
	                notifications.toast(2,'Please select the time attribute for trend.');
	            }   
	            else{
	            	isChartConditionsOk = true;
	            } 
			}      	      
			else if (settings.groupByField == "") {
	                notifications.toast(2,'Please select group by attribute for trend.');
	        }
			else{
				isChartConditionsOk = true;
			}

			return isChartConditionsOk;		
		},
		generate: function(highChartType, tableName, limit, datasourceId, selectedDB,settings,notification_data, callback){
			//#Change chart background colours according to theme
            var chartBackgroundColor = "";
            var chartFontColor = "";
            

            if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark") {
                chartBackgroundColor = "rgb(48,48,48)";
                chartFontColor = '#fff';
            }else{
                chartBackgroundColor = "rgb(250,250,250)";
            }	

        	//#initialize chart object
        	var metricObj= {
                color: 'white',
                actualValue:'',
                targetValue:'',
                rangeSliderOptions: {
                    minValue: 0,
                    maxValue: 300,
                    options: {
                        floor: 0,
                        ceil: 300,
                        step: 1,
                        translate: function(value) {
                          return value + '%';
                        }
                    }
                },
                colorTheme: "",
                lowerRange: 0,
                higherRange: 33852,
                trendChart: {
                    options: {
                        chart: {
                        backgroundColor: 'transparent'
                    },
                    xAxis: {
                        showEmpty: false,
                        lineWidth: 1,
                        lineColor: 'white',
                        labels:{
                          enabled:false//default is true
                        },
                       minorGridLineWidth: 0,
                       minorTickLength: 0,
                       tickLength: 0
                    },
                    exporting: {
                             enabled: false
                    },
                    yAxis: {
                        showEmpty: false,
                        lineWidth: 1,
                        lineColor: 'white',
                        min: 0,
                        gridLineWidth: 0,
                        title: {
                          text: ''
                        },
                        labels:{
                          enabled:false//default is true
                        }
                    },
                    credits: {
                      enabled: false
                    },
                    tooltip: {
                        enabled:false
                    },
                    plotOptions: {
                        series: {
                            enableMouseTracking: false
                        },
                        line: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    legend: {
                                enabled: false
                    }
                    },
                    size: {
                        height: null,
                        width:null
                    },
                    series: [],
                    title: {
                        text: ''
                    }
                }
            };



            //# Select target value - START --------------------------------------------------------------------------------------
            var queryTarget;
            var filterStr = "";
            var targetFieldArr = [{
                field: settings.target[0].name,
                agg: settings.target[0].aggType,
            }]

            // apply design mode filters to metric
            var filterArray = [];
            //filterArray = filterService.generateDesginFilterParams($scope.sourceData.filterFields,$scope.sourceData.src);
            //if (filterArray.length > 0) {
            //   filterStr = filterArray.join( ' And ');
            //}

            $diginengine.getClient(selectedDB).getAggData(tableName, targetFieldArr,limit, datasourceId, function(res, status, query) {
                if (status) {
                    metricObj.targetQuery = query;
	                metricObj.targetValue = res[0][Object.keys(res[0])[0]];
	                settings.targetValue =metricObj.targetValue;
	                var actual= getActual();

                } else {
                    
                }
            },undefined,undefined,filterStr);


        
            function getActual(){
            	// Select actucal value - END --------------------------------------------------------------------------------------
	            var queryActual;
	            var filterStr = "";
	            var actualFieldArr = [{
	                field: settings.actual[0].name,
	                agg: settings.actual[0].aggType,
	            }]
	            
	            // apply design mode filters to metric
	            var filterArray = [];
	            /*
	            filterArray = filterService.generateDesginFilterParams($scope.sourceData.filterFields,$scope.sourceData.src);
	            if (filterArray.length > 0) {
	                filterStr = filterArray.join( ' And ');
	            }*/
	            $diginengine.getClient(selectedDB).getAggData(tableName, actualFieldArr,limit, datasourceId, function(res, status, query) {
	                if (status) {
	                    metricObj.queryActual = query;
	                    metricObj.actualValue = res[0][Object.keys(res[0])[0]];
	                    settings.actualValue = metricObj.actualValue;
	                    getTrendValues(actualFieldArr);
	                } else {
	                }
	            },undefined,undefined,filterStr);
	            

            // Select target value - END --------------------------------------------------------------------------------------
            }


            function getTrendValues(actualFieldArr){
		         // apply design mode filters to metric
		        /*var filterArray = [];
	            var filterStr = "";
	            filterArray = filterService.generateDesginFilterParams($scope.sourceData.filterFields,$scope.sourceData.src);
	            if (filterArray.length > 0) {
	                filterStr = filterArray.join( ' And ');
	            }*/

		        $diginengine.getClient(selectedDB).getAggData(tableName, actualFieldArr,limit, datasourceId, function(res, status, query) {
		                if (status) {
		                    metricObj.trendQuery = query;
		                    //metricChartServices.applyMetricSettings($scope.selectedChart);
		                    //metricChartServices.mapMetricTrendChart($scope.selectedChart,nameSpace,res);
		                    createMetricConfig(status, query,res);
		                } else {
		                }
		        },'date',filterStr);
            }



            
            function createMetricConfig(status, query,trendValue){
            	//---------------------------------
            	var nameSpace = settings.target[0].aggType.toLowerCase() + "_" +settings.target[0].name ;
				var seriesData = [];
		        var tempArr = [];
		        var units;
			    
		        metricObj.groupBy='date'; //delete
		        metricObj.timeAttribute='month';//delete

		        angular.forEach(trendValue,function(key){
		            var utc = moment(key[metricObj.groupBy]).utc().valueOf();
		            tempArr = [utc,key[nameSpace]];
		            seriesData.push(tempArr);
		        });
		        if (metricObj.timeAttribute == 'quarter') {
		            units = [['month',[3]]];
		        } else {
		            units = [[metricObj.timeAttribute,[1]]];
		        }
		        if (metricObj.color == 'white') {
			        metricObj.trendChart.series = [{
			            data: seriesData,
			            color: 'black',
			            dataGrouping: {
			                approximation: "sum",
			                enabled: true,
			                forced: true,
			                units: units
			            },
			            turboThreshold: 0,
			            cropThreshold: trendValue.length
			        }]
			        metricObj.trendChart.options.xAxis.lineColor = 'black';
			        metricObj.trendChart.options.yAxis.lineColor = 'black';
		        } else {
			        metricObj.trendChart.series = [{
			            data: seriesData,
			            color: 'white',
			            dataGrouping: {
			                approximation: "sum",
			                enabled: true,
			                forced: true,
			                units: units
			            },
			            turboThreshold: 0,
			            cropThreshold: trendValue.length
			        }]
			        metricObj.trendChart.options.xAxis.lineColor = 'white';
			        metricObj.trendChart.options.yAxis.lineColor = 'white';
		        }
	


            	//-----------------------------------
            	applySettings(status, query,trendValue);              	
            } 



            function applySettings(status, query,trendValue) {
			    //if (typeof metricObj.actualValue != "number") //var value = parseInt(metricObj.actualValue.replace(/,/g,''));

			    var highRange = metricObj.targetValue * metricObj.rangeSliderOptions.maxValue / 100;
			    var lowerRange = metricObj.targetValue * metricObj.rangeSliderOptions.minValue / 100;

					if (metricObj.actualValue <= lowerRange) {
			        	if (settings.colorTheme == "rog") {
				            if (ssettings.targetRange == "high") {
				                settings.color = "#FF5252"
				            } else {
				                settings.color = "#4CAF50"
				            }
				        } else if (settings.colorTheme == "cgy") {
				            if (settings.targetRange == "high") {
				                settings.color = "#1abc9c"
				            } else {
				                settings.color = "yellowgreen"
				            }
				        } else if (settings.colorTheme == "opg") {
				            if (settings.targetRange == "high") {
				                settings.color = "#F9A937"
				            } else {
				                settings.color = "#4CAF50"
				            }
				        }
				    } else if (metricObj.actualValue >= highRange) {
				        if (settings.colorTheme == "rog") {
				            if (settings.targetRange == "high") {
				                settings.color = "#4CAF50"
				            } else {
				                settings.color = "#FF5252"
				            }
				        } else if (settings.colorTheme == "cgy") {
				            if (settings.targetRange == "high") {
				                settings.color = "yellowgreen"
				            } else {
				                settings.color = "#1abc9c"
				            }                    
				        } else if (settings.colorTheme == "opg") {
				            if (settings.targetRange == "high") {
				                settings.color = "#4CAF50"
				            } else {
				                settings.color = "#F9A937"
				            }
				        }
				    } else {
				        if (settings.colorTheme == "rog") {
				            settings.color = "#F9A937"
				        } else if (settings.colorTheme == "cgy") {
				            settings.color = "#4CAF50"
				        } else if (settings.colorTheme == "opg") {
				            settings.color = "#8e44ad"
				        }
				    }

				    //# set notification object---------------------
					var notification_data={
		              "notification_id": null,
		              "actual_value": metricObj.queryActual,
		              "target_value": metricObj.targetValue,
		              "trigger_type": settings.colorType,
		              "is_tv_constant": true,
		              "dashboard_name": "",
		              "widget_name": settings.widgetName,
		              "dbname": selectedDB,
		              "datasource_id": datasourceId,
		              "page_id": "",
		              "widget_id": "",
		              "prefix": settings.scale,
		              "prefix_position": settings.scalePosition
		            }
					//# -------------------------------------------

			    callback(status, query, metricObj,settings,notification_data);
			}
		}
	}
}]);//END OF generateMetric
