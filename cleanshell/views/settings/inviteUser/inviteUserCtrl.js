DiginApp.controller('inviteUserCtrl',[ '$scope', '$rootScope','$mdDialog', 'DiginServices', 'notifications', '$timeout',function ($scope, $rootScope,$mdDialog, DiginServices, notifications,$timeout){
	
	$scope.$parent.currentView = "Invite User";
	
	DiginServices.getInvitedUsers();
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
}])