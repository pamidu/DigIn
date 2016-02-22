/**
 * Created by Damith on 2/12/2016.
 */

routerApp.controller('queryBuilderCtrl', function
        ($scope, $rootScope, $location, $window, $csContainer, $diginengine, $state) {

    $scope.initQueryBuilder = function(){
        $scope.sourceData = $csContainer.fetchSrcObj();
        $scope.client = $diginengine.getClient($scope.sourceData.src);
    };
    
    $scope.sourceData = $csContainer.fetchSrcObj();
    $scope.client = $diginengine.getClient($scope.sourceData.src);
        

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
                    $scope.highchartsNG = {
                        options: {
                            chart: {
                                type: $scope.chartType == '' ? 'bar' :
                                    $scope.chartType,
                                // Explicitly tell the width and height of a chart
                                width: null,
                                height: 397,
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
                {id: 'c01', name: 'AVG', click: false},
                {id: 'c02', name: 'SUM', click: false},
                {id: 'c03', name: 'COUNT', click: false},
                {id: 'c04', name: 'MIN', click: false},
                {id: 'c05', name: 'MAX', click: false}
            ],
            chartTypes: [
                {
                    id: 'ct01', icon: 'ti-pie-chart', name: 'pie chart', chart: 'pie',
                    selected: false
                },
                {
                    id: 'ct02', icon: 'ti-bar-chart', name: 'bar chart', chart: 'bar',
                    selected: false
                },
                {
                    id: 'ct02', icon: 'fa fa-line-chart', name: 'line chart', chart: 'line',
                    selected: false
                },
                {
                    id: 'ct02', icon: 'fa fa-area-chart', name: 'area chart', chart: 'area',
                    selected: false
                }
            ]

        };
    
   
    
        
        
        //mapping measures array
        if($scope.sourceData.fMeaArr.length > 0){
            for(i=0; i <$scope.sourceData.fMeaArr.length; i++){
                $scope.commonData.measures.push({
                    id : $scope.sourceData.fMeaArr[i].id,
                    filedName : $scope.sourceData.fMeaArr[i].name,
                    click : false
                });
            }
        }
        
    
        //mapping attributes array
        if($scope.sourceData.fAttArr.length > 0){
            for(i=0; i <$scope.sourceData.fAttArr.length; i++){
                $scope.commonData.columns.push({
                    id : $scope.sourceData.fAttArr[i].id,
                    filedName : $scope.sourceData.fAttArr[i].name,
                    click : false
                });
            }
        }
    
     $( ".draggable-measure" ).draggable({ revert: "invalid" });
        $( ".droppable-container" ).droppable({
              activeClass: "ui-state-default",
              hoverClass: "ui-state-hover",
              drop: function( event, ui ) {
//                $( this )
//                  .addClass( "ui-state-highlight" )
//                  .find( "p" )
//                    .html( "Dropped!" );
              }
            });
        
        console.log('source data:'+JSON.stringify());
    
        var executeQryData = {
            executeMeasures: [],
            executeColumns: [],
            chartType: ''
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
                {isStructuret: false}

            ],
            messageAry: [' Please wait five minute data saving..'],
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
                    executeQryData.executeMeasures.push(obj)
                    $scope.getAggregation(obj);
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
                    executeQryData.executeColumns.push({
                        filedName: column.filedName
                    });
                    $scope.getGroupedAggregation(column.filedName);
                }
            },

            onClickRmvCondition: function (condition, measure) {
                alert('record delete function...');
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
                    case '4':
                        //#save
                        //all config save to main dashboard
                        $scope.widget = $scope.sourceData.wid;
                        $scope.widget.highchartsNG = $scope.highchartsNG;
                        $scope.widget.widView = "views/common-data-src/res-views/ViewCommonSrc.html";
                        $rootScope.dashboard.widgets.push($scope.widget);
                        this.isMainLoading = true;
                        this.message = this.messageAry[0];
                        setTimeout(function () {
                            $scope.eventHndler.isMainLoading = false;
                            $state.go('home.Dashboards');
                        }, 5000);
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
                $scope.changeChartType(onSelect.chart);
                //privateFun.createHighchartsChart(onSelect.chart);
            },
            onSaveChartConfig: function () {


            }
        }//end event function
        
        
        $scope.changeChartType = function(type){
            $scope.highchartsNG.options.chart.type = type;
        };
        
        
        $scope.getAggregation = function(aggObj){
            $scope.eventHndler.isLoadingChart=true;
            if($scope.highchartsNG.series.length == 3){
                $scope.highchartsNG = {};
                $scope.highchartsNG = {
                            options: {
                                chart: {
                                    type: $scope.chartType == '' ? 'bar' :
                                        $scope.chartType,
                                    // Explicitly tell the width and height of a chart
                                    width: null,
                                    height: 397,
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
            
            $scope.client.getAggData($scope.sourceData.tbl, aggObj.condition, aggObj.filedName, function(res, status){
                for (var c in res[0]) {
                    if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                        $scope.highchartsNG.series.push({
                            name: c,
                            color: '#EC784B',
                            data: [res[0][c]]
                        })
                    }
                }
                $scope.eventHndler.isLoadingChart=false;
            });
            //alert('test');
        };
    
    $scope.getGroupedAggregation = function(row){
        $scope.eventHndler.isLoadingChart=true;
        $scope.highchartsNG.series = [];
        var seriesArr = $scope.executeQryData.executeMeasures;
        for(i=0;i<seriesArr.length;i++){
            $scope.client.getAggData($scope.sourceData.tbl, seriesArr[i].condition, seriesArr[i].filedName, function(res, status){
                var seriesArr = [];
                //get the series name
                var serName = "";
                for (var c in res[0]) {
                    if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                        if(c != row) serName = c;
                    }
                }
                res.forEach(function(key){
                    seriesArr.push({
                        name: key[row],
                        y: key[serName]
                    });
                });
                $scope.highchartsNG.series.push({
                    name: serName,
                    data: seriesArr
                });
            },row);
        }
        if(i == seriesArr.length)$scope.eventHndler.isLoadingChart=false;
    };
        
        privateFun.createHighchartsChart('');

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


