DiginApp.factory('datasourceFactory',['$http', 'Digin_Engine_API','notifications',  function ($http, Digin_Engine_API, notifications) {
	return{
			getAllConnections: function(securityToken,dbType) {
				return $http.get(Digin_Engine_API + 'get_datasource_config?SecurityToken=' + securityToken + '&connectiontype=' + dbType)
                       .then(function(result) {
                            return result.data;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Datasource configs");
						 });
			},getAllDatabases: function(securityToken,reqParam,dbType) {
				return $http.get( Digin_Engine_API + 'get_all_databases?' + 'SecurityToken=' + securityToken +'&hostname=' + reqParam.host + '&port=' + reqParam.port +'&username=' + reqParam.username + '&password=' + reqParam.password + '&db=' + dbType)
				   .then(function(result) {
					   console.log(result);
						return result.data;
					},function errorCallback(response) {
							console.log(response);
							notifications.toast(0, "Falied to get Databases");
				});
			},testConnection: function(securityToken,reqParam,dbType) {
				return $http.get( Digin_Engine_API + 'test_database_connection?' + 'SecurityToken=' + securityToken +'&hostname=' + reqParam.host + '&port=' + reqParam.port +'&username=' + reqParam.username + '&password=' + reqParam.password + '&databasename=' + reqParam.databaseName+'&db_type=' + dbType)
				   .then(function(result) {
					   console.log(result);
						return result.data;
					},function errorCallback(response) {
							console.log(response);
							notifications.toast(0, "Test connection Failed");
				});
			},saveConnection: function(securityToken,reqParam) {
				var req = {
					 method: 'POST',
					 url: Digin_Engine_API + 'store_datasource_config/',
					 headers: {
						'Content-Type': 'application/json',
						'securityToken' : securityToken
					 },
					 data: angular.toJson(reqParam)
				}
				return $http(req).then(function(result){
						return result.data;
					}, function(error){
						notifications.toast(0, "Failed to save Datasource config");
					});
			}
    }
}]);