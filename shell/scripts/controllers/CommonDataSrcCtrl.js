
/*controllers
 --- commonDataSrcInit
 --- commonSrcInit
 */
routerApp.controller('commonDataSrcInit', ['$scope', '$filter', '$controller', '$mdSidenav', '$log',
    'CommonDataSrc', '$mdDialog', '$rootScope', '$http', 'Digin_Engine_API',
    '$diginengine', 'ngToast', '$window', '$state', '$csContainer', 'Upload', '$timeout', 'Digin_Domain', '$diginurls', 'saveDashboardService', 'datasourceFactory', 'notifications',
    function($scope, $filter, $controller, $mdSidenav, $log, CommonDataSrc,
        $mdDialog, $rootScope, $http, Digin_Engine_API,
         $diginengine, ngToast, $window, $state, $csContainer, Upload, $timeout, Digin_Domain, $diginurls, saveDashboardService, datasourceFactory, notifications) {

        //ng-disabled model of save button
        $scope.pendingColumns = true;
        $scope.show = false;
        $scope.filterMenuStatus = false;
        $scope.fieldObjects = [];
        $scope.datasourceId = '';
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
            'type': 'bit',
            'category': 'att'
        }, {
            'type': 'STRING',
            'category': 'att'
        }, {
            'type': 'datetime',
            'category': 'att'
        }, {
            'type': 'DATETIME',
            'category': 'att'
        }, {
            'type': 'DATE',
            'category': 'att'
        }, {
            'type': 'TIMESTAMP',
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
            'type': 'money',
            'category': 'mes'
        }, {
            'type': 'INTEGER',
            'category': 'mes'
        }, {
            'type': 'FLOAT',
            'category': 'mes'
        }, {
            'type': 'smallint',
            'category': 'mes'
        }, {
            'type': 'integer',
            'category': 'mes'
        }, {
            'type': 'bigint',
            'category': 'mes'
        }, {
            'type': 'numeric',
            'category': 'mes'
        }, {
            'type': 'real',
            'category': 'mes'
        }, {
            'type': 'double precision',
            'category': 'mes'
        }, {

            'type': 'smallserial',
            'category': 'mes'
        }, {

            'type': 'serial',
            'category': 'mes'
        }, {

            'type': 'bigserial',
            'category': 'mes'
        }, {
            'type': 'character varying',
            'category': 'att'
        }, {

            'type': 'character',
            'category': 'att'
        }

    ];
        $scope.fieldObjects = [];
        $scope.selectedAttributes = []
        var chartTypes = [];
        var user = "";
        var isBQInitial = true;
        var isMSSQLInitial = true;

        $scope.initiateDatasources = function() {
            $http.get('jsons/dbConfig.json').success(function(data) {
                $scope.datasources = data;
            }).error(function(error){
            });
        }

        $scope.generateDashboardName = function() {
            $rootScope.dashboard["compName"] = "temp_dashboard" + Math.floor(Math.random() * (100 - 10 + 1) + 10).toString();
            var noDuplicate = saveDashboardService.checkDashboardName($rootScope.dashboard.compName);
            if (noDuplicate) {
                return;
            } else {
                $scope.generateDashboardName();
            }
        };

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
                    var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
                    var folder_name;
                    switch (src) {
                        case "BigQuery":
                            $scope.tables = [];
                            var type;
                            $scope.client.getTables(function(res, status) {
                                if(status) {
                                    $scope.allTables = res;
                                    angular.forEach(res,function(key) {
                                        if(key.upload_type == 'csv-directory') {
                                            type = 'ti-folder';
                                        } else {
                                            type = 'ti-file';
                                        }

                                        if(key.shared_by == null){
                                            isShared =false;
                                        }else{
                                            isShared = true
                                        }

                                        $scope.tables.push({
                                            name: key.datasource_name,
                                            type: type,
                                            isShared : isShared
                                        })
                                    })
                                    callback($scope.tables, status);
                                    localStorage.setItem("BigQueryTables", $scope.tables);
                                    commonUi.isDataLoading = false;
                                    if(res.length < 1){
                                        publicFun.fireMessage('1', 'Please upload a csv file');
                                    }
                                } else {
                                    commonUi.isDataLoading = false;
                                    publicFun.fireMessage('0', 'Error occured. Please try again.');
                                }
                            });
                            break;
                        case "memsql":
                            $scope.tables = [];
                            var type;
                            $scope.client.getTables(function(res, status) {
                                if(status) {
                                    $scope.allTables = res;
                                    angular.forEach(res,function(key) {
                                        if(key.upload_type == 'csv-directory') {
                                            type = 'ti-folder';
                                        } else {
                                            type = 'ti-file';
                                        }

                                        if(key.shared_by == null){
                                            isShared =false;
                                        }else{
                                            isShared = true
                                        }

                                        $scope.tables.push({
                                            name: key.datasource_name,
                                            type: type,
                                            isShared : isShared
                                        })
                                    })
                                    callback($scope.tables, status);
                                    commonUi.isDataLoading = false;
                                } else {
                                    commonUi.isDataLoading = false;
                                    publicFun.fireMessage('0', 'Error occured. Please try again.');
                                }
                            });
                            break;
                        case "MSSQL":
                            $scope.sourceUi.tableData = [];
                            $scope.tables = [];
                            $scope.mssqlConnections = [];
                            var filesFlag = false;
                            var foldersFlag = false;
                            var flag;
                            datasourceFactory.getAllConnections(userInfo.SecurityToken).success(function(data){
                                if(data.Is_Success) {
                                    commonUi.isDataLoading = false;
                                    $scope.mssqlConnections = data.Result;
                                    $scope.mssqlConnections = $filter('orderBy')($scope.mssqlConnections,'connection_name');
                                    if ($scope.mssqlConnections.length > 0){
                                        notifications.toast('1',data.Custom_Message);                                        
                                    } else {
                                        notifications.toast('1','Please create a new connection.');
                                    }
                                } else {
                                    commonUi.isDataLoading = false;
                                    commonUi.isServiceError = true;
                                    notifications.toast('0',data.Custom_Message);
                                }
                            }).error(function(data){
                                commonUi.isDataLoading = false;
                                commonUi.isServiceError = true;
                                notifications.toast('0','Request failed.Please try again.');
                            })
                        break;
                        default:
                            $scope.tables = [];
                            var filesFlag = false;
                            var foldersFlag = false;
                            var flag;
                                $scope.client.getTables(function(res, status) {
                                    if (typeof res === 'object' && status) {
                                        angular.forEach(res,function(r) {
                                            $scope.tables.push({
                                                name: r,
                                                type: "ti-file"
                                            });
                                        });
                                        filesFlag = true;
                                        if ( filesFlag && foldersFlag ) {
                                            callback($scope.tables, status);
                                            commonUi.isDataLoading = false;
                                        }
                                    }
                                    if(!status) { //if status false
                                        filesFlag = true;
                                        if ( filesFlag && foldersFlag ) {
                                            if ($scope.tables.length > 0){
                                                flag = true;
                                            }
                                            callback($scope.tables, flag);
                                            commonUi.isDataLoading = false;
                                        }                                          
                                        publicFun.fireMessage('0', 'Could not retrieve all the files!');
                                    }
                                });
                                $scope.client.getFolders(folder_name,function(res, status) {
                                    if (status) {
                                        angular.forEach(res,function(data){
                                            $scope.tables.push({
                                                name: data.file,
                                                type: "ti-folder"
                                            });
                                        });
                                        foldersFlag = true;
                                        if ( filesFlag && foldersFlag ) {
                                            callback($scope.tables, flag);
                                            commonUi.isDataLoading = false;
                                        }                                        
                                    } else {
                                        foldersFlag = true;
                                        if ( filesFlag && foldersFlag ) {
                                            if ($scope.tables.length > 0){
                                                flag = true;
                                            }
                                            callback($scope.tables, flag);
                                            commonUi.isDataLoading = false;
                                        }                                        
                                        publicFun.fireMessage('0', 'Could not retrieve all the folders!');
                                    }
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
                    var tables = [];
                    switch ($scope.sourceUi.selectedSource) {
                        case "BigQuery":
                            for(var i = 0; i < $scope.allTables.length; i++ ) {
                                if ($scope.allTables[i].datasource_name == tbl) {
                                    angular.forEach($scope.allTables[i].schema,function(field) {
                                        if ( field.name != "_index_id" && field.type != "integer" ) {
                                            tables.push({
                                                Fieldname : field.name,
                                                FieldType : field.type
                                            })
                                        }
                                    })
                                    $scope.datasourceId = $scope.allTables[i].datasource_id;
                                    callback(tables,true);
                                    break;
                                }
                            }
                            break;
                        case "memsql":
                            for(var i = 0; i < $scope.allTables.length; i++ ) {
                                if ($scope.allTables[i].datasource_name == tbl) {
                                    angular.forEach($scope.allTables[i].schema,function(field) {
                                        if ( field.name != "_index_id" && field.type != "integer" ) {
                                            tables.push({
                                                Fieldname : field.name,
                                                FieldType : field.type
                                            })
                                        }
                                    })
                                    $scope.datasourceId = $scope.allTables[i].datasource_id;
                                    callback(tables,true);
                                    break;
                                }
                            }
                            break;
                            case "MSSQL":
                            var saveName = "MSSQL" + tbl;
                            if (localStorage.getItem(saveName) === null ||
                                localStorage.getItem(saveName) === "undefined") {
                                $scope.client.getMSSQLFields(tbl, $scope.datasourceId ,function(data, status) {
                                    callback(data, status);
                                    localStorage.setItem(saveName, JSON.stringify(data));
                                });
                            } else {
                                var BigQueryFieldsString = localStorage.getItem(saveName);
                                console.log(BigQueryFieldsString);
                                callback(JSON.parse(BigQueryFieldsString), true);
                            }
                            break;

                        case "postgresql":
                            var saveName = "postgresql" + tbl;
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
                                'name': res[i].name,
                                'selected': false,
                                'type' : res[i].type,
                                'isShared':res[i].isShared
                            });
                        }
                    } else {
                        commonUi.isServiceError = true;
                    }
                    $rootScope.tableData = $scope.sourceUi.tableData;
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
                    ngToast.dismiss();
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
                commonUi.onCLickFilterClose();
            },
            onClickClose: function() {
                commonUi.selectedIndex = 1;
                publicFun.clearAll(function(state) {
                    if (state) {
                        $mdSidenav('right')
                        .close()
                        .then(function() {
                            console.log('right sidepanel closed');
                        });
                    }
                });
                commonUi.onCLickFilterClose();
            },
            onCLickFilterClose: function() {
                $scope.filterMenuStatus = false;
                $mdSidenav('filterMenu')
                    .close()
                    .then(function() {
                    console.log('filterMenu sidepanel closed');
                });
            },
            onExecuteManualQuery: function(){
                commonUi.onCLickFilterClose();                
                if ( $scope.sourceUi.selectedSource != null ){
                    $csContainer.fillCSContainer({
                        src: $scope.sourceUi.selectedSource,
                        id: $scope.datasourceId,
                        tbl: "",
                        fAttArr: "",
                        fMeaArr: ""
                    });                    
                    publicFun.clearAll(function(status) {            
                        if (status) {
                            $scope.currWidget = {
                                widData: {},
                                widView: "",                       
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
                                id: Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1),
                                type: "Visualization",
                                width: '370px',
                                height: '300px',
                                mheight: '100%',
                                highchartsNG: {}
                            };                    
                            $state.go("home.QueryBuilder", {
                            widObj: {   
                                "widgetID": null,
                                "widgetName": $scope.currWidget.widName,
                                "widgetData": $scope.currWidget
                                }
                            });
                            $mdSidenav('right').close();
                        }
                    });
                    commonUi.selectedIndex = 1; 
                }
                else{
                    publicFun.fireMessage('0', 'Please select a source');
                    return;
                }
            },
            onClickNext: function(index) {
                commonUi.onCLickFilterClose();
                commonUi.isServiceError = false;
                switch (index) {
                    case '1':
                        //selected source
                        commonUi.selectedIndex = 2;
                        $scope.sourceUi.selectedNameSpace = null;
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
                        $scope.fieldObjects = [];
                        $scope.selectedAttributes = [];
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
                                                            if (dataTypes[i].category == 'mes') {
                                                                $scope.commonUi.measures.push({
                                                                    id: c,
                                                                    name: res[c].Fieldname,
                                                                    isRemove: false,
                                                                    dataType: dataTypes[i].type
                                                                })
                                                            }
                                                            $scope.commonUi.attribute.push({
                                                                id: c,
                                                                name: res[c].Fieldname,
                                                                isRemove: false,
                                                                dataType: dataTypes[i].type
                                                            })
                                                        }
                                                    }
                                                    $scope.sourceUi.attrObj = $scope.commonUi.attribute;
                                                    $scope.forecastAtt = $scope.commonUi.attribute;
                                                    $scope.sourceUi.mearsuresObj = $scope.commonUi.measures;
                                                }

                                            });
                                        }
                                    }

                                    $scope.sourceUi.selectedAttribute = angular.
                                    copy($scope.commonUi.attribute);
                                    $scope.sourceUi.selectedMeasures = angular.
                                    copy($scope.commonUi.measures);
                                } else {
                                    $scope.sourceUi.attrObj = [];
                                    $scope.sourceUi.mearsuresObj = [];
                                    $scope.forecastAtt = [];
                                }
                                // check the 'all' check box in measures and attributes section
                                $("#measures").prop("checked",true); //check
                                $("#attributes").prop("checked",true); //check
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

                if (onSelect.name == "CSV Upload") {
                    // alert("csv excel or spreadsheet selected");
                    // commonUi.openFileUploadWindow(ev);
                    $mdSidenav('right').close();
                    $state.go("home.excelFileUpload")
                }
            },
            clearTblData: function() {
                publicFun.clrTblSelectedObj($scope.sourceUi.tableData);
            },
            onSaveSource: function() {
                commonUi.onCLickFilterClose();
               /* $('.main-headbar-slide').animate({
                            top: '-43px'
                        }, 300);*/
                        //  $('.blut-search-toggele').removeClass('go-up').addClass('go-down');
                       // $('#content1').removeClass('content-m-top40').addClass('content-m-top0');
                        $scope.headerMenuToggle = false;
                    // save the dashboard if it contains any widget
                    var saveFlag = false;
                    var refreshInterval = '0';
                    var components = JSON.parse($rootScope.userSettings.components);
                    if (components.saveExplicit) {
                        if ($rootScope.dashboard.pages.length > 0){
                            if ($rootScope.dashboard.pages[$rootScope.selectedPage-1].widgets.length > 0){
                                angular.forEach($rootScope.dashboard.pages[$rootScope.selectedPage-1].widgets,function(widget){
                                    if (widget.widgetID.toString().substr(0, 4) == "temp") {
                                        saveFlag = true;
                                    }
                                });
                            }
                        }
                    }
                    if(saveFlag){
                        if ($rootScope.dashboard.compName === undefined || $rootScope.dashboard.compName === null || $rootScope.dashboard.compName == "") {
                            $scope.generateDashboardName();
                            console.log("new dashboard");
                        } else {
                            console.log("saved dashboard");
                        }
                        if ($rootScope.dashboard.refreshInterval !== undefined){
                            refreshInterval = $rootScope.dashboard.refreshInterval.toString();
                        }
                        saveDashboardService.saveDashboard($rootScope.dashboard.compName,refreshInterval,'designView',$scope);
                    }
                //if number of widgets are lesser than 6
                var widgetLimit = 10;
                if($rootScope.dashboard.pages[$rootScope.selectedPage-1].widgets.length < widgetLimit)
                {
                    var length = $scope.sourceUi.sourceRcrd.length++;
                    var currentQry = $scope.sourceUi.selectedSource + '-' + length;
                    $scope.sourceUi.sourceRcrd.push({
                        name: currentQry,
                        id: publicFun.getRandomNo
                    });

                    //create new attribute
                    var newAttrObj = [];
                    var attrObj = $scope.sourceUi.attrObj;
                    if (attrObj !== undefined) {
                        for (var i = 0; i < attrObj.length; i++) {
                            if (!attrObj[i].isRemove) {
                                newAttrObj.push(attrObj[i]);
                            }
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

                    // if (newMeasureObj.length == 0 &&
                    //     newAttrObj.length == 0) {
                    //     publicFun.fireMessage('0', 'Please select query data...');
                    //     return;
                    // }

                    $scope.currWidget = {
                        widData: {},
                        widView: "",                       
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
                        id: Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1),
                        type: "Visualization",
                        width: '370px',
                        height: '300px',
                        mheight: '100%',
                        highchartsNG: {}
                    };

                    $csContainer.fillCSContainer({
                        //                    wid: $scope.currWidget,
                        src: $scope.sourceUi.selectedSource,
                        id: $scope.datasourceId,
                        tbl: $scope.sourceUi.selectedNameSpace,
                        fAttArr: $scope.sourceUi.attrObj,
                        fMeaArr: $scope.sourceUi.mearsuresObj,
                        filterFields: $scope.fieldObjects,
                        forecastAtt: $scope.forecastAtt
                    });

                    publicFun.clearAll(function(status) {
                        if (status) {
                            $state.go("home.QueryBuilder", {
                                widObj: {   
                                            "widgetID": null,
                                            "widgetName": $scope.currWidget.widName,
                                            "widgetData": $scope.currWidget
                                        }
                            });
                            $mdSidenav('right').close();
                        }
                    });
                    //after saving get back to first tab
                    commonUi.selectedIndex = 1;
                }
                else{
                    
                    fireMsg('0', 'Maximum Widget Limit Exceeded')
                }
            },
            // Retrieve the table name when v-accordion is expanded
            onExpandConnection: function(index) {
                $scope.sourceUi.tableData = [];
                if ($scope.mssqlConnections[index].fields === undefined) {
                    $scope.isConnectionTablesLoading = true;
                    var client = $diginengine.getClient($scope.sourceUi.selectedSource);
                    $scope.datasourceId = $scope.mssqlConnections[index].ds_config_id;
                    //call method to retrieve the tables
                    client.getConnectionTables($scope.datasourceId,function(data,status) {
                        if (status) {
                            data.sort();
                            $scope.isConnectionTablesLoading = false;
                            for (var i = 0; i < data.length; i++) {
                                $scope.sourceUi.tableData.push({
                                    'id': i,
                                    'name': data[i],
                                    'selected': false,
                                    'type' : ''
                                });
                                $rootScope.tableData = $scope.sourceUi.tableData;
                                $scope.mssqlConnections[index].fields = $scope.sourceUi.tableData;
                            }
                        } else {
                            $scope.isConnectionTablesLoading = false;
                        }
                    })
                } else {
                    $scope.sourceUi.tableData = $scope.mssqlConnections[index].fields;
                    $rootScope.tableData = $scope.sourceUi.tableData;
                }
            },
            // retrieve the fields of selected categories
            onSelectFilter: function() {
                var Keycount = 0;
                if (!$scope.filterMenuStatus){
                    $mdSidenav('filterMenu').toggle().then(function () {
                        $log.debug("toggle left is done");
                    });
                    $scope.fieldObjects = [];
                    $scope.selectedAttributes = [];
                    $scope.filterMenuStatus = true;
                }
                var query = "";
                $scope.sourceUi.selectedAttribute = $filter('orderBy')($scope.sourceUi.selectedAttribute, 'name');
                angular.forEach($scope.sourceUi.selectedAttribute,function(entry) {
                    if (!entry.isRemove){
                        if ( $scope.selectedAttributes.indexOf(entry.name) == -1 ) {
                            $scope.selectedAttributes.push(entry.name);
                            if (typeof entry.name == 'number' ) {
                                $scope.fieldObjects.push({
                                    id: "filter-" + entry.name,
                                    name: entry.name,
                                    valueArray: [],
                                    status: true
                                })                                
                            } else{
                                $scope.fieldObjects.push({
                                    id: "filter-" + entry.name.replace(/ /g,"_"),
                                    name: entry.name,
                                    valueArray: [],
                                    status: true
                                })                                
                            }
                        }
                    } else{
                        var index = $scope.selectedAttributes.indexOf(entry.name);
                        if( index > -1 ){
                            $scope.selectedAttributes.splice(index,1);
                            for (var i=0;i<$scope.fieldObjects.length;i++){
                                if ($scope.fieldObjects[i].name == entry.name){
                                    $scope.fieldObjects.splice(i,1);
                                }
                            }
                        }
                    }
                });
            },
            //Load the parameters when the v-accordion is expanded
            loadFilterParams: function(index,id) {
                var query = "";
                var table_name = $scope.sourceUi.selectedNameSpace;
                var name = "";
                for (var i=0;i<$scope.fieldObjects.length;i++) {
                    if ($scope.fieldObjects[i].id == id) {
                        if ($scope.fieldObjects[i].valueArray != 'undefined') {
                            if ($scope.fieldObjects[i].valueArray.length == 0) {
                                name = $scope.fieldObjects[i].name;
                                break;                                
                            } else {
                                return;
                            }
                        } else {
                            return;
                        }
                    }
                }
                $scope.fieldObjects[i].isLoading = true;
                if ($scope.sourceUi.selectedSource == "BigQuery") {
                    query = "SELECT " + name + " FROM " + $diginurls.getNamespace() + "." + table_name + " GROUP BY " + name;
                } else if ($scope.sourceUi.selectedSource == "MSSQL") {
                    query = "SELECT [" + name + "] FROM " + table_name + " GROUP BY [" + name + "] ORDER BY [" + name + "]";
                }
                $scope.client.getExecQuery(query, $scope.datasourceId, function(data, status) {
                    if (status) {
                        var tempArray = [];
                        for (var res in data){
                            var keyValue = data[res];
                            for (var v in keyValue){
                                var key = v;
                                var value = keyValue[v];
                                if (typeof value == 'number' ) {
                                    tempArray.push({
                                        id: value,
                                        value: value,
                                        status: true
                                    });
                                } else {
                                    tempArray.push({
                                        id: value.replace(/ /g,"_"),
                                        value: value,
                                        status: true
                                    });
                                }
                            }
                        }
                        if (tempArray.length > 0){
                            tempArray = $filter('orderBy')(tempArray, 'value');                            
                            $scope.$apply(function() {
                                $scope.fieldObjects[i].valueArray = tempArray;
                            });
                        }
                        $scope.$apply(function() {
                            $scope.fieldObjects[i].isLoading = false;
                        });
                    } else {
                        $scope.$apply(function() {
                            $scope.fieldObjects[i].isLoading = false;
                        });                        
                    }
                }, 1000);
            },
            // check and un-check check-box
            changeStatus: function(name,index,id) {
                var count = 0;
                for (var field in $scope.fieldObjects){
                    if ($scope.fieldObjects[field].name == name){
                        if ($scope.fieldObjects[field].valueArray[index].status){
                            $scope.fieldObjects[field].valueArray[index].status = false;
                        }else {
                            $scope.fieldObjects[field].valueArray[index].status = true;
                        }
                        // Check or Un-check the All option
                        for( var i=0;i<$scope.fieldObjects[field].valueArray.length;i++){
                            if($scope.fieldObjects[field].valueArray[i].status){
                                count++;
                            }
                        }
                        if (count != $scope.fieldObjects[field].valueArray.length){
                            $("#filter-"+id).removeAttr("checked"); //uncheck
                        }else {
                            $("#filter-"+id).attr("checked",true); //check
                            $("#filter-"+id).prop("checked",true); //check
                        }
                    }
                }
                
            },
            //triggered when 'All' check box is clicked
            checkAll: function(name,index,id) {
                var status = $("#filter-"+ id ).is(":checked");         
                if(status) {
                    for(var i =0; i < $scope.fieldObjects[index].valueArray.length; i++) {
                        $("#"  + id + "-" + $scope.fieldObjects[index].valueArray[i].id).attr("checked",true);
                        $("#" + id+ "-" + $scope.fieldObjects[index].valueArray[i].id).prop("checked",true);                        
                        if (!$scope.fieldObjects[index].valueArray[i].status) {
                            commonUi.changeStatus(name,i,$scope.fieldObjects[index].valueArray[i].id);
                        }
                    }
                } else {
                    for(var i =0; i < $scope.fieldObjects[index].valueArray.length; i++) {
                        $("#"+id+"-"+$scope.fieldObjects[index].valueArray[i].id).removeAttr("checked");
                        if($scope.fieldObjects[index].valueArray[i].status){
                            commonUi.changeStatus(name,i,$scope.fieldObjects[index].valueArray[i].id);
                        }
                    }
                }
            },
            onRemoveAtt: function(onSelected, data) {
                var attrObj = onSelected;
                var count = 0;
                var index = attrObj.indexOf(data);
                if (data.isRemove) {
                    $scope.sourceUi.selectedAttribute[index].
                    isRemove = false;
                    $scope.sourceUi.attrObj[index].
                    isRemove = false;
                    //check the all 'all' checkbox if all attributes are selected
                    angular.forEach( $scope.sourceUi.selectedAttribute,function(key){
                        if(!key.isRemove){
                            count++;
                        }
                    })
                    if( count == $scope.sourceUi.selectedAttribute.length ){
                        $("#attributes").attr("checked",true); //check
                        $("#attributes").prop("checked",true); //check                        
                    }                    
                } else {
                    $("#attributes").removeAttr("checked");
                    $scope.sourceUi.selectedAttribute[index].
                    isRemove = true;
                    $scope.sourceUi.attrObj[index].
                    isRemove = true;
                }

            },
            onRemoveMeasures: function(onSelected, data) {
                var attrObj = onSelected;
                var index = attrObj.indexOf(data);
                var count = 0;
                if (data.isRemove) {
                    $scope.sourceUi.selectedMeasures[index].
                    isRemove = false;
                    $scope.sourceUi.mearsuresObj[index].
                    isRemove = false;
                    //check the all 'all' checkbox if all attributes are selected
                    angular.forEach( $scope.sourceUi.selectedMeasures,function(key){
                        if(!key.isRemove){
                            count++;
                        }
                    })
                    if( count == $scope.sourceUi.selectedMeasures.length ){
                        $("#measures").attr("checked",true); //check
                        $("#measures").prop("checked",true); //check                        
                    }
                } else {
                    $("#measures").removeAttr("checked");
                    $scope.sourceUi.selectedMeasures[index].
                    isRemove = true;
                    $scope.sourceUi.mearsuresObj[index].
                    isRemove = true;
                }
            },
            //Select All ttru
            selectAllAttributes: function(){
                if ($("#attributes").is(':checked')) {
                    angular.forEach( $scope.sourceUi.selectedAttribute,function(key){
                        key.isRemove = false;
                    })
                    angular.forEach( $scope.sourceUi.attrObj,function(key){
                        key.isRemove = false;
                    })                    
                } else{
                    angular.forEach( $scope.sourceUi.selectedAttribute,function(key){
                        key.isRemove = true;
                    })
                    angular.forEach( $scope.sourceUi.attrObj,function(key){
                        key.isRemove = true;
                    })                                          
                }
            },
            selectAllMeasures: function(){
                if ($("#measures").is(':checked')) {
                    angular.forEach( $scope.sourceUi.selectedMeasures,function(key){
                        key.isRemove = false;
                    })
                    angular.forEach( $scope.sourceUi.mearsuresObj,function(key){
                        key.isRemove = false;
                    })                    
                } else{
                    angular.forEach( $scope.sourceUi.selectedMeasures,function(key){
                        key.isRemove = true;
                    })
                    angular.forEach( $scope.sourceUi.mearsuresObj,function(key){
                        key.isRemove = true;
                    })                                          
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
    }
]);

