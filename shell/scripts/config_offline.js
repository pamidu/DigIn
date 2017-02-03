angular.module('configuration', [])
    .constant('Digin_Engine_API', 'http://onprem.duodigin.lk/DigInEngine/')

    .constant('Digin_Engine_API_Namespace', 'Demo')
    .constant('Digin_Tomcat_Base', 'http://onprem.duodigin.lk:9897/')
    .constant('Digin_Domain', 'onprem.duodigin.lk')
    .constant('DevStudio', false)
    .constant('RealTime','http://dev.report.digin.io:5601/app/kibana')
    .constant('ReportDevelopment','http://prod.report.digin.io:5488/')
 
    .constant('Digin_LogoUploader', 'http://onprem.duodigin.lk:8080/')
    .constant('Digin_Auth', 'http://onprem.duodigin.lk/')
   .constant('Digin_Tenant', 'http://onprem.duodigin.lk:3048')
   .constant('Digin_ObjStore', 'http://onprem.duodigin.lk:3000')

    //#for loggin process
    .constant('IsLocal', true)
    .constant('Local_Shell_Path', 'http://localhost:8080/DigIn/shell')
    .constant('report_Widget_Iframe', 'http://dev.digin.io/Reports/HourlyCallSummery_HBL/HourlyCallSummery_HBL.pdf')

	 //#apis folder path inside the html folder ** NOTE : if apis folder in -->html/apis/ then apis_path--> '/apis/'
    .constant('apis_Path', '/apis/')
    .constant('auth_Path', '/auth/')
    .constant('include_Path', '/include/')
	
    //#for onsite implementation (Note : for on prem  version onsite=true, for cloud version onsite=false)
    .constant('onsite', true)   
    .constant('tenantId','testchamila4')
    .constant('version','V3.2.0.9')
	
    //#Database type --> mssql, postgresql,bigquery,mysql,memsql 
    //Note : onprem -> memsql     cloud -> bigquery
    .constant('dbType', 'memsql')  

