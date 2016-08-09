angular.module('configuration', [])
	.constant('Digin_Engine_API', 'http://prod.digin.io:1929/')
    //.constant('Digin_Engine_API', 'http://digin.io:1929/')
    .constant('Digin_Engine_API_Namespace', 'Demo')
    .constant('Digin_Tomcat_Base', 'http://prod.digin.io:9897/')
    .constant('Digin_Domain', 'prod.digin.io')
    .constant('DevStudio', false)
    .constant('RealTime','http://prod.report.digin.io:5601/app/kibana')
    .constant('ReportDevelopment','http://prod.report.digin.io:5488/')
   // .constant('RealTime','http://104.155.232.234/#/dashboard/file/default.json')
  
    .constant('Digin_LogoUploader', 'http://prod.digin.io:8080/')
    .constant('Digin_Auth', 'http://prod.digin.io/')
   .constant('Digin_Tenant', 'http://prod.auth.digin.io:3048')
   .constant('Digin_ObjStore', 'http://prod.auth.digin.io:3000')

    //#for loggin process
    .constant('IsLocal', true)
    .constant('Local_Shell_Path', 'http://localhost:8081/2016-8-9/Digin-new/Digin/shell')