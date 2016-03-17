routerApp.controller('NavCtrl', ['$scope', '$mdBottomSheet', '$mdSidenav', '$mdUtil',
    '$timeout', '$rootScope', '$mdDialog', '$objectstore', '$state', 'Fullscreen', '$http', 'Digin_ReportViewer', '$localStorage', '$window', 'ObjectStoreService', 'Digin_Base_URL', 'DashboardService', '$log', '$mdToast', 'DevStudio', '$auth', '$helpers',
    function ($scope, $mdBottomSheet, $mdSidenav, $mdUtil, $timeout, $rootScope, $mdDialog, $objectstore, $state, Fullscreen, $http, Digin_ReportViewer, $localStorage, $window, ObjectStoreService, Digin_Base_URL, DashboardService, $log, $mdToast, DevStudio, $auth, $helpers) {

        if (DevStudio) {
            $auth.checkSession();
        } else {
            var sessionInfo = $helpers.getCookie('securityToken');
            // if(sessionInfo==null) location.href = 'index.php';
        }

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
            defaultSizeX: 4, // default width of an item in columns
            defaultSizeY: 8, // default height of an item in rows
            minSizeX: 4, // minimum column width of an item
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

        if (localStorage.getItem("featureObject") == undefined) {
            getJSONData($http, 'features', function (data) {
                $scope.featureOrigin = data;
                localStorage.setItem("featureObject", JSON.stringify($scope.featureOrigin));
                // var featureObj = localStorage.getItem("featureObject");                

                $scope.selected = [];
                for (i = 0; i < data.length; i++) {
                    if (data[i].stateStr === "Enabled")
                        $scope.selected.push(data[i]);
                }
                $scope.features = data;
            });

        }
        //pushes gridster items 10px down, remove padding to body, adjust iframe height
        $scope.adjustUI = function () {
            $('body').css("padding-top", "0px");
            // $('#content1').css("top", "10px");
            $('.h_iframe').css("height", "100%");
        }

        //shows user profile in a dialog box
        $scope.showUserProfile = function(ev) {
            $mdDialog.show({
                    controller: showProfileController,
                    templateUrl: 'templates/profileDialogTemplate.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function(answer) {

                }, function() {

                });
        };


        function showProfileController($rootScope,$scope, $mdDialog) {

            var userInfo = $auth.getSession();  

            $scope.user = {
                fname: userInfo.Name,
                lname: "",
                email: userInfo.Email,
                location: "Colombo",
                mobile: "077123123123",
                profile_pic: "styles/css/images/person.jpg"
            };

            $scope.close = function() {
                $mdDialog.cancel();
            };

        };


         //shows tennant dialog box
        $scope.showTennant = function(ev) {
            $mdDialog.show({
                    controller: showTennantController,
                    templateUrl: 'templates/TennantDialogTemplate.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function(answer) {

                }, function() {

                });
        };

        function showTennantController($scope, $mdDialog,$http,$auth) {
           /*
            var userInfo = JSON.parse(getCookie("authData"));
            //console.log(JSON.parse(userInfo.Otherdata.TenentsAccessible));
            console.log(JSON.parse(userInfo.Otherdata.TenentsAccessible).replace('`', '"'));
            //$scope.tennants = JSON.parse(userInfo.Otherdata.TenentsAccessible);
            $scope.tennants = JSON.parse(userInfo.Otherdata.TenentsAccessible).replace('`', '"');
            */

            var userInfo = JSO.parNse(getCookie("authData"));
            $http.get('http://104.197.27.7:3048/tenant/GetTenants/'+ userInfo.SecurityToken)
            .success(function(response){
                 $scope.tennants=response;
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

                $scope.showConfirmation = function(tennant,event) {
                    //$mdDialog.show(
                        var confirm=$mdDialog.confirm()
                            .title('Do you want to switching to '+ tennant)                            
                            .targetEvent(event)
                            .ok('Yes!')
                            .cancel('No!');
                        $mdDialog.show(confirm).then(function(){
                            console.log(JSON.stringify(tennant));
                            $scope.status = 'Yes';
                            window.location = "http://"+tennant;
                        },function(){
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


        $scope.close = function() {
            $mdDialog.cancel();
        };


        };

        $scope.currentPage = 1;
        $scope.pageSize = 5;

        $scope.w = '320px';
        $scope.h = '300px';
        $scope.mh = '250px';

        $scope.resize = function (evt, ui, pos, widget) {

            var width = ui.size.width;
            var height = ui.size.height;
            var mHeight = height - 50;
            widget.top = pos.top + 'px';
            widget.left = pos.left + 'px';

            if (widget.initCtrl == "elasticInit") {
                console.log('elastic');
                widget.highchartsNG.size.width = width - 30;
                widget.highchartsNG.size.height = mHeight - 30;
                widget.width = (width + 10) + 'px';
                widget.height = (height + 10) + 'px';
                widget.mheight = (mHeight + 10) + 'px';
            } else {
                widget.width = width + 'px';
                widget.height = height + 'px';
                widget.mheight = mHeight + 'px';

            }
        }


        // $scope.refreshHome = function(){
        //     $window.location.href = Digin_Base_URL + 'home.html';
        // };
        $rootScope.indexes = [];
        $scope.toggle = true;
        var today = new Date();
        var dd = today.getDate();

        $rootScope.username = localStorage.getItem('username');
        /*if ($rootScope.username == null) 
         {

         $rootScope.username = "sajeetharan%40duosoftware.com";
         }*/

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

        $scope.closeDialog = function () {
            $mdDialog.hide();
        };
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

        $scope.goReport2 = function (report) {
            $scope.manageTabs(false);
            //closing the overlay
            $(".overlay").removeClass("overlay-search active");
            $(".nav-search").removeClass("active");
            $(".search-layer").removeClass("activating active");

            // console.log(report);
            $state.go('home.DynamicallyReportBuilder');
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
                    $rootScope.clickedDash = dashboard.data;
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

        //    $scope.openSummarize = function(ev) {
        //     $mdDialog.show(
        //     {     
        //     templateUrl: 'views/summarize-data.html',
        //      controller: 'summarizeCtrl'
        //          })

        // };

        $scope.ExistingDashboardDetails = [];
        $scope.reports = [{splitName: 'CAF Details', path: '/dynamically-report-builder'}];
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

        };
        $scope.GetAnalyzerDetails = function () {


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
        $scope.openTheme = function (ev) {
            $mdDialog.show({
                controller: 'ThemeCtrl',
                templateUrl: 'views/change-theme.html',
                targetEvent: ev,
                clickOutsideToClose: true,
                resolve: {}
            });

        };
        $scope.openDashboard = function (ev, dashboard) {
            $mdDialog.show({
                controller: 'DataCtrl',
                templateUrl: 'views/dashboard-load.html',
                targetEvent: ev,
                resolve: {
                    dashboard: function () {
                        return dashboard;
                    }
                }
            })
        }
        $scope.help = function (ev, dashboard) {
            $mdDialog.show({
                controller: 'HelpCtrl',
                templateUrl: 'views/help.html',
                clickOutsideToClose: true,
                resolve: {}
            });
        }

        //erangas space
        $scope.showAddNewDashboard = function (ev) {
            $mdDialog.show({
                    controller: addNewDashboardController,
                    templateUrl: 'templates/addNewDashboardTemplate.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
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
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    addToDashboards(answer);
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
                showToast(obj.title + " created!");
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


        function addNewDashboardController($scope, $mdDialog) {
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
        };

        function showToast(text) {
            $mdToast.show(
                $mdToast.simple()
                    .content(text)
                    .position("bottom right")
                    .hideDelay(3000)
            );
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

        $scope.showAddNewWidgets = function (ev) {
            //            var selectedMenu = document.getElementsByClassName("menu-layer");
            //            selectedMenu[0].style.display = 'none';
            $mdDialog.show({
                controller: 'WidgetCtrl',
                templateUrl: 'views/newWidget.html',
                targetEvent: ev,
                clickOutsideToClose: true,
                resolve: {
                    dashboard: function () {
                        return $scope.dashboard;
                    }
                }
            })
        };

        $scope.showSettings = function (ev) {
            $mdDialog.show({
                controller: 'settingsCtrl',
                templateUrl: "views/settings.html",
                targetEvent: ev,
            })
        };
        //end of erangas space

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

        $scope.navigate = function (routeName, ev) {

            if (routeName == "Dashboards") {

                $scope.showAddNewDashboard(ev);
                $scope.manageTabs(true);
                $scope.currentView = "Dashboard";
                $state.go('home.' + routeName)
            }
            if (routeName == "Social Media Analytics") {
                $scope.manageTabs(false);
                $scope.currentView = "Social Analysis";
                $scope.showAddSocialAnalysis(ev);

            }

            if (routeName == "Add Widgets") {

                $('.dashboard-widgets-close').css("visibility", "visible");
                $('md-tabs-wrapper').css("visibility", "visible");


                $scope.showAddNewWidgets(ev);
                $scope.currentView = "Dashboard";
                $scope.manageTabs(true);
                $state.go("home.Dashboards");

                //$('md-tabs-wrapper').css("display","block");
            }
            // if (routeName == "D3plugins") {
            //     var selectedMenu = document.getElementsByClassName("menu-layer");
            //     selectedMenu[0].style.display = 'block';
            //     $rootScope.currentView = "D3plugins";
            //     $scope.manageTabs(false);
            //     $state.go('home.' + routeName);
            // }
            if (routeName == "Reports") {

                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'block';
                $rootScope.currentView = "Reports";
                $scope.manageTabs(false);
                $state.go('home.' + routeName);
            }
            if (routeName == "Analytics") {

                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'block';
                $(".menu-layer").css("top", "160px");
                $("starting-point").css("top", "160px");
                $scope.manageTabs(false);
                $rootScope.currentView = "Analytics";
            }
            if (routeName == "RealTime") {
                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'block';

                $(".menu-layer").css("top", "200px");
                $("starting-point").css("top", "200px");
                $scope.manageTabs(false);
                $state.go('home.' + routeName);

                $rootScope.currentView = "RealTime";

            }
            // if (routeName == "Digin P Stack") {

            //     var selectedMenu = document.getElementsByClassName("menu-layer");
            //     selectedMenu[0].style.display = 'block';
            //     $(".menu-layer").css("top", "240px");
            //     $("starting-point").css("top", "240px");
            //     $scope.manageTabs(false);

            //     $mdDialog.show({
            //         controller: 'pStackCtrl',
            //         templateUrl: 'views/pStackMenu.html',
            //         targetEvent: ev,
            //         clickOutsideToClose: true,
            //         resolve: {}

            //     });
            //     $rootScope.currentView = "Digin P Stack";
            //     //$state.go('home.'+routeName);                
            // }
            if (routeName == "Data Source") {

                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'block';
                $rootScope.currentView = "CommonData";
                $scope.manageTabs(false);

                if ($mdSidenav('right').isOpen()) {
                    $mdSidenav('right')
                        .close()
                        .then(function () {
                            $log.debug('right sidepanel closed');
                        });
                } else {
                    $mdSidenav('right')
                        .toggle()
                        .then(function () {
                            $log.debug("toggle right is done");
                        });
                }

            }
            if (routeName == "Sales Forecast && Prediction") {

                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'block';
                $scope.manageTabs(false);
                $scope.showSalesForecastPrediction(ev);

            }
            if (routeName == "Logout") {
                $window.location = "index.html";

            }
            if (routeName == "Theme") {
                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'none';
                $scope.openTheme();

            }
            if (routeName == "Share") {
                //var selectedMenu = document.getElementsByClassName("menu-layer");
                //selectedMenu[0].style.display = 'none';

                $scope.Share();
                $scope.currentView = "Share";

            }
            if (routeName == "Export") {
                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'none';
                $scope.currentView = "Export";

                $scope.Export();

            }
            if (routeName == "Help") {

                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'none';

                $scope.currentView = "Help";

                //user guide
                setTimeout(function () {
                    var intro;
                    intro = introJs();
                    intro.setOptions($scope.IntroOptions);
                    intro.start();
                }, 0);


                // $scope.help();

            }
            if (routeName == "Save") {
                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'none';
                //$scope.savePentaho();
                $scope.saveDashboard(ev);
            }
            if (routeName == "Settings") {
                $state.go('home.Settings');
                $scope.currentView = "Settings";
//                $scope.showSettings(ev);
            }
            if (routeName == "TV Mode") {
                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'none';
                $scope.currentView = "TV Mode";

                if (Fullscreen.isEnabled())
                    Fullscreen.cancel();
                else
                    Fullscreen.all();

            }
            if (routeName == "Clear") {

                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'block';
                // $rootScope.currentView = "Clear";
                $(".menu-layer").css("top", "120px");
                $("starting-point").css("top", "120px");

                $rootScope.dashboardWidgetsCopy = angular.copy($rootScope.dashboard.widgets);
                $rootScope.dashboard.widgets = [];
                $state.go("/home");

            }


        };


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
        setTimeout(function () {
            var featureObj = localStorage.getItem("featureObject");

            getJSONData($http, 'menu', function (data) {

                if (featureObj == "undefined") $scope.menu = data;
                else {
                    var featureArray = JSON.parse(featureObj);
                    var orignArray = [];
                    for (i = 0; i < featureArray.length; i++) {
                        if (featureArray[i].state == true)
                            orignArray.push(featureArray[i]);
                    }
                    $scope.menu = orignArray.concat(data);
                }

            });
        }, 300);
        setTimeout(function () {
            var featureObj = localStorage.getItem("featureObject");

            getJSONData($http, 'menu', function (data) {

                if (featureObj === null) $scope.menu = data;
                else {
                    var featureArray = JSON.parse(featureObj);
                    var orignArray = [];
                    for (i = 0; i < featureArray.length; i++) {
                        if (featureArray[i].state == true)
                            orignArray.push(featureArray[i]);
                    }
                    $scope.menu = orignArray.concat(data);
                }

            });
        }, 800);

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


        //getting branch data for google maps
        $http.get('jsons/branch.json').success(function (data) {
            $scope.JSONDataBranch = data;
            console.log("data json branch");
            console.log($scope.JSONDataBranch);
        });

    }

]);
