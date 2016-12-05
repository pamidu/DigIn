/* Summary:
 note: some of the scope variables are initialized inside fbInterface
 */

routerApp.controller('socialGraphCtrl', function ($scope, config, fbGraphServices,ngToast,
                                                  $http, $rootScope, $mdDialog, $restFb, notifications) {

    $scope.totalLikes = 0;
    $scope.totalEngagement = 0;
    $scope.engageLikes = 0;
    $scope.totalViews = 0;
    $scope.avgEngagement = 0;
    $scope.postCount = 0;
    $scope.requestCount = 0;
    $scope.postSummaryRequest = 0;
    $scope.sentimentRequest = 0;
    $scope.newPage = true;
    $scope.wordCloudLoading = true;
    $scope.sentimentGraphLoading = true;
    $scope.timeChanged = false;
    $scope.postSummaryLoading = false;
    $scope.failedPool = [];
    $scope.sentimentConfigData = [];
    $scope.sentimentConfigSeries = [];
    $scope.postsObj = [];
    $scope.configData = [];
    var untilDate = new Date();
    var secondDate = new Date();
    secondDate.setDate(untilDate.getDate() - 7);
    $scope.sinceDate = moment(secondDate).format('LL');
    $scope.untilDate = moment(untilDate).format('LL');
    $scope.defReqPool = [{method: 'setPageOverview'},
        {method: 'setWordCloud'},
        {method: 'setDemographicsinfo'},
        {method: 'setPostSummary'}];
    $scope.postState = false;
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
            },
            plotOptions: {
                column: {
                    borderWidth: 0,
                    groupPadding: 0,
                    shadow: !1,
                    pointPadding: .1
                }
            }
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%e. %b. %Y}'
            }
        },
        yAxis: {
            title: {
                text: "Polarity"
            },
            lineWidth: 1
        },
        title: {
            text: ""
        },
        loading: !1
    };

    $scope.fbPageInit = function () {
        fbInterface.getFbLoginState($scope, true);      
    };


    $scope.searchPage = function (searchQuery) {
        fbInterface.getSearchedPages($scope, true, searchQuery);
    };

    //getting the service response
    // #demographic : bool true if the call from the demographic service because it doesn't have any other parameter
    function getServiceResponse(serviceUrl, token, callback, demographic) {
        console.log('Sevice URL:' + serviceUrl);
        var reqUrl = "";

        if (demographic) reqUrl = serviceUrl + "token=" + token;
        else reqUrl = serviceUrl + "&token=" + token;
        reqUrl = reqUrl + '&SecurityToken=' + getCookie("securityToken") + '&Domain=duosoftware.com';

        $http({
            method: 'GET',
            url: reqUrl
        }).success(function (data, status) {
            if (data.Is_Success) callback(data.Result);
            else {
                if (data.Custom_Message == "Error validating access token: This may be because the user logged out or may be due to a system error.") {
                    $scope.resendConfirm($event, data.Custom_Message, serviceUrl, callback, demographic);
                }
            }

        }).error(function (data, status) {
            $scope.errorMessage = true;
            console.log('unexpected error occured');
        });
    };

    //confirming the resend request
    $scope.resendConfirm = function (ev, msg, url, cb, demographic) {
        console.log('test resendConfirm');
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
                          .parent(angular.element(document.body))
                          .title('Would you like to resend the request?')
                          .content(msg)
                          .ariaLabel('Lucky day')
                          .ok('Yes')
                          .cancel("No");
        $mdDialog.show(confirm).then(function() {
            console.log('test');
                    alert('test');
                         }, function() {
                            console.log('test1');
                         });



        // $mdDialog.show(confirm).then(function () {
        //     fbInterface.getFreshPage($scope.page.id, function (data) {
        //         getServiceResponse(url, data, cb, demographic);
        //     });
        // }, function () {
        //     $scope.status = 'You decided to keep your debt.';
        // });
    };

    //generate the chart
    var configSeries = [];

    function generateChart(data) {
        console.log('overview data' + JSON.stringify(data));
        configSeries = [];
        $scope.totalViews = 0;
        var colorObj = {
            'page_views': '#00796B',
            'page_fans': '#B2DFDB',
            'page_stories': '#FFC107'
        };
        data.forEach(function (entry) {
            $scope.configData = [];
            var seriesName = '';
            entry.data.forEach(function (value) {
                var x = value[0].split('T')[0];

                var enDate = x.split('-');

                if (entry.name == 'page_views') {
                    seriesName = 'Page Views';
                    $scope.totalViews += value[1];
                }

                if (entry.name == 'page_fans') {
                    seriesName = 'Page Likes';
                    if ( value[1] == null ){                            
                        $scope.totalLikes = 0;      
                    }       
                    else {      
                        $scope.totalLikes = value[1];       
                    }
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
                },
                plotOptions: {
                    column: {
                        borderWidth: 0,
                        groupPadding: 0,
                        shadow: !1,
                        pointPadding: .1
                    }
                }
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    format: '{value:%e. %b. %Y}'
                }          
            },
            yAxis: {
                lineWidth: 1
            },
            title: {
                text: ""
            },
            loading: !1
        };

        $scope.highchartsNG['series'] = configSeries;
    };

    //set the map
    function setMap(data) {
        $scope.arrAdds = [];
        for (var key in data.value) {
            if (Object.prototype.hasOwnProperty.call(data.value, key)) {
                $scope.arrAdds.push({
                    add: key,
                    likeCount: data.value[key]
                });
            }
        }

        $rootScope.$broadcast('getLocations', {
            addData: $scope.arrAdds
        });
    };

    /* service methods start */
    $scope.setPageOverview = function () {
        $scope.summaryChartLoading = true;
        $scope.fbClient.getPageOverview(function (data, status) {
            $scope.requestCount++;
            $scope.summaryChartLoading = false;
            status ? generateChart(data) : $scope.handleFailure({method: 'setPageOverview', error: data});
        });
    };

    $scope.paging = function (posts , length , index) {
        if ( index < length ){
            $scope.fbClient.getSentimentAnalysis(function (res, status) {
            if (status){
                if (index == length-1){
                    $scope.sentimentStatus = true; 
                }                
                $scope.setSentimentAnalysis(res);
                index++;
                $scope.paging(posts , length , index );                
            }
            else{
                $scope.handleFailure({method: 'setSentimentAnalysis', error: data});
                $scope.sentimentStatus = true;
            }
            }, JSON.stringify(posts[index]));            
        }
    };

    $scope.setPostSummary = function () {
        $scope.postSummaryLoading = true;
        $scope.fbClient.getPostSummary(function (data, status) {
            $scope.requestCount++;
            $scope.sentimentStatus = false;
            if (status) {
                var endWeek = moment().utc().valueOf();
                var startWeek = endWeek - 604800000;
                var date="";
                var d = data;            
                m = $scope.postSummaryRequest*25;                
                for ( var i = 0; i < data.length; i++){
                    $scope.postsObj.push(data[i]);
                    date = moment($scope.postsObj[i].created_time).utc().valueOf();
                    if ( $scope.newPage && !$scope.timeChanged ) {
                        if (date <= endWeek && date >= startWeek){
                            $scope.totalEngagement += $scope.postsObj[i].shares + $scope.postsObj[i].comments;
                            $scope.avgEngagement = (Math.round(($scope.totalEngagement / 7)*100)/100);
                        }
                    }
                    // $scope.totalEngagement += $scope.postsObj[i].shares + $scope.postsObj[i].comments;
                    // $scope.engageLikes += $scope.postsObj[i].likes;                    
                }
                $scope.postCount += data.length;
                for ( var z = m; z < m + data.length; z++ ){
                    $scope.postIds.push($scope.postsObj[z].id);
                }
                if ( d.length == 25 ){
                    var timeObj = {
                        sinceStamp : moment($scope.sinceDate).unix(),
                        untilStamp : moment(d[24].created_time).unix() - 86400
                    };
                    $scope.fbClient = $restFb.getClient($scope.page, timeObj);
                    $scope.postSummaryRequest++;   
                    $scope.setPostSummary();
                    $scope.sentimentStatus = true;
                }
                else {
                    var postArray = [];
                    if ( $scope.postIds.length <= 25){
                        postArray[0] = $scope.postIds;
                    }
                    else {
                        var index = 0;
                        for ( var i = 25; i < $scope.postIds.length; i = i+ 25){
                            var postId = [];
                            for ( var j = i - 25; j< i; j++){
                                postId.push($scope.postIds[j]);
                            }
                            postArray[index] = postId;
                            index++;
                        }
                        if ( $scope.postIds.length - j > 0){                
                            var postId = [];
                            for ( var x = j; x < $scope.postIds.length; x++){
                                postId.push($scope.postIds[x]);                                   
                                console.log(x);
                            }
                            postArray[index] = postId;               
                        }
                    }
                $scope.postSummaryLoading = false;                    
                $scope.paging(postArray , postArray.length , 0 );
            }
               
            } else {
                $scope.handleFailure({method: 'setPostSummary', error: data});
                $scope.sentimentGraphLoading = false;
                $scope.postSummaryLoading = false;
            }
        });
    };

    $scope.setSentimentAnalysis = function (data) {
            $scope.requestCount++;
                var sentIcons = {
                    'positive': 'styles/css/images/socialAnalysis/happyFace.png',
                    'negative': 'styles/css/images/socialAnalysis/sadFace.png',
                    'neutral': 'styles/css/images/socialAnalysis/neutralFace.png'
                };
                var j = $scope.sentimentRequest * 25;
                for (var i = j; i < j + data.length; i++) {

                        $scope.postsObj[i]['sentiment'] = {
                            "res": data[i-j].sentiment,
                            "pol": data[i-j].polarity,
                            "ico": sentIcons[data[i-j].sentiment]
                        };

                        var x = moment($scope.postsObj[i].created_time).format('YYYY-MM-DD');

                        var enDate = x.split('-');
                        $scope.sentimentConfigData.push([
                            Date.UTC(enDate[0], enDate[1] - 1, enDate[2]),
                            data[i-j].polarity
                        ]);
                        console.log(Date.UTC(enDate[0], enDate[1] - 1, enDate[2]));
                }
                $scope.sentimentRequest++;
                if ($scope.sentimentStatus){
                    $scope.sentimentConfigData.sort(function(a,b){return a[0] - b[0]});                    
                    $scope.sentimentGraphLoading = false;                        
                    var dataArray = [{
                        type: 'line',
                        name: 'Overall Sentiment',
                        data: $scope.sentimentConfigData,
                        color: '#FFC107'                    
                    }];

                    $scope.sentimentConfigSeries = dataArray;

                    $scope.sentimentConfig['series'] = $scope.sentimentConfigSeries;
                }
    };

    $scope.setWordCloud = function () {
        $scope.fbClient.getWordCloud(function (data, status) {
            $scope.requestCount++;
            if (status) {
                var wordObjArr = [];
                for (var key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) {
                        wordObjArr.push({
                            name: key,
                            val: data[key]
                        });
                    }
                }
                //clear word cloud canvas
                var canvasNode = document.getElementById("wordCanvas");
                while (canvasNode.firstChild) {
                    canvasNode.removeChild(canvasNode.firstChild);
                }
                $rootScope.$broadcast('getWordCloudData', {
                    wordData: wordObjArr
                });
                $scope.wordCloudLoading = false;
            } else {
                $scope.handleFailure({method: 'setWordCloud', error: data});
                $scope.wordCloudLoading = false;
            }
        });
    };

    $scope.setDemographicsinfo = function () {
        $scope.fbClient.getDemographicsinfo(function (data, status) {
            $scope.requestCount++;
            if (status) {
                $scope.arrAdds = [];
                setMap(data);
            } else {
                $scope.handleFailure({method: 'setDemographicsinfo', error: data});
            }
        });
    };
    /* service methods end */

    // handle failed services
    $scope.handleFailure = function (errObj) {
        if (errObj.error == "Error validating access token: This may be because the user logged out or may be due to a system error." || errObj.error == 'Error occurred while getting data from Facebook API')
            $scope.failedPool.push(errObj);
        // if ($scope.requestCount == 4) {
        //     // if ($scope.failedPool.length == 4) {
        //         var confirm = $mdDialog.confirm()
        //             .title('Would you like to resend the request?')
        //             .content('Error occurred while getting data from Facebook API')
        //             .ariaLabel('Lucky day')
        //             .targetEvent()
        //             .ok('Yes')
        //             .cancel('No');
        //         $mdDialog.show(confirm).then(function () {
        //             fbInterface.getFreshPage($scope.page.id, function (data) {
        //                 $scope.getPageDetails(data, $scope.timestamps, $scope.failedPool);
        //             });
        //         }, function () {
        //             $scope.status = 'You decided to keep your debt.';
        //         });

        //     // }
        // }
    };

    // watching for the request count
    $scope.$watch("failedPool", function (newValue, oldValue) {
        // if (newValue == 4){
            if (newValue.length == 4) {
                newValue = [];
                console.log('failed pool length:'+$scope.failedPool.length);
                var confirm = $mdDialog.confirm()
                    .title('Would you like to resend the request?')
                    .content('Error occurred while getting data from Facebook API')
                    .ariaLabel('Lucky day')
                    .targetEvent()
                    .ok('Yes')
                    .cancel('No');
                $mdDialog.show(confirm).then(function () {
                    console.log('sent request');
                    fbInterface.getFreshPage($scope.page.id, function (data) {
                        $scope.getPageDetails(data, $scope.timestamps, $scope.failedPool);
                    });
                }, function () {
                    $scope.status = 'You decided to keep your debt.';
                });
            }
        // } else if(newValue == 6){
        //     $scope.requestCount = 1;
        // }
    }, true);


    $scope.getPageDetails = function (page, pageTimestamps, reqPool, changedTime) {
        $scope.page  = page;
        //showing the page
        $scope.page = page;
        $scope.timestamps = pageTimestamps;
        $scope.activePageSearch = false;
        $scope.postSummaryLoading = false;
        $scope.fbClient = $restFb.getClient(page, pageTimestamps);
        $scope.postIds = []; 
        $scope.totalLikes = 0;
        $scope.newPage = true;
        $scope.engageLikes = 0;
        $scope.postCount = 0;
        $scope.requestCount = 0;
        $scope.postSummaryRequest = 0;
        $scope.sentimentRequest = 0;
        $scope.wordCloudLoading = true;
        $scope.sentimentGraphLoading = true;        
        $scope.totalViews = 0;
        $scope.failedPool = [];
        $scope.sentimentConfigData = [];
        $scope.sentimentConfigSeries = [];
        $scope.configData = [];
        $scope.postsObj = [];
        if ( $scope.newPage && !$scope.timeChanged ) {
            $scope.avgEngagement = 0;
            $scope.totalEngagement = 0;
            var untilDate = new Date();
            var secondDate = new Date();
            secondDate.setDate(untilDate.getDate() - 7);
            $scope.sinceDate = moment(secondDate).format('LL');
            $scope.untilDate = moment(untilDate).format('LL');
        }
        reqPool.forEach(function (key) {
            eval("$scope." + key.method + "()");
        });
    };
    //on load current page details
    $scope.page = null;
    $scope.activePageSearch = true;

    $scope.viewPageDetails = function (page) {
        $scope.preloader = false;
        $scope.errorMessage = false;
        $scope.preloader = true;
        $scope.getPageDetails(page, getBoundaryTimestamps(7, new Date()), $scope.defReqPool);
    };

    $scope.changeTimeRange = function () {
        $scope.timeChanged = true;
        var since = new Date($scope.sinceDate);
        var until = new Date($scope.untilDate);
        //alert(typeof(since));
        if (since > until) {
            ngToast.create({
                className: 'danger',
                content: "From Date should be less than the To Date",
                horizontalPosition: 'center',
                verticalPosition: 'top',
                dismissOnClick: true
            });
            return;
        }

        var timeObj = {
            sinceStamp: Math.floor(since / 1000),
            untilStamp: Math.floor(until / 1000)+86400
        };
        var sinceTime = moment(timeObj.untilStamp);
        var untilTime = moment(timeObj.sinceStamp);
        var diff = sinceTime.diff(untilTime);
        if ( diff > 8035200) {
            notifications.toast(0, "Please select a time range of 3 months or lesser!");
            return;
        }
        $scope.getPageDetails($scope.page, timeObj, $scope.defReqPool, true);
    };

    //Search fb page
    $scope.isSearchingPage = false;
    $scope.loginWithFb = function () {
        if (fbInterface.state != 'connected') {
            fbInterface.loginToFb($scope, true);
        } else {
            fbInterface.logoutFromFb($scope, true);
            $scope.activePageSearch = true;
            $scope.preloader = false;
        }
    };
    $scope.goBack = function () {
        $scope.timeChanged = false;
        $scope.activePageSearch = true;
        $scope.preloader = false;
    }

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


function viewMapTableCtrl($scope, $mdDialog, dataAry, pageName) {
    $scope.mapTblData = dataAry;
    $scope.closeDialog = function () {
        $mdDialog.hide();
    }
}

function singlePostCtrl($scope, fbPost) {
    $scope.myPost = fbPost;
};

function viewTableCtrl($scope, $mdDialog, jsonData, pageName) {
    $scope.tableData = jsonData;
    $scope.pageName = pageName;

    var cvtUnixToDate = function (unix) {
        return moment(unix).format('LL');
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
            var jsonObj = {
                'date': '',
                'like': ''
            };
            for (var b = 0; b < jsonData[i].data[c].length; b++) {
                if (b == 0) {
                    //date
                    var date = jsonData[i].data[c][b];
                    jsonObj.date = cvtUnixToDate(date);

                }
                if (b == 1) {
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

    $scope.viewTypes = [{
        name: 'Page Likes',
        value: 'l1'
    }, {
        name: 'Page Stories',
        value: 's2'
    }, {
        name: 'Page  Views',
        value: 'v3'
    }];

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


//onScroll change table hader
routerApp.directive("fixOnScroll", function () {
    return function (scope, element, attrs) {
        var fixedDiv = attrs.fixedDiv;
        element.bind("scroll", function () {
            if (element.scrollLeft()) {
                var leftPos = element.scrollLeft();
                $(fixedDiv).scrollLeft(leftPos);
            }
        });
    }
}).directive('datep', function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'MM d, yy',
                changeMonth: true,
                changeYear: true,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    }
});