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

routerApp.controller('saveCtrl', ['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', 'ObjectStoreService', 'DashboardService',

function ($scope, $http, $objectstore, $mdDialog, $rootScope, ObjectStoreService, DashboardService) {
        $scope.closeDialog = function () {
            // Easily hides most recent dialog shown...
            // no specific instance reference is needed.
            $mdDialog.hide();
        };

        $scope.dashboardName = "";
        $scope.dashboardType = $rootScope.dashboard.dashboardType;
        $scope.dashboardCulture = $rootScope.dashboard.dashboardCulture;
        $scope.dashboardDate = $rootScope.dashboard.dashboardDate;

        $scope.saveDashboardDetails = function () {

            $rootScope.dashboard.dashboardName = $scope.dashboardName;


            var dashboardObj = {
                name: $scope.dashboardName,
                type: $scope.dashboardType,
                culture: $scope.dashboardCulture,
                date: $scope.dashboardDate,
                customDuoDash: true, //will be useful when filtering these dashboards with pentaho dashboards
                data: $rootScope.dashboard.widgets
            };



            var client = ObjectStoreService.initialize("duodigin_dashboard");

            ObjectStoreService.saveObject(client, dashboardObj, "name", function (data) {
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


}]);

routerApp.controller('shareCtrl', ['$scope', '$rootScope', '$objectstore', '$mdDialog', function ($scope, $rootScope,
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

    $scope.closeDialog = function () {
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



    $scope.openEmail = function () {

        $mdDialog.show({
            controller: 'emailCtrl',
            templateUrl: 'views/loginEmail.html',
            resolve: {

            }
        })
    };

}]);

routerApp.controller('ExportCtrl', ['$scope', '$objectstore', '$mdDialog', '$rootScope', function ($scope,

    $objectstore, $mdDialog, $rootScope) {
    $scope.dashboard = [];
    $scope.dashboard = {

        widgets: [

      ]


    };
    $scope.dashboard.widgets = $rootScope.dashboard["1"].widgets;

    $scope.closeDialog = function () {
        // Easily hides most recent dialog shown...
        // no specific instance reference is needed.
        $mdDialog.hide();
    };
    $scope.export = function (widget) {
        var chart = $('#' + widget.id).highcharts();
        chart.exportChart();
    };

}]);

routerApp.controller('ThemeCtrl', ['$scope', '$rootScope', '$objectstore', '$mdDialog', function ($scope, $rootScope,
    $objectstore, $mdDialog) {

    $scope.panels = ["Side Panel", "Background"];

    $scope.themeArr = [{
            name: 'alt',
            primary: '#3F51B5',
            lightPrimary: '#C5CAE9',
            darkPrimary: '#303F9F',
            accent: '#448AFF'
        },
        {
            name: 'alt1',
            primary: '#673AB7',
            lightPrimary: '#D1C4E9',
            darkPrimary: '#512DA8',
            accent: '#FF5252'
        },
        {
            name: 'alt2',
            primary: '#4CAF50',
            lightPrimary: '#C8E6C9',
            darkPrimary: '#388E3C',
            accent: '#FFC107'
        },
        {
            name: 'alt3',
            primary: '#607D8B',
            lightPrimary: '#CFD8DC',
            darkPrimary: '#455A64',
            accent: '#009688'
        }];

    $scope.changeTheme = function (theme, themeId) {
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

    $scope.closeDialog = function () {
        // Easily hides most recent dialog shown...
        // no specific instance reference is needed.
        $mdDialog.hide();
    };

    $scope.applyIndigoCSS = function () {
        cssInjector.removeAll();
        cssInjector.add("/Digin12/styles/css/style1.css");

    };

    $scope.applyMinimalCSS = function () {
        cssInjector.removeAll();
        cssInjector.add("/Digin12/styles/css/style3.css");

    };

    $scope.applyVioletCSS = function () {
        cssInjector.removeAll();
        cssInjector.add("/Digin12/styles/css/style.css");

    };

}]);




routerApp.controller('DataCtrl', ['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', 'DashboardService', 'dashboard',

function ($scope, $http, $objectstore, $mdDialog, $rootScope, DashboardService, dashboard) {
        $scope.saveDashboard = [];
        $scope.ExistingDashboardDetails = [];
        $scope.selectedDasbhoard = [];


        $scope.closeDialog = function () {
            $mdDialog.hide();
        };

        var client = $objectstore.getClient("com.duosoftware.com", "duodigin_dashboard");
        client.onGetMany(function (data) {
            if (data) {
                $scope.ExistingDashboardDetails = data;
            }
        });
        client.getByFiltering("*");

        $scope.LoadSelected = function (dasbhoard) {
            var client = $objectstore.getClient("com.duosoftware.com", "duodigin_dashboard");
            client.onGetMany(function (data) {
                if (data) {
                    $scope.selectedDasbhoard = data;
                    dashboard = $scope.selectedDasbhoard[0];
                    $scope.dashboard.widgets = dashboard["1"].widgets;
                    $scope.$apply();
                }
            });
            client.getByFiltering(dasbhoard.dashboardName);
        };


}]);

routerApp.controller('emailCtrl', ['$scope', '$rootScope', '$mdDialog', function ($scope, $rootScope, $mdDialog) {

    $scope.generateSnapshot = function () {
        document.getElementById("canvasTest").appendChild($rootScope.a);
    };

    $scope.sendMail = function (wpdomain) {

    };

    $scope.closeDialog = function () {
        $mdDialog.hide();
    };


}]);

routerApp.controller('errorCtrl', ['$scope', '$objectstore', '$mdDialog', function ($scope,

    $objectstore, $mdDialog) {
    $scope.closeDialog = function () {
        // Easily hides most recent dialog shown...
        // no specific instance reference is needed.
        $mdDialog.hide();
    };


}]);

routerApp.controller('successCtrl', ['$scope', '$objectstore', '$mdDialog', function ($scope,

    $objectstore, $mdDialog) {
    $scope.closeDialog = function () {
        // Easily hides most recent dialog shown...
        // no specific instance reference is needed.
        $mdDialog.hide();
    };

}]);

routerApp.controller('WidgetCtrl', ['$scope', '$timeout', '$rootScope', '$mdDialog', '$sce', '$http', '$objectstore', 'dashboard', '$log',
  function ($scope, $timeout, $rootScope, $mdDialog, $sce, $http, $objectstore, dashboard, $log) {
        //$scope.dashboard = dashboard;
        $rootScope.dashboard = dashboard;

        getJSONData($http, 'widgetType', function (data) {
            $scope.WidgetTypes = data;
        });

        getJSONData($http, 'widgets', function (data) {
            $scope.Widgets = data;
            console.log($scope.Widgets);
        });

        $scope.hideDialog = function () {
            $mdDialog.hide();
        };

        $scope.filterWidgets = function (item) {
            if (item == null) {
                item.title = "Visualization";
            }
            $scope.selected = {};
            $scope.selected.type = item.title;
            $rootScope.widgetType = $scope.selected.type;
        };

        $scope.openInitialConfig = function (ev, id) {
            //alert($scope.currWidget.uniqueType);

            $mdDialog.show({
                    controller: eval($scope.currWidget.initCtrl),
                    templateUrl: 'views/' + $scope.currWidget.initTemplate + '.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        widId: id
                    }
                })
                .then(function () {
                    //$mdDialog.hide();
                }, function () {
                    //$mdDialog.hide();
                });
        };


        $scope.addAllinOne = function (widget, ev) {

            $mdDialog.hide();



            getJSONDataByIndex($http, 'widgetPositions', $rootScope.dashboard.widgets.length, function (data) {

                $scope.gridsterOpts = {
                    margins: [10, 10],
                    outerMargin: true,
                    pushing: true,
                    floating: true,
                    draggable: {
                        enabled: true
                    },
                    resizable: {
                        enabled: true,
                        handles: ['n', 'e', 's', 'w', 'se', 'sw']
                    }
                };

                $scope.leftPosition = data.leftPosition;
                $scope.topPosition = data.topPosition;
                $scope.ChartType = data.ChartType;
                $scope.currWidget = {

                    sizeX: widget.sizeX,
                    sizeY: widget.sizeY,
                    row: widget.row,
                    col: widget.col,


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
                    mheight: '250px',
                    chartTypes: [
                        {
                            "id": "line",
                            "title": "Line"
                        },
                        {
                            "id": "spline",
                            "title": "Smooth line"
                        },
                        {
                            "id": "area",
                            "title": "Area"
                        },
                        {
                            "id": "areaspline",
                            "title": "Smooth area"
                        },
                        {
                            "id": "column",
                            "title": "Column"
                        },
                        {
                            "id": "bar",
                            "title": "Bar"
                        },
                        {
                            "id": "pie",
                            "title": "Pie"
                        },
                        {
                            "id": "scatter",
                            "title": "Scatter"
                        }
  ],
                    dashStyles: [
                        {
                            "id": "Solid",
                            "title": "Solid"
                        },
                        {
                            "id": "ShortDash",
                            "title": "ShortDash"
                        },
                        {
                            "id": "ShortDot",
                            "title": "ShortDot"
                        },
                        {
                            "id": "ShortDashDot",
                            "title": "ShortDashDot"
                        },
                        {
                            "id": "ShortDashDotDot",
                            "title": "ShortDashDotDot"
                        },
                        {
                            "id": "Dot",
                            "title": "Dot"
                        },
                        {
                            "id": "Dash",
                            "title": "Dash"
                        },
                        {
                            "id": "LongDash",
                            "title": "LongDash"
                        },
                        {
                            "id": "DashDot",
                            "title": "DashDot"
                        },
                        {
                            "id": "LongDashDot",
                            "title": "LongDashDot"
                        },
                        {
                            "id": "LongDashDotDot",
                            "title": "LongDashDotDot"
                        }
  ],

                    chartStack: [
                        {
                            "id": '',
                            "title": "No"
                        },
                        {
                            "id": "normal",
                            "title": "Normal"
                        },
                        {
                            "id": "percent",
                            "title": "Percent"
                        }
  ],
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
                                    stacking: ''
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

                // if($scope.currWidget.type != "Sri Lanka Telecom"  )
                // {
                //     //opening initial widget config dialog
                //    $scope.openInitialConfig(ev, $scope.currWidget.id);
                // }
                // else
                if ($scope.currWidget.type != "HNB Assuarance") {
                    $scope.openInitialConfig(ev, $scope.currWidget.id);
                }
            });



            //save the type of the widget for the purpose of the socialMediaCtrl
            $rootScope.widgetType = widget.title;


        };
  }
  ]);
