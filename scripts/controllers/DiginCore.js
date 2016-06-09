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
routerApp.controller('showWidgetCtrl', function ($scope, $mdDialog, widget) {

    $scope.widget = angular.copy(widget);
    $scope.dHeight = $scope.widget.widgetData.height + 100;

    $scope.returnWidth = function (width, height) {
        console.log("width here", width, height);
        if ($scope.widget.widgetData.initCtrl == "elasticInit") {
            console.log('elastic');
            $scope.widget.widgetData.highchartsNG.size.width = parseInt(width);
            $scope.widget.widgetData.highchartsNG.size.height = parseInt(height);
        }
    };
    var reSizeWidget = function () {
        $scope.widget.widgetData.highchartsNG.size.width = parseInt(700);
        $scope.widget.widgetData.highchartsNG.size.height = parseInt(400);
    }

    $scope.setChartSize = function (data) {
        console.log(data);
        setTimeout(function () {
            reSizeWidget();
        }, 50);
    }

    $scope.closeDialog = function () {
        $mdDialog.hide();
    };
});

routerApp.controller('DashboardCtrl', ['$scope', '$rootScope', '$mdDialog', '$objectstore', '$sce', 'AsTorPlotItems', '$log', 'DynamicVisualization','$csContainer','$state','$qbuilder','$diginengine', 'ngToast',
    function ($scope, $rootScope, $mdDialog, $objectstore, $sce, AsTorPlotItems, $log, DynamicVisualization, $csContainer, $state, $qbuilder, $diginengine, ngToast) {
        
        //code to keep widget fixed on pivot summary drag events
        $('#content1').on('mousedown', function(e) {
            if(e.target.className == "pvtAttr"){
                
                var widgetsCount = $('.gridster-item').length;
                for(var i = 0; i < widgetsCount; i++){
                
                    $('.gridster-item')[i].className = "digin-widget ng-scope gridster-item";
                }   
            }
        });
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
            defaultSizeX: 6, // default width of an item in columns
            defaultSizeY: 5, // default height of an item in rows
            minSizeX: 6, // minimum column width of an item
            maxSizeX: null, // maximum column width of an item
            minSizeY: 5, // minumum row height of an item
            maxSizeY: null, // maximum row height of an item
            saveGridItemCalculatedHeightInMobile: false, // grid item height in mobile display. true- to use the calculated height by sizeY given
            draggable: {
                enabled: true
            },
            resizable: {
                enabled: true,
                handles: ['n', 'e', 's', 'w', 'se', 'sw', 'ne', 'nw']
            }
        };
        // maps the item from customItems in the scope to the gridsterItem options
        $scope.customItemMap = {
            sizeX: 'item.size.x',
            sizeY: 'item.size.y',
            row: 'item.position[0]',
            col: 'item.position[1]',
            minSizeY: 'item.minSizeY',
            maxSizeY: 'item.maxSizeY'
        };

        // if($rootScope.tempDashboard.length != 0)
        $rootScope.tempDashboard = angular.copy($rootScope.dashboard);

        $scope.widgetTitleClass = 'widget-title-35';

        $scope.adjustTitleLength = function(){

            var titleLength = 0;
            var selectedPage = $rootScope.selectedPage;
            for(var i=0; i < $rootScope.dashboard.pages[selectedPage-1].widgets.length; i++){

                if(titleLength < $rootScope.dashboard.pages[selectedPage-1].widgets[i].widgetData.widName.length){

                    titleLength = $rootScope.dashboard.pages[selectedPage-1].widgets[i].widgetData.widName.length;
                    if(titleLength <= 35){
                        $scope.widgetTitleClass = 'widget-title-35';
                    }
                    if(titleLength > 35 && titleLength <= 60){
                        $scope.widgetTitleClass = 'widget-title-60';
                    }
                    if(titleLength > 60 && titleLength <= 80){
                        $scope.widgetTitleClass = 'widget-title-80';
                    } 
                    if(titleLength > 80){
                        $scope.widgetTitleClass = 'widget-title-long';
                    }        
                }
            }
        }

        $scope.selectPage = function (page) {

            for (var i = 0; i < $rootScope.dashboard.pages.length; i++) {
                if(page.pageID == $rootScope.dashboard.pages[i].pageID){
                    $rootScope.selectedPage = i+1;
                }
            }
        }

        /* update damith
         view current chart data source view
         currentSourceView ()
         
         */

        $scope.showFace2 = function ($event, widget) {
            alert("loadin 2nd face...!");
            $event.preventDefault();
            $(this).parent().toggleClass('expand');
            $(this).parent().children().toggleClass('expand');
        }
        $scope.currentSourceView = function (ev, widget) {
            $scope.isTableSourceLoading = false;
            $mdDialog.show({
                    templateUrl: 'views/widgetDataTable_TEMP.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        items: widget
                    }
                    ,
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
                                console.log("_attr",_attr);
                                console.log("mapped data in items", items.
                                    winConfig.mappedData[_attr]);
                                console.log("mapped data in selected source data", selectedSourceData.mappedData);
                                selectedSourceData.mappedData.push(items.
                                    winConfig.mappedData[_attr].data);
                            // } else {
                            //     var _attr = selectedSourceData.attributes[i].trim().
                            //     toString();
                            //     selectedSourceData.mappedData.push(items.
                            //         widConfig.mappedData[_attr].data);
                            // }


                        }
                        var appendTblBody = function () {

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

                        $scope.downloadPDF = function(){
            
                            var htmlElement = $(".widget0m-mapped-data").get(0);
                            var config = {
                                title:"Sales Forecast Data Summary",
                                titleLeft: 50, 
                                titleTop: 20,
                                tableLeft: 20,
                                tableTop: 30
                            };
                            generatePDF1.generate(htmlElement, config);
                        }

                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.submit = function () {
                            $mdDialog.submit();
                        };
                    }
                }
            );
        };
        $scope.widgetSettings = function (ev, widget) {

            if(typeof widget.widgetData.commonSrc == "undefined"){//new widget
                $mdDialog.show({
                    controller: widget.widgetData.initCtrl,
                    templateUrl: widget.widgetData.initTemplate,
                    parent: angular.element(document.body),
                    targetEvent: ev
                })
                .then(function () {
                    //$mdDialog.hide();
                }, function () {
                    //$mdDialog.hide();
                });
            }else{//user is updating widget, open query builder
                $csContainer.fillCSContainer(widget.widgetData.commonSrc.src);
                $state.go("home.QueryBuilder", {widObj:widget});
            }
        };
        $scope.createuuid = function () {
                            return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
        }
        $scope.showWidget = function (ev, widget) {
            
            $scope.tempWidth = widget.widgetData.highchartsNG.size.width;
            $scope.tempHeight = widget.widgetData.highchartsNG.size.height;
            $mdDialog.show({
                    controller: 'showWidgetCtrl',
                    templateUrl: 'views/ViewShowWidget.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        widget: widget
                    }
                })
                .then(function () {
                    console.log($scope.widget);
                    $scope.widget.widgetData.highchartsNG.size.width = $scope.tempWidth;
                    $scope.widget.widgetData.highchartsNG.size.height = $scope.tempHeight;
                    //$mdDialog.hide();
                }, function () {
                    $scope.widget.widgetData.highchartsNG.size.width = $scope.tempWidth;
                    $scope.widget.widgetData.highchartsNG.size.height = $scope.tempHeight;
                    //$mdDialog.hide();
                });
        };
        $scope.showFullView = function(widget){

            var showFullView = null;
            //if not dynamic visuals
            if(widget.widgetData.selectedChart == undefined){
                showFullView = false;
            }
            else{
            //if dynamic visuals
                switch(widget.widgetData.selectedChart.chartType){
                case 'metric':
                    showFullView = false;
                break;
                default:
                    if(widget.widgetData.uniqueType=='Dynamic Visuals'){
                        showFullView = true;
                    }
                    else{
                        showFullView = false;
                    }
                break;
                }
            }

            return showFullView;
        }
        //dispaly or hide show data view icon according to necessity
        $scope.showDataView = function(widget){

            var showDataView = null;
            //if not dynamic visuals
            if(widget.widgetData.selectedChart == undefined){ 
                showDataView = false; //do not show data view option
            }
            else{ //if dynamic visuals
            
                switch(widget.widgetData.selectedChart.chartType){
                case 'metric': // if type metric do not show data view option
                    showDataView = false;
                break;
                default: // for other dynamic visuals show data view option
                    if(widget.widgetData.dataCtrl != undefined){ showDataView = true; }
                    else{ showDataView = false; }
                break;
                }
            }
            
            return showDataView;
        }
        $scope.showData = function (ev, widget) {
            //saving widget in $rootScope for use in widget data view
            $rootScope.widget = widget;
            $mdDialog.show({
                controller: widget.widgetData.dataCtrl,
                templateUrl: 'views/ViewWidgetSettingsData.html',
                parent: angular.element(document.body),
                targetEvent: ev,
            })
            .then(function () {});
        };
        $scope.convertCSVtoJson = function (src) {

            AsTorPlotItems.then(function (data) {
                $scope.items = data;
            });
        }

        /*Summary:
         synchronizes data per widget
         @widget : widget that need to get updated
         */
        $scope.syncWidget = function (widget) {
            
            console.log('syncing...');
            if (typeof widget.widgetData.widConfig != 'undefined') {
                DynamicVisualization.syncWidget(widget, function (data) {
                    widget.widgetData.syncState = true;
                    widget = data;
                });
            }else if(typeof(widget.widgetData.commonSrc) != "undefined"){
                widget.widgetData.syncState = false;
                $qbuilder.sync(widget.widgetData, function(data){
                    widget.widgetData.syncState = true;
                    widget = data;
                    if(typeof widget.widgetData.widData.drilled != "undefined" && widget.widgetData.widData.drilled)
                        $scope.widInit();
                });
            }
        };

        $scope.widInit = function(widget){
            if(typeof widget.widgetData.widData.drilled != "undefined" && widget.widgetData.widData.drilled)
            {
                var drillConf = widget.widgetData.widData.drillConf;
                var client = $diginengine.getClient(drillConf.dataSrc);
                widget.widgetData.highchartsNG.options['customVar'] = drillConf.highestLvl;
                widget.widgetData.highchartsNG.options.chart['events'] ={
                    drilldown: function (e) {
                                                
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
                                isLastLevel = false;
                                
                                for(i=0;i<drillOrdArr.length;i++){
                                    if(drillOrdArr[i].name == highestLvl){
                                        nextLevel = drillOrdArr[i].nextLevel;
                                        if(!drillOrdArr[i+1].nextLevel) isLastLevel = true;
                                    }
                                }
                                
                                // Show the loading label
                                chart.showLoading("Retrieving data for '" + clickedPoint.toLowerCase() + "' grouped by '" + nextLevel + "'");
                                
                                //aggregate method
                                clientObj.getAggData(srcTbl, fields, function(res, status, query) {
                                    
                                    widget.widgetData.widData.drillConf.currentLevel++;
                                    switch(widget.widgetData.widData.drillConf.currentLevel){
                                        case 2:
                                            widget.widgetData.widData.drillConf.level2Query = query;
                                        break;
                                        case 3:
                                            widget.widgetData.widData.drillConf.level3Query = query;
                                        break;
                                    }
                                    widget.widgetData.widData.drillConf.previousQuery = widget.widgetData.widData.drillConf.currentQuery;
                                    widget.widgetData.widData.drillConf.currentQuery = query;
                                    
                                    if(status){
                                        for (var key in res[0]) {
                                            if (Object.prototype.hasOwnProperty.call(res[0], key)) {
                                                if(key != nextLevel){
                                                    drillObj = {name : key,
                                                                data : []};
                                                }
                                            }
                                        }
                                        
                                        res.forEach(function(key){
                                            if(!isLastLevel){
                                                drillObj.data.push({
                                                    name: key[nextLevel],
                                                    y: key[drillObj.name],
                                                    drilldown: true
                                                });
                                            }else{
                                                drillObj.data.push({
                                                    name: key[nextLevel],
                                                    y: key[drillObj.name]
                                                });
                                            }
                                        });
                                        
                                        chart.addSeriesAsDrilldown(e.point, drillObj);
                                        
                                    }else{
                                        alert('request failed due to :' + JSON.stringify(res));
                                        e.preventDefault();
                                    }
                                    console.log(JSON.stringify(res));
                                    chart.options.customVar = nextLevel;
                                    chart.hideLoading();
                                }, nextLevel, highestLvl + "='" + clickedPoint + "'");
                            }
                        },
                        drillup: function(e){

                            widget.widgetData.widData.drillConf.currentLevel--;
                            var chart = this;
                            drillConf.drillOrdArr.forEach(function(key){
                                if(key.nextLevel && key.nextLevel == chart.options.customVar)
                                    chart.options.customVar = key.name;
                            });
                        }
                }
            }
        };
        $scope.removePage = function(page, ev){

            $mdDialog.show({
                controller: function removePageCtrl($scope, $mdDialog, ngToast) {

                    var removePage = null;
                    $scope.close = function(){

                        $mdDialog.hide();
                        removePage = true;
                    }
                    $scope.cancel = function () {

                        $mdDialog.cancel();
                        removePage = false;
                    };

                    return removePage;
                },
                templateUrl: 'views/removePage.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true

            }).then(function (removePage) {

                if(removePage){

                    var pages = $rootScope.dashboard.pages;
                    for(var i=0; i < pages.length; i++){
                        //check for the specific page in pages array
                        if(pages[i].pageID == page.pageID) {
                           pages.splice(i, 1);
                            //if removed page is not a new page push it
                            if(page.pageID.substr(0, 4) != "temp"){
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
        $scope.removeWidget = function (widget, ev) {

            $mdDialog.show({
                templateUrl: 'views/closeWidget.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                controller: function closeWidgetCtrl($scope, $mdDialog) {

                    var removeWidget = null;
                    $scope.close = function(){

                        $mdDialog.hide();
                        removeWidget = true;
                    }
                    $scope.cancel = function () {

                        $mdDialog.cancel();
                        removeWidget = false;
                    };

                    return removeWidget;
                }
            }).then(function (removeWidget) {

                if(removeWidget){

                    var selectedPage = $rootScope.selectedPage;
                    var widgets = $rootScope.dashboard.pages[selectedPage-1].widgets;
                    for(var i=0; i < widgets.length; i++){
                        //check for the specific widget in widgets array
                        if(widgets[i].widgetID == widget.widgetID) {
                           widgets.splice(i, 1);
                            //if removed widget is not a new widget push it
                            if(widget.widgetID.substr(0, 4) != "temp"){
                                $rootScope.dashboard.deletions.widgetIDs.push(widget.widgetID);
                            }
                            console.log("$rootScope.dashboard.deletions", $rootScope.dashboard.deletions);
                        }
                    }

                    ngToast.create({
                        className: 'success',
                        content: 'widget removal succussful',
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true
                    });
                }
            });
        };
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }
        $scope.getIndexes = function () {
            var client = $objectstore.getClient("com.duosoftware.com");
            client.onGetMany(function (data) {
                data.forEach(function (entry) {

                    $rootScope.indexes.push({
                        value: entry,
                        display: entry
                    });
                });
            });
            client.getClasses("com.duosoftware.com");
        }
        $scope.commentary = function (widget) {
            var comment = "";
            var chunks = [];
        }
        $scope.closeDialog = function () {
            $mdDialog.hide();
        };
        $scope.clear = function () {
            $rootScope.dashboard.pages[$rootScope.selectePage-1].widgets = [];
        };

        $scope.showWidgetSettings = false;

        $scope.alert = '';


        $scope.config = {}; // use defaults
        $scope.model = {};

// init dashboard
        $scope.selectedDashboardId = '1';

    }
])
;

 
 
 
 

function googleMapsCtrl($scope, $mdDialog, wid, $http) {
    
    $scope.closeDialog = function () {
        $mdDialog.hide();
    };
};

 
routerApp.controller('ReportsDevCtrl', ['$scope', '$mdSidenav', '$sce', 'ReportService',
    '$timeout', '$log', 'cssInjector',
    function ($scope, $mdSidenav, $sce, ReportService, $timeout,
              $log, cssInjector) {
        var allMuppets = [];
        $scope.selected = null;
        $scope.muppets = allMuppets;
        $scope.selectMuppet = selectMuppet;

        loadMuppets();
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }
        $scope.applyCSS = function () {
            cssInjector.add("/styles/css/style1.css");
        }
        //*******************
        // Internal Methods
        //*******************
        function loadMuppets() {
            ReportService.loadAll()
                .then(function (muppets) {
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
}]);
routerApp.controller('ReportCtrl', ['$scope', 'dynamicallyReportSrv', '$localStorage', 'Digin_Engine_API', 'Digin_Tomcat_Base', 'fileUpload', '$http', 'Upload', 'ngToast', 'Digin_Domain',
    function ($scope, dynamicallyReportSrv, $localStorage, Digin_Engine_API, Digin_Tomcat_Base, fileUpload, $http, Upload, ngToast, Digin_Domain) {
                // update damith
        // get all reports details
        var privateFun = (function () {
            var rptService = $localStorage.erportServices;
            var reqParameter = {
                apiBase: Digin_Engine_API,
                tomCatBase: Digin_Tomcat_Base,
                token: '',
                reportName: '',
                queryFiled: ''
            };
            var getSession = function () {
                reqParameter.token = getCookie("securityToken");
            };

            var startReportService = function () {
                if (rptService == 0) {
                    dynamicallyReportSrv.startReportServer(reqParameter).success(function (res) {
                        $localStorage.erportServices = 1;
                    }).error(function (err) {
                        //false
                    });
                }
            };//end

            return {
                getAllReport: function () {
                    getSession();
                    startReportService();
                    dynamicallyReportSrv.getAllReports(reqParameter).success(function (data) {
                        if (data.Is_Success) {
                            for (var i = 0; i < data.Result.length; i++) {
                                $scope.reports.push(
                                    {splitName: data.Result[i], path: '/dynamically-report-builder'}
                                );
                            }
                        }
                    }).error(function (respose) {
                        console.error('error request getAllReports...');
                    });
                }
            }
        }());

        privateFun.getAllReport();

        $scope.reports = [];
        $scope.preloader = false;
                                            /* file upload */
        $scope.$watch('files', function() {
            $scope.upload($scope.files);
        });
        $scope.$watch('file', function() {
            if ($scope.file != null) {
                $scope.files = [$scope.file];
            }
        });

        $scope.log = '';

        $scope.upload = function(files) {

            var userInfo = JSON.parse(getCookie("authData"));
                                    
            if (files && files.length) {
                $scope.preloader = true;
                $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';

                for (var i = 0; i < files.length; i++) {
                    var lim = i == 0 ? "" : "-" + i;
                                           
                    Upload.upload({
                        url: Digin_Engine_API + 'file_upload',
                        headers: {
                            'Content-Type': 'multipart/form-data',                         
                        },           
                        data: {
                            file: files[i],
                            db: 'BigQuery',
                            SecurityToken: userInfo.SecurityToken,
                            Domain: Digin_Domain,
                            other_data: 'prpt_reports'
                        }                         
                    }).success(function(data){                                                 
                        fireMsg('1', 'Successfully uploaded!');
                        $scope.preloader = false;
                        $scope.diginLogo = 'digin-logo-wrapper2';
                        $mdDialog.hide();
                    }).error(function(data) {
                        fireMsg('0', 'There was an error while uploading data !');
                        $scope.preloader = false;
                        $scope.diginLogo = 'digin-logo-wrapper2';
                    });
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
    function ($scope, $sce, RealTimeService, $timeout, $log, mdDialog) {

        $scope.products = [];
        var allMuppets = [];
        $scope.selected = null;
        $scope.muppets = allMuppets;
        $scope.selectMuppet = selectMuppet;

        loadMuppets();
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        function selectMuppet(muppet) {
            $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;

            $scope.toggleSidenav('left');
        }

        function loadMuppets() {
            RealTimeService.loadAll()
                .then(function (muppets) {
                    allMuppets = muppets;
                    $scope.muppets = [].concat(muppets);
                    $scope.selected = $scope.muppets[0];
                })
        }


    }])

 
 

routerApp.controller('summarizeCtrl', ['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', '$q', '$timeout',
    function ($scope, $http, $objectstore, $mdDialog, $rootScope, $q, $timeout) {
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


        $scope.getFields = function (index) {
            $scope.selectedFields = [];
            var client = $objectstore.getClient("com.duosoftware.com", index.display);
            client.onGetMany(function (data) {
                if (data) {
                    $scope.selectedFields = data;
                    var client = $objectstore.getClient("com.duosoftware.com", index.display);
                    client.onGetMany(function (datae) {
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
        $scope.remove = function () {
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
                $timeout(function () {
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
    }]);

routerApp.controller('settingsCtrl', ['$scope', '$rootScope', '$http', '$state', '$mdDialog', '$objectstore', '$mdToast',
    function ($scope, $rootScope, $http, $state, $mdDialog, $objectstore, $mdToast) {
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

        $scope.toggle = function (item, list) {

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

        $scope.close = function () {
            $mdDialog.cancel();
        };

        $scope.test = function (item) {

            return false;
        };

        $scope.finish = function () {

            for (i = 0; i < $scope.selected.length; i++) {
                for (j = 0; j < $scope.features.length; j++) {
                    if ($scope.features[j].title == $scope.selected[i].title) {
                        $scope.features[j].state = true;
                        $scope.features[j].stateStr = "Enabled";
                    }
                }
            }

            getJSONData($http, 'menu', function (data) {

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

        $scope.saveSettingsDetails = function () {

            window.location = "home.html";
        };


        $scope.closeDialog = function () {

            $mdDialog.hide();
        };

        $scope.addUser = function () {

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

                }).success(function (data, status, headers, config) {
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
                        client.onError(function (data) {
                            $mdToast.show({
                                position: "bottom right",
                                template: "<md-toast>Successfully created your profile,Please check your Email for verification!</md-toast>"
                            });
                        });
                        client.onComplete(function (data) {
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
                            success(function (data, status) {
                                $mdToast.show({
                                    position: "bottom right",
                                    template: "<md-toast>Successfully created your profile,Please check your Email for verification!</md-toast>"
                                });
                                var SignUpBtn = document.getElementById("mySignup").disabled = false;
                            }).
                            error(function (data, status) {
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


                }).error(function (data, status, headers, config) {

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



routerApp.controller('gmapsControllerBranches', ['$scope', '$mdDialog', '$state', '$http', 'ScopeShare',
    function ($scope, $mdDialog, $state, $http, ScopeShare) {

        // ====== Create map objects ======
        $scope.syncState = false;
        var delay = 100;
        var map = null;
        var bounds = null;
        var latlng = new google.maps.LatLng(7.2964, 80.6350);
        var infowindow = new google.maps.InfoWindow();
        var geo = null;
        var queue = [];
        var nextAddress = 0;
        var markers = [];
        //var windows = [];
        var markerCluster;
        var mcOptions = {gridSize: 50, maxZoom: 15};
        var count = 1;
        var undefinedErrors = 0;
        var outOfSriLanka = 0;
        var JSONData = null;
        var outOfSLArray = [];

        $scope.markers = [];
        $scope.map = { center: { latitude: 7.2964, longitude: 80.6350 }, 
                        zoom: 8, 
                        bounds: {},
                        options: {
                            maxZoom: 15,
                            minZoom: 1
                        }
                        ,
                        events: {   
                            mouseover: function (map) {
                                $scope.$apply(function () {
                                    google.maps.event.trigger(map, "resize");
                                });
                            }
                            // ,
                            // dragend: function (map) {
                            //     $scope.$apply(function () {
                            //         google.maps.event.trigger(map, "resize");
                            //     });
                            // }
                        } 
                    };       
        
        // ======== initializing map at google map loading =========
        $scope.initGmap = function(){
            
            queue = [];
            markers = [];
            delay = 100;
            nextAddress = 0;

            JSONData = $scope.JSONDataBranch;

            JsonToArray(); 
            setTimeout(function(){theNext();},400);  
        }   
    
        // ====== Json data to array ======    
        function JsonToArray() {
            for(var key in JSONData){
                if( JSONData[key].Address[0]!=undefined && // adding only defined value to queue
                    JSONData[key].Address[1]!=undefined &&
                    key!=undefined){
                    queue.push({    name: key, 
                                    address: JSONData[key].Address, 
                                    val1: JSONData[key].val1,
                                    val2: JSONData[key].val2 
                                });
                }
                else{ //counting undefined values 
                    undefinedErrors++;
                }
            }
        }

        // ====== Decides the next thing to do ======
        function theNext() {
                if ((nextAddress+1) < queue.length) {
                    console.log(nextAddress + " < " + queue.length);
                    setTimeout(function(){

                            createMarker(queue[nextAddress],nextAddress);                          
                            theNext();
                    }, delay);
                    nextAddress++;
                } else {
                    // We're done. 
                    console.log("Done!");
                    
                    $scope.markers = markers;

                    //sharing markers with widgetSettingsCtrl using Scopes factory
                    ScopeShare.store('gmapsControllerBranch', $scope.markers);
                    
                }
                
                $scope.markers = markers;
        }

        // ====== between function ======
        function between(x, min, max) {
            return x >= min && x <= max;
        }

        // ======= Function to create a marker ========
        function createMarker(queueItem, id) {

            if( between(queueItem.address[0],5,10) &&   // in between 5 and 10 and
                between(queueItem.address[1],79,82)){   // in between 79 and 82

                var marker = {  
                                latitude: queueItem.address[0], 
                                longitude: queueItem.address[1], 
                                id: id,
                                // icon: 'styles/css/images/hnb3.png', 
                                show: false,
                                templateUrl:'views/googleMaps/infoWindow.html',
                                templateParameter: {
                                    name: queueItem.name,
                                    field1: queueItem.val1,
                                    field2: queueItem.val2},
                                windowOptions: {
                                    boxClass: "infobox",
                                    boxStyle: {
                                        backgroundColor: "#FAA61A",
                                        border: "2px solid #10297d",
                                        borderRadius: "8px",
                                        width: "140px",
                                        height: "60px",
                                        opacity: 0.9
                                    },
                                    // content: "Text",
                                    disableAutoPan: false,
                                    maxWidth: 0,
                                    pixelOffset: new google.maps.Size(-60, -120),
                                    zIndex: null,
                                    closeBoxMargin: "3px",
                                    closeBoxURL: "styles/css/images/close.svg",
                                    infoBoxClearance: new google.maps.Size(1, 1),
                                    isHidden: false,
                                    pane: "floatPane",
                                    enableEventPropagation: false
                                }
                            };

                markers.push(marker);
                $scope.syncState = true;               
            }
            else
            {
                
                console.log("****** out of sri lanka range ******");
                outOfSriLanka++;
                outOfSLArray.push(queueItem.name);
            }
        }
    }
]);



