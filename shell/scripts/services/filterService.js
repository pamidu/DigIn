// Service for filter functionality

routerApp.service('filterService',function(){

	this.filterAggData = function(res,filterFields) {
        if (filterFields === undefined ){
            return;
        }
		// filter only the selected fields from the result returned by the service
        if (filterFields.length > 0){
            for (c in res[0]) {
                 if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                    if (typeof res[0][c] == "string"){
                        cat = c;
                    }
                }
            }
            if (typeof cat != 'undefined'){
                angular.forEach(filterFields,function(field){
                    if(field.name == cat){
                        for (var i=0;i<field.valueArray.length;i++){
                            angular.forEach(res,function(key){
                                for(var k in key){
                                    if (Object.prototype.hasOwnProperty.call(key,k)){
                                        if(typeof key[k] == "string") {
                                            if(field.valueArray[i].value == key[k]){
                                                if(!field.valueArray[i].status){
                                                    res.splice(res.indexOf(key),1);
                                                    break;
                                                }
                                            }                    
                                        }
                                    }
                                }
                            })
                        }
                    }
                });
            }
        }
	};

    this.mapResult = function(cat, res, d, color, name, origName) {
        var serArr = [];
        var i = 0;
        for(c in res[0]){
            if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                if(c != cat){
                    serArr.push({
                        temp: c,
                        name: name[i],
                        origName: origName[i],
                        data: [],
                        color: color[i]
                    });
                    i++;
                }
            }
        }

        //fill the series array
        res.forEach(function(key){
            serArr.forEach(function(ser){
                if(!d){
                    ser.data.push({
                        name: key[cat],
                        y: parseFloat(key[ser.temp])
                    });
                } else {
                    ser.data.push({
                        name: key[cat],
                        y: parseFloat(key[ser.temp]),
                        drilldown: true
                    });
                }
            });
        });
        serArr.forEach(function(ser){
            delete ser.temp;
        });
        return serArr;
        // cb(serArr);
    };

    // clear the filters when the chart is re-set
    this.clearFilters = function(widget) {
        var fieldId ="";
        if (typeof widget.widgetData.commonSrc.filter != "undefined"){
            angular.forEach(widget.widgetData.commonSrc.filter,function(key){
                if(typeof key.values != "undefined"){
                    angular.forEach(key.values,function(val){
                        val.status = false;
                        fieldId = "#" + widget.widgetID + "-" + val.id + "-" + key.filter.name;
                        $(fieldId).removeAttr("checked"); //un-check
                    })
                }
            })
        }
    };

    //create the 'cons' parameter of the request
    this.generateFilterParameters = function(filterParams,datasource){
        var filterArray = [];
        angular.forEach(filterParams,function(filter){
            tempFilterArray = [];
            tempStr = "";
            // view mode filters
            if (filter.values !== undefined){
                angular.forEach(filter.values,function(key){
                    if(key.status){
                        if (typeof key.value == 'number'){
                            tempFilterArray.push(key.value);
                        } else{
                            tempFilterArray.push( "'" + key.value + "'");
                        }
                    }
                })
            }
            //if fields are seected, convert the array to string for the request
            if(tempFilterArray.length > 0) {
                tempFilterArray.toString();
                if (datasource == 'MSSQL')
                    tempStr = '[' + filter.name + "] in ( " + tempFilterArray + " )";
                else
                    tempStr = filter.filter.name + " in ( " + tempFilterArray + " )";
                filterArray.push(tempStr);
            }
        });
        return filterArray;        
    };

    this.generateDesginFilterParams = function(filterParams,datasource){
        var filterArray = [];
        angular.forEach(filterParams,function(filter){
            tempFilterArray = [];
            tempStr = "";

            // designs mode filters
            if (filter.valueArray !== undefined){
                if (filter.valueArray.length > 0) {
                    angular.forEach(filter.valueArray,function(key){
                        if(key.status){
                            if (typeof key.value == 'number'){
                                tempFilterArray.push(key.value);
                            } else{
                                tempFilterArray.push( "'" + key.value + "'");
                            }
                        }
                    })
                }
            }
            //if fields are seected, convert the array to string for the request
            if(tempFilterArray.length > 0) {
                tempFilterArray = tempFilterArray.toString();
                if (datasource == 'MSSQL')
                    tempStr = "[" + filter.name + "] in ( " + tempFilterArray + " )";
                else 
                    tempStr = filter.name + " in ( " + tempFilterArray + " )";
                filterArray.push(tempStr);
            }
        });
        return filterArray;
    }

});
