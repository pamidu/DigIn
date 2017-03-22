DiginServiceLibraryModule.service('chartSyncServices',['$diginengine','chartUtilitiesFactory', function($diginengine,chartUtilitiesFactory) {
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
            var count = 0;
            client.getExecQuery(query, widget.selectedFile.datasource_id, function(res, status, message) {
                if (status) {
                    var category = "";
                    var series, c;
                    for (c in res[0]) {
                        if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                            if (typeof res[0][c] == "string") category = c;
                        }
                    } 
                    // send drilled parameter as false
                    seriesArray = chartUtilitiesFactory.mapChartData(res,category,false);

                    // get all series of the chart object
                    chartObject = widget.widgetConfig.getHighcharts();

                    angular.forEach(seriesArray,function(newSeries) {
                        angular.forEach(widget.widgetConfig.series,function(series) {
                            if (newSeries.id == series.id ) {
                                // update data retaining all configs
                                chartObject.get(series.id).setData(newSeries.data);
                                count++;
                            }
                        });
                    });
                    callback(widget);
                } else {
                    callback(widget);
                }
            },2000,0,is_sync)
    	}
    }

}]);