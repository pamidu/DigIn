DiginApp.controller('systemSettingsCtrl',[ '$scope','$rootScope', '$stateParams', '$mdDialog','DiginServices', 'notifications','paymentGateway','$http', '$q', '$timeout', function ($scope, $rootScope,$stateParams,$mdDialog,DiginServices,notifications,paymentGateway,$http, $q, $timeout){
	
	var vm = this;
	
	$scope.$parent.currentView = "Settings";
	if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
	{
		$('md-tabs-wrapper').css('background-color',"rgb(48,48,48)", 'important');
	}else{
		$('md-tabs-wrapper').css('background-color',"white", 'important');
	}
	
	vm.selectedPage = $stateParams.pageNo;
	
	$scope.openInfo = function()
	{
		alert("hi");
	}
	
	$scope.files = [
		{name: "Sales",owner: "Dilshan Liyanage", createdDate: "26/11/2012"},
		{name: "Invoice",owner: "Gevindu", createdDate: "26/11/2012"},
		{name: "Store",owner: "Dilani", createdDate: "26/11/2012"},
		{name: "Bank",owner: "Sajee", createdDate: "26/11/2013"},
		{name: "HR",owner: "Bhushana", createdDate: "25/11/2012"}
	]
	
	
}])