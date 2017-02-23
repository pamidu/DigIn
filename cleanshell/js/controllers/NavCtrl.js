DiginApp.controller('NavCtrl', ['$scope','$rootScope', '$state', '$mdDialog', '$mdMedia','$mdSidenav', '$window','$auth' ,'layoutManager', 'notifications', 'DiginServices','$helpers','colorManager', '$timeout', '$mdSelect','$mdMenu','$window','pouchDB', 'IsLocal','dialogService',function ($scope,$rootScope , $state,$mdDialog, $mdMedia,$mdSidenav, $window,$auth ,layoutManager,notifications,DiginServices,$helpers,colorManager,$timeout,$mdSelect,$mdMenu,$window,pouchDB,IsLocal,dialogService) {

	$auth.checkSession();
	$rootScope.authObject = JSON.parse(decodeURIComponent($helpers.getCookie('authData')));
	$rootScope.sharableUsers = [];
	$rootScope.sharableGroups = [];
	
	$scope.currentView = "Home";
	
	//Theming
	$rootScope.theme = 'defaultDark';
	$rootScope.lightOrDark = '';
	$rootScope.currentColor = '';
	$rootScope.h1color = '';
	colorManager.changeTheme($rootScope.theme);
	
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
	}
	
	
	//Start of layoutManager
	$rootScope.showHeader = true;
	$rootScope.showSideMenu = true;
	
	$scope.topMenuToggle = function()
	{	
		if($rootScope.showHeader == true)
		{
			$rootScope.showHeader = layoutManager.hideHeader();
		}else{
			$rootScope.showHeader = layoutManager.showHeader();
		}
	}
	
	$scope.leftMenuToggle = function()
	{
		if($scope.showSideMenu == true)
		{
			$rootScope.showSideMenu = layoutManager.hideSideMenu();
		}else{
			$rootScope.showSideMenu = layoutManager.showSideMenu();
		}
	}
	//End of layoutManager
	
	// Start of Navigate
	$scope.navigate = function(ev,action)
	{
		//Only if the user is in the dashboard check if the currentDashboard has been changed and not saved.
		if($state.current.name == "dashboard")
		{
			var pageIndex = 0;	
			try{
				angular.forEach($scope.currentDashboard.pages, function(value, key) {
					if($scope.currentDashboard.pages[pageIndex].widgets.length != $scope.selectedDashboard.pages[pageIndex].widgets.length)
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
				navigateTo(ev,action);
			}else{
				$mdDialog.show({
				  controller: saveChangesCtrl,
				  templateUrl: 'views/dashboard/saveChanges/saveChanges.html',
				  parent: angular.element(document.body),
				  targetEvent: ev,
				  clickOutsideToClose:true
				})
				.then(function(answer) {
					if(answer == 'Yes')
					{
						alert("Changes saved");
					}else if(answer == 'No')
					{
						navigateTo(ev,action);
					}
				});
			}
		}else{
			navigateTo(ev,action)
		}
		
	}// End of Navigate
	
	function navigateTo(ev,action){
		if(action.charAt(0) == "#")
		{
			location.href = action;
		}else if(action == "Switch Tenant")
		{
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			
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
			var confirm = $mdDialog.confirm()
				.title('Are you sure you want to logout?')
				.targetEvent(event)
				.ok('Yes!')
				.cancel('No!');
			$mdDialog.show(confirm).then(function () {
				//$scope.status = 'Yes';
				$window.location = "/logout.php";
			}, function () {
				//$scope.status = 'No';
			});
		}else if(action == "Create Dashboard")
		{
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			
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
					compID: "dash" + createuuid(),
					refreshInterval: 0, 
					compClass: null,
					compCategory: null,
					pages: [{pageName: answer.page,
                            pageID: "temp" + createuuid(),
							widgets: [],
							pageData: null}]     
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
	
	function saveChangesCtrl ($scope, $mdDialog) {
		$scope.confirmReply = function(answer) {
		  $mdDialog.hide(answer);
		};
	}
	
	$scope.fullscreenOn = false;
	
	//Start of Perform
	$scope.perform = function(ev,action)
	{
		if(action == "Search"){
			$mdSidenav('searchBar').toggle();
			
		/*	dialogService.confirmDialog(ev, "Title","What is this","yes", "no").then(function(data) {
				console.log(data);
			});*/
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
			});
		}else if(action == 'Save')
		{
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			
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
				notifications.startLoading("Saving '"+answer.dashboardName+"' dashboard, Please wait...");
				
				$timeout(function(){
					notifications.finishLoading();
					notifications.toast(1,"Changes Successfully Saved");
				}, 3000);
			}); 
			
			 $scope.$watch(function() {
			  return $mdMedia('xs') || $mdMedia('sm');
				}, function(wantsFullScreen) {
				  $scope.customFullscreen = (wantsFullScreen === true);
			});
		}else if(action == 'Notifications')
		{
			$mdSidenav('notifications').toggle();
			//notifications.toast(1,"yes");
		}else if(action == "AddWidget")
		{
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			
			 $mdDialog.show({
			  controller: 'addWidgetCtrl',
			  templateUrl: 'dialogs/addWidget/addWidget.html',
			  parent: angular.element(document.body),
			  clickOutsideToClose:true,
			  targetEvent: ev,
			  fullscreen: useFullScreen
			})
			
			 $scope.$watch(function() {
			  return $mdMedia('xs') || $mdMedia('sm');
				}, function(wantsFullScreen) {
				  $scope.customFullscreen = (wantsFullScreen === true);
			});
		}
	}
	//End of Perform
	
	$scope.getUserSettings = {};
	
	(function (){

		if(IsLocal == true){
			$rootScope.db  = new pouchDB("Dashboards");
			//$scope.getSearchPanelDetails(); 
		}else{
			console.log("not local");
			
			DiginServices.getUserSettings().then(function(data) {
				console.log(data);
				$scope.getUserSettings = data;
			});
			
			DiginServices.getSession().then(function(data) {
				var pouchdbName = data.UserID + data.Domain;
				console.log(pouchdbName);
				$rootScope.db  = new pouchDB(pouchdbName);
			});
		}
	})();
	
	
	$scope.dashboards = [];
	$scope.reports = [];
	
	$scope.componentsLoaded = false;
	DiginServices.getDiginComponents().then(function(data) {
		console.log(data);
		$scope.componentsLoaded = true;
		for (i = 0, len = data.length; i<len; ++i){
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
	
	$scope.diginComponents = (function () {
		return {
			goDashboard: function (dashboard) {
				$mdSidenav('searchBar').close();
				$scope.currentView = dashboard.compName;
				getDashboard(dashboard.compID);
				
				
			},
			goReport: function (report){
				console.log("report");
				$mdSidenav('searchBar').close();
				$scope.currentView = report.compName;
			},
			deleteDashboard: function (dashboard, ev){
				console.log("delete dashboard");
			},
			deleteReport: function (dashboard, ev){
				console.log("delete report");
			}
		};
	})();
	
	function getDashboard(dashboardId)
	{
		DiginServices.getComponent(dashboardId).then(function(data) {
			$rootScope.currentDashboard = angular.copy(data);
			$rootScope.selectedDashboard = angular.copy(data);
			console.log($rootScope.currentDashboard);
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
	
	$scope.notifications = [{title:"Urgent", message: "Your system needs to be updated asap", type: 1, icon: "ti-pie-chart", color: "#4CAF50"}];
	var audio = new Audio('sounds/notification.mp3');
	$scope.notificationAudio = true; 
	
	/*
	$timeout(function(){
		var message = {title:"Great", message: "asldkfja sdflkasdf asldkfa sdfl", type: "2", href:"#/home"};
		if(!message.icon){message.icon = "ti-comment"};
			
		if(parseInt(message.type) == 0){message.color = "#FF5252";}else if(parseInt(message.type) == 1){message.color = "#4CAF50"}else if(parseInt(message.type) == 2){message.color = "#F9A937";}
		
		$scope.notifications.push(message);
		notifications.toast(message.type, message.message);
		if($scope.notificationAudio == true)
		{
			audio.play();
		}

	}, 5000);
	*/
	
	$scope.openNotification = function(path)
	{
		if(!path){
			//do nothing
		}else{
			window.location.href = path;
			$mdSidenav('notifications').toggle();
		}

	}


	
	
	
	//Introduction to Shell
	$scope.IntroOptions = {
        steps:[
        {
            element: document.querySelector('#step1'),
            intro: "The <b>Form designer</b> is an interactive tool which helps developers to easily create Angular forms in Material Design.",
			position: 'right'
        },
		{
            element: '#step2',
            intro: "<b>Add a New Row</b> to the form, right-click the form inputs and edit properties there after",
            position: 'right'
        },
		{
            element: '#step3',
            intro: 'After the design you can <b>Save</b> your work to continue working later',
            position: 'right'
        },
        {
            element: '#step4',
            intro: "You can <b>Load</b> a previously saved Form (JSON file) and continue working from there, or else upload a project",
            position: 'right'
        },
        {
            element: '#step5',
            intro: "The Script of the project can also be changed",
            position: 'right'
        }
        ],
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc:true,
        nextLabel: '<strong style="color:green">NEXT</strong>',
        prevLabel: '<span>Previous</span>',
        skipLabel: 'End Tour',
        doneLabel: '<strong style="color:green">Got it!!</strong>'
    };

    $scope.ShouldAutoStart = false;

	
}])//END OF NavCtrl