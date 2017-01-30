angular.module('configuration', [])
.constant('Digin_Engine_API', 'http://dev.digin.io/DigInEngine/')
.constant('Digin_Engine_API_Namespace', 'Demo')
.constant('Digin_Tomcat_Base', 'http://dev.digin.io:9897/')
.constant('Digin_Domain', 'dev.digin.io')
.constant('DevStudio', false)
.constant('ReportDevelopment','http://prod.report.digin.io:5488/')
.constant('Digin_LogoUploader', 'http://dev.digin.io:8080/')
.constant('Digin_Auth', 'http://dev.digin.io/')
.constant('Digin_Tenant', 'http://dev.auth.digin.io:3048')
.constant('Digin_ObjStore', 'http://dev.auth.digin.io:3000')
//#for loggin process
.constant('IsLocal', true)
.constant('Local_Shell_Path', 'http://localhost:8081/DigIn/shell')
.constant('report_Widget_Iframe', 'http://dev.digin.io/Reports/HourlyCallSummery_HBL/HourlyCallSummery_HBL.pdf')
//#apis folder path inside the html folder ** NOTE : if apis folder in -->html/apis/ then apis_path--> '/apis/'
.constant('apis_Path', '/apis/')
.constant('auth_Path', '/auth/')
.constant('include_Path', '/include/')
//#for onsite implementation (Note : for on prem  version onsite=true, for cloud version onsite=false)
.constant('onsite', false)   
.constant('tenantId','test514')
.constant('version','V3.2.1.3')
//#Database type --> mssql, postgresql,bigquery,mysql #Database type for csv/excel upload
.constant('dbType', 'bigquery')

//configure datasource connections in DigIn/shell/jsons/dbConfig.json
// #set the 'display' parameter in each object to configure visibility
// # "display": "true" - Datasource will be visible
// # "display": "false" - Datasource will be hidden

