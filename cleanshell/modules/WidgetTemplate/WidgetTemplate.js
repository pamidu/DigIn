/*!
* DiginHighCharts: v0.0.1
* Authour: Dilshan
*/

'use strict';

var WhatIfModule = angular.module('WidgetTemplate',['DiginServiceLibrary']);


WhatIfModule.directive('widgetTemplate',['$rootScope','notifications','generateWidgetTemplate', function($rootScope,notifications,generateWidgetTemplate) {
	return {
         restrict: 'E',
         templateUrl: 'modules/WidgetTemplate/widgetTemplate.html',
         scope: {
           whatIfObj: '='
          },
         link: function(scope,element){

         } //end of link
    };
}]);

WhatIfModule.directive('widgetTemplateSettings',['$rootScope','notifications','generateWidgetTemplate', function($rootScope,notifications,generateWidgetTemplate) {
	return {
         restrict: 'E',
         templateUrl: 'modules/WidgetTemplate/widgetTemplateSettings.html',
         scope: {
           settings: '='
          },
         link: function(scope,element){
			console.log(scope.settings);
         } //end of link
    };
}]);

WhatIfModule.factory('generateWidgetTemplate', ['$rootScope','notifications', function($rootScope,notifications) {
    

    return {
		doSomething : function(param) {
			return true;
        }
	}
}]);//END OF generateWhatIf
