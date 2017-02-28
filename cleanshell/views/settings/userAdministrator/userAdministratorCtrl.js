DiginApp.controller('userAdministratorCtrl',[ '$scope','$rootScope','$mdDialog','DiginServices', 'notifications','paymentGateway','$http','colorManager', function ($scope,$rootScope,$mdDialog,DiginServices,notifications,paymentGateway,$http,colorManager){
	var vm = this;
	
	$scope.$parent.currentView = "User Administrator";
    colorManager.reinforceTheme();
	
	DiginServices.getInvitedUsers(function(data) {});
	var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
	$scope.enterInviteUser = function(ev,searchText)
	{
		
		if(reg.test(searchText) == true)
		{
			
			var exist = checkIfExist(searchText)
			console.log(exist);
			if(exist == false)
			{
				DiginServices.inviteUser(searchText).then(function(response) {
					console.log(response);
					$scope.searchText = "";
				});
			}
		}else{
			notifications.toast(0, 'Enter a valid email');
		}
		
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
	
	$scope.removeUser = function(ev, user)
	{
		 var confirm = $mdDialog.confirm()
          .title('Remove User')
          .textContent('Are you sure you want to remove this user?')
          .ariaLabel('remove user')
          .targetEvent(ev)
          .ok('Please do it!')
          .cancel('Cancel');
		$mdDialog.show(confirm).then(function() {
			//send HTTP request and add the below call only if it succeeds
			
			/*for (i = 0, len = $scope.users.length; i<len; ++i){
				if($scope.users[i].name == user.name)
				{
					$scope.users.splice(i, 1);
				}
			}*/
		});
	}
	
	$scope.getCatLetter=function(catName){
		try{
			var catogeryLetter = "images/material_alperbert/avatar_tile_"+catName.charAt(0).toLowerCase()+"_28.png";
		}catch(exception){}
		return catogeryLetter;
	}; 
	
	DiginServices.getAllGroups(function(data) {
		console.log(data);
		$scope.groups = data;
	});
	
	vm.addGroup = function(ev, group, index)
	{
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
		  notifications.toast(1, "'"+group.groupname +"' Deleted");
		  DiginServices.removeUserGroup(group.groupId).then(function(data) {
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

DiginApp.controller('addGroupCtrl',[ '$scope', '$rootScope','$mdDialog','notifications','DiginServices', 'group','index' ,function ($scope,$rootScope,$mdDialog,notifications,DiginServices,group,index){
	
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
		var contacts = angular.copy($rootScope.sharableUsers);
						
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
						
			DiginServices.addUserGroup(vm.group).then(function(result) {
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