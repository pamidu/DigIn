DiginServiceLibraryModule.factory('UserServices', ['$rootScope','$http', 'notifications', 'Digin_Engine_API', 'Digin_Domain','auth_Path','Upload', function($rootScope,$http,notifications, Digin_Engine_API, Digin_Domain,auth_Path,Upload) {
	var cache = {};
	return {
        getTenants: function(callback) {
			if(cache.tenants)
			{
				callback(cache.tenants);
			}else{
				 //return the promise directly.
				 return $http.get(auth_Path + "/tenant/GetTenants/" + $rootScope.authObject.SecurityToken)
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
        }, updateProfile: function(ev,userObj) {
				notifications.startLoading(ev,"Updating Profile, Please wait..");
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
			 return $http.get(auth_Path +'ChangePassword/'+ encodeURIComponent(oldPassword) + '/' + encodeURIComponent(newPassword))
			   .then(function(result) {
					//return result.data;
					
					return result.data;
					
				},function errorCallback(response) {
					notifications.toast(0, "Falied to retrieve user infomation");
				});	
		}, getUsageSummary: function() {
				return $http.get(Digin_Engine_API + "get_usage_summary?SecurityToken=" + $rootScope.authObject.SecurityToken)
				   .then(function(result) {
						return result.data;
						
					},function errorCallback(response) {
						notifications.toast(0, "Falied to retrieve Usage Summary");
					});	
        }, getUsageDetails: function(fromDate, toDate) {
				return $http.get(Digin_Engine_API + "get_usage_details?SecurityToken=" + $rootScope.authObject.SecurityToken + "&start_date=%27" + fromDate + "%27&end_date=%27" + toDate + "%27")
				   .then(function(result) {
						return result.data;
						
					},function errorCallback(response) {
						notifications.toast(0, "Falied to retrieve Usage Summary");
					});	
        }, base64ToBlob : function(base64Data, contentType){
			
			contentType = contentType || '';
			var sliceSize = 1024;
			var byteCharacters = atob(base64Data);
			var bytesLength = byteCharacters.length;
			var slicesCount = Math.ceil(bytesLength / sliceSize);
			var byteArrays = new Array(slicesCount);

			for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
				var begin = sliceIndex * sliceSize;
				var end = Math.min(begin + sliceSize, bytesLength);

				var bytes = new Array(end - begin);
				for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
					bytes[i] = byteCharacters[offset].charCodeAt(0);
				}
				byteArrays[sliceIndex] = new Uint8Array(bytes);
			}
			return new Blob(byteArrays, {
				type: contentType
			});
			
		}, uploadPicture: function(file, type) {
				return Upload.upload({
						url: Digin_Engine_API + 'file_upload',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						data: {
							db: 'BigQuery',
							SecurityToken: $rootScope.authObject.SecurityToken,
							Domain: Digin_Domain,
							other_data: type,
							file: file
						}
					}).success(function(data) {
						return data;
					})
        }
		//$http.get(Digin_Engine_API + "get_usage_summary?SecurityToken=" + getCookie('securityToken'))
		
   }
}]);//END OF DiginServices