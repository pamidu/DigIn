var DiginApp = angular.module('mainApp', ['ngMaterial', 'ngAnimate', 'ui.router', 'directivelibrary','md-steppers','ngMessages' ,'uiMicrokernel', 'gridster','highcharts-ng','uiGmapgoogle-maps', 'vAccordion','ngCroppie','stripe-payment-tools','angular-intro']);

DiginApp.config(['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider','$mdThemingProvider', function($stateProvider, $urlRouterProvider, GoogleMapApi,$mdThemingProvider) {

	$urlRouterProvider.otherwise('/home');

	$stateProvider
	
	// HOME STATES AND NESTED VIEWS ========================================
   
	 .state('home', {
		url: '/home',
		templateUrl: 'views/home/home.html'
	})
	
	.state('profile', {
		url: '/profile',
		templateUrl: 'views/settings/profile/profile.html',
		controller: 'profileCtrl'
	})
	
	.state('createNewUser', {
		url: '/createNewUser',
		templateUrl: 'views/settings/createNewUser/createNewUser.html',
		controller: 'createNewUserCtrl'
	})
	
	.state('shareDashboard', {
		url: '/shareDashboard',
		templateUrl: 'views/settings/shareDashboard/shareDashboard.html',
		controller: 'shareDashboardCtrl'
	})
	
	.state('userSettings', {
		url: '/userSettings',
		templateUrl: 'views/settings/userSettings/userSettings.html',
		controller: 'userSettingsCtrl'
	})
	.state('theme', {
		url: '/theme',
		templateUrl: 'views/settings/theme/theme.html',
		controller: 'themeCtrl'
	})
	
	.state('myAccount', {
		url: '/myAccount',
		templateUrl: 'views/settings/myAccount/myAccount.html',
		controller: 'myAccountCtrl',
		controllerAs: 'vm',
		 params: {
			'pageNo': '0'
		  }
	})
	
	.state('addaLaCarte', {
		url: '/addaLaCarte',
		templateUrl: 'views/settings/myAccount/addaLaCarte.html',
		controller: 'addaLaCarteCtrl',
		controllerAs: 'vm'
	})
	
	.state('userAdministrator', {
		url: '/userAdministrator',
		templateUrl: 'views/settings/userAdministrator/userAdministrator.html',
		controller: 'userAdministratorCtrl',
		controllerAs: 'vm'
	})
	
	.state('accountSettings', {
		url: '/accountSettings',
		templateUrl: 'views/settings/accountSettings/accountSettings.html',
		controller: 'accountSettingsCtrl'
	})
	
	.state('groups', {
		url: '/groups',
		templateUrl: 'views/settings/groups/groups.html',
		controller: 'groupsCtrl'
	})
	
	.state('userSettngs', {
		url: '/userSettngs',
		templateUrl: 'views/settings/userSettngs.html'
	})
	.state('dashboard', {
		url: '/dashboard',
		templateUrl: 'views/dashboard/dashboard.html',
		controller: 'dashboardCtrl'
	})
	.state('visualize_data', {
		url: '/visualize_data',
		templateUrl: 'views/data_source/visualize_data/visualize_data.html',
		controller: 'visualize_dataCtrl',
		controllerAs: 'vm'
	})
	.state('upload_source', {
		url: '/upload_source',
		templateUrl: 'views/data_source/upload_source/upload_source.html'
	})
	
	.state('systemSettings', {
		url: '/systemSettings',
		templateUrl: 'views/settings/systemSettings/systemSettings.html',
		controller: 'systemSettingsCtrl',
		controllerAs: 'vm'
	})


  GoogleMapApi.configure({
	key: 'AIzaSyANY96AhQijBZgSXQ6RWkYUlO5fxCh6OMU',
    // v: '3.20',
    libraries: 'weather,geometry,visualization'
  });


}])