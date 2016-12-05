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

    '$rootScope', '$mdDialog', '$objectstore', '$sce', 'AsTorPlotItems', '$log', '$http', 'ScopeShare', '$filter', 'DashboardService',
    function($scope, $rootScope, $mdDialog, $objectstore, $sce, AsTorPlotItems, $log, $http, ScopeShare, $filter, DashboardService) {

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

        $scope.close = function() {
            $mdDialog.hide();
        };

        $scope.closeDialog = function() {
            $mdDialog.hide();
        };

        // $scope.clear = function() {
        //     $rootScope.dashboard.pages[$rootScope.selectePage-1].widgets = [];
        // };

        // $scope.remove = function(widget) {
        //     $rootScope.dashboard.widgets.splice($rootScope.dashboard.widgets.indexOf(widget), 1);
        // };

        // init dashboard
        // $scope.selectedDashboardId = '1';

    }
]);

routerApp.controller('widgetSettingsDataCtrl', ['$scope', '$http', '$mdDialog', '$rootScope', 'ScopeShare', '$filter', '$diginengine', 'generatePDF1', '$localStorage',
    function($scope, $http, $mdDialog, $rootScope, ScopeShare, $filter, $diginengine, generatePDF1, $localStorage) {

        // ====== angular-table configuration ========
        $scope.config = {
            itemsPerPage: 10,
            fillLastPage: false
        }
        $scope.eventHndler = {
            isLoadingChart: true,
            message: "Data Loading..."
        }
        $scope.defaultFileName = "file name";

        publicFun = {
            getDrilledLevel: function() {

                switch ($rootScope.widget.widgetData.widData.drillConf.currentLevel) {

                    case 1:
                        var query = $rootScope.widget.widgetData.widData.drillConf.level1Query;
                        break;
                    case 2:
                        var query = $rootScope.widget.widgetData.widData.drillConf.level2Query;
                        break;
                    case 3:
                        var query = $rootScope.widget.widgetData.widData.drillConf.level3Query;
                        break;
                }

                return query;
            }
        }


        $scope.initialize = function() {


            if ($rootScope.widget.widgetName == "sunburst" || $rootScope.widget.widgetName == "hierarchy") {

                $scope.tableData = [];
                // if($rootScope.widget.widgetData.commonSrc.src.fMeaArr.length > 0)
                //     var parent =$rootScope.widget.widgetData.commonSrc.src.fMeaArr[0].name;

                $scope.fieldData = [parent, "value"];

                var id = 0;
                var data;

                data = $rootScope.widget.widgetData.TochartData.children;

                var newTableData = [];
                for (var i = 0; i < data.length; i++) {

                    if (typeof data[i].children == "object") {

                        if ($rootScope.widget.widgetData.commonSrc.att.length > 2) {
                            var childone = $rootScope.widget.widgetData.commonSrc.att[0].filedName;
                            var childtwo = $rootScope.widget.widgetData.commonSrc.att[2].filedName;
                            var childthree = $rootScope.widget.widgetData.commonSrc.att[1].filedName;
                           
                            $scope.fieldData = [childone, childtwo, childthree, "value"];

                            for (var x = 0; x < data[i].children.length; x++) {
                                for (var y = 0; y < data[i].children[x].children.length; y++) {
                                    //for(var z=0; z< data[i].children[x].children[y].children.length ; z++){
                                    var newObject = {};
                                    id++;
                                    newObject["id"] = id;
                                    newObject[childone] = data[i].type;
                                    newObject[childtwo] = data[i].children[x].type;
                                    newObject[childthree] = data[i].children[x].children[y].type;
                                    newObject["value"] = data[i].children[x].children[y].size;
                                    // if($rootScope.widget.widgetData.commonSrc.src.fMeaArr.length > 0)
                                    //     newObject[parent]  = data[i].children[x].children[y].children[z].type;
                                    newTableData.push(newObject);
                                    //}

                                }
                            }
                        } else if ($rootScope.widget.widgetData.commonSrc.att.length === 2) {
                            var childone = $rootScope.widget.widgetData.commonSrc.att[0].filedName;
                            var childtwo = $rootScope.widget.widgetData.commonSrc.att[1].filedName;
                            //$scope.fieldData=[childone,childtwo,parent];
                            $scope.fieldData = [childone, childtwo, "value"];
                            for (var x = 0; x < data[i].children.length; x++) {
                                //for(var y = 0; y < data[i].children[x].children.length; y++){
                                var newObject = {};
                                id++;
                                newObject["id"] = id;
                                newObject[childone] = data[i].type;
                                newObject[childtwo] = data[i].children[x].type;
                                newObject["value"] = data[i].children[x].size;
                                //newObject[parent]  = data[i].children[x].children[y].type;
                                newTableData.push(newObject);
                                //}
                            }
                        } else if ($rootScope.widget.widgetData.commonSrc.att.length === 1) {
                            var childone = $rootScope.widget.widgetData.commonSrc.att[0].filedName;
                            $scope.fieldData = [childone, "value"];
                            //for (var x = 0; x < data[i].children.length; x++) {
                            var newObject = {};
                            id++;
                            newObject["id"] = id;
                            newObject[childone] = data[i].type;
                            newObject["value"] = data[i].size;
                            newTableData.push(newObject);
                            //}
                        }

                    }
                }
                console.log(newTableData);
                $scope.tableData = newTableData;
                $scope.originalList = newTableData;

            } else if ($rootScope.widget.widgetName == "forecast") {
                $scope.fieldData = [];
                $scope.fieldData[0] = "Date";
                var forecast_field = $rootScope.widget.widgetData.foreCastObj.f_field;

                for (var i = 0; i < $rootScope.widget.widgetData.highchartsNG.series.length; i++) {
                    if (typeof $rootScope.widget.widgetData.highchartsNG.series[i].name != "undefined")
                        nameOfFeild = $rootScope.widget.widgetData.highchartsNG.series[i].name + "_" + forecast_field;
                    else
                        nameOfFeild = forecast_field;
                    $scope.fieldData[i + 1] = nameOfFeild.replace(/\s+/g, '');
                }
                var newTableData = [];

                for (var i = 0; i < $rootScope.widget.widgetData.highchartsNG.xAxis.categories.length; i++) {
                    var newObject = {};
                    newObject["id"] = i;

                    newObject[$scope.fieldData[0]] = $rootScope.widget.widgetData.highchartsNG.xAxis.categories[i];

                    for (var j = 1; j < $scope.fieldData.length; j++) {
                        if ($rootScope.widget.widgetData.highchartsNG.series[j - 1].data[i] == "" ||
                            typeof $rootScope.widget.widgetData.highchartsNG.series[j - 1].data[i] == "undefined")
                            newObject[$scope.fieldData[j]] = 0;
                        else
                            newObject[$scope.fieldData[j]] = $rootScope.widget.widgetData.highchartsNG.series[j - 1].data[i];
                    }
                    newTableData.push(newObject);
                }
                $scope.tableData = newTableData;
                $scope.originalList = newTableData;
            } else if ($rootScope.widget.widgetName == "bubble") {
                $scope.fieldData = [];
                var newTableData = [];
                // for(var i=0; i< $rootScope.widget.widgetData.commonSrc.src.fAttArr.length; i++){
                //         $scope.fieldData.push($rootScope.widget.widgetData.commonSrc.src.fAttArr[i]);
                // }
                $scope.fieldData.push($rootScope.widget.widgetData.commonSrc.src.fAttArr[0].name);
                for (var i = 0; i < $rootScope.widget.widgetData.commonSrc.src.fMeaArr.length; i++) {
                    $scope.fieldData.push($rootScope.widget.widgetData.commonSrc.src.fMeaArr[i].name);
                }
                for (var i = 0; i < $rootScope.widget.widgetData.highchartsNG.series.length; i++) {
                    var newObject = {};
                    newObject["id"] = i;

                    newObject[$scope.fieldData[0]] = $rootScope.widget.widgetData.highchartsNG.series[i].name;
                    newObject[$scope.fieldData[1]] = $rootScope.widget.widgetData.highchartsNG.series[i].data[0].x;
                    newObject[$scope.fieldData[2]] = $rootScope.widget.widgetData.highchartsNG.series[i].data[0].y;
                    newObject[$scope.fieldData[3]] = $rootScope.widget.widgetData.highchartsNG.series[i].data[0].z;
                    newTableData.push(newObject);
                }
                $scope.tableData = newTableData;
                $scope.originalList = newTableData;

            } else if ($rootScope.widget.widgetName == "histogram") {
                $scope.fieldData = ["lower_bound", "upper_bound", "value"];
                var newTableData = [];

                for (var i = 0; i < $rootScope.widget.widgetData.highchartsNG.series[0].data.length; i++) {
                    var newObject = {};
                    newObject["id"] = i;
                    newObject["lower_bound"] = $rootScope.widget.widgetData.highchartsNG.xAxis.categories[i][0];
                    newObject["upper_bound"] = $rootScope.widget.widgetData.highchartsNG.xAxis.categories[i][1];
                    newObject["value"] = $rootScope.widget.widgetData.highchartsNG.series[0].data[i];
                    newTableData.push(newObject);
                }
                $scope.tableData = newTableData;
                $scope.originalList = newTableData;
            } else if($rootScope.widget.widgetName == "boxplot") {
                $scope.fieldData = ["Experiment","Maximum" , "Minimum" ,"Q1" , "Q2" , "Q3" ];
                var min,max;
                var data_boxplot = $rootScope.widget.widgetData.highchartsNG.series[0].data;
                var outlier = $rootScope.widget.widgetData.highchartsNG.series[1].data;
                var categories = $rootScope.widget.widgetData.highchartsNG.xAxis.categories;
                var newTableData = [];
                for(var i = 0; i < data_boxplot.length; i++){
                    var newObject = {};
                    newObject["id"] = i;
                    newObject["Experiment"] = categories[i];
                    min = data_boxplot[i][0];
                    newObject["Q1"] = data_boxplot[i][1];
                    newObject["Q2"] = data_boxplot[i][2];
                    newObject["Q3"] = data_boxplot[i][3];                   
                    max = data_boxplot[i][4];

                    for(var j=0; j<outlier.length; j++){
                        if(outlier[j][0] == i){
                            if ( outlier[j][1] < min ){
                                min = outlier[j][1];
                            }
                            if ( outlier[j][1] > max ){
                                max = outlier[j][1];
                            }
                        }
                    }
                    newObject["Minimum"] = min;
                    newObject["Maximum"] = max;
                    newTableData.push(newObject);
                }
                $scope.tableData = newTableData;
                $scope.originalList = newTableData;
            }
            else {
                var query;
                switch ($rootScope.widget.widgetData.uniqueType) {

                    case "Dynamic Visuals":
                        $scope.fieldData = [];
                        if ($rootScope.widget.widgetData.highchartsNG.xAxis !== undefined) {
                            if ($rootScope.widget.widgetData.highchartsNG.xAxis.title !== undefined) {
                                $scope.fieldData[0] = $rootScope.widget.widgetData.highchartsNG.xAxis.title.text;
                            }
                        } else {
                            $scope.fieldData[0] = "label"
                        }
                        $scope.serObj = angular.copy($rootScope.widget.widgetData.highchartsNG.series);
                        angular.forEach($scope.serObj, function(series) {
                            $scope.fieldData.push(series.name);
                            angular.forEach(series.data, function(data) {
                                var tempY = data.y;
                                var tempName = data.name;
                                delete data.y;
                                delete data.name;
                                delete series.color;
                                delete series.id;
                                delete series.origName;
                                data[series.name] = tempY;
                                data[$scope.fieldData[0]] = tempName;
                            });
                            delete series.name;
                        });
                        var temp = {};
                        for (var i = 0; i < $scope.serObj.length - 1; i++) {
                            angular.merge($scope.serObj[i + 1].data, $scope.serObj[i].data, $scope.serObj[i + 1].data);
                        }
                        var data = $scope.serObj[$scope.serObj.length - 1].data;

                        var newTableData = [];
                        for (var i = 0; i < data.length; i++) {
                            var newObject = {};
                            newObject["id"] = i;
                            for (var j = 0; j < $scope.fieldData.length; j++) {
                                if (typeof data[i][$scope.fieldData[j]] == 'number') {
                                    newObject[$scope.fieldData[j]] = (Math.round(data[i][$scope.fieldData[j]] * 100) / 100);
                                } else {
                                    newObject[$scope.fieldData[j]] = data[i][$scope.fieldData[j]];
                                }
                            }
                            newTableData.push(newObject);
                        }
                        $scope.tableData = newTableData;
                        $scope.originalList = newTableData;

                        break;
                    case "Google Maps Branches":
                        break;
                    case "Pivot Summary":
                        $scope.fieldData = [];
                        var newTableData = [];
                        for (var i = 0; i < $rootScope.widget.widgetData.widData.fieldArray.length; i++) {
                            $scope.fieldData.push($rootScope.widget.widgetData.widData.fieldArray[i]);
                        }
                        for (var i = 0; i < $rootScope.widget.widgetData.widData.summary.length; i++) {
                            var newObject = {};
                            newObject["id"] = i;

                            for (var b = 0; b < $scope.fieldData.length; b++) {
                                var field = $scope.fieldData[b];
                                newObject[$scope.fieldData[b]] = $rootScope.widget.widgetData.widData.summary[i][field];
                            }
                            newTableData.push(newObject);

                        }
                        $scope.tableData = newTableData;
                        $scope.originalList = newTableData;
                        break;
                    default:
                        break;
                }
            }

        }

        $scope.updateFilteredList = function(search) {
            $scope.filtered = angular.copy($scope.originalList);
            if (search != "") {
                $scope.filtered.forEach(o => delete o.id)
                $scope.tableData = $filter("filter")($scope.filtered, search);
            } else {
                $scope.tableData = $filter("filter")($scope.filtered, search);
            }
        };

        $scope.downloadPDF = function(ev) {

            $mdDialog.show({
                controller: 'InputNameCtrl',
                templateUrl: 'views/getFileName.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function() {
                if ($rootScope.pdfFilename) {
                    var tableDataString = "";
                    var header = "<thead>";

                    for (var i = 0; i < $scope.fieldData.length; i++) {
                        header += "<th>" + $scope.fieldData[i].toString() + "</th>";
                    }

                    header += "</thead>"
                    tableDataString = "<table>" + header + "<tbody>";

                    for (var i = 0; i < $scope.tableData.length; i++) {
                        console.log($scope.tableData[i]);
                        var rowData = "<tr>";
                        for (var j = 0; j < $scope.fieldData.length; j++) {
                            console.log($scope.tableData[i][$scope.fieldData[j]]);
                            rowData += "<td>" + $scope.tableData[i][$scope.fieldData[j]].toString() + "</td>";
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
            if (newValue) {
                $scope.eventHndler.isLoadingChart = false;
            }
        });

        $scope.close = function() {

            $mdDialog.hide();
        };

    }
]);



routerApp.controller('saveCtrl', ['$scope', '$qbuilder', '$http', '$objectstore', '$mdDialog', '$rootScope', 'ObjectStoreService', 'DashboardService', 'ngToast', '$filter', 'Digin_Domain', 'Digin_Engine_API', '$state', 'pouchDbServices', 'saveDashboardService',

    function($scope, $qbuilder, $http, $objectstore, $mdDialog, $rootScope, ObjectStoreService, DashboardService, ngToast, $filter, Digin_Domain, Digin_Engine_API, $state, pouchDbServices, saveDashboardService) {


        $scope.close = function() {

            $mdDialog.hide();
        };


        $scope.initialize = function() {

            //if dashboard is already saved one get its name and display
            if ($rootScope.dashboard.compID) { // dashboard is a saved one

                $scope.dashboardName = $rootScope.dashboard.compName;
                $scope.dashboardType = $rootScope.dashboard.compType;
                $scope.refreshInterval = $rootScope.dashboard.refreshInterval.toString();
            }
        }

        $scope.isLoadingDashBoardSave = false;
        $scope.isButtonDashBoardSave = true;

        //insert records into pouchdb
        //call the service here 

        $scope.saveDashboard = function() {

            if(saveDashboardService.IsSavingINprogress == false){

                    if ($scope.dashboardName && $scope.refreshInterval) {

                        var noDuplicate = true;
                        //to check weather the newpage is allready exist
                        noDuplicate = saveDashboardService.checkDashboardName($scope.dashboardName);

                        if (noDuplicate) {
                            $scope.isLoadingDashBoardSave = true;
                            $scope.isButtonDashBoardSave = false;
                            //if dashboard name type refreshinterval should be assigned to proceed
                            ngToast.create({
                                className: 'info',
                                content: 'Saving dashboard...',
                                horizontalPosition: 'center',
                                verticalPosition: 'top',
                                dismissOnClick: true
                            });
                            //save dashboard
                            saveDashboardService.saveDashboard($scope.dashboardName, $scope.refreshInterval, 'dashboard', $scope);


                        } else { // one of the fields not filled
                            ngToast.create({
                                className: 'danger',
                                content: 'You can not duplicate the name..',
                                horizontalPosition: 'center',
                                verticalPosition: 'top',
                                dismissOnClick: true
                            });
                        }
                    } else {
                        ngToast.create({
                            className: 'danger',
                            content: 'Please fill all the fields and try again!',
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            dismissOnClick: true
                        });
                    }
            }
            else{
                  ngToast.create({className: 'danger',
                     content: 'Dashboard saving in progress, please try again later!',
                     horizontalPosition: 'center',
                     verticalPosition: 'top',
                    dismissOnClick: true
                 });
              }
        }
    }
]);


routerApp.controller('shareCtrl', ['$scope', '$rootScope', '$objectstore', '$mdDialog', function($scope, $rootScope,
    $objectstore, $mdDialog) {

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
    }, {
        provider: "email",
        icon: "styles/css/images/icons/email.svg"
    }];

    $scope.close = function() {

        $mdDialog.hide();
    };
    $scope.openProvider = function(provider) {

        if (provider == "email") {
            $mdDialog.show({
                controller: 'emailCtrl',
                templateUrl: 'views/loginEmail.html',
                resolve: {

                }
            })
        } else if (provider == "") {}
    };
}]);


routerApp.controller('ExportCtrl', ['$scope', '$objectstore', '$mdDialog', '$rootScope',
    function($scope, $objectstore, $mdDialog, $rootScope) {

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
    }
]);

routerApp.controller('ThemeCtrl', ['$scope', '$rootScope', '$objectstore', '$mdDialog',
    function($scope, $rootScope, $objectstore, $mdDialog) {

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
        };

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

    }
]);


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

routerApp.controller('emailCtrl', ['$scope', '$rootScope', '$mdDialog', 'generatePDF3', '$http', 'ngToast', '$pdfString', '$uploader', '$helpers', '$mdToast', '$v6urls',
    function($scope, $rootScope, $mdDialog, generatePDF3, $http, ngToast, $pdfString, $uploader, $helpers, $mdToast, $v6urls) {

        $scope.generateSnapshot = function() {

            // var htmlElement = $("#mainContainer");
            // var title = "Dashboard";
            // var config = {
            //             title:"Dashboard",
            //             titleLeft: 50, 
            //             titleTop: 20,
            //             tableLeft: 0,
            //             tableTop: 30
            // };
            // generatePDF3.generate(htmlElement, config);

        };

        // $scope.getMailDetail = function(sendState){
        //     $scope.sendMailState = true;
        // };

        $scope.sendMail = function(sendState) {
            var mail = $scope.emailTo;
            if ($scope.validateEmail1(mail) == false) {
                return;
            } else if ($scope.validateEmail2(mail) == false) {
                $scope.fireMsg('0', 'Please enter valid email address to proceed.');
                return;
            } else {
                $scope.proceedMail(sendState);
            }
        };


        $scope.proceedMail = function(sendState) {
            //$scope.sendMailState = false;

            // ----generate pdf---------------
            var htmlElement = $("#mainContainer");
            var title = "Dashboard";
            var config = {
                title: "Dashboard",
                titleLeft: 50,
                titleTop: 20,
                tableLeft: 0,
                tableTop: 30
            };
            //generatePDF3.generate(htmlElement, config);

            var doc = new jsPDF('landscape');
            var options = {
                format: 'PNG'
            };

            doc.addHTML(htmlElement, config.tableLeft, config.tableTop, options, function() {
                var pdfName = config.title.toString() + '.pdf';
                doc.text(config.titleLeft, config.titleTop, config.title);
                //doc.save(pdfName);
                var output = doc.output('datauristring')
                $pdfString.savePdf(output);

                //var file = base64ToBlob(output.replace('data:application/pdf;base64,',''), 'image/png');


                //#---------------------------------------  

                var decodeUrl = $pdfString.returnPdf();
                var blobFile = dataURItoBlob(decodeUrl)
                blobFile.name = 'dashboard.pdf'
                blobFile.type = 'application/pdf'
                blobFile["Content-Type"] = "application/pdf"

                $scope.uploadPdfName = 'dashboard.pdf';

                $uploader.uploadMedia("diginDashboard", blobFile, blobFile.name);
                $uploader.onSuccess(function(e, data) {
                    console.log(data);
                    $scope.deliverMail($scope.emailTo);
                    console.log("upload success")
                });
                $uploader.onError(function(e, data) {
                    var toast = $mdToast.simple()
                        .content('There was an error, please upload!')
                        .action('OK')
                        .highlightAction(false)
                        .position("bottom right");
                    $mdToast.show(toast).then(function() {
                        //whatever
                    });
                });

                //$scope.deliverMail($scope.emailTo);
                $mdDialog.hide();
            });

        };


        function dataURItoBlob(dataURI, callback) {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            var byteString = atob(dataURI.split(",")[1]);

            // separate out the mime component
            var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]

            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // write the ArrayBuffer to a blob, and you're done
            var bb = new Blob([ab]);
            return bb;
        }

        $scope.validateEmail1 = function(email) {
            if (email == undefined) {
                $scope.fireMsg('0', 'Email can not be a blank.');
                return false;
            } else if (email == "") {
                $scope.fireMsg('0', 'Email can not be a blank.');
                return false;
            } else {
                return true;
            }
            return true;
        }

        $scope.validateEmail2 = function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
        $scope.fireMsg = function(msgType, content) {
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
                dismissOnClick: true
            });
        }

        $scope.closeDialog = function() {
            $mdDialog.hide();
        };




        $scope.deliverMail = function(mailTo) {

            var host = window.location.hostname;

            var path = "http://prod.digin.io/apis/media/tenant/diginDashboard/dashboard.pdf"

            $scope.mailData = {
                "type": "email",
                "to": mailTo,
                "subject": "Dashboard mail delivery",
                "from": "Digin <noreply-digin@duoworld.com>",
                "Namespace": "com.duosoftware.com",
                "TemplateID": "T_Email_GENERAL",
                "attachments": [{
                    "filename": "dashboard.pdf",
                    "path": path
                }],
                "DefaultParams": {
                    "@@CNAME@@": "",
                    "@@TITLE@@": "Dashboard mail delivery",
                    "@@MESSAGE@@": "Please find the attachment here",
                    "@@CNAME@@": "",
                    "@@APPLICATION@@": "Digin.io",
                    "@@FOOTER@@": "Copyright DigIn 2016",
                    "@@LOGO@@": ""
                },
                "CustomParams": {
                    "@@CNAME@@": "",
                    "@@TITLE@@": "Dashboard mail delivery",
                    "@@MESSAGE@@": "Please find the attachment here",
                    "@@CNAME@@": "",
                    "@@APPLICATION@@": "Digin.io",
                    "@@FOOTER@@": "Copyright DigIn 2016",
                    "@@LOGO@@": ""
                }
            };

            var token = getCookie("securityToken");
            $http({
                method: 'POST',
                url: 'http://104.197.27.7:3500/command/notification',
                data: $scope.mailData,
                headers: {
                    'Content-Type': 'application/json',
                    'securitytoken': token
                }
            }).then(function(response) {
                console.log(response)
                $scope.fireMsg('1', 'Mail sent successfully!');
            }, function(response) {
                console.log(response)
                $scope.fireMsg('0', 'Mail sending fail!');
            })
        }
    }
]);

routerApp.controller('errorCtrl', ['$scope', '$objectstore', '$mdDialog', function($scope,

    $objectstore, $mdDialog) {
    $scope.closeDialog = function() {
        // Easily hides most recent dialog shown...
        // no specific instance reference is needed.
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

routerApp.controller('addWidgetCtrl', ['$scope', '$timeout', '$rootScope', '$mdDialog', '$sce', '$http', '$objectstore', 'dashboard', '$log', 'ngToast',
    function($scope, $timeout, $rootScope, $mdDialog, $sce, $http, $objectstore, dashboard, $log, ngToast) {

        var privateFun = (function() {
            return {
                fireMessage: function(msgType, msg) {

                    var _className;
                    if (msgType == '0') {
                        _className = 'danger';
                    } else if (msgType == '1') {
                        _className = 'success';
                    }
                    ngToast.create({
                        className: _className,
                        content: msg,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true
                    });
                }
            }
        })();


        $scope.selected = {};



        getJSONData($http, 'widgetType', function(data) {
            $scope.WidgetTypes = data;
            $scope.selected.type = data[0].title;
        });

        getJSONData($http, 'widgets', function(data) {
            $scope.Widgets = data;
            console.log($scope.Widgets);
        });

        $scope.filterWidgets = function(item) {
            if (item == null) {
                item.title = "Visualization";
            }
            $scope.selected = {};
            $scope.selected.type = item.title;
            $rootScope.widgetType = $scope.selected.type;
        };

        $scope.openInitialConfig = function(ev, id) {

            if ($scope.currWidget.initTemplate) {
                $mdDialog.show({
                        controller: $scope.currWidget.initCtrl,
                        templateUrl: $scope.currWidget.initTemplate,
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        locals: {
                            widgetID: id
                        }
                    })
                    .then(function() {}, function() {});
            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.addAllinOne = function(widget, ev) {

            var widgetLimit = 6;
            // if($rootScope.dashboard.pages[0].widgets.length < widgetLimit){

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
                id: Math.floor(Math.random() * (100 - 10 + 1) + 10),
                type: widget.type,
                width: '370px',
                left: '0px',
                top: '0px',
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
                highchartsNG: null

            }

            var msg = new SpeechSynthesisUtterance(+$rootScope.username + ' you are adding' + widget.title + ' widget');
            window.speechSynthesis.speak(msg);

            var widgetObj = {
                "widgetID": "temp" + Math.floor(Math.random() * (100 - 10 + 1) + 10),
                "widgetName": $scope.currWidget.widName,
                "widgetData": $scope.currWidget,
                sizeX: 7,
                sizeY: 23,

            }

            $rootScope.dashboard.pages[$rootScope.selectedPage - 1].widgets.push(widgetObj);
            $scope.openInitialConfig(ev, widgetObj.widgetID);
            $rootScope.widgetType = widget.title;

            console.log("$rootScope.dashboard.pages[0].widgets", $rootScope.dashboard.pages[0].widgets);
            // }
            // else{
            //     privateFun.fireMessage('0','Maximum Widget Limit Exceeded');
            // }

            $mdDialog.hide();
        };
    }
]);

routerApp.controller('InputNameCtrl', ['$scope', '$mdDialog', '$rootScope', function($scope, $mdDialog, $rootScope) {

    $scope.setFileName = function() {
        if ($scope.filename === undefined) {
            $rootScope.pdfFilename = $rootScope.widget.widgetData.uniqueType;
        } else if ($scope.filename.length > 0) {
            $rootScope.pdfFilename = $scope.filename;
        }
        $scope.close();
    }

    $scope.close = function() {

        $mdDialog.hide();
    };
}]);

routerApp.controller('sunburstCtrl', ['$scope', '$mdDialog', '$rootScope',
    function($scope, $mdDialog, $rootScope) {

        $scope.onClickDownload = function() {

            var svg = document.getElementById('d3Sunburst').childNodes[2].innerHTML;
            var canvas = document.getElementById('canvas');
            canvg(canvas, svg);
            var dataURL = canvas.toDataURL('image/png');
            var downloadBtn = document.getElementById('downloadImage');
            downloadBtn.href = dataURL;
        }
    }
]);

routerApp.controller('hierarchySummaryCtrl', ['$scope', '$mdDialog', '$rootScope',
    function($scope, $mdDialog, $rootScope) {
        var svg;

        $scope.onClickDownload = function() {

            // var svg = document.getElementById('d3Force').childNodes[1].innerHTML;
            // console.log("svg", svg);
            var canvas = document.getElementById('canvas');
            // console.log("ctrl $scope.svg", $scope.svg);
            canvg(canvas, $rootScope.hierarchySvg);
            var dataURL = canvas.toDataURL('image/png');
            var downloadBtn = document.getElementById('downloadImage');
            downloadBtn.href = dataURL;
        }


    }
]);

