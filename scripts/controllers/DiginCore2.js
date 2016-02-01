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

    '$rootScope', '$mdDialog', '$objectstore', '$sce', 'AsTorPlotItems', '$log', '$http', 'ScopeShare',
     function ($scope, $rootScope, $mdDialog, $objectstore, $sce, AsTorPlotItems, $log, $http, ScopeShare) {

        $http.get('jsons/'+ $rootScope.widget.dataJson +'.json').success(function (data) {
            console.log('['+JSON.stringify(data)+']');
            $scope.arr = data;

            console.log("data json");
            console.log($scope.arr);
        });

           $('#pagePreLoader').hide();    

        $scope.showData = function () {

            //get markers data and store in $scope
            $scope.dataTable = ScopeShare.get('gmapsController');

            $('#downloadButton').css("display","block");

            console.log("$rootScope.widget");
            console.log($rootScope.widget);

            $scope.dataViewPath = 'views/'+ $rootScope.widget.dataView + '.html';

            console.log("showData");
            console.log( $scope.dataViewPath);

            if( $rootScope.widget.dataJson == 'hnbBoxData' ){
                JSON2CSV2();
            }
            else{
                JSON2CSV();
            }
            
        };

        function JSON2CSV() {

            var str = '';
            var jsonArray = [];

            for(var i=0; i< $scope.arr.children.length; i++){

                var obj = {};
                obj['data1'] = "";
                obj['data2'] = "";
                obj['data3'] = "";
                console.log("child level 1");
                console.log($scope.arr.children[i].name);
                //str += $scope.arr.children[i].name;
                if( $scope.arr.children[i].children != undefined){
                    for(var j=0; j< $scope.arr.children[i].children.length; j++){
                        
                        console.log("child level 2");
                        console.log($scope.arr.children[i].children[j].name);
                        str += $scope.arr.children[i].name + ',' + $scope.arr.children[i].children[j].name;
                        obj['data1'] = $scope.arr.children[i].name;
                        obj['data2'] = $scope.arr.children[i].children[j].name;
                        if( $scope.arr.children[i].children[j].children != undefined){
                            for(var k=0; k< $scope.arr.children[i].czildren[j].children.length; k++){

                                console.log("child level 3");
                                console.log($scope.arr.children[i].children[j].children[k].name);
                                str += ',' + $scope.arr.children[i].children[j].children[k].name;
                                obj['data3'] = $scope.arr.children[i].children[j].children[k].name;
                            }
                            str += '\n';
                        }
                        else{
                            str += '\n';
                        }
                        jsonArray.push(obj);
                        var obj = {};
                        obj['data1'] = "";
                        obj['data2'] = "";
                        obj['data3'] = "";
                        
                    }
                }
                else{
                        str += '\n';
                        obj['data1'] = $scope.arr.children[i].name1;
                        obj['data2'] = $scope.arr.children[i].name2;
                }    
            }

            console.log("str");
            console.log(str);
            console.log("jsonArray");
            console.log(jsonArray);
            
            $scope.json2csv = jsonArray;
    
        }

        function JSON2CSV2() {

            var str = '';
            var jsonArray = [];

            for(var i=0; i< $scope.arr.children.length; i++){

                var obj = {};
                obj['data1'] = "";
                obj['data2'] = "";
                
                console.log("child level 1");
                //console.log($scope.arr.children[i].name);
                //str += $scope.arr.children[i].name;
                obj['data1'] = $scope.arr.children[i].category;
                obj['data2'] = $scope.arr.children[i].Observation;
       
                jsonArray.push(obj);
                    var obj = {};
                    obj['data1'] = "";
                    obj['data2'] = "";
                
                
            }

            console.log("str");
            console.log(str);
            console.log("jsonArray");
            console.log(jsonArray);
            
            $scope.json2csv = jsonArray;
    
        }
        
        $scope.exportToCSV = function ($http) {
            
            JSON2CSV();
            console.log("$scope.json2csv");
            console.log($scope.json2csv);

        };

        $scope.convertCSVtoJson = function (src) {
            AsTorPlotItems.then(function (data) {
                $scope.items = data;
            });
        };
        
        $scope.showAdvanced = function (ev, widget) {

            // $scope.dataViewPath = 'views/'+$rootScope.widget.initTemplate + '.html';

            // console.log("showAdvanced");
            // console.log( $scope.dataViewPath);
             document.getElementsByClassName("card__full")[0].style.visibility="hidden";
        

            $mdDialog.show({
                controller: 'chartSettingsCtrl',
                templateUrl: 'views/chart_settings.html',
                targetEvent: ev,
                resolve: {
                    widget: function() {
                        return widget;
                    }
                }
            })
            
            $mdDialog.show({
                    controller: eval($rootScope.widget.initCtrl),
                    templateUrl: 'views/' + $rootScope.widget.initTemplate + '.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        widId: $rootScope.widget.id
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
        };
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
        };
        $scope.commentary = function (widget) {

            $('#downloadButton').css("display","none");
            
            var comment = "";
            var chunks = [];

            $scope.dataViewPath = '';

        };
        $scope.close = function () {
            $(".view").css("display","none");
            $('md-backdrop').css("display","none");
        };
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
                .then(function() {
                    //$mdDialog.hide();
                }, function() {
                    //$mdDialog.hide();
                });
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

                $scope.gridsterOpts = {
                margins: [3, 3],
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
                                    stacking: '',
                                    turboThreshold: 5000,
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