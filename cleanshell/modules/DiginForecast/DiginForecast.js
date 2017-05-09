/*!
* DiginHighCharts: v0.0.1
* Authour: Chamila Dilhani
*/

'use strict';

var DiginForecastsModule = angular.module('DiginForecasts',['DiginServiceLibrary']);


DiginForecastsModule.directive('diginForecastSettings',['$rootScope','notifications','generateForecast', function($rootScope,notifications,generateForecast) {
    return {
         restrict: 'E',
         templateUrl: 'modules/DiginForecast/forecastSettings.html',
         scope: {
			forecastObj: '=',
			attr:'=',
			measure:'=',
			submitForm: '&'
          },
         link: function(scope,element){

            var intDate =  new Date();

            var keys = Object.keys(scope.forecastObj);
            var len = keys.length;

            if(len !=1 ){

            }
            else
            {
               var forecastObj={};
               scope.forecastObj = {
                //paramObj: {
                    method: "Additive",
                    //model: "triple exponential smoothing",
                    mod: "triple_exp",
                    smoothing:false,
                    alpha: 0,
                    beta: 0,
                    gamma: 0,
                    a: 0,
                    b: 0,
                    g: 0,
                    fcast_days: 12,
                    tbl: "",
                    date_field: "",
                    f_field: "",
                    len_season: 12,
                    interval: "Monthly",
                    startdate: intDate,
                    enddate: intDate,
                    mindate: intDate,
                    maxdate: intDate,
                    selectedSeries:scope.measure,
                    selectedCategory:scope.attr ,
                    groupby:false,
                    forecastAtt: "",
                    showActual: false,
                    isVisual : false,
                    visualstart : intDate,
                    visualend : intDate,
                    widgetName : scope.forecastObj.widgetName,
                    runtimefilterString :"",
                    runtimeQuery:"",
                    designFilterString:"",
                    designtimeQuery:""
                
                //}
                }; 
            }
            
           scope.submit = function()
			{
				if(scope.forecastSettingsForm.$valid)
				{
					scope.submitForm();
				}else{
					//console.log("invalid");
                    notifications.toast(2,'Please fill out the required fields before applying');
				}
			}
			
			scope.restoreSettings = function()
			{
				scope.submitForm();
			}
          
            scope.setAlpahaBetaGamma=function(){
                if(!scope.forecastObj.smoothing){
                    scope.forecastObj.alpha= 0;
                    scope.forecastObj.beta= 0;
                    scope.forecastObj.gamma= 0;
                    scope.forecastObj.a= 0;
                    scope.forecastObj.b= 0;
                    scope.forecastObj.g= 0;
                }
            }


         } //end of link
    };
}]);

DiginForecastsModule.filter('formatdate', function() {
  return function(items) {
    //return moment(new Date(items)).format('YYYY-MM-DD');
    return moment(items).format('YYYY-MM-DD');
    //return moment(new Date(items)).add(1, 'days').toDate();
    //return moment(new Date(items)).add(1, 'days').format('YYYY-MM-DD');
        //return moment(new Date(items)).format('YYYY-MM-DD');
    //return moment(new Date(items)).subtract(1, 'days').toDate();
  };
});

DiginForecastsModule.directive('diginForecast',['$rootScope', function($rootScope) {
    return {
        restrict: 'E',
        template: '<highchart id="{{idSelector}}" config="config"></highchart>',
        scope: {
                config: '=',
                idSelector: '@'
            },
        link: function(scope,element){
            // scope.$apply(function(){
            //  console.log(scope.config);
            // });  

            scope.$on('widget-resized', function(element, widget) {
				if(scope.idSelector == widget.widget.widgetData.widgetID)
				{
					var height = widget.element[0].clientHeight - 50;
					var width = widget.element[0].clientWidth;
					$('#'+widget.element[0].children[2].children[0].getAttribute('id-selector')).highcharts().setSize(width, height, true);
				}
               
            });

        }
    };
}]);


DiginForecastsModule.factory('generateForecast', ['$rootScope','$diginengine','notifications', function($rootScope,$diginengine,notifications) {
    
    return {
        isRequestValidated: function(selectedSeries, selectedCategory){  
            var isRequestValidated = true;

            if(selectedSeries.length == 0){
                notifications.toast(2,"Please select measures.");
                isRequestValidated = false;
            } 
            else if(selectedSeries.length > 1){
                notifications.toast(2,"You can select only one measure.");
                isRequestValidated = false;
            }               
            else if(selectedCategory.length == 0){
                notifications.toast(2,"Please select date field.");
                isRequestValidated = false; 
            } 
            else if(selectedCategory.length > 1){
                notifications.toast(2,"You can select only one date field.");
                isRequestValidated = false; 
            }   
            else if (selectedCategory[0].type.toUpperCase() != "TIMESTAMP" && selectedCategory[0].type.toUpperCase() != "DATETIME" && selectedCategory[0].type.toUpperCase() !="DATE" ){
                notifications.toast(2,"Please select a date for date field.");
                isRequestValidated = false; 
            }            
            else{
                isRequestValidated = true; 
            }
            return isRequestValidated;
        },
        generate: function(highChartType, tableName, selectedSeries, selectedCategory, filters,limit, datasourceId, selectedDB,forecastObj, callback){

            //#Change chart background colours according to theme
            var chartBackgroundColor = "";
            var chartFontColor = "";
            var widgetData={};
            
            if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
            {
                chartBackgroundColor = "rgb(48,48,48)";
                chartFontColor = '#fff';
            }else{
                chartBackgroundColor = "rgb(250,250,250)";
            }


            // forecastObj.paramObj.startdate =  moment(forecastObj.paramObj.startdate).format('YYYY-MM-DD');
            // forecastObj.paramObj.enddate =  moment(forecastObj.paramObj.enddate).format('YYYY-MM-DD');
            forecastObj.tbl=tableName;
            forecastObj.date_field=selectedCategory[0].name;
            forecastObj.f_field=selectedSeries[0].name;


            //notifications.log(forecastObj,new Error());
            
            //#Create initial object
            if (forecastObj.interval == "Yearly") {
                forecastObj.fcast_days = 1;
            } else if (forecastObj.interval == "Daily") {
                forecastObj.fcast_days = 7;
            } else if (forecastObj.interval == "Monthly") {
                forecastObj.fcast_days = 12;
            }

           widgetData.title = {
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                }
            };
            //$scope.eventHndler.isLoadingChart = true;

            if(typeof widgetData.namespace == "undefined"){ 
                var namespace = $rootScope.authObject.Email.replace('@', '_'); 
                namespace=$rootScope.authObject.Email.replace(/[@.]/g, '_'); 

                widgetData.namespace = namespace;
            }
                
            //#Call funtion
            //$diginengine.getClient.getForcast(fObj,$scope.widget.widgetData,"",$scope.sourceData.id, function(data, status, fObj) {
            var fObj = forecastObj;
            $diginengine.getClient(selectedDB).getForcast(fObj,widgetData,filters,datasourceId, function(data, status, fObj) {
                if (status) {
                    var forcastArr = [];
                    var serArr = [];
                    var catArr = [];
                    var maxDate = "";
                    var minDate = "";


                     // set alpha,beeta, gamma values returned from the service



                    if(data.alpha != 0){
                        forecastObj.alpha = data.alpha.toFixed(3);
                        forecastObj.a = data.alpha.toFixed(3);
                    }                   
                    if(data.beta != 0){
                        forecastObj.beta = data.beta.toFixed(3);
                        forecastObj.b = data.beta.toFixed(3);
                    }
                    if(data.gamma != 0){
                        forecastObj.gamma = data.gamma.toFixed(3);
                        forecastObj.g = data.gamma.toFixed(3); 
                    }


                    // to check wether service has returned any warnings
                    if (data.warning != null)
                        console.log(data.warning);
                        //privateFun.fireMessage('0', data.warning);

                    //if the service has return a diferent len_season set it
                    if (data.len_season != forecastObj.len_season) {
                        forecastObj.len_season = data.len_season;
                    }

                    if(!forecastObj.groupby){
                        forecastObj.forecastAtt="";
                    }


                    // maxDate = moment(new Date(data.act_max_date)).format('LL');
                    // minDate = moment(new Date(data.act_min_date)).format('LL');
                    // forecastObj.paramObj.enddate = moment(new Date(data.max_date)).format('LL');
                    // forecastObj.paramObj.startdate = moment(new Date(data.min_date)).format('LL');

                    forecastObj.enddate =new Date(data.max_date);
                    forecastObj.startdate = new Date(data.min_date); 

                    forecastObj.mindate=new Date(data.min_date);
                    forecastObj.maxdate=new Date(data.max_date);
                    //forecastObj.paramObj.mindate = moment(new Date(data.min_date)).subtract(1, 'days').toDate();
                    //forecastObj.paramObj.maxdate = moment(new Date(data.max_date)).subtract(1, 'days').toDate();



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

                       
                    //var forecastWidgetConfig=createForecastObject(highChartType,widgetData,serArr, catArr );  
                    //-------------------------------------------------------------------------
                    var forecastWidgetConfig={};
     
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
                                text: forecastObj.widgetName
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


                    //-------------------------------------------------------------------------


                    //#--------------------- 
                    if (typeof forecastWidgetConfig.series != "undefined") {
                        forecastWidgetConfig.series.forEach(function(key) {
                            if (key.data.length > 1000) key['turboThreshold'] = key.data.length;
                        });
                    }

                    var temptArr = forecastWidgetConfig;

                    var startdate = formattedDate(forecastObj.visualstart, forecastObj.interval);
                    var enddate = formattedDate(forecastObj.visualend, forecastObj.interval);
                    var xAxisLen = temptArr.xAxis.categories.length;

                    var startInd = -1;
                    var endInd = -1;
                    var cat = [];
                    var tempdata = [];
                    for (var i = 0; i < xAxisLen; i++) {
                        var date;
                        if (forecastObj.interval == "Yearly") {
                            date = temptArr.xAxis.categories[i] + "-01-01";
                        } else if (forecastObj.interval == "Monthly") {
                            date = temptArr.xAxis.categories[i] + "-01";
                        } else if (forecastObj.interval == "Daily") {
                            date = temptArr.xAxis.categories[i];
                        }

                        var x = new Date(startdate);
                        var y = new Date(date);
                        var z = new Date(enddate);

                        if (x <= y && y <= z) {
                            if (startInd == -1) {
                                startInd = i;
                            }

                            cat.push(temptArr.xAxis.categories[i]);

                            if (i == xAxisLen - 1)
                                endInd = i;

                        } else if (startInd > -1) {
                            if (endInd == -1) {
                                endInd = i;
                            }
                        }
                    }


                    var seriesLen = temptArr.series.length;
                    for (var i = 0; i < seriesLen; i++) {
                        tempdata = [];
                        var endIndex = startInd + cat.length;
                        for (var j = startInd; j < endIndex; j++) {
                            tempdata.push(temptArr.series[i].data[j]);
                        }

                        if (tempdata.length > 0) {
                            forecastWidgetConfig.series[i].data = tempdata;
                            if (fObj.showActual != true) {
                                forecastWidgetConfig.series[i].zones[0].value = cat.length - fObj.fcast_days - 1;
                            } else {
                                if (i % 2 == 0) {
                                    var tempArr = [];
                                    for (var indtemp = 0; indtemp <= cat.length - fObj.fcast_days; indtemp++) {
                                        tempArr.push(forecastWidgetConfig.series[i].data[indtemp]);
                                    }
                                    forecastWidgetConfig.series[i].data = tempArr;
                                }
                            }
                        }
                    }

                    if (cat.length > 0) {
                        forecastWidgetConfig.xAxis.categories = cat;
                    }
                    //----------------------    

                    callback(forecastWidgetConfig,status);

                }
                else{
                    notifications.toast(2,data);
                    callback(forecastWidgetConfig,status);  
                }
            }); 

    
            function formattedDate(date, format) {
                var date;
                if (format == "Monthly") {
                    var d = new Date(date || Date.now()),
                        month = '' + (d.getMonth() + 1),
                        day = '01',
                        year = d.getFullYear();

                    if (month.length < 2) month = month;
                    if (day.length < 2) day = day;
                    date = [year, month, day].join('-');
                } else if (format == "Yearly") {
                    var d = new Date(date || Date.now()),
                        month = '01',
                        day = '01',
                        year = d.getFullYear();

                    date = [year, month, day].join('-');
                } else if (format == "Daily") {
                    var d = new Date(date || Date.now()),
                        month = '' + (d.getMonth() + 1),
                        day = d.getDate(),
                        year = d.getFullYear();

                    if (month.length < 2) month = "0" + month;
                    if (day.length < 2) day = "0" + day;

                    date = [year, month, day].join('-');
                }
                return date;
            }

        },
        reRender: function(highChartType, forecastWidgetConfig, callback) {
            forecastWidgetConfig.options.chart.type = highChartType;
            callback(forecastWidgetConfig);
            
        },
        applyRunTimeFilters: function(widget,designFilterString, runtimefilterString, callback){
            widget.widgetData.widgetConfig.runtimefilterString= runtimefilterString;
            widget.widgetData.widgetConfig.designFilterString = designFilterString;

            var fObj = widget.widgetData.settingConfig;
            var widgetData = widget.widgetData;
            if(typeof widgetData.namespace == "undefined"){ 
                var namespace = $rootScope.authObject.Email.replace('@', '_'); 
                namespace=$rootScope.authObject.Email.replace(/[@.]/g, '_'); 
                widgetData.namespace = namespace;
            }

            function formattedDate(date, format) {
                var date;
                if (format == "Monthly") {
                    var d = new Date(date || Date.now()),
                        month = '' + (d.getMonth() + 1),
                        day = '01',
                        year = d.getFullYear();

                    if (month.length < 2) month = month;
                    if (day.length < 2) day = day;
                    date = [year, month, day].join('-');
                } else if (format == "Yearly") {
                    var d = new Date(date || Date.now()),
                        month = '01',
                        day = '01',
                        year = d.getFullYear();

                    date = [year, month, day].join('-');
                } else if (format == "Daily") {
                    var d = new Date(date || Date.now()),
                        month = '' + (d.getMonth() + 1),
                        day = d.getDate(),
                        year = d.getFullYear();

                    if (month.length < 2) month = "0" + month;
                    if (day.length < 2) day = "0" + day;

                    date = [year, month, day].join('-');
                }
                return date;
            }

            $diginengine.getClient(widget.widgetData.selectedDB).getForcast(fObj,widgetData, runtimefilterString,widget.widgetData.selectedFile.datasource_id, function(data,status) {          
                if (status) {
                    var forcastArr = [];
                    var serArr = [];
                    var catArr = [];
                    var maxDate = "";
                    var minDate = "";            

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

                    var forecastWidgetConfig={};
                    forecastWidgetConfig=widgetData.widgetConfig;
                    forecastWidgetConfig.series=serArr;


                    //#--------------------- 
                    if (typeof forecastWidgetConfig.series != "undefined") {
                        forecastWidgetConfig.series.forEach(function(key) {
                            if (key.data.length > 1000) key['turboThreshold'] = key.data.length;
                        });
                    }

                    var temptArr = forecastWidgetConfig;

                    var startdate = formattedDate(fObj.visualstart, fObj.interval);
                    var enddate = formattedDate(fObj.visualend, fObj.interval);
                    var xAxisLen = temptArr.xAxis.categories.length;

                    var startInd = -1;
                    var endInd = -1;
                    var cat = [];
                    var tempdata = [];
                    for (var i = 0; i < xAxisLen; i++) {
                        var date;
                        if (fObj.interval == "Yearly") {
                            date = temptArr.xAxis.categories[i] + "-01-01";
                        } else if (fObj.interval == "Monthly") {
                            date = temptArr.xAxis.categories[i] + "-01";
                        } else if (fObj.interval == "Daily") {
                            date = temptArr.xAxis.categories[i];
                        }

                        var x = new Date(startdate);
                        var y = new Date(date);
                        var z = new Date(enddate);

                        if (x <= y && y <= z) {
                            if (startInd == -1) {
                                startInd = i;
                            }

                            cat.push(temptArr.xAxis.categories[i]);

                            if (i == xAxisLen - 1)
                                endInd = i;

                        } else if (startInd > -1) {
                            if (endInd == -1) {
                                endInd = i;
                            }
                        }
                    }

                    var seriesLen = temptArr.series.length;
                    for (var i = 0; i < seriesLen; i++) {
                        tempdata = [];
                        var endIndex = startInd + cat.length;
                        for (var j = startInd; j < endIndex; j++) {
                            tempdata.push(temptArr.series[i].data[j]);
                        }

                        if (tempdata.length > 0) {
                            forecastWidgetConfig.series[i].data = tempdata;
                            if (fObj.showActual != true) {
                                forecastWidgetConfig.series[i].zones[0].value = cat.length - fObj.fcast_days - 1;
                            } else {
                                if (i % 2 == 0) {
                                    var tempArr = [];
                                    for (var indtemp = 0; indtemp <= cat.length - fObj.fcast_days; indtemp++) {
                                        tempArr.push(forecastWidgetConfig.series[i].data[indtemp]);
                                    }
                                    forecastWidgetConfig.series[i].data = tempArr;
                                }
                            }
                        }
                    }

                    if (cat.length > 0) {
                        forecastWidgetConfig.xAxis.categories = cat;
                    }
                    //----------------------    

                    callback(forecastWidgetConfig,status);

                }
                else{
                    notifications.toast(2,data);
                    callback(forecastWidgetConfig,status);  
                }

            }); 
        }
        

        
   }
}]);//END OF DiginServices