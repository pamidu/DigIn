var DiginApp = angular.module('mainApp', ['ngMaterial', 'ngAnimate', 'ui.router', 'directivelibrary', 'ngMessages' ,'uiMicrokernel'])
	
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/welcome');

	$stateProvider
	
	// HOME STATES AND NESTED VIEWS ========================================
	
	.state('welcome', {
		url: '/welcome',
		templateUrl: 'partials/add.html',
		controller: 'AddCtrl'
	})
	
	.state('home', {
		url: '/home',
		templateUrl: 'partials/home.html',
		controller: 'HomeCtrl'
	})

}])

DiginApp.controller('AppCtrl', ['$scope', '$mdDialog', '$location', '$state', '$timeout', '$q','$http', 'uiInitilize', function ($scope, $mdDialog, $location, $state, $timeout, $q,$http, uiInitilize) {


}])//END OF AppCtrl

DiginApp.controller('AddCtrl',['$scope', '$mdDialog', '$window', 'notifications', function ($scope, $mdDialog, $window, notifications) {
	
	//console.log(window.parent.document.getElementById('themeStart').getAttribute("md-theme"));
	$scope.goToHome = function()
	{
		location.href="#/home"
	}
			
	
}])//END OF AddCtrl


DiginApp.controller('HomeCtrl',['$scope','$rootScope', '$mdDialog', '$window', 'notifications','colorManager', function ($scope,$rootScope, $mdDialog, $window, notifications,colorManager) {
	
	//console.log(window.parent.document.getElementById('themeStart').getAttribute("md-theme"));
	//console.log(parent.themeInfo);
	$rootScope.lightOrDark = '';
	$rootScope.currentColor = '';
	$rootScope.h1color = '';
	colorManager.changeTheme(parent.themeInfo);
	
	$scope.submit = function()
	{
		parent.firefunction();
	}
			
	
}])//END OF HomeCtrl







