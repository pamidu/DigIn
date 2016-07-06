/**
 * Created by Damith on 12/1/2015.
 */

/* AUTH damtih
 /* socialGraphFBCtrl - Main controller
 */

routerApp.controller('socialGraphFBCtrl', function ($scope, config, fbGraphServices) {

    $scope.accounts = [];

    $scope.pageSearchPara = {
        startDate: new Date(),
        endDate: new Date()
    };

    //on load current page details
    $scope.page = null;
    $scope.activePageSearch = true;
    $scope.viewPageDetails = function (page) {
       console.log('page details:'+JSON.stringify(page));
        $scope.page = page;
        $scope.activePageSearch = !$scope.activePageSearch;
        _fun_filterPageDetails();

    };

    var _fun_GetFbPageHttp = function (filterDate, callback) {
        if (!angular.isUndefined($scope.page.accessToken)) {
            //access API
            fbGraphServices.get_all(config.apiFbUrl, "['page_stories','page_storytellers']",
                $scope.page.accessToken, '1447509660',
                '1448028060').
            success(function (response) {
                console.log(response);
                callback(response);
            }).error(function (d) {
                console.error(d);
                callback(d);
            });
        }
    };


    //filter page details
    var _fun_filterPageDetails = function () {
       alert('test');
        var filterDate = {
            'since': moment($scope.pageSearchPara.startDate).month(-3).unix(),
            'until': moment($scope.pageSearchPara.endDate).unix()
        };
        _fun_GetFbPageHttp(filterDate, function (response) {
            console.log(response);
        })
    };

    $scope.onFilterData = function () {
        _fun_filterPageDetails();
    };


    //Search fb page
    $scope.isSearchingPage = false;
    $scope.loginWithFb = function () {
        if (fbInterface.state != 'connected') {
            fbInterface.loginToFb($scope);
        }
        else {
            fbInterface.logoutFromFb($scope);
        }
    };
    $scope.map = {center: {latitude: 51.219053, longitude: 4.404418}, zoom: 14};


//HighChart theme


//facebook graph
    $scope.highchartsNG = {
        options: {
            chart: {
                type: 'column',
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
                    color: '#fff',
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
                    color: '#fff',
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
            color: '#1DE9B6',
            name: 'post',
            lineWidth: 1,
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            dataLabels: {
                style: {
                    color: '#fff'
                }
            }

        }, {
            color: '#64FFDA',
            name: 'like',
            lineWidth: 1,
            data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],
            dataLabels: {
                style: {
                    color: '#fff'
                }
            }

        },
            {
                color: '#00BFA5',
                name: 'comments',
                lineWidth: 1,
                data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],
                dataLabels: {
                    style: {
                        color: '#fff'
                    }
                }

            }
        ],
        title: {
            text: ''
        },
        loading: false
    }

    /*Post and Visitors */
    $scope.chooseView = {
        Post: 'Posts'
    };

//Get posts
    $scope.postsObj = [];
    var _fun_getPosts = function () {
        $scope.postsObj = [
            {
                "type": "link",
                "page_url": "BreakingNews.lk",
                "url": "https://www.facebook.com/1689030121323728/posts/1837830313110374",
                "like": "5",
                "shares": "1",
                "Comments": "12",
                "date_time": "Aug 18th 15",
                "image_url": "https://scontent.xx.fbcdn.net/hphotos-xpa1/t31.0-8/s720x720/10866097_1712824585610948_5017854119379408984_o.jpg"
            },
            {
                "type": "link",
                "page_url": "BreakingNews.lk",
                "url": "https://www.facebook.com/1689030121323728/posts/1837830313110374",
                "like": "5",
                "shares": "1",
                "Comments": "12",
                "date_time": "Aug 18th 15",
                "image_url": null
            }
        ];
    };

//Get visitor
    $scope.visitorsObj = [];
    var _fun_getVisitor = function () {
        $scope.visitorsObj = [
            {
                "name": "BreakingNews.lk",
                "page_url": "BreakingNews.lk",
                "avatar": "https://scontent.xx.fbcdn.net/hprofile-xpa1/v/t1.0-1/c0.0.50.50/p50x50/1383279_10200895081802147_1613932301_n.jpg?oh=43a7a8af53a39390cd061368b1012f3c&oe=56F8244B",
                "rating": "5",
                "likes": "1",
                "posts": "12",
                "comments": "1"
            },
            {
                "name": "BreakingNews.lk",
                "page_url": "BreakingNews.lk",
                "avatar": "https://scontent.xx.fbcdn.net/hprofile-xpa1/v/t1.0-1/c0.0.50.50/p50x50/1383279_10200895081802147_1613932301_n.jpg?oh=43a7a8af53a39390cd061368b1012f3c&oe=56F8244B",
                "rating": "5",
                "likes": "1",
                "posts": "12",
                "comments": "1"
            }
        ];
    }

//when select view post or visitors
    $scope.viewLayout = {
        'isPost': true,
        'isVisitor': false
    };
// _fun_getPosts();
    $scope.onViewChange = function () {
        var _chooseValue = $scope.chooseView.Post;
        switch (_chooseValue) {
            case 'Posts':
                $scope.viewLayout.isPost = true;
                $scope.viewLayout.isVisitor = false;
                _fun_getPosts();
                break;
            case 'Visitors':
                $scope.viewLayout.isVisitor = true;
                $scope.viewLayout.isPost = false;
                _fun_getVisitor();
                break;
            default:
                break;
        }
    }


})
;
