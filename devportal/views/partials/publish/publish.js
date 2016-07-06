window.devportal.partials.publish = function($scope,$rootScope, $http, $dev, $state, $rootScope, $stateParams, $auth, $objectstore,$helpers){
	$scope.appKey = $stateParams.appKey;

	$dev.project().get($stateParams.appKey).success(function(data){
		$scope.appDesc = data;
		$dev.states().setIdle();
	}).error(function(data){
		$dev.dialog().alert ("Error Retrieving Project Details");
		$dev.states().setIdle();
	});

	$scope.app = {};

	$scope.publishMarket = true;
	$scope.publishAccounts = ["One", "Two" ,"Three"];
	$scope.selectedAccount = $scope.publishAccounts[0];
	
	$scope.publish = function(){
		
		if(!$scope.appDesc.price)
		{
			 $scope.appDesc.price = "0";
		}
		var mObj = {
			"catogery":$scope.appDesc.category,
			"contact":$auth.getUserName(),
			"description":$scope.appDesc.description,
			"developer":$auth.getUserName(),
			"iconUrl":"/apps/" + $scope.appKey + "?meta=icon",
			"id":$scope.appKey,
			"appKey":$scope.appKey,
			"images":["img/01.png","img/02.png","img/03.png"],
			"name":$scope.appDesc.name,
			"price":$scope.appDesc.price,
			"rating":"0"
		}

		$dev.project().publish($scope.appKey,mObj).success(function(){
			$dev.dialog().alert ("Application Publish Successful!!!.");
		}).error(function(){
			$dev.dialog().alert (edata);
		});
	}

	$scope.edit = function(){$dev.navigation().edit($scope.appKey);}
	$dev.navigation().title($scope.appKey, "Publish");
}
