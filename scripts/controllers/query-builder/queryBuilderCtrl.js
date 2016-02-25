/**
 * Created by Damith on 2/12/2016.
 */

routerApp.controller('queryBuilderCtrl', function
        ($scope, $rootScope, $location, $window, $csContainer, $diginengine, $state) {

    $scope.selectedFields = [];        
    $scope.drawPivotSummary = function(datae){
        $scope.selectedFields = datae;
        $scope.products = [];
        product = {};
        for (var i = 0; i <datae.length; i++) {
            var data = datae[i],
            product = {};
            for (var j = 0; j < $scope.fieldArray.length; j++) {
                         var field = $scope.fieldArray[j];
                         product[field] = data[field];
                        }
                       $scope.products.push(product);
                  }
        pivotUi() ;
        
    }

    function pivotUi() {
        var renderers = $.extend($.pivotUtilities.renderers, $.pivotUtilities.gchart_renderers, $.pivotUtilities.d3_renderers);
        $("#grid").pivotUI($scope.products, {
            // renderers: renderers,
            rows: [$scope.selectedFields[0]],
            cols:[$scope.selectedFields[1]],
              
            // rendererName: "Table"         
        });
    }        

    $scope.initQueryBuilder = function(){
        $scope.sourceData = $csContainer.fetchSrcObj();
        $scope.client = $diginengine.getClient($scope.sourceData.src);
    };
    
    $scope.sourceData = $csContainer.fetchSrcObj();
    $scope.client = $diginengine.getClient($scope.sourceData.src);
    $scope.initHighchartObj = {
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
                },
                selectChart: function(chartType, chart){

                    $scope.eventHndler.isHighCharts = false;
                    $scope.eventHndler.isD3Charts = false;
                    $scope.eventHndler.isPivotSummary = false;

                    switch (chartType) {
                        case 'highCharts':

                            $scope.eventHndler.isHighCharts = true;
                            $scope.highchartsNG.options.chart.type = chart;
                            break;
                        case 'd3Charts':

                            $scope.eventHndler.isD3Charts = true;
                            console.log("d3Charts in switch");
                            break;
                        case 'pivotSummary':

                            $scope.eventHndler.isPivotSummary = true;
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
                                $scope.drawPivotSummary(data.Result);

                            });
                            break;
                        default:

                            $scope.eventHndler.isHighcharts = true;
                            break;
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
                    selected: false, chartType: 'highCharts'
                },
                {
                    id: 'ct02', icon: 'ti-bar-chart', name: 'bar ', chart: 'bar',
                    selected: false, chartType: 'highCharts'
                },
                {
                    id: 'ct03', icon: 'fa fa-line-chart', name: 'line ', chart: 'line',
                    selected: false, chartType: 'highCharts'
                },
                {
                    id: 'ct04', icon: ' chart-diginSmooth_line', name: 'Smooth line ', chart: 'smoothline',
                    selected: false, chartType: 'highCharts'
                },
                {
                    id: 'ct05', icon: 'fa fa-area-chart', name: 'area ', chart: 'area',
                    selected: false, chartType: 'highCharts'
                },{
                    id: 'ct06', icon: 'chart-diginsmooth_area', name: 'Smooth area ', chart: 'area',
                    selected: false, chartType: 'highCharts'
                },
                {
                    id: 'ct07', icon: 'chart-diginalluvialt', name: 'alluvial', chart: 'alluvial',
                    selected: false, chartType: 'd3Charts'
                },
                {
                    id: 'ct08', icon: 'chart-diginscatter', name: 'scatter ', chart: 'scatter',
                    selected: false, chartType: 'highCharts'
                },
                {
                    id: 'ct09', icon: 'chart-diginbump', name: 'bumpChart ', chart: 'bump',
                    selected: false, chartType: 'd3Charts'
                },
                {
                    id: 'ct10',
                    icon: 'chart-digincluster-dendrogram',
                    name: 'clusterDendrogram',
                    chart: 'clusterDendrogram',
                    selected: false, 
                    chartType: 'd3Charts'
                },
                {
                    id: 'ct11',
                    icon: 'chart-digincluster',
                    name: 'clusterForce',
                    chart: 'clusterForce',
                    selected: false, 
                    chartType: 'd3Charts'
                }, 
                {
                    id: 'ct12',
                    icon: 'chart-diginconvex-hull',
                    name: 'convexHull',
                    chart: 'convexHull',
                    selected: false, 
                    chartType: 'd3Charts'
                }, 
                {
                    id: 'ct13',
                    icon: 'chart-diginhierarchy-chart',
                    name: 'hierarchy',
                    chart: 'hierarchy',
                    selected: false, 
                    chartType: 'd3Charts'
                }, 
                {
                    id: 'ct14',
                    icon: 'chart-diginsunburst-chart',
                    name: 'sunburst',
                    chart: 'sunburst',
                    selected: false, 
                    chartType: 'd3Charts'
                }, 
                {
                    id: 'ct15',
                    icon: 'chart-digintreeeview',
                    name: 'treeeview',
                    chart: 'treeeview',
                    selected: false, 
                    chartType: 'd3Charts'
                },
                {
                    id: 'ct16',
                    icon: 'ti-layout-accordion-list',
                    name: 'pivotsummary',
                    chart: 'pivotsummary',
                    selected: false, 
                    chartType: 'pivotSummary'
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
                {isStructuret: false}
            ],
            messageAry: ['Please wait five minute data saving..'],
            message: '',
            // isChartSelected: false,
            // isHighcharts: false,
            // isD3Charts: false,
            isPivotSummary: false,
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
                    $scope.getAggregation();
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
                        executeQryData.executeColumns = [{
                            filedName: column.filedName
                        }];
                        $scope.getGroupedAggregation(column.filedName);
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

                console.log("onSelect",onSelect);
                var i;
                var chartInData = data;
                for (i = 0; i < chartInData.length; i++) {
                    chartInData[i].selected = false;
                }
                onSelect.selected = true;
                $scope.executeQryData.chartType = onSelect.chart;
                $scope.chartType = onSelect.chart;
                // $scope.changeChartType(onSelect.chart);
                privateFun.selectChart(onSelect.chartType, onSelect.chart);
                //privateFun.createHighchartsChart(onSelect.chart);
            },
            onSaveChartConfig: function () {


            }
        }//end event function
        
        
        $scope.changeChartType = function(type){
            
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
            
            if($scope.executeQryData.executeColumns.length == 0){
                var meaArr = executeQryData.executeMeasures;
                meaArr.forEach(function(key){
                    $scope.eventHndler.isLoadingChart=true;
                    $scope.client.getAggData($scope.sourceData.tbl, key.condition, key.filedName, function(res, status){
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
                });
                
                
            }else{
                $scope.getGroupedAggregation();
            }
            
            //alert('test');
        };
    
    $scope.getGroupedAggregation = function(row){
        if(row) $scope.selectedCat = row;        
        $scope.highchartsNG.series = [];
        
        var seriesArr = $scope.executeQryData.executeMeasures;
        for(i=0;i<seriesArr.length;i++){
            $scope.eventHndler.isLoadingChart=true;
            $scope.client.getAggData($scope.sourceData.tbl, seriesArr[i].condition, seriesArr[i].filedName, function(res, status){
                var seriesArr = [];
                //get the series name
                var serName = "";
                for (var c in res[0]) {
                    if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                        if(c != $scope.selectedCat) serName = c;
                    }
                }
                res.forEach(function(key){
                    seriesArr.push({
                        name: key[$scope.selectedCat],
                        y: key[serName]
                    });
                });
                $scope.highchartsNG.series.push({
                    name: serName,
                    data: seriesArr
                });
                $scope.eventHndler.isLoadingChart=false;
            },$scope.selectedCat);
        }
    };
    
    $scope.removeMeasure = function(m){
        var arrObj = $scope.executeQryData.executeMeasures;
        var index = arrObj.indexOf(m);
        if (index > -1) {
            arrObj.splice(index, 1);
            if(arrObj.length > 0) $scope.getAggregation();
            else{
                $scope.executeQryData.executeColumns = [];
                $scope.highchartsNG = $scope.initHighchartObj;
            } 
        }
    };
    
    $scope.removeCategory = function(c){
        var arrObj = $scope.executeQryData.executeColumns;
        var index = arrObj.indexOf(c);
        if (index > -1) {
            arrObj.splice(index, 1);
            $scope.getAggregation();
        }
    };
        
        privateFun.createHighchartsChart('');
    
    var queryBuilderData = {
            select: []
        };
        $scope.queryBuilderData = queryBuilderData;

        $scope.dragabbleEvent = {
            onDropCompleteMeasure: function (dragData, dropFiled) {
                // drop only measure Condition
                if (dragData.proBy == 'mc0') {
                    var i;
                    var pushQry = {
                        isFoundSelectQry: false,
                        index: 0
                    };
                    var commonData = $scope.commonData.measures;
                    for (i = 0; i < commonData.length; i++) {
                        if (commonData[i].filedName == dropFiled.filedName) {
                            pushQry.index = i;
                            for (var c = 0; c < commonData[i].selectQry.length; c++) {
                                if (commonData[i].selectQry[c] == dragData.name) {
                                    pushQry.isFoundSelectQry = true;
                                    c = commonData[i].selectQry.length;
                                    i = commonData.length;
                                }
                            }
                        }
                    }
                    //is not found  select qry in current filed
                    //then push in to dropped filed
                    if (!pushQry.isFoundSelectQry) {
                        queryBuilderData.select.push({
                            filed: dropFiled.filedName,
                            condition: dragData.name
                        });
                        executeQryData.executeMeasures.push({
                            filedName: dropFiled.filedName,
                            condition: dragData.name
                        });
                        commonData[pushQry.index].selectQry.push(dragData.name)
                    }
                } else {
                    //invalid dropped field
                    //fire notification
                    // fire error
                    privateFun.fireMessage('0', 'invalid dropped list,Please check again.');
                    return;
                }
            },
            onDropCompleteGroup: function (dragData) {
                if (dragData.proBy == 'c0') {
                    var pushGrp = {
                        isFoundGrp: false,
                        index: 0
                    };
                    var grpObj = executeQryData.GrpFiled;
                    for (i = 0; i < grpObj.length; i++) {
                        if (grpObj[i].filedName == dragData.filedName) {
                            pushGrp.isFoundGrp = true;
                            pushGrp.index = i;
                            i = grpObj.length;
                        }
                    }
                    if (!pushGrp.isFoundGrp) {
                        executeQryData.GrpFiled.push({
                            filedName: dragData.filedName
                        });
                    } else {
                        privateFun.fireMessage('0', 'invalid group found..!');
                    }

                } else {
                    //invalid dropped field
                    // fire error
                    privateFun.fireMessage('0', 'invalid dropped list,Please check again.');
                }
            }
        }
    

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


