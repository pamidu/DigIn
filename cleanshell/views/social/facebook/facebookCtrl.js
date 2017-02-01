DiginApp.controller('facebookCtrl',[ '$scope','$rootScope','$mdDialog', function ($scope,$rootScope,$mdDialog){
		$scope.$parent.currentView = "Facebook";
		
		$scope.viewPortHeight = "calc(100vh - 50px)";
		$scope.$parent.topMenuToggle2 = function()
		{
			if($rootScope.showHeader == true)
			{
				$scope.viewPortHeight = "calc(100vh - 50px)";
			}else{
				$scope.viewPortHeight = "calc(100vh - 4px)";
			}
		}
}])