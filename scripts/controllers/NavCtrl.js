routerApp.controller('NavCtrl', ['$scope', '$mdBottomSheet', '$mdSidenav', '$mdUtil',
    '$timeout', '$rootScope', '$mdDialog', '$objectstore', '$state', '$http', 'Digin_ReportViewer',
    '$localStorage', '$window', 'ObjectStoreService', 'Digin_Base_URL', 'DashboardService', '$log', '$mdToast',
    'DevStudio', '$auth', '$helpers', 'dynamicallyReportSrv', 'Digin_Report_Base', 'Digin_Tomcat_Base', 'ngToast', 'Digin_Domain','$filter',
    function ($scope, $mdBottomSheet, $mdSidenav, $mdUtil, $timeout, $rootScope, $mdDialog, $objectstore, $state,
              $http, Digin_ReportViewer, $localStorage, $window, ObjectStoreService,
              Digin_Base_URL, DashboardService, $log, $mdToast, DevStudio,
              $auth, $helpers, dynamicallyReportSrv, Digin_Report_Base, Digin_Tomcat_Base, ngToast, Digin_Domain,$filter) {

        if (DevStudio) {
            $auth.checkSession();
        } else {
            var sessionInfo = $helpers.getCookie('securityToken');
            // if(sessionInfo==null) location.href = 'index.php';
        }

        $scope.username = JSON.parse(decodeURIComponent(getCookie('authData'))).Username;

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
        //initially hiding the tabs
        $scope.showTabs(true);
        //set initial logo as Digin logo
        $scope.imageUrl = "styles/css/images/DiginLogo.png";
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
                        var userInfo = JSON.parse(getCookie("authData"));
                        $scope.user = {
                            fname: userInfo.Name,
                            lname: "",
                            email: userInfo.Email,
                            //location: "Colombo",
                            //mobile: "077123123123",
                            profile_pic: "styles/css/images/person.jpg"
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

                    var userInfo = JSON.parse(getCookie("authData"));
                    $rootScope.username = userInfo.Username;
                    $http.get('http://104.197.27.7:3048/tenant/GetTenants/' + userInfo.SecurityToken)
                        .success(function (response) {
                            $scope.tennants = response;
                        });


                    //------------------ 
                    /*
                     http://adminduowebinfo.space.duoworld.duoweb.info:3048/tenant/GetTenants/7137bb3fd12f4aaa93822202a75df562
                     $http.get('http://adminduowebinfo.space.duoworld.duoweb.info:3048/tenant/GetTenants/'+ $auth.getSecurityToken())
                     .success(function(response){
                     alert(JSON.stringify(response));
                     $scope.tennants=response;
                     });
                     */

                    /*
                     $http({
                     method: 'GET',
                     url: "http://adminduowebinfo.space.duoworld.duoweb.info:3048/tenant/GetTenants/" +  $auth.getSecurityToken(),
                     headers: {
                     'Content-Type': 'application/x-www-form-urlencoded'
                     }
                     }).
                     success(function (response) {
                     $scope.tennants=response.records;
                     });
                     */
                    //-------------------------

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
                            window.open("http://" + tennant);
                        }, function () {
                            //alert('No!');
                            $scope.status = 'No';
                        });
                        //)
                    };

                    /*
                     $scope.showConfirm = function(tennant,event) {
                     var confirm = $mdDialog.confirm()
                     .title('Would you like to delete your debt?')
                     .textContent('All of the banks have agreed to forgive you your debts.')
                     .ariaLabel('Lucky day')
                     .targetEvent(event)
                     .ok('Please do it!')
                     .cancel('Sounds like a scam');
                     $mdDialog.show(confirm).then(function() {
                     $scope.status = 'You decided to get rid of your debt.';
                     }, function() {
                     $scope.status = 'You decided to keep your debt.';
                     });
                     };
                     */
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

        $scope.test =function() {
           // console.log("scope.sortedList", $scope.sortedAndPaginatedList);
        };

        $scope.originalDashboardsList = $scope.dashboards;
        $scope.originalReportssList =$scope.reports;
        $scope.updateFilteredList = function() {
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
        $scope.goDashboard = function (dashboard) {


            console.log("dash item", dashboard);

            var userInfo = JSON.parse(getCookie("authData"));
            $http({
                method: 'GET',
                url: 'http://192.168.2.33:8080/get_component_by_comp_id?comp_id=' + dashboard.dashboardID + '&SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain
            })
                .success(function (data) {
                    if (data.Is_Success) {
                        console.log("$scope.dashboardObject", $scope.dashboardObject);
                        $rootScope.dashboard = data.Result;
                        ngToast.create({
                            className: 'success',
                            content: data.Custom_Message,
                            horizontalPosition: 'center',
                            verticalPosition: 'top',
                            dismissOnClick: true
                        });

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
                apiBase: Digin_Report_Base,
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
                    var userInfo = JSON.parse(getCookie("authData"));
                    $http({
                        method: 'GET',
                        url: 'http://192.168.2.33:8080/get_all_components?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain
                    })
                        .success(function (data) {
                            console.log("data getAllDashboards", data);
                            for (var i = 0; i < data.Result.length; i++) {
                                $scope.dashboards.push(
                                    {dashboardID: data.Result[i].compID, dashboardName: data.Result[i].compName}
                                );
                            }
                            ngToast.create({
                                className: 'success',
                                content: 'Retrieved Dashboard Details!',
                                horizontalPosition: 'center',
                                verticalPosition: 'top',
                                dismissOnClick: true
                            });
                            $mdDialog.hide();
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
                }
            }
        }());

        $scope.getSearchPanelDetails = function () {

            privateFun.getAllDashboards();
            privateFun.getAllReports();
            $scope.getAnalyzerDetails();
        }

        $scope.getDashboardDetails = function () {

        }
        $scope.getReportDetails = function () {

        };
        $scope.getAnalyzerDetails = function () {

        };

        $scope.getURL = function () {

            $scope.imageUrl = $rootScope.image;
        }

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
                        .title('Do you want to logout ?')
                        .targetEvent(event)
                        .ok('Yes!')
                        .cancel('No!');
                    $mdDialog.show(confirm).then(function () {
                        //$scope.status = 'Yes';
                        $window.location = "logout.php";
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
                    $state.go('home.Settings');
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
                default:
                    $state.go("home");
                    break;
            }
        };
        //navigate functions start
        $scope.goHomeDialog = function (ev) {

            $mdDialog.show({
                controller: function goHomeCtrl($scope, $mdDialog) {

                    var homeState = null;
                    $scope.goHome = function () {
                        $mdDialog.hide();
                        homeState = true;
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

                            if ($scope.title) {
                                var page = {
                                    "widgets": [],
                                    "pageID": "temp" + $scope.createuuid(),
                                    "pageName": $scope.title,
                                    "pageData": null
                                }
                                $rootScope.dashboard.pages.push(page);
                                console.log("pages", $rootScope.pages);
                                $mdDialog.hide();
                            }
                            else {
                                ngToast.create({
                                    className: 'danger',
                                    content: 'Please fill the name field',
                                    horizontalPosition: 'center',
                                    verticalPosition: 'top',
                                    dismissOnClick: true
                                });
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
                templateUrl: 'views/dashboard-save.html',
                targetEvent: ev,
                resolve: {
                    widget: function () {
                        return dashboard;
                    }
                }
            })
        }
        $scope.clearAllWidgets = function (ev) {

            $mdDialog.show({
                controller: function clearWidgetsCtrl($scope, $mdDialog) {
                    $scope.clear = function () {
                        //$rootScope.dashboardWidgetsCopy = angular.copy($rootScope.dashboard.widgets);
                        $rootScope.dashboard.pages[$rootScope.selectedPage - 1].widgets = [];
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

        // var icons = ['dashboard', 'dashboard'];
        // var colors = ['#323232', '#262428'];
        // $scope.cnt = Math.floor(Math.random() * icons.length);
        // $scope.icon = icons[$scope.cnt];
        // $scope.fill = colors[0];
        // $scope.size = 48;

        // setInterval(function () {
        //     var random = Math.random();
        //     if (random < 0.2) {
        //         $scope.size = 28 + 4 * Math.floor(Math.random() * 9);
        //     } else {
        //         $scope.cnt++;
        //         if ($scope.cnt >= icons.length)
        //             $scope.cnt = 0;
        //         $scope.icon = icons[$scope.cnt];
        //         $scope.fill = colors[Math.floor(Math.random() * colors.length)];
        //     }
        //     $scope.$apply();
        // }, 1700);

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
    }

]);


