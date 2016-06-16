/*
 ----------------------Summary-------------------------------
 | all the individual widget settings controllers goes here |
 ------------------------------------------------------------
 |      #facebook settings  : fbInit                        |
 |      #linkedIn settings  : linkedInit                    |
 |      #elastic settings   : elasticInit                   |
 |      #wordpress settings : wordpressInit                 |
 |      #d3plugin settings  : d3Init                        |
 |      #sltskillwisecall   : sltskillInit                  |
 |      #sltivr settings    : sltivrInit                    |
 |      #adsense settings   : adsenseInit                   |
 |      #google cal settings: calendarInit                  |
 |      #matrix wid settings: metricInit                    |
 |      #real time settings : realtimeInit                  |
 ------------------------------------------------------------
 */
/*summary-
 fbInterface : (scripts/custom/fbInterface.js)
 */
routerApp.controller('fbInit',['$scope', '$mdDialog', 'widgetID', '$rootScope',function ($scope, $mdDialog, widgetID, $rootScope) {

    $scope.diginLogo = 'digin-logo-wrapper2';
    $scope.showFinishButton = false;
    $scope.accounts = [];
    //get fb initial login state
    //scope.actIndicator = "false";
    fbInterface.getFbLoginState($scope);
    var objIndex = getRootObjectById(widgetID, $rootScope.dashboard.widgets);
    //add or remove account from the scope
    $scope.addAccount = function() {
        if (fbInterface.state != 'connected')
            fbInterface.loginToFb($scope);
        else
            fbInterface.logoutFromFb($scope);
    };
    $scope.finish = function(){
        $scope.showFinishButton = false;
        $mdDialog.hide();
    }
    //cancel config
    $scope.cancel = function() {
        $mdDialog.cancel();
    };


    $scope.chartConfView = {
        "options": {
            "chart": {
                "type": "area"
            },
            "plotOptions": {
                "series": {
                    "stacking": "",
                    "turboThreshold": 5000,
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
    $scope.chartConf = {
        "options": {
            "chart": {
                "type": "area"
            },
            "plotOptions": {
                "series": {
                    "stacking": "",
                    "turboThreshold": 5000,
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
    $scope.chartConfView = {
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


    //complete config  
    $scope.fetch = function() {
        $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
        var likeCountArray = [];
        var startingDayStr;
        var dateObj = {
            until: new Date(),
            range: 7
        }

        //getting page likes insights
        fbInterface.getPageLikesInsight($scope.fbPageModel, dateObj, function(data) {

            var likeHistory = fbInterface.getPageLikesObj(data);
            $scope.chartConf.series[0].data = likeHistory.likeArr;
            $scope.chartConf.series[0].pointStart = Date.UTC(likeHistory.start.getUTCFullYear(), likeHistory.start.getUTCMonth(), likeHistory.start.getUTCDate());;
            $scope.chartConf.series[0].pointInterval = likeHistory.interval;

            // var obj = {
            //     pgData: $scope.pageData,
            //     likeData: $scope.chartConf
            // };
            // $rootScope.dashboard.widgets[objIndex].widData = obj;
        });

        //getting page views insights
        fbInterface.getPageViewsInsight($scope.fbPageModel, dateObj, function(data) {

            var viewHistory = fbInterface.getPageLikesObj(data);
            $scope.chartConfView.series[0].data = viewHistory.likeArr;
            $scope.chartConfView.series[0].pointStart = Date.UTC(viewHistory.start.getUTCFullYear(), viewHistory.start.getUTCMonth(), viewHistory.start.getUTCDate());;
            $scope.chartConfView.series[0].pointInterval = viewHistory.interval;

            // var obj = {
            //     pgData: $scope.pageData,
            //     likeData: $scope.chartConf,
            //     viewData: $scope.chartConfView
            // };
            // $rootScope.dashboard.widgets[objIndex].widData = obj;
            var obj = {
                pgData: $scope.pageData,
                likeData: $scope.chartConf,
                viewData: $scope.chartConfView
            };
            $rootScope.dashboard.widgets[objIndex].widData = obj;
            $scope.showFinishButton = true;
            $scope.diginLogo = 'digin-logo-wrapper2';
        });

        
    }; 

    $scope.pageData = {};

    //selecting pages
    $scope.changePage = function() {
        //get page data on change
        fbInterface.getPageData($scope, function(data) {
            $scope.pageData = data;
            // $rootScope.dashboard.widgets[objIndex].widData = data;
        });
    };
}]);



/*summary-
 linkedinInterface : (scripts/custom/linkedinInterface.js)
 */
 routerApp.controller('linkedInit',['$scope', '$mdDialog', 'widgetID', '$rootScope',function ($scope, $mdDialog, widgetID, $rootScope) {

    $scope.diginLogo = 'digin-logo-wrapper2';
    $scope.showFinishButton = false;
    $scope.accounts = [];

    //get linkedin initial login state
    linkedinInterface.getLinkedinState($scope);
    
    //add or remove account from the scope
    $scope.addAccount = function() {
        if (!linkedinInterface.state)
            linkedinInterface.loginToLinkedin($scope);
        else
            linkedinInterface.logoutFromLinkedin($scope);
    };
    //cancel config
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    //finish
    $scope.finish = function(){
        $scope.showFinishButton = false;
        $mdDialog.hide();
    }       
    //complete config  
    $scope.fetch = function() {
        $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
        linkedinInterface.getUserAccountOverview($scope, function(data) {
            var objIndex = getRootObjectById(widgetID, $rootScope.dashboard.widgets);
            $rootScope.dashboard.widgets[objIndex].widData = data;
            $scope.diginLogo = 'digin-logo-wrapper2';
            $scope.showFinishButton = true;
        });
    };
}]);

routerApp.controller('TwitterInit',['$scope', '$http', '$mdDialog', 'widgetID', '$rootScope', '$q', 'twitterServiceWidget',function ($scope, $http, $mdDialog, widgetID, $rootScope, $q, twitterServiceWidget) {

    $scope.diginLogo = 'digin-logo-wrapper2';
    $scope.showFinishButton = false;
    $scope.connectedTwitter = false;

    $scope.cancel = function() {
        $mdDialog.hide();
    };

    twitterServiceWidget.initialize();

    //using the OAuth authorization result get the latest 20 tweets from twitter for the user
    $scope.refreshTimeline = function(maxId) {

        $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
        twitterServiceWidget.getLatestTweets(maxId).then(function(data) {

            var selectedPage = $rootScope.selectedPage;
            var pages = $rootScope.dashboard.pages;
            var objIndex = getRootObjectById(widgetID, pages[selectedPage-1].widgets);

            pages[selectedPage-1].widgets[objIndex].widgetData.widData.tweets = data;

            $scope.showFinishButton = true;
            $scope.diginLogo = 'digin-logo-wrapper2';
        }, function() {
            
        });
    }

    //when the user clicks the connect twitter button, the popup authorization window opens
    $scope.signIn = function() {
        
        twitterServiceWidget.connectTwitter().then(function() {
            if (twitterServiceWidget.isReady()) {
                //if the authorization is successful, hide the connect button and display the tweets
 
                    $scope.connectedTwitter = true;
                    $scope.refreshTimeline();
            } else {


            }
        });
    }

    //sign out clears the OAuth cache, the user will have to reauthenticate when returning
    $scope.signOut = function() {

        twitterServiceWidget.clearCache();

        $scope.connectedTwitter = false;
        $scope.showFinishButton = false;
    }

    // if (twitterService.isReady()) {

    //     $scope.connectedTwitter = true;
    //     $scope.refreshTimeline();
    // }

}]);

routerApp.controller('analyticsInit',['$scope', '$http', '$mdDialog', 'widgetID', '$rootScope',function ($scope, $http, $mdDialog, widgetID, $rootScope) {

    var objIndex = getRootObjectById(widgetID, $rootScope.dashboard.widgets);

    $scope.cancel = function() {
        $mdDialog.hide();
    };
    $scope.finish = function() {
        $mdDialog.hide();
    };

    $rootScope.charts = [{
            reportType: 'ga',
            query: {
                metrics: 'ga:sessions',
                dimensions: 'ga:date',
                'start-date': '30daysAgo',
                'end-date': 'yesterday'
            },
            chart: {
                container: 'chart-container-1',
                type: 'LINE',
                options: {
                    width: '100%'
                }
            }

            // $rootScope.dashboard.widgets[objIndex].widData = $rootScope.charts;
        },

        {
            reportType: 'ga',
            query: {
                metrics: 'ga:sessions',
                dimensions: 'ga:browser',
                'start-date': '30daysAgo',
                'end-date': 'yesterday'
            },
            chart: {
                container: 'chart-container-2',
                type: 'PIE',
                options: {
                    width: '100%',
                    is3D: true,
                    title: 'Browser Usage'
                }
            }
            // $rootScope.dashboard.widgets[objIndex].widData = $rootScope.charts;
        }
    ];

    $rootScope.extraChart = {
        reportType: 'ga',
        query: {
            metrics: 'ga:sessions',
            dimensions: 'ga:date',
            'start-date': '30daysAgo',
            'end-date': 'yesterday',
            ids: 'ga: ' // put your viewID here
        },
        chart: {
            container: 'chart-container-3',
            type: 'LINE',
            options: {
                width: '100%'
            }
        }
    };

    $rootScope.queries = [{
        query: {
            ids: 'ga: ', // put your viewID here ga:81197147, 106493238
            metrics: 'ga:sessions',
            dimensions: 'ga:city'
        }
    }];

    // if a report is ready
    $rootScope.$on('$gaReportSuccess', function(e, report, element) {

    });


    $rootScope.dashboard.widgets[objIndex].widAna = $rootScope.charts;

    $rootScope.dashboard.widgets[objIndex].widAque = $rootScope.queries;

    $rootScope.dashboard.widgets[objIndex].widAexc = $rootScope.extraChart;

}]);

routerApp.controller('YoutubeInit',['$scope', '$http', '$mdDialog', 'widgetID', '$rootScope', '$log', 'VideosService',function ($scope, $http, $mdDialog, widgetID, $rootScope, $log, VideosService) {

    $scope.diginLogo = 'digin-logo-wrapper2';
    $scope.showFinishButton = false;
    
    $scope.cancel = function() {
        $mdDialog.hide();
    };
    $scope.finish = function() {
        $scope.showFinishButton = false;
        $mdDialog.hide();
    }

    function init() {
        $scope.youtube = VideosService.getYoutube();
        $scope.results = VideosService.getResults();
        $scope.upcoming = VideosService.getUpcoming();
        $scope.history = VideosService.getHistory();
        $scope.playlist = true;

    }

    $scope.launch = function(id, title) {
        VideosService.launchPlayer(id, title);
        VideosService.archiveVideo(id, title);
        VideosService.deleteVideo($scope.upcoming, id);
        $log.info('Launched id:' + id + ' and title:' + title);
    };

    $scope.queue = function(id, title) {
        VideosService.queueVideo(id, title);
        VideosService.deleteVideo($scope.history, id);
        $log.info('Queued id:' + id + ' and title:' + title);
    };

    $scope.delete = function(list, id) {
        VideosService.deleteVideo(list, id);
    };

    $scope.fetch = function() {
        $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
        $http.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    key: 'AIzaSyAzf5VkNxCc-emzb5rujUSc9wSxoDla6AM',
                    type: 'video',
                    maxResults: '50',
                    part: 'id,snippet',
                    fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle,items/snippet/publishedAt,items/snippet/liveBroadcastContent,items/snippet/channelId,items/id/kind,items/id/videoId',
                    q: this.query
                }
        }).success(function(data) {
                VideosService.listResults(data);

                var selectedPage = $rootScope.selectedPage;
                var pages = $rootScope.dashboard.pages;
                var objIndex = getRootObjectById( widgetID, pages[selectedPage-1].widgets);

                pages[selectedPage-1].widgets[objIndex].widgetData.widData = data;

                $scope.showFinishButton = true;
                $scope.diginLogo = 'digin-logo-wrapper2';
        }).error(function() {
                $log.info('Search error');
                $scope.showFinishButton = false;
                $scope.diginLogo = 'digin-logo-wrapper2';
        });
    }

    $scope.tabulate = function(state) {
        $scope.playlist = state;
    }

}]);
//real time widget with python service
routerApp.controller('realtimeInit',['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', 'widgetID', '$mdToast', '$timeout', 'DynamicVisualization',function ($scope, $http, $objectstore, $mdDialog, $rootScope, widgetID, $mdToast, $timeout, DynamicVisualization) {


}]);
//new elastic controller
routerApp.controller('elasticInit',['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', 'widgetID', '$mdToast', '$timeout', 'Digin_Engine_API',function ($scope, $http, $objectstore, $mdDialog, $rootScope, widgetID, $mdToast, $timeout, Digin_Engine_API) {

    $scope.filterAttributes = ['Sum', 'Average', 'Percentage', 'Count'];
    $scope.datasources = ['DuoStore', 'BigQuery', 'CSV/Excel', 'Rest/SOAP Service', 'SpreadSheet']; //temporary
    $scope.storeIndex = 'com.duosoftware.com';
    $scope.widgetValidity = 'elasticValidation'; //validation message visibility                                             
    $scope.query = {};
    $scope.query.state = false;
    $scope.query.drilled = false;
    $scope.checkedFields = [];
    $scope.dataIndicator = false;
    $scope.dataIndicator1 = false;
    $scope.categoryVal = "";
    $scope.mappedArray = {};
    $scope.chartTypes = [{
        name: "Area",
        type: "area"
    }, {
        name: "Smooth area",
        type: "areaspline"
    }, {
        name: "Line",
        type: "line"
    }, {
        name: "Smooth line",
        type: "spline"
    }, {
        name: "Column",
        type: "column"
    }, {
        name: "Bar",
        type: "bar"
    }, {
        name: "Pie",
        type: "pie"
    }, {
        name: "Scatter",
        type: "scatter"
    }];

    $scope.chartCategory = {
        groupField: '',
        drilledField: '',
        drilledArray: []
    };
    $scope.dataTab = true;
    $scope.chartTab = true;
    $scope.seriesAttributes = [];

    //getting the widget object
    var objIndex = getRootObjectById(widgetID, $rootScope.dashboard.widgets);
    $scope.widget = $rootScope.dashboard.widgets[objIndex];

    $scope.getTables = function() {

        if ($scope.datasource == "DuoStore") {
            var client = $objectstore.getClient($scope.storeIndex, " ");

            client.getClasses($scope.storeIndex);

            //classes retrieved
            client.onGetMany(function(data) {
                if (data.length > 0) $scope.objClasses = data;
                else console.log('There are no classes present');
            });

            //error getting classes from the index
            client.onError(function(data) {
                console.log('Error getting classes');
            });
        } else if ($scope.datasource == "BigQuery") {

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function(e) {
                console.log(this);
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log('query response:' + JSON.parse(xhr.response));
                        var res = JSON.parse(xhr.response);
                        var tableArray = [];
                        $scope.objClasses = res;
                        console.log(res.length);
                    } else {
                        console.error("XHR didn't work: ", xhr.status);
                    }
                }
            }
            xhr.ontimeout = function() {
                console.error("request timedout: ", xhr);
            }
            xhr.open("get", Digin_Engine_API + "GetTables?dataSetID=digin_hnb", /*async*/ true);
            xhr.send();
        }
    };

    if (typeof $scope.widget.widConfig == 'undefined') {

        $scope.seriesArray = [{
            name: 'series1',
            serName: '',
            filter: '',
            type: 'area',
            color: ''
        }];

    } else {
        //source tab config
        $scope.objClasses = $scope.widget.widConfig.classArray;
        $scope.datasource = $scope.widget.widConfig.source;
        $scope.selectedClass = $scope.widget.widConfig.selectedClass;

        //selection tab config
        $scope.dataTab = false;
        $scope.selectedFields = $scope.widget.widConfig.fields;
        $scope.checkedFields = $scope.widget.widConfig.selFields;

        //mapping tab config 
        $scope.chartTab = false;
        $scope.mappedArray = $scope.widget.widConfig.mappedData;
        $scope.chartCategory = $scope.widget.widConfig.chartCat;
        $scope.arrayAttributes = $scope.widget.widConfig.attributes;
        $scope.classFields = $scope.widget.widConfig.claFields;
        $scope.indexType = $scope.widget.widConfig.indType;
        $scope.query = $scope.widget.widConfig.query;
        $scope.seriesArray = $scope.widget.widConfig.series;
        $scope.seriesAttributes = $scope.widget.widConfig.serAttributes;
    }

    //check for selected classes
    $scope.getFields = function() {
        $scope.selectedFields = [];
        if ($scope.datasource == "DuoStore") {
            $scope.dataIndicator1 = true;
            if ($scope.selectedClass != null) {
                $scope.indexType = $scope.selectedClass;
                var client1 = $objectstore.getClient($scope.storeIndex, $scope.indexType);
                client1.getFields($scope.storeIndex, $scope.indexType);

                //class's fields retrieved
                client1.onGetMany(function(data) {
                    if (data.length > 0) {
                        data.forEach(function(entry) {
                            $scope.selectedFields.push({
                                name: entry,
                                checked: false
                            });
                        });

                        //change the tab
                        $scope.toggleTab(1);
                        $scope.widgetValidity = 'fade-out';
                    } else console.log('There are no fields present in the class');
                    $scope.dataIndicator1 = false;
                });

                //error getting fields from the class
                client1.onError(function(data) {
                    console.log('Error getting fields');
                });
            } else {
                $scope.widgetValidity = 'fade-in';
                $scope.validationMessage = "Please select a class";
            }
        } else if ($scope.datasource == "BigQuery") {
            if ($scope.selectedClass != null) {
                $scope.indexType = $scope.selectedClass;
                var fieldData = ($scope.selectedClass.split(':')[1]).split('.');
                $scope.bigQueryFieldDetails = fieldData;
                $scope.dataIndicator1 = true;

                $http({
                    method: 'GET',
                    url: Digin_Engine_API + 'GetFields?datasetName=' + fieldData[0] + '&&tableName=' + fieldData[1],
                }).
                success(function(data, status) {
                    if (data.length > 0) {
                        data.forEach(function(entry) {
                            $scope.selectedFields.push({
                                name: entry,
                                checked: false
                            });
                        });

                        //change the tab
                        $scope.toggleTab(1);
                        $scope.widgetValidity = 'fade-out';
                    } else console.log('There are no fields present in the class');
                    $scope.dataIndicator1 = false;
                }).
                error(function(data, status) {
                    alert("Request failed");

                });
            } else {
                $scope.widgetValidity = 'fade-in';
                $scope.validationMessage = "Please select a class";
            }

        } else if ($scope.datasource == "CSV/Excel") {
            var jsonArray = JSON.parse($rootScope.json_string);
            $scope.selectedFields = [];


            var obj = jsonArray[0];
            for (var j in obj) {
                $scope.selectedFields.push({
                    name: j,
                    checked: false
                });
            }

            $scope.toggleTab(1);
            $scope.widgetValidity = 'fade-out';
        } else if ($scope.datasource == "BigQuery") {
            // get the fields of the selected big query
        }
    };

    //selects fields for non-queried data retrieval
    $scope.toggleCheck = function(index) {
        index.checked = !index.checked;
        if ($scope.checkedFields.indexOf(index) === -1) {
            $scope.checkedFields.push(index);
        } else {
            $scope.checkedFields.splice($scope.checkedFields.indexOf(index), 1);
        }
    };

    $scope.getData = function() {

        var w = new Worker("scripts/webworkers/elasticWorker.js");
        var w1 = new Worker("scripts/webworkers/bigQueryWorker.js");
        var parameter = '';

        if ($scope.checkedFields.length != 0 || typeof $scope.query.value != "undefined") {
            $scope.classFields = $scope.checkedFields;
            $scope.classQuery = $scope.query.value;

            if ($scope.query.state) {
                parameter = $scope.classQuery;
            } else {
                for (param in $scope.classFields) {
                    parameter += " " + $scope.classFields[param].name;
                }
                parameter += " " + $scope.categoryVal;
            }

            $scope.dataIndicator = true;

            function mapRetrieved(event) {
                var obj = JSON.parse(event.data);
                console.log(JSON.stringify(obj));
                $scope.dataIndicator = false;

                //creating the array to map dynamically
                $scope.arrayAttributes = [];
                for (var key in obj[0]) {
                    if (Object.prototype.hasOwnProperty.call(obj[0], key)) {
                        var val = obj[0][key];
                        console.log(key);
                        $scope.mappedArray[key] = {
                            name: key,
                            data: [],
                            unique: 0,
                            isNaN: true
                        };
                        $scope.arrayAttributes.push(key);
                    }
                }

                //mapping the dynamically created array
                for (i = 0; i < obj.length; i++) {
                    for (var key in obj[i]) {
                        if (Object.prototype.hasOwnProperty.call(obj[i], key)) {
                            var val = obj[i][key];
                            var parsedVal = parseFloat(val);
                            if (!isNaN(parsedVal)) {
                                $scope.mappedArray[key].data.push(parsedVal);
                                $scope.mappedArray[key].isNaN = false;
                            } else {
                                $scope.mappedArray[key].data.push(val);
                            }
                        }
                    }
                }

                //getting the unique score to determine the hierarchy
                for (var key in $scope.mappedArray) {
                    if (Object.prototype.hasOwnProperty.call($scope.mappedArray, key)) {
                        if ($scope.mappedArray[key].isNaN) {
                            $scope.mappedArray[key].unique = Enumerable.From($scope.mappedArray[key].data).Select().Distinct().ToArray().length;
                        }
                    }
                }

                $scope.toggleTab(2);
            };

            if ($scope.datasource == "DuoStore" || $scope.datasource == "BigQuery") {

                if ($scope.datasource == "BigQuery") {
                    w1.postMessage(parameter + "," + $scope.bigQueryFieldDetails.toString() + "," + $scope.query.state);
                    w1.addEventListener('message', function(event) {
                        mapRetrieved(event);
                    });

                    $scope.widgetValidity = 'fade-out';
                } else {
                    w.postMessage($scope.indexType + "," + parameter + "," + $scope.query.state);
                    w.addEventListener('message', function(event) {
                        mapRetrieved(event);
                    });

                    $scope.widgetValidity = 'fade-out';
                }

            } else if ($scope.datasource == "CSV/Excel") {
                var obj = JSON.parse($rootScope.json_string);
                console.log(JSON.stringify(obj));
                $scope.dataIndicator = false;

                //creating the array to map dynamically
                $scope.arrayAttributes = [];
                for (var key in obj[0]) {
                    if (Object.prototype.hasOwnProperty.call(obj[0], key)) {
                        var val = obj[0][key];
                        console.log(key);
                        $scope.mappedArray[key] = {
                            name: key,
                            data: [],
                            unique: 0,
                            isNaN: true
                        };
                        $scope.arrayAttributes.push(key);
                    }
                }

                //mapping the dynamically created array
                for (i = 0; i < obj.length; i++) {
                    for (var key in obj[i]) {
                        if (Object.prototype.hasOwnProperty.call(obj[i], key)) {
                            var val = obj[i][key];
                            var parsedVal = parseFloat(val);
                            if (!isNaN(parsedVal)) {
                                $scope.mappedArray[key].data.push(parsedVal);
                                $scope.mappedArray[key].isNaN = false;
                            } else {
                                if (typeof $scope.mappedArray[key] != 'undefined') {
                                    $scope.mappedArray[key].data.push(val);
                                }
                            }
                        }
                    }
                }

                //getting the unique score to determine the hierarchy
                for (var key in $scope.mappedArray) {
                    if (Object.prototype.hasOwnProperty.call($scope.mappedArray, key)) {
                        if ($scope.mappedArray[key].isNaN) {
                            $scope.mappedArray[key].unique = Enumerable.From($scope.mappedArray[key].data).Select().Distinct().ToArray().length;
                        }
                    }
                }

                $scope.toggleTab(2);

            }

        } else {
            if ($scope.query.state) $scope.validationMessage = "Please add a query for data retrieval";
            else $scope.validationMessage = "Please select fields for data retrieval";
            $scope.widgetValidity = 'fade-in';
        }

    };

    //builds the chart
    $scope.buildchart = function(widget) {
        widget.chartSeries = [];

        if ($scope.chartCategory.groupField != '') {
            $scope.widgetValidity = 'fade-out';
            if ($scope.seriesArray[0].serName != '') {
                if ($scope.query.drilled) {
                    if ($scope.chartCategory.drilledField != '') {
                        $scope.orderByDrilledCat(widget);
                        $mdDialog.hide();
                        $scope.widgetValidity = 'fade-out';
                    } else {
                        $scope.validationMessage = "Please select the category to drill-down from";
                        $scope.widgetValidity = 'fade-in';
                    }
                } else {
                    $scope.orderByCat(widget);
                    $mdDialog.hide();
                    $scope.widgetValidity = 'fade-out';
                }
            } else {
                $scope.validationMessage = "Please select a series";
                $scope.widgetValidity = 'fade-in';
            }
        } else {
            $scope.validationMessage = "Please select a category";
            $scope.widgetValidity = 'fade-in';
        }
    }

    //order by category
    $scope.orderByCat = function(widget) {

        var cat = Enumerable.From(eval('$scope.mappedArray.' + $scope.chartCategory.groupField + '.data')).Select().Distinct().ToArray();
        var orderedObjArray = [];

        for (i = 0; i < $scope.seriesArray.length; i++) {
            var serMappedData = eval('$scope.mappedArray.' + $scope.seriesArray[i].serName + '.data');
            var catMappedData = eval('$scope.mappedArray.' + $scope.chartCategory.groupField + '.data');

            var orderedArrayObj = {};
            var orderedObj = {};
            var data = [];
            for (k = 0; k < cat.length; k++) {
                orderedObj[cat[k]] = {
                    val: 0,
                    count: 0
                };
            }

            if (typeof $scope.filtering == 'undefined') {
                $scope.filterData($scope.seriesArray[i].filter);
            }
            $scope.filtering.calculate(orderedObj, catMappedData, serMappedData);
            // for(j=0;j<serMappedData.length;j++){
            //     orderedObj[catMappedData[j]] += serMappedData[j];
            // }

            for (var key in orderedObj) {
                if (Object.prototype.hasOwnProperty.call(orderedObj, key)) {
                    data.push({
                        name: key,
                        y: orderedObj[key].val
                    });
                }
            }

            orderedArrayObj["data"] = data;
            orderedArrayObj["name"] = $scope.seriesArray[i].name;
            orderedArrayObj["color"] = $scope.seriesArray[i].color;
            orderedArrayObj["type"] = $scope.seriesArray[i].type;
            orderedObjArray.push(orderedArrayObj);
        }

        widget.highchartsNG = {
            options: {
                drilldown: {
                    drillUpButton: {
                        relativeTo: 'plotBox',
                        position: {
                            y: 0,
                            x: 0
                        },
                        theme: {
                            fill: 'white',
                            'stroke-width': 1,
                            stroke: 'silver',
                            r: 0,
                            states: {
                                hover: {
                                    fill: '#303F9F'
                                },
                                select: {
                                    stroke: '#039',
                                    fill: '#303F9F'
                                }
                            }
                        }

                    },
                    series: [],
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            depth: 35,
                            dataLabels: {
                                enabled: true,
                            },
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function() {
                                        alert('rawr');
                                    }
                                }
                            }
                        }
                    }

                }
            },
            xAxis: {
                type: 'category'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },

            series: orderedObjArray,
            title: {
                text: ''
            },
            size: {
                width: 300,
                height: 220
            }
        };

        widget['widConfig'] = {
            source: $scope.datasource,
            classArray: $scope.objClasses,
            selectedClass: $scope.selectedClass,
            fields: $scope.selectedFields,
            selFields: $scope.checkedFields,
            claFields: $scope.classFields,
            chartCat: $scope.chartCategory,
            attributes: $scope.arrayAttributes,
            indType: $scope.indexType,
            query: $scope.query,
            series: $scope.seriesArray,
            serAttributes: $scope.seriesAttributes,
            mappedData: $scope.mappedArray

        };
    };

    //order by category (drilled)
    $scope.orderByDrilledCat = function(widget) {
        var drilledSeries = [];
        var cat = Enumerable.From(eval('$scope.mappedArray.' + $scope.chartCategory.groupField + '.data')).Select().Distinct().ToArray();
        var orderedObjArray = [];
        var drilledCat = Enumerable.From(eval('$scope.mappedArray.' + $scope.chartCategory.drilledField + '.data')).Select().Distinct().ToArray();

        for (i = 0; i < $scope.seriesArray.length; i++) {
            var serMappedData = eval('$scope.mappedArray.' + $scope.seriesArray[i].serName + '.data');
            var catMappedData = eval('$scope.mappedArray.' + $scope.chartCategory.groupField + '.data');
            var drillData = eval('$scope.mappedArray.' + $scope.chartCategory.drilledField + '.data');

            var orderedArrayObj = {};
            var orderedObj = {};
            var drilledObj = {};
            var data = [];

            for (k = 0; k < cat.length; k++) {

                orderedObj[cat[k]] = {
                    val: 0,
                    arr: []
                };
            }

            for (k = 0; k < drilledCat.length; k++) {
                drilledObj[drilledCat[k]] = {
                    val: 0,
                    count: 0
                };
            }

            if (typeof $scope.filtering == 'undefined') {
                $scope.filterData($scope.seriesArray[i].filter);
            }

            $scope.filtering.calculate(orderedObj, catMappedData, serMappedData, drillData);

            for (var key in orderedObj) {
                if (Object.prototype.hasOwnProperty.call(orderedObj, key)) {

                    var drilledArray = $scope.filtering.calculate(orderedObj[key].arr, drilledObj, null, null);

                    var drilledSeriesObj = [];
                    for (var key1 in drilledArray) {
                        if (Object.prototype.hasOwnProperty.call(drilledArray, key1)) {
                            if (drilledArray[key1].val > 0)
                                drilledSeriesObj.push([key1, drilledArray[key1].val]);
                        }
                    }

                    var test = {
                        id: '',
                        data: []
                    };
                    test.id = key;
                    test.data = drilledSeriesObj;

                    drilledSeries.push(test);

                    data.push({
                        name: key,
                        y: orderedObj[key].val,
                        //changed by sajee 9/19/2015
                        drilldown: key
                    });
                }
            }
            console.log("Drilled series is");
            console.log(drilledSeries);
            orderedArrayObj["data"] = data;
            orderedArrayObj["name"] = $scope.seriesArray[i].name;
            orderedArrayObj["color"] = $scope.seriesArray[i].color;
            orderedArrayObj["type"] = $scope.seriesArray[i].type;
            orderedObjArray.push(orderedArrayObj);
        }

        widget.highchartsNG = {
            chart: {
                type: 'column'
            },

            plotOptions: {
                series: {
                    borderWidth: 0,
                    turboThreshold: 3000,
                    dataLabels: {
                        enabled: true,
                    }
                }
            },

            title: {
                text: widget.uniqueType
            },
            xAxis: {
                type: 'category'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            series: orderedObjArray,
            drilldown: {
                series: drilledSeries,
                drillUpButton: {
                    relativeTo: 'spacingBox',
                    position: {
                        y: 0,
                        x: 0
                    },
                    theme: {
                        fill: 'white',
                        'stroke-width': 1,
                        stroke: 'silver',
                        r: 0,
                        states: {
                            hover: {
                                fill: '#bada55'
                            },
                            select: {
                                stroke: '#039',
                                fill: '#bada55'
                            }
                        }
                    }

                }
            },
            title: {
                text: ''
            },
            size: {
                width: 300,
                height: 220
            }
        };

        console.log('drilled highchart config:' + JSON.stringify(widget.highchartsNG));

        widget['widConfig'] = {
            source: $scope.datasource,
            classArray: $scope.objClasses,
            selectedClass: $scope.selectedClass,
            fields: $scope.selectedFields,
            selFields: $scope.checkedFields,
            claFields: $scope.classFields,
            chartCat: $scope.chartCategory,
            attributes: $scope.arrayAttributes,
            indType: $scope.indexType,
            query: $scope.query,
            series: $scope.seriesArray,
            serAttributes: $scope.seriesAttributes,
            mappedData: $scope.mappedArray

        };

    };


    $scope.groupDrilledItems = function(uniqueArray, objArray) {
        for (j = 0; j < objArray.length; j++) {
            uniqueArray[objArray[j].drill] += objArray[j].val;
        }
        return uniqueArray;
    };

    //$scope.

    $scope.getDrillArray = function() {
        var uniqueScore = eval('$scope.mappedArray.' + $scope.chartCategory.groupField + '.unique');
       
        console.log('unique score:' + uniqueScore);
        for (var key in $scope.mappedArray) {
            if (Object.prototype.hasOwnProperty.call($scope.mappedArray, key)) {
                if ($scope.mappedArray[key].unique > uniqueScore && $scope.mappedArray[key].unique != 0)
                    $scope.chartCategory.drilledArray.push($scope.mappedArray[key].name);
            }
        }
    };

    //adds new series to the chart
    $scope.addSeries = function() {
        $scope.seriesArray.push({
            name: 'series1',
            serName: '',
            filter: '',
            type: 'area',
            color: '',
            drilled: false
        });
    }


    //removes the clicked series
    $scope.removeSeries = function(ind) {
        $scope.seriesArray.splice(ind, 1);
    }

    $scope.toggleTab = function(ind) {
        var tabIndex = '';
        if (typeof ind === 'undefined') tabIndex = $scope.selectedTabIndex;
        else tabIndex = ind;

        //manually switching between tabs
        switch (tabIndex) {
            case 0:
                break;
            case 1:
                $scope.indexType != $scope.selectedClass && $scope.getFields();
                $scope.dataTab = false;
                $scope.selectedTabIndex = 1;
                break;
            case 2:
                var classFields = $scope.checkedFields;
                var classQuery = $scope.query.value;
                if ($scope.query.state) {
                    $scope.classQuery != $scope.query.value && $scope.getData();
                } else {
                    $scope.classFields != $scope.checkedFields && $scope.getData();
                }

                $scope.chartTab = false;
                $scope.selectedTabIndex = 2;
                break;
        }
    };

    //close the config

    $scope.cancel = function() {
        $mdDialog.hide();
    }

    $scope.filterData = function(c) {
        var filter = eval('new ' + c.toUpperCase() + '();');
        $scope.filtering = new Filtering();
        $scope.filtering.setFilter(filter);
        $scope.seriesAttributes = $scope.filtering.filterFields();
        $scope.widgetValidity = 'fade-out';
    };

    $scope.checkSeriesAvailability = function() {
        if ($scope.seriesAttributes.length == 0) {
            $scope.validationMessage = "Please check the filter you select";
            $scope.widgetValidity = 'fade-in';
        }
    };


    /* Strategy1 begin */
    var Filtering = function() {
        this.filter = "";
    };

    Filtering.prototype = {
        setFilter: function(filter) {
            this.filter = filter;
        },

        calculate: function(orderedObj, catMappedData, serMappedData, drillData) {
            return this.filter.calculate(orderedObj, catMappedData, serMappedData, drillData);
        },

        filterFields: function() {
            return this.filter.filterFields();
        }
    };

    var SUM = function() {
        this.calculate = function(orderedObj, catMappedData, serMappedData, drillData) {
            console.log("calculations... for the sum filter");
            if (typeof drillData == 'undefined') {
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += serMappedData[j];
                }
            } else if (serMappedData == null) {
                for (j = 0; j < orderedObj.length; j++) {
                    catMappedData[orderedObj[j].drill].val += orderedObj[j].val;
                }
                return catMappedData;
            } else {
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += serMappedData[j];
                    orderedObj[catMappedData[j]].arr.push({
                        val: serMappedData[j],
                        drill: drillData[j]
                    });
                }
            }
        }

        this.filterFields = function() {
            return getFilteredFields(false);
        }
    };

    var AVERAGE = function() {
        this.calculate = function(orderedObj, catMappedData, serMappedData, drillData) {
            console.log("calculations... for the average filter");
            if (typeof drillData == 'undefined') {
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += serMappedData[j];
                    orderedObj[catMappedData[j]].count += 1;
                }
                for (attr in orderedObj) {
                    if (Object.prototype.hasOwnProperty.call(orderedObj, attr)) {
                        orderedObj[attr].val = Number((orderedObj[attr].val / orderedObj[attr].count).toFixed(2));
                    }
                }
            } else if (serMappedData == null) {
                for (j = 0; j < orderedObj.length; j++) {
                    catMappedData[orderedObj[j].drill].val += orderedObj[j].val;
                    catMappedData[orderedObj[j].drill].count += 1;
                }
                for (attr in catMappedData) {
                    if (Object.prototype.hasOwnProperty.call(catMappedData, attr)) {
                        catMappedData[attr].val = Number((catMappedData[attr].val / catMappedData[attr].count).toFixed(2));
                    }
                }
                return catMappedData;
            } else {
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += serMappedData[j];
                    orderedObj[catMappedData[j]].arr.push({
                        val: serMappedData[j],
                        drill: drillData[j]
                    });
                }
                for (attr in orderedObj) {
                    if (Object.prototype.hasOwnProperty.call(orderedObj, attr)) {
                        orderedObj[attr].val = Number((orderedObj[attr].val / orderedObj[attr].arr.length).toFixed(2));
                    }
                }
            }
        }

        this.filterFields = function() {
            return getFilteredFields(false);
        }
    };

    var PERCENTAGE = function() {
        this.calculate = function(orderedObj, catMappedData, serMappedData, drillData) {
            console.log("calculations... for the prcentage filter");
            var total;
            if (typeof drillData == 'undefined') {
                total = 0;
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += serMappedData[j];
                    total += serMappedData[j];
                }
                for (attr in orderedObj) {
                    if (Object.prototype.hasOwnProperty.call(orderedObj, attr)) {
                        orderedObj[attr].val = Number(((orderedObj[attr].val / total) * 100).toFixed(2));
                    }
                }
            } else if (serMappedData == null) {
                total = 0;
                for (j = 0; j < orderedObj.length; j++) {
                    catMappedData[orderedObj[j].drill].val += orderedObj[j].val;
                    total += orderedObj[j].val;
                }
                for (attr in catMappedData) {
                    if (Object.prototype.hasOwnProperty.call(catMappedData, attr)) {
                        catMappedData[attr].val = Number(((catMappedData[attr].val / total) * 100).toFixed(2));
                    }
                }
                return catMappedData;
            } else {
                total = 0;
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += serMappedData[j];
                    total += serMappedData[j];
                    orderedObj[catMappedData[j]].arr.push({
                        val: serMappedData[j],
                        drill: drillData[j]
                    });
                }
                for (attr in orderedObj) {
                    if (Object.prototype.hasOwnProperty.call(orderedObj, attr)) {
                        orderedObj[attr].val = Number(((orderedObj[attr].val / total) * 100).toFixed(2));
                    }
                }
            }
        }

        this.filterFields = function() {
            return getFilteredFields(false);
        }
    };

    var COUNT = function() {
        this.calculate = function(orderedObj, catMappedData, serMappedData, drillData) {
            console.log("calculations... for the count filter");
            if (typeof drillData == 'undefined') {
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += 1;
                }
            } else if (serMappedData == null) {
                for (j = 0; j < orderedObj.length; j++) {
                    catMappedData[orderedObj[j].drill].val += 1;
                }
                return catMappedData;
            } else {
                for (j = 0; j < serMappedData.length; j++) {
                    orderedObj[catMappedData[j]].val += 1;
                    orderedObj[catMappedData[j]].arr.push({
                        val: serMappedData[j],
                        drill: drillData[j]
                    });
                }
            }
        }

        this.filterFields = function() {
            return getFilteredFields(true);
        }
    };
    //returns the series array according to the filter selected
    function getFilteredFields(isNaN) {
        var objArr = [];
        for (var key in $scope.mappedArray) {
            if (Object.prototype.hasOwnProperty.call($scope.mappedArray, key)) {
                if (!isNaN) !$scope.mappedArray[key].isNaN && objArr.push($scope.mappedArray[key].name);
                else objArr.push($scope.mappedArray[key].name);
            }
        }
       
        return objArr;
    };

    /* Strategy1 end */

}]);
//metric controller
routerApp.controller('metricInit',['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', 'widgetID', '$mdToast', '$timeout',function ($scope, $http, $objectstore, $mdDialog, $rootScope, widgetID, $mdToast, $timeout) {

    $scope.filterAttributes = ['Sum', 'Average', 'Percentage', 'Count', 'Unique'];
    $scope.datasources = ['DuoStore', 'BigQuery', 'CSV/Excel', 'Rest/SOAP Service', 'SpreadSheet']; //temporary
    $scope.storeIndex = 'com.duosoftware.com';
    // $scope.storeIndex = 'janaki.epayments.lk';
    $scope.widgetValidity = 'elasticValidation'; //validation message visibility                                             
    $scope.query = {};
    $scope.query.state = false;
    $scope.query.drilled = false;
    $scope.checkedFields = [];
    $scope.dataIndicator = false;
    $scope.categoryVal = "";
    $scope.mappedArray = {};

    $scope.chartCategory = {
        groupField: '',
        drilledField: '',
        drilledArray: []
    };
    $scope.dataTab = true;
    $scope.chartTab = true;
    $scope.seriesAttributes = [];

    //getting the widget object
    var objIndex = getRootObjectById(widgetID, $rootScope.dashboard.widgets);
    $scope.widget = $rootScope.dashboard.widgets[objIndex];

    $scope.getTables = function() {

        if ($scope.datasource == "DuoStore") {
            var client = $objectstore.getClient($scope.storeIndex, " ");

            client.getClasses($scope.storeIndex);

            //classes retrieved
            client.onGetMany(function(data) {
                if (data.length > 0) $scope.objClasses = data;
                else console.log('There are no classes present');
            });

            //error getting classes from the index
            client.onError(function(data) {
                console.log('Error getting classes');
            });
        } else if ($scope.datasource == "BigQuery") {

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function(e) {
                console.log(this);
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log('query response:' + JSON.parse(xhr.response));
                        var res = JSON.parse(xhr.response);
                        var tableArray = [];
                        $scope.objClasses = res;
                        console.log(res.length);
                    } else {
                        console.error("XHR didn't work: ", xhr.status);
                    }
                }
            }
            xhr.ontimeout = function() {
                console.error("request timedout: ", xhr);
            }
            xhr.open("get", "http://104.131.48.155:8080/GetTables?dataSetID=digin_hnb", /*async*/ true);
            xhr.send();
        }
    };

    if (typeof $scope.widget.widConfig == 'undefined') {

        $scope.seriesArray = [{
            name: 'series1',
            serName: '',
            filter: '',
            type: 'area',
            color: ''
        }];

    } else {
        //source tab config
        $scope.objClasses = $scope.widget.widConfig.classArray;
        $scope.datasource = $scope.widget.widConfig.source;
        $scope.selectedClass = $scope.widget.widConfig.selectedClass;

        //selection tab config
        $scope.dataTab = false;
        $scope.selectedFields = $scope.widget.widConfig.fields;
        $scope.selectedField = $scope.widget.widConfig.selField;

        //mapping tab config 
        $scope.selectedFilter = $scope.widget.widConfig.selFilter;
        $scope.filtersAvailable = $scope.widget.widConfig.filters;
        $scope.chartTab = false;
        $scope.mappedArray = $scope.widget.widConfig.mappedData;
        $scope.chartCategory = $scope.widget.widConfig.chartCat;
        $scope.arrayAttributes = $scope.widget.widConfig.attributes;
        $scope.classFields = $scope.widget.widConfig.claFields;
        $scope.indexType = $scope.widget.widConfig.indType;
        $scope.query = $scope.widget.widConfig.query;
        $scope.seriesArray = $scope.widget.widConfig.series;
        $scope.seriesAttributes = $scope.widget.widConfig.serAttributes;
    }

    //check for selected classes
    $scope.getFields = function() {
        $scope.selectedFields = [];
        if ($scope.datasource == "DuoStore") {
            $scope.dataIndicator1 = true;
            if ($scope.selectedClass != null) {
                $scope.indexType = $scope.selectedClass;
                var client1 = $objectstore.getClient($scope.storeIndex, $scope.indexType);
                // var client1 = $objectstore.getClient($scope.storeIndex, 'transaction');
                client1.getFields($scope.storeIndex, $scope.indexType);

                //class's fields retrieved
                client1.onGetMany(function(data) {
                    if (data.length > 0) {
                        data.forEach(function(entry) {
                            $scope.selectedFields.push({
                                name: entry,
                                checked: false
                            });
                        });

                        //change the tab
                        $scope.toggleTab(1);
                        $scope.widgetValidity = 'fade-out';
                    } else console.log('There are no fields present in the class');
                    $scope.dataIndicator = false;
                });

                //error getting fields from the class
                client1.onError(function(data) {
                    console.log('Error getting fields');
                });
            } else {
                $scope.widgetValidity = 'fade-in';
                $scope.validationMessage = "Please select a class";
            }
        } else if ($scope.datasource == "BigQuery") {
            if ($scope.selectedClass != null) {
                $scope.indexType = $scope.selectedClass;
                var fieldData = ($scope.selectedClass.split(':')[1]).split('.');
                $scope.bigQueryFieldDetails = fieldData;
                $scope.dataIndicator1 = true;

                $http({
                    method: 'GET',
                    url: 'http://104.131.48.155:8080/GetFields?datasetName=' + fieldData[0] + '&&tableName=' + fieldData[1],
                }).
                success(function(data, status) {
                    if (data.length > 0) {
                        data.forEach(function(entry) {
                            $scope.selectedFields.push({
                                name: entry,
                                checked: false
                            });
                        });

                        //change the tab
                        $scope.toggleTab(1);
                        $scope.widgetValidity = 'fade-out';
                    } else console.log('There are no fields present in the class');
                    $scope.dataIndicator1 = false;
                }).
                error(function(data, status) {
                  

                });
            } else {
                $scope.widgetValidity = 'fade-in';
                $scope.validationMessage = "Please select a class";
            }

        } else if ($scope.datasource == "CSV/Excel") {
            var jsonArray = JSON.parse($rootScope.json_string);
            $scope.selectedFields = [];


            var obj = jsonArray[0];
            for (var j in obj) {
                $scope.selectedFields.push({
                    name: j,
                    checked: false
                });
            }

            $scope.toggleTab(1);
            $scope.widgetValidity = 'fade-out';
        } else if ($scope.datasource == "BigQuery") {
            // get the fields of the selected big query
        }
    };

    $scope.getData = function() {
        var w = new Worker("scripts/webworkers/elasticWorker.js");
        var w1 = new Worker("scripts/webworkers/bigQueryWorker.js");
        var parameter = '';

        if ($scope.selectedField != null || typeof $scope.query.value != "undefined") {
            $scope.classField = $scope.selectedField;
            $scope.classQuery = $scope.query.value;

            if ($scope.query.state) {
                parameter = $scope.classQuery;
            } else {
                parameter = $scope.selectedField.name;
            }

            $scope.dataIndicator = true;

            function mapRetrieved(event) {
                var obj = JSON.parse(event.data);
                $scope.dataIndicator = false;

                //creating the array to map dynamically
                $scope.arrayAttributes = [];
                for (var key in obj[0]) {
                    if (Object.prototype.hasOwnProperty.call(obj[0], key)) {
                        var val = obj[0][key];
                        $scope.mappedArray[key] = {
                            name: key,
                            data: [],
                            isNaN: true
                        };
                        $scope.arrayAttributes.push(key);
                    }
                }

                //mapping the dynamically created array
                for (i = 0; i < obj.length; i++) {

                    for (var key in obj[i]) {
                        if (Object.prototype.hasOwnProperty.call(obj[i], key)) {
                            var val = obj[i][key];
                            var parsedVal = parseFloat(val);
                            if (!isNaN(parsedVal)) {
                                $scope.mappedArray[key].data.push(parsedVal);
                                $scope.mappedArray[key].isNaN = false;
                            } else {
                                $scope.mappedArray[key].data.push(val);
                            }
                            $scope.fieldRetrieved = $scope.mappedArray[key].name;
                        }
                    }
                }

                $scope.getFilters();
                $scope.toggleTab(2);
            };

            if ($scope.datasource == "DuoStore" || $scope.datasource == "BigQuery") {

                if ($scope.datasource == "BigQuery") {
                    w1.postMessage(parameter + "," + $scope.bigQueryFieldDetails.toString() + "," + $scope.query.state);
                    w1.addEventListener('message', function(event) {
                        var obj = JSON.parse(event.data);

                        mapRetrieved(event);
                    });

                    $scope.widgetValidity = 'fade-out';
                } else {
                    w.postMessage($scope.indexType + "," + parameter + "," + $scope.query.state);
                    w.addEventListener('message', function(event) {
                        mapRetrieved(event);
                    });

                    $scope.widgetValidity = 'fade-out';
                }

            } else if ($scope.datasource == "CSV/Excel") {
                var obj = JSON.parse($rootScope.json_string);
                console.log(JSON.stringify(obj));
                $scope.dataIndicator = false;

                //creating the array to map dynamically
                $scope.arrayAttributes = [];
                for (var key in obj[0]) {
                    if (Object.prototype.hasOwnProperty.call(obj[0], key)) {
                        var val = obj[0][key];
                        console.log(key);
                        $scope.mappedArray[key] = {
                            name: key,
                            data: [],
                            unique: 0,
                            isNaN: true
                        };
                        $scope.arrayAttributes.push(key);
                    }
                }

                //mapping the dynamically created array
                for (i = 0; i < obj.length; i++) {
                    for (var key in obj[i]) {
                        if (Object.prototype.hasOwnProperty.call(obj[i], key)) {
                            var val = obj[i][key];
                            var parsedVal = parseFloat(val);
                            if (!isNaN(parsedVal)) {
                                $scope.mappedArray[key].data.push(parsedVal);
                                $scope.mappedArray[key].isNaN = false;
                            } else {
                                if (typeof $scope.mappedArray[key] != 'undefined') {
                                    $scope.mappedArray[key].data.push(val);
                                }
                            }
                        }
                    }
                }

                //getting the unique score to determine the hierarchy
                for (var key in $scope.mappedArray) {
                    if (Object.prototype.hasOwnProperty.call($scope.mappedArray, key)) {
                        if ($scope.mappedArray[key].isNaN) {
                            $scope.mappedArray[key].unique = Enumerable.From($scope.mappedArray[key].data).Select().Distinct().ToArray().length;
                        }
                    }
                }

                $scope.toggleTab(2);

            }

        } else {
            if ($scope.query.state) $scope.validationMessage = "Please add a query for data retrieval";
            else $scope.validationMessage = "Please select fields for data retrieval";
            $scope.widgetValidity = 'fade-in';
        }
    };
    //builds the chart
    $scope.buildchart = function(widget) {

        //saving configuration
        widget['widConfig'] = {
            source: $scope.datasource,
            classArray: $scope.objClasses,
            selectedClass: $scope.selectedClass,
            fields: $scope.selectedFields,
            selField: $scope.selectedField,
            selFilter: $scope.selectedFilter,
            filters: $scope.filtersAvailable,
            claFields: $scope.classFields,
            chartCat: $scope.chartCategory,
            attributes: $scope.arrayAttributes,
            indType: $scope.indexType,
            query: $scope.query,
            series: $scope.seriesArray,
            serAttributes: $scope.seriesAttributes,
            mappedData: $scope.mappedArray

        };

        $scope.filterData($scope.selectedFilter);
        var dataObject = $scope.mappedArray[$scope.fieldRetrieved].data;
        widget.widData['value'] = $scope.filtering.calculate(dataObject);
        $mdDialog.hide();
    }

    $scope.toggleTab = function(ind) {
        var tabIndex = '';
        if (typeof ind === 'undefined') tabIndex = $scope.selectedTabIndex;
        else tabIndex = ind;

        //manually switching between tabs
        switch (tabIndex) {
            case 0:
                break;
            case 1:
                $scope.indexType != $scope.selectedClass && $scope.getFields();
                $scope.dataTab = false;
                $scope.selectedTabIndex = 1;
                break;
            case 2:
                var classField = $scope.selectedField;
                var classQuery = $scope.query.value;
                if ($scope.query.state) {
                    $scope.classQuery != $scope.query.value && $scope.getData();
                } else {
                    $scope.classField != $scope.selectedField && $scope.getData();
                }

                $scope.chartTab = false;
                $scope.selectedTabIndex = 2;
                break;
        }
    };

    //close the config

    $scope.cancel = function() {
        $mdDialog.hide();
    }

    $scope.filterData = function(c) {
        var filter = eval('new ' + c.toUpperCase() + '();');
        $scope.filtering = new Filtering();
        $scope.filtering.setFilter(filter);
        $scope.seriesAttributes = $scope.filtering.filterFields();
        $scope.widgetValidity = 'fade-out';
    };

    $scope.checkSeriesAvailability = function() {
        if ($scope.seriesAttributes.length == 0) {
            $scope.validationMessage = "Please check the filter you select";
            $scope.widgetValidity = 'fade-in';
        }
    };

    $scope.getFilters = function() {
        for (var key in $scope.mappedArray) {
            if (Object.prototype.hasOwnProperty.call($scope.mappedArray, key)) {
                if ($scope.mappedArray[key].isNaN) $scope.filtersAvailable = ['Count'];
                else $scope.filtersAvailable = $scope.filterAttributes;
            }
        }
    };

    /* Strategy1 begin */
    var Filtering = function() {
        this.filter = "";
    };

    Filtering.prototype = {
        setFilter: function(filter) {
            this.filter = filter;
        },

        calculate: function(dataObject) {
            return this.filter.calculate(dataObject);
        },

        filterFields: function() {
            return this.filter.filterFields();
        }
    };

    var SUM = function() {
        this.calculate = function(dataObject) {
            console.log("calculations... for the sum filter");
            var sum = 0;
            for (j = 0; j < dataObject.length; j++) {
                sum += dataObject[j];
            }
            return sum;
        }

        this.filterFields = function() {
            return getFilteredFields(false);
        }
    };

    var AVERAGE = function() {
        this.calculate = function(dataObject) {
            console.log("calculations... for the average filter");
            var sum = 0;
            for (j = 0; j < dataObject.length; j++) {
                sum += dataObject[j];
            }
            return sum / dataObject.length;
        }

        this.filterFields = function() {
            return getFilteredFields(false);
        }
    };

    var PERCENTAGE = function() {
        this.calculate = function(dataObject) {
            console.log("calculations... for the prcentage filter");
            var sum = 0;
            for (j = 0; j < dataObject.length; j++) {
                sum += dataObject[j];
            }
            return (sum / dataObject.length) * 100;
        }

        this.filterFields = function() {
            return getFilteredFields(false);
        }
    };

    var COUNT = function() {
        this.calculate = function(dataObject) {
            console.log("calculations... for the count filter");
            return dataObject.length;
        }

        this.filterFields = function() {
            return getFilteredFields(true);
        }
    };

    var UNIQUE = function() {
        this.calculate = function(dataObject) {
            console.log("calculations... for the unique filter");
            return Enumerable.From(dataObject).Select().Distinct().ToArray().length;;
        }

        this.filterFields = function() {
            return getFilteredFields(true);
        }
    };

    //returns the series array according to the filter selected
    function getFilteredFields(isNaN) {
        var objArr = [];
        for (var key in $scope.mappedArray) {
            if (Object.prototype.hasOwnProperty.call($scope.mappedArray, key)) {
                if (!isNaN) !$scope.mappedArray[key].isNaN && objArr.push($scope.mappedArray[key].name);
                else objArr.push($scope.mappedArray[key].name);
            }
        }
        return objArr;
    };

    /* Strategy1 end */

}]);

routerApp.controller('InitConfigD3',['$scope', '$mdDialog', 'widgetID', '$rootScope', '$sce', 'd3Service', '$timeout',
    function ($scope, $mdDialog, widgetID, $rootScope, $sce, d3Service, $timeout) {

        $scope.cancel = function() {
            $mdDialog.hide();
        };
    }
]);

routerApp.controller( 'wordpressInit' ,['$scope', '$http', '$mdDialog', 'widgetID', '$rootScope',
    function ($scope, $http, $mdDialog, widgetID, $rootScope) {

        $scope.diginLogo = 'digin-logo-wrapper2';
        $scope.showFinishButton = false;
        //cancel config
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.finish = function(){
            $scope.showFinishButton = false;
            $mdDialog.hide();
        }
        //complete config  
        $scope.fetch = function() {
            $scope.diginLogo = 'digin-logo-wrapper2';
            var wpapi = "http://public-api.wordpress.com/rest/v1/sites/";
            var choice = "/posts";
            var callbackString = '/?callback=JSON_CALLBACK';

            var message = $http.jsonp(wpapi + $scope.wpdomain + choice + callbackString).
            success(function(data, status) {

                var objIndex = getRootObjectById(widgetID, $rootScope.dashboard.pages[0].widgets);
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
                    obj.date = posts[i].date

                    trimmedPosts.push(obj);
                }
                var trimmedObj = {};
                trimmedObj.posts = trimmedPosts;
                $rootScope.dashboard.pages[0].widgets[objIndex].widData = trimmedObj;
                $scope.showFinishButton = true;
                $scope.diginLogo = 'digin-logo-wrapper2';
            }).error(function(data, status) {
                console.log(message);
                $scope.showFinishButton = false;
                $scope.diginLogo = 'digin-logo-wrapper2';
            });    
        };
    }
]);

routerApp.controller('rssInit',['$scope', '$http', '$mdDialog', 'widgetID', '$rootScope',
    function ($scope, $http, $mdDialog, widgetID, $rootScope) {

        $scope.diginLogo = 'digin-logo-wrapper2';
        $scope.showFinishButton = false;
        //cancel config
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.finish = function(){
            $scope.showFinishButton = false;
            $mdDialog.hide();
        }
        //complete config  
        $scope.fetch = function() {
            $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
            $scope.entryArray = [];
            google.load("feeds", "1");
            var feed = new google.feeds.Feed($scope.rssAddress);
            feed.setNumEntries(100);

            feed.load(function(result) {

                if (!result.error) {

                    var ObjectIndex = getRootObjectById(widgetID,$rootScope.dashboard.pages[$rootScope.selectedPage-1].widgets);
                    //var objIndex = getRootObjectById(widgetID, $rootScope.dashboard.widgets);
                    $rootScope.dashboard.pages[$rootScope.selectedPage-1].widgets[ObjectIndex].widData = result.feed.entries;
                    $scope.showFinishButton = true;
                    
                }
                $scope.diginLogo = 'digin-logo-wrapper2';
            });
        };
    }
]);

routerApp.controller('spreadInit',['$scope', '$http', '$mdDialog', 'widgetID', '$rootScope', 'lkGoogleSettings',function ($scope, $http, $mdDialog, widgetID, $rootScope, lkGoogleSettings) {

    var objIndex = getRootObjectById(widgetID, $rootScope.dashboard.widgets);
    //cancel config
    $scope.cancel = function() {
        $mdDialog.hide();
    };
    //complete config  
    $scope.finish = function() {
        $mdDialog.hide();
    };

    $rootScope.files = [];
    $rootScope.show = "hello";
    // Callback triggered after Picker is shown
    $scope.onLoaded = function() {
        //console.log('Google Picker loaded!');
    }
    // Callback triggered after selecting files
    $scope.onPicked = function(docs) {
        angular.forEach(docs, function(file, index) {
            // alert('You have selected: ' + file.id);
            $rootScope.files.push(file);
            $rootScope.dashboard.widgets[objIndex].widData = $rootScope.files;
            $mdDialog.hide();

        });
    }
    // Callback triggered after clicking on cancel
    $scope.onCancel = function() {
        //console.log('Google picker close/cancel!');
    }
}]);

routerApp.controller('gnewsInit',['$scope', '$http', '$mdDialog', 'widgetID', '$rootScope',function ($scope, $http, $mdDialog, widgetID, $rootScope) {

    $scope.diginLogo = 'digin-logo-wrapper2';
    $scope.showFinishButton = false;
        //cancel config
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.finish = function(){
        $scope.showFinishButton = false;
        $mdDialog.hide();
    }
    $scope.fetch = function() {
        $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
        $scope.entryArray = [];

        google.load('search', '1');
        // Create a News Search instance.
        var newsSearch = new google.search.NewsSearch();

        function searchComplete() {

            if (newsSearch.results && newsSearch.results.length > 0) {

                var objIndex = getRootObjectById(widgetID, $rootScope.dashboard.widgets);

                for (var i = 0; i < newsSearch.results.length; i++) {

                    var entry = newsSearch.results[i];
                    $scope.entryArray.push(entry);
                    $scope.$apply();
                }
                $rootScope.dashboard.widgets[objIndex].widData = $scope.entryArray;
            }
        }
        // Set searchComplete as the callback function when a search is 
        // complete.  The newsSearch object will have results in it.
        newsSearch.setSearchCompleteCallback(this, searchComplete, null);
        // Specify search quer(ies)
        newsSearch.execute(gnewsrequest);
        $scope.diginLogo = 'digin-logo-wrapper2';
        $scope.showFinishButton = true;
    };
}]);

routerApp.controller('imInit',['$scope', '$http', '$rootScope', '$mdDialog', 'widgetID',function ($scope, $http, $rootScope, $mdDialog, widgetID) {

    $scope.cancel = function() {
        $mdDialog.hide();
    };
    //complete config  
    $scope.finish = function() {

        var selectedPage = $rootScope.selectedPage;
        var pages = $rootScope.dashboard.pages;
        var objIndex = getRootObjectById( widgetID, pages[selectedPage-1].widgets);
        
        $rootScope.image = $scope.image;
        pages[selectedPage-1].widgets[objIndex].widgetData.widIm = $rootScope.image;
        
        $mdDialog.hide();
    };
}]);

routerApp.controller('csvInit',['$scope', '$http', '$mdDialog', 'widgetID', '$rootScope',function ($scope, $http, $mdDialog, widgetID, $rootScope) {

    var objIndex = getRootObjectById(widgetID, $rootScope.dashboard.widgets);

    $rootScope.myData = [58.13, 53.98, 67.00, 89.70, 99.00, 13.28, 66.70, 34.98];
    $rootScope.dashboard.widgets[objIndex].widCsc = $rootScope.myData;

    $scope.cancel = function() {
        $mdDialog.hide();
    };

    $scope.finish = function(file) {

        $rootScope.csvFile = file;
        // $rootScope.myData = file;
        //console.log($rootScope.csvFile);
        $rootScope.dashboard.widgets[objIndex].widCsv = $rootScope.csvFile;

        $mdDialog.hide();
    };
}]);

routerApp.controller('weatherInit',['widgetID', '$scope', '$http', '$rootscope', '$mdDialog',function (widgetID, $scope, $http, $rootscope, $mdDialog) {
    //cancel config
    $scope.cancel = function() {
        $mdDialog.hide();
    };

    //complete config  
    $scope.finish = function() {
        $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + $scope.locZip + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')

        .success(function(data) {

                var objIndex = getRootObjectById(widgetID, $rootScope.dashboard.widgets);
                $rootScope.dashboard.widgets[objIndex].widData = data.query;
                $mdDialog.hide();
            })
            .error(function(err) {
                console.log('Error retrieving markets');
            });
    };
}]);

routerApp.controller('adsenseInit',['widgetID', '$scope', '$http', '$rootScope', '$mdDialog',function (widgetID, $scope, $http, $rootScope, $mdDialog) {
    $scope.cancel = function() {
        $mdDialog.hide();
    }

    $scope.finish = function() {
        $mdDialog.hide();
    }
    $scope.signIn = function() {

    }
}]);

routerApp.controller('calendarInit',['widgetID', '$scope', '$http', '$rootScope', '$mdDialog', '$compile', '$timeout', 'uiCalendarConfig',function (widgetID, $scope, $http, $rootScope, $mdDialog, $compile, $timeout, uiCalendarConfig) {
    var objIndex = getRootObjectById(widgetID, $rootScope.dashboard.widgets);

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.uiConfig = {
        calendar: {
            editable: true,
            header: {
                left: 'title',
                center: '',
                right: 'today prev,next'
            },
            eventClick: $scope.alertOnEventClick,
            eventRender: $scope.eventRender
        }
    };
    $scope.events = [];
    $rootScope.dashboard.widgets[objIndex].widData = [];

    /* alert on eventClick */
    $scope.alertOnEventClick = function(date, jsEvent, view) {
        $scope.alertMessage = (date.title + ' was clicked ');
    };

    /* Change View */
    $scope.renderCalender = function(calendar) {
        $timeout(function() {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        });
    };

    /* Change View */
    $scope.changeView = function(view, calendar) {
        //alert('tset');
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
        $timeout(function() {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        });
    };

    /* Render Tooltip */
    $scope.eventRender = function(event, element, view) {
        element.attr({
            'tooltip': event.title,
            'tooltip-append-to-body': true
        });
        $compile(element)($scope);
    };

    $scope.authorize = function() {
        var config = {
            'client_id': '140016159778-94lb00ckgkkcghbcclae8dg36r16mm4t.apps.googleusercontent.com',
            'scope': 'https://www.googleapis.com/auth/calendar'
        };
        gapi.auth.authorize(config, function() {
            console.log('login complete');
            console.log(gapi.auth.getToken());
        });
    }

    $scope.cancel = function() {
        $mdDialog.hide();

    };

    $scope.finish = function() {
        gapi.client.load('calendar', 'v3', listUpcomingEvents);
        $mdDialog.hide();
    };

    function listUpcomingEvents() {
        var request = gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'showDeleted': false,
            'singleEvents': true,
            'orderBy': 'startTime'
        });

        request.execute(function(resp) {
            var events = resp.items;


            var evObj = [];
            if (events.length > 0) {
                for (i = 0; i < events.length; i++) {
                    var obj = {};
                    var event = events[i];
                    var when = event.start.dateTime;
                    if (!when) {
                        when = event.start.date;
                    }


                    if (typeof event.summary != 'undefined') {
                        obj['title'] = event.summary;
                        obj['start'] = when;
                        evObj.push(obj);
                    }

                }
                $rootScope.dashboard.widgets[objIndex].widData.push({
                    events: evObj
                });
            } else {

            }
            console.log("Calender object retrieved:" + JSON.stringify(evObj));
        });
    }
}]);
// new developers please read this before you proceed : https://developers.google.com/+/web/people/#before_you_begin
//client-id : 352719853010-1e2k3je9peuv42na7a2imsv21g89ca1o.apps.googleusercontent.com
//client-secret : Y5GhVaBOlIpcrEYQOW1cxYQk
//api key: AIzaSyBl3Tz2fIwKQNlf5w1RMH9w6VMgWUsok9Q
routerApp.controller('googlePlusInit',['$scope', 'googleService', '$http', '$mdDialog','$rootScope',
    function ($scope, googleService, $http, $mdDialog,$rootScope) {

        $scope.diginLogo = 'digin-logo-wrapper2';
        $scope.showFinishButton = false;
        $scope.connectedgplus = false;
        $scope.login = function() {

            $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
            googleService.signin().then(function(promise) {
                if(promise){
                    $scope.connectedgplus = true;
                    $scope.getData();
                    $scope.diginLogo = 'digin-logo-wrapper2';
                    $scope.showFinishButton = true;
                }
            }, function(err) {
                console.log('Failed: ' + err);
            });
        };
        $scope.logout = function() {

            googleService.signout().then(function(promise) {
                if(promise){
                    $scope.connectedgplus = false;
                }
            }, function(err) {
                console.log('Failed: ' + err);
            });
        };
        $scope.finish = function(){

            $mdDialog.hide();
        }
        $scope.cancel = function() {
            
            $mdDialog.hide();
        };
        $scope.getData = function() {

            googleService.getProfileData().then(function(data) {
                console.log("google plus retrieving profile data done");
            }, function(err) {
                console.log('Failed: ' + err);
            });
            googleService.getPeopleData().then(function(data) {
                console.log("google plus retrieving people data done");
            }, function(err) {
                console.log('Failed: ' + err);
            });
            googleService.getActivityData().then(function(data) {
                console.log("google plus retrieving activity data done");
            }, function(err) {
                console.log('Failed: ' + err);
            });
        };
        $scope.tabs = {
                    selectedIndex: 0,
                    pagination: true
        };
    }
]);


routerApp.directive('formSectionTitle', function() {

    return {
        restrict: 'E',
        template: "<div id='newdiv' layout='row' style='width: 255px; margin-top:8px; margin-left:8px;' flex layout-sm='row'><div flex='25'>    <img src={{catogeryLetter}} style='margin-top:22px;border-radius:20px'/>    </div> <div flex style='margin-top:27px;'>  <label style='font-weight:700'>{{title}} {{catogeryLetter}}</label> </div></div>",
        scope: {
            title: '@',
            catogeryLetter: '='
        },
        link: function(scope, element) {

                if (scope.title == "" || scope.title == null) {

                    element.find('#newdiv').attr('hide-sm', '');
                    //console.log("one of the pic is empty");
                } else {
                    scope.catogeryLetter = "styles/css/images/icons/material alperbert/avatar_tile_" + scope.title.charAt(0).toLowerCase() + "_28.png";
                    element.find('#newdiv').attr('new', '');
                }
            } //end of link
    };
});

routerApp.controller('googleMapsInit',['widgetID', '$scope', '$http', '$rootScope', '$mdDialog',function (widgetID, $scope, $http, $rootScope, $mdDialog) {

    $scope.finish = function() {
        $mdDialog.hide();

    };

    $scope.cancel = function() {
        $mdDialog.hide();
    };
}]);

 
routerApp.controller('clockInit', ['$scope', '$mdDialog', 
    function ($scope, $mdDialog) {

        $scope.showFinishButton = false;
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
        $scope.formats = [{
                name: "default",
                format: "ddd mmm dd yyyy HH:MM:ss"
            }, {
                name: "shortDate",
                format: "m/d/yy"
            }, {
                name: "longDate",
                format: "mmmm d, yyyy"
            }, {
                name: "fullDate",
                format: "dddd, mmmm d, yyyy"
            }, {
                name: "shortTime",
                format: "h:MM TT"
            }, {
                name: "mediumTime",
                format: "h:MM:ss TT"
            }, {
                name: "longTime",
                format: "h:MM:ss TT Z"
            }, {
                name: "isoDate",
                format: "yyyy-mm-dd"
            }, {
                name: "isoTime",
                format: "HH:MM:ss"
            }, {
                name: "isoDateTime",
                format: "yyyy-mm-dd'T'HH:MM:ss"
            }, {
                name: "isoUtcDateTime",
                format: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
        }];
        $scope.clockComponentformatChange = function (data) {

                console.log("$('#clockmonthDay')", $('#clockmonthDay'));

                if(data){
                    var monthDay = dateFormat(data);
                    $('#clockmonthDay').text(monthDay);

                    var year = dateFormat('yyyy');
                    $('#clockyear').append(year);

                    $scope.showFinishButton = true;
                }
        };
        $scope.cancel = function () {
                $mdDialog.cancel();
        };
        $scope.finish = function () {
                $mdDialog.hide();
        };
    }
]);