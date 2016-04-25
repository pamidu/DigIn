/*controllers
 --- commonDataSrcInit
 --- commonSrcInit
 */
routerApp.controller('commonDataSrcInit', ['$scope', '$controller', '$mdSidenav', '$log',
    'CommonDataSrc', '$mdDialog', '$rootScope', '$http', 'Digin_Engine_API',
    'Digin_Engine_API_Namespace', '$diginengine', 'ngToast', '$window', '$state', '$csContainer', 'Upload', '$timeout',
    function($scope, $controller, $mdSidenav, $log, CommonDataSrc,
        $mdDialog, $rootScope, $http, Digin_Engine_API,
        Digin_Engine_API_Namespace, $diginengine, ngToast, $window, $state, $csContainer, Upload, $timeout) {

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
            name: "Rest/SOAP",
            icon: "styles/icons/source/api.svg",
            selected: false
        }, {
            name: "MSSQL",
            icon: "styles/icons/source/mssql.svg",
            selected: false
        }, {
            name: "Spreadsheet",
            icon: "styles/icons/source/spread-sheet.svg",
            selected: false

        }];

        //ng-disabled model of save button
        $scope.pendingColumns = true;
        
        //data base field type
        $scope.dataBaseFiledTypes = [{
            'type': 'nvarchar',
            'category': 'att'
        }, {
            'type': 'varchar',
            'category': 'att'
        }, {
            'type': 'char',
            'category': 'att'
        }, {
            'type': 'char',
            'category': 'att'
        }, {
            'type': 'bit',
            'category': 'att'
        }, {
            'type': 'STRING',
            'category': 'att'
        }, {
            'type': 'int',
            'category': 'mes'
        }, {
            'type': 'decimal',
            'category': 'mes'
        }, {
            'type': 'float',
            'category': 'mes'
        }, {
            'type': 'datetime',
            'category': 'mes'
        }, {
            'type': 'TIMESTAMP',
            'category': 'mes'
        }, {
            'type': 'money',
            'category': 'mes'
        }, {
            'type': 'INTEGER',
            'category': 'mes'
        }, {
            'type': 'FLOAT',
            'category': 'mes'
        }];


        var chartTypes = [];
        //Update damith
        //UI version 1.0
        //select source tab
        //comment UI
        var publicFun = (function() {
            return {
                //clear all class Obj
                clrTblSelectedObj: function(obj) {
                    var sourceInData = obj;
                    for (i = 0; i < sourceInData.length; i++) {
                        sourceInData[i].selected = false;
                    }

                },
                clrMainSelectedSource: function(obj) {
                    //clear main source when click each source
                    var sourceInData = obj;
                    for (i = 0; i < sourceInData.length; i++) {
                        sourceInData[i].selected = false;
                    }
                },
                clearAll: function(callBack) {
                    publicFun.clrTblSelectedObj($scope.sourceUi.tableData);
                    publicFun.clrMainSelectedSource($scope.datasources);
                    $scope.sourceUi.selectedSource = '';
                    $scope.sourceUi.selectedNameSpace = '';
                    commonUi.onRefresh(1);
                    commonUi.onRefresh(2);
                    callBack(true);
                },
                getAllTbl: function(src, callback) {
                    $scope.sourceUi.tableData = [];
                    commonUi.isDataLoading = true;
                    commonUi.isServiceError = false;
                    $scope.client = $diginengine.getClient(src);
                    switch (src) {
                        case "BigQuery":
                            if (localStorage.getItem("BigQueryTables") === null || localStorage.getItem("BigQueryTables") == "null" ||
                                localStorage.getItem("BigQueryTables") == "undefined") {
                                $scope.client.getTables(function(res, status) {
                                    // console.log("get tables result", res.length);
                                    // console.log("status", status);
                                    if (typeof res === 'object' && status) {
                                        callback(res, status);
                                        localStorage.setItem("BigQueryTables", res);
                                    }
                                    if(!status){//if status false
                                        commonUi.isDataLoading = false;
                                        publicFun.fireMessage('0', 'No tables available');
                                    }
                                });
                            } else {
                                var BigQueryTablesString = localStorage.getItem("BigQueryTables");
                                var res = BigQueryTablesString.split(',');
                                callback(res, true);
                            }
                            break;

                        default:
                            $scope.client.getTables(function(res, status) {
                                callback(res, status);
                            });
                            break;
                    }
                },
                getAllFields: function(tbl, callback) {
                    $scope.commonUi.attribute = [];
                    $scope.commonUi.measures = [];
                    $scope.sourceUi.selectedAttribute = [];
                    $scope.sourceUi.selectedMeasures = [];
                    commonUi.isDataLoading = true;
                    commonUi.isServiceError = false;
                    switch ($scope.sourceUi.selectedSource) {
                        case "BigQuery":
                            var saveName = "BigQuery" + tbl;
                            if (localStorage.getItem(saveName) === null ||
                                localStorage.getItem(saveName) === "undefined") {
                                $scope.client.getFields(tbl, function(data, status) {
                                    callback(data, status);
                                    localStorage.setItem(saveName, JSON.stringify(data));
                                });
                            } else {
                                var BigQueryFieldsString = localStorage.getItem(saveName);
                                console.log(BigQueryFieldsString);
                                callback(JSON.parse(BigQueryFieldsString), true);
                            }
                            break;

                        default:
                            $scope.client.getFields(tbl, function(data, status) {
                                callback(data, status);
                            });
                            break;
                    }
                },
                creteTableObj: function(status, res) {
                    if (status) {
                        commonUi.isServiceError = false;
                        for (var i = 0; i < res.length; i++) {
                            $scope.sourceUi.tableData.push({
                                'id': i,
                                'name': res[i],
                                'selected': false
                            });
                        }
                    } else {
                        commonUi.isServiceError = true;
                    }
                    commonUi.isDataLoading = false;
                },
                getRandomNo: function() {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x1000000)
                            .toString(16)
                            .substring(1);
                    }

                    return s4();
                },
                fireMessage: function(msgType, msg) {
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
            onClickTab: function(index) {
                switch (index) {
                    case '1':
                        //selected source
                        commonUi.selectedIndex = 1;
                        break;
                    case '2':
                        //selected  info
                        if (commonUi.selectedIndex != 1) {
                            commonUi.selectedIndex = 2;
                        }
                        break;
                    case '3':
                        //selected  schema
                        break;
                }
            },
            onClickBack: function(index) {
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
            },
            onClickClose: function() {
                commonUi.selectedIndex = 1;
                publicFun.clearAll(function(state) {
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
                $mdSidenav('right')
                    .close()
                    .then(function() {
                        $log.debug('right sidepanel closed');
                    });
            },
            onClickNext: function(index) {
                commonUi.isServiceError = false;
                switch (index) {
                    case '1':
                        //selected source
                        commonUi.selectedIndex = 2;
                        var selectedSrc = $scope.sourceUi.selectedSource;
                        if (selectedSrc != null) {
                            publicFun.getAllTbl(selectedSrc, function(res, state) {
                                publicFun.creteTableObj(state, res);
                            });
                        }
                        break;
                    case '2':
                        //selected info
                        commonUi.selectedIndex = 3;
                        var selectedTbl = $scope.sourceUi.selectedNameSpace;
                        if (selectedTbl != null) {
                            $scope.pendingColumns = true;
                            publicFun.getAllFields(selectedTbl, function(res, status) {
                                if (status) {
                                    var dataTypes = $scope.dataBaseFiledTypes;
                                    //eable save button
                                    $scope.pendingColumns = false;
                                    for (var c in res) {
                                        if (Object.prototype.hasOwnProperty.call(res, c)) {
                                            var val = res[c];
                                            angular.forEach(val, function(value, key) {
                                                if (key == 'FieldType') {
                                                    for (var i = 0; i < dataTypes.length; i++) {
                                                        if (value == dataTypes[i].type) {
                                                            if (dataTypes[i].category == 'att') {
                                                                $scope.commonUi.attribute.push({
                                                                    id: c,
                                                                    name: res[c].Fieldname,
                                                                    isRemove: false,
                                                                    dataType: dataTypes[i].type
                                                                })
                                                            } else {
                                                                $scope.commonUi.measures.push({
                                                                    id: c,
                                                                    name: res[c].Fieldname,
                                                                    isRemove: false,
                                                                    dataType: dataTypes[i].type
                                                                })
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
            },
            onSelectClassRow: function(data) {
                var i;
                var sourceInData = $scope.sourceUi.tableData;
                for (i = 0; i < sourceInData.length; i++) {
                    sourceInData[i].selected = false;
                }
                $scope.sourceUi.tableData = sourceInData;

                var index = $scope.sourceUi.tableData.indexOf(data);
                if (index != -1) {
                    $scope.sourceUi.tableData[index].selected = true;
                }
                $scope.sourceUi.selectedNameSpace = data.name;
                localStorage.setItem("lastSelectedTable", $scope.sourceUi.selectedNameSpace);
            },
            onClickSelectedSrc: function(onSelect, data, ev) {
                commonUi.clearTblData();
                var i;
                var sourceInData = data;
                for (i = 0; i < sourceInData.length; i++) {
                    sourceInData[i].selected = false;
                }
                onSelect.selected = true;
                $scope.sourceUi.selectedSource = onSelect.name;
                localStorage.setItem("lastSelectedSource", $scope.sourceUi.selectedSource);

                if (onSelect.name == "CSV/Excel" || onSelect.name == "SpreadSheet") {
                    // alert("csv excel or spreadsheet selected");
                    commonUi.openFileUploadWindow(ev);
                }
            },
            openFileUploadWindow: function(ev) {
                if (typeof ev != "undefined" && ev.type == 'click') {
                    $mdDialog.show({
                            controller: function fileUploadCtrl($scope, $mdDialog, fileUpload, $http, Upload) {

                                $scope.diginLogo = 'digin-logo-wrapper2';
                                $scope.preloader = false;
                                $scope.finish = function() {
                                    $mdDialog.hide();
                                }
                                $scope.cancel = function() {
                                        $mdDialog.cancel();
                                    }
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
                                    
                                    if (files && files.length) {
                                        $scope.preloader = true;
                                        $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
                                        for (var i = 0; i < files.length; i++) {
                                            var lim = i == 0 ? "" : "-" + i;
                                           
                                            Upload.upload({
                                                 url: 'http://192.168.0.34:8080/file_upload',
                                                  headers: {
                                                 'Content-Type': 'multipart/form-data',
                                                  
                                                  },           
                                                  data: {
                                                    file: files[i],
                                                    db: 'BigQuery',
                                                    SecurityToken: 'e1f2e6f8c7a511a48b6add5c2ef24147',
                                                    Domain: 'duosoftware'
                                                 }
                                                
                                            }).success(function(data){                                                 
                                                fireMsg('1', 'Successfully uploaded!Analyse your data by picking it on bigquery!');
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
                            },
                            templateUrl: 'views/fileUpload.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true,
                            targetEvent: ev
                        })
                        .then(function(answer) {});
                }

            },
            clearTblData: function() {
                publicFun.clrTblSelectedObj($scope.sourceUi.tableData);
            },
            onSaveSource: function() {
                var length = $scope.sourceUi.sourceRcrd.length++;
                var currentQry = $scope.sourceUi.selectedSource + '-' + length;
                $scope.sourceUi.sourceRcrd.push({
                    name: currentQry,
                    id: publicFun.getRandomNo
                });

                //create new attribute
                var newAttrObj = [];
                var attrObj = $scope.sourceUi.attrObj;
                for (var i = 0; i < attrObj.length; i++) {
                    if (!attrObj[i].isRemove) {
                        newAttrObj.push(attrObj[i]);
                    }
                }
                $scope.sourceUi.attrObj = newAttrObj;
                //end -----------------

                //create new measures
                var newMeasureObj = [];
                var measureObj = $scope.sourceUi.mearsuresObj;
                for (var i = 0; i < measureObj.length; i++) {
                    if (!measureObj[i].isRemove) {
                        newMeasureObj.push(measureObj[i]);
                    }
                }
                $scope.sourceUi.mearsuresObj = newMeasureObj;
                //end -----------------------

                if (newMeasureObj.length == 0 &&
                    newAttrObj.length == 0) {
                    publicFun.fireMessage('0', 'Please select query data...');
                    return;
                }

                $scope.currWidget = {
                    widData: {},
                    widView: "",
                    widName: "Dynamic Visuals",
                    dataView: "ViewElasticData",
                    dataCtrl: "elasticDataCtrl",
                    initTemplate: "",
                    initCtrl: "commonSrcInit",
                    uniqueType: "Dynamic Visuals",
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
                    //                    wid: $scope.currWidget,
                    src: $scope.sourceUi.selectedSource,
                    tbl: $scope.sourceUi.selectedNameSpace,
                    fAttArr: $scope.sourceUi.attrObj,
                    fMeaArr: $scope.sourceUi.mearsuresObj
                });

                publicFun.clearAll(function(status) {
                    if (status) {
                        $state.go("home.QueryBuilder", {
                            widObj: $scope.currWidget
                        });
                        $mdSidenav('right').close();
                    }
                });
                //after saving get back to first tab
                commonUi.selectedIndex = 1;
            },
            onRemoveAtt: function(onSelected, data) {
                var attrObj = onSelected;
                var index = attrObj.indexOf(data);
                if (data.isRemove) {
                    $scope.sourceUi.selectedAttribute[index].
                    isRemove = false;
                    $scope.sourceUi.attrObj[index].
                    isRemove = false;
                } else {
                    $scope.sourceUi.selectedAttribute[index].
                    isRemove = true;
                    $scope.sourceUi.attrObj[index].
                    isRemove = true;
                }
            },
            onRemoveMeasures: function(onSelected, data) {
                var attrObj = onSelected;
                var index = attrObj.indexOf(data);
                if (data.isRemove) {
                    $scope.sourceUi.selectedMeasures[index].
                    isRemove = false;
                    $scope.sourceUi.mearsuresObj[index].
                    isRemove = false;
                } else {
                    $scope.sourceUi.selectedMeasures[index].
                    isRemove = true;
                    $scope.sourceUi.mearsuresObj[index].
                    isRemove = true;
                }
            },
            onRefresh: function(index) {
                switch (index) {
                    case 1:
                        //refresh attribute data
                        commonUi.isRefAttribute = true;
                        var attributes = $scope.commonUi.attribute;
                        setTimeout(function() {
                            $scope.sourceUi.selectedAttribute = angular.
                            copy(attributes);
                            commonUi.isRefAttribute = false;
                        }, 100);
                        break;
                    case 2:
                        //refresh measures data
                        commonUi.isRefMeasures = true;
                        var measures = $scope.commonUi.measures;
                        setTimeout(function() {
                            $scope.sourceUi.selectedMeasures = angular.
                            copy(measures);
                            commonUi.isRefMeasures = false;
                        }, 100);
                        break;
                    case 3:
                        publicFun.clearAll(function(state) {
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
                            publicFun.getAllTbl(selectedSrc, function(res, status) {
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
                selectedMeasures: [],
                search: ''
            }
            /* initialize tabs */
        $scope.initTabSource = function(ev) {

            for (var i = 0; i < $scope.datasources.length; i++) {
                if ($scope.datasources[i].name == localStorage.getItem("lastSelectedSource")) {
                    $scope.commonUi.onClickSelectedSrc($scope.datasources[i], $scope.datasources, ev);
                }
            }
            for (var i = 0; i < $scope.sourceUi.tableData.length; i++) {
                //console.log($scope.sourceUi.tableData[i]);
                if ($scope.sourceUi.tableData[i].name == localStorage.getItem("lastSelectedTable")) {
                    $scope.commonUi.onSelectClassRow($scope.sourceUi.tableData[i]);
                }
            }

        }
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


    //--------msg s------
    var privateFun = (function () {
            return {
                
                fireMsg: function (msgType, content) {
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
        })();
    //---------msg e---------


    }
]);
