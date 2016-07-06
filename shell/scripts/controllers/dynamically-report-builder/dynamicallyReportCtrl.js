/**
 * Created by Damith on 2/24/2016.
 */

routerApp.controller('dynamicallyReportCtrl', function ($scope, dynamicallyReportSrv, $auth, $location,
                                                        Digin_Engine_API, $stateParams, ngToast, $sce, Digin_Tomcat_Base, $state, Digin_Domain) {

    $scope.isFiled = {
        loading: false,
        found: false
    };

    //#event handler
    //report event handler
    $scope.onClickBack = function () {
        $state.go('home.Dashboards');
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
        isDataFound: true,

        onClickBack: function () {
            $state.go('home.Dashboards');
        }
    };
    $scope.eventHandler = eventHandler;
    //end

    //#report filed
    //report data
    var reportFiledList = {
        UIDate: [],
        currentDateFiledName: [],
        UITextBox: [],
        UIDropDown: [],
        UIElement: [],
        selectedDrpFiled: [],
        selectedDate: [],
        isDateFound: false,
        isDropDownFound: false,
        fromDate: '',
        toDate: '',
        cafDate: '',
        tags: [{
            id: 0,
            name: "SKY"
        }, {
            id: 1,
            name: "SKY2"
        }],
        customerNames: [{
            id: 0,
            name: 'RAJESWARI N'
        }, {
            id: 1,
            name: 'CHANDRASEKAR K'
        }, {
            id: 2,
            name: 'ANITHA B'
        }, {
            id: 3,
            name: 'ANANDALATCHOUMY S'
        }, {
            id: 4,
            name: 'ANURADHA R'
        }, {
            id: 5,
            name: 'VENKATESAN A'
        }, {
            id: 6,
            name: 'MURUGESAN S'
        }, {
            id: 7,
            name: 'GANESAN S'
        }, {
            id: 8,
            name: 'THIRUMANGAI G'
        }]
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
            waitLoadingFiled: function () {
                $scope.eventHandler.isFiledData = true;
                //$scope.isFiled.found = false;
            },
            doneLoadedFiled: function () {
                $scope.$apply(function () {
                    $scope.eventHandler.isFiledData = false;
                    $scope.isFiled.found = true;
                });
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
                $scope.reportURL = $sce.trustAsResourceUrl('');
                var frame = $('#reportFram').get(0);
                var frameDoc = frame.contentDocument || frame.contentWindow.document;
                frameDoc.getElementsByTagName('body')[0].innerHTML = "";
            },
            getNumberOfMonth: function (month) {
                switch (month.toLowerCase()) {
                    case "january":
                        return '01';
                        break;
                    case "february":
                        return '02';
                        break;
                    case "march":
                        return '03';
                        break;
                    case "april":
                        return '04';
                        break;
                    case "may":
                        return '05';
                        break;
                    case "june":
                        return '06';
                        break;
                    case "july":
                        return '07';
                        break;
                    case "august":
                        return '08';
                        break;
                    case "september":
                        return '09';
                        break;
                    case "october":
                        return '10';
                        break;
                    case "november":
                        return '11';
                        break;
                    case "december":
                        return '12';
                        break;
                    case "all":
                        return '00';
                        break;
                }
            }
        }
    })();
    //end

    //#oncreate #report
    $scope.onCreateReport = function () {
        serverRequest.reportCreate();
    };

    $scope.formData = {};
    $scope.formData = {
        parameters: {}
    };

    //#dropDown change selected
    //drop down on change event select
    $scope.onChangeSelected = function (filedName) {
        var e = document.getElementById(filedName);
        var select_value = e.options[e.selectedIndex].text;
        //console.log($scope.reportFiledList.selectedDate);


        //this function work on filedname must need month or months
        //get number of month
        if (filedName == 'month' || filedName == "months") {
            select_value = privateFun.getNumberOfMonth(select_value);
        }

        var currentVal = {
            data: $scope.reportFiledList.selectedDrpFiled,
            length: $scope.reportFiledList.selectedDrpFiled.length,
            filedName: filedName,
            value: select_value
        };

        var currentFiledAry = $scope.reportFiledList.selectedDrpFiled;
        for (var i = 0; i < currentFiledAry.length; i++) {
            if (currentFiledAry[i].filedName == currentVal.filedName) {
                $scope.reportFiledList.selectedDrpFiled[i].value = currentVal.value;
            }
        }

        var executeQueryAry = $scope.executeQueryAry;

        var findIndex = 0;
        for (var loop = 0; loop < executeQueryAry.length; loop++) {
            if (executeQueryAry[loop].ParamName == filedName) {
                findIndex = loop;
                findIndex++;
            }
        }

        //check next query isHierarchy
        //then true execute query
        if (findIndex < executeQueryAry.length) {
            if (executeQueryAry[findIndex].isHierarchy) {
                executeQryHandler.executeNextQuery(filedName, currentVal.value, findIndex);
            }
        }

    };

    //#refresh
    //refresh all data
    $scope.onClickRefresh = function () {
        serverRequest.refresh();
    };

    //#onclick cancel filed load
    $scope.onClickStLoading = function () {
        privateFun.doneLoadedFiled();
    };


    //#server request
    //Main function
    $scope.reportName = null;
    var serverRequest = (function () {
        var reqParameter = {
            apiBase: Digin_Engine_API,
            reportServer: Digin_Engine_API,
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
                $scope.reportName = reportName;
            }
        };
        //get queries
        var getQueries = function (reqParameter, response) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    response({
                        'code': xhttp.status,
                        'data': xhttp.responseText
                    });
                } else {
                    response({
                        'code': xhttp.status,
                        'data': xhttp.responseText
                    });
                }
            };
            xhttp.open("GET", reqParameter.apiBase + 'getQueries?SecurityToken=' + reqParameter.token +
                '&Domain=' + Digin_Domain + '&Reportname=' + reqParameter.reportName +
                '&fieldnames={' + reqParameter.queryFiled + '}', true);
            xhttp.send();
        };

        //Execute query
        var getExecuteQuery = function (queryString, length, data) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        data({
                            'code': 200,
                            'length': length - 1,
                            'data': xhr.response
                        });
                    } else {
                        console.error("XHR didn't work: ", xhr.status);
                        data({
                            'code': xhr.status,
                            'data': xhr.status
                        });
                    }
                }
            };
            xhr.ontimeout = function () {
                console.error("request timedout: ", xhr);
                data({
                    'code': 500,
                    'data': 'request timedout'
                });
            };
            xhr.open("GET", Digin_Engine_API + "executeQuery?query=" + encodeURIComponent(queryString) + "&SecurityToken=" + reqParameter.token + "" +
                "&Domain=" + Digin_Domain + "&db=PostgreSQL", /*async*/ true);
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
                            //var valLable = null;
                            //if (val.Label == null || val.Label == "") {
                            //    valLable = val.Fieldname;
                            //} else {
                            //    valLable = val.Label;
                            //}

                            //get filed data
                            var dynObject = {
                                query: val.Query,
                                label: val.Fieldname,
                                fieldname: val.Fieldname,
                                isHierarchy: val.isHierarchy,
                                ParamName: val.ParamName,
                                data: []
                            };

                            $scope.reportFiledList.selectedDrpFiled.push({
                                'filedName': dynObject.fieldname,
                                'value': '',
                                'label': dynObject.label,
                                'isHierarchy': dynObject.isHierarchy,
                                'ParamName': dynObject.ParamName
                            });
                            angular.forEach(val, function (value, key) {
                                var executeQueryAryObj = {
                                    id: '',
                                    filedName: '',
                                    query: '',
                                    label: '',
                                    state: false,
                                    isHierarchy: val.isHierarchy,
                                    ParamName: val.ParamName
                                };

                                switch (value) {
                                    case 'datepicker':
                                        reportFiledList.UIDate.push(dynObject);
                                        reportFiledList.currentDateFiledName.push(dynObject.fieldname);
                                        reportFiledList.isDateFound = true;
                                        break;
                                    case 'textbox':
                                        reportFiledList.UITextBox.push(dynObject);
                                        break;
                                    case 'dropdown':
                                        loop++;
                                        reportFiledList.UIDropDown.push(dynObject);
                                        reportFiledList.isDropDownFound = true;
                                        length = reportFiledList.UIDropDown.length;

                                        executeQueryAryObj.id = loop;
                                        executeQueryAryObj.filedName = val.Label.toLowerCase();
                                        executeQueryAryObj.query = val.Query;
                                        //if (loop == 1) {
                                        //    executeQueryAryObj.state = true;
                                        //} else {
                                        //    executeQueryAryObj.state = false;
                                        //}
                                        $scope.executeQueryAry.push(executeQueryAryObj);

                                        //if (val.Query != "" && loop == 1) {
                                        privateFun.waitLoadingFiled();
                                        getExecuteQuery(val.Query, length, function (res) {
                                            if (res.data == 500) {
                                                privateFun.fireMsg('0', '<strong>Error 500 :' +
                                                    ' </strong>Report filed load error...');
                                                return;
                                            }
                                            var jsonObj = JSON.parse(res.data);
                                            var filed = [];
                                            privateFun.doneLoadedFiled();
                                            for (var c in jsonObj.Result) {
                                                if (Object.prototype.hasOwnProperty.call(jsonObj.Result, c)) {
                                                    val = jsonObj.Result[c];
                                                    angular.forEach(val, function (value, key) {
                                                        if (key == "value") {
                                                            if (value == "All") {
                                                                value = "00";
                                                            }
                                                        }
                                                        //  console.log(key + "," + value);
                                                        if (value != "sort" && value != "1" && value != "2" && value != "3" && value != "4"
                                                            && value != "5" && value != "6" && value != "7" && value != "8"
                                                            && value != "9" && value != "10" && value != "11" && value != "12"
                                                            && value != "01" && value != "02" && value != "03" && value != "05"
                                                            && value != "04" && value != "13" && value != "00"
                                                            && value != "06" && value != "07" && value != "08" && value != "09") {
                                                            filed.push(value);
                                                        }

                                                    });
                                                }
                                            }

                                            reportFiledList.UIDropDown[res.length].data = filed;
                                        });
                                        //  }
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
                $('iframe').contents().find("body").css("background-color", "#fff");
                privateFun.clearIframe();
                $scope.reportURL = $sce.trustAsResourceUrl('');
                var selDrpDwnObj = $scope.reportFiledList.selectedDrpFiled;
                var datePickerObj = $scope.reportFiledList.selectedDate;

                var UI = {
                    UIDate: $scope.reportFiledList.UIDate
                };

                //#report validation
                // date validation
                if ($scope.reportFiledList.isDateFound) {
                    var dateSelectEmpty = 0;
                    if (Object.keys(datePickerObj).length == 0) {
                        dateSelectEmpty = 2;
                    } else if (Object.keys(datePickerObj).length == 1) {
                        dateSelectEmpty = 2;
                    } else {
                        for (var c in  datePickerObj) {
                            var temp = datePickerObj[c];
                            if (temp == null || temp == "") {
                                if (dateSelectEmpty != 2) {
                                    dateSelectEmpty++;
                                }
                            }
                        }
                    }

                    if (dateSelectEmpty == 2 || dateSelectEmpty == 1) {
                        privateFun.fireMsg('0', '<strong>Error :' +
                            ' </strong>please select the report date parameter...');
                        privateFun.doneReportLoad();
                        return;
                    }
                }

                //drop down validation
                var validationState = false;
                var loop;
                loop = $scope.reportFiledList.isDateFound ? 2 : 0;
                if ($scope.reportFiledList.isDropDownFound) {
                    for (loop; loop < selDrpDwnObj.length; loop++) {
                        if (selDrpDwnObj[loop].value != "") {
                            validationState = true;
                        }
                    }
                    if (!validationState) {
                        privateFun.fireMsg('0', '<strong>Error :' +
                            ' </strong>please select the report  parameter...');
                        privateFun.doneReportLoad();
                        return;
                    }
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
                //retain the value of All as "00" only for month parameter.
                for (var i = 0; i < selDrpDwnObj.length; i++) {
                    if (selDrpDwnObj[i]['ParamName'] != "Month" && selDrpDwnObj[i]['value'] == "00")
                        {
                            selDrpDwnObj[i]['value'] = "All";
                        }
                    if (selDrpDwnObj[i]['ParamName'] == "Month"){
                        selDrpDwnObj[i]['value'] = privateFun.getNumberOfMonth(selDrpDwnObj[i]['value']);
                    }
                    if (i == 0) {
                        reqParameter.rptParameter = '{"' + selDrpDwnObj[i]['ParamName'] + '" : ' +
                            '"' + selDrpDwnObj[i]['value'] + '"}';
                    } else {
                        reqParameter.rptParameter = reqParameter.rptParameter + ',{"' + selDrpDwnObj[i]['ParamName'] + '" : ' +
                            '"' + selDrpDwnObj[i]['value'] + '"}';
                    }
                } //end

                //enocde parameter string (/)
                console.log(reqParameter.rptParameter);
                var reqParam = reqParameter.rptParameter;
                console.log(reqParam.indexOf('/') > -1);
                if (reqParam.indexOf('/') > -1){
                    reqParam = reqParam.split('/').join('%252F');
                }
                reqParameter.rptParameter = reqParam;
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
            },
            refresh: function () {
                privateFun.clearIframe();
                $("select").val("");
                $('.datep').val("");
                var selDrpDwnObj = $scope.reportFiledList.selectedDrpFiled;
                $scope.reportFiledList.selectedDate = [];
                for (var loop = 0; loop < selDrpDwnObj.length; loop++) {
                    $scope.reportFiledList.selectedDrpFiled[loop].value = "";
                }

                $('iframe').contents().find("body").css("background-color", "#fff");
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


    //#execute query handler
    $scope.executeQueryAry = [];
    var executeQryHandler = (function () {
        return {
            executeNextQuery: function (filedName, selectedVal, findIndex) {
                //console.log(filedName);
                //console.log(selectedVal);
                var executeQueryAry = $scope.executeQueryAry;
                for (var i = 0; i < executeQueryAry.length; i++) {
                    var nextRequst = i;
                    nextRequst++;
                    var length = $scope.reportFiledList.UIDropDown.length;
                    if (executeQueryAry[i].ParamName == filedName &&
                        nextRequst != executeQueryAry.length) {
                        if (i != executeQueryAry.length) {
                            if (executeQueryAry[i].query != "") {

                                privateFun.waitLoadingFiled();

                                //#nextquery
                                var nextQuery = executeQueryAry[nextRequst].query;
                                //var replaceTxt = privateFun.capitalise(filedName);
                                var replaceTxt = '${' + filedName + '}';
                                var nextQuery = nextQuery.replace(replaceTxt, "'" + selectedVal + "'");
                                //nextQuery = nextQuery.replace('All', selectedVal);

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
                                                    //console.log(key + "," + value);
                                                    if (key == "value") {
                                                        if (value == "All") {
                                                            value = "00";
                                                        }
                                                    }
                                                    //  console.log(key + "," + value);
                                                    if (value != "sort" && value != "1" && value != "2" && value != "3" && value != "4"
                                                        && value != "5" && value != "6" && value != "7" && value != "8"
                                                        && value != "9" && value != "10" && value != "11" && value != "12"
                                                        && value != "01" && value != "02" && value != "03" && value != "05"
                                                        && value != "04" && value != "13" && value != "00"
                                                        && value != "06" && value != "07" && value != "08" && value != "09") {
                                                        filed.push(value);
                                                    }
                                                });
                                            }
                                        }
                                        reportFiledList.UIDropDown[findIndex].data = [];
                                        setTimeout(function () {
                                            $scope.reportFiledList.UIDropDown[findIndex].data = filed;
                                        }, 10);

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
            $timeout(function () {
                element.select2();
                // element.select2Initialized = true;
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

