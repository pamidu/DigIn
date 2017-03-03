DiginApp.factory('DiginServices', ['$rootScope','$http', '$auth', 'notifications', 'Digin_Engine_API', 'Digin_Domain','auth_Path', function($rootScope,$http, $auth,notifications, Digin_Engine_API, Digin_Domain,auth_Path) {
	var cache = {};
	return {
        getUserSettings: function() {
             //return the promise directly.
             return $http.get(Digin_Engine_API+'get_user_settings?SecurityToken='+$auth.getSecurityToken()+'&Domain='+Digin_Domain)
                       .then(function(result) {
                            //resolve the promise as the data
                            return result.data.Result;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get User Settings");
						 });
        },postUserSettings: function(userSettings) {
        	notifications.startLoading(null, "Saving Settings...");
        	console.log(userSettings);

			var req = {
				method: 'POST',
				url: Digin_Engine_API + 'store_user_settings/',
				headers: {
                    'Content-Type': 'application/json',
					'Securitytoken' : $auth.getSecurityToken()
				},
				data: angular.toJson(userSettings)
			}
			return $http(req).then(function(result){
				notifications.finishLoading();
				return result.data;
			}, function(error){
				notifications.toast(0, "Failed to save Settings");
				notifications.finishLoading();
			});

		},getSession: function() {
             //return the promise directly.
             return $http.get(auth_Path+'GetSession/' + getCookie('securityToken') + '/Nil')
                       .then(function(result) {
                            //resolve the promise as the data
                            return result.data;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Session");
						 });
        },getTenant: function() {
             //return the promise directly.
             return $http.get('/auth/tenant/GetTenant/' + window.location.hostname)
                       .then(function(result) {
                            //resolve the promise as the data
                            return result.data;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get User Settings");
						 });
        },getDiginComponents: function() {
             //return the promise directly.
             return $http.get(Digin_Engine_API+'get_all_components?SecurityToken='+$auth.getSecurityToken()+'&Domain='+Digin_Domain) //jsons/everything.json
                       .then(function(result) {
                            //resolve the promise as the data
                            return result.data.Result;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Digin Components");
						 });
        }, getComponent: function(ev, dashboardId) {
             //return the promise directly.
			 notifications.startLoading(ev, "Getting Dashboard");
			 
                return $http.get(Digin_Engine_API+'get_component_by_comp_id?comp_id='+dashboardId+'&SecurityToken='+$auth.getSecurityToken()+'&Domain'+Digin_Domain)
                       .then(function(result) {
                            //resolve the promise as the data
							notifications.finishLoading();
							return result.data.Result;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Dashboard or report");
								notifications.finishLoading();
						 });
        }, deleteComponent: function(ev,dashboardId, permanent) {
			notifications.startLoading(ev, "Deleting Dashboard...");
			var reqParam = [{
                "comp_id": dashboardId.toString(),
                "permanent_delete": permanent
            }];
			
			var req = {
				 method: 'DELETE',
				 url: Digin_Engine_API + 'delete_components/',
				 headers: {
					'Securitytoken' : $auth.getSecurityToken()
				 },
				 data: angular.toJson(reqParam)
			}
			return $http(req).then(function(result){
					notifications.finishLoading();
					return result.data;
				}, function(error){
					notifications.toast(0, "Failed to delete dashboard");
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