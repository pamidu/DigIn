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

        // $scope.showData = function() {

        //     $mdDialog.show({
        //                 controller: $rootScope.widget.dataCtrl,
        //                 templateUrl: 'views/ViewWidgetSettingsData.html',
        //                 parent: angular.element(document.body),
        //                 locals: {
        //                     widId: $rootScope.widget.id
        //                 }
        //             })
        //             .then(function() {
        //                 //$mdDialog.hide();
        //             }, function() {
        //                 //$mdDialog.hide();
        //             });

        //     $scope.close();
        // };

        // $scope.showAdvanced = function(ev, widget) {
        //                 if($rootScope.widget.initTemplate){

        //         $mdDialog.show({
        //             controller: $rootScope.widget.initCtrl,
        //             templateUrl: $rootScope.widget.initTemplate,
        //             parent: angular.element(document.body),
        //             targetEvent: ev,
        //             locals: {
        //                 widId: $rootScope.widget.id,
        //                 widData: {},
        //                 fieldData: {}
        //             }
        //         })
        //         .then(function() {
        //             //$mdDialog.hide();
        //         }, function() {
        //             //$mdDialog.hide();
        //         });
        //     }
        //     $scope.close();
        // };

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

        // $scope.commentary = function(widget) {

        //     var comment = "";
        //     var chunks = [];

        //     $scope.close();
        // };

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

routerApp.controller('widgetSettingsDataCtrl',['$scope', '$http', '$mdDialog', '$rootScope', 'ScopeShare', '$filter', '$diginengine', 'generatePDF1', '$localStorage',
    function($scope, $http, $mdDialog, $rootScope, ScopeShare, $filter, $diginengine, generatePDF1, $localStorage){

        // ====== angular-table configuration ========
        $scope.config = {
            itemsPerPage: 7,
            fillLastPage: false
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

        $scope.eventHndler = {
                isLoadingChart: true,
                message: "Data Loading..."
            }

        $scope.initialize = function(){
                        
            //if widget is google maps
            switch($rootScope.widget.uniqueType){

                case "Dynamic Visuals":
                    
                    var query = $rootScope.widget.commonSrc.query;
                    $scope.client = $diginengine.getClient($rootScope.widget.commonSrc.src.src);

                    if( $localStorage.tableData === null || 
                        $localStorage.tableData == undefined ||
                        $localStorage.query != query || 
                        $localStorage.query == undefined ){
                            $scope.client.getExecQuery(query, function(data, status){
                                
                                $scope.fieldData = [];
                                for(var key in data[0]){
                                    $scope.fieldData.push(key);
                                }
                                var newTableData = [];
                                for(var i = 0; i < data.length; i++){
                                    
                                    var newObject = {};
                                    newObject["id"] = i;
                                    for(var j = 0; j < $scope.fieldData.length; j++){
                                        console.log()
                                        newObject[$scope.fieldData[j]] = data[i][$scope.fieldData[j]];
                                    }
                                    newTableData.push(newObject);
                                }
                                
                                $scope.tableData = newTableData;
                                $scope.originalList = newTableData;
                
                                //save in $localStorage
                                $localStorage.tableData = newTableData;
                                $localStorage.originalList = newTableData;
                                $localStorage.fieldData = $scope.fieldData;
                                $localStorage.query = query;   

                            });
                    }
                    else{   //retrieve from $localStorage
                            $scope.tableData = $localStorage.tableData;
                            $scope.originalList = $localStorage.originalList;
                            $scope.fieldData = $localStorage.fieldData;
                    }

                break;
                case "Google Maps Branches":
                    JSONData = ScopeShare.get('gmapsControllerBranch');
                    if (JSONData) {
                        JsonToArray();
                    }
                break;
                // case "Google Maps Claims":
                //     JSONData = ScopeShare.get('gmapsControllerClaim');
                //     if (JSONData) {
                //         JsonToArray();
                //     }
                // break;
                // case "Skill wise summary":
                //     $http.get('views/graph.json').success(function (data) {
                        
                //         JSONData = data;
                //         if (JSONData) {
                //             JsonToArray();
                //         }
                //     });   
                // break;
                case "Pivot Summary":
                    $scope.tableData = $rootScope.widget.widData.summary;
                    $scope.originalList = $scope.tableData;
                    $scope.fieldData = $rootScope.widget.widData.fieldArray;

                break;
                default:

                break;
            }

        }

        $scope.updateFilteredList = function(query) {
            $scope.tableData = $filter("filter")($scope.originalList, query);
        };

        $scope.downloadPDF = function(ev){

                            $mdDialog.show({
                                    controller: 'InputNameCtrl',
                                    templateUrl: 'views/getFileName.html',
                                    parent: angular.element(document.body),
                                    targetEvent: ev,
                                    clickOutsideToClose: true
                            }).then(function () {
                                if($rootScope.pdfFilename){
                                    var tableDataString = "";
                                    var header = "<thead>";

                                    for(var i = 0; i < $scope.fieldData.length; i++){
                                        header += "<th>" + $scope.fieldData[i].toString() + "</th>"; 
                                    }

                                    header += "</thead>" 
                                    tableDataString = "<table>" + header + "<tbody>";

                                    for(var i = 0; i < $scope.tableData.length; i++){
                                        console.log($scope.tableData[i]);
                                        var rowData = "<tr>";
                                        for(var j = 0; j < $scope.fieldData.length; j++){
                                           console.log($scope.tableData[i][$scope.fieldData[j]]);
                                           rowData += "<td>" +$scope.tableData[i][$scope.fieldData[j]].toString() + "</td>";
                                        }
                                        rowData += "</tr>";
                                        tableDataString += rowData
                                    }

                                    tableDataString += "</tbody></table>"
                    
                                    var htmlElement = $(".table-area").get(0);
                                    var config = {
                                        title: $rootScope.pdfFilename,
                                        titleLeft: 50, 
                                        titleTop: 20,
                                        tableLeft: 20,
                                        tableTop: 30
                                    };

                                    generatePDF1.generate(htmlElement, config, tableDataString);
                                    $rootScope.pdfFilename = "";       
                                }
                            });

                            
        }
        
        $scope.$watch('tableData', function(newValue, oldValue) {
                if (newValue){
                    $scope.eventHndler.isLoadingChart = false;
                }
        });

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

            //console.log(dashboardObj);

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
        icon: "styles/css/images/icons/facebook.svg"
    }, {
        provider: "google+",
        icon: "styles/css/images/icons/googleplus.svg"
    }, {
        provider: "twitter",
        icon: "styles/css/images/icons/twitter.svg"
    }, {
        provider: "linkedin",
        icon: "styles/css/images/icons/linkedin.svg"
    }, {
        provider: "pinterest",
        icon: "styles/css/images/icons/pinterest.svg"
    }, {
        provider: "tumbler",
        icon: "styles/css/images/icons/tumblr.svg"
    },{
        provider: "email",
        icon: "styles/css/images/icons/email.svg"
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



    $scope.openProvider = function(provider) {

        if(provider=="email")
        {
            $mdDialog.show({
                controller: 'emailCtrl',
                templateUrl: 'views/loginEmail.html',
                resolve: {

                }
            })
        }
        else if (provider=="")
        {
        }
        
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
                    widName: widget.title,
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

routerApp.controller('InputNameCtrl', [ '$scope', '$mdDialog', '$rootScope', function( $scope, $mdDialog, $rootScope) {
    
    $scope.setFileName = function(){
        if($scope.filename === undefined){
            $rootScope.pdfFilename = "Data";
        }
        else if($scope.filename.length > 0){
            $rootScope.pdfFilename = $scope.filename;
        }
        else{
            $rootScope.pdfFilename = "Data";
        }
        $scope.close();
    }

    $scope.close = function() {

        $mdDialog.hide();
    };

}]);

routerApp.controller('sunburstCtrl', [ '$scope', '$mdDialog', '$rootScope', 
    function( $scope, $mdDialog, $rootScope) {

        $scope.onClickDownload = function(){
            var svg = document.getElementById('d3Sunburst').childNodes[2].innerHTML;
            // var svg = $("svg");
            console.log("$scope.svg ", $scope.svg);
            var canvas = document.getElementById('canvas');
            canvg(canvas, svg);
            var dataURL = canvas.toDataURL('image/png');
            var downloadBtn = document.getElementById('downloadImage');
            downloadBtn.href = dataURL;
        }
    }
]);
