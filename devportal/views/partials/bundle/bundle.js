window.devportal.partials.bundle = function($scope,$rootScope, $http, $dev, $state, $rootScope, $stateParams, $auth, $objectstore,$helpers){
	$scope.appKey = $stateParams.appKey;
	$scope.appCategories = window.devportal.categories;


	$dev.project().getBundle($scope.appKey).success(function(data){
		if (!data.apps) data.apps = {};
		$scope.appBundle = data;

		$dev.project().all().success(function(data){
			$scope.projects = data;
			$dev.states().setIdle();
		}).error(function(data){
			$dev.dialog().alert ("Error Retrieving all projects");
			$dev.states().setIdle();
		});
	}).error(function(data){
		$dev.dialog().alert ("Error Retrieving app bundle");
	});

	

	$scope.save = function(){
		$dev.project().saveBundle($scope.appKey,$scope.appBundle).success(function(){}).error(function(){
			$dev.dialog().alert ("Error saving app bundle");
		});
	}

	$scope.publish = function(){$state.go("publish", {appKey: $scope.appKey});}
	$scope.share = function(){$state.go("share", {appKey: $scope.appKey});}
	$scope.editDescription = function(){$state.go("desc", {appKey: $scope.appKey});}
	$scope.openNewTab = function(){$dev.navigation().newTab();}


	$dev.navigation().title($scope.appKey);
}