routerApp.controller('NavCtrl', ['$scope', '$mdBottomSheet', '$mdSidenav', '$mdUtil',
    '$timeout', '$rootScope', '$mdDialog', '$objectstore', '$state', '$http',
    '$localStorage', '$window', '$qbuilder', 'ObjectStoreService', 'DashboardService', '$log', '$mdToast',

    'DevStudio', '$auth', '$helpers', 'dynamicallyReportSrv', 'Digin_Engine_API', 'Digin_Tomcat_Base', 'ngToast', 'Digin_Domain', 'Digin_LogoUploader', 'Digin_Tenant', '$filter', 'ProfileService', 'pouchDB', 'Fullscreen',
    function ($scope, $mdBottomSheet, $mdSidenav, $mdUtil, $timeout, $rootScope, $mdDialog, $objectstore, $state,
              $http, $localStorage, $window, $qbuilder, ObjectStoreService, DashboardService, $log, $mdToast, DevStudio,
              $auth, $helpers, dynamicallyReportSrv, Digin_Engine_API, Digin_Tomcat_Base, ngToast, Digin_Domain, Digin_LogoUploader, Digin_Tenant, $filter, ProfileService, pouchDB, Fullscreen) {

        if (DevStudio) {
            $auth.checkSession();
        } else {
            var sessionInfo = $helpers.getCookie('securityToken');
            // if(sessionInfo==null) location.href = 'index.php';
        }
        $scope.firstName = JSON.parse(decodeURIComponent(getCookie('authData'))).Username;
        
        // $scope.username = JSON.parse(decodeURIComponent(getCookie('authData'))).Name;
        // var baseUrl = "http://" + window.location.hostname;

        // if ($scope.username && $scope.username.length > 0) {
        //     var fullName = $scope.username.split(' ');
        //     $scope.firstName = fullName[0];
        // }

        var db = new pouchDB('dashboard');
        $scope.adjustUI = function () {

            if ($scope.headerbarPinned) {
                $('#content1').css("top", "40px");
                $('#content1').css("height", "calc(100vh - 40px)");
                $('.h_iframe').css("height", "calc(100vh - 40px)");
                $('.main-headbar-slide').css("transform", "translateY(0)");
                $('#mainHeadbar:hover > .main-headbar > .main-headbar-slide').css("transform", "translateY(0)");
            }
            else {
                $('#content1').css("top", "0px");
                $('#content1').css("height", "calc(100vh)");
                $('.h_iframe').css("height", "calc(100vh)");
                $('.main-headbar-slide').css("transform", "translateY(-40px)");
                $('#mainHeadbar:hover > .main-headbar > .main-headbar-slide').css("transform", "translateY(0)");
            }
        }
        // hides and shows the dashboard tabs
        $scope.showTabs = function (boolean) {

            if (boolean) {//show tabs
                console.log("show tabs");
                $("md-tabs > md-tabs-wrapper").children().show();
            } else {//hide tabs
                console.log("hide tabs");
                $("md-tabs > md-tabs-wrapper").children().hide();
            }
        };


        //#Added by Chamila
        //#to get session detail for logged user
        $http.get(Digin_Tenant + '/GetSession/' + getCookie('securityToken') + '/Nil')
            .success(function (data) {
                console.log(data);
                $rootScope.SessionDetail = data;
            }).error(function () {
            //alert("Oops! There was a problem retrieving the groups");
        });

        //#to get tenant ID for logged user
        $http.get(Digin_Tenant + '/tenant/GetTenants/' + getCookie('securityToken'))
            .success(function (data) {
                console.log(data);
                $rootScope.TenantID = data[0].TenantID;
            }).error(function () {
            //alert("Oops! There was a problem retrieving the groups");
        });


        //#get user profile       
        var baseUrl = "http://" + window.location.hostname;
        //$http.get('http://omalduosoftwarecom.prod.digin.io/apis/profile/userprofile/omal@duosoftware.com')
        $http.get(baseUrl+'/apis/profile/userprofile/'+$scope.username)
            .success(function (response) {
                console.log(response);
                $rootScope.profile_Det = response;
                ProfileService.InitProfileData(response);
            }).error(function (error) {
            //fireMsg('0', '<strong>Error : </strong>Please try again...!');
        });


        //initially hiding the tabs
        $scope.showTabs(true);

        //#set initial logo as Digin logo
        $scope.imageUrl = "styles/css/images/DiginLogo.png";
        //$rootScope.myImage="styles/css/images/setting/user100x100.png";
        $rootScope.myCroppedImage = "styles/css/images/signup-user.png";
        $rootScope.profile_pic = "styles/css/images/signup-user.png";
        // if($scope.imageUrl==""){
        //      $scope.imageUrl = "styles/css/images/DiginLogo.png";
        // }
        // else{
        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
        var res = userInfo.Username.replace("@", "_");
        var NameSpace = res.replace(".", "_");

        var logoPath = Digin_Engine_API.split(":")[0] + ":" + Digin_Engine_API.split(":")[1];
        //console.log(logPath);

        $http.get(Digin_Engine_API + 'get_user_settings?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain)
            .success(function (data) {
                $rootScope.image = logoPath + data.Result.logo_path;
                //$rootScope.myimage = logoPath + data.Result.dp_path;
                //$rootScope.myCroppedImage = logoPath + data.Result.dp_path;
                $rootScope.profile_pic = data.Result.dp_path;
                $rootScope.userSettings = data.Result;
                ProfileService.UserDataArr.BannerPicture = 'http://' + NameSpace + '.' + 'prod.digin.io' + data.Result.dp_path;
                //$rootScope.image = "http://192.168.2.33/user_data/9c42d3c4661182ca872b3b6878aa0429/logos/hnb.png";
                //$scope.imageUrl = "styles/css/images/DiginLogo.png";

                if (data.Result.logo_path == undefined) {
                    $rootScope.image = "styles/css/images/DiginLogo.png";
                    //$rootScope.myImage="styles/css/images/setting/user100x100.png";
                    $rootScope.myCroppedImage = "styles/css/images/setting/user100x100.png";
                    $rootScope.profile_pic = "styles/css/images/setting/user100x100.png";
                }
                else {
                    $rootScope.image = logoPath + data.Result.logo_path;
                    //$rootScope.myImage=logoPath + data.Result.dp_path;
                    //$rootScope.myCroppedImage=logoPath + data.Result.dp_path;
                    $rootScope.profile_pic = logoPath + data.Result.dp_path;
                }

                $scope.getURL();
                $scope.imageUrl = $rootScope.image;
                $scope.profile_picURL = $rootScope.profile_pic;
            })
            .error(function (data) {
                $scope.imageUrl = "styles/css/images/DiginLogo.png";
                //$scope.myimageUrl = "styles/css/images/setting/user100x100.png";
                //$scope.myCroppedImageUrl = "styles/css/images/setting/user100x100.png";
                $scope.profile_pic = "styles/css/images/setting/user100x100.png";
                $scope.getURL();
            });


        //value for jquery of search panel overlay
        var $windowHeight = $(window).height(),
            $windowWidth = $(window).width(),
            $startingPoint = $('.starting-point');
        // Calculate the diameter of search panel overlay
        var diameterValue = (Math.sqrt(Math.pow($windowHeight, 2) + Math.pow($windowWidth, 2)) * 2);
        $startingPoint.children('span').css({
            height: diameterValue + 'px',
            width: diameterValue + 'px',
            top: -(diameterValue / 2) + 'px',
            left: -(diameterValue / 2) + 'px'
        });
        //get sidebar data from menu.json 
        getJSONData($http, 'menu', function (data) {

            localStorage.setItem("sidebarData", JSON.stringify(data));
            $scope.sidebarItems = data;
        });
        // headerbar 
        $scope.headerbarPinned = false;

        $scope.pinHeaderbar = function (state) {
            $scope.headerbarPinned = state;
        }

        //close open pages and go to home
        $scope.mainclose = function (ev) {

            $mdDialog.show({

                controller: function goHomeCtrl($scope, $mdDialog) {

                    $scope.goHome = function () {

                        $mdDialog.cancel();
                        $state.go('home.welcomeSearch');
                        $scope.createuuid = function () {

                            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

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

        //shows user profile in a dialog box
        $scope.showUserProfile = function (ev) {
            $mdDialog.show({
                    templateUrl: 'templates/profileDialogTemplate.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    //controller start
                    controller: function showProfileController($rootScope, $scope, $mdDialog) {
                        //var userInfo = $auth.getSession();

                        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
                        $scope.user = {
                            name: $rootScope.profile_Det.Name,
                            email: $rootScope.profile_Det.Email,
                            address: $rootScope.profile_Det.BillingAddress,
                            mobile: $rootScope.profile_Det.PhoneNumber,
                            profile_pic: $rootScope.profile_pic,
                            company: $rootScope.profile_Det.Company

                        };
                        $scope.close = function () {
                            $mdDialog.cancel();
                        };
                    }
                    //controller end
                })
                .then(function (answer) {
                }, function () {
                });
        };

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
                    $http.get(Digin_Tenant + '/tenant/GetTenants/' + userInfo.SecurityToken)
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
        $scope.reports = [];
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
        $scope.originalReportssList = $scope.reports;

        $scope.updateFilteredList = function () {
            $scope.dashboards = $filter("filter")($scope.originalDashboardsList, $scope.searchText);
            $scope.reports = $filter("filter")($scope.originalReportssList, $scope.searchText);
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
            layoutManager.headerMenuToggle(true);
            $scope.openSearchBar(); 
            $mdSidenav('right')
                .close()
                .then(function () {
                    $log.debug('right sidepanel closed');
                });
            //----------
            $scope.showTabs(false);
            //closing the overlay
            $(".overlay").removeClass("overlay-search active");
            $(".nav-search").removeClass("active");
            $(".search-layer").removeClass("activating active");
            // console.log(report);
            $state.go('home.DynamicallyReportBuilder', {'reportNme': report});
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
        $scope.goDashboard = function (dashboard) {

            layoutManager.headerMenuToggle(true);
            $scope.currentView = dashboard.dashboardName;
            $scope.openSearchBar(); 
            console.log($scope.dashboards);
            console.log("dash item", dashboard);
            $rootScope.page_id = "";
            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));

            if (typeof(dashboard.dashboardID) == "undefined") {
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
                        var dashboard = CircularJSON.parse(doc.dashboard);
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
                        ngToast.create({
                            className: 'success',
                            content: 'Retrieved dashboards from localStorage',
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            dismissOnClick: true
                        });
                    }
                });
                $state.go('home.Dashboards');
            }
            else {
                if (typeof(dashboard.pouchID) != "undefined") {
                    $rootScope.page_id = dashboard.pouchID;
                }

                $http({
                    method: 'GET',
                    url: Digin_Engine_API + 'get_component_by_comp_id?comp_id=' + dashboard.dashboardID + '&SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain
                })
                    .success(function (data) {

                        if (data.Is_Success) {

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

                            var index = 0;
                            console.log($rootScope.dashboard.pages[index].widgets);
                            for (var i = 0; i < $rootScope.dashboard.pages[index].widgets.length; i++) {
                                $rootScope.dashboard.pages[index]["isSeen"] = true;
                                var widget = $rootScope.dashboard.pages[index].widgets[i];
                                console.log('syncing...');
                                if (typeof(widget.widgetData.commonSrc) != "undefined") {
                                    widget.widgetData.syncState = false;
                                    //widget.widgetData.syncState = false;
                                    if (widget.widgetData.selectedChart.chartType != "d3hierarchy" && widget.widgetData.selectedChart.chartType != "d3sunburst") {
                                        $qbuilder.sync(widget.widgetData, function (data) {
                                            //widget.widgetData.syncState = true;
                                            // if (typeof widget.widgetData.widData.drilled != "undefined" && widget.widgetData.widData.drilled)
                                            //     $qbuilder.widInit();
                                            //widget.widgetData.syncState = true;
                                        });

                                    }
                                }
                            }
                            

                            $state.go('home.Dashboards');
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
            $(".overlay").removeClass("overlay-search active");
            $(".nav-search").removeClass("active");
            $(".search-layer").removeClass("activating active");
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

                    var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));

                    $scope.dashboards = [];
                    $scope.reports = [];
                    $http({
                        method: 'GET',

                        url: Digin_Engine_API + 'get_all_components?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain
                    })
                        .success(function (data) {

                            console.log("data getAllDashboards", data);

                            $scope.dashboards = [];

                            // seperate reports and dashboards
                            for (var i = 0; i < data.Result.length; i++) {
                                if (data.Result[i].compType == "Report") {
                                    $scope.reports.push(
                                        {splitName: data.Result[i].compName, path: '/dynamically-report-builder'}
                                    );
                                }
                                else {

                                    $scope.dashboards.push(
                                        {dashboardID: data.Result[i].compID, dashboardName: data.Result[i].compName}
                                    );

                                    DashboardService.dashboards = $scope.dashboards;

                                }
                            }

                          
                            //fetch all saved dashboards from pouchdb
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
                                content: 'Retrieved Dashboard Details from localStorage!',
                                horizontalPosition: 'center',
                                verticalPosition: 'top',
                                dismissOnClick: true
                            });
                            //fetch all saved dashboards from pouchdb
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
                getAllReports: function () {
                    getSession();
                    startReportService();
                    dynamicallyReportSrv.getAllReports(reqParameter).success(function (data) {
                        if (data.Is_Success) {
                            for (var i = 0; i < data.Result.length; i++) {
                                $scope.reports.push(
                                    {splitName: data.Result[i], path: '/dynamically-report-builder'}
                                );
                            }
                        }
                    }).error(function (respose) {
                        console.log('error request getAllReports...');
                    });
                },


                getTenantID: function () {
                    $http.get(Digin_Tenant + '/tenant/GetTenants/' + getCookie('securityToken'))
                        .success(function (data) {
                            console.log(data);
                            $rootScope.TenantID = data[0].TenantID;
                        }).error(function () {
                        //alert("Oops! There was a problem retrieving the groups");
                    });
                },

                //#added by chamila
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
            }
        }());

        $scope.getSharableUsers = function () {
            var baseUrl = "http://" + window.location.hostname;
            //$http.get('http://omalduosoftwarecom.prod.digin.io/apis/usercommon/getSharableObjects')
            $http.get(baseUrl + "/apis/usercommon/getSharableObjects")
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
            $http.get(baseUrl + "/apis/usercommon/getAllGroups")
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
            privateFun.getAllReports();
            $scope.getAnalyzerDetails();
            privateFun.getAllSharableObj();

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

            var widgetLimit = 6;
            var selectedPage = $rootScope.selectedPage;
            var pageCount = $rootScope.dashboard.pages.length;
            var pageWidgetCount = $rootScope.dashboard.pages[selectedPage - 1].widgets.length;
            switch (routeName) {
                case "home":
                    $scope.goHomeDialog(ev);
                    break;
                case "Add Page":
                    $scope.currentView = "Dashboard";
                    $scope.showAddNewPage(ev);
                    $state.go('home.Dashboards');
                    break;
                case "Social Media Analytics":
                    $scope.currentView = "Social Analysis";
                    $scope.showAddSocialAnalysis(ev);
                    break;
                case "Add Widgets":
                    if (pageWidgetCount < widgetLimit) {
                        $scope.currentView = "Dashboard";
                        $scope.showAddNewWidgets(ev);
                        $state.go("home.Dashboards");
                    }
                    else {//give message widget limit exceeded
                        ngToast.dismiss();
                        ngToast.create({
                            className: 'danger',
                            content: 'maximum widget limit exceeded',
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            dismissOnClick: true
                        });
                    }
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
                    if (pageWidgetCount < widgetLimit) {
                        $rootScope.currentView = "CommonData";
                        //open sidepanel if it is closed
                        if (!$mdSidenav('right').isOpen()) {
                            $mdSidenav('right').toggle().then(function () {
                                $log.debug("toggle right is done");
                            });
                        }
                    }
                    else {//give message maximum widget limit exceeded
                        ngToast.dismiss();
                        ngToast.create({
                            className: 'danger',
                            content: 'maximum widget limit exceeded',
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            dismissOnClick: true
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
                case "Share":
                    $scope.currentView = "Share";
                    $scope.Share();
                    break;
                case "Export":
                    $scope.currentView = "Export";
                    $scope.Export();
                    break;
                case "Help":
                    $scope.currentView = "Help";
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
                    $scope.currentView = "Settings";
                    // $state.go('home.Settings');
                    break;
                case "TV Mode":
                    $scope.currentView = "TV Mode";
                    if (Fullscreen.isEnabled()) Fullscreen.cancel();
                    else Fullscreen.all();
                    break;
                case "Clear Widgets":
                    $scope.clearAllWidgets(ev);
                    break;
                case "Common Source Algorithm":
                    $state.go("home.commonSrcAlgorithm");
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
		
	$scope.notifications = 
		 [{title:"User Segregation",description:"omal@duosoftare.com has invited you to jon his tenant."},
		{title:"Dashboard",description:"Sales for the month has exceeded the treshold value"},
		{title:"DigIn",description:"DigInCache server is down."}];

       $scope.removeNotification = function(ev,notification) {
             for (i = 0, len = $scope.notifications.length; i<len; ++i){
                    if($scope.notifications[i].title == notification.title)
                        $scope.notifications.splice(i, 1);

                }

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
                    $scope.currentView = "Home";
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
        $scope.openTheme = function (ev) {

            $mdDialog.show({
                controller: 'ThemeCtrl',
                templateUrl: 'views/change-theme.html',
                targetEvent: ev,
                clickOutsideToClose: true,
                resolve: {}
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
                '<md-input-container flex="50">' +
                '<label>Name</label>' +
                '<input ng-model="dashboardName" name="dashboardName">' +
                '</md-input-container>' +
                '<md-input-container flex="50">' +
                '<label>Type</label>' +
                '<md-select ng-model="dashboardType" name="dashboardType">' +
                '<md-option value="SYSTEM" ng-selected>SYSTEM</md-option>' +
                '<md-option value="TYPE1">TYPE1</md-option>' +
                '<md-option value="TYPE2">TYPE2</md-option>' +
                '<md-option value="TYPE3">TYPE3</md-option>' +
                '</md-select>' +
                '</md-input-container>' +
                '<md-input-container flex="50">' +
                '<label>Refresh Interval</label>' +
                '<md-select ng-model="refreshInterval" name="refreshInterval">' +
                '<md-option value="30" ng-selected>30 Seconds</md-option>' +
                '<md-option value="60">1 minute</md-option>' +
                '<md-option value="120">2 minutes</md-option>' +
                '<md-option value="300">5 minutes</md-option>' +
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
                steps: [{
                    element: document.querySelectorAll('.main-headbar')[0],
                    intro: "<strong> This is the main head bar area. Hover over the blue line to bring it down</strong>",
                    position: 'bottom'
                }, {
                    element: document.querySelector('#getReport'),
                    intro: "<strong>This is the side navigation panel</strong>",
                    position: 'right'
                }, {
                    element: document.querySelectorAll('#getReport > md-list > md-item:nth-child(2) > a > md-item-content')[0],
                    intro: '<strong>Use this to create new dashboards</strong>',
                    position: 'right'
                }, {
                    element: document.querySelectorAll('md-item-content.sidebar-btn.md-ink-ripple')[1],
                    intro: '<strong>Use this to access reports</strong>',
                    position: 'right'
                }, {
                    element: document.querySelectorAll('md-item-content.sidebar-btn.md-ink-ripple')[2],
                    intro: '<strong>Realtime tool is a handy tool for data analysis </strong>',
                    position: 'right'
                }, {
                    element: document.querySelectorAll('md-list md-item > a > md-item-content')[4],
                    intro: '<strong>This is the Digin P Stack feature</strong>',
                    position: 'right'
                }, {
                    element: document.querySelectorAll('md-list > md-item > a > md-item-content')[5],
                    intro: '<strong>D3plugins is a tool to create D3 visualizations</strong>',
                    position: 'right'
                }, {
                    element: document.querySelectorAll('md-list > md-item > a > md-item-content')[6],
                    intro: '<strong>Use this to add widgets to your dashbaord</strong>',
                    position: 'right'
                }, {
                    element: document.querySelectorAll('md-list > md-item > a > md-item-content')[7],
                    intro: '<strong>Settings feature can be used to create users and to add/remove features</strong>',
                    position: 'right'
                }, {
                    element: document.querySelectorAll('md-list > md-item > a > md-item-content')[8],
                    intro: '<strong>Save feature is to save Dashboards</strong>',
                    position: 'right'
                }, {
                    element: document.querySelectorAll('md-list > md-item > a > md-item-content')[9],
                    intro: '<strong>Give a nice look to the app with your desired theme</strong>',
                    position: 'right'
                }, {
                    element: document.querySelectorAll('md-list > md-item > a > md-item-content')[10],
                    intro: '<strong>Share using most popular social media and email</strong>',
                    position: 'right'
                }, {
                    element: document.querySelectorAll('md-list > md-item > a > md-item-content')[11],
                    intro: '<strong>Export your widget in any format</strong>',
                    position: 'right'
                }, {
                    element: document.querySelectorAll('md-list > md-item > a > md-item-content')[12],
                    intro: '<strong>Switch between browser view and Full Screen mode</strong>',
                    position: 'right'
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
        //update code damith
        //new ui changes
        $scope.dropDownbtnStatus = false;
        $scope.searchLayerStatus = false;
        $scope.headerMenuToggle = false;
        $scope.leftMenuToggleState = true;
        var layoutManager = (function () {
            return {
                //user setting toggele down
                toggleDownSettingPanel: function (status) {
                    if (status) {
                        $scope.dropDownbtnStatus = false;
                        $('#profileDropDown').animate({
                            opacity: 0,
                            zIndex: '0',
                            top: '-100%'
                        }, 300);
                    } else {
                        $scope.dropDownbtnStatus = true;
                        $('#profileDropDown').animate({
                            opacity: '1',
                            top: '45px',
                            zIndex: '1000'
                        }, 300);
                    }
                },
                headerMenuToggle: function (status) {
                    if (status) {
                        $('.main-headbar-slide').animate({
                            top: '-43px'
                        }, 300);
                        //  $('.blut-search-toggele').removeClass('go-up').addClass('go-down');
                        $('#content1').removeClass('content-m-top40').addClass('content-m-top0');
                        $scope.headerMenuToggle = false;
                    } else {
                        $('.main-headbar-slide').animate({
                            top: '0px'
                        }, 300);
                        //$('.blut-search-toggele').removeClass('go-down').addClass('go-up');
                        $('#content1').removeClass('content-m-top0').addClass('content-m-top40');
                        $scope.headerMenuToggle = true;
                    }
                },
                toggleSearchLayer: function (status) {
                    if (status) {
                        $scope.searchLayerStatus = false;
                        $('#searchLayer').animate({
                            opacity: 0,
                            left: '-100%'
                        }, 500);
                    } else {
                        $scope.searchLayerStatus = true;
                        $('#searchLayer').animate({
                            opacity: '1',
                            left: '0'
                        }, 500);


                    }
                },
                leftMenuToggle: function (status) {
                    if (status) {
                        $('.left-menu-bar').animate({
                            left: '-45px'
                        }, 300);
                        $scope.leftMenuToggleState = false;
                        $('#content1').removeClass('content-m-left-0').addClass('content-m-left-40');
                    } else {
                        $('.left-menu-bar').animate({
                            left: '0px'
                        }, 300);
                        $scope.leftMenuToggleState = true;
                        $('#content1').removeClass('content-m-left-40').addClass('content-m-left-0');
                    }
                },
                closeHeaderMenu: function () {
                    layoutManager.toggleDownSettingPanel($scope.dropDownbtnStatus);
                    layoutManager.headerMenuToggle($scope.headerMenuToggle);
                }
            }
        })();

        $scope.profileMouseHover = function () {
            $scope.dropDownbtnStatus = true;
        };

        $scope.profileMouseLeave = function () {
            $scope.dropDownbtnStatus = false;
        };

        $scope.onClickViewProfileSetting = function () {
            if ($scope.dropDownbtnStatus) {
                layoutManager.toggleDownSettingPanel($scope.dropDownbtnStatus);
            } else {
                layoutManager.toggleDownSettingPanel($scope.dropDownbtnStatus);
            }
            if ($scope.searchLayerStatus) {
                layoutManager.toggleSearchLayer($scope.searchLayerStatus);
            }
            //if ($scope.leftMenuToggleState) {
            //    layoutManager.leftMenuToggle($scope.leftMenuToggleState);
            //}
        }

        $scope.toggelDownSearch = function (status) {
            if ($scope.searchLayerStatus) {
                layoutManager.toggleSearchLayer($scope.searchLayerStatus);
            } else {
                layoutManager.toggleSearchLayer($scope.searchLayerStatus);
            }
            if ($scope.dropDownbtnStatus) {
                layoutManager.toggleDownSettingPanel($scope.dropDownbtnStatus);
            }

        };

        $scope.topMenuToggle = function () {
            layoutManager.headerMenuToggle($scope.headerMenuToggle);
        };
        $scope.leftMenuToggle = function () {
            layoutManager.leftMenuToggle($scope.leftMenuToggleState);
        };

        //profile setting click
        $scope.profileDownMenu = (function () {
            return {
                clickProfileSetting: function () {
                    $state.go('home.profileSetting');
                    layoutManager.closeHeaderMenu();
                }
            }
        })();

            //enable sub menu
        $scope.isEnableSubMenu = false;
        
        var settingsSub = [
                                {name: "New user",icon: "ti-user", link: "home.createUser"},
                                {name: "Share", icon: "ti-share", link: "home.share"},
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
            layoutManager.headerMenuToggle(true);
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
               $scope.currentView = $scope.currentSubMenu.header;
           }

        }



 }]);

 routerApp.controller('tenantCtrl',['$scope','$mdDialog','$http','Digin_Tenant', function ($scope,$mdDialog,$http,Digin_Tenant) {

    //$http.get(Digin_Tenant + '/tenant/GetTenants/' + '15430a361f730ec5ea2d79f60d0fa78e')
    $http.get(Digin_Tenant + '/tenant/GetTenants/' + getCookie('securityToken'))
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



routerApp.controller('inviteUserCtrl',['$scope','$mdDialog','$http','Digin_Tenant','ngToast','$rootScope', function ($scope,$mdDialog,$http,Digin_Tenant,ngToast,$rootScope) {

    $scope.cancel = function() {
        $mdDialog.cancel();
    };


    // create a toast with settings:
    // ngToast.create({
    //   className: 'warning',
    //   content: '<a href="#" class="ng-toast-msg">a message</a>'
    // });


    function fireMsg(msgType, content) {
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
            dismissOnClick: true,
            dismissButton:true
        });
    }


    $scope.validateEmail1=function(email){

        if(email==undefined){
            fireMsg('0', 'Email can not be a blank.');
            return false;
        }
        else if(email==""){
            fireMsg('0', 'Email can not be a blank.');
            return false;
        }
        else{
            return true;
        }
        return true;
    }
    
    $scope.validateEmail2=function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    
    $scope.inviteUser = function () {   
        var mail=$scope.user.email;
        if($scope.validateEmail1(mail)==false){return;}
        else if ($scope.validateEmail2(mail)==false){fireMsg('0', 'Please enter valid email address to proceed.'); return;}
        else{
            
            $scope.exist=false;

            if($rootScope.sharableUsers==undefined){
                $scope.invite();
            } 

            else if($rootScope.sharableUsers.length>0){
                for(var i=0; i<$rootScope.sharableUsers.length; i++){
                    if($scope.user.email==$rootScope.sharableUsers[i].Id){
                        $scope.exist=true;
                    }
                };

                if($scope.exist==true){
                    fireMsg('0', '</strong>This user is already invited');
                    return;
                }
                else{
                    $scope.invite();
                }
            }
        }   
    }

    $scope.invite = function () {
        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
        $http.get(baseUrl + '/auth/tenant/AddUser/' + $scope.user.email + '/user', {
                headers: {'Securitytoken': userInfo.SecurityToken}
            })
            .success(function (response) {
                if(response=="false"){
                    fireMsg('0', '</strong>This user has not been registered for DigIn.');
                }
                else{
                    fireMsg('1', '</strong>Invitation sent successfully.');
                    $scope.getAllSharableObj();
                    $scope.inviteForm.$setUntouched();
                    $scope.user.email='';
                }
            }).error(function (error) {
                fireMsg('0', 'Invitation sending fail');
        });
    };
   
    $scope.getSharableObj=function(){
        var baseUrl = "http://" + window.location.hostname;
        
        //$http.get("http://omalduosoftwarecom.prod./apis/usercommon/getSharableObjects")
        $http.get(baseUrl + "/apis/usercommon/getSharableObjects")
            .success(function (data) {
                console.log(data);
                $rootScope.sharableObjs = [];
                $rootScope.sharableUsers = [];
                $rootScope.sharableGroups = [];

                for (var i = 0; i < data.length; i++) {
                    if (data[i].Type == "User") {
                        $rootScope.sharableObjs.push({id: data[i].Id, name: data[i].Name});
                        $rootScope.sharableUsers.push({Id: data[i].Id, Name: data[i].Name});
                    }
                    else if (data[i].Type == "Group") {
                        $rootScope.sharableObjs.push({id: data[i].Id, name: data[i].Name});
                        $rootScope.sharableGroups.push({groupId: data[i].Id, groupname: data[i].Name});
                    }
                }
                console.log($rootScope.sharableObjs);
                console.log($rootScope.sharableUsers);
                console.log($rootScope.sharableGroups);
        
            }).error(function () {
            
        });
    }





}])
