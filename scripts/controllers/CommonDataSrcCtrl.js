routerApp.controller('commonDataSrcInit', ['$scope', '$mdSidenav', '$log', 'CommonDataSrc', '$mdDialog', '$rootScope', '$http', 'Digin_Engine_API', 'Digin_Engine_API_Namespace', function ($scope, $mdSidenav, $log, CommonDataSrc, $mdDialog, $rootScope, $http, Digin_Engine_API, Digin_Engine_API_Namespace) {

    $scope.fieldArray = [];
    $scope.fieldString = [];
    $scope.dataArray = [];
    $scope.dataString = [];
    $scope.distinct = [];
    $scope.selTable = "";
    $scope.selSrc = "";
    $scope.icon = "bower_components/material-design-icons/navigation/svg/production/ic_chevron_left_18px.svg";

    $scope.datasources = [{
        name: "DuoStore"
    }, {
        name: "BigQuery"
    }, {
        name: "CSV/Excel"
    }, {
        name: "Rest/SOAP Service"
    }, {
        name: "SpreadSheet"
    }, {
        name: "MSSQL"
    }];

    // $scope.toggleRight = buildToggler('right');
    $scope.toggleLeft = buildToggler('custom');

    $scope.isOpenRight = function () {
        return $mdSidenav('right').isOpen();
    };
    $scope.isOpenRight = function () {
        return $mdSidenav('custom').isOpen();
    };

    $scope.onChangeSource = function (src) {
        //get the namespace for the relevant source
        getJSONDataByProperty($http, 'pythonServices', 'name', 'Namespaces', function (data) {
            $scope.srcNamespace = data[0][src.toLowerCase()];
            localStorage.setItem('srcNamespace', $scope.srcNamespace);
            //clear fieldArray
            $scope.fieldArray = [];

            $scope.selSrc = src;
            CommonDataSrc.getTables(src, function (data) {
                $scope.dataTables = data;
            });
        });
    };

    $scope.onChangeTable = function (tbl) {
        //clear fieldArray
        $scope.fieldArray = [];

        $scope.selTable = tbl;
        CommonDataSrc.getFields(tbl, function (data) {
            $scope.tblFields = data;
        });
    };

    function buildToggler(navID) {
        return function () {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
        }
    };

    $scope.toggleCheck = function (field) {
        var i = $scope.fieldArray.indexOf(field);
        if (i > -1) {
            $scope.fieldArray.splice(i, 1);
        } else {
            $scope.fieldArray.push(field);

        }
    };

    $scope.toggleCheck2 = function (data) {
        console.log("toggleCheck2");
        var i = $scope.dataArray.indexOf(data);
        if (i > -1) {
            $scope.dataArray.splice(i, 1);
        } else {
            $scope.dataArray.push(data);
        }
    };

    $scope.configGraph = function (evt) {
        //building the fields string
        $scope.fieldString = [];
        for (i = 0; i < $scope.fieldArray.length; i++) {
            $scope.fieldString.push("'" + $scope.fieldArray[i] + "'");
        }

        $scope.currWidget = {
            widData: {},
            widView: "views/ViewCommonSrc.html",
            dataView: "ViewElasticData",
            dataCtrl: "elasticDataCtrl",
            initTemplate: "InitConfigCommonSrc",
            initCtrl: "commonSrcInit",
            uniqueType: "Common Source",
            syncState: true,
            expanded: true,
            seriesname: "",
            externalDataURL: "",
            dataname: "",
            d3plugin: "",
            divider: false,
            id: "chart" + Math.floor(Math.random() * (100 - 10 + 1) + 10),
            type: "Visualization",
            width: '370px',
            height: '300px',
            mheight: '100%',
            highchartsNG: {
                size: {
                    height: 220,
                    width: 300
                }
            },
            commonSrcConfig: {
                src: $scope.selSrc,
                tbl: $scope.selTable,
                fields: $scope.fieldArray
            },
            widConfig: {
                mappedData: {}
            }
        };
        $rootScope.dashboard.widgets.push($scope.currWidget);

        if ($scope.selSrc == 'DuoStore') {
            $mdDialog.show({
                    controller: 'commonSrcInit',
                    templateUrl: 'views/InitConfigCommonSrc.html',
                    targetEvent: evt,
                    locals: {
                        widId: $scope.currWidget.id,
                        fieldData: {}
                    }
                })
                .then(function () {
                    //$mdDialog.hide();
                }, function () {
                    //$mdDialog.hide();
                });

        } else if ($scope.selSrc != 'DuoStore') {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function (e) {
                console.log(this);
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {

                        var data = JSON.parse(xhr.response);


                        $mdDialog.show({
                                controller: 'commonSrcInit',
                                templateUrl: 'views/InitConfigCommonSrc.html',
                                targetEvent: evt,
                                locals: {
                                    widId: $scope.currWidget.id,
                                    fieldData: data
                                }
                            })
                            .then(function () {
                                //$mdDialog.hide();
                            }, function () {
                                //$mdDialog.hide();
                            });

                    } else {
                        console.error("XHR didn't work: ", xhr.status);
                    }
                }
            }
            xhr.ontimeout = function () {
                console.error("request timedout: ", xhr);
            };

            if ($scope.selSrc == 'BigQuery')
                xhr.open("get", Digin_Engine_API + "gethighestlevel?tablename=[" + $scope.srcNamespace + "." + $scope.selTable + "]&id=1&levels=[" + $scope.fieldString.toString() + "]&plvl=All&db=" + $scope.selSrc, /*async*/ true);

            else
                xhr.open("get", Digin_Engine_API + "gethighestlevel?tablename=" + $scope.selTable + "&id=1&levels=[" + $scope.fieldString.toString() + "]&plvl=All&db=" + $scope.selSrc, /*async*/ true);
            xhr.send();

        }
        ;
    };

    $scope.configGraph2 = function (evt, field) {

        //building the data string
        for (i = 0; i < $scope.dataArray.length; i++) {
            $scope.dataString.push("'" + $scope.dataArray[i] + "'");
        }

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function (e) {
            console.log(this);
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    $scope.currWidget = {
                        widData: {},
                        widView: "views/ViewCommonSrc.html",
                        dataView: "ViewElasticData",
                        dataCtrl: "elasticDataCtrl",
                        initTemplate: "InitConfigCommonSrc",
                        initCtrl: "commonSrcInit",
                        uniqueType: "Common Source",
                        syncState: true,
                        expanded: true,
                        seriesname: "",
                        externalDataURL: "",
                        dataname: "",
                        d3plugin: "",
                        divider: false,
                        id: "chart" + Math.floor(Math.random() * (100 - 10 + 1) + 10),
                        type: "Visualization",
                        width: '370px',
                        height: '300px',
                        mheight: '100%',
                        highchartsNG: {
                            size: {
                                height: 220,
                                width: 300
                            }
                        },
                        commonSrcConfig: {
                            src: $scope.selSrc,
                            tbl: $scope.selTable,
                            fields: $scope.fieldArray,
                            namespace: $scope.srcNamespace
                        },
                        widConfig: {
                            mappedData: {}
                        }
                    };
                    var data = JSON.parse(xhr.response);

                    $rootScope.dashboard.widgets.push($scope.currWidget);
                    $mdDialog.show({
                            controller: 'commonSrcInit',
                            templateUrl: 'views/InitConfigCommonSrc.html',
                            targetEvent: evt,
                            locals: {
                                widId: $scope.currWidget.id,
                                fieldData: data
                            }
                        })
                        .then(function () {
                            //$mdDialog.hide();
                        }, function () {
                            //$mdDialog.hide();
                        });

                } else {
                    console.error("XHR didn't work: ", xhr.status);
                }
            }
        }
        xhr.ontimeout = function () {
            console.error("request timedout: ", xhr);
        }

        xhr.open("get", Digin_Engine_API + "gethighestlevel?tablename=[" + $scope.srcNamespace + "." + $scope.selTable + "]&id=1&levels=[" + $scope.fieldString.toString() + "]&plvl=All", /*async*/ true);

        xhr.send();
    };
}]);


routerApp.controller('commonSrcInit', ['$scope', '$mdDialog', '$rootScope', 'widId', '$state', 'fieldData', 'Digin_Engine_API', 'Digin_Engine_API_Namespace', function ($scope, $mdDialog, $rootScope, widId, $state, fieldData, Digin_Engine_API, Digin_Engine_API_Namespace) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
    $scope.widget = $rootScope.dashboard.widgets[objIndex];
    $scope.arrayAttributes = fieldData;
    $scope.fieldSelection = true;
    $scope.mappedArray = {};
    $scope.seriesArray = [{
        name: 'series1',
        serName: '',
        filter: '',
        type: 'area',
        color: ''
    }];

    $scope.categItem = {};

    $scope.chartCategory = {
        groupField: '',
        drilledField: '',
        drilledArray: []
    };
    $scope.filterAttributes = ['Sum', 'Average', 'Percentage', 'Count'];
    $scope.chartTypes = [{
        name: "Area",
        type: "area"
    }, {
        name: "Smooth area",
        type: "areaspline"
    }, {
        name: "Line",
        type: "line"
    }, {
        name: "Smooth line",
        type: "spline"
    }, {
        name: "Column",
        type: "column"
    }, {
        name: "Bar",
        type: "bar"
    }, {
        name: "Pie",
        type: "pie"
    }, {
        name: "Scatter",
        type: "scatter"
    }];


    /*TEMP*/
    if ($scope.widget.commonSrcConfig.src == "DuoStore") {
        var parameter = "";
        var w = new Worker("scripts/webworkers/elasticWorker.js");
        $scope.mappedArray = {};
        $scope.chartCategory = {
            groupField: '',
            drilledField: '',
            drilledArray: []
        };
        var selFields = $scope.widget.commonSrcConfig.fields;
        var selTbl = $scope.widget.commonSrcConfig.tbl;
        for (i = 0; i < selFields.length; i++) {
            parameter += " " + selFields[i];
        }

        $scope.getFilters = function () {
            for (var key in $scope.mappedArray) {
                if (Object.prototype.hasOwnProperty.call($scope.mappedArray, key)) {
                    if ($scope.mappedArray[key].isNaN) $scope.filtersAvailable = ['Count'];
                    else $scope.filtersAvailable = $scope.filterAttributes;
                }
            }
        };

        function mapRetrieved(event) {
            var obj = JSON.parse(event.data);
            console.log(JSON.stringify(obj));

            //creating the array to map dynamically
            $scope.arrayAttributes = [];
            for (var key in obj[0]) {
                if (Object.prototype.hasOwnProperty.call(obj[0], key)) {
                    var val = obj[0][key];
                    console.log(key);
                    $scope.mappedArray[key] = {
                        name: key,
                        data: [],
                        isNaN: true
                    };
                    $scope.arrayAttributes.push(key);
                }
            }

            //mapping the dynamically created array
            for (i = 0; i < obj.length; i++) {
                for (var key in obj[i]) {
                    if (Object.prototype.hasOwnProperty.call(obj[i], key)) {
                        var val = obj[i][key];
                        var parsedVal = parseFloat(val);
                        if (!isNaN(parsedVal)) {
                            $scope.mappedArray[key].data.push(parsedVal);
                            $scope.mappedArray[key].isNaN = false;
                        } else {
                            $scope.mappedArray[key].data.push(val);
                        }
                        $scope.fieldRetrieved = $scope.mappedArray[key].name;
                    }
                }
            }

            //getting the unique score to determine the hierarchy
            for (var key in $scope.mappedArray) {
                if (Object.prototype.hasOwnProperty.call($scope.mappedArray, key)) {
                    if ($scope.mappedArray[key].isNaN) {
                        $scope.mappedArray[key].unique = Enumerable.From($scope.mappedArray[key].data).Select().Distinct().ToArray().length;
                    }
                }
            }


            $scope.getFilters();
        };

        w.postMessage(selTbl + "," + parameter + "," + false);
        w.addEventListener('message', function (event) {
            mapRetrieved(event);
        });
    }

    $scope.getDrillArray = function () {
        if ($scope.widget.commonSrcConfig.src == "DuoStore") {
            var uniqueScore = eval('$scope.mappedArray.' + $scope.chartCategory.groupField + '.unique');
            console.log('unique score:' + uniqueScore);
            for (var key in $scope.mappedArray) {
                if (Object.prototype.hasOwnProperty.call($scope.mappedArray, key)) {
                    if ($scope.mappedArray[key].unique > uniqueScore && $scope.mappedArray[key].unique != 0)
                        $scope.chartCategory.drilledArray.push($scope.mappedArray[key].name);
                }
            }
        }
    };

    $scope.filterData = function (c) {
        alert('test' + c);
        var filter = eval('new ' + c.toUpperCase() + '();');
        $scope.filtering = new Filtering();
        $scope.filtering.setFilter(filter);
        $scope.seriesAttributes = $scope.filtering.filterFields();
        $scope.widgetValidity = 'fade-out';
    };


    /* Strategy1 begin */
    var Filtering = function () {
        this.filter = "";
    };

    Filtering.prototype = {
        setFilter: function (filter) {
            this.filter = filter;
        },

        calculate: function (orderedObj, catMappedData, serMappedData, drillData) {
            return this.filter.calculate(orderedObj, catMappedData, serMappedData, drillData);
        },

        filterFields: function () {
            return this.filter.filterFields();
        }
    };

    var SUM = function () {
        this.calculate = function (orderedObj, catMappedData, serMappedData, drillData) {
            console.log("calculations... for the sum filter");
            if (typeof drillData == 'undefined') {
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += serMappedData[j];
                }
            } else if (serMappedData == null) {
                for (j = 0; j < orderedObj.length; j++) {
                    catMappedData[orderedObj[j].drill].val += orderedObj[j].val;
                }
                return catMappedData;
            } else {
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += serMappedData[j];
                    orderedObj[catMappedData[j]].arr.push({
                        val: serMappedData[j],
                        drill: drillData[j]
                    });
                }
            }
        }

        this.filterFields = function () {
            return getFilteredFields(false);
        }
    };

    var AVERAGE = function () {
        this.calculate = function (orderedObj, catMappedData, serMappedData, drillData) {
            console.log("calculations... for the average filter");
            if (typeof drillData == 'undefined') {
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += serMappedData[j];
                    orderedObj[catMappedData[j]].count += 1;
                }
                for (attr in orderedObj) {
                    if (Object.prototype.hasOwnProperty.call(orderedObj, attr)) {
                        orderedObj[attr].val = Number((orderedObj[attr].val / orderedObj[attr].count).toFixed(2));
                    }
                }
            } else if (serMappedData == null) {
                for (j = 0; j < orderedObj.length; j++) {
                    catMappedData[orderedObj[j].drill].val += orderedObj[j].val;
                    catMappedData[orderedObj[j].drill].count += 1;
                }
                for (attr in catMappedData) {
                    if (Object.prototype.hasOwnProperty.call(catMappedData, attr)) {
                        catMappedData[attr].val = Number((catMappedData[attr].val / catMappedData[attr].count).toFixed(2));
                    }
                }
                return catMappedData;
            } else {
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += serMappedData[j];
                    orderedObj[catMappedData[j]].arr.push({
                        val: serMappedData[j],
                        drill: drillData[j]
                    });
                }
                for (attr in orderedObj) {
                    if (Object.prototype.hasOwnProperty.call(orderedObj, attr)) {
                        orderedObj[attr].val = Number((orderedObj[attr].val / orderedObj[attr].arr.length).toFixed(2));
                    }
                }
            }
        }

        this.filterFields = function () {
            return getFilteredFields(false);
        }
    };

    var PERCENTAGE = function () {
        this.calculate = function (orderedObj, catMappedData, serMappedData, drillData) {
            console.log("calculations... for the prcentage filter");
            var total;
            if (typeof drillData == 'undefined') {
                total = 0;
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += serMappedData[j];
                    total += serMappedData[j];
                }
                for (attr in orderedObj) {
                    if (Object.prototype.hasOwnProperty.call(orderedObj, attr)) {
                        orderedObj[attr].val = Number(((orderedObj[attr].val / total) * 100).toFixed(2));
                    }
                }
            } else if (serMappedData == null) {
                total = 0;
                for (j = 0; j < orderedObj.length; j++) {
                    catMappedData[orderedObj[j].drill].val += orderedObj[j].val;
                    total += orderedObj[j].val;
                }
                for (attr in catMappedData) {
                    if (Object.prototype.hasOwnProperty.call(catMappedData, attr)) {
                        catMappedData[attr].val = Number(((catMappedData[attr].val / total) * 100).toFixed(2));
                    }
                }
                return catMappedData;
            } else {
                total = 0;
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += serMappedData[j];
                    total += serMappedData[j];
                    orderedObj[catMappedData[j]].arr.push({
                        val: serMappedData[j],
                        drill: drillData[j]
                    });
                }
                for (attr in orderedObj) {
                    if (Object.prototype.hasOwnProperty.call(orderedObj, attr)) {
                        orderedObj[attr].val = Number(((orderedObj[attr].val / total) * 100).toFixed(2));
                    }
                }
            }
        }

        this.filterFields = function () {
            return getFilteredFields(false);
        }
    };

    var COUNT = function () {
        this.calculate = function (orderedObj, catMappedData, serMappedData, drillData) {
            console.log("calculations... for the count filter");
            if (typeof drillData == 'undefined') {
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += 1;
                }
            } else if (serMappedData == null) {
                for (j = 0; j < orderedObj.length; j++) {
                    catMappedData[orderedObj[j].drill].val += 1;
                }
                return catMappedData;
            } else {
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += 1;
                    orderedObj[catMappedData[j]].arr.push({
                        val: serMappedData[j],
                        drill: drillData[j]
                    });
                }
            }
        }

        this.filterFields = function () {
            return getFilteredFields(true);
        }
    };

    //returns the series array according to the filter selected
    function getFilteredFields(isNaN) {
        var objArr = [];
        for (var key in $scope.mappedArray) {
            if (Object.prototype.hasOwnProperty.call($scope.mappedArray, key)) {
                if (!isNaN) !$scope.mappedArray[key].isNaN && objArr.push($scope.mappedArray[key].name);
                else objArr.push($scope.mappedArray[key].name);
            }
        }
        return objArr;
    };


    /* Strategy1 end */


    /*TEMP*/

    //adds new series to the chart
    $scope.addSeries = function () {
        $scope.seriesArray.push({
            name: 'series1',
            serName: '',
            filter: '',
            type: 'area',
            color: '',
            drilled: false
        });
    }


    //removes the clicked series
    $scope.removeSeries = function (ind) {
        $scope.seriesArray.splice(ind, 1);
    };

    //builds the chart
    $scope.buildchart = function (widget) {
        widget.chartSeries = [];
        for (var key in $scope.arrayAttributes) {
            var attr = $scope.arrayAttributes[key].value.trim().
            toString();
            var data = [];
            widget.widConfig.mappedData[attr] = data;
        }

        if ($scope.catItem != '') {
            $scope.widgetValidity = 'fade-out';
            if ($scope.seriesArray[0].serName != '') {
                if ($scope.queryDrilled) {
                    if ($scope.drillItem != '') {
                        $scope.orderByDrilledCat(widget);
                        $state.go('Dashboards');
                        $mdDialog.hide();
                        //$scope.widgetValidity = 'fade-out';
                    } else {
                        //$scope.validationMessage = "Please select the category to drill-down from";
                        //$scope.widgetValidity = 'fade-in';
                    }
                } else {
                    $scope.orderByCat(widget);
                    $state.go('Dashboards');
                    $mdDialog.hide();
                    //$scope.widgetValidity = 'fade-out';
                }
            } else {
                //$scope.validationMessage = "Please select a series";
                //$scope.widgetValidity = 'fade-in';
            }
        } else {
            //$scope.validationMessage = "Please select a category";
            //$scope.widgetValidity = 'fade-in';
        }
    }

    //generate workers parameters
    $scope.generateParamArr = function (httpMethod, host, ns, tbl, method, gBy, agg, aggF, cons, oBy) {
        return {
            webMethod: httpMethod,
            host: host,
            method: method,
            params: [{
                name: 'tablename',
//            value: "[" + tbl + "]"    //fix it for big query
                value: tbl
            }, {
                name: 'group_by',
                value: "{'" + gBy + "':1}"
            }, {
                name: 'agg',
                value: agg.toLowerCase()
            }, {
                name: 'agg_f',
                value: "['" + aggF + "']"
            }, {
                name: 'cons',
                value: cons
            }, {
                name: 'order_by',
                value: oBy
            }, {
                name: 'db',
                value: ns
            }]
        };
    };

//order by category
    $scope.orderByCat = function (widget) {

        widget.highchartsNG = {
            options: {
                drilldown: {
                    drillUpButton: {
                        relativeTo: 'plotBox',
                        position: {
                            y: 0,
                            x: 0
                        },
                        theme: {
                            fill: 'white',
                            'stroke-width': 1,
                            stroke: 'silver',
                            r: 0,
                            states: {
                                hover: {
                                    fill: '#303F9F'
                                },
                                select: {
                                    stroke: '#039',
                                    fill: '#303F9F'
                                }
                            }
                        }

                    },
                    series: [],
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                            }
                        }
                    }
                }
            },
            xAxis: {
                type: 'category'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            title: {
                text: ''
            },
            size: {
                width: 300,
                height: 220
            }
        };


        if ($scope.widget.commonSrcConfig.src == "DuoStore") {
            console.log('$scope.mappedArray.' + $scope.chartCategory.groupField + '.data');
            var cat = Enumerable.From(eval('$scope.mappedArray.' + $scope.chartCategory.groupField + '.data')).Select().Distinct().ToArray();
            var orderedObjArray = [];

            for (i = 0; i < $scope.seriesArray.length; i++) {
                var serMappedData = eval('$scope.mappedArray.' + $scope.seriesArray[i].serName + '.data');
                var catMappedData = eval('$scope.mappedArray.' + $scope.chartCategory.groupField + '.data');

                var orderedArrayObj = {};
                var orderedObj = {};
                var data = [];
                for (k = 0; k < cat.length; k++) {
                    orderedObj[cat[k]] = {
                        val: 0,
                        count: 0
                    };
                }

                if (typeof $scope.filtering == 'undefined') {
                    $scope.filterData($scope.seriesArray[i].filter);
                }
                $scope.filtering.calculate(orderedObj, catMappedData, serMappedData);
                // for(j=0;j<serMappedData.length;j++){
                //     orderedObj[catMappedData[j]] += serMappedData[j];
                // }

                for (var key in orderedObj) {
                    if (Object.prototype.hasOwnProperty.call(orderedObj, key)) {
                        data.push({
                            name: key,
                            y: orderedObj[key].val
                        });
                    }
                }

                orderedArrayObj["data"] = data;
                orderedArrayObj["name"] = $scope.seriesArray[i].name;
                orderedArrayObj["color"] = $scope.seriesArray[i].color;
                orderedArrayObj["type"] = $scope.seriesArray[i].type;
                orderedObjArray.push(orderedArrayObj);
            }

            widget.highchartsNG['series'] = orderedObjArray;


        } else if ($scope.widget.commonSrcConfig.src != "DuoStore") {
            //alert(JSON.stringify($scope.categItem.item));
            $scope.srcNamespace = $scope.widget.commonSrcConfig.namespace;
            $scope.catItem = $scope.categItem.item;
            $scope.seriesArray.forEach(function (entry) {
                if ($scope.widget.commonSrcConfig.src == 'BigQuery')
                    var tblVal = $scope.srcNamespace + '.' + widget.commonSrcConfig.tbl;
                else
                    var tblVal = widget.commonSrcConfig.tbl;
//            alert(tblVal);
                entry['data'] = [];
                //         alert(tblVal);
                var paramArr = $scope.generateParamArr('get', Digin_Engine_API, $scope.widget.
                    commonSrcConfig.src, tblVal, 'aggregatefields', $scope.catItem.value, entry.
                    filter, entry.serName.value);

                var w = new Worker("scripts/webworkers/commonSrcWorker.js");
                w.postMessage(JSON.stringify(paramArr));
                w.addEventListener('message', function (event) {
                    var objArr = [];
                    var evData = JSON.parse(event.data);
                    console.log(JSON.stringify(evData));
                    for (i = 0; i < evData.length; i++) {
                        entry['data'].push({
                            name: evData[i][$scope.catItem.value],
                            y: evData[i]['']
                        });
                    }

                    for (var key in widget.widConfig.mappedData) {
                    }
                    console.log(widget.widConfig.mappedData);
                });
            });

            widget.highchartsNG['series'] = $scope.seriesArray;
        }

    };


//order by category (drilled)
//order by category (drilled)
    $scope.orderByDrilledCat = function (widget) {
        $scope.objArr = [];
        $scope.orderedArrayObj = [];
        var requestCounter = $scope.seriesArray.length; //main request completion counter

        widget.highchartsNG = {
            chart: {
                type: 'column'
            },

            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                    }
                }
            },

            title: {
                text: widget.uniqueType
            },
            xAxis: {
                type: 'category'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            drilldown: {
                drillUpButton: {
                    relativeTo: 'spacingBox',
                    position: {
                        y: 0,
                        x: 0
                    },
                    theme: {
                        fill: 'white',
                        'stroke-width': 1,
                        stroke: 'silver',
                        r: 0,
                        states: {
                            hover: {
                                fill: '#bada55'
                            },
                            select: {
                                stroke: '#039',
                                fill: '#bada55'
                            }
                        }
                    }

                }
            },
            title: {
                text: ''
            },
            size: {
                width: 300,
                height: 220
            }
        };

        if ($scope.widget.commonSrcConfig.src == "DuoStore") {
            var drilledSeries = [];
            var cat = Enumerable.From(eval('$scope.mappedArray.' + $scope.chartCategory.groupField + '.data')).Select().Distinct().ToArray();
            var orderedObjArray = [];
            var drilledCat = Enumerable.From(eval('$scope.mappedArray.' + $scope.chartCategory.drilledField + '.data')).Select().Distinct().ToArray();

            for (i = 0; i < $scope.seriesArray.length; i++) {
                var serMappedData = eval('$scope.mappedArray.' + $scope.seriesArray[i].serName + '.data');
                var catMappedData = eval('$scope.mappedArray.' + $scope.chartCategory.groupField + '.data');
                var drillData = eval('$scope.mappedArray.' + $scope.chartCategory.drilledField + '.data');

                var orderedArrayObj = {};
                var orderedObj = {};
                var drilledObj = {};
                var data = [];

                for (k = 0; k < cat.length; k++) {

                    orderedObj[cat[k]] = {
                        val: 0,
                        arr: []
                    };
                }

                for (k = 0; k < drilledCat.length; k++) {
                    drilledObj[drilledCat[k]] = {
                        val: 0,
                        count: 0
                    };
                }

                if (typeof $scope.filtering == 'undefined') {
                    $scope.filterData($scope.seriesArray[i].filter);
                }

                $scope.filtering.calculate(orderedObj, catMappedData, serMappedData, drillData);

                for (var key in orderedObj) {
                    if (Object.prototype.hasOwnProperty.call(orderedObj, key)) {

                        var drilledArray = $scope.filtering.calculate(orderedObj[key].arr, drilledObj, null, null);

                        var drilledSeriesObj = [];
                        for (var key1 in drilledArray) {
                            if (Object.prototype.hasOwnProperty.call(drilledArray, key1)) {
                                if (drilledArray[key1].val > 0)
                                    drilledSeriesObj.push([key1, drilledArray[key1].val]);
                            }
                        }

                        var test = {
                            id: '',
                            data: []
                        };
                        test.id = key;
                        test.data = drilledSeriesObj;

                        drilledSeries.push(test);

                        data.push({
                            name: key,
                            y: orderedObj[key].val,
                            //changed by sajee 9/19/2015
                            drilldown: key
                        });
                    }
                }
                console.log("Drilled series is");
                console.log(drilledSeries);
                orderedArrayObj["data"] = data;
                orderedArrayObj["name"] = $scope.seriesArray[i].name;
                orderedArrayObj["color"] = $scope.seriesArray[i].color;
                orderedArrayObj["type"] = $scope.seriesArray[i].type;
                orderedObjArray.push(orderedArrayObj);
            }

            widget.highchartsNG['series'] = orderedObjArray;
            widget.highchartsNG.drilldown['series'] = drilledSeries;

        } else if ($scope.widget.commonSrcConfig.src == "BigQuery") {
            $scope.seriesArray.forEach(function (entry) {
                var serObj = {
                    name: '',
                    color: '',
                    type: '',
                    data: []
                };
                entry['data'] = [];
                var tblVal = $scope.srcNamespace + '.' + widget.commonSrcConfig.tbl;
                var paramArr = $scope.generateParamArr('get', Digin_Engine_API, $scope.widget.commonSrcConfig.src, tblVal, 'aggregatefields', $scope.catItem.value, entry.filter, entry.serName.value);
                var w = new Worker("scripts/webworkers/commonSrcWorker.js");
                requestCounter--;
                w.postMessage(JSON.stringify(paramArr));
                w.addEventListener('message', function (event) {

                    var evData = JSON.parse(event.data);
                    serObj.name = entry.name;
                    serObj.type = entry.type;
                    serObj.color = entry.color;
                    for (i = 0; i < evData.length; i++) {
                        serObj.data.push({
                            drilldown: evData[i][$scope.catItem.value],
                            name: evData[i][$scope.catItem.value],
                            y: evData[i]['f0_']
                        });
                        entry['data'].push({
                            drilldown: evData[i][$scope.catItem.value],
                            name: evData[i][$scope.catItem.value],
                            y: evData[i]['f0_']
                        });
                    }
                    if (requestCounter == 0) {
                        setWidget();
                    }
                });
                $scope.orderedArrayO
                bj.push(serObj);
            });

            function setWidget() {
                var requestCounter = 0;
                $scope.seriesArray.forEach(function (entry) {
                    requestCounter = entry.data.length;
                    entry.data.forEach(function (enData) {
                        var con = "WHERE " + $scope.catItem.value + "='" + enData.name + "'";
                        var drillParams = $scope.generateParamArr('get', Digin_Engine_API, $scope.widget.commonSrcConfig.src, widget.commonSrcConfig.tbl, 'aggregatefields', $scope.drillItem.value, entry.filter, entry.serName.value, con);
                        //alert(JSON.stringify(drillParams));
                        var w1 = new Worker("scripts/webworkers/commonSrcWorker.js");

                        w1.postMessage(JSON.stringify(drillParams));
                        w1.addEventListener('message', function (event) {
                            requestCounter--;
                            var drilledData = JSON.parse(event.data);
                            //                  console.log('drilleed data:'+ JSON.stringify(drilledData));
                            var dataArr = [];
                            //                  alert(JSON.stringify(drilledData));
                            for (j = 0; j < drilledData.length; j++) {
                                dataArr.push([
                                    drilledData[j][$scope.drillItem.value],
                                    // drilledData[j]['f0_']
                                    //modified by sajee 1/17
                                    drilledData[j]['']
                                ]);
                            }
                            $scope.objArr.push({
                                id: enData.name,
                                data: dataArr
                            });

                            if (requestCounter == 0) {
                                alert(widget.id);
                                //                      var widgetElem = document.getElementById(widget.id);

                                //widget.highchartsNG = ;
                                console.log('highchartng:' + JSON.stringify(widget.highchartsNG));
                            }


                            //                  widget.highchartsNG.drilldown.series.push({
                            //                        id: enData.name,
                            //                        data: dataArr
                            //                     });
                        });


                    });


                });
                widget.highchartsNG['series'] = $scope.orderedArrayObj;
                widget.highchartsNG.drilldown['series'] = $scope.objArr;
            }
        }

    };

}])
;