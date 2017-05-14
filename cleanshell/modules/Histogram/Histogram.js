/*!
* Histogram: v0.0.1
* Authour: Dilshan
*/

'use strict';

var HistogramModule = angular.module('Histogram',['DiginServiceLibrary']);


HistogramModule.directive('histogram',['$rootScope','notifications','generateHistogram', function($rootScope,notifications,generateHistogram) {
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

HistogramModule.directive('histogramSettings',['$rootScope','notifications','generateHistogram', function($rootScope,notifications,generateHistogram) {
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

HistogramModule.factory('generateHistogram', ['$rootScope','notifications','Digin_Engine_API','$http', function($rootScope,notifications,Digin_Engine_API,$http) {
    

    return {
    	generate: function(selectedDB, datasource_name, datasource_id, selectedMeasure, callback) {
			
			console.log(selectedMeasure);
			if (selectedDB == "MSSQL") {
                    selectedMeasure = "'[" + selectedMeasure + "]'";
            } else {
                    selectedMeasure = "'" + selectedMeasure + "'";
            }

            //start of forming url
			var histogramURL = "";
            histogramURL = Digin_Engine_API+"generatehist?q=[{'"+datasource_name+"':["+selectedMeasure+"]}]&dbtype="+selectedDB+"&bins=&datasource_config_id="+datasource_id+"&datasource_id="+datasource_id+"&SecurityToken="+$rootScope.authObject.SecurityToken;
            console.log(histogramURL);

			//end of forming url
			
			$http.get(histogramURL)
			   .then(function(result) {
					callback(result.data);
				},function errorCallback(response) {
					console.log(response);
				});//end of $http
			
		
        },histogramValidations: function(selectedMeasures){
			
			var isValid = true;
            if(selectedMeasures.length == 0 || selectedMeasures.length > 1) {
                notifications.toast(2, "Please select one measure in order to generate Histogram widget.");
                isValid = false;
            }

			return isValid;
		}//end of highchartValidations
	}
}]);//END OF generateWhatIf
