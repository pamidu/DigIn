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
|      #adsense settings  : adsenseInit                    |
|      #google cal settings  : calendarInit                |
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
    scope.addAccount = function () {
        if (fbInterface.state != 'connected')
            fbInterface.loginToFb(scope);
        else
            fbInterface.logoutFromFb(scope);
    };

    //cancel config
    scope.cancel = function () {
        $mdDialog.hide();
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
    scope.chartConf = {
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
    scope.finish = function () {
        var likeCountArray = [];
        var startingDayStr;
        var dateObj = {
            until: new Date(),
            range: 7
        }

        //getting page likes insights
        fbInterface.getPageLikesInsight(scope.fbPageModel, dateObj, function (data) {

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
        fbInterface.getPageViewsInsight(scope.fbPageModel, dateObj, function (data) {

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
    scope.changePage = function () {
        //get page data on change
        fbInterface.getPageData(scope, function (data) {
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
    scope.addAccount = function () {
        if (!linkedinInterface.state)
            linkedinInterface.loginToLinkedin(scope);
        else
            linkedinInterface.logoutFromLinkedin(scope);
    };

    //cancel config
    scope.cancel = function () {
        $mdDialog.hide();
    };

    //complete config  
    scope.finish = function () {
        linkedinInterface.getUserAccountOverview(scope, function (data) {
            var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
            $rootScope.dashboard.widgets[objIndex].widData = data;
        });
        $mdDialog.hide();
    };
};

function TwitterInit($scope, $http, $mdDialog, widId, $rootScope, $q, twitterService) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);

    $scope.cancel = function () {
        $mdDialog.hide();
    };
    $scope.finish = function () {

        // twitterService.initialize();
        $mdDialog.hide();

    };

    $rootScope.tweets = []; //array of tweets

    twitterService.initialize();

    //using the OAuth authorization result get the latest 20 tweets from twitter for the user
    $scope.refreshTimeline = function (maxId) {
        twitterService.getLatestTweets(maxId).then(function (data) {
            $rootScope.tweets = $rootScope.tweets.concat(data);

        }, function () {
            $scope.rateLimitError = true;
        });

        $rootScope.dashboard.widgets[objIndex].widData = $rootScope.tweets;

    }

    //when the user clicks the connect twitter button, the popup authorization window opens
    $scope.connectButton = function () {
        twitterService.connectTwitter().then(function () {
            if (twitterService.isReady()) {
                //if the authorization is successful, hide the connect button and display the tweets

                $('#connectButton').fadeOut(function () {
                    $('#getTimelineButton, #signOut').fadeIn();

                    $scope.connectedTwitter = true;
                });
            } else {


            }
        });
    }

    //sign out clears the OAuth cache, the user will have to reauthenticate when returning
    $scope.signOut = function () {
        twitterService.clearCache();
        $rootScope.tweets.length = 0;

        $('#getTimelineButton, #signOut').fadeOut(function () {
            $('#connectButton').fadeIn();

            $scope.$apply(function () {
                $scope.connectedTwitter = false
            })
        });

        $scope.rateLimitError = false;
    }

    //if the user is a returning user, hide the sign in button and display the tweets
    if (twitterService.isReady()) {
        $('#connectButton').hide();
        $('#getTimelineButton, #signOut').show();

        $scope.connectedTwitter = true;
        $scope.refreshTimeline();
    }

};

function analyticsInit($scope, $http, $mdDialog, widId, $rootScope) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);

    $scope.cancel = function () {
        $mdDialog.hide();
    };
    $scope.finish = function () {
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
    $rootScope.$on('$gaReportSuccess', function (e, report, element) {

    });


    $rootScope.dashboard.widgets[objIndex].widAna = $rootScope.charts;

    $rootScope.dashboard.widgets[objIndex].widAque = $rootScope.queries;

    $rootScope.dashboard.widgets[objIndex].widAexc = $rootScope.extraChart;

};


function YoutubeInit($scope, $http, $mdDialog, widId, $rootScope, $log, VideosService) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);

    $scope.cancel = function () {
        $mdDialog.hide();
    };
    $scope.finish = function () {
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

    $scope.launch = function (id, title) {
        VideosService.launchPlayer(id, title);
        VideosService.archiveVideo(id, title);
        VideosService.deleteVideo($scope.upcoming, id);
        $log.info('Launched id:' + id + ' and title:' + title);
    };

    $scope.queue = function (id, title) {
        VideosService.queueVideo(id, title);
        VideosService.deleteVideo($scope.history, id);
        $log.info('Queued id:' + id + ' and title:' + title);
    };

    $scope.delete = function (list, id) {
        VideosService.deleteVideo(list, id);
    };

    $scope.search = function () {
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
            .success(function (data) {
                VideosService.listResults(data);
                $rootScope.dashboard.widgets[objIndex].widData = data;
                $mdDialog.hide();

            })
            .error(function () {
                $log.info('Search error');
            });

    }

    $scope.tabulate = function (state) {

        $scope.playlist = state;
    }

};

//new elastic controller
function elasticInit($scope, $http, $objectstore, $mdDialog, $rootScope, widId, $mdToast, $timeout) {

    $scope.filterAttributes = ['Sum', 'Average', 'Percentage', 'Count'];

    $scope.datasources = ['DuoStore', 'BigQuery', 'CSV/Excel', 'Rest/SOAP Service', 'SpreadSheet']; //temporary
    $scope.storeIndex = 'com.duosoftware.com';
    $scope.widgetValidity = 'elasticValidation'; //validation message visibility                                             
    $scope.query = {};
    $scope.query.state = false;
    $scope.query.drilled = false;
    $scope.checkedFields = [];
    $scope.dataIndicator = false;
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

    $scope.getTables = function(){
        alert('test');
        if($scope.datasource == "DuoStore"){
            var client = $objectstore.getClient($scope.storeIndex, " ");

            client.getClasses($scope.storeIndex);

            //classes retrieved
            client.onGetMany(function (data) {
                if (data.length > 0) $scope.objClasses = data;
                else console.log('There are no classes present');
            });

            //error getting classes from the index
            client.onError(function (data) {
                console.log('Error getting classes');
            });
        }else if($scope.datasource == "BigQuery"){
            $http({
                method: 'JSONP',
                url: 'http://localhost:8080/GetTables?dataSetID=samples',
                }).
            success(function (data, status) {
                console.log('big query data:'+JSON.stringify(data));
            }).
            error(function (data, status) {});
        }
    };

    if(typeof $scope.widget.widConfig == 'undefined'){

        $scope.seriesArray = [{
            name: 'series1',
            serName: '',
            filter: '',
            type: 'area',
            color: ''
        }];

    } else{
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
    $scope.getFields = function () {
        $scope.selectedFields = [];
        if ($scope.datasource == "DuoStore") {
            if ($scope.selectedClass != null) {
                $scope.indexType = $scope.selectedClass;
                var client1 = $objectstore.getClient($scope.storeIndex, $scope.indexType);
                client1.getFields($scope.storeIndex, $scope.indexType);

                //class's fields retrieved
                client1.onGetMany(function (data) {
                    if (data.length > 0) {
                        data.forEach(function (entry) {
                            $scope.selectedFields.push({
                                name: entry,
                                checked: false
                            });
                        });

                        //change the tab
                        $scope.toggleTab(1);
                        $scope.widgetValidity = 'fade-out';
                    } else console.log('There are no fields present in the class');
                });

                //error getting fields from the class
                client1.onError(function (data) {
                    console.log('Error getting fields');
                });
            } else {
                $scope.widgetValidity = 'fade-in';
                $scope.validationMessage = "Please select a class";
            }
        } else if ($scope.datasource == "BigQuery") {

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
    $scope.toggleCheck = function (index) {
        index.checked = !index.checked;
        if ($scope.checkedFields.indexOf(index) === -1) {
            $scope.checkedFields.push(index);
        } else {
            $scope.checkedFields.splice($scope.checkedFields.indexOf(index), 1);
        }
    };

    $scope.getData = function () {
        var w = new Worker("scripts/webworkers/elasticWorker.js");
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
            if ($scope.datasource == "DuoStore") {
                w.postMessage($scope.indexType + "," + parameter + "," + $scope.query.state);
                w.addEventListener('message', function (event) {
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
                                $scope.mappedArray[key].unique =                                                                                                                     Enumerable.From($scope.mappedArray[key].data).Select().Distinct().ToArray().length;
                            }
                        }
                    }

                    $scope.toggleTab(2);

                });

                $scope.widgetValidity = 'fade-out';
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
    $scope.buildchart = function (widget) {
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
    $scope.orderByCat = function (widget) {
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

            if(typeof $scope.filtering == 'undefined'){
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
                    series: [],
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
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
            source : $scope.datasource,
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
    $scope.orderByDrilledCat = function (widget) {
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

            if(typeof $scope.filtering == 'undefined'){
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
            },
            title: {
                text: ''
            },
            size: {
                width: 300,
                height: 220
            }
        };

        widget['widConfig'] = {
            source : $scope.datasource,
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


    $scope.groupDrilledItems = function (uniqueArray, objArray) {
        for (j = 0; j < objArray.length; j++) {
            uniqueArray[objArray[j].drill] += objArray[j].val;
        }
        return uniqueArray;
    };

    //$scope.

    $scope.getDrillArray = function () {
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
    $scope.addSeries = function () {
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
    $scope.removeSeries = function (ind) {
        $scope.seriesArray.splice(ind, 1);
    }

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

    //close the config

    $scope.cancel = function () {
        $mdDialog.hide();
    }

    $scope.filterData = function (c) {
        var filter = eval('new ' + c.toUpperCase() + '();');
        $scope.filtering = new Filtering();
        $scope.filtering.setFilter(filter);
        $scope.seriesAttributes = $scope.filtering.filterFields();
        $scope.widgetValidity = 'fade-out';
    };

    $scope.checkSeriesAvailability = function () {
        if ($scope.seriesAttributes.length == 0) {
            $scope.validationMessage = "Please check the filter you select";
            $scope.widgetValidity = 'fade-in';
        }
    };


    /* Strategy1 begin */
    var Filtering = function () {
        this.filter = "";
    };

    Filtering.prototype = {
        setFilter: function (filter) {
            this.filter = filter;
        },

        calculate: function (orderedObj, catMappedData, serMappedData, drillData) {
            return this.filter.calculate(orderedObj, catMappedData, serMappedData, drillData);
        },

        filterFields: function () {
            return this.filter.filterFields();
        }
    };

    var SUM = function () {
        this.calculate = function (orderedObj, catMappedData, serMappedData, drillData) {
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

        this.filterFields = function () {
            return getFilteredFields(false);
        }
    };

    var AVERAGE = function () {
        this.calculate = function (orderedObj, catMappedData, serMappedData, drillData) {
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

        this.filterFields = function () {
            return getFilteredFields(false);
        }
    };

    var PERCENTAGE = function () {
        this.calculate = function (orderedObj, catMappedData, serMappedData, drillData) {
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

        this.filterFields = function () {
            return getFilteredFields(false);
        }
    };

    var COUNT = function () {
        this.calculate = function (orderedObj, catMappedData, serMappedData, drillData) {
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

        this.filterFields = function () {
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

};


function InitConfigD3($scope, $mdDialog, widId, $rootScope, $sce, d3Service, $timeout) {

     
 

    $scope.cancel = function () {
        $mdDialog.hide();
    };

};




function wordpressInit($scope, $http, $mdDialog, widId, $rootScope) {

    //cancel config
    $scope.cancel = function () {
        $mdDialog.hide();
    };

    //complete config  
    $scope.finish = function () {
        var wpapi = "http://public-api.wordpress.com/rest/v1/sites/";
        var choice = "/posts";
        var callbackString = '/?callback=JSON_CALLBACK';

        var message = $http.jsonp(wpapi + $scope.wpdomain + choice + callbackString).
        success(function (data, status) {
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
            //$rootScope.dashboard.widgets[objIndex].widData = data;
        }).
        error(function (data, status) {

            console.log(message);
        });
        $mdDialog.hide();
    };

};


function rssInit($scope, $http, $mdDialog, widId, $rootScope) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);

    //cancel config
    $scope.cancel = function () {
        $mdDialog.hide();
    };

    //complete config  
    $scope.finish = function (rssAddress) {


        $scope.entryArray = [];
        google.load("feeds", "1");
        var feed = new google.feeds.Feed(rssAddress);
        feed.setNumEntries(100);

        feed.load(function (result) {
            if (!result.error) {

                for (var i = 0; i < result.feed.entries.length; i++) {

                    var entry = result.feed.entries[i];

                    $scope.entryContent = entry.content;
                    $scope.entryArray.push(entry);

                    $scope.$apply();
                }

                $rootScope.dashboard.widgets[objIndex].widData = $scope.entryArray;

            }
        });

        $mdDialog.hide();
    };

};


function spreadInit($scope, $http, $mdDialog, widId, $rootScope, lkGoogleSettings) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);

    //cancel config
    $scope.cancel = function () {
        $mdDialog.hide();
    };

    //complete config  
    $scope.finish = function () {
        $mdDialog.hide();
    };

    $rootScope.files = [];
    $rootScope.show = "hello";

    // Callback triggered after Picker is shown
    $scope.onLoaded = function () {
        //console.log('Google Picker loaded!');
    }

    // Callback triggered after selecting files
    $scope.onPicked = function (docs) {
        angular.forEach(docs, function (file, index) {
            // alert('You have selected: ' + file.id);
            $rootScope.files.push(file);
            $rootScope.dashboard.widgets[objIndex].widData = $rootScope.files;
            $mdDialog.hide();

        });
    }

    // Callback triggered after clicking on cancel
    $scope.onCancel = function () {
        //console.log('Google picker close/cancel!');
    }

};


function gnewsInit($scope, $http, $mdDialog, widId, $rootScope) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);

    google.load('search', '1');
    //cancel config
    $scope.cancel = function () {
        $mdDialog.hide();

    };

    var newsSearch;


    $scope.finish = function (text) {


        var gnewsfeed = document.getElementById('gnewsrequest').value;
        // Create a News Search instance.

        newsSearch = new google.search.NewsSearch();

        function searchComplete() {

            var container = document.getElementById('gnews-div');
            container.innerHTML = '';

            if (newsSearch.results && newsSearch.results.length > 0) {

                for (var i = 0; i < newsSearch.results.length; i++) {


                    // Create HTML elements for search results
                    var p = document.createElement('p');
                    var gimg = document.createElement('gimg');
                    var gtitle = document.createElement('gtitle');
                    var gcontent = document.createElement('gcontent');
                    var gpubdate = document.createElement('gpubdate');
                    var gpub = document.createElement('gpub');
                    var gloc = document.createElement('gloc');
                    var gurl = document.createElement('gurl');
                    var glang = document.createElement('glang');



                    gimg.innerHTML = '<img style="width:60px;height:60px;" src=\"' + newsSearch.results[i].image.url + '\">'
                    gtitle.innerHTML = "<h2>" + newsSearch.results[i].title; + "</h2>"
                    gcontent.innerHTML = "<p>" + newsSearch.results[i].content; + "</p>"
                    gpubdate.innerHTML = "<p>Published on: " + newsSearch.results[i].publishedDate; + "</p>"
                    gpub.innerHTML = "<p>Published by: " + newsSearch.results[i].publisher; + "</p>"
                    gloc.innerHTML = "<p>Location: " + newsSearch.results[i].location; + "</p>"
                    gurl.innerHTML = "<p>Visit: " + newsSearch.results[i].signedRedirectUrl; + "</p>"
                    glang.innerHTML = "<p>Published language: " + newsSearch.results[i].language; + "</p>"

                    // Append search results to the HTML nodes
                    p.appendChild(gimg);
                    p.appendChild(gtitle);
                    p.appendChild(gcontent);
                    p.appendChild(gpubdate);
                    p.appendChild(gpub);
                    p.appendChild(gloc);
                    p.appendChild(gurl);
                    p.appendChild(glang);
                    container.appendChild(p);
                }
            }
        }


        // Set searchComplete as the callback function when a search is 
        // complete.  The newsSearch object will have results in it.
        newsSearch.setSearchCompleteCallback(this, searchComplete, null);

        // Specify search quer(ies)
        newsSearch.execute(gnewsfeed);


        // Include the required Google branding
        /*google.search.Search.getBranding('branding');*/

        $mdDialog.hide();


    }
};

function imInit($scope, $http, $rootScope, $mdDialog, widId) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);

    $scope.cancel = function () {
        $mdDialog.hide();
    };

    //complete config  
    $scope.finish = function () {
        $rootScope.image = $scope.image;
        $rootScope.dashboard.widgets[objIndex].widIm = $rootScope.image;
        // console.log(JSON.stringify($rootScope.image));
        $mdDialog.hide();
    };
};

function csvInit($scope, $http, $mdDialog, widId, $rootScope) {


    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);

    $rootScope.myData = [58.13, 53.98, 67.00, 89.70, 99.00, 13.28, 66.70, 34.98];
    $rootScope.dashboard.widgets[objIndex].widCsc = $rootScope.myData;

    $scope.cancel = function () {
        $mdDialog.hide();
    };

    $scope.finish = function (file) {

        $rootScope.csvFile = file;
        // $rootScope.myData = file;
        //console.log($rootScope.csvFile);
        $rootScope.dashboard.widgets[objIndex].widCsv = $rootScope.csvFile;

        $mdDialog.hide();


    };

};


function weatherInit(widId, $scope, $http, $rootscope, $mdDialog) {
    //cancel config
    $scope.cancel = function () {
        $mdDialog.hide();
    };

    //complete config  
    $scope.finish = function () {
        $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + $scope.locZip + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')

        .success(function (data) {

                var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
                $rootScope.dashboard.widgets[objIndex].widData = data.query;
                $mdDialog.hide();
            })
            .error(function (err) {
                console.log('Error retrieving markets');
            });
    };

}

function adsenseInit(widId, $scope, $http, $rootScope, $mdDialog) {
    $scope.cancel = function () {
        $mdDialog.hide();
    }

    $scope.finish = function () {
        $mdDialog.hide();
    }
    $scope.signIn = function () {

    }

}

function calendarInit(widId, $scope, $http, $rootScope, $mdDialog, $compile, $timeout, uiCalendarConfig) {

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
    $scope.alertOnEventClick = function (date, jsEvent, view) {
        $scope.alertMessage = (date.title + ' was clicked ');
    };

    /* Change View */
    $scope.renderCalender = function (calendar) {
        $timeout(function () {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        });
    };

    /* Change View */
    $scope.changeView = function (view, calendar) {
        alert('tset');
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    };
    /* Change View */
    $scope.renderCalender = function (calendar) {
        $timeout(function () {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        });
    };

    /* Render Tooltip */
    $scope.eventRender = function (event, element, view) {
        element.attr({
            'tooltip': event.title,
            'tooltip-append-to-body': true
        });
        $compile(element)($scope);
    };

    $scope.authorize = function () {
        var config = {
            'client_id': '774419948210-c4k8kdkf235pldvp6g8h8a6mnb58qpfm.apps.googleusercontent.com',
            'scope': 'https://www.googleapis.com/auth/calendar'
        };
        gapi.auth.authorize(config, function () {
            console.log('login complete');
            console.log(gapi.auth.getToken());
        });
    }

    $scope.cancel = function () {
        $mdDialog.hide();

    };

    $scope.finish = function () {
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

        request.execute(function (resp) {
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



};




function googlePlusInit($scope, $http, $mdDialog, widId, $rootScope) {


    $scope.cancel = function () {
        $mdDialog.hide();
    };

    $scope.finish = function () {

        $mdDialog.hide();

    };

    var auth2 = {};
    var helper = (function () {
        return {
            onSignInCallback: function (authResult) {
                $('#authResult').html('Auth Result:<br/>');
                for (var field in authResult) {
                    $('#authResult').append(' ' + field + ': ' +
                        authResult[field] + '<br/>');
                }
                if (authResult.isSignedIn.get()) {
                    $('#authOps').show('slow');
                    $('#gConnect').hide();
                    helper.profile();
                    helper.people();
                    helper.peoplee();
                    helper.peopless();
                    helper.activities();
                    helper.organizationsu();
                    helper.placestofind();
                    helper.followings();
                    helper.makeGoogleApiCalls();
                } else if (authResult['error'] ||
                    authResult.currentUser.get().getAuthResponse() == null) {
                    console.log('There was an error: ' + authResult['error']);
                    $('#authResult').append('Logged out');
                    $('#authOps').hide('slow');
                    $('#gConnect').show();
                }


            },

            /**
             * Calls the OAuth2 endpoint to disconnect the app for the user.
             */
            disconnect: function () {
                // Revoke the access token.
                auth2.disconnect();
            },

            /**
             * Gets and renders the list of people visible to this app.
             */
            people: function () {
                gapi.client.plus.people.list({
                    'userId': 'me',
                    'collection': 'visible'
                }).then(function (res) {
                    var people = res.result;
                    $('#visiblePeople').empty();
                    $('#visiblePeople').append('<h6>' +
                        people.totalItems + '</h6>');
                    for (var personIndex in people.items) {
                        person = people.items[personIndex];
                        $('#visiblePeople').append('<p>' + '<h6>Name:</h6>' + person.displayName + '</br>' + '<img style="width:50px;height:50px;" src="' + person.image.url + '">' + '</p><br/>');
                    }
                });
            },

            peoplee: function () {
                gapi.client.plus.people.list({
                    'userId': 'me',
                    'collection': 'visible'
                }).then(function (res) {
                    var people1 = res.result;
                    $('#followerss').empty();
                    $('#followerss').append('<h6>' +
                        people1.totalItems + '</h6><br/>');
                    for (var personIndex in people1.items) {
                        person1 = people1.items[personIndex];
                        $('#followerss').append('');
                    }
                });
            },

            peopless: function () {
                gapi.client.plus.people.list({
                    'userId': 'me',
                    'collection': 'connected'
                }).then(function (res) {
                    var peoplee = res.result;
                    $('#connectedPeople').empty();
                    $('#connectedPeople').append('<h6>' +
                        peoplee.totalItems + '</h6><br/>');
                    for (var personIndex in peoplee.items) {
                        personn = peoplee.items[personIndex];
                        $('#connectedPeople').append('<img src="' + person.image.url + '">');
                    }
                });
            },

            /**
             * Gets and renders the list of activities visible to this app.
             */

            activities: function () {
                gapi.client.plus.activities.list({
                    'userId': 'me',
                    'collection': 'public'
                }).then(function (res) {

                    var activitiess = res.result;
                    $('#activitylist').empty();
                    for (var activityIndex in activitiess.items) {
                        activityy = activitiess.items[activityIndex];
                        $('#activitylist').append('<h6>Post Title: ' +
                            activityy.title + '</h6>' + '<h6> No of replies: ' + activityy.object.replies.totalItems + '</br> No of plusoners: ' + activityy.object.plusoners.totalItems + '</br> No of resharers: ' + activityy.object.resharers.totalItems + '</h6></h6><br/>');
                    }
                });
            },


            organizationsu: function () {
                gapi.client.plus.people.get({
                    'userId': 'me',

                }).then(function (res) {

                    var org = res.result;
                    $('#orglist').empty();
                    for (var orgIndex in org.organizations) {
                        orgs = org.organizations[orgIndex];
                        $('#orglist').append('<h6>User organizations:</h6>' + '<p>' + orgs.name + '</p><br/>');
                    }
                });
            },

            placestofind: function () {
                gapi.client.plus.people.get({
                    'userId': 'me',

                }).then(function (res) {

                    var places = res.result;
                    $('#placelist').empty();
                    for (var placeIndex in places.placesLived) {
                        placess = places.placesLived[placeIndex];
                        $('#placelist').append('<h6>User contact:</h6>' + '<p>' + placess.value + '</p><br/>');
                    }
                });
            },


            followings: function () {
                gapi.client.plus.people.get({
                    'userId': 'me',

                }).then(function (res) {

                    var following = res.result;
                    $('#followinglist').empty();
                    $('#followinglist').append(
                        $('<h6>' +
                            following.circledByCount + '</h6><br/>'));
                    for (var folowingIndex in following.circledByCount) {
                        follow = following.circledByCount[folowingIndex];
                        $('#followinglist').append('<p>' + '</br> Name:' + follow.displayName + '</br>' + '<img src="' + follow.image.url + '">' + '</p><br/>');
                    }
                });
            },


            /**
             * Gets and renders the currently signed in user's profile data.
             */

            profile: function () {
                gapi.client.plus.people.get({
                    'userId': 'me'
                }).then(function (res) {
                    var profile = res.result;
                    // console.log(profile);
                    $('#profile').empty();
                    $('#profile').append(
                        $('<p><img style="width:50px;height:50px;" src=\"' + profile.image.url + '\"></p><br/>'));
                    $('#profile').append(
                        $('<h6>Profile Name:</h6>' + '<p>' + profile.displayName + '</p><br/>' + '<h6>Family Name:</h6>' + '<p>' + profile.name.familyName + '</p><br/>' + '<h6>Profile ID:</h6>' + '<p>' + profile.id + '</p><br/>' + '<h6>Tagline:</h6> ' + '<p>' +
                            profile.tagline + '</p><br/>' + '<h6>About me:</h6>' + '<p>' + profile.aboutMe + '</p><br/>' + '<h6>Google category:</h6>' + '<p>' + profile.kind + '</p><br/>' + '<h6>User type:</h6>' + '<p>' + profile.objectType + '</p><br/>' + '<h6>Gender:</h6>' + '<p>' + profile.gender + '</p><br/>' + '<h6>Studied at:</h6>' + '<p>' + profile.braggingRights + '</p><br/>' + '<h6>Occupation:</h6>' + '<p>' + profile.occupation + '</p><br/>' + '<h6>Other names:</h6>' + '<p>' + profile.name.givenName + '</p><br/>' + '<h6>Google+ account validity:</h6>' + '<p>' + profile.isPlusUser + '</p><br/>' + '</h6><br/>'));

                    if (profile.emails) {
                        for (var i = 0; i < profile.emails.length; i++) {
                            $('#profile').append(
                                $('<p></br> Emails: ' + profile.emails[i].value + '<p><br/>'));
                        }
                        $('#profile').append('');
                    }
                    if (profile.cover && profile.coverPhoto) {
                        $('#profile').append(
                            $('<p><img src=\"' + profile.cover.coverPhoto.url + '\"></p>'));
                    }
                }, function (err) {
                    var error = err.result;
                    $('#profile').empty();
                    $('#profile').append(error.message);
                });
            }
        };
    })();

    /**
     * Handler for when the sign-in state changes.
     *
     * @param {boolean} isSignedIn The new signed in state.
     */
    var updateSignIn = function () {
        // console.log('update sign in state');
        if (auth2.isSignedIn.get()) {
            // console.log('signed in');
            helper.onSignInCallback(gapi.auth2.getAuthInstance());
        } else {
            // console.log('signed out');
            helper.onSignInCallback(gapi.auth2.getAuthInstance());
        }
    }

    /**
     * This method sets up the sign-in listener after the client library loads.
     */
    function startApp() {
        gapi.load('auth2', function () {
            gapi.client.load('plus', 'v1').then(function () {
                gapi.signin2.render('signin-button', {
                    scope: 'https://www.googleapis.com/auth/plus.login',
                    fetch_basic_profile: false
                });
                gapi.auth2.init({
                    fetch_basic_profile: false,
                    scope: 'https://www.googleapis.com/auth/plus.login'
                }).then(
                    function () {
                        // console.log('init');
                        auth2 = gapi.auth2.getAuthInstance();
                        auth2.isSignedIn.listen(updateSignIn);
                        auth2.then(updateSignIn());
                    });
            });
        });
    }

}



function instaInit($scope, $http, $window, instagram, widId, $rootScope, $mdDialog, $interval) {

    var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);



    $scope.cancel = function () {
        $mdDialog.hide();
    };


    $scope.finish = function () {
        $mdDialog.hide();
    };


    $scope.message = null;

    var searchByTag = function (tag) {

        //config
        var url = 'https://api.instagram.com/v1/tags/' + tag + '/media/recent';
        var clientId = '416e81a93f0d4cb689ded7e74749bc86';
        var config = {
                'params': {
                    'client_id': clientId,
                    'callback': 'JSON_CALLBACK',
                    'count': 200
                }
            }
            //console.log( 'json request' );
        $http.jsonp(url, config)
            .success(function (results) {
                var dataLength = results.data.length;
                var resultData = results.data;
                if (dataLength > 0) {
                    $rootScope.instaImages = resultData;

                    // console.log( resultData );
                    $rootScope.dashboard.widgets[objIndex].widData = $rootScope.instaImages;
                    // console.log(JSON.stringify($rootScope.instaImages));
                    $scope.message = "We found " + dataLength + " results for " + tag;
                } else {
                    $scope.message = "No results.";
                }
            })
            .error(function () {
                $scope.message = "Not found.";
            });

    };

    $scope.formData = {};

    $scope.submitForm = function () {
        // console.log( 'submit' );
        // console.log( $scope.formData.tagInput );
        var tag = $scope.formData.tagInput;
        searchByTag(tag);
        $scope.message = "Searching Instagram for photos tagged with " + tag;
    };

    $scope.clear = function () {
        // console.log( 'clear' );
        $scope.formData = {};
        $scope.instaImage = {};
        $scope.message = null;
        $scope.instaForm.$submitted = false;
    }

};

routerApp.controller('sltivrInit', function ($scope, $mdDialog, $rootScope) {

    $scope.countTo = 349;
    $scope.countFrom = 0;
    $scope.countToIvr = 21;
    $scope.countFromIvr = 0;


});

routerApp.controller('sltqueueInit', function ($scope, $mdDialog, $rootScope) {

    $scope.countTo = 234;
    $scope.countFrom = 0;

    $scope.countToqueue = 89;
    $scope.countFromqueue = 0;
    $scope.options = {
        chart: {
            type: 'pieChart',
            height: 450,
            donut: true,
            x: function (d) {
                return d.key;
            },
            y: function (d) {
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
                startAngle: function (d) {
                    return d.startAngle / 2 - Math.PI / 2
                },
                endAngle: function (d) {
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
routerApp.controller('sltqueuedetailsInit', function ($scope, $mdDialog, $rootScope) {
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
            x: function (d) {
                return d[0];
            },
            y: function (d) {
                return d[1] / 100;
            },
            average: function (d) {
                return d.mean / 100;
            },

            color: d3.scale.category10().range(),
            transitionDuration: 300,
            useInteractiveGuideline: true,
            clipVoronoi: false,

            xAxis: {
                axisLabel: 'X Axis',
                tickFormat: function (d) {
                    return d3.time.format('%m/%d/%y')(new Date(d))
                },
                showMaxMin: false,
                staggerLabels: false
            },

            yAxis: {
                axisLabel: 'Y Axis',
                tickFormat: function (d) {
                    return d3.format('')(d);
                },
                axisLabelDistance: 20
            }
        }
    };

    $scope.data = [{
            key: "Sinhala",
            values: [
                [1083297600000, -2.974623048543],
                [1085976000000, -1.7740300785979],
                [1088568000000, 4.4681318138177],
                [1091246400000, 7.0242541001353],
                [1093924800000, 7.5709603667586],
                [1096516800000, 20.612245065736],
                [1099195200000, 21.698065237316],
                [1101790800000, 40.501189458018],
                [1104469200000, 50.464679413194],
                [1107147600000, 48.917421973355],
                [1109566800000, 63.750936549160],
                [1112245200000, 59.072499126460],
                [1114833600000, 43.373158880492],
                [1117512000000, 54.490918947556],
                [1120104000000, 56.661178852079],
                [1122782400000, 73.450103545496],
                [1125460800000, 71.714526354907],
                [1128052800000, 85.221664349607],
                [1130734800000, 77.769261392481],
                [1133326800000, 95.966528716500],
                [1136005200000, 107.59132116397],
                [1138683600000, 127.25740096723],
                [1141102800000, 122.13917498830],
                [1143781200000, 126.53657279774],
                [1146369600000, 132.39300992970],
                [1149048000000, 120.11238242904],
                [1151640000000, 118.41408917750],
                [1154318400000, 107.92918924621],
                [1156996800000, 110.28057249569],
                [1159588800000, 117.20485334692],
                [1162270800000, 141.33556756948],
                [1164862800000, 159.59452727893],
                [1167541200000, 167.09801853304],
                [1170219600000, 185.46849659215],
                [1172638800000, 184.82474099990],
                [1175313600000, 195.63155213887],
                [1177905600000, 207.40597044171],
                [1180584000000, 230.55966698196],
                [1183176000000, 239.55649035292],
                [1185854400000, 241.35915085208],
                [1188532800000, 239.89428956243],
                [1191124800000, 260.47781917715],
                [1193803200000, 276.39457482225],
                [1196398800000, 258.66530682672],
                [1199077200000, 250.98846121893],
                [1201755600000, 226.89902618127],
                [1204261200000, 227.29009273807],
                [1206936000000, 218.66476654350],
                [1209528000000, 232.46605902918],
                [1212206400000, 253.25667081117],
                [1214798400000, 235.82505363925],
                [1217476800000, 229.70112774254],
                [1220155200000, 225.18472705952],
                [1222747200000, 189.13661746552],
                [1225425600000, 149.46533007301],
                [1228021200000, 131.00340772114],
                [1230699600000, 135.18341728866],
                [1233378000000, 109.15296887173],
                [1235797200000, 84.614772549760],
                [1238472000000, 100.60810015326],
                [1241064000000, 141.50134895610],
                [1243742400000, 142.50405083675],
                [1246334400000, 139.81192372672],
                [1249012800000, 177.78205544583],
                [1251691200000, 194.73691933074],
                [1254283200000, 209.00838460225],
                [1256961600000, 198.19855877420],
                [1259557200000, 222.37102417812],
                [1262235600000, 234.24581081250],
                [1264914000000, 228.26087689346],
                [1267333200000, 248.81895126250],
                [1270008000000, 270.57301075186],
                [1272600000000, 292.64604322550],
                [1275278400000, 265.94088520518],
                [1277870400000, 237.82887467569],
                [1280548800000, 265.55973314204],
                [1283227200000, 248.30877330928],
                [1285819200000, 278.14870066912],
                [1288497600000, 292.69260960288],
                [1291093200000, 300.84263809599],
                [1293771600000, 326.17253914628],
                [1296450000000, 337.69335966505],
                [1298869200000, 339.73260965121],
                [1301544000000, 346.87865120765],
                [1304136000000, 347.92991526628],
                [1306814400000, 342.04627502669],
                [1309406400000, 333.45386231233],
                [1312084800000, 323.15034181243],
                [1314763200000, 295.66126882331],
                [1317355200000, 251.48014579253],
                [1320033600000, 295.15424257905],
                [1322629200000, 294.54766764397],
                [1325307600000, 295.72906119051],
                [1327986000000, 325.73351347613],
                [1330491600000, 340.16106061186],
                [1333166400000, 345.15514071490],
                [1335758400000, 337.10259395679],
                [1338436800000, 318.68216333837],
                [1341028800000, 317.03683945246],
                [1343707200000, 318.53549659997],
                [1346385600000, 332.85381464104],
                [1348977600000, 337.36534373477],
                [1351656000000, 350.27872156161],
                [1354251600000, 349.45128876100]
            ],
            mean: 250
        }, {
            key: "English",
            values: [
                [1083297600000, -0.77078283705125],
                [1085976000000, -1.8356366650335],
                [1088568000000, -5.3121322073127],
                [1091246400000, -4.9320975829662],
                [1093924800000, -3.9835408823225],
                [1096516800000, -6.8694685316805],
                [1099195200000, -8.4854877428545],
                [1101790800000, -15.933627197384],
                [1104469200000, -15.920980069544],
                [1107147600000, -12.478685045651],
                [1109566800000, -17.297761889305],
                [1112245200000, -15.247129891020],
                [1114833600000, -11.336459046839],
                [1117512000000, -13.298990907415],
                [1120104000000, -16.360027000056],
                [1122782400000, -18.527929522030],
                [1125460800000, -22.176516738685],
                [1128052800000, -23.309665368330],
                [1130734800000, -21.629973409748],
                [1133326800000, -24.186429093486],
                [1136005200000, -29.116707312531],
                [1138683600000, -37.188037874864],
                [1141102800000, -34.689264821198],
                [1143781200000, -39.505932105359],
                [1146369600000, -45.339572492759],
                [1149048000000, -43.849353192764],
                [1151640000000, -45.418353922571],
                [1154318400000, -44.579281059919],
                [1156996800000, -44.027098363370],
                [1159588800000, -41.261306759439],
                [1162270800000, -47.446018534027],
                [1164862800000, -53.413782948909],
                [1167541200000, -50.700723647419],
                [1170219600000, -56.374090913296],
                [1172638800000, -61.754245220322],
                [1175313600000, -66.246241587629],
                [1177905600000, -75.351650899999],
                [1180584000000, -81.699058262032],
                [1183176000000, -82.487023368081],
                [1185854400000, -86.230055113277],
                [1188532800000, -84.746914818507],
                [1191124800000, -100.77134971977],
                [1193803200000, -109.95435565947],
                [1196398800000, -99.605672965057],
                [1199077200000, -99.607249394382],
                [1201755600000, -94.874614950188],
                [1204261200000, -105.35899063105],
                [1206936000000, -106.01931193802],
                [1209528000000, -110.28883571771],
                [1212206400000, -119.60256203030],
                [1214798400000, -115.62201315802],
                [1217476800000, -106.63824185202],
                [1220155200000, -99.848746318951],
                [1222747200000, -85.631219602987],
                [1225425600000, -63.547909262067],
                [1228021200000, -59.753275364457],
                [1230699600000, -63.874977883542],
                [1233378000000, -56.865697387488],
                [1235797200000, -54.285579501988],
                [1238472000000, -56.474659581885],
                [1241064000000, -63.847137745644],
                [1243742400000, -68.754247867325],
                [1246334400000, -69.474257009155],
                [1249012800000, -75.084828197067],
                [1251691200000, -77.101028237237],
                [1254283200000, -80.454866854387],
                [1256961600000, -78.984349952220],
                [1259557200000, -83.041230807854],
                [1262235600000, -84.529748348935],
                [1264914000000, -83.837470195508],
                [1267333200000, -87.174487671969],
                [1270008000000, -90.342293007487],
                [1272600000000, -93.550928464991],
                [1275278400000, -85.833102140765],
                [1277870400000, -79.326501831592],
                [1280548800000, -87.986196903537],
                [1283227200000, -85.397862121771],
                [1285819200000, -94.738167050020],
                [1288497600000, -98.661952897151],
                [1291093200000, -99.609665952708],
                [1293771600000, -103.57099836183],
                [1296450000000, -104.04353411322],
                [1298869200000, -108.21382792587],
                [1301544000000, -108.74006900920],
                [1304136000000, -112.07766650960],
                [1306814400000, -109.63328199118],
                [1309406400000, -106.53578966772],
                [1312084800000, -103.16480871469],
                [1314763200000, -95.945078001828],
                [1317355200000, -81.226687340874],
                [1320033600000, -90.782206596168],
                [1322629200000, -89.484445370113],
                [1325307600000, -88.514723135326],
                [1327986000000, -93.381292724320],
                [1330491600000, -97.529705609172],
                [1333166400000, -99.520481439189],
                [1335758400000, -99.430184898669],
                [1338436800000, -93.349934521973],
                [1341028800000, -95.858475286491],
                [1343707200000, -95.522755836605],
                [1346385600000, -98.503848862036],
                [1348977600000, -101.49415251896],
                [1351656000000, -101.50099325672],
                [1354251600000, -99.487094927489]
            ],
            mean: -60
        },


        {
            key: "Tamil",
            mean: 125,
            values: [
                [1083297600000, -3.7454058855943],
                [1085976000000, -3.6096667436314],
                [1088568000000, -0.8440003934950],
                [1091246400000, 2.0921565171691],
                [1093924800000, 3.5874194844361],
                [1096516800000, 13.742776534056],
                [1099195200000, 13.212577494462],
                [1101790800000, 24.567562260634],
                [1104469200000, 34.543699343650],
                [1107147600000, 36.438736927704],
                [1109566800000, 46.453174659855],
                [1112245200000, 43.825369235440],
                [1114833600000, 32.036699833653],
                [1117512000000, 41.191928040141],
                [1120104000000, 40.301151852023],
                [1122782400000, 54.922174023466],
                [1125460800000, 49.538009616222],
                [1128052800000, 61.911998981277],
                [1130734800000, 56.139287982733],
                [1133326800000, 71.780099623014],
                [1136005200000, 78.474613851439],
                [1138683600000, 90.069363092366],
                [1141102800000, 87.449910167102],
                [1143781200000, 87.030640692381],
                [1146369600000, 87.053437436941],
                [1149048000000, 76.263029236276],
                [1151640000000, 72.995735254929],
                [1154318400000, 63.349908186291],
                [1156996800000, 66.253474132320],
                [1159588800000, 75.943546587481],
                [1162270800000, 93.889549035453],
                [1164862800000, 106.18074433002],
                [1167541200000, 116.39729488562],
                [1170219600000, 129.09440567885],
                [1172638800000, 123.07049577958],
                [1175313600000, 129.38531055124],
                [1177905600000, 132.05431954171],
                [1180584000000, 148.86060871993],
                [1183176000000, 157.06946698484],
                [1185854400000, 155.12909573880],
                [1188532800000, 155.14737474392],
                [1191124800000, 159.70646945738],
                [1193803200000, 166.44021916278],
                [1196398800000, 159.05963386166],
                [1199077200000, 151.38121182455],
                [1201755600000, 132.02441123108],
                [1204261200000, 121.93110210702],
                [1206936000000, 112.64545460548],
                [1209528000000, 122.17722331147],
                [1212206400000, 133.65410878087],
                [1214798400000, 120.20304048123],
                [1217476800000, 123.06288589052],
                [1220155200000, 125.33598074057],
                [1222747200000, 103.50539786253],
                [1225425600000, 85.917420810943],
                [1228021200000, 71.250132356683],
                [1230699600000, 71.308439405118],
                [1233378000000, 52.287271484242],
                [1235797200000, 30.329193047772],
                [1238472000000, 44.133440571375],
                [1241064000000, 77.654211210456],
                [1243742400000, 73.749802969425],
                [1246334400000, 70.337666717565],
                [1249012800000, 102.69722724876],
                [1251691200000, 117.63589109350],
                [1254283200000, 128.55351774786],
                [1256961600000, 119.21420882198],
                [1259557200000, 139.32979337027],
                [1262235600000, 149.71606246357],
                [1264914000000, 144.42340669795],
                [1267333200000, 161.64446359053],
                [1270008000000, 180.23071774437],
                [1272600000000, 199.09511476051],
                [1275278400000, 180.10778306442],
                [1277870400000, 158.50237284410],
                [1280548800000, 177.57353623850],
                [1283227200000, 162.91091118751],
                [1285819200000, 183.41053361910],
                [1288497600000, 194.03065670573],
                [1291093200000, 201.23297214328],
                [1293771600000, 222.60154078445],
                [1296450000000, 233.35556801977],
                [1298869200000, 231.22452435045],
                [1301544000000, 237.84432503045],
                [1304136000000, 235.55799131184],
                [1306814400000, 232.11873570751],
                [1309406400000, 226.62381538123],
                [1312084800000, 219.34811113539],
                [1314763200000, 198.69242285581],
                [1317355200000, 168.90235629066],
                [1320033600000, 202.64725756733],
                [1322629200000, 203.05389378105],
                [1325307600000, 204.85986680865],
                [1327986000000, 229.77085616585],
                [1330491600000, 239.65202435959],
                [1333166400000, 242.33012622734],
                [1335758400000, 234.11773262149],
                [1338436800000, 221.47846307887],
                [1341028800000, 216.98308827912],
                [1343707200000, 218.37781386755],
                [1346385600000, 229.39368622736],
                [1348977600000, 230.54656412916],
                [1351656000000, 243.06087025523],
                [1354251600000, 244.24733578385]
            ]
        }
    ];


});
routerApp.controller('sltagentInit', function ($scope, $mdDialog, $rootScope) {

    $scope.countTo = 134;
    $scope.countFrom = 0;


    $scope.options = {
        chart: {
            type: 'pieChart',
            height: 500,
            x: function (d) {
                return d.key;
            },
            y: function (d) {
                return d.y;
            },
            pie: {
                margin: {
                    top: -450,
                    right: 0,
                    bottom: 5,
                    left: 50
                }
            },
            showLabels: true,
            transitionDuration: 500,
            labelThreshold: 0.01,
            legend: {
                margin: {
                    top: 150,
                    right: 0,
                    bottom: 5,
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

routerApp.directive('formSectionTitle', function () {
    return {
        restrict: 'E',
        template: "<div id='newdiv' layout='row' style='width: 255px; margin-top:8px; margin-left:8px;' flex layout-sm='row'><div flex='25'>	<img src={{catogeryLetter}} style='margin-top:22px;border-radius:20px'/>	</div> <div flex style='margin-top:27px;'>	<label style='font-weight:700'>{{title}} {{catogeryLetter}}</label> </div></div>",
        scope: {
            title: '@',
            catogeryLetter: '='
        },
        link: function (scope, element) {

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

function googleMapsInit(widId, $scope, $http, $rootScope, $mdDialog) {

    $scope.finish = function () {
        $mdDialog.hide();

    };

    $scope.cancel = function () {
        $mdDialog.hide();
    };

}

function hnbInit($scope, $http, $mdDialog, widId, $rootScope) {


    $scope.finish = function () {

        $mdDialog.hide();

    };

    $scope.cancel = function () {
        $mdDialog.hide();
    };



}

function clockInit($scope, $http, $mdDialog, widId, $rootScope) {


    $scope.finish = function () {

        $mdDialog.hide();

    };

    $scope.cancel = function () {
        $mdDialog.hide();
    };



}
