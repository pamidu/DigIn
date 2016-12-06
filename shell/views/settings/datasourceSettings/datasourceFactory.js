routerApp.factory('datasourceFactory', function ($http, Digin_Engine_API, Digin_Domain) {
    return {
    	getAllConnections: function(securityToken) {
    		return $http({
    			method: 'GET',
    			url: 'http://192.168.5.166:8080/get_datasource_config?SecurityToken=' + '34a4865cb010be062fe1b7cbd399f328'
    		})
    	},
    	/*
    		reqParam = {host:host name, username:user name, password:password, port:port}
    	*/
    	getAllDatabases: function(securityToken,reqParam) {
            return $http({
                method: 'GET',
                url: 'http://192.168.5.166:8080/get_all_databases?' + 
                'SecurityToken=' + '34a4865cb010be062fe1b7cbd399f328' +
                '&hostname=' + reqParam.host + 
                '&port=' + reqParam.port +
                '&username=' + reqParam.username + 
                '&password=' + reqParam.password
            })
    	},
        testConnection: function(securityToken,reqParam) {
            return $http({
                method: 'GET',
                url: 'http://192.168.5.166:8080/' + 'test_database_connection?' + 
                'SecurityToken=' + '34a4865cb010be062fe1b7cbd399f328' +
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
                url: 'http://192.168.5.166:8080/store_datasource_config/',
                data: angular.toJson(reqParam),
                headers: {
                    'Content-Type': 'application/json',
                    'securityToken' : '34a4865cb010be062fe1b7cbd399f328'
                }
            })
        }
    }
});