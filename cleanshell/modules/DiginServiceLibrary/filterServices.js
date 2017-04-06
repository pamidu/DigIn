
// __Author__ : Dilani Maheswaran

DiginServiceLibraryModule.factory('filterServices',['$diginengine','$diginurls','chartUtilitiesFactory', 'notifications', 'generateHighchart', 
    function($diginengine,$diginurls,chartUtilitiesFactory,notifications,generateHighchart) {
    return {
        // ------------------- Read Me -----------
        // construct the filter array in the given format to be supported by all methods
        /*
            [
                {
                    name : <name of the selected filter field>
                    type : <data type of the selcted filter field>
                    fieldvalues : <array of objects that contain the values under a given field> 
                                [
                                    {
                                        valueName : < name of the value>
                                        isSelected : <flag that represents whether the value is selected >
                                    }
                                ]
                }
            ]
        */
        // use groupFilterConnectionString if not arranged in the required format


        //create the 'cons' parameter of the request for filters
        // returns string in format - <field name> in (<value1>,<value2>,<value3>,..)
        generateFilterConnectionString : function(filterParams,datasource){
            var filterArray = [];
            var connectionString = '';
            angular.forEach(filterParams,function(filter){
                tempFilterArray = [];
                tempStr = "";
                if (filter.fieldvalues !== undefined){
                    angular.forEach(filter.fieldvalues,function(key){
                        if(key.isSelected){
                            if (typeof key.valueName == 'number') {
                                tempFilterArray.push(key.valueName);
                            } else {
                                tempFilterArray.push( "'" + key.valueName + "'");
                            }
                        }
                    })
                }
                //if fields are selected, convert the array to string for the request
                if (tempFilterArray.length > 0) {
                    tempFilterArray.toString();
                    if (datasource == 'MSSQL')
                        tempStr = '[' + filter.name + "] in ( " + tempFilterArray + " )";
                    else
                        tempStr = filter.name + " in ( " + tempFilterArray + " )";
                    filterArray.push(tempStr);
                }
                connectionString = filterArray.join( ' And ');
            });
            return connectionString;
        },

        // group the connection string in the required format
        groupFilterConnectionString : function (filterFields) {

            var name;
            function returnIndex(field) {
                return field.name == name;
            }

            var groupFilters = [];
            var index;
            angular.forEach(filterFields,function (field) {
                name = field.name;
                index = groupFilters.findIndex(returnIndex);
                if ( index == -1) {
                    groupFilters.push({
                        name : field.name,
                        type : filterFields.fieldDataType,
                        fieldvalues : [{
                            valueName : field.valueName,
                            isSelected : true
                        }]
                    });
                } else {
                    groupFilters[index].fieldvalues.push({
                        valueName : field.valueName,
                        isSelected : true
                    });
                }
            });
            return(groupFilters);
        },
        // group the default filters of a dashboard
        groupDefaultFilters : function (filterDetails) {
            var filterArray = [];
            for ( var i = 0; i < filterDetails.length; i++)
            {
                if ( filterDetails[i].is_default === true || filterDetails[i].is_default === 1 )
                {
                    filterArray.push({
                        name : filterDetails[i].filter_name,
                        fieldvalues : [{
                            valueName : filterDetails[i].default_value,
                            isSelected : true
                        }]
                    });
                }
            }
            return(filterArray);
        },
        // compare run time and dashboard filters against design time filters. design time filters get the highest priority.
        // remove if selected filters if not present in design time filters
        compareDesignTimeFilter : function(selectedFilterFieds, designTimeFilters) {
            var name;
            var connectionString = "";
            var groupFilters = [];
            function returnIndex(field) {
                return field.valueName == name;
            }
            var selectedFilterFiedsCopy = angular.copy(selectedFilterFieds);
            var designTimeFiltersGroup = this.groupFilterConnectionString(designTimeFilters);
            if (designTimeFilters.length > 0) {
                // loop through design time filter
                angular.forEach(designTimeFiltersGroup,function(designTimeFilter) {
                    // loop through run time filter / dashboard filter
                    angular.forEach(selectedFilterFiedsCopy,function(filterField) {
                        //if run time filter / dashboard filter is present in design time filter
                        if (filterField.name == designTimeFilter.name) {
                            var filterParamsArray = [];
                            // loop through fields of run time filters / dashboard filter
                            angular.forEach(filterField.fieldvalues,function(value){
                                name = value.valueName;
                                // find if run time filter / dashboard filter fields are available in design time filter fields
                                var index = designTimeFilter.fieldvalues.findIndex(returnIndex);
                                // if present, push it to the array
                                if (index > -1) {
                                    filterParamsArray.push(value);
                                }
                            })
                            filterField.fieldvalues = filterParamsArray;
                        }
                    })
                })
            }
            return(selectedFilterFiedsCopy);
        },

        // return the values under a selected field for filters
        getFieldParameters : function(display_field,selectedDB,selectedFile,callback,limit,offset,is_dashboard,value_field)
        {
            // filterName : selected filter field name - string
            // selectedDB : selected database name - string
            // selectedFile : object that contains table name and datasource id
            // limit : request limit set - integer
            // offset : beginning of the record - integer
            // value field : order by field
            // is_dashboard : boolean indciating if it dashboard fiters or not

            var query = "";
            var datasource_id;
            var table = selectedFile.datasource_name;
            if(selectedDB == "BigQuery" || selectedDB == "memsql"){
                datasource_id = selectedFile.datasource_id;

            }else{
                datasource_id = selectedFile.id;
            }
            switch(selectedDB)
            {
                case 'BigQuery':
                case 'memsql':
                    if (is_dashboard)
                        query = "SELECT " + display_field + "," + value_field + " FROM " + $diginurls.getNamespace() + "." + table + " GROUP BY " + value_field + " , " + display_field + " ORDER BY " + value_field;
                    else
                        query = "SELECT " + display_field + " FROM " + $diginurls.getNamespace() + "." + table + " GROUP BY " + display_field;
                    break;
                case 'MSSQL':
                    var tableNamespace = table.split(".");
                    if (is_dashboard)
                        query = "SELECT [" + value_field + "],["+ display_field + "] FROM [" + tableNamespace[0] + '].[' + tableNamespace[1] + "] GROUP BY [" + value_field + "],["+ display_field +"] ORDER BY [" + value_field + "]";
                    else
                        query = "SELECT [" + display_field + "] FROM [" + tableNamespace[0] + '].[' + tableNamespace[1] + "] GROUP BY [" + display_field + "] ORDER BY [" + display_field + "]";
                    break;
                case 'hiveql':
                    if (is_dashboard)
                        query = "SELECT " + value_field + " , " + display_field + " FROM "+ table +"  GROUP BY " + value_field + " , " + display_field + " ORDER BY " + value_field + " , " + display_field + "";
                    else
                        query = "SELECT " + display_field + " FROM "+ table +"  GROUP BY " + display_field + " ORDER BY " + display_field;
                    break;
                case 'Oracle':
                if (is_dashboard)
                    query = "SELECT " + value_field + " , " + display_field + " FROM "+ table +"  GROUP BY " + value_field + " , " + display_field + " ORDER BY " + value_field + " , " + display_field + "";
                else
                    query = "SELECT " + display_field + " FROM "+ table +"  GROUP BY " + display_field + " ORDER BY " + display_field;
            };
            $diginengine.getClient(selectedDB).getExecQuery(query, datasource_id, function(res, status, message)
            {
                var values = [];
                if(status)
                {
                    angular.forEach(res,function(value)
                    {
                        if (is_dashboard)
                        {
                            values.push({
                               valueName: value[value_field], // display value
                               isSelected: false,
                               displayName: value[display_field] // actua value
                            });
                        } else 
                        {
                            values.push({
                               valueName: value[display_field],
                               isSelected: false 
                            });
                        }
                    });

                } else {
                    // notify
                    notifications.toast('0','Error occurred. Please try again.');
                }
                callback(values);
            },limit,0);
        },
        // set all data related to filters
        setFilterData : function(dashboard,page_index) {
            if ( dashboard.isFiltered === undefined ) dashboard.isFiltered = false;
            if ( dashboard.pages[page_index].isSeen === undefined ) dashboard.pages[page_index].isSeen = false;
            if ( dashboard.pages[page_index].isFiltered === undefined ) dashboard.pages[page_index].isFiltered = false;
            for ( var i = 0; i < dashboard.pages[page_index].widgets.length; i++ )  
            {
                if (dashboard.pages[page_index].widgets[i].isWidgetFiltered === undefined) dashboard.pages[page_index].widgets[i].isWidgetFiltered = false;
            }
        },
        // remove all data related to filters before saving the dashborad
        removeFilterData : function(widget) {
            delete widget.isWidgetFiltered;
            angular.forEach(widget.widgetData.RuntimeFilter,function(filter) {
                if(filter.fieldvalues !== undefined) delete filter.fieldvalues;
                if (filter.isLoading !== undefined) delete filter.isLoading;
            });
        },
        // assign the necessary parameters to make it common for filter related methods
        generateDashboardFilterFields : function(dashboardFilters) {
            angular.forEach(dashboardFilters,function(filter){
                if (filter.name === undefined) filter.name = filter.filter_name;
                // assign values for custom filter
                if (filter.is_custom == 1 || filter.is_custom == true)
                {
                    filter.fieldvalues = [];
                    angular.forEach(filter.custom_fields,function(field){
                        filter.fieldvalues.push({
                            valueName: field.actualValue,
                            isSelected: false,
                            displayName: field.displayValue
                        });
                    });
                } else {
                    if (filter.fieldvalues === undefined) filter.fieldvalues = [];
                }
            });
        },
        // set dashboard filtered status to true / false
        setDashboardFilter : function(dashboard,page_index,count,status) {
            if (dashboard.pages[page_index].widgets.length == count)
            {
                dashboard['isFiltered'] = status; 
                dashboard.pages[page_index]['isFiltered'] = status;
                dashboard.pages[page_index]['isSeen'] = status;
                angular.forEach(dashboard.pages,function(page){
                    if (dashboard.pages.indexOf(page) != page_index && dashboard.pages.indexof(page) > 0)
                        dashboard.pages[page_index]['isFiltered'] = false; 
                })
            }
        },
        // 
        setDefaultFilter : function(dashboard,page_index,count,widget,cb) {
            // sync the chart if no default value
            chartSyncServices.sync(widget.widgetData,function(widgetData){
                $scope.$apply(function(){
                    widgetData.syncOn = false;
                    widget.widgetData = widgetData;
                })
                if (count == dashboard.pages[page_index].widgets.length) dashboard.pages[page_index].isSeen = true;
                cb(widget)
            }, is_sync);
        }
    }

}]);