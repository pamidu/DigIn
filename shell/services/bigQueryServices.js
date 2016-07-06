/**
 * Created by Damith on 11/11/2015.
 */

//BigQuery Services
routerApp.factory('bigQueryServices', function ($http) {
    return {
        getTables: function (serverBase) {
            return $http.get(serverBase);
        }
    }
});