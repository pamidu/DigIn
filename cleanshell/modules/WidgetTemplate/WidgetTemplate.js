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
           widgetTemplateObj: '='
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
			widgetTemplateSettings: '=',
			submitForm: '&'
          },
         link: function(scope,element){
			 
			console.log(scope.widgetTemplateSettings);
			scope.submit = function()
			{
				if(scope.widgetTemplateSettingsForm.$valid)
				{
					console.log(scope.widgetTemplateSettings);
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

WhatIfModule.factory('generateWidgetTemplate', ['$rootScope','notifications', function($rootScope,notifications) {
    

    return {
		generateWidgetTemplate : function(param) {
			return true;
        },widgetTemplateValidations: function(){
			
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
