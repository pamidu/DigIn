/*controllers
 --- commonDataSrcInit
 --- commonSrcInit
 */
routerApp.controller('commonDataSrcInit', ['$scope', '$controller', '$mdSidenav', '$log',
    'CommonDataSrc', '$mdDialog', '$rootScope', '$http', 'Digin_Engine_API',
    'Digin_Engine_API_Namespace', '$diginengine', 'ngToast', '$window','$state','$csContainer'
    , function ($scope, $controller, $mdSidenav, $log, CommonDataSrc,
                $mdDialog, $rootScope, $http, Digin_Engine_API,
                Digin_Engine_API_Namespace, $diginengine, ngToast, $window, $state, $csContainer) {

        $rootScope.dashboard2 = [];

        $scope.datasources = [{
            name: "DuoStore",
            icon: "styles/icons/source/duo-store.svg",
            selected: false
        }, {
            name: "BigQuery",
            icon: "styles/icons/source/biq-query.svg",
            selected: false
        }, {
            name: "CSV/Excel",
            icon: "styles/icons/source/xlsx.svg",
            selected: false
        }, {
            name: "Rest/SOAP Service",
            icon: "styles/icons/source/api.svg",
            selected: false
        }, {
            name: "MSSQL",
            icon: "styles/icons/source/mssql.svg",
            selected: false
        }, {
            name: "SpreadSheet",
            icon: "styles/icons/source/spread-sheet.svg",
            selected: false

        }];


        //data base field type
        $scope.dataBaseFiledTypes = [
            {'type': 'nvarchar', 'category': 'att'},
            {'type': 'varchar', 'category': 'att'},
            {'type': 'char', 'category': 'att'},
            {'type': 'char', 'category': 'att'},
            {'type': 'bit', 'category': 'att'},
            {'type': 'int', 'category': 'mes'},
            {'type': 'decimal', 'category': 'mes'},
            {'type': 'float', 'category': 'mes'},
            {'type': 'datetime', 'category': 'mes'},
            {'type': 'money', 'category': 'mes'}
        ];


        var chartTypes = [];
        //Update damith
        //UI version 1.0
        //select source tab
        //comment UI
        var publicFun = (function () {
            return {
                //clear all class Obj
                clrTblSelectedObj: function (obj) {
                    var sourceInData = obj;
                    for (i = 0; i < sourceInData.length; i++) {
                        sourceInData[i].selected = false;
                    }

                },
                clrMainSelectedSource: function (obj) {
                    //clear main source when click each source
                    var sourceInData = obj;
                    for (i = 0; i < sourceInData.length; i++) {
                        sourceInData[i].selected = false;
                    }
                },
                clearAll: function (callBack) {
                    publicFun.clrTblSelectedObj($scope.sourceUi.tableData);
                    publicFun.clrMainSelectedSource($scope.datasources);
                    $scope.sourceUi.selectedSource = '';
                    $scope.sourceUi.selectedNameSpace = '';
                    commonUi.onRefresh(1);
                    commonUi.onRefresh(2);
                    callBack(true);
                }, getAllTbl: function (src, callback) {
                    $scope.sourceUi.tableData = [];
                    commonUi.isDataLoading = true;
                    commonUi.isServiceError = false;
                    $scope.client = $diginengine.getClient("HutchDialogic", src);
                    $scope.client.getTables(function (res, status) {
                        callback(res, status);
                    });
                },
                getAllFields: function (tbl, callback) {
                    $scope.commonUi.attribute = [];
                    $scope.commonUi.measures = [];
                    $scope.sourceUi.selectedAttribute = [];
                    $scope.sourceUi.selectedMeasures = [];
                    commonUi.isDataLoading = true;
                    commonUi.isServiceError = false;
                    $scope.client.getFields(tbl, function (data, status) {
                        callback(data, status);
                    });
                },
                creteTableObj: function (status, res) {
                    if (status) {
                        commonUi.isServiceError = false;
                        for (var i = 0; i < res.length; i++) {
                            $scope.sourceUi.tableData.push(
                                {'id': i, 'name': res[i], 'selected': false}
                            );
                        }
                    } else {
                        commonUi.isServiceError = true;
                    }
                    commonUi.isDataLoading = false;
                },
                getRandomNo: function () {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x1000000)
                            .toString(16)
                            .substring(1);
                    }

                    return s4();
                }
            }
        })();

        var commonUi = {
            attribute: [],
            measures: [],
            selectedIndex: 1,
            isDataLoading: false,
            isRefAttribute: false,
            isRefMeasures: false,
            isServiceError: false,
            isDone: 0,
            onClickTab: function (index) {
                switch (index) {
                    case '1':
                        //selected source
                        commonUi.selectedIndex = 1;
                        break;
                    case '2':
                        commonUi.selectedIndex = 2;
                        //selected  info
                        break;
                    case '3':
                        commonUi.selectedIndex = 3;
                        //selected  info
                        break;
                }
            }
            ,
            onClickBack: function (index) {
                commonUi.isServiceError = false;
                switch (index) {
                    case '1':
                        //selected source
                        commonUi.selectedIndex = 1;
                        break;
                    case '2':
                        //selected info
                        commonUi.selectedIndex = 1;
                        break;
                    case '3':
                        //selected schema
                        commonUi.selectedIndex = 2;
                        break;
                }
            }
            ,
            onClickClose: function () {
            }
            ,
            onClickNext: function (index) {
                commonUi.isServiceError = false;
                switch (index) {
                    case '1':
                        //selected source
                        commonUi.selectedIndex = 2;
                        var selectedSrc = $scope.sourceUi.selectedSource;
                        if (selectedSrc != null) {
                            publicFun.getAllTbl(selectedSrc, function (res, state) {
                                publicFun.creteTableObj(state, res);
                            });
                        }
                        break;
                    case '2':
                        //selected info
                        commonUi.selectedIndex = 3;
                        var selectedTbl = $scope.sourceUi.selectedNameSpace;
                        if (selectedTbl != null) {
                            publicFun.getAllFields(selectedTbl, function (res, status) {
                                if (status) {
                                    var dataTypes = $scope.dataBaseFiledTypes;
                                    for (var c in res) {
                                        if (Object.prototype.hasOwnProperty.call(res, c)) {
                                            var val = res[c];
                                            angular.forEach(val, function (value, key) {
                                                if (key == 'FieldType') {
                                                    for (var i = 0; i < dataTypes.length; i++) {
                                                        if (value == dataTypes[i].type) {
                                                            if (dataTypes[i].category == 'att') {
                                                                $scope.commonUi.attribute.push(
                                                                    {id: c, name: res[c].Fieldname, isRemove: false}
                                                                )
                                                            } else {
                                                                $scope.commonUi.measures.push(
                                                                    {id: c, name: res[c].Fieldname, isRemove: false}
                                                                )
                                                            }
                                                        }
                                                    }
                                                }

                                            });
                                        }
                                    }

                                    $scope.sourceUi.selectedAttribute = angular.
                                    copy($scope.commonUi.attribute);
                                    $scope.sourceUi.selectedMeasures = angular.
                                    copy($scope.commonUi.measures);
                                }
                                commonUi.isDataLoading = false;
                            });
                        }
                        break;
                    case '3':
                        //selected schema
                        commonUi.selectedIndex = 4;
                        break;
                }
            }
            ,
            onSelectClassRow: function (data) {
                var i;
                var sourceInData = $scope.sourceUi.tableData;
                for (i = 0; i < sourceInData.length; i++) {
                    sourceInData[i].selected = false;
                }
                data.selected = true;
                $scope.sourceUi.selectedNameSpace = data.name;
//                alert($scope.sourceUi.selectedNameSpace);
            }
            ,
            onClickSelectedSrc: function (onSelect, data) {
                commonUi.clearTblData();
                var i;
                var sourceInData = data;
                for (i = 0; i < sourceInData.length; i++) {
                    sourceInData[i].selected = false;
                }
                onSelect.selected = true;
                $scope.sourceUi.selectedSource = onSelect.name;
            }
            ,
            clearTblData: function () {
                publicFun.clrTblSelectedObj($scope.sourceUi.tableData);
            }
            ,
            onSaveSource: function () {
                var length = $scope.sourceUi.sourceRcrd.length++;
                var currentQry = $scope.sourceUi.selectedSource + '-' + length;
                $scope.sourceUi.sourceRcrd.push({
                    name: currentQry,
                    id: publicFun.getRandomNo
                });
                $rootScope.dashboard2.push($scope.sourceUi);

                $csContainer.fillCSContainer({
                    src: $scope.sourceUi.selectedSource,
                    tbl: $scope.sourceUi.selectedNameSpace,
                    fAttArr: $scope.sourceUi.attrObj,
                    fMeaArr: $scope.sourceUi.mearsuresObj
                });
                
                publicFun.clearAll(function (status) {
                    if (status) {
                        $state.go("home.QueryBuilder");
                        $mdSidenav('right').close();
                    }
                });
                

            }
            ,
            onRemoveAtt: function (onSelected, data) {
                var attrObj = onSelected;
                var index = attrObj.indexOf(data);
                if (index != -1) {
                    attrObj.splice(index, 1);
                }
                $scope.sourceUi.attrObj = attrObj;
                
            },
            onRemoveMeasures: function (onSelected, data) {
                var attrObj = onSelected;
                var index = attrObj.indexOf(data);
                if (index != -1) {
                    attrObj.splice(index, 1);
                }
                $scope.sourceUi.mearsuresObj = attrObj;
                
            } 
            ,
            onRefresh: function (index) {
                switch (index) {
                    case 1:
                        //refresh attribute data
                        commonUi.isRefAttribute = true;
                        var attributes = $scope.commonUi.attribute;
                        setTimeout(function () {
                            $scope.sourceUi.selectedAttribute = angular.
                            copy(attributes);
                            commonUi.isRefAttribute = false;
                        }, 100);
                        break;
                    case 2:
                        //refresh measures data
                        commonUi.isRefMeasures = true;
                        var measures = $scope.commonUi.measures;
                        setTimeout(function () {
                            $scope.sourceUi.selectedMeasures = angular.
                            copy(measures);
                            commonUi.isRefMeasures = false;
                        }, 100);
                        break;
                    case 3:
                        publicFun.clearAll(function (state) {
                            if (state) {
                                ngToast.create({
                                    className: 'success',
                                    content: 'Please wait...',
                                    horizontalPosition: 'right',
                                    verticalPosition: 'bottom',
                                    timeout: 1500,
                                    dismissOnClick: true
                                });
                            }
                        });
                        break;
                    case 4:
                        //refresh selected namespaces
                        commonUi.isServiceError = false;
                        var selectedSrc = $scope.sourceUi.selectedSource;
                        if (selectedSrc != null) {
                            publicFun.getAllTbl(selectedSrc, function (res, status) {
                                publicFun.creteTableObj(status, res);
                            });
                        }
                    default:
                        break;
                }
            }
        };
        $scope.commonUi = commonUi;

        //selected main source UI
        //Data source
        $scope.sourceUi = {
            sourceRcrd: [],
            selectedSource: '',
            selectedNameSpace: '',
            tableData: [],
            selectedAttribute: [],
            selectedMeasures: []
        }
    }]);


routerApp.controller('commonSrcInit', ['$scope', '$mdDialog', '$rootScope', 'widId', '$state', 'fieldData', 'Digin_Engine_API', 'Digin_Engine_API_Namespace', function ($scope, $mdDialog, $rootScope, widId, $state, fieldData, Digin_Engine_API, Digin_Engine_API_Namespace) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
    $scope.widget = $rootScope.dashboard.widgets[objIndex];
    $scope.arrayAttributes = fieldData;
    $scope.fieldSelection = true;
    $scope.mappedArray = {};
    $scope.selMetCat = "";
    $scope.seriesArray = [{
        name: 'series1',
        serName: '',
        filter: '',
        type: $scope.widget.commonSrcConfig.initSerType,
        color: '',
        turboThreshold: 3000
    }];

    $scope.categItem = {};

    $scope.chartCategory = {
        groupField: '',
        drilledField: '',
        drilledArray: []
    };
    $scope.filterAttributes = [{
        name: 'Sum',
        method: 'SUM',
        isMet: false
    },
        {
            name: 'Average',
            method: 'AVG',
            isMet: false
        },
        {
            name: 'Count',
            method: 'COUNT',
            isMet: false
        },
        {
            name: 'Mode',
            method: 'MODE',
            isMet: true
        },
        {
            name: 'Mean',
            method: 'MEAN',
            isMet: true
        },
        {
            name: 'Median',
            method: 'MEDIAN',
            isMet: true
        }];
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

    if (typeof $scope.widget.commonSrcConfig.arrAttributes != 'undefined') {
        $scope.arrayAttributes = $scope.widget.commonSrcConfig.arrAttributes;
        if (typeof $scope.widget.commonSrcConfig.drilled != 'undefined') {
            $scope.queryDrilled = $scope.widget.commonSrcConfig.drilled;
            $scope.categItem.item = $scope.widget.commonSrcConfig.catItem;
            $scope.seriesArray = $scope.widget.commonSrcConfig.serObjs;
            $scope.categItem.drillItem = $scope.widget.commonSrcConfig.drillItem;
        }
        else {
            $scope.categItem = $scope.widget.commonSrcConfig.metCat;
            $scope.selectedFilter = $scope.widget.commonSrcConfig.metFil;
        }
    }

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

    $scope.cancel = function () {
        $mdDialog.hide();
    }

    $scope.getDrillArray = function () {
        console.log(JSON.stringify($scope.arrayAttributes));
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
            drilled: false,
            turboThreshold: 3000
        });
    }


    //removes the clicked series
    $scope.removeSeries = function (ind) {
        $scope.seriesArray.splice(ind, 1);
    };

    //builds the chart
    $scope.buildchart = function (widget) {
        widget.chartSeries = [];

        if ($scope.catItem != '') {
            $scope.widgetValidity = 'fade-out';
            if ($scope.seriesArray[0].serName != '') {
                if ($scope.queryDrilled) {
                    if ($scope.drillItem != '') {
                        $scope.orderByDrilledCat(widget);
                        $state.go('home.Dashboards');
                        widget.commonSrcConfig['drilled'] = true;
                        widget.commonSrcConfig['arrAttributes'] = $scope.arrayAttributes;
                        widget.commonSrcConfig['catItem'] = $scope.categItem.item;
                        widget.commonSrcConfig['serObjs'] = $scope.seriesArray;
                        widget.commonSrcConfig['drillItem'] = $scope.categItem.drillItem;

                        $mdDialog.hide();
                        //$scope.widgetValidity = 'fade-out';
                    } else {
                        //$scope.validationMessage = "Please select the category to drill-down from";
                        //$scope.widgetValidity = 'fade-in';
                    }
                } else {
                    $scope.orderByCat(widget);
                    $state.go('home.Dashboards');
                    widget.commonSrcConfig['drilled'] = false;
                    widget.commonSrcConfig['arrAttributes'] = $scope.arrayAttributes;
                    widget.commonSrcConfig['catItem'] = $scope.categItem.item;
                    widget.commonSrcConfig['serObjs'] = $scope.seriesArray;

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
                    series: [{
                        "turboThreshold": 5000
                    }],
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            turboThreshold: 5000,
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
                var paramArr = $scope.generateParamArr('get', Digin_Engine_API, $scope.widget.commonSrcConfig.src, tblVal, 'aggregatefields', $scope.catItem.value, entry.filter, entry.serName.value);
                var w = new Worker("scripts/webworkers/commonSrcWorker.js");
                w.postMessage(JSON.stringify(paramArr));
                w.addEventListener('message', function (event) {
                    var objArr = [];
                    var evData = JSON.parse(event.data);
                    for (i = 0; i < evData.length; i++) {
                        entry['data'].push({
                            name: evData[i][$scope.catItem.value],
                            y: evData[i]['']
                        });
                    }
                    //update damith
                    //create  mapped data
                    var selectedFiled = $scope.widget.commonSrcConfig.fields;
                    for (var c = 0; c < selectedFiled.length; c++) {
                        var val = selectedFiled[c];
                        $scope.mappedArray[val] = {
                            data: []
                        };
                    }
                    //y get series name
                    var ySer = entry.serName.value;
                    for (i = 0; i < evData.length; i++) {
                        var val = evData[i];
                        var index = 0;
                        for (var key in val) {
                            if (val.hasOwnProperty(key)) {
                                if (key == "" || key == null) {
                                    var arr = Object.keys(val).map(function (k) {
                                        return val[k]
                                    });
                                    $scope.mappedArray[ySer].data.push(arr[index]);
                                } else {
                                    $scope.mappedArray[key].data.push(val[key]);
                                }
                            }
                            index++;
                        }
                    }
                    widget.winConfig['mappedData'] = $scope.mappedArray;
                    widget.highchartsNG['series'] = $scope.seriesArray;
                    console.log("widget name " + JSON.stringify(widget));
                });
            });
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
                    turboThreshold: 5000,
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

        } else if ($scope.widget.commonSrcConfig.src != "DuoStore") {
            $scope.seriesArray.forEach(function (entry) {
                var serObj = {
                    name: '',
                    color: '',
                    type: '',
                    data: []
                };
                entry['data'] = [];

                //            var tblVal = $scope.srcNamespace + '.' + widget.commonSrcConfig.tbl;
                var paramArr = $scope.generateParamArr('get', Digin_Engine_API, $scope.widget.commonSrcConfig.src, widget.commonSrcConfig.tbl, 'aggregatefields', $scope.categItem.item.value, entry.filter, entry.serName.value);
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
                            drilldown: evData[i][$scope.categItem.item.value],
                            name: evData[i][$scope.categItem.item.value],
                            y: evData[i]['']
                            //                     y: evData[i]['f0_']
                        });
                        entry['data'].push({
                            drilldown: evData[i][$scope.categItem.item.value],
                            name: evData[i][$scope.categItem.item.value],
                            y: evData[i]['']
                            //                     y: evData[i]['f0_']
                        });
                    }
                    if (requestCounter == 0) {
                        setWidget();
                    }
                });
                $scope.orderedArrayObj.push(serObj);
            });

            function setWidget() {
                var requestCounter = 0;
                $scope.seriesArray.forEach(function (entry) {
                    requestCounter = entry.data.length;
                    entry.data.forEach(function (enData) {
                        var con = "WHERE " + $scope.categItem.item.value + "='" + enData.name + "'";
                        //                  alert(JSON.stringify($scope.categItem.drillItem)+ ' ' + JSON.stringify(entry.serName));
                        var drillParams = $scope.generateParamArr('get', Digin_Engine_API, $scope.widget.commonSrcConfig.src, widget.commonSrcConfig.tbl, 'aggregatefields', $scope.categItem.drillItem.value, entry.filter, entry.serName.value, con);
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
                                    drilledData[j][$scope.categItem.drillItem.value],
                                    drilledData[j]['']
                                ]);
                            }
                            $scope.objArr.push({
                                id: enData.name,
                                data: dataArr
                            });
                            //                     alert();

                            if (requestCounter == 0) {
                                widget.highchartsNG['series'] = $scope.orderedArrayObj;
                                widget.highchartsNG.drilldown['series'] = $scope.objArr;
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
                console.log('highchartng:' + JSON.stringify(widget.highchartsNG));
                $state.go('home.Dashboards');
            }
        }

    };

    $scope.cancel = function () {
        $mdDialog.hide();
    }

    $scope.buildMetric = function (widget) {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function (e) {
            console.log(this);
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var res = JSON.parse(xhr.response);
                    widget.widData.value = res[0][""];
                    widget.commonSrcConfig['arrAttributes'] = $scope.arrayAttributes;
                    widget.commonSrcConfig['metCat'] = $scope.categItem;
                    widget.commonSrcConfig['metFil'] = $scope.selectedFilter;
                    $mdDialog.hide();
                } else {
                    console.error("XHR didn't work: ", xhr.status);
                }
            }
        }
        xhr.ontimeout = function () {
            console.error("request timedout: ", xhr);
        }
        xhr.open('get', "http://192.168.2.33:8080/aggregatefields?tablename=" + widget.commonSrcConfig.tbl + "&agg=" + $scope.selectedFilter + "&agg_f=[%27" + $scope.categItem + "%27]&db=" + widget.commonSrcConfig.src, /*async*/ true);
        xhr.send();
        $state.go('home.Dashboards');

    };


}]);