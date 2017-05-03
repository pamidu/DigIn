DiginApp.controller('dashboardCtrl',['$scope', '$rootScope','$mdDialog', '$mdColors', '$window', '$mdMedia', '$stateParams', 'layoutManager',
	'notifications', 'DiginServices' ,'PouchServices','$diginengine', 'colorManager','$timeout','$state','dialogService', 'chartSyncServices', 
	'DiginDashboardSavingServices', 'filterServices', 'generateHighchart', 'chartUtilitiesFactory','generateTabular','Socialshare','widgetShareService',
	function ($scope, $rootScope,$mdDialog, $mdColors, $window, $mdMedia,$stateParams,layoutManager,notifications, 
		DiginServices, PouchServices, $diginengine,colorManager,$timeout,$state,dialogService,chartSyncServices,DiginDashboardSavingServices,
		filterServices,generateHighchart,chartUtilitiesFactory,generateTabular,Socialshare,widgetShareService) {
		
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
		PouchServices.getDashboard(null,$scope.dashboardId).then(function(data) {
			//There is a samll problem that this runs twice, console.log to check
			$rootScope.selectedPageIndex = 0;
			$rootScope.currentDashboard = angular.copy(data);
			$rootScope.selectedDashboard = angular.copy(data);
			$scope.$parent.currentView = $rootScope.currentDashboard.compName;
			$timeout(function() {
				colorManager.reinforceTheme();
			},100)
		});
	}

   $scope.$parent.currentView = $rootScope.currentDashboard.compName;
   
   $scope.lastPath = $scope.$parent.lastPath;
	
	//configuring gridster
	$scope.gridsterOpts = {
		
		columns: 12, // number of columns in the grid
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
				$rootScope.$broadcast('widget-resized', { element: $element, widget: widget });
			},
			stop: function(event,$element,widget){
		     $timeout(function(){ //wait 100 milliseconds until the dom element is added
		      $scope.$parent.changed = true; // Keep track if the Dashboard is changed without saving
		      $rootScope.$broadcast('widget-resized', { element: $element, widget: widget });
		     
		     }, 300);
		    }
        },
		mobileBreakPoint: 600, // width threshold to toggle mobile mode
		mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
		/*minColumns: 1, // minimum amount of columns the grid can scale down to
		minRows: 1, // minimum amount of rows to show if the grid is empty
		maxRows: 100, // maximum amount of rows in the grid*/
		defaultSizeX: 4, // default width of an item in columns
		defaultSizeY: 11, // default height of an item in rows
		minSizeX: 3, // minimum column width of an item
		minSizeY: 5, // minumum row height of an item
		/*maxSizeY: null, // maximum row height of an item*/
		saveGridItemCalculatedHeightInMobile: false, // grid item height in mobile display. true- to use the calculated height by sizeY given

	};
	
	$scope.removePage = function(ev, page)
	{
		dialogService.confirmDialog(ev,"Remove Page","Are you sure you want to remove this page?", "yes","no").then(function(answer) {
			if(answer == "yes")
			{
				for (i = 0, len = $rootScope.currentDashboard.pages.length; i<len; ++i){
					if($rootScope.currentDashboard.pages[i].pageName == page.pageName)
					{
						console.log(page);

						var pageID = $rootScope.currentDashboard.pages[i].pageID;
						if (pageID.toString().substr(0, 4) != "temp") {
	                            $rootScope.currentDashboard.deletions.pageIDs.push(pageID);
	                    }
						$rootScope.currentDashboard.pages.splice(i, 1);
					}
				}
			}
		});
	}
	
	//This method is there to keep track of the current page number the user is in within the dashboard so he/she can add new widgets into that particular page
	$scope.selectPage = function(index) {
		$rootScope.selectedPageIndex = index;
		filterServices.setFilterData($rootScope.currentDashboard,$rootScope.selectedPageIndex);
		// check if dashboard is filtered
		if ($rootScope.currentDashboard.isFiltered)
		{
			if (!$rootScope.currentDashboard.pages[index].isFiltered)
				// apply dashboard filters
				applyDashboardFilter($rootScope.currentDashboard,$rootScope.selectedPageIndex,$scope.dashboardFilterFields,false);
		}
		else 
		{
			// check if default filter has been applied
			// if yes, apply - call apply dashboard filter field
			// else normal sync
			// sync a page when it is open for the first time

			// check if default filter has been applied to the dashboard
			var defaultFilterArray = filterServices.groupDefaultFilters($rootScope.currentDashboard.filterDetails);
			if (defaultFilterArray.length > 0)
			{
				applyDashboardFilter($rootScope.currentDashboard,$rootScope.selectedPageIndex,defaultFilterArray,true);
			} else {
				// if no default filters have been applied
				DiginServices.syncPages($rootScope.currentDashboard,index,function(dashboard){
					// returns the synced page
					$scope.$apply(function() {
						$rootScope.currentDashboard = dashboard;
					})
				},'False');
			}
		}
    };
	
	$scope.editPageName = function(ev, page)
	{
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			
		 $mdDialog.show({
		  controller: 'renamePageCtrl',
		  templateUrl: 'views/dashboard/renamePage/renamePage.html',
		  parent: angular.element(document.body),
		  locals: {pageName: page.pageName},
		  clickOutsideToClose:true,
		  targetEvent: ev,
		  fullscreen: useFullScreen
		}).then(function(answer) {
			if (answer)
				page.pageName = answer;
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
				pageData: null,
				isSeen: true
		})
		
		console.log($rootScope.currentDashboard);
		$scope.addPageFrom.$setUntouched();
		$scope.addPageFrom.$setPristine();
		
		$scope.fileName = "";
	}
	
	$scope.$on("$destroy", function(){
		$scope.$parent.changed = false; // If the user leave the 'dashboard' state
	})

	 // use this variable to make the dialogs fullscreen in smaller screen sizes
	 var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;


	//Dashboard toolbar controls
	$scope.dashboardControls = (function (){
		return {
			visualizeData: function(ev){
				$scope.$parent.route('visualize_data');
			},
			addWiget: function(ev){
				$mdDialog.show({
				  controller: 'addWidgetDashboardCtrl',
				  templateUrl: 'views/dashboard/addWidget/addWidget.html',
				  parent: angular.element(document.body),
				  clickOutsideToClose:true,
				  targetEvent: ev,
				  locals: {lastPath: $scope.lastPath},
				  fullscreen: useFullScreen
				}).then(function(answer) {
					if(answer){
						console.log(answer);
						$scope.lastPath = answer;
					}
				}); 
				$scope.$watch(function() {
				  return $mdMedia('xs') || $mdMedia('sm');
					}, function(wantsFullScreen) {
					  $scope.customFullscreen = (wantsFullScreen === true);
				});
			},saveDashboard: function(ev){

				$mdDialog.show({
				  controller: 'saveDashboardCtrl',
				  templateUrl: 'dialogs/saveDashboard/saveDashboard.html',
				  parent: angular.element(document.body),
				  clickOutsideToClose:true,
				  targetEvent: ev,
				  fullscreen: useFullScreen
				}).then(function(answer) {
					console.log(answer);
					DiginDashboardSavingServices.saveDashboard(ev, answer).then(function(newDashboardDetails) {
						console.log(newDashboardDetails);
						$scope.$parent.changed = false; //change this to false again since the chages were saved
						$scope.$parent.currentView = newDashboardDetails.dashboardName;
						var isNewDashboard = true;
						
						angular.forEach($scope.dashboards, function(value, key) {
							if(value.compID == newDashboardDetails.compID)
							{
								value.compName = newDashboardDetails.dashboardName;
								isNewDashboard = false;
							}
						})
						
						if(isNewDashboard === true)
						{
							$scope.$parent.dashboards.push({compID: newDashboardDetails.compID, compType: "dashboard", compName: newDashboardDetails.dashboardName });
						}
						
					});
				}); 
				
				 $scope.$watch(function() {
				  return $mdMedia('xs') || $mdMedia('sm');
					}, function(wantsFullScreen) {
					  $scope.customFullscreen = (wantsFullScreen === true);
				});
			},makeDefault: function(ev)
			{
				$scope.$parent.diginComponents.setDefaultDashboard(ev, $rootScope.currentDashboard)
			},deleteDashboard: function(ev)
			{
				dialogService.confirmDialog(ev, "Delete Dashboard","Are you sure you want to delete '"+$rootScope.currentDashboard.compName+"' dashboard?","yes", "cancel").then(function(result) {
					if(result == 'yes')
					{
						console.log("delete dashboard");
						DiginServices.deleteComponent(ev, $rootScope.currentDashboard.compID, false).then(function(data) {
							if(data.Is_Success === true){
								
								// Delete from pouch
								
								// Delete from view
								angular.forEach($scope.$parent.dashboards, function(value, key) {
									if(value.compID == $rootScope.currentDashboard.compID)
									{
										$scope.dashboards.splice(key,1);
									}
								})
								$scope.$parent.route('home');
							}
						});
					}
				});
				
			},
			addDashboardFilter: function(ev)
			{
				$scope.$parent.route('dashboardFilterSettings');
			}

		}


	})();
	
	//Widget toolbar controls
	$scope.widgetControls = (function () {
		return {
			fullscreen: function (ev, widget) {
				
				var widgetCopy = angular.copy(widget); //get a copy of widget object to send to fullscreen view of widget
				widgetCopy.widgetData.widgetID = widgetCopy.widgetData.widgetID+"-fullscreen";

				$mdDialog.show({
				  controller: 'fullscreenCtrl',
				  templateUrl: 'views/dashboard/fullscreen.html',
				  parent: angular.element(document.body),
				  targetEvent: ev,
				  clickOutsideToClose:true,
				  locals: {event: ev, widget: widgetCopy},
				  fullscreen: true // Only for -xs, -sm breakpoints.
				})
				.then(function(answer) {
				 // $scope.status = 'You said the information was "' + answer + '".';
				}, function() {
				  //$scope.status = 'You cancelled the dialog.';
				});
			},
			share: function (ev, widget,provider) {
	            if(typeof $rootScope.currentDashboard.compName != "undefined"){
			        if (provider == "email") {
			            $mdDialog.show({
			                controller: 'shareEmailClients',
			                templateUrl: 'views/dashboard/widgetShare/shareEmailClients.html',
			                targetEvent: ev,
			                locals: {
			                    widget: widget,
			                    DashboardName: $rootScope.currentDashboard.compName
			                }
			            })
			        } else {
			            widgetShareService.getShareWidgetURL(widget, $scope.getreturnSocial, provider);
			        }
			
				    $scope.getreturnSocial = function(url, provider) {
				        //var url = 'http://prod.digin.io/digin//data/digin_user_data/1fe2dfa9c6c56c8492b9c78107eb5ae3/nordirisrhytacom.prod.digin.io/DPs/4.jpg';
				        if (provider == "pinterest") {
				            window.open('https://pinterest.com/pin/create/button/?url=' + url + '', '_blank');
				        } else if (provider == "tumblr") {
				            window.open('http://www.tumblr.com/share/link?url=' + url + '', '_blank');
				        } else {
				            Socialshare.share({
				                'provider': provider,
				                'attrs': {
				                    'socialshareUrl': url,
				                    'socialsharePopupHeight': '400',
				                    'socialsharePopupWidth': '400'
				                }
				            });
				        }
				    }
	            }else{
	                notifications.toast('0', 'Please save the dashboard before proceed');
	            }
			},
			showData: function (ev, widget) {
				var widgetCopy = angular.copy(widget); //get a copy of widget object to send to fullscreen view of widget
				//widgetCopy.widgetData.widgetID = widgetCopy.widgetData.widgetID+"-fullscreen";

				$mdDialog.show({
				  controller: 'dataViewCtrl',
				  templateUrl: 'views/dashboard/dataView/dataView.html',
				  parent: angular.element(document.body),
				  targetEvent: ev,
				  clickOutsideToClose:true,
				  locals: {event: ev, widget: widgetCopy},
				  fullscreen: true // Only for -xs, -sm breakpoints.
				})
				.then(function(answer) {
				 // $scope.status = 'You said the information was "' + answer + '".';
				}, function() {
				  //$scope.status = 'You cancelled the dialog.';
				});
			},
			widgetSettings: function (ev, widget){
				$state.go("query_builder",{
				  'allAttributes' : widget.widgetData.allXAxis,
				  'allMeasures' : widget.widgetData.allMeasures,
				  'DesignTimeFilter ': widget.widgetData.DesignTimeFilter,
				  'RuntimeFilter': widget.widgetData.RuntimeFilter,
				  'selectedAttributes': widget.widgetData.XAxis,
				  'selectedMeasures': widget.widgetData.Measures,
				  'selectedFile': widget.widgetData.selectedFile,
				  'selectedDB' : widget.widgetData.selectedDB,
				  'widget': widget,
				  'chartType':widget.widgetData.chartType
				 });
			},
			syncWidget: function (widget,is_sync) {
				notifications.log("Sync Widget",new Error());
				widget.widgetData.syncOn = true;
				// if widget is filtered, apply filters when sync
				if (widget.isWidgetFiltered)
				{
					$scope.applyFilters(widget);
				} else if ($rootScope.currentDashboard.isFiltered) { // if dashboard filter is applied
					applyDashboardFilter($rootScope.currentDashboard,$rootScope.selectedPageIndex,$scope.dashboardFilterFields,false);
				} else {
					// send is_sync parameter as true
					chartSyncServices.sync(widget.widgetData,function(widgetData){
						$scope.$apply(function(){
							widgetData.syncOn = false;
							widget.widgetData = widgetData;
						})
					}, is_sync);
				}
			},
			removeWidget: function(ev, widget)
			{
				dialogService.confirmDialog(ev,"Remove Widget","Are you sure you want to remove this widget?", "yes","no").then(function(answer) {
					if(answer == "yes")
					{
						var widgets = $rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets;
						for (var i = 0; i<widgets.length; i++){
							if(widget.widgetID == widgets[i].widgetID)
							{

								if (widgets[i].widgetID.toString().substr(0, 4) != "temp") {
			                            $rootScope.currentDashboard.deletions.widgetIDs.push(widget.widgetID);
			                    }
								$rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets.splice(i, 1);
							}
						}
					}
				});
			}
		};
    })();
    
	$scope.showDashboardOptions = true;
	if($mdMedia('xs'))
	{
		$scope.showDashboardOptions = false;
	}

	$scope.setBasicChartEvents = function (widget) {
		if (widget.widgetData.chartType.chartType == "highCharts") 
		{
			var meausresArray = [];
			var connection_string = "";
			angular.forEach(widget.widgetData.measures,function (key) {
				meausresArray.push({
					agg : key.aggType,
					field : name
				});
			});
			// if filters exist, apply
			if (widget.widgetData.DesignTimeFilter.length > 0)
			{
				var groupFilters = filterServices.groupFilterConnectionString(widget.widgetData.DesignTimeFilter);
				connection_string = filterServices.generateFilterConnectionString(groupFilters,widget.widgetData.selectedDB);
			}
			generateHighchart.assignChartEvents(widget.widgetData.widgetConfig,meausresArray,widget.widgetData.drilledConf,widget.widgetData.groupBySortArray,widget.widgetData.allXAxis,connection_string);
		}
	}
	
	$scope.limit = function(yvalue, ylimit)
	{
		if(yvalue >= ylimit){	yvalue = ylimit;	}
		if(yvalue <= 40){	yvalue = 40;	}
		
		$scope.$apply(function () {
			$scope.showDashboardOptions = false;
			angular.element('#dashboardOptionsClosed').css('top',yvalue+"px");
		})
	}
	
	$scope.dashboardOptionsShowClick = function()
	{
		$scope.showDashboardOptions = !$scope.showDashboardOptions;
	}


	// --------------- widget level filter method start -----------------

	// load the expanded filter field values
	$scope.loadFilterParams = function(widget, filterIndex)
	{
		var pageIndex = $rootScope.selectedPageIndex;
		var widgetIndex = $rootScope.currentDashboard.pages[pageIndex].widgets.indexOf(widget);
		var widgetFilterFields = $rootScope.currentDashboard.pages[pageIndex].widgets[widgetIndex].widgetData.RuntimeFilter;
		if (widgetFilterFields[filterIndex].fieldvalues === undefined)
		{
			widgetFilterFields[filterIndex].fieldvalues = [];
		}
		widgetFilterFields[filterIndex].isLoading = true;
		if ( widgetFilterFields[filterIndex].fieldvalues.length == 0)
		{
			var is_dashboardFilter = false;
			var widgetData = $rootScope.currentDashboard.pages[pageIndex].widgets[widgetIndex].widgetData;
			filterServices.getFieldParameters(widgetFilterFields[filterIndex].name,widgetData.selectedDB,widgetData.selectedFile,function(data){
				$scope.$apply(function(){
					widgetFilterFields[filterIndex].fieldvalues = data;
				})
				widgetFilterFields[filterIndex].isLoading = false;
			},100,0,is_dashboardFilter);
		}
	}

	$scope.setFilterValueSelection = function(value,fieldvalues) {
		// do nothing
		angular.forEach(value.fieldvalues,function(fields) {
			fields.isSelected = false;
		});
		fieldvalues.isSelected = true;
		// angular.element('.filterItemSeleted').css('background',$mdColors.getThemeColor($rootScope.theme+"-accent-A700"));
	}

	// clear filters associated to the chart
	$scope.clearWidgetFilters = function(widget) {
		widget.isWidgetFiltered = false;
		var pageIndex = $rootScope.selectedPageIndex;
		var widgetIndex = $rootScope.currentDashboard.pages[pageIndex].widgets.indexOf(widget);
		var widgetFilterFields = $rootScope.currentDashboard.pages[pageIndex].widgets[widgetIndex].widgetData.RuntimeFilter;
		angular.forEach(widgetFilterFields,function(filterField) {
			if (filterField['fieldvalues'] !== undefined)
			{
				angular.forEach(filterField.fieldvalues,function(value){
					value.isSelected = false;
				})
			}
		});

		if(widget.widgetData.chartType.chartType == "tabular"){
			widget.widgetData.widgetConfig.runtimeQuery = "";
			widget.widgetData.widgetConfig.runtimefilterString = "";

		};

		$scope.widgetControls.syncWidget(widget,'False')
	}

	// build chart with filters applied
	$scope.applyFilters = function(widget) {
		var pageIndex = $rootScope.selectedPageIndex;
		var widgetIndex = $rootScope.currentDashboard.pages[pageIndex].widgets.indexOf(widget);
		var widgetFilterFields = $rootScope.currentDashboard.pages[pageIndex].widgets[widgetIndex].widgetData.RuntimeFilter;
		var widgetData = $rootScope.currentDashboard.pages[pageIndex].widgets[widgetIndex].widgetData;
		var run_connectionString = "";
		var des_connection_string 
		var isCreate = false;
		var selectedFilterFiedsCopy = filterServices.compareDesignTimeFilter(widgetFilterFields,widgetData.DesignTimeFilter);
		run_connectionString = filterServices.generateFilterConnectionString(selectedFilterFiedsCopy,widgetData.selectedDB);
		var groupFilters = filterServices.groupFilterConnectionString(widget.widgetData.DesignTimeFilter);
		des_connection_string = filterServices.generateFilterConnectionString(groupFilters,widget.widgetData.selectedDB);
		
	

		if (run_connectionString != "")
		{
			if(widget.widgetData.chartType.chartType == "highCharts"){
				widget.isWidgetFiltered = true;
				widgetData.syncOn = true;
				generateHighchart.generate(widgetData.widgetConfig, widgetData.chartType.chart, widgetData.selectedFile, widgetData.Measures,widgetData.XAxis, 1000, widgetData.selectedDB,false,widgetData.groupBySortArray ,function (data,query){
					widgetData.syncOn = false;
				},run_connectionString,[],[],isCreate);
			}
			if(widget.widgetData.chartType.chartType == "tabular"){

				if(des_connection_string != ""){
					run_connectionString = run_connectionString + " AND " + des_connection_string;
				}
				widget.isWidgetFiltered = true;
				widgetData.syncOn = true;
				generateTabular.applyRunTimeFilters(widget,des_connection_string,run_connectionString, function (data){
					widgetData.syncOn = false;
				});
			}
			
		} else {
			// pop up notification
		}
	}

	// --------------- widget level filter method end -----------------

	// ------------------ Dashboard level filter method start ---------------------

	// return the filters array
	function getFiltersArray (widget,dashboardFilterFields)
	{
        var allFiltersArray = [];
        var filterString = "";
        var dashboardFilterString = "";
        var dashboardFilterCopy = [];
        if (widget.widgetData.RuntimeFilter.length !=0) {
            angular.forEach(widget.widgetData.RuntimeFilter,function(runTimeFilter) {
                angular.forEach(dashboardFilterFields,function(dashboardFilter) {
                	// if dashboard filters and run time filters map
                    if (runTimeFilter.name == dashboardFilter.name) {
                        // compare against design time filter
                        dashboardFilterCopy = filterServices.compareDesignTimeFilter([dashboardFilter],widget.widgetData.DesignTimeFilter);
                        // generate the connection string for the dashboard filter
                        dashboardFilterString = filterServices.generateFilterConnectionString(dashboardFilterCopy,widget.widgetData.selectedDB);
                        if (dashboardFilterString != "")
                            allFiltersArray.push(dashboardFilterString);
                        // else
                        	// if no filter mapping is there with design time filters, display an empty chart
                        	// chartUtilitiesFactory.removeDataPoints(widget.widgetData.widgetConfig);
                    }
                });
            })
        }
        return allFiltersArray;
	}

	/*
      todo : put this method to a service
	 @ dashboard : the current dashboard object
	 @ page_index : selected page index
	 @ dashboardFilterFields : the values that are selected for filtering / the default values
	 @ is_default : if the method is being called to apply default filters when first open
	*/
	function applyDashboardFilter(dashboard,page_index,dashboardFilterFields,is_default)
	{
        var count = 0;
        angular.forEach(dashboard.pages[page_index].widgets,function(widget) {
            if (widget.widgetData.chartType.chartType == "highCharts") {
            	var filterString = "";
            	var allFiltersArray = getFiltersArray(widget,dashboardFilterFields);
                // if there is a connection string present
                if (allFiltersArray.length > 0) {
					filterString = allFiltersArray.join( ' And ');
                    var isCreate = false;
                    widget.widgetData.dashboardFilterOn = true;
                    generateHighchart.generate(widget.widgetData.widgetConfig, widget.widgetData.chartType.chart, widget.widgetData.selectedFile, widget.widgetData.Measures,widget.widgetData.XAxis, 1000, widget.widgetData.selectedDB,false,widget.widgetData.groupBySortArray ,function (data,query){
                        // set widget sync parameter to false
                        widget.widgetData.dashboardFilterOn = false;
                        widget.isWidgetFiltered = false;
                        count++;
                        if (!is_default) 
                        	filterServices.setDashboardFilter(dashboard,page_index,count,true);
                        else
                        	if (count == dashboard.pages[page_index].widgets.length) dashboard.pages[page_index].isSeen = true;
                    },filterString,[],[],isCreate);
                } else {
                    count++;
                    if (!is_default)
                    	filterServices.setDashboardFilter(dashboard,page_index,count,true);
                    else
                    	// set dashboard filtered status to true
                    	filterServices.setDefaultFilter(dashboard,page_index,count,widget,function(data){
                    		widget = data;
                    	})
                }
            }
            else if(widget.widgetData.chartType.chartType == "tabular"){
            	var filterString = "";
            	var allFiltersArray = getFiltersArray(widget,dashboardFilterFields);
            	if (allFiltersArray.length > 0) {
            		filterString = allFiltersArray.join( ' And ');
                    var isCreate = false;
                    widget.widgetData.dashboardFilterOn = true;

                    generateTabular.applyRunTimeFilters(widget,widget.widgetData.widgetConfigdesignFilterString,filterString, function (data){
						// set widget sync parameter to false
                        widget.widgetData.dashboardFilterOn = false;
                        widget.isWidgetFiltered = false;
                        count++;
                        if (!is_default) 
                        	filterServices.setDashboardFilter(dashboard,page_index,count,true);
                        else
                        	if (count == dashboard.pages[page_index].widgets.length) dashboard.pages[page_index].isSeen = true;
					});

            	}else{

            		count++;
                    if (!is_default)
                    	filterServices.setDashboardFilter(dashboard,page_index,count,true);
                    else
                    	// set dashboard filtered status to true
                    	filterServices.setDefaultFilter(dashboard,page_index,count,widget,function(data){
                    		widget = data;
                    	})

            	}

            }
            else {                
                count++;
                if (!is_default) filterServices.setDashboardFilter(dashboard,page_index,count,true); else dashboard.pages[page_index].isSeen = true;
            }
        })
	}

	$scope.dashboardFilterFields = angular.copy($rootScope.currentDashboard.filterDetails);

	$scope.displayDashboardFilters = function() {
		if ($rootScope.currentDashboard.filterDetails.length != 0)
		{
			filterServices.generateDashboardFilterFields($scope.dashboardFilterFields);
		}
	};

	$scope.loadDashboardFilterParams = function(filterIndex){
		var is_dashboardFilter = true;
		var expandedFilter = $scope.dashboardFilterFields[filterIndex];
		if (expandedFilter.fieldvalues === undefined && !expandedFilter.is_custom) {
			expandedFilter.fieldvalues = [];
		}
		//if the expanded filter is empty and not a custom filter
		if (expandedFilter.fieldvalues.length === 0 && !expandedFilter.is_custom) {
			expandedFilter.isLoading = true;
			var selectedFile = {
				datasource_name : expandedFilter.datasource_table,
				datasource_id : expandedFilter.datasource_id
			};
			filterServices.getFieldParameters(expandedFilter.display_field,expandedFilter.datasource,selectedFile,function(data){
				$scope.$apply(function(){
					expandedFilter['fieldvalues'] = data;
				})
				expandedFilter.isLoading = false;
			},100,0,is_dashboardFilter,expandedFilter.value_field);
		}
	};

	$scope.dashboardFilterApply = function() {
		applyDashboardFilter($rootScope.currentDashboard,$rootScope.selectedPageIndex,$scope.dashboardFilterFields,false);
	};

	$scope.clearDashboardfilters = function() {
		// set isSeen parameter of page to false
		angular.forEach($rootScope.currentDashboard.pages,function(page){
			page.isSeen = false;
		});
		angular.forEach($scope.dashboardFilterFields,function(filters){
			if (filters.fieldvalues !== undefined) {
				angular.forEach(filters.fieldvalues,function(field){
					field.isSelected = false;
				})
			}
		})
		// sync a page when it is cleared
		DiginServices.syncPages($rootScope.currentDashboard,$rootScope.selectedPageIndex,function(dashboard){
			$scope.$apply(function(){
				// returns the synced page
				$rootScope.currentDashboard = dashboard;
				filterServices.setDashboardFilter($rootScope.currentDashboard,$rootScope.selectedPageIndex,$rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets.length,false);
			})
		},'False');
	};
	// ------------------- Dashboard level filter method start ---------------------

	$timeout(function() {
		var windowWidth = window.outerWidth - 350;
		angular.element('#dashboardOptionsOpen').css('left',windowWidth+"px");
	},200)
	
}])//END OF dashboardCtrl

DiginApp.controller('fullscreenCtrl', ['$scope', '$mdDialog','event' ,'widget','$timeout', function($scope, $mdDialog,event, widget,$timeout) {

	
	$scope.widget = widget;
	$timeout(function() {
		if($scope.widget.widgetData.chartType.chartType == 'highCharts' || $scope.widget.widgetData.chartType.chartType == 'forecast')
		{
			$('#'+$scope.widget.widgetData.widgetID).highcharts().setSize(document.documentElement.offsetWidth, document.documentElement.offsetHeight - 45, true);
		}else if($scope.widget.widgetData.chartType.chartType == 'metric')
		{
			$('#'+$scope.widget.widgetData.widgetID).highcharts().setSize(document.documentElement.offsetWidth / 1.8, document.documentElement.offsetHeight - 45, true);
		}
	},100)
	
}]);// END OF fullscreenCtrl

DiginApp.directive('draggable', ['$document', function($document) {
    return {
      restrict: 'A',
	  scope:	{		
			draggable: '&',
			limitHit: '&'
		},
	  link: function(scope, elm, attrs) {
		var xlimit = window.outerWidth - 50;
		var ylimit = window.outerHeight - 200;
		
		var windowWidth = window.outerWidth - 280;
		angular.element('#dashboardOptionsOpen').css('left',windowWidth+"px");
		var startX, startY, initialMouseX, initialMouseY;

		elm.bind('mousedown', function($event) {
		  scope.draggable();
		  startX = elm.prop('offsetLeft');
		  startY = elm.prop('offsetTop');
		  initialMouseX = $event.clientX;
		  initialMouseY = $event.clientY;
		  $document.bind('mousemove', mousemove);
		  $document.bind('mouseup', mouseup);
		  return false;
		});

        function mousemove($event) {
			
			if($event.clientX >= xlimit || $event.clientX <= 100 || $event.clientY >= ylimit || $event.clientY <= 50)
			{
				scope.limitHit({yvalue: $event.clientY, ylimit: ylimit});		
			}else{
				var dx = $event.clientX - initialMouseX;
				var dy = $event.clientY - initialMouseY;
				elm.css({
					top:  startY + dy + 'px',
					left: startX + dx + 'px',
					opacity: 0.5
				});
			}

          return false;
        }

        function mouseup($event) {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
		  elm.css({
			opacity: 1
          });
		  
        }
      }
    };
}]);