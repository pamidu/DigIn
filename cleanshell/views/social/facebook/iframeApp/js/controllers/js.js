angular
.module('mainApp', ['ngMaterial', 'ngAnimate', 'ui.router', 'directivelibrary', 'ngMessages' ,'uiMicrokernel'])
	
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

.controller('AppCtrl', ['$scope', '$mdDialog', '$location', '$state', '$timeout', '$q','$http', 'uiInitilize', function ($scope, $mdDialog, $location, $state, $timeout, $q,$http, uiInitilize) {


}])//END OF AppCtrl

.controller('AddCtrl',['$scope', '$mdDialog', '$window', 'notifications', function ($scope, $mdDialog, $window, notifications) {
	
	//console.log(window.parent.document.getElementById('themeStart').getAttribute("md-theme"));
	$scope.goToHome = function()
	{
		location.href="#/home"
	}
			
	
}])//END OF AddCtrl


.controller('HomeCtrl',['$scope', '$mdDialog', '$window', 'notifications', function ($scope, $mdDialog, $window, notifications) {
	
	//console.log(window.parent.document.getElementById('themeStart').getAttribute("md-theme"));
	console.log(parent.themeInfo);
	
	$scope.submit = function()
	{
		parent.firefunction();
	}
			
	
}])//END OF HomeCtrl







