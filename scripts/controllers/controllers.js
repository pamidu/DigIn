'use strict';

/* Controllers */

angular.module('DiginD3.controllers', [])

    .controller('DiginD3Ctrl', function ($rootScope, $scope, dataService,
                                         CommonDataSrc, config) {

        $scope.samples = [
            {title: 'Cars (multivariate)', url: 'data/multivariate.csv'},
            {title: 'Movies (dispersions)', url: 'data/dispersions.csv'},
            {title: 'Music (flows)', url: 'data/flows.csv'},
            {title: 'Cocktails (correlations)', url: 'data/correlations.csv'}
        ]

        // $scope.$watch('sample', function (sample){
        //   if (!sample) return;
        //   dataService.loadSample(sample.url).then(
        //     function(data){
        //       $scope.text = data;
        //     },
        //     function(error){
        //       $scope.error = error;
        //     }
        //   );
        // });


        $scope.$watch('sample', function (sample) {
            dataService.loadSample('data/multivariate.csv').then(
                function (data) {
                    $scope.text = [];
                },
                function (error) {
                    $scope.error = error;
                }
            );
        }, true);

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

        $scope.datasources = [{
            name: "DuoStore"
        }, {
            name: "BigQuery"
        }, {
            name: "CSV/Excel"
        }, {
            name: "Rest/SOAP Service"
        }, {
            name: "SpreadSheet"
        }];

        $scope.onChangeSource = function (src) {
            $scope.isLoadingTbl = true;
            $scope.selSrc = src;
            CommonDataSrc.getTables(src, function (data) {
                $scope.dataTables = data;
                $scope.isLoadingTbl = false;
            });

        };

        $scope.fieldArray = [];
        $scope.onChangeTable = function (tbl) {
            $scope.tableFiled = [];
            $scope.fieldArray = [];
            $scope.selTable = tbl;
            $scope.isLoadingFiled = true;
            CommonDataSrc.getFields(tbl, function (data) {
                $scope.tableFiled = data;
                $scope.isLoadingFiled = false;
            });
        };

        $scope.selectedFiled = function (field, state) {
            var index = $scope.fieldArray.indexOf(field);
            if (index >= 0) {
                $scope.fieldArray.splice(index, 1);
                return;
            }
            $scope.fieldArray.push(field);
        };


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

        $scope.onClickConvertCSV = function () {
            $scope.isLoadingTbl = true;
            var elasticWrk = new Worker("scripts/webworkers/elasticWorker.js");
            var bigQryWrk = new Worker("scripts/webworkers/bigQueryWorker.js");
            var parameter = '';
            $scope.fieldArray.forEach(function (entry) {
                parameter += " " + entry;
            });
            var fieldData = ($scope.selTable.split(':')[1]).split('.');
            if ($scope.selSrc == "BigQuery") {
                bigQryWrk.postMessage(parameter + "," + fieldData + "," + false);
                bigQryWrk.addEventListener('message', function (event) {
                    $scope.isLoadingTbl = false;
                    $scope.text = JSON2CSV(JSON.parse(event.data));
                });
            }
        };


        $(document).ready(refreshScroll);


    });