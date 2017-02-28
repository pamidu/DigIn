DiginApp.controller('dashboardCtrl',['$scope', '$rootScope','$mdDialog', '$window', '$mdMedia', '$stateParams', 'layoutManager', 'DiginServices' ,'$diginengine', 'colorManager','$timeout', function ($scope, $rootScope,$mdDialog, $window, $mdMedia,$stateParams,layoutManager, DiginServices, $diginengine,colorManager,$timeout) {

	/* reinforceTheme method is called twise because initially the theme needs to be applied to .footerTabContainer and later after the UI is initialized it needs to be 
	 called again to apply the theme to hover colors of the widget controlls (buttons)*/
	colorManager.reinforceTheme();
	$timeout(function() {
		colorManager.reinforceTheme();
	},100)
	
	// dashboardId is retrived from the stateParams
	$scope.dashboardId = $stateParams.id;
	if(Object.keys($rootScope.currentDashboard).length === 0 && $scope.dashboardId)
	{
		DiginServices.getComponent($scope.dashboardId).then(function(data) {
			//There is a samll problem that this runs twice, console.log to check
			$rootScope.selectedPageIndex = 0;
			$rootScope.currentDashboard = angular.copy(data);
			$rootScope.selectedDashboard = angular.copy(data);
			$timeout(function() {
				colorManager.reinforceTheme();
			},100)
		});
	}

    $scope.$parent.currentView = $rootScope.currentDashboard.compName;
	
	//configuring gridster
	$scope.gridsterOpts = {
		
		columns: 24, // number of columns in the grid
		pushing: true, // whether to push other items out of the way
		floating: true, // whether to automatically float items up so they stack
		swapping: false, // whether or not to have items switch places instead of push down if they are the same size
		width: 'auto', // width of the grid. "auto" will expand the grid to its parent container
		colWidth: 'auto', // width of grid columns. "auto" will divide the width of the grid evenly among the columns
		rowHeight: '/4', // height of grid rows. 'match' will make it the same as the column width, a numeric value will be interpreted as pixels, '/2' is half the column width, '*5' is five times the column width, etc.
		isMobile: false, // toggle mobile view
		margins: [5, 5], // margins in between grid items
		outerMargin: true,
		draggable: {
			handle: '.widget-header', // make the widget dragable only with the widget toolbar (not with the body)
			drag: function(event, $element, widget) {
				$scope.$parent.changed = true; // Keep track if the Dashboard is changed without saving
			}, // optional callback fired when item is moved,
		}, 
		resizable: {
			enabled: true,
			handles: ['n', 'e', 's', 'w', 'se', 'sw', 'ne', 'nw'],
			  resize: function(event,$element,widget){
				  $scope.$parent.changed = true; // Keep track if the Dashboard is changed without saving
				if(widget.widgetName == "Map"){
					$rootScope.mapheight = $element.clientHeight - 50;
					$rootScope.mapWidth = $element.clientWidth ;

				}
			}
        },
		mobileBreakPoint: 600, // width threshold to toggle mobile mode
		mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
		minColumns: 1, // minimum amount of columns the grid can scale down to
		minRows: 1, // minimum amount of rows to show if the grid is empty
		maxRows: 100, // maximum amount of rows in the grid
		defaultSizeX: 7, // default width of an item in columns
		defaultSizeY: 23, // default height of an item in rows
		minSizeX: 6, // minimum column width of an item
		maxSizeX: null, // maximum column width of an item
		minSizeY: 5, // minumum row height of an item
		maxSizeY: null, // maximum row height of an item
		saveGridItemCalculatedHeightInMobile: false, // grid item height in mobile display. true- to use the calculated height by sizeY given

	};
	
	/*
	$scope.gridsterOpts = {
		pushing: true,
		floating: true,
		margins: [5, 5], // margins in between grid items
		width: 'auto'

	};*/
	
	//only for testing purpose
	$scope.standardItems = [
	  { sizeX: 2, sizeY: 1},
	  { sizeX: 2, sizeY: 2},
	  { sizeX: 1, sizeY: 1},
	  { sizeX: 1, sizeY: 1},
	  { sizeX: 2, sizeY: 1},
	  { sizeX: 1, sizeY: 1},
	  { sizeX: 1, sizeY: 2},
	  { sizeX: 1, sizeY: 1},
	  { sizeX: 2, sizeY: 1},
	  { sizeX: 1, sizeY: 1},
	  { sizeX: 1, sizeY: 1}
	];
	
	$scope.removePage = function(ev, page)
	{
		var confirm = $mdDialog.confirm()
			  .title('Remove Page')
			  .textContent('Are you sure you want to remove this page?')
			  .ariaLabel('Remove Page')
			  .targetEvent(ev)
			  .ok('Please do it!')
			  .cancel('Cancel');
			$mdDialog.show(confirm).then(function() {
				for (i = 0, len = $rootScope.currentDashboard.pages.length; i<len; ++i){
					if($rootScope.currentDashboard.pages[i].pageName == page.pageName)
					{
						console.log(page);
						$rootScope.currentDashboard.pages.splice(i, 1);
					}
				}
			})
	}
	
	//This method is there to keep track of the current page number the user is in within the dashboard so he/she can add new widgets into that particular page
	$scope.selectPage = function(index) {
		$rootScope.selectedPageIndex = index;
    }
	
	$scope.editPageName = function(ev, page)
	{
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			
		 $mdDialog.show({
		  controller: 'renamePageCtrl',
		  templateUrl: 'views/dashboard/renamePage/renamePage.html',
		  parent: angular.element(document.body),
		  clickOutsideToClose:true,
		  targetEvent: ev,
		  fullscreen: useFullScreen
		}).then(function(answer) {
			
		});
		
		 $scope.$watch(function() {
		  return $mdMedia('xs') || $mdMedia('sm');
			}, function(wantsFullScreen) {
			  $scope.customFullscreen = (wantsFullScreen === true);
		});
	}
	
	$scope.addPage = function()
	{
		$rootScope.selectedPageIndex = $rootScope.currentDashboard.pages.length;
		
		$rootScope.currentDashboard.pages.push({				
				pageID: "temp" + createuuid(),
				pageName: $scope.fileName,
				widgets: [],
				pageData: null
		})
		
		console.log($rootScope.currentDashboard);
		$scope.addPageFrom.$setUntouched();
		$scope.addPageFrom.$setPristine();
		
		$scope.fileName = "";
	}
	
	$scope.$on("$destroy", function(){
		$scope.$parent.changed = false; // If the user leave the 'dashboard' state
	})
	
	//Widget toolbar controls
	$scope.widgetControls = (function () {
		return {
			showData: function (ev, widget) {
				
			},
			commentary: function (ev, widget){
				console.log("commentary");
			},
			widgetSettings: function (ev, widget){
				console.log(widget.widgetData.initCtrl);
				if (typeof widget.widgetData.commonSrc == "undefined") {//new widget
					$mdDialog.show({
							controller: widget.widgetData.initCtrl,
							templateUrl: widget.widgetData.initTemplate,
							parent: angular.element(document.body),
							targetEvent: ev,
							locals: {
								widgetID: widget.widgetID
							}
						})
						.then(function (answer) {
							console.log(answer);							
						});
				} else {//user is updating widget, open query builder
					$csContainer.fillCSContainer(widget.widgetData.commonSrc.src);
					$state.go("home.QueryBuilder", {widObj: widget});
				}
			},
			syncWidget: function (widget) {
				console.log("syncWidget");
			},
			removeWidget: function(ev, widget)
			{
				console.log("removeWidget");
				//$('md-tabs-wrapper').css('background-color',"black", 'important');
			},
			closeSetting: function () {
				console.log("closeSetting");
			}
		};
    })();
	
	$scope.showDataViewBtn = function(widget) {
		var showDataViewBtn = true;
		//if not dynamic visuals
		/*if (widget.widgetData.selectedChart == undefined) {
			showDataViewBtn = false; //do not show data view option
		} else { //if dynamic visuals

			switch (widget.widgetData.selectedChart.chartType) {
				case 'metric': // if type metric do not show data view option
					showDataViewBtn = false;
					break;
				default: // for other dynamic visuals show data view option
					if (widget.widgetData.dataCtrl != undefined) {
						showDataViewBtn = true;
					} else {
						showDataViewBtn = false;
					}
					break;
			}
		}*/

		return showDataViewBtn;
	}
	
	$scope.widInit = function(widget) {
		widget.isD3chart = false;
            widget.d3chartBtn = false;
            switch (widget.widgetName) {

                case 'sunburst':
                    widget.isD3chart = true;
                    break;

                case 'hierarchy':
                    widget.isD3chart = true;
                    break;

            }

            if (typeof widget.widgetData.widData.drillConf != "undefined" && widget.widgetData.widData.drilled) {
                var drillConf = widget.widgetData.widData.drillConf;
                var client = $diginengine.getClient(drillConf.dataSrc);
                widget.widgetData.highchartsNG.options['customVar'] = drillConf.highestLvl;
                widget.widgetData.highchartsNG.options.chart['events'] = {
                    drilldown: function(e) {

                        if (!e.seriesOptions) {
                            var srcTbl = drillConf.srcTbl,
                                fields = drillConf.fields,
                                drillOrdArr = drillConf.drillOrdArr,
                                chart = this,
                                clientObj = client,
                                clickedPoint = e.point.name,
                                nextLevel = "",
                                highestLvl = this.options.customVar,
                                drillObj = {},
                                isLastLevel = false,
                                selectedSeries = e.point.series.name,
                                filterStr = "",
                                origName = "",
                                serName = "",
                                tempArrStr = "",
                                conStr = "";
                                var limit;
                                var level;
                                var tempArray = [];
                                var isDate;
                            // var cat = [];
                            for (i = 0; i < drillOrdArr.length; i++) {
                                if (drillOrdArr[i].name == highestLvl) {
                                    nextLevel = drillOrdArr[i].nextLevel;
                                    drillOrdArr[i].clickedPoint = clickedPoint;
                                    level = drillOrdArr[i].level;
                                    if (!drillOrdArr[i + 1].nextLevel) isLastLevel = true;
                                }
                            }
                            chart.options.lang.drillUpText = " Back to " + highestLvl;
                            // Show the loading label
                            chart.showLoading("Retrieving data for '" + clickedPoint.toString().toLowerCase() + "' grouped by '" + nextLevel + "'");

                            //aggregate method
                            clientObj.getAggData(srcTbl, fields, limit, widget.widgetData.commonSrc.src.id, function(res, status, query) {
                                angular.forEach( widget.widgetData.highchartsNG.series, function(series) {
                                    if ( series.name == selectedSeries ) {
                                        origName = series.origName;
                                        serName = series.name;
                                    }
                                });
                                drillConf["level"+(level+1)+"Query"] = query;
                                widget.widgetData.widData.drillConf.currentQuery = query;
                                if (status) {
                                    for (var key in res[0]) {
                                        if (Object.prototype.hasOwnProperty.call(res[0], key)) {
                                            if (key != nextLevel && key == origName) {
                                                drillObj = {
                                                    name: serName,
                                                    data: [],
                                                    origName: key,
                                                    turboThreshold: 0
                                                };
                                            }
                                        }
                                    }
                                    if (res.length > 0 ) {
                                        res.forEach(function(key) {
                                            if (!isLastLevel) {
                                                drillObj.data.push({
                                                    name: key[nextLevel],
                                                    y: parseFloat(key[drillObj.origName]),
                                                    drilldown: true
                                                });
                                            } else {
                                                drillObj.data.push({
                                                    name: key[nextLevel],
                                                    y: parseFloat(key[drillObj.origName])
                                                });
                                            }
                                        });
                                        drillObj['cropThreshold'] = drillObj.data.length;
                                    }
                                    chart.addSeriesAsDrilldown(e.point, drillObj);

                                } else {
                                    notifications.toast('0','request failed due to :' + JSON.stringify(res));
                                    e.preventDefault();
                                }
                                widget.widgetData.highchartsNG.xAxis["title"] = {
                                    text: nextLevel
                                };
                                widget.widgetData.highchartsNG.yAxis["title"] = {
                                    text: selectedSeries
                                };                                
                                chart.options.customVar = nextLevel;
                                chart.hideLoading();
                            }, nextLevel);
                        }
                    },
                    drillup: function(e) {
                        var chart = this;
                        console.log(chart);
                        console.log(chart.options.customVar);
                        drillConf.drillOrdArr.forEach(function(key) {
                        if (key.nextLevel && key.nextLevel == chart.options.customVar) {
                            chart.options.customVar = key.name;
                            widget.widgetData.highchartsNG.xAxis["title"] = {
                                text: chart.options.customVar
                            };                                                                        
                            }
                        });
                        // set x and y axis titles (DUODIGIN-914)
                        var flag = false;
                        drillConf.drillOrdArr.forEach(function(key) {
                            if (key.name == chart.options.customVar) {
                                drillConf.currentQuery = drillConf["level" + key.level + "Query"];
                            }
                            if (chart.options.customVar == key.nextLevel) {
                                chart.options.lang.drillUpText = " Back to " + key.name;
                                flag = true;
                            }
                        });
                        if (!flag) {
                            widget.widgetData.highchartsNG.yAxis["title"] = {
                                text: 'values'
                            };
                        }
                    },
                    beforePrint: function() {
                        this.setTitle({
                            text: this.options.exporting.chartOptions.title.text
                        })
                        this.heightPrev = this.chartHeight;
                        this.widthPrev = this.chartWidth;
                        if (this.drillUpButton !== undefined) this.drillUpButton = this.drillUpButton.destroy();
                        this.setSize(800,600, false);
                    },
                    afterPrint: function() {
                        this.setTitle({
                            text: null
                        })
                        this.setSize(this.widthPrev,this.heightPrev, true);
                        if (this.drilldownLevels.length != 0) this.showDrillUpButton();
                    }                      
                }
            }
		
	}
	
	$scope.startWidget = function(widget)
	{
		console.log(widget);
	}
	
}])//END OF AddCtrl