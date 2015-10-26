angular.module('configuration', [])


.constant('Digin_Extended_Analytics', 'http://localhost:8080/pentaho/api/repos/xanalyzer/service/selectSchema?ts=1432813521945')
    .constant('Digin_Extended_Reports', 'http://localhost:8080/pentaho/api/repos/pentaho-interactive-reporting/prpti.new?ts=1432879514549')
    .constant('Digin_Extended_Dashboard', 'http:/localhost:8080/pentaho/api/repos/dashboards/editor?ts=1432880580357')
    .constant('Digin_Extended_Datasource', 'http://localhost:8080/pentaho/plugin/data-access/api/connection/list?ts=1432880662383')
    .constant('Digin_AnalyzerViewer', ' http://localhost:8080/pentaho/api/repos/%3Ahome%')
    .constant('Digin_ReportViewer', 'http://localhost:8080/pentaho/api/repos/%3Ahome%')
    .constant('Digin_DashboardViewer', 'http://localhost:8080/pentaho/api/repos/%3Ahome%')
    .constant('Digin_Base_URL', 'localhost:8080/Digin/')
    .constant('DevStudio',false)
