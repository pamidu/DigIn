DiginApp.controller('userAdministratorCtrl',[ '$scope','$rootScope','$mdDialog','UserServices', 'notifications','paymentGateway','$http','colorManager','dialogService','onsite', function ($scope,$rootScope,$mdDialog,UserServices,notifications,paymentGateway,$http,colorManager,dialogService,onsite){
	var vm = this;
	
	vm.onsite = onsite;
	
	$scope.$parent.currentView = "User Administrator";
    colorManager.reinforceTheme();
	
	$scope.fetchingUsers = true;
	UserServices.getInvitedUsers(function(result) {
		$scope.fetchingUsers = false;
		$scope.$parent.sharableUsers = [];
		$scope.$parent.sharableGroups = [];
		for (var i = 0, len = result.length; i<len; ++i) {
			if (result[i].Type == "User") {
				$scope.$parent.sharableUsers.push(result[i]);
			}else if (result[i].Type == "Group") {
				$scope.$parent.sharableGroups.push(result[i]);
			}
		}
		
	});
	
	$scope.pendingUsers = [];
	
	function getPendingUsers(){
		UserServices.getPendingUsers().then(function(response){
			$scope.pendingUsers = [];
			console.log(response);
			for (i = 0, len = response.AddUserRequests.length; i<len; ++i){
				
				if(!response.AddUserRequests[i].UserID){
					
					response.AddUserRequests[i].Name = response.AddUserRequests[i].Email.split(".")[0];
				}
				$scope.pendingUsers.push(response.AddUserRequests[i]);
			}
		})
	}
	
	getPendingUsers();
	
	
	var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	$scope.enterInviteUser = function(ev,searchText)
	{
		
		if(reg.test(searchText) == true)
		{
			
			var exist = checkIfExist(searchText)
			console.log(exist);
			if(exist == false)
			{
				UserServices.inviteUser(ev, searchText).then(function(response) {
					console.log(response);
					$scope.searchText = "";
					getPendingUsers();
				});
			}
		}else{
			notifications.toast(0, 'Enter a valid email');
		}
		
	}
	
	function checkIfExist(email){
		var exist = false;
		if($scope.$parent.sharableUsers.length == 0)
		{
			exist = false;
		}else{
			for (i = 0, len = $scope.$parent.sharableUsers.length; i<len; ++i){
				if($scope.$parent.sharableUsers[i].Id == email)
				{
					exist = true;
					notifications.toast(0, 'This user is already invited');
				}
			}
		}
		
		if($scope.pendingUsers.length == 0)
		{
			exist = false;
		}else{
			for (i = 0, len = $scope.pendingUsers.length; i<len; ++i){
				if($scope.pendingUsers[i].Email == email)
				{
					exist = true;
					notifications.toast(0, 'This user is already invited');
				}
			}
		}
		
		return exist;
	}
	
	$scope.removeUser = function(ev, index, user)
	{
		dialogService.confirmDialog(ev,"Remove User","Are you sure you want to remove this user?", "yes","no","cancel").then(function(answer) {
			if(answer == "yes")
			{
				UserServices.removeInvitedUser(ev,user.Id).then(function(data){
					if(data == "true")
					{
						$scope.$parent.sharableUsers.splice(index, 1); 
					}
				})
			}
			else if(answer == "no")
			{
				notifications.toast(0,"you said no");
			}
		});
	}
	
	$scope.getCatLetter=function(catName){
		try{
			var catogeryLetter = "images/material_alperbert/avatar_tile_"+catName.charAt(0).toLowerCase()+"_28.png";
		}catch(exception){}
		return catogeryLetter;
	}; 
	
	UserServices.getAllGroups(function(data) {
		$scope.groups = data;
	});
	
	vm.addGroup = function(ev, group, index)
	{
		if(!group)
		{
			var group = {};
			var index = undefined;
		}
		
		$mdDialog.show({
			  controller: "addGroupCtrl as vm",
			  templateUrl: 'views/settings/userAdministrator/addGroup.html',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose:true,
			  locals: {users: $scope.$parent.sharableUsers, group: group, index: index}
		})
		.then(function(answer) {
			if(answer)
			{
				if(index || index == 0)
				{
					$scope.groups[index] = answer.group;
				}else{
					$scope.groups.push(answer.group);
				}
			}
		})
	}
	
	$scope.addUser = function(ev,group)
	{
		
	}
	vm.deleteGroup = function(ev,index,group)
	{
		dialogService.confirmDialog(ev,"Delete Group","Are you sure you want to delete this group?", "yes","no","cancel").then(function(answer) {
			if(answer == "yes")
			{
				notifications.toast(1, "'"+group.groupname +"' Deleted");
				UserServices.removeUserGroup(group.groupId).then(function(data) {
					$scope.groups.splice(index, 1); 
				});
			}
		});
	}
	
	vm.getFirstLetter = function(name)
	{
		return "images/material_alperbert/avatar_tile_"+name.charAt(0).toLowerCase()+"_28.png";
	}

}])

/*DiginApp.controller('addGroupCtrl',[ '$scope','$mdDialog', function ($scope,$mdDialog){
	
	$scope.submit = function()
	{
			console.log("submit");
	}
	
}])*/

DiginApp.controller('addGroupCtrl',[ '$scope', '$rootScope','$mdDialog','notifications','UserServices', 'group','users','index' ,function ($scope,$rootScope,$mdDialog,notifications,UserServices,group,users,index){
	
	var vm = this;
	var index = index;
	vm.addOrEdit = "Add";
	vm.group = {};
    vm.querySearch = querySearch;
    vm.allContacts = loadContacts();
    vm.contacts = [];
    vm.filterSelected = true;
	
	function getCatLetter(catName){
		try{
			var catogeryLetter = "images/material_alperbert/avatar_tile_"+catName.charAt(0).toLowerCase()+"_28.png";
		}catch(exception){}
		return catogeryLetter;
	};

	if(Object.keys(group).length != 0)
	{
		vm.addOrEdit = "Edit";
		vm.group = angular.copy(group);
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
			if(vm.allContacts[i].Id == $rootScope.authObject.Email)
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
		var contacts = angular.copy(users);
						
		for (i = 0, len = contacts.length; i<len; ++i){
			contacts[i].image = getCatLetter(contacts[i].Name);
			contacts[i]._lowername = contacts[i].Name.toLowerCase();
		}
		return contacts;
    }
	
	//Finally add the group and close the Dialog
	$scope.submit = function()
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
						
			UserServices.addUserGroup(vm.group).then(function(result) {
				if(result.IsSuccess == true)
				{
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
	

}])