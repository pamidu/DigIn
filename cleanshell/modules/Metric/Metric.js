/*!
* DiginHighCharts: v0.0.1
* Authour: Dilshan
*/

'use strict';

var WhatIfModule = angular.module('Metric',['DiginServiceLibrary']);


WhatIfModule.directive('metric',['$rootScope','notifications','generateMetric', function($rootScope,notifications,generateMetric) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Metric/Metric.html',
         scope: {
           whatIfObj: '='
          },
         link: function(scope,element){

         } //end of link
    };
}]);

WhatIfModule.directive('metricSettings',['$rootScope','notifications','generateMetric', function($rootScope,notifications,generateMetric) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Metric/MetricSettings.html',
         scope: {
			metricSettings: '=',
			submitForm: '&'
          },
         link: function(scope,element){
			console.log(scope.metricSettings);
			
			scope.submit = function()
			{
				if(scope.metricSettingsForm.$valid)
				{
					console.log(scope.mapSettings);
					scope.submitForm();
				}else{
					console.log("invalid");
				}
			}
			
			scope.restoreSettings = function()
			{
				scope.submitForm();
			}
         } //end of link
    };
}]);

WhatIfModule.factory('generateMetric', ['$rootScope','notifications', function($rootScope,notifications) {
    

    return {
		doSomething : function(param) {
			return true;
        },metricValidations: function(settings){
			var isChartConditionsOk = false;

			if(settings.actual && settings.target)
			{
				isChartConditionsOk = true;
			}else{
				notifications.toast(2,"Please select actual and target values");
			}

			return isChartConditionsOk;
		
		}
	}
}]);//END OF generateWhatIf
