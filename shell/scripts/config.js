angular.module('configuration', [])
 .constant('Digin_Engine_API', 'http://prod.digin.io:1929/')
    .constant('Digin_Tomcat_Base', 'http://digin.io:9897/')
    .constant('Digin_Domain', 'prod.digin.io')
    .constant('DevStudio', false)
    .constant('RealTime','http://report.digin.io:5601/app/kibana')
    .constant('ReportDevelopment','http://report.digin.io:5488/')
   .constant('Digin_LogoUploader', 'http://104.196.131.251:8080/')
    .constant('Digin_Auth', 'http://digin.io/')
   .constant('Digin_Tenant', 'http://prod.auth.digin.io:3048')
   .constant('Digin_ObjStore', 'http://auth.digin.io:3000')
   .constant('IsLocal', true)
   .constant('report_Widget_Iframe', 'http://digin.io/Reports/HourlyCallSummery_HBL/HourlyCallSummery_HBL.pdf')
  .constant('digind3', 'http://digin.io/digind3/')
 .constant("sales_distribution","http://digin.io/samples/")
 .constant('Local_Shell_Path', 'http://localhost:8081/DigIn/shell')