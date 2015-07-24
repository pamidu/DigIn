/*
----------------------Summary-------------------------------
| all the individual widget settings controllers goes here |
------------------------------------------------------------
|      #facebook settings : fbInit                         |
|      #linkedIn settings : linkedInit                     |
|      #elastic settings  : elasticInit                    | 
|      #wordpress settings: wordpressInit                  |
|      #instagram settings: instaInit                      | 
|      #d3plugin settings : d3Init                         |
|      #sltskillwisecall  : sltskillInit                   |
|      #sltivr settings   : sltivrInit                     |
------------------------------------------------------------
*/
/*summary-
  fbInterface : (scripts/custom/fbInterface.js)
*/
 


function fbInit(scope, $mdDialog, widId, $rootScope) {

    scope.accounts = [];

    //get fb initial login state
    //scope.actIndicator = "false";
    fbInterface.getFbLoginState(scope);
    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
    //add or remove account from the scope
    scope.addAccount = function() {
        if (fbInterface.state != 'connected')
            fbInterface.loginToFb(scope);
        else
            fbInterface.logoutFromFb(scope);
    };

    //cancel config
    scope.cancel = function() {
        $mdDialog.hide();
    };

    
    scope.chartConf = {"options":{"chart":{"type":"area"},"plotOptions":{"series":{"stacking":""}}},"series":[{"name":"Like Count","data":[],"id":"series-0","type":"line","dashStyle":"ShortDashDot","connectNulls":false}],"title":{"text":"Page Likes"},"credits":{"enabled":false},"loading":false,"xAxis":{"type":"datetime","currentMin":0},"yAxis":{"min":0}};
    scope.chartConfView
 = {"options":{"chart":{"type":"area"},"plotOptions":{"series":{"stacking":""}}},"series":[{"name":"View Count","data":[],"id":"series-0","type":"area","dashStyle":"ShortDashDot","connectNulls":false,"color":"#FF5722"}],"title":{"text":"Page Views"},"credits":{"enabled":false},"loading":false,"xAxis":{"type":"datetime","currentMin":0},"yAxis":{"min":0}};


    //complete config  
    scope.finish = function() {
        var likeCountArray = [];
        var startingDayStr;
        var dateObj = {
            until: new Date(),
            range: 7
        }

        //getting page likes insights
        fbInterface.getPageLikesInsight(scope.fbPageModel,dateObj, function(data) {
        console.log("**************************************");
        console.log("Like history:"+JSON.stringify(data));
        var likeHistory = fbInterface.getPageLikesObj(data);
        scope.chartConf.series[0].data = likeHistory.likeArr;
        scope.chartConf.series[0].pointStart = Date.UTC(likeHistory.start.getUTCFullYear(),likeHistory.start.getUTCMonth(),likeHistory.start.getUTCDate());;
        scope.chartConf.series[0].pointInterval = likeHistory.interval;

        var obj = {
            pgData : scope.pageData,
            likeData : scope.chartConf
        };   
        $rootScope.dashboard.widgets[objIndex].widData = obj; 
        });

        //getting page views insights
        fbInterface.getPageViewsInsight(scope.fbPageModel,dateObj, function(data) {
        console.log("**************************************");
        console.log("View history:"+JSON.stringify(data));
        var viewHistory = fbInterface.getPageLikesObj(data);
         scope.chartConfView.series[0].data = viewHistory.likeArr;
         scope.chartConfView.series[0].pointStart = Date.UTC(viewHistory.start.getUTCFullYear(),viewHistory.start.getUTCMonth(),viewHistory.start.getUTCDate());;
         scope.chartConfView.series[0].pointInterval = viewHistory.interval;

        var obj = {
            pgData : scope.pageData,
            likeData : scope.chartConf,
            viewData : scope.chartConfView
        };   
        $rootScope.dashboard.widgets[objIndex].widData = obj; 
        });
        

        $mdDialog.hide();
    };

    scope.pageData = {};

    

    //selecting pages  
    scope.changePage = function() {
        //get page data on change
        fbInterface.getPageData(scope, function(data) {  
        scope.pageData = data;          
           // $rootScope.dashboard.widgets[objIndex].widData = data;
        });
    };
};

/*summary-
  linkedinInterface : (scripts/custom/linkedinInterface.js)
    */
function linkedInit(scope, $mdDialog, widId, $rootScope) {

    scope.accounts = [];

    //get linkedin initial login state
    linkedinInterface.getLinkedinState(scope);

    //add or remove account from the scope
    scope.addAccount = function() {
        if (!linkedinInterface.state)
            linkedinInterface.loginToLinkedin(scope);
        else
            linkedinInterface.logoutFromLinkedin(scope);
    };

    //cancel config
    scope.cancel = function() {
        $mdDialog.hide();
    };

    //complete config  
    scope.finish = function() {
        linkedinInterface.getUserAccountOverview(scope, function(data) {
            var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
            $rootScope.dashboard.widgets[objIndex].widData = data;
        });
        $mdDialog.hide();
    };
};


function YoutubeInit($scope, $http, $objectstore, $mdDialog, $rootScope, widId) {
    $scope.search = function() {
        this.listResults = function(data) {
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
 
        $http.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    key: 'AIzaSyAzf5VkNxCc-emzb5rujUSc9wSxoDla6AM',
                    type: 'video',
                    maxResults: '50',
                    part: 'id,snippet',
                    fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle,items/snippet/publishedAt,items/snippet/liveBroadcastContent,items/snippet/channelId,items/id/kind,items/id/videoId',
                    q: this.query
                }
            })
            .success(function(data) {
                VideosService.listResults(data);
                $log.info(data);
            })
            .error(function() {
                $log.info('Search error');
            });
    }

 
    $scope.tabulate = function(state) {
        $scope.playlist = state;
    }

}



//elastic controller
function elasticInit($scope, $http, $objectstore, $mdDialog, $rootScope, widId) {
    $scope.indexes = [];
    $scope.datasources = ['Object Store', 'Elastic search', 'CouchDB'];
    $scope.checkedFields = [];
    $scope.excelNamespace = "";
    $scope.excelClass = "";
    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
    $scope.widget = $rootScope.dashboard.widgets[objIndex];
    var client = $objectstore.getClient("com.duosoftware.com", " ");
    client.onGetMany(function(data) {
        if (data) {
            $scope.indexes = data;
        }
    });
    client.onError(function(data) {

    });

    $scope.alert = function() {
  
            $mdDialog.show({
                controller: 'successCtrl',
                templateUrl: 'views/file-success.html',
                resolve: {
 
                }
            })
        }
        //cancel config
    $scope.cancel = function() {
        $mdDialog.hide();
    };
    $scope.toggleCheck = function(index) {
        if ($scope.checkedFields.indexOf(index) === -1) {
            $scope.checkedFields.push(index);
        } else {
            $scope.checkedFields.splice($scope.checkedFields.indexOf(index), 1);
        }
    };
    client.getClasses("com.duosoftware.com");
    $scope.getFields = function() {
        $scope.selectedFields = [];
        var client = $objectstore.getClient("com.duosoftware.com", $scope.ind);
        client.onGetMany(function(data) {
            if (data) {
                data.forEach(function(entry) {
                    $scope.selectedFields.push({
                        name: entry,
                        checked: false
                    });

                });
            }
        });

        client.getFields("com.duosoftware.com", $scope.ind);
    }

    $scope.getData = function() {
        var parameter = "";
        $scope.QueriedData = [];
        for (param in $scope.checkedFields) {

            parameter += " " + $scope.checkedFields[param].name;
            $rootScope.header = [];
            $rootScope.header.push({
                name: $scope.checkedFields[param].name,
                field: $scope.checkedFields[param].name
            });
        }
        var client = $objectstore.getClient("com.duosoftware.com", "");
        client.onGetMany(function(data) {
            if (data) {
                $rootScope.DashboardData = [];
                $rootScope.DashboardData = data;
                $mdDialog.show({
                    controller: 'ShowTableCtrl',
                    templateUrl: 'views/data-explorer.html',


                })

            }
        });
        client.getSelected(parameter);
    }


    $scope.executeQuery = function(widget) {

        var client = $objectstore.getClient("com.duosoftware.com", "testJay");
        client.onGetMany(function(data) {
            if (data) {
                $rootScope.DashboardData = [];
                $rootScope.DashboardData = data;
                $mdDialog.show({
                    controller: 'ShowTableCtrl',
                    templateUrl: 'views/data-explorer.html',


                })

            }
        });
        client.getByFiltering(widget.query);
    }

    $scope.buildchart = function(widget) {

        var parameter = "";
        $scope.QueriedData = [];
        $scope.chartSeries = [];
        $rootScope.header = [];
        for (param in $scope.checkedFields) {

            parameter += " " + $scope.checkedFields[param].name;
            $rootScope.header.push({
                name: $scope.checkedFields[param].name,
                field: $scope.checkedFields[param].name
            });
        }

        var client = $objectstore.getClient("com.duosoftware.com", $scope.ind);
        client.onGetMany(function(datai) {
            if (datai) {

                $rootScope.DashboardData = [];
                $rootScope.DashboardData = datai;
                widget.chartConfig.series = [];

                widget.chartConfig.series = $rootScope.DashboardData.map(function(elm) {
                    var _fieldData = [];

                    _fieldData.push(parseInt(elm[widget.dataname]))
                    return {
                        name: elm[widget.seriesname],
                        data: _fieldData
                    };
                });
                widget.chartSeries = [];
                widget.chartSeries = widget.chartConfig.series;
 
            }
 
        });
        client.getSelected(parameter);
    }
};
 

function InitConfigD3($scope, $mdDialog, widId, $rootScope, $sce) {

    $scope.activitylist = [];

    $scope.activitylist.push({
        Name: "Population Pyramid",
        Description: "Population Pyramid",
        icon: "styles/css/images/icons/d3/Population_Pyramid.png",
        link: "http://bl.ocks.org/mbostock/raw/4062085/"
    });

    $scope.activitylist.push({
        Name: "Aster Plot",
        Description: "Aster Plot",
        icon: "styles/css/images/icons/d3/Aster_Plot.png",
        link: "http://bl.ocks.org/bbest/raw/2de0e25d4840c68f2db1/"
    });
    $scope.activitylist.push({
        Name: "The JellyFish",
        Description: "For any geographical data",
        icon: "styles/css/images/icons/d3/JellyFish.png",
        initTemplate: "fbInitConfig",
        initController: "fbInit",
        widView: "views/chartview.html"
    });
    $scope.activitylist.push({
        Name: "Bubble Chart",
        Description: "Bubble Chart",
        icon: "styles/css/images/icons/d3/bubble.png",
        link: "http://bl.ocks.org/mbostock/raw/4063269/"
    });

    $scope.activitylist.push({
        Name: "Show reel",
        Description: "Show reel",
        icon: "styles/css/images/icons/d3/showreel.png",
        link: "http://bl.ocks.org/mbostock/raw/1256572/"
    });

    $scope.activitylist.push({
        Name: "Chord Diagram",
        Description: "Chord Diagram",
        icon: "styles/css/images/icons/d3/chord.png",
        link: "http://bl.ocks.org/mbostock/raw/4062006/"
    });

    $scope.activitylist.push({
        Name: "Circle Packing",
        Description: "Circle Packing",
        icon: "styles/css/images/icons/d3/circle_packing.png",
        link: "http://bl.ocks.org/mbostock/raw/4063530/"
    });

    $scope.activitylist.push({
        Name: "Sunburst Partition",
        Description: "Sunburst Partition",
        icon: "styles/css/images/icons/d3/sunburst.png",
        link: "http://bl.ocks.org/mbostock/raw/4063423/"
    });
    $scope.activitylist.push({
        Name: "Tree Map",
        Description: "Tree Map",
        icon: "styles/css/images/icons/d3/treemao.png",
        link: "http://bl.ocks.org/mbostock/raw/4063582/"
    });

    $scope.activitylist.push({
        Name: "Voronoi Tessellation",
        Description: "Voronoi Tessellation",
        icon: "styles/css/images/icons/d3/vorony.png",
        link: "http://bl.ocks.org/mbostock/raw/4060366/"
    });

    $scope.activitylist.push({
        Name: "Hierarchical Edge Bundling",
        Description: "Hierarchical Edge Bundling",
        icon: "styles/css/images/icons/d3/hierarchial.png",
        link: "http://mbostock.github.io/d3/talk/20111116/bundle.html"
    });

    $scope.activitylist.push({
        Name: "Epicyclic Gearing",
        Description: "Epicyclic Gearing",
        icon: "styles/css/images/icons/d3/epicycling.png",
        link: "http://bl.ocks.org/mbostock/raw/1353700/"
    });

    $scope.activitylist.push({
        Name: "Collision Detection",
        Description: "Collision Detection",
        icon: "styles/css/images/icons/d3/collision.png",
        link: "http://mbostock.github.io/d3/talk/20111018/collision.html"
    });

    $scope.activitylist.push({
        Name: "Collapsible Force ",
        Description: "Collapsible Force ",
        icon: "styles/css/images/icons/d3/Collapsible_Force.png",
        link: "http://mbostock.github.io/d3/talk/20111116/force-collapsible.html"
    });

    $scope.activitylist.push({
        Name: "Zoomable Sunburst",
        Description: "Zoomable Sunburst",
        icon: "styles/css/images/icons/d3/Zoomable_Sunburst.png",
        link: "http://bl.ocks.org/mbostock/raw/4348373/"
    });


    $scope.activitylist.push({
        Name: "Google maps",
        Description: "Google maps",
        icon: "styles/css/images/icons/d3/sunburst.png",
        link: "http://bl.ocks.org/mbostock/raw/899711/"
    });
  

    $scope.trustSrc = function(src) {
 
    }
 

 
    $scope.cancel = function() {
        $mdDialog.hide();
    };

};



 
function wordpressInit($scope, $http, $mdDialog, widId, $rootScope) {

    //cancel config
    $scope.cancel = function() {
        $mdDialog.hide();
    };

    //complete config  
    $scope.finish = function() {
        var wpapi = "http://public-api.wordpress.com/rest/v1/sites/";
        var choice = "/posts";
        var callbackString = '/?callback=JSON_CALLBACK';
  
        var message = $http.jsonp(wpapi + $scope.wpdomain + choice + callbackString).
        success(function(data, status) {
            var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
            //console.log(JSON.stringify(data));
            var posts = data.posts;
 

            var trimmedPosts = [];
            var tempTitle = "";
 
            for (i = 0; i < posts.length; i++) {
                var obj = {
                    picURL: "",
                    authorName: "",
                    title: "",
                    comments: "",
                    likes: ""
                };
                obj.picURL = posts[i].author.avatar_URL;
                obj.authorName = posts[i].author.name;
                obj.title = posts[i].title;
                obj.comments = posts[i].comment_count;
                
                trimmedPosts.push(obj);
            }
            var trimmedObj = {};
            trimmedObj.posts = trimmedPosts;
            $rootScope.dashboard.widgets[objIndex].widData = trimmedObj;
            //$rootScope.dashboard.widgets[objIndex].widData = data;
        }).
        error(function(data, status) {
    
            console.log(message);
        });
        $mdDialog.hide();
    };

};


// todo...
 
function weatherInit(widId, $scope, $http, $rootScope, $mdDialog) {
    //cancel config
    $scope.cancel = function() {
        $mdDialog.hide();
    };

    //complete config  
    $scope.finish = function() {
        $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + $scope.locZip + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
 
    };

}
 
 
function instaInit($scope, $http, $window) {

    var clientId = 'f22d4c5be733496c88c0e97f3f7f66c7';
    var redirectUrl = 'http://duoworld.duoweb.info/DuoDiggin_pinterest/'
    
 
    if ($window.location.href.indexOf("access_token") == -1) {
        $window.location.href = baseUrl;
 
    } else {
        var access_token = $window.location.hash.substring(14);
                    console.log(data);       

 
    }


}

routerApp.controller('sltivrInit', function($scope, $mdDialog, $rootScope) {
     $scope.countTo = 349;
    $scope.countFrom = 0;

    $scope.reCount = function () {
        $scope.countFrom = Math.ceil(Math.random() * 300);
        $scope.countTo = Math.ceil(Math.random() * 7000) - Math.ceil(Math.random() * 600);
    };
}
 );
 