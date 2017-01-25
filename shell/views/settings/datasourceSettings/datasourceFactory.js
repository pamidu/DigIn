routerApp.factory('datasourceFactory', function ($http, Digin_Engine_API) {
    return {
    	getAllConnections: function(securityToken) {
    		return $http({
    			method: 'GET',
    			url: Digin_Engine_API + 'get_datasource_config?SecurityToken=' + securityToken
    		})
    	},
    	/*
    		reqParam = {host:host name, username:user name, password:password, port:port}
    	*/
    	getAllDatabases: function(securityToken,reqParam) {
            return $http({
                method: 'GET',
                url: Digin_Engine_API + 'get_all_databases?' + 
                'SecurityToken=' + securityToken +
                '&hostname=' + reqParam.host + 
                '&port=' + reqParam.port +
                '&username=' + reqParam.username + 
                '&password=' + reqParam.password
            })
    	},
        testConnection: function(securityToken,reqParam) {
            return $http({
                method: 'GET',
                url: Digin_Engine_API + 'test_database_connection?' + 
                'SecurityToken=' + securityToken +
                '&hostname=' + reqParam.host + 
                '&port=' + reqParam.port +
                '&username=' + reqParam.username + 
                '&password=' + reqParam.password + 
                '&databasename=' + reqParam.databaseName
            })
        },
        saveConnection: function(securityToken,reqParam) {
            return $http({
                method: 'POST',
                url: Digin_Engine_API + 'store_datasource_config/',
                data: angular.toJson(reqParam),
                headers: {
                    'Content-Type': 'application/json',
                    'securityToken' : securityToken
                }
            })
        }
    }
});