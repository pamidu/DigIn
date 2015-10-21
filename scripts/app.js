$(window).load(function () {
    $('#pagePreLoader').hide();
    $('.nav-menu').show();
 
    $('.main-headbar').css("visibility","visible");
    $('#footerBar').css("visibility","visible");    

});

var routerApp = angular.module('DuoDiginRt', ['ngMaterial',
    'uiMicrokernel',
    'ngAnimate',
    'DiginD3.filters',
    'DiginD3.services',
    'DiginD3.directives',
    'DiginD3.controllers',
    "highcharts-ng",
    'angular.css.injector',
    'ui.router',
    '720kb.socialshare',
    'FBAngular',
    'ngStorage',
    'configuration',
    'directivelibrary',
    'ngMdIcons',
    'nvd3',
    'gridster',
    'mgcrea.ngStrap',
     'ui',
    'lk-google-picker',
    'servicess',
    'angularUtils.directives.dirPagination',
    'ngSanitize',
    'ngCsv'
])

routerApp.config(["$mdThemingProvider", "$locationProvider", "$httpProvider", "$stateProvider", "lkGoogleSettingsProvider", function ($mdThemingProvider, $locationProvider, $httpProvider, $stateProvider, lkGoogleSettingsProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'multipart/form-data';
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded";
    $stateProvider        
        .state('Dashboards', {
            url: "/Dashboards",
            controller: 'DashboardCtrl',
            templateUrl: "views/charts.html"
        })
        .state('Reports', {
            url: "/Reports",
            controller: 'ReportCtrl',
            templateUrl: "views/reports.html"
        })
        .state('Analytics', {
            url: "/Analytics",
            controller: 'analyticsCtrl',
            templateUrl: "views/analytics.html"
        })
        .state('RealTime', {
            url: "/RealTime",
            controller: 'RealTimeController',
            templateUrl: "views/realtime.html"
        })

        .state('Digin P Stack', {
            url: "/Digin P Stack",
            controller: 'ExtendedanalyticsCtrl',
            templateUrl: "views/extended-analytics.html"
        })
        .state('Interactive Report', {
            url: "/Interactive Report",
            controller: 'ExtendedReportCtrl',
            templateUrl: "views/extended-reports.html"
        })
        .state('Analysis Report', {
            url: "/Analysis Report",
            controller: 'ExtendedanalyticsCtrl',
            templateUrl: "views/extended-analytics.html"
        })
        .state('Dashboard', {
            url: "/Dashboard",
            controller: 'ExtendedDashboardCtrl',
            templateUrl: "views/extended-dashboard.html"
        })
        .state('D3plugins', {
            url: "/D3plugins",
            controller: 'd3PluginCtrl',
            templateUrl: "views/D3Plugin/d3View.html"
        })
        .state('PivotTable', {
            url: "/PivotTable",
            controller: 'summarizeCtrl',
            templateUrl: "views/pivottable.html"
        })
        .state('ReportViewer', {
            url: '/ReportViewer:param',
            controller: 'ReportViewerControl',
            templateUrl: "views/Report_viewer.html"

        })
        .state('DashboardViewer', {
            url: '/DashboardViewer:param',
            controller: 'DashboardViewerControl',
            templateUrl: "views/Dashboard_viewer.html"

        })
        .state('CustomDashboardViewer', {
            url: "/CustomDashboard:param",
            controller: 'DashboardCtrl',
            templateUrl: "views/charts.html"
        })
        .state('AnalyzerViewer', {
            url: '/AnalyzerViewer:param',
            controller: 'AnalyzerViewerControl',
            templateUrl: "views/Analyzer_viewer.html"

        })
        .state('Settings', {
            url: '/settings',
            controller: 'settingsCtrl',
            templateUrl: "views/settings.html"

        })
        .state('Grid', {
            url: '/Grid',
            controller: 'DashboardCtrl',
            templateUrl: "views/chartsGridster.html"

        })


    lkGoogleSettingsProvider.configure({
        apiKey: 'AIzaSyA9fv9lYQdt1XV6wooFtItxYlMF8Y9t1ao',
        clientId: '468951747947-jb7obcgd91m7379q4nn7vroid8g37ds0.apps.googleusercontent.com',
        scope: ['https://www.googleapis.com/auth/drive']
    })

    $mdThemingProvider.theme('alt')
        .primaryPalette('indigo')
        .accentPalette('blue');

    $mdThemingProvider.theme('alt1')
        .primaryPalette('deep-purple')
        .accentPalette('red');

    $mdThemingProvider.theme('alt2')
        .primaryPalette('green')
        .accentPalette('amber');

    $mdThemingProvider.theme('alt3')
        .primaryPalette('blue-grey')
        .accentPalette('teal');

    $mdThemingProvider.alwaysWatchTheme(true);

}]);


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



routerApp.controller('mainController', ['$scope', '$http', function (scope, http) {}]);

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
                    resolve: {

                    }
                })
            });
            client.onError(function (data) {
                $mdDialog.hide();
                $mdDialog.show({
                    controller: 'errorCtrl',
                    templateUrl: 'views/dialog_error.html',
                    resolve: {

                    }
                })
            });


            client.insert([$rootScope.dashboard], {
                KeyProperty: "dashboardName"
            });


        }
    }
]);

routerApp.controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
        $mdSidenav('right').close()
            .then(function () {
                $log.debug("close RIGHT is done");
            });
    };
});

routerApp.controller('clockWidgetController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
    var dateFormat = function ($scope) {
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0" + val;
                return val;
            };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
            var dF = dateFormat;

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date;
            if (isNaN(date)) throw SyntaxError("invalid date");

            mask = String(dF.masks[mask] || mask || dF.masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d: d,
                    dd: pad(d),
                    ddd: dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m: m + 1,
                    mm: pad(m + 1),
                    mmm: dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy: String(y).slice(2),
                    yyyy: y,
                    h: H % 12 || 12,
                    hh: pad(H % 12 || 12),
                    H: H,
                    HH: pad(H),
                    M: M,
                    MM: pad(M),
                    s: s,
                    ss: pad(s),
                    l: pad(L, 3),
                    L: pad(L > 99 ? Math.round(L / 10) : L),
                    t: H < 12 ? "a" : "p",
                    tt: H < 12 ? "am" : "pm",
                    T: H < 12 ? "A" : "P",
                    TT: H < 12 ? "AM" : "PM",
                    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

    // Some common format strings
    dateFormat.masks = {
        "default": "ddd mmm dd yyyy HH:MM:ss",
        shortDate: "m/d/yy",
        mediumDate: "mmm d, yyyy",
        longDate: "mmmm d, yyyy",
        fullDate: "dddd, mmmm d, yyyy",
        shortTime: "h:MM TT",
        mediumTime: "h:MM:ss TT",
        longTime: "h:MM:ss TT Z",
        isoDate: "yyyy-mm-dd",
        isoTime: "HH:MM:ss",
        isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };

    // Internationalization strings
    dateFormat.i18n = {
        dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
        monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
    };

    // For convenience...
    Date.prototype.format = function (mask, utc) {
        return dateFormat(this, mask, utc);
    };


    // Clock Widget's date and time... 
    var monthDay = dateFormat('mmmm d,yyyy');
    console.log(monthDay);
    $('#clockmonthDay').append(monthDay);

    var year = dateFormat('yyyy');
    console.log(year);
    $('#clockyear').append(year);


    // Clock Widget's Rotation 
    $(function () {

        setInterval(function () {
            var seconds = new Date().getSeconds();
            var sdegree = seconds * 6;
            var srotate = "rotate(" + sdegree + "deg)";

            $("#clocksec").css({
                "transform": srotate
            });

        }, 1000);

        setInterval(function () {
            var hours = new Date().getHours();
            $('#clockHours').text(hours);
            var mins = new Date().getMinutes();
            $('#clockMins').text(mins);
            var hdegree = hours * 30 + (mins / 2);
            var hrotate = "rotate(" + hdegree + "deg)";

            $("#clockhour").css({
                "transform": hrotate
            });

        }, 1000);


        setInterval(function () {
            var mins = new Date().getMinutes();
            //$scope.clockComponentMins = mins;
            //console.log(mins);
            var mdegree = mins * 6;
            var mrotate = "rotate(" + mdegree + "deg)";

            $("#clockmin").css({
                "transform": mrotate
            });

        }, 1000);

    });

    $scope.clockComponentSelectformat = function (ev) {
        $mdDialog.show({
                controller: clockComponentformatController,
                templateUrl: 'templates/clockComponentformat.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function (answer) {
                var monthDay = dateFormat(answer);
                $('#clockmonthDay').text(monthDay);

            }, function () {

            });
    };

    function clockComponentformatController($scope, $mdDialog) {
        $scope.formats = [{
                name: "default",
                format: "ddd mmm dd yyyy HH:MM:ss"
                },
            {
                name: "shortDate",
                format: "m/d/yy"
                },
            {
                name: "longDate",
                format: "mmmm d, yyyy"
                },
            {
                name: "fullDate",
                format: "dddd, mmmm d, yyyy"
                },
            {
                name: "shortTime",
                format: "h:MM TT"
                },
            {
                name: "mediumTime",
                format: "h:MM:ss TT"
                },
            {
                name: "longTime",
                format: "h:MM:ss TT Z"
                },
            {
                name: "isoDate",
                format: "yyyy-mm-dd"
                },
            {
                name: "isoTime",
                format: "HH:MM:ss"
                },
            {
                name: "isoDateTime",
                format: "yyyy-mm-dd'T'HH:MM:ss"
                },
            {
                name: "isoUtcDateTime",
                format: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
                }];

        $scope.clockComponentformatChange = function (data) {
            $mdDialog.hide(data);
        };
        $scope.closeWidgetOptions = function () {
            $mdDialog.cancel();
        };
    };

}])

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
                };
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
                            };
                        };
                    };
                };
                //console.log($scope.days);
            };
        };

        $scope.previousMonth = function () {
            if ($scope.month == 1) {
                $scope.month = 12;
            } else {
                $scope.month = $scope.month - 1;

            };
            //createCal();
        };

        $scope.nextMonth = function () {
            if ($scope.month == 12) {
                $scope.month = 1;

            } else {
                $scope.month = $scope.month + 1;
            };
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
                    };
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

routerApp.controller('userprofileWidgetController', ['$scope', function ($scope) {
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

routerApp.factory('instagram', ['$http', function ($http) {

    return {
        fetchPopular: function (callback) {

            var endPoint = "https://api.instagram.com/v1/media/popular?client_id=f22d4c5be733496c88c0e97f3f7f66c7&callback=JSON_CALLBACK";

            $http.jsonp(endPoint).success(function (response) {
                callback(response.data);
            });
        }
    }

}]);

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

routerApp.directive('clockComponent', function () {
    return {
        restrict: 'E',
        controller: 'clockWidgetController',
        template: " <div class='clockmain widget-card'><md-button style='min-width: 10px;' ng-click='clockComponentSelectformat($event);'><img src='http://imgh.us/dots_1.svg' width='5' height='23'/></md-button><ul id='clockclock'><li id='clockhour'></li><li id='clockmin'></li><li id='clocksec'></li></ul><div id='clockdate'><p style='font-family: lato,sans-serif;font-size:xx-large;color:#00172F;margin: 10px;'><span id='clockHours'></span> : <span id='clockMins'></span> </p><span id='clockmonthDay'></span></div></div>"
    };
});

routerApp.directive('calenderComponent', function () {
    return {
        restrict: 'E',
        controller: 'calenderWidgetController',
        template: "<div class='widget-card'><section class='calendar'>\
<ng-md-icon style='position: absolute;left: 40px;min-width: 5px;top: 25px;fill:white;' ng-click='previousMonth();' icon='navigate_before'>p</ng-md-icon>\
  <h1>{{monthNames[month]}} 2015</h1>\
<ng-md-icon style='position: absolute;right: 40px;min-width: 5px;top: 25px;fill:white' ng-click='nextMonth();' icon='navigate_next'>p</ng-md-icon>\
  <form action='#'>\
    <label class='weekday'>Mo</label>\
    <label class='weekday'>Tu</label>\
    <label class='weekday'>We</label>\
    <label class='weekday'>Th</label>\
    <label class='weekday'>Fr</label>\
    <label class='weekday'>Sa</label>\
    <label class='weekday'>Su</label>\
    <label class='day' data-day='{{day.day}}' ng-repeat='day in days' ng-if='day.month == month'>\
      <input class='appointment' date-day='{{day.day}}' ng-model='day.task' placeholder='What would you like to do?' required='true' type='text'>\
      <span>{{day.date}}</span>\
      <em></em>\
    </label>\
 <div class='clearfix'></div>\
  </form>\
</section></div>"
    };
})

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
  <div class=" card-face face-2"><!-- Back trigger -->\
    <button data-card-back="data-card-back" class="card-face__back-button"><img src="http://imgh.us/arrow_1.svg" width="19" height="19" draggable="false"/></button><img src="http://imgh.us/Likes.png" width="100" height="100" draggable="false" class="card-face__stats"/><img src="http://imgh.us/Followers.png" width="100" height="100" draggable="false" class="card-face__stats"/><img src="http://imgh.us/Views.png" width="100" height="100" draggable="false" class="card-face__stats"/><!-- Settings Button --><img src="http://imgh.us/cog.svg" width="17" height="17" draggable="false" class="card-face__settings-button"/>\
  </div><!-- Face 1 -->\
  <div class="card-face face-1"><!-- Menu trigger -->\
<div style="background-image:url(styles/css/images/+++++ofileComponentBg.jpg);background-size:cover;width: 100%;height: 45%;position: absolute;"></div>\
    <button data-card-menu="data-card-menu" class="card-face__menu-button"><img src="http://imgh.us/dots_1.svg" width="5" height="23" draggable="false"/></button><!-- Avatar -->\
    <div class="card-face__avatar"><!-- Bullet notification --><span class="card-face__bullet">2</span><!-- User avatar --><img src="http://i.imgur.com/gGdWosb.png" width="110" height="110" draggable="false"/></div><!-- Name -->\
    <h2 class="card-face__name">'+localStorage.getItem("username")+'</h2><!-- Title --><span class="card-face__title">Graphic & Web Designer</span><!-- Cart Footer -->\
    <div class="card-face-footer"><a href="#" target="_blank" class="card-face__social"><img src="http://imgh.us/dribbble.svg" width="36" height="36" draggable="false"/></a><a href="#"_blank" class="card-face__social"><img src="http://imgh.us/beh.svg" width="36" height="36" draggable="false"/></a><a href="#" target="_blank" class="card-face__social"><img src="http://imgh.us/plus_5.svg" width="36" height="36" draggable="false"/></a></div>\
  </div>\
</div>'
    };
});
