/*!
* Boxplot: v0.0.1
* Authour: Dilshan
*/

'use strict';

var WhatIfModule = angular.module('Boxplot',['DiginServiceLibrary']);


WhatIfModule.directive('boxplot',['$rootScope','notifications','generateBoxplot', function($rootScope,notifications,generateBoxplot) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Boxplot/boxplot.html',
         scope: {
           whatIfObj: '='
          },
         link: function(scope,element){

         } //end of link
    };
}]);

WhatIfModule.directive('boxplotSettings',['$rootScope','notifications','generateBoxplot', function($rootScope,notifications,generateBoxplot) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Boxplot/boxplotSettings.html',
         scope: {
			boxplotSettings: '=',
			submitForm: '&'
          },
         link: function(scope,element){
			 
			console.log(scope.boxplotSettings);
			scope.submit = function()
			{
				if(scope.boxplotSettingsForm.$valid)
				{
					console.log(scope.boxplotSettings);
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

WhatIfModule.factory('generateBoxplot', ['$rootScope','notifications', function($rootScope,notifications) {
    

    return {
		generate : function(param) {
			return true;
        },boxplotValidations: function(){
			
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
}]);//END OF generateBoxplot
