/**
 * Created by Damith on 5/2/2016.
 */
'use strict';
routerApp.controller('dataSourceCtrl', function($scope, $rootScope, $state, $diginengine, ngToast) {


    //#pop message
    function popUpMessage() {
        //msgType 0 = danger , 1 = success
        //msg message
        this.msgType = 0;
        this.msg = null;
        this.className = null;
    }

    //#pop message
    popUpMessage.prototype = {
        constructor: popUpMessage,
        fire: function(msgType, msg) {
            ngToast.dismiss();
            this.msgType = msgType;
            this.msg = msg;
            if (this.msgType == '0') {
                this.className = 'danger';
            } else if (this.msgType == '1') {
                this.className = 'success';
            } else if (this.msgType == '2') {
                this.className = 'info';
            }
            ngToast.create({
                className: this.className,
                content: this.msg,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                dismissOnClick: true
            });
        }
    };
    var message = new popUpMessage();

    $scope.datasources = [{
        name: "DuoStore",
        icon: "styles/css/images/data-source/duo_store.png",
        selected: false
    }, {
        name: "BigQuery",
        icon: "styles/css/images/data-source/big_query.png",
        selected: true
    }, {
        name: "CSV/Excel",
        icon: "styles/css/images/data-source/excel.png",
        selected: false
    }, {
        name: "Rest/SOAP",
        icon: "styles/css/images/data-source/api.png",
        selected: false
    }, {
        name: "MSSQL",
        icon: "styles/css/images/data-source/sql.png",
        selected: false
    }];

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
            'type': 'decimal',
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
        },

        {

            'type': 'character varying',
            'category': 'att'
        }, {

            'type': 'varchar',
            'category': 'att'
        }, {

            'type': 'character',
            'category': 'att'
        }, {

            'type': 'char',
            'category': 'att'
        }, {

            'type': 'numeric',
            'category': 'mes'
        }


    ];


    //form Element handler
    var formElement = {
        mainSearch: '',
        isSource: true,
        isTableFiled: false,
        isTable: false,
        isLoadingTbl: false,
        isLoadingFiled: false,
        screenName: 'select main source'
    };
    $scope.formElement = formElement;

    //all manage data
    var synData = {
        sourceName: 'BigQuery',
        tableName: null,
        attribute: [],
        measures: [],
        selectAttribute: [],
        selectMeasures: [],
        tables: []
    };
    $scope.synData = synData;

    //server request  handler
    //#getTable
    //#getTableFiled
    var serverRequest = {
        getTables: function(src, callback) {
            $scope.formElement.isLoadingTbl = true;
            $scope.client = $diginengine.getClient(src);
            switch (src) {
                case "BigQuery":
                    $scope.client.getTables(function(res, status) {
                        if (typeof res === 'object' && status) {
                            callback(res, status);
                            $scope.formElement.isLoadingTbl = false;
                        }
                        if (!status) {
                            message.fire('2', '<strong>WARNING : </strong>no tables available');
                            $scope.formElement.isLoadingTbl = false;
                        }
                    });
                    break;
            }
        },
        getTblFiled: function(src, tbl, callback) {
            switch (src) {
                case "BigQuery":
                    $scope.formElement.isLoadingFiled = true;
                    $scope.client.getFields(tbl, function(data, status) {
                        callback(data, status);
                    });
                    break;
            }
        }

    }; //end

    //main function
    var mainFunction = (function() {
        //go to main screen
        var goToMainScreen = function() {
            $scope.formElement.isSource = true;
            $scope.formElement.isTableFiled = false;
            $scope.formElement.isTable = false;
            $scope.formElement.screenName = 'select main source';

            //clear all selected data
            $scope.synData.tableName = null;
            $scope.synData.tables = [];
            $scope.synData.selectAttribute = [];
            $scope.synData.selectMeasures = [];
            //todo
        };
        //go to table screen
        var goToTblScreen = function(state) {
            if ($scope.synData.sourceName == 'BigQuery') {
                $scope.formElement.isSource = false;
                $scope.formElement.isTableFiled = false;
                $scope.formElement.isTable = true;
                $scope.formElement.screenName = 'select table';
                if (state == 1) {
                    $scope.synData.tables = [];
                    //todo
                    serverRequest.getTables($scope.synData.sourceName, function(res, status) {
                        if (status) {
                            for (var i = 0; i < res.length; i++) {
                                $scope.synData.tables.push({
                                    'id': i,
                                    'name': res[i],
                                    'selected': false
                                });
                            }
                        } else {
                            message.fire('2', '<strong> ERROR :</strong> No tables available....');
                        }
                    });
                }
            } else {
                message.fire('2', '<strong> WARNING :</strong> setup biqQuery only...Update version..');
            }
        };
        //go to table filed screen
        var goToTblFiledScreen = function() {
            if ($scope.synData.tableName == null ||
                typeof $scope.synData.tableName === "object") {
                message.fire('0', '<strong> ERROR :</strong> please select table....');
                return;
            }
            $scope.formElement.isSource = false;
            $scope.formElement.isTableFiled = true;
            $scope.formElement.isTable = false;
            $scope.formElement.screenName = 'select table filed';

            //get current select table data
            //todo
            $scope.synData.attribute = [];
            $scope.synData.measures = [];

            serverRequest.getTblFiled($scope.synData.sourceName,
                $scope.synData.tableName,
                function(res, status) {
                    if (status) {
                        var dataTypes = $scope.dataBaseFiledTypes;
                        for (var c in res) {
                            if (Object.prototype.hasOwnProperty.call(res, c)) {
                                var val = res[c];
                                angular.forEach(val, function(value, key) {
                                    if (key == 'FieldType') {
                                        for (var i = 0; i < dataTypes.length; i++) {
                                            if (value == dataTypes[i].type) {
                                                if (dataTypes[i].category == 'att') {
                                                    $scope.synData.attribute.push({
                                                        id: c,
                                                        name: res[c].Fieldname,
                                                        isRemove: true,
                                                        dataType: dataTypes[i].type
                                                    })
                                                } else {
                                                    $scope.synData.measures.push({
                                                        id: c,
                                                        name: res[c].Fieldname,
                                                        isRemove: true,
                                                        dataType: dataTypes[i].type
                                                    })
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    } else {
                        message.fire('2', '<strong> WARNING :</strong> no tables filed available....');
                    }
                    $scope.formElement.isLoadingFiled = false;
                });
        };
        //go to final screen
        var goToFinalScreen = function() {
            $scope.synData.selectMeasures = [];
            $scope.synData.selectAttribute = [];
            $rootScope.algoSource = [];
            //choose selected attribute
            for (var i = 0; i < $scope.synData.attribute.length; i++) {
                if ($scope.synData.attribute[i].isRemove) {
                    $scope.synData.selectAttribute.push($scope.synData.attribute[i]);
                }
            }
            //choose selected measures
            for (var i = 0; i < $scope.synData.measures.length; i++) {
                if ($scope.synData.measures[i].isRemove) {
                    $scope.synData.selectMeasures.push($scope.synData.measures[i]);
                }
            }

            if ($scope.synData.selectMeasures.length == 0 &&
                $scope.synData.selectAttribute.length == 0) {
                message.fire('0', '<strong>ERROR : </strong>Please select the table filed...');
                return;
            } else {
                console.log("done....!");
                var finalData = {
                    attribute: $scope.synData.selectAttribute,
                    measures: $scope.synData.selectMeasures,
                    dataSource: $scope.synData.sourceName,
                    tableName: $scope.synData.tableName,
                    data: []
                }
                $rootScope.algoSource.push(finalData);
                $state.go('home.commonSrcAlgorithm');
            }


        };
        return {
            onLoad: function() {
                // all element onLoad event setting
                $scope.formElement = formElement;
            },
            goToNextScreen: function() {
                if (formElement.isSource) {
                    goToTblScreen(1);
                    return;
                }
                if (formElement.isTable) {
                    goToTblFiledScreen();
                    return;
                }

                if (formElement.isTableFiled) {
                    goToFinalScreen();
                    return;
                }
            },
            goToBackScreen: function() {
                if (formElement.isTableFiled) {
                    goToTblScreen(0);
                    return;
                }
                if (formElement.isTable) {
                    goToMainScreen(1);
                    return;
                }

            },
            goToFinalScreen: function() {
                goToFinalScreen();
                return;
            }
        }
    })();
    mainFunction.onLoad();


    //#Onchange
    //#main source
    //#table
    //#attribute #measure
    function ChangeSource(source, dataSource) {
        this.source = source;
        this.dataSource = dataSource;
    }

    ChangeSource.prototype = {
        constructor: ChangeSource,
        change: function() {
            for (var i = 0; i < this.dataSource.length; i++) {
                this.dataSource[i].selected = false;
                if (this.source.name == this.dataSource[i].name) {
                    this.selectIndex = i;
                }
            }
            $scope.datasources[this.selectIndex].selected = true;
            $scope.synData.sourceName = this.dataSource[this.selectIndex].name;
        }
    }; //end

    //#table
    function ChangeTbl(selectTbl, tblSource) {
        this.selectTbl = selectTbl;
        this.tblSource = tblSource;
        this.selectIndex = 0;
    }

    ChangeTbl.prototype = {
        constructor: ChangeTbl,
        change: function() {
            for (var i = 0; i < this.tblSource.length; i++) {
                this.tblSource[i].selected = false;
                if (this.selectTbl.name == this.tblSource[i].name) {
                    this.selectIndex = i;
                }
            }
            $scope.synData.tables[this.selectIndex].selected = true;
            $scope.synData.tableName = this.tblSource[this.selectIndex].name;
        }
    }; //end

    //#attribute #measure
    function ChangeTableFiled(crtFiled, proSource, proName) {
        this.crtFiled = crtFiled;
        this.filedSource = proSource;
        this.fileType = proName;
        this.selectIndex = 0;
    }

    ChangeTableFiled.prototype = {
        constructor: ChangeTableFiled,
        change: function() {
            var selectFiled = null;
            if (this.fileType == 'attr') {
                selectFiled = $scope.synData.attribute;
            } else {
                selectFiled = $scope.synData.measures;
            }
            for (var i = 0; i < selectFiled.length; i++) {
                if (this.crtFiled.name == this.filedSource[i].name) {
                    if (this.fileType == 'attr') {
                        $scope.synData.attribute[i].isRemove =
                            this.crtFiled.isRemove ? false : true;
                    } else {
                        $scope.synData.measures[i].isRemove =
                            this.crtFiled.isRemove ? false : true;
                    }
                }
            }
        }
    }; //end

    //main event handler
    $scope.eventHandler = {
            goToNextScreen: function(state) {
                mainFunction.goToNextScreen();
            },
            goToBackScreen: function() {
                mainFunction.goToBackScreen();
            },
            onClickSource: function(newSource, dataSource) {
                var changeSource = new ChangeSource(newSource, dataSource);
                changeSource.change();
            },
            onClickTbl: function(selectTbl, tblSource) {
                var changeTbl = new ChangeTbl(selectTbl, tblSource);
                changeTbl.change();
            },
            onClickTbleFiled: function(crtSelect, proSource, proName) {
                var changeTblPro = new ChangeTableFiled(crtSelect, proSource, proName);
                changeTblPro.change();
            }
        } //end


}); //end main controller
