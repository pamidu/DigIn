<!DOCTYPE html>
<html ng-app="DuoDiginRt" >
<head>
    <title>DigIn - Beyond BI</title>
    <meta charset="utf-8">    
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- DigIn UI -->
    <!-- OWNER : SAJEETHARAN SINNATHURAI -->
    <!-- Who ever wants to add new references should notify sajeetharan -->
    <!-- DigIn Cascading Stylesheet -->
      <link rel="shortcut icon" href="styles/css/images/innerlogo.ico">
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css"/> 
    <link rel="stylesheet" href="bower_components/bootstrap/less/glyphicons.less"/>
    <link rel="stylesheet" type="text/css" href="bower_components/angular-bootstrap-colorpicker/css/colorpicker.css">
    <link rel="stylesheet" href="bower_components/angular-material/angular-material.css">   
     <link rel="stylesheet" href="http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"> 
    <link rel="stylesheet" type="text/css" href="styles/css/directive_library.css">
    <link rel="stylesheet" type="text/css" href="styles/css/pivot.css"/> 
    <link rel="stylesheet" href="bower_components/angular-gridster/dist/angular-gridster.min.css"/> 
    <link rel="stylesheet" type="text/css" href="styles/css/style.css">
    <link rel="stylesheet" type="text/css" href="styles/css/admin1.css">
    <link rel="stylesheet" type="text/css" href="styles/css/common-data-src.css"> 
    <link rel="stylesheet" type="text/css" href="styles/css/accordion.css">
    <link rel="stylesheet" type="text/css" href="styles/css/indicator.css">
    <link rel="stylesheet" href="styles/css/fullcalendar.css"/>  
    <link href="styles/css/widgetSettings.css" rel="stylesheet">  
    <link rel="stylesheet" href="styles/fonts/font-awesome/font-awesome.min.css" type='text/css'/>
    <link rel="stylesheet" href="styles/fonts/digin-main/digin-main.css" type='text/css'/>
    <link rel="stylesheet" href="bower_components/angular-ui/angular-ui-select2/select2.min.css" type="text/css"/>
    <link rel="stylesheet" href="bower_components/angular-ui/anuglar-bootstrap-datepicker/angular-bootstrap-datepicker.css" type="text/css"/>
    <link rel="stylesheet" href="styles/fonts/digin-chart/digin-chart.css" type='text/css'/>
    <link rel="stylesheet" href="styles/fonts/themify/themify-icons.css" type='text/css'/>
    <link rel="stylesheet" href="styles/css/digin-on-board.css"/>
    <link rel="stylesheet" href="styles/css/animate.css"/>
    <link rel="stylesheet" href="styles/css/widget-style.css" type='text/css'/>
    <link rel="stylesheet" href="bower_components/notification/ng-Toast/ngToast.min.css" type="text/css"/>
    <link rel="stylesheet" href="styles/css/hover.css" type='text/css'/>
    <link rel="stylesheet" href="bower_components/angular-ui/angular-ui-select2/select2-bootstrap.min.css"
          type='text/css'/> 
    <link rel="stylesheet" href="bower_components/tag-input/ng-tags-input.min.css"/>
    <link rel="stylesheet" href="styles/css/customer.css" type='text/css'/>
    <link rel="stylesheet" href="bower_components/v-accordion/v-accordion.min.css" type='text/css'/>
    <link rel="stylesheet" href="styles/css/customer-1.0.css" type='text/css'/>
    <link rel="stylesheet" href="styles/css/socialMedFb.css" type="text/css"/>
    <link href='https://fonts.googleapis.com/css?family=Ek+Mukta:200,300' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,500,700,300,100' rel='stylesheet' type='text/css'>
    <meta name="google-signin-client_id" content="259839742765-nq163rith421537lnfjt5dor1gr8c3jn.apps.googleusercontent.com">
    <script type="text/javascript" src="//platform.linkedin.com/in.js">        
        api_key: 816rs443i7o0rf
        authorize: true
        scope: r_basicprofile
        r_emailaddress
    </script>
    <script src="https://apis.google.com/js/client.js"></script>     
</head>
<body layout="column" ng-cloak>
    <div ui-view layout="column" id="mainContainer" style="height: 100%">
    </div>
</body>
<script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="bower_components/jquery-ui/jquery-ui.js"></script>
<script type="text/javascript" src="bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min.js"></script>
<script type="text/javascript" src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script> 
<script type="text/javascript" src="bower_components/angular-ui/angular-ui-select2/select2.min.js"></script>
<script type="text/javascript" src="bower_components/angular/angular.min.js"></script>
<script type="text/javascript" src="bower_components/angular-animate/angular-animate.js"></script>
<script type="text/javascript" src="bower_components/angular-aria/angular-aria.js"></script> 
<script type="text/javascript" src="bower_components/angular-material/angular-material.js"></script>
<script type="text/javascript" src="bower_components/angular-bootstrap/ui-bootstrap.min.js"></script>
<script type="text/javascript" src="bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
<script type="text/javascript" src="bower_components/d3/d3.js"></script>
<script type="text/javascript" src="bower_components/underscore/underscore.js"></script>
<script type="text/javascript" src="bower_components/hammerjs/hammer.js"></script>
<script type="text/javascript" src="bower_components/notification/ng-Toast/ngToast.min.js"></script>
<script type="text/javascript" src="bower_components/v-accordion/v-accordion.min.js"></script>
<script type="text/javascript" src="bower_components/ngSlimscroll/src/js/ngSlimscroll.js"></script>
<script type="text/javascript" src="bower_components/imgcrop/ng-img-crop.js"></script> 
<script type="text/javascript" src="bower_components/moment/moment.js"></script> 
<script type="text/javascript" src="bower_components/angular-moment/angular-moment.min.js"></script>
<script type="text/javascript" src="bower_components/anuglar-drag-drop/drag/dragdrop.js"></script>
<script type="text/javascript" src="bower_components/anuglar-drag-drop/ngDraggable.js"></script>
<script type="text/javascript" src="bower_components/angularjs-fullscreen/dist/angularjs-fullscreen.js"></script>
<script type="text/javascript" src="bower_components/angular-ui-router/release/angular-ui-router.js"></script>
<script type="text/javascript" src="bower_components/ngstorage/ngStorage.js"></script>
<script type="text/javascript" src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>

<script type="text/javascript" src="bower_components/intro.js/minified/intro.min.js"></script>
<script type="text/javascript" src="bower_components/FileSaver/FileSaver.js"></script>
<script type="text/javascript" src="bower_components/mdchips/md-chips-select.js"></script>
<script type="text/javascript" src="bower_components/angular-strap/dist/angular-strap.min.js"></script>
<script type="text/javascript" src="bower_components/angular-ui/build/angular-ui.min.js"></script>
<script type="text/javascript" src="bower_components/angular-ui/angular-ui-select2/select2.min.js"></script>
<script type="text/javascript" src="bower_components/angular-ui/angular-ui-select2/select2.js"></script>
<script type="text/javascript" src="bower_components/pouchdb/dist/pouchdb.js"></script>
<script type="text/javascript" src="bower_components/angular-pouchdb/angular-pouchdb.js"></script>
<script type="text/javascript" src="bower_components/pdf/canvas2image.js"></script>
<script type="text/javascript" src="bower_components/pdf/base64.js"></script>
<script type="text/javascript" src="bower_components/pdf/html2canvas.js"></script>

<script type="text/javascript" src="bower_components/ng-file-upload-shim/ng-file-upload.min.js"></script>
<script type="text/javascript" src="bower_components/pdf/jspdf.debug.js"></script>
<script type="text/javascript" src="bower_components/FileSaver/FileSaver.js"></script>
<script type="text/javascript" src="bower_components/angular-messages/angular-messages.js"></script>
<script type="text/javascript" src="bower_components/google-map/lodash.min.js"></script>
<script type="text/javascript" src="bower_components/google-map/angular-simple-logger.js"></script>
<script type="text/javascript" src="bower_components/angular-google-plus/dist/angular-google-plus.min.js"></script>
<script type="text/javascript" src="bower_components/at-table/dist/angular-table.js"></script> 
<script type="text/javascript" src="bower_components/angular-utils-pagination/dirPagination.js"></script>
<script type="text/javascript" src="bower_components/highcharts/highcharts.js"></script>
<script type="text/javascript" src="bower_components/highcharts/modules/drilldown.js"></script>
<script type="text/javascript" src="bower_components/highcharts/modules/funnel.js"></script>
<script type="text/javascript" src="bower_components/highcharts/modules/exporting.js"></script>
<script type="text/javascript" src="bower_components/highcharts/modules/map.js"></script>
<script type="text/javascript" src="bower_components/highcharts/highcharts-more.js"></script>
<!--DigIn Module and Config   -->
<script type="text/javascript" src="scripts/app.js"></script>
<script type="text/javascript" src="scripts/config.js"></script>
<!--DigIn Controllers -->
<script type="text/javascript" src="scripts/controllers/login.js"></script>
<script type="text/javascript" src="scripts/controllers/welcomePageCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/SignUpMain.js"></script>
<script type="text/javascript" src="scripts/controllers/sourceAlgorithm/sourceAlgorithmCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/help/videoCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/data-source/dataSourceCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/NavCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/DiginCore.js"></script>
<script type="text/javascript" src="scripts/controllers/DiginCore2.js"></script>
<script type="text/javascript" src="scripts/controllers/DashboardshareCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/chartSettingsCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/shareEmailClients.js"></script>
<script type="text/javascript" src="scripts/controllers/socialGraph/socialGraphCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/socialGraph/SocialAnalysisCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/socialGraph/socialGraphFBCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/socialGraph/socialGraphTwitterCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/sales-forecast/salesForecast.js"></script>
<script type="text/javascript" src="scripts/controllers/setup/dashboardSetupCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/query-builder/queryBuilderCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/dynamically-report-builder/dynamicallyReportCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/help/welcomeSearchBarCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/widgetCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/CommonDataSrcCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/ExcelCtrl.js"></script> 
<script type="text/javascript" src="scripts/controllers/profile-settings/userProfileCtrl.js"></script>
<script type="text/javascript" src="scripts/loginBackground.js"></script>
<!--DigIn Directives -->
<script type="text/javascript" src="scripts/directives/commonData.js"></script>
<script type="text/javascript" src="scripts/directives/googleMaps.js"></script>
<script type="text/javascript" src="scripts/directives/calendar.js"></script>
<script type="text/javascript" src="scripts/directives/postRender.js"></script>
<script type="text/javascript" src="scripts/directives/accordion.js"></script>
<script type="text/javascript" src="scripts/directives/resizeable.js"></script>
<script type="text/javascript" src="scripts/directives/droppable.js"></script>
<script type="text/javascript" src="scripts/directives/draggable.js"></script>
<script type="text/javascript" src="scripts/directives/validNumber.js"></script>
<script type="text/javascript" src="scripts/directives/directivelibrary.js"></script>
<script type="text/javascript" src="scripts/directives/diginDirectives.js"></script>
<script type="text/javascript" src="scripts/directives/diginChart.js"></script>
<!--DigIn Services-->
<script type="text/javascript" src="scripts/services/ProfileService.js"></script>
<script type="text/javascript" src="scripts/services/ObjectStoreService.js"></script>
<script type="text/javascript" src="scripts/services/filterService.js"></script>
<script type="text/javascript" src="scripts/services/CommonDataService.js"></script>
<script type="text/javascript" src="scripts/services/ShareWidgetService.js"></script>
<script type="text/javascript" src="scripts/services/QueryBuilderService.js"></script>
<script type="text/javascript" src="scripts/services/ReportService.js"></script>
<!--DigIn Factories-->
<script type="text/javascript" src="scripts/factories/socialMedia/twitterService.js"></script>
<script type="text/javascript" src="scripts/factories/CommonSrcFact.js"></script>
<script type="text/javascript" src="scripts/factories/dynamicallyReport/dynamicallyReportFact.js"></script>
<script type="text/javascript" src="scripts/factories/Dashboard.js"></script>
<script type="text/javascript" src="scripts/factories/getTableDataFactories.js"></script>
<script type="text/javascript" src="scripts/custom/fbInterface.js"></script>
<script type="text/javascript" src="scripts/custom/utility.js"></script>
<script type="text/javascript" src="scripts/custom/linkedinInterface.js"></script>
<script type="text/javascript" src="scripts/custom/diginservicehandler.js"></script>
<script type="text/javascript" src="scripts/factories/aggregator.js"></script>
<!-- Digin references from various vendor -->
<script type="text/javascript" src="scripts/vendor/pivot.js"></script>
<script type="text/javascript" src="scripts/vendor/TweenMax.min.js"></script>
<script type="text/javascript" src="scripts/vendor/videogular.js"></script>
<script type="text/javascript" src="scripts/vendor/vg-controls.js"></script>
<script type="text/javascript" src="scripts/vendor/youtube.js"></script>

<script type="text/javascript" src="scripts/vendor/d3.layout.cloud.js"></script> 
<script type="text/javascript" src="scripts/vendor/angular-socialshare.min.js"></script>
<script type="text/javascript" src="scripts/vendor/fullcalendar.js"></script>
<script type="text/javascript" src="scripts/vendor/gcal.js"></script>
<script type="text/javascript" src="scripts/vendor/highcharts-ng.js"></script>
<script type="text/javascript" src="scripts/vendor/uimicrokernel.js"></script>
<script type="text/javascript" src="scripts/vendor/diginmap/world.js"></script>
<script type="text/javascript" src="scripts/vendor/diginmap/data.js"></script>
<script type="text/javascript" src="scripts/vendor/diginmap/lk-all.js"></script>
<script type="text/javascript" src="scripts/vendor/diginmap/drilldown.js"></script>
<script type="text/javascript" src="scripts/vendor/diginmap/us-all.js"></script>
<script type="text/javascript" src="scripts/vendor/diginmap/world-continents.js"></script>
<script type="text/javascript" src="scripts/vendor/diginmap/asia.js"></script>
<script type="text/javascript" src="scripts/vendor/diginmap/oceania.js"></script>
<script type="text/javascript" src="scripts/vendor/diginmap/europe.js"></script>
<script type="text/javascript" src="scripts/vendor/diginmap/north-america.js"></script>
<script type="text/javascript" src="scripts/vendor/diginmap/south-america.js"></script> 
<!-- <script src="http://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js"></script> -->
<!-- Online Libraries -->
<script type="text/javascript" src='https://maps.googleapis.com/maps/api/js?key=AIzaSyANY96AhQijBZgSXQ6RWkYUlO5fxCh6OMU&sensor=false'></script>
<script type="text/javascript" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/98887/angular-fullscreen.js"></script>

<script>
   google.load('search', '1');
   google.load("feeds", "1");
 </script>

</html>
