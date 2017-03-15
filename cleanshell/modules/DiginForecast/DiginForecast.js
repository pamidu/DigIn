/*!
* DiginHighCharts: v0.0.1
* Authour: Chamila Dilhani
*/

'use strict';

var DiginForecastsModule = angular.module('DiginForecasts',['DiginServiceLibrary']);


DiginForecastsModule.directive('diginForecastSettings',['$rootScope','notifications', function($rootScope,notifications) {
    return {
         restrict: 'E',
         templateUrl: 'modules/DiginForecast/forecastSettings.html',
         scope: {
           forecastObj: '='
          },
         link: function(scope,element){

            //var intDate = new Date();
            var intDate =  new Date();

            //dsfsfsdfdsg


            //notifications.log(moment(intDate).format('YYYY-MM-DD'), new Error());
            //moment(intDate).format('YYYY-MM-DD')
            var forecastObj={};
            var widget={};
            widget.widgetData={};
            var forecastAtt="";
            var showActual=false;

            scope.forecastObj = {
                paramObj: {
                    method: "Additive",
                    model: "triple exponential smoothing",
                    mod: "triple_exp",
                    alpha: "",
                    beta: "",
                    gamma: "",
                    a: "",
                    b: "",
                    g: "",
                    fcast_days: 12,
                    tbl: "",
                    date_field: "",
                    f_field: "",
                    len_season: 12,
                    interval: "Monthly",
                    startdate: intDate,
                    enddate: intDate,
                    forecastAtt: forecastAtt,
                    showActual: showActual,
                }
            };
          
         } //end of link
    };
}]);


DiginForecastsModule.directive('diginForecast',['$rootScope', function($rootScope) {
    return {
    	restrict: 'E',
    	template: '<highchart config="config"></highchart>',
    	scope: {
    			config: '='
    		},
    	link: function(scope,element){
    		scope.$apply(function(){
    			console.log(scope.config);
    		});	
    	}
    };
}]);


DiginForecastsModule.factory('generateForecast', ['$rootScope','$diginengine','notifications', function($rootScope,$diginengine,notifications) {
	return {
		generate: function(highChartType, tableName, selectedSeries, selectedCategory,limit, datasourceId, selectedDB,forecastObj, callback){

			//#Change chart background colours according to theme
			var chartBackgroundColor = "";
			var chartFontColor = "";
			
			if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
			{
				chartBackgroundColor = "rgb(48,48,48)";
				chartFontColor = '#fff';
			}else{
				chartBackgroundColor = "rgb(250,250,250)";
			}


            forecastObj.paramObj.startdate =  moment(forecastObj.paramObj.startdate).format('YYYY-MM-DD');
            forecastObj.paramObj.enddate =  moment(forecastObj.paramObj.enddate).format('YYYY-MM-DD');

            notifications.log(forecastObj,new Error());
            
			//#Create initial object
			if (forecastObj.paramObj.interval == "Yearly") {
        		forecastObj.paramObj.fcast_days = 1;
	        } else if (forecastObj.paramObj.interval == "Daily") {
	            forecastObj.paramObj.fcast_days = 7;
	        } else if (forecastObj.paramObj.interval == "Monthly") {
	            forecastObj.paramObj.fcast_days = 12;
	        }

	        widget.widgetData.highchartsNG = {};
	        widget.widgetData.highchartsNG = {
	            title: {
	                text: ''
	            },
	            credits: {
	                enabled: false
	            }
	        };
	        //$scope.eventHndler.isLoadingChart = true;

	        if(typeof widget.widgetData.namespace == "undefined"){ 
	            var namespace = $rootScope.authObject.Email.replace('@', '_'); 
	            namespace=$rootScope.authObject.Email.replace(/[@.]/g, '_'); 

	            widget.widgetData.namespace = namespace;
	        }
				
	        //#Call funtion
	        //$diginengine.getClient.getForcast(fObj,$scope.widget.widgetData,"",$scope.sourceData.id, function(data, status, fObj) {
	        var fObj = forecastObj.paramObj;
	        $diginengine.getClient(selectedDB).getForcast(fObj,widget.widgetData,"",datasourceId, function(data, status, fObj) {
	        	if (status) {
	        		var forcastArr = [];
	                var serArr = [];
	                var catArr = [];
	                var maxDate = "";
    				var minDate = "";
	                
	                maxDate = moment(new Date(data.act_max_date)).format('LL');
	                minDate = moment(new Date(data.act_min_date)).format('LL');

	                forecastObj.paramObj.enddate = moment(new Date(data.max_date)).format('LL');
	                forecastObj.paramObj.startdate = moment(new Date(data.min_date)).format('LL');

	                 // set alpha,beeta, gamma values returned from the service
	                if(data.alpha != ""){
	                    forecastObj.paramObj.alpha = data.alpha.toFixed(3);
	                    forecastObj.paramObj.a = data.alpha.toFixed(3);
	                } 	                
	                if(data.beta != ""){
	                    forecastObj.paramObj.beta = data.beta.toFixed(3);
	                    forecastObj.paramObj.b = data.beta.toFixed(3);
	                }
	                if(data.gamma != ""){
	                    forecastObj.paramObj.gamma = data.gamma.toFixed(3);
	                    forecastObj.paramObj.g = data.gamma.toFixed(3); 
	                }

	                					                // to check wether service has returned any warnings
                if (data.warning != null)
                	console.log(data.warning);
                    //privateFun.fireMessage('0', data.warning);

                //if the service has return a diferent len_season set it
                if (data.len_season != forecastObj.paramObj.len_season) {
                    forecastObj.paramObj.len_season = data.len_season;
                }

                if (fObj.forecastAtt == "") {

                    if (fObj.showActual == false) {
                        var a = data.data.forecast.length - fObj.fcast_days;
                        for (var i = a; i < data.data.forecast.length; i++) {
                            forcastArr.push(data.data.forecast[i]);
                        }
                        data.data.forecast = forcastArr;
                        serArr.push({
                            data: data.data.actual.concat(data.data.forecast),
                            zoneAxis: 'x',
                            zones: [{
                                value: data.data.actual.length - 1
                            }, {
                                dashStyle: 'dash'
                            }]
                        })
                    } else {
                        serArr.push({
                            name: 'Actual',
                            data: data.data.actual,
                        })

                        serArr.push({
                            name: 'Forcasted',
                            data: data.data.forecast,
                            dashStyle: 'dash',
                        })
                    }

                    catArr = data.data.time;
                } else {
                    if (fObj.showActual == false) {
                        Object.keys(data.data).forEach(function(key) {

                            forcastArr = [];

                            var obj = data.data[key];
                            var a = obj.forecast.length - fObj.fcast_days;

                            for (var i = a; i < obj.forecast.length; i++) {
                                forcastArr.push(obj.forecast[i]);
                            }
                            obj.forecast = forcastArr;
                            serArr.push({
                                name: key,
                                data: obj.actual.concat(obj.forecast),
                                zoneAxis: 'x',
                                zones: [{
                                    value: obj.actual.length - 1
                                }, {
                                    dashStyle: 'dash'
                                }]
                            })

                            catArr = obj.time;
                        });

                    } else {
                        Object.keys(data.data).forEach(function(key) {

                            var obj = data.data[key];


                            serArr.push({
                                name: 'Actual  ' + key,
                                data: obj.actual,
                            })

                            serArr.push({
                                name: 'Forcasted  ' + key,
                                data: obj.forecast,
                                dashStyle: 'dash'
                            })

                            catArr = obj.time;
                        });
                    }
                }




	            var data=createForecastObject(widget.widgetData,serArr, catArr );	
				callback(data);
	                		

	        	}
	        	else{

				}
	        });	


	        var forecastWidgetConfig={};

	        function createForecastObject(widgetData,serArr, catArr){
	        	forecastWidgetConfig = {
                    options: {
                        chart: {
                            zoomType: 'x',
                            events: {
                                beforePrint: function() {
                                    this.setTitle({
                                        text: this.options.exporting.chartOptions.title.text
                                    })
                                    this.heightPrev = this.chartHeight;
                                    this.widthPrev = this.chartWidth;
                                    this.setSize(800, 600, false);
                                },
                                afterPrint: function() {
                                    this.setTitle({
                                        text: null
                                    })
                                    this.setSize(this.widthPrev, this.heightPrev, true);
                                }
                            },
                            backgroundColor: chartBackgroundColor
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            sourceWidth: 600,
                            sourceHeight: 400,
                            chartOptions: {
                                title: {
                                    text: widgetData.widName
                                }
                            }
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            pointFormat: '<b> <span style = "color : {series.color}" >  </span> {series.name}: {point.y:,.0f} </b>',
                            useHTML: true
                        }
                    },
                    xAxis: {
                        type: 'datetime',
                        categories: catArr,
                        lineColor: chartFontColor,
						tickColor: chartFontColor,
						labels: {
									style: {
										color: chartFontColor
									}
								}
                    },
                    yAxis: {
                        lineWidth: 1,
                        style: {
							color: chartFontColor
						 },
						 labels:{
								 	style: {
										color: chartFontColor
								 	}
								}
                    },
                    title: {
                        text: '',
                        style:{
								color: chartFontColor
							}
                    },
                    series: serArr
                };

                if (typeof forecastWidgetConfig.series != "undefined") {
                    forecastWidgetConfig.series.forEach(function(key) {
                        if (key.data.length > 1000) key['turboThreshold'] = key.data.length;
                    });
                }
	        	
               return forecastWidgetConfig;	
	        }

            

	        	
		},
		reRender: function(highChartType, forecastWidgetConfig, callback) {
			forecastWidgetConfig.options.chart.type = highChartType;
			callback(forecastWidgetConfig);
			
		}

		
   }
}]);//END OF DiginServices