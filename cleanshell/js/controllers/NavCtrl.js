DiginApp.controller('NavCtrl', ['$scope','$rootScope', '$state', '$mdDialog', '$mdMedia','$mdSidenav', '$window','$auth' ,'layoutManager', 'notifications', 'DiginServices','$helpers','colorManager', '$timeout', '$mdSelect','$mdMenu',function ($scope,$rootScope , $state,$mdDialog, $mdMedia,$mdSidenav, $window,$auth ,layoutManager,notifications,DiginServices,$helpers,colorManager,$timeout,$mdSelect,$mdMenu) {

	$auth.checkSession();
	$rootScope.authObject = JSON.parse(decodeURIComponent($helpers.getCookie('authData')));
	$rootScope.sharableUsers = [];
	$rootScope.sharableGroups = [];
	
	$scope.currentView = "Home";
	
	//Theming
	$rootScope.lightOrDark = '';
	$rootScope.currentColor = '';
	$rootScope.h1color = '';
	colorManager.changeTheme('defaultDark');
	
	$scope.share = function(index, type)
	{
		$timeout(function(){
			$mdMenu.hide();
		},200);
		
	}
	
	
	//Start of layoutManager
	$rootScope.showHeader = true;
	$rootScope.showSideMenu = true;
	
	$scope.topMenuToggle = function()
	{	
		if($scope.showHeader == true)
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
		if(action == "Search"){
			$mdSidenav('searchBar').toggle();
		}else if(action == "Home")
		{
			$rootScope.showSideMenu = layoutManager.showSideMenu();
			location.href = '#/home';
			$scope.currentView = "Home"
			$rootScope.currentDashboard = {};
			/*var confirm = $mdDialog.confirm()
			  .title('')
			  .textContent('Are you sure you want to go home?')
			  .ariaLabel('Go Home')
			  .targetEvent(ev)
			  .ok('Please do it!')
			  .cancel('Cancel');
			$mdDialog.show(confirm).then(function() {
				location.href = '#/home';
			})*/
		}else if(action == "TV Mode")
		{
			//Start of Navigate TVMode
			if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
			   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
				if (document.documentElement.requestFullScreen) {  
				  document.documentElement.requestFullScreen();  
				} else if (document.documentElement.mozRequestFullScreen) {  
				  document.documentElement.mozRequestFullScreen();  
				} else if (document.documentElement.webkitRequestFullScreen) {  
				  document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
				}  
			  } else {  
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
			console.log("Clear Widgets");
		}else if(action == 'Save')
		{
			console.log("Save");
		}else if(action == 'Notifications')
		{
			$mdSidenav('notifications').toggle();
			//notifications.toast(1,"yes");
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
		}else if(action == "Invite User")
		{
			location.href = '#/inviteUser';
		}else if(action == "My Account")
		{
			console.log("My Account");
			location.href = '#/myAccount';
		}else if(action == "User Administrator")
		{
			location.href = '#/userAdministrator';
		}else if(action == "Help")
		{
			
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
		}else if(action == "New Page")
		{
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			
			 $mdDialog.show({
			  controller: 'addPageCtrl',
			  templateUrl: 'dialogs/addPage/addPage.html',
			  parent: angular.element(document.body),
			  clickOutsideToClose:true,
			  targetEvent: ev,
			  fullscreen: useFullScreen
			}).then(function(answer) {
				console.log(answer);
				location.href = '#/dashboard';
				
			});
			
			 $scope.$watch(function() {
			  return $mdMedia('xs') || $mdMedia('sm');
				}, function(wantsFullScreen) {
				  $scope.customFullscreen = (wantsFullScreen === true);
			});
		}else if(action == "RealTime")
		{
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			
			 $mdDialog.show({
			  controller: 'imInitCtrl',
			  templateUrl: 'views/widgets/custom/view_image/InitConfigimage.html',
			  parent: angular.element(document.body),
			  clickOutsideToClose:true,
			  targetEvent: ev,
			  fullscreen: useFullScreen
			}).then(function(answer) {
				console.log(answer);
				location.href = '#/dashboard';
				
			});
			
			 $scope.$watch(function() {
			  return $mdMedia('xs') || $mdMedia('sm');
				}, function(wantsFullScreen) {
				  $scope.customFullscreen = (wantsFullScreen === true);
			});

		}else if(action == "Visualize Data")
		{
			location.href = '#/visualize_data';
		}else if(action == "Upload Source")
		{
			location.href = '#/upload_source';
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
		}else if(action == "createNewUser")
		{
			location.href = '#/createNewUser';
		}else if(action == "shareDashboard")
		{
			location.href = '#/shareDashboard';
		}else if(action == "systemSettings")
		{
			console.log('systemSettings');
			location.href = '#/systemSettings';
		}else if(action == 'accountSettings')
		{
			location.href = '#/accountSettings';
		}else if(action == 'groups')
		{
			location.href = '#/groups';
		}else if(action == 'theme')
		{
			location.href = '#/theme';
		}
		
		
	}// End of Navigate
	
	$scope.getUserSettings = {};
	DiginServices.getUserSettings().then(function(data) {
		$scope.getUserSettings = data;
    });
	
	$scope.dashboards = [];
	$scope.reports = [];
	
	DiginServices.getDiginComponents().then(function(data) {
		console.log(data);
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
			console.log($rootScope.currentDashboard);
			$rootScope.currentDashboard = data;
			location.href = '#/dashboard';
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