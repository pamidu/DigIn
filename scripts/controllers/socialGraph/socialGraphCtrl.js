/* Summary:
 note: some of the scope variables are initialized inside fbInterface
 */

routerApp.controller('socialGraphCtrl', function ($scope, config, fbGraphServices, $http, Digin_Engine_API3, $rootScope, $mdDialog) {

    $scope.totalLikes = 0;
    $scope.totalEngagement = 0;
   $scope.engageLikes = 0;
   
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
        type : 'datetime'
    },
    yAxis: {
        title: {
            text: "Polarity"
        },
        labels: {
            style: {
                color: "#fff",
                fontSize: "12px",
                fontFamily: "Ek Mukta, sans-serif",
                fontWeight: "200"
            },
            formatter: function () {
                return this.value
            }
        }
    },
    title: {
        text: ""
    },
    loading: !1
};

    $scope.fbPageInit = function () {
        fbInterface.getFbLoginState($scope, true);

    }

    $scope.searchPage = function (searchQuery) {
        fbInterface.getSearchedPages($scope, true, searchQuery);
    };

    //getting the service response
    // #demographic : bool true if the call from the demographic service because it doesn't have any other parameter
    function getServiceResponse(serviceUrl, token, callback, demographic) {
        console.log('Sevice URL:' + serviceUrl);
        var reqUrl = "";
        
        if(demographic) reqUrl = serviceUrl + "token=" + token;
        else reqUrl = serviceUrl + "&token=" + token;
        reqUrl = reqUrl + '&SecurityToken=' + getCookie("securityToken") + '&Domain=duosoftware.com';
        
        $http({
            method: 'GET',
            url: reqUrl
        }).success(function (data, status) {
            if(data.Is_Success) callback(data.Result);
            else {
                if(data.Custom_Message == "Error validating access token: This may be because the user logged out or may be due to a system error."){
                    $scope.resendConfirm($event, data.Custom_Message, serviceUrl, callback, demographic);
                }
            }
            
        }).error(function (data, status) {
            $scope.errorMessage = true;
            console.log('unexpected error occured');
        });
    };
    
    //confirming the resend request
    $scope.resendConfirm = function(ev, msg, url, cb, demographic) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Would you like to resend the request?')
              .textContent(msg)
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Yes')
              .cancel('No');
        $mdDialog.show(confirm).then(function() {
            fbInterface.getFreshPageAccessToken($scope.page.id, function(data){
                getServiceResponse(url, data, cb, demographic);
            });          
        }, function() {
          $scope.status = 'You decided to keep your debt.';
        });
      };

    //generate the chart
    var configSeries = [];

    function generateChart(data) {
        console.log('overview data' + JSON.stringify(data));
        configSeries = [];
        $scope.totalViews = 0;
        var colorObj = {'page_views': '#00796B', 'page_fans': '#B2DFDB', 'page_stories': '#FFFFFF'};
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
        $scope.arrAdds = [];
        for (var key in data.value) {
            if (Object.prototype.hasOwnProperty.call(data.value, key)) {
                $scope.arrAdds.push({add: key, likeCount: data.value[key]});
            }
        }

        $rootScope.$broadcast('getLocations', {addData: $scope.arrAdds});
    };

    $scope.getPageDetails = function(page, pageTimestamps, changedTime) {
      
      //showing the page
      $scope.page = page;
      if (!changedTime) $scope.activePageSearch = !$scope.activePageSearch;
      
      //getting page overview data 
      var serviceUrl = Digin_Engine_API3 + 'pageoverview?metric_names=[%27page_views%27,%27page_fans%27,%27page_stories%27]&since=' + pageTimestamps.sinceStamp + '&until=' + pageTimestamps.untilStamp;

      getServiceResponse(serviceUrl, page.accessToken, function(data) {
         console.log('chart data:' + JSON.stringify(data));
         generateChart(data);
      });
      
      //getting posts summary and sentiment data 
      serviceUrl = Digin_Engine_API3 + 'fbpostswithsummary?since=' + pageTimestamps.sinceStamp + '&until=' + pageTimestamps.untilStamp+'&page='+page.id;
      getServiceResponse(serviceUrl, page.accessToken, function(data) {
         console.log('posts:' + JSON.stringify(data));
         $scope.postsObj = data;            
         $scope.postCount = data.length;
         $scope.postIds = [];
         $scope.sentimentConfigData = [];
         var sentimentConfigSeries = [];
         $scope.postsObj.forEach(function(postEntry) {
            $scope.postIds.push(postEntry.id);
         });

         serviceUrl = Digin_Engine_API3 + 'sentimentanalysis?source=facebook&post_ids=' + JSON.stringify($scope.postIds);
            getServiceResponse(serviceUrl, page.accessToken, function(data) {
               var sentIcons = {
                  'positive': 'styles/css/images/socialAnalysis/happyFace.png',
                  'negative': 'styles/css/images/socialAnalysis/sadFace.png',
                  'neutral': 'styles/css/images/socialAnalysis/neutralFace.png'
               };
               
               //assuming the data retreived is in the same order of the $scope.postIds 
               for (i = 0; i < data.length; i++) {
                  $scope.postsObj[i]['sentiment'] = {
                     "res": data[i].sentiment,
                     "pol": data[i].polarity,
                     "ico": sentIcons[data[i].sentiment]
                  };
                  console.log("$scope.postsObj[i]['sentiment']");
                  console.log($scope.postsObj[i]['sentiment']);
                  
                  $scope.totalEngagement += $scope.postsObj[i].shares + $scope.postsObj[i].comments;
                  $scope.engageLikes += $scope.postsObj[i].likes;

                  var x = $scope.postsObj[i].created_time.split('T')[0];

                  var enDate = x.split('-');

                  $scope.sentimentConfigData.push([
                     Date.UTC(enDate[0], enDate[1] - 1, enDate[2]),
                     data[i].polarity
                  ]); //
               }

               sentimentConfigSeries.push({
                  type: 'line',
                  name: 'Overall Sentiment',
                  data: $scope.sentimentConfigData,
                  color: '#fff'
               });

               $scope.sentimentConfig['series'] = sentimentConfigSeries;

               console.log("post result:" + JSON.stringify($scope.postsObj));                  
            });
      });
      
      //getting the data for the word cloud 
      serviceUrl = Digin_Engine_API3 + 'buildwordcloudFB?source=facebook';
      getServiceResponse(serviceUrl, page.accessToken, function(data) {
         var wordObjArr = [];
         for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
               wordObjArr.push({
                  name: key,
                  val: data[key]
               });
            }
         }

         $rootScope.$broadcast('getWordCloudData', {
            wordData: wordObjArr
         });               
      });
      
      //getting location data for the map      
      serviceUrl = Digin_Engine_API3 + 'demographicsinfo?';
      getServiceResponse(serviceUrl, page.accessToken, function(data) {
         $scope.arrAdds = [];
         setMap(data);
      }, true);
   };
    //on load current page details
    $scope.page = null;
    $scope.activePageSearch = true;

    $scope.viewPageDetails = function (page) {
        $scope.preloader = false;   
        $scope.errorMessage = false;
        $scope.untilDate = new Date();
        var secondDate = new Date();
        secondDate.setDate($scope.untilDate.getDate() - 60);
        $scope.sinceDate = secondDate;
        $scope.preloader = true;
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
            $scope.activePageSearch = true;
            $scope.preloader = false;
        }
    };
    $scope.goBack = function(){
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
});