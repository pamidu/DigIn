DiginApp.controller('switchTenantCtrl',[ '$scope', '$rootScope','$mdDialog','UserServices', function ($scope,$rootScope,$mdDialog,UserServices){

	UserServices.getTenants(function(response) {
		$scope.tenants = response;
	});
					
	$scope.switch = function(content)
	{
		window.open("http://" + content.TenantID , "_blank");
		$mdDialog.cancel();
	}

}])