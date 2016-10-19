routerApp.factory('userAdminFactory', ['$scope','$rootScope','$http', '$v6urls', '$auth', 'notifications','Digin_Engine_API ', function($scope,$rootScope,$http, $v6urls, $auth,notifications,Digin_Engine_API) {
	var cache = {};
	return {
       inviteUser: function(userEmail) {
			 notifications.startLoading("Inviting user, Please wait..");
             //return the promise directly.
			 //http://testfirst1t.qa.duoworld.com/auth/tenant/AddUser/chamila@duosoftware.com/user
             return $http.get('/auth/tenant/AddUser/' + userEmail + '/user', {
					headers: {'Securitytoken': JSON.parse(decodeURIComponent(getCookie('authData'))).SecurityToken}
				})
			   .then(function(result) {
					//return result.data;
					notifications.toast(1, "User Invited");
					notifications.finishLoading();
				},function errorCallback(response) {
					console.log(response);
					notifications.toast(0, "Falied to invite user");
					notifications.finishLoading();
			 });	
        }, getInvitedUsers: function(callback) {
				//if(cache.invitedUsers)
				//{
				//	callback(cache.invitedUsers);
				//}else{
					 ////return the promise directly.
					 return $http.get('/apis/usercommon/getSharableObjects')
					   .then(function(result) {
							////return result.data;
							 for (var i = 0, len = result.data.length; i<len; ++i) {
								if (result.data[i].Type == "User") {
									$rootScope.sharableUsers.push(result.data[i]);
								}else if (result.data[i].Type == "Group") {
									$rootScope.sharableGroups.push(result.data[i]);
								}
							}
							//cache.invitedUsers = result;
							//callback(cache.invitedUsers)
							
						},function errorCallback(response) {
							notifications.toast(0, "Falied to get users");
					 });	
				//}
		
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
							notifications.toast(0, "Falied to get all groups");
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
						notifications.toast(0, "Falied to remove user");
				 });
        },removeInvitedUser:function(email){
			
			//http://hxllnisqyomailinfo.staging.digin.io/auth/tenant/RemoveUser/juafbeblvexc@dropmail.me
			return $http.get('/auth/tenant/RemoveUser/'+email)
			   .then(function(result) {
					//resolve the promise as the data
					if(result.Error==true){
						return result.Message;
					}
					else
					{
						
					}

				},function errorCallback(response) {
						console.log(response);
						notifications.toast(0, "Falied to remove user");
				 });
		},getUsageDetail:function(){
			$http.get(Digin_Engine_API + "get_usage_summary?SecurityToken=" + getCookie('securityToken'))
	        .success(function(data) {
	            console.log(data.Result);
	            $rootScope.result = data.Result;
	            $scope.UserID = JSON.parse(decodeURIComponent(getCookie('authData'))).UserID;
	            $scope.domain = JSON.parse(decodeURIComponent(getCookie('authData'))).Domain;
	            $scope.emaildid = JSON.parse(decodeURIComponent(getCookie('authData'))).Username;
	            $rootScope.usageDetails = $scope.result.usage[0][$scope.domain][$scope.UserID];
	        }).error(function() {
	            console.log("error");
	        });
		}
		
   }
}]);//END OF DiginServices