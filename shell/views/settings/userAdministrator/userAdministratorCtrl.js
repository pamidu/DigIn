routerApp.controller('userAdministratorCtrl',[ '$scope','$rootScope','$mdDialog','userAdminFactory', 'notifications','paymentGateway','$http','$state','Digin_Domain','Digin_Tenant','auth_Path','apis_Path','onsite', function ($scope,$rootScope,$mdDialog,userAdminFactory,notifications,paymentGateway,$http,$state,Digin_Domain,Digin_Tenant,auth_Path,apis_Path,onsite){
	var vm = this;
	
	
	if(onsite){
        $scope.tabVisible=false;
    }
    else{
        $scope.tabVisible=true;
    }

	userAdminFactory.getUserLevel();
	$rootScope.totUsers=$rootScope.defaultUsers+$rootScope.extraUsers
	
	// fetch packagedetail
	/*var db = new PouchDB('packaging');
	/*db.get('packgedetail').then(function (doc_package) {
	  	  $rootScope.totUsers=doc_package.packageuser+doc_package.additionaluser;
	});*/
	

	
	//#Remove user- start------------------------
    //#common pre loader
    var displayProgress = function(message) {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>' + message + '</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
    };

	
  /*
    //#Customize existing package
    $scope.removeUserFromPackage = function() {
		$scope.usersRate = 5;
	
        var pkgObj = {
              "plan" :  {
							"features": [{"tag":"user","feature": "Additional users","amount": 5,"quantity":1,"action":"remove"}]
						}
					}

        $http({
            //url : "http://staging.digin.io/include/duoapi/paymentgateway/customizePackage",
            url: "/include/duoapi/paymentgateway/customizePackage",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: pkgObj
        }).then(function(response) {
            console.log(response)
            if (response.statusText == "OK") {
                if (response.data.status == true) {
                    //Success
					
					 $rootScope.totUsers=$rootScope.totUsers-1;
					 $scope.updatePackage(); //digin service
					 displaySuccess("User removed successfully."); 
					     
                    $mdDialog.hide();

                } else {
                    //fail
                    $mdDialog.hide();
                    notifications.toast("0", "Failed to remove user.");

                }
            } else {

            }
        }, function(response) {
            console.log(response)
            $mdDialog.hide();
            notifications.toast("0", "Error occured while customizing the package.");

        })
    }

	
    //#Update package in digin engine 
  $scope.updatePackage = function() { 

		  var pkgObj = [{
				"package_id":null,
				"package_name":"additional",
				"package_attribute": "users",
				"package_value":-1,
				"package_price":5,
				"is_default":false,
				"is_new": true
				}];
	
        $http({
            method: 'POST',
            url: Digin_Engine_API + 'activate_packages/',
            data: angular.toJson(pkgObj),
            headers: {
                'Content-Type': 'application/json',
                'SecurityToken': getCookie('securityToken')
            }
        })
        .success(function(response) {
            //notifications.toast("1", "AlaCartes added successfully.");
            
        }).error(function(data) {
            $mdDialog.hide();
        });
        $mdDialog.hide();
    }
    */
   
	//#-----remove user end---------------------------------------------------------
	
	
	//*Settings routing ---------------- 
    var slide = false;
    $scope.route = function (state) {
		  $state.go('home.welcomeSearch');
    };
	
	$scope.$parent.currentView = "User Administrator";
	
	
	//#Get number of tenant user
	//userAdminFactory.getTenantUsers();
	
	//userAdminFactory.getInvitedUsers(function(data) {});

	$scope.getStatus=function(email,j){
		$scope.chk = function (cb) {
			$http.get(auth_Path+'GetUser/' + email)
				.success(function (response) {
					$scope.aciveStatus=response.Active;
					 cb(true);
				}).error(function (error) {
					cb(false);
			});
		}
		
		$scope.chk(function(data){
			if(data){
				$rootScope.users[j].Active= $scope.aciveStatus;
				$rootScope.sharableUsers=$rootScope.users;
			}
		});
	}
	
	
	userAdminFactory.getInvitedUsers($scope.getStatus);

	
	//userAdminFactory.getPackageSummary();
	

	
	var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
	$scope.enterInviteUser = function(ev,searchText)
	{
		if($rootScope.userLevel=='user'){
           displayError('You are not permitted to do this operation, allowed only for administrator'); 
        }
		else{
			if(reg.test(searchText) == true)
			{		
				var exeed=checkUserLimit()   //*Check no of users belongs to package
				if(exeed == false)
				{
					var exist = checkIfExist(searchText)
					console.log(exist);
					if(exist == false)
					{
						userAdminFactory.inviteUser(searchText).then(function(response) {
							$rootScope.sharableUsers=[];
							//userAdminFactory.getInvitedUsers(function(data) {});
							userAdminFactory.getInvitedUsers($scope.getStatus);
							console.log(response);
							$scope.searchText = "";
						});
					}
				}	
				else{
					displayError('User limit for this package has been exceeded.');	
				}		
			}else{
				notifications.toast(0, 'Enter a valid email');
			}
		}
				
	}
	
	
	
	
	   //#common error message
    var displayError = function(message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Process fail !').textContent('' + message + '').ariaLabel('Fail to complete.').ok('OK'));
    };

    //#common success message
    var displaySuccess = function(message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Success !').textContent('' + message + '').ariaLabel('successfully completed.').ok('OK'));
    };
	
	
	function checkUserLimit(){
		var exeed = false;
		if($rootScope.sharableUsers.length < $rootScope.totUsers)
		{
			exeed = false;
		}else{
			exeed = true;	
		}
		return exeed;
	}
	
	
	function checkIfExist(email){
		var exist = false;
		if($rootScope.sharableUsers.length == 0)
		{
			exist = false;
		}else{
			for (i = 0, len = $rootScope.sharableUsers.length; i<len; ++i){
				if($rootScope.sharableUsers[i].Id == email)
				{
					exist = true;
					notifications.toast(0, 'This user is already invited');
				}
			}
		}
		
		return exist;
	}
	

	$scope.resetPassword = function(ev, user)
	{
		//if(user.Id==JSON.parse(decodeURIComponent(getCookie('authData'))).Username){
		//	return;
		//}
		

		if(onsite){
			if($rootScope.userLevel=='User'){
           		displayError('You are not permitted to do this operation, allowed only for administrator'); 
			   	return;
        	}
		}

		
		if($rootScope.userLevel=='user'){
           displayError('You are not permitted to do this operation, allowed only for system administrator'); 
		   return;
        }
		else{
			 var confirm = $mdDialog.confirm()
			  .title('Remove User')
			  .textContent('Are you sure you want to reset password for '+user.Id+'?')
			  .ariaLabel('Reset password')
			  .targetEvent(ev)
			  .ok('Please do it!')
			  .cancel('Cancel');
			$mdDialog.show(confirm).then(function() {

				$http({
	                method: 'GET',
					url: '/auth/ResetPasswordByTenantAdmin/'+user.Id,
	                headers: {
	                    'Securitytoken': getCookie('securityToken')
	                }
            	})
                .success(function(response){
                    console.log(response);
                    $mdDialog.hide();
                    displaySuccess(response);               
                }).error(function(error){  
                    $mdDialog.hide(); 
                    displayError(error.Message); 
                });    	
			});
		}				
	}

	$scope.removeUser = function(ev, user)
	{
		if(onsite){
			if(user.Id==JSON.parse(decodeURIComponent(getCookie('authData'))).Email){
				return;
			}

			if($rootScope.userLevel=='User'){
           		displayError('You are not permitted to do this operation, allowed only for administrator'); 
			   	return;
        	}
		}

		if(user.Id==JSON.parse(decodeURIComponent(getCookie('authData'))).Username){
			return;
		}
		
		
		if($rootScope.userLevel=='user'){
           displayError('You are not permitted to do this operation, allowed only for administrator'); 
		   return;
        }
		else{
			if($rootScope.sharableUsers.length==1){
					return;
				}
		
				 var confirm = $mdDialog.confirm()
				  .title('Remove User')
				  .textContent('Are you sure you want to remove this user?')
				  .ariaLabel('remove user')
				  .targetEvent(ev)
				  .ok('Please do it!')
				  .cancel('Cancel');
				$mdDialog.show(confirm).then(function() {
					//*send HTTP request and add the below call only if it succeeds
					
					userAdminFactory.removeInvitedUser(user.Id);

							$rootScope.sharableUsers=[];
							//userAdminFactory.getInvitedUsers(function(data) {});
							userAdminFactory.getInvitedUsers($scope.getStatus);
						
						displaySuccess("User removed successfully."); 
					
				});
		}				
	}

	$scope.changeStatus = function(ev, user)
	{

		if(onsite){
			if($rootScope.userLevel=='User'){
           		displayError('You are not permitted to do this operation, allowed only for administrator'); 
			   	return;
        	}
		}
		
		if($rootScope.userLevel=='user'){
           displayError('You are not permitted to do this operation, allowed only for system administrator'); 
		   return;
        }
		else{
			 var confirm = $mdDialog.confirm()
			  .title('Activate/deactivate user')
			  .textContent('Are you sure you want to activate '+user.Id+'?')
			  .ariaLabel('Activate')
			  .targetEvent(ev)
			  .ok('Please do it!')
			  .cancel('Cancel');
			$mdDialog.show(confirm).then(function() {
				$http({
	                method: 'GET',
					url: '/auth/ResetPasswordByTenantAdmin/'+user.Id,
	                headers: {
	                    'Securitytoken': getCookie('securityToken')
	                }
            	})
                .success(function(response){
                    console.log(response);
                    $mdDialog.hide();
                    displaySuccess(response);               
                }).error(function(error){  
                    $mdDialog.hide(); 
                    displayError(error.Message); 
                });    	
			});
		}				
	}

	$scope.getCatLetter=function(catName){
		try{
			var catogeryLetter = "images/material_alperbert/avatar_tile_"+catName.charAt(0).toLowerCase()+"_28.png";
		}catch(exception){}
		return catogeryLetter;
	}; 
	
	userAdminFactory.getAllGroups(function(data) {
		console.log(data);
		$scope.groups = data;
	});
	
	vm.addGroup = function(ev, group, index)
	{
		 if($rootScope.userLevel=='user'){
           displayError('You are not permitted to do this operation, allowed only for administrator'); 
        }else{
			if(!group)
			{
				var group = {};
				var index = "";
			}
			
			$mdDialog.show({
				  controller: "addGroupCtrl as vm",
				  templateUrl: 'views/settings/userAdministrator/addGroup.html',
				  parent: angular.element(document.body),
				  targetEvent: ev,
				  clickOutsideToClose:true,
				  locals: {group: group, index: index}
			})
			.then(function(answer) {
				if(answer)
				{
					if(index)
					{
						$scope.groups[index] = answer.group;
					}else{
						$scope.groups.push(answer.group);
					}
				}
			})
		}
			
	}
	
	$scope.addUser = function(ev,group)
	{
		
	}
	vm.deleteGroup = function(ev,index,group)
	{
		 var confirm = $mdDialog.confirm()
          .title('Delete Group')
          .textContent('Are you sure you want to delete this group?')
          .ariaLabel('Delete Group')
          .targetEvent(ev)
          .ok('Please do it!')
          .cancel('Cancel');

		$mdDialog.show(confirm).then(function() {
		  console.log("delete " + group.groupId);
		  notifications.toast(1, "'"+group.groupname +"' Deleted");
		  
		  userAdminFactory.removeUserGroup(group.groupId).then(function(data) {
			  
					$rootScope.sharableUsers=[];
					//userAdminFactory.getInvitedUsers(function(data) {});
					userAdminFactory.getInvitedUsers($scope.getStatus);
					
				$scope.groups.splice(index, 1); 
			});
		});
	}

}])


/*DiginApp.controller('addGroupCtrl',[ '$scope','$mdDialog', function ($scope,$mdDialog){
	
	$scope.submit = function()
	{
			console.log("submit");
	}
	
}])*/


routerApp.controller('addGroupCtrl',[ '$scope', '$rootScope','$mdDialog','notifications','userAdminFactory', 'group','index','$state' ,function ($scope,$rootScope,$mdDialog,notifications,userAdminFactory,group,index,$state){
	 
	var vm = this;
	var index = index;
	vm.addOrEdit = "Add";
	vm.group = {};
    vm.querySearch = querySearch;
    vm.allContacts = loadContacts();
    vm.contacts = [];
    vm.filterSelected = true;
	
	//*Settings routing ---------------- 
    var slide = false;
    $scope.route = function (state) {
		  $state.go('home.welcomeSearch');
    };
	
	
	function getCatLetter(catName){
		try{
			var catogeryLetter = "images/material_alperbert/avatar_tile_"+catName.charAt(0).toLowerCase()+"_28.png";
		}catch(exception){}
		return catogeryLetter;
	};

	if(Object.keys(group).length != 0)
	{
		vm.addOrEdit = "Edit";
		vm.group = group;
		//vm.contacts = group.users;
		for (var i = 0; i<group.users.length; i++) {
			var arrlen = vm.allContacts.length;
			for (var j = 0; j<arrlen; j++) {
				if (group.users[i].Id == vm.allContacts[j].Id) {
					//removeItems.push(j);
					 vm.contacts.push(vm.allContacts[j]);
				}//if close
			}//for close
		}//for close
	}else{
		for (i = 0, len = vm.allContacts.length; i<len; ++i){
			if(vm.allContacts[i].Id == JSON.parse(decodeURIComponent(getCookie('authData'))).Email)
			{
				vm.contacts.push(vm.allContacts[i]);
			}
		}
	}
	
    /**
     * Search for contacts.
     */
    function querySearch (query) {
      var results = query ? vm.allContacts.filter(createFilterFor(query)) : [];
      return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(contact) {
        return (contact._lowername.indexOf(lowercaseQuery) != -1);
      };

    }
	
    function loadContacts() {
		/*var contacts = [{email: "m.augustine@example.com", name:"Marina Augustine"},
						{email: "o.sarno@example.com", name:"Oddr Sarno"},
						{email: "n.giannopoulos@example.com", name:"Nick Giannopoulos"}];*/
		var contacts = angular.copy($rootScope.sharableUsers);
						
		for (i = 0, len = contacts.length; i<len; ++i){
			contacts[i].image = getCatLetter(contacts[i].Name);
			contacts[i]._lowername = contacts[i].Name.toLowerCase();
		}
		return contacts;
    }

	
	vm.isValidGroupName=function(){
        for (var i = 0; i < $rootScope.sharableGroups.length; i++) {
            var groupName=$rootScope.sharableGroups[i].Name;
                if(vm.group.groupname.toLowerCase()==groupName.toLowerCase()){
                    return false;
                }
        }
        return true;
    };
	
	$scope.AddGroup = function()
	{
		if(vm.contacts.length != 0)
			{
				vm.submitted = true;
				vm.group.users = [];
				if(!vm.group.groupId)
				{
					vm.group.groupId = "-999";
					vm.group.parentId = "";
				}

				for (i = 0, len = vm.contacts.length; i<len; ++i){
					vm.group.users.push({Name:vm.contacts[i].Name, Id:vm.contacts[i].Id});
				}
							
				userAdminFactory.addUserGroup(vm.group).then(function(result) {
						
					if(result.IsSuccess == true)
					{
						$rootScope.sharableUsers=[];
						
						//userAdminFactory.getInvitedUsers(function(data) {});
						userAdminFactory.getInvitedUsers($scope.getStatus);
						
						notifications.toast(1, "Group Added");
						vm.group.groupId = result.Data[0].ID;
						$mdDialog.hide({group:vm.group, index:index});
					}else{
						notifications.toast(0, result.Message);
					}
					vm.submitted = false;
				})
				
			}else{
				notifications.toast(0, "Please add members to the group");
			}
	}	
		
		
	$scope.UpdateGroup = function()
	{	
		if(vm.contacts.length != 0)
		{
			vm.submitted = true;
			//vm.group.users = [];
			if(!vm.group.groupId)
			{
				notifications.toast(0, "User group already exist.");
				vm.submitted = false;
				return;
				//vm.group.groupId = "-999";
				//vm.group.parentId = "";
			}
	
	
			/*for (i = 0, len = vm.contacts.length; i<len; ++i){			
				vm.group.users.push({Name:vm.contacts[i].Name, Id:vm.contacts[i].Id});				
			}*/
			
			
			userAdminFactory.removeUserFromGroup(vm.group).then(function(result) {
				//console.log("removed..");
					userAdminFactory.addUserToGroup(vm.group).then(function(result) {
						if(result.IsSuccess == true)
						{
							$rootScope.sharableUsers=[];
							//userAdminFactory.getInvitedUsers(function(data) {});
							userAdminFactory.getInvitedUsers($scope.getStatus);
							
							notifications.toast(1, "User group updated successfully.");
							vm.group.groupId = result.Data[0].ID;
							$mdDialog.hide({group:vm.group, index:index});
						}else{
							notifications.toast(0, result.Message);
						}
						vm.submitted = false;
					})
					
					vm.group.users=[];
					for (i = 0, len = vm.contacts.length; i<len; ++i){			
						vm.group.users.push({Name:vm.contacts[i].Name, Id:vm.contacts[i].Id});				
					}
				
			})
	
			
			
		}else{
			notifications.toast(0, "Please add members to the group");
		}
			
	}
	
	
	//Finally add the group and close the Dialog
	$scope.submit = function()
	{
		if(vm.isValidGroupName()==false){
			$scope.UpdateGroup();
            //notifications.toast('0', 'This user group is already created.');
            //return;
        }
		else{
			$scope.AddGroup();
		}
	}
	
	
	
	
	
	vm.close = function()
	{
		$mdDialog.hide();
	}
	

}])










