DiginApp.controller('NavCtrl', ['$scope','$rootScope', '$state', '$mdDialog', '$mdMedia','$mdSidenav','layoutManager', 'notifications', 'DiginServices','colorManager', '$timeout', 
	'$mdSelect','$mdMenu','$window','pouchDB','PouchServices', 'IsLocal','dialogService','$log','filterServices','DiginDashboardSavingServices' ,function ($scope,$rootScope , $state,$mdDialog, $mdMedia,$mdSidenav ,
		layoutManager,notifications,DiginServices,colorManager,$timeout,$mdSelect,$mdMenu,$window,pouchDB,PouchServices,IsLocal,dialogService,$log,filterServices,DiginDashboardSavingServices) {

	//$auth.checkSession();
	$rootScope.authObject = JSON.parse(decodeURIComponent(getCookie('authData')));
	
	$rootScope.sharableUsers = [];
	$rootScope.sharableGroups = [];
	$log.debug('please user $log.debug("sample log") or notifications.log("sample log",new Error()) instead of console.log()');
	
	$scope.currentView = "Home";
	
	//Theming
	$scope.zoomLevel = "100%";
	$rootScope.theme = 'default';
	$rootScope.lightOrDark = '';
	$rootScope.currentColor = '';
	$rootScope.h1color = '';
	colorManager.changeTheme($rootScope.theme);
	
	// use this variable to make the dialogs fullscreen in smaller screen sizes
	var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
	
	//Check if the currentDashboard has been changed and not saved
	$scope.changed = false;
	
	//call this function from an iFrame to close it and come home
	window.firefunction = function()
	{
		$state.go('home');
	}
	
	$rootScope.applyDark = false;
	if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
	{
		//explicitly do something if the theme if dark
		$rootScope.applyDark = true;
	}else{
		//explicitly do something if the theme if light
		$rootScope.applyDark = false;
	}
	
	
	//Start of layoutManager
	$rootScope.showHeader = true;
	$rootScope.showSideMenu = true;
	
	//Adjust window height in chart designer and facebook iframe accordingly otherwise the view will take up the full height
	$scope.chartDesignerViewPortHeight = "calc(100vh - 92px)"
	$scope.iframeViewPortHeight = "calc(100vh - 49px)"
	
	$scope.topMenuToggle = function()
	{	
		if($rootScope.showHeader === true)
		{
			layoutManager.hideHeader(function (data){
				$rootScope.$apply(function() {
					$rootScope.showHeader = data;
					$scope.chartDesignerViewPortHeight = "calc(100vh - 46px)";
					$scope.iframeViewPortHeight = "calc(100vh - 4px)"
				})
			});
		}else{
			layoutManager.showHeader(function (data){
				$rootScope.showHeader = data;
				$scope.chartDesignerViewPortHeight = "calc(100vh - 92px)";
				$scope.iframeViewPortHeight = "calc(100vh - 49px)"
			});
		}
	}
	
	$scope.leftMenuToggle = function()
	{
		if($scope.showSideMenu === true)
		{
			layoutManager.hideSideMenu(function (data){
				$rootScope.$apply(function() {
					$rootScope.showSideMenu = data;
				})
			})
		}else{
			layoutManager.showSideMenu(function (data){
				$rootScope.showSideMenu = data;
			})
		}
	}
	//End of layoutManager
	
	// Start of Navigate
	$scope.navigate = function(ev,action)
	{
		//Only if the user is in the dashboard check if the currentDashboard has been changed and not saved.
		if($state.current.name == "dashboard" || $state.current.name == "visualize_data"  || $state.current.name == "dashboardFilterSettings")
		{
			var pageIndex = 0;	
			try{
				angular.forEach($rootScope.currentDashboard.pages, function(value, key) {
					if($rootScope.currentDashboard.pages[pageIndex].widgets.length != $rootScope.selectedDashboard.pages[pageIndex].widgets.length)
					{
						$scope.changed= true;
						console.log("changed");
					}
					pageIndex++;
				});
			}catch(exception)
			{
				$scope.changed = true;
			}
			
			if($scope.changed == false)
			{
				clearWidgets();
				navigateTo(ev,action); // if the user has not made any changes to the dashboard  navigate where he/she wants to
			}else{
				
				dialogService.confirmDialog(ev,"Unsaved Changes","Save changes to '"+$rootScope.currentDashboard.compName+"' Dashboard before leaving", "yes","no", "cancel").then(function(answer) {
					if(answer == "yes")
					{
						// save the changes and then navigate where he wants to
						var dashboardDetails = {dashboardName: $rootScope.currentDashboard.compName, refreshInterval: $rootScope.currentDashboard.refreshInterval};
						DiginDashboardSavingServices.saveDashboard(ev, dashboardDetails).then(function(newDashboardDetails) {
							console.log(newDashboardDetails);
							$scope.changed = false; //change this to false again since the chages were saved
							//$scope.currentView = newDashboardDetails.dashboardName;
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
								$scope.dashboards.push({compID: newDashboardDetails.compID, compType: "dashboard", compName: newDashboardDetails.dashboardName });
							}
							navigateTo(ev,action);
						});
					}
					else if(answer == "no")
					{
						clearWidgets(); // if the user ignores to save the changes navigate where he wants to
						navigateTo(ev,action);
					}
				});

			}
		}else{// if user is not in dashboard navigate to where he/she wants to
			navigateTo(ev,action);
		}
		
	}// End of Navigate
	
	function navigateTo(ev,action){
		if(action.charAt(0) == "#")
		{
			location.href = action; // if the action looks like this '#/home' navigate to that particular state.
		}else if(action == "Switch Tenant")
		{
			 $mdDialog.show({
			  controller: 'switchTenantCtrl',
			  templateUrl: 'dialogs/switchTenant/switchTenant.html',
			  parent: angular.element(document.body),
			  clickOutsideToClose:true,
			  targetEvent: ev,
			  fullscreen: useFullScreen
			});
			
			 $scope.$watch(function() {
			  return $mdMedia('xs') || $mdMedia('sm');
				}, function(wantsFullScreen) {
				  $scope.customFullscreen = (wantsFullScreen === true);
			});
		}else if(action == "Logout")
		{
			dialogService.confirmDialog(ev, "Logout","Are you sure you want to logout?","yes", "no").then(function(answer) {
				if(answer == 'yes')
				{
					$window.location = "/logout.php";
				}
			})
		}else if(action == "Create Dashboard")
		{
			
			 $mdDialog.show({
			  controller: 'createDashboardCtrl',
			  templateUrl: 'dialogs/createDashboard/createDashboard.html',
			  parent: angular.element(document.body),
			  clickOutsideToClose:true,
			  targetEvent: ev,
			  fullscreen: useFullScreen
			}).then(function(answer) {
				$rootScope.currentDashboard = {
					compName: answer.dashboard,
					compType: "dashboard",
					compID: "temp" + createuuid(),
					refreshInterval: 0, 
					compClass: null,
					compCategory: null,
					pages: [{pageName: answer.page,
                            pageID: "temp" + createuuid(),
							widgets: [],
							pageData: null}],
					deletions :{
					        componentIDs:[],
					        pageIDs:[],
					        widgetIDs:[]},
					filterDetails: [],		     
				};
				console.log("empty dashboar created " + $rootScope.currentDashboard);
				location.href = '#/visualize_data';
				
			});
			
			 $scope.$watch(function() {
			  return $mdMedia('xs') || $mdMedia('sm');
				}, function(wantsFullScreen) {
				  $scope.customFullscreen = (wantsFullScreen === true);
			});
		}
	}
	
	// This variable is only used to toggle the icons and tooltip in the 'Turn Fullscreen On/Off button'
	$scope.fullscreenOn = false;
	
	//Start of Perform
	$scope.perform = function(ev,action)
	{
		if(action == "Search"){
			$mdSidenav('searchBar').toggle();
			$scope.SearchComponents = "";
		}else if(action == "TV Mode")
		{
			//Start of Navigate TVMode
			if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
			   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
				   $scope.fullscreenOn = true;
				if (document.documentElement.requestFullScreen) {  
				  document.documentElement.requestFullScreen();  
				} else if (document.documentElement.mozRequestFullScreen) {  
				  document.documentElement.mozRequestFullScreen();  
				} else if (document.documentElement.webkitRequestFullScreen) {  
				  document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
				}  
			  } else {
				  $scope.fullscreenOn = false;
				if (document.cancelFullScreen) {  
				  document.cancelFullScreen();  
				} else if (document.mozCancelFullScreen) {  
				  document.mozCancelFullScreen();  
				} else if (document.webkitCancelFullScreen) {  
				  document.webkitCancelFullScreen();  
				}  
			  }
			  //End of Navigate TVMode
		}else if(action == 'Clear Widgets')
		{
			dialogService.confirmDialog(ev, "Clear Widgets","Are you sure you want to clear all Widgets?","yes", "no").then(function(answer) {
				if(answer == 'yes')
				{
					clearWidgets();
				}
			});
		}else if(action == 'Notifications')
		{
			$mdSidenav('notifications').toggle();
		}else if(action == "AddWidget")
		{
			
			 $mdDialog.show({
			  controller: 'addWidgetCtrl',
			  templateUrl: 'dialogs/addWidget/addWidget.html',
			  parent: angular.element(document.body),
			  clickOutsideToClose:true,
			  targetEvent: ev,
			  fullscreen: useFullScreen
			});
			
			 $scope.$watch(function() {
			  return $mdMedia('xs') || $mdMedia('sm');
				}, function(wantsFullScreen) {
				  $scope.customFullscreen = (wantsFullScreen === true);
			});
		}else if(action == "visualize_data")
		{
			location.href = "#/visualize_data";
		}
	}
	//End of Perform
	
	function clearWidgets()
	{
		$rootScope.currentDashboard = [];
		$rootScope.selectedDashboard = [];
		$rootScope.currentDashboard = {

			"pages": null,
			"compClass": null,
			"compType": null,
			"compCategory": null,
			"compID": null,
			"compName": null,
			"refreshInterval": null,
			"filterDetails":[],
			"deletions" :{
					        "componentIDs":[],
					        "pageIDs":[],
					        "widgetIDs":[]},

		}

		$rootScope.currentDashboard.pages = [];
		var page = {
			"widgets": [],
			"pageID": "temp" + createuuid(),
			"pageName": "DEFAULT",
			"pageData": null
		}
		$rootScope.currentDashboard.pages.push(page);
	}
	
	$scope.data = {};
	$scope.userSettings = {};
	$scope.myTenant = {};
    var oldDefaultDashboard = "";
	(function (){

		if(IsLocal === true){
			notifications.log("not local", new Error());
			//$scope.getSearchPanelDetails();

            //Just for testing, User settings are not needed here
            DiginServices.getUserSettings().then(function(data) {
				if(data)
				{
					notifications.log(data, new Error());
					PouchServices.storeAndUpdateUserSettings(data);				
					$scope.userSettings = data;
					$rootScope.theme = $scope.userSettings.theme_config;

					//color the UI
					colorManager.changeTheme($rootScope.theme);

					//Go To Default Dashboard if it exsist
					var obj = JSON.parse($scope.userSettings.components);
					if(obj.dashboardId !== null) {
						//getDashboard(obj.dashboardId);
						$scope.data.defaultDashboard = obj.dashboardId;
						oldDefaultDashboard = angular.copy(obj.dashboardId);
					}
				}
            });
			
				var pouchdbName = 'localPouch';
				$rootScope.localDb  = new pouchDB(pouchdbName);
		}else{
			
			DiginServices.getUserSettings().then(function(data) {
				notifications.log(data, new Error());
				$scope.userSettings = data;
			});
			
			DiginServices.getTenant().then(function(data) {
				$scope.myTenant = data;
			});
			
			DiginServices.getSession().then(function(data) {
				var pouchdbName = data.UserID + data.Domain;
				notifications.log(pouchdbName, new Error());
				$rootScope.localDb  = new pouchDB(pouchdbName);
			});
		}
		PouchServices.getUserSettings().then(function(data) {
			console.log(data);
			if(data)
			{
				$scope.userSettings = data;
				$rootScope.theme = $scope.userSettings.theme_config;

				//color the UI
				colorManager.changeTheme($rootScope.theme);
			}
		});
	})();
	
	
	$scope.dashboards = [];
	$scope.reports = [];
	
	$scope.componentsLoaded = false;
	PouchServices.getDiginComponents().then(function(data) {
		notifications.log(data, new Error());
		$scope.componentsLoaded = true;
		for (var i = 0, len = data.length; i<len; ++i){
			if(data[i].compType == 'dashboard')
			{
				$scope.dashboards.push(data[i]);
			}else if(data[i].compType == 'Report')
			{
				$scope.reports.push(data[i]);
			}
		}
	});
	
	//This is a dashboard that is saved and can be reterived later, this is kept to check if the currentDashboard has been changed without saving the changes
	$rootScope.selectedDashboard = {};
	
	//may or may not be saved
	$rootScope.currentDashboard = {};

	//keeps the current page of the currnt dashboard
	$rootScope.selectedPageIndex = 0;
	
	$scope.diginComponents = (function () {
		return {
			goDashboard: function (ev, dashboard) {
				$mdSidenav('searchBar').close();
				getDashboard(ev, dashboard.compID);
				
				
			},
			goReport: function (report){
				notifications.log("report", new Error());
				$mdSidenav('searchBar').close();
			},
			deleteDashboard: function (dashboard, ev){
				dialogService.confirmDialog(ev, "Delete Dashboard","Are you sure you want to delete '"+dashboard.compName+"' dashboard?","yes", "cancel").then(function(result) {
					if(result == 'yes')
					{
						DiginServices.deleteComponent(ev, dashboard.compID, false).then(function(data) {
							if(data.Is_Success === true){
								
								// Delete from pouch
								
								// Delete from view
								angular.forEach($scope.dashboards, function(value, key) {
									if(value.compID == dashboard.compID)
									{
										$scope.dashboards.splice(key,1);
									}
								})
							}
						});
					}
				});
			},
			deleteReport: function (dashboard, ev){
				notifications.log("delete report", new Error());
			},setDefaultDashboard: function (ev, dashboard) {
				
				dialogService.confirmDialog(ev, "Set Default Dashboard","Are you sure you want to set '"+dashboard.compName+"' dashboard as Default?","yes", "cancel").then(function(result) {
                    if (result == 'yes') {
						 var userSettingsSaveObj = {components: "{\"saveExplicit\": false,\"dashboardId\":"+ dashboard.compID+"}"};
						
							DiginServices.updateUserSettings(userSettingsSaveObj).then(function(data) {
								if(data.Is_Success === true){
									notifications.toast(1,"New default dashboard was saved");
								}else{
									notifications.toast(1,"Falied to update Theme");
								}
							});
				    }else{
                        $scope.data.defaultDashboard = null;
                        $scope.data.defaultDashboard = oldDefaultDashboard;
					}
                });
            }

		};
	})();

	//Really sorry about this code below, If I haven't done yet please remind me to create a directive for this.
	$scope.showTip = false;
	$scope.clientX = "";
	$scope.clientY = "";
	$scope.setDashboardHover = function(ev){ //This is to show the tooltip since the md-tooltip doesn't work because of md-list-item
        $scope.clientX = Math.ceil(ev.clientX / 10) * 10 + "px";
        $scope.clientY = Math.ceil(ev.clientY / 10) * 10 + 30 + "px";
        $scope.showTip = true;
	}

    $scope.unsetDashboardHover = function(ev){
        $scope.showTip = false;
    }
    //Really sorry about this code above, If I haven't done yet please remind me to create a directive for this.


    function getDashboard(ev, dashboardId)
	{
		PouchServices.getDashboard(ev, dashboardId).then(function(data) {
			$rootScope.selectedPageIndex = 0;
			$rootScope.currentDashboard = angular.copy(data);
			$rootScope.selectedDashboard = angular.copy(data);
			notifications.log($rootScope.currentDashboard, new Error());
			location.href = '#/dashboard?id='+dashboardId;
		});
	}

	$scope.route = function(state, pageNo) //pageNo is optional
	{
		$state.go(state,{ 'pageNo': pageNo });
	}
	
	//close any dialog box
	$rootScope.cancel = function()
	{
		$mdDialog.cancel();
	}
	
	$scope.notifications = [{notification_id: '1234',title:"Urgent", message: "Your system needs to be updated asap", type: 1, icon: "ti-pie-chart", color: "#4CAF50"}];
	var notificationSound = new Audio('sounds/notification.mp3');
	$scope.notificationAudio = true; 
	
	$scope.removeNotification = function(index)
	{
		$scope.notifications.splice(index,1);
	}
	/*
	$timeout(function(){
		var message = {notification_id: '1234',title:"Great", message: "asldkfja sdflkasdf asldkfa sdfl", type: "2", href:"#/home"};
		if(!message.icon){message.icon = "ti-comment"};
			
		if(parseInt(message.type) == 0){message.color = "#FF5252";}else if(parseInt(message.type) == 1){message.color = "#4CAF50"}else if(parseInt(message.type) == 2){message.color = "#F9A937";}
		
		$scope.notifications.push(message);
		notifications.toast(message.type, message.message);
		if($scope.notificationAudio == true)
		{
			notificationSound.play();
		}

	}, 5000);
	*/

	
	
	//Introduction to Shell
	$scope.IntroOptions = {
		steps:[
			{
				element: '#addPage',
				intro: "Create your dashboard with Add page, add many pages as you want and make them a storyboard",
				position: 'right'
			}, {
				element: '#reports',
				intro: 'Create your static, adhoc reports and publish them here',
				position: 'right'
			}, {
				element: '#datasource',
				intro: 'Pick  your correct datasource and visualize them in various ways',
				position: 'right'
			}, {
				element: '#addWidgets',
				intro: 'Create your customized widgets and add it to the dashboard',
				position: 'right'
			}, {
				element: '#socialMedia',
				intro: 'Dig deep in to your social media pages',
				position: 'right'
			},
			/*{
				element: '#shareSocial',
				intro: 'Share your Dashboards on Social Media',
				position: 'right'
			},*/{
				element: '#settings',
				intro: 'Configure the settings related to the system and users',
				position: 'right'
			}, {
				element: '#home',
				intro: 'Go to <strong>Home</strong> page'
			}, {
				element: '#fullscreen',
				intro: 'Toggle Fullscreen'
			}, {
				element: '#clearWidgets',
				intro: 'Clear widgets in the screen'
			}, {
				element: '#save',
				intro: 'Save the Dashboard'
			}, {
				element: '#share',
				intro: 'Share your dashboard or datasets'
			}, {
				element: '#notifications',
				intro: 'Checkout the latest notifications here'
			}],
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc:true,
        nextLabel: '<strong style="color:green">NEXT</strong>',
        prevLabel: '<span>Previous</span>',
        skipLabel: 'End Tour',
        doneLabel: '<strong style="color:green">Got it!!</strong>'
    };

    $scope.ShouldAutoStart = false;

	
}]);//END OF NavCtrl