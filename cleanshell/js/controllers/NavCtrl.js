DiginApp.controller('NavCtrl', ['$scope','$rootScope', '$state', '$mdDialog', '$mdMedia','$mdSidenav','$auth' ,'layoutManager', 'notifications', 'DiginServices','$helpers','colorManager', '$timeout', '$mdSelect','$mdMenu','$window','pouchDB', 'IsLocal','dialogService',function ($scope,$rootScope , $state,$mdDialog, $mdMedia,$mdSidenav,$auth ,layoutManager,notifications,DiginServices,$helpers,colorManager,$timeout,$mdSelect,$mdMenu,$window,pouchDB,IsLocal,dialogService) {

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
	}
	
	
	//Start of layoutManager
	$rootScope.showHeader = true;
	$rootScope.showSideMenu = true;
	
	$scope.topMenuToggle = function()
	{	
		if($rootScope.showHeader === true)
		{
			$rootScope.showHeader = layoutManager.hideHeader();
		}else{
			$rootScope.showHeader = layoutManager.showHeader();
		}
	}
	
	$scope.leftMenuToggle = function()
	{
		if($scope.showSideMenu === true)
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
					if(answer === 'Yes')
					{
						alert("Changes saved");
					}else if(answer === 'No')
					{
						navigateTo(ev,action);
					}
				});
			}
		}else{
			navigateTo(ev,action);
		}
		
	}// End of Navigate
	
	function navigateTo(ev,action){
		if(action.charAt(0) == "#")
		{
			location.href = action;
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
		}
	}
	//End of Perform
	$scope.data = {};
	$scope.userSettings = {};
	$scope.myTenant = {};
    var oldDefaultDashboard = "";
	(function (){

		if(IsLocal === true){
			notifications.log("not", new Error());
			$rootScope.db  = new pouchDB("Dashboards");
			//$scope.getSearchPanelDetails();

            //Just for testing, User settings are not needed here
            DiginServices.getUserSettings().then(function(data) {
                //notifications.log(data, new Error());
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


                //$scope.userSettings.theme_config = $rootScope.theme;
            });
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
				$rootScope.db  = new pouchDB(pouchdbName);
			});
		}
	})();
	
	
	$scope.dashboards = [];
	$scope.reports = [];
	
	$scope.componentsLoaded = false;
	DiginServices.getDiginComponents().then(function(data) {
		notifications.log(data, new Error());
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
				notifications.log($scope.data.defaultDashboard, new Error());

                $scope.data.defaultDashboard = null;
                dialogService.confirmDialog(ev, "Set Default Dashboard","Are you sure you want to set '"+dashboard.compName+"' dashboard as Default?","yes", "cancel").then(function(result) {
                    if (result == 'yes') {
                        $scope.data.defaultDashboard = dashboard.compID;

                        var newComponent = {
                            "saveExplicit" : false,
                            "dashboardId"  : dashboard.compID
                        }

                        var userSettingsSaveObj = angular.copy($scope.userSettings);
                        userSettingsSaveObj.components = JSON.stringify(newComponent);

                        if(userSettingsSaveObj.dp_path===undefined) {dp_name="";}else{dp_name=userSettingsSaveObj.dp_path.split("/").pop();}
                        if(userSettingsSaveObj.logo_path===undefined){logo_name="";} else{logo_name=userSettingsSaveObj.logo_path.split("/").pop();}
                        userSettingsSaveObj.email = $rootScope.authObject.Email;
                        userSettingsSaveObj.logo_name = "logo";
                        userSettingsSaveObj.dp_name = "dp";
                        userSettingsSaveObj.theme_config = $rootScope.theme;
                        delete userSettingsSaveObj.modified_date_time;
                        delete userSettingsSaveObj.created_date_time;
                        delete userSettingsSaveObj.domain;
                        delete userSettingsSaveObj.logo_path;
                        delete userSettingsSaveObj.dp_path;

                        DiginServices.postUserSettings(userSettingsSaveObj).then(function(data) {
                           notifications.toast(1,"New default dashboard was saved");
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
		DiginServices.getComponent(ev, dashboardId).then(function(data) {
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
			{
				element: '#shareSocial',
				intro: 'Share your Dashboards on Social Media',
				position: 'right'
			},{
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