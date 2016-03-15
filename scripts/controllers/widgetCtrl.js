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
routerApp.controller('fbInit',['scope', '$mdDialog', 'widId', '$rootScope',function (scope, $mdDialog, widId, $rootScope) {

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


    scope.chartConfView = {
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
    scope.chartConf = {
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
    scope.chartConfView = {
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
    scope.finish = function() {
        var likeCountArray = [];
        var startingDayStr;
        var dateObj = {
            until: new Date(),
            range: 7
        }

        //getting page likes insights
        fbInterface.getPageLikesInsight(scope.fbPageModel, dateObj, function(data) {

            var likeHistory = fbInterface.getPageLikesObj(data);
            scope.chartConf.series[0].data = likeHistory.likeArr;
            scope.chartConf.series[0].pointStart = Date.UTC(likeHistory.start.getUTCFullYear(), likeHistory.start.getUTCMonth(), likeHistory.start.getUTCDate());;
            scope.chartConf.series[0].pointInterval = likeHistory.interval;

            var obj = {
                pgData: scope.pageData,
                likeData: scope.chartConf
            };
            $rootScope.dashboard.widgets[objIndex].widData = obj;
        });

        //getting page views insights
        fbInterface.getPageViewsInsight(scope.fbPageModel, dateObj, function(data) {

            var viewHistory = fbInterface.getPageLikesObj(data);
            scope.chartConfView.series[0].data = viewHistory.likeArr;
            scope.chartConfView.series[0].pointStart = Date.UTC(viewHistory.start.getUTCFullYear(), viewHistory.start.getUTCMonth(), viewHistory.start.getUTCDate());;
            scope.chartConfView.series[0].pointInterval = viewHistory.interval;

            var obj = {
                pgData: scope.pageData,
                likeData: scope.chartConf,
                viewData: scope.chartConfView
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
}]);



/*summary-
 linkedinInterface : (scripts/custom/linkedinInterface.js)
 */
 routerApp.controller('linkedInit',['scope', '$mdDialog', 'widId', '$rootScope',function (scope, $mdDialog, widId, $rootScope) {

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
}]);

routerApp.controller('TwitterInit',['$scope', '$http', '$mdDialog', 'widId', '$rootScope', '$q', 'twitterService',function ($scope, $http, $mdDialog, widId, $rootScope, $q, twitterService) {

    $scope.showFinishButton = false;
    $scope.connectedTwitter = false;

    $scope.cancel = function() {
        $mdDialog.hide();
    };

    twitterService.initialize();

    //using the OAuth authorization result get the latest 20 tweets from twitter for the user
    $scope.refreshTimeline = function(maxId) {
        twitterService.getLatestTweets(maxId).then(function(data) {

            var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
            $rootScope.dashboard.widgets[objIndex].widData.tweets = data;
            $scope.showFinishButton = true;
        }, function() {
            
        });
    }

    //when the user clicks the connect twitter button, the popup authorization window opens
    $scope.signIn = function() {
        
        twitterService.connectTwitter().then(function() {
            if (twitterService.isReady()) {
                //if the authorization is successful, hide the connect button and display the tweets
 
                    $scope.connectedTwitter = true;
                    $scope.refreshTimeline();
            } else {


            }
        });
    }

    //sign out clears the OAuth cache, the user will have to reauthenticate when returning
    $scope.signOut = function() {

        twitterService.clearCache();

        $scope.connectedTwitter = false;
        $scope.showFinishButton = false;
    }

    //if the user is a returning user, hide the sign in button and display the tweets
    if (twitterService.isReady()) {

        $scope.connectedTwitter = true;
        $scope.refreshTimeline();
    }

}]);

routerApp.controller('analyticsInit',['$scope', '$http', '$mdDialog', 'widId', '$rootScope',function ($scope, $http, $mdDialog, widId, $rootScope) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);

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

routerApp.controller('YoutubeInit',['$scope', '$http', '$mdDialog', 'widId', '$rootScope', '$log', 'VideosService',function ($scope, $http, $mdDialog, widId, $rootScope, $log, VideosService) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);

    $scope.cancel = function() {
        $mdDialog.hide();
    };
    $scope.finish = function() {
        init();
        $mdDialog.hide();
    };

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

    $scope.search = function() {
        //alert("Hello you hit the search function");

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
                $rootScope.dashboard.widgets[objIndex].widData = data;
                $mdDialog.hide();

            })
            .error(function() {
                $log.info('Search error');
            });

    }

    $scope.tabulate = function(state) {

        $scope.playlist = state;
    }

}]);
//real time widget with python service
routerApp.controller('realtimeInit',['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', 'widId', '$mdToast', '$timeout', 'DynamicVisualization',function ($scope, $http, $objectstore, $mdDialog, $rootScope, widId, $mdToast, $timeout, DynamicVisualization) {


}]);
//new elastic controller
routerApp.controller('elasticInit',['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', 'widId', '$mdToast', '$timeout', 'Digin_Engine_API',function ($scope, $http, $objectstore, $mdDialog, $rootScope, widId, $mdToast, $timeout, Digin_Engine_API) {

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
    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
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
routerApp.controller('metricInit',['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', 'widId', '$mdToast', '$timeout',function ($scope, $http, $objectstore, $mdDialog, $rootScope, widId, $mdToast, $timeout) {

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
    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
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

routerApp.controller('InitConfigD3',['$scope', '$mdDialog', 'widId', '$rootScope', '$sce', 'd3Service', '$timeout',
    function ($scope, $mdDialog, widId, $rootScope, $sce, d3Service, $timeout) {

        $scope.cancel = function() {
            $mdDialog.hide();
        };
    }
]);

routerApp.controller( 'wordpressInit' ,['$scope', '$http', '$mdDialog', 'widId', '$rootScope',
    function ($scope, $http, $mdDialog, widId, $rootScope) {
        $scope.showFinishButton = false;
        //cancel config
        $scope.cancel = function() {
            $mdDialog.hide();
        };
        $scope.finish = function(){
            $scope.showFinishButton = false;
            $scope.cancel();
        }
        //complete config  
        $scope.fetch = function() {
            var wpapi = "http://public-api.wordpress.com/rest/v1/sites/";
            var choice = "/posts";
            var callbackString = '/?callback=JSON_CALLBACK';

            var message = $http.jsonp(wpapi + $scope.wpdomain + choice + callbackString).
            success(function(data, status) {
                $scope.showFinishButton = true;
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
                    obj.date = posts[i].date

                    trimmedPosts.push(obj);
                }
                var trimmedObj = {};
                trimmedObj.posts = trimmedPosts;
                $rootScope.dashboard.widgets[objIndex].widData = trimmedObj;

            }).error(function(data, status) {

                console.log(message);
            });    
        };
    }
]);

routerApp.controller('rssInit',['$scope', '$http', '$mdDialog', 'widId', '$rootScope',
    function ($scope, $http, $mdDialog, widId, $rootScope) {

        var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
        //cancel config
        $scope.cancel = function() {
            $mdDialog.hide();
        };
        //complete config  
        $scope.finish = function(rssAddress) {

            $scope.entryArray = [];
            google.load("feeds", "1");
            var feed = new google.feeds.Feed(rssAddress);
            feed.setNumEntries(100);

            feed.load(function(result) {

                if (!result.error) {

                    for (var i = 0; i < result.feed.entries.length; i++) {

                        var entry = result.feed.entries[i];

                        $scope.entryContent = entry.content;
                        $scope.entryArray.push(entry);

                        $scope.$apply();
                    }

                    $rootScope.dashboard.widgets[objIndex].widData = $scope.entryArray;
                }
                $mdDialog.hide();
            });

            
        };
    }
]);

routerApp.controller('spreadInit',['$scope', '$http', '$mdDialog', 'widId', '$rootScope', 'lkGoogleSettings',function ($scope, $http, $mdDialog, widId, $rootScope, lkGoogleSettings) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
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

routerApp.controller('gnewsInit',['$scope', '$http', '$mdDialog', 'widId', '$rootScope',function ($scope, $http, $mdDialog, widId, $rootScope) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);

    //cancel config
    $scope.cancel = function() {
        $mdDialog.hide();
    };

    var newsSearch;

    $scope.finish = function(gnewsrequest) {

        $scope.entryArray = [];

        google.load('search', '1');
        // Create a News Search instance.
        newsSearch = new google.search.NewsSearch();

        function searchComplete() {

            if (newsSearch.results && newsSearch.results.length > 0) {

                console.log("newsSearch.results");
                console.log(newsSearch.results);

                for (var i = 0; i < newsSearch.results.length; i++) {

                    var entry = newsSearch.results[i];
                    $scope.entryArray.push(entry);

                    $scope.$apply();

                }

                console.log("$scope.entryArray");
                console.log($scope.entryArray);

            }

            $rootScope.dashboard.widgets[objIndex].widData = $scope.entryArray;

            $mdDialog.hide();
        }

        // Set searchComplete as the callback function when a search is 
        // complete.  The newsSearch object will have results in it.
        newsSearch.setSearchCompleteCallback(this, searchComplete, null);

        // Specify search quer(ies)
        newsSearch.execute(gnewsrequest);
    };

    // $scope.finish = function(text,$scope) {
    //     //get input value
    //     var gnewsfeed = document.getElementById('gnewsrequest').value;
    //     // Create a News Search instance.

    //     newsSearch = new google.search.NewsSearch();

    //     function searchComplete() {

    //         // var container = document.getElementById('gnews-div');
    //         // container.innerHTML = '';

    //         if (newsSearch.results && newsSearch.results.length > 0) {

    //             console.log("newsSearch.results");
    //             console.log(newsSearch.results);

    //             for (var i = 0; i < newsSearch.results.length; i++) {


    //                 $scope.gnewsData.push(newsSearch.results[i]);

    //             //     // Create HTML elements for search results
    //             //     var p = document.createElement('p');
    //             //     var gimg = document.createElement('gimg');
    //             //     var gtitle = document.createElement('gtitle');
    //             //     var gcontent = document.createElement('gcontent');
    //             //     var gpubdate = document.createElement('gpubdate');
    //             //     var gpub = document.createElement('gpub');
    //             //     var gloc = document.createElement('gloc');
    //             //     var gurl = document.createElement('gurl');
    //             //     var glang = document.createElement('glang');


    //             //     gimg.innerHTML = '<img style="width:60px;height:60px;" src=\"' + newsSearch.results[i].image.url + '\">'
    //             //     gtitle.innerHTML = "<h2>" + newsSearch.results[i].title; + "</h2>"
    //             //     gcontent.innerHTML = "<p>" + newsSearch.results[i].content; + "</p>"
    //             //     gpubdate.innerHTML = "<p>Published on: " + newsSearch.results[i].publishedDate; + "</p>"
    //             //     gpub.innerHTML = "<p>Published by: " + newsSearch.results[i].publisher; + "</p>"
    //             //     gloc.innerHTML = "<p>Location: " + newsSearch.results[i].location; + "</p>"
    //             //     gurl.innerHTML = "<p>Visit: " + newsSearch.results[i].signedRedirectUrl; + "</p>"
    //             //     glang.innerHTML = "<p>Published language: " + newsSearch.results[i].language; + "</p>"

    //             //     // Append search results to the HTML nodes
    //             //     p.appendChild(gimg);
    //             //     p.appendChild(gtitle);
    //             //     p.appendChild(gcontent);
    //             //     p.appendChild(gpubdate);
    //             //     p.appendChild(gpub);
    //             //     p.appendChild(gloc);
    //             //     p.appendChild(gurl);
    //             //     p.appendChild(glang);
    //             //     container.appendChild(p);
    //             }
    //             console.log("$scope.gnewsData");
    //             console.log($scope.gnewsData);
    //         }
    //     }


    //     // Set searchComplete as the callback function when a search is 
    //     // complete.  The newsSearch object will have results in it.
    //     newsSearch.setSearchCompleteCallback(this, searchComplete(), null);

    //     // Specify search quer(ies)
    //     newsSearch.execute(gnewsfeed);


    //     // Include the required Google branding
    //     /*google.search.Search.getBranding('branding');*/

    //     $mdDialog.hide();


    // }
}]);

routerApp.controller('imInit',['$scope', '$http', '$rootScope', '$mdDialog', 'widId',function ($scope, $http, $rootScope, $mdDialog, widId) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);

    $scope.cancel = function() {
        $mdDialog.hide();
    };

    //complete config  
    $scope.finish = function() {
        $rootScope.image = $scope.image;
        $rootScope.dashboard.widgets[objIndex].widIm = $rootScope.image;
        // console.log(JSON.stringify($rootScope.image));
        $mdDialog.hide();
    };
}]);

routerApp.controller('csvInit',['$scope', '$http', '$mdDialog', 'widId', '$rootScope',function ($scope, $http, $mdDialog, widId, $rootScope) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);

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

routerApp.controller('weatherInit',['widId', '$scope', '$http', '$rootscope', '$mdDialog',function (widId, $scope, $http, $rootscope, $mdDialog) {
    //cancel config
    $scope.cancel = function() {
        $mdDialog.hide();
    };

    //complete config  
    $scope.finish = function() {
        $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + $scope.locZip + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')

        .success(function(data) {

                var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
                $rootScope.dashboard.widgets[objIndex].widData = data.query;
                $mdDialog.hide();
            })
            .error(function(err) {
                console.log('Error retrieving markets');
            });
    };
}]);

routerApp.controller('adsenseInit',['widId', '$scope', '$http', '$rootScope', '$mdDialog',function (widId, $scope, $http, $rootScope, $mdDialog) {
    $scope.cancel = function() {
        $mdDialog.hide();
    }

    $scope.finish = function() {
        $mdDialog.hide();
    }
    $scope.signIn = function() {

    }
}]);

routerApp.controller('calendarInit',['widId', '$scope', '$http', '$rootScope', '$mdDialog', '$compile', '$timeout', 'uiCalendarConfig',function (widId, $scope, $http, $rootScope, $mdDialog, $compile, $timeout, uiCalendarConfig) {
    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);

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
        alert('tset');
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

routerApp.controller('googlePlusInit',['$scope', 'googleService', '$http', '$mdDialog', 'widId', '$rootScope',
    function ($scope, googleService, $http, $mdDialog, widId, $rootScope) {

        var loggedIn = false;
        $scope.login = function() {
            googleService.signin().then(function(data) {
                loggedIn = true;
                console.log(data);
            }, function(err) {
                console.log('Failed: ' + err);
            });
        };

        $scope.logout = function() {

            googleService.signout().then(function(data) {
                loggedIn = false;
                console.log(data);
            }, function(err) {
                console.log('Failed: ' + err);
            });
        };

        $scope.cancel = function() {
            $mdDialog.hide();
        };

        $scope.finish = function() {

            if (loggedIn) {

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
            }
            $mdDialog.hide();
        };

        $scope.tabs = {
                    selectedIndex: 0,
                    pagination: true
        };
    }
]);

routerApp.controller('sltivrInit', function($scope, $mdDialog, $rootScope) {

    $scope.countTo = 349;
    $scope.countFrom = 0;
    $scope.countToIvr = 21;
    $scope.countFromIvr = 0;
});

routerApp.controller('sltqueueInit', function($scope, $mdDialog, $rootScope) {

    $scope.countTo = 234;
    $scope.countFrom = 0;

    $scope.countToqueue = 89;
    $scope.countFromqueue = 0;
    $scope.options = {
        chart: {
            type: 'pieChart',
            height: 450,
            donut: true,
            x: function(d) {
                return d.key;
            },
            y: function(d) {
                return d.y;
            },
            showLabels: true,

            pie: {
                margin: {
                    top: -330,
                    right: 0,
                    bottom: 5,
                    left: 0
                },
                startAngle: function(d) {
                    return d.startAngle / 2 - Math.PI / 2
                },
                endAngle: function(d) {
                    return d.endAngle / 2 - Math.PI / 2
                }
            },
            transitionDuration: 500,
            legend: {
                margin: {
                    top: 80,
                    right: 0,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };

    $scope.data = [{
        key: "Currently in queue",
        y: 34
    }, {
        key: "Queued < 1 min",
        y: 2
    }, {
        key: "Queued < 3 minutes",
        y: 9
    }, {
        key: "Queued < 5 minutes",
        y: 7
    }, {
        key: "Queued > 5 minutes",
        y: 4
    }];

});

routerApp.controller('sltqueuedetailsInit', function($scope, $mdDialog, $rootScope) {

    $scope.options = {
        chart: {
            type: 'cumulativeLineChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 60,
                left: 65
            },
            x: function(d) {
                return d[0];
            },
            y: function(d) {
                return d[1] / 100;
            },
            average: function(d) {
                return d.mean / 100;
            },

            color: d3.scale.category10().range(),
            transitionDuration: 200,
            useInteractiveGuideline: true,
            clipVoronoi: false,

            xAxis: {
                axisLabel: 'X Axis',
                tickFormat: function(d) {
                    return d3.time.format('%m/%d/%y')(new Date(d))
                },
                showMaxMin: false,
                staggerLabels: false
            },

            yAxis: {
                axisLabel: 'Y Axis',
                tickFormat: function(d) {
                    return d3.format('')(d);
                },
                axisLabelDistance: 20
            }
        }
    };

    $scope.data = [{

            key: "Sinhala",
            values: [
                [24, -2.974623048543],
                [40, -1.7740300785979],
                [12, 4.4681318138177],
                [10, 7.0242541001353],
                [11, 7.5709603667586],
                [7, 20.612245065736],
                [8, 21.698065237316],
                [11, 40.501189458018],
                [8, 21.698065237316]

            ],
            mean: 24
        }, {
            key: "English",
            values: [
                [54, -0.77078283705125],
                [23, -1.8356366650335],
                [32, -5.3121322073127],
                [11, -4.9320975829662],
                [34, -3.9835408823225],
                [32, -6.8694685316805],
                [12, -8.4854877428545],
                [32, -15.933627197384],
                [34, -15.920980069544]

            ],
            mean: 32
        }, {
            key: "Tamil",
            mean: 11,
            values: [
                [11, -3.7454058855943],
                [23, -3.6096667436314],
                [1, -0.8440003934950],
                [12, 2.0921565171691],
                [14, 3.5874194844361],
                [12, 13.742776534056],
                [14, 13.212577494462],
                [16, 24.567562260634],
                [11, 34.543699343650]
            ]
        }
    ];
});
routerApp.controller('sltagentInit', function($scope, $mdDialog, $rootScope) {

    $scope.countTo = 134;
    $scope.countFrom = 0;

    $scope.options = {
        chart: {
            type: 'pieChart',
            height: 500,
            x: function(d) {
                return d.key;
            },
            y: function(d) {
                return d.y;
            },
            pie: {
                margin: {
                    top: -250,
                    right: 0,
                    bottom: 100,
                    left: 50
                }
            },
            showLabels: true,
            transitionDuration: 500,
            labelThreshold: 0.01,
            legend: {
                margin: {
                    top: 200,
                    right: 0,
                    bottom: 0,
                    left: 0
                }
            }
        }
    };
    $scope.data = [{
        key: "Currently connected",
        y: 12
    }, {
        key: "connected < 1 min",
        y: 2
    }, {
        key: "connected < 3 minutes",
        y: 1
    }, {
        key: "Queconnectedued < 5 minutes",
        y: 0
    }, {
        key: "connected > 5 minutes",
        y: 4
    }];
});

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

routerApp.controller('googleMapsInit',['widId', '$scope', '$http', '$rootScope', '$mdDialog',function (widId, $scope, $http, $rootScope, $mdDialog) {

    $scope.finish = function() {
        $mdDialog.hide();

    };

    $scope.cancel = function() {
        $mdDialog.hide();
    };
}]);

routerApp.controller('d3SunBurst', function($rootScope, $scope, $http) {

    $scope.loadData = function() {

        try {
            $scope.data1 = JSON.parse($rootScope.hierarchyData);

        } catch (e) {
            console.log(e);
        }
    };
});

routerApp.controller('D3ForceCtrl', function($rootScope, $scope, $http) {

    $scope.loadData = function() {

        try {
            $scope.data = JSON.parse($rootScope.hierarchyData);

        } catch (e) {
            console.log(e);
        }
    };
});
 

routerApp.controller('hnbInit',['$scope', '$rootScope', '$http', '$mdDialog', 'widId', 'Digin_Engine_API1',function ($scope, $rootScope, $http, $mdDialog, widId, Digin_Engine_API1) {

    $scope.datasources = ['BigQuery']; //temporary
    $scope.widgetValidity = 'elasticValidation'; //validation message visibility                                             
    $scope.query = {};
    $scope.query.state = false;
    $scope.query.drilled = false;
    $scope.checkedFields = [];
    $scope.dataIndicator = false;
    $scope.dataIndicator1 = false;
    $scope.categoryVal = "";
    $scope.mappedArray = {};
    $scope.tablename = ""
    $scope.dataTab = true;
    $scope.chartTab = true;
    $scope.seriesAttributes = [];
    $rootScope.hierarchyData = [];
    //getting the widget object
    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
    $scope.widget = $rootScope.dashboard.widgets[objIndex];

    $scope.getTables = function () {

        if ($scope.datasource == "BigQuery") {

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function (e) {
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
            xhr.ontimeout = function () {
                console.error("request timedout: ", xhr);
            }
            xhr.open("get", Digin_Engine_API1 + "GetTables?dataSetName=Demo&db=BigQuery", /*async*/ true);
            xhr.send();
        }
    };


    //check for selected classes
    $scope.getFields = function () {
        $scope.selectedFields = [];
        if ($scope.datasource == "BigQuery") {
            if ($scope.selectedClass != null) {
                $scope.indexType = $scope.selectedClass;
//                var fieldData = ($scope.selectedClass.split(':')[1]).split('.');
                //$scope.bigQueryFieldDetails = fieldData;
                $scope.dataIndicator1 = true;

                getJSONDataByProperty($http, 'pythonServices', 'name', 'Python', function (data) {
                    var requestObj = data[0].getFields;
                    var namespace = localStorage.getItem('srcNamespace');
                    console.log(JSON.stringify(requestObj));
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function (e) {
                        console.log(this);
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                console.log('query response:' + JSON.parse(xhr.response));
                                var data = JSON.parse(xhr.response);
                                if (data.length > 0) {
                                    data.forEach(function (entry) {
                                        $scope.selectedFields.push({
                                            name: entry,
                                            checked: false
                                        });
                                    });
                                    $scope.toggleTab(1);
                                } else console.log('There are no fields present in the class');
                                $scope.dataIndicator1 = false;
                            } else {
                                console.error("XHR didn't work: ", xhr.status);
                            }
                        }
                    }
                    xhr.ontimeout = function () {
                        console.error("request timedout: ", xhr);
                    }
                    xhr.open(requestObj.method, requestObj.host + requestObj.request + "?"
                        + requestObj.params[0] + "=Demo&&" + requestObj.params[1] + "=" + $scope.selectedClass + "&" + requestObj.params[2] + "=BigQuery", /*async*/ true);
                    xhr.send();
                });

//                $http({
//                    method: 'GET',
//                    url: Digin_Engine_API + 'GetFields?datasetName=Demo&&tableName=' + $scope.selectedClass,
//                }).
//                success(function(data, status) {
//                    if (data.length > 0) {
//                        data.forEach(function(entry) {
//                            $scope.selectedFields.push({
//                                name: entry,
//                                checked: false
//                            });
//                        });
//                        $scope.toggleTab(1);
//
//                    } else console.log('There are no fields present in the class');
//                    $scope.dataIndicator1 = false;
//                }).
//                error(function(data, status) {
//                    alert("Request failed");
//
//                });
            } else {
                $scope.widgetValidity = 'fade-in';
                $scope.validationMessage = "Please select a class";
            }

        }
    };
    $scope.toggleTab = function (ind) {
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

    //selects fields for non-queried data retrieval
    $scope.toggleCheck = function (index) {
        index.checked = !index.checked;
        if ($scope.checkedFields.indexOf(index) === -1) {
            $scope.checkedFields.push(index);
        } else {
            $scope.checkedFields.splice($scope.checkedFields.indexOf(index), 1);
        }
    };

    $scope.getData = function () {
        var w1 = new Worker("scripts/webworkers/bigQueryWorker.js");

        $rootScope.hierarchystring = '{';
        if ($scope.checkedFields.length != 0 || typeof $scope.query.value != "undefined") {
            $scope.classFields = $scope.checkedFields;
            $scope.classQuery = $scope.query.value;
            $scope.parameter = "";
            if ($scope.query.state) {
                $scope.parameter = $scope.classQuery;
            } else {
                for (param in $scope.classFields) {
                    $scope.parameter += " " + $scope.classFields[param].name;
                }
                $scope.parameter += " " + $scope.categoryVal;
            }

            $scope.dataIndicator = true;

            function mapRetrieved(event) {
                var obj = JSON.parse(event.data);
                console.log(JSON.stringify(obj));
                $scope.dataIndicator = false;

                //creating the array to map dynamically
                $scope.arrayAttributes = [];
                for (var key in obj) {
                    $rootScope.hierarchystring += '"' + obj[key].value + "'" + ":" + obj[key].level + ",";
                    $scope.arrayAttributes.push(obj[key].value);
                }
                $scope.toggleTab(2);
            };

            if ($scope.datasource == "BigQuery") {
                w1.postMessage($scope.selectedClass + "," + Digin_Engine_API1 + "," + "HierarchyFields" + "," + $scope.parameter.toString());

                w1.addEventListener('message', function (event) {
                    mapRetrieved(event);
                });

                $scope.widgetValidity = 'fade-out';

            }
        } else {
            if ($scope.query.state) $scope.validationMessage = "Please add a query for data retrieval";
            else $scope.validationMessage = "Please select fields for data retrieval";
            $scope.widgetValidity = 'fade-in';

            function mapRetrieved(event) {
                var obj = JSON.parse(event.data);
                console.log(JSON.stringify(obj));
                $scope.dataIndicator = false;

                //creating the array to map dynamically
                $scope.arrayAttributes = [];
                for (var key in obj) {
                    $rootScope.hierarchystring += '"' + obj[key].value + '"' + ":" + obj[key].level + ",";
                    $scope.arrayAttributes.push(obj[key].value);
                }

                $rootScope.hierarchystring = $rootScope.hierarchystring.replace(/,\s*$/, "");
                $rootScope.hierarchystring += "}";
                $scope.toggleTab(2);
            };
        }

    };


    //builds the chart
    $scope.buildchart = function (widget) {
        var w2 = new Worker("scripts/webworkers/bigQueryWorker.js");
        var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
        $scope.widget = $rootScope.dashboard.widgets[objIndex];
        w2.postMessage($scope.selectedClass + "," + Digin_Engine_API1 + "," + "Hierarchy" + "," + $rootScope.hierarchystring.toString());
        w2.addEventListener('message', function (event) {
            hierarchyRetrieved(event);
        });

        function hierarchyRetrieved(event) {

            $rootScope.hierarchyData = event.data;
            $scope.widget.widData = $rootScope.hierarchyData;
            console.log($scope.widget.widData);
            $mdDialog.hide();

        };
    };


    $scope.cancel = function () {
        $mdDialog.hide();
    };


}]);

routerApp.controller('clockInit',['$scope', '$http', '$mdDialog', 'widId', '$rootScope',function ($scope, $http, $mdDialog, widId, $rootScope) {

    $scope.finish = function() {

        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.hide();
    };
}]);

