routerApp.controller('NavCtrl', ['$scope', '$mdBottomSheet', '$mdSidenav', '$mdUtil',
    '$timeout', '$rootScope', '$mdDialog', '$objectstore', '$state', 'Fullscreen', '$http', 'Digin_ReportViewer',
    '$localStorage', '$window', 'ObjectStoreService', 'Digin_Base_URL', 'DashboardService', '$log', '$mdToast',
    'DevStudio', '$auth', '$helpers', 'dynamicallyReportSrv', 'Digin_Report_Base', 'Digin_Tomcat_Base',
    function ($scope, $mdBottomSheet, $mdSidenav, $mdUtil, $timeout, $rootScope, $mdDialog, $objectstore, $state,
              Fullscreen, $http, Digin_ReportViewer, $localStorage, $window, ObjectStoreService,
              Digin_Base_URL, DashboardService, $log, $mdToast, DevStudio,
              $auth, $helpers, dynamicallyReportSrv, Digin_Report_Base, Digin_Tomcat_Base) {

        if (DevStudio) {
            $auth.checkSession();
        } else {
            var sessionInfo = $helpers.getCookie('securityToken');
            // if(sessionInfo==null) location.href = 'index.php';
        }

        $scope.username=JSON.parse(decodeURIComponent(getCookie('authData'))).Username;
        $scope.imageUrl = "styles/css/images/innerlogo.png";

        var $windowHeight = $(window).height(),
            $windowWidth = $(window).width(),
            $startingPoint = $('.starting-point');

        // Calculate the diameter
        var diameterValue = (Math.sqrt(Math.pow($windowHeight, 2) + Math.pow($windowWidth, 2)) * 2);

        $startingPoint.children('span').css({
            height: diameterValue + 'px',
            width: diameterValue + 'px',
            top: -(diameterValue / 2) + 'px',
            left: -(diameterValue / 2) + 'px'
        });

        //initially hiding the tabs
        $("md-tabs.footer-bar > md-tabs-wrapper").children().hide();
        //configuring gridster
        $scope.gridsterOpts = {
            columns: 24, // number of columns in the grid
            pushing: true, // whether to push other items out of the way
            floating: true, // whether to automatically float items up so they stack
            swapping: false, // whether or not to have items switch places instead of push down if they are the same size
            width: 'auto', // width of the grid. "auto" will expand the grid to its parent container
            colWidth: 'auto', // width of grid columns. "auto" will divide the width of the grid evenly among the columns
            rowHeight: '/4', // height of grid rows. 'match' will make it the same as the column width, a numeric value will be interpreted as pixels, '/2' is half the column width, '*5' is five times the column width, etc.
            margins: [5, 5], // margins in between grid items
            outerMargin: true,
            isMobile: false, // toggle mobile view
            mobileBreakPoint: 600, // width threshold to toggle mobile mode
            mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
            minColumns: 1, // minimum amount of columns the grid can scale down to
            minRows: 1, // minimum amount of rows to show if the grid is empty
            maxRows: 100, // maximum amount of rows in the grid
            defaultSizeX: 6, // default width of an item in columns
            defaultSizeY: 8, // default height of an item in rows
            minSizeX: 6, // minimum column width of an item
            maxSizeX: null, // maximum column width of an item
            minSizeY: 8, // minumum row height of an item
            maxSizeY: null, // maximum row height of an item
            saveGridItemCalculatedHeightInMobile: false, // grid item height in mobile display. true- to use the calculated height by sizeY given
            draggable: {
                enabled: true
            },
            resizable: {
                enabled: true,
                handles: ['n', 'e', 's', 'w', 'se', 'sw', 'ne', 'nw']
            }
        };
        // maps the item from customItems in the scope to the gridsterItem options
        $scope.customItemMap = {
            sizeX: 'item.size.x',
            sizeY: 'item.size.y',
            row: 'item.position[0]',
            col: 'item.position[1]',
            minSizeY: 'item.minSizeY',
            maxSizeY: 'item.maxSizeY'
        };

        $scope.dashCloseWidgets = false;

        
        getJSONData($http, 'menu', function (data) {
            
            localStorage.setItem("sidebarData", JSON.stringify(data));
            $scope.sidebarItems = data;
        });
        
        // headerbar 
        $scope.headerbarPinned = false;

        $scope.pinHeaderbar = function (state) {
            $scope.headerbarPinned = state;
        }
        $scope.adjustUI = function () {
            
            if($scope.headerbarPinned){
                $('#content1').css("top", "40px");
                $('#content1').css("height", "calc(100vh - 40px)");
                $('.h_iframe').css("height", "calc(100vh - 40px)");
                $('.main-headbar-slide').css("transform", "translateY(0)");
                $('#mainHeadbar:hover > .main-headbar > .main-headbar-slide').css("transform", "translateY(0)");
            }
            else{
                $('#content1').css("top", "0px");
                $('#content1').css("height", "calc(100vh)");
                $('.h_iframe').css("height", "calc(100vh)");
                $('.main-headbar-slide').css("transform", "translateY(-40px)");
                $('#mainHeadbar:hover > .main-headbar > .main-headbar-slide').css("transform", "translateY(0)");
            }  
        }

        $scope.closeDialog = function () {
            $mdDialog.hide();
        };
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
            .then(function (answer) {}, function () {});
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
            }).then(function (answer) {}, function () {});
        };

        // angular-table configuration 
        $scope.configDashboards = {
            itemsPerPage: 5,
            fillLastPage: true
        }
        $scope.configReports = {
            itemsPerPage: 5,
            fillLastPage: true
        }

        // $scope.w = '320px';
        // $scope.h = '300px';
        // $scope.mh = '250px';

        // $scope.resize = function (evt, ui, pos, widget) {

        //     var width = ui.size.width;
        //     var height = ui.size.height;
        //     var mHeight = height - 50;
        //     widget.top = pos.top + 'px';
        //     widget.left = pos.left + 'px';

        //     if (widget.initCtrl == "elasticInit") {
        //         console.log('elastic');
        //         widget.highchartsNG.size.width = width - 30;
        //         widget.highchartsNG.size.height = mHeight - 30;
        //         widget.width = (width + 10) + 'px';
        //         widget.height = (height + 10) + 'px';
        //         widget.mheight = (mHeight + 10) + 'px';
        //     } else {
        //         widget.width = width + 'px';
        //         widget.height = height + 'px';
        //         widget.mheight = mHeight + 'px';

        //     }
        // }

        $rootScope.username = localStorage.getItem('username');

        $rootScope.indexes = [];
        $scope.toggle = true;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        $rootScope.dashboard = {
            '1': {
                widgets: []
            }
        };

        // var client = $objectstore.getClient("com.duosoftware.com");
        // client.onGetMany(function (data) {
        //     data.forEach(function (entry) {
        //         $rootScope.indexes.push({
        //             value: entry,
        //             display: entry
        //         });
        //     });
        // });
        // client.getClasses("com.duosoftware.com");

        today = mm + '/' + dd + '/' + yyyy;
        $rootScope.dashboard.dashboardName = "";
        $rootScope.dashboard.dashboardDate = today;
        $rootScope.dashboard.dashboardType = "System";
        $rootScope.dashboard.dashboardCulture = "English";
        $rootScope.indexes = [];
        $rootScope.currentView = "";
        $scope.ChartType = 'column';
        $scope.count = 0;
        $scope.incremenet = 0;
        $scope.leftPosition = 110;
        $scope.topPosition = 60;
        $scope.chartSeries = [];
        $scope.dashboard = [];
        $scope.dashboard.widgets = $rootScope.dashboard["1"].widgets;


        // $scope.menuPanels = [DashboardCtrl];

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

        $scope.goReport = function (report) {
            $scope.manageTabs(false);
            //closing the overlay
            $(".overlay").removeClass("overlay-search active");
            $(".nav-search").removeClass("active");
            $(".search-layer").removeClass("activating active");

            $state.go('home', {
                param: report
            });
        }


        //On click report Event
        $scope.goReport2 = function (report) {
            $scope.manageTabs(false);
            //closing the overlay
            $(".overlay").removeClass("overlay-search active");
            $(".nav-search").removeClass("active");
            $(".search-layer").removeClass("activating active");
            // console.log(report);
            $state.go('home.DynamicallyReportBuilder', {'reportNme': report});
        }
        $scope.goDashboard = function (dashboard) {
            console.log("hit dashboard");
            console.log(dashboard);
            if (typeof dashboard.customDuoDash === "undefined") {
                $state.go('home.DashboardViewer', {
                    param: dashboard.name
                });
                $scope.manageTabs(false);
            } else {
                $scope.manageTabs(true);
                if (dashboard.storyboard == undefined) {
                    if (dashboard.data.title == undefined) {
                        console.log("i got undefined");
                        $rootScope.Dashboards = [{
                            culture: dashboard.culture,
                            date: dashboard.date,
                            title: dashboard.name,
                            type: dashboard.type,
                            widgets: dashboard.data,
                            dashboardId: dashboard.dashboardId
                        }];
                    } else {
                        $rootScope.Dashboards = dashboard.data;
                    }
                } else {
                    if (dashboard.storyboard == false) {
                        // $('md-tabs-wrapper').css("display","block");
                        console.log("im a single page");
                        $rootScope.Dashboards = [{
                            culture: dashboard.culture,
                            date: dashboard.date,
                            title: dashboard.name,
                            type: dashboard.type,
                            widgets: dashboard.data,
                            dashboardId: dashboard.dashboardId
                        }];
                    } else {
                        console.log("im a storyboard");
                        $rootScope.Dashboards = dashboard.data;
                    }
                    $state.go('home.CustomDashboardViewer', {
                        param: dashboard.name
                    });
                    $scope.dashboard.widgets = dashboard.data;
                    $rootScope.clickedDash = dashboard;
                    $(".dashboard-widgets-close").addClass("active");
                }
            }

            $scope.tabs = $rootScope.Dashboards;
            $rootScope.dashboard = $rootScope.Dashboards[0];
            if ($rootScope.dashboard.widgets.length == 0)
                $rootScope.dashboard.widgets = $rootScope.dashboardWidgetsCopy;
            $scope.selectedIndex = 1;
            $scope.$watch('selectedIndex', function (current, old) {
                // var previous = selected;
                // if($rootScope.Dashboards[current].widgets.length== 0)
                //     selected = $rootScope.dashboardWidgetsCopy;
                // else
                selected = $rootScope.Dashboards[current];
                if (old + 1 && (old != current)) $log.debug('Goodbye ' + previous.title + '!');
                //if (current + 1) $log.debug('Hello ' + selected.title + '!');
            });
            console.log(dashboard);

            $(".overlay").removeClass("overlay-search active");
            $(".nav-search").removeClass("active");
            $(".search-layer").removeClass("activating active");

        }

        $scope.goAnalyzer = function (report) {
            $scope.manageTabs(false);
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

            return {
                getAllReport: function () {
                    getSession();
                    dynamicallyReportSrv.getAllReports(reqParameter).success(function (data) {
                        if (data.Is_Success) {
                            for (var i = 0; i < data.Result.length; i++) {
                                $scope.reports.push(
                                    {splitName: data.Result[i], path: '/dynamically-report-builder'}
                                );
                            }
                        }
                    }).error(function (respose) {
                        console.error('error request getAllReports...');
                    });
                }
            }
        }());
        privateFun.getAllReport();

        $scope.ExistingDashboardDetails = [];
        $scope.reports = [];
        $scope.favoriteReports = [];
        $scope.analyzers = [];
        $scope.favoriteDashboards = [];
        $scope.dashboards = [];
        $scope.favoriteAnalyzers = [];

        $scope.GetDashboardDetails = function () {
            $scope.dashboards = DashboardService.getDashboards();
        };
        $scope.GetReportDetails = function () {
            $scope.GetDashboardDetails();
            $scope.GetAnalyzerDetails();
            //
            //$http.get('http://104.155.236.85:8080/getreportnames?SecurityToken=0b4fac3276c5328db15e538590665d6a&Domain=duosoftware.com')
            //.success(function(response){
            //     // $scope.reportsData = response.Result;
            //     $scope.reportsData = [{title: "marle (mr. bean)"}, {title: "sajee + hasini"}];
            // });

        };
        $scope.GetAnalyzerDetails = function () {

        };
        $scope.createuuid = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };

        function addToDashboards(obj) {
            console.log("creating new dashboard");
            var tempObj = {
                dashboardId: $scope.createuuid(),
                culture: "English",
                date: new Date(),
                title: obj.title,
                type: obj.type,
                widgets: []
            };

            console.log(tempObj);

            $rootScope.Dashboards.push(tempObj);
            if (obj.title != undefined) {
    
                $mdToast.show(
                    $mdToast.simple()
                    .content(obj.title + " created!")
                    .position("bottom right")
                    .hideDelay(3000)
                );
            }
        };

        $rootScope.selectCurrentDashboard = function (tab) {

            console.log("$rootScope");
            console.log($rootScope);

            console.log("you selected :");
            console.log(tab);

            // for (a = 0; a < $rootScope.Dashboards.length; a++) {
            //     if ($rootScope.dashboardId == $rootScope.Dashboards[a].dashboardId) {
            //         $rootScope.Dashboards[a] = $rootScope.dashboard;
            //     };
            // };

            for (a = 0; a < $rootScope.Dashboards.length; a++) {
                if (tab.dashboardId == $rootScope.Dashboards[a].dashboardId) {
                    $rootScope.dashboard = $rootScope.Dashboards[a];
                    //$rootScope.globalDashboardIndex = a;
                }
                ;
            }
            ;
        }

        //initial creation of default dashboard
        function createDashboards() {

            $rootScope.Dashboards = [{
                culture: "English",
                date: "09/25/2015",
                title: "Default",
                type: "System",
                widgets: [],
                dashboardId: $scope.createuuid()
            }];

            $scope.tabs = $rootScope.Dashboards;
            $rootScope.dashboard = $rootScope.Dashboards[0];
            $scope.selectedIndex = 1;
            $scope.$watch('selectedIndex', function (current, old) {
                //previous = selected;
                selected = $rootScope.Dashboards[current];
                //                if (old + 1 && (old != current)) $log.debug('Goodbye ' + previous.title + '!');
                //                if (current + 1) $log.debug('Hello ' + selected.title + '!');
            });

        };

        createDashboards();

        $scope.addTab = function (title, view) {
            view = view || title + " Content View";
            tabs.push({
                title: title,
                content: view,
                disabled: false
            });
        };
        $scope.removeTab = function (tab) {
            console.log("removing tab : ");
            console.log(tab);
            var index1 = $rootScope.Dashboards.indexOf(tab);
            $rootScope.Dashboards.splice(index1, 1);

        };
        $scope.clickTabRemoveConfirmation = function () {

            document.getElementById("TabRemoveConfirmation").click();
        };
        $scope.removeTabConfirmation = function (tab, ev) {

            var confirm = $mdDialog.confirm()
                .title('Would you like to delete dashboard ' + tab.title + '?')
                .content('dashboard will be deleted from your collection')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Please do it!')
                .cancel('Oh NO!');
            $mdDialog.show(confirm).then(function () {
                $scope.removeTab(tab);
            }, function () {

            });
        };
        //end of erangas space
        $scope.getURL = function () {
            $scope.imageUrl = $rootScope.image;
        }
        // hides and shows the dashboard tabs
        $scope.manageTabs = function (dashboard) {
            if (dashboard) {
                console.log("manage tabs true");
                $("md-tabs > md-tabs-wrapper").children().show();
                // $( "md-tabs.footer-bar > md-tabs-wrapper" ).css( "background-color","rgba(0, 0, 0, 0.14)" );
                $scope.dashCloseWidgets = false;
            } else {
                console.log("manage tabs false");
                $("md-tabs > md-tabs-wrapper").children().hide();
                // $( "md-tabs.footer-bar > md-tabs-wrapper" ).css( "background-color","#ECECEC" );
                $scope.dashCloseWidgets = false;
            }
        };
        
        //navigate
        $scope.navigate = function (routeName, ev) {

            switch(routeName){
                case "home":
                    $scope.goHomeDialog(ev);
                break;
                case "Add Page":
                    $scope.currentView = "Dashboard";
                    $scope.showAddNewDashboard(ev);
                    $state.go('home.Dashboards');
                break;
                case "Social Media Analytics":
                    $scope.currentView = "Social Analysis";
                    $scope.showAddSocialAnalysis(ev);
                break;
                case "Add Widgets":
                    $scope.currentView = "Dashboard";
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
                   $state.go("home.commonDataSource");
                   //Comment by Gevindu on 2016/05/12 due to DUODIGIN-455 
                /*   if (!$mdSidenav('right').isOpen()) {
                        $mdSidenav('right').toggle().then(function () {
                                $log.debug("toggle right is done");
                       });
                    }*/
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
                    if($state.current.name == 'home.Dashboards' || $state.current.name == 'home.CustomDashboardViewer')
                    $scope.saveDashboard(ev);
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
                    $state.go("home.dataSource");
                break;
                default:
                    $state.go("home");
                break;
            }
        };
        //navigate functions start
        $scope.goHomeDialog = function (ev){
            $mdDialog.show({
                controller: function goHomeCtrl($scope, $mdDialog) {

                    var homeState = null;
                    $scope.goHome = function(){
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
                if(homeState){
                    $scope.manageTabs(true);
                    $scope.currentView = "Home";
                    $state.go('home');
                }
            });
        }
        $scope.showAddNewDashboard = function (ev) {
            $mdDialog.show({
                    templateUrl: 'templates/addNewDashboardTemplate.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    controller: function addNewDashboardController($scope, $mdDialog) {
                        //console.log($rootScope.dashboard);
                        $scope.numOfDashboards = $rootScope.dashboard.length;
                        $scope.createNewDashboard = function () {
                            var obj = {
                                title: $scope.dashboard.title,
                                type: $scope.dashboard.type
                            };
                            $mdDialog.hide(obj);
                        };
                        $scope.close = function () {
                            $mdDialog.cancel();
                        };
                    }
                })
                .then(function (answer) {
                    addToDashboards(answer);
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
        $scope.clearAllWidgets = function (ev){
            $mdDialog.show({
                controller: function clearWidgetsCtrl($scope, $mdDialog){
                    $scope.clear = function(){
                        $rootScope.dashboardWidgetsCopy = angular.copy($rootScope.dashboard.widgets);
                        $rootScope.dashboard.widgets = [];
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

        var icons = ['dashboard', 'dashboard'];
        var colors = ['#323232', '#262428'];
        $scope.cnt = Math.floor(Math.random() * icons.length);
        $scope.icon = icons[$scope.cnt];
        $scope.fill = colors[0];
        $scope.size = 48;

        setInterval(function () {
            var random = Math.random();
            if (random < 0.2) {
                $scope.size = 28 + 4 * Math.floor(Math.random() * 9);
            } else {
                $scope.cnt++;
                if ($scope.cnt >= icons.length)
                    $scope.cnt = 0;
                $scope.icon = icons[$scope.cnt];
                $scope.fill = colors[Math.floor(Math.random() * colors.length)];
            }
            $scope.$apply();
        }, 1700);
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

