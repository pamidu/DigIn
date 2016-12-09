 angular.module('configuration', [])
    .constant('Digin_Engine_API', 'http://dev.digin.io:1929/')
    //.constant('Digin_Engine_API', 'http://digin.io:1929/')
    .constant('Digin_Engine_API_Namespace', 'Demo')
    .constant('Digin_Tomcat_Base', 'http://prod.digin.io:9897/')
    .constant('Digin_Domain', 'dev.digin.io')
    .constant('DevStudio', false)
    .constant('RealTime','http://prod.report.digin.io:5601/app/kibana')
    .constant('ReportDevelopment','http://prod.report.digin.io:5488/')
   // .constant('RealTime','http://104.155.232.234/#/dashboard/file/default.json')
  
    .constant('Digin_LogoUploader', 'http://prod.digin.io:8080/')
    .constant('Digin_Auth', 'http://dev.digin.io/')
   //.constant('Digin_Tenant', 'http://prod.auth.digin.io:3048')
   .constant('Digin_Tenant', 'http://digin.duoworld.com:3048/')
   .constant('Digin_ObjStore', 'http://dev.auth.digin.io:3000/')

    //#for loggin process
    .constant('IsLocal', true)
    .constant('Local_Shell_Path', 'http://localhost:8081/DigIn/shell/')
    .constant('report_Widget_Iframe', 'http://prod.digin.io/Reports/HourlyCallSummery_HBL/HourlyCallSummery_HBL.pdf')

    //#for onsite implementation (Note : for on prem  version onsite=true, for cloud version onsite=false)
    .constant('onsite', true)   