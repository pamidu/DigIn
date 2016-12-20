angular.module('configuration', [])
    .constant('Digin_Engine_API', 'http://dev.digin.io:1929/')
    .constant('Digin_Engine_API_Namespace', 'Demo')
    .constant('Digin_Tomcat_Base', 'http://dev.digin.io:9897/')
    .constant('Digin_Domain', 'dev.digin.io')
    .constant('DevStudio', false)
    .constant('ReportDevelopment','http://prod.report.digin.io:5488/')
    .constant('Digin_LogoUploader', 'http://dev.digin.io:8080/')
    .constant('Digin_Auth', 'http://dev.digin.io/')
    .constant('Digin_Tenant', 'http://digin.duoworld.com:3048')
    .constant('Digin_ObjStore', 'http://digin.duoworld.com:3000')
    //#for loggin process
    .constant('IsLocal', false)
    .constant('Local_Shell_Path', 'http://localhost:8081/DigIn/shell')
    .constant('report_Widget_Iframe', 'http://dev.digin.io/Reports/HourlyCallSummery_HBL/HourlyCallSummery_HBL.pdf')
    //#apis folder path inside the html folder ** NOTE : if apis folder in -->html/apis/ then apis_path--> '/apis/'
    .constant('apis_Path', '/apis/')
    .constant('auth_Path', '/auth/')
    .constant('include_Path', '/include/')
    //#for onsite implementation (Note : for on prem  version onsite=true, for cloud version onsite=false)
    .constant('onsite', false)   
    .constant('tenantId','test')
    //#Database type --> mssql, postgresql,bigquery,mysql
    .constant('dbType', 'bigquery')  

    
