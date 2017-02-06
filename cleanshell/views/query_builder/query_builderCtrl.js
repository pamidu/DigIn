DiginApp.controller('query_builderCtrl',[ '$scope','$rootScope','$mdDialog', '$stateParams','$diginengine','dbType', function ($scope,$rootScope,$mdDialog, $stateParams, $diginengine, dbType){
		$scope.$parent.currentView = "Query Builder";
		var chartBackgroundColor = "";
		var chartFontColor = "";
		
		$scope.viewPortHeight = "calc(100vh - 92px)";
		$scope.$parent.topMenuToggle2 = function()
		{
			if($rootScope.showHeader == true)
			{
				$scope.viewPortHeight = "calc(100vh - 92px)";
			}else{
				$scope.viewPortHeight = "calc(100vh - 46px)";
			}
		}
		
		if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
		{
			chartBackgroundColor = "rgb(48,48,48)";
			chartFontColor = '#fff';
		}else{
			chartBackgroundColor = "white";
		}
		
		$scope.selectedAttributes = $stateParams.selectedAttributes;
		$scope.selectedMeasures = $stateParams.selectedMeasures;
		$scope.selectedFile = $stateParams.selectedFile;
		$scope.selectedDB = $stateParams.selectedDB;
		
		$scope.client = $diginengine.getClient($scope.selectedDB);
		
		$scope.aggregations = ["AVG","SUM","COUNT","MIN","MAX"];
		$scope.limit = 100;
		$scope.requestLimits = [100, 1000, 2000, 3000, 4000, 5000];
		$scope.chartType = 'bar';
		
		$scope.selectedSeries = [];
		$scope.selectedCategory = [];
		
		$scope.pushSeries = function(item, aggregation)
		{
			var pushObj = angular.copy(item);
			pushObj.aggType = aggregation;
			
			$scope.selectedSeries.push(pushObj);
			if($scope.selectedCategory.length > 0)
			{
				getSeriesAndCategories()
			}
		}
		
		$scope.pushCateory = function(index, item)
		{
			$scope.selectedCategory.push(item);
			if($scope.selectedSeries.length > 0)
			{
				getSeriesAndCategories()
			}
		}
		
		$scope.removeFromSeries = function(index)
		{
			$scope.selectedSeries.splice(index, 1);
		}
		
		$scope.removeFromCategory = function(index)
		{
			$scope.selectedCategory.splice(index, 1);
		}
		
		
	$scope.commonData = {
        measures: [
            //                {id: 'm01', filedName: 'Unit price', click: false},
            //                {id: 'm02', filedName: 'Price', click: false}
        ],
        columns: [
            //                {id: 'a01', filedName: 'name', click: false},
            //                {id: 'a02', filedName: 'location', click: false}
        ],
        measureCondition: [{
            id: 'c01',
            name: 'AVG',
            click: false,
            dragging: false,
            proBy: 'mc0'
        }, {
            id: 'c02',
            name: 'SUM',
            click: false,
            dragging: false,
            proBy: 'mc0'
        }, {
            id: 'c03',
            name: 'COUNT',
            click: false,
            dragging: false,
            proBy: 'mc0'
        }, {
            id: 'c04',
            name: 'MIN',
            click: false,
            dragging: false,
            proBy: 'mc0'
        }, {
            id: 'c05',
            name: 'MAX',
            click: false,
            dragging: false,
            proBy: 'mc0'
        }],
        chartTypes: [{
                id: 'ct01',
                icon: 'ti-pie-chart',
                name: 'pie chart',
                chart: 'pie',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "A pie chart is a circular chart divided into <br> sectors which is proportional to the quantity it represents"
            }, {
                id: 'ct02',
                icon: 'ti-bar-chart-alt',
                name: 'bar',
                chart: 'bar',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "A bar chart is exactly the same as a column chart only the x-axis and y-axis are switched"
            }, {
                id: 'ct03',
                icon: 'fa fa-line-chart',
                icon: 'ti-bar-chart',
                name: 'column',
                chart: 'column',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "A column chart displays data as vertical bars"
            }, {
                id: 'ct03',
                icon: 'ti-gallery',
                name: 'line ',
                chart: 'line',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "A line chart is represented by a series of datapoints connected with a straight line. Line charts are most often used to visualize data that changes over time"
            }, {
                id: 'ct05',
                icon: 'smoothline',
                name: 'Smooth line ',
                chart: 'spline',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: ""
            }, {
                id: 'ct06',
                icon: 'area',
                name: 'area ',
                chart: 'area',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "The area chart functions the same way as a line chart only it fills the area between the line and the threshold, which is 0 by default"
            }, {
                id: 'ct07',
                icon: 'smootharea',
                name: 'Smooth area ',
                chart: 'areaspline',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "The areaspline chart is the same as area, only the line is a spline instead of straight lines"
            }, {
                id: 'ct08',
                icon: 'scatter',
                name: 'scatter ',
                chart: 'scatter',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "A scatter chart draw a single point for each point of data in a series without connecting them"
            }, {
                id: 'ct9',
                icon: 'hierarchy',
                name: 'hierarchy',
                chart: 'hierarchy',
                selected: false,
                chartType: 'd3hierarchy',
                view: 'views/query/chart-views/hierarchySummary.html',
                initObj: {
                    dec : 0
                },
                settingsView: 'views/query/settings-views/hierarchySetings.html',
				tooltip: "A decomposition of a graph is a collection of edge-disjoint subgraphs of such that every edge of belongs to exactly one"
            }, {
                id: 'ct10',
                icon: 'ti-shine',
                name: 'sunburst',
                chart: 'sunburst',
                selected: false,
                chartType: 'd3sunburst',
                view: 'views/query/chart-views/sunburst.html',
                initObj: {
                    dec : 0
                },
                settingsView: 'views/query/settings-views/hierarchySetings.html',
				tooltip: "A sunburst is similar to the treemap, except it uses a radial layout. The root node of the tree is at the center, with leaves on the circumference"
            },
            // {
            //     id: 'ct12',
            //     icon: 'ti-layout-accordion-list',
            //     name: 'pivotsummary',
            //     chart: 'pivotsummary',
            //     selected: false,
            //     chartType: 'pivotSummary',
            //     view: 'views/query/chart-views/pivotSummary.html',
            //     initObj: $scope.initHighchartObj,
            //     settingsView: 'views/query/settings-views/highchartsSettings.html'
            // }, 
            {
                id: 'ct13',
                icon: 'metric',
                name: 'metric',
                chart: 'metric',
                selected: false,
                chartType: 'metric',
                view: 'views/query/chart-views/metric.html',
                initObj: {
                    value: 33852,
                    decValue: 33852,
                    scale: "",
                    dec: 2,
                    scalePosition: "back",
                    color: 'white',
                    targetRange: "",
                    targetValue: "",
                    targetQuery: "",
                    targetValueString: "",
                    targetField: "",
                    rangeSliderOptions: {
                        minValue: 0,
                        maxValue: 300,
                        options: {
                            floor: 0,
                            ceil: 300,
                            step: 1,
                            translate: function(value) {
                              return value + '%';
                            }
                        }
                    },
                    colorTheme: "",
                    lowerRange: 0,
                    higherRange: 33852,
                    trendChart: {
                        options: {
                            chart: {
                            backgroundColor: 'transparent'
                        },
                        //useHighStocks: true,
                        xAxis: {
                            showEmpty: false,
                            lineWidth: 1,
                            lineColor: 'black',
                            labels:{
                              enabled:false//default is true
                            },
                           minorGridLineWidth: 0,
                           minorTickLength: 0,
                           tickLength: 0
                        },
                        exporting: {
                                 enabled: false
                        },
                        yAxis: {
                            showEmpty: false,
                            lineWidth: 1,
                            lineColor: 'black',
                            min: 0,
                            gridLineWidth: 0,
                            title: {
                              text: ''
                            },
                            labels:{
                              enabled:false//default is true
                            }
                        },
                        credits: {
                          enabled: false
                        },
                        tooltip: {
                            enabled:false
                        },
                        plotOptions: {
                            series: {
                                enableMouseTracking: false
                            },
                            line: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        legend: {
                                    enabled: false
                        }
                        },
                        size: {
                            height: null,
                            width:null
                        },
                        series: [],
                        title: {
                            text: ''
                        }
                    }
                },
                groupByField: "",
                timeAttribute: "",
                trendQuery: "",
                notificationConstant: "",
                settingsView: 'views/query/settings-views/metricSettings.html',
                notificationValue: "",
				tooltip: ""
            }, {
                id: 'ct15',
                icon: 'ti-layout-slider-alt',
                name: 'boxplot',
                chart: 'boxplot',
                selected: false,
                chartType: 'boxplot',
                view: 'views/query/chart-views/BoxPlot.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "A box plot is a convenient way of depicting groups of data through their five-number summaries: the smallest observation (sample minimum), lower quartile (Q1), median (Q2), upper quartile (Q3), and largest observation (sample maximum)"
            }, {
                id: 'ct16',
                icon: 'histogram',
                name: 'histogram',
                chart: 'histogram',
                selected: false,
                chartType: 'histogram',
                view: 'views/query/chart-views/Histogram.html',
                initObj: {},
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: ""
            }, {
                id: 'ct17',
                icon: 'ti-flickr',
                name: 'bubble',
                chart: 'bubble',
                selected: false,
                chartType: 'bubble',
                view: 'views/query/chart-views/bubble.html',
                initObj: {},
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: ""
            }, {
                id: 'ct18',
                icon: 'ti-stats-up',
                name: 'forecast',
                chart: 'forecast',
                selected: false,
                chartType: 'forecast',
                view: 'views/query/chart-views/forecast.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/forecastSettings.html',
				tooltip: ""
            }, {
                id: 'ct19',
                icon: 'ti-filter',
                name: 'funnel',
                chart: 'funnel',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: "Funnel charts are a type of chart often used to visualize stages in a sales project, where the top are the initial stages with the most clients. The funnel narrows as more clients drop off"
            }, {
                id: 'ct20',
                icon: 'pyramid',
                name: 'pyramid',
                chart: 'pyramid',
                selected: false,
                chartType: 'highCharts',
                view: 'views/query/chart-views/highcharts.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/highchartsSettings.html',
				tooltip: ""
            }, {
                id: 'ct21',
                icon: 'ti-world',
                name: 'Geographical Map',
                chart: 'Geographical Map',
                selected: false,
                chartType: 'map',
                view: 'views/query/chart-views/GeoMap.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/mapsettings.html',
				tooltip: "A visualization to plot analyse the data on the gographical map"
            },{
                id: 'ct22',
                icon: 'ti-view-list-alt',
                name: 'Tabular Widget',
                chart: 'Tabular',
                chartType: 'Tabular',
                view: 'views/query/chart-views/Tabular.html',
                initObj: $scope.initHighchartObj,
                settingsView: 'views/query/settings-views/Tabularsettings.html',
                tooltip: "A visualization to plot analyse the data on the gographical map"
            }

        ]
    };
	
	$scope.changeTip = function(tip)
	{
		$scope.tooltip = tip;
	}
	$scope.settingsOpened = false;
	
	$scope.openSettings = function()
	{
		$scope.settingsOpened = !$scope.settingsOpened;
	}
	$scope.queryEditState = false;
	$scope.changeEditState = function() {
		$scope.queryEditState = !$scope.queryEditState;
	};
		
		
		
	function getSeriesAndCategories()
	{
		var fieldArr = [];
		for(var i = 0; i < $scope.selectedSeries.length; i++){
			fieldArr.push({
					field: $scope.selectedSeries[i].name,
					agg: $scope.selectedSeries[i].aggType
				});
	}

		$scope.showBarChartLoading = true;
		console.log($scope.selectedFile.datasource_name, fieldArr, 100, $scope.selectedFile.datasource_id);
		$scope.client.getAggData($scope.selectedFile.datasource_name, fieldArr, 100, $scope.selectedFile.datasource_id, function(res, status, query) {
				if (status) {
					console.log(res);
					var categories = [];
					var series = [];
					for(var i = 0; i < res.length; i++){
						categories.push(res[i][$scope.selectedCategory[0].name]);
						series.push(res[i][$scope.selectedSeries[0].aggType.toLowerCase()+"_"+$scope.selectedSeries[0].name]);
					}
					createChart(categories, series);
				}else{
					console.log(res);
				}
			},[$scope.selectedCategory[0].name]);
		}
		$scope.highcharts = "";
		function createChart(categories, series)
		{
			$scope.$apply(function() {
				$scope.showBarChartLoading = false;
				$scope.highcharts = {
					options: {
						  chart: {
								type: $scope.chartType,
								backgroundColor: chartBackgroundColor
							}
					},
						  xAxis: {
							categories: categories,
							lineColor: chartFontColor,
							tickColor: chartFontColor,
							labels: {
								 style: {
									color: chartFontColor
								 }
							}
						  },
					  series: [{
						data: series,
						style: {
							color: chartFontColor
						 },
						 labels: {
								 style: {
									color: chartFontColor
								 }
							}
					  }],
					title: {
						text: 'Sales',
						style: {
							color: chartFontColor
						}
					}
				};
			})
		};
		
		var widget = {};
		widget.widgetData = {};
		widget.widgetData.widData = {};
		$scope.createWidgetFinish = function()
		{
			//alert("create");
			$scope.saveWidget(widget);
		}
		
		$scope.saveWidget =  function(widget) {

            widget.widgetData.highchartsNG = $scope.highcharts;
            widget.widgetData.widData['drilled'] = false;
            widget.widgetData.widData['drillConf'] = undefined;
            widget.widgetName = "highcharts";
            widget.widgetData.widView = "views/common-data-src/res-views/SimpleHighChart.html";
            widget.widgetData.initCtrl = "elasticInit";
            $scope.saveChart(widget);
        }
		
		$scope.saveChart =  function(widget) {
			var widgets = $rootScope.dashboard.pages[$rootScope.selectedPage - 1].widgets;

			if (widget.widgetID == null) { // new widget, so a temp id is assigned
				widget.widgetID = "temp" + Math.floor(Math.random() * (100 - 10 + 1) + 10);
			}
			widget.widgetData.highchartsNG["size"] = {
				width: 313,
				height: 260
			};
			widget.widgetData.dataCtrl = "widgetSettingsDataCtrl";
			widget.widgetData.dataView = "views/ViewData.html";
			//widget.widgetData.widView = 'views/query/chart-views/highcharts.html'
			widget.widgetData["selectedChart"] = $scope.selectedChart;
			widget.sizeX = 6;
			widget.sizeY = 21;
			var objIndex = getRootObjectById(widget.widgetID, widgets);
			if (objIndex == null) { //new widget
				widgets.push(widget);
			}
			setTimeout(function() {
				$rootScope.selectedPageIndx = $rootScope.selectedPage - 1;
				$state.go('home.Dashboards');
			}, 1000);
		}
		

}])