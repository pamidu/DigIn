/*
 ----------------------Summary-------------------------------
 | Controllers listed below are here                        |
 ------------------------------------------------------------
 |      showWidgetCtrl                                      |
 |      DashboardCtrl                                       |
 |      ReportCtrl                                          |
 |      analyticsCtrl                                       |
 |      d3PluginCtrl                                        |
 |      ExtendedanalyticsCtrl                               |
 |      ExtendedReportCtrl                                  |
 |      ExtendedDashboardCtrl                               |
 |      summarizeCtrl                                       |
 |      settingsCtrl                                        |
 |      pStackCtrl                                          |
 ------------------------------------------------------------
 */
routerApp.controller('showWidgetCtrl', function ($scope, $mdDialog, widget) {

    $scope.widget = angular.copy(widget);
    $scope.dHeight = $scope.widget.height + 100;

    $scope.returnWidth = function (width, height) {
        console.log("width here", width, height);
        if ($scope.widget.initCtrl == "elasticInit") {
            console.log('elastic');
            $scope.widget.highchartsNG.size.width = parseInt(width);
            $scope.widget.highchartsNG.size.height = parseInt(height);
        }
    };
    var reSizeWidget = function () {
        $scope.widget.highchartsNG.size.width = parseInt(700);
        $scope.widget.highchartsNG.size.height = parseInt(400);
    }

    $scope.setChartSize = function (data) {
        console.log(data);
        setTimeout(function () {
            reSizeWidget();
        }, 50);
    }

    $scope.closeDialog = function () {
        $mdDialog.hide();
    };
});
routerApp.controller('DashboardCtrl', ['$scope', '$rootScope', '$mdDialog', '$objectstore', '$sce', 'AsTorPlotItems', '$log', 'DynamicVisualization',
    function ($scope, $rootScope, $mdDialog, $objectstore, $sce, AsTorPlotItems, $log, DynamicVisualization) {

        $('#pagePreLoader').hide();

        localStorage.setItem('username', "admin");

        // if($rootScope.tempDashboard.length != 0)
        $rootScope.tempDashboard = angular.copy($rootScope.dashboard);

        /* update damith
         view current chart data source view
         currentSourceView ()
         */

        $scope.showFace2 = function ($event, widget) {
            alert("loadin 2nd face...!");
            $event.preventDefault();
            $(this).parent().toggleClass('expand');
            $(this).parent().children().toggleClass('expand');
        }

        $scope.currentSourceView = function (ev, widget) {
            $scope.isTableSourceLoading = false;
            $mdDialog.show({
                    templateUrl: 'views/widgetDataTable_TEMP.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        items: widget
                    }
                    ,
                    controller: function dataSourceCtrl($scope, $mdDialog, items) {
                        // console.log(JSON.stringify(items));
                        var isCommonSrc = angular.isUndefined(items.widCsc);
                        var selectedSourceData = {};
                        if (isCommonSrc) {
                            //selected common data source
                            selectedSourceData = {
                                'uniqueType': items.uniqueType,
                                'length': items.commonSrcConfig.fields.length,
                                'attributes': items.commonSrcConfig.fields,
                                'mappedData': [],
                                'className': items.commonSrcConfig.tbl,
                                'source': items.commonSrcConfig.src,
                                'type': null,
                                'groupBy': null,
                                'data': items.highchartsNG.series[0].data
                            };
                        } else {
                            selectedSourceData = {
                                'uniqueType': items.uniqueType,
                                'length': items.widConfig.attributes.length,
                                'attributes': items.widConfig.attributes,
                                'mappedData': [],
                                'className': items.widConfig.selectedClass,
                                'source': items.widConfig.source,
                                'type': items.type,
                                'groupBy': items.widConfig.chartCat.groupField
                            };
                        }
                        for (var i = 0; i < selectedSourceData.length; i++) {
                            if (isCommonSrc) {
                                var _attr = selectedSourceData.attributes[i].trim().
                                toString();
                                selectedSourceData.mappedData.push(items.
                                    winConfig.mappedData[_attr].data);
                            } else {
                                var _attr = selectedSourceData.attributes[i].trim().
                                toString();
                                selectedSourceData.mappedData.push(items.
                                    widConfig.mappedData[_attr].data);
                            }


                        }
                        var appendTblBody = function () {
                            $scope.isTableSourceLoading = true;
                            for (var i = 0; i < selectedSourceData.length; i++) {
                                for (var b = 0; b < selectedSourceData.mappedData[i].length; b++) {
                                    var rows = '';
                                    for (var c = 0; c < selectedSourceData.length; c++) {
                                        var oneRow = "<td>" + selectedSourceData.mappedData[c][b] + "</td>";
                                        rows += oneRow;
                                    }
                                    $("#dataBody").append("<tr>" + rows + "</tr>");
                                    oneRow = '';
                                }
                            }
                            $scope.isTableSourceLoading = false;
                        };
                        setTimeout(appendTblBody, 100);


                        $scope.widget = selectedSourceData;
                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.submit = function () {
                            $mdDialog.submit();
                        };
                    }
                }
            )
            ;
        }
        ;

        $scope.closeDialog = function () {
            $mdDialog.hide();
        };

        $scope.widgetSettings = function (widget) {
            $mdDialog.show({
                controller: 'widgetSettingsCtrl',
                templateUrl: 'views/ViewWidgetSettings.html',
                clickOutsideToClose: true,
                resolve: {}
            });
            $rootScope.widget = widget;
        };

        $scope.initiate = function (widget) {
            alert('test');
            alert(DynamicVisualization.testRepeat(widget));
        };

        $scope.showWidget = function (ev, wid) {
            //alert(JSON.stringify(wid));
            $scope.tempWidth = wid.highchartsNG.size.width;
            $scope.tempHeight = wid.highchartsNG.size.height;
            $mdDialog.show({
                    controller: 'showWidgetCtrl',
                    templateUrl: 'views/ViewShowWidget.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        widget: wid
                    }
                })
                .then(function () {
                    $scope.widget.highchartsNG.size.width = $scope.tempWidth;
                    $scope.widget.highchartsNG.size.height = $scope.tempHeight;
                    //$mdDialog.hide();
                }, function () {
                    $scope.widget.highchartsNG.size.width = $scope.tempWidth;
                    $scope.widget.highchartsNG.size.height = $scope.tempHeight;
                    //$mdDialog.hide();
                });
        };

        $scope.showData = function (widget, ev) {
            $mdDialog.show({
                    controller: eval(widget.dataCtrl),
                    templateUrl: 'views/' + widget.dataView + '.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        wid: widget
                    }
                })
                .then(function () {
                    //$mdDialog.hide();
                }, function () {
                    //$mdDialog.hide();
                });
        };

        $scope.convertCSVtoJson = function (src) {
            AsTorPlotItems.then(function (data) {
                $scope.items = data;
            });
        }
        $scope.showAdvanced = function (ev, widget) {
            // $mdDialog.show({
            //     controller: 'chartSettingsCtrl',
            //     templateUrl: 'views/chart_settings.html',
            //     targetEvent: ev,
            //     resolve: {
            //         widget: function() {
            //             return widget;
            //         }
            //     }
            // })


            $mdDialog.show({
                    controller: eval(widget.initCtrl),
                    templateUrl: 'views/' + widget.initTemplate + '.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        widId: widget.id
                    }
                })
                .then(function () {
                    //$mdDialog.hide();
                }, function () {
                    //$mdDialog.hide();
                });


        };

        /*Summary:
         synchronizes data per widget
         @widget : widget that need to get updated
         */
        $scope.syncWidget = function (widget) {
            console.log('syncing...');
            if (typeof widget.widConfig != 'undefined') {
                widget.syncState = false;
                DynamicVisualization.syncWidget(widget, function (data) {
                    widget.syncState = true;
                    widget = data;
                });
            }
        };

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }
        $scope.getIndexes = function () {
            var client = $objectstore.getClient("com.duosoftware.com");
            client.onGetMany(function (data) {
                data.forEach(function (entry) {

                    $rootScope.indexes.push({
                        value: entry,
                        display: entry
                    });

                });


            });
            client.getClasses("com.duosoftware.com");
        }
        $scope.commentary = function (widget) {
            var comment = "";
            var chunks = [];


        }
        $scope.closeDialog = function () {
            $mdDialog.hide();
        };
        $scope.clear = function () {
            $rootScope.dashboard.widgets = [];
        };

        $scope.remove = function (widget) {
            $rootScope.dashboard.widgets.splice($rootScope.dashboard.widgets.indexOf(widget), 1);
        };


        $scope.alert = '';


        $scope.config = {}; // use defaults
        $scope.model = {};


//   $scope.$watch('selectedDashboardId', function(newVal, oldVal) {
//   if (newVal !== oldVal) {
//     $scope.dashboard = $scope.dashboard[newVal];
//   } else {
//     $scope.dashboard = $scope.dashboard[1];
//   }
// });

// init dashboard
        $scope.selectedDashboardId = '1';

    }
])
;

function hnbClaimsCtrl($scope, $mdDialog, wid, $http) {
    $scope.arr = [];
    $scope.closeDialog = function () {
        $mdDialog.hide();
    };


    $http.get('jsons/hnbForceData.json').success(function (data) {

        $scope.arr = data;

        console.log("hnb distributed claims json");
        console.log($scope.arr);
    });


};


function hnbDistributedCtrl($scope, $mdDialog, wid, $http) {
    $scope.arr = [];
    $scope.closeDialog = function () {
        alert("close Dialog");
        $mdDialog.hide();
    };

    $http.get('jsons/hnbDistributedclaims.json').success(function (data) {
        console.log(JSON.stringify(data));
        $scope.arr = data;

        console.log($scope.arr);
    });
};

function sltQueuedCtrl($scope, $mdDialog, wid, $http) {
    $scope.arr = [];
    $scope.closeDialog = function () {
        $mdDialog.hide();
    };


    $http.get('jsons/sltTotalqueued.json').success(function (data) {
        console.log(JSON.stringify(data));
        $scope.arr = data;
    });

};

function sltConnectedCtrl($scope, $mdDialog, wid, $http) {
    $scope.arr = [];
    $scope.closeDialog = function () {
        alert("slt connecetd");
        $mdDialog.hide();
    };


    $http.get('jsons/sltConnectedCalls.json').success(function (data) {
        console.log(JSON.stringify(data));
        $scope.arr = data;

    });
};

function hnbBoxCtrl($scope, $mdDialog, wid, $http) {
    $scope.arr = [];
    $scope.closeDialog = function () {
        $mdDialog.hide();
    };


    $http.get('jsons/hnbBoxData.json').success(function (data) {
        console.log(JSON.stringify(data));
        $scope.arr = data;

    });
};

function sltQueueDetailsCtrl($scope, $mdDialog, wid, $http) {
    $scope.arr = [];
    $scope.closeDialog = function () {
        $mdDialog.hide();
    };


    $http.get('jsons/sltQueueDetails.json').success(function (data) {
        console.log(JSON.stringify(data));
        $scope.arr = data;

    });
};

function googleMapsCtrl($scope, $mdDialog, wid, $http) {
    
    $scope.closeDialog = function () {
        $mdDialog.hide();
    };
};

function elasticDataCtrl($scope, $mdDialog, wid) {

    $scope.closeDialog = function () {
        $mdDialog.hide();
    };

    $scope.series = wid.highchartsNG.series;
    $scope.categories = wid.highchartsNG.xAxis.categories;
    $scope.mappedSeries = [];
    for (i = 0; i < $scope.series.length; i++) {
        var seriesObj = {
            name: $scope.series[i].name,
            data: []
        };
        for (j = 0; j < $scope.series[i].data.length; j++) {
            var dataObj = {
                val: $scope.series[i].data[j],
                cat: $scope.categories[j]
            };
            seriesObj.data.push(dataObj);
        }
        $scope.mappedSeries.push(seriesObj);
    }

    //map data to eport to excel
    //start dynamically creating the object array
    $scope.dataArray = [];
    $scope.dataObj = {};
    $scope.dataObj['a'] = "Category";
    var currChar = "a";
    for (i = 0; i < $scope.series.length; i++) {
        currChar = nextChar(currChar);
        $scope.dataObj[currChar] = $scope.series[i].name;
    }

    $scope.dataArray.push($scope.dataObj);

    for (i = 0; i < $scope.categories.length; i++) {
        $scope.dataObj = {};
        $scope.dataObj['a'] = $scope.categories[i];
        currChar = 'a';
        for (j = 0; j < $scope.series.length; j++) {
            currChar = nextChar(currChar);
            $scope.dataObj[currChar] = $scope.series[j].data[i];
        }
        $scope.dataArray.push($scope.dataObj);
    }

    $scope.fileName = wid.uniqueType;

};

routerApp.controller('ReportCtrl', ['$scope', '$mdSidenav', '$sce', 'ReportService',
    '$timeout', '$log', 'cssInjector',
    function ($scope, $mdSidenav, $sce, ReportService, $timeout,
              $log, cssInjector) {
        var allMuppets = [];
        $scope.selected = null;
        $scope.muppets = allMuppets;
        $scope.selectMuppet = selectMuppet;

        loadMuppets();
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }
        $scope.applyCSS = function () {
            cssInjector.add("/styles/css/style1.css");
        }
        //*******************
        // Internal Methods
        //*******************
        function loadMuppets() {
            ReportService.loadAll()
                .then(function (muppets) {
                    allMuppets = muppets;
                    $scope.muppets = [].concat(muppets);
                    $scope.selected = $scope.muppets[0];
                })
        }

        function toggleSidenav(name) {
            $mdSidenav(name).toggle();
        }


        function selectMuppet(muppet) {
            $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;

            $scope.toggleSidenav('left');
        }
    }])

routerApp.controller('analyticsCtrl', ['$scope', '$sce', 'AnalyticsService',
    '$timeout', '$log', '$mdDialog',
    function ($scope, $sce, AnalyticsService, $timeout, $log, mdDialog) {

        $scope.products = [];
        var allMuppets = [];
        $scope.selected = null;
        $scope.muppets = allMuppets;
        $scope.selectMuppet = selectMuppet;

        loadMuppets();
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        function selectMuppet(muppet) {
            $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;

            $scope.toggleSidenav('left');
        }

        function loadMuppets() {
            AnalyticsService.loadAll()
                .then(function (muppets) {
                    allMuppets = muppets;
                    $scope.muppets = [].concat(muppets);
                    $scope.selected = $scope.muppets[0];
                })
        }


    }])


routerApp.controller('RealTimeController', ['$scope', '$sce', 'RealTimeService',
    '$timeout', '$log', '$mdDialog',
    function ($scope, $sce, RealTimeService, $timeout, $log, mdDialog) {

        $scope.products = [];
        var allMuppets = [];
        $scope.selected = null;
        $scope.muppets = allMuppets;
        $scope.selectMuppet = selectMuppet;

        loadMuppets();
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        function selectMuppet(muppet) {
            $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;

            $scope.toggleSidenav('left');
        }

        function loadMuppets() {
            RealTimeService.loadAll()
                .then(function (muppets) {
                    allMuppets = muppets;
                    $scope.muppets = [].concat(muppets);
                    $scope.selected = $scope.muppets[0];
                })
        }


    }])

routerApp.controller('ExtendedanalyticsCtrl', ['$scope', '$timeout', '$rootScope', '$mdDialog', '$sce', '$objectstore', 'Digin_Extended_Analytics',
    function ($scope, $timeout, $rootScope, $mdDialog, $sce, $objectstore, Digin_Extended_Analytics) {

        $scope.AnalyticsReportURL = Digin_Extended_Analytics;

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }


    }
]);
routerApp.controller('ExtendedReportCtrl', ['$scope', '$timeout', '$rootScope', '$mdDialog', '$sce', '$objectstore', 'Digin_Extended_Reports',
    function ($scope, $timeout, $rootScope, $mdDialog, $sce, $objectstore, Digin_Extended_Reports) {

        $scope.AnalyticsReportURL = Digin_Extended_Reports;

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }


    }
]);

routerApp.controller('ExtendedDashboardCtrl', ['$scope', '$timeout', '$rootScope', '$mdDialog', '$sce', '$objectstore', 'Digin_Extended_Dashboard',
    function ($scope, $timeout, $rootScope, $mdDialog, $sce, $objectstore, Digin_Extended_Dashboard) {

        $scope.AnalyticsDashboardURL = Digin_Extended_Dashboard;

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }


    }
]);

routerApp.controller('summarizeCtrl', ['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', '$q', '$timeout',
    function ($scope, $http, $objectstore, $mdDialog, $rootScope, $q, $timeout) {
        $scope.indexes = [];

        var self = this;
        self.selectedItem = null;
        self.searchText = null;
        self.querySearch = querySearch;
        self.simulateQuery = false;
        self.isDisabled = false;

        $scope.selectedFields = [];
        var parameter = "";
        $scope.products = [];


        $scope.getFields = function (index) {
            $scope.selectedFields = [];
            var client = $objectstore.getClient("com.duosoftware.com", index.display);
            client.onGetMany(function (data) {
                if (data) {
                    $scope.selectedFields = data;
                    var client = $objectstore.getClient("com.duosoftware.com", index.display);
                    client.onGetMany(function (datae) {
                        if (datae) {
                            $scope.products = [];
                            for (var i = 0; i < datae.length; i++) {
                                var data = datae[i],
                                    product = {};
                                for (var j = 0; j < $scope.selectedFields.length; j++) {
                                    var field = $scope.selectedFields[j];
                                    product[field] = data[field];
                                }
                                $scope.products.push(product);
                            }
                            pivotUi();
                        }
                    });
                    client.getByFiltering("*");

                }
            });

            client.getFields("com.duosoftware.com", index.display);
        }
        $scope.remove = function () {
            // Easily hides most recent dialog shown...
            // no specific instance reference is needed.
            $mdDialog.hide();
        };

        function pivotUi() {
            var renderers = $.extend($.pivotUtilities.renderers, $.pivotUtilities.gchart_renderers, $.pivotUtilities.d3_renderers);
            $("#tableoutput").pivotUI($scope.products, {
                renderers: renderers,
                rows: [$scope.selectedFields[0]],
                cols: [$scope.selectedFields[1]],

                rendererName: "Table"
            });
        }

        function querySearch(query) {
            var results = query ? $rootScope.indexes.filter(createFilterFor(query)) : [],
                deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () {
                    deferred.resolve(results);
                }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }
    }]);

routerApp.controller('settingsCtrl', ['$scope', '$rootScope', '$http', '$state', '$mdDialog', 'Digin_Base_URL', '$objectstore', '$mdToast',
    function ($scope, $rootScope, $http, $state, $mdDialog, Digin_Base_URL, $objectstore, $mdToast) {
        var featureObj = localStorage.getItem("featureObject");
        $scope.User_Name = "";
        $scope.User_Email = "";

        $scope.username = localStorage.getItem('username');

        // getJSONData($http, 'features', function (data) {
        //     $scope.featureOrigin = data;
        var obj = JSON.parse(featureObj);
        if (featureObj === null) {
            $scope.features = null;
            $scope.selected = [];
        } else {
            $scope.selected = [];
            for (i = 0; i < obj.length; i++) {
                if (obj[i].stateStr === "Enabled")
                    $scope.selected.push(obj[i]);
            }
            $scope.features = obj;

        }
        // });

        $scope.toggle = function (item, list) {

            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
                item.state = false;
                item.stateStr = "Disabled";
            } else {
                list.push(item);
                item.state = true;
                item.stateStr = "Enabled";
            }
        };

        $scope.close = function () {
            $mdDialog.cancel();
        };

        $scope.test = function (item) {

            return false;
        };

        $scope.finish = function () {

            alert("finish settingctrl");
            for (i = 0; i < $scope.selected.length; i++) {
                for (j = 0; j < $scope.features.length; j++) {
                    if ($scope.features[j].title == $scope.selected[i].title) {
                        $scope.features[j].state = true;
                        $scope.features[j].stateStr = "Enabled";
                    }
                }
            }

            getJSONData($http, 'menu', function (data) {

                var orignArray = [];
                for (i = 0; i < $scope.features.length; i++) {
                    if ($scope.features[i].state == true)
                        orignArray.push($scope.features[i]);
                }
                $scope.menu = orignArray.concat(data);

            });
            localStorage.setItem("featureObject", JSON.stringify($scope.features));
            $mdDialog.show({
                controller: 'settingsCtrl',
                templateUrl: 'views/settings-save.html',
                resolve: {}
            });

        };

        $scope.saveSettingsDetails = function () {

            window.location = "home.html";
        };


        $scope.closeDialog = function () {

            $mdDialog.hide();
        };

        $scope.addUser = function () {

            if ($scope.user.password == $scope.user.confirmPassword) {
                var SignUpBtn = document.getElementById("mySignup").disabled = true;
                var fullname = $scope.user.firstName + " " + $scope.user.lastName;
                var pentUserName = $scope.user.email;
                var pentPassword = $scope.user.password;
                $scope.user = {
                    "EmailAddress": $scope.user.email,
                    "Name": fullname,
                    "Password": $scope.user.password,
                    "ConfirmPassword": $scope.user.confirmPassword
                };

                $http({
                    method: 'POST',
                    url: 'http://duoworld.duoweb.info:3048/UserRegistation/',
                    data: angular.toJson($scope.user),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }

                }).success(function (data, status, headers, config) {
                    $scope.User_Name = data.Name;
                    $scope.User_Email = data.EmailAddress;
                    //setting the name of the profile
                    var userDetails = {
                        name: fullname,
                        phone: '',
                        email: $scope.user.EmailAddress,
                        company: "",
                        country: "",
                        zipcode: "",
                        bannerPicture: 'fromObjectStore',
                        id: "admin@duosoftware.com"
                    };

                    if (!data.Active) {

                        //setting the userdetails
                        var client = $objectstore.getClient("duosoftware.com", "profile", true);
                        client.onError(function (data) {
                            $mdToast.show({
                                position: "bottom right",
                                template: "<md-toast>Successfully created your profile,Please check your Email for verification!</md-toast>"
                            });
                        });
                        client.onComplete(function (data) {
                            // $mdToast.show({
                            //     position: "bottom right",
                            //     template: "<md-toast>Successfully created your profile,Please check your Email for verification!</md-toast>"
                            // });
                            $http({
                                method: 'PUT',
                                url: 'http://104.131.48.155:8080/pentaho/api/userroledao/createUser',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    "userName": pentUserName,
                                    "password": pentPassword
                                }

                            }).
                            success(function (data, status) {
                                $mdToast.show({
                                    position: "bottom right",
                                    template: "<md-toast>Successfully created your profile,Please check your Email for verification!</md-toast>"
                                });
                                var SignUpBtn = document.getElementById("mySignup").disabled = false;
                            }).
                            error(function (data, status) {
                                alert("Request failed");

                            });
                        });
                        client.update(userDetails, {
                            KeyProperty: "email"
                        });
                    } else {

                        $mdToast.show({
                            position: "bottom right",
                            template: "<md-toast>There is a problem in registering or you have already been registered!!</md-toast>"
                        });


                    }


                }).error(function (data, status, headers, config) {

                    $mdToast.show({
                        position: "bottom right",
                        template: "<md-toast>Please Try again !!</md-toast>"
                    });
                });
            } else {
                $mdToast.show({
                    position: "bottom right",
                    template: "<md-toast>Mismatched passwords</md-toast>"
                });
            }
        };
    }
]);

routerApp.controller('pStackCtrl', function ($scope, $mdDialog, $state) {

    //p stack menus
    $scope.Extendedmenu = [{
        title: 'Analysis Report',
        color: '#2196F3',
        icon: 'styles/css/images/icons/ic_assignment_24px.svg'
    }, {
        title: 'Interactive Report',
        color: '#FF9800',
        icon: 'styles/css/images/icons/ic_assignment_24px.svg'
    }, {
        title: 'Dashboard',
        color: '#CDDC39',
        icon: 'styles/css/images/icons/ic_assignment_24px.svg'
    }];

    $scope.closeDialog = function () {
        $mdDialog.hide();
    };

    $scope.doFunction = function (name) {

        $('.dashboard-widgets-close').css("visibility", "hidden");
        $('md-tabs-wrapper').css("visibility", "hidden");

        $state.go(name);
        $mdDialog.hide();
    };


});

routerApp.controller('gmapsController', ['$scope', '$mdDialog', '$state', '$http', 'ScopeShare',
    function ($scope, $mdDialog, $state, $http, ScopeShare) {

        // ====== Create map objects ======
        
        var delay = 100;
        var map = null;
        var bounds = null;
        var latlng = new google.maps.LatLng(7.2964, 80.6350);
        var infowindow = new google.maps.InfoWindow();
        var geo = null;
        var queue = [];
        var nextAddress = 0;
        var markers = [];
        //var windows = [];
        var markerCluster;
        var mcOptions = {gridSize: 50, maxZoom: 15};
        var count = 1;
        var undefinedErrors = 0;
        var outOfSriLanka = 0;
        var JSONData = null;
        var outOfSLArray = [];

        $scope.markers = [];
        $scope.map = { center: { latitude: 7.2964, longitude: 80.6350 }, zoom: 8, bounds: {} };
        $scope.windowParams = {
            name: 'pule test',
        };
        $scope.iconVisible = true;
        $scope.windowOpt = {
            show: true
        }
        
        // ======== initializing map at google map loading =========
        $scope.initGmap = function(){
            
            queue = [];
            markers = [];
            delay = 100;
            nextAddress = 0;

            JSONData = $scope.JSONData;

            JsonToArray(); 
            setTimeout(function(){theNext();},5000);   
        }
        $scope.openWindow = function(marker) {
            marker.showWindow = true;
            $scope.$apply();
        }      
    
        // ====== Json data to array ======    
        function JsonToArray() {
            for(var key in JSONData){
                if( JSONData[key].Address[0]!=undefined && // adding only defined value to queue
                    JSONData[key].Address[1]!=undefined &&
                    key!=undefined){
                    queue.push({    branch: key, 
                                    address: JSONData[key].Address, 
                                    val1: JSONData[key].val1,
                                    val2: JSONData[key].val2 
                                });
                }
                else{ //counting undefined values 
                    undefinedErrors++;
                }
            }
        }

        // ====== Decides the next thing to do ======
        function theNext() {
                if ((nextAddress+1) < queue.length) {
                    console.log(nextAddress + " < " + queue.length);
                    setTimeout(function(){

                            createMarker(queue[nextAddress],nextAddress);                          
                            theNext();
                    }, delay);
                    nextAddress++;
                } else {
                    // We're done. 
                    console.log("Done!");
                    
                    $scope.markers = markers;

                    //sharing markers with widgetSettingsCtrl using Scopes factory
                    ScopeShare.store('gmapsController', $scope.markers);
                    console.log($scope.markers);
                    console.log("undefined errors",undefinedErrors);   
                    console.log("out of sri lanka",outOfSriLanka);  
                    console.log(outOfSLArray);
                }
                
                // $scope.markers = markers;
        }

        // ====== between function ======
        function between(x, min, max) {
            return x >= min && x <= max;
        }

        // ======= Function to create a marker ========
        function createMarker(queueItem, id) {

            if( between(queueItem.address[0],5,10) &&   // in between 5 and 10 and
                between(queueItem.address[1],79,82)){   // in between 79 and 82

                var marker = {  
                                latitude: queueItem.address[0], 
                                longitude: queueItem.address[1], 
                                id: id,
                                icon: 'styles/css/images/hnb3.png', 
                                show: false,
                                templateUrl:'views/googleMaps/infoWindow.html',
                                templateParameter: {
                                    branch:queueItem.branch,
                                    field1: queueItem.val1,
                                    field2: queueItem.val2},
                                windowOptions: {
                                    boxClass: "infobox",
                                    boxStyle: {
                                        backgroundColor: "#FAA61A",
                                        border: "2px solid #10297d",
                                        borderRadius: "8px",
                                        width: "140px",
                                        height: "60px",
                                        opacity: 0.9
                                    },
                                    // content: "Text",
                                    disableAutoPan: true,
                                    maxWidth: 0,
                                    pixelOffset: new google.maps.Size(-60, -120),
                                    zIndex: null,
                                    closeBoxMargin: "3px",
                                    closeBoxURL: "styles/css/images/close.svg",
                                    infoBoxClearance: new google.maps.Size(1, 1),
                                    isHidden: false,
                                    pane: "floatPane",
                                    enableEventPropagation: false
                                }
                            };

                markers.push(marker);                
            }
            else
            {
                console.log("****** out of sri lanka range ******");
                outOfSriLanka++;
                outOfSLArray.push(queueItem.name);
            }
        }
    }
]);




