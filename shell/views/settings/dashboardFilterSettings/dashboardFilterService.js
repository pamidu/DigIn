////////////////////////////////
// File : dashboardFilterService
// Owner  : Dilani Maheswaran
// Last changed date : 2017/02/28
// Version : 3.1.0.6
// Modified By : Dilani Maheswaran
////////////////////////////////


// services for dashboard filters
routerApp.service('dashboardFilterService',function(filterService,$diginengine,$qbuilder){

    // create filter parameters for dashboard filters
    var generateDashboardFilterparams = function(filterParams,datasource){
        var filterArray = [];

        angular.forEach(filterParams,function(param){
            tempFilterArray = [];
            tempStr = "";
            angular.forEach(param.values,function(key){
                if (key.status){
                    if (typeof key.value == 'number'){
                        tempFilterArray.push(key.value);
                    } else{
                        tempFilterArray.push( "'" + key.value + "'");
                    }
                }
            })
            //if fields are seected, convert the array to string for the request
            if(tempFilterArray.length > 0) {
                tempFilterArray.toString();
                if (datasource == 'MSSQL')
                    tempStr = '[' + param.name + "] in ( " + tempFilterArray + " )";
                else
                    tempStr = param.name + " in ( " + tempFilterArray + " )";
                filterArray.push(tempStr);
            }
        })
        return filterArray;
    }

    this.dashboardFilterWidget = function(widget,filtersArray,cb,type){
        var connection_string = "";
        var connection_array = [];
        if ( widget.widgetData.commonSrc.filter.length != 0 && widget.widgetData.commonSrc.filter.length !== undefined ) {
            connection_string = "";
            angular.forEach(widget.widgetData.commonSrc.filter,function(filter){
                angular.forEach(filtersArray,function(db_filter){
                    if (filter.filter.name == db_filter.filter.name){
                        connection_array = generateDashboardFilterparams(db_filter,widget.widgetData.commonSrc.src.src);
                        if (connection_string.length > 0){
                            connection_string += ' And ' + connection_array;
                        } else {
                            connection_string = connection_array;
                        }
                    }
                })
            })
            if ( connection_string.length > 0 ) {
                var requestArray = [];
                //if chart is configured for drilled down, get the highest level to apply filters
                if (typeof widget.widgetData.widData.drillConf != "undefined" && widget.widgetData.widData.drilled) {
                    var chart = widget.widgetData.highchartsNG.getHighcharts();
                    if ( chart.options.customVar == widget.widgetData.widData.drillConf.highestLvl ) {
                        requestArray[0] = chart.options.customVar;                    
                    } else {
                        return;
                    }
                } else {
                    if (widget.widgetData.commonSrc.att.length > 0) {
                        requestArray[0] = widget.widgetData.commonSrc.att[0].filedName;    
                    } else {
                        requestArray = undefined;
                    }
                }
                widget.widgetData.syncState = false;
                var client = $diginengine.getClient(widget.widgetData.commonSrc.src.src);
                client.getAggData(widget.widgetData.commonSrc.src.tbl, widget.widgetData.commonSrc.mea, 1000, widget.widgetData.commonSrc.src.id, function(res, status, query) {
                    if (status) {
                        widget.widgetData["dashboardFilterState"] = true;
                        widget.widgetData["dashboard_filter_query"] = query;
                        var color = [];
                        var name = [];
                        var origName = [];
                        //Store the name and the color to apply to the chart after it is regenareted
                        for ( var i = 0; i < widget.widgetData.highchartsNG.series.length; i++) {
                            color.push(widget.widgetData.highchartsNG.series[i].color);
                            name.push(widget.widgetData.highchartsNG.series[i].name);
                            origName.push(widget.widgetData.highchartsNG.series[i].origName);
                        }
                        filterService.filterAggData(res,widget.widgetData.commonSrc.src.filterFields);
                        if (widget.widgetData.commonSrc.att.length <=1) {
                           widget.widgetData.widData.drilled = false;
                        } else {
                            widget.widgetData.widData.drilled = true;
                        }
                        var data = filterService.mapResult(requestArray[0],res,widget.widgetData.widData.drilled,color,name,origName);
                        widget.widgetData.syncState = true;
                        if ( data !== undefined ) {
                            widget.widgetData.highchartsNG.series = data;
                            widget.widgetData.highchartsNG.series.forEach(function(key) {
                                if (key.data.length > 1000) key['turboThreshold'] = key.data.length;
                            });
                        }
                    } else {
                        notifications.toast('0', 'Error Occured!Please try again!');
                        widget.widgetData.syncState = true;
                    }
                    cb(widget);
                },requestArray,connection_string);
            } else {
            	if(type == 'page') {
                    $qbuilder.sync(widget.widgetData, function (data) {
                    	widget.widgetData.syncState = true;
                    	cb(widget);
                    });
            	}
            }
        } else {
        	if(type == 'page') {
                $qbuilder.sync(widget.widgetData, function (data) {
                	widget.widgetData.syncState = true;
                	cb(widget);
                });
        	}
        }
    }

})