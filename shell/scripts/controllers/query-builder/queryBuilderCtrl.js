    // * Created by Damith on 2/12/2016.
    routerApp.controller('queryBuilderCtrl', function($scope, $rootScope, $location, $window, $csContainer, $diginengine, $state, $stateParams, ngToast, $diginurls,$mdDialog) {
        $scope.goDashboard = function() {
            $state.go('home.Dashboards');
        }
        $scope.initQueryBuilder = function() {
            if (typeof($scope.widget.widgetData.commonSrc) == "undefined") {
                $scope.selectedChart = $scope.commonData.chartTypes[1];
                $scope.highCharts.onInit(false);
            } else {
                $scope.selectedChart = $scope.widget.widgetData.selectedChart;
                $scope.widget.widgetData.highchartsNG.size.height = null;
                $scope.widget.widgetData.highchartsNG.size.width = null;
                eval("$scope." + $scope.selectedChart.chartType + ".onInit(true)");
                $scope.executeQryData.executeMeasures = $scope.widget.widgetData.commonSrc.mea;
                $scope.executeQryData.executeColumns = $scope.widget.widgetData.commonSrc.att;
                $scope.dataToBeBind.receivedQuery = $scope.widget.widgetData.commonSrc.query;
                if ($scope.selectedChart.chartType != 'metric' && $scope.selectedChart.chartType != 'highCharts') {
                    $scope.dynFlex = 90;
                    $scope.chartWrapStyle.height = 'calc(91vh)';
                } else {
                    $scope.dynFlex = 70;
                    $scope.chartWrapStyle.height = 'calc(63vh)';
                }
            }
        };
        $scope.widget = $stateParams.widObj;
        $scope.isDrilled = false;
        $scope.dynFlex = 70;
        $scope.chartWrapStyle = {
            height: 'calc(63vh)'
        };
        $scope.isPendingRequest = false;
        $scope.dataToBeBind = {};
        $scope.dataToBeBind.receivedQuery = "";
        $scope.sourceData = $csContainer.fetchSrcObj();
        $scope.client = $diginengine.getClient($scope.sourceData.src);
        $scope.queryEditState = false;
        $scope.metricObj = {
            scales: [{
                name: 'None',
                val: ""
            }, {
                name: '$',
                val: "$"
            }, {
                name: 'cm',
                val: "cm"
            }, {
                name: 'm',
                val: "m"
            }, {
                name: 'kg',
                val: "kg"
            }],
            decimals: [0, 1, 2, 3, 4],
            scalePositions: ["front", "back"]
        };
        $scope.forecastObj = {
            method: ["Additive", "Multiplicative"],
            models: ["double exponential smoothing", "triple exponential smoothing"],
            intervals: ["Daily", "Monthly", "Yearly"],
            paramObj: {
                method: "Additive",
                model: "triple exponential smoothing",
                mod: "triple_exp",
                alpha: 0.716,
                beta: 0.029,
                gamma: 0.993,
                a: 0.716,
                b: 0.029,
                g: 0.993,
                fcast_days: 12,
                tbl: $scope.sourceData.tbl,
                date_field: "",
                f_field: "",
                len_season: 12,
                interval: "Monthly"
            }
        };
        $scope.recordedColors = {};
        $scope.initRequestLimit = {
            value: 1000
        };
        $scope.requestLimits = [1000, 2000, 3000, 4000, 5000];
        $scope.chartType = 'bar';
        $scope.initHighchartObj = {
            options: {
                chart: {
                    type: $scope.chartType,
                    // Explicitly tell the width and height of a chart
                    width: null
                },
                exporting: {
                    filename: '',
                    sourceWidth: 600,
                    sourceHeight: 400
                },
                xAxis: {
                    showEmpty: false
                },
                yAxis: {
                    showEmpty: false
                },
                credits: {
                    enabled: false
                }
            },
            title: {
                text: '',
            },
            yAxis: {
                showEmpty: false
            }
        };
        //#private function
        var privateFun = (function() {
            return {
                checkToggleOpen: function(openWindow) {
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
                createHighchartsChart: function(type) {
                    //high charts config
                    $scope.chartType = type;
                    $scope.highchartsNG = $scope.initHighchartObj;
                },
                fireMessage: function(msgType, msg) {
                    var _className;
                    if (msgType == '0') {
                        _className = 'danger';
                    } else if (msgType == '1') {
                        _className = 'success';
                    }
                    ngToast.dismiss();
                    ngToast.create({
                        className: _className,
                        content: msg,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true,
                        timeout: 3000,
                        dismissOnTimeout: true
                    });
                },
                grySyntaxErrorMsg: function(type, value) {
                    //key
                    //0 : invalid query
                    //01 : from is missing
                    switch (type) {
                        case "0":
                            privateFun.fireMessage('0', '<strong>SQL syntax error : </strong>please check your query.');
                            break;
                        case "01":
                            privateFun.fireMessage('0', '<strong>SQL syntax error : </strong>In this example, the keyword "FROM" is misspelled.');
                            break;
                        case "02":
                            privateFun.fireMessage('0', '<strong>SQL syntax error : </strong>In this example, the keyword "TABLE" is misspelled.');
                            break;
                        case "03":
                            privateFun.fireMessage('0', '<strong>SQL syntax error : </strong>In this example, the keyword "SELECT" is misspelled.');
                            break;
                        case "04":
                            privateFun.fireMessage('0', '<strong>SQL syntax error : </strong>In this example, the table filed  is misspelled.');
                            break;
                        case "isNumber":
                            var reg = /^\d+$/;
                            return reg.test(value);
                            break;
                    }
                },
                isQrySyntaxError: function(qry) {
                    if (typeof qry != 'undefined') {
                        var splitQry = qry.split(" ");
                        if (splitQry.length < 4) {
                            privateFun.grySyntaxErrorMsg("04", null);
                            return false;
                        } else {
                            if (!privateFun.grySyntaxErrorMsg("isNumber", splitQry[0])) {
                                var i = 0;
                                var stateQry = {
                                    hasFrom: false,
                                    fromIndex: 0,
                                    hasTbl: false,
                                    tblIndex: 0
                                };
                                for (i; splitQry.length > i; i++) {
                                    if (splitQry[i].toLowerCase().trim() == 'from') {
                                        stateQry.hasFrom = true;
                                        stateQry.tblIndex = i + 1;
                                        stateQry.fromIndex = i;
                                        i = splitQry.length;
                                    } else {
                                        stateQry.hasFrom = false;
                                    }
                                }
                                //is check select
                                if (splitQry[0].toLowerCase().trim() != "select") {
                                    privateFun.grySyntaxErrorMsg("03", null);
                                    return false;
                                }
                                //check table filed
                                var filedAry = splitQry.slice(1, stateQry.fromIndex);
                                if (filedAry.length == 0) {
                                    privateFun.grySyntaxErrorMsg("04", null);
                                    return false;
                                }
                                //is check syntax from
                                if (!stateQry.hasFrom) {
                                    privateFun.grySyntaxErrorMsg("01", null);
                                    return false;
                                }
                            } else {
                                privateFun.grySyntaxErrorMsg("0", null);
                                return false;
                            }
                        }
                    } else {
                        privateFun.fireMessage('0', '<strong>Invalid query : </strong>please enter your query');
                        return false;
                    }
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
            measureCondition: [{
                id: 'c01',
                name: 'AVG',
                click: false,
                dragging: false,
                proBy: 'mc0'
            }, {
                id: 'c02',
                name: 'SUM',
                click: false,
                dragging: false,
                proBy: 'mc0'
            }, {
                id: 'c03',
                name: 'COUNT',
                click: false,
                dragging: false,
                proBy: 'mc0'
            }, {
                id: 'c04',
                name: 'MIN',
                click: false,
                dragging: false,
                proBy: 'mc0'
            }, {
                id: 'c05',
                name: 'MAX',
                click: false,
                dragging: false,
                proBy: 'mc0'
            }],
            chartTypes: [{
                id: 'ct01',
                icon: 'ti-pie-chart',
                name: 'pie chart',
                chart: 'pie',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct02',
                icon: 'ti-bar-chart',
                name: 'bar ',
                chart: 'bar',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct03',
                icon: 'fa fa-line-chart',
                icon: 'ti-bar-chart',
                name: 'column',
                chart: 'column',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct03',
                icon: 'ti-gallery',
                name: 'line ',
                chart: 'line',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct05',
                icon: ' chart-diginSmooth_line',
                name: 'Smooth line ',
                chart: 'spline',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct06',
                icon: 'fa fa-area-chart',
                name: 'area ',
                chart: 'area',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct07',
                icon: 'chart-diginsmooth_area',
                name: 'Smooth area ',
                chart: 'areaspline',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct08',
                icon: 'chart-diginscatter',
                name: 'scatter ',
                chart: 'scatter',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct9',
                icon: 'chart-diginhierarchy-chart',
                name: 'hierarchy',
                chart: 'hierarchy',
                selected: false,
                chartType: 'd3hierarchy',
                view: 'views/query/chart-views/hierarchySummary.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct10',
                icon: 'chart-diginsunburst-chart',
                name: 'sunburst',
                chart: 'sunburst',
                selected: false,
                chartType: 'd3sunburst',
                view: 'views/query/chart-views/sunburst.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct12',
                icon: 'ti-layout-accordion-list',
                name: 'pivotsummary',
                chart: 'pivotsummary',
                selected: false,
                chartType: 'pivotSummary',
                view: 'views/query/chart-views/pivotSummary.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct13',
                icon: 'fa fa-sort-numeric-desc',
                name: 'metric',
                chart: 'metric',
                selected: false,
                chartType: 'metric',
                view: 'views/query/chart-views/metric.html',
                initObj: {
                    value: 33852,
                    decValue: 33852,
                    scale: "",
                    dec: 2,
                    label: "Sales Average",
                    scalePosition: "back",
                    color: 'black'
                },
                settingsView: 'views/query/settings-views/metricSettings.html'
            }, {
                id: 'ct15',
                icon: 'fa fa-tasks',
                name: 'boxplot',
                chart: 'boxplot',
                selected: false,
                chartType: 'boxplot',
                view: 'views/query/chart-views/BoxPlot.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct16',
                icon: 'fa fa-bar-chart',
                name: 'histogram',
                chart: 'histogram',
                selected: false,
                chartType: 'histogram',
                view: 'views/query/chart-views/Histogram.html',
                initObj: {},
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct17',
                icon: 'ti-panel',
                name: 'bubble',
                chart: 'bubble',
                selected: false,
                chartType: 'bubble',
                view: 'views/query/chart-views/bubble.html',
                initObj: {},
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct18',
                icon: 'fa fa-line-chart',
                name: 'forecast',
                chart: 'forecast',
                selected: false,
                chartType: 'forecast',
                view: 'views/query/chart-views/forecast.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/forecastSettings.html'
            }, {
                id: 'ct19',
                icon: 'fa fa-line-chart',
                name: 'funnel',
                chart: 'funnel',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct20',
                icon: 'ti-panel',
                name: 'pyramid',
                chart: 'pyramid',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }, {
                id: 'ct21',
                icon: 'ti-panel',
                name: 'googlemap',
                chart: 'googlemap',
                selected: false,
                chartType: 'GoogleMaps',
                view: 'views/query/chart-views/GoogleMap.html'
               
            }, {
                id: 'ct22',
                icon: 'ti-panel',
                name: 'D3 visualization',
                chart: 'D3 visualization',
                selected: false,
                chartType: 'D3 Visualization',
                view: 'views/query/chart-views/GoogleMap.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html'
            }]
        };
        //mapping measures array
        if ($scope.sourceData.fMeaArr.length > 0) {
            for (i = 0; i < $scope.sourceData.fMeaArr.length; i++) {
                $scope.commonData.measures.push({
                    id: $scope.sourceData.fMeaArr[i].id,
                    filedName: $scope.sourceData.fMeaArr[i].name,
                    click: false,
                    selectQry: [],
                    proBy: 'm0'
                });
            }
        }
        //mapping attributes array
        if ($scope.sourceData.fAttArr.length > 0) {
            for (i = 0; i < $scope.sourceData.fAttArr.length; i++) {
                $scope.commonData.columns.push({
                    id: $scope.sourceData.fAttArr[i].id,
                    filedName: $scope.sourceData.fAttArr[i].name,
                    click: false,
                    selectQry: [],
                    proBy: 'c0'
                });
            }
            //Concat attributes and measures
            $scope.commonData.columns = $scope.commonData.columns.concat($scope.commonData.measures);
        } else {
            if ($scope.sourceData.fMeaArr.length > 0) {}
        }
        var executeQryData = {
            executeMeasures: [],
            executeColumns: [],
            chartType: '',
            electQry: [],
            GrpFiled: []
        };
        $scope.executeQryData = executeQryData;
        //$scope.pivotSummaryField1 = [];
        //$scope.pivotSummaryField2 = [];
        $scope.uiSource = {};
        $scope.eventHndler = {
                isToggleMeasure: false,
                isToggleColumns: false,
                isToggleMeasureDown: false,
                isLoadingChart: false,
                toggleDownName: [],
                isMainLoading: false,
                openSettingToggle: [{
                    isChart: false
                }, {
                    isStructuret: false
                }, {
                    isSerSetting: false
                }],
                messageAry: ['Adding widget to the dashboard!'],
                message: '',
                isChartSelected: false,
                onToggleEvent: function(event) {
                    switch (event) {
                        case '1':
                            //event measures
                            privateFun.checkToggleOpen('2');
                            if (this.isToggleMeasure) {
                                $("#togglePanel").hide(200);
                                this.isToggleMeasure = false;
                            } else {
                                if (this.openSettingToggle[1].isQueryBuilder) {
                                    this.hideDesignQuery();
                                }
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
                                if (this.openSettingToggle[1].isQueryBuilder) {
                                    this.hideDesignQuery();
                                }
                                $("#togglePanelColumns").show(300);
                                this.isToggleColumns = true;
                            }
                            break;
                        case '3':
                            //event columns
                            privateFun.checkToggleOpen('1');
                            if (this.isToggleColumns) {
                                $("#togglePanelColumns").hide(200);
                                this.isToggleColumns = false;
                            } else {
                                if (this.openSettingToggle[1].isQueryBuilder) {
                                    this.hideDesignQuery();
                                }
                                $("#togglePanelColumns").show(300);
                                this.isToggleColumns = true;
                            }
                            break;
                        default:
                            break;
                    }
                },
                onClickMeasureToggle: function(row) {
                    if (row.click) {
                        row.click = false;
                    } else {
                        row.click = true;
                    }
                },
                onClickCondition: function(row, filed) {
                    $("#togglePanel").hide(200);
                    $scope.isPendingRequest = true;
                    $scope.eventHndler.isToggleMeasure = false;
                    var isFoundCnd = false;
                    for (i in executeQryData.executeMeasures) {
                        if (executeQryData.executeMeasures[i].filedName == filed.filedName && executeQryData.executeMeasures[i].condition == row.name) {
                            isFoundCnd = true;
                            //alert('duplicate record found in object...');
                            privateFun.fireMessage('0', 'duplicate record found in object...');
                            $scope.isPendingRequest = false;
                            return;
                        }
                        isFoundCnd = false;
                    }
                    if ($scope.selectedChart.chart == 'pie' && executeQryData.executeMeasures.length != 0) {
                        privateFun.fireMessage('0', 'Cannot add multiple series for pie chart');
                        $scope.isPendingRequest = false;
                        return;
                    }
                    if (!isFoundCnd) {
                        var obj = {
                            filedName: filed.filedName,
                            condition: row.name
                        };
                        executeQryData.executeMeasures.push(obj);
                        //for pivot summary
                        //$scope.pivotSummaryField1.push(obj);
                        eval("$scope." + $scope.selectedChart.chartType + ".selectCondition()");
                    }
                },
                onClickColumn: function(column) {
                    $("#togglePanelColumns").hide(200);
                    $scope.isPendingRequest = true;
                    $scope.eventHndler.isToggleColumns = false;
                    var isFoundCnd = false;
                    for (i in executeQryData.executeColumns) {
                        if (executeQryData.executeColumns[i].filedName == column.filedName) {
                            isFoundCnd = true;
                            //alert('duplicate record found in object...');
                            privateFun.fireMessage('0', 'duplicate record found in object...');
                            $scope.isPendingRequest = false;
                            return;
                        }
                        isFoundCnd = false;
                    }
                    if ($scope.selectedChart.chart == 'pie' && executeQryData.executeMeasures.length > 1) {
                        privateFun.fireMessage('0', 'Cannot generate pie chart with multiple series');
                        $scope.isPendingRequest = false;
                        return;
                    }
                    if (!isFoundCnd) {
                        var seriesArr = $scope.executeQryData.executeMeasures;
                        if (seriesArr.length > 0 || $scope.chartType == "pie") {
                            eval("$scope." + $scope.selectedChart.chartType + ".selectAttribute(column.filedName)");
                        } else {
                            //alert("First select atleast one measure");
                            privateFun.fireMessage('0', 'First select atleast one measure or select appropriate chart type..');
                            $scope.isPendingRequest = false;
                        }
                    }
                },
                onClickRmvCondition: function(condition, measure) {
                    //alert('record delete function...' + JSON.stringify(condition) + " " + JSON.stringify(measure));
                    privateFun.fireMessage('0', 'record delete function...' + JSON.stringify(condition) + " " + JSON.stringify(measure));
                    $scope.isPendingRequest = false;
                },
                onClickApply: function() {
                    this.isLoadingChart = true;
                    if (this.isToggleMeasure) {
                        $("#togglePanel").hide(200);
                        this.isToggleMeasure = false;
                    } else {
                        $("#togglePanel").show(300);
                        this.isToggleMeasure = true;
                    }
                    setTimeout(function() {
                        this.isLoadingChart = false;
                    }, 1000);
                },
                onClickSetting: function(tabNo) {
                    switch (tabNo) {
                        case '1':
                            //#chart setting
                            //click chart setting
                            if (this.openSettingToggle[0].isChart) {
                                this.hideVisualizationType();
                            } else {
                                $("#toggleSettingPanel").addClass('chart-tab');
                                this.openSettingToggle[0].isChart = true;
                                $("#toggleSettingPanel").show(300);
                                if (this.openSettingToggle[1].isStructuret) {
                                    this.hideDataStructure();
                                }
                                if (this.openSettingToggle[2].isChart) {
                                    this.hideChartSettings();
                                }
                                if (this.openSettingToggle[1].isQueryBuilder) {
                                    this.hideDesignQuery();
                                }
                            }
                            break;
                        case '2':
                            //#data structure
                            //Data Structure
                            if (this.openSettingToggle[1].isStructuret) {
                                this.hideDataStructure();
                            } else {
                                $("#toggleStructurePanel").addClass('structure-tab');
                                this.openSettingToggle[1].isStructuret = true;
                                $("#toggleStructurePanel").show(300);
                                if (this.openSettingToggle[0].isChart) {
                                    this.hideVisualizationType();
                                }
                                if (this.openSettingToggle[2].isChart) {
                                    this.hideChartSettings();
                                }
                                if (this.openSettingToggle[1].isQueryBuilder) {
                                    this.hideDesignQuery();
                                }
                            }
                            break;
                        case '3':
                            if (this.openSettingToggle[2].isChart) {
                                this.hideChartSettings();
                            } else {
                                $("#toggleSerSettingsPanel").addClass('ser-setting-tab');
                                this.openSettingToggle[2].isChart = true;
                                $("#toggleSerSettingsPanel").show(300);
                                if (this.openSettingToggle[0].isChart) {
                                    this.hideVisualizationType();
                                }
                                if (this.openSettingToggle[1].isStructuret) {
                                    this.hideDataStructure();
                                }
                                if (this.openSettingToggle[1].isQueryBuilder) {
                                    this.hideDesignQuery();
                                }
                            }
                            break;
                        case '4':
                            //save
                            if ($scope.eventHndler.isLoadingChart) {
                                privateFun.fireMessage('0', "Cannot save widget while loading");
                            } else {
                                eval("$scope." + $scope.selectedChart.chartType + ".saveWidget($scope.widget)");
                            }
                            break;
                        case '5':
                            //#create query builder
                            //query builder
                            if (this.openSettingToggle[1].isQueryBuilder) {
                                this.hideDesignQuery();
                            } else {
                                $("#toggleQueryBuilder").addClass('design-tab');
                                this.openSettingToggle[1].isQueryBuilder = true;
                                $("#toggleQueryBuilder").show(300);
                                if (this.openSettingToggle[0].isChart) {
                                    this.hideVisualizationType();
                                }
                                if (this.openSettingToggle[1].isStructuret) {
                                    this.hideDataStructure();
                                }
                                if (this.openSettingToggle[2].isChart) {
                                    this.hideChartSettings();
                                }
                                if (this.isToggleMeasure) {
                                    $("#togglePanel").hide(200);
                                    this.isToggleMeasure = false;
                                }
                                if (this.isToggleColumns) {
                                    $("#togglePanelColumns").hide(200);
                                    this.isToggleColumns = false;
                                }
                            }
                            break;
                    }
                },
                //hide dialog boxes
                hideVisualizationType: function() {
                    $("#toggleSettingPanel").hide(200);
                    setTimeout(function() {
                        $("#toggleSettingPanel").removeClass('chart-tab');
                    }, 200);
                    this.openSettingToggle[0].isChart = false;
                },
                hideDataStructure: function() {
                    $("#toggleStructurePanel").hide(200);
                    setTimeout(function() {
                        $("#toggleStructurePanel").removeClass('structure-tab');
                    }, 200);
                    this.openSettingToggle[1].isStructuret = false;
                },
                hideChartSettings: function() {
                    $("#toggleSerSettingsPanel").hide(200);
                    setTimeout(function() {
                        $("#toggleSerSettingsPanel").removeClass('ser-setting-tab');
                    }, 200);
                    this.openSettingToggle[2].isChart = false;
                },
                hideDesignQuery: function() {
                    $("#toggleQueryBuilder").hide(200);
                    setTimeout(function() {
                        $("#toggleQueryBuilder").removeClass('design-tab');
                    }, 200);
                    this.openSettingToggle[1].isQueryBuilder = false;
                },
                onClickSelectedChart: function(data, onSelect) {
                    $scope.chartType = onSelect.chart;
                    var chartTypeTrue = true;
                    switch ($scope.chartType) {
                        case 'boxplot':
                            chartTypeTrue = false;
                            break;
                        case 'pivotsummary':
                            chartTypeTrue = false;
                            break;
                        case 'histogram':
                            chartTypeTrue = false;
                            break;
                        case 'bubble':
                            chartTypeTrue = false;
                            break;
                        case 'forecast':
                            chartTypeTrue = false;
                            break;
                        case 'sunburst':
                            chartTypeTrue = false;
                            break;
                        case 'hierarchy':
                            chartTypeTrue = false;
                            break;
                        case 'pie':
                            chartTypeTrue = false;
                            break;
                        case 'metric':
                            chartTypeTrue = false;
                            break;
                        case 'googlemap':
                            chartTypeTrue = false;
                            break;
                    }
                    // CHART VALIDATIONS
                    // allow to select only one measure for sunburst
                    if ($scope.chartType == "sunburst" && $scope.commonData.measures.length > 1) {
                        privateFun.fireMessage('0', "Cannot generate " + $scope.chartType + " chart with more than one measure");
                        return;
                    }
                    if ($scope.chartType == "googlemap") {
                         
                            // Initiate the chart
                            // 
                            var chart = new Highcharts.Chart({
                                colors: ["#7cb5ec", "#f7a35c"],
                                chart: {
                                    type: 'column',
                                    renderTo: 'container'
                                },
                                title: {
                                    text: 'Sales for the year 2015'
                                },
                                chart: {
                                    events: {
                                        drilldown: function(e) {
                                            // alert(e.point.name);
                                            if (!e.seriesOptions) {
                                                //alert(e.point);
                                                var chart = this,
                                                    pointWithLatLon = function(point, latLon) {
                                                        return Highcharts.merge(point, chart.transformFromLatLon(latLon, Highcharts.maps['custom/world']['hc-transform']['default']));
                                                    };
                                                var continent;
                                                var contName;
                                                switch (e.point.name) {
                                                    case "Asia":
                                                        chart.addSeriesAsDrilldown(e.point, {
                                                            mapData: Highcharts.maps['custom/asia'],
                                                            joinBy: 'hc-key',
                                                            click: function() {
                                                                alert('Hello');
                                                            },
                                                            data: [{
                                                                'hc-key': 'ir',
                                                                value: 4
                                                            }, {
                                                                'hc-key': 'ph',
                                                                value: 12
                                                            }, {
                                                                'hc-key': 'sa',
                                                                value: 25
                                                            }, {
                                                                'hc-key': 'jp',
                                                                value: 5
                                                            }, {
                                                                'hc-key': 'mn',
                                                                value: 26
                                                            }, {
                                                                'hc-key': 'kw',
                                                                value: 9
                                                            }, {
                                                                'hc-key': 'iq',
                                                                value: 14
                                                            }, {
                                                                'hc-key': 'ae',
                                                                value: 6
                                                            }, {
                                                                'hc-key': 'la',
                                                                value: 9
                                                            }, {
                                                                'hc-key': 'pk',
                                                                value: 4
                                                            }, {
                                                                'hc-key': 'jk',
                                                                value: 45
                                                            }, {
                                                                'hc-key': 'qa',
                                                                value: 9
                                                            }, {
                                                                'hc-key': 'tr',
                                                                value: 11
                                                            }, {
                                                                'hc-key': 'bn',
                                                                value: 29
                                                            }, {
                                                                'hc-key': 'af',
                                                                value: 8
                                                            }, {
                                                                'hc-key': 'kp',
                                                                value: 27
                                                            }, {
                                                                'hc-key': 'lb',
                                                                value: 41
                                                            }, {
                                                                'hc-key': 'nc',
                                                                value: 28
                                                            }, {
                                                                'hc-key': 'cy',
                                                                value: 8
                                                            }, {
                                                                'hc-key': 'tw',
                                                                value: 35
                                                            }, {
                                                                'hc-key': 'np',
                                                                value: 42
                                                            }, {
                                                                'hc-key': 'lk',
                                                                value: 16
                                                            }, {
                                                                'hc-key': 'kg',
                                                                value: 41
                                                            }],
                                                            dataLabels: {
                                                                enabled: true,
                                                                formatter: function() {
                                                                    return this.point.value + '%';
                                                                }
                                                            }
                                                        });
                                                        break;
                                                    case "lk":
                                                        chart.addSeriesAsDrilldown(e.point, {
                                                            mapData: Highcharts.maps['countries/lk/lk-all'],
                                                            joinBy: 'hc-key',
                                                            click: function() {
                                                                alert('Hello');
                                                            },
                                                            data: [{
                                                                'hc-key': 'lk-kl',
                                                                value: 4
                                                            }, {
                                                                'hc-key': 'lk-ky',
                                                                value: 12
                                                            }, {
                                                                'hc-key': 'lk-mt',
                                                                value: 25
                                                            }, {
                                                                'hc-key': 'lk-va',
                                                                value: 5
                                                            }, {
                                                                'hc-key': 'lk-hb',
                                                                value: 26
                                                            }, {
                                                                'hc-key': 'lk-ke',
                                                                value: 9
                                                            }],
                                                            dataLabels: {
                                                                enabled: true,
                                                                formatter: function() {
                                                                    return this.point.value + '%';
                                                                }
                                                            }
                                                        });
                                                        break;
                                                    case "Europe":
                                                        chart.addSeriesAsDrilldown(e.point, {
                                                            mapData: Highcharts.maps['custom/europe'],
                                                            joinBy: 'hc-key',
                                                            data: [{
                                                                'hc-key': 'dk',
                                                                value: 4
                                                            }, {
                                                                'hc-key': 'fo',
                                                                value: 20
                                                            }, {
                                                                'hc-key': 'hr',
                                                                value: 40
                                                            }, {
                                                                'hc-key': 'nl',
                                                                value: 25
                                                            }, {
                                                                'hc-key': 'ee',
                                                                value: 10
                                                            }, {
                                                                'hc-key': 'bg',
                                                                value: 15
                                                            }, {
                                                                'hc-key': 'es',
                                                                value: 22
                                                            }, {
                                                                'hc-key': 'it',
                                                                value: 10
                                                            }, {
                                                                'hc-key': 'sm',
                                                                value: 16
                                                            }, {
                                                                'hc-key': 'va',
                                                                value: 26
                                                            }, {
                                                                'hc-key': 'tr',
                                                                value: 35
                                                            }, {
                                                                'hc-key': 'mt',
                                                                value: 11
                                                            }, {
                                                                'hc-key': 'fr',
                                                                value: 29
                                                            }, {
                                                                'hc-key': 'no',
                                                                value: 36
                                                            }, {
                                                                'hc-key': 'de',
                                                                value: 13
                                                            }, {
                                                                'hc-key': 'ie',
                                                                value: 19
                                                            }, {
                                                                'hc-key': 'ua',
                                                                value: 27
                                                            }, {
                                                                'hc-key': 'fi',
                                                                value: 36
                                                            }, {
                                                                'hc-key': 'se',
                                                                value: 42
                                                            }, {
                                                                'hc-key': 'ru',
                                                                value: 45
                                                            }, {
                                                                'hc-key': 'gb',
                                                                value: 14
                                                            }, {
                                                                'hc-key': 'cy',
                                                                value: 8
                                                            }, {
                                                                'hc-key': 'pt',
                                                                value: 9
                                                            }, {
                                                                'hc-key': 'gr',
                                                                value: 5
                                                            }, {
                                                                'hc-key': 'lt',
                                                                value: 33
                                                            }, {
                                                                'hc-key': 'si',
                                                                value: 11
                                                            }, {
                                                                'hc-key': 'ba',
                                                                value: 1
                                                            }, {
                                                                'hc-key': 'mc',
                                                                value: 27
                                                            }, {
                                                                'hc-key': 'al',
                                                                value: 34
                                                            }, {
                                                                'hc-key': 'cnm',
                                                                value: 43
                                                            }, {
                                                                'hc-key': 'nc',
                                                                value: 42
                                                            }, {
                                                                'hc-key': 'rs',
                                                                value: 15
                                                            }, {
                                                                'hc-key': 'ro',
                                                                value: 20
                                                            }, {
                                                                'hc-key': 'me',
                                                                value: 31
                                                            }, {
                                                                'hc-key': 'li',
                                                                value: 3
                                                            }, {
                                                                'hc-key': 'at',
                                                                value: 28
                                                            }, {
                                                                'hc-key': 'sk',
                                                                value: 26
                                                            }, {
                                                                'hc-key': 'hu',
                                                                value: 29
                                                            }, {
                                                                'hc-key': 'ad',
                                                                value: 33
                                                            }, {
                                                                'hc-key': 'lu',
                                                                value: 38
                                                            }, {
                                                                'hc-key': 'ch',
                                                                value: 17
                                                            }, {
                                                                'hc-key': 'be',
                                                                value: 11
                                                            }, {
                                                                'hc-key': 'kv',
                                                                value: 27
                                                            }, {
                                                                'hc-key': 'pl',
                                                                value: 35
                                                            }, {
                                                                'hc-key': 'mk',
                                                                value: 37
                                                            }, {
                                                                'hc-key': 'lv',
                                                                value: 7
                                                            }, {
                                                                'hc-key': 'by',
                                                                value: 12
                                                            }, {
                                                                'hc-key': 'is',
                                                                value: 25
                                                            }, {
                                                                'hc-key': 'md',
                                                                value: 30
                                                            }, {
                                                                'hc-key': 'cz',
                                                                value: 17
                                                            }],
                                                            dataLabels: {
                                                                enabled: true,
                                                                formatter: function() {
                                                                    return this.point.value + '%';
                                                                }
                                                            }
                                                        });
                                                        break;
                                                }
                                                chart.addSeries({
                                                    id: 'cities',
                                                    name: 'Cities',
                                                    type: 'mappoint',
                                                    color: 'black',
                                                    marker: {
                                                        symbol: 'circle'
                                                    }
                                                });
                                            }
                                        }
                                    }
                                },
                                mapNavigation: {
                                    enabled: true,
                                    buttonOptions: {
                                        verticalAlign: 'bottom'
                                    }
                                },
                                colorAxis: {
                                    min: 1,
                                    max: 100,
                                    minColor: '#E0D2F8',
                                    maxColor: '#280D58'
                                },
                                plotOptions: {
                                    series: {
                                        point: {
                                            events: {
                                                click: renderSecond
                                            }
                                        }
                                    }
                                },
                                legend: {
                                    enabled: false
                                },
                                credits: {
                                    enabled: false
                                },
                                series: [{
                                    name: 'World',
                                    data: [{
                                        'hc-key': 'eu',
                                        drilldown: true,
                                        value: 10
                                    }, {
                                        'hc-key': 'as',
                                        drilldown: true,
                                        value: 55
                                    }, {
                                        'hc-key': 'lk-all',
                                        drilldown: true,
                                        value: 55
                                    }],
                                    mapData: Highcharts.maps['custom/world-continents'],
                                    joinBy: 'hc-key',
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.name}' + '<br />' + ' {point.value}' + '%'
                                    }
                                }]
                            });

                            function renderSecond(e) {
                                var point = this;
                                // Prepare demo data
                                var data = [{
                                    "hc-key": "lk-bc",
                                    "value": 0
                                }, {
                                    "hc-key": "lk-mb",
                                    "value": 1
                                }, {
                                    "hc-key": "lk-ja",
                                    "value": 2
                                }, {
                                    "hc-key": "lk-kl",
                                    "value": 3
                                }, {
                                    "hc-key": "lk-ky",
                                    "value": 4
                                }, {
                                    "hc-key": "lk-mt",
                                    "value": 5
                                }, {
                                    "hc-key": "lk-nw",
                                    "value": 6
                                }, {
                                    "hc-key": "lk-ap",
                                    "value": 7
                                }, {
                                    "hc-key": "lk-pr",
                                    "value": 8
                                }, {
                                    "hc-key": "lk-tc",
                                    "value": 9
                                }, {
                                    "hc-key": "lk-ad",
                                    "value": 10
                                }, {
                                    "hc-key": "lk-va",
                                    "value": 11
                                }, {
                                    "hc-key": "lk-mp",
                                    "value": 12
                                }, {
                                    "hc-key": "lk-kg",
                                    "value": 13
                                }, {
                                    "hc-key": "lk-px",
                                    "value": 14
                                }, {
                                    "hc-key": "lk-rn",
                                    "value": 15
                                }, {
                                    "hc-key": "lk-gl",
                                    "value": 16
                                }, {
                                    "hc-key": "lk-hb",
                                    "value": 17
                                }, {
                                    "hc-key": "lk-mh",
                                    "value": 18
                                }, {
                                    "hc-key": "lk-bd",
                                    "value": 19
                                }, {
                                    "hc-key": "lk-mj",
                                    "value": 20
                                }, {
                                    "hc-key": "lk-ke",
                                    "value": 21
                                }, {
                                    "hc-key": "lk-co",
                                    "value": 22
                                }, {
                                    "hc-key": "lk-gq",
                                    "value": 23
                                }, {
                                    "hc-key": "lk-kt",
                                    "value": 24
                                }];
                                // Initiate the chart
                                $("#detail").highcharts('Map', {
                                    title: {
                                        text: 'Sri Lanka'
                                    },
                                    mapNavigation: {
                                        enabled: true,
                                        buttonOptions: {
                                            verticalAlign: 'bottom'
                                        }
                                    },
                                    colorAxis: {
                                        min: 0
                                    },
                                    series: [{
                                        data: data,
                                        mapData: Highcharts.maps['countries/lk/lk-all'],
                                        joinBy: 'hc-key',
                                        name: 'Random data',
                                        states: {
                                            hover: {
                                                color: '#BADA55'
                                            }
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            format: '{point.name}'
                                        }
                                    }]
                                });
                            }
                         ;

                        function districtClick(event) {
                            getDistrictByID(event.mapObject.id)
                            $scope.area = [];
                            $scope.area.push({
                                "id": event.mapObject.id,
                                "color": "#264F7F"
                            });
                        }
                        var districts = [{
                            District: "Gampaha",
                            f0_: "1.0692726095000002E8"
                        }, {
                            District: "Hambanthota",
                            f0_: "3.0021887890000004E7"
                        }, {
                            District: "Mullativu",
                            f0_: "2160869.130000001"
                        }, {
                            District: "Anuradhapura",
                            f0_: "5.462298085999999E7"
                        }, {
                            District: "Kurunagala",
                            f0_: "9.217755252000001E7"
                        }, {
                            District: "Badulla",
                            f0_: "4.817429579E7"
                        }, {
                            District: "Batticaloa",
                            f0_: "6.786490195E7"
                        }, {
                            District: "Mannar",
                            f0_: "4262008.129999999"
                        }, {
                            District: "Polonnaruwa",
                            f0_: "3.0545677269999996E7"
                        }, {
                            District: "Jaffna",
                            f0_: "1.295798956E7"
                        }, {
                            District: "Kilinochchi",
                            f0_: "6551934.62"
                        }, {
                            District: "Colombo",
                            f0_: "3.9187614298E8"
                        }, {
                            District: "Matale",
                            f0_: "4.2969575300000004E7"
                        }, {
                            District: "Kandy",
                            f0_: "1.0338308772E8"
                        }, {
                            District: "Matara",
                            f0_: "6.0270031080000006E7"
                        }, {
                            District: "Nuwara Eliya",
                            f0_: "2.5525292579999994E7"
                        }, {
                            District: "Kegalle",
                            f0_: "3.780547114E7"
                        }, {
                            District: "Puttalam",
                            f0_: "2.583396303E7"
                        }, {
                            District: "Ratnapura",
                            f0_: "2.757293697E7"
                        }, {
                            District: "Monaragala",
                            f0_: "2.4146062279999997E7"
                        }, {
                            District: "Vavuniya",
                            f0_: "2062680.2199999997"
                        }, {
                            District: "Kalutara",
                            f0_: "7.678809762E7"
                        }, {
                            District: "Galle",
                            f0_: "8.318399742999999E7"
                        }, {
                            District: "Ampara",
                            f0_: "2.990633667E7"
                        }, {
                            District: "Trincomalee",
                            f0_: "3.858721745E7"
                        }];

                        function getDistrictByID(title) {
                            for (i = 0, len = districts.length; i < len; ++i) {
                                if (title == districts[i].District) {
                                    notifications.alertDialog(districts[i].District, districts[i].f0_);
                                }
                            }
                        }
                    }
                    if ($scope.chartType == "D3 visualization") {
                        //window.alert("D3 pop up");
                        $mdDialog.show({
                            controller: "openDthreeCtrl",
                            templateUrl: 'views/query/digind3.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true
                        }).then(function(answer) {})
                    }
                    if ($scope.chartType == "forecast") {
                        if ($scope.sourceData.fAttArr.length == 1 && $scope.sourceData.fMeaArr.length == 1) {
                            if (!($scope.sourceData.fAttArr[0].dataType == "TIMESTAMP" || $scope.sourceData.fAttArr[0].dataType == "datetime")) {
                                privateFun.fireMessage('0', "Select an attribute of type date to generate " + $scope.chartType + " chart");
                                return;
                            }
                        } else {
                            privateFun.fireMessage('0', "Select only one attribute and one measure to generate " + $scope.chartType + " chart");
                            return;
                        }
                    }
                    //privateFun.createHighchartsChart(onSelect.chart);
                    var seriesArr = $scope.executeQryData.executeMeasures;
                    // do not allow pie charts with more than one series
                    if (seriesArr.length > 1 && $scope.chartType == 'pie') {
                        privateFun.fireMessage('0', "Cannot generate " + $scope.chartType + " chart with more than one series");
                        return;
                    }
                    $scope.selectedChart = onSelect;
                    // do not allow charts to be generated without selecting series
                    if (seriesArr.length < 1 && chartTypeTrue) {
                        privateFun.fireMessage('0', "Cannot generate " + $scope.chartType + " chart without selecting a series ...");
                        if (onSelect.chartType != 'metric' && onSelect.chartType != 'highCharts') {
                            $scope.dynFlex = 90;
                            $scope.chartWrapStyle.height = 'calc(91vh)';
                        } else {
                            $scope.dynFlex = 70;
                            $scope.chartWrapStyle.height = 'calc(63vh)';
                        }
                        return 0;
                    } else {
                        $scope.selectedChart = onSelect;
                        eval("$scope." + $scope.selectedChart.chartType + ".changeType()");
                        if (onSelect.chartType != 'metric' && onSelect.chartType != 'highCharts') {
                            $scope.dynFlex = 90;
                            $scope.chartWrapStyle.height = 'calc(91vh)';
                        } else {
                            $scope.dynFlex = 70;
                            $scope.chartWrapStyle.height = 'calc(63vh)';
                        }
                        var i;
                        var chartInData = data;
                        for (i = 0; i < chartInData.length; i++) {
                            chartInData[i].selected = false;
                        }
                        onSelect.selected = true;
                        $scope.executeQryData.chartType = onSelect.chart;
                        if ($scope.selectedChart.chartType != onSelect.chartType) {
                            $scope.executeQryData.executeColumns = [];
                            $scope.executeQryData.executeMeasures = [];
                        }
                    }
                },
                onClickDownload: function() {
                    // var htmlElement = document.getElementsByClassName("highcharts-container")[0];
                    var htmlElement = document.getElementById("d3Sunburst");
                    html2canvas(htmlElement, {
                        onrendered: function(canvas) {
                            var button = document.getElementById('downloadImage');
                            button.addEventListener('click', function(e) {
                                var dataURL = canvas.toDataURL('image/png');
                                button.href = dataURL;
                            });
                        },
                        width: 1000,
                        height: 1000
                    });
                }
            } //end event function
        $scope.saveChart = function(widget) {
            var widgets = $rootScope.dashboard.pages[$rootScope.selectedPage - 1].widgets;
            if (widget.widgetID == null) { // new widget, so a temp id is assigned
                widget.widgetID = "temp" + Math.floor(Math.random() * (100 - 10 + 1) + 10);
            }
            widget.widgetData.highchartsNG["size"] = {
                width: 313,
                height: 260
            };
            widget.widgetData.dataCtrl = "widgetSettingsDataCtrl";
            widget.widgetData.dataView = "views/ViewData.html";
            widget.widgetData["selectedChart"] = $scope.selectedChart;
            widget.widgetData["commonSrc"] = {
                src: $scope.sourceData,
                mea: $scope.executeQryData.executeMeasures,
                att: $scope.executeQryData.executeColumns,
                query: $scope.dataToBeBind.receivedQuery
            };
            widget.sizeX = 6;
            widget.sizeY = 21;
            var objIndex = getRootObjectById(widget.widgetID, widgets);
            if (objIndex == null) { //new widget
                widgets.push(widget);
                console.log("widget", widget);
            } else {
                $scope.widget.widgetData["commonSrc"] = {
                    src: $scope.sourceData,
                    mea: $scope.executeQryData.executeMeasures,
                    att: $scope.executeQryData.executeColumns,
                    query: $scope.dataToBeBind.receivedQuery
                };
                var objIndex = getRootObjectById(widget.widgetID, widgets);
                widgets[objIndex] = $scope.widget;
                console.log("$scope.widget", $scope.widget);
            }
            $scope.eventHndler.isMainLoading = true;
            $scope.eventHndler.message = $scope.eventHndler.messageAry[0];
            setTimeout(function() {
                $scope.eventHndler.isMainLoading = false;
                $rootScope.selectedPageIndx = $rootScope.selectedPage - 1;
                $state.go('home.Dashboards');
            }, 1000);
        };
        //chart functions
        $scope.highCharts = {
            onInit: function(recon) {
                if (!recon) $scope.highchartsNG = $scope.selectedChart.initObj;
                else {
                    $scope.highchartsNG = $scope.widget.widgetData.highchartsNG;
                    $scope.highchartsNG.series.forEach(function(key) {
                        $scope.recordedColors[key.origName] = key.color;
                    });
                    $scope.isDrilled = $scope.widget.widgetData.widData.drilled;
                    if ($scope.isDrilled) $scope.drillDownConfig = $scope.widget.widgetData.widData.drillConf;
                    $scope.prevChartSize = angular.copy($scope.highchartsNG.size);
                    delete $scope.highchartsNG.size;
                }
            },
            changeType: function() {
                $scope.highchartsNG.options.chart.type = $scope.selectedChart.chart;
                $scope.highchartsNG.title.text = '';
            },
            selectCondition: function() {
                if (!$scope.isDrilled || $scope.executeQryData.executeColumns.length == 0) {
                    $scope.getAggregation();
                } else {
                    if ($scope.executeQryData.executeMeasures.length >= 1) {
                        $scope.getDrilledAggregation();
                    } else {
                        $scope.executeQryData.executeMeasures.pop();
                        eval("$scope." + $scope.selectedChart.chartType + ".onGetGrpAggData()");
                        //alert("drilldown only supports single series");
                        privateFun.fireMessage('0', 'drilldown only supports single series');
                        $scope.isPendingRequest = false;
                    }
                }
            },
            selectAttribute: function(fieldName) {
                if (!$scope.isDrilled || $scope.executeQryData.executeColumns.length == 0) {
                    //                if($scope.executeQryData.executeColumns.length == 0){
                    $scope.executeQryData.executeColumns = [{
                        filedName: fieldName
                    }];
                    $scope.getGroupedAggregation(fieldName);
                }
                // else if($scope.executeQryData.executeColumns.length == 2){
                //     eval("$scope." + $scope.selectedChart.chartType + ".onGetGrpAggData()");
                //     // alert("drilldown only supports for two levels"); 
                //     privateFun.fireMessage('0','drilldown only supports for two levels');
                //     $scope.isPendingRequest = false;               
                // }
                else if ($scope.executeQryData.executeColumns.length >= 1) {
                    $scope.executeQryData.executeColumns.push({
                        filedName: fieldName
                    });
                    $scope.getDrilledAggregation();
                }
                //for pivot summary
                //$scope.pivotSummaryField2.push({
                //    filedName: fieldName
                //});
            },
            executeQuery: function(cat, res, query) {
                if (cat != "") {
                    $scope.executeQryData.executeColumns = [{
                        filedName: cat
                    }];
                    $scope.mapResult(cat, res, function(data) {
                        $scope.highchartsNG = {};
                        $scope.highchartsNG = {
                            options: {
                                chart: {
                                    type: $scope.selectedChart.chart,
                                    plotBackgroundColor: null,
                                    plotBorderWidth: null,
                                    plotShadow: false,
                                    events: {
                                        beforePrint: function() {
                                            this.setTitle({
                                                text: this.options.exporting.chartOptions.title.text
                                            })
                                        },
                                        afterPrint: function() {
                                            this.setTitle({
                                                text: null
                                            })
                                        }
                                    }
                                },
                                tooltip: {
                                    pointFormat: '{point.y:,.0f}'
                                },
                                exporting: {
                                    sourceWidth: 600,
                                    sourceHeight: 400,
                                    chartOptions: {
                                        title: {
                                            text: $scope.widget.widgetData.widName
                                        }
                                    }
                                },
                                title: {
                                    text: ''
                                },
                                xAxis: {
                                    showEmpty: false
                                },
                                yAxis: {
                                    showEmpty: false
                                },
                                plotOptions: {
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        dataLabels: {
                                            enabled: true,
                                            color: '#000000',
                                            format: '<b> {point.name}</b>'
                                        },
                                        series: {
                                            dataLabels: {
                                                enabled: true,
                                                format: '<b>{point.name}</b> ({point.y:,.0f})',
                                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                                softConnector: true
                                            }
                                        },
                                        showInLegend: false
                                    }
                                }
                            },
                            title: {
                                text: ''
                            },
                            yAxis: {
                                lineWidth: 1,
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
                        $scope.highchartsNG.series = {};
                        $scope.xAxiscat = [];
                        $scope.highchartsNG.series = data;
                        $scope.highchartsNG.xAxis = {};
                        $scope.highchartsNG.xAxis.categories = [];
                        $scope.highchartsNG.series.forEach(function(key) {
                            if (key.data.length > 1000) key['turboThreshold'] = key.data.length;
                        });
                        $scope.highchartsNG.series.forEach(function(key) {
                            key.data.forEach(function(value) {
                                $scope.xAxiscat.push(value.name);
                            });
                        });
                        $scope.highchartsNG.xAxis.categories = $scope.xAxiscat;
                        $scope.eventHndler.isLoadingChart = false;
                        $scope.dataToBeBind.receivedQuery = query;
                        $scope.queryEditState = false;
                        $scope.isPendingRequest = false;
                    });
                } else {
                    $scope.setMeasureData(res[0]);
                    $scope.dataToBeBind.receivedQuery = query;
                }
            },
            removeMea: function(l) {
                if (l > 0) $scope.getAggregation();
                else {
                    //$scope.eventHndler.isLoadingChart = false;
                    $scope.executeQryData.executeColumns = [];
                    $scope.highchartsNG = $scope.selectedChart.initObj;
                }
            },
            removeCat: function() {
                if ($scope.isDrilled) $scope.getDrilledAggregation();
                else $scope.getAggregation();
            },
            onGetAggData: function(res) {
                $scope.isPendingRequest = false;
                $scope.setMeasureData(res);
            },
            onGetGrpAggData: function() {
                $scope.isPendingRequest = false;
            },
            saveWidget: function(widget) {
                widget.widgetData.highchartsNG = $scope.highchartsNG;
                widget.widgetData.widData['drilled'] = $scope.isDrilled;
                if ($scope.isDrilled) widget.widgetData.widData['drillConf'] = $scope.drillDownConfig;
                widget.widgetName = "highcharts";
                widget.widgetData.widView = "views/common-data-src/res-views/ViewCommonSrc.html";
                widget.widgetData.initCtrl = "elasticInit";
                $scope.saveChart(widget);
            }
        };
        $scope.filterForecast = {
            onInit: function(recon) {
                $scope.highchartsNG = $scope.initHighchartObj;
                $scope.prevChartSize = angular.copy($scope.highchartsNG.size);
                delete $scope.highchartsNG.size;
            },
            changeType: function() {
                var mergedArr = $scope.sourceData.fMeaArr.concat($scope.sourceData.fAttArr);
                mergedArr.forEach(function(k) {
                    if (k.dataType == "TIMESTAMP" || k.dataType == "datetime") {
                        $scope.forecastObj.paramObj.date_field = k.name;
                    } else {
                        $scope.forecastObj.paramObj.f_field = k.name;
                    }
                });
                switch ($scope.forecastObj.paramObj.model) {
                    case "double exponential smoothing":
                        $scope.forecastObj.paramObj.mod = 'double_exp';
                        break;
                    case "triple exponential smoothing":
                        $scope.forecastObj.paramObj.mod = 'triple_exp';
                        break;
                    default:
                        $scope.forecastObj.paramObj.mod = 'triple_exp';
                        break;
                }
                $scope.generateFilterForecast($scope.forecastObj.paramObj);
            },
            saveWidget: function(widget) {
                widget.widgetData.highchartsNG = $scope.widget.widgetData.highchartsNG;
                widget.widgetData.widView = "views/query/chart-views/forecast.html";
                widget.widgetData.foreCastObj = $scope.forecastObj.paramObj;
                widget.widgetData.initCtrl = "elasticInit";
                widget.widgetName = "forecast";
                $scope.saveChart(widget);
            }
        };
        $scope.generateFilterForecast = function(fObj) {
            $scope.widget.widgetData.highchartsNG = {};
            $scope.widget.widgetData.highchartsNG = {
                title: {
                    text: ''
                }
            };
            $scope.eventHndler.isLoadingChart = true;
            $scope.client.getForcast(fObj, function(data, status) {
                if (status) {
                    var yearArray = [];
                    var dataArray = [];
                    var serObj = [];
                    var count = 0;
                    for (var i = 0; i < data.time.length; i++) {
                        var date = moment(data.time[i]);
                        var year = date.year();
                        if (data.actual[i] !== undefined) {
                            dataArray.push(data.actual[i]);
                        } else {
                            dataArray.push(data.forecast[i]);
                        }
                        count++;
                        if (count < 12 && data.time[i + 1] === undefined) {
                            serObj.push({
                                data: dataArray,
                                zoneAxis: 'x'
                            });
                        }
                        if (count == 12) {
                            serObj.push({
                                data: dataArray,
                                zoneAxis: 'x'
                            });
                            dataArray = [];
                            count = 0;
                        }
                    }
                    console.log(serObj);
                    var finalObj = []
                    finalObj[0] = serObj[serObj.length - 2];
                    finalObj[1] = serObj[serObj.length - 1];
                    $scope.widget.widgetData.highchartsNG = {
                        options: {
                            chart: {
                                zoomType: 'x',
                                events: {
                                    beforePrint: function() {
                                        this.setTitle({
                                            text: this.options.exporting.chartOptions.title.text
                                        })
                                    },
                                    afterPrint: function() {
                                        this.setTitle({
                                            text: null
                                        })
                                    }
                                }
                            },
                            exporting: {
                                sourceWidth: 600,
                                sourceHeight: 400,
                                chartOptions: {
                                    title: {
                                        text: $scope.widget.widgetData.widName
                                    }
                                }
                            },
                            title: {
                                text: ''
                            },
                            tooltip: {
                                pointFormat: '<b> <span style = "color : {series.color}" >  ● </span> {series.name}: {point.y:,.0f} </b>',
                                useHTML: true
                            }
                        },
                        xAxis: {
                            type: 'datetime'
                        },
                        yAxis: {
                            lineWidth: 1
                        },
                        title: {
                            text: ''
                        },
                        series: finalObj
                    };
                    $scope.eventHndler.isLoadingChart = false;
                } else {
                    $scope.eventHndler.isLoadingChart = false;
                }
            });
        };
        $scope.forecast = {
            onInit: function(recon) {
                $scope.highchartsNG = $scope.initHighchartObj;
                $scope.prevChartSize = angular.copy($scope.highchartsNG.size);
                delete $scope.highchartsNG.size;
            },
            changeType: function() {
                var mergedArr = $scope.sourceData.fMeaArr.concat($scope.sourceData.fAttArr);
                mergedArr.forEach(function(k) {
                    if (k.dataType == "TIMESTAMP" || k.dataType == "datetime") {
                        $scope.forecastObj.paramObj.date_field = k.name;
                    } else {
                        $scope.forecastObj.paramObj.f_field = k.name;
                    }
                });
                switch ($scope.forecastObj.paramObj.model) {
                    case "double exponential smoothing":
                        $scope.forecastObj.paramObj.mod = 'double_exp';
                        break;
                    case "triple exponential smoothing":
                        $scope.forecastObj.paramObj.mod = 'triple_exp';
                        break;
                    default:
                        $scope.forecastObj.paramObj.mod = 'triple_exp';
                        break;
                }
                $scope.generateForecast($scope.forecastObj.paramObj);
            },
            saveWidget: function(widget) {
                widget.widgetData.highchartsNG = $scope.widget.widgetData.highchartsNG;
                widget.widgetData.widView = "views/query/chart-views/forecast.html";
                widget.widgetData.foreCastObj = $scope.forecastObj.paramObj;
                widget.widgetData.initCtrl = "elasticInit";
                widget.widgetName = "forecast";
                $scope.saveChart(widget);
            }
        };
        $scope.$watch("forecastObj.paramObj", function(newValue, oldValue) {
            if (newValue !== oldValue) {
                if (!(newValue.mod != oldValue.mod || newValue.date_field != oldValue.date_field || newValue.f_field != oldValue.f_field || newValue.alpha != oldValue.alpha || newValue.beta != oldValue.beta || newValue.gamma != oldValue.gamma)) {
                    switch (newValue.model) {
                        case "double exponential smoothing":
                            newValue.mod = 'double_exp';
                            $scope.forecastObj.paramObj.mod = 'double_exp';
                            break;
                        case "triple exponential smoothing":
                            newValue.mod = 'triple_exp';
                            $scope.forecastObj.paramObj.mod = 'triple_exp';
                            break;
                        default:
                            newValue.mod = 'triple_exp';
                            $scope.forecastObj.paramObj.mod = 'triple_exp';
                            break;
                    }
                    $scope.generateForecast(newValue);
                }
            }
        }, true);
        // change the value of those parameters seperately to prevent $watch from calling the service each time a value is changed
        $scope.setValue = function(obj) {
            switch (obj) {
                case 'alpha':
                    if (parseFloat($scope.forecastObj.paramObj.alpha) <= 1 && parseFloat($scope.forecastObj.paramObj.alpha) >= 0) {
                        $scope.forecastObj.paramObj.a = $scope.forecastObj.paramObj.alpha;
                    } else {
                        privateFun.fireMessage('0', 'Value has to be between 0 and 1');
                    }
                    break;
                case 'beta':
                    if (parseFloat($scope.forecastObj.paramObj.beta) <= 1 && parseFloat($scope.forecastObj.paramObj.beta) >= 0) {
                        $scope.forecastObj.paramObj.b = $scope.forecastObj.paramObj.beta;
                    } else {
                        privateFun.fireMessage('0', 'Value has to be between 0 and 1');
                    }
                    break;
                case 'gamma':
                    if (parseFloat($scope.forecastObj.paramObj.gamma) <= 1 && parseFloat($scope.forecastObj.paramObj.gamma) >= 0) {
                        $scope.forecastObj.paramObj.g = $scope.forecastObj.paramObj.gamma;
                    } else {
                        privateFun.fireMessage('0', 'Value has to be between 0 and 1');
                    }
                    break;
            }
        };
        $scope.generateForecast = function(fObj) {
            $scope.widget.widgetData.highchartsNG = {};
            $scope.widget.widgetData.highchartsNG = {
                title: {
                    text: ''
                }
            };
            $scope.eventHndler.isLoadingChart = true;
            $scope.client.getForcast(fObj, function(data, status) {
                if (status) {
                    // var serArr = [];
                    // var catArr = [];
                    // data.forecast = data.forecast.slice(data.actual.length);
                    // serArr.push({
                    //     data: data.actual.concat(data.forecast),
                    //     zoneAxis: 'x',
                    //     zones: [{
                    //         value: data.actual.length - 1
                    //     }, {
                    //         dashStyle: 'dash'
                    //     }]
                    // })
                    // catArr = data.time;
                    // $scope.widget.widgetData.highchartsNG = {
                    //     options: {
                    //         chart: {
                    //             zoomType: 'x',
                    //             events: {
                    //                 beforePrint: function() {
                    //                     this.setTitle({
                    //                         text: this.options.exporting.chartOptions.title.text
                    //                     })
                    //                 },
                    //                 afterPrint: function() {
                    //                     this.setTitle({
                    //                         text: null
                    //                     })
                    //                 }
                    //             }
                    //         },
                    //         exporting: {
                    //             sourceWidth: 600,
                    //             sourceHeight: 400,
                    //             chartOptions: {
                    //                 title: {
                    //                     text: $scope.widget.widgetData.widName
                    //                 }
                    //             }
                    //         },
                    //         title: {
                    //             text: ''
                    //         },
                    //         tooltip: {
                    //             pointFormat: '<b> <span style = "color : {series.color}" >  ● </span> {series.name}: {point.y:,.0f} </b>',
                    //             useHTML: true
                    //         }
                    //     },
                    //     xAxis: {
                    //         type: 'datetime',
                    //         categories: catArr
                    //     },
                    //     yAxis: {
                    //         lineWidth: 1
                    //     },
                    //     title: {
                    //         text: ''
                    //     },
                    //     series: serArr
                    // };
                    var dataArray = [];
                    var yearArray = [];
                    var serObj = [];
                    var count = 0;
                    var oldYear = moment(data.time[0]).year();
                    var newYear = oldYear;
                    var newYear;
                    var temp;
                    var flag = true;
                    var zoneValue;
                    var forecastFlag = true;
                    for (var i = 0; i < data.time.length; i++) {
                        if (newYear == oldYear) {
                            if (data.actual[i] !== undefined) dataArray.push(data.actual[i]);
                            else {
                                dataArray.push(data.forecast[i]);
                                if (forecastFlag) {
                                    zoneValue = i;
                                }
                                forecastFlag = false;
                            }
                            if (data.time[i + 1] !== undefined) {
                                newYear = moment(data.time[i + 1]).year();
                            } else {
                                serObj.push({
                                    name: oldYear,
                                    zoneAxis: 'x',
                                    data: dataArray
                                });
                                yearArray.push(oldYear);
                            }
                        } else {
                            forecastFlag = true;
                            if (zoneValue !== undefined) {
                                serObj.push({
                                    name: oldYear,
                                    data: dataArray,
                                    zoneAxis: 'x',
                                    zones: [{
                                        value: zoneValue % 12
                                    }, {
                                        dashStyle: 'dash'
                                    }]
                                });
                            } else {
                                serObj.push({
                                    name: oldYear,
                                    data: dataArray,
                                    zoneAxis: 'x'
                                });
                            }
                            zoneValue = undefined;
                            yearArray.push(oldYear);
                            oldYear = newYear;
                            dataArray = [];
                            if (!flag) {
                                if (data.actual[i] !== undefined) {
                                    dataArray.push(data.actual[i]);
                                } else {
                                    if (forecastFlag) {
                                        zoneValue = i;
                                    }
                                    dataArray.push(data.forecast[i]);
                                    forecastFlag = false;
                                }
                            }
                            flag = false;
                        }
                    }
                    console.log(serObj);
                    var date = new Date();
                    var currYear = moment(date).year();
                    var prevYear = currYear - 1;
                    var currYearIndex = yearArray.indexOf(currYear);
                    var prevYearIndex = yearArray.indexOf(prevYear);
                    var finalObj = [];
                    var category = [];
                    var monthIndex;
                    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
                    finalObj[0] = serObj[currYearIndex];
                    finalObj[1] = serObj[prevYearIndex];
                    for (var i = 0; i < 12; i++) {
                        monthIndex = moment(data.time[i]).month();
                        category.push(month[monthIndex]);
                    }
                    $scope.widget.widgetData.highchartsNG = {
                        options: {
                            chart: {
                                zoomType: 'x',
                                events: {
                                    beforePrint: function() {
                                        this.setTitle({
                                            text: this.options.exporting.chartOptions.title.text
                                        })
                                    },
                                    afterPrint: function() {
                                        this.setTitle({
                                            text: null
                                        })
                                    }
                                }
                            },
                            exporting: {
                                sourceWidth: 600,
                                sourceHeight: 400,
                                chartOptions: {
                                    title: {
                                        text: $scope.widget.widgetData.widName
                                    }
                                }
                            },
                            title: {
                                text: ''
                            },
                            tooltip: {
                                pointFormat: '<b> <span style = "color : {series.color}" >  ● </span> {series.name}: {point.y:,.0f} </b>',
                                useHTML: true
                            }
                        },
                        xAxis: {
                            type: 'datetime',
                            categories: category
                        },
                        yAxis: {
                            lineWidth: 1
                        },
                        title: {
                            text: ''
                        },
                        series: finalObj
                    };
                    $scope.eventHndler.isLoadingChart = false;
                } else {
                    $scope.eventHndler.isLoadingChart = false;
                }
            });
        };
        $scope.boxplot = {
            onInit: function(recon) {},
            changeType: function() {
                var meaArr = $scope.sourceData.fMeaArr;
                var dataTypeFlag = true;
                $scope.eventHndler.isLoadingChart = true;
                meaArr.forEach(function(k) {
                    if (k.dataType == "TIMESTAMP" || k.dataType == "datetime") {
                        dataTypeFlag = false;
                    }
                });
                $scope.widget.widgetData.highchartsNG.plotOptions = {};
                $scope.widget.widgetData.highchartsNG.series = {};
                $scope.widget.widgetData.highchartsNG.xAxis = {};
                $scope.widget.widgetData.highchartsNG.yAxis = {};
                if (dataTypeFlag && $scope.sourceData.fAttArr.length == 0) {
                    var fieldArray = [];
                    for (var i = 0; i < $scope.commonData.measures.length; i++) {
                        fieldArray.push("'" + $scope.commonData.measures[i].filedName + "'");
                    }
                    for (var i = 0; i < $scope.commonData.columns.length; i++) {
                        fieldArray.push("'" + $scope.commonData.columns[i].filedName + "'");
                    }
                    //get highest level
                    var database = $scope.sourceData.src;
                    var tbl = $scope.sourceData.tbl;
                    var fieldstr = fieldArray.toString();
                    if (database == "BigQuery") {
                        var query = $diginurls.diginengine + "generateboxplot?q=[{'[" + $diginurls.getNamespace() + "." + tbl + "]':[" + fieldstr + "]}]&dbtype=" + database;
                    } else {
                        var query = $diginurls.diginengine + "generateboxplot?q=[{'" + tbl + "':[" + fieldstr + "]}]&dbtype=" + database;
                    }
                    //get highest level
                    $scope.client.generateboxplot(query, function(data, status) {
                        var hObj = {};
                        $scope.dataforeachBox = []
                        $scope.dataOutliers = [];
                        $scope.plotCategories = [];
                        $scope.observationsData = [];
                        $scope.widget.widgetData.highchartsNG = {};
                        var i = 0;
                        if (status) {
                            $scope.eventHndler.isLoadingChart = false;
                            for (var key in data) {
                                if (Object.prototype.hasOwnProperty.call(data, key)) {
                                    $scope.plotCategories.push(key);
                                    $scope.observationsData.push([
                                        data[key].l_w,
                                        data[key].quartile_1,
                                        data[key].quartile_2,
                                        data[key].quartile_3,
                                        data[key].u_w
                                    ]);
                                    data[key].outliers.forEach(function(k) {
                                        $scope.dataOutliers.push([i, k]);
                                    });
                                    i++;
                                }
                            }
                            $scope.widget.widgetData.highchartsNG = {
                                options: {
                                    chart: {
                                        type: 'boxplot',
                                        // Explicitly tell the width and height of a chart
                                        width: null,
                                        height: 367,
                                        events: {
                                            beforePrint: function() {
                                                this.setTitle({
                                                    text: this.options.exporting.chartOptions.title.text
                                                })
                                            },
                                            afterPrint: function() {
                                                this.setTitle({
                                                    text: null
                                                })
                                            }
                                        }
                                    },
                                    exporting: {
                                        sourceWidth: 600,
                                        sourceHeight: 400,
                                        chartOptions: {
                                            title: {
                                                text: $scope.widget.widgetData.widName
                                            }
                                        }
                                    }
                                },
                                title: {
                                    text: ''
                                },
                                xAxis: {
                                    categories: $scope.plotCategories,
                                    title: {
                                        text: 'Selected Fields'
                                    }
                                },
                                yAxis: {
                                    lineWidth: 1
                                },
                                plotOptions: {
                                    boxplot: {
                                        // Enabling this option overrides the fillColor property
                                        colorByPoint: true,
                                        fillColor: '#F0F0E0',
                                        lineWidth: 2,
                                        medianColor: '#0C5DA5',
                                        medianWidth: 3,
                                        stemColor: '#A63400',
                                        stemDashStyle: 'dot',
                                        stemWidth: 1,
                                        whiskerColor: '#3D9200',
                                        whiskerLength: '20%',
                                        whiskerWidth: 3
                                    }
                                },
                                series: [{
                                    data: $scope.observationsData,
                                    tooltip: {
                                        headerFormat: '<em>Experiment No {point.key}</em><br/>'
                                    }
                                }, {
                                    name: 'Outlier',
                                    color: Highcharts.getOptions().colors[0],
                                    type: 'scatter',
                                    data: $scope.dataOutliers,
                                    marker: {
                                        fillColor: 'white',
                                        lineWidth: 1,
                                        lineColor: Highcharts.getOptions().colors[0]
                                    },
                                    tooltip: {
                                        pointFormat: 'Observation: {point.y}'
                                    }
                                }]
                            };
                            $scope.dataToBeBind.receivedQuery = query;
                        } else {}
                    });
                } else {
                    privateFun.fireMessage('0', 'Please select only numeric values to create bloxplot');
                    $scope.isPendingRequest = false;
                    $scope.eventHndler.isLoadingChart = false;
                }
            },
            saveWidget: function(widget) {
                widget.widgetData["widData"] = {
                    value: $scope.selectedChart.initObj.value,
                    label: $scope.selectedChart.initObj.label
                };
                widget.widgetName = "boxplot";
                widget.widgetData.highchartsNG["size"] = {
                    width: 300,
                    height: 220
                };
                widget.widgetData.widView = "views/query/chart-views/BoxPlot.html";
                $scope.saveChart(widget);
            }
        }
        $scope.bubble = {
            onInit: function(recon) {},
            changeType: function() {
                $scope.eventHndler.isLoadingChart = true;
                var fieldArray = [];
                for (var i = 0; i < $scope.commonData.measures.length; i++) {
                    fieldArray.push("'" + $scope.commonData.measures[i].filedName + "'");
                }
                for (var i = 0; i < $scope.commonData.columns.length; i++) {
                    fieldArray.push("'" + $scope.commonData.columns[i].filedName + "'");
                }
                // if ($scope.commonData.measures.length < 3 || $scope.commonData.columns.length < 1) {
                //     privateFun.fireMessage('0', 'Please select atleast 3 measures and 1 attribute to generate bubble chart!');
                //     $scope.isPendingRequest = false;
                //     $scope.eventHndler.isLoadingChart = false;
                //     return;
                // }
                var x = $scope.commonData.measures[0].filedName;
                var y = $scope.commonData.measures[1].filedName;
                var s = $scope.commonData.measures[2].filedName;
                var c = $scope.commonData.columns[0].filedName;
                var database = $scope.sourceData.src;
                var tbl = $scope.sourceData.tbl;
                if (database == "BigQuery") {
                    var query = $diginurls.diginengine + "generatebubble?&table=[" + $diginurls.getNamespace() + "." + tbl + "]&&x=" + x + "&&y=" + y + "&&c=" + c + "&&s=" + s + "&dbtype=" + database;
                } else if (database == "postgresql") {
                    var query = $diginurls.diginengine + "generatebubble?&table=" + tbl + "&&x=" + x + "&&y=" + y + "&&c=" + c + "&&s=" + s + "&dbtype=" + database;
                } else {
                    var query = $diginurls.diginengine + "generatebubble?&table=[" + tbl + "]&&x=" + x + "&&y=" + y + "&&c=" + c + "&&s=" + s + "&dbtype=" + database;
                }
                //get highest level
                $scope.client.generateBubble(query, function(data, status) {
                    var hObj = {};
                    $scope.axisforbubble = []
                    $scope.seriesforBubble = [];
                    console.log(data);
                    if (status) {
                        var testArray = [];
                        for (var i = 0; i < data.y.length; i++) {
                            testArray.push({
                                x: data.x[i],
                                y: data.y[i],
                                z: data.s[i],
                                name: data.c[i]
                            });
                        }
                        var nameArray = [];
                        for (var i = 0; i < data.y.length; i++) {
                            nameArray[i] = data.c[i];
                        }
                        var dataArray = [];
                        for (var i = 0; i < data.y.length; i++) {
                            dataArray.push({
                                x: data.x[i],
                                y: data.y[i],
                                z: data.s[i],
                                xName: x,
                                yName: y,
                                zName: s
                            });
                        }
                        var seriesArray = [];
                        for (var i = 0; i < dataArray.length; i++) {
                            seriesArray.push({
                                name: nameArray[i],
                                data: [dataArray[i]],
                            });
                        }
                        $scope.categories = fieldArray;
                        $scope.eventHndler.isLoadingChart = false;
                        $scope.widget.widgetData.highchartsNG = {
                            options: {
                                chart: {
                                    type: 'bubble',
                                    width: null,
                                    height: 367,
                                    zoomType: 'xy',
                                    events: {
                                        beforePrint: function() {
                                            this.setTitle({
                                                text: this.options.exporting.chartOptions.title.text
                                            })
                                        },
                                        afterPrint: function() {
                                            this.setTitle({
                                                text: null
                                            })
                                        }
                                    }
                                },
                                exporting: {
                                    sourceWidth: 600,
                                    sourceHeight: 400,
                                    chartOptions: {
                                        title: {
                                            text: $scope.widget.widgetData.widName
                                        }
                                    }
                                },
                                tooltip: {
                                    useHTML: true,
                                    pointFormat: '{point.xName} : {point.x}' + '</br>{point.yName} : {point.y}' + '</br>{point.zName} : {point.z}'
                                }
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                categories: $scope.dataforbubble,
                                title: {
                                    text: $scope.commonData.measures[0].filedName
                                }
                            },
                            yAxis: {
                                lineWidth: 1,
                                title: {
                                    text: $scope.commonData.measures[1].filedName
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            legend: {
                                enabled: false
                            },
                            series: seriesArray
                        };
                        $scope.dataToBeBind.receivedQuery = query;
                    } else {}
                });
            },
            saveWidget: function(widget) {
                widget.widgetData["widData"] = {
                    value: $scope.selectedChart.initObj.value,
                    label: $scope.selectedChart.initObj.label
                };
                widget.widgetData.highchartsNG["size"] = {
                    width: 300,
                    height: 220
                };
                widget.widgetName = "bubble";
                widget.widgetData.highchartsNG = $scope.widget.widgetData.highchartsNG;
                widget.widgetData.widView = "views/query/chart-views/bubble.html";
                $scope.saveChart(widget);
            }
        }
        $scope.histogram = {
            onInit: function(recon) {},
            changeType: function() {
                var meaArr = $scope.sourceData.fMeaArr;
                var dataTypeFlag = true;
                $scope.widget.widgetData.highchartsNG = {};
                meaArr.forEach(function(k) {
                    if (k.dataType == "TIMESTAMP" || k.dataType == "datetime") {
                        dataTypeFlag = false;
                    }
                });
                if (dataTypeFlag && $scope.sourceData.fAttArr.length == 0) {
                    $scope.eventHndler.isLoadingChart = true;
                    $scope.histogramPlot = []
                    var fieldArray = [];
                    for (var i = 0; i < $scope.commonData.measures.length; i++) {
                        fieldArray.push("'" + $scope.commonData.measures[i].filedName + "'");
                    }
                    for (var i = 0; i < $scope.commonData.columns.length; i++) {
                        fieldArray.push("'" + $scope.commonData.columns[i].filedName + "'");
                    }
                    var database = $scope.sourceData.src;
                    var tbl = $scope.sourceData.tbl;
                    if (database == "BigQuery") {
                        var query = $diginurls.diginengine + "generatehist?q=[{'[" + $diginurls.getNamespace() + "." + tbl + "]':[" + fieldArray.toString() + "]}]&bins=&dbtype=" + database;
                    } else if (database == "MSSQL") {
                        var query = $diginurls.diginengine + "generatehist?q=[{'[" + tbl + "]':[" + fieldArray.toString() + "]}]&bins=&dbtype=" + database;
                    } else {
                        var query = $diginurls.diginengine + "generatehist?q=[{'" + tbl + "':[" + fieldArray.toString() + "]}]&bins=&dbtype=" + database;
                    }
                    //get highest level
                    $scope.client.generatehist(query, function(data, status) {
                        var hObj = {};
                        if (status) {
                            $scope.eventHndler.isLoadingChart = false;
                            $scope.histogramPlotcat = [];
                            $scope.histogramPlotData = [];
                            for (var key in data) {
                                console.log(data[key]); // the whole array (index)
                                $scope.histogramPlotData.push(parseFloat(data[key][0]));
                                //var category = data[key][].splice(1, 1);
                                var category = data[key][1];
                                $scope.histogramPlotcat.push(category);
                            }
                            console.log($scope.histogramPlotData);
                            $scope.categories = fieldArray;
                            $scope.widget.widgetData.highchartsNG = {
                                options: {
                                    chart: {
                                        type: 'column',
                                        width: null,
                                        height: 500,
                                        events: {
                                            beforePrint: function() {
                                                this.setTitle({
                                                    text: this.options.exporting.chartOptions.title.text
                                                })
                                            },
                                            afterPrint: function() {
                                                this.setTitle({
                                                    text: null
                                                })
                                            }
                                        }
                                    },
                                    exporting: {
                                        sourceWidth: 600,
                                        sourceHeight: 400,
                                        chartOptions: {
                                            title: {
                                                text: $scope.widget.widgetData.widName
                                            }
                                        }
                                    },
                                    plotOptions: {
                                        column: {
                                            shadow: false,
                                            borderWidth: 1,
                                            borderColor: '#666',
                                            pointPadding: 0,
                                            groupPadding: 0
                                        },
                                        spline: {
                                            shadow: false,
                                            marker: {
                                                radius: 1
                                            }
                                        },
                                        areaspline: {
                                            color: 'rgb(69, 114, 167)',
                                            fillColor: 'rgba(69, 114, 167,.25)',
                                            shadow: false,
                                            marker: {
                                                radius: 1
                                            }
                                        }
                                    }
                                },
                                title: {
                                    text: ''
                                },
                                xAxis: {
                                    title: {
                                        text: fieldArray[0]
                                    },
                                    categories: $scope.histogramPlotcat,
                                    labels: {
                                        rotation: -90,
                                        y: 40,
                                        style: {
                                            fontSize: '8px',
                                            fontWeight: 'normal',
                                            color: '#333'
                                        },
                                    },
                                    lineWidth: 0,
                                    lineColor: '#999',
                                    tickLength: 70,
                                    tickColor: '#ccc',
                                },
                                yAxis: {
                                    lineWidth: 1,
                                    title: {
                                        text: 'Count'
                                    },
                                    //maxPadding:0,
                                    gridLineColor: '#e9e9e9',
                                    tickWidth: 1,
                                    tickLength: 3,
                                    tickColor: '#ccc',
                                    lineColor: '#ccc',
                                    //tickInterval: 25,
                                    //endOnTick:false,
                                },
                                series: [{
                                    data: $scope.histogramPlotData
                                }]
                            };
                            $scope.dataToBeBind.receivedQuery = query;
                        } else {}
                    });
                } else {
                    $scope.isPendingRequest = false;
                    $scope.eventHndler.isLoadingChart = false;
                    privateFun.fireMessage('0', 'Please select only numeric values to create histogram');
                    return;
                }
            },
            saveWidget: function(widget) {
                widget.widgetData["widData"] = {
                    value: $scope.selectedChart.initObj.value,
                    label: $scope.selectedChart.initObj.label
                };
                widget.widgetName = "histogram";
                widget.widgetData.highchartsNG["size"] = {
                    width: 300,
                    height: 220
                };
                widget.widgetData.widView = "views/query/chart-views/Histogram.html";
                $scope.saveChart(widget);
            }
        };
        $scope.d3hierarchy = {
            onInit: function(recon) {
                $scope.hierarData = $scope.widget.widgetData.widData;
            },
            changeType: function() {
                $scope.eventHndler.isLoadingChart = true;
                var fieldArray = [];
                for (var i = 0; i < $scope.commonData.measures.length; i++) {
                    fieldArray.push("'" + $scope.commonData.measures[i].filedName + "'");
                }
                for (var i = 0; i < $scope.commonData.columns.length; i++) {
                    fieldArray.push("'" + $scope.commonData.columns[i].filedName + "'");
                }
                //get highest level
                $scope.client.getHighestLevel($scope.sourceData.tbl, fieldArray.toString(), function(data, status) {
                    var hObj = {};
                    if (status) {
                        data.forEach(function(entry) {
                            hObj[entry.value] = entry.level;
                        });
                        var database = $scope.sourceData.src;
                        var tbl = $scope.sourceData.tbl;
                        if (database == "BigQuery") {
                            var query = $diginurls.diginengine + "hierarchicalsummary?h=" + JSON.stringify(hObj) + "&tablename=[" + $diginurls.getNamespace() + "." + tbl + "]&id=19&db=" + database;
                        } else {
                            var query = $diginurls.diginengine + "hierarchicalsummary?h=" + JSON.stringify(hObj) + "&tablename=" + tbl + "&db=" + database;
                        }
                        $scope.client.getHierarchicalSummary(query, function(data, status) {
                            if (status) {
                                var res = {
                                    data: data,
                                    id: "tempH" + Math.floor(Math.random() * (100 - 10 + 1) + 10).toString()
                                };
                                $scope.hierarData = res;
                                $scope.eventHndler.isLoadingChart = false;
                            } else {}
                        });
                        $scope.dataToBeBind.receivedQuery = query;
                    } else {}
                });
            },
            saveWidget: function(widget) {
                widget.widgetData.widView = "views/ViewHnbData.html";
                widget.widgetData.widData = $scope.hierarData;
                widget.widgetData.widName = $scope.widget.widgetData.widName;
                widget.widgetName = "hierarchy";
                $scope.saveChart(widget);
            }
        };
        $scope.d3sunburst = {
            onInit: function(recon) {
                $scope.hierarData = $scope.widget.widgetData.widData;
                $scope.$apply;
            },
            changeType: function() {
                $scope.eventHndler.isLoadingChart = true;
                $scope.fieldArray = [];
                for (var i = 0; i < $scope.commonData.measures.length; i++) {
                    $scope.fieldArray.push("'" + $scope.commonData.measures[i].filedName + "'");
                }
                for (var i = 0; i < $scope.commonData.columns.length; i++) {
                    $scope.fieldArray.push("'" + $scope.commonData.columns[i].filedName + "'");
                }
                //get highest level
                $scope.client.getHighestLevel($scope.sourceData.tbl, $scope.fieldArray.toString(), function(data, status) {
                    var hObj = {};
                    if (status) {
                        data.forEach(function(entry) {
                            hObj[entry.value] = entry.level;
                        });
                        var database = $scope.sourceData.src;
                        var tbl = $scope.sourceData.tbl;
                        var limVal = 1000;
                        if (database == "BigQuery") {
                            var query = $diginurls.diginengine + "hierarchicalsummary?h=" + JSON.stringify(hObj) + "&tablename=[" + $diginurls.getNamespace() + "." + tbl + "]&id=19&db=" + database + "&limit=" + limVal;
                        } else {
                            var query = $diginurls.diginengine + "hierarchicalsummary?h=" + JSON.stringify(hObj) + "&tablename=" + tbl + "&db=" + database + "&limit=" + limVal;
                        }
                        $scope.client.getHierarchicalSummary(query, function(data, status) {
                            $scope.eventHndler.isLoadingChart = false;
                            if (status) {
                                var res = {
                                    data: data,
                                    id: "tempSB" + Math.floor(Math.random() * (100 - 10 + 1) + 10).toString()
                                };
                                $scope.hierarData = res;
                                $scope.query = query;
                                $scope.eventHndler.isLoadingChart = false;
                            } else {}
                        });
                        $scope.dataToBeBind.receivedQuery = query;
                    } else {}
                });
            },
            saveWidget: function(widget) {
                widget.widgetData.widView = "views/ViewHnbMonth.html";
                //widget.widgetData = $scope.fieldArray;
                widget.widgetData.widName = $scope.widget.widgetData.widName;
                widget.widgetData.widData = $scope.hierarData;
                widget.widgetName = "sunburst";
                $scope.saveChart(widget);
            }
        };
        $scope.pivotSummary = {
            onInit: function(recon) {
                $scope.fieldArray = $scope.widget.widgetData.widData.fieldArray;
                $scope.summaryData = $scope.widget.widgetData.widData.summary;
            },
            changeType: function() {
                $scope.eventHndler.isLoadingChart = true;
                $scope.fieldArray = [];
                var fieldArrayLength = $scope.sourceData.fMeaArr.length + $scope.sourceData.fAttArr.length;
                if (fieldArrayLength <= 10) {
                    $scope.chartState = true;
                    for (var i = 0; i < $scope.sourceData.fMeaArr.length; i++) {
                        $scope.fieldArray.push($scope.sourceData.fMeaArr[i].name);
                    }
                    for (var i = 0; i < $scope.sourceData.fAttArr.length; i++) {
                        $scope.fieldArray.push($scope.sourceData.fAttArr[i].name);
                    }
                    console.log($scope.fieldArray);
                    var parameter;
                    var i = 0;
                    $scope.fieldArray.forEach(function(entry) {
                        if (i == 0) {
                            parameter = entry
                        } else {
                            parameter += "," + entry;
                        }
                        i++;
                    });
                    var db = $scope.sourceData.src;
                    if (db == "BigQuery") {
                        var query = "SELECT " + $scope.fieldArray.toString() + " FROM " + $diginurls.getNamespace() + "." + $scope.sourceData.tbl;
                    } else {
                        var query = "SELECT " + $scope.fieldArray.toString() + " FROM " + $scope.sourceData.tbl;
                    }
                    console.log("query", query);
                    $scope.client.getExecQuery(query, function(data, status) {
                        $scope.summaryData = data;
                        $scope.eventHndler.isLoadingChart = false;
                    }, $scope.initRequestLimit.value);
                    $scope.dataToBeBind.receivedQuery = query;
                } else {
                    $scope.isPendingRequest = false;
                    $scope.eventHndler.isLoadingChart = false;
                    privateFun.fireMessage('0', "Only 10 fields can be selected for pivot summary!");
                }
            },
            saveWidget: function(widget) {
                widget.widgetData.widView = "views/ViewPivotSummary.html";
                widget.widgetData.widData.summary = $scope.summaryData;
                widget.widgetData.widData.fieldArray = $scope.fieldArray;
                widget.widgetData.widName = $scope.widget.widgetData.widName;
                widget.widgetData.uniqueType = "Pivot Summary";
                widget.widgetName = "pivotsummary";
                widget.widgetData.initCtrl = "";
                $scope.saveChart(widget);
            }
        };
        $scope.googleMap = {
            
            saveWidget: function(widget) {
                widget.widgetData.widView = "views/googleMaps/ViewGoogleMapsBranches.html";
                widget.widgetData.uniqueType = "Google Maps Branches";
                widget.widgetData.widName = $scope.widget.widgetData.widName;
                $scope.saveChart(widget);
            }
        };
        $scope.selectedFields = [];
        $scope.drawPivotSummary = function() {
            console.log("$scope", $scope);
            $scope.initChart = $scope.commonData.chartTypes[15];
            $scope.selectedFields = $rootScope.pivotSummaryData;
            $scope.products = [];
            product = {};
            for (var i = 0; i < $scope.selectedFields.length; i++) {
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
                cols: [$scope.selectedFields[1]],
                // rendererName: "Table"         
            });
        }
        $scope.metric = {
            onInit: function(recon) {
                $scope.selectedChart.initObj = {
                    value: $scope.sourceData.wid.widData.value.toLocaleString(),
                    label: $scope.sourceData.wid.widData.label,
                    color: $scope.sourceData.wid.widData.color
                };
                // $scope.highchartsNG = $scope.widget.highchartsNG;
                // $scope.prevChartSize = angular.copy($scope.highchartsNG.size);
                $scope.prevChartSize = {
                    width: 300,
                    height: 220
                };
            },
            changeType: function() {
                //$scope.highchartsNG.options.chart.type = $scope.selectedChart.chart;
            },
            selectCondition: function() {
                $scope.getAggregation();
            },
            selectAttribute: function(fieldName) {
                //$scope.getGroupedAggregation(fieldName);
                // alert("grouping in metric is not supported");
                privateFun.fireMessage('0', 'grouping in metric is not supported');
                $scope.isPendingRequest = false;
            },
            executeQuery: function(cat, res, query) {
                for (var c in res[0]) {
                    if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                        $scope.selectedChart.initObj.decValue = res[0][c];
                        $scope.selectedChart.initObj.value = convertDecimals(res[0][c], 2).toLocaleString();
                        $scope.selectedChart.initObj.label = c;
                    }
                }
                $scope.eventHndler.isLoadingChart = false;
                $scope.dataToBeBind.receivedQuery = query;
            },
            removeMea: function(l) {
                if (l > 0) $scope.getAggregation();
                else {
                    // $scope.eventHndler.isLoadingChart = false;
                    $scope.executeQryData.executeColumns = [];
                    $scope.highchartsNG = $scope.selectedChart.initObj;
                }
            },
            removeCat: function() {
                $scope.getAggregation();
            },
            onGetAggData: function(res) {
                for (var c in res) {
                    $scope.isPendingRequest = false;
                    if (Object.prototype.hasOwnProperty.call(res, c)) {
                        $scope.selectedChart.initObj.decValue = res[c];
                        var value = convertDecimals(parseFloat(res[c]), parseInt($scope.selectedChart.initObj.dec));
                        $scope.selectedChart.initObj.value = value.toLocaleString();
                        $scope.selectedChart.initObj.label = c;
                    }
                }
                $scope.eventHndler.isLoadingChart = false;
            },
            saveWidget: function(widget) {
                widget.widgetData.widData = {
                    decValue: $scope.selectedChart.initObj.decValue,
                    dec: $scope.selectedChart.initObj.dec,
                    //initCtrl: "metricInit",
                    scale: $scope.selectedChart.initObj.scale,
                    value: $scope.selectedChart.initObj.value,
                    label: $scope.selectedChart.initObj.label,
                    color: $scope.selectedChart.initObj.color,
                    scalePosition: $scope.selectedChart.initObj.scalePosition
                };
                widget.widgetData.widName = $scope.widget.widgetData.widName;
                widget.widgetData.widView = "views/common-data-src/res-views/ViewCommonSrcMetric.html";
                widget.widgetName = "metric";
                $scope.saveChart(widget);
            }
        };
        $scope.getAggregation = function() {
            $scope.eventHndler.isLoadingChart = true;
            if (typeof $scope.highchartsNG["init"] == "undefined" || !$scope.highchartsNG.init) {
                $scope.highchartsNG["init"] = false;
                $scope.highchartsNG = {};
                $scope.highchartsNG = {
                    options: {
                        chart: {
                            type: $scope.selectedChart.chart,
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            events: {
                                beforePrint: function() {
                                    this.setTitle({
                                        text: this.options.exporting.chartOptions.title.text
                                    })
                                },
                                afterPrint: function() {
                                    this.setTitle({
                                        text: null
                                    })
                                }
                            }
                        },
                        tooltip: {
                            pointFormat: '{point.y:,.0f}'
                        },
                        exporting: {
                            sourceWidth: 600,
                            sourceHeight: 400,
                            chartOptions: {
                                title: {
                                    text: $scope.widget.widgetData.widName
                                }
                            }
                        },
                        xAxis: {
                            showEmpty: false
                        },
                        yAxis: {
                            showEmpty: false
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    color: '#000000',
                                    format: '<b> {point.name}</b>'
                                },
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        format: '<b>{point.name}</b> ( {point.y:,.0f} )',
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                        softConnector: true
                                    }
                                },
                                showInLegend: false
                            }
                        }
                    },
                    title: {
                        text: ''
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
                    yAxis: {
                        lineWidth: 1
                    },
                    credits: {
                        enabled: false
                    },
                    colors: ['#3b6982'],
                    series: []
                };
            }
            var row = "";
            if ($scope.executeQryData.executeColumns.length == 0) {
                var meaArr = executeQryData.executeMeasures;
                var fieldArr = [];
                $scope.eventHndler.isLoadingChart = true;
                meaArr.forEach(function(key) {
                    fieldArr.push({
                        field: key.filedName,
                        agg: key.condition
                    });
                });
                $scope.client.getAggData($scope.sourceData.tbl, fieldArr, function(res, status, query) {
                    if (status) {
                        eval("$scope." + $scope.selectedChart.chartType + ".onGetAggData(res[0])");
                        $scope.dataToBeBind.receivedQuery = query;
                        $scope.$apply();
                    } else {
                        // alert('request failed');
                        $scope.isPendingRequest = false;
                        $scope.eventHndler.isLoadingChart = false;
                        privateFun.fireMessage('0', 'request failed');
                    }
                });
            } else {
                row = $scope.executeQryData.executeColumns[0].filedName;
                $scope.getGroupedAggregation(row);
            }
            //alert('test');
        };
        $scope.setMeasureData = function(res) {
            $scope.highchartsNG.series = [];
            $scope.serColor = "";
            for (var c in res) {
                if (Object.prototype.hasOwnProperty.call(res, c)) {
                    typeof $scope.recordedColors[c] == "undefined" ? serColor = "#3b6982" : serColor = $scope.recordedColors[c];
                    $scope.highchartsNG.series.push({
                        name: c,
                        color: serColor,
                        data: parseFloat([res[c]])
                    })
                }
            }
            $scope.eventHndler.isLoadingChart = false;
        };
        $scope.getGroupedAggregation = function(row) {
            if (row) $scope.selectedCat = row;
            $scope.highchartsNG.series = [];
            var fieldArr = [];
            $scope.eventHndler.isLoadingChart = true;
            var measureArr = $scope.executeQryData.executeMeasures;
            if (measureArr.length == 0 && $scope.chartType == "pie") {
                fieldArr.push({
                    field: $scope.selectedCat,
                    agg: "percentage"
                });
            } else {
                measureArr.forEach(function(key) {
                    fieldArr.push({
                        field: key.filedName,
                        agg: key.condition
                    });
                });
            }
            $scope.client.getAggData($scope.sourceData.tbl, fieldArr, function(res, status, query) {
                if (status) {
                    //               
                    //                console.log(JSON.stringify(res));
                    $scope.mapResult($scope.selectedCat, res, function(data) {
                        $scope.highchartsNG.series = data;
                        $scope.highchartsNG.xAxis["title"] = {
                            text: $scope.selectedCat
                        };
                        $scope.highchartsNG.series.forEach(function(key) {
                            if (key.data.length > 1000) key['turboThreshold'] = key.data.length;
                        });
                        $scope.eventHndler.isLoadingChart = false;
                        $scope.dataToBeBind.receivedQuery = query;
                        $scope.$apply();
                        console.log(JSON.stringify($scope.highchartsNG));
                        eval("$scope." + $scope.selectedChart.chartType + ".onGetGrpAggData()");
                    });
                } else {
                    //alert('request failed');
                    $scope.isPendingRequest = false;
                    $scope.eventHndler.isLoadingChart = false;
                    privateFun.fireMessage('0', 'request failed');
                }
            }, $scope.selectedCat);
        };
        //<Async drilldown> 
        $scope.getDrilledAggregation = function() {
            var fieldArr = [];
            var catArr = [];
            var drillOrderArr = [];
            $scope.eventHndler.isLoadingChart = true;
            $scope.highchartsNG.series = [];
            $scope.highchartsNG['drilldown'] = {
                series: []
            };
            var measureArr = $scope.executeQryData.executeMeasures;
            measureArr.forEach(function(key) {
                fieldArr.push({
                    field: key.filedName,
                    agg: key.condition
                });
            });
            $scope.executeQryData.executeColumns.forEach(function(key) {
                catArr.push('"' + key.filedName + '"');
            });
            $scope.client.getHighestLevel($scope.sourceData.tbl, catArr.toString(), function(res, status) {
                if (status) {
                    var highestLevel = "";
                    for (i = 0; i < res.length; i++) {
                        if (typeof res[i + 1] != "undefined") {
                            drillOrderArr.push({
                                name: res[i].value,
                                nextLevel: res[i + 1].value,
                                level: res[i].level
                            });
                            if (res[i].level == 1) highestLevel = res[i].value;
                        } else {
                            drillOrderArr.push({
                                name: res[i].value,
                                level: res[i].level
                            });
                        }
                    }
                    $scope.client.getAggData($scope.sourceData.tbl, fieldArr, function(res, status, query) {
                        console.log(JSON.stringify(res));
                        var serObj = {};
                        for (var key in res[0]) {
                            if (Object.prototype.hasOwnProperty.call(res[0], key)) {
                                if (key != highestLevel) {
                                    serObj[key] = {
                                        name: key,
                                        data: []
                                    };
                                }
                            }
                        }
                        for (i = 0; i < res.length; i++) {
                            for (var key in res[i]) {
                                if (Object.prototype.hasOwnProperty.call(res[i], key)) {
                                    if (key != highestLevel) {
                                        serObj[key].data.push({
                                            name: res[i][highestLevel],
                                            y: parseFloat(res[i][key]),
                                            drilldown: true
                                        });
                                    }
                                }
                            }
                        }
                        for (var key in serObj) {
                            if (Object.prototype.hasOwnProperty.call(serObj, key)) {
                                $scope.highchartsNG.series.push({
                                    name: key,
                                    data: serObj[key].data
                                });
                            }
                        }
                        //assigning the highest level query
                        $scope.dataToBeBind.receivedQuery = query;
                        $scope.drillDownConfig = {
                            dataSrc: $scope.sourceData.src,
                            clientObj: $scope.client,
                            srcTbl: $scope.sourceData.tbl,
                            drillOrdArr: drillOrderArr,
                            highestLvl: highestLevel,
                            fields: fieldArr,
                            level1Query: query,
                            level2Query: null,
                            level3Query: null,
                            currentLevel: 1
                        };
                        $scope.highchartsNG.xAxis["title"] = {
                            text: highestLevel
                        };
                        $scope.highchartsNG.options['customVar'] = highestLevel;
                        $scope.highchartsNG.options.chart['events'] = {
                            drilldown: function(e) {
                                if (!e.seriesOptions) {
                                    var srcTbl = $scope.sourceData.tbl,
                                        fields = fieldArr,
                                        drillOrdArr = drillOrderArr,
                                        chart = this,
                                        clientObj = $scope.client,
                                        clickedPoint = e.point.name,
                                        nextLevel = "",
                                        highestLvl = this.options.customVar,
                                        drillObj = {},
                                        isLastLevel = false,
                                        selectedSeries = e.point.series.name;
                                    for (i = 0; i < drillOrdArr.length; i++) {
                                        if (drillOrdArr[i].name == highestLvl) {
                                            nextLevel = drillOrdArr[i].nextLevel;
                                            if (!drillOrdArr[i + 1].nextLevel) isLastLevel = true;
                                        }
                                    }
                                    chart.options.lang.drillUpText = "◁ Back to " + highestLvl;
                                    // Show the loading label
                                    chart.showLoading("Retrieving data for '" + clickedPoint.toString().toLowerCase() + "' grouped by '" + nextLevel + "'");
                                    //aggregate method
                                    clientObj.getAggData(srcTbl, fields, function(res, status, query) {
                                        if (status) {
                                            for (var key in res[0]) {
                                                if (Object.prototype.hasOwnProperty.call(res[0], key)) {
                                                    if (key != nextLevel && key == selectedSeries) {
                                                        drillObj = {
                                                            name: key,
                                                            data: []
                                                        };
                                                    }
                                                }
                                            }
                                            res.forEach(function(key) {
                                                if (!isLastLevel) {
                                                    drillObj.data.push({
                                                        name: key[nextLevel],
                                                        y: parseFloat(key[drillObj.name]),
                                                        drilldown: true
                                                    });
                                                } else {
                                                    drillObj.data.push({
                                                        name: key[nextLevel],
                                                        y: parseFloat(key[drillObj.name])
                                                    });
                                                }
                                            });
                                            $scope.dataToBeBind.receivedQuery = query;
                                            chart.addSeriesAsDrilldown(e.point, drillObj);
                                        } else {
                                            alert('request failed due to :' + JSON.stringify(res));
                                            e.preventDefault();
                                        }
                                        console.log(JSON.stringify(res));
                                        $scope.highchartsNG.xAxis["title"] = {
                                            text: nextLevel
                                        };
                                        $scope.highchartsNG.yAxis["title"] = {
                                            text: selectedSeries
                                        };
                                        chart.options.customVar = nextLevel;
                                        chart.hideLoading();
                                    }, nextLevel, highestLvl + "='" + clickedPoint + "'");
                                }
                            },
                            drillup: function(e) {
                                console.log(e);
                                var chart = this;
                                console.log(chart.options.customVar);
                                $scope.drillDownConfig.drillOrdArr.forEach(function(key) {
                                    if (key.nextLevel && key.nextLevel == chart.options.customVar) {
                                        chart.options.customVar = key.name;
                                        $scope.highchartsNG.xAxis["title"] = {
                                            text: chart.options.customVar
                                        };
                                    }
                                });
                                // set x and y axis titles (DUODIGIN-914)
                                var flag = false;
                                $scope.drillDownConfig.drillOrdArr.forEach(function(key) {
                                    if (chart.options.customVar == key.nextLevel) {
                                        chart.options.lang.drillUpText = "◁ Back to " + key.name;
                                        flag = true;
                                    }
                                });
                                if (!flag) {
                                    $scope.highchartsNG.yAxis["title"] = {
                                        text: 'values'
                                    };
                                }
                            }
                        };
                        $scope.isPendingRequest = false;
                        $scope.eventHndler.isLoadingChart = false;
                    }, highestLevel);
                } else {
                    privateFun.fireMessage('0', res);
                }
            });
        };
        //* </Async drilldown> 
        $scope.getDrilledAggregation1 = function() {
            var fieldArr = [];
            var catArr = [];
            $scope.eventHndler.isLoadingChart = true;
            var measureArr = $scope.executeQryData.executeMeasures;
            measureArr.forEach(function(key) {
                fieldArr.push({
                    field: key.filedName,
                    agg: key.condition
                });
            });
            $scope.executeQryData.executeColumns.forEach(function(key) {
                catArr.push('"' + key.filedName + '"');
            });
            $scope.client.getHighestLevel($scope.sourceData.tbl, catArr.toString(), function(res, status) {
                if (status) {
                    var serArr = [];
                    var serMainArr = [];
                    var drillObj = {};
                    var drillSerMainArr = [];
                    var i = 0,
                        j = 0;
                    syncDrill(i, res);

                    function syncDrill(i, res) {
                        if (i < res.length) {
                            $scope.client.getAggData($scope.sourceData.tbl, fieldArr, function(res1, status, query) {
                                if (status) {
                                    console.log(JSON.stringify(res1));
                                    var serNameKey = "";
                                    var serValKey = "";
                                    for (var key in res1[0]) {
                                        if (Object.prototype.hasOwnProperty.call(res1[0], key)) {
                                            typeof res1[0][key] == "string" ? serNameKey = key : serValKey = key;
                                        }
                                    }
                                    for (k = 0; k < res1.length; k++) {
                                        serArr.push({
                                            name: res1[k][serNameKey],
                                            y: res1[k][serValKey],
                                            drilldown: res1[k][serNameKey]
                                        });
                                    }
                                    serMainArr.push({
                                        name: serValKey,
                                        data: serArr
                                    });
                                    console.log(JSON.stringify(serMainArr));
                                    syncAgg(j, res1);

                                    function syncAgg(j, res1) {
                                        if (j < res1.length) {
                                            var con = res[i].value + "='" + res1[j][res[i].value] + "'";
                                            var drillSerArr = [];
                                            $scope.client.getAggData($scope.sourceData.tbl, fieldArr, function(res2, status, query) {
                                                if (status) {
                                                    var dserNameKey = "";
                                                    var dserValKey = "";
                                                    for (var key in res2[0]) {
                                                        if (Object.prototype.hasOwnProperty.call(res2[0], key)) {
                                                            typeof res2[0][key] == "string" ? dserNameKey = key : dserValKey = key;
                                                        }
                                                    }
                                                    console.log(JSON.stringify(res2));
                                                    for (k = 0; k < res2.length; k++) {
                                                        drillSerArr.push({
                                                            name: res2[k][dserNameKey],
                                                            y: res2[k][dserValKey],
                                                            //drilldown: res2[k][dserNameKey]
                                                        });
                                                    }
                                                    drillSerMainArr.push({
                                                        name: dserValKey,
                                                        id: res1[j][res[i].value],
                                                        data: drillSerArr
                                                    });
                                                    console.log(JSON.stringify(drillSerMainArr));
                                                    $scope.dataToBeBind.receivedQuery = query;
                                                    syncAgg(j + 1, res1);
                                                } else {
                                                    //alert('request failed');
                                                    privateFun.fireMessage('0', 'request failed');
                                                    $scope.isPendingRequest = false;
                                                }
                                            }, res[i + 1].value, con);
                                        } else {
                                            $scope.highchartsNG.series = serMainArr;
                                            $scope.highchartsNG['drilldown'] = {
                                                series: drillSerMainArr
                                            };
                                            console.log(JSON.stringify($scope.highchartsNG));
                                            $scope.eventHndler.isLoadingChart = false;
                                            $scope.dataToBeBind.receivedQuery = query;
                                            eval("$scope." + $scope.selectedChart.chartType + ".onGetGrpAggData()");
                                        }
                                    };
                                } else {
                                    // alert('request failed');
                                    $scope.isPendingRequest = false;
                                    $scope.eventHndler.isLoadingChart = false;
                                    privateFun.fireMessage('0', 'request failed');
                                }
                            }, res[i].value);
                        } else {}
                    };
                } else {
                    // alert('request failed');
                    privateFun.fireMessage('0', 'request failed');
                    $scope.isPendingRequest = false;
                }
            });
        };
        //#customer query design
        $scope.getExecuteAgg = function(query) {
            //-- Gevindu on 5/23/2016 due to DUODIGIN-434 
            var str = query;
            var index;
            var nameSpTbl;
            var nameSpTblArr;
            var regX = new RegExp("FROM|From|from");
            var tables = $rootScope.tableData;
            var isAtabl = false;
            var db = $scope.sourceData.src;
            var frmState = regX.exec(str);
            var res = str.split(" ");
            for (var i = 0; i < res.length; i++) {
                if (res[i] == frmState) index = i + 1;
            }
            //-- Modified by Dilani on 24/06/2015 due to DUODIGIN-737
            nameSpTbl = res[index];
            if (db == "BigQuery") {
                nameSpTblArr = nameSpTbl.split(".");
                var nameSpace = nameSpTblArr[0];
                var tabl = nameSpTblArr[1];
            } else {
                tabl = nameSpTbl;
            }
            for (var i = 0; i < tables.length; i++) {
                if (tables[i].name.ignoreCase == tabl.ignoreCase) isAtabl = true;
            }
            var x = $diginurls.getNamespace();
            if (db == "BigQuery") {
                if (typeof query == "undefined" || $diginurls.getNamespace() != nameSpace || !isAtabl) {
                    privateFun.fireMessage('0', "You're trying to query unauthorized namespace or a table!");
                    return;
                }
            } else {
                if (typeof query == "undefined" || !isAtabl) {
                    privateFun.fireMessage('0', "You're trying to query unauthorized namespace or a table!");
                    return;
                }
            }
            //------ End
            // privateFun.isQrySyntaxError(query);
            if (typeof query != "undefined") {
                $scope.eventHndler.isLoadingChart = true;
                $scope.client.getExecQuery(query, function(res, status, query) {
                    var cat = "";
                    var measureArr = [];
                    if (status) {
                        for (c in res[0]) {
                            if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                                if (typeof res[0][c] == "string") cat = c;
                                else {
                                    var m = c.split('_');
                                    measureArr.push({
                                        filedName: m[1],
                                        condition: m[0]
                                    });
                                }
                            }
                        }
                        $scope.executeQryData.executeMeasures = measureArr;
                        eval("$scope." + $scope.selectedChart.chartType + ".executeQuery(cat, res, query)");
                    } else {
                        //alert('request failed');
                        privateFun.fireMessage('0', '<strong>Invalid query :</strong>please enter request failed ');
                        if ($scope.selectedChart.chartType == 'highCharts') {
                            $scope.highchartsNG.series = {};
                        }
                        $scope.isPendingRequest = false;
                        $scope.eventHndler.isLoadingChart = false;
                    }
                }, $scope.initRequestLimit.value);
            } else {
                // alert("enter a query");
                $scope.isPendingRequest = false;
                $scope.eventHndler.isLoadingChart = false;
                privateFun.fireMessage('0', 'pelase enter a query');
            }
        };
        $scope.mapResult = function(cat, res, cb) {
            var serArr = [];
            var serColor = "";
            //dynamically building the series objects
            for (c in res[0]) {
                if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                    if (c != cat) {
                        typeof $scope.recordedColors[c] == "undefined" ? serColor = "#3b6982" : serColor = $scope.recordedColors[c];
                        serArr.push({
                            name: c,
                            color: serColor,
                            data: [],
                            origName: c
                        });
                    }
                }
            }
            // ---- END --- 
            //fill the series array
            angular.forEach(res, function(key) {
                serArr.forEach(function(ser) {
                    ser.data.push({
                        name: key[cat],
                        y: parseFloat(key[ser.name])
                    });
                });
            });
            cb(serArr);
        };
        $scope.removeMeasure = function(m) {
            var arrObj = $scope.executeQryData.executeMeasures;
            var index = arrObj.indexOf(m);
            if (index > -1) {
                arrObj.splice(index, 1);
                eval("$scope." + $scope.selectedChart.chartType + ".removeMea(arrObj.length)");
            }
        };
        $scope.removeCategory = function(c) {
            var arrObj = $scope.executeQryData.executeColumns;
            var index = arrObj.indexOf(c);
            if (index > -1) {
                arrObj.splice(index, 1);
                eval("$scope." + $scope.selectedChart.chartType + ".removeCat()");
            }
        };
        var queryBuilderData = {
            select: []
        };
        $scope.queryBuilderData = queryBuilderData;
        $scope.dragabbleEvent = {
                onDropCompleteMeasure: function(dragData, dropFiled) {
                    console.log("onDropCompleteMeasure:" + JSON.stringify(dragData) + " " + JSON.stringify(dropFiled));
                    $scope.eventHndler.onClickCondition(dragData, dropFiled);
                },
                onDropCompleteGroup: function(dragData) {
                    $scope.eventHndler.onClickColumn(dragData);
                }
            }
            //on click edit customer query
        $scope.changeEditState = function() {
            $scope.queryEditState = !$scope.queryEditState;
            $scope.isPendingRequest = $scope.queryEditState;
        };
        //drilling down from here...
        $scope.toggleDrilled = function(state) {
            $scope.isDrilled = state;
            if (!state && $scope.executeQryData.executeColumns.length == 2) {
                $scope.executeQryData.executeColumns.pop();
                $scope.getGroupedAggregation($scope.executeQryData.executeColumns[0].filedName);
            }
        };
        //metric decimal change
        $scope.changeDecimals = function() {
            $scope.selectedChart.initObj.value = convertDecimals(parseFloat($scope.selectedChart.initObj.decValue), parseInt($scope.selectedChart.initObj.dec)).toLocaleString();
        };
        $scope.recordColor = function(ser) {
            $scope.recordedColors[ser.name] = ser.color;
        };
        //#damith
        //create custom query design catch syntax error
    }).directive("markable", function() {
        return {
            link: function(scope, elem, attrs) {
                elem.on("click", function() {
                    elem.addClass("active-condition");
                });
            }
        };
    }).directive("removeMarkable", function() {
        return {
            link: function(scope, elem, attrs) {
                elem.on("click", function() {
                    elem.addClass("de-active-condition");
                });
            }
        };
    }).directive("selectedSettingIcon", function() {
        return {
            link: function(scope, elem, attrs) {
                elem.on("click", function() {
                    elem.addClass("icon-select-ri1");
                });
            }
        };
    }).directive("findSelectTab", function() {
        return {
            link: function(scope, elem, attrs) {
                elem.on("click", function() {
                    elem.addClass("icon-select-ri1");
                });
            }
        };
    });