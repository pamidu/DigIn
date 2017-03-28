/*!
* Tabular: v0.0.1
* Authour: Gevindu
*/

'use strict';

var TabularModule = angular.module('Tabular',['DiginServiceLibrary']);


TabularModule.directive('tabular',['$rootScope','notifications','generateTabular', function($rootScope,notifications,generateTabular) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Tabular/tabular.html',
         scope: {
           whatIfObj: '='
          },
         link: function(scope,element){

         } //end of link
    };
}]);

TabularModule.directive('tabularSettings',['$rootScope','notifications','generateTabular', function($rootScope,notifications,generateTabular) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Tabular/tabularSettings.html',
         scope: {
			tabularSettings: '=',
			submitForm: '&'
          },
         link: function(scope,element){
			console.log(scope.tabularSettings);
			
			scope.submit = function()
			{
				if(scope.tabularSettingsForm.$valid)
				{
					console.log(scope.tabularSettings);
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

TabularModule.factory('generateTabular', ['$rootScope','notifications', function($rootScope,notifications) {
    

    return {
		doSomething : function(param) {
			return true;
        },tabularValidations: function(settings){
			var isChartConditionsOk = false;

			if(settings.actual && settings.target)
			{
				isChartConditionsOk = true;
			}else{
				notifications.toast(2,"Please select actual and target values");
			}

			return true;
		
		}
	}
}]);//END OF generateTabular

TabularModule.run(['cellEditorFactory',function(cellEditorFactory) {
// create cell editor
  cellEditorFactory['boolean'] = {
    // cell key event handler
    cellKey:function(event, options, td, cellCursor){
      if(event.type=='keydown'){
        switch(event.which){
        case 13:
        case 32:
          event.stopPropagation();
          options.setValue(!options.getValue());
          return true;
        }
      }
    },
    // editor open handler
    open:function(options, td, finish, cellEditor){
      options.setValue(!options.getValue());
      finish();
	}
  }
}]);
