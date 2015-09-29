/*
----------------------Summary-------------------------------
| Controllers listed below are here                        |
------------------------------------------------------------
|      DashboardCtrl                                       |
|      ReportCtrl                                          |
|      analyticsCtrl                                       | 
|      d3PluginCtrl                                        |
|      ExtendedanalyticsCtrl                               | 
|      ExtendedReportCtrl                                  |
|      ExtendedDashboardCtrl                               |
|      summarizeCtrl                                       | 
|      settingsCtrl                                        |
------------------------------------------------------------
*/

routerApp.controller('DashboardCtrl', ['$scope',

    '$rootScope', '$mdDialog', '$objectstore', '$sce', 'AsTorPlotItems', '$log',
    function ($scope, $rootScope, $mdDialog, $objectstore, $sce, AsTorPlotItems, $log) {


        $('#pagePreLoader').hide();
        $scope.test = function () {
            alert("test");
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
            $scope.dashboard.widgets = [];
        };

        $scope.remove = function (widget) {
            $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
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
]);


function hnbClaimsCtrl($scope, $mdDialog, wid, $http) {
    $scope.arr = [];
    $scope.closeDialog = function () {
        $mdDialog.hide();
    };


    $http.get('jsons/hnbForceData.json').success(function (data) {

        $scope.arr = data;
        console.log($scope.arr);
    });


};


function hnbDistributedCtrl($scope, $mdDialog, wid, $http) {
    $scope.arr = [];
    $scope.closeDialog = function () {
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
    $scope.arr = [];
    $scope.closeDialog = function () {
        $mdDialog.hide();
    };


    $http.get('jsons/googleData.json').success(function (data) {
        console.log(JSON.stringify(data));
        $scope.arr = data;

    });
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

routerApp.controller('d3PluginCtrl', ['$scope', '$sce', 'd3Service',
'$timeout', '$log',
    function ($scope, $sce, d3Service, $timeout, $log) {

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
            d3Service.loadAll()
                .then(function (muppets) {
                    allMuppets = muppets;
                    $scope.muppets = [].concat(muppets);
                    $scope.selected = $scope.muppets[0];
                })
        }




}])

routerApp.controller('ExtendedanalyticsCtrl', ['$scope', '$mdSidenav', '$sce', 'ExtendedAnalyticsService',
'$timeout', '$log', 'cssInjector',
    function ($scope, $mdSidenav, $sce, ExtendedAnalyticsService, $timeout,
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
                console.log("loaded css dynamically");
            }
            //*******************
            // Internal Methods
            //*******************
        function loadMuppets() {
            ExtendedAnalyticsService.loadAll()
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
 function ($scope, $http, $objectstore, $mdDialog, $rootScope, $q, $timeout)
    {
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

routerApp.controller('settingsCtrl', ['$scope', '$rootScope', '$http', '$state', '$mdDialog', 'Digin_Base_URL','$objectstore','$mdToast', 
    function ($scope, $rootScope, $http, $state, $mdDialog, Digin_Base_URL,$objectstore,$mdToast) {
        var featureObj = localStorage.getItem("featureObject");
        $scope.User_Name = "";
        $scope.User_Email = "";

        getJSONData($http, 'features', function (data) {
            $scope.featureOrigin = data;
            var obj = JSON.parse(featureObj);
            if (featureObj === null) {
                $scope.features = data;
                $scope.selected = [];
            } else {
                $scope.selected = [];
                for (i = 0; i < obj.length; i++) {
                    if (obj[i].stateStr === "Enabled")
                        $scope.selected.push(obj[i]);
                }
                $scope.features = obj;

            }
        });

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
            for (i = 0; i < $scope.selected.length; i++) {
                for (j = 0; j < $scope.featureOrigin.length; j++) {
                    if ($scope.featureOrigin[j].title == $scope.selected[i].title) {
                        $scope.featureOrigin[j].state = true;
                        $scope.featureOrigin[j].stateStr = "Enabled";
                    }
                }
            }

            getJSONData($http, 'menu', function (data) {

                var orignArray = [];
                for (i = 0; i < $scope.featureOrigin.length; i++) {
                    if ($scope.featureOrigin[i].state == true)
                        orignArray.push($scope.featureOrigin[i]);
                }
                $scope.menu = orignArray.concat(data);

            });
            localStorage.setItem("featureObject", JSON.stringify($scope.featureOrigin));
            $mdDialog.show({
                controller: 'settingsCtrl',
                templateUrl: 'views/settings-save.html',
                resolve: {

                }
            })

        };

        $scope.saveSettingsDetails = function () {
            window.location = Digin_Base_URL + "home.html";
        };



        $scope.closeDialog = function () {
            $mdDialog.hide();
        };

        $scope.addUser = function(){

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
                            url: 'http://52.0.234.95:8080/pentaho/api/userroledao/createUser',
                            headers:{'Content-Type': 'application/json'},
                            data: {"userName": pentUserName, "password": pentPassword}

                        }).
                        success(function(data, status) {
                            $mdToast.show({
                                position: "bottom right",
                                template: "<md-toast>Successfully created your profile,Please check your Email for verification!</md-toast>"
                            });
                            var SignUpBtn = document.getElementById("mySignup").disabled = false;
                        }).
                        error(function(data, status) {
                            alert("Request failed");

                        });
                    });
                    client.update(userDetails, {
                        KeyProperty: "email"
                    });
                 }
            else {

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
            }else{
                $mdToast.show({
                        position: "bottom right",
                        template: "<md-toast>Mismatched passwords</md-toast>"
                });
            }
        };
    }
    ]);
