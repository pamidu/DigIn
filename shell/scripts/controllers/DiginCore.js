/*
 ----------------------Summary-------------------------------
 | Controllers listed below are here                        |
 ------------------------------------------------------------
 |      showWidgetCtrl                                      |
 |      DashboardCtrl                                       |
 |      ReportCtrl                                          |
 |      analyticsCtrl                                       |
 |      d3PluginCtrl                                        |
 |      ExtendedanalyticsCtrl                               |
 |      ExtendedReportCtrl                                  |
 |      ExtendedDashboardCtrl                               |
 |      summarizeCtrl                                       |
 |      settingsCtrl                                        |
 |      pStackCtrl                                          |
 ------------------------------------------------------------
 */
routerApp.controller('showWidgetCtrl', function($scope, $mdDialog, widget) {

    $scope.widget = angular.copy(widget);
    $scope.dHeight = $scope.widget.widgetData.height + 100;

    $scope.returnWidth = function(width, height) {
        console.log("width here", width, height);
        if ($scope.widget.widgetData.initCtrl == "elasticInit") {
            console.log('elastic');
            $scope.widget.widgetData.highchartsNG.size.width = parseInt(width);
            $scope.widget.widgetData.highchartsNG.size.height = parseInt(height);
        }
    };
    var reSizeWidget = function() {
        $scope.widget.widgetData.highchartsNG.size.width = parseInt(600);
        $scope.widget.widgetData.highchartsNG.size.height = parseInt(400);
    }

    $scope.setChartSize = function(data) {
        console.log(data);
        setTimeout(function() {
            reSizeWidget();
        }, 50);
    }

    $scope.closeDialog = function() {
        $mdDialog.hide();
    };

});
routerApp.controller('DashboardCtrl', ['$scope','$interval','$http', '$rootScope', '$mdDialog', '$objectstore', '$sce', '$log', '$csContainer', 'filterService', '$diginurls','$state', '$qbuilder', '$diginengine', 'ngToast', 'report_Widget_Iframe', '$sce', 'notifications','pouchDbServices',
    function($scope,$interval,$http, $rootScope, $mdDialog, $objectstore, $sce, $log, $csContainer, filterService, $diginurls, $state, $qbuilder, $diginengine, ngToast, report_Widget_Iframe, $sce,  notifications,pouchDbServices) {

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
				handle: '.digin-widget-toolbar'
            },
            resizable: {
                enabled: true,
                handles: ['n', 'e', 's', 'w', 'se', 'sw', 'ne', 'nw']
            }
        };

        // if($rootScope.tempDashboard.length != 0)
        $rootScope.tempDashboard = angular.copy($rootScope.dashboard);
        $scope.reportWidgetURL = $sce.trustAsResourceUrl(report_Widget_Iframe);
        
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
                        query = "SELECT " + key.filter.name + " FROM " + $diginurls.getNamespace() + "." + widget.widgetData.commonSrc.src.tbl + " GROUP BY " + key.filter.name;
                        $scope.client.getExecQuery(query, function(data, status){
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
                                $scope.apply(function(){
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
            //map the selected filter fields
            filterArray = filterService.generateFilterParameters($scope.widgetFilters);

            if (filterArray.length > 0){
                var filterStr = filterArray.join( ' And ');
            } else { // validation if no fields are selected and tried to filter
                notifications.toast('0', 'Please select fields to apply filters!');
                return;
            }

            //if chart is configured for drilled down, get the highest level to apply filters
            if (typeof widget.widgetData.widData.drillConf != "undefined" && widget.widgetData.widData.drilled){
                var chart = widget.widgetData.highchartsNG.getHighcharts();
                if ( chart.options.customVar == widget.widgetData.widData.drillConf.highestLvl ) {
                    requestArray[0] = chart.options.customVar;                    
                } else {
                    notifications.toast('0', 'Please go to level 1 to apply filters!');
                    return;
                }
            } else{
                requestArray[0] = widget.widgetData.commonSrc.att[0].filedName;                
            }
            widget.widgetData.syncState = false;
            $scope.client.getAggData(widget.widgetData.commonSrc.src.tbl, widget.widgetData.commonSrc.mea, limit, function(res, status, query) {
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
                    var data = filterService.mapResult(requestArray[0],res,widget.widgetData.widData.drilled,color,name,origName);
                    widget.widgetData.syncState = true;
                    widget.widgetData.filteredState = true;
                    if ( data !== undefined ){
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
            },requestArray,filterStr);            
        };

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
            } else{
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

        /*Summary:
         synchronizes data per widget
         @widget : widget that need to get updated
         */
        $scope.syncWidget = function(widget) {

            console.log('syncing...');
            if (typeof widget.widgetData.widConfig != 'undefined') {
                DynamicVisualization.syncWidget(widget, function(data) {
                    widget.widgetData.syncState = true;
                    widget = data;
                });
            } else if (typeof(widget.widgetData.commonSrc) != "undefined") {
                // if chart is configured for drilled down, get the highest level to apply filters
                if (typeof widget.widgetData.widData.drillConf != "undefined" && widget.widgetData.widData.drilled){
                    var chart = widget.widgetData.highchartsNG.getHighcharts();
                    if ( chart.options.customVar != widget.widgetData.widData.drillConf.highestLvl ) {
                        notifications.toast('0', 'Please go to the highest level to sync the chart!');
                        return;
                    }
                }
                widget.widgetData.syncState = false;

                // If the chart is configured for filters, it should sync accordinly
                if (widget.widgetData.filteredState) {
                    $scope.buildChart(widget);
                } else {
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
            newElement.setAttribute('x',200);
            newElement.setAttribute('y',20);
            newElement.setAttribute('fill','#000000');
            newElement.setAttribute('font-size',20);
            newElement.setAttribute('font-family','Verdana');


            if(typeof widget.widgetData.widName != 'undefined')
                newElement.innerHTML = widget.widgetData.widName;

            svg.appendChild(newElement);

            svgAsDataUri(svg, {}, function(svg_uri) {
                var image = document.createElement('img');

                image.src = svg_uri;
                image.style.background = "#FFFFFF";
                image.style.backgroundColor = "#FFFFFF";

                image.onload = function() {
                    var canvas = document.getElementById("canvas");
                    var context = canvas.getContext('2d');
                    context.clearRect(0, 0, 600, 600);
                    context.setFillColor = "#FFFFFF";
                    context.fillRect(0, 0, 600, 600);
                    var doc = new jsPDF('portrait', 'pt');
                    var dataUrl;

                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image, 0, 0, image.width, image.height);
                    dataUrl = canvas.toDataURL('image/png');
                    doc.addImage(dataUrl, 'png', 0, 0, image.width, image.height);
                    doc.setFillColor = "#FFFFFF";

                    var x = doc.output('dataurlstring');
                    var link = document.createElement('a');
                    link.addEventListener('click', function(ev) {
                        link.href = doc.output('dataurlstring');
                        link.download = "download";
                        document.body.removeChild(link);

                    }, false);

                    document.body.appendChild(link);
                    link.click();
                }
            });


            $scope.d3chartBtnClick(widget);


        }

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
            svgString= '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -40  600 600" width="100%"> '+chartName+' + '+printContents+' +</svg>';

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

        //sync widgets of a page when page is opened
        $scope.syncPage = function(page) {
            $scope.isPageSync = true;
            if (!page.isSeen) {
                var count=0;
                for (var i = 0; i < page.widgets.length; i++) {
                    if (typeof page.widgets[i].widgetData.commonSrc != 'undefined') {
                        if (typeof(page.widgets[i].widgetData.commonSrc) != "undefined") {
                            page.widgets[i].widgetData.syncState = false;
                            //Clear the filter indication when the chart is re-set
                            page.widgets[i].widgetData.filteredState = false;
                            filterService.clearFilters(page.widgets[i]);
                            count++;
                            if (page.widgets[i].widgetData.selectedChart.chartType != "d3hierarchy" && page.widgets[i].widgetData.selectedChart.chartType != "d3sunburst") {
                                $qbuilder.sync(page.widgets[i].widgetData, function (data) {
                                    if(page.widgets.length == count){
                                        pouchDbServices.pageSync($rootScope.dashboard);
                                    }
                                });
                            }
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
                                conStr = "";
                            var limit;
                            // var cat = [];
                            for (i = 0; i < drillOrdArr.length; i++) {
                                if (drillOrdArr[i].name == highestLvl) {
                                    nextLevel = drillOrdArr[i].nextLevel;
                                    drillOrdArr[i].clickedPoint = clickedPoint;
                                    if (!drillOrdArr[i + 1].nextLevel) isLastLevel = true;
                                }
                            }
                            chart.options.lang.drillUpText = " Back to " + highestLvl;
                            // Show the loading label
                            chart.showLoading("Retrieving data for '" + clickedPoint.toString().toLowerCase() + "' grouped by '" + nextLevel + "'");

                            // get the filter parameters
                            if ( typeof clickedPoint == 'number') {
                                conStr = highestLvl + " = " + clickedPoint;
                            } else {
                                conStr = highestLvl + " = '" + clickedPoint + "'";
                            }
                            if (widget.widgetData.filteredState) {
                                filterArray = filterService.generateFilterParameters(widget.widgetData.commonSrc.filter);
                                if (filterArray.length > 0) {
                                    filterStr = filterArray.join( ' And ');
                                    filterStr += ' And ' + conStr;
                                } else {
                                    filterStr = conStr;
                                }
                            }
                            else {
                                filterStr = conStr;
                            }

                            //aggregate method
                            clientObj.getAggData(srcTbl, fields, limit, function(res, status, query) {
                                filterService.filterAggData(res,widget.widgetData.commonSrc.src.filterFields);
                                angular.forEach( widget.widgetData.highchartsNG.series, function(series) {
                                    if ( series.name == selectedSeries ) {
                                        origName = series.origName;
                                        serName = series.name;
                                    }
                                });                                
                                widget.widgetData.widData.drillConf.currentLevel++;
                                switch (widget.widgetData.widData.drillConf.currentLevel) {
                                    case 2:
                                        widget.widgetData.widData.drillConf.level2Query = query;
                                        break;
                                    case 3:
                                        widget.widgetData.widData.drillConf.level3Query = query;
                                        break;
                                }
                                widget.widgetData.widData.drillConf.previousQuery = widget.widgetData.widData.drillConf.currentQuery;
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
                                    alert('request failed due to :' + JSON.stringify(res));
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
                            }, nextLevel, filterStr);
                        }
                    },
                    drillup: function(e) {
                        console.log(e);
                        var chart = this;
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
                        this.setSize(800,600, false);
                    },
                        afterPrint: function() {
                            this.setTitle({
                                text: null
                            })
                            this.setSize(this.widthPrev,this.heightPrev, true);                                       
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
                            if (page.pageID.substr(0, 4) != "temp") {
                                $rootScope.dashboard.deletions.pageIDs.push(page.pageID);
                            }
                            console.log("$rootScope.dashboard.deletions", $rootScope.dashboard.deletions);
                        }
                    }

                    ngToast.create({
                        className: 'success',
                        content: 'page removal succussful',
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
                            if (widget.widgetID.substr(0, 4) != "temp") {
                                $rootScope.dashboard.deletions.widgetIDs.push(widget.widgetID);
                            }
                            console.log("$rootScope.dashboard.deletions", $rootScope.dashboard.deletions);
                        }
                    }
                    ngToast.dismiss();
                    ngToast.create({
                        className: 'success',
                        content: 'widget removed successfully',
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


function googleMapsCtrl($scope, $mdDialog, wid, $http) {

    $scope.closeDialog = function() {
        $mdDialog.hide();
    };
};


routerApp.controller('ReportsDevCtrl', ['$scope', '$mdSidenav', '$sce', 'ReportService',
    '$timeout', '$log',
    function($scope, $mdSidenav, $sce, ReportService, $timeout,
        $log) {
        var allMuppets = [];
        $scope.selected = null;
        $scope.muppets = allMuppets;
        $scope.selectMuppet = selectMuppet;

        loadMuppets();
        $scope.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            }
            // $scope.applyCSS = function () {
            //   //  cssInjector.add("/styles/css/style1.css");
            // }
            //*******************
            // Internal Methods
            //*******************
        function loadMuppets() {
            ReportService.loadAll()
                .then(function(muppets) {
                    allMuppets = muppets;
                    $scope.muppets = [].concat(muppets);
                    $scope.selected = $scope.muppets[0];
                })
        }

        function toggleSidenav(name) {
            $mdSidenav(name).toggle();
        }


        function selectMuppet(muppet) {
            $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;

            $scope.toggleSidenav('left');
        }
    }
]);
routerApp.controller('ReportCtrl', ['$scope', 'dynamicallyReportSrv', '$localStorage', 'Digin_Engine_API', 'Digin_Tomcat_Base', 'fileUpload', '$http', 'Upload', 'ngToast', 'Digin_Domain','$state','$mdDialog','$window','$rootScope',
    function($scope, dynamicallyReportSrv, $localStorage, Digin_Engine_API, Digin_Tomcat_Base, fileUpload, $http, Upload, ngToast, Digin_Domain,$state,$mdDialog,$window,$rootScope) {


        // update damith
        // get all reports details
        var privateFun = (function() {
            var rptService = $localStorage.erportServices;
            var reqParameter = {
                apiBase: Digin_Engine_API,
                tomCatBase: Digin_Tomcat_Base,
                token: '',
                reportName: '',
                queryFiled: '',
                userInfo: ''
            };
            var getSession = function() {
                reqParameter.token = getCookie("securityToken");
            };
            $scope.Download = function(){
            $window.open('https://sourceforge.net/projects/pentaho/files/Report%20Designer/5.3/', '_blank');
        };




            var startReportService = function() {
                if (rptService == 0) {
                    dynamicallyReportSrv.startReportServer(reqParameter).success(function(res) {
                        $localStorage.erportServices = 1;
                    }).error(function(err) {
                        //false
                    });
                }
            }; //end

            $scope.goBackFromReports = function(){

               $state.go('home.welcomeSearch');
            }
            return {
                getAllReport: function() {
                    reqParameter.userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
                    $scope.reports = [];
                    getSession();
                    startReportService();
                    dynamicallyReportSrv.getAllComponents(reqParameter).success(function(data) {
                        $rootScope.reports = [];
                        angular.forEach(data.Result, function(key) {
                            if (key.compType == "Report") {
                                $scope.reports.push({
                                    splitName: key.compName,
                                    path: '/dynamically-report-builder',
                                    reportId: key.compID
                                });

                                $rootScope.reports.push({
                                    splitName: key.compName,
                                    path: '/dynamically-report-builder',
                                    reportId: key.compID
                                });
                                   
                            }
                        });

                    }).error(function(error) {

                    });
                }
            }
        }());

        privateFun.getAllReport();

        $scope.reports = [];
        $scope.preloader = false;

        $scope.log = '';

        $scope.upload = function(files) {
            console.log(files);
            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
            var uploadFlag;
            var storeFlag;
            var repid = null;
            

            if (files && files.length) {
               

                for (var i = 0; i < files.length; i++) {
                    var lim = i == 0 ? "" : "-" + i;


                    if(typeof $rootScope.reports != "undefined" ){
                       for(var j=0; j<$rootScope.reports.length;j++){
                            if($rootScope.reports[j].splitName+".zip" == files[i].name || $rootScope.reports[j].splitName+".rar" == files[i].name){
                                repid = $rootScope.reports[j].reportId;
                            }
                        } 

                        if(repid != null){
                              var confirm = $mdDialog.confirm()
                                  .title('Upload Report')
                                  .textContent('Do you want to overwrite the existing report?')
                                  .ariaLabel('Lucky day')
                                  .ok('yes')
                                  .cancel('no');
                                    $mdDialog.show(confirm).then(function() {
                                       $scope.preloader = true;
                                        $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
                                        Upload.upload({
                                                url: Digin_Engine_API + 'file_upload',
                                                headers: {
                                                    'Content-Type': 'multipart/form-data',
                                                },
                                                data: {
                                                    file: files[0],
                                                    db: 'BigQuery',
                                                    SecurityToken: userInfo.SecurityToken,
                                                    other_data: 'prpt_reports'
                                                }
                                            }).success(function(data) {
                                                console.log(data);
                                                uploadFlag = true;
                                                console.log($scope.reports);
                                                $scope.preloader = false;
                                                $scope.diginLogo = 'digin-logo-wrapper2';
                                                if (uploadFlag && storeFlag) {
                                                    fireMsg('1', 'Successfully uploaded!');
                                                    privateFun.getAllReport();
                                                }
                                            }).error(function(data) {
                                                console.log(data);
                                                uploadFlag = false;
                                                fireMsg('0', 'Error uploading file!');
                                                $scope.preloader = false;
                                                $scope.diginLogo = 'digin-logo-wrapper2';
                                            });

                                            var dashboardObject = {

                                                "pages": [],
                                                "compClass": '',
                                                "compType": "Report",
                                                "compCategory": "",
                                                "compID": repid,
                                                "compName": files[0].name.replace(/\.[^/.]+$/, ""),
                                                "refreshInterval": 0,
                                                "deletions": {
                                                    "componentIDs": [],
                                                    "pageIDs": [],
                                                    "widgetIDs": []
                                                }
                                            }

                                            $http({
                                                method: 'POST',

                                                url: Digin_Engine_API + 'store_component',
                                                data: angular.fromJson(CircularJSON.stringify(dashboardObject)),
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'SecurityToken': userInfo.SecurityToken
                                                }
                                            }).success(function(data) {
                                                storeFlag = true;
                                                if (uploadFlag && storeFlag) {
                                                    fireMsg('1', 'Successfully uploaded!');
                                                    privateFun.getAllReport();
                                                    
                                                }
                                            }).error(function(data) {
                                                storeFlag = false;
                                                fireMsg('2', 'Error uploading file!');
                                            })
                                    }, function() {
                                      
                                });
                        }else{

                            $scope.preloader = true;
                            $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
                            Upload.upload({
                                    url: Digin_Engine_API + 'file_upload',
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                    data: {
                                        file: files[i],
                                        db: 'BigQuery',
                                        SecurityToken: userInfo.SecurityToken,
                                        other_data: 'prpt_reports'
                                    }
                                }).success(function(data) {
                                    console.log(data);
                                    uploadFlag = true;
                                    console.log($scope.reports);
                                    $scope.preloader = false;
                                    $scope.diginLogo = 'digin-logo-wrapper2';
                                    if (uploadFlag && storeFlag) {
                                        fireMsg('1', 'Successfully uploaded!');
                                        privateFun.getAllReport();
                                    }
                                }).error(function(data) {
                                    console.log(data);
                                    uploadFlag = false;
                                    fireMsg('0', 'Error uploading file!');
                                    $scope.preloader = false;
                                    $scope.diginLogo = 'digin-logo-wrapper2';
                                });

                                var dashboardObject = {

                                    "pages": [],
                                    "compClass": '',
                                    "compType": "Report",
                                    "compCategory": "",
                                    "compID": repid,
                                    "compName": files[i].name.replace(/\.[^/.]+$/, ""),
                                    "refreshInterval": 0,
                                    "deletions": {
                                        "componentIDs": [],
                                        "pageIDs": [],
                                        "widgetIDs": []
                                    }
                                }

                                $http({
                                    method: 'POST',

                                    url: Digin_Engine_API + 'store_component',
                                    data: angular.fromJson(CircularJSON.stringify(dashboardObject)),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'SecurityToken': userInfo.SecurityToken
                                    }
                                }).success(function(data) {
                                    storeFlag = true;
                                    if (uploadFlag && storeFlag) {
                                        fireMsg('1', 'Successfully uploaded!');
                                        privateFun.getAllReport();
                                        
                                    }
                                }).error(function(data) {
                                    storeFlag = false;
                                    fireMsg('2', 'Error uploading file!');
                                })
                        }
                    }
         
                }
            }
        };

        function fireMsg(msgType, content) {
            ngToast.dismiss();
            var _className;
            if (msgType == '0') {
                _className = 'danger';
            } else if (msgType == '1') {
                _className = 'success';
            }
            ngToast.create({
                className: _className,
                content: content,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                dismissOnClick: true
            });
        }
    }
]);


routerApp.controller('RealTimeController', ['$scope', '$sce', 'RealTimeService',
    '$timeout', '$log', '$mdDialog',
    function($scope, $sce, RealTimeService, $timeout, $log, mdDialog) {

        $scope.products = [];
        var allMuppets = [];
        $scope.selected = null;
        $scope.muppets = allMuppets;
        $scope.selectMuppet = selectMuppet;

        loadMuppets();
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }

        function selectMuppet(muppet) {
            $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;

            $scope.toggleSidenav('left');
        }

        function loadMuppets() {
            RealTimeService.loadAll()
                .then(function(muppets) {
                    allMuppets = muppets;
                    $scope.muppets = [].concat(muppets);
                    $scope.selected = $scope.muppets[0];
                })
        }


    }
])


routerApp.controller('summarizeCtrl', ['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', '$q', '$timeout',
    function($scope, $http, $objectstore, $mdDialog, $rootScope, $q, $timeout) {
        $scope.indexes = [];

        var self = this;
        self.selectedItem = null;
        self.searchText = null;
        self.querySearch = querySearch;
        self.simulateQuery = false;
        self.isDisabled = false;

        $scope.selectedFields = [];
        var parameter = "";
        $scope.products = [];


        $scope.getFields = function(index) {
            $scope.selectedFields = [];
            var client = $objectstore.getClient("com.duosoftware.com", index.display);
            client.onGetMany(function(data) {
                if (data) {
                    $scope.selectedFields = data;
                    var client = $objectstore.getClient("com.duosoftware.com", index.display);
                    client.onGetMany(function(datae) {
                        if (datae) {
                            $scope.products = [];
                            for (var i = 0; i < datae.length; i++) {
                                var data = datae[i],
                                    product = {};
                                for (var j = 0; j < $scope.selectedFields.length; j++) {
                                    var field = $scope.selectedFields[j];
                                    product[field] = data[field];
                                }
                                $scope.products.push(product);
                            }
                            pivotUi();
                        }
                    });
                    client.getByFiltering("*");

                }
            });

            client.getFields("com.duosoftware.com", index.display);
        }

        $scope.remove = function() {
            // Easily hides most recent dialog shown...
            // no specific instance reference is needed.
            $mdDialog.hide();
        };

        function pivotUi() {
            var renderers = $.extend($.pivotUtilities.renderers, $.pivotUtilities.gchart_renderers, $.pivotUtilities.d3_renderers);
            $("#tableoutput").pivotUI($scope.products, {
                renderers: renderers,
                rows: [$scope.selectedFields[0]],
                cols: [$scope.selectedFields[1]],

                rendererName: "Table"
            });
        }

        function querySearch(query) {
            var results = query ? $rootScope.indexes.filter(createFilterFor(query)) : [],
                deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function() {
                    deferred.resolve(results);
                }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }
    }
]);

routerApp.controller('settingsCtrl', ['$scope', '$rootScope', '$http', '$state', '$mdDialog', '$objectstore', '$mdToast',
    function($scope, $rootScope, $http, $state, $mdDialog, $objectstore, $mdToast) {
        var featureObj = localStorage.getItem("featureObject");
        $scope.User_Name = "";
        $scope.User_Email = "";

        $scope.username = localStorage.getItem('username');

        // getJSONData($http, 'features', function (data) {
        //     $scope.featureOrigin = data;
        var obj = JSON.parse(featureObj);
        if (featureObj === null) {
            $scope.features = null;
            $scope.selected = [];
        } else {
            $scope.selected = [];
            for (i = 0; i < obj.length; i++) {
                if (obj[i].stateStr === "Enabled")
                    $scope.selected.push(obj[i]);
            }
            $scope.features = obj;

        }
        // });

        $scope.toggle = function(item, list) {

            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
                item.state = false;
                item.stateStr = "Disabled";
            } else {
                list.push(item);
                item.state = true;
                item.stateStr = "Enabled";
            }
        };

        $scope.close = function() {
            $mdDialog.cancel();
        };

        $scope.test = function(item) {

            return false;
        };

        $scope.finish = function() {

            for (i = 0; i < $scope.selected.length; i++) {
                for (j = 0; j < $scope.features.length; j++) {
                    if ($scope.features[j].title == $scope.selected[i].title) {
                        $scope.features[j].state = true;
                        $scope.features[j].stateStr = "Enabled";
                    }
                }
            }

            getJSONData($http, 'menu', function(data) {

                var orignArray = [];
                for (i = 0; i < $scope.features.length; i++) {
                    if ($scope.features[i].state == true)
                        orignArray.push($scope.features[i]);
                }
                $scope.menu = orignArray.concat(data);

            });
            localStorage.setItem("featureObject", JSON.stringify($scope.features));
            $mdDialog.show({
                controller: 'settingsCtrl',
                templateUrl: 'views/settings-save.html',
                resolve: {}
            });

        };

        $scope.saveSettingsDetails = function() {

            window.location = "home.html";
        };


        $scope.closeDialog = function() {

            $mdDialog.hide();
        };

        $scope.addUser = function() {

            if ($scope.user.password == $scope.user.confirmPassword) {
                var SignUpBtn = document.getElementById("mySignup").disabled = true;
                var fullname = $scope.user.firstName + " " + $scope.user.lastName;
                var pentUserName = $scope.user.email;
                var pentPassword = $scope.user.password;
                $scope.user = {
                    "EmailAddress": $scope.user.email,
                    "Name": fullname,
                    "Password": $scope.user.password,
                    "ConfirmPassword": $scope.user.confirmPassword
                };

                $http({
                    method: 'POST',
                    url: 'http://duoworld.duoweb.info:3048/UserRegistation/',
                    data: angular.toJson($scope.user),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }

                }).success(function(data, status, headers, config) {
                    $scope.User_Name = data.Name;
                    $scope.User_Email = data.EmailAddress;
                    //setting the name of the profile
                    var userDetails = {
                        name: fullname,
                        phone: '',
                        email: $scope.user.EmailAddress,
                        company: "",
                        country: "",
                        zipcode: "",
                        bannerPicture: 'fromObjectStore',
                        id: "admin@duosoftware.com"
                    };

                    if (!data.Active) {

                        //setting the userdetails
                        var client = $objectstore.getClient("duosoftware.com", "profile", true);
                        client.onError(function(data) {
                            $mdToast.show({
                                position: "bottom right",
                                template: "<md-toast>Successfully created your profile,Please check your Email for verification!</md-toast>"
                            });
                        });
                        client.onComplete(function(data) {
                            // $mdToast.show({
                            //     position: "bottom right",
                            //     template: "<md-toast>Successfully created your profile,Please check your Email for verification!</md-toast>"
                            // });
                            $http({
                                method: 'PUT',
                                url: 'http://104.131.48.155:8080/pentaho/api/userroledao/createUser',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    "userName": pentUserName,
                                    "password": pentPassword
                                }

                            }).
                            success(function(data, status) {
                                $mdToast.show({
                                    position: "bottom right",
                                    template: "<md-toast>Successfully created your profile,Please check your Email for verification!</md-toast>"
                                });
                                var SignUpBtn = document.getElementById("mySignup").disabled = false;
                            }).
                            error(function(data, status) {
                                alert("Request failed");

                            });
                        });
                        client.update(userDetails, {
                            KeyProperty: "email"
                        });
                    } else {

                        $mdToast.show({
                            position: "bottom right",
                            template: "<md-toast>There is a problem in registering or you have already been registered!!</md-toast>"
                        });


                    }


                }).error(function(data, status, headers, config) {

                    $mdToast.show({
                        position: "bottom right",
                        template: "<md-toast>Please Try again !!</md-toast>"
                    });
                });
            } else {
                $mdToast.show({
                    position: "bottom right",
                    template: "<md-toast>Mismatched passwords</md-toast>"
                });
            }
        };
    }
]);


routerApp.controller('gmapsController', ['$scope', '$rootScope', '$mdDialog', '$state', '$http', '$timeout',
    function($scope, $rootScope, $mdDialog, $state, $http, $timeout) {
        $scope.arrAdds = [];
        $scope.arrAdds = [{
            "customerid": "46837",
            "customername": "Maryann Huddleston",
            "total_sales": "93,6698 Rs",
            "add": "Colombo"
        }, {
            "customerid": "23983",
            "customername": "Sointu Savonheimo",
            "total_sales": "80,7523 Rs",
            "add": "Jafna"
        }, {
            "customerid": "32367",
            "customername": "Debbie Molina",
            "total_sales": "29,0392 Rs",
            "add": "Mount Lavinia"
        }, {
            "customerid": "3409",
            "customername": "Anindya Ghatak",
            "total_sales": "15,6281 Rs",
            "add": "Galle"
        }, {
            "customerid": "23742",
            "customername": "Jai Lamble",
            "total_sales": "27, 9327 Rs",
            "add": "Yakkala"
        }, {
            "customerid": "63000",
            "customername": "Radha Barua",
            "total_sales": "16,995 Rs",
            "add": "Matugama"
        }, {
            "customerid": "83280",
            "customername": "Edmee Glissen",
            "total_sales": "31,5608 Rs",
            "add": "Dehiwala"
        }, {
            "customerid": "92868",
            "customername": "Baran Jonsson",
            "total_sales": "54, 0102 Rs",
            "add": "Ratnapura"
        }, {
            "customerid": "22445",
            "customername": "Magdalena Michnova",
            "total_sales": "89, 3444 Rs",
            "add": "Kottawa"
        }, {
            "customerid": "47603",
            "customername": "Chandrashekhar Dasgupta",
            "total_sales": "31, 4401 Rs",
            "add": "Kandy"
        }];


        $scope.setMap = function() {
            $timeout(function() {
                $rootScope.$broadcast('getLocations', {
                    addData: $scope.arrAdds
                });
            })
        }
    }
]);
routerApp.directive('highchartTest', [function() {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function(scope, element, attrs) {

            scope.$watch(attrs.chart, function() {

                if (!attrs.chart) return;

                var chart = scope.$eval(attrs.chart);

                angular.element(element).highcharts(chart);
            });

        }
    }
}]);
routerApp.controller('geomap', ['$scope', '$rootScope', '$mdDialog', '$state', '$http', '$timeout',
    function($scope, $rootScope, $mdDialog, $state, $http, $timeout) {
 

 
    }
]);