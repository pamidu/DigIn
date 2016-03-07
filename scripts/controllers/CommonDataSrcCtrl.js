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
            {'type': 'STRING', 'category': 'att'},
            {'type': 'int', 'category': 'mes'},
            {'type': 'decimal', 'category': 'mes'},
            {'type': 'float', 'category': 'mes'},
            {'type': 'datetime', 'category': 'mes'},
            {'type': 'money', 'category': 'mes'},
            {'type': 'INTEGER', 'category': 'mes'},
            {'type': 'FLOAT', 'category': 'mes'}
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
                    $scope.client = $diginengine.getClient(src);
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
                                                    $scope.sourceUi.attrObj = $scope.commonUi.attribute;
                                                    $scope.sourceUi.mearsuresObj = $scope.commonUi.measures;
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
                
                $scope.currWidget = {
                     widData: {},
                     widView: "",
                     dataView: "ViewElasticData",
                     dataCtrl: "elasticDataCtrl",
                     initTemplate: "",
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
                     highchartsNG: {}
                  };

                $csContainer.fillCSContainer({
                    wid: $scope.currWidget,
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