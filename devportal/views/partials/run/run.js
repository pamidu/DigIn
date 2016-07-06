window.devportal.partials.run = function($scope, $dev, $state, $rootScope, $stateParams, $auth, $objectstore){
	$scope.exeUrl = "";
	$scope.appKey = $stateParams.appKey;
	
	var pType = "HTML5SDK";
	

	$scope.displayTypes = [
	{name: "Large", width:1200, height:500, icon:"tv"},
	{name: "Default", width:980, height:500, icon:"laptop_mac"},
	{name: "Portrait Tablet", width:768, height:500, icon:"tablet"},
	{name: "Phone to Tablets", width:600, height:500, icon:"tablet_android"},
	{name: "Phones", width:480, height:500, icon:"phone_android"}
	];

	$scope.displayType = $scope.displayTypes[1];

	function execute(pinfo){
		if (pinfo.type == "HTML5")
			$scope.exeUrl = "run/" + $scope.appKey;
		else
			$scope.exeUrl = "/runtime_profiles/materialDesign/executor.php?name=" + $scope.appKey +"&username=" + $auth.getUserName() + "&appCode=" + $scope.appKey + "&environ=dev";		
		
	}

	if (localStorage.getItem("projectSettings:" + $scope.appKey)){
		execute(JSON.parse(localStorage.getItem("projectSettings:"+ $scope.appKey)));
	}
	else{
		$dev.project().settings($scope.appKey).success(function(pinfo){
			execute(pinfo);
			localStorage.setItem("projectSettings:"+ $scope.appKey, JSON.stringify(pinfo))
		}).error(function(data){
			$dev.dialog().alert ("Error retrieving project settings")
		});
	}


	$scope.edit = function(){$dev.navigation().edit($scope.appKey);}
	$scope.openNewTab = function(){window.open($scope.exeUrl);}
	$scope.executorLoaded = function(){$dev.states().setIdle();}

	$dev.navigation().title($scope.appKey, "Run");
}