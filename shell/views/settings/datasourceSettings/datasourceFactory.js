routerApp.factory('datasourceFactory', function ($http, Digin_Engine_API) {
    return {
    	getAllConnections: function(securityToken,dbType) {
    		return $http({
    			method: 'GET',
    			url: Digin_Engine_API + 'get_datasource_config?SecurityToken=' + securityToken
                    + '&connectiontype=' + dbType
    		})
    	},
    	/*
    		reqParam = {host:host name, username:user name, password:password, port:port}
    	*/
    	getAllDatabases: function(securityToken,reqParam,dbType) {
            return $http({
                method: 'GET',
                url: Digin_Engine_API + 'get_all_databases?' + 
                'SecurityToken=' + securityToken +
                '&hostname=' + reqParam.host + 
                '&port=' + reqParam.port +
                '&username=' + reqParam.username + 
                '&password=' + reqParam.password +
                '&db=' + dbType
            })
    	},
        testConnection: function(securityToken,reqParam,dbType) {
            return $http({
                method: 'GET',
                url: Digin_Engine_API + 'test_database_connection?' + 
                'SecurityToken=' + securityToken +
                '&hostname=' + reqParam.host + 
                '&port=' + reqParam.port +
                '&username=' + reqParam.username + 
                '&password=' + reqParam.password + 
                '&databasename=' + reqParam.databaseName+
                '&db=' + dbType
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