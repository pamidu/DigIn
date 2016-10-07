DiginApp.controller('userAdministratorCtrl',[ '$scope','$rootScope','$mdDialog','DiginServices', 'notifications','paymentGateway','$http', function ($scope,$rootScope,$mdDialog,DiginServices,notifications,paymentGateway,$http){
	
	$scope.$parent.currentView = "User Administrator";
	
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
		$scope.groups = data;
	});
	
	$scope.addGroup = function(ev)
	{
		$mdDialog.show({
			  controller: "addGroupCtrl",
			  templateUrl: 'views/settings/userAdministrator/addGroup.html',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose:true
		})
		.then(function(answer) {
		})
	}
	
	$scope.addUser = function(ev,group)
	{
		$mdDialog.show({
			  controller: "addUserCtrl as vm",
			  templateUrl: 'views/settings/userAdministrator/addUser.html',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose:true,
			  locals: group
		})
		.then(function(answer) {
		})
	}

}])

DiginApp.controller('addGroupCtrl',[ '$scope','$mdDialog', function ($scope,$mdDialog){
	
	$scope.submit = function()
	{
			console.log("submit");
	}
	
}])

DiginApp.controller('addUserCtrl',[ '$scope','$mdDialog', function ($scope,$mdDialog){
	
	$scope.submit = function()
	{
			console.log("submit");
	}
	
	 var vm = this;

    vm.querySearch = querySearch;
    vm.allContacts = loadContacts();
	console.log(vm.allContacts);
    vm.contacts = [vm.allContacts[0]];
    vm.filterSelected = true;

    /**
     * Search for contacts.
     */
    function querySearch (query) {
      var results = query ?
          vm.allContacts.filter(createFilterFor(query)) : [];
      return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(contact) {
        return (contact._lowername.indexOf(lowercaseQuery) != -1);;
      };

    }

	function getCatLetter(catName){
		try{
			var catogeryLetter = "images/material_alperbert/avatar_tile_"+catName.charAt(0).toLowerCase()+"_28.png";
		}catch(exception){}
		return catogeryLetter;
	};
	
    function loadContacts() {
		var contacts = [{email: "m.augustine@example.com", name:"Marina Augustine"},
						{email: "o.sarno@example.com", name:"Oddr Sarno"},
						{email: "n.giannopoulos@example.com", name:"Nick Giannopoulos"}];
						
		for (i = 0, len = contacts.length; i<len; ++i){
			//write iteration logic here
			contacts[i].image = getCatLetter(contacts[i].name);
			contacts[i]._lowername = contacts[i].name.toLowerCase();
		}
		return contacts;
    }

}])