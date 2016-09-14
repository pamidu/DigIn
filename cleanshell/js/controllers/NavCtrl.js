DiginApp.controller('NavCtrl', ['$scope','$rootScope', '$mdDialog', '$mdMedia','$mdSidenav', '$window','$auth' ,'layoutManager', 'notifications', 'DiginServices','$helpers',function ($scope,$rootScope ,$mdDialog, $mdMedia,$mdSidenav, $window,$auth ,layoutManager,notifications,DiginServices,$helpers) {

	$auth.checkSession();
	$rootScope.authObject = JSON.parse(decodeURIComponent($helpers.getCookie('authData')));
	$rootScope.sharableUsers = [];
	$rootScope.sharableGroups = [];
	
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
		}else if(action == "Profile Settings")
		{
			location.href = '#/profile';
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
		}else if(action == "shareDashboard")
		{
			location.href = '#/shareDashboard';
		}else if(action == "userSettings")
		{
			location.href = '#/userSettings';
		}else if(action == 'accountSettings')
		{
			location.href = '#/accountSettings';
		}else if(action == 'groups')
		{
			location.href = '#/groups';
		}
		
		
		
	}// End of Navigate
	
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
	
	//close any dialog box
	$rootScope.cancel = function()
	{
		$mdDialog.cancel();
	}	

	
}])//END OF NavCtrl