/**
 * Created by Damith on 12/4/2015.
 */
routerApp.factory('fbGraphServices', function ($http) {
    return {
        //Get all details current access page or group
        get_all: function (serverBase, metricName, token, since, until) {
            return $http.get(serverBase + "pageoverview?metric_names=" +
                metricName + "&token=" + token + "&since=" + since + "&until=" + until
            );
        }
    }

})
