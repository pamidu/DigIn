window.devportal.partials.newfile = function($scope,$rootScope, $http, $dev, $state, $rootScope, $stateParams, $auth, $objectstore,$helpers){
	$scope.appKey = $stateParams.appKey;
	$scope.appCategories = window.devportal.categories;

	$dev.project().get($stateParams.appKey).success(function(data){
		$scope.appDesc = data;
		$dev.states().setIdle();
	}).error(function(data){
		$dev.dialog().alert ("Error Retrieving Project Details");
		$dev.states().setIdle();
	});
	

	if (localStorage.getItem("project:" + $scope.appKey)){
		window.document.title = "DuoWorld DevStudio [" + JSON.parse(localStorage.getItem("project:" + $scope.appKey)).name + "]";	
	}else{
		$dev.project().get($scope.appKey).success(function(data){
			window.document.title = "DuoWorld DevStudio [" + data.name + "]";	
			localStorage.setItem("project:" + $scope.appKey, JSON.stringify(data));
		}).error(function(){
			window.document.title = "DuoWorld DevStudio";	
		});
	}
}