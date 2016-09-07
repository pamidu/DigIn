DiginApp.controller('switchTenantCtrl',[ '$scope','$mdDialog', function ($scope,$mdDialog){
	
	$scope.tenants = [
						{name: "Dilshan", TenantID: "www.duoworld.com"},
						{name: "Sineth", TenantID: "www.veery.com"}
					]
					
	$scope.switch = function(content)
	{
		window.open("http://" + content.TenantID , "_blank");
		$mdDialog.cancel();
	}
	
	$scope.cancel = function()
	{
		$mdDialog.hide();
	}
}])