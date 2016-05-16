/**
 * Created by Damith on 2/24/2016.
 */

routerApp.controller('dynamicallyReportCtrl', function ($scope, dynamicallyReportSrv, $auth, $location,
                                                        Digin_Report_Base, Digin_PostgreSql, $stateParams, ngToast, $sce, Digin_Tomcat_Base) {

    $scope.isFiled = {
        loading: false,
        found: false
    };

    //#event handler
    //report event handler
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
    };
    $scope.eventHandler = eventHandler;
    //end

    //#report filed
    //report data
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

    //#private function
    //controller private function
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
            capitalise: function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
            },
            waitLoadingFiled: function (filedName) {
                $scope.eventHandler.isFiledData = true;
                // $scope.isFiled.found = false;
                $scope.filedName = filedName;
            }
            ,
            doneLoadedFiled: function () {
                $scope.eventHandler.isFiledData = false;
                // $scope.eventHandler.isDataFound = false;
                // $scope.isFiled.found = true;
            }
            ,
            waitParameterRender: function () {
                $scope.isFiled.loading = true;
                $scope.isFiled.found = false;
                $scope.eventHandler.error.isGetError = false;
            }
            ,
            doneParameterRender: function () {
                $scope.isFiled.loading = false;
                $scope.isFiled.found = true;
                $scope.eventHandler.error.isGetError = false;
            }
            ,
            gotParameterRenderError: function () {
                $scope.isFiled.loading = false;
                $scope.eventHandler.error.isGetError = true;
            },
            clearAllUI: function () {
                $scope.reportFiledList.UIDate = [];
                $scope.reportFiledList.UITextBox = [];
                $scope.reportFiledList.UIDropDown = [];
                $scope.reportFiledList.selectedDrpFiled = [];
                $scope.reportFiledList.selectedDate = [];
            },
            doneReportLoad: function () {
                $scope.eventHandler = {
                    isDataFound: false,
                    isReportLoad: false,
                    isFiled: {
                        loading: false,
                        found: true
                    },
                    error: {
                        isGetError: false
                    }
                }
                $scope.reportFldLoading = false;
            },
            clearIframe: function () {
                $scope.eventHandler.isDataFound = true;
                $scope.eventHandler.isReportLoad = false;
                var frame = $('#reportFram').get(0);
                var frameDoc = frame.contentDocument || frame.contentWindow.document;
                frameDoc.getElementsByTagName('body')[0].innerHTML = "";
            }
        }
    })();
    //end

    //#oncreate #report
    $scope.onCreateReport = function () {
        serverRequest.reportCreate();
    };


    //#dropDown change selected
    //drop down on change event select
    $scope.onChangeSelected = function (filedName) {

        console.log(filedName);

        var selectedVal = $scope.selectedVal;
        //console.log($scope.reportFiledList.selectedDate);
        var currentVal = {
            data: $scope.reportFiledList.selectedDrpFiled,
            length: $scope.reportFiledList.selectedDrpFiled.length,
            filedName: filedName,
            value: ''
        }
        for (var c in selectedVal) {
            currentVal.value = selectedVal[c];
        }

        var currentFiledAry = $scope.reportFiledList.selectedDrpFiled;
        for (var i = 0; i < currentFiledAry.length; i++) {
            if (currentFiledAry[i].filedName == currentVal.filedName) {
                $scope.reportFiledList.selectedDrpFiled[i].value = currentVal.value;
            }
        }

        //get current filed data
        executeQryHandler.executeNextQuery(filedName, currentVal.value);
    };

    //#refresh
    //refresh all data
    $scope.onClickRefresh = function () {
        serverRequest.getReportUIFromServer(eventHandler);
    };

    //#onclick cancel filed load
    $scope.onClickStLoading = function () {
        privateFun.doneLoadedFiled();
    };


    //#server request
    //Main function
    var serverRequest = (function () {
        var reqParameter = {
            apiBase: Digin_Report_Base,
            reportServer: Digin_PostgreSql,
            tomCatBase: Digin_Tomcat_Base,
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
            xhr.open("GET", Digin_PostgreSql + "executeQuery?query=" + encodeURIComponent(queryString) + "&SecurityToken=" + reqParameter.token + "" +
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
                privateFun.clearIframe();
                getReportName();
                getSession();
                privateFun.clearAllUI();
                privateFun.waitParameterRender();
                dynamicallyReportSrv.getReportUI(reqParameter).success(function (data) {
                    privateFun.doneParameterRender();
                    var loop = 0;
                    for (var d in data) {
                        if (Object.prototype.hasOwnProperty.call(data, d)) {
                            var val = data[d];

                            //update line
                            //check label value Is null
                            var valLable = null;
                            if (val.Label == null || val.Label == "") {
                                valLable = val.Fieldname.toLowerCase();
                            } else {
                                valLable = val.Label.toLowerCase();
                            }

                            //get filed data
                            var dynObject = {
                                query: val.Query,
                                label: val.Fieldname,
                                fieldname: valLable,
                                data: []
                            };

                            $scope.reportFiledList.selectedDrpFiled.push({
                                'filedName': dynObject.fieldname,
                                'value': '',
                                'label': dynObject.label
                            });
                            angular.forEach(val, function (value, key) {
                                var executeQueryAryObj = {
                                    id: '',
                                    filedName: '',
                                    query: '',
                                    label: '',
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
                                        executeQueryAryObj.filedName = val.Label.toLowerCase();
                                        executeQueryAryObj.query = val.Query;
                                        if (loop == 1) {
                                            executeQueryAryObj.state = true;
                                        } else {
                                            executeQueryAryObj.state = false;
                                        }
                                        $scope.executeQueryAry.push(executeQueryAryObj);


                                        if (val.Query != "" && loop == 1) {
                                            privateFun.waitLoadingFiled(val.Label.toLowerCase());
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
                $scope.reportFldLoading = true;
                privateFun.clearIframe();
                $scope.reportURL = $sce.trustAsResourceUrl('');
                var selDrpDwnObj = $scope.reportFiledList.selectedDrpFiled;
                var datePickerObj = $scope.reportFiledList.selectedDate;

                var UI = {
                    UIDate: $scope.reportFiledList.UIDate
                };

                console.log($scope.reportFiledList.UIDate);
                if (selDrpDwnObj.length == 0 || selDrpDwnObj == 'undefined') {
                    privateFun.fireMsg('0', '<strong>Error :' +
                        ' </strong>please select the report data...');
                    return;
                }
                getReportName();
                getSession();
                reqParameter.rptParameter = '';

                //check date parameter
                for (var c in datePickerObj) {
                    var val = datePickerObj[c];
                    for (var i = 0; i < selDrpDwnObj.length; i++) {
                        if (selDrpDwnObj[i]['filedName'] == c) {
                            selDrpDwnObj[i]['value'] = val;
                        }
                    }
                }

                //create drop down report parameter
                for (var i = 0; i < selDrpDwnObj.length; i++) {
                    if (i == 0) {
                        reqParameter.rptParameter = '{"' + selDrpDwnObj[i]['label'] + '" : ' +
                            '"' + selDrpDwnObj[i]['value'] + '"}';
                    }
                    else {
                        reqParameter.rptParameter = reqParameter.rptParameter + ',{"' + selDrpDwnObj[i]['label'] + '" : ' +
                            '"' + selDrpDwnObj[i]['value'] + '"}';
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
                    var reportLink = data;
                    privateFun.doneReportLoad();
                    $scope.reportURL = $sce.trustAsResourceUrl(reportLink);
                }).error(function (res) {
                    privateFun.doneReportLoad();

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
            executeNextQuery: function (filedName, selectedVal) {
                //console.log(filedName);
                //console.log(selectedVal);
                var executeQueryAry = $scope.executeQueryAry;
                console.log(filedName);
                console.log($scope.executeQueryAry);
                for (var i = 0; i < executeQueryAry.length; i++) {
                    var nextRequst = i;
                    nextRequst++;
                    var length = $scope.reportFiledList.UIDropDown.length
                    if (executeQueryAry[i].filedName == filedName &&
                        nextRequst != executeQueryAry.length) {
                        if (i != executeQueryAry.length) {
                            if (executeQueryAry[i].query != "") {

                                privateFun.waitLoadingFiled(executeQueryAry.filedName);

                                //#nextquery
                                var nextQuery = executeQueryAry[nextRequst].query;
                                var replaceTxt = privateFun.capitalise(filedName);
                                replaceTxt = '${' + replaceTxt + '}';
                                var nextQuery = nextQuery.replace(replaceTxt, "'" + selectedVal + "'");

                                serverRequest.getExecuteQuery(nextQuery, length, function (res) {
                                    if (res.data == 500) {
                                        privateFun.fireMsg('0', '<strong>Error 500 :' +
                                            ' </strong>Report filed load error...');
                                        return;
                                    }
                                    var jsonObj = JSON.parse(res.data);
                                    var filed = [];
                                    var foundArray = 0
                                    if (jsonObj.Result.length != 0) {
                                        for (var c in jsonObj.Result) {
                                            if (Object.prototype.hasOwnProperty.call(jsonObj.Result, c)) {
                                                val = jsonObj.Result[c];
                                                angular.forEach(val, function (value, key) {
                                                    console.log(key + "," + value);
                                                    for (var lop = 0; lop < reportFiledList.UIDropDown.length; lop++) {
                                                        if (reportFiledList.UIDropDown[lop].fieldname ==
                                                            key) {
                                                            filed.push(value);
                                                            foundArray = lop;
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                        reportFiledList.UIDropDown[foundArray].data = filed;
                                    } else {
                                        privateFun.fireMsg('1', '<strong>Data not found..');

                                    }
                                    privateFun.doneLoadedFiled();

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