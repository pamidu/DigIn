routerApp.provider('ngColorPickerConfig', function() {

    var templateUrl = '';
    var defaultColors = [
        '#1dd2af', '#3498db', '#9b59b6', '#34495e', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12', '#c0392b', '#7f8c8d'
    ];
    this.setTemplateUrl = function(url) {
        templateUrl = url;
        return this;
    };
    this.setDefaultColors = function(colors) {
        defaultColors = colors;
        return this;
    };
    this.$get = function() {
        return {
            templateUrl: templateUrl,
            defaultColors: defaultColors
        }
    }
});

routerApp.run(function(cellEditorFactory){
  // create cell editor
  cellEditorFactory['boolean'] = {
    // cell key event handler
    cellKey:function(event, options, td, cellCursor){
      if(event.type=='keydown'){
        switch(event.which){
        case 13:
        case 32:
          event.stopPropagation();
          options.setValue(!options.getValue());
          return true;
        }
      }
    },
    // editor open handler
    open:function(options, td, finish, cellEditor){
      options.setValue(!options.getValue());
      finish();
    }
  };
});
routerApp.directive('ngColorPicker', ['ngColorPickerConfig', function(ngColorPickerConfig) {

    return {
        scope: {
            selected: '=',
            customizedColors: '=colors'
        },
        restrict: 'AE',
        template: '<ul><li ng-repeat="color in colors" style="outline:0;cursor:pointer" ng-class="{selected: (color===selected)}" ng-click="pick(color)" ng-style="{\'background-color\':color};"></li></ul>',
        link: function(scope, element, attr) {
            scope.colors = scope.customizedColors || ngColorPickerConfig.defaultColors;
            scope.selected = scope.selected || scope.colors[0];

            scope.pick = function(color) {
                scope.selected = color;
            };

        }
    };

}]);

routerApp.controller('queryBuilderCtrl', function($scope, $http, $rootScope, $timeout, $location, $window, $csContainer, $diginengine, $state, $stateParams, ngToast, $diginurls, $mdDialog, filterService, chartServices, layoutManager) {
    if($rootScope.showHeader == true)
   {
    $rootScope.showHeader = layoutManager.showHeader();
   }else{
    $rootScope.showHeader = layoutManager.hideHeader();
   }

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
            if ($scope.selectedChart.chartType == 'forecast') {
                $scope.executeQryData.executeForecastFilters = $scope.widget.widgetData.commonSrc.filter;    
            } else {
                $scope.executeQryData.executeFilters = $scope.widget.widgetData.commonSrc.filter;
            }
            $scope.executeQryData.executeTargetField = $scope.widget.widgetData.commonSrc.target;
            $scope.executeQryData.executeActualField = $scope.widget.widgetData.commonSrc.actual;
            if ($scope.selectedChart.chartType != 'metric' && $scope.selectedChart.chartType != 'highCharts') {
                $scope.dynFlex = 90;
                $scope.chartWrapStyle.height = 'calc(91vh)';
            } else {
                $scope.dynFlex = 70;
                $scope.chartWrapStyle.height = 'calc(63vh)';
            }
        }
    };
    $scope.mapTypes = [{
            "name": "Country",
            "abbreviation": "Co"
        }, {
            "name": "World",
            "abbreviation": "Wo"
        }

    ];

    $scope.otherChartConfig = [];
    $scope.mapType = '';

    $scope.getCountries = function() {
        $http.get('scripts/data/countries.json').then(function(response) {
            $scope.countries = response.data;
        });
    }

    $scope.mapconfig = {
        Country: '',
        Continent: '',
        Province: '',
        District: '',
        State: '',
        City: '',
        mapType: 'World',
        selectedCountry: '',
        drilled: false,
        minColor: '#0288D1',
        maxColor: '#B3E5FC',
        mapdata: [],
        min: 0
    }
    $scope.maplibrary;
    $scope.widget = $stateParams.widObj;
    $scope.isDrilled = true;
    $scope.isAutoDrill = true;
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
        decimals: [0, 1, 2, 3, 4],
        scalePositions: ["front", "back"]
    };


    $scope.forecastAtts = [];
    $scope.forecastAtt = "";
    $scope.showActual = false;

    if (typeof $scope.sourceData.forecastAtt != 'undefined') {
        for (var i = 0; i < $scope.sourceData.forecastAtt.length; i++) {
            $scope.forecastAtts[i] = $scope.sourceData.forecastAtt[i].name;
        }
        $scope.forecastAtts.push("");
    }

    $scope.intDate = moment(new Date()).format('LL');

    if (typeof $scope.widget.widgetData.foreCastObjDate == 'undefined') {
        $scope.widget.widgetData.foreCastObjDate = $scope.intDate;
    }

    $scope.visualDate = {
        startdate: $scope.intDate,
        enddate: $scope.intDate,
    };

    $scope.generateDesable = false;
    $scope.forecastObj = {
        method: ["Additive", "Multiplicative"],
        models: ["double exponential smoothing", "triple exponential smoothing"],
        intervals: ["Daily", "Monthly", "Yearly"],
        paramObj: {
            method: "Additive",
            model: "triple exponential smoothing",
            mod: "triple_exp",
            alpha: "",
            beta: "",
            gamma: "",
            a: "",
            b: "",
            g: "",
            fcast_days: 12,
            tbl: $scope.sourceData.tbl,
            date_field: "",
            f_field: "",
            len_season: 12,
            interval: "Monthly",
            startdate: $scope.intDate,
            enddate: $scope.intDate,
            forecastAtt: $scope.forecastAtt,
            showActual: $scope.showActual,
        }
    };

  

    $scope.otherChartConfig = [];
    $scope.recordedColors = {};
    $scope.initRequestLimit = {
        value: 100
    };
    $scope.limit = 100;
    $scope.requestLimits = [100, 1000, 2000, 3000, 4000, 5000];
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
                    case '3':
                        if ($scope.eventHndler.isTogglePanelFilter) {
                            $("#togglePanelFilter").hide(200);
                            $scope.eventHndler.isTogglePanelFilter = false;
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
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "A pie chart is a circular chart divided into <br> sectors which is proportional to the quantity it represents"
            }, {
                id: 'ct02',
                icon: 'ti-bar-chart-alt',
                name: 'bar',
                chart: 'bar',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "A bar chart is exactly the same as a column chart only the x-axis and y-axis are switched"
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
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "A column chart displays data as vertical bars"
            }, {
                id: 'ct03',
                icon: 'ti-gallery',
                name: 'line ',
                chart: 'line',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "A line chart is represented by a series of datapoints connected with a straight line. Line charts are most often used to visualize data that changes over time"
            }, {
                id: 'ct05',
                icon: ' chart-diginSmooth_line',
                name: 'Smooth line ',
                chart: 'spline',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: ""
            }, {
                id: 'ct06',
                icon: 'fa fa-area-chart',
                name: 'area ',
                chart: 'area',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "The area chart functions the same way as a line chart only it fills the area between the line and the threshold, which is 0 by default"
            }, {
                id: 'ct07',
                icon: 'chart-diginsmooth_area',
                name: 'Smooth area ',
                chart: 'areaspline',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "The areaspline chart is the same as area, only the line is a spline instead of straight lines"
            }, {
                id: 'ct08',
                icon: 'chart-diginscatter',
                name: 'scatter ',
                chart: 'scatter',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "A scatter chart draw a single point for each point of data in a series without connecting them"
            }, {
                id: 'ct9',
                icon: 'chart-diginhierarchy-chart',
                name: 'hierarchy',
                chart: 'hierarchy',
                selected: false,
                chartType: 'd3hierarchy',
                view: 'views/query/chart-views/hierarchySummary.html',
                initObj: {
                    dec : 0
                },
                settingsView: 'views/query/settings-views/hierarchySetings.html',
				tooltip: "A decomposition of a graph is a collection of edge-disjoint subgraphs of such that every edge of belongs to exactly one"
            }, {
                id: 'ct10',
                icon: 'chart-diginsunburst-chart',
                name: 'sunburst',
                chart: 'sunburst',
                selected: false,
                chartType: 'd3sunburst',
                view: 'views/query/chart-views/sunburst.html',
                initObj: {
                    dec : 0
                },
                settingsView: 'views/query/settings-views/hierarchySetings.html',
				tooltip: "A sunburst is similar to the treemap, except it uses a radial layout. The root node of the tree is at the center, with leaves on the circumference"
            },
            // {
            //     id: 'ct12',
            //     icon: 'ti-layout-accordion-list',
            //     name: 'pivotsummary',
            //     chart: 'pivotsummary',
            //     selected: false,
            //     chartType: 'pivotSummary',
            //     view: 'views/query/chart-views/pivotSummary.html',
            //     initObj: $scope.initHighchartObj,
            //     settingsView: 'views/query/settings-views/highchartsSettings.html'
            // }, 
            {
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
                    scalePosition: "back",
                    color: 'white',
                    targetRange: "",
                    targetValue: "",
                    targetQuery: "",
                    targetValueString: "",
                    targetField: "",
                    rangeSliderOptions: {
                        minValue: 0,
                        maxValue: 100,
                        options: {
                            floor: 0,
                            ceil: 100,
                            step: 1,
                            translate: function(value) {
                              return value + '%';
                            }
                        }
                    },
                    colorTheme: "",
                    lowerRange: 0,
                    higherRange: 33852
                },
                settingsView: 'views/query/settings-views/metricSettings.html',
				tooltip: ""
            }, {
                id: 'ct15',
                icon: 'fa fa-tasks',
                name: 'boxplot',
                chart: 'boxplot',
                selected: false,
                chartType: 'boxplot',
                view: 'views/query/chart-views/BoxPlot.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "A box plot is a convenient way of depicting groups of data through their five-number summaries: the smallest observation (sample minimum), lower quartile (Q1), median (Q2), upper quartile (Q3), and largest observation (sample maximum)"
            }, {
                id: 'ct16',
                icon: 'fa fa-bar-chart',
                name: 'histogram',
                chart: 'histogram',
                selected: false,
                chartType: 'histogram',
                view: 'views/query/chart-views/Histogram.html',
                initObj: {},
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: ""
            }, {
                id: 'ct17',
                icon: 'fa fa-circle',
                name: 'bubble',
                chart: 'bubble',
                selected: false,
                chartType: 'bubble',
                view: 'views/query/chart-views/bubble.html',
                initObj: {},
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: ""
            }, {
                id: 'ct18',
                icon: 'fa fa-line-chart',
                name: 'forecast',
                chart: 'forecast',
                selected: false,
                chartType: 'forecast',
                view: 'views/query/chart-views/forecast.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/forecastSettings.html',
				tooltip: ""
            }, {
                id: 'ct19',
                icon: 'fa fa-filter',
                name: 'funnel',
                chart: 'funnel',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "Funnel charts are a type of chart often used to visualize stages in a sales project, where the top are the initial stages with the most clients. The funnel narrows as more clients drop off"
            }, {
                id: 'ct20',
                icon: 'fa fa-caret-up',
                name: 'pyramid',
                chart: 'pyramid',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: ""
            }, {
                id: 'ct21',
                icon: 'fa fa-globe',
                name: 'Geographical Map',
                chart: 'Geographical Map',
                selected: false,
                chartType: 'map',
                view: 'views/query/chart-views/GeoMap.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/mapsettings.html',
				tooltip: "A visualization to plot analyse the data on the gographical map"
            },{
                id: 'ct22',
                icon: 'fa fa-table',
                name: 'Tabular Widget',
                chart: 'Tabular',
                chartType: 'Tabular',
                view: 'views/query/chart-views/Tabular.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/Tabularsettings.html',
                tooltip: "A visualization to plot analyse the data on the gographical map"
            }

        ]
    };
	
	$scope.changeTip = function(tip)
	{
		$scope.tooltip = tip;
	}
    $scope.commonData.filters = [];
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
            //fill the filters array
            $scope.commonData.filters.push($scope.sourceData.fAttArr[i]);
        }
    } else {

    }
    var executeQryData = {
        executeMeasures: [],
        executeColumns: [],
        executeFilters: [],
        executeForecastFilters: [],
        executeTargetField: [],
        executeActualField: [],
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
            isTogglePanelFilter: false,
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
                this.hideVisualizationType();
                this.hideDataStructure();
                this.hideChartSettings();
                switch (event) {
                    case '1':
                        //event measures
                        privateFun.checkToggleOpen('2');
                        privateFun.checkToggleOpen('3');
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
                        privateFun.checkToggleOpen('3');
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
                        privateFun.checkToggleOpen('3');
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
                    case '4':
                        //event filters
                        privateFun.checkToggleOpen('1');
                        privateFun.checkToggleOpen('2');
                        if (this.isTogglePanelFilter) {
                            $("#togglePanelFilter").hide(200);
                            this.isTogglePanelFilter = false;
                        } else {
                            if (this.openSettingToggle[1].isQueryBuilder) {
                                this.hideDesignQuery();
                            }
                            $("#togglePanelFilter").show(300);
                            this.isTogglePanelFilter = true;
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
                    eval("$scope." + $scope.selectedChart.chartType + ".selectCondition()");
                }
            },
            // Select a target field for metric widget
            onClickTargetField: function(row, field) {
                $("#togglePanelColumns").hide(200);
                $scope.isPendingRequest = true;
                $scope.eventHndler.isToggleColumns = false;
                // validation -  allow only one target field
                if ( executeQryData.executeTargetField.length == 1 ) {
                    privateFun.fireMessage('0', 'Only one target value can be selected.');
                    $scope.isPendingRequest = false;
                    return;
                }
                var obj = {
                    filedName: field.filedName,
                    condition: row.name
                };
                executeQryData.executeTargetField.push(obj);
                eval("$scope." + $scope.selectedChart.chartType + ".selectTargetCondition(row, field)");
            },
            // Select an actual field for metric widget
            onClickActualField: function(row, field) {
                $("#togglePanel").hide(200);
                $scope.isPendingRequest = true;
                $scope.eventHndler.isToggleColumns = false;
                // validation -  allow only one target field
                if ( executeQryData.executeActualField.length == 1 ) {
                    privateFun.fireMessage('0', 'Only one actual value can be selected.');
                    $scope.isPendingRequest = false;
                    return;
                }
                var obj = {
                    filedName: field.filedName,
                    condition: row.name
                };
                executeQryData.executeActualField.push(obj);
                eval("$scope." + $scope.selectedChart.chartType + ".selectActualCondition(row, field)");
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
                    if (seriesArr.length > 0 || $scope.chartType == "pie" || $scope.chartType == "hierarchy" || $scope.chartType == "sunburst" ) {
                        eval("$scope." + $scope.selectedChart.chartType + ".selectAttribute(column.filedName)");
                    } else {
                        //alert("First select atleast one measure");
                        privateFun.fireMessage('0', 'Select atleast one measure or select appropriate chart type..');
                        $scope.isPendingRequest = false;
                    }
                }
            },
            onClickRmvCondition: function(condition, measure) {
                $scope.isPendingRequest = false;
            },
            onClickFilter: function(filter, type) {
                var duplicateRecord = false;
                if (!duplicateRecord) {
                    if (filter.dataType == 'datetime' || filter.dataType == 'DATE' || filter.dataType == 'TIMESTAMP') {
                        type = 'date-' + type;
                    }
                    if ($scope.selectedChart.chartType == 'forecast') {
                        angular.forEach(executeQryData.executeForecastFilters, function(field) {
                            if (field.filter.name == filter.name) {
                                if (field.type == type) {
                                    privateFun.fireMessage('0', 'Duplicate record found in object');
                                } else {
                                    field.type = type;
                                }
                                duplicateRecord = true;
                            }
                        });
                    } else {
                        angular.forEach(executeQryData.executeFilters, function(field) {
                            if (field.filter.name == filter.name) {
                                if (field.type == type) {
                                    privateFun.fireMessage('0', 'Duplicate record found in object');
                                } else {
                                    field.type = type;
                                }
                                duplicateRecord = true;
                            }
                        });
                    }

                }
                if (duplicateRecord) {
                    return;
                }

                if ($scope.selectedChart.chartType == 'forecast') {
                    executeQryData.executeForecastFilters.push({
                        filter: {
                            name: filter.name,
                            id: filter.id
                        },
                        type: type
                    });
                } else {
                    executeQryData.executeFilters.push({
                        filter: {
                            name: filter.name,
                            id: filter.id
                        },
                        type: type
                    });
                }
            },
            removeFilter: function(filter) {
                if ($scope.selectedChart.chartType == 'forecast') {
                    executeQryData.executeForecastFilters.splice(executeQryData.executeForecastFilters.indexOf(filter), 1);
                } else {
                    executeQryData.executeFilters.splice(executeQryData.executeFilters.indexOf(filter), 1);
                }
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
                this.hideDesignQuery();
                privateFun.checkToggleOpen('1');
                privateFun.checkToggleOpen('2');
                privateFun.checkToggleOpen('3');
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
                        if ($scope.selectedChart.chartType == "metric") {
                            $timeout(function () {
                                $scope.$broadcast('rzSliderForceRender');
                            },500);
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
                    case '6':
                        $scope.dataToBeBind.receivedQuery = "";
                        $scope.executeQryData.executeMeasures = [];
                        $scope.executeQryData.executeColumns = [];
                        $scope.executeQryData.executeFilters = [];
                        if ( $scope.selectedChart.chartType !== undefined ) {
                            if ( $scope.selectedChart.chartType == 'highCharts') {
                                $scope.highchartsNG = $scope.initHighchartObj;
                            } else if ( $scope.selectedChart.chartType == 'boxplot' || $scope.selectedChart.chartType == 'histogram' || $scope.selectedChart.chartType == 'bubble' || $scope.selectedChart.chartType == 'forecast') {
                                $scope.widget.widgetData.highchartsNG = $scope.initHighchartObj;
                            } else if ( $scope.selectedChart.chartType == 'metric' ) {
                                $scope.dataToBeBind.receivedQuery = "";
                                $scope.resetSettings();
                            } else if ( $scope.selectedChart.chartType == 'd3sunburst' || $scope.selectedChart.chartType == 'd3hierarchy' ) {
                                $scope.hierarData.data = "";
                                $("#" + $scope.hierarData.id).html("");
                            }
                        }
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
                    case 'Tabular':
                        chartTypeTrue = false;
                        break;
                    case 'sunburst':
                        this.hideVisualizationType();
                        chartTypeTrue = false;
                        break;
                    case 'hierarchy':
                        this.hideVisualizationType();
                        chartTypeTrue = false;
                        break;
                    case 'pie':
                        chartTypeTrue = false;
                        break;
                    case 'metric':
                        chartTypeTrue = false;
                        break;
                    case 'GeoMap':
                        chartTypeTrue = false;
                        break;
                }
                // CHART VALIDATIONS
                if ($scope.chartType == "forecast") {
                    if ($scope.sourceData.fAttArr.length == 1 && $scope.sourceData.fMeaArr.length == 1) {
                        if (!($scope.sourceData.fAttArr[0].dataType == "TIMESTAMP" || $scope.sourceData.fAttArr[0].dataType == "datetime" || $scope.sourceData.fAttArr[0].dataType == "DATE")) {
                            privateFun.fireMessage('0', "Select an attribute of type date to generate " + $scope.chartType + " chart");
                            return;
                        }
                    } else {
                        privateFun.fireMessage('0', "Select only one attribute of type 'date' and one measure to generate " + $scope.chartType + " chart");
                        return;
                    }
                }

                if ($scope.chartType == "histogram") {
                    var meaArr = $scope.sourceData.fMeaArr;
                    var dataTypeFlag = true;
                    $scope.widget.widgetData.highchartsNG = {};
                    meaArr.forEach(function(k) {
                        if (k.dataType == "TIMESTAMP" || k.dataType == "datetime") {
                            dataTypeFlag = false;
                        }
                    });
                    if (!(dataTypeFlag && $scope.sourceData.fAttArr.length == 0 && meaArr.length == 1)) {
                        privateFun.fireMessage('0', 'Please select only one numeric field to create histogram');
                        return;
                    }
                }

                // Allow 3 measures and 1 attribute for bubble chart
                if ($scope.chartType == "bubble") {
                    if (!($scope.commonData.measures.length == 3 && $scope.commonData.columns.length == 1)) {
                        privateFun.fireMessage('0', 'Please select only one attribute and three measures to generate bubble chart!');
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
        if (($scope.executeQryData.executeColumns.length <= 1)) {
            widget.widgetData.widData.drilled = false;
        }else{
            $scope.dataToBeBind.receivedQuery = $scope.drillDownQuery;
            widget.widgetData.widData.drilled = true;
        }
        if (widget.widgetData.widName !== undefined && widget.widgetData.widName != "") {
            widget.widgetName = widget.widgetData.widName;
        }
        widget.widgetData["commonSrc"] = {
            src: $scope.sourceData,
            mea: $scope.executeQryData.executeMeasures,
            att: $scope.executeQryData.executeColumns,
            query: $scope.dataToBeBind.receivedQuery,
            target: $scope.executeQryData.executeTargetField,
            actual: $scope.executeQryData.executeActualField
        };
        if ($scope.selectedChart.chartType == 'forecast') {
            widget.widgetData.commonSrc["filter"] = $scope.executeQryData.executeForecastFilters;
        } else {
            widget.widgetData.commonSrc["filter"] = $scope.executeQryData.executeFilters;
        }
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
                query: $scope.dataToBeBind.receivedQuery,
                target: $scope.executeQryData.executeTargetField,
                actual: $scope.executeQryData.executeActualField
            };
            if ($scope.selectedChart.chartType == 'forecast') {
                 $scope.widget.widgetData.commonSrc["filter"] = $scope.executeQryData.executeForecastFilters;
            } else {
                 $scope.widget.widgetData.commonSrc["filter"] = $scope.executeQryData.executeFilters;
            }
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
            if (typeof $scope.highchartsNG === 'undefined') {
                $scope.highchartsNG = $scope.initHighchartObj;
                $scope.highchartsNG.options.chart.type = $scope.selectedChart.chart;
                $scope.highchartsNG.title.text = '';
            } else {
                $scope.highchartsNG.options.chart.type = $scope.selectedChart.chart;
                $scope.highchartsNG.title.text = '';

            }

        },
        selectCondition: function() {
            if ($scope.executeQryData.executeColumns.length <= 1) {
                // If there is one category - no drill down
                $scope.getAggregation();
            } else {
                // If there is more than one category - drill down present
                $scope.getDrilledAggregation();
            }
        },
        selectAttribute: function(fieldName) {
            if ($scope.executeQryData.executeColumns.length == 0) {
                $scope.executeQryData.executeColumns = [{
                    filedName: fieldName
                }];
                $scope.getGroupedAggregation(fieldName);
            } else if ($scope.executeQryData.executeColumns.length >= 1) {
                $scope.isDrilled = true;
                $scope.executeQryData.executeColumns.push({
                    filedName: fieldName
                });
                $scope.getDrilledAggregation();
            }
        },
        executeQuery: function(cat, res, query) {
            if (cat != "") {
                filterService.filterAggData(res, $scope.sourceData.filterFields);
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
                                        this.heightPrev = this.chartHeight;
                                        this.widthPrev = this.chartWidth;
                                        this.setSize(800, 600, false);
                                    },
                                    afterPrint: function() {
                                        this.setTitle({
                                            text: null
                                        })
                                        this.setSize(this.widthPrev, this.heightPrev, true);
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
                                    showInLegend: false,
                                    tooltip: {
                                        pointFormat: '{series.name}: {point.percentage:,.2f}%'
                                    }                                    
                                }
                            }
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
                    $scope.$apply(function() {
                        $scope.highchartsNG.series = {};
                        $scope.xAxiscat = [];
                        $scope.highchartsNG.series = data;
                        $scope.highchartsNG.xAxis = {};
                        $scope.highchartsNG.xAxis.categories = [];
                        $scope.highchartsNG.series.forEach(function(key) {
                            key['turboThreshold'] = 0;
                            key['cropThreshold'] = key.data.length;
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
                });
            } else {
                $scope.$apply(function() {
                    $scope.setMeasureData(res[0]);
                    $scope.dataToBeBind.receivedQuery = query;
                })
            }
        },
        removeMea: function(l) {          
            // if ($scope.isDrilled) $scope.getDrilledAggregation();
            // else $scope.getAggregation();
            if ($scope.executeQryData.executeColumns.length <= 1) {
                // If there is one category - no drill down
                $scope.getAggregation();
            } else {
                // If there is more than one category - drill down present
                $scope.getDrilledAggregation();
           
            }
        },
        removeCat: function() {
            // if ($scope.isDrilled) $scope.getDrilledAggregation();
            // else $scope.getAggregation();
            if ($scope.executeQryData.executeColumns.length <= 1) {
                // If there is one category - no drill down
                $scope.getAggregation();
            } else {
                // If there is more than one category - drill down present
                $scope.getDrilledAggregation();
            }
        },
        onGetAggData: function(res) {
            $scope.isPendingRequest = false;
            $scope.setMeasureData(res);
        },
        onGetGrpAggData: function() {
            $scope.isPendingRequest = false;
        },
        saveWidget: function(widget) {
            if ($scope.selectedChart.name == "pyramid" || $scope.selectedChart.name == "funnel") {
                $scope.highchartsNG.options.exporting.sourceHeight = 1200;
                $scope.highchartsNG.options.exporting.sourceWidth = 2048;
            } else {
                $scope.highchartsNG.options.exporting.sourceHeight = 400;
                $scope.highchartsNG.options.exporting.sourceWidth = 600;
            }
            widget.widgetData.highchartsNG = $scope.highchartsNG;
            widget.widgetData.widData['drilled'] = $scope.isDrilled;
            if ($scope.isDrilled) widget.widgetData.widData['drillConf'] = $scope.drillDownConfig;
            widget.widgetName = "highcharts";
            widget.widgetData.widView = "views/common-data-src/res-views/ViewCommonSrc.html";
            widget.widgetData.initCtrl = "elasticInit";
            $scope.saveChart(widget);
        }
    };
    $scope.map = {

        onInit: function(recon) {
            if (!recon) $scope.highchartsNG = $scope.selectedChart.initObj;
            $scope.highchartsNG = $scope.widget.widgetData.highchartsNG;
            $scope.highchartsNG.size = {
                width: 800,
                height: 660
            };
            $scope.chartType = 'Geographical Map';

        },

        changeType: function() {
            if ($scope.chartType == "Geographical Map") {

                $scope.otherChartConfig = angular.copy($scope.highchartsNG);

                if ($scope.executeQryData.executeMeasures.length < 1 || $scope.executeQryData.executeColumns < 1) {
                    privateFun.fireMessage('0', "Cannot generate " + $scope.chartType + "without minimum one category and series");
                    $scope.MapConfigObj = $scope.initMapConfigObj;
                    return;


                } else {


                    $scope.highchartsNG.options = {
                        legend: {
                            enabled: true
                        },

                        plotOptions: {
                            map: {
                                mapData: Highcharts.maps['custom/world'],
                                joinBy: 'name',
                            }
                        },

                        chart: {
                            // Edit chart spacing
                            spacingBottom: 15,
                            spacingTop: 30,
                            spacingLeft: 10,
                            spacingRight: 10,

                        },
                        colorAxis: {
                            min: $scope.mapconfig.min,
                            minColor: $scope.mapconfig.minColor,
                            maxColor: $scope.mapconfig.maxColor

                        }
                    };
                    $scope.highchartsNG.chartType = 'map';
                    $scope.highchartsNG.size = {
                        width: 800,
                        height: 660
                    };

                }
                var d = $scope.highchartsNG.series[0].data;
                if ($scope.mapconfig.mapType == 'World') {
                    {
                        if ($scope.mapconfig.mapType.drilled) {
                            maplibrary = Highcharts.maps['custom/world-continents'];
                        } else {
                            maplibrary = Highcharts.maps['custom/world'];

                        }
                    }

                }
                if ($scope.mapconfig.mapType == 'Country') {
                    if ($scope.mapconfig.selectedCountry != null) {
                        var lib = "countries/" + $scope.mapconfig.selectedCountry.toLowerCase() + "/" + $scope.mapconfig.selectedCountry.toLowerCase() + "-all";
                        maplibrary = Highcharts.maps[lib];


                    }


                }
                d.forEach(function(e) {
                    e["name"] = e.name;
                    e.value = e.y;

                });

                delete $scope.highchartsNG.series[0].turboThreshold;
                delete $scope.highchartsNG.xAxis;
                delete $scope.highchartsNG.yAxis;
                delete $scope.highchartsNG.legend;
                $scope.highchartsNG.options.plotOptions.map.mapData = maplibrary;


            }
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
            } else if ($scope.executeQryData.executeColumns.length >= 1) {
                $scope.executeQryData.executeColumns.push({
                    filedName: fieldName
                });
                $scope.getDrilledAggregation();
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
            widget.widgetName = "highcharts";
            widget.widgetData.highchartsNG["size"] = {
                width: 313,
                height: 260
            };
            widget.widgetData.initCtrl = "elasticInit";
            widget.widgetData.highchartsNG = $scope.highchartsNG;
            widget.widgetData.widView = "views/common-data-src/res-views/ViewMap.html";


            $scope.saveChart(widget);
        }
    };

    $scope.$watch("mapconfig", function(newValue, oldValue) {
        if (newValue !== oldValue) {

            if (newValue.mapType == 'World') {
                {
                    if (newValue.drilled) {
                        $scop.maplibrary = Highcharts.maps['custom/world-continents'];
                    } else {
                        mapDataNew = Highcharts.maps['custom/world'];

                    }
                }

            }
            if (newValue.mapType == 'Country') {
                var lib = "countries/" + $scope.mapconfig.selectedCountry.toLowerCase() + "/" + $scope.mapconfig.selectedCountry.toLowerCase() + "-all";
                mapDataNew = Highcharts.maps[lib];

            }
            $scope.highchartsNG.options.plotOptions.map.mapData = mapDataNew;
            $scope.highchartsNG.options.chart = {
                // Edit chart spacing
                spacingBottom: 15,
                spacingTop: 30,
                spacingLeft: 10,
                spacingRight: 10,

            };
            $scope.highchartsNG.series[0].dataLabels = {
                enabled: true,
                format: '{point.name}'
            };
            $scope.highchartsNG.size = {
                width: 800,
                height: 660
            };

            delete $scope.highchartsNG.series[0].turboThreshold;
            $scope.highchartsNG.options.colorAxis.minColor = newValue.minColor;
            $scope.highchartsNG.options.colorAxis.maxColor = newValue.maxColor;
            $scope.highchartsNG.options.colorAxis.min = newValue.min;

        }
    }, true);


    $scope.forecast = {
        onInit: function(recon) {
            $scope.highchartsNG = $scope.initHighchartObj;
          
            $scope.prevChartSize = angular.copy($scope.highchartsNG.size);
            if ($scope.widget.widgetData.foreCastObj !== undefined) {
                $scope.forecastObj.paramObj = $scope.widget.widgetData.foreCastObj;
                $scope.maxDate = moment(new Date($scope.widget.widgetData.maxDate)).format('LL');
                $scope.minDate = moment(new Date($scope.widget.widgetData.minDate)).format('LL');

                $scope.visualDate.startdate = $scope.widget.widgetData.Vstart;
                $scope.visualDate.enddate = $scope.widget.widgetData.Vend;
                $scope.useFiltering.status = $scope.widget.widgetData.isVisual;
                $scope.VisualDatesOk = $scope.widget.widgetData.VisualDatesOk;
                $scope.useAlpahaBetaGamma.status = $scope.widget.widgetData.useAlpahaBetaGamma;
            }
            delete $scope.highchartsNG.size;
        },
        changeType: function() {
            var mergedArr = $scope.sourceData.fMeaArr.concat($scope.sourceData.fAttArr);
            mergedArr.forEach(function(k) {
                if (k.dataType == "TIMESTAMP" || k.dataType == "datetime" || k.dataType == "DATE") {
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
            
        },
        saveWidget: function(widget) {
            widget.widgetData.highchartsNG = $scope.widget.widgetData.highchartsNG;
            widget.widgetData.widView = "views/query/chart-views/forecast.html";
            widget.widgetData.foreCastObj = $scope.forecastObj.paramObj;
            widget.widgetData.maxDate = $scope.maxDate;
            widget.widgetData.minDate = $scope.minDate;
            widget.widgetData.Vstart = $scope.visualDate.startdate;
            widget.widgetData.Vend = $scope.visualDate.enddate;
            widget.widgetData.isVisual = $scope.useFiltering.status;
            widget.widgetData.VisualDatesOk = $scope.VisualDatesOk;
            widget.widgetData.useAlpahaBetaGamma = $scope.useAlpahaBetaGamma.status;

            

            widget.widgetData.initCtrl = "elasticInit";
            widget.widgetName = "forecast";
            $scope.saveChart(widget);
        }
    };





    $scope.$watch("forecastObj.paramObj", function(newValue, oldValue) {

        if (newValue !== oldValue && ((new Date(newValue.enddate) > new Date(newValue.startdate)) || (newValue.enddate == $scope.widget.widgetData.foreCastObjDate && newValue.startdate == $scope.widget.widgetData.foreCastObjDate) || newValue.showActual != oldValue.showActual)) {
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


                var isstartdateOki = false;
                var isenddateoki = false;

                var startdate = new Date(newValue.startdate).getTime();
                var enddate = new Date(newValue.enddate).getTime();

                var minStart = new Date($scope.minDate).getTime();
                var maxend = new Date($scope.maxDate).getTime();

                if (minStart <= startdate && startdate < maxend)
                    isstartdateOki = true;

                if (minStart < enddate && enddate <= maxend)
                    isenddateoki = true;


                // this will check wether there is a chnage that should actually generate the chart again 
                if (isstartdateOki && isenddateoki) {
                    $scope.generateDesable = false;
                } else if (!isstartdateOki) {
                    $scope.generateDesable = true;
                    privateFun.fireMessage('0', 'Calculation Start date should within ' + $scope.minDate + ' and ' + $scope.maxDate + '');
                    // $scope.forecastObj.paramObj.enddate =  moment(new Date($scope.maxDate)).format('LL');
                    // $scope.forecastObj.paramObj.startdate = moment(new Date($scope.minDate)).format('LL');
                } else if (!isenddateoki) {
                    $scope.generateDesable = true;
                    privateFun.fireMessage('0', 'Calculation End date should within ' + $scope.minDate + ' and ' + $scope.maxDate + '');
                    // $scope.forecastObj.paramObj.enddate =  moment(new Date($scope.maxDate)).format('LL');
                    // $scope.forecastObj.paramObj.startdate = moment(new Date($scope.minDate)).format('LL');
                }


            }
        } else if (newValue !== oldValue && !(new Date(newValue.enddate) > new Date(newValue.startdate))) {
            privateFun.fireMessage('0', 'Invalid start date and end date');
            $scope.generateDesable = true;
            // $scope.forecastObj.paramObj.enddate =  moment(new Date($scope.maxDate)).format('LL');
            // $scope.forecastObj.paramObj.startdate = moment(new Date($scope.minDate)).format('LL');
        }

    }, true);


    $scope.getForcastPeriod = function(newValue) {

        var CalcEnddate;
        var forecastDays;


        var date1 = new Date($scope.forecastObj.paramObj.enddate).getMonth() + 1 + "/" + new Date($scope.forecastObj.paramObj.enddate).getDate() + "/" + new Date($scope.forecastObj.paramObj.enddate).getFullYear();
        var date2 = new Date($scope.visualDate.enddate).getMonth() + 1 + "/" + new Date($scope.visualDate.enddate).getDate() + "/" + new Date($scope.visualDate.enddate).getFullYear();

        var CalcEnddate = new Date(date1);
        var visualEnddate = new Date(date2);

        var diff = new Date(visualEnddate - CalcEnddate);

        var years = (diff.getFullYear() - 1970);
        var months = (diff.getMonth()) + (12 * years);

        var timeDiff = Math.abs(visualEnddate.getTime() - CalcEnddate.getTime());
        var days = Math.ceil(timeDiff / (1000 * 3600 * 24));


        if ($scope.forecastObj.paramObj.interval == "Yearly") {
            forecastDays = years + 1;
        } else if ($scope.forecastObj.paramObj.interval == "Monthly") {
            forecastDays = months + 1;
        } else if ($scope.forecastObj.paramObj.interval == "Daily") {
            forecastDays = days;
        }

        return forecastDays;

    }


    $scope.monthDiff = function(d1, d2) {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth() + 1;
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    $scope.ForcastBtnFun = function() {
        if ($scope.useFiltering.status == true) {
            if ($scope.VisualDatesOk == false) {
                privateFun.fireMessage('0', 'Invalid visualization start date and end date');
            } else {

                $scope.generateForecastWithFiltering($scope.forecastObj.paramObj);
            }
        } else {
            $scope.generateForecast($scope.forecastObj.paramObj);
        }
    }

    $scope.generateForecastWithFiltering = function(fobj) {

        var forecast_days = $scope.getForcastPeriod();
        $scope.forecastObj.paramObj.fcast_days = forecast_days;

        $scope.widget.widgetData.highchartsNG = {};
        $scope.widget.widgetData.highchartsNG = {
            title: {
                text: ''
            }
        };
        $scope.eventHndler.isLoadingChart = true;

        if(typeof $scope.widget.widgetData.namespace == "undefined"){
            var authdata=JSON.parse(decodeURIComponent(getCookie('authData')));        
            var namespace = authdata.Email.replace('@', '_');
            var namespace = authdata.Email.replace(/[@.]/g, '_');

            $scope.widget.widgetData.namespace = namespace;
        }

        $scope.client.getForcast($scope.forecastObj.paramObj,$scope.widget.widgetData,"",$scope.sourceData.id, function(data, status, fObj) {

            if (status) {
                var forcastArr = [];
                var serArr = [];
                var catArr = [];

                $scope.maxDate = moment(new Date(data.act_max_date)).format('LL');
                $scope.minDate = moment(new Date(data.act_min_date)).format('LL');

                // $scope.forecastObj.paramObj.enddate =  moment(new Date(data.max_date)).format('LL');
                // $scope.forecastObj.paramObj.startdate = moment(new Date(data.min_date)).format('LL');


                if (data.warning != null)
                    privateFun.fireMessage('0', data.warning);


                if (data.len_season != $scope.forecastObj.paramObj.len_season) {

                    $scope.forecastObj.paramObj.len_season = data.len_season;
                }

                // set alpha,beeta, gamma values returned from the service
                if(data.alpha != ""){
                    $scope.forecastObj.paramObj.alpha = data.alpha.toFixed(3);
                    $scope.forecastObj.paramObj.a = data.alpha.toFixed(3);
                } 
                
                if(data.beta != ""){
                    $scope.forecastObj.paramObj.beta = data.beta.toFixed(3);
                    $scope.forecastObj.paramObj.b = data.beta.toFixed(3);
                }
                
                if(data.gamma != ""){
                    $scope.forecastObj.paramObj.gamma = data.gamma.toFixed(3);
                    $scope.forecastObj.paramObj.g = data.gamma.toFixed(3); 
                }

                if (fObj.forecastAtt == "") {

                    if (fObj.showActual == false) {
                        var a = data.data.forecast.length - fObj.fcast_days;
                        for (var i = a; i < data.data.forecast.length; i++) {
                            forcastArr.push(data.data.forecast[i]);
                        }
                        data.data.forecast = forcastArr;
                        serArr.push({
                            data: data.data.actual.concat(data.data.forecast),
                            zoneAxis: 'x',
                            zones: [{
                                value: data.data.actual.length - 1
                            }, {
                                dashStyle: 'dash'
                            }]
                        })
                    } else {
                        serArr.push({
                            name: 'Actual',
                            data: data.data.actual,
                        })

                        serArr.push({
                            name: 'Forcasted',
                            data: data.data.forecast,
                            dashStyle: 'dash'
                        })
                    }

                    catArr = data.data.time;
                } else {
                    if (fObj.showActual == false) {
                        Object.keys(data.data).forEach(function(key) {

                            forcastArr = [];

                            var obj = data.data[key];
                            var a = obj.forecast.length - fObj.fcast_days;

                            for (var i = a; i < obj.forecast.length; i++) {
                                forcastArr.push(obj.forecast[i]);
                            }
                            obj.forecast = forcastArr;
                            serArr.push({
                                name: key,
                                data: obj.actual.concat(obj.forecast),
                                zoneAxis: 'x',
                                zones: [{
                                    value: obj.actual.length - 1
                                }, {
                                    dashStyle: 'dash'
                                }]
                            })

                            catArr = obj.time;
                        });

                    } else {
                        Object.keys(data.data).forEach(function(key) {

                            var obj = data.data[key];


                            serArr.push({
                                name: 'Actual  ' + key,
                                data: obj.actual,
                            })

                            serArr.push({
                                name: 'Forcasted  ' + key,
                                data: obj.forecast,
                                dashStyle: 'dash'
                            })

                            catArr = obj.time;
                        });
                    }
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
                                    this.heightPrev = this.chartHeight;
                                    this.widthPrev = this.chartWidth;
                                    this.setSize(800, 600, false);
                                },
                                afterPrint: function() {
                                    this.setTitle({
                                        text: null
                                    })
                                    this.setSize(this.widthPrev, this.heightPrev, true);
                                }
                            }
                        },
                        credits: {
                            enabled: false
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
                            useHTML: true
                        }
                    },
                    xAxis: {
                        type: 'datetime',
                        categories: catArr
                    },
                    yAxis: {
                        lineWidth: 1
                    },
                    title: {
                        text: ''
                    },
                    series: serArr
                };

                $scope.eventHndler.isLoadingChart = false;

                if (typeof $scope.widget.widgetData.highchartsNG.series != "undefined") {
                    $scope.widget.widgetData.highchartsNG.series.forEach(function(key) {
                        if (key.data.length > 1000) key['turboThreshold'] = key.data.length;
                    });
                }

                $scope.temptArr = $scope.widget.widgetData.highchartsNG;

                // var categories = catArr;
                // var series = serArr;


                // ---------------------------------------------------------------------------------    
                var startdate = formattedDate($scope.visualDate.startdate, $scope.forecastObj.paramObj.interval);
                var enddate = formattedDate($scope.visualDate.enddate, $scope.forecastObj.paramObj.interval);
                var xAxisLen = $scope.temptArr.xAxis.categories.length;

                var startInd = -1;
                var endInd = -1;
                var cat = [];
                var data = [];
                for (var i = 0; i < xAxisLen; i++) {

                    var date;
                    if ($scope.forecastObj.paramObj.interval == "Yearly") {
                        date = $scope.temptArr.xAxis.categories[i] + "-01-01";
                    } else if ($scope.forecastObj.paramObj.interval == "Monthly") {
                        date = $scope.temptArr.xAxis.categories[i] + "-01";
                    } else if ($scope.forecastObj.paramObj.interval == "Daily") {
                        date = $scope.temptArr.xAxis.categories[i];
                    }


                    var x = new Date(startdate);
                    var y = new Date(date);
                    var z = new Date(enddate);
                    if (x <= y && y <= z) {
                        if (startInd == -1) {
                            startInd = i;
                        }

                        cat.push($scope.temptArr.xAxis.categories[i]);

                        if (i == xAxisLen - 1)
                            endInd = i;

                    } else if (startInd > -1) {
                        if (endInd == -1) {
                            endInd = i;
                        }
                    }
                }


                var seriesLen = $scope.temptArr.series.length;


                for (var i = 0; i < seriesLen; i++) {
                    data = [];
                    var endIndex = startInd + cat.length;
                    for (var j = startInd; j < endIndex; j++) {
                        data.push($scope.temptArr.series[i].data[j]);
                    }

                    if (data.length > 0) {
                        $scope.widget.widgetData.highchartsNG.series[i].data = data;
                        if (fObj.showActual != true) {

                            $scope.widget.widgetData.highchartsNG.series[i].zones[0].value = cat.length - fObj.fcast_days - 1;
                        } else {
                            if (i % 2 == 0) {
                                var tempArr = [];
                                for (var indtemp = 0; indtemp <= cat.length - fObj.fcast_days; indtemp++) {
                                    tempArr.push($scope.widget.widgetData.highchartsNG.series[i].data[indtemp]);
                                }

                                $scope.widget.widgetData.highchartsNG.series[i].data = tempArr;
                            }
                        }
                    }
                }

                if (cat.length > 0) {
                    $scope.widget.widgetData.highchartsNG.xAxis.categories = cat;
                }



                // --------------------------------------------------------------------------------------


            } else {
                privateFun.fireMessage('0', data);
                $scope.eventHndler.isLoadingChart = false;
            }
        });



    }

    $scope.getAllDays = function(startdate, enddate) {
        var s = new Date(startdate);
        var e = new Date(enddate);
        var a = [];

        while (s < e) {
            a.push($scope.getFormattedDate(s));
            s = new Date(s.setDate(
                s.getDate() + 1
            ))
        }

        return a;
    };

    $scope.getFormattedDate = function(date) {
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return year + '-' + month + '-' + day;
    }

    $scope.useFiltering = {
        status: false,
    }
    $scope.VisualDatesOk = false;
    $scope.useAlpahaBetaGamma={
        status: false,
    }

    $scope.setAlpahaBetaGamma = function(){
        if(!$scope.useAlpahaBetaGamma.status){

            $scope.forecastObj.paramObj.alpha = "";
            $scope.forecastObj.paramObj.a = "";

            $scope.forecastObj.paramObj.beta = "";
            $scope.forecastObj.paramObj.b = "";

            $scope.forecastObj.paramObj.gamma = "";
            $scope.forecastObj.paramObj.g = "";
        };
    }

    $scope.$watch("visualDate", function(newValue, oldValue) {

        if (newValue !== oldValue) {
            var calcStartdate = new Date($scope.forecastObj.paramObj.startdate);
            var CalcEnddate = new Date($scope.forecastObj.paramObj.enddate);


            var visualSdate = new Date(newValue.startdate).getTime();
            var visualEndDate = new Date(newValue.enddate).getTime();
            calcStartdate = calcStartdate.getTime();
            CalcEnddate = CalcEnddate.getTime();

            var isVisualStartdateOK = false;
            var isVisualEndOk = false;
            if (visualSdate < visualEndDate) {

                if (calcStartdate <= visualSdate && visualSdate <= CalcEnddate) {
                    isVisualStartdateOK = true;
                }

                if (CalcEnddate <= visualEndDate) {
                    isVisualEndOk = true;
                }

                if (isVisualStartdateOK && isVisualEndOk) {
                    // $scope.useFiltering = true;
                    $scope.VisualDatesOk = true;
                    $scope.generateDesable = false;
                } else if (!isVisualEndOk) {
                    privateFun.fireMessage('0', 'Visualization End date should  greater than ' + $scope.maxDate + '');
                    $scope.generateDesable = true;
                    // $scope.visualDate.startdate=  moment(new Date()).format('LL');
                    // $scope.visualDate.enddate=  moment(new Date()).format('LL');
                } else if (!isVisualStartdateOK) {
                    privateFun.fireMessage('0', 'Visualization Start date should within ' + $scope.minDate + ' and ' + $scope.maxDate + '');
                    $scope.generateDesable = true;
                    // $scope.visualDate.startdate=  moment(new Date()).format('LL');
                    // $scope.visualDate.enddate=  moment(new Date()).format('LL');
                }

            } else {
                privateFun.fireMessage('0', 'Invalid visualization start date and end date');
                $scope.generateDesable = true;
                // $scope.visualDate.startdate=  moment(new Date()).format('LL');
                // $scope.visualDate.enddate=  moment(new Date()).format('LL');
            }

        }

    }, true);

    function formattedDate(date, format) {

        var date;
        if (format == "Monthly") {
            var d = new Date(date || Date.now()),
                month = '' + (d.getMonth() + 1),
                day = '01',
                year = d.getFullYear();

            if (month.length < 2) month = month;
            if (day.length < 2) day = day;

            date = [year, month, day].join('-');

        } else if (format == "Yearly") {
            var d = new Date(date || Date.now()),
                month = '01',
                day = '01',
                year = d.getFullYear();

            date = [year, month, day].join('-');

        } else if (format == "Daily") {
            var d = new Date(date || Date.now()),
                month = '' + (d.getMonth() + 1),
                day = d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = "0" + month;
            if (day.length < 2) day = "0" + day;

            date = [year, month, day].join('-');
        }
        return date;
    }
    $scope.setDefLenSeason = function(interval) {
        if (interval == "Yearly") {
            $scope.forecastObj.paramObj.len_season = 1;
            $scope.forecastObj.paramObj.fcast_days = 1;
            $scope.forecastObj.paramObj.model = 'double exponential smoothing';
        } else if (interval == "Daily") {
            $scope.forecastObj.paramObj.len_season = 7;
            $scope.forecastObj.paramObj.fcast_days = 7;
        } else if (interval == "Monthly") {
            $scope.forecastObj.paramObj.len_season = 12;
            $scope.forecastObj.paramObj.fcast_days = 12;
        }
    }



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






    $scope.maxDate = "";
    $scope.minDate = "";


    $scope.generateForecast = function(fObj) {


        if ($scope.forecastObj.paramObj.interval == "Yearly") {
            $scope.forecastObj.paramObj.fcast_days = 1;
        } else if ($scope.forecastObj.paramObj.interval == "Daily") {
            $scope.forecastObj.paramObj.fcast_days = 7;
        } else if ($scope.forecastObj.paramObj.interval == "Monthly") {
            $scope.forecastObj.paramObj.fcast_days = 12;
        }



        $scope.widget.widgetData.highchartsNG = {};
        $scope.widget.widgetData.highchartsNG = {
            title: {
                text: ''
            },
            credits: {
                enabled: false
            }
        };
        $scope.eventHndler.isLoadingChart = true;

        if(typeof $scope.widget.widgetData.namespace == "undefined"){
            var authdata=JSON.parse(decodeURIComponent(getCookie('authData')));        
            var namespace = authdata.Email.replace('@', '_');
            var namespace = authdata.Email.replace(/[@.]/g, '_');

            $scope.widget.widgetData.namespace = namespace;
        }
        

        $scope.client.getForcast(fObj,$scope.widget.widgetData,"",$scope.sourceData.id, function(data, status, fObj) {
            if (status) {
                var forcastArr = [];
                var serArr = [];
                var catArr = [];



                $scope.maxDate = moment(new Date(data.act_max_date)).format('LL');
                $scope.minDate = moment(new Date(data.act_min_date)).format('LL');


                $scope.forecastObj.paramObj.enddate = moment(new Date(data.max_date)).format('LL');
                $scope.forecastObj.paramObj.startdate = moment(new Date(data.min_date)).format('LL');

                 // set alpha,beeta, gamma values returned from the service
                if(data.alpha != ""){
                    $scope.forecastObj.paramObj.alpha = data.alpha.toFixed(3);
                    $scope.forecastObj.paramObj.a = data.alpha.toFixed(3);
                } 
                
                if(data.beta != ""){
                    $scope.forecastObj.paramObj.beta = data.beta.toFixed(3);
                    $scope.forecastObj.paramObj.b = data.beta.toFixed(3);
                }
                
                if(data.gamma != ""){
                    $scope.forecastObj.paramObj.gamma = data.gamma.toFixed(3);
                    $scope.forecastObj.paramObj.g = data.gamma.toFixed(3); 
                }


                // to check wether service has returned any warnings
                if (data.warning != null)
                    privateFun.fireMessage('0', data.warning);

                //if the service has return a diferent len_season set it
                if (data.len_season != $scope.forecastObj.paramObj.len_season) {
                    $scope.forecastObj.paramObj.len_season = data.len_season;
                }

                if (fObj.forecastAtt == "") {

                    if (fObj.showActual == false) {
                        var a = data.data.forecast.length - fObj.fcast_days;
                        for (var i = a; i < data.data.forecast.length; i++) {
                            forcastArr.push(data.data.forecast[i]);
                        }
                        data.data.forecast = forcastArr;
                        serArr.push({
                            data: data.data.actual.concat(data.data.forecast),
                            zoneAxis: 'x',
                            zones: [{
                                value: data.data.actual.length - 1
                            }, {
                                dashStyle: 'dash'
                            }]
                        })
                    } else {
                        serArr.push({
                            name: 'Actual',
                            data: data.data.actual,
                        })

                        serArr.push({
                            name: 'Forcasted',
                            data: data.data.forecast,
                            dashStyle: 'dash',
                        })
                    }

                    catArr = data.data.time;
                } else {
                    if (fObj.showActual == false) {
                        Object.keys(data.data).forEach(function(key) {

                            forcastArr = [];

                            var obj = data.data[key];
                            var a = obj.forecast.length - fObj.fcast_days;

                            for (var i = a; i < obj.forecast.length; i++) {
                                forcastArr.push(obj.forecast[i]);
                            }
                            obj.forecast = forcastArr;
                            serArr.push({
                                name: key,
                                data: obj.actual.concat(obj.forecast),
                                zoneAxis: 'x',
                                zones: [{
                                    value: obj.actual.length - 1
                                }, {
                                    dashStyle: 'dash'
                                }]
                            })

                            catArr = obj.time;
                        });

                    } else {
                        Object.keys(data.data).forEach(function(key) {

                            var obj = data.data[key];


                            serArr.push({
                                name: 'Actual  ' + key,
                                data: obj.actual,
                            })

                            serArr.push({
                                name: 'Forcasted  ' + key,
                                data: obj.forecast,
                                dashStyle: 'dash'
                            })

                            catArr = obj.time;
                        });
                    }
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
                                    this.heightPrev = this.chartHeight;
                                    this.widthPrev = this.chartWidth;
                                    this.setSize(800, 600, false);
                                },
                                afterPrint: function() {
                                    this.setTitle({
                                        text: null
                                    })
                                    this.setSize(this.widthPrev, this.heightPrev, true);
                                }
                            }
                        },
                        credits: {
                            enabled: false
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
                            pointFormat: '<b> <span style = "color : {series.color}" >  </span> {series.name}: {point.y:,.0f} </b>',
                            useHTML: true
                        }
                    },
                    xAxis: {
                        type: 'datetime',
                        categories: catArr
                    },
                    yAxis: {
                        lineWidth: 1
                    },
                    title: {
                        text: ''
                    },
                    series: serArr
                };

                if (typeof $scope.widget.widgetData.highchartsNG.series != "undefined") {
                    $scope.widget.widgetData.highchartsNG.series.forEach(function(key) {
                        if (key.data.length > 1000) key['turboThreshold'] = key.data.length;
                    });
                }

                $scope.eventHndler.isLoadingChart = false;

            } else {
                privateFun.fireMessage('0', data);
                $scope.eventHndler.isLoadingChart = false;
            }
        });
    };

    // --- tabular widget ------------------------------------

    $scope.Tabular = {
        onInit: function(recon) {
            alert('onInit');
        },
        changeType: function() {
             $scope.generateTabular();
        },
        saveWidget: function(widget) {
            alert('saveWidget');
            
        }
    };

    $scope.allingArr=[];
    $scope.tabularConfig = {

        totForNumeric : true,
        defSortFeild : "",
        AscOrDec : "Ascending",
        AllingArr: $scope.allingArr,
        numOfRows:10,

    };

   

    $scope.start = 0;
    $scope.sort ='';
    $scope.limit = 10;
    $scope.query = "";
    $scope.userList=[];
  

    for(var i=0;i<1000;i++){
        var user = null;
        user = {
            id:i,
            profit:Math.floor(Math.random()*20+20),
            order_priority:Math.floor(Math.random()*20+20),
            sales:Math.floor(Math.random()*20+20),
        }

        $scope.userList.push(user);
    }


    $scope.changeSort = function(name){
        //$scope.cc.deselect();
        if($scope.sort==name.Attribute){
          $scope.sort='-'+name.Attribute;
        }else if($scope.sort=='-'+name.Attribute){
          $scope.sort='';
        }else{
          $scope.sort=name.Attribute;
        }
    };


     $scope.generateTabular = function(){

            var colObj = {
                "Attribute":'profit',
                "DislayName": 'profit',
                "Alignment": 'right'
            }; 

            var colObj1 = {
                "Attribute":'order_priority',
                "DislayName": 'order_priority',
                "Alignment": 'left'
            }; 

            var colObj2 = {
                "Attribute":'sales',
                "Dislay name": 'sales',
                "Alignment": 'right'
            };


            $scope.allingArr.push(colObj);
            $scope.allingArr.push(colObj1);
            $scope.allingArr.push(colObj2);
     };


     //-------------------------------------------------------------





    $scope.boxplot = {
        onInit: function(recon) {},
        changeType: function() {
            var meaArr = $scope.sourceData.fMeaArr;
            var dataTypeFlag = true;
            $scope.eventHndler.isLoadingChart = true;
            $scope.tooltip = "";
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
                //get highest level
                var database = $scope.sourceData.src;
                var tbl = $scope.sourceData.tbl;
                var id = $scope.sourceData.id;
                if (database == "MSSQL") {
                    for (var i = 0; i < $scope.commonData.measures.length; i++) {
                        fieldArray.push("'[" + $scope.commonData.measures[i].filedName + "]'");
                    }
                    for (var i = 0; i < $scope.commonData.columns.length; i++) {
                        fieldArray.push("'[" + $scope.commonData.columns[i].filedName + "]'");
                    }
                } else {
                    for (var i = 0; i < $scope.commonData.measures.length; i++) {
                        fieldArray.push("'" + $scope.commonData.measures[i].filedName + "'");
                    }
                    for (var i = 0; i < $scope.commonData.columns.length; i++) {
                        fieldArray.push("'" + $scope.commonData.columns[i].filedName + "'");
                    }
                }
                var fieldstr = fieldArray.toString();
                if (database == "BigQuery") {
                    var query = $diginurls.diginengine + "generateboxplot?q=[{'[" + $diginurls.getNamespace() + "." + tbl + "]':[" + fieldstr + "]}]&dbtype=" + database + "&datasource_config_id=&datasource_id=" + id;
                } else if (database == "MSSQL") {
                    var db = tbl.split(".");
                    var query = $diginurls.diginengine + "generateboxplot?q=[{'" + db[0] + '.' + db[1] + "':[" + fieldstr + "]}]&dbtype=" + database + "&datasource_id=&datasource_config_id=" + id;
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
                                            this.heightPrev = this.chartHeight;
                                            this.widthPrev = this.chartWidth;
                                            this.setSize(800, 600, false);
                                        },
                                        afterPrint: function() {
                                            this.setTitle({
                                                text: null
                                            })
                                            this.setSize(this.widthPrev, this.heightPrev, true);
                                        }
                                    }
                                },
                                tooltip: {
                                    formatter: function() {
                                        if(this.series.name == 'Observations') {
                                            var c = this.point.category;
                                            var min = this.point.low;
                                            var max = this.point.high;
                                            $.each(this.series.chart.series[1].data,function(i,d) {
                                              //do something
                                              if(c == d.category){
                                                if(d.y < min){
                                                  min = d.y;
                                                }
                                                if(d.y > max){
                                                    max = d.y;
                                                }
                                              }
                                            })
                                            var s = '<b>' +  this.point.category + '</b> <br>' + 
                                                    "maximum: " + max + '<br>' +
                                                    "Upper Quartile: " + this.point.q1 + '<br>' +
                                                    "Median: " + this.point.median + '<br>' +
                                                    "Lower Quartile: " + this.point.q3 + '<br>' +
                                                    " minimum: " + min;
                                            return s;
                                        } else {
                                            var s =  '<b>' +  this.point.category + '</b> <br>' + 
                                                    "Outlier </br> Observation: " + this.point.y;
                                            return s;
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
                                name: 'Observations',
                                data: $scope.observationsData
                            }, {
                                name: 'Outlier',
                                color: Highcharts.getOptions().colors[0],
                                type: 'scatter',
                                data: $scope.dataOutliers,
                                marker: {
                                    fillColor: 'white',
                                    lineWidth: 1,
                                    lineColor: Highcharts.getOptions().colors[0]
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
            var id = $scope.sourceData.id;
            if (database == "BigQuery") {
                var query = $diginurls.diginengine + "generatebubble?&table=[" + $diginurls.getNamespace() + "." + tbl + "]&&x=" + x + "&&y=" + y + "&&c=" + c + "&&s=" + s + "&dbtype=" + database + "&datasource_config_id=&datasource_id=" + id;
            } else if (database == "postgresql") {
                var query = $diginurls.diginengine + "generatebubble?&table=" + tbl + "&&x=" + x + "&&y=" + y + "&&c=" + c + "&&s=" + s + "&dbtype=" + database;
            } else {
                var db = tbl.split(".");
                var query = $diginurls.diginengine + "generatebubble?&table=[" + db[0] + "].["+db[1]+"]&&x=[" + x + "]&&y=[" + y + "]&&c=[" + c + "]&&s=[" + s + "]&dbtype=" + database + "&datasource_id=&datasource_config_id=" + id;
            }
            //get highest level
            $scope.client.generateBubble(query, function(data, status) {
                var hObj = {};
                $scope.axisforbubble = [];
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
                                        this.heightPrev = this.chartHeight;
                                        this.widthPrev = this.chartWidth;
                                        this.setSize(800, 600, false);
                                    },
                                    afterPrint: function() {
                                        this.setTitle({
                                            text: null
                                        })
                                        this.setSize(this.widthPrev, this.heightPrev, true);
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
                } else {
                    $scope.isPendingRequest = false;
                    $scope.eventHndler.isLoadingChart = false;
                    privateFun.fireMessage('0', 'request failed');
                }
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
            $scope.eventHndler.isLoadingChart = true;
            $scope.histogramPlot = []
            var fieldArray = [];
            var database = $scope.sourceData.src;
            var tbl = $scope.sourceData.tbl;
            var id = $scope.sourceData.id;

            if (database == "MSSQL") {
                for (var i = 0; i < $scope.commonData.measures.length; i++) {
                    fieldArray.push("'[" + $scope.commonData.measures[i].filedName + "]'");
                }
                for (var i = 0; i < $scope.commonData.columns.length; i++) {
                    fieldArray.push("'[" + $scope.commonData.columns[i].filedName + "]'");
                }
            } else {
                for (var i = 0; i < $scope.commonData.measures.length; i++) {
                    fieldArray.push("'" + $scope.commonData.measures[i].filedName + "'");
                }
                for (var i = 0; i < $scope.commonData.columns.length; i++) {
                    fieldArray.push("'" + $scope.commonData.columns[i].filedName + "'");
                }                
            }

            if (database == "BigQuery") {
                var query = $diginurls.diginengine + "generatehist?q=[{'[" + $diginurls.getNamespace() + "." + tbl + "]':[" + fieldArray.toString() + "]}]&bins=&dbtype=" + database + "&datasource_config_id=&datasource_id=" + id;
            } else if (database == "MSSQL") {
                var db = tbl.split(".");                              
                var query = $diginurls.diginengine + "generatehist?q=[{'[" + db[0] + "].["+db[1]+"]':[" + fieldArray.toString() + "]}]&bins=&dbtype=" + database + "&datasource_id=&datasource_config_id=" + id;
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
                                        this.heightPrev = this.chartHeight;
                                        this.widthPrev = this.chartWidth;
                                        this.setSize(800, 600, false);
                                    },
                                    afterPrint: function() {
                                        this.setTitle({
                                            text: null
                                        })
                                        this.setSize(this.widthPrev, this.heightPrev, true);
                                    }
                                }
                            },
                            credits: {
                                enabled: false
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
                } else {
                    $scope.isPendingRequest = false;
                    $scope.eventHndler.isLoadingChart = false;
                    privateFun.fireMessage('0', 'request failed');
                }
            });
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

    $scope.changeHierarchyDecimal = function() 
    {
        if ( $scope.hierarData !== undefined) {
            if ( $scope.hierarData.data.length != 0 ) {
                var tempData = {
                    data: $scope.hierarData.data,
                    attribute: $scope.hierarData.attribute,
                    id: $scope.hierarData.id,
                    dec: $scope.selectedChart.initObj.dec
                }
                $scope.hierarData = tempData;
            }
        }
    };

    $scope.generateHierarchy = function() {
        //Validations to generate hierarchy chart
        if ($scope.executeQryData.executeMeasures.length == 0 ) {
            privateFun.fireMessage('0','Please Select an aggregate measure to generate hierarchy chart ');
            return;
        } else if ( $scope.executeQryData.executeMeasures.length > 1 ) {
            privateFun.fireMessage('0','Please Select only one aggregate measure to generate hierarchy chart ');
            return;
        } else if ( $scope.executeQryData.executeColumns.length == 0 ) {
            privateFun.fireMessage('0','Please Select a category to generate hierarchy chart ');
            return;
        }
        $scope.eventHndler.isLoadingChart = true;
        $scope.isPendingRequest = true;
        var fieldArray = [];
        for (var i = 0; i < $scope.executeQryData.executeColumns.length; i++) {
            fieldArray.push("'" + $scope.executeQryData.executeColumns[i].filedName + "'");
        }

        //get highest level
        $scope.client.getHighestLevel($scope.sourceData.tbl, fieldArray.toString(), $scope.sourceData.id, function(data, status) {
            var hObj = {};
            var id;
            if (status) {
                data.forEach(function(entry) {
                    if ($scope.sourceData.src == "MSSQL")
                        hObj[ '[' + entry.value + ']'] = entry.level;
                    else
                        hObj[entry.value] = entry.level;
                });
                var tbl = $scope.sourceData.tbl;
                var id = $scope.sourceData.id;
                var measure = $scope.executeQryData.executeMeasures[0].filedName;
                var aggData = $scope.executeQryData.executeMeasures[0].condition;
                $scope.client.getHierarchicalSummary(hObj,measure,aggData,tbl,id, function(data, status) {
                    $scope.TochartData = angular.copy(data);
                    if (status) {
                        if ($scope.selectedChart.chartType == "d3hierarchy"){
                            id = "tempH" + Math.floor(Math.random() * (100 - 10 + 1) + 10).toString()
                        } else if ($scope.selectedChart.chartType == "d3sunburst"){
                            id = "tempSB" + Math.floor(Math.random() * (100 - 10 + 1) + 10).toString()
                        }
                        var res = {
                            data: data,
                            attribute: measure,
                            id: id,
                            dec: $scope.selectedChart.initObj.dec
                        };
                        $scope.hierarData = res;
                        $scope.isPendingRequest = false;
                        $scope.eventHndler.isLoadingChart = false;
                    } else {
                        $scope.isPendingRequest = false;
                        $scope.eventHndler.isLoadingChart = false;
                    }
                });
            } else {
                $scope.isPendingRequest = false;
                $scope.eventHndler.isLoadingChart = false;
            }
        });
    };

    $scope.d3hierarchy = {
        onInit: function(recon) {
            $scope.hierarData = $scope.widget.widgetData.widData;
            $scope.TochartData = $scope.widget.widgetData.TochartData;
        },
        selectCondition: function() {
            $scope.isPendingRequest = false;
            if($scope.executeQryData.executeMeasures.length>1) {
                privateFun.fireMessage('0','Please Select only one aggregate measure to generate chart ');
                return;
            }
            if($scope.executeQryData.executeColumns.length >= 1) {
                $scope.generateHierarchy();
            }
        },
        selectAttribute : function(fieldName) {
            $scope.isPendingRequest = false;
            if ($scope.executeQryData.executeColumns.length == 0) {
                $scope.executeQryData.executeColumns = [{
                    filedName: fieldName
                }];
            } else if ($scope.executeQryData.executeColumns.length >= 1) {
                $scope.executeQryData.executeColumns.push({
                    filedName: fieldName
                });
            }
            if($scope.executeQryData.executeMeasures.length == 1) {
                $scope.generateHierarchy();
            }
        },
        removeMea: function(l) {
            $scope.isPendingRequest = false;
            if($scope.executeQryData.executeMeasures.length<1) {
                privateFun.fireMessage('0','Please Select atleast one aggregate measure to generate chart ');
                return;
            }
            if($scope.executeQryData.executeMeasures.length == 1 && $scope.executeQryData.executeColumns.length >= 1) {
                $scope.generateHierarchy();
            }
        },
        removeCat: function() {
            $scope.isPendingRequest = false;
            if($scope.executeQryData.executeMeasures.length == 1 && $scope.executeQryData.executeColumns.length >= 1) {
                $scope.generateHierarchy();
            } else {
                privateFun.fireMessage('0','Please Select atleast one aggregate measure and category to generate chart ');
                return;
            }
        },
        changeType: function() {
            if($scope.executeQryData.executeMeasures.length == 1 && $scope.executeQryData.executeColumns.length >= 1) {
                $scope.generateHierarchy();
            } else {
                privateFun.fireMessage('0','Please Select only one aggregate measure and one or more categories to generate chart ');
            }
        },
        saveWidget: function(widget) {
            widget.widgetData.widView = "views/ViewHnbData.html";
            widget.widgetData.widData = $scope.hierarData;
            widget.widgetData.TochartData = $scope.TochartData;
            widget.widgetData.widName = $scope.widget.widgetData.widName;
            widget.widgetName = "hierarchy";
            $scope.saveChart(widget);
        }
    };


    $scope.d3sunburst = {
        onInit: function(recon) {
            $scope.hierarData = $scope.widget.widgetData.widData;
            $scope.TochartData = $scope.widget.widgetData.TochartData;
            $scope.$apply;
        },
        selectCondition: function() {
            $scope.isPendingRequest = false;
            if($scope.executeQryData.executeMeasures.length>1) {
                privateFun.fireMessage('0','Please Select only one aggregate measure to generate chart ');
                return;
            }
            if($scope.executeQryData.executeColumns.length >= 1) {
                $scope.generateHierarchy();
            }
        },
        selectAttribute : function(fieldName) {
            $scope.isPendingRequest = false;
            if ($scope.executeQryData.executeColumns.length == 0) {
                $scope.executeQryData.executeColumns = [{
                    filedName: fieldName
                }];
            } else if ($scope.executeQryData.executeColumns.length >= 1) {
                $scope.executeQryData.executeColumns.push({
                    filedName: fieldName
                });
            }
            if($scope.executeQryData.executeMeasures.length == 1) {
                $scope.generateHierarchy();
            }
        },
        removeMea: function(l) {
            $scope.isPendingRequest = false;
            if($scope.executeQryData.executeMeasures.length<1) {
                privateFun.fireMessage('0','Please Select atleast one aggregate measure to generate chart ');
                return;
            }
            if($scope.executeQryData.executeMeasures.length == 1 && $scope.executeQryData.executeColumns.length >= 1) {
                $scope.generateHierarchy();
            }
        },
        removeCat: function() {
            $scope.isPendingRequest = false;
            if($scope.executeQryData.executeMeasures.length == 1 && $scope.executeQryData.executeColumns.length >= 1) {
                $scope.generateHierarchy();
            } else {
                privateFun.fireMessage('0','Please Select atleast one aggregate measure and category to generate chart ');
                return;
            }
        },
        changeType: function() {
            if($scope.executeQryData.executeMeasures.length == 1 && $scope.executeQryData.executeColumns.length >= 1) {
                $scope.generateHierarchy();
            } else {
                privateFun.fireMessage('0','Please Select only one aggregate measure and one or more categories to generate chart ');
            }
        },
        saveWidget: function(widget) {
            widget.widgetData.widView = "views/ViewHnbMonth.html";
            //widget.widgetData = $scope.fieldArray;
            widget.widgetData.widName = $scope.widget.widgetData.widName;
            widget.widgetData.TochartData = $scope.TochartData;
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
                $scope.client.getExecQuery(query, $scope.sourceData.id, function(data, status) {
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
            $scope.prevChartSize = {
                width: 300,
                height: 220
            };
            $scope.selectedChart.initObj = $scope.widget.widgetData.selectedChart.initObj;
        },
        changeType: function() {
            if (typeof $scope.widget !== 'undefined') {
                if (typeof $scope.widget.widgetData.selectedChart !== 'undefined') {
                    $scope.selectedChart.initObj = $scope.widget.widgetData.selectedChart.initObj;                    
                }
            }
            $scope.resetSettings();
            // if ($scope.executeQryData.executeMeasures.length != 0) {
            //     $scope.getAggregation();
            // }
            //$scope.resetSettings();
        },
        selectAttribute: function(fieldName) {
            privateFun.fireMessage('0', 'grouping in metric is not supported');
            $scope.isPendingRequest = false;
        },
        selectTargetCondition: function(row,field) {
            $scope.eventHndler.isLoadingChart = true;
            var nameSpace = row.name + '_' + field.filedName;
            var db = $scope.sourceData.src;
            var query;
            var filterStr = "";
            var fieldArr = [{
                field: field.filedName,
                agg: row.name
            }]
            // apply design mode filters to metric
            var filterArray = [];
            filterArray = filterService.generateDesginFilterParams($scope.sourceData.filterFields,$scope.sourceData.src);
            if (filterArray.length > 0) {
                filterStr = filterArray.join( ' And ');
            }
            $scope.client.getAggData($scope.sourceData.tbl, fieldArr, $scope.limit, $scope.sourceData.id, function(res, status, query) {
                if (status) {
                    $scope.isPendingRequest = false;
                    $scope.eventHndler.isToggleColumns = true;
                    $scope.eventHndler.isLoadingChart = false;
                    $scope.selectedChart.initObj.targetQuery = query;
                    $scope.$apply(function() {
                        $scope.selectedChart.initObj.targetValue = res[0][nameSpace.toLowerCase()];
                        $scope.selectedChart.initObj.targetValueString = convertDecimals(res[0][nameSpace.toLowerCase()],2).toLocaleString();
                    })
                } else {
                    $scope.isPendingRequest = false;
                    $scope.eventHndler.isToggleColumns = true;
                    $scope.eventHndler.isLoadingChart = false;
                    executeQryData.executeTargetField = [];
                }
            },undefined,filterStr);         
        },
        selectActualCondition: function(row,field) {
            $scope.eventHndler.isLoadingChart = true;
            var nameSpace = row.name + '_' + field.filedName;
            var db = $scope.sourceData.src;
            var query;
            var filterStr = "";
            var fieldArr = [{
                field: field.filedName,
                agg: row.name
            }]
            // apply design mode filters to metric
            var filterArray = [];
            filterArray = filterService.generateDesginFilterParams($scope.sourceData.filterFields,$scope.sourceData.src);
            if (filterArray.length > 0) {
                filterStr = filterArray.join( ' And ');
            }
            $scope.client.getAggData($scope.sourceData.tbl, fieldArr, $scope.limit, $scope.sourceData.id, function(res, status, query) {
                if (status) {
                    $scope.isPendingRequest = false;
                    $scope.eventHndler.isToggleColumns = true;
                    $scope.eventHndler.isLoadingChart = false;
                    $scope.dataToBeBind.receivedQuery = query;
                    $scope.metric.onGetAggData(res[0]);
                } else {
                    $scope.isPendingRequest = false;
                    $scope.eventHndler.isToggleColumns = true;
                    $scope.eventHndler.isLoadingChart = false;
                    executeQryData.executeActualField = [];
                }
            },undefined,filterStr);
        },
        executeQuery: function(cat, res, query) {
            for (var c in res[0]) {
                if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                    $scope.selectedChart.initObj.decValue = res[0][c];
                    $scope.selectedChart.initObj.value = convertDecimals(res[0][c], 2).toLocaleString();
                }
            }
            $scope.resetSettings();
            $scope.eventHndler.isLoadingChart = false;
            $scope.dataToBeBind.receivedQuery = query;
        },    
        onGetAggData: function(res) {
            //$scope.resetSettings();
            for (var c in res) {
                $scope.isPendingRequest = false;
                if (Object.prototype.hasOwnProperty.call(res, c)) {
                    $scope.$apply(function() {
                        $scope.selectedChart.initObj.decValue = res[c];
                        var value = convertDecimals(parseFloat(res[c]), parseInt($scope.selectedChart.initObj.dec));
                        $scope.selectedChart.initObj.value = value.toLocaleString();
                    })
                }
            }
            $scope.eventHndler.isLoadingChart = false;
        },
        saveWidget: function(widget) {
            widget.widgetData.widData = {
                decValue: $scope.selectedChart.initObj.decValue,
                dec: $scope.selectedChart.initObj.dec,
                scale: $scope.selectedChart.initObj.scale,
                value: $scope.selectedChart.initObj.value,
                color: $scope.selectedChart.initObj.color,
                scalePosition: $scope.selectedChart.initObj.scalePosition
            };
            widget.widgetData.widName = $scope.widget.widgetData.widName;
            widget.widgetData.widView = "views/common-data-src/res-views/ViewCommonSrcMetric.html";
            widget.widgetName = "metric";
            widget.widgetData.initCtrl = "metricInit";
            $scope.saveChart(widget);
        }
    };
    $scope.getAggregation = function() {
        $scope.eventHndler.isLoadingChart = true;
        if ($scope.highchartsNG === undefined) {
            $scope.highchartsNG = {};
        }
        if (typeof $scope.highchartsNG.init == "undefined" || !$scope.highchartsNG.init) {
            $scope.highchartsNG["init"] = false;
            $scope.highchartsNG = {};
            if ($scope.executeQryData.executeColumns.length == 0 && $scope.executeQryData.executeMeasures.length == 0){
                $scope.dataToBeBind.receivedQuery = "";
                $scope.isPendingRequest = false;
                $scope.eventHndler.isLoadingChart = false;
                $scope.highchartsNG = $scope.initHighchartObj;                
                return;
            }
            if ($scope.chartType != 'Geographical Map') {
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
                                    this.heightPrev = this.chartHeight;
                                    this.widthPrev = this.chartWidth;
                                    this.setSize(800, 600, false);
                                },
                                afterPrint: function() {
                                    this.setTitle({
                                        text: null
                                    })
                                    this.setSize(this.widthPrev, this.heightPrev, true);
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
                                showInLegend: false,
                                tooltip: {
                                    pointFormat: '{series.name}: {point.percentage:,.2f}%'
                                }
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


            } else {
                {
                    $scope.highchartsNG.options = {
                        legend: {
                            enabled: true
                        },
                        plotOptions: {
                            map: {
                                mapData: Highcharts.maps['custom/world'],
                                joinBy: 'name',
                            }
                        },
                        colorAxis: {
                            min: $scope.mapconfig.min,
                            minColor: $scope.mapconfig.minColor,
                            maxColor: $scope.mapconfig.maxColor

                        },
                        title: {
                            text: ''
                        }
                    };
                    $scope.highchartsNG.options.exporting = {

                        chartOptions: {
                            title: {
                                text: $scope.widget.widgetData.widName
                            }

                        },
                        title: {
                            text: ''
                        }
                    };
                    $scope.highchartsNG.chartType = 'map';
                    

                }

            }
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
            // apply design mode filters
            var filterArray = [];
            filterArray = filterService.generateDesginFilterParams($scope.sourceData.filterFields,$scope.sourceData.src);
            if (filterArray.length > 0) {
                var filterStr = filterArray.join( ' And ');
            }
            $scope.client.getAggData($scope.sourceData.tbl, fieldArr, $scope.limit, $scope.sourceData.id, function(res, status, query) {
                if (status) {
                    if ($scope.executeQryData.executeColumns.length == 0 && $scope.executeQryData.executeMeasures.length == 0) {
                        $scope.dataToBeBind.receivedQuery = "";
                        $scope.isPendingRequest = false;
                        $scope.eventHndler.isLoadingChart = false;
                        $scope.highchartsNG = $scope.initHighchartObj;
                        return;
                    }
                    eval("$scope." + $scope.selectedChart.chartType + ".onGetAggData(res[0])");
                    $scope.dataToBeBind.receivedQuery = query;
                    $scope.$apply();
                } else {
                    // alert('request failed');
                    $scope.isPendingRequest = false;
                    $scope.eventHndler.isLoadingChart = false;
                    privateFun.fireMessage('0', 'request failed');
                }
            },undefined,filterStr);
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
        $scope.client.getAggData($scope.sourceData.tbl, fieldArr, $scope.limit, $scope.sourceData.id, function(res, status, query) {
            if (status) {
                // filter only the selected fields from the result returned by the service
                filterService.filterAggData(res, $scope.sourceData.filterFields);
                $scope.mapResult($scope.selectedCat, res, function(data) {

                    $scope.highchartsNG.series = data;
                    if ($scope.chartType != 'Geographical Map') {
                        
                        $scope.highchartsNG.xAxis["title"] = {
                            text: $scope.selectedCat

                        };
                        $scope.highchartsNG.series.forEach(function(key) {
                            key['turboThreshold'] = key.data.length;
                            key['cropThreshold'] = key.data.length;
                        });
                        $scope.eventHndler.isLoadingChart = false;
                        $scope.dataToBeBind.receivedQuery = query;
                        $scope.$apply();
                        eval("$scope." + $scope.selectedChart.chartType + ".onGetGrpAggData()");
                    } else

                    {

                        d = $scope.highchartsNG.series[0].data;
                        if ($scope.mapconfig.mapType == 'Country') {
                            if ($scope.mapconfig.selectedCountry != null) {
                                var lib = "countries/" + $scope.mapconfig.selectedCountry.toLowerCase() + "/" + $scope.mapconfig.selectedCountry.toLowerCase() + "-all";

                                maplibrary = Highcharts.maps[lib];

                            }


                        }
                        else
                        {
                            maplibrary =  Highcharts.maps['custom/world'];

                        }
                        d.forEach(function(e) {
                            e["name"] = e.name;
                            e.value = e.y;

                            delete e.y;
                        });

                        delete $scope.highchartsNG.xAxis;
                        delete $scope.highchartsNG.yAxis;
                        delete $scope.highchartsNG.legend;
                        $scope.highchartsNG.options.plotOptions.map.mapData = maplibrary;
                        $scope.eventHndler.isLoadingChart = false;
                        $scope.$apply();

                    }
                });
            } else {
                //alert('request failed');
                $scope.isPendingRequest = false;
                $scope.eventHndler.isLoadingChart = false;
                privateFun.fireMessage('0', 'request failed');
            }
        }, $scope.selectedCat);
    };

    function getAggData(highestLevel,drillOrderArr,fieldArr) {
        $scope.client.getAggData($scope.sourceData.tbl, fieldArr, $scope.limit, $scope.sourceData.id, function(res, status, query) {

            // filter only the selected fields from the result returned by the service
            filterService.filterAggData(res, $scope.sourceData.filterFields);
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
                        data: serObj[key].data,
                        origName: key
                    });
                }
            }
            $scope.highchartsNG.series.forEach(function(key) {
                key['turboThreshold'] = 0;
                key['cropThreshold'] = key.data.length;
            });
            //assigning the highest level query
            $scope.dataToBeBind.receivedQuery = query;
            $scope.drillDownQuery = query;
            $scope.drillDownConfig = {
                dataSrc: $scope.sourceData.src,
                clientObj: $scope.client,
                srcTbl: $scope.sourceData.tbl,
                drillOrdArr: drillOrderArr,
                highestLvl: highestLevel,
                fields: fieldArr,
                level1Query: query,
                currentLevel: 1
            };
            if ($scope.highchartsNG.xAxis !== undefined){
                $scope.highchartsNG.xAxis["title"] = {
                    text: highestLevel
                };
            }
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
                            selectedSeries = e.point.series.name,
                            origName = "",
                            tempArrStr = "",
                            serName = "";
                            conStr = "";
                            var level;
                            var tempArray = [];
                            var isDate;
                        // var cat = [];
                        for (i = 0; i < drillOrdArr.length; i++) {
                            if (drillOrdArr[i].name == highestLvl) {
                                nextLevel = drillOrdArr[i].nextLevel;
                                drillOrdArr[i].clickedPoint = clickedPoint;
                                level = drillOrdArr[i].level;
                                if (!drillOrdArr[i + 1].nextLevel) isLastLevel = true;
                            }
                        }
                        //get the selected point of each level
                        for(var c = 0; c<level;c++){
                            tempArrStr = "";
                            isDate = false;
                            angular.forEach($scope.sourceData.fAttArr,function(key){
                                if (key.name == drillOrdArr[c].name){
                                    if (key.dataType !== undefined){
                                        if (key.dataType == 'DATE' || key.dataType == 'Date'){
                                            isDate = true;
                                        }
                                    }
                                }
                            });
                            if ($scope.sourceData.src == "MSSQL") {
                                if (typeof drillOrdArr[c].clickedPoint == 'number') {
                                    if (isDate){
                                        tempArrStr = 'Date(['+drillOrdArr[c].name + "]) = " + drillOrdArr[c].clickedPoint;
                                    }else{
                                        tempArrStr = '[' + drillOrdArr[c].name + "] = " + drillOrdArr[c].clickedPoint;
                                    }
                                } else {
                                    if (isDate){
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
                                    if (isDate){
                                        tempArrStr = 'Date('+drillOrdArr[c].name + ") = '" + drillOrdArr[c].clickedPoint + "'";
                                    }else{
                                        tempArrStr = drillOrdArr[c].name + " = '" + drillOrdArr[c].clickedPoint + "'";
                                    }
                                }
                            }
                            tempArray.push(tempArrStr);
                        }
                        if (tempArray.length > 0 ) {
                            conStr = tempArray.join( ' And ');
                        }
                        chart.options.lang.drillUpText = "Back to " + highestLvl;
                        // Show the loading label
                        chart.showLoading("Retrieving data for '" + clickedPoint.toString().toLowerCase() + "' grouped by '" + nextLevel + "'");
                        //aggregate method
                        clientObj.getAggData(srcTbl, fields, 100, $scope.sourceData.id, function(res, status, query) {
                            if (status) {
                                $scope.drillDownConfig["level"+(level+1)+"Query"] = query;
                                // filter only the selected fields from the result returned by the service
                                filterService.filterAggData(res, $scope.sourceData.filterFields);
                                angular.forEach($scope.highchartsNG.series, function(series) {
                                    if (series.name == selectedSeries) {
                                        origName = series.origName;
                                        serName = series.name;
                                    }
                                });
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
                                if (res.length > 0) {
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
                                console.log(JSON.stringify(drillObj));
                                $scope.dataToBeBind.receivedQuery = query;
                                $scope.$apply();
                                chart.addSeriesAsDrilldown(e.point, drillObj);
                            } else {
                                privateFun.fireMessage('0','request failed due to :' + JSON.stringify(res));
                                e.preventDefault();
                            }

                            chart.xAxis[0].setTitle({
                                text: nextLevel
                            });
                            chart.yAxis[0].setTitle({
                                text: selectedSeries
                            });
                            chart.options.customVar = nextLevel;
                            chart.hideLoading();
                        }, nextLevel, conStr);
                    }
                },
                drillup: function(e) {

                    var chart = this;
                    console.log(chart.options.customVar);
                    $scope.drillDownConfig.drillOrdArr.forEach(function(key) {
                        if (key.nextLevel && key.nextLevel == chart.options.customVar) {
                            chart.options.customVar = key.name;
                            chart.xAxis[0].setTitle({
                                text: chart.options.customVar
                            });
                        }
                    });
                    // set x and y axis titles (DUODIGIN-914)
                    var flag = false;
                    $scope.drillDownConfig.drillOrdArr.forEach(function(key) {
                        if (chart.options.customVar == key.nextLevel) {
                            chart.options.lang.drillUpText = " Back to " + key.name;
                            flag = true;
                        }
                    });
                    if (!flag) {
                        chart.yAxis[0].setTitle({
                            text: 'values'
                        });
                    }
                },
                beforePrint: function() {
                    this.setTitle({
                        text: this.options.exporting.chartOptions.title.text
                    })
                    this.heightPrev = this.chartHeight;
                    this.widthPrev = this.chartWidth;
                    if (this.drillUpButton !== undefined) this.drillUpButton = this.drillUpButton.destroy();
                    this.setSize(800, 600, false);
                },
                afterPrint: function() {
                    this.setTitle({
                        text: null
                    })
                    this.setSize(this.widthPrev, this.heightPrev, true);
                    if (this.drilldownLevels.length != 0) this.showDrillUpButton();
                }
            };
            $scope.$apply(function() {
                $scope.isPendingRequest = false;
                $scope.eventHndler.isLoadingChart = false;
            });
        }, highestLevel);
    }

    //<Async drilldown> 
    $scope.getDrilledAggregation = function() {
        var fieldArr = [];
        var catArr = [];
        var drillOrderArr = [];
        $scope.eventHndler.isLoadingChart = true;
        $scope.highchartsNG.series = [];
        if ($scope.executeQryData.executeColumns.length == 0 && $scope.executeQryData.executeMeasures.length == 0) {
            $scope.dataToBeBind.receivedQuery = "";
            $scope.isPendingRequest = false;
            $scope.eventHndler.isLoadingChart = false;
            $scope.highchartsNG = $scope.initHighchartObj;
            return;
        }
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

        if ($scope.isAutoDrill) {
            //if automatic drilling is true, call get highest level
            $scope.client.getHighestLevel($scope.sourceData.tbl, catArr.toString(), $scope.sourceData.id, function(res, status) {
                if ($scope.executeQryData.executeColumns.length == 0 && $scope.executeQryData.executeMeasures.length == 0){
                    $scope.dataToBeBind.receivedQuery = "";
                    $scope.isPendingRequest = false;
                    $scope.eventHndler.isLoadingChart = false;
                    $scope.highchartsNG = $scope.initHighchartObj;
                    return;
                }            
                if (status) {
                    var highestLevel = "";
                    for (i = 0; i < res.length; i++) {
                        if (typeof res[i + 1] != "undefined") {
                            drillOrderArr.push({
                                name: res[i].value,
                                nextLevel: res[i + 1].value,
                                level: res[i].level
                            });
                        } else {
                            drillOrderArr.push({
                                name: res[i].value,
                                level: res[i].level
                            });
                        }
                        if (res[i].level == 1) highestLevel = res[i].value;
                    }
                    $scope.executeQryData.executeColumns = [];
                    for(var i = 0; i < res.length;i++){
                        $scope.executeQryData.executeColumns.push({
                            filedName: res[i].value
                        });
                    }
                    getAggData(highestLevel,drillOrderArr,fieldArr);
                } else {
                    privateFun.fireMessage('0', res);
                    $scope.isPendingRequest = false;
                    $scope.eventHndler.isLoadingChart = false;
                }
            });
        } else {
            for (var i =0; i < $scope.executeQryData.executeColumns.length; i++) {
                if (typeof $scope.executeQryData.executeColumns[i+1] != "undefined") {
                    drillOrderArr.push({
                        name: $scope.executeQryData.executeColumns[i].filedName,
                        nextLevel: $scope.executeQryData.executeColumns[i+1].filedName,
                        level: i+1
                    });
                } else {
                    drillOrderArr.push({
                        name: $scope.executeQryData.executeColumns[i].filedName,
                        level: i+1
                    });
                }
                if ( i+1 == 1 ) highestLevel = $scope.executeQryData.executeColumns[i].filedName;
            }
            getAggData(highestLevel,drillOrderArr,fieldArr);
        }
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
        $scope.client.getHighestLevel($scope.sourceData.tbl, catArr.toString(), $scope.sourceData.id,function(res, status) {
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
                        $scope.client.getAggData($scope.sourceData.tbl, fieldArr, $scope.limit, $scope.sourceData.id, function(res1, status, query) {
                            if (status) {

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
                                    origName: serValKey,
                                    data: serArr
                                });

                                syncAgg(j, res1);

                                function syncAgg(j, res1) {
                                    if (j < res1.length) {
                                        var con = res[i].value + "='" + res1[j][res[i].value] + "'";
                                        var drillSerArr = [];
                                        $scope.client.getAggData($scope.sourceData.tbl, fieldArr, $scope.limit, $scope.sourceData.id, function(res2, status, query) {
                                            if (status) {
                                                var dserNameKey = "";
                                                var dserValKey = "";
                                                for (var key in res2[0]) {
                                                    if (Object.prototype.hasOwnProperty.call(res2[0], key)) {
                                                        typeof res2[0][key] == "string" ? dserNameKey = key : dserValKey = key;
                                                    }
                                                }

                                                for (k = 0; k < res2.length; k++) {
                                                    drillSerArr.push({
                                                        name: res2[k][dserNameKey],
                                                        y: res2[k][dserValKey],
                                                        //drilldown: res2[k][dserNameKey]
                                                    });
                                                }
                                                drillSerMainArr.push({
                                                    name: dserValKey,
                                                    origName: dserValKey,
                                                    id: res1[j][res[i].value],
                                                    data: drillSerArr
                                                });

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
            $scope.client.getExecQuery(query,  $scope.sourceData.id, function(res, status, query) {
                var cat = "";
                var measureArr = [];
                if (status) {
                    $scope.executeQryData.executeColumns = [];
                    for (c in res[0]) {
                        if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                            if (typeof res[0][c] == "string") cat = c;
                            else {
                                var m = c.split('_');
                                if (m[0] !== undefined && m[1] !== undefined) {
                                    measureArr.push({
                                        filedName: m[1],
                                        condition: m[0]
                                    });
                                } else {
                                    //push to attributes, if aggregation is not found
                                    $scope.executeQryData.executeColumns.push({
                                        filedName: m[0]
                                    });
                                }
                            }
                        }
                    }
                    $scope.executeQryData.executeMeasures = measureArr;
                    if (cat !== "" && cat !== undefined) {
                        $scope.executeQryData.executeColumns[0] = {
                            filedName: cat
                        };
                    } else {
                        if ($scope.executeQryData.executeColumns.length != 0) {
                            cat = $scope.executeQryData.executeColumns[0].filedName;
                        }
                    }
                    angular.forEach($scope.executeQryData.executeMeasures, function(val) {
                        $scope.executeQryData.executeColumns.push({
                            filedName: val.filedName
                        });
                    });
                    eval("$scope." + $scope.selectedChart.chartType + ".executeQuery(cat, res, query)");
                } else {
                    //alert('request failed');
                    $scope.$apply(function() {
                        privateFun.fireMessage('0', '<strong>Invalid query :</strong>Try Again!');
                        if ($scope.selectedChart.chartType == 'highCharts') {
                            $scope.highchartsNG.series = {};
                        }
                        $scope.isPendingRequest = false;
                        $scope.eventHndler.isLoadingChart = false;
                    })
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
                    name: key[cat].toString(),
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
    // Remove the target field
    $scope.removeTarget = function(t) {
        $scope.resetSettings();
    };
    // Remove the target field
    $scope.removeActual = function(t) {
        $scope.resetSettings();
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
    //Update the auto drill option when toggled
    $scope.toggleAutoDrilled = function(state) {
        $scope.isAutoDrill = state;
    };
    //metric decimal change
    $scope.changeDecimals = function() {
        $scope.selectedChart.initObj.value = convertDecimals(parseFloat($scope.selectedChart.initObj.decValue), parseInt($scope.selectedChart.initObj.dec)).toLocaleString();
    };
    $scope.recordColor = function(ser) {
        $scope.recordedColors[ser.name] = ser.color;
    };
    $scope.applySettings = function() {
        // Validations
        if ($scope.executeQryData.executeActualField.length < 1) {
            privateFun.fireMessage('0','Please generate metric chart before configuring settings.');
            return;
        }
        if ($scope.selectedChart.initObj.targetValue == "") {
            privateFun.fireMessage('0','Please enter a target value or select a target value field.');
            return;
        }
        if ($scope.selectedChart.initObj.colorTheme == "") {
            privateFun.fireMessage('0','Please select a colour theme.');
            return;
        }
        if ($scope.selectedChart.initObj.targetRange == "") {
            privateFun.fireMessage('0','Please select a colouring type.');
            return;
        }
        chartServices.applyMetricSettings($scope.selectedChart);
    };
    // Reset metric chart settings
    $scope.resetSettings = function() {
        $scope.executeQryData.executeTargetField = [];
        $scope.executeQryData.executeActualField = [];
        $scope.selectedChart.initObj.decValue = "";
        $scope.selectedChart.initObj.value = "";
        $scope.selectedChart.initObj.scale = "";
        $scope.selectedChart.initObj.dec = 2;
        $scope.selectedChart.initObj.color = "white";
        $scope.selectedChart.initObj.targetRange = "";
        $scope.selectedChart.initObj.targetValue = "";
        $scope.selectedChart.initObj.targetQuery = "";
        $scope.selectedChart.initObj.targetValueString = "";
        $scope.selectedChart.initObj.targetField = "";
        $scope.selectedChart.initObj.rangeSliderOptions = {
            minValue: 0,
            maxValue: 100,
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
                translate: function(value) {
                  return value + '%';
                }
            }
        };
        $timeout(function () {
            $scope.$broadcast('rzSliderForceRender');
        },500);        
        $scope.selectedChart.initObj.colorTheme = "";
        $scope.selectedChart.initObj.lowerRange = 0;
        $scope.selectedChart.initObj.higherRange = $scope.selectedChart.initObj.value;
    };
    // convert target value integer to comma seperated value
    $scope.changeTargetValue = function() {
        console.log($scope.selectedChart.initObj.targetValue);
        if ($scope.selectedChart.initObj.targetValue != null) {
            $scope.selectedChart.initObj.targetValueString = $scope.selectedChart.initObj.targetValue.toLocaleString();            
        } else {
            $scope.selectedChart.initObj.targetValue = "";
            $scope.selectedChart.initObj.targetValueString = "";
        }
    };
    //#damith
    //create custom query design catch syntax error
})
