/*!
* Histogram: v0.0.1
* Authour: Dilshan
*/

'use strict';

var WhatIfModule = angular.module('Histogram',['DiginServiceLibrary']);


WhatIfModule.directive('histogram',['$rootScope','notifications','generateHistogram', function($rootScope,notifications,generateHistogram) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Histogram/histogram.html',
         scope: {
           widgetTemplateObj: '='
          },
         link: function(scope,element){

         } //end of link
    };
}]);

WhatIfModule.directive('histogramSettings',['$rootScope','notifications','generateHistogram', function($rootScope,notifications,generateHistogram) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Histogram/histogramSettings.html',
         scope: {
			histogramSettings: '=',
			submitForm: '&'
          },
         link: function(scope,element){
			 
			console.log(scope.histogramSettings);
			scope.submit = function()
			{
				if(scope.histogramSettingsForm.$valid)
				{
					console.log(scope.histogramSettings);
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

WhatIfModule.factory('generateHistogram', ['$rootScope','notifications', function($rootScope,notifications) {
    

    return {
		generate : function(param) {
			return true;
        },histogramValidations: function(){
			
			var isChartConditionsOk = false;

			/*switch (highChartType) {
                case "pie":
						if(selectedSeries.length == 1 && selectedCategory.length > 0 )
							isChartConditionsOk = true;
						else
							notifications.toast(2,"Please check the requirements for generate a pie chart");
                  break;
	        }*/

			return isChartConditionsOk;
		}//end of highchartValidations
	}
}]);//END OF generateWhatIf
