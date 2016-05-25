/**
 * Created by Damith on 3/8/2016.
 */
'use strict';
//service details
//var parameter ={apiBase:'',reportName:'',token:''}
//getReportUI(parameter)
routerApp.factory('dynamicallyReportSrv', function ($http, Digin_Domain) {
    return {
        getReportUI: function (parameter) {
            return $http.get(parameter.apiBase + 'getLayout?SecurityToken=' + parameter.token +
                '&Domain='+Digin_Domain+'&Reportname=' + parameter.reportName + '', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        },
        getAllReports: function (parameter) {
            return $http.get(parameter.apiBase + 'getreportnames?SecurityToken=' + parameter.token +
                '&Domain='+Digin_Domain, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        },
        getCurrentQry: function (parameter) {
            return $http.get(parameter.apiBase + 'getQueries?Reportname=' + parameter.reportName +
                    '&fieldnames={' + parameter.queryFiled + '}')
        },
        getRenderReport: function (parameter) {
            return $http.get(parameter.tomCatBase + 'DigIn-Report/ReportService/Reports/getreport/' + parameter.reportName + '/[' + parameter.rptParameter + ']');
        },
        startReportServer: function (parameter) {
            return $http.get(parameter.tomCatBase + 'DigIn-Report/ReportService/Reports/command/start');
        }
    }
});


