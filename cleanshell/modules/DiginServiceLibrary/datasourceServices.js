DiginServiceLibraryModule.factory('datasourceServices',['$http', '$rootScope', 'Digin_Engine_API','Digin_Domain','notifications',  function ($http,$rootScope, Digin_Engine_API,Digin_Domain, notifications) {
	var cache = {};
	return{
			getTables: function(selecteDbType, dbType, retriveAgain, callback){
				if(selecteDbType == dbType && cache.tables && !retriveAgain){
					callback(cache.tables);
				}else{
					return $http.get(Digin_Engine_API + 'GetTables?dataSetName=' + $rootScope.authObject.Email.replace(/[@.]/g, '_') + "&db=" + dbType+"&SecurityToken=" + $rootScope.authObject.SecurityToken+"&Domain="+Digin_Domain)
                       .then(function(result) {
						   	cache.tables = result.data;
                            callback(result.data);
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to load tables");
						 });
				}
				

			},
			getAllConnections: function(dbType) {
				return $http.get(Digin_Engine_API + 'get_datasource_config?SecurityToken=' + $rootScope.authObject.SecurityToken + '&connectiontype=' + dbType)
                       .then(function(result) {
                            return result.data;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Datasource configs");
						 });
			},
			getAllConnectionsCb: function(selecteDbType, dbType, retriveAgain,callback) {
				if(selecteDbType == dbType && cache.connections && !retriveAgain)
				{
					callback(cache.connections);
				}else
				{
					return $http.get(Digin_Engine_API + 'get_datasource_config?SecurityToken=' + $rootScope.authObject.SecurityToken + '&connectiontype=' + dbType)
                       .then(function(result) {
						   cache.connections = result.data;
                           callback(result.data);
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Datasource configs");
						 });
				}
			},
			getConnectionTables: function(dbType, configId, oldConfigId,retriveAgain, callback){
				if(configId == oldConfigId && cache.connectionTables && !retriveAgain)
				{
					callback(cache.connectionTables);
				}else{
					return $http.get(Digin_Engine_API + "GetTables?db="+dbType+"&datasource_config_id=" + configId+ "&SecurityToken=" + $rootScope.authObject.SecurityToken+"&Domain="+Digin_Domain)
                       .then(function(result) {
						   cache.connectionTables = result.data;
                           callback(result.data);
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Tables");
						 });
				}
			},
			getConnectionTable: function(dbType, tableName, lastTableName, MSSQLid,callback){
				if(tableName == lastTableName && cache.connectionTable)
				{
					callback(cache.connectionTable);
				}else{
					return $http.get(Digin_Engine_API + "GetFields?dataSetName=" + $rootScope.authObject.Email.replace(/[@.]/g, '_') + "&tableName=" + tableName + "&db=" + dbType + "&schema=public&datasource_config_id=" + MSSQLid+ "&SecurityToken=" + $rootScope.authObject.SecurityToken+"&Domain="+Digin_Domain)
				   .then(function(result) {
						cache.connectionTable = result.data;
						callback(result.data);
					},function errorCallback(response) {
							console.log(response);
							notifications.toast(0, "Falied to get Datasource configs");
					 });
				}
				
				/*return $http.get(Digin_Engine_API + "GetFields?dataSetName=" + $rootScope.authObject.Email.replace(/[@.]/g, '_') + "&tableName=" + tableName + "&db=" + dbType + "&schema=public&datasource_config_id=" + MSSQLid+ "&SecurityToken=" + $rootScope.authObject.SecurityToken+"&Domain="+Digin_Domain)
				   .then(function(result) {
						callback(result.data);
					},function errorCallback(response) {
							console.log(response);
							notifications.toast(0, "Falied to get Datasource configs");
					 });*/
			},getAllDatabases: function(securityToken,reqParam,dbType) {
				return $http.get( Digin_Engine_API + 'get_all_databases?' + 'SecurityToken=' + securityToken +'&hostname=' + reqParam.host + '&port=' + reqParam.port +'&username=' + reqParam.username + '&password=' + reqParam.password + '&db=' + dbType)
				//return $http.get( 'http://192.168.0.101:8080/get_all_databases?' + 'SecurityToken=' + securityToken +'&hostname=' + reqParam.host + '&port=' + reqParam.port +'&username=' + reqParam.username + '&password=' + reqParam.password + '&db=' + dbType)
				   .then(function(result) {
					   console.log(result);
						return result.data;
					},function errorCallback(response) {
							console.log(response);
							notifications.toast(0, "Falied to get Databases");
				});
			},testConnection: function(securityToken,reqParam,dbType) {
				return $http.get( Digin_Engine_API + 'test_database_connection?' + 'SecurityToken=' + securityToken +'&hostname=' + reqParam.host + '&port=' + reqParam.port +'&username=' + reqParam.username + '&password=' + reqParam.password + '&databasename=' + reqParam.databaseName+'&db=' + dbType)
				//return $http.get('http://192.168.0.101:8080/test_database_connection?' + 'SecurityToken=' + securityToken +'&hostname=' + reqParam.host + '&port=' + reqParam.port +'&username=' + reqParam.username + '&password=' + reqParam.password + '&databasename=' + reqParam.databaseName+'&db=' + dbType)
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
					 //url: 'http://192.168.0.101:8080/store_datasource_config/',
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