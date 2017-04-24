routerApp.controller('DashboardCtrl', ['$scope','$interval','$http', '$rootScope', '$mdDialog', '$objectstore', '$sce', '$log', '$csContainer', 'filterService', '$diginurls','$state', '$qbuilder', '$diginengine', 'ngToast',  '$sce', 'notifications','pouchDbServices','layoutManager','metricChartServices', 'layoutManager','tabularService', 'dashboardFilterService', 
    function($scope,$interval,$http, $rootScope, $mdDialog, $objectstore, $sce, $log, $csContainer, filterService, $diginurls, $state, $qbuilder, $diginengine, ngToast,  $sce,  notifications,pouchDbServices,layoutManager,metricChartServices, layoutManager,tabularService,dashboardFilterService) {
        
        $rootScope.showSideMenu = layoutManager.hideSideMenu();
        if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
        {
            $('md-tabs-wrapper').css('background-color',"rgb(48,48,48)", 'important');
        }else{
            $('md-tabs-wrapper').css('background-color',"white", 'important');
        }
    
        //code to keep widget fixed on pivot summary drag events
        $('#content1').on('mousedown', function(e) {
            if (e.target.className == "pvtAttr") {

                var widgetsCount = $('.gridster-item').length;
                for (var i = 0; i < widgetsCount; i++) {

                    $('.gridster-item')[i].className = "digin-widget ng-scope gridster-item";
                }
            }
        });

            $scope.updateRealtime = function(){

            $scope.temp = 1770697;

            $interval(function () {
                //var ranId =$scope.random();
                var x =  Math.floor(Math.random() * 10) + 1;
                $scope.temp = $scope.temp + x;
                $scope.value = numberWithCommas($scope.temp);
            }, 3000);

        }

        $scope.random = function generateUUID() {
                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (d + Math.random()*16)%16 | 0;
                    d = Math.floor(d/16);
                    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                });
                return uuid;
        };

        function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        //configuring gridster
        $scope.gridsterOpts = {

            columns: 24, // number of columns in the grid
            pushing: true, // whether to push other items out of the way
            floating: true, // whether to automatically float items up so they stack
            swapping: false, // whether or not to have items switch places instead of push down if they are the same size
            width: 'auto', // width of the grid. "auto" will expand the grid to its parent container
            colWidth: 'auto', // width of grid columns. "auto" will divide the width of the grid evenly among the columns
            rowHeight: '/4', // height of grid rows. 'match' will make it the same as the column width, a numeric value will be interpreted as pixels, '/2' is half the column width, '*5' is five times the column width, etc.
            margins: [5, 5], // margins in between grid items
            outerMargin: true,
            isMobile: false, // toggle mobile view
            mobileBreakPoint: 600, // width threshold to toggle mobile mode
            mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
            minColumns: 1, // minimum amount of columns the grid can scale down to
            minRows: 1, // minimum amount of rows to show if the grid is empty
            maxRows: 100, // maximum amount of rows in the grid
            defaultSizeX: 7, // default width of an item in columns
            defaultSizeY: 23, // default height of an item in rows
            minSizeX: 6, // minimum column width of an item
            maxSizeX: null, // maximum column width of an item
            minSizeY: 5, // minumum row height of an item
            maxSizeY: null, // maximum row height of an item
            saveGridItemCalculatedHeightInMobile: false, // grid item height in mobile display. true- to use the calculated height by sizeY given
            draggable: {
                enabled: true,
                handle: '.widget-header'
            },
            resizable: {
                enabled: true,
                handles: ['n', 'e', 's', 'w', 'se', 'sw', 'ne', 'nw'],
                  resize: function(event,$element,widget){
                    if(widget.widgetName == "Map"){
                        $rootScope.mapheight = $element.context.clientHeight - 50;
                        $rootScope.mapWidth = $element.context.clientWidth ;

                    }
                }
            }
        };

        // if($rootScope.tempDashboard.length != 0)
        $rootScope.tempDashboard = angular.copy($rootScope.dashboard);
        
        
        $scope.widgetTitleClass = 'widget-title-35';

        $scope.adjustTitleLength = function() {

            var titleLength = 0;
            var selectedPage = $rootScope.selectedPage;
            for (var i = 0; i < $rootScope.dashboard.pages[selectedPage - 1].widgets.length; i++) {
                if (typeof($rootScope.dashboard.pages[selectedPage - 1].widgets[i].widgetData.widName) === undefined && $rootScope.dashboard.pages[selectedPage - 1].widgets[i].widgetData.widName != "") {
                    if (titleLength < $rootScope.dashboard.pages[selectedPage - 1].widgets[i].widgetData.widName.length) {

                        titleLength = $rootScope.dashboard.pages[selectedPage - 1].widgets[i].widgetData.widName.length;
                        if (titleLength <= 35) {
                            $scope.widgetTitleClass = 'widget-title-35';
                        }
                        if (titleLength > 35 && titleLength <= 60) {
                            $scope.widgetTitleClass = 'widget-title-60';
                        }
                        if (titleLength > 60 && titleLength <= 80) {
                            $scope.widgetTitleClass = 'widget-title-80';
                        }
                        if (titleLength > 80) {
                            $scope.widgetTitleClass = 'widget-title-long';
                        }
                    }
                }
            }
        }

        $scope.selectPage = function(page) {


            for (var i = 0; i < $rootScope.dashboard.pages.length; i++) {
                if (page.pageID == $rootScope.dashboard.pages[i].pageID) {
                    $rootScope.selectedPage = i + 1;
                }
            }
            //to keep the track of selectd tab
            $rootScope.selectedPageIndx = $rootScope.selectedPage - 1;
            //and will set again in saveChart function in queryBuilderCtrl
        }

        /* update damith
         view current chart data source view
         currentSourceView ()

         */

        $scope.showFace2 = function($event, widget) {
            alert("loadin 2nd face...!");
            $event.preventDefault();
            $(this).parent().toggleClass('expand');
            $(this).parent().children().toggleClass('expand');
        }
        $scope.currentSourceView = function(ev, widget) {
            $scope.isTableSourceLoading = false;
            $mdDialog.show({
                templateUrl: 'views/widgetDataTable_TEMP.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    items: widget
                },
                controller: function dataSourceCtrl($scope, $mdDialog, items, generatePDF1) {

                    var isCommonSrc = angular.isUndefined(items.widCsc);
                    var selectedSourceData = {};
                    // if (isCommonSrc) {
                    //selected common data source
                    selectedSourceData = {
                        'uniqueType': items.uniqueType,
                        'length': items.commonSrcConfig.fields.length,
                        'attributes': items.commonSrcConfig.fields,
                        'mappedData': [],
                        'className': items.commonSrcConfig.tbl,
                        'source': items.commonSrcConfig.src,
                        'type': null,
                        'groupBy': null,
                        'data': items.highchartsNG.series[0].data
                    };
                    // } else {
                    //     selectedSourceData = {
                    //         'uniqueType': items.uniqueType,
                    //         'length': items.widConfig.attributes.length,
                    //         'attributes': items.widConfig.attributes,
                    //         'mappedData': [],
                    //         'className': items.widConfig.selectedClass,
                    //         'source': items.widConfig.source,
                    //         'type': items.type,
                    //         'groupBy': items.widConfig.chartCat.groupField
                    //     };
                    // }
                    for (var i = 0; i < selectedSourceData.length; i++) {
                        // if (isCommonSrc) {
                        var _attr = selectedSourceData.attributes[i].trim().
                        toString();
                        console.log("_attr", _attr);
                        console.log("mapped data in items", items.winConfig.mappedData[_attr]);
                        console.log("mapped data in selected source data", selectedSourceData.mappedData);
                        selectedSourceData.mappedData.push(items.winConfig.mappedData[_attr].data);
                        // } else {
                        //     var _attr = selectedSourceData.attributes[i].trim().
                        //     toString();
                        //     selectedSourceData.mappedData.push(items.
                        //         widConfig.mappedData[_attr].data);
                        // }


                    }
                    var appendTblBody = function() {

                        $scope.isTableSourceLoading = true;
                        var rows = '';
                        for (var c = 0; c < selectedSourceData.attributes.length; c++) {
                            var oneRow = "<td>" + selectedSourceData.attributes[c] + "</td>";
                            rows += oneRow;
                        }
                        $("#dataBody").append("<tr>" + rows + "</tr>");
                        oneRow = '';

                        for (var i = 0; i < selectedSourceData.length; i++) {
                            for (var b = 0; b < selectedSourceData.mappedData[i].length; b++) {
                                var rows = '';
                                for (var c = 0; c < selectedSourceData.length; c++) {
                                    var oneRow = "<td>" + selectedSourceData.mappedData[c][b] + "</td>";
                                    rows += oneRow;
                                }
                                $("#dataBody").append("<tr>" + rows + "</tr>");
                                oneRow = '';
                            }
                        }
                        $scope.isTableSourceLoading = false;
                    };
                    setTimeout(appendTblBody, 100);


                    $scope.widget = selectedSourceData;

                    $scope.downloadPDF = function() {

                        var htmlElement = $(".widget0m-mapped-data").get(0);
                        var config = {
                            title: "Sales Forecast Data Summary",
                            titleLeft: 50,
                            titleTop: 20,
                            tableLeft: 20,
                            tableTop: 30
                        };
                        generatePDF1.generate(htmlElement, config);
                    }

                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };
                    $scope.submit = function() {
                        $mdDialog.submit();
                    };
                }
            });
        };
        $scope.widgetSettings = function(ev, widget) {

            if (typeof widget.widgetData.commonSrc == "undefined") { //new widget
                $mdDialog.show({
                        controller: widget.widgetData.initCtrl,
                        templateUrl: widget.widgetData.initTemplate,
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        locals: {
                            widgetID: widget.widgetID
                        }
                    })
                    .then(function() {
                        //$mdDialog.hide();
                    }, function() {
                        //$mdDialog.hide();
                    });
            } else { //user is updating widget, open query builder
                $csContainer.fillCSContainer(widget.widgetData.commonSrc.src);
                $state.go("home.QueryBuilder", {
                    widObj: widget
                });
            }
        };
        $scope.createuuid = function() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        $scope.showWidget = function(ev, widget) {
            console.log("widget is " + JSON.stringify(widget));
            $scope.tempWidth = widget.widgetData.highchartsNG.size.width;
            $scope.tempHeight = widget.widgetData.highchartsNG.size.height;


            $mdDialog.show({
                    controller: 'showWidgetCtrl',
                    templateUrl: 'views/ViewShowWidget.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        widget: widget,
                        dataSource: widget.widgetData.commonSrc.src,
                    }
                })
                .then(function() {

                    $scope.widget.widgetData.highchartsNG.size.width = $scope.tempWidth;
                    $scope.widget.widgetData.highchartsNG.size.height = $scope.tempHeight;
                    //$mdDialog.hide();
                }, function() {
                    $scope.widget.widgetData.highchartsNG.size.width = $scope.tempWidth;
                    $scope.widget.widgetData.highchartsNG.size.height = $scope.tempHeight;
                    //$mdDialog.hide();
                });
        };
        $scope.showFullView = function(widget) {

                var showFullView = null;
                //if not dynamic visuals
                if (widget.widgetData.selectedChart == undefined) {
                    showFullView = false;
                } else {
                    //if dynamic visuals
                    switch (widget.widgetData.selectedChart.chartType) {
                        case 'metric':
                            showFullView = false;
                            break;
                        default:
                            if (widget.widgetData.uniqueType == 'Dynamic Visuals') {
                                showFullView = true;
                            } else {
                                showFullView = false;
                            }
                            break;
                    }
                }

                return showFullView;
            }
            //dispaly or hide show data view icon according to necessity
        $scope.showDataView = function(widget) {

            var showDataView = null;
            //if not dynamic visuals
            if (widget.widgetData.selectedChart == undefined) {
                showDataView = false; //do not show data view option
            } else { //if dynamic visuals

                switch (widget.widgetData.selectedChart.chartType) {
                    case 'metric': // if type metric do not show data view option
                        showDataView = false;
                        break;
                        case 'Tabular': // if type metric do not show data view option
                        showDataView = false;
                        break;
                    default: // for other dynamic visuals show data view option
                        if (widget.widgetData.dataCtrl != undefined) {
                            showDataView = true;
                        } else {
                            showDataView = false;
                        }
                        break;
                }
            }

            return showDataView;
        }
        $scope.showData = function(ev, widget) {
            //saving widget in $rootScope for use in widget data view
            $rootScope.widget = widget;
			console.log(widget.widgetData.dataCtrl);
            $mdDialog.show({
                    controller: widget.widgetData.dataCtrl,
                    templateUrl: 'views/ViewWidgetSettingsData.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                })
                .then(function() {});
        };

        // Methods for filter functionality
        // load the parameters for filtering 
        $scope.loadFilterParams = function(index,id,widget) {
            $scope.client = $diginengine.getClient(widget.widgetData.commonSrc.src.src);
            var query = "";
            angular.forEach($scope.widgetFilters,function(key){
                if (key.filter.id == id){
                    // Do not load parameters if the selected filed is of type date. A date picker is displayed.
                    if (key.type == "date-single" || key.type == "date-multiple"){
                        return;
                    }
                    //call service if the expanded dropdownaccordion is expanded
                    if (key.values === undefined) {
                        key.sync = true;
                        if (widget.widgetData.commonSrc.src.src == "BigQuery" || widget.widgetData.commonSrc.src.src == "memsql" ) {
                            query = "SELECT " + key.filter.name + " FROM " + $diginurls.getNamespace() + "." + widget.widgetData.commonSrc.src.tbl + " GROUP BY " + key.filter.name;
                        } else if (widget.widgetData.commonSrc.src.src == "MSSQL") {
                            var db = widget.widgetData.commonSrc.src.tbl.split(".");
                            query = "SELECT [" + key.filter.name + "] FROM [" + db[0] + '].[' + db[1] + "] GROUP BY [" + key.filter.name + "] ORDER BY [" + key.filter.name + "]";
                        }
                        else if (widget.widgetData.commonSrc.src.src == "hiveql"){
                             query = "SELECT " + key.filter.name + " FROM "+ widget.widgetData.commonSrc.src.tbl +"  GROUP BY " + key.filter.name + " ORDER BY " + key.filter.name + "";
                        }
                        else if (widget.widgetData.commonSrc.src.src == "Oracle"){
                             query = "SELECT " + key.filter.name + " FROM "+ widget.widgetData.commonSrc.src.tbl +"  GROUP BY " + key.filter.name + " ORDER BY " + key.filter.name + "";
                        }
                        $scope.client.getExecQuery(query, widget.widgetData.commonSrc.src.id, function(data, status){
                            if (status) {
                                key["values"] = [];
                                data.sort(function(a,b){return a[key.filter.name] - b[key.filter.name]});
                                key.sync = false;
                                for (var res in data) {
                                    var keyValue = data[res];
                                    for (var v in keyValue){
                                        var value = keyValue[v];
                                        $scope.$apply(function(){
                                            if (typeof value == 'number' ){
                                                key.values.push({
                                                    id: value,
                                                    value: value,
                                                    status: false
                                                });
                                            }else {
                                                key.values.push({
                                                    id: value.replace(/ /g,"_"),
                                                    value: value,
                                                    status: false
                                                });
                                            }
                                        })
                                    }
                                }
                            } else {
                                $scope.$apply(function(){
                                    key.sync = false;
                                    notifications.toast('0', 'Error Occured! Please try again!');
                                    return;
                                });
                            }
                        });
                    } else{
                        //maintain the selected filter options
                        angular.forEach(key.values,function(res){
                           var fieldId = "#" + widget.widgetID + "-" + res.id + "-" + key.filter.name;
                            if (res.status) {
                                $(fieldId).prop("checked",true); //check
                            } else{
                                $(fieldId).removeAttr("checked"); //un-check
                            }
                        })
                    }
                }
            });
        };

        //assign the selected filter options to a scope variable
        $scope.onClickFilterButton = function(widget){
            $scope.widgetFilters = widget.widgetData.commonSrc.filter;
        };

        //Method that is called when the fields are selected for filtering
        //Select if un-selected and vice versa
        $scope.onClickFilterField = function(name,value,widget){
            angular.forEach($scope.widgetFilters,function(key){
                if (key.filter.name == name){
                    if (key.type == 'single'){
                        angular.forEach(key.values,function(res){
                            if(res.value == value){
                                if (res.status){
                                    res.status = false;
                                    $("#"+widget.widgetID+"-"+name+"-"+key.filter.id).removeAttr("checked"); //uncheck
                                } else{
                                    res.status = true;        
                                }
                            } else{
                                res.status = false;
                                $("#"+widget.widgetID+"-"+name+"-"+key.filter.id).removeAttr("checked"); //uncheck
                            }
                        });
                    } else {
                        var count = 0;
                        angular.forEach(key.values,function(res){
                            if(res.value == value){
                                if (res.status) {
                                    res.status = false;
                                    //uncheck the 'All' checkbox if one of the fields is un-selected
                                    $("#"+widget.widgetID+"-"+name+"-"+key.filter.id).removeAttr("checked");
                                } else {
                                    res.status = true;
                                }    
                            }
                            if(res.status) {
                                count++;
                            }
                        })
                        // Check the 'All' checkbox if all the fields are selected
                        if (count == key.values.length){
                            $("#"+widget.widgetID+"-"+name+"-"+key.filter.id).attr("checked",true); //check
                            $("#"+widget.widgetID+"-"+name+"-"+key.filter.id).prop("checked",true); //check
                        }
                    }
                }
            })
        };

        // Regenerate the chart when the filter us applied
        $scope.buildChart = function(widget) {
            var tempFilterArray = [];
            var filterArray = [];
            var tempStr = "";
            var requestArray = [];
            var cat = "";
            var limit;
            $scope.client = $diginengine.getClient(widget.widgetData.commonSrc.src.src);
            //map the selected filter fields
            if ($scope.widgetFilters === undefined)
                $scope.widgetFilters = widget.widgetData.commonSrc.filter;
            filterArray = filterService.generateFilterParameters($scope.widgetFilters,widget.widgetData.commonSrc.src.src);

            if (filterArray.length > 0) {
                var filterStr = filterArray.join( ' And ');
            } else { // validation if no fields are selected and tried to filter
                notifications.toast('0', 'Please select fields to apply filters!');
                return;
            }

            //if chart is configured for drilled down, get the highest level to apply filters
            if (typeof widget.widgetData.widData.drillConf != "undefined" && widget.widgetData.widData.drilled) {
                var chart = widget.widgetData.highchartsNG.getHighcharts();
                if ( chart.options.customVar == widget.widgetData.widData.drillConf.highestLvl ) {
                    requestArray[0] = chart.options.customVar;                    
                } else {
                    notifications.toast('0', 'Please go to level 1 to apply filters!');
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
            if ( widget.widgetData.selectedChart.chart == "metric" ) {
                //Apply filters to metric widget
                $scope.filterMetricWidget(widget,filterStr);
            } 
            else if(widget.widgetData.selectedChart.chart == "forecast"){
                    widget.widgetData.syncState = false;
                    widget.widgetData.filteredState = true;
                    widget.widgetData.filterStr = "";
                    widget.widgetData.filterStr = filterStr;
                    $qbuilder.sync(widget.widgetData, function(data) {
                        $scope.$apply(function(){
                            widget.widgetData.syncState = true;
                            widget = data;
                        });
                    });


            }else if (widget.widgetData.selectedChart.chart == "Tabular") {

                widget.widgetData.widData.sort ="";
                var filterQuerry =  tabularService.getExecQueryFilterArr(widget,filterStr,widget.widgetData.widData.tabularConfig.defSortFeild);

                $scope.client.getExecQuery(filterQuerry, widget.widgetData.commonSrc.src.id, function(data, status) {
                    if(status == true){
                    if(widget.widgetData.widData.tabularConfig.totForNumeric == "true" ){
                     
                            var fieldArr=[];
                                for(var i=0; i < widget.widgetData.widData.tabularConfig.AllingArr.length; i++ ){

                                    if(widget.widgetData.widData.tabularConfig.AllingArr[i].isString == false){
                                        var obj = {
                                            "agg": widget.widgetData.widData.tabularConfig.AllingArr[i].Aggregation,
                                            "field": widget.widgetData.widData.tabularConfig.AllingArr[i].Attribute
                                        };

                                        fieldArr.push(obj);
                                    }
                                        

                                } 
                           if(fieldArr.length > 0){
                            $scope.client.getAggData(widget.widgetData.commonSrc.src.tbl, fieldArr, limit, widget.widgetData.commonSrc.src.id, function(res, statusa, query) { 
                                if(statusa == true){
                                    for(var i = 0; i < fieldArr.length ; i++)  {
                                        var str = (fieldArr[i].agg+"_"+fieldArr[i].field).toString();

                                        var splitArr = str.split(" ")
                                        str="";

                                        for(var a=0; a < splitArr.length ; a++){

                                            str = str + splitArr[a]; 
                                        }

                                        var obj = {
                                            field : fieldArr[i].field,
                                            aggName: fieldArr[i].agg+"_"+fieldArr[i].field,
                                            value : res[0][str]
                                        }

                                        for(var j=0; j < widget.widgetData.widData.tabularConfig.AllingArr.length; j++){

                                            if(widget.widgetData.widData.tabularConfig.AllingArr[j].Attribute == fieldArr[i].field){

                                                widget.widgetData.widData.tabularConfig.AllingArr[j].Aggregation_value =  res[0][str];

                                            }
                                        }
                                          
                                    }

                                    widget.widgetData.syncState = true;
                                    tabularService.setPagination(data,widget.widgetData.widData);
                                    widget.widgetData.filteredState = true;
                                    widget.widgetData.filterStr = filterStr;
                                }
                            },undefined,filterStr);

                        }
                        else{
                            widget.widgetData.syncState = true;
                            tabularService.setPagination(data,widget.widgetData.widData);
                            widget.widgetData.filteredState = true;
                            widget.widgetData.filterStr = filterStr;
                        }
                    }
                    else{
                        widget.widgetData.syncState = true;
                        tabularService.setPagination(data,widget.widgetData.widData);
                        widget.widgetData.filteredState = true;
                        widget.widgetData.filterStr = filterStr;
                    }
                    }
                 },100);
              
            }
            else {
                $scope.client.getAggData(widget.widgetData.commonSrc.src.tbl, widget.widgetData.commonSrc.mea, limit, widget.widgetData.commonSrc.src.id, function(res, status, query) {
                    if (status) {
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

                        for(c in res){

                            if(res[c][widget.widgetData.widData.diplaySortArr[0]['sortName']] != res[c][widget.widgetData.widData.diplaySortArr[0]['displayName']])
                                delete res[c][widget.widgetData.widData.diplaySortArr[0]['sortName']];
                        }

                        var data = filterService.mapResult(requestArray[0],res,widget.widgetData.widData.drilled,color,name,origName);
                        widget.widgetData.syncState = true;
                        widget.widgetData.filteredState = true;
                        if ( data !== undefined ) {
                            widget.widgetData.highchartsNG.series = data;
                            widget.widgetData.highchartsNG.series.forEach(function(key) {
                                if (key.data.length > 1000) key['turboThreshold'] = key.data.length;
                            });
                            $scope.$apply();
                        }
                    } else {
                        $scope.$apply(function(){
                            notifications.toast('0', 'Error Occured!Please try again!');
                            widget.widgetData.syncState = true;
                        })
                    }
                },widget.widgetData.widData.diplaySortArr[0].displayName,filterStr,widget.widgetData.widData.diplaySortArr[0].sortName);
            }
        };
        // Apply fileters to metric widget
        $scope.filterMetricWidget = function(widget,filterStr) {
            var targetRequest = false;
            var metricRequest = false;
            var targetSuccess = false;
            var metricSuccess = false;
            var metricValue, targetValue;
            if (widget.widgetData.commonSrc.target.length == 1) {
                $scope.client.getAggData(widget.widgetData.commonSrc.src.tbl, widget.widgetData.commonSrc.target, undefined, widget.widgetData.commonSrc.src.id, function(res, status, query) {
                    if (status) {
                        targetRequest = true;
                        targetSuccess = true;
                        targetValue = res;
                        if (targetRequest && metricRequest) {
                            widget.widgetData.syncState = true;
                            if (targetSuccess && metricSuccess) {
                                // call sync method
                                $scope.setValues(widget.widgetData,metricValue,targetValue);
                                widget.widgetData.filteredState = true;
                            } else {
                                $scope.$apply(function(){
                                    notifications.toast('0', 'Error Occured!Please try again!');
                                    widget.widgetData.syncState = true;
                                })
                            }
                        }
                    } else {
                        targetRequest = true;
                    }
                },undefined,filterStr);
            } else {
                targetRequest = true;
                targetSuccess = true;
            }
            $scope.client.getAggData(widget.widgetData.commonSrc.src.tbl, widget.widgetData.commonSrc.actual, undefined, widget.widgetData.commonSrc.src.id, function(res, status, query) {
                if (status) {
                    metricRequest = true;
                    metricSuccess = true;
                    metricValue = res;
                    if (targetRequest && metricRequest) {
                        widget.widgetData.syncState = true;
                        if (targetSuccess && metricSuccess) {
                            // call sync method
                            $scope.setValues(widget.widgetData,metricValue,targetValue);
                            widget.widgetData.filteredState = true;
                        } else {
                            $scope.$apply(function(){
                                notifications.toast('0', 'Error Occured!Please try again!');
                                widget.widgetData.syncState = true;
                            })
                        }
                    }
                } else {
                    metricRequest = true;
                }
            },undefined,filterStr);            
        }
        // Set values to metric widget
        $scope.setValues = function (widObj,metricValue,targetValue) {
            widObj.widData.decValue = metricValue[0];
            widObj.widData.value = convertDecimals(setMeasureData(metricValue[0]),parseInt(widObj.widData.dec)).toLocaleString();
            widObj.selectedChart.initObj.value = widObj.widData.value;
            widObj.selectedChart.initObj.decValue = widObj.widData.decValue;
            // Apply metric settings after filtering if target value is set
            if (widObj.selectedChart.initObj.targetValue != "" && widObj.selectedChart.initObj.targetValueString != "") {
                if (widObj.commonSrc.target.length == 1) {
                    widObj.selectedChart.initObj.targetValue = setMeasureData(targetValue[0]);
                    widObj.selectedChart.initObj.targetValueString = convertDecimals(widObj.selectedChart.initObj.targetValue,2).toLocaleString();
                }
                metricChartServices.applyMetricSettings(widObj.selectedChart);
            }
            $scope.$apply();
        }

        function setMeasureData(res) {
            var val = "";
            for (var c in res) {
                if (Object.prototype.hasOwnProperty.call(res, c)) {
                    val = res[c];
                }
            }
            return val;
        }        

        //when all checkbox is clicked
        $scope.onCLickAll = function(widgetId,name,filterId){
            var id = '#' + widgetId + "-" + name + "-" + filterId;
            var fieldId = "";
            var status = $(id).is(':checked');
            angular.forEach($scope.widgetFilters,function(key){
                if (key.filter.name == name){
                    angular.forEach(key.values,function(res){
                        fieldId = '#' + widgetId + '-' + res.id + '-' + name;
                        if (!res.status){
                            if (status){
                                res.status = true;
                                $(fieldId).attr("checked",true); //check
                                $(fieldId).prop("checked",true); //check
                            }
                        } else {
                            if(!status){
                                res.status = false;
                                $(fieldId).removeAttr("checked"); //uncheck
                            }
                        }
                    })                    
                }
            })                
        };

        //clear filters
        $scope.clearFilter = function(widget) {
            //if chart is configured for drilled down, get the highest level to apply filters
            if (typeof widget.widgetData.widData.drillConf != "undefined" && widget.widgetData.widData.drilled) {
                var chart = widget.widgetData.highchartsNG.getHighcharts();
                if ( chart.options.customVar == widget.widgetData.widData.drillConf.highestLvl ) {
                    widget.widgetData.filteredState = false;
                    $scope.syncWidget(widget);
                } else {
                    notifications.toast('0', 'Please go to level 1 to remove filters!');
                    return;
                }
            } 
            else if(widget.widgetData.selectedChart.chart == "forecast"){
                widget.widgetData.filteredState = false;
                widget.widgetData.filterStr = "";
                $scope.syncWidget(widget);

            }
            else if(widget.widgetData.selectedChart.chart == "Tabular"){
                widget.widgetData.filteredState = false;
                widget.widgetData.filterStr = "";
                $scope.syncWidget(widget);

            }
            else{
                widget.widgetData.filteredState = false;
                $scope.syncWidget(widget);
            }           
        };

        // filter methods end

        $scope.convertCSVtoJson = function(src) {
            AsTorPlotItems.then(function(data) {
                $scope.items = data;
            });
        };
        $scope.shareWidget = function(ev, widget){
            var dashboardName = $rootScope.dashboard.compName;
            if(typeof dashboardName != "undefined"){
                $mdDialog.show({
                    controller: 'shareCtrl',
                    templateUrl: 'views/dashboard-share.html',
                    clickOutsideToClose: true,
                    resolve: {},
                    locals: {
                        widget: widget,
                        DashboardName:dashboardName
                    }
                });
            }else{
                notifications.toast('0', 'Please save the dashboard before proceed');
            }
        
        }
		
		$scope.widgetFullscreen = function(ev, widget)
		{
			$mdDialog.show({
			  controller: 'fullscreenCtrl',
			  templateUrl: 'views/dashboard/fullscreen.html',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose:true,
			  locals: {widget: widget},
			  fullscreen: true // Only for -xs, -sm breakpoints.
			})
			.then(function(answer) {
			 // $scope.status = 'You said the information was "' + answer + '".';
			}, function() {
			  //$scope.status = 'You cancelled the dialog.';
			});
		}

        /*Summary:
         synchronizes data per widget
         @widget : widget that need to get updated
         */
        $scope.syncWidget = function(widget) {

            if (typeof widget.widgetData.widConfig != 'undefined') {
                DynamicVisualization.syncWidget(widget, function(data) {
                    widget.widgetData.syncState = true;
                    widget = data;
                });
            } else if (typeof(widget.widgetData.commonSrc) != "undefined") {
                // if chart is configured for drilled down, get the highest level to apply filters
                if (typeof widget.widgetData.widData.drillConf != "undefined" && widget.widgetData.widData.drilled) {
                    var chart = widget.widgetData.highchartsNG.getHighcharts();
                    if ( chart.options.customVar != widget.widgetData.widData.drillConf.highestLvl ) {
                        widget.widgetData.syncState = false;
                        $qbuilder.syncDrilledChart(widget.widgetData,$scope);
                        return;
                    }
                }
                // If the chart is configured for filters, it should sync accordinly
                if (widget.widgetData.filteredState) {
                    widget.widgetData.syncState = false;
                    $scope.buildChart(widget);
                } else {
                    widget.widgetData.syncState = false;
                    widget.widgetData.filteredState = false;
                    $qbuilder.sync(widget.widgetData, function(data) {
                        filterService.clearFilters(widget);
                        $scope.$apply(function(){
                            widget.widgetData.syncState = true;
                            widget = data;
                        });
                    });
                }
            }
        };

        $scope.pngDownload = function(widget) {

            var type = "png";
            $scope.d3ImgDownload(widget, type);

        };

        $scope.jpegDownload = function(widget) {

            var type = "jpeg";
            $scope.d3ImgDownload(widget, type);

        };

        $scope.d3ImgDownload = function(widget, type) {


            var id = "#" + widget.widgetData.widData.id;
            var element = $("" + id + "");

            var downType = null;
            switch (type) {

                case 'png':
                    downType = "image/png";
                    break;

                case 'jpeg':
                    downType = "image/jpeg";
                    break;

            }

            $("#svg-container").empty();
            $("#svg-container").append(element[0].innerHTML);
            var svgEle = $("#svg-container").children();
            var svgElement = svgEle[0];



            svgElement.children[0].setAttribute("transform", "translate(" + 300+ "," + 300 + ") rotate(-90 0 0)");
            console.log(svgElement);
            var svgString = new XMLSerializer().serializeToString(svgElement);


            var name = "";
            if(typeof widget.widgetData.widName != 'undefined')
                name = widget.widgetData.widName;

            var svgInnerContainer = svgEle[0].innerHTML;
            var chartName = '<text fill="#000000" font-size="15" font-family="Verdana" x="250" y="20">'+name+'</text>';
            svgString= '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0  600 600" width="100%"> '+chartName+' + '+svgInnerContainer+' +</svg>';



            $("#canvas").empty();
            var canvas = document.getElementById("canvas");
            var ctx = null;
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, 600, 600);
            if (type == "jpeg") {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, 600, 600);
            }
            var DOMURL = self.URL || self.webkitURL || self;
            var img, svg = null;
            var img = new Image();
            var svg = new Blob([svgString], {
                type: "image/svg+xml;charset=utf-8"
            });
            var url = DOMURL.createObjectURL(svg);

            img.onload = function() {
                ctx.drawImage(img, 0, 0);
                var imgURL = canvas.toDataURL(downType);
                DOMURL.revokeObjectURL(imgURL);
                var dlLink = null;
                var dlLink = document.createElement('a');
                dlLink.download = "image";
                dlLink.href = imgURL;
                dlLink.dataset.downloadurl = [downType, dlLink.download, dlLink.href].join(':');
                document.body.appendChild(dlLink);
                dlLink.click();
                document.body.removeChild(dlLink);
            }

            img.src = url;
            $scope.d3chartBtnClick(widget);
        }

        $scope.svg_to_pdf = function(widget) {

            var id = "#" + widget.widgetData.widData.id;
            var element = $("" + id + "");

            $("#svg-container").empty();
            $("#svg-container").append(element[0].innerHTML);
            var svgEle = $("#svg-container").children();
            var svg = svgEle[0];

            svg.setAttribute("viewBox", "0 0  600 600")
            svg.children[0].setAttribute("transform", "translate(300,300) rotate(-90 0 0)");
            var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            newElement.setAttribute('x',20);
            newElement.setAttribute('y',20);
            newElement.setAttribute('fill','#000000');
            newElement.setAttribute('font-size',20);
            newElement.setAttribute('font-family','Verdana');


            if(typeof widget.widgetData.widName != 'undefined')
                newElement.innerHTML = widget.widgetData.widName;

            svg.appendChild(newElement);

             $scope.svg_to_pdf_fun(svg, function (pdf) {
                $scope.download_pdf('SVG.pdf', pdf.output('dataurlstring'));
            });


            $scope.d3chartBtnClick(widget);


        }

        //--------------------------
        $scope.svg_to_pdf_fun = function (svg, callback) {
          svgAsDataUri(svg, {}, function(svg_uri) {
            var image = document.createElement('img');

            image.src = svg_uri;
            image.onload = function() {
              var canvas = document.createElement('canvas');
              var context = canvas.getContext('2d');
              var doc = new jsPDF('portrait', 'pt');
              var dataUrl;

              canvas.width = image.width;
              canvas.height = image.height;
              context.drawImage(image, 0, 0, image.width, image.height);
              dataUrl = canvas.toDataURL('image/png');
              doc.addImage(dataUrl, 'PNG', 0, 0, image.width, image.height);

              callback(doc);
            }
          });
        }


        $scope.download_pdf = function (name, dataUriString) {
          var link = document.createElement('a');
          link.addEventListener('click', function(ev) {
            link.href = dataUriString;
            link.download = name;
            document.body.removeChild(link);
          }, false);
          document.body.appendChild(link);
          link.click();
        }

        //--------------------------

        $scope.printD3Chart = function(widget) {

            var id = "#" + widget.widgetData.widData.id;
            var element = $("" + id + "");

            var printContents = element[0].innerHTML;
            var originalContents = document.body.innerHTML;

            //----------------------------------------------------

            var name = "";
            if(typeof widget.widgetData.widName != 'undefined')
                name = widget.widgetData.widName;

            var chartName = '<text fill="#000000" font-size="15" font-family="Verdana" x="250" y="0">'+name+'</text>';
            svgString= '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -20  600 800" width="100%"> '+chartName+' + '+printContents+' +</svg>';

            console.log(svgString);
            
            //----------------------------------------------------



            var popupWin = window.open('', '_blank', 'width=800,height=500');
            popupWin.document.open();
            popupWin.document.write('');
            popupWin.document.write('<html><head></head><body onload="window.print()">' + svgString + '</body></html>');
            popupWin.document.close();

            $scope.d3chartBtnClick(widget);


        }

        $scope.d3chartBtnClick = function(widget) {

            var d3btnTemp = widget.d3chartBtn;
            widget.d3chartBtn = !d3btnTemp;
        };

        var generateFiltersArray = function(dashboardFilters) {
            var filtersArray = [];
            var tempArray = [];
            angular.forEach(dashboardFilters, function(dbFilter){
                tempArray = [];
                if (dbFilter.is_custom == 0 || dbFilter.is_custom == false){
                    if (dbFilter.filterParameters !== undefined){
                        angular.forEach(dbFilter.filterParameters,function(row){
                            tempArray.push({
                                status: row.status,
                                value: row.value
                            })
                        })
                        if (tempArray.length > 0){
                            filtersArray.push({
                                filter: {
                                    name: dbFilter.value_field,
                                    values: tempArray
                                }
                            })
                        }
                    }
                } else {
                    angular.forEach(dbFilter.custom_fields,function(row){
                        tempArray.push({
                            status: row.status,
                            value: row.actualValue
                        })
                    })
                    filtersArray.push({
                        filter: {
                            name: dbFilter.filter_name,
                            values: tempArray
                        }
                    })
                }
            })
            return filtersArray;
        };

        //sync widgets of a page when page is opened
        $scope.syncPage = function(page) {
            $scope.isPageSync = true;
            var filterArray = [];
            if (!page.isSeen) {
                var count=0;
                for (var i = 0; i < page.widgets.length; i++) {
                   
                        if (typeof(page.widgets[i].widgetData.commonSrc) != "undefined") {
                            page.widgets[i].widgetData.syncState = false;
                            //Clear the filter indication when the chart is re-set
                            page.widgets[i].widgetData.filteredState = false;
                            filterService.clearFilters(page.widgets[i]);
                            if (page.widgets[i].widgetData.selectedChart.chartType != "d3hierarchy" && page.widgets[i].widgetData.selectedChart.chartType != "d3sunburst") {
                                if($rootScope.dashboard.dashboard_filters && page.widgets[i].widgetData.selectedChart.chartType == "highCharts") {
                                    filterArray = generateFiltersArray($rootScope.dashboard.dashboardFilters)
                                    dashboardFilterService.dashboardFilterWidget(page.widgets[i],filterArray,function(data){
                                        count++;
                                        if(page.widgets.length == count){
                                            pouchDbServices.pageSync($rootScope.dashboard);
                                        }
                                    },'page')
                                } else {
                                    if (page.widgets[i].widgetData.selectedChart.chartType == "highCharts") {
                                        var filterArray = [];
                                      if ($rootScope.dashboard.filterDetails.length > 0) {
                                        angular.forEach($rootScope.dashboard.filterDetails,function(filter) {
                                          if (filter.is_default) {
                                            filterArray.push({
                                              filter: {
                                                name: filter.filter_name,
                                                values: {
                                                  status: true,
                                                  value: filter.default_value
                                                }
                                              }
                                            })
                                          }
                                        })
                                        if (filterArray.length > 0 ){
                                            dashboardFilterService.dashboardFilterWidget(page.widgets[i],filterArray,function(data){
                                                count++;
                                                if(page.widgets.length == count){
                                                    pouchDbServices.pageSync($rootScope.dashboard);
                                                }
                                            },'page')
                                        } else {
                                            $qbuilder.sync(page.widgets[i].widgetData, function (data) {
                                                count++;
                                                if(page.widgets.length == count){
                                                    pouchDbServices.pageSync($rootScope.dashboard);
                                                }
                                            });
                                        }
                                      } else {
                                        $qbuilder.sync(page.widgets[i].widgetData, function (data) {
                                            count++;
                                            if(page.widgets.length == count){
                                                pouchDbServices.pageSync($rootScope.dashboard);
                                            }
                                        });
                                      }
                                    } else {
                                        $qbuilder.sync(page.widgets[i].widgetData, function (data) {
                                            count++;
                                            if(page.widgets.length == count){
                                                pouchDbServices.pageSync($rootScope.dashboard);
                                            }
                                        });
                                    }
                                }
                            }else{
                                 count++;
                            }
                        }else{
                          count++;
                          if(page.widgets.length == count){
                              pouchDbServices.pageSync($rootScope.dashboard);
                              
                           }
                        }
                    
                }
                $scope.isPageSync = false;
                for (var j = 0; j < $rootScope.dashboard.pages.length; j++) {
                    if (page.pageID == $rootScope.dashboard.pages[j].pageID) {
                        $rootScope.dashboard.pages[j]["isSeen"] = true
                    }
                }
            }
        };

        $scope.tabIdndexInit = function() {
            console.log($rootScope.selectedPageIndx);
        };

        $scope.widInit = function(widget) {
            widget.isD3chart = false;
            widget.d3chartBtn = false;
            switch (widget.widgetName) {

                case 'sunburst':
                    widget.isD3chart = true;
                    break;

                case 'hierarchy':
                    widget.isD3chart = true;
                    break;

            }

            if (typeof widget.widgetData.widData.drillConf != "undefined" && widget.widgetData.widData.drilled) {
                var drillConf = widget.widgetData.widData.drillConf;
                var client = $diginengine.getClient(drillConf.dataSrc);
                widget.widgetData.highchartsNG.options['customVar'] = drillConf.highestLvl;
                widget.widgetData.highchartsNG.options.chart['events'] = {
                    drilldown: function(e) {

                        if (!e.seriesOptions) {
                            var srcTbl = drillConf.srcTbl,
                                fields = drillConf.fields,
                                drillOrdArr = drillConf.drillOrdArr,
                                chart = this,
                                clientObj = client,
                                clickedPoint = e.point.name,
                                nextLevel = "",
                                highestLvl = this.options.customVar,
                                drillObj = {},
                                isLastLevel = false,
                                selectedSeries = e.point.series.name,
                                filterStr = "",
                                origName = "",
                                serName = "",
                                tempArrStr = "",
                                conStr = "";
                                var limit;
                                var level;
                                var tempArray = [];
                                var isDate;
                                var groupBy;
                                var orderBy;
                            // var cat = [];
                            for (i = 0; i < drillOrdArr.length; i++) {
                                if (drillOrdArr[i].name == highestLvl) {
                                    nextLevel = drillOrdArr[i].nextLevel;
                                    groupBy = widget.widgetData.widData.diplaySortArr[i+1].displayName;
                                    orderBy = widget.widgetData.widData.diplaySortArr[i+1].sortName;
                                    drillOrdArr[i].clickedPoint = clickedPoint;
                                    level = drillOrdArr[i].level;
                                    if (!drillOrdArr[i + 1].nextLevel) isLastLevel = true;
                                }
                            }
                            chart.options.lang.drillUpText = " Back to " + highestLvl;
                            // Show the loading label
                            chart.showLoading("Retrieving data for '" + clickedPoint.toString().toLowerCase() + "' grouped by '" + nextLevel + "'");

                            // get the filter parameters              
                            if (widget.widgetData.filteredState) {
                                filterArray = filterService.generateFilterParameters(widget.widgetData.commonSrc.filter,widget.widgetData.commonSrc.src.src);
                                if (filterArray.length > 0) {
                                    filterStr = filterArray.join( ' And ');
                                }
                            }
                            for(var c = 0; c<level;c++) {
                                tempArrStr = "";
                                isDate = false;
                                angular.forEach(widget.widgetData.commonSrc.src.fAttArr,function(key) {
                                    if (key.name == drillOrdArr[c].name) {
                                        if (key.dataType !== undefined) {
                                            if (key.dataType == 'DATE' || key.dataType == 'Date'){
                                                isDate = true;
                                            }
                                        }
                                    }
                                });
                                if ( widget.widgetData.commonSrc.src.src == "MSSQL") {
                                    if (typeof drillOrdArr[c].clickedPoint == 'number') {
                                        if (isDate){
                                            tempArrStr = 'Date(['+drillOrdArr[c].name + "]) = " + drillOrdArr[c].clickedPoint;
                                        }else{
                                            tempArrStr = '[' + drillOrdArr[c].name + "] = " + drillOrdArr[c].clickedPoint;
                                        }
                                    } else {
                                        if(isDate){
                                            tempArrStr = 'Date(['+drillOrdArr[c].name + "]) = '" + drillOrdArr[c].clickedPoint + "'";
                                        }else{
                                            tempArrStr = '[' + drillOrdArr[c].name + "] = '" + drillOrdArr[c].clickedPoint + "'";
                                        }
                                    }
                                } else {
                                    if (typeof drillOrdArr[c].clickedPoint == 'number') {
                                        if (isDate){
                                            tempArrStr = 'Date('+drillOrdArr[c].name + ") = " + drillOrdArr[c].clickedPoint;
                                        }else{
                                            tempArrStr = drillOrdArr[c].name + " = " + drillOrdArr[c].clickedPoint;
                                        }
                                    } else {
                                        if(isDate){
                                            tempArrStr = 'Date('+drillOrdArr[c].name + ") = '" + drillOrdArr[c].clickedPoint + "'";
                                        }else{
                                            tempArrStr = drillOrdArr[c].name + " = '" + drillOrdArr[c].clickedPoint + "'";
                                        }
                                    }
                                }
                                tempArray.push(tempArrStr);
                            }
                            if (tempArray.length > 0){
                                var tempStr = tempArray.join( ' And ');
                                if (filterStr != ""){
                                    filterStr = filterStr + ' And ' + tempStr;
                                } else {
                                    filterStr += tempStr;
                                }
                            }
                            //aggregate method
                            clientObj.getAggData(srcTbl, fields, limit, widget.widgetData.commonSrc.src.id, function(res, status, query) {
                                filterService.filterAggData(res,widget.widgetData.commonSrc.src.filterFields);
                                angular.forEach( widget.widgetData.highchartsNG.series, function(series) {
                                    if ( series.name == selectedSeries ) {
                                        origName = series.origName;
                                        serName = series.name;
                                    }
                                });
                                drillConf["level"+(level+1)+"Query"] = query;
                                widget.widgetData.widData.drillConf.currentQuery = query;
                                if (status) {
                                    for (var key in res[0]) {
                                        if (Object.prototype.hasOwnProperty.call(res[0], key)) {
                                            if (key != nextLevel && key == origName) {
                                                drillObj = {
                                                    name: serName,
                                                    data: [],
                                                    origName: key,
                                                    turboThreshold: 0
                                                };
                                            }
                                        }
                                    }
                                    if (res.length > 0 ) {
                                        res.forEach(function(key) {
                                            if (!isLastLevel) {
                                                drillObj.data.push({
                                                    name: key[nextLevel],
                                                    y: parseFloat(key[drillObj.origName]),
                                                    drilldown: true
                                                });
                                            } else {
                                                drillObj.data.push({
                                                    name: key[nextLevel],
                                                    y: parseFloat(key[drillObj.origName])
                                                });
                                            }
                                        });
                                        drillObj['cropThreshold'] = drillObj.data.length;
                                    }
                                    chart.addSeriesAsDrilldown(e.point, drillObj);

                                } else {
                                    notifications.toast('0','request failed due to :' + JSON.stringify(res));
                                    e.preventDefault();
                                }
                                widget.widgetData.highchartsNG.xAxis["title"] = {
                                    text: nextLevel
                                };
                                widget.widgetData.highchartsNG.yAxis["title"] = {
                                    text: selectedSeries
                                };                                
                                chart.options.customVar = nextLevel;
                                chart.hideLoading();
                            }, groupBy, filterStr,orderBy);
                        }
                    },
                    drillup: function(e) {
                        var chart = this;
                        console.log(chart);
                        console.log(chart.options.customVar);
                        drillConf.drillOrdArr.forEach(function(key) {
                        if (key.nextLevel && key.nextLevel == chart.options.customVar) {
                            chart.options.customVar = key.name;
                            widget.widgetData.highchartsNG.xAxis["title"] = {
                                text: chart.options.customVar
                            };                                                                        
                            }
                        });
                        // set x and y axis titles (DUODIGIN-914)
                        var flag = false;
                        drillConf.drillOrdArr.forEach(function(key) {
                            if (key.name == chart.options.customVar) {
                                drillConf.currentQuery = drillConf["level" + key.level + "Query"];
                            }
                            if (chart.options.customVar == key.nextLevel) {
                                chart.options.lang.drillUpText = " Back to " + key.name;
                                flag = true;
                            }
                        });
                        if (!flag) {
                            widget.widgetData.highchartsNG.yAxis["title"] = {
                                text: 'values'
                            };
                        }
                    },
                    beforePrint: function() {
                        this.setTitle({
                            text: this.options.exporting.chartOptions.title.text
                        })
                        this.heightPrev = this.chartHeight;
                        this.widthPrev = this.chartWidth;
                        if (this.drillUpButton !== undefined) this.drillUpButton = this.drillUpButton.destroy();
                        this.setSize(800,600, false);
                    },
                    afterPrint: function() {
                        this.setTitle({
                            text: null
                        })
                        this.setSize(this.widthPrev,this.heightPrev, true);
                        if (this.drilldownLevels.length != 0) this.showDrillUpButton();
                    }                      
                }
            }
        };
        $scope.removePage = function(page, ev) {

            $mdDialog.show({
                controller: function removePageCtrl($scope, $mdDialog, ngToast) {

                    var removePage = null;
                    $scope.close = function() {
                        removePage = true;
                        $mdDialog.hide(removePage);
                    }
                    $scope.cancel = function() {

                        $mdDialog.cancel();
                        removePage = false;
                    };
                },
                templateUrl: 'views/removePage.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true

            }).then(function(removePage) {

                if (removePage) {

                    if (typeof $rootScope.dashboard.deletions == "undefined") {
                        $rootScope.dashboard.deletions = {
                            "componentIDs": [],
                            "pageIDs": [],
                            "widgetIDs": []

                        }
                    }

                    var pages = $rootScope.dashboard.pages;
                    for (var i = 0; i < pages.length; i++) {
                        //check for the specific page in pages array
                        if (pages[i].pageID == page.pageID) {
                            pages.splice(i, 1);
                            //if removed page is not a new page push it
                            if (page.pageID.toString().substr(0, 4) != "temp") {
                                $rootScope.dashboard.deletions.pageIDs.push(page.pageID);
                            }
                            console.log("$rootScope.dashboard.deletions", $rootScope.dashboard.deletions);
                        }
                    }

                    ngToast.create({
                        className: 'success',
                        content: 'Page removed successfully',
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true
                    });
                }
            });
        }
        $scope.removeWidget = function(widget, ev) {

            $mdDialog.show({
                templateUrl: 'views/closeWidget.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                controller: function closeWidgetCtrl($scope, $mdDialog) {

                    var removeWidget = null;
                    $scope.close = function() {



                        removeWidget = true;
                        $mdDialog.hide(removeWidget, widget);
                        //$scope.$apply();
                    }
                    $scope.cancel = function() {

                        $mdDialog.cancel();
                        removeWidget = false;
                    };


                }
            }).then(function(removeWidget) {

                if (typeof $rootScope.dashboard.deletions == "undefined") {
                    $rootScope.dashboard.deletions = {
                        "componentIDs": [],
                        "pageIDs": [],
                        "widgetIDs": []

                    }
                }

                if (removeWidget) {

                    var selectedPage = $rootScope.selectedPage;
                    var widgets = $rootScope.dashboard.pages[selectedPage - 1].widgets;
                    for (var i = 0; i < widgets.length; i++) {
                        //check for the specific widget in widgets array
                        if (widgets[i].widgetID == widget.widgetID) {
                            widgets.splice(i, 1);
                            //if removed widget is not a new widget push it
                            if (widget.widgetID.toString().substr(0, 4) != "temp") {
                                $rootScope.dashboard.deletions.widgetIDs.push(widget.widgetID);
                            }
                            console.log("$rootScope.dashboard.deletions", $rootScope.dashboard.deletions);
                        }
                    }
                    ngToast.dismiss();
                    ngToast.create({
                        className: 'success',
                        content: 'Widget removed successfully',
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true
                    });
                }
            });
        };
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }
        $scope.getIndexes = function() {
            var client = $objectstore.getClient("com.duosoftware.com");
            client.onGetMany(function(data) {
                data.forEach(function(entry) {

                    $rootScope.indexes.push({
                        value: entry,
                        display: entry
                    });
                });
            });
            client.getClasses("com.duosoftware.com");
        }
         $scope.commentary = function(widget) {
            var comment = "";
            var chunks = [];
            if(widget.widgetName== "metric")
            {
                 var msg = new SpeechSynthesisUtterance("Total" + widget.widgetData.widName+" is  "+ widget.widgetData.widData.value + widget.widgetData.widData.scale);
            window.speechSynthesis.speak(msg);
            }
          
           
        }
        $scope.closeDialog = function() {
            $mdDialog.hide();
        };
        $scope.clear = function() {
            $rootScope.dashboard.pages[$rootScope.selectePage - 1].widgets = [];
        };


        $scope.setShowWidgetSettings = function(widget) {
              if(widget.widgetData.selectedChart.chartType == "Tabular"){
                widget.widgetData.widData.tabularService=tabularService;
                widget.widgetData.widData.tabularService.tabularNavigate('Next',widget,true);
            }
            widget.showWidgetSettings = false;
        }

        $scope.showWidgetSettingsDiv = function(widget, state) {
            widget.showWidgetSettings = state;
        }

        $scope.alert = '';


        $scope.config = {}; // use defaults
        $scope.model = {};

        // init dashboard
        $scope.selectedDashboardId = '1';

        //update new UI damith
        //mouse over enable scroler bar
        $scope.chatWidgetscrollEnabled = false;

    }
]);

routerApp.controller('fullscreenCtrl', ['$scope', '$mdDialog', 'widget', function($scope, $mdDialog, widget) {

	
	$scope.widget = angular.copy(widget);
	if($scope.widget.widgetData.selectedChart.chartType == "d3sunburst") //$scope.widget.widgetData.selectedChart.chartType != "d3hierarchy" ||
	{
		$scope.widget.widgetData.widData.id = 'fullScreenChart';
		$scope.widget.widView = "views/ViewHnbMonthFullscreen.html"
		
	}
	
	if($scope.widget.widgetData.selectedChart.chartType == "d3hierarchy") //$scope.widget.widgetData.selectedChart.chartType != "d3hierarchy" ||
	{
		$scope.widget.widgetData.widData.id = 'fullScreenChart';
		$scope.widget.widView = "views/ViewHnbMonthFullscreen.html"
		
	}
	
	$scope.widget.widgetData.highchartsNG["size"] = {
		width: document.documentElement.offsetWidth,
		height: document.documentElement.offsetHeight - 65
	};

	console.log($scope.widget);
	
	$scope.cancel = function()
	{
		$mdDialog.cancel();
	}
	
	$scope.onClickDownload = function() {

		var svg = document.getElementById('d3Sunburst').childNodes[2].innerHTML;
		var canvas = document.getElementById('canvas');
		canvg(canvas, svg);
		var dataURL = canvas.toDataURL('image/png');
		var downloadBtn = document.getElementById('downloadImage');
		downloadBtn.href = dataURL;
	}
	
}]);