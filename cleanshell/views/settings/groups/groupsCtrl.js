DiginApp.controller('groupsCtrl',[ '$scope','$mdDialog', 'DiginServices', function ($scope,$mdDialog,DiginServices){
	
	$scope.$parent.currentView = "Settings";
	
	DiginServices.getAllGroups(function(data) {
		$scope.groups = data;
	});
	
	$scope.addGroup = function(ev)
	{
		$mdDialog.show({
			  controller: "addGroupCtrl",
			  templateUrl: 'views/settings/groups/addGroup.html',
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
			  controller: "addUserCtrl",
			  templateUrl: 'views/settings/groups/addUser.html',
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