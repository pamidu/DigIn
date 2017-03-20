DiginServiceLibraryModule.factory('PackageServices', ['$rootScope','$http', 'notifications', 'Digin_Engine_API', 'Digin_Domain','auth_Path', function($rootScope,$http,notifications, Digin_Engine_API, Digin_Domain,auth_Path) {
	var cache = {};
	return {
		
		getPackageDetails: function() {
             return $http.get(Digin_Engine_API + "get_packages?get_type=detail&SecurityToken=" + $rootScope.authObject.SecurityToken)
				   .then(function(result) {
						return result.data;
					},function errorCallback(response) {
							console.log(response);
							notifications.toast(0, "Falied to get User Settings");
					 });
        },
        getPaymentHistory: function(startDate, endDate) {
             return $http.get(Digin_Engine_API + 'get_packages?get_type=ledger&SecurityToken=' + $rootScope.authObject.SecurityToken + '&start_date=' + moment(startDate).format('YYYY-MM-D') + ' 00:00:00' + '&end_date=' + moment(endDate).format('YYYY-MM-D') + ' 23:59:59')
				   .then(function(result) {
						return result.data;
					},function errorCallback(response) {
							console.log(response);
							notifications.toast(0, "Falied to get User Settings");
					 });
        }
		
   }
}]);//END OF PackageServices