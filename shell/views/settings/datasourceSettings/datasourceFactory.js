routerApp.factory('datasourceFactory', function ($http, Digin_Engine_API, Digin_Domain) {
    return {
    	getAllConnections: function(securityToken) {
    		return $http({
    			method: 'GET',
    			url: 'http://192.168.0.30:8080/get_datasource_config?SecurityToken=' + '34a4865cb010be062fe1b7cbd399f328'
    		})
    	},
    	/*
    		reqParam = {host:host name, username:user name, password:password, port:port}
    	*/
    	getAllDatabases: function(loginStatus,reqParam) {
    		
    	}
    }
});