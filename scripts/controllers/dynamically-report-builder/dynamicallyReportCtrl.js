/**
 * Created by Damith on 2/24/2016.
 */

routerApp.controller('dynamicallyReportCtrl', function ($scope, dynamicallyReportSrv, $auth, $location,
                                                        Digin_Report_Base, Digin_PostgreSql) {

    var eventHandler = {
        isFiled: {
            loading: false,
            found: false
        },
        error: {
            isGetError: false,
            msg: ''
        },
        isDataFound: true,
        onChangeRadioBtn: function () {
            var val = privateFun.onChangeRadio();
        },
        select2Options: {
            formatNoMatches: function (term) {
                console.log("Term: " + term);
                var message = '<a ng-click="addTag()">Add tag:"' + term + '"</a>';
                if (!$scope.$$phase) {
                    $scope.$apply(function () {
                        $scope.noResultsTag = term;
                    });
                }
                return message;
            }
        },
        onClickBack: function () {
            alert('on click back..');
        },
        onClickRefresh: function () {
            serverRequest.getReportUIFromServer(eventHandler);
        }
    };
    $scope.eventHandler = eventHandler;

    //Main function
    var serverRequest = (function () {
        var reqParameter = {
            apiBase: Digin_Report_Base,
            token: '',
            reportName: '',
            queryFiled: ''
        };
        var getSession = function () {
            var parametersReturnedFromAuth = $auth.getSession();
            reqParameter.token = parametersReturnedFromAuth.SecurityToken
        };
        var getReportName = function () {
            var urlString = $location.search();
            if (urlString.reportNme == null || urlString.reportNme == '') {
                alert('invalid report name');
            } else {
                reqParameter.reportName = urlString.reportNme
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
            xhttp.open("GET", reqParameter.apiBase + 'getQueries?Reportname=' + reqParameter.reportName +
                '&fieldnames={' + reqParameter.queryFiled + '}', true);
            //  xhttp.setRequestHeader("securityToken", "securityToken");
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
            xhr.open("GET", Digin_PostgreSql + "executeQuery?query=" + queryString + "&db=PostgreSQL", /*async*/ true);
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
            getReportUIFromServer: function (eventHandler) {
                getReportName();
                // getSession();
                eventHandler.isFiled.loading = true;
                eventHandler.error.isGetError = false;

                dynamicallyReportSrv.getReportUI(reqParameter).success(function (data) {
                    for (var d in data) {
                        if (Object.prototype.hasOwnProperty.call(data, d)) {
                            var val = data[d];
                            var dynObject = {
                                query: val.Query,
                                fieldname: val.Fieldname.toLowerCase(),
                                data: []
                            };
                            angular.forEach(val, function (value, key) {
                                switch (value) {
                                    case 'datepicker':
                                        reportFiledList.UIDate.push(dynObject);
                                        break;
                                    case 'textbox':
                                        reportFiledList.UITextBox.push(dynObject);
                                        break;
                                    case 'dropdown':
                                        reportFiledList.UIDropDown.push(dynObject);
                                        length = reportFiledList.UIDropDown.length;
                                        if (val.Query != "") {
                                            getExecuteQuery(val.Query, length, function (res) {

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
                                                reportFiledList.UIDropDown[res.length].data = filed;
                                            });
                                        }
                                        break;
                                }
                            });
                        }
                    }
                    console.log(reportFiledList);
                    eventHandler.isFiled.loading = false;
                    eventHandler.isFiled.found = true;
                }).error(function (respose) {
                    eventHandler.isFiled.loading = false;
                    eventHandler.isFiled.found = false;
                    eventHandler.error.isGetError = true;
                    eventHandler.error.msg = 'data not found';
                });
            }
        }
    })();
    serverRequest.getReportUIFromServer(eventHandler);

    var privateFun = (function () {
        var onChangeRadioInstance;

        function onChangeRadioBtn() {
            function changedValue() {
                return '1';
            }

            function reset() {
                $scope.reportFiledList.selectedRadio = '';
                return '0';
            }

            return {
                changedValue: changedValue,
                reset: reset
            };
        }

        return {
            onChangeRadio: function () {
                if (!onChangeRadioInstance) {
                    onChangeRadioInstance = onChangeRadioBtn();
                }
                return onChangeRadioInstance;
            }
        }
    })();

    //
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
        radioBtn: {
            selectedRadio: '',
            headerName: 'test radio',
            hasRadioBtn: [{value: 0, name: 'test1'},
                {value: 1, name: 'test1'},
                {value: 2, name: 'test1'},
                {value: 3, name: 'test1'},
                {value: 4, name: 'test1'},
                {value: 5, name: 'test1'}]
        },
        checkBox: {
            selectedCheckBox: [],
            headerName: 'test checkbox',
            items: [1, 2, 3, 4, 5]
        }, textBox: {
            headerName: 'test textbox',
            txtFiled: [{name: 'enter test', value: ''},
                {name: 'enter test2', value: ''},
                {name: 'enter test3', value: ''}]
        },
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
