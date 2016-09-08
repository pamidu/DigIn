 DiginApp.factory('DiginServices', ['$rootScope','$http', '$v6urls', '$auth', 'notifications', function($rootScope,$http, $v6urls, $auth,notifications) {
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
        }, getTenants: function() {
             //return the promise directly.
             return $http.get($v6urls.auth + "/tenant/GetTenants/" + $auth.getSecurityToken())
			   .then(function(result) {
					return result.data;
				},function errorCallback(response) {
						console.log(response);
						notifications.toast(0, "Falied to load tenants");
			 });	
        }, inviteUser: function(userEmail) {
			 notifications.startLoading("Inviting user, Please wait..");
             //return the promise directly.
             return $http.get($v6urls.auth + '/tenant/AddUser/' + userEmail + '/user', {
					headers: {'Securitytoken': $rootScope.authObject.SecurityToken}
				})
			   .then(function(result) {
					//return result.data;

					console.log(result);
					notifications.finishLoading();
				},function errorCallback(response) {
					console.log(response);
					notifications.toast(0, "Falied to load tenants");
					notifications.finishLoading();
			 });	
        }, getInvitedUsers: function() {
             //return the promise directly.
             return $http.get('/apis/usercommon/getSharableObjects')
			   .then(function(result) {
					//return result.data;
					 for (var i = 0, len = result.data.length; i<len; ++i) {
						if (result.data[i].Type == "User") {
							$rootScope.sharableUsers.push(result.data[i]);
						}else if (result.data[i].Type == "Group") {
							$rootScope.sharableGroups.push(result.data[i]);
						}
					}
					console.log(result);
					
				},function errorCallback(response) {
					notifications.toast(0, "Falied to invite user");
			 });	
        }
		
   }
}]);//END OF DiginServices