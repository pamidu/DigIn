var routerApp = angular.module('DuoDiginRt', [
    'ngMaterial',
    'uiMicrokernel',
    'diginServiceHandler',
    'ngAnimate',
    'md.chips.select',
    'highcharts-ng',
    'ui.router',
    '720kb.socialshare',
    'ngStorage',
    'configuration',
    'directivelibrary',
    'ngMdIcons',
    'FBAngular',
    'gridster',
    'ui.calendar',
    'mgcrea.ngStrap',
    'ui',
    'ngImgCrop',
    'lk-google-picker',
    'angularUtils.directives.dirPagination',
    'ngSanitize',
    'ngCsv',
    'angular-intro',
    'uiGmapgoogle-maps',
    'googleplus',
    'angular-table',
    'ngToast',
    'vAccordion',
    'ngMessages',
    'ngFileUpload',
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "info.vietnamcode.nampnq.videogular.plugins.youtube",
    "ngTagsInput",
    'pouchdb',
    'jkuri.slimscroll'
]);

routerApp.config(["$mdThemingProvider", "$httpProvider", "$stateProvider", "$urlRouterProvider", "lkGoogleSettingsProvider", function ($mdThemingProvider, $httpProvider, $stateProvider, $urlRouterProvider, lkGoogleSettingsProvider) {

    $httpProvider.defaults.headers.post['Content-Type'] = 'multipart/form-data';
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded";

    $urlRouterProvider.otherwise(function ($injector, $location) {

        var state;
        $rootScope = $injector.get("$rootScope");
        console.log("$location", $location);

        /*
        var firstLogin1 = localStorage.getItem('firstLogin');
        console.log(firstLogin1);
        localStorage.removeItem('firstLogin');
        var firstLogin2 = localStorage.getItem('firstLogin');
        console.log(firstLogin2);
        */
        
        if (localStorage.getItem("initialLogin") == undefined) {

            localStorage.setItem("initialLogin", false);
            state = 'welcome';
        }
        else {
            state = 'welcome';
        }

        return state;
    });

    $stateProvider
        .state("login", {
            url: "/login",
            controller: "LoginCtrl",
            templateUrl: "views/partial-login.html",
            data: {
                requireLogin: false
            }
        })
        .state("signup", {
            url: "/signup",
            controller: "signUpCtrl",
            templateUrl: "views/signup.html",
            data: {
                requireLogin: false
            }
        })
        .state("welcome", {
            url: "/welcome",
            controller: "welcomePageCtrl",
            templateUrl: "views/partial-WelcomePage.html",
            data: {
                requireLogin: true
            }
        })
        .state("home", {
            url: "/home",
            controller: "NavCtrl",
            templateUrl: "views/partial-home.html",
            data: {
                requireLogin: true,
                preLoader: true
            }
        })
        .state("home.Settings", {
            url: "/settings",
            controller: "dashboardSetupCtrl",
            templateUrl: "views/settings/settingRoute.html",
            data: {
                requireLogin: true
            }
        })
        .state("home.account", {
            url: "/settings-account",
            controller: "dashboardSetupCtrl",
            templateUrl: "views/settings/accountSettings.html",
            data: {
                requireLogin: true
            }
        })
        .state("home.group", {
            url: "/settings-group",
            controller: "dashboardSetupCtrl",
            templateUrl: "views/settings/group.html",
            data: {
                requireLogin: true
            }
        })
        .state("home.share", {
            url: "/settings-share",
            controller: "dashboardSetupCtrl",
            templateUrl: "views/settings/shareDashboard.html",
            data: {
                requireLogin: true
            }
        })
        .state("home.user", {
            url: "/settings-user",
            controller: "dashboardSetupCtrl",
            templateUrl: "views/settings/user.html",
            data: {
                requireLogin: true
            }
        })
        .state("home.createUser", {
            url: "/settings-createUser",
            controller: "dashboardSetupCtrl",
            templateUrl: "views/settings/createNewUser.html",
            data: {
                requireLogin: true
            }
        })
        .state("home.userProfile", {
            url: "/settings-userProfile",
            controller: "dashboardSetupCtrl",
            templateUrl: "views/settings/userProfile.html",
            data: {
                requireLogin: true
            }
        })
        .state("home.userSettings", {
            url: "/settings-userSettings",
            controller: "dashboardSetupCtrl",
            templateUrl: "views/settings/userSettngs.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.Dashboards', {
            url: "/Dashboards",
            controller: 'DashboardCtrl',
            templateUrl: "views/charts.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.ReportsDev', {
            url: "/ReportsDev",
            controller: 'ReportsDevCtrl',
            templateUrl: "views/reports/reportsDev.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.Reports', {
            url: "/Reports",
            controller: 'ReportCtrl',
            templateUrl: "views/reports/reports.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.Analytics', {
            url: "/Analytics",
            controller: 'analyticsCtrl',
            templateUrl: "views/analytics.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.RealTime', {
            url: "/RealTime",
            controller: 'RealTimeController',
            templateUrl: "views/realtime.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.Interactive Report', {
            url: "/Interactive Report",
            controller: 'ExtendedReportCtrl',
            templateUrl: "views/extended-reports.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.Analysis Report', {
            url: "/Analysis Report",
            controller: 'ExtendedanalyticsCtrl',
            templateUrl: "views/extended-analytics.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.Dashboard', {
            url: "/Dashboard",
            controller: 'ExtendedDashboardCtrl',
            templateUrl: "views/extended-dashboard.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.PivotTable', {
            url: "/PivotTable",
            controller: 'summarizeCtrl',
            templateUrl: "views/pivottable.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.ReportViewer', {
            url: '/ReportViewer:param',
            controller: 'ReportViewerControl',
            templateUrl: "views/Report_viewer.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.DashboardViewer', {
            url: '/DashboardViewer:param',
            controller: 'DashboardViewerControl',
            templateUrl: "views/Dashboard_viewer.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.CustomDashboardViewer', {
            url: "/CustomDashboard:param",
            controller: 'DashboardCtrl',
            templateUrl: "views/charts.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.AnalyzerViewer', {
            url: '/AnalyzerViewer:param',
            controller: 'AnalyzerViewerControl',
            templateUrl: "views/Analyzer_viewer.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.social-graph-fb', {
            url: '/social-graph-fb',
            controller: 'socialGraphCtrl',
            templateUrl: "views/socialGraph/socialGraph_Temp.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.Social Media Analytics', {
            url: "/social-media-analytics",
            controller: 'SocialAnalysisCtrl',
            //templateUrl: "views/extended-analytics.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.SocialGraphFb', {
            url: '/social-graph-fb',
            controller: 'socialGraphFBCtrl',
            templateUrl: "views/socialGraph/socialGraph_Temp.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.SocialGraphTwitter', {
            url: '/social-graph-twitter',
            controller: 'socialGraphTwitterCtrl',
            templateUrl: "views/socialGraph/socialGraphTwitter_Temp.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.Sales Forecast', {
            url: '/sales-forecast',
            controller: 'salesForecastCtrl',
            templateUrl: "views/salesForecast/sales_forecast_Temp.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.Prediction', {
            url: '/prediction',
            controller: 'predictionCtrl',
            templateUrl: "views/prediction/prediction.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.QueryBuilder', {
            url: '/query-builder',
            controller: 'queryBuilderCtrl',
            templateUrl: "views/query/query-builder.html",
            params: {widObj: null},
            data: {
                requireLogin: true
            }
        })
        .state('home.DynamicallyReportBuilder', {
            url: '/dynamically-report-builder?reportNme',
            templateUrl: "views/dynamicallyReportBuilder/dynamically-report.html",
            data: {
                requireLogin: true
            }
        })
        .state('home.commonSrcAlgorithm', {
            url: '/common-src-algorithm',
            controller: 'sourceAlgorithmCtrl',
            templateUrl: "views/sourceAlgorithm/common-src-algorithm.html"
        })
        .state('videos', {
            url: '/help-videos',
            templateUrl: "views/help/videos/help-videos.html"
        })
        .state('home.dataSource', {
            url: '/data-source',
            templateUrl: "views/common-data-src/viewDataSource.html",
            data: {
                requireLogin: true
            }
        }).state('home.welcomeSearch', {
        url: '/welcome-search',
        templateUrl: "views/help/welcomeSearchBar.html",
        data: {
            requireLogin: true
        }
    }).state('home.profileSetting', {
        url: '/user-profile?user',
		controller: 'userProfileCtrl',
        templateUrl: "views/profile-settings/user-profile-view.html",
        data: {
            requireLogin: true
        }
    });

    lkGoogleSettingsProvider.configure({
        apiKey: 'AIzaSyA9fv9lYQdt1XV6wooFtItxYlMF8Y9t1ao',
        clientId: '468951747947-jb7obcgd91m7379q4nn7vroid8g37ds0.apps.googleusercontent.com',
        scope: ['https://www.googleapis.com/auth/drive']
    });

    var customPrimary = {
        '50': '#10cefd', '100': '#02c2f2', '200': '#02aed9', '300': '#019ac0',
        '400': '#0185a6', '500': '#01718D', '600': '#015d74', '700': '#01485a',
        '800': '#003441', '900': '#002028', 'A100': '#29d3fd', 'A200': '#43d8fe',
        'A400': '#5cdefe', 'A700': '#000c0e'
    };

    $mdThemingProvider
        .definePalette('customPrimary',
            customPrimary);

    var customAccent = {
        '50': '#4285F4', '100': '#4285F4', '200': '#4285F4', '300': '#4285F4',
        '400': '#4285F4', '500': '#4285F4', '600': '#4285F4', '700': '#4285F4',
        '800': '#4285F4', '900': '#4285F4', 'A100': '#4285F4', 'A200': '#4285F4',
        'A400': '#4285F4', 'A700': '#4285F4'
    };

    $mdThemingProvider
        .definePalette('customAccent',
            customAccent);

    var customBackground = {
        '50': '#ffffff', '100': '#ffffff', '200': '#ffffff', '300': '#ffffff',
        '400': '#ffffff', '500': '#FFF', '600': '#f2f2f2', '700': '#e6e6e6',
        '800': '#d9d9d9', '900': '#cccccc', 'A100': '#ffffff', 'A200': '#ffffff',
        'A400': '#ffffff', 'A700': '#bfbfbf'
    };

    $mdThemingProvider
        .definePalette('customBackground',
            customBackground);

    $mdThemingProvider.theme('default')
        .primaryPalette('customPrimary')
        .accentPalette('customAccent')
        .warnPalette('red')
        .backgroundPalette('customBackground')

    $mdThemingProvider.alwaysWatchTheme(true);
}]);

routerApp.run(function ($rootScope, $auth, $state, $csContainer, $window) {

    var requireLogin;
    var secToken;
    var cookToken;
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        requireLogin = toState.data.requireLogin;
        secToken = $auth.getSecurityToken();
        cookToken = getCookie("securityToken");

        if (toState.data.preLoader) {
            setTimeout(function () {
                $('#pagePreLoader').hide();
                $('#preLoader').hide();
                $('.nav-menu').css("visibility", "visible");
                $('.main-headbar').css("visibility", "visible");
                $('#content1').css("visibility", "visible");
            }, 3000);
        }

        if (requireLogin && secToken === "N/A" && typeof(cookToken) === "undefined") {
            event.preventDefault();
            $state.go('login');
        } else {

            var stateName = toState.name;
            //check for custom state validations
            switch (stateName) {
                case 'home.QueryBuilder':
                    var srcObj = $csContainer.fetchSrcObj();
                    if (typeof srcObj.tbl == "undefined") {
                        event.preventDefault();
                        $state.go('home');
                    }
                    break;
            }
        }
    });

    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function () {
        $rootScope.online = false;
        console.log($rootScope.online);            
  }, false);
    $window.addEventListener("online", function () {
        $rootScope.online = true;
        console.log($rootScope.online);      
    }, false);    

});


routerApp.controller('ReportViewerControl', ['$scope', '$rootScope', '$stateParams', 'Digin_ReportViewer', '$sce',
    function ($scope, $rootScope, $stateParams, Digin_ReportViewer, $sce) {

        //here i need to append the report url ,

        $scope.reportURL = Digin_ReportViewer + "3A" + $rootScope.username + "%3AReports%3A" + $stateParams.param + "/viewer?";

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }
    }
]);
routerApp.controller('DashboardViewerControl', ['$scope', '$rootScope', '$stateParams', 'Digin_DashboardViewer', '$sce',
    function ($scope, $rootScope, $stateParams, Digin_DashboardViewer, $sce) {

        //here i need to append the report url ,

        $scope.reportURL = Digin_DashboardViewer + "3A" + $rootScope.username + "%3ADashboards%3A" + $stateParams.param + "/viewer?";

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }
    }
]);
routerApp.controller('AnalyzerViewerControl', ['$scope', '$rootScope', '$stateParams', 'Digin_AnalyzerViewer', '$sce', '$localStorage',
    function ($scope, $rootScope, $stateParams, Digin_AnalyzerViewer, $sce, $localStorage) {


        $scope.reportURL = Digin_AnalyzerViewer + "3A" + $rootScope.username + "%3AAnalyzer%3A" + $stateParams.param + "/editor?";

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }
    }
]);

routerApp.controller('savePentahoCtrl', ['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope',

    function ($scope, $http, $objectstore, $mdDialog, $rootScope) {

        $scope.closeDialog = function () {
            // Easily hides most recent dialog shown...
            // no specific instance reference is needed.
            $mdDialog.hide();
        };
        $scope.dashboardName = "";
        $scope.dashboardType = $rootScope.dashboard.dashboardType;
        $scope.dashboardCulture = $rootScope.dashboard.dashboardCulture;
        $scope.dashboardDate = $rootScope.dashboard.dashboardDate;

        $scope.saveDashboardDetails = function () {
            $rootScope.dashboard.dashboardName = $scope.dashboardName;

            var client = $objectstore.getClient("com.duosoftware.com", "duodigin_dashboard");
            client.onComplete(function (data) {
                $mdDialog.hide();
                $mdDialog.show({
                    controller: 'successCtrl',
                    templateUrl: 'views/dialog_success.html',
                    resolve: {}
                })
            });
            client.onError(function (data) {
                $mdDialog.hide();
                $mdDialog.show({
                    controller: 'errorCtrl',
                    templateUrl: 'views/dialog_error.html',
                    resolve: {}
                })
            });


            client.insert([$rootScope.dashboard], {
                KeyProperty: "dashboardName"
            });
        }
    }
]);

routerApp.controller('calenderWidgetController', ['$scope', function ($scope) {
    (function () {
        $scope.days = [];
        $scope.month = 01;
        createCal();

        function createCal() {
            $scope.days = [];
            for (m = 1; m < 13; m++) {
                var firstDay = new Date(m + '.01.2015').getDay();
                //console.log(firstDay);
                if (firstDay == 0) {
                    firstDay = 7;
                }
                ;
                for (i = 0; i < 40; i++) {

                    if (i + 1 < firstDay) {
                        var obj = {
                            class: 'day invalid',
                            date: '',
                            month: m
                        };
                        $scope.days.push(obj);
                    } else {
                        if (new Date(m + '.' + parseInt(i + 2 - firstDay) + '.2015') == 'Invalid Date') {
                            // console.log('invlid date found');
                        } else {
                            if (m == 2 && parseInt(i + 2 - firstDay) > 28) {
                                //console.log('feb escape');
                            } else {
                                //console.log(m, parseInt(i + 2 - firstDay), new Date(m + '.' + parseInt(i + 2 - firstDay) + '.2015'));
                                var obj = {
                                    class: 'day',
                                    date: parseInt(i + 2 - firstDay),
                                    month: m,
                                    task: '',
                                };
                                $scope.days.push(obj);
                            }
                        }
                    }
                }
                //console.log($scope.days);
            }
        }

        $scope.previousMonth = function () {
            if ($scope.month == 1) {
                $scope.month = 12;
            } else {
                $scope.month = $scope.month - 1;

            }
            ;
            //createCal();
        };
        $scope.nextMonth = function () {
            if ($scope.month == 12) {
                $scope.month = 1;

            } else {
                $scope.month = $scope.month + 1;
            }
            ;
            //createCal();
        };

        $scope.monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }.call(this));

}])

routerApp.controller('weatherWidgetController', ['$scope', '$http', '$mdDialog', function ($scope, $http, $mdDialog) {
    $scope.loadWeather = function (data) {
        $scope.weatherComponentCity = data;
        //complete config
        //            function () {
        $http.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + data + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
            .success(function (data) {
                console.log(data);

                if (data.query.results.channel.item.condition == undefined) {
                    $scope.weatherComponentError = true;
                    $scope.weatherComponentCity = "Oops.. Weather details regarding this location is not available";
                    $scope.weatherComponentWeather = [];
                } else {
                    $scope.weatherComponentError = false;
                    $scope.weatherComponentWeather = data.query.results.channel.item.condition;
                    if ($scope.weatherComponentWeather.text == 'Sunny') {
                        $scope.weatherComponentIcon = 'sun';
                        $scope.weatherComponentBg = "styles/css/images/weatherComponentBg.jpg";
                    } else if ($scope.weatherComponentWeather.text == 'Mostly Cloudy' || $scope.weatherComponentWeather.text == 'Cloudy') {
                        $scope.weatherComponentIcon = 'cloud';
                        $scope.weatherComponentBg = "styles/css/images/weatherComponentBg2.jpg";
                    } else if ($scope.weatherComponentWeather.text == 'Partly Cloudy') {
                        $scope.weatherComponentIcon = 'partialyCloud';
                        $scope.weatherComponentBg = "styles/css/images/weatherComponentBg.jpg";
                    } else if ($scope.weatherComponentWeather.text == 'Heavy Rain' || $scope.weatherComponentWeather.text == 'Light Shower' || $scope.weatherComponentWeather.text == 'Drizzling' || $scope.weatherComponentWeather.text == 'Rain Shower') {
                        $scope.weatherComponentIcon = 'rainy';
                        $scope.weatherComponentBg = "styles/css/images/weatherComponentBg2.jpg";
                    } else if ($scope.weatherComponentWeather.text == 'Light Rain') {
                        $scope.weatherComponentIcon = 'rainy';
                        $scope.weatherComponentBg = "styles/css/images/weatherComponentBg2.jpg";
                    } else {
                        $scope.weatherComponentIcon = 'sun';
                        $scope.weatherComponentBg = "styles/css/images/weatherComponentBg.jpg";
                    }
                    ;
                }

            })
            .error(function (err) {
                console.log('Error retrieving markets');
            });
        //            };
        //$scope.finish();

    };
    $scope.locZip = "colombo";
    $scope.weatherComponentError = false;
    $scope.loadWeather($scope.locZip);

    $scope.weatherComponentSelectCity = function (ev) {
        $mdDialog.show({
                controller: weatherComponentCitySelectorController,
                templateUrl: 'templates/weatherComponentCitySelector.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function (answer) {
                $scope.loadWeather(answer);
            }, function () {

            });
    };

    function weatherComponentCitySelectorController($scope, $mdDialog) {
        $scope.cities = ['colombo', 'galle', 'kandy'];
        $scope.weatherComponentCitySelectorChange = function (city) {
            $mdDialog.hide(city);
        };
        $scope.closeWidgetOptions = function () {
            $mdDialog.cancel();
        };
    };


}])

routerApp.controller('userprofileWidgetController', ['$scope','ProfileService', function ($scope,ProfileService) {

   $scope.userDetails = ProfileService.UserDataArr;

    (function () {
        var menu_trigger = $("[data-card-menu]");
        var back_trigger = $("[data-card-back]");

        menu_trigger.click(function () {
            $(".card, body").toggleClass("show-menu");
        });

        back_trigger.click(function () {
            $(".card, body").toggleClass("show-menu");
        });
    })();
}])

routerApp.service('VideosService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

    var service = this;

    var youtube = {
        ready: false,
        player: null,
        playerId: null,
        videoId: null,
        videoTitle: null,
        playerHeight: '480',
        playerWidth: '640',
        state: ''
    };
    var results = [];
    var upcoming = [{
        id: 'kRJuY6ZDLPo',
        title: 'La Roux - In for the Kill (Twelves Remix)'
    }, {
        id: '45YSGFctLws',
        title: 'Shout Out Louds - Illusions'
    }, {
        id: 'ktoaj1IpTbw',
        title: 'CHVRCHES - Gun'
    }, {
        id: '8Zh0tY2NfLs',
        title: 'N.E.R.D. ft. Nelly Furtado - Hot N\' Fun (Boys Noize Remix) HQ'
    }, {
        id: 'zwJPcRtbzDk',
        title: 'Daft Punk - Human After All (SebastiAn Remix)'
    }, {
        id: 'sEwM6ERq0gc',
        title: 'HAIM - Forever (Official Music Video)'
    }, {
        id: 'fTK4XTvZWmk',
        title: 'Housse De Racket â˜â˜€â˜ Apocalypso'
    }];
    var history = [{
        id: 'XKa7Ywiv734',
        title: '[OFFICIAL HD] Daft Punk - Give Life Back To Music (feat. Nile Rodgers)'
    }];

    $window.onYouTubeIframeAPIReady = function () {
        $log.info('Youtube API is ready');
        youtube.ready = true;
        service.bindPlayer('placeholder');
        service.loadPlayer();
        $rootScope.$apply();
    };

    function onYoutubeReady(event) {
        $log.info('YouTube Player is ready');
        youtube.player.cueVideoById(history[0].id);
        youtube.videoId = history[0].id;
        youtube.videoTitle = history[0].title;
    }

    function onYoutubeStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
            youtube.state = 'playing';
        } else if (event.data == YT.PlayerState.PAUSED) {
            youtube.state = 'paused';
        } else if (event.data == YT.PlayerState.ENDED) {
            youtube.state = 'ended';
            service.launchPlayer(upcoming[0].id, upcoming[0].title);
            service.archiveVideo(upcoming[0].id, upcoming[0].title);
            service.deleteVideo(upcoming, upcoming[0].id);
        }
        $rootScope.$apply();
    }

    this.bindPlayer = function (elementId) {
        $log.info('Binding to ' + elementId);
        youtube.playerId = elementId;
    };

    this.createPlayer = function () {
        $log.info('Creating a new Youtube player for DOM id ' + youtube.playerId + ' and video ' + youtube.videoId);
        return new YT.Player(youtube.playerId, {
            height: youtube.playerHeight,
            width: youtube.playerWidth,
            playerVars: {
                rel: 0,
                showinfo: 0
            },
            events: {
                'onReady': onYoutubeReady,
                'onStateChange': onYoutubeStateChange
            }
        });
    };

    this.loadPlayer = function () {
        if (youtube.ready && youtube.playerId) {
            if (youtube.player) {
                youtube.player.destroy();
            }
            youtube.player = service.createPlayer();
        }
    };

    this.launchPlayer = function (id, title) {
        youtube.player.loadVideoById(id);
        youtube.videoId = id;
        youtube.videoTitle = title;
        return youtube;
    }

    this.listResults = function (data) {
        results.length = 0;
        for (var i = data.items.length - 1; i >= 0; i--) {
            results.push({
                id: data.items[i].id.videoId,
                title: data.items[i].snippet.title,
                description: data.items[i].snippet.description,
                datetimee: data.items[i].snippet.publishedAt,
                lbc: data.items[i].snippet.liveBroadcastContent,
                ciid: data.items[i].snippet.channelId,
                kidd: data.items[i].id.kind,
                thumbnail: data.items[i].snippet.thumbnails.default.url,
                author: data.items[i].snippet.channelTitle

            });
        }
        return results;
    }

    this.queueVideo = function (id, title) {
        upcoming.push({
            id: id,
            title: title
        });
        return upcoming;
    };

    this.archiveVideo = function (id, title) {
        history.unshift({
            id: id,
            title: title
        });
        return history;
    };

    this.deleteVideo = function (list, id) {
        for (var i = list.length - 1; i >= 0; i--) {
            if (list[i].id === id) {
                list.splice(i, 1);
                break;
            }
        }
    };

    this.getYoutube = function () {
        return youtube;
    };

    this.getResults = function () {
        return results;
    };

    this.getUpcoming = function () {
        return upcoming;
    };

    this.getHistory = function () {
        return history;
    };
}]);

routerApp.service('googleService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

    // var clientId = '33022835624-q3km776rl7dkitpinaj7pf2tlu75tfhg.apps.googleusercontent.com',
    //     apiKey = 'AIzaSyBs5gFF_1gQKf0LTMSf-YOxHJK4nF9FkTQ',
    //     scopes = 'profile email https://www.googleapis.com/auth/plus.login',
    //     domain = '',
    //     deferred = $q.defer();

    // var clientId = '352719853010-1e2k3je9peuv42na7a2imsv21g89ca1o.apps.googleusercontent.com',
      //  apiKey = 'AIzaSyBl3Tz2fIwKQNlf5w1RMH9w6VMgWUsok9Q',
     var clientId = '1086483422092-87lkk72aa79svoais4g73f0qdcppv6d4.apps.googleusercontent.com',
        apiKey = 'AIzaSyCOXBOMZF_PpEAvQfxiv7O8rA5VumFt2I8',
        scopes = 'profile email https://www.googleapis.com/auth/plus.login',
        domain = '',
        deferred = $q.defer();

    this.signin = function () {
        gapi.auth.authorize({
            client_id: clientId,
            scope: scopes,
            immediate: false,
            cookie_policy: 'single_host_origin',
            hd: domain
        }, this.handleAuthResult);

        return deferred.promise;
    };
    this.signout = function () {
        gapi.auth.signOut();
        console.log("logged out");

        return deferred.promise;
    };
    this.handleClientLoad = function () {
        gapi.client.setApiKey(apiKey);
        gapi.auth.init(function () {
        });
        window.setTimeout(checkAuth, 1);
    };
    this.checkAuth = function () {
        gapi.auth.authorize({
            client_id: clientId,
            scope: scopes,
            immediate: true,
            hd: domain
        }, this.handleAuthResult);
    };
    this.handleAuthResult = function (authResult) {
        if (authResult && !authResult.error) {
            var data = {};
            gapi.client.load('oauth2', 'v2', function () {
                var request = gapi.client.oauth2.userinfo.get();
                request.execute(function (resp) {
                    data.email = resp.email;
                });
            });
            deferred.resolve(data);
        } else {
            deferred.reject('error');
        }
    };
    this.handleAuthClick = function (event) {
        gapi.auth.authorize({
            client_id: clientId,
            scope: scopes,
            immediate: false,
            hd: domain
        }, this.handleAuthResult);
        return false;
    };
    this.getProfileData = function (widgetID) {

        gapi.client.load('plus', 'v1', function () {
            var request = gapi.client.plus.people.get({
                'userId': 'me'
            });
            request.execute(function (resp) {

                var ObjectIndex = getRootObjectById(widgetID, $rootScope.dashboard.pages[$rootScope.selectedPage - 1].widgets);
                $rootScope.dashboard.pages[$rootScope.selectedPage - 1].widgets[ObjectIndex].widgetData.widData.profileData = resp;


                //$rootScope.profileData = resp;
            });
        });
        return deferred.promise;
    };
    this.getPeopleData = function (widgetID) {

        gapi.client.load('plus', 'v1', function () {
            var request = gapi.client.plus.people.list({
                'userId': 'me',
                'collection': 'visible'
            });
            request.execute(function (resp) {

                var ObjectIndex = getRootObjectById(widgetID, $rootScope.dashboard.pages[$rootScope.selectedPage - 1].widgets);
                $rootScope.dashboard.pages[$rootScope.selectedPage - 1].widgets[ObjectIndex].widgetData.widData.peopleData = resp;


                //$rootScope.peopleData = resp;
            });
        });
        return deferred.promise;
    };
    this.getActivityData = function (widgetID) {
        gapi.client.load('plus', 'v1', function () {
            var request = gapi.client.plus.activities.list({
                'userId': 'me',
                'collection': 'public'
            });

            request.execute(function (resp) {

                var ObjectIndex = getRootObjectById(widgetID, $rootScope.dashboard.pages[$rootScope.selectedPage - 1].widgets);
                $rootScope.dashboard.pages[$rootScope.selectedPage - 1].widgets[ObjectIndex].widgetData.widData.activityData = resp;


                //$rootScope.activityData = resp;
            });
        });

        return deferred.promise;
    };
}]);

routerApp.service('generatePDF1', function ($timeout) {
    this.generate = function (htmlElement, config, tableDataString) {

        var doc = new jsPDF('landscape');
        var htmlObject = document.createElement('div');
        htmlObject.innerHTML = tableDataString;

        doc.text(config.titleLeft, config.titleTop, config.title);
        doc.fromHTML(htmlObject, config.tableLeft, config.tableTop, {});
        var pdfName = config.title.toString() + '.pdf';
        doc.save(pdfName);
    };
});

routerApp.service('generatePDF2', function ($timeout) {
    this.generate = function (Element, config) {

        var doc = new jsPDF('landscape');
        var options = {format: 'PNG'};

        doc.addHTML(htmlElement, config.tableLeft, config.tableTop, options, function () {
            var pdfName = config.title.toString() + '.pdf';
            doc.text(config.titleLeft, config.titleTop, config.title);
            doc.save(pdfName);
        });
    };

});

//General PDF of dshboard snapshop inorder to share dashboard
routerApp.service('generatePDF3', function ($timeout, $pdfString) {
    this.generate = function (htmlElement, config) {

        var doc = new jsPDF('landscape');
        var options = {format: 'PNG'};

        doc.addHTML(htmlElement, config.tableLeft, config.tableTop, options, function () {
            var pdfName = config.title.toString() + '.pdf';
            doc.text(config.titleLeft, config.titleTop, config.title);
            var output = doc.output('datauristring')
            $pdfString.savePdf(output);
        });
    };
});

routerApp.factory("$pdfString", function () {
    var base64Pdf;
    return {
        savePdf: function (url) {
            if (url)  base64Pdf = url;
        },
        returnPdf: function () {
            return base64Pdf;
        }
    }
})

//use this to share scopes between two controllers
//first store after that get
routerApp.factory('ScopeShare', function ($rootScope) {
    var mem = {};

    return {
        store: function (key, value) {
            mem[key] = value;
        },
        get: function (key) {
            return mem[key];
        }
    };
});

routerApp.directive('myUpload', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var reader = new FileReader();
            reader.onload = function (e) {
                scope.image = e.target.result;
                scope.$apply();
            }

            elem.on('change', function () {
                reader.readAsDataURL(elem[0].files[0]);
            });
        }
    };
}]);

routerApp.directive('fileReader', function () {
    return {
        scope: {
            fileReader: "="
        },
        link: function (scope, element) {
            $(element).on('change', function (changeEvent) {
                var files = changeEvent.target.files;
                if (files.length) {
                    var r = new FileReader();
                    r.onload = function (e) {
                        var contents = e.target.result;
                        scope.$apply(function () {
                            scope.fileReader = contents;
                        });
                    };

                    r.readAsText(files[0]);
                }
            });
        }
    };
});

routerApp.directive('barsChart', function ($parse) {
    //explicitly creating a directive definition variable
    //this may look verbose but is good for clarification purposes
    //in real life you'd want to simply return the object {...}
    var directiveDefinitionObject = {
        //We restrict its use to an element
        //as usually  <bars-chart> is semantically
        //more understandable
        restrict: 'E',
        //this is important,
        //we don't want to overwrite our directive declaration
        //in the HTML mark-up
        replace: false,
        //our data source would be an array
        //passed thru chart-data attribute
        scope: {
            data: '=chartData'
        },
        link: function (scope, element, attrs) {
            //in D3, any selection[0] contains the group
            //selection[0][0] is the DOM node
            //but we won't need that this time
            var chart = d3.select(element[0]);
            //to our original directive markup bars-chart
            //we add a div with out chart stling and bind each
            //data entry to the chart
            chart.append("div").attr("class", "chart")
                .selectAll('div')
                .data(scope.data).enter().append("div")
                .transition().ease("elastic")
                .style("width", function (d) {
                    return d + "%";
                })
                .text(function (d) {
                    return d + "%";
                });
            //a little of magic: setting it's width based
            //on the data value (d)
            //and text all with a smooth transition
        }
    };
    return directiveDefinitionObject;
});

routerApp.filter('fromTo', function () {
    return function (input, from, total, lessThan) {
        from = parseInt(from);
        total = parseInt(total);
        for (var i = from; i < from + total && i < lessThan; i++) {
            input.push(i);
        }
        return input;
    }
});

routerApp.filter('getExtension', function () {
    return function (url) {
        return url.split('.').pop();
    };
});

routerApp.filter('htmlToPlaintext', function () {
    return function (text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
});

routerApp.directive('clockComponent', function () {
    return {
        restrict: 'E',
        controller: 'clockInit',
        templateUrl: 'templates/clockComponent.html'
    };
});

routerApp.directive('weatherComponent', function () {
    return {
        restrict: 'E',
        controller: 'weatherWidgetController',
        template: ' <div class="weather-wrapper" layout="row" style="height:100%;width:100%;overflow:hidden;">\
    <div  class="weather widget-card " style="    background-image: url({{weatherComponentBg}});background-size: cover;">\
 <md-button style="min-width: 10px;" ng-click="weatherComponentSelectCity($event);"><img src="http://imgh.us/dots_1.svg" width="5" height="23" draggable="false"/></md-button>\
   <div ng-if="!weatherComponentError" class="weather-icon {{weatherComponentIcon}}"></div>\
        <h1 ng-if="!weatherComponentError" class="weather-card-title">{{weatherComponentWeather.temp}} F</h1>\
        <p  class="weather-card-title2">{{weatherComponentCity}} <br><span style="font-size: medium;"> {{weatherComponentWeather.text}}<span></p>\
    </div>\
</div>'
    };
});

routerApp.directive('userprofileComponent', function () {
    return {
        restrict: 'E',
        controller: 'userprofileWidgetController',
        template: '<div class=" widget-card "><!-- Face 2 -->\
  <!-- Face 1 -->\
  <div class="card-face face-1" style="overflow-y: scroll"><!-- Menu trigger -->\
<div style="background-image:url(styles/css/images/+++++ofileComponentBg.jpg);background-size:cover;width: 100%;height: 45%;position: absolute;"></div>\
    <!--button data-card-menu="data-card-menu" class="card-face__menu-button"><img src="http://imgh.us/dots_1.svg" width="5" height="23" draggable="false"/></button--><!-- Avatar -->\
    <div class="card-face__avatar"><!-- Bullet notification --><!--span class="card-face__bullet">2</span--><!-- User avatar --><img ng-src="{{userDetails.BannerPicture}}" width="110" height="110" draggable="false"/></div><!-- Name -->\
    <h2 class="card-face__name"> {{userDetails.Name}} </h2><!-- Title --><span class="card-face__title">{{userDetails.Email}} </span><span class="card-face__title">{{userDetails.PhoneNumber}} </span><span class="card-face__title">{{userDetails.Company}} </span><!-- Cart Footer -->\
    <!--div class="card-face-footer"><a href="#" target="_blank" class="card-face__social"><img src="http://imgh.us/dribbble.svg" width="36" height="36" draggable="false"/></a><a href="#"_blank" class="card-face__social"><img src="http://imgh.us/beh.svg" width="36" height="36" draggable="false"/></a><a href="#" target="_blank" class="card-face__social"><img src="http://imgh.us/plus_5.svg" width="36" height="36" draggable="false"/></a></div-->\
  </div>\
</div>'
    };
});


// update damith
//app config details
routerApp.constant('config', {
    appName: 'digin',
    appVersion: 1.0,
    apiUrl: 'http://104.131.48.155:8080/',
    apiFbUrl: 'http://192.168.0.47:8080/',
    Big_Qry_Get_Tbls: 'http://104.131.48.155:8080/GetTables?dataSetID=Demo',
    Big_Qry_Get_Fields: 'http://104.131.48.155:8080/GetFields?dataSetName =Demo&&tableName=',
    apiUrl2: '',
    storeIndex: 'com.duosoftware.com'
});

/* start excel file upload */
routerApp.directive('fileInput', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            element.bind('change', function () {
                $parse(attrs.fileInput).assign();
                scope.$apply(scope.element[0].files);
            });
        }
    };
}]);

routerApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
        // var fd = new FormData();
        // fd.append('file', file);
        console.log("fie to json", angular.toJson(file));

        $http.post(uploadUrl, angular.toJson(file), {
                headers: {'Content-Type': undefined},
            })
            .success(function () {
                alert("success");
            })
            .error(function () {
                alert("failure");
            });
    }
}]);


/*
document.getElementById("myBtn").addEventListener("click", function(){
    alert("Hello World!");
});



window.addEventListener("beforeunload", function (e) {
    var url ="http://" + window.location.hostname+"/unload.php";
    var win = window.open(url, '_blank');
    win.focus();
    
    /*
    if( get_cookie(securityToken) ) {
        document.cookie = 'securityToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    if( get_cookie(authData) ) {
        document.cookie = 'authData=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

});
*/  

