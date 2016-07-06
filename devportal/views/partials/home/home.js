window.devportal.partials.home = function($scope, $dev, $state){

	$dev.project().all().success(function(data){
		$scope.projects = data;
		$dev.states().setIdle();
	}).error(function(data){
		$dev.dialog().alert ("Error Retrieving all projects");
		$dev.states().setIdle();
	});


	function ls(p){localStorage.setItem("project:" + p.appKey, JSON.stringify(p));};

	$scope.download = function(p){$dev.project().download(p.appKey, p.name + ".zip");};
	$scope.edit = function(p){ls(p); $state.go(p.editor ? p.editor : "edit", {appKey: p.appKey});};
	$scope.publish = function(p){ls(p);$state.go("publish", {appKey:p.appKey});};
	$scope.run = function(p){ls(p);$state.go("run",{appKey:p.appKey});};
	$scope.share = function(p){ls(p);$state.go("share",{appKey:p.appKey});};
	$scope.delete = function(p){ };

	$dev.navigation().title();
}