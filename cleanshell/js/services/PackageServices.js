DiginApp.factory('PackageServices', ['$rootScope','$http', '$auth', 'notifications', 'Digin_Engine_API', 'Digin_Domain','auth_Path', function($rootScope,$http, $auth,notifications, Digin_Engine_API, Digin_Domain,auth_Path) {
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
        }, getTenants: function(callback) {
			if(cache.tenants)
			{
				callback(cache.tenants);
			}else{
				 //return the promise directly.
				 return $http.get(auth_Path + "/tenant/GetTenants/" + $auth.getSecurityToken())
				   .then(function(result) {
						cache.tenants = result.data;
						callback(cache.tenants);
					},function errorCallback(response) {
						console.log(response);
						notifications.toast(0, "Falied to load tenants");
				 });	
			}
        }, inviteUser: function(userEmail) {
			 notifications.startLoading("Inviting user, Please wait..");
             //return the promise directly.
             return $http.get(auth_Path + '/tenant/AddUser/' + userEmail + '/user', {
					headers: {'Securitytoken': $rootScope.authObject.SecurityToken}
				})
			   .then(function(result) {
					//return result.data;
					notifications.toast(1, "User Invited");
					notifications.finishLoading();
				},function errorCallback(response) {
					console.log(response);
					notifications.toast(0, "Falied to load tenants");
					notifications.finishLoading();
			 });	
        }, getInvitedUsers: function(callback) {
				if(cache.invitedUsers)
				{
					callback(cache.invitedUsers);
				}else{
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
							cache.invitedUsers = result;
							callback(cache.invitedUsers)
							
						},function errorCallback(response) {
							notifications.toast(0, "Falied to invite user");
					 });	
				}
		
		   }, getAllGroups: function(callback) {
				if(cache.allGroups)
				{
					callback(cache.allGroups);
				}else{
					 //return the promise directly.
					 return $http.get('/apis/usercommon/getAllGroups')
					   .then(function(result) {
							//return result.data;
							cache.allGroups = result.data;
							callback(cache.allGroups)
							
						},function errorCallback(response) {
							notifications.toast(0, "Falied to invite user");
					 });	
				}
		
		   }, addUserGroup: function(userGroup) {
				//notifications.startLoading("Adding User Group, Please wait..");
				var req = {
					method: "POST",
					url: "/apis/usercommon/addUserGroup",
					headers: {
						"Content-Type": "application/json"
						//"SecurityKey" : $auth.getSecurityToken()
					},
					data: userGroup
				}
				 return $http(req)
					.then(function(result){
						//notifications.finishLoading();
						console.log(result);
						return result.data;
						
						
					},function errorCallback(response) {
						notifications.toast(0, "Falied to add group");
						notifications.finishLoading();
				});	
		
		},removeUserGroup: function(groupId) {
			 return $http.get('/apis/usercommon/removeUserGroup/'+groupId) //jsons/everything.json
			   .then(function(result) {
					//resolve the promise as the data
					return result.data.Result;
				},function errorCallback(response) {
						console.log(response);
						notifications.toast(0, "Falied to Remove User");
				 });
        },getProfile: function(callback) {
				if(cache.profile)
				{
					callback(cache.profile);
				}else{
					 //return the promise directly.
					 return $http.get('/apis/profile/userprofile/'+$rootScope.authObject.Email)
					   .then(function(result) {
							//return result.data;
							cache.profile = result.data;
							callback(cache.profile);
							
						},function errorCallback(response) {
							console.log(response);
							notifications.toast(0, "Falied to retrieve user infomation");
					});	
				}
        }, updateProfile: function(userObj) {
				notifications.startLoading("Updating Profile, Please wait..");
				var req = {
					method: "POST",
					url: "/apis/profile/userprofile",
					headers: {
						"Content-Type": "application/json"
						//"SecurityKey" : $auth.getSecurityToken()
					},
					data: userObj
				}
				 return $http(req)
						.then(function(result){
							notifications.finishLoading();
							cache.profile = angular.copy(userObj);
							return result.data;
							
						},function errorCallback(response) {
							notifications.toast(0, "Falied to retrieve user infomation");
							notifications.finishLoading();
				});	
        }, changePassword: function(oldPassword, newPassword) {
					 //return the promise directly.
					 return $http.get(auth_Path +'/ChangePassword/'+ encodeURIComponent(oldPassword) + '/' + encodeURIComponent(newPassword))
					   .then(function(result) {
							//return result.data;
							
							return result.data;
							
						},function errorCallback(response) {
							notifications.toast(0, "Falied to retrieve user infomation");
			});	
        }
		
   }
}]);//END OF DiginServices