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
	console.log(parent.themeInfo);
	$rootScope.lightOrDark = '';
	$rootScope.currentColor = '';
	$rootScope.h1color = '';
	colorManager.changeTheme(parent.themeInfo);
	
	$scope.submit = function()
	{
		parent.firefunction();
	}
	
	$scope.openDialog = function(ev)
	{
		$mdDialog.show({
		  controller: DialogController,
		  templateUrl: 'partials/abc.html',
		  parent: angular.element(parent.document.body),
		  targetEvent: ev,
		  clickOutsideToClose:true,
		  fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
		})
		.then(function(answer) {
		  $scope.status = 'You said the information was "' + answer + '".';
		}, function() {
		  $scope.status = 'You cancelled the dialog.';
		});
	}
	
	function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }
		
	
}])//END OF HomeCtrl









