/**
 * Created by Damith on 2/24/2016.
 */

routerApp.controller('dynamicallyReportCtrl', function ($scope, dynamicallyReportSrv, $auth, $location,
                                                        Digin_Report_Base, Digin_PostgreSql, $stateParams, ngToast, $sce) {


    $scope.isFiled = {
        loading: false,
        found: false
    };


    var eventHandler = {
        reportName: '',
        isReportLoad: false,
        isFiled: {
            loading: false,
            found: false
        },
        error: {
            isGetError: false,
            msg: ''
        },
        isFiledData: false,
        isDataFound: true
        //select2Options: {
        //    formatNoMatches: function (term) {
        //        console.log("Term: " + term);
        //        var message = '<a ng-click="addTag()">Add tag:"' + term + '"</a>';
        //        if (!$scope.$$phase) {
        //            $scope.$apply(function () {
        //                $scope.noResultsTag = term;
        //            });
        //        }
        //        return message;
        //    }
        //},
    };
    $scope.eventHandler = eventHandler;

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
                    dismissOnClick: true,
                    timeout: 3000,
                });
            },
            waitLoadingFiled: function (filedName) {
                $scope.eventHandler.isFiledData = true;
                // $scope.isFiled.found = false;
                $scope.filedName = filedName;
            },
            doneLoadedFiled: function () {
                $scope.eventHandler.isFiledData = false;
                // $scope.isFiled.found = true;
            },
            waitParameterRender: function () {
                $scope.isFiled.loading = true;
                $scope.isFiled.found = false;
                $scope.eventHandler.error.isGetError = false;
            },
            doneParameterRender: function () {
                $scope.isFiled.loading = false;
                $scope.isFiled.found = true;
                $scope.eventHandler.error.isGetError = false;
            },
            gotParameterRenderError: function () {
                $scope.isFiled.loading = false;
                $scope.eventHandler.error.isGetError = true;
            }

        }
    })();

    //test function
    $scope.testClickevent = function () {
        serverRequest.reportCreate();
    };


    //#change selected
    $scope.onChangeSelected = function (filedName) {
        var selectedVal = $scope.selectedVal;

        //get current filed data
        executeQryHandler.executeNextQuery(filedName);

        $scope.reportFiledList.selectedDrpFiled = [];
        //console.log($scope.reportFiledList.selectedDate);
        var currentVal = {
            data: $scope.reportFiledList.selectedDrpFiled,
            length: $scope.reportFiledList.selectedDrpFiled.length,
            filedName: filedName
        }
        for (var c in selectedVal) {
            currentVal.data.push({'filedName': currentVal.filedName, 'value': selectedVal[c]})
        }
        $scope.reportFiledList.selectedDrpFiled = currentVal.data;
    };

    //refresh all data
    $scope.onClickRefresh = function () {
        serverRequest.getReportUIFromServer(eventHandler);
    };

    //Main function
    var serverRequest = (function () {
        var reqParameter = {
            apiBase: Digin_Report_Base,
            reportServer: Digin_PostgreSql,
            token: '',
            reportName: '',
            queryFiled: '',
            rptParameter: ''

        };
        var getSession = function () {
            reqParameter.token = getCookie("securityToken");
        };
        var getReportName = function () {
            var reportName = $stateParams['reportNme'];
            if (reportName == null || reportName == '') {
                alert('invalid report name');
            } else {
                reqParameter.reportName = reportName;
                $scope.eventHandler.reportName = reportName;
            }
        };
        //get queries
        var getQueries = function (reqParameter, response) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    response({'code': xhttp.status, 'data': xhttp.responseText});
                } else {
                    response({'code': xhttp.status, 'data': xhttp.responseText});
                }
            };
            xhttp.open("GET", reqParameter.apiBase + 'getQueries?SecurityToken=' + reqParameter.token +
                '&Domain=duosoftware.com&Reportname=' + reqParameter.reportName +
                '&fieldnames={' + reqParameter.queryFiled + '}', true);
            xhttp.send();
        };

        //Execute query
        var getExecuteQuery = function (queryString, length, data) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        data({'code': 200, 'length': length - 1, 'data': xhr.response});
                    } else {
                        console.error("XHR didn't work: ", xhr.status);
                        data({'code': xhr.status, 'data': xhr.status});
                    }
                }
            };
            xhr.ontimeout = function () {
                console.error("request timedout: ", xhr);
                data({'code': 500, 'data': 'request timedout'});
            };
            xhr.open("GET", Digin_PostgreSql + "executeQuery?query=" + queryString + "&SecurityToken=" + reqParameter.token + "" +
                "&Domain=duosoftware.com&db=PostgreSQL", /*async*/ true);
            xhr.send();
        };


        var bindingToData = function (res, filedName, list, length) {
            if (res.code == 200) {
                switch (list) {
                    case 'dropDown':
                        reportFiledList.UIDropDown[length].data.push(
                            res.data.Result
                        );
                        break;
                }
            }
        };
        return {
            getExecuteQuery: function (queryString, length, data) {
                return getExecuteQuery(queryString, length, data);
            },
            getReportName: function () {
                return getReportName();
            },
            getReportUIFromServer: function (eventHandler) {
                getReportName();
                getSession();

                privateFun.waitParameterRender();
                dynamicallyReportSrv.getReportUI(reqParameter).success(function (data) {
                    privateFun.doneParameterRender();
                    var loop = 0;
                    for (var d in data) {
                        if (Object.prototype.hasOwnProperty.call(data, d)) {
                            var val = data[d];
                            var dynObject = {
                                query: val.Query,
                                fieldname: val.FieldName.toLowerCase(),
                                data: []
                            };
                            angular.forEach(val, function (value, key) {
                                var executeQueryAryObj = {
                                    id: '',
                                    filedName: '',
                                    query: '',
                                    state: false,
                                };
                                switch (value) {
                                    case 'datepicker':
                                        reportFiledList.UIDate.push(dynObject);
                                        break;
                                    case 'textbox':
                                        reportFiledList.UITextBox.push(dynObject);
                                        break;
                                    case 'dropdown':
                                        loop++;
                                        reportFiledList.UIDropDown.push(dynObject);
                                        length = reportFiledList.UIDropDown.length;

                                        executeQueryAryObj.id = loop;
                                        executeQueryAryObj.filedName = val.FieldName.toLowerCase();
                                        executeQueryAryObj.query = val.Query;
                                        if (loop == 1) {
                                            executeQueryAryObj.state = true;
                                        } else {
                                            executeQueryAryObj.state = false;
                                        }
                                        $scope.executeQueryAry.push(executeQueryAryObj);


                                        if (val.Query != "" && loop == 1) {
                                            privateFun.waitLoadingFiled(val.FieldName);
                                            getExecuteQuery(val.Query, length, function (res) {
                                                if (res.data == 500) {
                                                    privateFun.fireMsg('0', '<strong>Error 500 :' +
                                                        ' </strong>Report filed load error...');
                                                    return;
                                                }
                                                var jsonObj = JSON.parse(res.data);
                                                var filed = [];
                                                for (var c in jsonObj.Result) {
                                                    if (Object.prototype.hasOwnProperty.call(jsonObj.Result, c)) {
                                                        val = jsonObj.Result[c];
                                                        angular.forEach(val, function (value, key) {
                                                            console.log(key + "," + value);
                                                            for (var lop = 0; lop < reportFiledList.UIDropDown.length; lop++) {
                                                                if (reportFiledList.UIDropDown[lop].fieldname ==
                                                                    key) {
                                                                    filed.push(value);
                                                                }
                                                            }

                                                        });
                                                    }
                                                }
                                                privateFun.doneLoadedFiled();
                                                reportFiledList.UIDropDown[res.length].data = filed;
                                            });
                                        }
                                        break;
                                }
                            });
                        }
                    }
                }).error(function (respose) {
                    privateFun.gotParameterRenderError();
                });
            },
            reportCreate: function () {
                var selDrpDwnObj = $scope.reportFiledList.selectedDrpFiled;
                var datePickerObj = $scope.reportFiledList.selectedDate;

                var UI = {
                    UIDate: $scope.reportFiledList.UIDate
                }

                console.log($scope.reportFiledList.UIDate);
                if (selDrpDwnObj.length == 0 || selDrpDwnObj == 'undefined') {
                    privateFun.fireMsg('0', '<strong>Error :' +
                        ' </strong>please select the report data...');
                    return;
                }
                getReportName();
                getSession();
                reqParameter.rptParameter = '';
                //create drop down report parameter
                for (var i = 0; i < selDrpDwnObj.length; i++) {
                    if (i == 0) {
                        reqParameter.rptParameter = "'" + selDrpDwnObj[i]['filedName'] + "' : " +
                            "'" + selDrpDwnObj[i]['value'] + "'";
                    }
                    else {
                        reqParameter.rptParameter = reqParameter.rptParameter + ",'" + selDrpDwnObj[0] + "'";
                    }
                }//end

                //create date parameter
                if (UI.UIDate.length > 0) {
                    //has date parameter
                    if (datePickerObj.length > 0) {
                        for (var i = 0; i < datePickerObj.length; i++) {
                            if (i == 0) {

                            }
                        }
                    }
                }//end

                //HTTP get report
                $scope.eventHandler = {
                    isDataFound: false,
                    isReportLoad: true,
                    isFiled: {
                        loading: true,
                        found: false
                    }
                };

                dynamicallyReportSrv.getRenderReport(reqParameter).success(function (data) {
                    if (data.Is_Success) {
                        $scope.eventHandler = {
                            isReportLoad: false,
                        };
                        $scope.eventHandler = {
                            isDataFound: false,
                            isReportLoad: false,
                            isFiled: {
                                loading: false,
                                found: true
                            }
                        };
                        var reportLink = data.Custom_Message;
                        $scope.reportURL = $sce.trustAsResourceUrl(reportLink);
                    }

                }).error(function (res) {
                    $scope.eventHandler = {
                        isDataFound: false,
                        isReportLoad: false,
                        isFiled: {
                            loading: false,
                            found: false
                        },
                        error: {
                            isGetError: true
                        }
                    };
                });
            }
        }
    })();
    serverRequest.getReportUIFromServer(eventHandler);


    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
    };
    var reportFiledList = {
        UIDate: [],
        UITextBox: [],
        UIDropDown: [],
        UIElement: [],
        selectedDrpFiled: [],
        selectedDate: [],
        fromDate: '',
        toDate: '',
        cafDate: '',
        tags: [
            {id: 0, name: "SKY"},
            {id: 1, name: "SKY2"}],
        customerNames: [
            {id: 0, name: 'RAJESWARI N'},
            {id: 1, name: 'CHANDRASEKAR K'},
            {id: 2, name: 'ANITHA B'},
            {id: 3, name: 'ANANDALATCHOUMY S'},
            {id: 4, name: 'ANURADHA R'},
            {id: 5, name: 'VENKATESAN A'},
            {id: 6, name: 'MURUGESAN S'},
            {id: 7, name: 'GANESAN S'},
            {id: 8, name: 'THIRUMANGAI G'}
        ]
    };
    $scope.reportFiledList = reportFiledList;


    //test code
    $scope.noResultsTag = null;
    $scope.addTag = function () {
        $scope.tags.push({
            id: $scope.tags.length,
            name: $scope.noResultsTag
        });
    };
    $scope.$watch('noResultsTag', function (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
            $timeout(function () {
                var noResultsLink = $('.select2-no-results');
                console.log(noResultsLink.contents());
                $compile(noResultsLink.contents())($scope);
            });
        }
    }, true);


    //select report parameter
    $scope.selectedVal = {};

    $scope.onText = function () {
        console.log($scope.selectedVal);
    }


    //#execute query handler
    $scope.executeQueryAry = [];
    var executeQryHandler = (function () {
        return {
            executeNextQuery: function (filedName) {
                var executeQueryAry = $scope.executeQueryAry;
                console.log(filedName);
                console.log($scope.executeQueryAry);
                for (var i = 0; i < executeQueryAry.length; i++) {
                    if (executeQueryAry[i].filedName == filedName) {
                        if (i != executeQueryAry.length) {
                            if (executeQueryAry[i].query != "") {
                                var length = $scope.reportFiledList.UIDropDown.length
                                privateFun.waitLoadingFiled(executeQueryAry.filedName);
                                var nextRequst = i;
                                nextRequst++;
                                serverRequest.getExecuteQuery(executeQueryAry[nextRequst].query, length, function (res) {
                                    if (res.data == 500) {
                                        privateFun.fireMsg('0', '<strong>Error 500 :' +
                                            ' </strong>Report filed load error...');
                                        return;
                                    }
                                    var jsonObj = JSON.parse(res.data);
                                    var filed = [];
                                    for (var c in jsonObj.Result) {
                                        if (Object.prototype.hasOwnProperty.call(jsonObj.Result, c)) {
                                            val = jsonObj.Result[c];
                                            angular.forEach(val, function (value, key) {
                                                console.log(key + "," + value);
                                                for (var lop = 0; lop < reportFiledList.UIDropDown.length; lop++) {
                                                    if (reportFiledList.UIDropDown[lop].fieldname ==
                                                        key) {
                                                        filed.push(value);
                                                    }
                                                }

                                            });
                                        }
                                    }
                                    privateFun.doneLoadedFiled();
                                    reportFiledList.UIDropDown[res.length].data = filed;
                                });
                            }

                        }

                    }
                }
            }
        };
    })();

}).directive("select2", function ($timeout, $parse) {
    return {
        restrict: 'AC',
        require: 'ngModel',
        link: function (scope, element, attrs) {
            console.log(attrs);
            $timeout(function () {
                element.select2();
                element.select2Initialized = true;
            });
        }
    };
}).directive("datepicker", function () {
    return {
        restrict: "A",
        link: function (scope, el, attr) {
            el.datepicker({
                dateFormat: 'yy-mm-dd'
            });
        }
    };
})
