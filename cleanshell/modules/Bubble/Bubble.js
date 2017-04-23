/*!
* Bubble Chart: v0.0.1
* Authour: Dilshan
*/

'use strict';

var WhatIfModule = angular.module('Bubble',['DiginServiceLibrary']);


WhatIfModule.directive('bubble',['$rootScope','notifications','generateBubble', function($rootScope,notifications,generateBubble) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Bubble/bubble.html',
         scope: {
           bubbleObj: '='
          },
         link: function(scope,element){

         } //end of link
    };
}]);

WhatIfModule.directive('bubbleSettings',['$rootScope','notifications','generateBubble', function($rootScope,notifications,generateBubble) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Bubble/bubbleSettings.html',
         scope: {
			bubbleSettings: '=',
			submitForm: '&'
          },
         link: function(scope,element){
			 
			console.log(scope.bubbleSettings);
			scope.submit = function()
			{
				if(scope.bubbleSettingsForm.$valid)
				{
					console.log(scope.bubbleSettings);
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

WhatIfModule.factory('generateBubble', ['$rootScope','notifications', function($rootScope,notifications) {
    

    return {
		generate : function(param) {
			return true;
        },bubbleValidations: function(){
			
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
