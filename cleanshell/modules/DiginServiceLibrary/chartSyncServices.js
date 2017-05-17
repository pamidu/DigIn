DiginServiceLibraryModule.service('chartSyncServices',['$diginengine','chartUtilitiesFactory','tabularService','generateMetric','generateForecast', function($diginengine,chartUtilitiesFactory,tabularService,generateMetric,generateForecast) {
    this.sync = function(widgetObject, callback, is_sync) {
        var chartType = widgetObject.chartType.chartType;
        var widgetType = eval('new ' + chartType.toUpperCase() + '();');
        widProt = new Widget(widgetType);
        widProt.sync(widgetObject, is_sync, callback);
    };

    var Widget = function(widgetType) {
    	this.widget = widgetType;
    };

    Widget.prototype = {
    	sync: function(widget, is_sync, callback) {
    		var query,databaseType;
    		if (typeof widget.query !== undefined)
    			query = widget.query;
    		var databaseType = widget.selectedDB;
    		var client = $diginengine.getClient(databaseType);
    		return this.widget.sync(query,client,widget,is_sync,callback)
    	}
    }

    var HIGHCHARTS = function() {
    	this.sync = function(query,client,widget,is_sync,callback) {
            var seriesArray,chartSeries;
            var isDrilled = false;
            client.getExecQuery(query, widget.selectedFile.datasource_id, function(res, status, message) {
                if (status) {
                    // find out the category from the response
                    var category = "";
                    var series, c;
                    for (c in res[0]) {
                        if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                            if (typeof res[0][c] == "string") category = c;
                        }
                    }
                    if (widget.XAxis.length > 1) isDrilled = true;
                    chartUtilitiesFactory.updateSeries(res,category,isDrilled,widget.widgetConfig);
                    callback(widget);
                } else {
                    callback(widget);
                }
            },2000,0,is_sync)
    	}
    }

    var TABULAR = function(){
        this.sync = function(query,client,widgetData,is_sync,callback){

            tabularService.executeQuery(widgetData.selectedDB,widgetData.selectedFile,widgetData.settingConfig,widgetData.widgetConfig,function(tabulConfig){
                widgetData.widgetConfig = tabulConfig;
                callback(widgetData);
            });




            // generateTabular.generate(widgetData.selectedDB,widgetData.selectedFile,widgetData.settingConfig,widgetData.widgetConfig.designFilterString,widgetData.widgetConfig.runtimefilterString, function(config){
            //     widgetData.widgetConfig = config;
            //     callback(widgetData);
            // });
        }

    }    

    var FORECAST = function(){
        this.sync = function(query,client,widgetData,is_sync,callback){

            /*tabularService.executeQuery(widgetData.selectedDB,widgetData.selectedFile,widgetData.settingConfig,widgetData.widgetConfig,function(tabulConfig){
                widgetData.widgetConfig = tabulConfig;
                callback(widgetData);
            });*/

            generateForecast.applyRunTimeFilters(widgetData,widgetData.settingConfig.designFilterString,widgetData.settingConfig.runtimefilterString, function (data){
                widgetData.widgetConfig=data;
                callback(widgetData);
            });

        }
    }   

    var METRIC = function(){
        this.sync = function(query,client,widgetData,is_sync,callback){
            /*tabularService.executeQuery(widgetData.selectedDB,widgetData.selectedFile,widgetData.settingConfig,widgetData.widgetConfig,function(tabulConfig){
                widgetData.widgetConfig = tabulConfig;
                callback(widgetData);
            });*/

            generateMetric.generate(true,widgetData.widgetConfig, widgetData.chartType.chartType,widgetData.selectedFile.datasource_name,widgetData.settingConfig.run_connectionString,100,widgetData.selectedFile.datasource_id,widgetData.selectedDB,widgetData.settingConfig,widgetData.settingConfig.notification_data, function (status,metricObj,settings,notification){
                    widgetData.syncOn = false;
                    widgetData.widgetConfig=metricObj;
                    callback(widgetData);

            });

        }
    }  
    

}]);