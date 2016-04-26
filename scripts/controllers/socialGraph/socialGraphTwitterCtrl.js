/**
 * Created by Damith on 12/1/2015.
 */

/* AUTH damtih
 /* socialGraphTwitterCtrl - Main controller
 */

routerApp.controller('socialGraphTwitterCtrl', function ($scope, config, $rootScope, twitterService, ngToast, Digin_Twitter_API) {

    $scope.isLoginTwitter = false;
    $scope.isLoadingTwitter = false;

    //main function
    var mainFunc = (function () {
        var parameter = {
            apiBase: Digin_Twitter_API,
            key: {
                consumer_key: 'Uz6KhfZsmlaACDJfxO3E4E9cT',
                consumer_secret: '1cpKTIvlzQI4ncBstmG1sPrn1ly1u8vMeXRRlOEMw1ojFtwAng',
                owner_id: '344250076',
                access_level: 'Read and write'
            },

        }
        return {
            loginSuccess: function () {
                $scope.isLoginTwitter = true;
                $scope.isLoadingTwitter = false;
            },
            loginError: function () {
                $scope.isLoginTwitter = false;
                $scope.isLoadingTwitter = false;
            }, loading: function () {
                $scope.isLoginTwitter = false;
                $scope.isLoadingTwitter = true;
            }, loadingDone: function () {
                $scope.isLoadingTwitter = false;
            },
            fireMsg: function (msgType, content) {
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
                    animation: 'slide'
                });
            },
            onClickLogin: function () {
                mainFunc.loading();
                twitterService.connectTwitter().then(function (d) {
                    if (twitterService.isReady()) {
                        //if the authorization is successful, hide the connect button and display the tweets
                        mainFunc.fireMsg('1', 'twitter login successfully');
                        $scope.connectedTwitter = true;
                        $scope.isLoginTwitter = true;
                    } else {
                        mainFunc.fireMsg('0', 'twitter services error');
                    }
                });
                //mainFunc.loadingDone();
            },
            onClickLogOut: function () {
                mainFunc.loginError();
                twitterService.clearCache();
            }
        }
    })();

    //call function

    //check cookie details
    //is login into twitter
    $scope.onInit = function () {
        $scope.tweets = []; //array of tweets
        twitterService.initialize();
        var cookieLog = twitterService.getStorage("@tiwitter_oauth");
        var twitterToken = twitterService.getStorage("@tiwitter_token");
        var twitterSecret = twitterService.getStorage("@tiwitter_secret");
        if (cookieLog != null) {
            console.log(twitterToken);
            console.log(twitterSecret);
            mainFunc.loginSuccess();
        } else {
            $scope.isLoginTwitter = false;
            mainFunc.loginError();
        }
    };


    //on click login twitter
    $scope.onLoginTwitter = function () {
        mainFunc.onClickLogin();
    };

    $scope.logOut = function () {
        $scope.isLoginTwitter = false;
        mainFunc.onClickLogOut();
    };

    //twitter emotions chart
    $scope.highchartsNG = {
        options: {
            chart: {
                type: 'line',
                backgroundColor: null,
                // Edit chart spacing
                spacingBottom: 15,
                spacingTop: 10,
                spacingLeft: 10,
                spacingRight: 10,

                // Explicitly tell the width and height of a chart
                width: 680,
                height: 300
            },
            plotOptions: {
                column: {
                    borderWidth: 0,
                    groupPadding: 0,
                    shadow: false
                }
            }
        },

        xAxis: {
            gridLineWidth: 0,
            tickColor: '#999',
            gridLineColor: '#ebebeb',
            lineColor: '#ebebeb',
            minorGridLineColor: '#ebebeb',
            labels: {
                style: {
                    color: '#E0E0E0',
                    fontSize: '12px',
                    fontFamily: 'Ek Mukta, sans-serif',
                    fontWeight: '200'
                },
                formatter: function () {
                    return this.value;
                }
            },
            categories: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May',
                'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],
            crosshair: true
        },
        yAxis: {

            labels: {
                style: {
                    color: '#E0E0E0',
                    fontSize: '12px',
                    fontFamily: 'Ek Mukta, sans-serif',
                    fontWeight: '200'
                },
                formatter: function () {
                    return this.value;
                }
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.1,
                borderWidth: 0
            }
        },
        series: [{
            color: '#C62828',
            name: 'negative',
            lineWidth: 1,
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            dataLabels: {
                style: {
                    color: '#1DE9B6'
                }
            }

        }, {
            color: '#2E7D32',
            name: 'positive',
            lineWidth: 1,
            data: [85.0, 65.9, 95.5, 85.5, 85.2, 65.5, 60.2, 26.5, 23.3, 18.3, 13.9, 90.6],
            dataLabels: {
                style: {
                    color: '#C62828'
                }
            }
        },
            {
                color: '#0277BD',
                name: 'neutral',
                lineWidth: 1,
                data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],
                dataLabels: {
                    style: {
                        color: '#C62828'
                    }
                }
            }
        ],
        title: {
            text: ''
        },
        loading: false
    }

    //
    $scope.emotionsLevel = {
        options: {
            chart: {
                type: 'solidgauge'
            },
            pane: {
                center: ['50%', '65%'],
                size: '130%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
            solidgauge: {
                dataLabels: {
                    y: -30,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        },
        series: [{
            data: [16],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:15px;color:#E0E0E0">{y}</span>'

            }
        }],
        title: {
            text: 'Solid Gauge',
            y: 50
        },
        yAxis: {
            currentMin: 0,
            currentMax: 20,
            title: {
                y: 140
            },
            stops: [
                [0.1, '#e74c3c'], // red
                [0.5, '#f1c40f'], // yellow
                [0.9, '#2ecc71'] // green
            ],
            lineWidth: 0,
            tickInterval: 20,
            tickPixelInterval: 10,
            tickWidth: 0,
            labels: {
                y: 15
            }
        },
        loading: false
    }

    $scope.wordArray = [['bigquery', 85],
        ['digin', 100],
        ['bigdata', 82],
        ['python', 80],
        ['analytics', 80],
        ['business', 79],
        ['intelligence', 79],
        ['belgium', 79],
        ['Happy', 76],
        ['Newyear', 64],
        ['view', 52],
        ['suit', 40],
        ['forever', 38],
        ['familiar', 36],
        ['forehead', 34],
        ['shoot', 32],
        ['grew', 30],
        ['stretch', 28],
        ['pound', 26],
        ['despite', 24],
        ['response', 22],
        ['center', 20],
        ['curl', 18],
        ['slight', 18],
        ['toss', 18],
        ['beneath', 18],
        ['fist', 16],
        ['welcome', 16],
        ['laughter', 16],
        ['angel', 16],
        ['Christmas', 16],
        ['we\'d', 16],
        ['main', 16],
        ['simple', 16],
        ['neither', 16],
        ['distance', 16],
        ['comfort', 16],
        ['upset', 16],
        ['assume', 16],
        ['eight', 16],
        ['gather', 16],
        ['lucky', 16],
        ['fade', 16],
        ['Ms.', 16],
        ['coat', 16],
        ['special', 16],
        ['awkward', 16],
        ['certain', 16],
        ['plate', 16],
        ['darkness', 16]];

    $rootScope.$broadcast('getWordCloudData', {wordData: $scope.wordArray});

});

