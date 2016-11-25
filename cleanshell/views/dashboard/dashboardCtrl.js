DiginApp.controller('dashboardCtrl',['$scope', '$rootScope','$mdDialog', '$window', '$mdMedia', 'layoutManager', function ($scope, $rootScope,$mdDialog, $window, $mdMedia,layoutManager) {
	
	$rootScope.showSideMenu = layoutManager.hideSideMenu();
	if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
	{
		$('md-tabs-wrapper').css('background-color',"rgb(48,48,48)", 'important');
	}else{
		$('md-tabs-wrapper').css('background-color',"white", 'important');
	}

	
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
			handle: '.widget-header'
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
				pageID:" 1470684542268",
				pageName: $scope.fileName,
				widgets: []
		})
		
		$scope.addPageFrom.$setUntouched();
		$scope.addPageFrom.$setPristine();
		
		$scope.fileName = "";
	}
	
	//Widget toolbar controls
	$scope.widgetControls = (function () {
		return {
			showData: function (ev, widget) {
				console.log("showData");
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
		
	}
	
	$scope.startWidget = function(widget)
	{
		console.log(widget);
	}
	
}])//END OF AddCtrl