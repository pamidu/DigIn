'use strict';

angular.module('DiginD3', [
  'ngRoute',
  'ngAnimate',
  'ngSanitize',
  'DiginD3.filters',
  'DiginD3.services',
  'DiginD3.directives',
  'DiginD3.controllers',
  'mgcrea.ngStrap',
  'ui',
  'ngMaterial',
  'colorpicker.module'
])

.config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/main.html', controller: 'DiginD3Ctrl'});
  $routeProvider.otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true);
}]);