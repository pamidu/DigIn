/*!
* DiginHighCharts: v0.0.1
* Authour: Dilshan Liyanage
*/

'use strict';

var DiginHighChartsModule = angular.module('DiginHighMaps',['DiginServiceLibrary']);

DiginHighChartsModule.directive('diginHighMap', function() {
  return {
	restrict: 'E',
	templateUrl: 'modules/DiginHighMaps/highMapsWidget.html',
	link: function(scope,element){

	} //end of link
  };
});

DiginHighChartsModule.factory('generateHighMap', ['$rootScope','DiginServicesM', function($rootScope,DiginServicesM) {
	return {
		generate: function(number) {
			 return DiginServicesM.addOne(number);
		}
		
   }
}]);//END OF DiginServices