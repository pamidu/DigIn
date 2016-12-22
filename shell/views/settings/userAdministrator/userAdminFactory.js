routerApp.factory('userAdminFactory', ['$rootScope','$http', '$v6urls', '$auth', 'notifications','Digin_Engine_API','pouchDB','apis_Path','auth_Path', function($rootScope,$http, $v6urls, $auth,notifications,Digin_Engine_API,pouchDB,apis_Path,auth_Path) {
	var cache = {};
	
	return {
       inviteUser: function(userEmail) {
			 notifications.startLoading("Inviting user, Please wait..");
             //return the promise directly.
			 //http://testfirst1t.qa.duoworld.com/auth/tenant/AddUser/chamila@duosoftware.com/user
             return $http.get(auth_Path+'tenant/AddUser/' + userEmail + '/user', {
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
			$rootScope.sharableUsers=[];
			$rootScope.sharableGroups=[];
			$rootScope.users=[];
			
				//if(cache.invitedUsers)
				//{
				//	callback(cache.invitedUsers);
				//}else{
					 ////return the promise directly.
					 return $http.get(apis_Path+'usercommon/getSharableObjects')
					   .then(function(result) {
							////return result.data;
							var j=-1;
							 for (var i = 0, len = result.data.length; i<len; ++i) {
								if (result.data[i].Type == "User") {
									//$rootScope.sharableUsers.push(result.data[i]);
									$rootScope.users.push(result.data[i]);
									j++;	
									/*$http.get('/auth/GetUser/' + result.data[i].Id)
					                    .success(function (response) {
					                       result.data[i].Active= response.Active;
					                    }).error(function (error) {
					                   	   result.data[i].Active= false;
					                	});*/

					                	callback(result.data[i].Id,j);


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
				/*if(cache.allGroups)
				{
					callback(cache.allGroups);
				}else{*/
					 //return the promise directly.
					 return $http.get(apis_Path+'usercommon/getAllGroups')
					   .then(function(result) {
							//return result.data;
							cache = {};
							cache.allGroups = result.data;
							callback(cache.allGroups)
							
						},function errorCallback(response) {
							notifications.toast(0, "Falied to get all groups");
					 });	
				//}
		
		   }, addUserGroup: function(userGroup) {
				//notifications.startLoading("Adding User Group, Please wait..");
				var req = {
					method: "POST",
					url: apis_Path+"usercommon/addUserGroup",
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
		
		}, addUserToGroup: function(userGroup) {
				var req = {
					method: "POST",
					url: apis_Path+"usercommon/addUserToGroup",
					headers: {
						"Content-Type": "application/json"
					},
					data: userGroup
				}
				 return $http(req)
					.then(function(result){
						console.log(result);
						return result.data;						
						
					},function errorCallback(response) {
						notifications.toast(0, "Falied to add group");
						notifications.finishLoading();
				});	
		
		},removeUserGroup: function(groupId) {
			 return $http.get(apis_Path+'usercommon/removeUserGroup/'+groupId) //jsons/everything.json
			   .then(function(result) {
					//resolve the promise as the data
					return result.data.Result;
				},function errorCallback(response) {
						console.log(response);
						notifications.toast(0, "Falied to remove user");
				 });
        },removeUserFromGroup:function(group){
			var groupId=0;
			var users=[]
			groupId=group.groupId;
			users=group.users
			
			var UsrDtl = {
                "groupId": groupId,
                "users":users
				}
						
			var req = {
					method: "POST",
					url: apis_Path+"usercommon/removeUserFromGroup",
					headers: {
						"Content-Type": "application/json"
					},
					data: UsrDtl
				}
				 return $http(req)
					.then(function(result){
						console.log(result);
						return result.data;						
						
					},function errorCallback(response) {
						notifications.toast(0, "Falied");
						notifications.finishLoading();
				});
			
			
			 	
		},removeInvitedUser:function(email){
			
			//http://hxllnisqyomailinfo.staging.digin.io/auth/tenant/RemoveUser/juafbeblvexc@dropmail.me
			return $http.get(auth_Path+'tenant/RemoveUser/'+email)
			   .then(function(result) {
					//resolve the promise as the data
					if(result.Error==true){
						return result.Message;
					}
					else
					{}

				},function errorCallback(response) {
						console.log(response);
						notifications.toast(0, "Falied to remove user");
				});
		},getPackageDetail:function(){
			$rootScope.expiryDate=new Date();   //{{expiryDate|date:'mm-dd-yy'}}
			$rootScope.remainingDays=0;
		
			return $http.get(Digin_Engine_API + "get_packages?get_type=detail&SecurityToken=" + getCookie('securityToken'))
			.then (function(data) {
				if(data.data.Result.length>0){			
					for(i=0; i<data.data.Result.length; i++)
					{
						if(data.data.Result[i].package_name=="additional")
						{
							if(data.data.Result[i].package_attribute=='users'){
								$rootScope.onsiteUsers=data.data.Result[i].package_value_sum;
							}

						}
						else{
							$rootScope.expiryDate=data.data.Result[i].expiry_datetime;
							$rootScope.remainingDays=data.data.Result[i].remaining_days;
							return;
						}
					}
				}	
			},function errorCallback(error) {
				console.log(error);
			});	
		}
		
		/*getPackageDetail:function(){
			
					$rootScope.extraUsers=0;
					$rootScope.extraData=0;
					$rootScope.extraStorage=0;
					$rootScope.defaultUsers=0;
					$rootScope.defaultData=0;
					$rootScope.defaultStorage=0;
					$rootScope.expiryDate=new Date();   //{{expiryDate|date:'mm-dd-yy'}}
					$rootScope.remainingDays=0;
		
		
			return $http.get(Digin_Engine_API + "get_packages?get_type=detail&SecurityToken=" + getCookie('securityToken'))
			.then (function(data) {
				console.log(data.data.Result);
				$rootScope.PackageDetail=data.data.Result;
				if($rootScope.PackageDetail.length>0){			
					for(i=0; i<$rootScope.PackageDetail.length; i++)
					{
						if($rootScope.PackageDetail[i].package_name=="additional")
						{
							if($rootScope.PackageDetail[i].package_attribute=="users")	{
								$rootScope.extraUsers=$rootScope.PackageDetail[i].package_value_sum;
							}
							else if($rootScope.PackageDetail[i].package_attribute=="data"){
								$rootScope.extraData=$rootScope.PackageDetail[i].package_value_sum;
							}
							else if($rootScope.PackageDetail[i].package_attribute=="storage"){
								$rootScope.extraStorage=$rootScope.PackageDetail[i].package_value_sum;
							}	
						}
						else
						{
							if($rootScope.PackageDetail[i].package_attribute=="users"){	
								$rootScope.defaultUsers=$rootScope.PackageDetail[i].package_value_sum;
							}
							else if($rootScope.PackageDetail[i].package_attribute=="data"){
								$rootScope.defaultData=$rootScope.PackageDetail[i].package_value_sum;
							}
							else if($rootScope.PackageDetail[i].package_attribute=="storage"){
								$rootScope.defaultStorage=$rootScope.PackageDetail[i].package_value_sum;
							}
							
							$rootScope.expiryDate=$rootScope.PackageDetail[i].expiry_datetime;
							$rootScope.remainingDays=$rootScope.PackageDetail[i].remaining_days;
							$rootScope.packagePrice=$rootScope.PackageDetail[i].package_price_sum;
							$rootScope.packageName=$rootScope.PackageDetail[i].package_name;

						}
					}
				}	
			},function errorCallback(error) {
				console.log(error);
			});	
		}*/,getPackageSummary:function(){
					$rootScope.totUsers=0;
					$rootScope.totData=0;
					$rootScope.totStorage=0;
					
			return $http.get(Digin_Engine_API + "get_packages?get_type=summary&SecurityToken=" + getCookie('securityToken'))
			.then (function(data){	
				console.log(data.data.Result);
				$rootScope.PackageSummary=data.data.Result;
				if($rootScope.PackageSummary.length>0){
					for(i=0; i<$rootScope.PackageSummary.length; i++){
						if($rootScope.PackageSummary[i].package_attribute=="users"){
							$rootScope.totUsers=$rootScope.PackageSummary[i].package_value_sum;
						}
						else if($rootScope.PackageSummary[i].package_attribute=="data"){
							$rootScope.totData=$rootScope.PackageSummary[i].package_value_sum;
						}
						else if($rootScope.PackageSummary[i].package_attribute=="storage"){
							$rootScope.totStorage=$rootScope.PackageSummary[i].package_value_sum;
						}
					}
				}
			},function errorCallback(response) {
				console.log(response);
				notifications.toast(0, "Falied to remove user");
			});
			
		},getUserLevel: function() {
				var baseUrl = "http://" + window.location.hostname;
			   //$http.get('http://chamila103.prod.digin.io/auth/tenant/Autherized/chamila103.prod.digin.io',{
               //$http.get(baseUrl+'/auth/tenant/Autherized/' + JSON.parse(decodeURIComponent(getCookie('tenantData')))[0].TenantID, {
				//$http.get('/auth/tenant/Autherized/' + $rootScope.TenantID, {
				$http.get(auth_Path+'tenant/Autherized/' +  window.location.hostname, {	
					headers: {'Securitytoken': getCookie('securityToken')}
				})
			   .then(function(result) {
					$rootScope.userLevel=result.data.SecurityLevel;
				},function errorCallback(response) {
					$rootScope.userLevel="";
				});	
        }/*,getTenant: function(tenantId) {
             return $http.get('/auth/tenant/GetTenant/' + tenantId, {
					headers: {'Securitytoken': getCookie('securityToken')}
				})
			   .then(function(result) {
					$rootScope.company=result.data.OtherData.CompanyName;
				},function errorCallback(response) {
					
			 });	
        },getPackageDetail:function(SecurityToken){//#get package detail#//
			    $http.get('http://192.168.2.61:8080/packages?SecurityToken=62229efc0ec2029844a4a01184814b5b')
			    //$http.get('http://prod.digin.io:1929/packages?SecurityToken=62229efc0ec2029844a4a01184814b5b')
			    //$http.get(Digin_Engine_API + "packages?SecurityToken=" + getCookie('securityToken'))
		        .success(function(data) {
		            console.log(data.Result);
		            $rootScope.packageDetail=data.Result;
		        }).error(function() {
		            console.log("error");
		        });
		},getTenantUsers: function() {
               $http.get('/auth/tenant/GetUsers/' + JSON.parse(decodeURIComponent(getCookie('tenantData')))[0].TenantID, {
					headers: {'Securitytoken': getCookie('securityToken')}
				})
			   .then(function(result) {
					$rootScope.tenantUsers=result;
				},function errorCallback(response) {
					$rootScope.tenantUsers=[];
				});	
        }*/
		
		
   }
}]);//END OF DiginServices