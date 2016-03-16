/**
 * Created by Damith on 3/8/2016.
 */
'use strict';
//service details
//var parameter ={apiBase:'',reportName:'',token:''}
//getReportUI(parameter)
routerApp.factory('dynamicallyReportSrv', function ($http) {
    return {
        getReportUI: function (parameter) {
            return $http.get(parameter.apiBase + 'getLayout?Reportname=' + parameter.reportName + '', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        },
        getCurrentQry: function (parameter) {
            return $http.get(parameter.apiBase + 'getQueries?Reportname=' + parameter.reportName +
                '&fieldnames={' + parameter.queryFiled + '}')



        }
    }
});


