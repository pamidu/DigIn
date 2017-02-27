angular
.module('mainApp', ['ngMaterial', 'ngAnimate', 'ui.router', 'ngMessages' ,'uiMicrokernel','vAccordion'])
	
	.config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

	$urlRouterProvider.otherwise('/add');
		$locationProvider.hashPrefix('');

	$stateProvider
	
	// HOME STATES AND NESTED VIEWS ========================================
	
	.state('add', {
		url: '/add',
		templateUrl: 'partials/add.html',
		controller: 'AddCtrl'
	})

}])


.controller('AppCtrl', ['$scope', '$mdDialog', '$location', '$state', '$timeout', '$q','$http', function ($scope, $mdDialog, $location, $state, $timeout, $q,$http) {



	
}])//END OF AppCtrl

.controller('AddCtrl',['$scope', '$mdDialog', '$window', function ($scope, $mdDialog, $window) {
	
	
}])//END OF AddCtrl





