angular.module('configuration', [])
	.constant('Digin_Engine_API', 'http://192.168.2.33:8080/')
    //.constant('Digin_Engine_API', 'http://digin.io:8080/')
    .constant('Digin_Engine_API_Namespace', 'Demo')
    .constant('Digin_Tomcat_Base', 'http://192.168.2.33:9897/')
    .constant('Digin_Domain', 'digin.io')
    .constant('DevStudio', false)
    .constant('RealTime','http://104.155.232.234:5601/app/kibana')
     .constant('ReportDevelopment','http://104.155.232.234:443/')
    .constant('RealTime','http://104.155.232.234/#/dashboard/file/default.json')
  
    .constant('Digin_LogoUploader', 'http://digin.io:8080/')
    .constant('Digin_Auth', 'http://104.155.236.85/')
   .constant('Digin_Tenant', 'http://104.197.27.7:3048')
   .constant('Digin_ObjStore', 'http://104.197.27.7:3000')
