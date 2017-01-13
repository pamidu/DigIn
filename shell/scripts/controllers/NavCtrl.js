routerApp.controller('NavCtrl', ['$scope', '$mdBottomSheet', '$mdSidenav', '$mdUtil',
    '$timeout', '$rootScope', '$mdDialog', '$mdMenu', '$objectstore', '$state', '$http', 'filterService',
    '$localStorage', '$window', '$qbuilder', 'ObjectStoreService', 'DashboardService', '$log', '$mdToast',

    'DevStudio', '$auth', '$helpers', 'dynamicallyReportSrv', 'Digin_Engine_API', 'Digin_Tomcat_Base', 'ngToast', 'Digin_Domain', 'Digin_LogoUploader', 'Digin_Tenant', '$filter', 'ProfileService', 'pouchDB',  '$interval', 'notifications', 'pouchDbServices','IsLocal','saveDashboardService','colorManager','layoutManager','apis_Path','auth_Path','dbType',
    function ($scope, $mdBottomSheet, $mdSidenav, $mdUtil, $timeout, $rootScope, $mdDialog,$mdMenu, $objectstore, $state,
              $http, filterService, $localStorage, $window, $qbuilder, ObjectStoreService, DashboardService, $log, $mdToast, DevStudio,
              $auth, $helpers, dynamicallyReportSrv, Digin_Engine_API, Digin_Tomcat_Base, ngToast, Digin_Domain, Digin_LogoUploader, Digin_Tenant, $filter, ProfileService, pouchDB, $interval, notifications, pouchDbServices,IsLocal,saveDashboardService, colorManager, layoutManager,apis_Path,auth_Path,dbType) {

        if (DevStudio) {
            $auth.checkSession();
        } else {
            var sessionInfo = $helpers.getCookie('securityToken');
            // if(sessionInfo==null) location.href = 'index.php';
        }
		$rootScope.sharableUsers = [];
		$rootScope.sharableGroups = [];
        $scope.firstName = JSON.parse(decodeURIComponent(getCookie('authData'))).Username;  
        var interval;
		
		//Theming
		$rootScope.lightOrDark = '';
		$rootScope.currentColor = '';
		$rootScope.h1color = '';
		colorManager.changeTheme('default');


         //#Added by Chamila
        //#to get session detail for logged user
        $http.get(auth_Path+'GetSession/' + getCookie('securityToken') + '/Nil')
            .success(function (data) {
                console.log(data);
                $rootScope.SessionDetail = data;
                var pouchdbName = data.UserID + data.Domain;
                console.log(pouchdbName);
         
                $rootScope.db  = new pouchDB(pouchdbName);
                $scope.getSearchPanelDetails(); 
            }).error(function () {
            //alert("Oops! There was a problem retrieving the groups");
        });

        //#to get tenant ID for logged user
         $http.get(auth_Path+'tenant/GetTenants/' + getCookie('securityToken'))
            .success(function (data) {
                console.log(data);
                $rootScope.TenantID = data[0].TenantID;
                $rootScope.TenantName=data[0].Name;
            }).error(function () {
            //alert("Oops! There was a problem retrieving the groups");
        });

        $scope.checkIslocal = function(){
            if(IsLocal == true){
                $rootScope.db  = new pouchDB("Dashboards");
                $scope.getSearchPanelDetails(); 
            }
        }
        
            
        //#get user profile       
        var baseUrl = "http://" + window.location.hostname;
        //$http.get('http://omalduosoftwarecom.prod.digin.io/apis/profile/userprofile/omal@duosoftware.com')
        $http.get(baseUrl+apis_Path+'profile/userprofile/'+$scope.firstName)
            .success(function (response) {
                console.log(response);
                $rootScope.profile_Det = response;
                ProfileService.InitProfileData(response);
            }).error(function (error) {
            //fireMsg('0', '<strong>Error : </strong>Please try again...!');
        });

        $rootScope.refreshDashboard = function() {
            $rootScope.interval = $interval(function() {
                var count = 0;
                if ($state.current.name == "home.Dashboards") {
                    if ($rootScope.dashboard !== undefined) {
                        if ($rootScope.dashboard.refreshInterval !== undefined || $rootScope.dashboard.refreshInterval !== null) {
                            //sync chart widgets
                            var index = $rootScope.selectedPageIndx;
                            if ($rootScope.dashboard.pages[index]["isSeen"]) {
                                for (var i = 0; i < $rootScope.dashboard.pages[index].widgets.length; i++) {
                                    count++;
                                    var widget = $rootScope.dashboard.pages[index].widgets[i];
                                    if (typeof(widget.widgetData.commonSrc) != "undefined") {
                                        //Clear the filter indication when the chart is re-set
                                        widget.widgetData.filteredState = false;
                                        filterService.clearFilters(widget);
                                        $qbuilder.sync(widget.widgetData, function (data) {
                                            if (count == $rootScope.dashboard.pages[index].widgets.length) {
                                                // save dashboard to pouch db
                                                var tempDashboard = angular.copy($rootScope.dashboard);
                                                angular.forEach(tempDashboard.pages,function(page){
                                                    //remove if the page is temporary
                                                    if (page.pageID.substr(0,4) == "temp"){
                                                        tempDashboard.pages.splice(tempDashboard.pages.indexOf(page), 1);
                                                    }
                                                    if (tempDashboard.pages.indexOf(page) > 0){
                                                        //remove temporary widgets in each page
                                                        angular.forEach(page.widgets,function(widget){
                                                            if (widget.widgetID.substr(0, 4) == "temp"){
                                                                page.widgets.splice(page.widgets.indexOf(widget), 1);
                                                            }
                                                        });
                                                    }
                                                });
                                                pouchDbServices.pageSync(tempDashboard);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            },$rootScope.refreshInterval);
        }
        //#set initial logo as Digin logo
        $scope.imageUrl = "styles/css/images/DiginLogo.png";
        $rootScope.myCroppedImage = "styles/css/images/signup-user.png";
        $rootScope.profile_pic = "styles/css/images/signup-user.png";

        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
        var res = userInfo.Username.replace("@", "_");
        var NameSpace = res.replace(".", "_");

        $http.get(Digin_Engine_API + 'get_user_settings?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain)
            .success(function (data) {
                if(data.Custom_Message=="No user settings saved for given user and domain")   {
                     $scope.callUserInitialize();
                }
                else{
                    $rootScope.image ='http://' + Digin_Domain +  data.Result.logo_path;
                    $rootScope.profile_pic = data.Result.dp_path;
                    if (data.Result.components==null || data.Result.components=="true" || data.Result.components=="false"){
                        data.Result.components = {
                            saveExplicit : false,
                            dashboardId : null
                        };
                        data.Result.components = JSON.stringify(data.Result.components);
                    }
                    $rootScope.userSettings = data.Result;
                    ProfileService.UserDataArr.BannerPicture = 'http://' + Digin_Domain + data.Result.dp_path;
                    ProfileService.widget_limit = data.Result.widget_limit;
                    $rootScope.onsiteDate=data.Result.created_date_time;

                    if($rootScope.onsiteDate==undefined){
                        $rootScope.onsiteDate=new Date();
                    }

                    if (data.Result.logo_path == undefined) {
                        $rootScope.image = "styles/css/images/DiginLogo.png";
                        $rootScope.myCroppedImage = "styles/css/images/setting/user100x100.png";
                        $rootScope.profile_pic = "styles/css/images/setting/user100x100.png";
                    }
                    else {
                        $rootScope.image = 'http://' + Digin_Domain  + data.Result.logo_path;
                        $rootScope.profile_pic = 'http://' + Digin_Domain + data.Result.dp_path;
                    }

                    $scope.getURL();
                    $scope.imageUrl = $rootScope.image;
                    $scope.profile_picURL = $rootScope.profile_pic;

                    //if user has a default dashboard open it 

                    var obj = JSON.parse($rootScope.userSettings.components);

                    if(obj.dashboardId != null){

                        //check wether this defauld dashboard is allreday in pauch 
                            var db = $rootScope.db;
                            var count =0;
                            db.allDocs({
                                include_docs: true,
                                attachments: true
                            }).catch(function (err) {
                                console.log(err);
                            }).then(function (data) {
                                if(data.rows.length > 0){
                                        angular.forEach(data.rows, function (row) {
                                        count++;
                                        if(row.doc.dashboard.compID == obj.dashboardId){
                                            var dashboardObj = {
                                                "dashboardID" : obj.dashboardId,
                                                "dashboardName" : row.doc.dashboard.compName,
                                                "pouchID" : row.id
                                            };

                                            $rootScope.goDashboard(dashboardObj);

                                        }
                                        else if(count == data.rows.length){
                                            $scope.getDashboard(obj.dashboardId);
                                        }
                                    });
                                }else{
                                     $scope.getDashboard(obj.dashboardId);
                                }
                                
                                console.log($scope.dashboards);
                            });
                        //--------------------------------------------------------
                    
                        $rootScope.data.defaultDashboard=obj.dashboardId;
                    }
                }
            })
            .error(function (data) {
                $scope.imageUrl = "styles/css/images/DiginLogo.png";
                $scope.profile_pic = "styles/css/images/setting/user100x100.png";
                $scope.getURL();
            });


            $scope.callUserInitialize=function(){
                //$scope.data = {"db": "bigquery"}


                    if(dbType=="mssql"){
                        $scope.data = {"db": "mssql"}
                    }
                    else if(dbType=="bigquery"){
                        $scope.data = {"db": "bigquery"}
                    }
                    else{
                        $scope.data = {"db": "bigquery"}
                    }




                    $http({
                        method: 'POST',
                        url: Digin_Engine_API+'set_init_user_settings',
                        data: angular.toJson($scope.data),
                        headers: {
                            'SecurityToken': userInfo.SecurityToken
                        }
                    })
                    .success(function (response) {
                        $scope.callUserSettings();
                    })
                    .error(function (error) {
                            
                    });
            }


            $scope.callUserSettings=function(){
                $http.get(Digin_Engine_API + 'get_user_settings?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain)
                .success(function (data) {

                    $rootScope.image ='http://' + Digin_Domain +  data.Result.logo_path;
                    $rootScope.profile_pic = data.Result.dp_path;
                    if (data.Result.components==null || data.Result.components=="true" || data.Result.components=="false"){
                        data.Result.components = {
                            saveExplicit : false,
                            dashboardId : null
                        };
                        data.Result.components = JSON.stringify(data.Result.components);
                    }
                    $rootScope.userSettings = data.Result;
                    ProfileService.UserDataArr.BannerPicture = 'http://' + Digin_Domain + data.Result.dp_path;
                    ProfileService.widget_limit = data.Result.widget_limit;


                    if (data.Result.logo_path == undefined) {
                        $rootScope.image = "styles/css/images/DiginLogo.png";
                        $rootScope.myCroppedImage = "styles/css/images/setting/user100x100.png";
                        $rootScope.profile_pic = "styles/css/images/setting/user100x100.png";
                    }
                    else {
                        $rootScope.image = 'http://' + Digin_Domain  + data.Result.logo_path;
                        $rootScope.profile_pic = 'http://' + Digin_Domain + data.Result.dp_path;
                    }

                    $scope.getURL();
                    $scope.imageUrl = $rootScope.image;
                    $scope.profile_picURL = $rootScope.profile_pic;

                    //if user has a default dashboard open it 

                    var obj = JSON.parse($rootScope.userSettings.components);
                    if(obj.dashboardId != null){
                        $scope.getDashboard(obj.dashboardId);
                        $rootScope.data.defaultDashboard=obj.dashboardId;
                    }
                })
                .error(function (data) {
                    $scope.imageUrl = "styles/css/images/DiginLogo.png";
                    $scope.profile_pic = "styles/css/images/setting/user100x100.png";
                    $scope.getURL();
                });
            }
			

        //close open pages and go to home
        $scope.mainclose = function (ev) {
            setTimeout(function(){ $mdDialog.hide(); }, 3000);
            $mdDialog.show({

                controller: function goHomeCtrl($scope, $mdDialog) {

                    $scope.goHome = function () {

                        $rootScope.currentView = "Home";
                        $mdDialog.cancel();
                        $state.go('home.welcomeSearch');
                        $scope.createuuid = function () {

                            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

                        }

                        $rootScope.page_id = "";
                        $rootScope.dashboard = [];
                        $rootScope.dashboard = {

                            "pages": null,
                            "compClass": null,
                            "compType": null,
                            "compCategory": null,
                            "compID": null,
                            "compName": null,
                            "refreshInterval": null,
                        }

                        $rootScope.dashboard.pages = [];
                        var page = {
                            "widgets": [],
                            "pageID": "temp" + $scope.createuuid(),
                            "pageName": "DEFAULT",
                            "pageData": null
                        }
                        $rootScope.dashboard.pages.push(page);

                    }

                    $scope.cancel = function () {
                        $mdDialog.cancel();
                        homeState = false;
                    };


                },
                templateUrl: 'views/goHome.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true

            })

        }

        //shows tennant dialog box
        $scope.showTennant = function (ev) {

            $mdDialog.show({
                templateUrl: 'templates/TennantDialogTemplate.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                //controller start
                controller: function showTennantController($scope, $mdDialog, $http, $auth) {
                    /*
                     var userInfo = JSON.parse(getCookie("authData"));
                     //console.log(JSON.parse(userInfo.Otherdata.TenentsAccessible));
                     console.log(JSON.parse(userInfo.Otherdata.TenentsAccessible).replace('`', '"'));
                     //$scope.tennants = JSON.parse(userInfo.Otherdata.TenentsAccessible);
                     $scope.tennants = JSON.parse(userInfo.Otherdata.TenentsAccessible).replace('`', '"');
                     */

                    var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
                    $rootScope.username = userInfo.Username;
                    $http.get(auth_Path+'tenant/GetTenants/' + userInfo.SecurityToken)
                        .success(function (response) {
                            $scope.tennants = response;
                        });

                    $scope.showConfirmation = function (tennant, event) {
                        //$mdDialog.show(
                        var confirm = $mdDialog.confirm()
                            .title('Do you want to switching to ' + tennant)
                            .targetEvent(event)
                            .ok('Yes!')
                            .cancel('No!');
                        $mdDialog.show(confirm).then(function () {
                            //console.log(JSON.stringify(tennant));
                            $scope.status = 'Yes';
                            //window.location = "http://"+tennant;
                            //window.open("http://" + tennant);
                            window.open("http://" + tennant + "/#/home");
                        }, function () {
                            //alert('No!');
                            $scope.status = 'No';
                        });
                        //)
                    };
                    $scope.close = function () {
                        $mdDialog.cancel();
                    };
                }
                //controller end
            }).then(function (answer) {
            }, function () {
            });
        };

        $scope.dashboards = [];
        $rootScope.reports = [];
        $scope.analyzers = [];
        $scope.favoriteDashboards = [];
        $scope.favoriteReports = [];
        $scope.favoriteAnalyzers = [];
        $scope.ExistingDashboardDetails = [];
        ////////// dashboard structure ////////

        $scope.defaultPage = {
            "widgets": [],
            "pageID": "temp1111",//default page id
            "pageName": "DEFAULT",
            "pageData": null
        };
        $scope.defaultDashboard = {
            "pages": [$scope.defaultPage],
            "compClass": null,
            "compType": null,
            "compCategory": null,
            "compID": null,
            "refreshInterval": null,
            "deletions": {
                "componentIDs": [],
                "pageIDs": [],
                "widgetIDs": []
            }
        }
        // set initial selected page 
        $rootScope.selectedPage = 1;
        // angular-table configuration 
        $scope.configDashboards = {
            itemsPerPage: 5,
            fillLastPage: true
        }
        $scope.configReports = {
            itemsPerPage: 5,
            fillLastPage: true
        }
        $scope.configAnalyzers = {
            itemsPerPage: 5,
            fillLastPage: true
        }
        //adding the default dashboard to rootScope
        $rootScope.dashboard = $scope.defaultDashboard;

        $rootScope.dashboards_toNameChk = $scope.dashboards;
        $scope.originalDashboardsList = $scope.dashboards;
        $scope.originalReportssList = $rootScope.reports;

        $scope.updateFilteredList = function () {
            $scope.dashboards = $filter("filter")($scope.originalDashboardsList, $scope.searchText);
            $rootScope.reports = $filter("filter")($scope.originalReportssList, $scope.searchText);
        };

        //change dates range in likes
        $scope.changeDatesRange = function (widId, sinceDay, untilDay) {

            var diffDays = getDateDifference(untilDay, sinceDay);

            var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
            var pgId = $rootScope.dashboard.widgets[objIndex].widData.pgData.id;

            var dateObj = {
                until: untilDay,
                range: diffDays
            };
            fbInterface.getPageLikesInsight(pgId, dateObj, function (data) {
                $scope.chartConf = {
                    "options": {
                        "chart": {
                            "type": "area"
                        },
                        "plotOptions": {
                            "series": {
                                "stacking": ""
                            }
                        }
                    },
                    "series": [{
                        "name": "Like Count",
                        "data": [],
                        "id": "series-0",
                        "type": "line",
                        "dashStyle": "ShortDashDot",
                        "connectNulls": false
                    }],
                    "title": {
                        "text": "Page Likes"
                    },
                    "credits": {
                        "enabled": false
                    },
                    "loading": false,
                    "xAxis": {
                        "type": "datetime",
                        "currentMin": 0
                    },
                    "yAxis": {
                        "min": 0
                    }
                };
                var likeHistory = fbInterface.getPageLikesObj(data);
                $scope.chartConf.series[0].data = likeHistory.likeArr;
                $scope.chartConf.series[0].pointStart = Date.UTC(likeHistory.start.getUTCFullYear(), likeHistory.start.getUTCMonth(), likeHistory.start.getUTCDate());
                ;
                $scope.chartConf.series[0].pointInterval = likeHistory.interval;

                $rootScope.dashboard.widgets[objIndex].widData.likeData = $scope.chartConf;
            });
        };

        //change dates in views
        $scope.changeViewedDatesRange = function (widId, sinceDay, untilDay) {

            var diffDays = getDateDifference(untilDay, sinceDay);

            var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
            var pgId = $rootScope.dashboard.widgets[objIndex].widData.pgData.id;

            var dateObj = {
                until: untilDay,
                range: diffDays
            };
            fbInterface.getPageViewsInsight(pgId, dateObj, function (data) {
                $scope.chartConf = {
                    "options": {
                        "chart": {
                            "type": "area"
                        },
                        "plotOptions": {
                            "series": {
                                "stacking": ""
                            }
                        }
                    },
                    "series": [{
                        "name": "View Count",
                        "data": [],
                        "id": "series-0",
                        "type": "area",
                        "dashStyle": "ShortDashDot",
                        "connectNulls": false,
                        "color": "#FF5722"
                    }],
                    "title": {
                        "text": "Page Views"
                    },
                    "credits": {
                        "enabled": false
                    },
                    "loading": false,
                    "xAxis": {
                        "type": "datetime",
                        "currentMin": 0
                    },
                    "yAxis": {
                        "min": 0
                    }
                };
                var viewHistory = fbInterface.getPageLikesObj(data);
                $scope.chartConf.series[0].data = viewHistory.likeArr;
                $scope.chartConf.series[0].pointStart = Date.UTC(viewHistory.start.getUTCFullYear(), viewHistory.start.getUTCMonth(), viewHistory.start.getUTCDate());
                ;
                $scope.chartConf.series[0].pointInterval = viewHistory.interval;

                $rootScope.dashboard.widgets[objIndex].widData.viewData = $scope.chartConf;
            });
        };
        //On click report Event
        $scope.goReport = function (report) {
            // --- Add by Gevindu on 5/23/2016 - DUODIGIN-509
            $state.go('home.DynamicallyReportBuilder', {'reportNme': report});
			$rootScope.currentView ="Reports || "+report;
        }

        //Function to Delete Dashbord
        $scope.DeleteDashBoard = function (dashboard) {
            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
            $scope.Det = [{
                "comp_id": dashboard.dashboardID,
                "permanent_delete": false
            }];

            $http({
                method: 'DELETE',
                url: Digin_Engine_API + 'delete_components',
                data: angular.toJson($scope.Det),
                headers: {
                    'Securitytoken': userInfo.SecurityToken
                }
            })
                .success(function (response) {
                    var db = $rootScope.db;
                    db.get($rootScope.page_id, function (err, doc) {
                        if (err) {
                        }
                        else {
                            db.remove(doc)
                            .catch(function (err) {
                                //fail silently
                            });                            
                        }
                    });
                    privateFun.getAllDashboards();                    
                    ngToast.create({
                        className: 'success',
                        content: "Dashbord deleted successfully...!",
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true
                    });
                    $scope.confirmWin = false;
                    $scope.listWin = true;
                })
                .error(function (error) {
                    //alert("Fail...!");
                    ngToast.create({
                        className: 'danger',
                        content: "Dashboard deletion fail...!",
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true
                    });
                    $scope.confirmWin = false;
                    $scope.listWin = true;
                });
        }

        //Function to confirm Dashbord deletion
        $scope.ConfirmDashbordDeletion = function (confmWin, lstWin, dashboard) {
            $scope.confirmWin = confmWin;
            $scope.listWin = lstWin;
            $rootScope.dboard = dashboard;
        }

        $scope.deleteDashBoard = function(dashboard,ev){
            var confirm = $mdDialog.confirm()
                  .title('Delete Dashboard')
                  .textContent('Do you want to delete this dashboard...?')
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .ok('yes')
                  .cancel('no');
                    $mdDialog.show(confirm).then(function() {
                      $scope.DeleteDashBoard(dashboard);
                    }, function() {
                      
            });

        }

        //-------------- setup default dashboard ---------
        $rootScope.data = {
          defaultDashboard : '',
        };



        $scope.setDefaultDashboard = function(ev,dashboard) {
           //alert($rootScope.data.defaultDashboard);

           var confirm = $mdDialog.confirm()
          .title('Set a default dashboard')
          .textContent('Would you like to set '+dashboard.dashboardName+' as your default dashboard?')
          .ariaLabel('')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('No');

            $mdDialog.show(confirm).then(function() {

              //set the user settings object
               //#chk undefined values
            var dp_name="";
            var logo_name="";
            var components; var userRole; var cacheLifetime; var widgetLimit; var themeConfig; var queryLimit;

            if($rootScope.userSettings.components==undefined){components=0;}  else {components=$rootScope.userSettings.components}
            if($rootScope.userSettings.user_role==undefined)  {userRole="";}  else {userRole=$rootScope.userSettings.user_role}
            if($rootScope.userSettings.cache_lifetime==undefined){cacheLifetime=0;}else{cacheLifetime=$rootScope.userSettings.cache_lifetime}
            if($rootScope.userSettings.widget_limit==undefined){widgetLimit=0;}else {widgetLimit=$rootScope.userSettings.widget_limit}
            if($rootScope.userSettings.query_limit==undefined){queryLimit=0;} else{queryLimit=$rootScope.userSettings.query_limit}
            if($rootScope.userSettings.dp_path==undefined) {dp_name="";}else{dp_name=$rootScope.userSettings.dp_path.split("/").pop();}
            if($rootScope.userSettings.logo_path==undefined){logo_name="";} else{logo_name=$rootScope.userSettings.logo_path.split("/").pop();}
            if($rootScope.userSettings.theme_config==undefined){themeConfig="";} else{themeConfig=$rootScope.userSettings.theme_config} 

            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));

            var obj = JSON.parse($rootScope.userSettings.components);
            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));

            var components ={
                "saveExplicit" : obj.saveExplicit,
                "dashboardId"  : dashboard.dashboardID
            };

            var userSettings = {
                "email": userInfo.Email,
                "components": JSON.stringify(components),
                "user_role":userRole,
                "cache_lifetime":cacheLifetime,
                "widget_limit": widgetLimit,
                "query_limit": queryLimit,
                "logo_name": logo_name,
                "dp_name" : dp_name,
                "theme_config": themeConfig
            } 
              //send request to set the default dashboard 
               
              
              $http({
                    method: 'POST',
                    url: Digin_Engine_API + 'store_user_settings/',
                    data: angular.toJson(userSettings),
                    headers: {
                        'Content-Type': 'application/json',
                        'SecurityToken': userInfo.SecurityToken
                        //'Domain': Digin_Domain
                    }
                })
                .success(function (response) {
                    //alert("Success...!");
                    ngToast.create({
                                className: 'success',
                                content: "You have successfully set up a default dashboard",
                                horizontalPosition: 'center',
                                verticalPosition: 'top',
                                dismissOnClick: true
                    });

                    var obj = JSON.parse($rootScope.userSettings.components);
                    var components ={
                        "saveExplicit" : obj.saveExplicit,
                        "dashboardId"  : dashboard.dashboardID
                    };
                    $rootScope.userSettings.components=JSON.stringify(components);
                    $rootScope.data.defaultDashboard=dashboard.dashboardID;
                    
                })
                .error(function (error) {
                });


            }, function() {
                //if there is no defalt dashboard already set make it null, if not take it from rootscope and set it 
                    var obj = JSON.parse($rootScope.userSettings.components);
                    $rootScope.data.defaultDashboard=obj.dashboardId;
             
            });

        };
        //-------------------------------------------------
        

        

        $rootScope.goDashboard = function (dashboard) {

            if(saveDashboardService.IsSavingINprogress == true){
                return;
            }

            $rootScope.currentView = "Dashboards || " + dashboard.dashboardName;
            //$scope.openSearchBar();
            console.log($scope.dashboards);
            console.log("dash item", dashboard);
            $rootScope.page_id = "";
            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));

            if(typeof(dashboard.pouchID) != "undefined"){
                   var db = $rootScope.db;
                   db.get(dashboard.pouchID, function (err, doc) {
                    if (err) {
                        ngToast.create({
                            className: 'danger',
                            content: 'Failed retrieving Dashboard Details. Please try again!',
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            dismissOnClick: true
                        });
                    }
                    else {
                        var dashboard = doc.dashboard;
                        $rootScope.dashboard = dashboard;
                        $rootScope.page_id = doc._id;
                        //deletions attribute is missing from dashboard
                        //so adding that attribute with all arrays inside empty
                        $rootScope.dashboard["deletions"] = {
                            "componentIDs": [],
                            "pageIDs": [],
                            "widgetIDs": []
                        };
                        $rootScope.selectedPageIndx = 0;
                        $rootScope.selectedPage = 1;

                        for (var i = 0; i < $rootScope.dashboard.pages[$rootScope.selectedPage-1].widgets.length; i++) {
                            var widget = $rootScope.dashboard.pages[$rootScope.selectedPage-1].widgets[i];
                            if (typeof(widget.widgetData.commonSrc) != "undefined") {
                                widget.widgetData.syncState = true;
                                $scope.$apply();
                            }
                        }
                        if ($rootScope.dashboard.refreshInterval == '0') {
                            $interval.cancel($rootScope.interval);
                            $rootScope.interval = undefined;
                            $rootScope.refreshInterval == undefined;

                        } else {
                            $interval.cancel($rootScope.interval);
                            $rootScope.interval = undefined;
                            $rootScope.refreshInterval = $rootScope.dashboard.refreshInterval * 1000;
                            $rootScope.refreshDashboard();                            
                        }
                    }
                });
                $state.go('home.Dashboards');
            }else{
                 $scope.getDashboard(dashboard.dashboardID);
            }


            $(".overlay").removeClass("overlay-search active");
            $(".nav-search").removeClass("active");
            $(".search-layer").removeClass("activating active");

        }

    $scope.getDashboard = function(dashboardID){
             $http({
                    method: 'GET',
                    url: Digin_Engine_API + 'get_component_by_comp_id?comp_id=' + dashboardID + '&SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain
                })
                    .success(function (data) {

                        if (data.Is_Success ) {

                            if(data.Result != null ){
                                console.log("$scope.dashboardObject", $scope.dashboardObject);
                                    $rootScope.dashboard = data.Result;
                                    //deletions attribute is missing from dashboard
                                    //so adding that attribute with all arrays inside empty
                                    $rootScope.dashboard["deletions"] = {
                                        "componentIDs": [],
                                        "pageIDs": [],
                                        "widgetIDs": []
                                    };
                                    $rootScope.selectedPageIndx = 0;
                                    $rootScope.selectedPage = 1;


                                    //set deletioins
                                    data.Result["deletions"] = {
                                        "componentIDs": [],
                                        "pageIDs": [],
                                        "widgetIDs": []
                                    };
                                    //insert the new dashboard in to pouch DB
                                    pouchDbServices.insertPouchDB(data.Result,null,undefined,false); 

                                    var index = 0;
                                    for (var i = 0; i < $rootScope.dashboard.pages[index].widgets.length; i++) {
                                        $rootScope.dashboard.pages[index]["isSeen"] = true;
                                        var widget = $rootScope.dashboard.pages[index].widgets[i];
                                        console.log('syncing...');
                                        if (typeof(widget.widgetData.commonSrc) != "undefined") {
                                            widget.widgetData.syncState = false;
                                            //Clear the filter indication when the chart is re-set
                                            widget.widgetData.filteredState = false;
                                            filterService.clearFilters(widget);                                    
                                            if (widget.widgetData.selectedChart.chartType != "d3hierarchy" && widget.widgetData.selectedChart.chartType != "d3sunburst") {
                                                $qbuilder.sync(widget.widgetData, function (data) {
                                                    widget.widgetData.syncState = true;
                                                });
                                            }
                                        }
                                    }
                                    if ($rootScope.dashboard.refreshInterval == '0') {
                                        $interval.cancel($rootScope.interval);
                                        $rootScope.interval = undefined;
                                        $rootScope.refreshInterval == undefined;

                                    } else {
                                        $interval.cancel($rootScope.interval);
                                        $rootScope.interval = undefined;
                                        $rootScope.refreshInterval = $rootScope.dashboard.refreshInterval * 1000;
                                        $rootScope.refreshDashboard();                            
                                    }
                                    $state.go('home.Dashboards');
                                    $rootScope.currentView = dashboard.dashboardName; 
                            }
                           
                        }
                        else {

                            ngToast.create({
                                className: 'danger',
                                content: data.Custom_Message,
                                horizontalPosition: 'center',
                                verticalPosition: 'top',
                                dismissOnClick: true
                            });
                            $mdDialog.hide();
                        }
                        console.log("data goDashboard", data);
                    })
                    .error(function (error) {

                        ngToast.create({
                            className: 'danger',
                            content: 'Failed retrieving Dashboard Details. Please refresh page to load data!',
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            dismissOnClick: true
                        });
                        $mdDialog.hide()
                    });
        }


        $scope.goAnalyzer = function (report) {
            $scope.showTabs(false);
            //closing the overlay
            $(".overlay").removeClass("overlay-search active");
            $(".nav-search").removeClass("active");
            $(".search-layer").removeClass("activating active");

            $state.go('home.AnalyzerViewer', {
                param: report
            });
        }

        $scope.savePentaho = function (ev, dashboard) {
            $mdDialog.show({
                controller: 'savePentahoCtrl',
                templateUrl: 'views/pentaho_save.html',
                targetEvent: ev,
                resolve: {
                    widget: function () {
                        return dashboard;
                    }
                }
            })
        }

        // update damith
        // get all reports details
        var privateFun = (function () {
            var rptService = $localStorage.erportServices;
            var reqParameter = {
                apiBase: Digin_Engine_API,
                tomCatBase: Digin_Tomcat_Base,
                token: '',
                reportName: '',
                queryFiled: ''
            };
            var getSession = function () {
                reqParameter.token = getCookie("securityToken");
            };

            var startReportService = function () {
                if (rptService == 0) {
                    dynamicallyReportSrv.startReportServer(reqParameter).success(function (res) {
                        $localStorage.erportServices = 1;
                    }).error(function (err) {
                        //false
                    });
                }
            };//end


            return {
                getAllDashboards: function () {
					$scope.componentsLoaded = false;
                    var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));

                    $scope.dashboards = [];
                    $rootScope.reports = [];
                    $http({
                        method: 'GET',

                        url: Digin_Engine_API + 'get_all_components?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain
                    })
                        .success(function (data) {
							$scope.componentsLoaded = true;
                            console.log("data getAllDashboards", data);

                            $scope.dashboards = [];

                            // seperate reports and dashboards
                            for (var i = 0; i < data.Result.length; i++) {
                                if (data.Result[i].compType == "Report") {
                                    $rootScope.reports.push(
                                        {splitName: data.Result[i].compName, path: '/dynamically-report-builder', reportId: data.Result[i].compID}
                                    );

                                    DashboardService.reports = $rootScope.reports;
                                }
                                else {

                                    $scope.dashboards.push(
                                        {dashboardID: data.Result[i].compID, dashboardName: data.Result[i].compName}
                                    );

                                    DashboardService.dashboards = $scope.dashboards;

                                }
                            }
                            
                          
                            //fetch all saved dashboards from pouchdb
                            var db = $rootScope.db;
                            db.allDocs({
                                include_docs: true,
                                attachments: true
                            }).catch(function (err) {
                                console.log(err);
                            }).then(function (data) {
                                angular.forEach(data.rows, function (row) {
                                    console.log(typeof(row.doc.dashboard));
                                    //var records = CircularJSON.parse(row.doc.dashboard);
                                    var records = row.doc.dashboard;
                                    var isAvailble = false;
                                    for (var i = 0; i < $scope.dashboards.length; i++) {
                                        if ($scope.dashboards[i].dashboardID == records.compID) {
                                            isAvailble = true;
                                            $scope.dashboards[i]["pouchID"] = row.doc._id;
                                        }
                                    }
                                    if (isAvailble == false) {
                                        $scope.dashboards.push(
                                            {pouchID: row.doc._id, dashboardName: records.compName}
                                        );
                                    }
                                });
                                console.log($scope.dashboards);
                            });
                            $mdDialog.hide();
                        })
                        .error(function (error) {

                            ngToast.create({
                                className: 'success',
                                content: 'Retrieved dashboard details from localStorage!',
                                horizontalPosition: 'center',
                                verticalPosition: 'top',
                                dismissOnClick: true
                            });
                            //fetch all saved dashboards from pouchdb
                            var db = $rootScope.db;
                            db.allDocs({
                                include_docs: true,
                                attachments: true
                            }).catch(function (err) {
                                console.log(err);
                            }).then(function (data) {
                                angular.forEach(data.rows, function (row) {
                                    console.log(typeof(row.doc.dashboard));
                                    //var records = CircularJSON.parse(row.doc.dashboard);
                                    var records = row.doc.dashboard;
                                    $scope.dashboards.push(
                                        {pouchID: row.doc._id, dashboardName: records.compName}
                                    );
                                });
                                console.log($scope.dashboards);
                            });
                            $mdDialog.hide()
                        });

                    $scope.confirmWin = false;
                    $scope.listWin = true;
                },
                // getAllReports: function () {
                //     getSession();
                //     startReportService();
                //     dynamicallyReportSrv.getAllReports(reqParameter).success(function (data) {
                //         if (data.Is_Success) {
                //             for (var i = 0; i < data.Result.length; i++) {
                //                 $rootScope.reports.push(
                //                     {splitName: data.Result[i], path: '/dynamically-report-builder'}
                //                 );
                //             }
                //         }
                //     }).error(function (respose) {
                //         console.log('error request getAllReports...');
                //     });
                // },


                getTenantID: function () {
                $http.get(auth_Path+'tenant/GetTenants/' + getCookie('securityToken'))
                        .success(function (data) {
                            console.log(data);
                            $rootScope.TenantID = data[0].TenantID;
                        }).error(function () {
                        //alert("Oops! There was a problem retrieving the groups");
                    });
                },

                //#added by chamila
				/*
                //#to retrive all users and groups
                getAllSharableObj: function () {
                    var baseUrl = "http://" + window.location.hostname;
                    //var baseUrl = "http://" + $rootScope.TenantID;
                    $scope.domain = JSON.parse(decodeURIComponent(getCookie('authData'))).Domain;
                    //$http.get("http://omalduosoftwarecom.prod.digin.io/apis/usercommon/getSharableObjects")
                    $http.get(baseUrl + "/apis/usercommon/getSharableObjects")
                        .success(function (data) {
                            console.log(data);
                            $rootScope.sharableObjs = [];
                            $rootScope.sharableUsers = [];
                            $rootScope.sharableGroups = [];

                            for (var i = 0; i < data.length; i++) {
                                if (data[i].Type == "User") {
                                    //$scope.sharableObjs.push({groupId: data[i].Id, groupname: data[i].Name});
                                    $rootScope.sharableObjs.push({id: data[i].Id, name: data[i].Name});
                                    $rootScope.sharableUsers.push({Id: data[i].Id, Name: data[i].Name});
                                }
                                else if (data[i].Type == "Group") {
                                    //$scope.sharableObjs.push({groupId: data[i].Id, groupname: data[i].Name});
                                    $rootScope.sharableObjs.push({id: data[i].Id, name: data[i].Name});
                                    $rootScope.sharableGroups.push({groupId: data[i].Id, groupname: data[i].Name});
                                }
                            }
                            console.log($rootScope.sharableObjs);
                            console.log($rootScope.sharableUsers);
                            console.log($rootScope.sharableGroups);

                        }).error(function () {
                        //alert("Oops! There was a problem retrieving the User");
                    });

                    //-----------
                    

                    $http.get(baseUrl + "/apis/usercommon/getAllGroups")
                    //$http.get('http://omalduosoftwarecom.prod.digin.io/apis/usercommon/getAllGroups')
                        .success(function (data) {
                            console.log(data);
                            $rootScope.sharableGroupsDtls = [];
                            $rootScope.groups= [];
                            for (var i = 0; i < data.length; i++) {
                                $scope.users = [];  //$scope.userNames=[];
                                for (var j = 0; j < data[i].users.length; j++) {
                                    $scope.users.push({
                                        Id: data[i].users[j].Id,
                                        Name: data[i].users[j].Name,
                                        mainTitle: data[i].users[j].mainTitle
                                    });
                                }
                                $rootScope.sharableGroupsDtls.push({
                                    groupId: data[i].groupId,
                                    groupname: data[i].groupname,
                                    users: $scope.users
                                });

                                 $rootScope.groups.push({
                                    groupId: data[i].groupId,
                                    groupname: data[i].groupname,
                                    users: $scope.users
                                });

                            }
                            console.log($rootScope.sharableGroupsDtls);

                        }).error(function () {
                        //alert("Oops! There was a problem retrieving the groups");
                    });
                }
				*/
            }
        }());

        $scope.getSharableUsers = function () {
            var baseUrl = "http://" + window.location.hostname;
            //$http.get('http://omalduosoftwarecom.prod.digin.io/apis/usercommon/getSharableObjects')
            $http.get(baseUrl + apis_Path+"usercommon/getSharableObjects")
                .success(function (data) {
                    console.log(data);
                    $rootScope.sharableObjs = [];
                    $rootScope.sharableUsers = [];
                    $rootScope.sharableGroups = [];
                    $rootScope.groups = [];

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].Type == "User") {
                            //$scope.sharableObjs.push({groupId: data[i].Id, groupname: data[i].Name});
                            $rootScope.sharableObjs.push({id: data[i].Id, name: data[i].Name});
                            $rootScope.sharableUsers.push({Id: data[i].Id, Name: data[i].Name});
                        }
                        else if (data[i].Type == "Group") {
                            //$scope.sharableObjs.push({groupId: data[i].Id, groupname: data[i].Name});
                            $rootScope.sharableObjs.push({id: data[i].Id, name: data[i].Name});
                            $rootScope.sharableGroups.push({groupId: data[i].Id, groupname: data[i].Name});
                        }
                    }
                    console.log($rootScope.sharableObjs);
                    console.log($rootScope.sharableUsers);
                    console.log($rootScope.sharableGroups);

                }).error(function () {
                //alert("Oops! There was a problem retrieving the User");
            });

            //-----------
            //$http.get('http://omalduosoftwarecom.prod.digin.io/apis/usercommon/getAllGroups')
            $http.get(baseUrl + apis_Path+"usercommon/getAllGroups")
                .success(function (data) {
                    console.log(data);
                    $rootScope.sharableGroupsDtls = [];
                    $rootScope.groups= [];
                    for (var i = 0; i < data.length; i++) {
                        $scope.users = [];  //$scope.userNames=[];
                        for (var j = 0; j < data[i].users.length; j++) {
                            $scope.users.push({
                                Id: data[i].users[j].Id,
                                Name: data[i].users[j].Name,
                                mainTitle: data[i].users[j].mainTitle
                            });
                        }
                        $rootScope.sharableGroupsDtls.push({
                            groupId: data[i].groupId,
                            groupname: data[i].groupname,
                            users: $scope.users
                        });
                        $rootScope.groups.push({
                            groupId: data[i].groupId,
                            groupname: data[i].groupname,
                            users: $scope.users
                        });
                    }
                    console.log($rootScope.sharableGroupsDtls);

                }).error(function () {
                //alert("Oops! There was a problem retrieving the groups");
            });
        }


        $rootScope.privateFun = privateFun;
        $scope.getSearchPanelDetails = function () {
            privateFun.getTenantID();
            privateFun.getAllDashboards();
            //privateFun.getAllReports();
            $scope.getAnalyzerDetails();
            //privateFun.getAllSharableObj();

        }

        $scope.getDashboardDetails = function () {

        }
        $scope.getReportDetails = function () {

        };
        $scope.getAnalyzerDetails = function () {

        };

        $scope.getURL = function () {
            $scope.imageUrl = $rootScope.image;
            //$scope.myCroppedImageURL = $rootScope.myCroppedImage;
            $scope.profile_picURL = $rootScope.profile_pic;
        };

        //navigate
        
        $scope.navigate = function (routeName, ev) {

            var widgetLimit = ProfileService.widget_limit;
            var selectedPage = $rootScope.selectedPage;
            var pageCount = $rootScope.dashboard.pages.length;
            
            switch (routeName) {
                case "home":
                    $scope.goHomeDialog(ev);
                    $rootScope.page_id = "";
                    break;
                case "Add Page":
                    $rootScope.currentView = "Dashboard";
                    $scope.showAddNewPage(ev);
                    $state.go('home.Dashboards');
                    break;
                case "Social Media Analytics":
                    $rootScope.currentView = "Social Analysis";
                    $scope.showAddSocialAnalysis(ev);
                    break;
                case "Add Widgets":
                    $rootScope.currentView = "Dashboard";
                    $scope.showAddNewWidgets(ev);
                    $state.go("home.Dashboards");
                    break;
                case "Reports":
                    $scope.showReports(ev);
                    break;
                case "Analytics":
                    $rootScope.currentView = "Analytics";
                    break;
                case "RealTime":
                    $rootScope.currentView = "RealTime";
                    $state.go('home.' + routeName);
                    break;
                case "Data Source":
                        $rootScope.currentView = "CommonData";
                        //open sidepanel if it is closed
                        if (!$mdSidenav('right').isOpen()) {
                            $mdSidenav('right').toggle().then(function () {
                                $log.debug("toggle right is done");
                            });
                        }
                    break;
                case "Sales Forecast && Prediction":
                    $scope.showSalesForecastPrediction(ev);
                    break;
                case "Logout":
                    var confirm = $mdDialog.confirm()
                        .title('Are you sure you want to logout?')
                        .targetEvent(event)
                        .ok('Yes!')
                        .cancel('No!');
                    $mdDialog.show(confirm).then(function () {
                        //$scope.status = 'Yes';
                        $window.location = "/logout.php";
                    }, function () {
                        //$scope.status = 'No';
                    });
                    break;
                case "Theme":
                    $scope.openTheme();
                    break;
				case "User Assistance":
                    $state.go('home.user_assistance');
                case "Share":
                    $rootScope.currentView = "Share";
                    $scope.Share();
                    break;
                case "Export":
                    $rootScope.currentView = "Export";
                    $scope.Export();
                    break;
                case "Help":
                    $rootScope.currentView = "Help";
                    //user guide
                    setTimeout(function () {
                        var intro;
                        intro = introJs();
                        intro.setOptions($scope.IntroOptions);
                        intro.start();
                    }, 0);
                    break;
                case "Save":
                    $state.go('home.Dashboards');
                    if (pageCount > 0) {
                        $scope.saveDashboard(ev);
                    }
                    else {//
                        ngToast.create({
                            className: 'danger',
                            content: 'At least one page required to save a dashboard',
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            dismissOnClick: true
                        });
                    }
                    break;
                case "Settings":
                    $rootScope.currentView = "Settings";
                    // $state.go('home.Settings');
                    break;
                case "TV Mode":
                      //Start of Navigate TVMode
                       if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
                          (!document.mozFullScreen && !document.webkitIsFullScreen)) {
                        if (document.documentElement.requestFullScreen) {  
                          document.documentElement.requestFullScreen();  
                        } else if (document.documentElement.mozRequestFullScreen) {  
                          document.documentElement.mozRequestFullScreen();  
                        } else if (document.documentElement.webkitRequestFullScreen) {  
                          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
                        }  
                         } else {  
                        if (document.cancelFullScreen) {  
                          document.cancelFullScreen();  
                        } else if (document.mozCancelFullScreen) {  
                          document.mozCancelFullScreen();  
                        } else if (document.webkitCancelFullScreen) {  
                          document.webkitCancelFullScreen();  
                        }  
                         }
                    //End of Navigate TVMode
                    break;
                case "Clear Widgets":
                    $scope.clearAllWidgets(ev);
                    break;
                case "Common Source Algorithm":
                    $state.go("home.commonSrcAlgorithm");
                    break;
				case "my account":
                    $state.go("home.myAccount");
                    break;
                case "invite":    

                    $mdDialog.show({
                      controller: "inviteUserCtrl",
                      templateUrl: 'views/settings/user.html',
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose:false
                    })
                    .then(function(answer) {                        
                    });
                    
                break;

            case "switch tenant": 
                    $mdDialog.show({
                      controller: "tenantCtrl",
                      templateUrl: 'views/settings/switchTenant.html',
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose:false
                    })
                    .then(function(answer) {
                    });
                    break;
			case "share": 
                   console.log(ev)
				    $timeout(function(){
						$mdMenu.hide();
					},200);
					$state.go("home."+ev);
                    break;
            case "share":
                if($rootScope.dashboard.compID != null)
                    $state.go("home.sharedashboard");
                else{
                        ngToast.dismiss();
                        ngToast.create({
                            className: 'danger',
                            content: 'Dashboard should be saved in order to share the widget',
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            dismissOnClick: true
                        });
                }
                break;
            default:
                $state.go("home");
                break;
            }
        };


        
        $scope.openNotifications = function()
        {
            $mdSidenav('notifications').toggle().then(function () {
                $log.debug("toggle right is done");
            });
        }

        $scope.openSearchBar = function()
        {
            $mdSidenav('searchBar').toggle().then(function () {
                $log.debug("toggle left is done");
            });        
        }
        
        $scope.goHomeDialog = function (ev) {

            $mdDialog.show({
                controller: function goHomeCtrl($scope, $mdDialog) {

                    var homeState = null;
                    $scope.goHome = function () {
                        $mdDialog.hide();
                        homeState = true;

                        $scope.createuuid = function () {
                            return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
                        }
                        $rootScope.dashboard = [];
                        $rootScope.page_id = "";
                        $rootScope.dashboard = {

                            "pages": null,
                            "compClass": null,
                            "compType": null,
                            "compCategory": null,
                            "compID": null,
                            "compName": null,
                            "refreshInterval": null,
                        }

                        $rootScope.dashboard.pages = [];
                        var page = {
                            "widgets": [],
                            "pageID": "temp" + $scope.createuuid(),
                            "pageName": "DEFAULT",
                            "pageData": null
                        }
                        $rootScope.dashboard.pages.push(page);


                    }
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                        homeState = false;
                    };
                    return homeState;
                },
                templateUrl: 'views/goHome.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function (homeState) {
                if (homeState) {
                    $scope.showTabs(true);
                    $rootScope.currentView = "Home";
                    $state.go('home');
                }
            });
        }
        $scope.showAddNewPage = function (ev) {

            $mdDialog.show({
                    templateUrl: 'templates/addNewPageTemplate.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    controller: function addNewPageController($scope, $mdDialog) {

                        var numOfPages = $rootScope.dashboard.pages.length;


                        if (numOfPages == 1) {
                            $scope.message = numOfPages + " page"
                        }
                        else {
                            $scope.message = numOfPages + " pages"
                        }

                        $scope.createuuid = function () {
                            return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
                        }
                        $scope.createNewPage = function () {

                            var noDuplicate = true;
                            //to check weather the newpage is allready exist 
                            $rootScope.dashboard.pages.forEach(function (key) {
                                if (key.pageName.toUpperCase() == $scope.title.toUpperCase()) {
                                        noDuplicate = false;
                                }
                            });

                            //adding temp infront of id for a new / temp page till it gets saved in backend
                            //after saved in backend it will be assigned a different id
                            if ($scope.title && noDuplicate) {
                                var page = {
                                    "widgets": [],
                                    "pageID": "temp" + $scope.createuuid(),
                                    "pageName": $scope.title,
                                    "pageData": null,
                                    "isSeen": true
                                }
                                $rootScope.dashboard.pages.push(page);
                                console.log("pages", $rootScope.pages);
                                console.log("rootscope creatnewpage", $rootScope);
                                $mdDialog.hide();
                                ngToast.create({
                                    className: 'success',
                                    content: 'New page added successfully',
                                    horizontalPosition: 'center',
                                    verticalPosition: 'top',
                                    dismissOnClick: true
                                });
                            }
                            else {

                                if (noDuplicate) {
                                    ngToast.create({
                                        className: 'danger',
                                        content: 'Please fill the name field',
                                        horizontalPosition: 'center',
                                        verticalPosition: 'top',
                                        dismissOnClick: true
                                    });
                                }
                                else {

                                    ngToast.create({
                                        className: 'danger',
                                        content: 'you cant duplicate the page name',
                                        horizontalPosition: 'center',
                                        verticalPosition: 'top',
                                        dismissOnClick: true
                                    });
                                }


                            }
                        };
                        $scope.close = function () {

                            $mdDialog.cancel();
                        };
                    }
                })
                .then(function (answer) {
                    // addToDashboards(answer);
                }, function () {
                });
        };
        //load social analysis  
        $scope.showAddSocialAnalysis = function (ev) {

            $mdDialog.show({
                    templateUrl: 'views/socialGraph/socialAnalysis_TEMP.html',
                    controller: 'socialAnalysisCtrl',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    addToDashboards(answer);
                }, function () {

                });
        };
        $scope.showAddNewWidgets = function (ev) {

            $mdDialog.show({
                controller: 'addWidgetCtrl',
                templateUrl: 'views/addWidget.html',
                targetEvent: ev,
                clickOutsideToClose: true,
                resolve: {
                    dashboard: function () {
                        return $scope.dashboard;
                    }
                }
            })
        };
        //load reports dialog  
        $scope.showReports = function (ev) {

            $mdDialog.show({
                    templateUrl: 'views/reports/reportsDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function () {
                }, function () {
                });
        };
        //load sales forecast and prediction  
        $scope.showSalesForecastPrediction = function (ev) {

            $mdDialog.show({
                    templateUrl: 'views/salesForecastPrediction.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    addToDashboards(answer);
                }, function () {

                });
        };

        $scope.Share = function (ev) {

            $mdDialog.show({
                controller: 'shareCtrl',
                templateUrl: 'views/dashboard-share.html',
                clickOutsideToClose: true,
                resolve: {}
            });
        }
        $scope.Export = function (ev) {

            $mdDialog.show({
                controller: 'ExportCtrl',
                templateUrl: 'views/chart_export.html',
                clickOutsideToClose: true,
                resolve: {}

            })
        }
        $scope.saveDashboard = function (ev, dashboard) {

            $mdDialog.show({
                controller: 'saveCtrl',
                // templateUrl: 'views/dashboard-save.html',
                //template has been directly added here as it is needed for offline dashboard saving feature
                template: '<md-dialog plumb-item class="dialog-1 b-r-0" ng-init="initialize()">' +
                '<md-toolbar class="tlbar-1" layout="row" layout-align="space-between center">' +
                '<div layout="row" layout-align="center center" class="digin-logo-wrapper2">' +
                '<img ng-src="styles/css/images/DiginLogo.png" class="digin-image">' +
                '</div>' +
                '<div class="dialog-title">SAVE DASHBOARD</div>' +
                '<md-button class="buttonMinwidth38 b-r-0" ng-click="close();">' +
                '<ng-md-icon icon="close" style="fill:white" size="24" layout="row"></ng-md-icon>' +
                '</md-button>' +
                '</md-toolbar>' +
                '<md-content class="dialog-content-1" layout-padding>' +
                '<div layout="row" layout-align="start start">' +
                '<p style="font-size:large">Dashboard Details</p>' +
                '</div>' +
                '<div layout="row" flex layout-wrap>' +
                '<md-input-container flex="100">' +
                '<label>Name</label>' +
                '<input ng-model="dashboardName" name="dashboardName">' +
                '</md-input-container>' +
                '<md-input-container flex="100">' +
                '<label>Refresh Interval</label>' +
                '<md-select ng-model="refreshInterval" name="refreshInterval">' +
                '<md-option value="30" ng-selected>30 Seconds</md-option>' +
                '<md-option value="60">1 minute</md-option>' +
                '<md-option value="120">2 minutes</md-option>' +
                '<md-option value="300">5 minutes</md-option>' +
                '<md-option value="3600">60 minutes</md-option>' +
                '<md-option value="0">No Refresh</md-option>' +
                '</md-select>' +
                '</md-input-container>' +
                '</div>' +
                '<div class="md-actions" layout="row">' +
                '<span flex></span>' +
                '<div class="dashbord-save-loader" ng-if="isLoadingDashBoardSave">' +
                '<svg class="circular-loader" height="50" width="50">' +
                '<circle class="path" cx="25" cy="25.2" r="19.9"' +
                'fill="none" stroke-width="6" stroke-miterlimit="10"/>' +
                '</svg>' +
                '</div>' +
                '<md-button class="btn-dialog b-r-0" ng-if="isButtonDashBoardSave" ng-click="saveDashboard()">' +
                'Save' +
                '</md-button>' +
                '<md-button class="btn-dialog b-r-0" ng-click="close()">' +
                'Cancel' +
                '</md-button>' +
                '</div>' +
                '</md-content>' +
                '</md-dialog>',
                targetEvent: ev,
                resolve: {
                    widget: function () {
                        return dashboard;
                    }
                }
            })
        }

        //Rename dashboard's pages

        $scope.renamePage = function (pageName, pageID) {
            $mdDialog.show({
                controller: renameCtrl,
                templateUrl: 'templates/renamePage.html',
                resolve: {},
                locals: {pageID: pageID, pageName: pageName},
            });
        };

        var renameCtrl = function ($scope, pageName, pageID) {
            $scope.existPageName = pageName;

            $scope.close = function () {
                $mdDialog.hide();
            };

            $scope.renameNew = function () {

                var noDuplicate = true;
                //to check weather the newpage is allready exist
                $rootScope.dashboard.pages.forEach(function (key) {
                    if (key.pageName.toUpperCase() == $scope.existPageName.toUpperCase()) {
                        if(key.pageID != $rootScope.dashboard.pages[$rootScope.selectedPage-1].pageID)
                                noDuplicate = false;
                    }
                });

                if (noDuplicate) {
                    console.log($rootScope);
                    var selectedIndex = $rootScope.selectedPage - 1;
                    $rootScope.dashboard.pages[selectedIndex].pageName = $scope.existPageName;
                    $mdDialog.hide();
                }
                else {

                    ngToast.create({
                        className: 'danger',
                        content: 'you cant duplicate the page name',
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true
                    });
                }
            }


        };


        $scope.clearAllWidgets = function (ev) {
            setTimeout(function(){  $mdDialog.hide(); }, 3000);
            $mdDialog.show({
                controller: function clearWidgetsCtrl($scope, $mdDialog) {
                    $scope.clear = function () {
                        $scope.createuuid = function () {
                            return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
                        }
                        $rootScope.dashboard = [];
                        $rootScope.dashboard = {

                            "pages": null,
                            "compClass": null,
                            "compType": null,
                            "compCategory": null,
                            "compID": null,
                            "compName": null,
                            "refreshInterval": null,
                        }

                        $rootScope.dashboard.pages = [];
                        var page = {
                            "widgets": [],
                            "pageID": "temp" + $scope.createuuid(),
                            "pageName": "DEFAULT",
                            "pageData": null
                        }
                        $rootScope.dashboard.pages.push(page);

                        $mdDialog.hide();
                    };
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };
                },
                templateUrl: 'views/clearWidgets.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function () {
            });
        };
        //navigate functions end

        // help 
        setTimeout(function () {
            $scope.CompletedEvent = function (scope) {
                console.log("Completed Event called");
            };

            $scope.ExitEvent = function (scope) {
                console.log("Exit Event called");
            };

            $scope.ChangeEvent = function (targetElement, scope) {
                console.log("Change Event called");
                console.log(targetElement); //The target element
                console.log(this); //The IntroJS object
            };

            $scope.BeforeChangeEvent = function (targetElement, scope) {
                console.log("Before Change Event called");
                console.log(targetElement);

            };

            $scope.AfterChangeEvent = function (targetElement, scope) {
                console.log("After Change Event called");
                console.log(targetElement);
            };

			$scope.IntroOptions = {
                 steps:[
				{
					element: '#addPage',
					intro: "Create your dashboard with Add page, add many pages as you want and make them a storyboard",
					position: 'right'
				}, {
                    element: '#reports',
                    intro: 'Create your static, adhoc reports and publish them here',
                    position: 'right'
                }, {
                    element: '#datasource',
                    intro: 'Pick  your correct datasource and visualize them in various ways',
                    position: 'right'
                }, {
                    element: '#addWidgets',
                    intro: 'Create your customized widgets and add it to the dashboard',
                    position: 'right'
                }, {
                    element: '#socialMedia',
                    intro: 'Dig deep in to your social media pages',
                    position: 'right'
                }, {
                    element: '#settings',
                    intro: 'Configure the settings related to the system and users',
                    position: 'right'
                }, {
                    element: '#home',
                    intro: 'Go to <strong>Home</strong> page'
                }, {
                    element: '#fullscreen',
                    intro: 'Toggle Fullscreen'
                }, {
                    element: '#clearWidgets',
                    intro: 'Clear widgets in the screen'
                }, {
                    element: '#save',
                    intro: 'Save the Dashboard'
                }, {
                    element: '#notifications',
                    intro: 'Checkout the latest notifications here'
                }],
                showStepNumbers: false,
                exitOnOverlayClick: true,
                exitOnEsc: true,
                nextLabel: '<strong>NEXT</strong>',
                prevLabel: '<strong>PREVIOUS</strong>',
                skipLabel: 'EXIT',
                doneLabel: 'DONE'
            };
			
            $scope.ShouldAutoStart = true;

        }, 1000);
        //update code dilshan
        //new ui changes
		
		//Start of layoutManager
		$rootScope.showHeader = true;
		$rootScope.showSideMenu = true;
		
		$scope.topMenuToggle = function()
		{	
			if($rootScope.showHeader == true)
			{
				$rootScope.showHeader = layoutManager.hideHeader();
			}else{
				$rootScope.showHeader = layoutManager.showHeader();
			}
		}
		
		$scope.leftMenuToggle = function()
		{
			if($scope.showSideMenu == true)
			{
				$rootScope.showSideMenu = layoutManager.hideSideMenu();
			}else{
				$rootScope.showSideMenu = layoutManager.showSideMenu();
			}
		}
		//End of layoutManager


        $scope.toggelDownSearch = function (status) {
            if ($scope.searchLayerStatus) {
                layoutManager.toggleSearchLayer($scope.searchLayerStatus);
            } else {
                layoutManager.toggleSearchLayer($scope.searchLayerStatus);
            }

        };
        
        var settingsSub = [
                                {name: "New user",icon: "ti-user", link: "home.createUser"},
                                //{name: "Share", icon: "ti-share", link: "home.share"},
                                {name: "User settings",icon: "ti-pencil",link: "home.userSettings"},
                                {name: "Account settings",icon: "ti-settings",link: "home.account"},
                                {name: "Groups",icon: "ti-settings",link: "home.group"}
                            ];
         var shareSub = [
                            {name: "Facebook", icon: "ti-facebook",provider: "facebook"},
                            {name: "Google+", icon: "ti-google", provider: "google+"},
                            {name: "Twitter", icon: "ti-twitter-alt", provider: "twitter"},
                            {name: "Linkedin", icon: "ti-linkedin", provider: "linkedin"},
                           // {name: "Pinterest", icon: "ti-pinterest-alt", provider: "pinterest"},
                            //{name: "Tumbler", icon: "ti-tumblr", provider: "tumbler"},
                            {name: "Email", icon: "ti-email"}
                        ];
        var socialMediaSub =    [
                                    {name: "Facebook", icon: "ti-facebook", link: "home.social-graph-fb"},
                                    {name: "Twitter", icon: "ti-twitter-alt", link: "home.SocialGraphTwitter"}
                                ];
        var reportsSub =    [
                                { name: "Report Development", icon: "ti-filter", link: "home.ReportsDev"},
                                { name: "Published Reports", icon: "ti-notepad", link: "home.Reports"}
                            ];
        
        $scope.subMenu = (function () {
            return {
                view: function (subMenuTitle) {
                    //get sidebar data from menu.json
                   $scope.currentSubMenu = [
                            {"header": ''},
                            {"data": ''}
                        ];
                    $scope.currentSubMenu.header = subMenuTitle;

                    $scope.currentItem = subMenuTitle;
                   /* if(subMenuTitle == "Reports")
                    {
                        $scope.currentItem = ;
                    }else if(subMenuTitle == "Social Media")
                    {
                        $scope.currentSubMenu.data = socialMediaSub;
                    }else if(subMenuTitle == "Share")
                    {
                        $scope.currentSubMenu.data = shareSub;
                    }else if(subMenuTitle == "Settings")
                    {
                        $scope.currentSubMenu.data = settingsSub;
                    }*/
                },
                close: function () {
                    $scope.isEnableSubMenu = false;
                }
            }
        })();


        //menu mouse hover
        $scope.menuMouseHover = function (item) {
            if (item.type == "sub-menu") {
                $scope.isEnableSubMenu = true;
                 $scope.currentTitle = item.title;
                $scope.subMenu.view(item.menuName)
            }
            if (item.type == "menu") {
                $scope.isEnableSubMenu = false;
            }
        };
        $scope.menuMouseLeave = function (item) {
            $scope.isEnableSubMenu = false;
        }

        //search bar option
        $scope.isSarchScorllBar = false;

        $scope.goTORout = function(menu){

           console.log(menu);
           //if(menu.name ==  "Email")
        if(menu ==  "Email")
           {
                    //console.log("email");

                    $mdDialog.show({
                      controller: "emailCtrl",
                      templateUrl: 'views/loginEmail.html',
                      parent: angular.element(document.body),
                      clickOutsideToClose:true
                    })
                    .then(function(answer) {
                    })

           }else{
               //$state.go(menu.link);
               $state.go(menu);
           }

        }



 }]);

 routerApp.controller('tenantCtrl',['$scope','$mdDialog','$http','Digin_Tenant','auth_Path', function ($scope,$mdDialog,$http,Digin_Tenant,auth_Path) {

    //$http.get(Digin_Tenant + '/tenant/GetTenants/' + '15430a361f730ec5ea2d79f60d0fa78e')
    $http.get(auth_Path+'tenant/GetTenants/' + getCookie('securityToken'))
    .success(function (response) {
        $scope.tennants = response;
    });

    $scope.cancel = function() {
    $mdDialog.cancel();
    };

    $scope.submit = function()
    {

    }

    $scope.showConfirmation = function (tennant, event) {
        var confirm = $mdDialog.confirm()
            .title('Do you want to switching to ' + tennant)
            .targetEvent(event)
            .ok('Yes!')
            .cancel('No!');
        $mdDialog.show(confirm).then(function () {
            $scope.status = 'Yes';
            window.open("http://" + tennant + "/#/home");
        }, function () {
            $scope.status = 'No';
        });
    };
    $scope.close = function () {
        $mdDialog.cancel();
    };



}])