DiginApp.controller('inviteUserCtrl',[ '$scope','$mdDialog', '$http', 'notifications', '$timeout',function ($scope,$mdDialog, $http, notifications,$timeout){
	
	$scope.$parent.currentView = "Invite User";
	
	$scope.users =	[
						{name: "Dilshan", imgUrl: "views/settings/inviteUser/me_small.png"},
						{name: "Binara"},
						{name: "Rangika"}
					]
	
	$scope.enterInviteUser = function(ev,searchText)
	{
		notifications.startLoading("Inviting user, Please wait..");
		console.log(searchText);
		
		//Replace the $timeout with the $http request
		$timeout(function(){
			notifications.finishLoading();
			notifications.toast(1,"Sucessfully Invited");
			$scope.searchText = "";
		}, 2000);
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