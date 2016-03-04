/*
----------------------Summary-------------------------------
| Controllers listed below are here                        |
------------------------------------------------------------
|      saveCtrl                                            |
|      shareCtrl                                           |
|      ExportCtrl                                          | 
|      ThemeCtrl                                           | 
|      DataCtrl                                            |
|      emailCtrl                                           |
|      errorCtrl                                           |
|      successCtrl                                         |
|      widgetCtrl                                          |
------------------------------------------------------------
*/
routerApp.controller('widgetSettingsCtrl', ['$scope',

    '$rootScope', '$mdDialog', '$objectstore', '$sce', 'AsTorPlotItems', '$log', '$http', 'ScopeShare', '$filter',
    function($scope, $rootScope, $mdDialog, $objectstore, $sce, AsTorPlotItems, $log, $http, ScopeShare, $filter) {

        $scope.showData = function() {

            $mdDialog.show({
                        controller: $rootScope.widget.dataCtrl,
                        templateUrl: 'views/ViewWidgetSettingsData.html',
                        parent: angular.element(document.body),
                        locals: {
                            widId: $rootScope.widget.id
                        }
                    })
                    .then(function() {
                        //$mdDialog.hide();
                    }, function() {
                        //$mdDialog.hide();
                    });

            $scope.close();
        };

        $scope.showAdvanced = function(ev, widget) {
                        if($rootScope.widget.initTemplate){

                $mdDialog.show({
                    controller: $rootScope.widget.initCtrl,
                    templateUrl: $rootScope.widget.initTemplate,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        widId: $rootScope.widget.id,
                        widData: {},
                        fieldData: {}
                    }
                })
                .then(function() {
                    //$mdDialog.hide();
                }, function() {
                    //$mdDialog.hide();
                });
            }
            $scope.close();
        };

        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };

        $scope.getIndexes = function() {

            var client = $objectstore.getClient("com.duosoftware.com");
            client.onGetMany(function(data) {
                data.forEach(function(entry) {

                    $rootScope.indexes.push({

                        value: entry,
                        display: entry
                    });
                });
            });
            client.getClasses("com.duosoftware.com");
        };

        $scope.commentary = function(widget) {

            var comment = "";
            var chunks = [];

            $scope.close();
        };

        $scope.close = function() {
            $mdDialog.hide();
        };

        $scope.closeDialog = function() {
            $mdDialog.hide();
        };

        $scope.clear = function() {
            $rootScope.dashboard.widgets = [];
        };

        $scope.remove = function(widget) {
            $rootScope.dashboard.widgets.splice($rootScope.dashboard.widgets.indexOf(widget), 1);
        };

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

routerApp.controller('widgetSettingsDataCtrl',['$scope', '$http', '$mdDialog', '$rootScope', 'ScopeShare', '$filter',
    function($scope, $http, $mdDialog, $rootScope, ScopeShare, $filter){

        // ====== angular-table configuration ========
        $scope.config = {
            itemsPerPage: 7,
            fillLastPage: true
        }

        // ====== Json data to array ======  
        var JSONData = {};

        function JsonToArray() {

            var queue = [];
            for (var i = 0; i < JSONData.length; i++) {

                queue.push({
                    name: JSONData[i].templateParameter.name,
                    field1: JSONData[i].templateParameter.field1,
                    field2: JSONData[i].templateParameter.field2
                });
            }
            $scope.dataTable = queue;
            $scope.originalList = $scope.dataTable;
        }

        $scope.initialize = function(){

            $scope.dataViewPath = $rootScope.widget.dataView;
            //if widget is google maps
            if($rootScope.widget.uniqueType == "Google Maps Branches" || $rootScope.widget.uniqueType == "Google Maps Claims"){

                //get markers data for branch data
                if (ScopeShare.get('gmapsControllerBranch') != undefined) {

                    JSONData = ScopeShare.get('gmapsControllerBranch');
                    if (JSONData) {
                        JsonToArray();
                    }
                }
                //get markers data for branch data
                if (ScopeShare.get('gmapsControllerClaim') != undefined) {

                    JSONData = ScopeShare.get('gmapsControllerClaim');
                    if (JSONData) {
                        JsonToArray();
                    }
                }
            }
            if($rootScope.widget.uniqueType == "Skill wise summary"){

                $http.get('views/graph.json').success(function (data) {
                    console.log("graph data skill wise summary");
                    console.log("data");
                    JSONData = data;
                    if (JSONData) {
                        JsonToArray();
                }

                });                   
            }
            
        }

        $scope.updateFilteredList = function(query) {
            $scope.dataTable = $filter("filter")($scope.originalList, query);
        };

        $scope.close = function() {

            $mdDialog.hide();
        };

    }
]);
routerApp.controller('saveCtrl', ['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', 'ObjectStoreService', 'DashboardService',

    function($scope, $http, $objectstore, $mdDialog, $rootScope, ObjectStoreService, DashboardService) {
        $scope.closeDialog = function() {
            // Easily hides most recent dialog shown...
            // no specific instance reference is needed.
            $mdDialog.hide();
        };

        $scope.dashboardName = "";
        $scope.dashboardType = $rootScope.dashboard.dashboardType;
        $scope.dashboardCulture = $rootScope.dashboard.dashboardCulture;
        $scope.dashboardDate = $rootScope.dashboard.dashboardDate;

        $scope.saveDashboardDetails = function(type) {

            $rootScope.dashboard.dashboardName = $scope.dashboardName;


            var dashboardObj = {
                name: $scope.dashboardName,
                type: $scope.dashboardType,
                culture: $scope.dashboardCulture,
                date: $scope.dashboardDate,
                customDuoDash: true, //will be useful when filtering these dashboards with pentaho dashboards
                data: $rootScope.dashboard.widgets,
                storyboard: false,
            };

            if (type == "saveAll") {
                console.log("saving the whole story board");
                dashboardObj.data = $rootScope.Dashboards;
                dashboardObj.storyboard = true;
            };

            console.log(dashboardObj);

            var client = ObjectStoreService.initialize("duodigin_dashboard");

            ObjectStoreService.saveObject(client, dashboardObj, "name", function(data) {
                if (data.state === 'error') {
                    $mdDialog.hide();
                    $mdDialog.show({
                        controller: 'errorCtrl',
                        templateUrl: 'views/dialog_error.html',
                        resolve: {

                        }
                    })
                } else {
                    DashboardService.getDashboards(dashboardObj);
                    $mdDialog.hide();
                    $mdDialog.show({
                        controller: 'successCtrl',
                        templateUrl: 'views/dialog_success.html',
                        resolve: {

                        }
                    })
                }
            });

            //localStorage.setItem('dasboardsObject', JSON.stringify(dashboardsObj));

            //   $mdDialog.show({
            //         controller: 'successCtrl',  
            //   templateUrl: 'views/dialog_success.html',
            //     resolve: {

            //     }
            // })

            //   var client = $objectstore.getClient("com.duosoftware.com","duodigin_dashboard");
            //   client.onComplete(function(data){ 
            //        $mdDialog.hide();
            //         $mdDialog.show({
            //         controller: 'successCtrl',  
            //   templateUrl: 'views/dialog_success.html',
            //     resolve: {

            //     }
            // })
            //   });
            //   client.onError(function(data){
            //         $mdDialog.hide();
            //         $mdDialog.show({
            //         controller: 'errorCtrl',
            //   templateUrl: 'views/dialog_error.html',
            //     resolve: {

            //     }
            // })
            //   });


            //   client.insert([$rootScope.dashboard], {KeyProperty:"dashboardName"});           


            //   }
        }


    }
]);

routerApp.controller('shareCtrl', ['$scope', '$rootScope', '$objectstore', '$mdDialog', function($scope, $rootScope,
    $objectstore, $mdDialog) {

    // html2canvas(document.body, {
    //                 onrendered: function(canvas) {

    //                     $rootScope.a = canvas;

    //                     alert("Snapshot Taken");
    //                 }
    // });

    $scope.shareOptions = [{
        provider: "facebook",
        icon: "facebook56",
        color: "#03A9F4"
    }, {
        provider: "google+",
        icon: "google120",
        color: "#FF5722"
    }, {
        provider: "twitter",
        icon: "twitter47",
        color: "#2196F3"
    }, {
        provider: "linkedin",
        icon: "linkedin24",
        color: "#607D8B"
    }, {
        provider: "printerest",
        icon: "pinterest33",
        color: "#FFC107"
    }, {
        provider: "tumbler",
        icon: "tumblr22",
        color: "#F57C00"
    }];

    $scope.closeDialog = function() {
        // Easily hides most recent dialog shown...
        // no specific instance reference is needed.
        $mdDialog.hide();
    };

    /*html2canvas(document.body, {
                onrendered: function(canvas) {
                  
                    $rootScope.a = canvas;
                                     
                    alert("Snapshot Taken");
                }
    });*/



    $scope.openEmail = function() {

        $mdDialog.show({
            controller: 'emailCtrl',
            templateUrl: 'views/loginEmail.html',
            resolve: {

            }
        })
    };

}]);

routerApp.controller('ExportCtrl', ['$scope', '$objectstore', '$mdDialog', '$rootScope', function($scope,

    $objectstore, $mdDialog, $rootScope) {
    $scope.dashboard = [];
    $scope.dashboard = {
        widgets: []
    };
    $scope.dashboard.widgets = $rootScope.dashboard["1"].widgets;

    $scope.closeDialog = function() {
        // Easily hides most recent dialog shown...
        // no specific instance reference is needed.
        $mdDialog.hide();
    };
    $scope.export = function(widget) {
        var chart = $('#' + widget.id).highcharts();
        chart.exportChart();
    };

}]);

routerApp.controller('ThemeCtrl', ['$scope', '$rootScope', '$objectstore', '$mdDialog', function($scope, $rootScope,
    $objectstore, $mdDialog) {

    $scope.panels = ["Side Panel", "Background"];

    $scope.themeArr = [{
        name: 'alt',
        primary: '#3F51B5',
        lightPrimary: '#C5CAE9',
        darkPrimary: '#303F9F',
        accent: '#448AFF'
    }, {
        name: 'alt1',
        primary: '#673AB7',
        lightPrimary: '#D1C4E9',
        darkPrimary: '#512DA8',
        accent: '#FF5252'
    }, {
        name: 'alt2',
        primary: '#4CAF50',
        lightPrimary: '#C8E6C9',
        darkPrimary: '#388E3C',
        accent: '#FFC107'
    }, {
        name: 'alt3',
        primary: '#607D8B',
        lightPrimary: '#CFD8DC',
        darkPrimary: '#455A64',
        accent: '#009688'
    }];

    $scope.changeTheme = function(theme, themeId) {
        $rootScope.dynamicTheme = theme;

        //common styles
        $(".sidebaricons").css('color', '#000', 'important');

        if (themeId != -1) {
            $(".nav-menu").css('background-color', $scope.themeArr[themeId].lightPrimary);
            $(".nav-menu-active").css('background-color', $scope.themeArr[themeId].darkPrimary);
            $(".logo-background").css('background-color', $scope.themeArr[themeId].lightPrimary);
        } else {
            $(".nav-menu").css('background-color', '#fff');
            $(".logo-background").css('background-color', '#fff');
        }

        // switch(theme){
        //   case 'alt':
        //     $(".nav-menu").css('background-color', '#3F51B5');
        //     break;
        //   case 'alt1':
        //     $(".nav-menu").css('background-color', '#673AB7');
        //     break;
        //   case 'alt2':
        //     $(".nav-menu").css('background-color', '#4CAF50');
        //     break;
        //   case 'alt3':
        //     $(".nav-menu").css('background-color', '#CFD8DC');
        //     $(".overlay .starting-point span").css('background-color', '#607D8B');
        //     break;
        // }

    };



    //   .nav-search .search::after{
    //   background-color: #00796B !important;
    // }
    // .nav-search .search::before{
    //   border-color: #00796B !important;
    // }

    // .nav-search.active .search::before{
    //   background-color:#00796B !important; 
    // }

    // nav menu
    // /*.nav-menu{
    //   background-color:#B2DFDB !important; 
    // }*/

    // /*menu layer*/
    // .menu-layer li a{
    //   background-color: #00796B;
    //   color: #fff;
    // }

    // .overlay .starting-point span{
    //   background-color: #80cfb3 !important;

    // }

    $scope.closeDialog = function() {
        // Easily hides most recent dialog shown...
        // no specific instance reference is needed.
        $mdDialog.hide();
    };

    $scope.applyIndigoCSS = function() {
        cssInjector.removeAll();
        cssInjector.add("/Digin12/styles/css/style1.css");

    };

    $scope.applyMinimalCSS = function() {
        cssInjector.removeAll();
        cssInjector.add("/Digin12/styles/css/style3.css");

    };

    $scope.applyVioletCSS = function() {
        cssInjector.removeAll();
        cssInjector.add("/Digin12/styles/css/style.css");

    };

}]);




routerApp.controller('DataCtrl', ['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', 'DashboardService', 'dashboard',

    function($scope, $http, $objectstore, $mdDialog, $rootScope, DashboardService, dashboard) {
        $scope.saveDashboard = [];
        $scope.ExistingDashboardDetails = [];
        $scope.selectedDasbhoard = [];


        $scope.closeDialog = function() {
            $mdDialog.hide();
        };

        var client = $objectstore.getClient("com.duosoftware.com", "duodigin_dashboard");
        client.onGetMany(function(data) {
            if (data) {
                $scope.ExistingDashboardDetails = data;
            }
        });
        client.getByFiltering("*");

        $scope.LoadSelected = function(dasbhoard) {
            var client = $objectstore.getClient("com.duosoftware.com", "duodigin_dashboard");
            client.onGetMany(function(data) {
                if (data) {
                    $scope.selectedDasbhoard = data;
                    dashboard = $scope.selectedDasbhoard[0];
                    $scope.dashboard.widgets = dashboard["1"].widgets;
                    $scope.$apply();
                }
            });
            client.getByFiltering(dasbhoard.dashboardName);
        };


    }
]);

routerApp.controller('emailCtrl', ['$scope', '$rootScope', '$mdDialog', function($scope, $rootScope, $mdDialog) {

    $scope.generateSnapshot = function() {
        document.getElementById("canvasTest").appendChild($rootScope.a);
    };

    $scope.sendMail = function(wpdomain) {

    };

    $scope.closeDialog = function() {
        $mdDialog.hide();
    };


}]);

routerApp.controller('errorCtrl', ['$scope', '$objectstore', '$mdDialog', function($scope,

    $objectstore, $mdDialog) {
    $scope.closeDialog = function() {
        // Easily hides most recent dialog shown...
        // no specific instance reference is needed.
        $mdDialog.hide();
    };


}]);

routerApp.controller('successCtrl', ['$scope', '$objectstore', '$mdDialog', function($scope,

    $objectstore, $mdDialog) {
    $scope.closeDialog = function() {
        // Easily hides most recent dialog shown...
        // no specific instance reference is needed.
        $mdDialog.hide();
    };

}]);

routerApp.controller('WidgetCtrl', ['$scope', '$timeout', '$rootScope', '$mdDialog', '$sce', '$http', '$objectstore', 'dashboard', '$log',
    function($scope, $timeout, $rootScope, $mdDialog, $sce, $http, $objectstore, dashboard, $log) {
        //$scope.dashboard = dashboard;
        //$rootScope.dashboard = dashboard;
        console.log(dashboard);
        getJSONData($http, 'widgetType', function(data) {
            $scope.WidgetTypes = data;
        });

        getJSONData($http, 'widgets', function(data) {
            $scope.Widgets = data;
            console.log($scope.Widgets);
        });

        $scope.hideDialog = function() {
            $mdDialog.hide();
        };

        $scope.filterWidgets = function(item) {
            if (item == null) {
                item.title = "Visualization";
            }
            $scope.selected = {};
            $scope.selected.type = item.title;
            $rootScope.widgetType = $scope.selected.type;
        };

        $scope.openInitialConfig = function(ev, id) {

            if($scope.currWidget.initTemplate){
            $mdDialog.show({
                    controller: $scope.currWidget.initCtrl,
                    templateUrl: $scope.currWidget.initTemplate,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        widId: id
                    }
                })
                .then(function() {
                    //$mdDialog.hide();
                }, function() {
                    //$mdDialog.hide();
                });
            }
            
        };

        $scope.closeDialog = function() {
            $mdDialog.cancel();
        };

        $scope.addAllinOne = function(widget, ev) {

            $mdDialog.hide();

            console.log("dashboard details: ");
            console.log($rootScope.dashboard);
            console.log("Global dashboard details: ");
            console.log($rootScope.Dashboards);

            getJSONDataByIndex($http, 'widgetPositions', $rootScope.dashboard.widgets.length, function(data) {

                $scope.leftPosition = data.leftPosition;
                $scope.topPosition = data.topPosition;
                $scope.ChartType = data.ChartType;
                $scope.currWidget = {

                    widCsv: {},
                    widCsc: {},
                    widEnc: {},
                    widDec: {},
                    widAna: {},
                    widAque: {},
                    widAexc: {},
                    widIm: {},
                    widData: {},
                    widChart: widget.widConfig,
                    widView: widget.widView,
                    dataView: widget.dataView,
                    dataCtrl: widget.dataCtrl,
                    initTemplate: widget.initTemplate,
                    initCtrl: widget.initController,
                    uniqueType: widget.title,
                    syncState: true,
                    expanded: true,
                    seriesname: "",
                    externalDataURL: "",
                    dataname: "",
                    d3plugin: "",
                    divider: false,
                    chartSeries: $scope.chartSeries,
                    query: "select * from testJay where Name!= 'Beast Master'",
                    id: "chart" + Math.floor(Math.random() * (100 - 10 + 1) + 10),
                    type: widget.type,
                    width: '370px',
                    left: $scope.leftPosition + 'px',
                    top: $scope.topPosition + 'px',
                    height: '300px',
                    mheight: '100%',
                    // sizeX: ,
                    // sizeY: ,
                    // row: ,
                    // col: ,
                    chartStack: [{
                        "id": '',
                        "title": "No"
                    }, {
                        "id": "normal",
                        "title": "Normal"
                    }, {
                        "id": "percent",
                        "title": "Percent"
                    }],
                    highchartsNG: {
                        exporting: {
                            enabled: false
                        },
                        options: {
                            chart: {
                                type: $scope.ChartType
                            },

                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    depth: 35,
                                    dataLabels: {
                                        enabled: true,
                                    },
                                    cursor: 'pointer',
                                    point: {
                                        events: {
                                            click: function() {
                                               
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        series: $scope.chartSeries,
                        title: {
                            text: widget.title,
                            style: {
                                display: 'none'
                            }
                        },
                        subtitle: {
                            text: '',
                            style: {
                                display: 'none'
                            }
                        },
                        credits: {
                            enabled: false,

                        },

                        loading: false,
                        size: {
                            height: 220,
                            width: 300
                        }
                    }

                }

                if ($rootScope.username == undefined || $rootScope.username == null) {
                    $rootScope.username = "DemoUser";
                }
                var msg = new SpeechSynthesisUtterance(+$rootScope.username + ' you are adding' + widget.title + ' widget');

                window.speechSynthesis.speak(msg);

                $rootScope.dashboard.widgets.push($scope.currWidget);
                $scope.openInitialConfig(ev, $scope.currWidget.id);

            });

            //save the type of the widget for the purpose of the socialMediaCtrl
            $rootScope.widgetType = widget.title;


        };
    }
]);
