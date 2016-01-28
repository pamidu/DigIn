/* Summary:
 note: some of the scope variables are initialized inside fbInterface
 */

routerApp.controller('socialGraphCtrl', function ($scope, config, fbGraphServices, $http,
                                                  Digin_Engine_API3, $rootScope, $mdDialog,
                                                  $timeout) {

    $scope.totalLikes = 0;
    $scope.apiUrl = Digin_Engine_API3;

    $scope.sentimentConfig = {
        options: {
            chart: {
                type: "line",
                backgroundColor: null,
                spacingBottom: 15,
                spacingTop: 10,
                spacingLeft: 10,
                spacingRight: 10,
                height: 300
            }, plotOptions: {column: {borderWidth: 0, groupPadding: 0, shadow: !1}}
        },
        title: {
            text: '',
            style: {
                display: 'none'
            }
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Sentiment'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
//        legend: {
//            layout: 'vertical',
//            align: 'right',
//            verticalAlign: 'middle',
//            borderWidth: 0
//        },
        series: [{
            name: 'Positive',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            color: '#1976D2'
        }, {
            name: 'Neutral',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5],
            color: '#FFC107'
        }, {
            name: 'Negative',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0],
            color: '#D32F2F'
        }]
    };

    $scope.fbPageInit = function () {
        fbInterface.getFbLoginState($scope, true);

    }

    $scope.searchPage = function (searchQuery) {
        fbInterface.getSearchedPages($scope, true, searchQuery);
    };

    //getting the service response
    function getServiceResponse(serviceUrl, callback) {
        console.log('Sevice URL:' + serviceUrl);
        $http({
            method: 'GET',
            url: serviceUrl
        }).success(function (data, status) {
            callback(data);
        }).error(function (data, status) {
            console.log('unexpected error occured');
        });
    };

    //generate the chart
    var configSeries = [];

    function generateChart(data) {
        configSeries = [];
        $scope.totalViews = 0;
        var colorObj = {'page_views': '#00796B', 'page_fans': '#B2DFDB', 'page_stories': '#FFFFFF'};
        data.forEach(function (entry) {
            $scope.configData = [];
            var seriesName = '';
            entry.data.forEach(function (value) {
                var x = value[0].split('T')[0];

                var enDate = x.replace(/-/g, ",").split(',');

                if (entry.name == 'page_views') {
                    seriesName = 'Page Views';
                    $scope.totalViews += value[1];
                }

                if (entry.name == 'page_fans') {
                    seriesName = 'Page Likes';
                    $scope.totalLikes = value[1];
                }

                if (entry.name == 'page_stories') seriesName = 'Page Stories';

                $scope.configData.push([
                    Date.UTC(enDate[0], enDate[1] - 1, enDate[2]),
                    value[1]
                ]);
            });

            configSeries.push({
                type: 'column',
                name: seriesName,
                data: $scope.configData,
                color: colorObj[entry.name]
            });
        });

        $scope.highchartsNG = {
            options: {
                chart: {
                    type: "column",
                    backgroundColor: null,
                    spacingBottom: 15,
                    spacingTop: 10,
                    spacingLeft: 10,
                    spacingRight: 10,
                    width: 680,
                    height: 300
                }, plotOptions: {column: {borderWidth: 0, groupPadding: 0, shadow: !1}}
            },
            credits: {enabled: false},
            xAxis: {type: "datetime"},
            yAxis: {
                labels: {
                    style: {
                        color: "#fff",
                        fontSize: "12px",
                        fontFamily: "Ek Mukta, sans-serif",
                        fontWeight: "200"
                    }, formatter: function () {
                        return this.value
                    }
                }
            },
            plotOptions: {column: {pointPadding: .1, borderWidth: 0}},
            title: {text: ""},
            loading: !1
        };

        $scope.highchartsNG['series'] = configSeries;
    };

    //set the map
    function setMap(data) {
        for (var key in data.value) {
            if (Object.prototype.hasOwnProperty.call(data.value, key)) {
                $scope.arrAdds.push({add: key, likeCount: data.value[key]});
            }
        }


        $rootScope.$broadcast('getLocations', {addData: $scope.arrAdds});
    };


    $scope.finishLoading = function () {

    }


    $scope.getPageDetails = function (page, pageTimestamps, changedTime) {
        var serviceUrl = Digin_Engine_API3 + 'pageoverview?metric_names=[%27page_views%27,%27page_fans%27,%27page_stories%27]&token='
            + page.accessToken + '&since=' + pageTimestamps.sinceStamp + '&until=' + pageTimestamps.untilStamp;

        getServiceResponse(serviceUrl, function (data) {
            console.log('chart data:' + JSON.stringify(data));
            generateChart(data);
            serviceUrl = Digin_Engine_API3 + 'fbpostswithsummary?token=' + page.accessToken + '&since=' + pageTimestamps.sinceStamp + '&until=' + pageTimestamps.untilStamp;
            getServiceResponse(serviceUrl, function (data) {
                console.log('posts:' + JSON.stringify(data));
                $scope.postsObj = data;
                $scope.arrAdds = [];
                $scope.postCount = data.length;
                $scope.postIds = [];
                $scope.postsObj.forEach(function (postEntry) {
                    $scope.postIds.push(postEntry.id);
                });
                //$scope.postIds.push("908260585925557");
                serviceUrl = Digin_Engine_API3 + 'sentimentanalysis?tokens=%27' + page.accessToken + '%27&source=facebook&post_ids=' + JSON.stringify($scope.postIds);
                getServiceResponse(serviceUrl, function (data) {
                    console.log(JSON.stringify(data));
                    var sentIcons = {
                        'positive': 'fa fa-smile-o',
                        'negative': 'fa fa-frown-o',
                        'neutral': 'fa fa-meh-o'
                    };
                    //assuming the data retreived is in the same order of the $scope.postIds
                    for (i = 0; i < data.length; i++) {
                        $scope.postsObj[i]['sentiment'] = {
                            "res": data[i].sentiment,
                            "pol": data[i].polarity,
                            "ico": sentIcons[data[i].sentiment]
                        };

                    }
                    console.log("post result:" + JSON.stringify($scope.postsObj));
                    serviceUrl = Digin_Engine_API3 + 'demographicsinfo?token=' + page.accessToken;
                    getServiceResponse(serviceUrl, function (data) {
                        $scope.wordArray = [['practically', 85],
                            ['odd', 83],
                            ['wash', 82],
                            ['sing', 80],
                            ['inch', 80],
                            ['size', 79],
                            ['secret', 79],
                            ['who\'s', 79],
                            ['clock', 76]];
                        $scope.$apply();
                        setMap(data);
                        $scope.page = page;
                        if (!changedTime)
                            $scope.activePageSearch = !$scope.activePageSearch;
                    });

                    serviceUrl = Digin_Engine_API3 + 'buildbipartite?token=%27' + page.accessToken + '%27&source=facebook&post_ids=' + JSON.stringify($scope.postIds);
                    getServiceResponse(serviceUrl, function (data) {
                        $scope.buildBipartite = data;
                    });
                });
            });
        });
    };

    //dev damtih
    //char Bipartite


    //on load current page details
    $scope.page = null;
    $scope.activePageSearch = true;

    $scope.viewPageDetails = function (page) {
        $scope.untilDate = new Date();
        var secondDate = new Date();
        secondDate.setDate($scope.untilDate.getDate() - 60);
        $scope.sinceDate = secondDate;
        $scope.getPageDetails(page, getBoundaryTimestamps(60, new Date()));
    };

    $scope.changeTimeRange = function () {
        var since = new Date($scope.sinceDate);
        var until = new Date($scope.untilDate);
        //alert(typeof(since));
        var timeObj = {
            sinceStamp: Math.floor(since / 1000),
            untilStamp: Math.floor(until / 1000)
        };
        $scope.getPageDetails($scope.page, timeObj, true);
    };

    //Search fb page
    $scope.isSearchingPage = false;
    $scope.loginWithFb = function () {
        if (fbInterface.state != 'connected') {
            fbInterface.loginToFb($scope, true);
        } else {
            fbInterface.logoutFromFb($scope, true);
        }
    };

    /*Post and Visitors */
    $scope.chooseView = {
        Post: 'Posts'
    };


    //when select view post or visitors
    $scope.viewLayout = {
        'isPost': true,
        'isVisitor': false
    };

    //viewing a single post
    $scope.viewSinglePost = function (post) {
        $mdDialog.show({
            controller: singlePostCtrl,
            templateUrl: 'views/socialGraph/fbPost_template.html',
            clickOutsideToClose: true,
            locals: {
                fbPost: post
            }
        });
    };

    //create funtion damith
    //dev damith
    //on click view current JSON data to Table
    $scope.onClickViewTable = function (_type) {
        if (_type == 'map') {
            $mdDialog.show({
                controller: viewMapTableCtrl,
                templateUrl: 'views/socialGraph/viewTableMap_Temp.html',
                clickOutsideToClose: true,
                locals: {
                    dataAry: $scope.arrAdds,
                    pageName: $scope.page
                }
            });
            return;
        }
        $mdDialog.show({
            controller: viewTableCtrl,
            templateUrl: 'views/socialGraph/viewTable_Temp.html',
            clickOutsideToClose: true,
            locals: {
                jsonData: configSeries,
                pageName: $scope.page
            }
        });
    }


});


function viewTableCtrl($scope, $mdDialog, jsonData, pageName) {
    $scope.tableData = jsonData;
    $scope.pageName = pageName;


    var cvtUnixToDate = function (unix) {
        var d = new Date(unix * 1000);
        return d.toGMTString();
    }

    var pageAnalysis = {
        isLoading: false,
        analysis: []
    };

    $scope.analysis = {};
    for (var i = 0; i < jsonData.length; i++) {
        $scope.analysis[jsonData[i].name] = {
            name: [],
            tot: [],
            data: []
        };
        $scope.analysis[jsonData[i].name].name.push(jsonData[i].name);

        var tot = 0;

        for (var c = 0; c < jsonData[i].data.length; c++) {
            var jsonObj = {'date': '', 'like': ''};
            for (var b = 0; b < jsonData[i].data[c].length; b++) {
                if (b == 0) {
                    //date
                    var date = jsonData[i].data[c][b];
                    jsonObj.date = cvtUnixToDate(date);

                }
                else {
                    //like
                    var like = jsonData[i].data[c][b];
                    jsonObj.like = like;
                    tot = like;
                }
            }
            $scope.analysis[jsonData[i].name].data.push(jsonObj);
        }
        $scope.analysis[jsonData[i].name].tot.push(tot);
    }

    $scope.pageViewDta = [];
    for (var i = 0; i < jsonData.length; i++) {
        if (jsonData[i].name == 'Page Likes') {
            $scope.pageViewDta = $scope.analysis[jsonData[i].name].data;
        }
    }

    $scope.viewTypes = [
        {name: 'Page Likes', value: 'l1'},
        {name: 'Page Stories', value: 's2'},
        {name: 'Page  Views', value: 'v3'}
    ];

    $scope.tblType = 'l1';
    $scope.selectTypeName = 'Page Likes';
    $scope.onChangeTblView = function (type) {
        var updatedNeed = $scope.tblType;
        $scope.pageViewDta = [];
        switch (updatedNeed) {
            case 'l1':
                $scope.selectTypeName = 'Page Likes';
                for (var i = 0; i < jsonData.length; i++) {
                    if (jsonData[i].name == 'Page Likes') {
                        $scope.pageViewDta = $scope.analysis[jsonData[i].name].data;
                    }
                }
                break;
            case 's2':
                $scope.selectTypeName = 'Page Stories';
                for (var i = 0; i < jsonData.length; i++) {
                    if (jsonData[i].name == 'Page Stories') {
                        $scope.pageViewDta = $scope.analysis[jsonData[i].name].data;
                    }
                }
                break;
            case 'v3':
                $scope.selectTypeName = 'Page  Views';
                for (var i = 0; i < jsonData.length; i++) {
                    if (jsonData[i].name == 'Page Views') {
                        $scope.pageViewDta = $scope.analysis[jsonData[i].name].data;
                    }
                }
                break;
            default:
                break;
        }
    };


    $scope.closeDialog = function () {
        $mdDialog.hide();
    }
};

function viewMapTableCtrl($scope, $mdDialog, dataAry, pageName) {
    $scope.mapTblData = dataAry;

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }
}

