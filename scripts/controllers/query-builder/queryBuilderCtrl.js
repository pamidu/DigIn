/**
 * Created by Damith on 2/12/2016.
 */

routerApp.controller('queryBuilderCtrl', function
        ($scope, $rootScope, $location, $window, $csContainer, $diginengine, $state) {

    $scope.initQueryBuilder = function(){
            $scope.widget = $scope.sourceData.wid;
        if(typeof($scope.sourceData.wid.commonSrc) == "undefined"){
            $scope.selectedChart = $scope.commonData.chartTypes[0];
            $scope.highCharts.onInit(false);
        }else{
            $scope.selectedChart = $scope.sourceData.wid.selectedChart;
            eval("$scope."+ $scope.selectedChart.chartType + ".onInit(true)");
            $scope.executeQryData.executeMeasures = $scope.sourceData.wid.commonSrc.mea;
            $scope.executeQryData.executeColumns = $scope.sourceData.wid.commonSrc.att;
            $scope.receivedQuery = $scope.sourceData.wid.commonSrc.query;
        }
        
    };
    
    $scope.sourceData = $csContainer.fetchSrcObj();
    $scope.client = $diginengine.getClient($scope.sourceData.src);
    $scope.queryEditState = false;
    $scope.initHighchartObj = {
                        options: {
                            chart: {
                                type: $scope.chartType == '' ? 'bar' :
                                    $scope.chartType,
                                // Explicitly tell the width and height of a chart
                                width: null,
                                height: 367,
                            }
                        },
                        title: {
                            text: 'Monthly Average Temperature',
                            x: -20 //center
                        },
                        subtitle: {
                            text: 'Query Builder ',
                            x: -20
                        },
                        xAxis: {
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                        },
                        yAxis: {
                            title: {
                                text: 'Temperature (°C)'
                            },
                            plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#EC784B'
                            }]
                        },          
                        tooltip: {
                            valueSuffix: '°C'
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle',
                            borderWidth: 0
                        },
                        colors: ['#EC784B'],
                        series: [{
                            name: 'Tokyo',
                            color: '#EC784B',
                            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                        }, {
                            name: 'series II',
                            color: '#01718D',
                            data: [13.19, 17.23, 25.74, 28.5, 33.9, 35.62, 37.0, 36.6, 34.82]
                        }, {
                            name: 'series I',
                            color: '#DED7C6',
                            data: [17.4, 16.1, 19.45, 24.15, 28.44, 33.15, 37.2, 41.25, 43.3]
                        },]
                    };
        

        var privateFun = (function () {
            return {
                checkToggleOpen: function (openWindow) {
                    switch (openWindow) {
                        case '1':
                            if ($scope.eventHndler.isToggleMeasure) {
                                $("#togglePanel").hide(200);
                                $scope.eventHndler.isToggleMeasure = false;
                            }
                            break;
                        case '2':
                            if ($scope.eventHndler.isToggleColumns) {
                                $("#togglePanelColumns").hide(200);
                                $scope.eventHndler.isToggleColumns = false;
                            }
                            break;
                    }
                },
                createHighchartsChart: function (type) {
                    //high charts config
                    $scope.chartType = type;
                    $scope.highchartsNG = $scope.initHighchartObj;
                },
                fireMessage: function (msgType, msg) {

                    var _className;
                    if (msgType == '0') {
                        _className = 'danger';
                    } else if (msgType == '1') {
                        _className = 'success';
                    }
                    ngToast.create({
                        className: _className,
                        content: msg,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true
                    });
                }
            }

        })();

        //Get query string value
        var urlString = this;
        urlString = $location.search();
        $scope.queryStr = {
            crntQryBuildNme: urlString.qry
        };

        $scope.commonData = {
            measures: [
//                {id: 'm01', filedName: 'Unit price', click: false},
//                {id: 'm02', filedName: 'Price', click: false}
            ],
            columns: [
//                {id: 'a01', filedName: 'name', click: false},
//                {id: 'a02', filedName: 'location', click: false}
            ],
            measureCondition: [
                {id: 'c01', name: 'AVG', click: false, dragging: false, proBy: 'mc0'},
                {id: 'c02', name: 'SUM', click: false, dragging: false, proBy: 'mc0'},
                {id: 'c03', name: 'COUNT', click: false, dragging: false, proBy: 'mc0'},
                {id: 'c04', name: 'MIN', click: false, dragging: false, proBy: 'mc0'},
                {id: 'c05', name: 'MAX', click: false, dragging: false, proBy: 'mc0'}
            ],
            chartTypes: [
                {
                    id: 'ct01', icon: 'ti-pie-chart', name: 'pie chart', chart: 'pie',
                    selected: false, chartType: 'highCharts', view: 'views/query/chart-views/highcharts.html',
                    initObj: $scope.initHighchartObj
                },
                {
                    id: 'ct02', icon: 'ti-bar-chart', name: 'bar ', chart: 'bar',
                    selected: false, chartType: 'highCharts', view: 'views/query/chart-views/highcharts.html',
                    initObj: $scope.initHighchartObj
                },
                {
                    id: 'ct03', icon: 'fa fa-line-chart', name: 'line ', chart: 'line',
                    selected: false, chartType: 'highCharts', view: 'views/query/chart-views/highcharts.html',
                    initObj: $scope.initHighchartObj
                },
                {
                    id: 'ct04', icon: ' chart-diginSmooth_line', name: 'Smooth line ', chart: 'spline',
                    selected: false, chartType: 'highCharts', view: 'views/query/chart-views/highcharts.html',
                    initObj: $scope.initHighchartObj
                },
                {
                    id: 'ct05', icon: 'fa fa-area-chart', name: 'area ', chart: 'area',
                    selected: false, chartType: 'highCharts', view: 'views/query/chart-views/highcharts.html',
                    initObj: $scope.initHighchartObj
                },{
                    id: 'ct06', icon: 'chart-diginsmooth_area', name: 'Smooth area ', chart: 'areaspline',
                    selected: false, chartType: 'highCharts', view: 'views/query/chart-views/highcharts.html',
                    initObj: $scope.initHighchartObj
                },
                {
                    id: 'ct07', icon: 'chart-diginalluvialt', name: 'alluvial', chart: 'alluvial',
                    selected: false, chartType: 'd3Charts',
                    initObj: $scope.initHighchartObj
                },
                {
                    id: 'ct08', icon: 'chart-diginscatter', name: 'scatter ', chart: 'scatter',
                    selected: false, chartType: 'highCharts', view: 'views/query/chart-views/highcharts.html',
                    initObj: $scope.initHighchartObj
                },
                {
                    id: 'ct09', icon: 'chart-diginbump', name: 'bumpChart ', chart: 'bump',
                    selected: false, chartType: 'd3Charts',
                    initObj: $scope.initHighchartObj
                },
                {
                    id: 'ct10',
                    icon: 'chart-digincluster-dendrogram',
                    name: 'clusterDendrogram',
                    chart: 'clusterDendrogram',
                    selected: false, 
                    chartType: 'd3Charts',
                    initObj: $scope.initHighchartObj
                },
                {
                    id: 'ct11',
                    icon: 'chart-digincluster',
                    name: 'clusterForce',
                    chart: 'clusterForce',
                    selected: false, 
                    chartType: 'd3Charts',
                    initObj: $scope.initHighchartObj
                }, 
                {
                    id: 'ct12',
                    icon: 'chart-diginconvex-hull',
                    name: 'convexHull',
                    chart: 'convexHull',
                    selected: false, 
                    chartType: 'd3Charts',
                    initObj: $scope.initHighchartObj
                }, 
                {
                    id: 'ct13',
                    icon: 'chart-diginhierarchy-chart',
                    name: 'hierarchy',
                    chart: 'hierarchy',
                    selected: false, 
                    chartType: 'd3Charts',
                    initObj: $scope.initHighchartObj
                }, 
                {
                    id: 'ct14',
                    icon: 'chart-diginsunburst-chart',
                    name: 'sunburst',
                    chart: 'sunburst',
                    selected: false, 
                    chartType: 'd3Charts',
                    initObj: $scope.initHighchartObj
                }, 
                {
                    id: 'ct15',
                    icon: 'chart-digintreeeview',
                    name: 'treeeview',
                    chart: 'treeeview',
                    selected: false, 
                    chartType: 'd3Charts',
                    initObj: $scope.initHighchartObj
                },
                {
                    id: 'ct16',
                    icon: 'ti-layout-accordion-list',
                    name: 'pivotsummary',
                    chart: 'pivotsummary',
                    selected: false, 
                    chartType: 'pivotSummary',
                    view: 'views/query/chart-views/pivotSummary.html',
                    initObj: $scope.initHighchartObj
                    
                },
                {
                    id: 'ct17',
                    icon: 'ti-layout-accordion-list',
                    name: 'metric',
                    chart: 'metric',
                    selected: false, 
                    chartType: 'metric',
                    view: 'views/query/chart-views/metric.html',
                    initObj: {value:33852, label:"Sales Average"}
                }
            ]

        };
        
        
        //mapping measures array
        if($scope.sourceData.fMeaArr.length > 0){
            for(i=0; i <$scope.sourceData.fMeaArr.length; i++){
                $scope.commonData.measures.push({
                    id : $scope.sourceData.fMeaArr[i].id,
                    filedName : $scope.sourceData.fMeaArr[i].name,
                    click : false,
                    selectQry: [],
                    proBy: 'm0'
                });
            }
        }
        
    
        //mapping attributes array
        if($scope.sourceData.fAttArr.length > 0){
            for(i=0; i <$scope.sourceData.fAttArr.length; i++){
                $scope.commonData.columns.push({
                    id : $scope.sourceData.fAttArr[i].id,
                    filedName : $scope.sourceData.fAttArr[i].name,
                    click : false,
                    selectQry: [],
                    proBy: 'c0'
                });
            }
        }
        
        console.log('source data:'+JSON.stringify());
    
        var executeQryData = {
            executeMeasures: [],
            executeColumns: [],
            chartType: '',
            electQry: [],
            GrpFiled: []
        };

        $scope.executeQryData = executeQryData;

        $scope.uiSource = {};

        $scope.eventHndler = {
            isToggleMeasure: false,
            isToggleColumns: false,
            isToggleMeasureDown: false,
            isLoadingChart: false,
            toggleDownName: [],
            isMainLoading: false,
            openSettingToggle: [
                {isChart: false},
                {isStructuret: false},
                {isSerSetting: false}
            ],
            messageAry: ['Please wait while the data is saving...'],
            message: '',
            isChartSelected: false,
            onToggleEvent: function (event) {
                switch (event) {
                    case '1':
                        //event measures
                        privateFun.checkToggleOpen('2');
                        if (this.isToggleMeasure) {
                            $("#togglePanel").hide(200);
                            this.isToggleMeasure = false;
                        } else {
                            $("#togglePanel").show(300);
                            this.isToggleMeasure = true;
                        }

                        break;
                    case '2':
                        //event columns
                        privateFun.checkToggleOpen('1');
                        if (this.isToggleColumns) {
                            $("#togglePanelColumns").hide(200);
                            this.isToggleColumns = false;
                        } else {
                            $("#togglePanelColumns").show(300);
                            this.isToggleColumns = true;
                        }

                    default:
                        break;
                }
            },
            onClickMeasureToggle: function (row) {
                if (row.click) {
                    row.click = false;
                } else {
                    row.click = true;
                }
            },
            onClickCondition: function (row, filed) {
                console.log("onClickCondition:"+ JSON.stringify(row) + " " + JSON.stringify(filed));
                var isFoundCnd = false;
                for (i in executeQryData.executeMeasures) {
                    if (executeQryData.executeMeasures[i].filedName == filed.filedName &&
                        executeQryData.executeMeasures[i].condition == row.name) {
                        isFoundCnd = true;
                        alert('duplicate record found in object...');
                        return;
                    }
                    isFoundCnd = false;
                }

                if (!isFoundCnd) {
                    var obj = {
                        filedName: filed.filedName,
                        condition: row.name
                    };
                    executeQryData.executeMeasures.push(obj);
                    eval("$scope."+ $scope.selectedChart.chartType + ".selectCondition()");                    
                }
                
            },
            onClickColumn: function (column) {
                var isFoundCnd = false;
                for (i in executeQryData.executeColumns) {
                    if (executeQryData.executeColumns[i].filedName == column.filedName) {
                        isFoundCnd = true;
                        alert('duplicate record found in object...');
                        return;
                    }
                    isFoundCnd = false;
                }

                if (!isFoundCnd) {
                    var seriesArr = $scope.executeQryData.executeMeasures;
                    if(seriesArr.length > 0){
                        
                        eval("$scope."+ $scope.selectedChart.chartType + ".selectAttribute(column.filedName)");
                        
                    }else{
                        alert("First select atleast one measure");
                    }
                    
                }
            },

            onClickRmvCondition: function (condition, measure) {
                alert('record delete function...'+ JSON.stringify(condition) + " " + JSON.stringify(measure));
            },
            onClickApply: function () {
                this.isLoadingChart = true;
                if (this.isToggleMeasure) {
                    $("#togglePanel").hide(200);
                    this.isToggleMeasure = false;
                } else {
                    $("#togglePanel").show(300);
                    this.isToggleMeasure = true;
                }
                setTimeout(function () {
                    this.isLoadingChart = false;
                }, 1000);
            },
            onClickSetting: function (tabNo) {
                switch (tabNo) {
                    case '1':
                        //#chart setting
                        //click chart setting
                        if (this.openSettingToggle[0].isChart) {
                            $("#toggleSettingPanel").hide(200);
                            setTimeout(function () {
                                $("#toggleSettingPanel").removeClass('chart-tab');
                            }, 200);
                            this.openSettingToggle[0].isChart = false;
                        } else {
                            $("#toggleSettingPanel").addClass('chart-tab');
                            this.openSettingToggle[0].isChart = true;
                            $("#toggleSettingPanel").show(300);
                        }
                        break;                    
                    case '2':
                        //#data structure
                        //Data Structure
                        if (this.openSettingToggle[1].isStructuret) {
                            $("#toggleStructurePanel").hide(200);
                            setTimeout(function () {
                                $("#toggleStructurePanel").removeClass('structure-tab');
                            }, 200);
                            this.openSettingToggle[1].isStructuret = false;
                        } else {
                            $("#toggleStructurePanel").addClass('structure-tab');
                            this.openSettingToggle[1].isStructuret = true;
                            $("#toggleStructurePanel").show(300);
                        }
                        break;
                    case '3':
                        if (this.openSettingToggle[2].isChart) {
                            $("#toggleSerSettingsPanel").hide(200);
                            setTimeout(function () {
                                $("#toggleSerSettingsPanel").removeClass('ser-setting-tab');
                            }, 200);
                            this.openSettingToggle[2].isChart = false;
                        } else {
                            $("#toggleSerSettingsPanel").addClass('ser-setting-tab');
                            this.openSettingToggle[2].isChart = true;
                            $("#toggleSerSettingsPanel").show(300);
                        }
                        break;
                    case '4':
                        //save
                        $scope.widget = $scope.sourceData.wid;
                        eval("$scope."+ $scope.selectedChart.chartType + ".saveWidget($scope.widget)");                        
                        break;
                    case '5':
                        //#create query builder
                        //query builder
                        if (this.openSettingToggle[1].isQueryBuilder) {
                            $("#toggleQueryBuilder").hide(200);
                            this.openSettingToggle[1].isQueryBuilder = false;
                        } else {
                            this.openSettingToggle[1].isQueryBuilder = true;
                            $("#toggleQueryBuilder").show(300);
                        }
                        break;
                }

            },
            onClickSelectedChart: function (data, onSelect) {
                var i;
                var chartInData = data;
                for (i = 0; i < chartInData.length; i++) {
                    chartInData[i].selected = false;
                }
                onSelect.selected = true;
                $scope.executeQryData.chartType = onSelect.chart;
                $scope.chartType = onSelect.chart;
                
                if($scope.selectedChart.chartType != onSelect.chartType){
                    $scope.executeQryData.executeColumns = [];
                    $scope.executeQryData.executeMeasures = [];
                }
                $scope.selectedChart = onSelect;
                eval("$scope."+ $scope.selectedChart.chartType + ".changeType()");
                //privateFun.createHighchartsChart(onSelect.chart);
            }
        }//end event function
        
        
        $scope.saveChart = function(widget){
            widget.dataCtrl = "widgetSettingsDataCtrl";
            widget.dataView = "views/ViewData.html";
            widget["selectedChart"] = $scope.selectedChart;
            if(typeof widget.commonSrc == "undefined"){
                widget.highchartsNG["size"] = {width: 300, height: 220};
                widget["commonSrc"] = {src:$scope.sourceData,
                                      mea:$scope.executeQryData.executeMeasures,
                                      att:$scope.executeQryData.executeColumns,
                                      query:$scope.receivedQuery};
                $rootScope.dashboard.widgets.push(widget);
            }else{
                $scope.widget.highchartsNG["size"] = $scope.prevChartSize;
                $scope.widget["commonSrc"] = {src:$scope.sourceData,
                                              mea:$scope.executeQryData.executeMeasures,
                                              att:$scope.executeQryData.executeColumns,
                                              query:$scope.receivedQuery};
                var objIndex = getRootObjectById(widget.id, $rootScope.dashboard.widgets);
                $rootScope.dashboard.widgets[objIndex] = widget;
            }                     

            $scope.eventHndler.isMainLoading = true;
            $scope.eventHndler.message = $scope.eventHndler.messageAry[0];
            setTimeout(function () {
                $scope.eventHndler.isMainLoading = false;
                $state.go('home.Dashboards');
            }, 5000);
        };

        //chart functions
        $scope.highCharts = {
            onInit: function(recon){
                if (!recon)
                    $scope.highchartsNG = $scope.selectedChart.initObj;
                else{
                    $scope.highchartsNG = $scope.sourceData.wid.highchartsNG;
                    $scope.prevChartSize = angular.copy($scope.highchartsNG.size);
                    delete $scope.highchartsNG.size;
                }                
            },
            changeType: function(){
                $scope.highchartsNG.options.chart.type = $scope.selectedChart.chart;
            },
            selectCondition: function(){
                $scope.getAggregation();
            },
            selectAttribute: function(fieldName){
                $scope.executeQryData.executeColumns = [{
                    filedName: fieldName
                }];
                $scope.getGroupedAggregation(fieldName);
            },
            executeQuery: function(cat, res){
                if(cat != ""){
                    $scope.executeQryData.executeColumns = [{filedName: cat}];
                    $scope.mapResult(cat, res, function(data){
                        $scope.highchartsNG.series = data;
                        $scope.eventHndler.isLoadingChart=false;
                        $scope.receivedQuery = query;
                        $scope.queryEditState = false;
                    });
                }else{
                    $scope.setMeasureData(res[0]);
                    $scope.receivedQuery = query;
                }
            },
            removeMea: function(l){
                if(l > 0) $scope.getAggregation();
                else{
                    $scope.executeQryData.executeColumns = [];
                    $scope.highchartsNG = $scope.selectedChart.initObj;
                }
            },
            removeCat: function(){
                $scope.getAggregation();
            },
            onGetAggData: function(res){
                $scope.setMeasureData(res);
            },
            saveWidget: function(wid){
                wid.highchartsNG = $scope.highchartsNG;
                wid.uniqueType = "Dynamic Visuals";
                wid.widView = "views/common-data-src/res-views/ViewCommonSrc.html";
                wid.initCtrl = "elasticInit";
                $scope.saveChart(wid);
            }
        };
        
        $scope.d3Charts = function(){
            
        }
        
        $scope.pivotSummary = {
            onInit: function(recon){
                
            },
            changeType: function(){
                $scope.fieldArray = [];

                for(var i=0; i < $scope.commonData.measures.length; i++){
                    $scope.fieldArray.push($scope.commonData.measures[i].filedName);
                }
                for(var i=0; i < $scope.commonData.columns.length; i++){
                                    $scope.fieldArray.push($scope.commonData.columns[i].filedName);
                }
                console.log($scope.fieldArray);
                var parameter;
                $scope.fieldArray.forEach(function (entry) {
                    if (i == 0) {
                        parameter = entry
                    } else {
                        parameter += "," + entry;
                    }
                    i++;
                });

                var query = "SELECT " + $scope.fieldArray.toString() + " FROM Demo." + $scope.sourceData.tbl;  
                $scope.client.getExecQuery(query, function(data, status){
                    $scope.summaryData = data;
                });
            },
            saveWidget: function(wid){
                wid.widView = "views/ViewPivotSummary.html";        
                wid.widData.summary = $scope.summaryData;       
                wid.widData.fieldArray = $scope.fieldArray;          
                wid.uniqueType = "Pivot Summary";
                wid.initCtrl="";
                $scope.saveChart(wid);
            }
        };
    
        $scope.selectedFields = [];  

        $scope.drawPivotSummary = function(){

            console.log("$scope",$scope);

            $scope.initChart = $scope.commonData.chartTypes[15];

            $scope.selectedFields = $rootScope.pivotSummaryData;
            $scope.products = [];
            product = {};
            for (var i = 0; i <$scope.selectedFields.length; i++) {
                var data = $scope.selectedFields[i],
                product = {};
                for (var j = 0; j < $scope.fieldArray.length; j++) {
                             var field = $scope.fieldArray[j];
                             product[field] = data[field];
                }
                $scope.products.push(product);
            }

            var renderers = $.extend($.pivotUtilities.renderers, $.pivotUtilities.gchart_renderers, $.pivotUtilities.d3_renderers);
            $("#grid").pivotUI($scope.products, {
                // renderers: renderers,
                rows: [$scope.selectedFields[0]],
                cols:[$scope.selectedFields[1]],
                  
                // rendererName: "Table"         
            });
        
        } 
        
        $scope.metric = {
            onInit: function(recon){
                $scope.selectedChart.initObj = {value: $scope.sourceData.wid.widData.value,
                                                label: $scope.sourceData.wid.widData.label};
            },
            changeType: function(){
                //$scope.highchartsNG.options.chart.type = $scope.selectedChart.chart;
            },
            selectCondition: function(){
                $scope.getAggregation();
            },
            selectAttribute: function(fieldName){
                $scope.getGroupedAggregation(fieldName);
            },
            executeQuery: function(cat, res){
                if(cat != ""){
                    $scope.executeQryData.executeColumns = [{filedName: cat}];
                    $scope.mapResult(cat, res, function(data){
                        $scope.highchartsNG.series = data;
                        $scope.eventHndler.isLoadingChart=false;
                        $scope.receivedQuery = query;
                        $scope.queryEditState = false;
                    });
                }else{
                    $scope.setMeasureData(res[0]);
                    $scope.receivedQuery = query;
                }
            },
            removeMea: function(l){
                if(l > 0) $scope.getAggregation();
                else{
                    $scope.executeQryData.executeColumns = [];
                    $scope.highchartsNG = $scope.selectedChart.initObj;
                }
            },
            removeCat: function(){
                $scope.getAggregation();
            },
            onGetAggData: function(res){
                for (var c in res) {
                    if (Object.prototype.hasOwnProperty.call(res, c)) {
                        $scope.selectedChart.initObj.value = res[c];
                        $scope.selectedChart.initObj.label = c;
                    }
                }
                $scope.eventHndler.isLoadingChart=false;
            },
            saveWidget: function(wid){
                wid["widData"] = {value:$scope.selectedChart.initObj.value,
                                  label:$scope.selectedChart.initObj.label};
                wid.widView = "views/common-data-src/res-views/ViewCommonSrcMetric.html";
                $scope.saveChart(wid);
            }
        };
        
        
        $scope.getAggregation = function(){
            $scope.eventHndler.isLoadingChart=true;
            if(typeof $scope.highchartsNG["init"] == "undefined" || !$scope.highchartsNG.init){
                $scope.highchartsNG["init"] = false;
                $scope.highchartsNG = {};
                $scope.highchartsNG = {
                            options: {
                                chart: {
                                    type: $scope.chartType == '' ? 'bar' :
                                        $scope.chartType,
                                    // Explicitly tell the width and height of a chart
                                    width: null,
                                    height: 367,
                                }
                            },
                            subtitle: {
                                text: 'Query Builder ',
                                x: -20
                            },
                            legend: {
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'middle',
                                borderWidth: 0
                            },
                            xAxis: {
                                type: 'category'
                            },
                            credits: {
                                enabled: false
                            },
                            colors: ['#EC784B'],
                            series: []
                        };
            }
            
            if($scope.executeQryData.executeColumns.length == 0){
                var meaArr = executeQryData.executeMeasures;
                var fieldArr = [];
                $scope.eventHndler.isLoadingChart=true;
                meaArr.forEach(function(key){
                    fieldArr.push({
                        field : key.filedName,
                        agg : key.condition
                    });
                });
                
                $scope.client.getAggData($scope.sourceData.tbl, fieldArr, function(res, status, query){
                    if(status){
                        eval("$scope."+ $scope.selectedChart.chartType + ".onGetAggData(res[0])");
                        $scope.receivedQuery = query;
                    }
                    else{
                        //handle the exceptions
                    }
                });
                
                
            }else{
                $scope.getGroupedAggregation();
            }
            
            //alert('test');
        };
    
    $scope.setMeasureData = function(res){
        $scope.highchartsNG.series = [];
        for (var c in res) {
            if (Object.prototype.hasOwnProperty.call(res, c)) {
                $scope.highchartsNG.series.push({
                    name: c,
                    color: '#EC784B',
                    data: [res[c]]
                })
            }
        }
        $scope.eventHndler.isLoadingChart=false;
    };
    
    $scope.getGroupedAggregation = function(row){
        if(row) $scope.selectedCat = row;        
        $scope.highchartsNG.series = [];
        var fieldArr = [];
        $scope.eventHndler.isLoadingChart=true;
        
        var measureArr = $scope.executeQryData.executeMeasures;
        measureArr.forEach(function(key){
            fieldArr.push({
                field : key.filedName,
                agg : key.condition
            });
        });
        
        $scope.client.getAggData($scope.sourceData.tbl, fieldArr, function(res, status, query){
            if(status){
                $scope.mapResult($scope.selectedCat, res, function(data){
                    $scope.highchartsNG.series = data;
                    $scope.eventHndler.isLoadingChart=false;
                    $scope.receivedQuery = query;
                });                
            }

        },$scope.selectedCat);
    };
    
    $scope.getExecuteAgg = function(query){
        if(typeof query != "undefined"){
            $scope.eventHndler.isLoadingChart=true;
            $scope.client.getExecQuery(query, function(res, status, query){
                var cat = "";
                var measureArr = [];
                if(status){
                    for(c in res[0]){
                        if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                            if(typeof res[0][c] == "string") cat = c;
                            else{
                                var m = c.split('_');
                                measureArr.push({
                                    filedName: m[1],
                                    condition: m[0]
                                });
                            }
                        }
                    }
                    $scope.executeQryData.executeMeasures = measureArr;
                }
                eval("$scope."+ $scope.selectedChart.chartType + ".executeQuery(cat, res)");
            });
        }else{
            alert("enter a query");
        }
    };
    
    $scope.mapResult = function(cat, res, cb){
        var serArr = [];
        
        //dynamically building the series objects
        for(c in res[0]){
            if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                if(c != cat){
                    serArr.push({
                        name: c,
                        data: []
                    });
                }                
            }
        }
        
        //fill the series array
        res.forEach(function(key){
            serArr.forEach(function(ser){
                ser.data.push({
                    name: key[cat],
                    y: parseFloat(key[ser.name])
                });
            });
        });
        cb(serArr);
    };
    
    $scope.removeMeasure = function(m){
        var arrObj = $scope.executeQryData.executeMeasures;
        var index = arrObj.indexOf(m);
        if (index > -1) {
            arrObj.splice(index, 1);            
            eval("$scope."+ $scope.selectedChart.chartType + ".removeMea(arrObj.length)");
        }
    };
    
    $scope.removeCategory = function(c){
        var arrObj = $scope.executeQryData.executeColumns;
        var index = arrObj.indexOf(c);
        if (index > -1) {
            arrObj.splice(index, 1);
            eval("$scope."+ $scope.selectedChart.chartType + ".removeCat()");
        }
    };
        
    
    
    var queryBuilderData = {
            select: []
        };
        $scope.queryBuilderData = queryBuilderData;

        $scope.dragabbleEvent = {
            onDropCompleteMeasure: function (dragData, dropFiled) {
                console.log("onDropCompleteMeasure:"+ JSON.stringify(dragData) + " " + JSON.stringify(dropFiled));
                $scope.eventHndler.onClickCondition(dragData, dropFiled);
                
            },
            onDropCompleteGroup: function (dragData) {
                $scope.eventHndler.onClickColumn(dragData);
            }
        }
    
        $scope.changeEditState = function(){
            $scope.queryEditState = !$scope.queryEditState;  
        };

    }
).directive("markable", function () {
    return {
        link: function (scope, elem, attrs) {
            elem.on("click", function () {
                elem.addClass("active-condition");
            });
        }
    };
}).directive("removeMarkable", function () {
    return {
        link: function (scope, elem, attrs) {
            elem.on("click", function () {
                elem.addClass("de-active-condition");
            });
        }
    };
}).directive("selectedSettingIcon", function () {
    return {
        link: function (scope, elem, attrs) {
            elem.on("click", function () {
                elem.addClass("icon-select-ri1");
            });
        }
    };
}).directive("findSelectTab", function () {
    return {
        link: function (scope, elem, attrs) {
            elem.on("click", function () {
                elem.addClass("icon-select-ri1");
            });
        }
    };
});



