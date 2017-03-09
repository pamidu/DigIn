/*
* DiginHighCharts: v0.0.1
* Authour: Dilshan Liyanage
*/

'use strict';

var DiginServiceLibraryModule = angular.module('DiginServiceLibrary',[]);


DiginServiceLibraryModule.factory('DiginServicesM', ['$rootScope', function($rootScope) {
	var cache = {};
	return {
		addOne: function(number) {
			 return number + 1;
		}
		
   }
}]);//END OF DiginServices

