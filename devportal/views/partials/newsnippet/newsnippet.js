window.devportal.partials.newsnippet = function($scope,$rootScope, $http, $dev, $state, $rootScope, $stateParams, $auth, $objectstore,$helpers, $mdDialog){

	$scope.userValues = {};

	$scope.$watch("category", function(){
		if ($scope.category)
		$dev.templates()
			.snippetTemplates($scope.category.folder)
			.success(function(data){$scope.catTemplates = data;})
			.error(function(data){$scope.error = "";});
	});

	$dev.templates()
		.snippetCategories()
		.success(function(data){$scope.categories = data;})
		.error(function(data){$scope.error = "";});

	$scope.selectCategory = function(cat){$scope.category = cat; $scope.template=undefined;}
	$scope.selectTemplate = function(cat){$scope.template = cat; $scope.userValues = {};}
	$scope.unselectTemplate = function(cat){$scope.template=undefined;}

	function getUpdatedCode(){
		if (!$scope.template) return "";
		
		var mainCode = $scope.template.code;
		for(vi in $scope.userValues) mainCode = mainCode.replace(vi, $scope.userValues[vi]);
		return mainCode;
	}

  	$scope.ok = function(){$mdDialog.hide(getUpdatedCode());};
  	$scope.cancel= function(){$mdDialog.cancel();};
}