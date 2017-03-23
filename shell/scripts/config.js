angular.module('configuration', [])
.constant('Digin_Engine_API', 'http://dev.digin.io/DigInEngine/') //#Note : http://dev.digin.io/DigInEngine/
.constant('Digin_Engine_API_Namespace', 'Demo')
.constant('Digin_Tomcat_Base', 'http://dev.digin.io:9897/') //#Note : http://dev.digin.io:9897/
.constant('Digin_Domain', 'dev.digin.io') //# Note : dev.digin.io
.constant('DevStudio', false)
.constant('ReportDevelopment','http://prod.report.digin.io:5488/') //#Note : http://prod.report.digin.io:5488/
.constant('Digin_Auth', 'http://dev.digin.io/') //# Note : http://dev.digin.io/
.constant('Digin_Tenant', 'http://dev.auth.digin.io:3048') //#Note : http://dev.auth.digin.io:3048
.constant('Digin_ObjStore', 'http://dev.auth.digin.io:3000') //#http://dev.auth.digin.io:3000
//#for loggin process
.constant('IsLocal', true) //# true for local developmet only
.constant('DeveloperMode', true) //# true for local developmet only 
.constant('Local_Shell_Path', 'http://localhost:8081/DigIn/cleanshell') //#This is the shell path only for local usage
//#apis folder path inside the html folder ** NOTE : if apis folder in -->html/apis/ then apis_path--> '/apis/'
.constant('apis_Path', '/apis/')
.constant('auth_Path', '/auth/')
.constant('include_Path', '/include/')
//#for onsite implementation (Note : for on prem  version onsite=true, for cloud version onsite=false)
.constant('onsite', true)   
.constant('tenantId','test')
.constant('version','V3.2.1.6')
//#Database type --> mssql, postgresql,bigquery,mysql #Database type for csv/excel upload
.constant('dbType', 'memsql')
//# url for facebook app
.constant('fbUrl', 'http://localhost:8081/DigIn-FB/index.html')

//configure datasource connections in DigIn/shell/jsons/dbConfig.json
// #set the 'display' parameter in each object to configure visibility
// # "display": "true" - Datasource will be visible
// # "display": "false" - Datasource will be hidden

// angular.module('configuration', [])
// .constant('Digin_Engine_API', 'http://prod.proxy.diginengine.digin.io/') //#Note : http://dev.digin.io/DigInEngine/
// .constant('Digin_Engine_API_Namespace', 'Demo')
// .constant('Digin_Tomcat_Base', 'http://prod.proxy.reportengine.digin.io/') //#Note : http://dev.digin.io:9897/
// .constant('Digin_Domain', 'prod.digin.io') //# Note : dev.digin.io
// .constant('DevStudio', false)
// .constant('ReportDevelopment','http://prod.report.digin.io/') //#Note : http://prod.report.digin.io:5488/
// .constant('Digin_Auth', 'http://prod.digin.io/') //# Note : http://dev.digin.io/
// .constant('Digin_Tenant', 'http://prod.proxy.auth.digin.io') //#Note : http://dev.auth.digin.io:3048
// .constant('Digin_ObjStore', 'http://prod.proxy.obj.digin.io') //#http://dev.auth.digin.io:3000
// //#for loggin process
// .constant('IsLocal', true) //# true for local developmet only 
// .constant('DeveloperMode', true) //# true for local developmet only 
// .constant('Local_Shell_Path', 'http://localhost:8081/DigIn/cleanshell') //#This is the shell path only for local usage
// //#apis folder path inside the html folder ** NOTE : if apis folder in -->html/apis/ then apis_path--> '/apis/'
// .constant('apis_Path', '/apis/')
// .constant('auth_Path', '/auth/')
// .constant('include_Path', '/include/')
// //#for onsite implementation (Note : for on prem  version onsite=true, for cloud version onsite=false)
// .constant('onsite', true)   
// .constant('tenantId','test514')
// .constant('version','V3.2.1.5')
// //#Database type --> mssql, postgresql,bigquery,mysql #Database type for csv/excel upload
// .constant('dbType', 'bigquery')
// //# url for facebook app
// .constant('fbUrl', 'http://prod.digin.io/DigIn-FB/index.html')

// //configure datasource connections in DigIn/shell/jsons/dbConfig.json
// // #set the 'display' parameter in each object to configure visibility
// // # "display": "true" - Datasource will be visible
// // # "display": "false" - Datasource will be hidden