DiginApp.controller('dashboardCtrl',['$scope', '$rootScope','$mdDialog', '$window', '$mdMedia', '$stateParams', 'layoutManager',
	'notifications', 'DiginServices' ,'$diginengine', 'colorManager','$timeout','$state','dialogService', 'chartSyncServices', 
	function ($scope, $rootScope,$mdDialog, $window, $mdMedia,$stateParams,layoutManager,notifications, 
		DiginServices, $diginengine,colorManager,$timeout,$state,dialogService,chartSyncServices) {

	/* reinforceTheme method is called twise because initially the theme needs to be applied to .footerTabContainer and later after the UI is initialized it needs to be 
	 called again to apply the theme to hover colors of the widget controlls (buttons)*/
	colorManager.reinforceTheme();
	$timeout(function() {
		colorManager.reinforceTheme();
	},100)
	
$scope.widgetFilePath = 'views/dashboard/widgets.html';

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
			  stop: function(event,$element,widget){
				$scope.$parent.changed = true; // Keep track if the Dashboard is changed without saving
				$rootScope.$broadcast('widget-resized', { element: $element, widget: widget });
			}
        },
		mobileBreakPoint: 600, // width threshold to toggle mobile mode
		mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
		/*minColumns: 1, // minimum amount of columns the grid can scale down to
		minRows: 1, // minimum amount of rows to show if the grid is empty
		maxRows: 100, // maximum amount of rows in the grid*/
		defaultSizeX: 4, // default width of an item in columns
		defaultSizeY: 11, // default height of an item in rows
		/*minSizeX: 6, // minimum column width of an item
		maxSizeX: null, // maximum column width of an item
		minSizeY: 5, // minumum row height of an item
		maxSizeY: null, // maximum row height of an item*/
		saveGridItemCalculatedHeightInMobile: false, // grid item height in mobile display. true- to use the calculated height by sizeY given

	};
	
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

	 // use this variable to make the dialogs fullscreen in smaller screen sizes
	 var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;


	//Dashboard toolbar controls
	$scope.dashboardControls = (function (){
		return {
			saveDashboard: function(ev){

				$mdDialog.show({
				  controller: 'saveDashboardCtrl',
				  templateUrl: 'dialogs/saveDashboard/saveDashboard.html',
				  parent: angular.element(document.body),
				  clickOutsideToClose:true,
				  targetEvent: ev,
				  fullscreen: useFullScreen
				}).then(function(answer) {
					console.log("save dashboard closed");
					console.log(answer);
					notifications.startLoading(ev,"Saving '"+answer.dashboardName+"' dashboard, Please wait...");
				}); 
				
				 $scope.$watch(function() {
				  return $mdMedia('xs') || $mdMedia('sm');
					}, function(wantsFullScreen) {
					  $scope.customFullscreen = (wantsFullScreen === true);
				});
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
			share: function (ev, widget) {
				notifications.log("Share",new Error());
			},
			showData: function (ev, widget) {
				notifications.log("Show data",new Error());
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
			syncWidget: function (widget) {
				notifications.log("Sync Widget",new Error());
				widget.syncOn = true;
				// send is_sync parameter as true
				chartSyncServices.sync(widget,function(widget){
					$scope.$apply(function(){
						widget.syncOn = false;						
					})
				}, 'True');
			},
			removeWidget: function(ev, widget)
			{

				var widgets = $rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets;
				var widgetID = widget.widgetID;
				if (widgetID.toString().substr(0, 4) != "temp") {
					for(var i=0; i < widgets.length; i++){
						if(widgetID == widgets[i].widgetID){

                    		$rootScope.currentDashboard.deletions.widgetIDs.push(widgetID);
							$rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets.splice(i, 1);	
						}
					}
                }

			}
		};
    })();
    
	$scope.keepInitialPosition = true;
	$scope.showDashboardOptions = true;
	
	$scope.firstTouchedEvent = function()
	{
		$scope.$apply(function () {
			$scope.keepInitialPosition = false;
		})
	}
	
	$scope.limit = function(yvalue, ylimit)
	{
		if(yvalue >= ylimit){	yvalue = ylimit;	}
		if(yvalue <= 50){	yvalue = 50;	}
		
		$scope.$apply(function () {
			$scope.showDashboardOptions = false;
			angular.element('#dashboardOptionsClosed').css('top',yvalue+"px");
		})
	}
	
	$scope.dashboardOptionsShowClick = function()
	{
		$scope.keepInitialPosition = true;
		$scope.showDashboardOptions = true;
	}
	
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
		}
	},100)

	/*if($scope.widget.widgetData.selectedChart.chartType == "d3sunburst") //$scope.widget.widgetData.selectedChart.chartType != "d3hierarchy" ||
	{
		$scope.widget.widgetData.widData.id = 'fullScreenChart';
		$scope.widget.widView = "views/ViewHnbMonthFullscreen.html"
		
	}*/
	
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
		
		var windowWidth = window.outerWidth - 350;
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