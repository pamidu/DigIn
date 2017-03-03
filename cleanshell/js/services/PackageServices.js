DiginApp.factory('PackageServices', ['$rootScope','$http', '$auth', 'notifications', 'Digin_Engine_API', 'Digin_Domain','auth_Path', function($rootScope,$http, $auth,notifications, Digin_Engine_API, Digin_Domain,auth_Path) {
	var cache = {};
	return {
        getPaymentHistory: function(startDate, endDate) {
             //return the promise directly.
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