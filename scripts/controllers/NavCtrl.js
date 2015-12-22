routerApp.controller('NavCtrl', ['$scope', '$mdBottomSheet', '$mdSidenav', '$mdUtil',
    '$timeout', '$rootScope', '$mdDialog', '$objectstore', '$state', 'Fullscreen', '$http', 'Digin_ReportViewer', '$localStorage', '$window', 'ObjectStoreService', 'Digin_Base_URL', 'DashboardService', '$log', '$mdToast','DevStudio','$auth','$helpers',
  function ($scope, $mdBottomSheet, $mdSidenav, $mdUtil, $timeout, $rootScope, $mdDialog, $objectstore, $state, Fullscreen, $http, Digin_ReportViewer, $localStorage, $window, ObjectStoreService, Digin_Base_URL, DashboardService, $log, $mdToast, DevStudio,$auth,$helpers)
    {

        if(DevStudio){
          $auth.checkSession();
        }else{
            var sessionInfo = $helpers.getCookie('securityToken');
           // if(sessionInfo==null) location.href = 'index.php';
        }

        //initially hiding the tabs
        $( "md-tabs.footer-bar > md-tabs-wrapper" ).children().hide();
        
        $scope.dashCloseWidgets = false ;

        if(localStorage.getItem("featureObject") == undefined){
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

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */

        //shows user profile in a dialog box
        $scope.showUserProfile = function (ev) {
            $mdDialog.show({
                    controller: showProfileController,
                    templateUrl: 'templates/profileDialogTemplate.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {

                }, function () {

                });
        };

        function showProfileController($scope, $mdDialog) {
            $scope.user = {
                fname: "Sajeetharan",
                lname: "",
                email: "sajee@duo.com",
                location: "colombo",
                mobile: "077123123123",
                profile_pic: "styles/css/images/person.jpg"
            };

            $scope.close = function () {
                $mdDialog.cancel();
            };

        };

        $scope.currentPage = 1;
        $scope.pageSize = 5;

        $scope.w = '320px';
        $scope.h = '300px';
        $scope.mh = '250px';

        $scope.resize = function (evt, ui, pos, widget) {
            //alert(JSON.stringify(pos));
            var width = ui.size.width;
            var height = ui.size.height;
            var mHeight = height - 50;
            widget.top = pos.top+'px';
            widget.left = pos.left+'px';

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

        $scope.initialize = function () {
            // alert("initialize");
            var center = new google.maps.LatLng(7.2964, 80.6350);

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 3,
                center: center,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            $scope.accident = [];

            var markers = [];


            for (var i = 0; i < 31; i++) {
                var accident = data.accidents[i];
                var latLng = new google.maps.LatLng(accident.latitude,
                    accident.longitude);
                var title = accident.title;
                // var photo_url = accident.photo_url;
                // var marker = new google.maps.Marker({
                //   position: latLng,
                //   title: title
                // });

                $scope.accident.push(accident);

                // var contentString = photo_url;

                var marker = new google.maps.Marker({
                    title: title,
                    map: map,
                    position: latLng,
                    clickable: true
                });


                var infowindow = new google.maps.InfoWindow({
                    //content: '<img src="'+photo_url+'" style="width:200px; height:100px">'
                    content: "test"
                });

                google.maps.event.addListener(marker, 'click', function (data) {
                    console.log(data);

                    for (var i = 0; i < $scope.accident.length; i++) {

                        console.log(Math.floor(data.latLng.H * 1000000) / 1000000);

                        if ((Math.floor(data.latLng.H * 10000) / 10000 == Math.floor($scope.accident[i].latitude * 10000) / 10000) && (Math.floor(data.latLng.L * 10000) / 10000 == Math.floor($scope.accident[i].longitude * 10000) / 10000)) {

                            console.log($scope.accident[i].title);
                            infowindow.setContent('<img src="' + $scope.accident[i].photoUrl + '" style="width:200px; height:200px">');
                            infowindow.open(map, this);
                        }


                    }


                });

                markers.push(marker);
            }

            var markerCluster = new MarkerClusterer(map, markers);
        }

        $scope.changeMap = function () {

            $mdDialog.hide();

            document.getElementById('map').innerHTML = "";

            var array = JSON.parse($rootScope.json_string);

            $scope.locationData = [];

            var k, j, temparray, chunk = 8;
            for (k = 0, j = array.length; k < j; k += chunk) {
                temparray = array.slice(k, k + chunk);

                for (var i = 0; i < temparray.length; i++) {

                    if (temparray[i].PLACE_OF_ACCIDENT != null) {
                        Geocode(temparray[i].PLACE_OF_ACCIDENT, temparray[i].ID);
                    }
                }

            }

            setTimeout(function () {
                arrangeArray();
                googleMap();
            }, 5000);

        };

        function arrangeArray() {

            var dataStore = $scope.locationData;
            $scope.locationData = [];

            var i = 0;
            for (i = 0; i < dataStore.length; i++) {

                if (dataStore[i].id == undefined) {
                    dataStore.splice(i, 1);
                    i--;
                }
            }

            var ArrangedById = dataStore.slice(0);
            ArrangedById.sort(function (a, b) {
                return a.id - b.id;
            });

            $scope.locationData = ArrangedById;
        }

        function Geocode(address, id) {
            var obj = {};
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({
                'address': address
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    obj = {
                        lat: results[0].geometry.location.G,
                        lng: results[0].geometry.location.K,
                        id: id,
                        address: address
                    };

                    setTimeout(function () {
                        $scope.locationData.push(obj);
                    }, 100);

                }
                if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    setTimeout(function () {
                        Geocode(address);
                    }, 100);
                }
                if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {

                } else {

                    alert('Geocode was not successful for the following reason: ' + status);
                }

            });
        }

        function googleMap() {

            var dataStore = $scope.locationData;

            var array = JSON.parse($rootScope.json_string);

            var map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: 7.85,
                    lng: 80.65
                },
                zoom: 6
            });

            var pinImageGreen = new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
            var pinImageBlue = new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
            var marker = [];

            var k;

            for (k = 0; k < array.length; k++) {

                // if(array[k].state == "High"){

                marker[k] = new google.maps.Marker({
                    position: {
                        lat: dataStore[k].lat,
                        lng: dataStore[k].lng
                    },
                    map: map,
                    title: array[k].PLACE_OF_ACCIDENT,
                    icon: pinImageGreen,
                    VEHICLE_TYPE: array[k].VEHICLE_TYPE,
                    VEHICLE_USAGE: array[k].VEHICLE_USAGE,
                    // modal: array[k].modal,
                    VEHICLE_CLASS: array[k].VEHICLE_CLASS
                });

                marker[k].addListener('click', function (data) {

                    var j;
                    for (j = 0; j < array.length; j++) {

                        if ((dataStore[j].lat == data.latLng.G) && (dataStore[j].lng == data.latLng.K)) {

                            /* document.getElementById("details").innerHTML = 
                             array[j].PLACE_OF_ACCIDENT + "</br>" +
                             array[j].VEHICLE_TYPE + "</br>" +
                             array[j].VEHICLE_USAGE + "</br>" +*/
                            /*array[j].VEHICLE_CLASS+ "</br>" +*/
                            /*array[j].VEHICLE_CLASS + "</br>" ;*/
                        }
                    }
                });
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
                $scope.chartConf.series[0].pointStart = Date.UTC(likeHistory.start.getUTCFullYear(), likeHistory.start.getUTCMonth(), likeHistory.start.getUTCDate());;
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
                $scope.chartConf.series[0].pointStart = Date.UTC(viewHistory.start.getUTCFullYear(), viewHistory.start.getUTCMonth(), viewHistory.start.getUTCDate());;
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

            $state.go('ReportViewer', {
                param: report
            });
        }
        $scope.goDashboard = function (dashboard) {
            console.log("hit dashboard");
            console.log(dashboard);
        if (typeof dashboard.customDuoDash === "undefined"){
            $state.go('DashboardViewer', {
                            param: dashboard.name
                        });
            $scope.manageTabs(false);
        }else{
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
                }else{
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
                    $state.go('CustomDashboardViewer',{
                        param: dashboard.name
                    });
                    $scope.dashboard.widgets = dashboard.data;
                    $rootScope.clickedDash = dashboard.data;
                    $(".dashboard-widgets-close").addClass("active");
                }
            }

            $scope.tabs = $rootScope.Dashboards;
            $rootScope.dashboard = $rootScope.Dashboards[0];
            if($rootScope.dashboard.widgets.length==0)
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
            //closing the overlay
            // start pulathisi 7/23/2015
            // when saved dashboard is clicked change sidebar icon class, this changes icon colors
            //$(".sidebaricons-active").removeClass("sidebaricons-active").addClass("sidebaricons");
            // end pulathisi 7/23/2015
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

            $state.go('AnalyzerViewer', {
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
        $scope.reports = [];
        $scope.favoriteReports = [];
        $scope.analyzers = [];
        $scope.favoriteDashboards = [];
        $scope.dashboards = [];
        $scope.favoriteAnalyzers = [];


        $scope.GetDashboardDetails = function () {


            $scope.dashboards = DashboardService.getDashboards();



            $http({
                method: 'GET',
                url: 'http://localhost:8080/pentaho/api/repo/files/%3Ahome%3A' + $rootScope.username + '%3ADashboards/children?showHidden=false&filter=*|FILES&_=1433330360180',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
                    'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
                }
            }).
            success(function (data, status) {

                for (var i = 0; i < data.repositoryFileDto.length; i++) {
                    var obj1 = {};

                    obj1.name = data.repositoryFileDto[i].name;
                    if (obj1.name.length > 20) {
                        obj1.splitName = obj1.name.substring(0, 21) + '...';
                    } else obj1.splitName = obj1.name;
                    obj1.title = data.repositoryFileDto[i].title;
                    $scope.dashboards.push(obj1);
                }

                
                $scope.favoriteDashboards.push($scope.dashboards[0]);
                $scope.favoriteDashboards.push($scope.dashboards[1]);

                console.log($scope.dashboards);

            }).
            error(function (data, status) {
                console.log(data);
            });



        };


        $scope.GetReportDetails = function () {

            $http({
                method: 'GET',
                // url: 'http://localhost:8080/pentaho/api/repo/files/%3Ahome%3A' + $rootScope.username + '%3AReports/children?showHidden=false&filter=*|FILES&_=1433330360180',
                url: 'http://192.168.1.148:8080/pentaho/api/repo/files/%3Ahome%3A' + 'admin' + '%3AReports/children?showHidden=false&filter=*|FILES&_=1433330360180',
                // cache: $templateCache,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
                    'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
                }
            }).
            success(function (data, status) {

                for (var i = 0; i < data.repositoryFileDto.length; i++) {
                    var obj1 = {};
                    obj1.name = data.repositoryFileDto[i].name;
                    if (obj1.name.length > 20) {
                        obj1.splitName = obj1.name.substring(0, 21) + '...';
                    } else obj1.splitName = obj1.name;
                    obj1.title = data.repositoryFileDto[i].title;
                    $scope.reports.push(obj1);

                }

                $scope.favoriteReports.push($scope.reports[2]);

                $scope.favoriteReports.push($scope.reports[3]);


            }).
            error(function (data, status) {


            });
            $scope.GetDashboardDetails();
            $scope.GetAnalyzerDetails();

        };
        $scope.GetAnalyzerDetails = function () {

            $http({
                method: 'GET',
                url: 'http://localhost:8080/pentaho/api/repo/files/%3Ahome%3A' + $rootScope.username + '%3AAnalyzer/children?showHidden=false&filter=*|FILES&_=1433330360180',
                // cache: $templateCache,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
                    'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
                }
            }).
            success(function (data, status) {

                for (var i = 0; i < data.repositoryFileDto.length; i++) {
                    var obj1 = {};
                    obj1.name = data.repositoryFileDto[i].name;
                    if (obj1.name.length > 20) {
                        obj1.splitName = obj1.name.substring(0, 21) + '...';
                    } else obj1.splitName = obj1.name;
                    obj1.title = data.repositoryFileDto[i].title;
                    $scope.analyzers.push(obj1);
                }


                $scope.favoriteAnalyzers.push($scope.analyzers[1]);
                $scope.favoriteAnalyzers.push($scope.analyzers[0]);



            }).
            error(function (data, status) {

            });


        };
        $scope.Share = function (ev) {

            //document.getElementsByClassName("nav-search")[0].style.display = "none";

            //            setTimeout(function () {
            //                canvg();
            //            }, 500);

            //            setTimeout(function () {
            //
            //                html2canvas(document.body, {
            //                    background: '#E0E0E0',
            //                    useCORS: true,
            //                    allowTaint: true,
            //                    proxy: 'https://1.gravatar.com',
            //                    letterRendering: true,
            //                    onrendered: function (canvas) {
            //
            //                        $rootScope.a = canvas;
            //                        setTimeout(function () {
            //
            //                        }, 500);
            //
            //                        setTimeout(function () {
            //                            document.getElementsByClassName("nav-search")[0].style.display = "block";
            //                        }, 500);
            //
            //                        $mdDialog.show({
            //                            controller: 'shareCtrl',
            //                            templateUrl: 'views/dashboard-share.html',
            //                            resolve: {
            //
            //                            }
            //                        });
            //                    },
            //
            //                });
            //
            //            }, 500);
            //            
            $mdDialog.show({
                controller: 'shareCtrl',
                templateUrl: 'views/dashboard-share.html',
                clickOutsideToClose: true,
                resolve: {

                }
            });

        }

        $scope.Export = function (ev) {
            $mdDialog.show({
                controller: 'ExportCtrl',
                templateUrl: 'views/chart_export.html',
                clickOutsideToClose: true,
                resolve: {

                }

            })

        }
        $scope.openTheme = function (ev) {
            $mdDialog.show({
                controller: 'ThemeCtrl',
                templateUrl: 'views/change-theme.html',
                targetEvent: ev,
                clickOutsideToClose: true,
                resolve: {

                }
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
                resolve: {

                }
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
        $scope.showAddSocialAnalysis = function(ev){
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
            showToast(obj.title + " created!");
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
                };
            };
        }

        //initial creation of default dashboard
        function createDashboards() {

            $rootScope.Dashboards = [
                {
                    culture: "English",
                    date: "09/25/2015",
                    title: "Default",
                    type: "System",
                    widgets: [],
                    dashboardId: $scope.createuuid()
            }
        ];

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
        $scope.manageTabs = function(dashboard){
            if(dashboard){
                console.log("manage tabs true");
                $( "md-tabs > md-tabs-wrapper" ).children().show();
                // $( "md-tabs.footer-bar > md-tabs-wrapper" ).css( "background-color","rgba(0, 0, 0, 0.14)" );
                $scope.dashCloseWidgets = false;
            }else{
                console.log("manage tabs false");
                $( "md-tabs > md-tabs-wrapper" ).children().hide();
                // $( "md-tabs.footer-bar > md-tabs-wrapper" ).css( "background-color","#ECECEC" );
                $scope.dashCloseWidgets = false ;
            }
        };

        $scope.navigate = function (routeName, ev) {

            if (routeName == "Dashboards") {

                $scope.showAddNewDashboard(ev);
                $scope.manageTabs(true);
                $scope.currentView = "Dashboard";
                $state.go(routeName)
            }
            if(routeName == "Social Analysis"){
                $scope.manageTabs(false);
                $scope.currentView = "Social Analysis";
                $scope.showAddSocialAnalysis(ev);
            
            }
            
            if (routeName == "Add Widgets") {

                $('.dashboard-widgets-close').css("visibility","visible");
                $('md-tabs-wrapper').css("visibility","visible");

                
                $scope.showAddNewWidgets(ev);
                $scope.currentView = "Dashboard";
                $scope.manageTabs(true);
                $state.go("Dashboards");
                
                //$('md-tabs-wrapper').css("display","block");
            }
            if (routeName == "D3plugins") {
                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'block';
                $rootScope.currentView = "D3plugins";
                $scope.manageTabs(false);
                $state.go(routeName);

                setTimeout(function(){$('#content1').css("height","100%");},3000);

            }
            if (routeName == "Reports") {
                
                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'block';
                $rootScope.currentView = "Reports";
                $scope.manageTabs(false);
                $state.go(routeName);
                
                setTimeout(function(){$('#content1').css("height","100%");},3000);
                
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
                $state.go(routeName);
                

                setTimeout(function(){$('#content1').css("height","100%");},3000);
                
                $rootScope.currentView = "RealTime";

            }
            if (routeName == "Digin P Stack") {

                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'block';
                $(".menu-layer").css("top", "240px");
                $("starting-point").css("top", "240px");
                $scope.manageTabs(false);
                
                $mdDialog.show({
                controller: 'pStackCtrl',
                templateUrl: 'views/pStackMenu.html',
                targetEvent: ev,
                clickOutsideToClose: true,
                resolve: {}
                
                });
                $rootScope.currentView = "Digin P Stack";
                //$state.go(routeName);
                
                setTimeout(function(){$('#content1').css("height","100%");},3000);
                
            }
            if (routeName == "Logout") {

                $window.location = "/Duodigin/index.php";

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
                setTimeout(function(){
                        var intro;
                        intro = introJs();
                        intro.setOptions($scope.IntroOptions);
                        intro.start();
                },0);
                    
                    
                // $scope.help();

            }
            if (routeName == "Save") {
                var selectedMenu = document.getElementsByClassName("menu-layer");
                selectedMenu[0].style.display = 'none';
                //$scope.savePentaho();
                $scope.saveDashboard(ev);
            }
            if (routeName == "Settings") {
                //                $state.go('Settings');
                $scope.currentView = "Settings";
                $scope.showSettings(ev);
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
                $state.go("/");
        
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
        setTimeout(function(){
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
        },300);
        setTimeout(function(){
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
        },800);

        setTimeout(function(){
                     $scope.CompletedEvent = function (scope) {
                console.log("Completed Event called");
            };

            $scope.ExitEvent = function (scope) {
                console.log("Exit Event called");
            };

            $scope.ChangeEvent = function (targetElement, scope) {
                console.log("Change Event called");
                console.log(targetElement);  //The target element
                console.log(this);  //The IntroJS object
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
                        element: document.querySelectorAll('.main-headbar')[0],
                        intro: "<strong> This is the main head bar area. Hover over the blue line to bring it down</strong>",
                        position: 'bottom'
                    }
                    ,
                    {
                        element: document.querySelector('#getReport'),
                        intro: "<strong>This is the side navigation panel</strong>",
                        position: 'right'
                    }
                    ,
                    {
                        element: document.querySelectorAll('#getReport > md-list > md-item:nth-child(2) > a > md-item-content')[0],
                        intro: '<strong>Use this to create new dashboards</strong>',
                        position: 'right'
                    }
                    ,
                    {
                        element: document.querySelectorAll('md-item-content.sidebar-btn.md-ink-ripple')[1],
                        intro: '<strong>Use this to access reports</strong>',
                        position: 'right'
                    }
                    ,
                    {
                        element: document.querySelectorAll('md-item-content.sidebar-btn.md-ink-ripple')[2],
                        intro: '<strong>Realtime tool is a handy tool for data analysis </strong>',
                        position: 'right'
                    }
                    ,
                    {
                        element: document.querySelectorAll('md-list md-item > a > md-item-content')[4],
                        intro: '<strong>This is the Digin P Stack feature</strong>',
                        position: 'right'
                    }
                    ,
                    {
                        element: document.querySelectorAll('md-list > md-item > a > md-item-content')[5],
                        intro: '<strong>D3plugins is a tool to create D3 visualizations</strong>',
                        position: 'right'
                    }
                    ,
                    {
                        element: document.querySelectorAll('md-list > md-item > a > md-item-content')[6],
                        intro: '<strong>Use this to add widgets to your dashbaord</strong>',
                        position: 'right'
                    }
                    ,
                    {
                        element: document.querySelectorAll('md-list > md-item > a > md-item-content')[7],
                        intro: '<strong>Settings feature can be used to create users and to add/remove features</strong>',
                        position: 'right'
                    }
                    ,
                    {
                        element: document.querySelectorAll('md-list > md-item > a > md-item-content')[8],
                        intro: '<strong>Save feature is to save Dashboards</strong>',
                        position: 'right'
                    }
                    ,
                    {
                        element: document.querySelectorAll('md-list > md-item > a > md-item-content')[9],
                        intro: '<strong>Give a nice look to the app with your desired theme</strong>',
                        position: 'right'
                    }
                    ,
                    {
                        element: document.querySelectorAll('md-list > md-item > a > md-item-content')[10],
                        intro: '<strong>Share using most popular social media and email</strong>',
                        position: 'right'
                    }
                    ,
                    {
                        element: document.querySelectorAll('md-list > md-item > a > md-item-content')[11],
                        intro: '<strong>Export your widget in any format</strong>',
                        position: 'right'
                    }
                    ,
                    {
                        element: document.querySelectorAll('md-list > md-item > a > md-item-content')[12],
                        intro: '<strong>Switch between browser view and Full Screen mode</strong>',
                        position: 'right'
                    }
                    ],
                    showStepNumbers: false,
                    exitOnOverlayClick: true,
                    exitOnEsc:true,
                    nextLabel: '<strong>NEXT</strong>',
                    prevLabel: '<strong>PREVIOUS</strong>',
                    skipLabel: 'EXIT',
                    doneLabel: 'DONE'
            };

            $scope.ShouldAutoStart = true;

        },1000);       

    }

]);
