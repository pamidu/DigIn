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

routerApp.controller('widgetSettingsDataCtrl',['$scope', '$http', '$mdDialog', '$rootScope', 'ScopeShare', '$filter', '$diginengine', 'generatePDF1', '$localStorage',
    function($scope, $http, $mdDialog, $rootScope, ScopeShare, $filter, $diginengine, generatePDF1, $localStorage){

        // ====== angular-table configuration ========
        $scope.config = {
            itemsPerPage: 7,
            fillLastPage: false
        }
        $scope.eventHndler = {
                isLoadingChart: true,
                message: "Data Loading..."
        }
        $scope.defaultFileName = "file name";

        publicFun = {
            getDrilledLevel: function(){

                switch($rootScope.widget.widgetData.widData.drillConf.currentLevel){

                    case 1: var query = $rootScope.widget.widgetData.widData.drillConf.level1Query;
                    break;
                    case 2: var query = $rootScope.widget.widgetData.widData.drillConf.level2Query;
                    break;
                    case 3: var query = $rootScope.widget.widgetData.widData.drillConf.level3Query;
                    break;
                }

                return query;
            }
        }

        $scope.initialize = function(){  

            var query;
            switch($rootScope.widget.widgetData.uniqueType){

                case "Dynamic Visuals":

                    if($rootScope.widget.widgetData.widData.drilled){//drilled

                        query = publicFun.getDrilledLevel();
                    }
                    else{
                        query = $rootScope.widget.widgetData.commonSrc.query;
                    }
                    
                    $scope.client = $diginengine.getClient($rootScope.widget.widgetData.commonSrc.src.src);

                    if( $localStorage.tableData === null || 
                        $localStorage.tableData == undefined ||
                        $localStorage.query != query || 
                        $localStorage.query == undefined ){
                        console.log("$rootScope.widget", $rootScope.widget);
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
                break;
                case "Pivot Summary":
                    $scope.tableData = $rootScope.widget.widData.summary;
                    $scope.originalList = $scope.tableData;
                    $scope.fieldData = $rootScope.widget.widData.fieldArray;
                break;
                default:
                break;
            }
        }

        $scope.updateFilteredList = function(search) {
            $scope.tableData = $filter("filter")($scope.originalList, search);
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



routerApp.controller('saveCtrl', ['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', 'ObjectStoreService', 'DashboardService', 'ngToast','$filter', 'Digin_Domain', 'Digin_Engine_API',

    function($scope, $http, $objectstore, $mdDialog, $rootScope, ObjectStoreService, DashboardService, ngToast, $filter, Digin_Domain, Digin_Engine_API) {

        $scope.close = function() {

            $mdDialog.hide();
        };

     
        $scope.initialize = function(){

            //if dashboard is already saved one get its name and display
             if($rootScope.dashboard.compID){// dashboard is a saved one

                $scope.dashboardName = $rootScope.dashboard.compName;
                $scope.dashboardType = $rootScope.dashboard.compType;
                $scope.refreshInterval = $rootScope.dashboard.refreshInterval;
             }
        }
         
        $scope.isLoadingDashBoardSave=false;
        $scope.isButtonDashBoardSave=true;

        $scope.saveDashboard = function() {  

            if($scope.dashboardName && $scope.dashboardType && $scope.refreshInterval){
                $scope.isLoadingDashBoardSave = true;
                $scope.isButtonDashBoardSave=false;
                //if dashboard name type refreshinterval should be assigned to proceed
                ngToast.create({
                        className: 'info',
                        content: 'Saving Dashboard...',
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true
                });
                //get pages here
                var pagesArray = [];
                var pages = $rootScope.dashboard.pages;
                for(var i = 0; i < pages.length; i++){
                        //get widgets here
                        var widgetsArray = [];
                        var widgets = $rootScope.dashboard.pages[i].widgets;
                        for (var j = 0; j < widgets.length; ++j) {

                                    var widgetObject;
                                    //if the widget is a temporary / new widget 
                                    if($rootScope.dashboard.pages[i].widgets[j].widgetID.substr(0, 4) == "temp"){

                                       
                                        widgetObject = {   
                                            "widgetID": null,
                                            "widgetName": widgets[j].widgetName,
                                            "widgetData": widgets[j].widgetData
                                        }
                                    }
                                    else{
                                       
                                        widgetObject = {   
                                            "widgetID": widgets[j].widgetID,
                                            "widgetName": widgets[j].widgetName,
                                            "widgetData": widgets[j].widgetData
                                        }
                                    }
                                    widgetsArray.push(widgetObject); 
                        }

                        var pageObject;
                        //if the page is a temporary / new page 
                        if($rootScope.dashboard.pages[i].pageID.substr(0, 4) == "temp"){

                            pageObject = {
                                            "widgets": widgetsArray,
                                            "pageID": null,
                                            "pageName": pages[i].pageName,
                                            "pageData": null 
                            }
                        }
                        else{

                            pageObject = {
                                            "widgets": widgetsArray,
                                            "pageID": pages[i].pageID,
                                            "pageName": pages[i].pageName,
                                            "pageData": pages[i].pageData 
                            }
                        }
                        pagesArray.push(pageObject);
                }

                var dashboardObject;
                if($rootScope.dashboard.compID == null){

                    dashboardObject = {

                        "pages" : pagesArray,
                        "compClass": null,
                        "compType": null,
                        "compCategory": null,
                        "compID": null,
                        "compName": $scope.dashboardName,
                        "refreshInterval": $scope.refreshInterval,
                        "deletions": $rootScope.dashboard.deletions
                    }
                }
                else{

                    dashboardObject = {

                        "pages" : pagesArray,
                        "compClass": $rootScope.dashboard.compClass,
                        "compType": $rootScope.dashboard.compType,
                        "compCategory": $rootScope.dashboard.compCategory,
                        "compID": $rootScope.dashboard.compID,
                        "compName": $scope.dashboardName,
                        "refreshInterval": $rootScope.dashboard.refreshInterval,
                        // "deletions": {
                        //                 "componentIDs":[],
                        //                 "pageIDs":[],
                        //                 "widgetIDs":[]
                        //             }
                        "deletions": $rootScope.dashboard.deletions
                    }
                }
                console.log("dashboardObject", dashboardObject);
                //id fields are accepted close dialog
                //$mdDialog.hide();
                
                var userInfo = JSON.parse(getCookie("authData"));
                    
                $http({
                    method: 'POST',
                    url: Digin_Engine_API+'store_component',
                    data: angular.fromJson(angular.toJson(dashboardObject)),
                    headers: {  
                                'Content-Type': 'application/json',
                                'SecurityToken':userInfo.SecurityToken,
                                'Domain':Digin_Domain
                    }
                })
                .success(function(response){

                    console.log("response", response);
                    //assign the id name type refresh interval to dashboard
                    var selectedPage = $rootScope.selectedPage;
                    $rootScope.dashboard.compID = response.Result;
                    $rootScope.dashboard.compName = $scope.dashboardName;
                    $rootScope.dashboard.compType = $scope.dashboardType;
                    $rootScope.dashboard.refreshInterval = $scope.refreshInterval;

                    $rootScope.privateFun.getAllDashboards();
                    $scope.isLoadingDashBoardSave = false;
                    $scope.isButtonDashBoardSave=true;
                    $mdDialog.hide();
                    ngToast.create({
                        className: 'success',
                        content: 'Successfuly Saved Dashboard',
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true
                    });


                })
                .error(function(error){  

                    ngToast.create({
                        className: 'danger',
                        content: 'Failed Saving Dashboard. Please Try Again!',
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true
                    });
                    $scope.isLoadingDashBoardSave = false;
                    $scope.isButtonDashBoardSave=true;
                    $mdDialog.hide()
                });   

            }else{ // one of the fields not filled
                ngToast.create({
                        className: 'danger',
                        content: 'Please fill all the fields and try again!',
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
    },{
        provider: "email",
        icon: "styles/css/images/icons/email.svg"
    }];

    $scope.close = function() {

        $mdDialog.hide();
    };
    $scope.openProvider = function(provider) {

        if(provider=="email"){
            $mdDialog.show({
                controller: 'emailCtrl',
                templateUrl: 'views/loginEmail.html',
                resolve: {

                }
            })
        }
        else if (provider==""){
        }
    };
}]);


routerApp.controller('ExportCtrl', ['$scope', '$objectstore', '$mdDialog', '$rootScope', 
    function( $scope, $objectstore, $mdDialog, $rootScope) {

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

routerApp.controller('emailCtrl', ['$scope', '$rootScope', '$mdDialog','generatePDF3','$http','ngToast','$pdfString','$uploader','$helpers','$mdToast','$v6urls', 
    function($scope, $rootScope, $mdDialog, generatePDF3,$http,ngToast,$pdfString,$uploader,$helpers,$mdToast,$v6urls) {

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

        $scope.sendMail = function(sendState){
            //$scope.sendMailState = false;

            // ----generate pdf---------------
            var htmlElement = $("#mainContainer");
            var title = "Dashboard";
            var config = {
                        title:"Dashboard",
                        titleLeft: 50, 
                        titleTop: 20,
                        tableLeft: 0,
                        tableTop: 30
            };
            generatePDF3.generate(htmlElement, config);
            // -------------------

            var decodeUrl = $pdfString.returnPdf();
            var blobFile = dataURItoBlob(decodeUrl) 
            blobFile.name = 'dashboard.pdf'
            $scope.uploadPdfName = 'dashboard.pdf'; 

            $uploader.uploadMedia("diginDashboard",blobFile,blobFile.name);
            $uploader.onSuccess(function (e, data) {
                cosole.log(data)
                $scope.deliverMail($scope.emailTo);
                console.log("upload success")
            });
            $uploader.onError(function (e, data) { 
                var toast = $mdToast.simple()
                .content('There was an error, please upload!')
                .action('OK')
                .highlightAction(false)
                .position("bottom right");
                $mdToast.show(toast).then(function () {
                    //whatever
                }); 
            });

            $mdDialog.hide();
        };
        function dataURItoBlob(dataURI, callback) {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            var byteString = atob(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

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
        $scope.validateEmail=function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
        $scope.fireMsg=function (msgType, content) {
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
        $scope.deliverMail=function (mailTo) {

            var path =  "http://digin.io/apis/media/tenant/diginDashboard/dashboard.pdf"
             
            
            // var path =  "http://sachilagmailcom.space.test.12thdoor.com/apis/media/tenant/diginDashboard/dashboard.pdf"
            $scope.mailData =   {
                    "type": "email",
                    "to": mailTo,
                    "subject": "Confirmation",
                    "from": "Digin <noreply-digin@duoworld.com>",
                    "Namespace": "com.duosoftware.com",
                    "TemplateID": "T_Email_GENERAL",
                    "attachments": [{
                                  "filename": $scope.uploadPdfName,
                                  "path": path
                                 }],
                    "DefaultParams": {
                        "@@CNAME@@": "",
                        "@@TITLE@@": "Dash board mail delivery",
                        "@@MESSAGE@@": "Dash Board Mail Dilivery System",
                        "@@CNAME@@": "",
                        "@@APPLICATION@@": "Digin.io",
                        "@@FOOTER@@": "Copyright 2016",
                        "@@LOGO@@": ""
                    },
                    "CustomParams": {
                        "@@CNAME@@": "",
                        "@@TITLE@@": "Dash board mail delivery",
                        "@@MESSAGE@@": "Dash Board Mail Dilivery System",
                        "@@CNAME@@": "",
                        "@@APPLICATION@@": "Digin.io",
                        "@@FOOTER@@": "Copyright 2016",
                        "@@LOGO@@": ""
                    }
            };

            $http({
                    method: 'POST',
                    url: 'http://104.197.27.7:3500/command/notification',
                    data: angular.toJson($scope.mailData),
                    headers:{'Content-Type': 'application/json',
                            'securitytoken': userInfo.SecurityToken
                            }
            })
            .success(function(response){
                        alert("Mail Sent...!");                        
            })
            .error(function(error){   
                        alert("Fail !");                        
            });     
        }
}]);

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

        getJSONData($http, 'widgetType', function(data) {
            $scope.WidgetTypes = data;
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

            if($scope.currWidget.initTemplate){
            $mdDialog.show({
                    controller: $scope.currWidget.initCtrl,
                    templateUrl: $scope.currWidget.initTemplate,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        widgetID : id
                    }
                })
                .then(function() {
                }, function() {
                });
            }
        };

        $scope.closeDialog = function() {
            $mdDialog.hide();
        };

        $scope.cancelDialog = function() {
            $mdDialog.cancel();
        };

        $scope.addAllinOne = function(widget, ev) {

            var widgetLimit = 6;
            if($rootScope.dashboard.pages[0].widgets.length < widgetLimit){

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
                                        "widgetData": $scope.currWidget
                                }

                $rootScope.dashboard.pages[$rootScope.selectedPage-1].widgets.push(widgetObj);
                $scope.openInitialConfig( ev, widgetObj.widgetID);
                $rootScope.widgetType = widget.title;

                console.log("$rootScope.dashboard.pages[0].widgets", $rootScope.dashboard.pages[0].widgets);
            }
            else{
                privateFun.fireMessage('0','Maximum Widget Limit Exceeded');
            }

            $mdDialog.hide();
        };
    }
]);

routerApp.controller('InputNameCtrl', [ '$scope', '$mdDialog', '$rootScope', function( $scope, $mdDialog, $rootScope) {
    
    $scope.setFileName = function(){
        if($scope.filename === undefined){
            $rootScope.pdfFilename = $rootScope.widget.widgetData.uniqueType;
        }
        else if($scope.filename.length > 0){
            $rootScope.pdfFilename = $scope.filename;
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
            var canvas = document.getElementById('canvas');
            canvg(canvas, svg);
            var dataURL = canvas.toDataURL('image/png');
            var downloadBtn = document.getElementById('downloadImage');
            downloadBtn.href = dataURL;
        }
    }
]);

routerApp.controller('hierarchySummaryCtrl', [ '$scope', '$mdDialog', '$rootScope', 
    function( $scope, $mdDialog, $rootScope) {
        var svg;
        
        $scope.onClickDownload = function(){

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




