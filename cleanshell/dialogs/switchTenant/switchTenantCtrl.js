DiginApp.controller('switchTenantCtrl',[ '$scope', '$rootScope','$mdDialog','DiginServices', function ($scope,$rootScope,$mdDialog,DiginServices){

	DiginServices.getTenants().then(function(response) {
		$scope.tenants = response;
	});
					
	$scope.switch = function(content)
	{
		window.open("http://" + content.TenantID , "_blank");
		$mdDialog.cancel();
	}

}])