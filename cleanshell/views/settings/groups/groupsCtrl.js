DiginApp.controller('groupsCtrl',[ '$scope','$mdDialog', function ($scope,$mdDialog){
	
	$scope.$parent.currentView = "Settings";
	
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

}])

DiginApp.controller('addGroupCtrl',[ '$scope','$mdDialog', function ($scope,$mdDialog){
	
	$scope.submit = function()
	{
			console.log("submit");
	}
	
}])