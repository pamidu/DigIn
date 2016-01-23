'use strict';

/* Controllers */

angular.module('DiginD3.controllers', [])
    .controller('DiginD3Ctrl', function ($rootScope, $scope, dataService
            , config, Digin_Engine_API) {

            console.log($rootScope.d3CommonSrcData);
            $scope.samples = [
                {title: 'Cars (multivariate)', url: 'data/multivariate.csv'},
                {title: 'Movies (dispersions)', url: 'data/dispersions.csv'},
                {title: 'Music (flows)', url: 'data/flows.csv'},
                {title: 'Cocktails (correlations)', url: 'data/correlations.csv'}
            ]


            // init
            $scope.DiginD3 = DiginD3;
            $scope.data = [];
            $scope.metadata = [];
            $scope.error = false;
            $scope.loading = true;

            $scope.categories = ['Correlations', 'Distributions', 'Time Series', 'Hierarchies', 'Others'];

            $scope.parse = function (text) {

                if ($scope.model) $scope.model.clear();

                $scope.data = [];
                $scope.metadata = [];
                $scope.error = false;
                $scope.$apply();

                try {
                    var parser = DiginD3.parser();
                    $scope.data = parser(text);
                    $scope.metadata = parser.metadata(text);
                    $scope.error = false;
                } catch (e) {
                    $scope.data = [];
                    $scope.metadata = [];
                    $scope.error = e.name == "ParseError" ? +e.message : false;
                }
                if (!$scope.data.length && $scope.model) $scope.model.clear();
                $scope.loading = false;
            }

            $scope.delayParse = dataService.debounce($scope.parse, 500, false);

            $scope.$watch("text", function (text) {
                $scope.loading = true;
                $scope.delayParse(text);
            });

            $rootScope.charts = DiginD3.charts.values().sort(function (a, b) {
                return a.title() < b.title() ? -1 : a.title() > b.title() ? 1 : 0;
            });
            $scope.charts = $rootScope.charts;
            $rootScope.chart = $rootScope.charts[0];
            $scope.chart = $rootScope.chart;
            $rootScope.model = $rootScope.chart ? $rootScope.chart.model() : null;
            $scope.model = $rootScope.model;

            $scope.$watch('error', function (error) {
                if (!$('.CodeMirror')[0]) return;
                var cm = $('.CodeMirror')[0].CodeMirror;
                if (!error) {
                    cm.removeLineClass($scope.lastError, 'wrap', 'line-error');
                    return;
                }
                cm.addLineClass(error, 'wrap', 'line-error');
                cm.scrollIntoView(error);
                $scope.lastError = error;

            })

            $('body').mousedown(function (e, ui) {
                if ($(e.target).hasClass("dimension-info-toggle")) return;
                $('.dimensions-wrapper').each(function (e) {
                    angular.element(this).scope().open = false;
                    angular.element(this).scope().$apply();
                })
            })

            $scope.codeMirrorOptions = {
                lineNumbers: true,
                lineWrapping: true,
                placeholder: 'Paste your text or drop a file here. No data on hand? Try one of our sample datasets!'
            }

            $('.col-lg-4').click(function (event) {

                for (var i = 0; i < $scope.charts.length; i++) {

                    if ($scope.charts[i].title() == event.currentTarget.children[0].children[1].innerText) {

                        $rootScope.model.clear();
                        $scope.model.clear();

                        $rootScope.chart = $scope.charts[i];
                        $scope.chart = $rootScope.chart;

                        console.log("hit chart");
                        console.log($scope.chart);

                        $rootScope.model = $rootScope.chart.model();
                        $scope.model = $rootScope.model;

                        console.log("hit model");
                        console.log($scope.model);

                    }
                }
            })

            $scope.selectMapping = function () {

                $scope.chart = $rootScope.chart;
                $scope.model = $rootScope.model;

            }


            function refreshScroll() {
                $('[data-spy="scroll"]').each(function () {
                    $(this).scrollspy('refresh');
                });
            }

            $(window).scroll(function () {

                // check for mobile
                if ($(window).width() < 760 || $('#mapping').height() < 300) return;

                var scrollTop = $(window).scrollTop() + 0,
                    mappingTop = $('#mapping').offset().top + 10,
                    mappingHeight = $('#mapping').height(),
                    isBetween = scrollTop > mappingTop + 50 && scrollTop <= mappingTop + mappingHeight - $(".sticky").height() - 20,
                    isOver = scrollTop > mappingTop + mappingHeight - $(".sticky").height() - 20,
                    mappingWidth = mappingWidth ? mappingWidth : $('.col-lg-9').width();

                if (mappingHeight - $('.dimensions-list').height() > 90) return;
                //console.log(mappingHeight-$('.dimensions-list').height())
                if (isBetween) {
                    $(".sticky")
                        .css("position", "fixed")
                        .css("width", mappingWidth + "px")
                        .css("top", "20px")
                }

                if (isOver) {
                    $(".sticky")
                        .css("position", "fixed")
                        .css("width", mappingWidth + "px")
                        .css("top", (mappingHeight - $(".sticky").height() + 0 - scrollTop + mappingTop) + "px");
                    return;
                }

                if (isBetween) return;

                $(".sticky")
                    .css("position", "relative")
                    .css("top", "")
                    .css("width", "");

            });

            //update damtih
            //close dialog
            $scope.close = function () {
                $mdDialog.hide();
            }


            //convert json to csv
            var JSON2CSV = function (objArray) {
                var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
                var str = '';
                for (var i = 0; i < array.length; i++) {
                    var line = '';
                    for (var index in array[i]) {
                        if (line != '') line += ','
                        line += array[i][index];
                    }
                    str += line + '\r\n';
                }
                return str;
            };

            //conver json to csv
            $scope.onClickConvertCSV = function () {
                $scope.isLoadingTbl = true;
                var elasticWrk = new Worker("scripts/webworkers/elasticWorker.js");
                var bigQryWrk = new Worker("scripts/webworkers/bigQueryWorker.js");
                var parameter = '';
                var i = 0;
                $scope.fieldArray.forEach(function (entry) {
                    if (i == 0) {
                        parameter = entry
                    } else {
                        parameter += "," + entry;
                    }
                    i++;
                });
                var _className = null;
                try {
                    _className = ($scope.selTable.split(':')[1]).split('.');
                }
                catch (err) {
                    _className = config.setID + "." + $scope.selTable
                }

                //Get Get and convert json to CSV
                if ($scope.selSrc == "BigQuery") {
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function (e) {
                        console.log(this);
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                $scope.text = JSON2CSV(xhr.response);
                                $scope.isLoadingTbl = false;
                            } else {
                                console.error("XHR didn't work: ", xhr.status);
                            }
                        }
                    };
                    xhr.ontimeout = function () {
                        console.error("request timedout: ", xhr);
                    };
                    var queryString = "SELECT " + parameter
                        + " FROM " + "[" + _className + "]"
                        + " LIMIT " + 1000;
                    xhr.open("get", config.apiUrl + "executeQuery?query=" + queryString, /*async*/ true);
                    xhr.send();

                } else if ($scope.selSrc == "DuoStore") {
                    var xhr = new XMLHttpRequest();
                    //xhr.timeout = 2000;
                    xhr.onreadystatechange = function (e) {
                        console.log(this);
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                alert(xhr.response);
                            } else {
                                console.error("XHR didn't work: ", xhr.status);
                            }
                        }
                    }
                    xhr.ontimeout = function () {
                        console.error("request timedout: ", xhr);
                    }
                    xhr.open("post", "http://45.55.83.253:3000/com.duosoftware.com/" + _className + "?take=20000",
                        /*async*/ true);
                    xhr.setRequestHeader("securityToken", "securityToken");
                    var params = '{"Special":{"Type":"getSelected","Parameters":"' + parameter + '"}}';
                    xhr.send(params);
                }
            }

            //clear select data source
            $scope.clearSource = function () {
                $scope.isLoadingTbl = false;
                $scope.dataTables = [];
                $scope.tableFiled = {};
                $scope.fieldArray = [];
                $scope.text = [];
            };


            $(document).ready(refreshScroll);

            //update code
            //common data source D3
            var getAllExecuteQuery = function () {
                switch ($rootScope.d3CommonSrcData.srcConfig.src) {
                    case 'MSSQL':
                        //main source MSSQL
                        var parm = {
                            srcNamespace: $rootScope.d3CommonSrcData.srcConfig.namespace,
                            tblVal: $rootScope.d3CommonSrcData.srcConfig.tbl,
                            filed: $rootScope.d3CommonSrcData.srcConfig.fields
                        };
                        var parameter = '';
                        var i = 0;
                        parm.filed.forEach(function (entry) {
                            if (i == 0) {
                                parameter = entry
                            } else {
                                parameter += "," + entry;
                            }
                            i++;
                        });
                        var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = function (e) {
                            console.log(this);
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    console.log(xhr.response);
                                    $scope.text = JSON2CSV(xhr.response);
                                } else {
                                    console.error("XHR didn't work: ", xhr.status);
                                }
                            }
                        };
                        xhr.ontimeout = function () {
                            console.error("request timedout: ", xhr);
                        };
                        var queryString = "SELECT " + parameter
                            + " FROM " + "[" + parm.tblVal + "]";
                        xhr.open("get", Digin_Engine_API + "executeQuery?query=" + queryString + "&db=MSSQL", /*async*/ true);
                        xhr.send();
                        break;
                    default:
                        break;
                }

            };
            getAllExecuteQuery();

           $

        }
    )
;