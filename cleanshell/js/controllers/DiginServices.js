 DiginApp.factory('DiginServices', ['$http', 'notifications', function($http, notifications) {
   return {
        getDiginComponents: function() {
             //return the promise directly.
             return $http.get('jsons/everything.json')
                       .then(function(result) {
                            //resolve the promise as the data
                            return result.data.Result;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Digin Components");
						 });
        }, getComponent: function(dashboardId) {
             //return the promise directly.
			 //console.log(dashboardId);
			 notifications.startLoading("Getting Dashboard");
			 
             return $http.get('jsons/sampleDashboard4.json')
                       .then(function(result) {
                            //resolve the promise as the data
							notifications.finishLoading();
							return result.data.Result;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Dashboard or report");
								notifications.finishLoading();
						 });
        }, getWidgetTypes: function() {
             //return the promise directly.
		 
             return $http.get('jsons/widgetType.json')
                       .then(function(result) {
							return result.data.Result;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Widgets");
						 });
        }, getWidgets: function() {
             //return the promise directly.
			 
             return $http.get('jsons/widgets.json')
                       .then(function(result) {
							return result.data.Result;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Widgets");
						 });
        }, getRootObjectById: function(id,obj) {
             //return the promise directly.
			 for(i=0;i<obj.length;i++){
					if(obj[i].widgetID == id) return i;
				}		
        }
		
   }
}]);//END OF DiginServices