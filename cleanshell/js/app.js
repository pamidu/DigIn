var DiginApp = angular.module('DuoDiginRt', 
	[
		'ngMaterial',
		'ngAnimate',
		'ui.router',
		'directivelibrary',
		'md-steppers',
		'ngMessages',
		'uiMicrokernel',
		'gridster',
		'highcharts-ng',
		'uiGmapgoogle-maps',
		'vAccordion',
		'ngCroppie',
		'stripe-payment-tools',
		'angular-intro',
		'ngFileUpload',
		'configuration',
		'diginServiceHandler',
		'rzModule',
		'pouchdb',
		'cellCursor'
	]
);

DiginApp.config(['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider','$mdThemingProvider','$locationProvider', function($stateProvider, $urlRouterProvider, GoogleMapApi,$mdThemingProvider,$locationProvider) {

	$urlRouterProvider.otherwise('/home');
	$locationProvider.hashPrefix('');
	
	$stateProvider
	
	// HOME STATES AND NESTED VIEWS ========================================
   
	 .state('home', {
		url: '/home',
		templateUrl: 'views/home/home.html',
		controller: 'homeCtrl'
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
		templateUrl: 'views/settings/myAccount/addaLaCarte/addaLaCarte.html',
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
		url: '/dashboard?id',
		templateUrl: 'views/dashboard/dashboard.html',
		controller: 'dashboardCtrl'
	})
	.state('visualize_data', {
		url: '/visualize_data',
		templateUrl: 'views/data_source/visualize_data/visualize_data.html',
		controller: 'user_assistanceCtrl',
		controllerAs: 'vm'
	})
	.state('upload_source', {
		url: '/upload_source',
		templateUrl: 'views/data_source/upload_source/upload_source.html',
		controller: 'user_assistanceCtrl'
	})
	.state('user_assistance', {
		url: '/user_assistance',
		templateUrl: 'views/user_assistance/user_assistance.html',
		controller: 'user_assistanceCtrl',
		controllerAs: 'vm'
	})
	
	.state('query_builder', {
		url: '/query_builder',
		templateUrl: 'views/query_builder/query_builder.html',
		controller: 'query_builderCtrl',
		 params: {
			'selectedAttributes': [],
			'selectedMeasures': [],
			'selectedFile': {},
			'selectedDB' : {}
		  }
	})
	
	.state('facebook', {
		url: '/facebook',
		templateUrl: 'views/social/facebook/facebook.html',
		controller: 'facebookCtrl'
	})
	
	.state('systemSettings', {
		url: '/systemSettings',
		templateUrl: 'views/settings/systemSettings/systemSettings.html',
		controller: 'systemSettingsCtrl',
		controllerAs: 'vm'
	})
	
	.state('sharedashboard', {
        url: '/sharedashboard',
        controller: 'sharedashboardgroupsCtrl',
        templateUrl: "views/settings/dashboardShare/sharedashboard.html"
    })
	
	.state('shareDataset', {
        url: '/shareDataset',
        controller: 'datasetShareCtrl',
        templateUrl: "views/settings/datasetShare/datasetShare.html"
    })
	
	.state('datasourceSettings',{
		url: '/datasourceSettings',
		controller: 'datasourceSettingsCtrl',
		templateUrl: "views/data_source/data_source_settings/datasourceSettings.html"
	})
	
	.state('developer',{
		url: '/developer',
		controller: 'developerCtrl',
		templateUrl: "views/developer/developer.html"
	})


  GoogleMapApi.configure({
	key: 'AIzaSyANY96AhQijBZgSXQ6RWkYUlO5fxCh6OMU',
    // v: '3.20',
    libraries: 'weather,geometry,visualization'
  });


}])

//Check if the Application has internet access or not
DiginApp.run(function($window, $rootScope) {
      $rootScope.online = navigator.onLine;
      $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
          $rootScope.online = false;
        });
      }, false);

      $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
          $rootScope.online = true;
        });
      }, false);
});