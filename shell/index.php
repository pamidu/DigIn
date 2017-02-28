<!DOCTYPE html>
<?php 
/*
////////////////////////////////
// File : index.php
// Owner  : Sajeetharan
// Last changed date : 2017/01/06
// Version : 3.1.1.2
// Modified By : Sajeetharan
////////////////////////////////
*/
    if(! empty($_SERVER['HTTP_USER_AGENT'])){
        $useragent = $_SERVER['HTTP_USER_AGENT'];
        if( preg_match('@(iPad|iPod|iPhone|Android|BlackBerry|SymbianOS|SCH-M\d+|Opera Mini|Windows CE|Nokia|SonyEricsson|webOS|PalmOS)@', $useragent) ){
            header('Location: ../cleanshell/');
        }
    }
    //var_dump($_SERVER['DOCUMENT_ROOT']) ; exit();
     if ($_SERVER['DOCUMENT_ROOT']=="/var/www/html"){
        require_once($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
        require_once($_SERVER['DOCUMENT_ROOT'] . "/include/session.php");
     }
     else{
        require_once($_SERVER['DOCUMENT_ROOT'] . "/Digin/include/config.php");
        require_once($_SERVER['DOCUMENT_ROOT'] . "/Digin/include/session.php");
     }
    INTS();
    if(!isset($_COOKIE["securityToken"])){
        //var_dump($mainDomain);
        header("Location: http://".$mainDomain."/entry");
        exit(); 
    }
?>

<html ng-app="DuoDiginRt" ng-controller="NavCtrl">
<head>
    <title>DigIn - Beyond BI</title>
    <link rel="shortcut icon" href="./styles/css/images/innerlogo.ico" type="image/png">
    <link rel="stylesheet" href="styles/css/commonstyle.css">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="google-signin-client_id" content="259839742765-nq163rith421537lnfjt5dor1gr8c3jn.apps.googleusercontent.com">
    <link rel="shortcut icon" href="styles/css/images/innerlogo.ico">
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css"/> 
    <link rel="stylesheet" href="bower_components/angular-material/angular-material.css"> 
    <!--link rel="stylesheet" type="text/css" href="bower_components/codemirror/lib/codemirror.css"-->
    <link rel="stylesheet" type="text/css" href="styles/css/directive_library.css">
    <link rel="stylesheet" type="text/css" href="styles/css/pivot.css"/>
    <!-- angular gridster -->
    <link rel="stylesheet" href="bower_components/angular-gridster/dist/angular-gridster.min.css"/>
    <!-- <link rel="stylesheet" type="text/css" src="bower_components/mdchips/md-chips-select.css"/> -->
    <link rel="stylesheet" href="bower_components/angular-slider/rzslider.min.css"/>
	<link rel="stylesheet" type="text/css" href="styles/css/index.css">
    <link rel="stylesheet" type="text/css" href="styles/css/style.css">
    <link rel="stylesheet" type="text/css" href="styles/css/admin1.css">
	<link rel="stylesheet" type="text/css" href="styles/css/layout.css">
    <link rel="stylesheet" type="text/css" href="styles/css/common-data-src.css">
    <!-- nv.d3.css commented for testing pursoses -->
    <!-- <link rel="stylesheet" href="styles/css/nv.d3.css"> -->
    <link rel="stylesheet" type="text/css" href="styles/css/accordion.css">
    <!--link rel="stylesheet" type="text/css" href="styles/css/indicator.css"-->
    <link rel="apple-touch-icon" href="../../assets/globals/img/icons/apple-touch-icon.png">
    <!-- <link rel="stylesheet" href="styles/css/DiginD3.css"/> -->
    <!-- event calendar -->
    <link rel="stylesheet" href="styles/css/fullcalendar.css"/>
    <!-- event calendar -->
    <!-- Add IntroJs styles -->
    <link href="styles/css/introjs.css" rel="stylesheet">
    <link href="styles/css/widgetSettings.css" rel="stylesheet">
    <link rel="stylesheet" href="styles/fonts/font-awesome/font-awesome.min.css" type='text/css'/>
    <!-- damith
        -- web font
        -- google font
        -- customer css
        -- widget style
        -- ng tag input
        -->
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
    <link rel="stylesheet" href="bower_components/angular-ui/angular-ui-select2/select2-bootstrap.min.css" type='text/css'/>
    <link rel="stylesheet" href="bower_components/tag-input/ng-tags-input.min.css"/>
    <link rel="stylesheet" href="styles/css/customer.css" type='text/css'/>
    <link rel="stylesheet" href="bower_components/v-accordion/v-accordion.min.css" type='text/css'/>
    <link rel="stylesheet" href="styles/css/customer-1.0.css" type='text/css'/>  
    <link rel="stylesheet" href="styles/css/md-steppers.css" type="text/css"/>
    <!--link href='https://fonts.googleapis.com/css?family=Ek+Mukta:200,300' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,500,700,300,100' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Dosis:700' rel='stylesheet' type='text/css'-->   
    <link rel="stylesheet" href="styles/css/cellCursor.css" type='text/css'/>
    <!-- image crop -->
    <link rel="stylesheet" href="bower_components/imgcrop/ng-img-crop.css"/> 
    <!-- <link href="http://vjs.zencdn.net/5.8.0/video-js.css" rel="stylesheet"> -->
    <!--script type="text/javascript" src="//platform.linkedin.com/in.js"-->  
    <script type="text/javascript" src="scripts/otherLibraries/in.js"> 
        //api_key: 78itfewa96mm93   //2.33
        api_key: 816rs443i7o0rf
        authorize: true
        scope: r_basicprofile
        r_emailaddress
    </script>
    <!--script src="https://apis.google.com/js/client.js"></script--> 
    <script type="text/javascript" src="scripts/otherLibraries/client.js"></script>
    <style type="text/css">
        .ui-resizable {
            position: absolute !important;
        }
    </style>
     <!-- If you'd like to support IE8 -->
        <!-- script src="http://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js"></script-->
        <script type="text/javascript" src="bower_components/video.js/dist/ie8/videojs-ie8.min.js"></script>
</head>
<body layout="column" ng-cloak>
    <md-content style="height: 100%;background:transparent" ui-view layout="column" id="mainContainer" md-theme="{{$root.theme}}">
    </md-content>
</body>
<!--  new changes  -->
<!-- search end -->
<!--script type="text/javascript" src="scripts/vendor/prefixfree.min.js"></script>
<script type="text/javascript" src='scripts/vendor/jquery.js'></script-->
<script type="text/javascript" src="scripts/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.js"></script>
<script type="text/javascript" src="bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min.js"></script>
<!--script type="text/javascript" src="http://html2canvas.hertzen.com/build/html2canvas.js"></script-->
<script type="text/javascript" src="scripts/vendor/jquery.jsPlumb-1.4.1-all-min.js"></script>
<!--script type="text/javascript" src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script type="text/javascript" src="bower_components/bootstrap-colorpicker/js/bootstrap-colorpicker.js"></script-->
<script type="text/javascript" src="scripts/vendor/twitteroauth.js"></script>
<script type="text/javascript" src="bower_components/angular-ui/angular-ui-select2/select2.min.js"></script>
<script type="text/javascript" src="bower_components/angular/angular.min.js"></script>
<script type="text/javascript" src="bower_components/angular-route/angular-route.js"></script>
<script type="text/javascript" src="bower_components/angular-animate/angular-animate.js"></script>
<script type="text/javascript" src="bower_components/angular-aria/angular-aria.js"></script>
<script type="text/javascript" src="bower_components/angular-material/angular-material.js"></script>

<script type="text/javascript" src="bower_components/highcharts/highstock.js"></script>
<!-- <script src="http://code.highcharts.com/highcharts.js"></script>  -->
<script type="text/javascript" src="scripts/vendor/highcharts-ng.js"></script>
<script type="text/javascript" src="bower_components/highcharts/modules/exporting.js"></script>
<script type="text/javascript" src="bower_components/highcharts/modules/drilldown.js"></script>
<script type="text/javascript" src="scripts/vendor/google-picker.min.js"></script>
<!--script type="text/javascript" src="http://d3js.org/d3.v3.min.js"--></script>
<script type="text/javascript" src="bower_components/d3/d3.min.js"></script>
<script src="scripts/otherLibraries/dimple.v2.1.6.min.js"></script>
<script type="text/javascript" src="bower_components/underscore/underscore.js"></script>
<script type="text/javascript" src="scripts/config.js"></script>
<!--script type="text/javascript" src="scripts/vendor/oauth.js"></script>
<!--script type="text/javascript" src="scripts/vendor/zoom.js"></script>
<script type="text/javascript" src="scripts/vendor/global-vendors.js"></script-->
<script type="text/javascript" src="scripts/vendor/angular-socialshare.min.js"></script>
<!--script type="text/javascript" src="scripts/vendor/angular-css-injector.js"></script-->
<script type="text/javascript" src="bower_components/notification/ng-Toast/ngToast.min.js"></script>
<script type="text/javascript" src="bower_components/v-accordion/v-accordion.min.js"></script>
<!--script type="text/javascript" src="bower_components/ngSlimscroll/src/js/ngSlimscroll.js"></script-->
<!-- image crop -->
<script type="text/javascript" src="bower_components/imgcrop/ng-img-crop.js"></script>
<script src="bower_components/tag-input/ng-tags-input.min.js"></script>
<script src="bower_components/cell-cursor-develop/cellCursor.js"></script>
<!-- codemirror>
<script type="text/javascript" src="bower_components/codemirror/lib/codemirror.js"></script>
<script type="text/javascript" src="bower_components/codemirror/addon/display/placeholder.js"></script>
<!-- canvastoblob -->
<script type="text/javascript" src="bower_components/canvas-toBlob.js/canvas-toBlob.js"></script>
<!-- event calendar -->
<script type="text/javascript" src="scripts/vendor/moment.js"></script>
<!-- angularJS moment-->
<script type="text/javascript" src="bower_components/angular-moment/angular-moment.min.js"></script>
<!-- angular slider -->
<script type="text/javascript" src="bower_components/angular-slider/rzslider.min.js"></script>
<!--script type="text/javascript" src="bower_components/anuglar-drag-drop/drag/dragdrop.js"></script>
<script type="text/javascript" src="bower_components/anuglar-drag-drop/ngDraggable.js"></script>
<script type="text/javascript" src="bower_components/anuglar-drag-drop/ui-sortable-angular.js"></script-->
<script type="text/javascript" src="scripts/directives/calendar.js"></script>
<script type="text/javascript" src="scripts/vendor/fullcalendar.js"></script>
<script type="text/javascript" src="bower_components/fullcalendar/dist/gcal.js"></script>
<!-- script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.9.0/gcal.js"></script-->
<!-- filesaver -->
<script type="text/javascript" src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
<script type="text/javascript" src="bower_components/ngstorage/ngStorage.js"></script>
<!-- PouchDB -->
<script type="text/javascript" src="bower_components/pouchdb/dist/pouchdb.js"></script>
<script type="text/javascript" src="bower_components/angular-pouchdb/angular-pouchdb.min.js"></script>

<!-- html2canvas -->
<script type="text/javascript" src="scripts/custom/utility.js"></script>
<script type="text/javascript" src="scripts/app.js"></script>
<script type="text/javascript" src="scripts/controllers/welcomePageCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/help/videoCtrl.js"></script>
<!--script type="text/javascript" src="scripts/controllers/data-source/dataSourceCtrl.js"></script-->

<!--download pdf-->
<script type="text/javascript" src="bower_components/saveSvgAsPng/saveSvgAsPng.js"></script>
<script type="text/javascript" src="bower_components/jspdf/dist/jspdf.debug.js"></script>

<script type="text/javascript" src="bower_components/pdf/canvas2image.js"></script>
<script type="text/javascript" src="bower_components/pdf/base64.js"></script>
<script type="text/javascript" src="bower_components/pdf/html2canvas.js"></script>
<script type="text/javascript" src="bower_components/pdf/jspdf.debug.js"></script>


<!-- services start -->
<script type="text/javascript" src="scripts/services/ObjectStoreService.js"></script>
<script type="application/javascript" src="scripts/services/CommonDataService.js"></script>
<script type="application/javascript" src="scripts/services/fbGraphServices.js"></script>
<script type="text/javascript" src="scripts/factories/socialMedia/twitterService.js"></script>
<script type="text/javascript" src="scripts/services/filterService.js"></script>
<script type="text/javascript" src="scripts/services/metricChartServices.js"></script>
<script type="text/javascript" src="scripts/services/QueryBuilderService.js"></script>

<!-- services end -->

<script type="text/javascript" src="scripts/services/ShareWidgetService.js"></script>
<script type="text/javascript" src="scripts/services/pouchDbServices.js"></script>
<script type="text/javascript" src="scripts/services/saveDashboardService.js"></script>
<script type="text/javascript" src="scripts/services/tabularService.js"></script>


<!--  directives start  -->
<script type="application/javascript" src="scripts/directives/commonData.js"></script>
<script type="application/javascript" src="scripts/directives/googleMaps.js"></script>

<!--  directives end    -->

<script type="text/javascript" src="bower_components/circular-json-master/build/circular-json.js"></script>

<script type="text/javascript" src="scripts/services/ProfileService.js"></script>

<!-- controller -->
<script type="text/javascript" src="scripts/controllers/NavCtrl.js"></script>
<script type="text/javascript" src="views/home/homeCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/DiginCore.js"></script>
<script type="text/javascript" src="scripts/controllers/DiginCore2.js"></script>
<script type="text/javascript" src="scripts/controllers/DashboardshareCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/shareEmailClients.js"></script>
<script type="text/javascript" src="scripts/directives/plumbItem.js"></script>
<script type="text/javascript" src="scripts/directives/postRender.js"></script>
<script type="text/javascript" src="scripts/directives/accordion.js"></script>
<script type="text/javascript" src="scripts/directives/resizeable.js"></script>
<!--script type="text/javascript" src="scripts/directives/droppable.js"></script>
<script type="text/javascript" src="scripts/directives/draggable.js"></script-->
<script type="text/javascript" src="scripts/directives/directivelibrary.js"></script>

<script type="text/javascript" src="scripts/services/ReportService.js"></script>
<script type="text/javascript" src="bower_components/FileSaver/FileSaver.js"></script>
<script type="text/javascript" src="scripts/controllers/socialGraph/socialGraphCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/d3PluginCtrl.js"></script>
 
<script type="text/javascript" src="bower_components/highcharts/modules/funnel.js"></script>

<script type="text/javascript" src="scripts/controllers/socialGraph/SocialAnalysisCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/socialGraph/socialGraphFBCtrl.js"></script>
<script type="text/javascript" src="scripts/directives/diginDirectives.js"></script>
<script type="text/javascript" src="scripts/controllers/socialGraph/socialGraphTwitterCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/sales-forecast/salesForecast.js"></script>
<script type="text/javascript" src="scripts/controllers/setup/dashboardSetupCtrl.js"></script>
<script type="text/javascript" src="scripts/factories/CommonSrcFact.js"></script>
<script type="text/javascript" src="views/query/queryBuilderCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/dynamically-report-builder/dynamicallyReportCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/help/welcomeSearchBarCtrl.js"></script>
<script type="text/javascript" src="scripts/factories/dynamicallyReport/dynamicallyReportFact.js"></script>

<!-- profile
<script type="text/javascript" src="scripts/factories/profile/profileFact.js"></script> -->
<script type="text/javascript" src="scripts/controllers/profile-settings/userProfileCtrl.js"></script>

<!--  controllers end   -->
<!-- zeroclipboard -->
<script type="text/javascript" src="bower_components/zeroclipboard/ZeroClipboard.min.js"></script>
<script type="text/javascript" src="scripts/factories/Dashboard.js"></script>
<script type="text/javascript" src="scripts/factories/getTableDataFactories.js"></script>
<script type="text/javascript" src="scripts/services/RealTimeService.js"></script>
<script type="text/javascript" src="scripts/services/AnalyticsService.js"></script>
<script type="text/javascript" src="scripts/vendor/indicator.js"></script>
<script type="text/javascript" src="scripts/directives/indicatorWidget.js"></script>
<script type="text/javascript" src="scripts/custom/fbInterface.js"></script>
<script type="text/javascript" src="scripts/custom/linkedinInterface.js"></script>
<script type="text/javascript" src="scripts/vendor/uimicrokernel.js"></script>
<script type="text/javascript" src="scripts/custom/diginservicehandler.js"></script>
<script type="text/javascript" src="scripts/factories/aggregator.js"></script>
<script type="text/javascript" src="scripts/controllers/widgetCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/CommonDataSrcCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/ExcelCtrl.js"></script>


<!-- Material Icons>
<script type="text/javascript" src="//cdn.jsdelivr.net/angular-material-icons/0.4.0/angular-material-icons.min.js"></script>
<script type="text/javascript" src="scripts/vendor/layout.js"></script-->
<!-- svg to canvas -->
<script type="text/javascript" src="scripts/vendor/pleasure.js"></script>
 
 
<script type="text/javascript" src="scripts/controllers/angular-touch.js"></script>
<!-- raw -->
<script type="text/javascript" src="scripts/controllers/DiginD3.js"></script>
<!-- charts -->
<script src="scripts/charts/treemap.js"></script>
<script src="scripts/controllers/prediction/prediction.js"></script>

<!--feature wise dashboardCtrl-->
<script src="views/dashboard/dashboardCtrl.js"></script>

<!--feature wise excelUpload-->
<script src="views/widgets/excelFileUpload/excelFileUploadCtrl.js"></script>

<!--feature wise myAccount-->
<script src="views/settings/myAccount/myAccountCtrl.js"></script>

<!--feature wise userAdministrator-->
<script src="views/settings/userAdministrator/userAdministratorCtrl.js"></script>
<script src="views/settings/userAdministrator/userAdminFactory.js"></script>

<!--feature wise theming-->
<script src="views/settings/theme/themeCtrl.js"></script>
<script src="views/settings/theme/themingConfig.js"></script>

<!--sytem settings-->
<script src="views/settings/systemSettings/systemSettings.js"></script>
<script src="views/settings/systemSettings/showFolderDetailsCtrl.js"></script>


<!-- Datasource settings -->
<script src="views/settings/datasourceSettings/datasourceSettingsCtrl.js"></script>
<script src="views/settings/datasourceSettings/datasourceFactory.js"></script>

<!-- Dashboard filter settings -->
<script src="views/settings/dashboardFilterSettings/dashboardFilterSettingsCtrl.js"></script>
<script src="views/settings/dashboardFilterSettings/dashboardFilterService.js"></script>

<!-- ShareDashboard settings -->
<script type="text/javascript" src="views/settings/dashboardShare/sharedashboardgroupsCtrl.js"></script>

<!-- ShareDashboard settings -->
<script type="text/javascript" src="views/settings/datasetShare/datasetShareCtrl.js"></script>

<!-- Switch Tenant -->
<script type="text/javascript" src="views/settings/switchTenant/switchTenantCtrl.js"></script>

<script src="views/share-dataset/shareDataSetCtrl.js"></script>
<script src="scripts/charts/d3Force.js"></script>  
<script src="scripts/charts/sunBurst.js"></script> 
<script type="text/javascript" src="scripts/directives/queryBuilderDirective.js"></script>
<!--hight charts update damith -->
<!-- // <script type="text/javascript" src="bower_components/highcharts/highcharts.js"></script> -->
<!--script type="text/javascript" src="bower_components/highcharts/highcharts-more.js"></script-->
<script type="text/javascript" src="bower_components/highcharts/highcharts-more.js"></script>
<!-- customize angular gridster -->
<script type="text/javascript" src="scripts/vendor/digin-gridster.js"></script>
<script type="text/javascript" src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<!-- intro -->
<script src="scripts/intro.min.js"></script>
<script src="scripts/angular-intro.min.js"></script>
<script type="text/javascript" src="bower_components/codemirror/lib/codemirror.js"></script>
<script type="text/javascript" src="bower_components/codemirror/addon/display/placeholder.js"></script>
<!-- canvastoblob -->
<script type="text/javascript" src="bower_components/canvas-toBlob.js/canvas-toBlob.js"></script>
<!-- filesaver -->
<script type="text/javascript" src="bower_components/FileSaver/FileSaver.js"></script>
<!-- mdchip -->
<script type="text/javascript" src="bower_components/mdchips/md-chips-select.js"></script>

<!-- md-steppers-->
<script type="text/javascript" src="scripts/md-steppers.js"></script>

<!-- user assistance-->
<script src="views/user_assistance/user_assistanceCtrl.js"></script>

<!-- zeroclipboard -->

<script type="text/javascript" src="bower_components/angular-strap/dist/angular-strap.min.js"></script>
<script type="text/javascript" src="bower_components/angular-ui/build/angular-ui.min.js"></script>
<script type="text/javascript"
        src="bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js"></script>
<script type="text/javascript" src="bower_components/zeroclipboard/ZeroClipboard.min.js"></script>
<script type="text/javascript" src="bower_components/angular-ui/angular-ui-select2/select2.min.js"></script>
<script type="text/javascript" src="bower_components/angular-ui/angular-ui-select2/select2.js"></script>
<script type="text/javascript" src="scripts/otherLibraries/ng-csv.min.js"></script>

<script src="bower_components/google-map/lodash.min.js"></script>
<script type="text/javascript" src="bower_components/highcharts/modules/map.js"></script>

<script  type="text/javascript" src="bower_components/highcharts/modules/drilldown.js"></script>
<script  type="text/javascript" src="http://code.highcharts.com/mapdata/custom/world-continents.js"></script>
 <script src="http://code.highcharts.com/mapdata/custom/world.js"></script>
 <script type="text/javascript" src="scripts/vendor/lk-all.js"></script>
<script  type="text/javascript" src="http://code.highcharts.com/mapdata/custom/asia.js"></script>
<script  type="text/javascript" src="http://code.highcharts.com/mapdata/countries/us/us-all.js"></script> 
<script type="text/javascript" src="bower_components/google-map/angular-simple-logger.js"></script>
<!--script src="https://cdnjs.cloudflare.com/ajax/libs/angular-google-maps/2.3.3/angular-google-maps.min.js"></script-->
<script type="text/javascript" src="bower_components/angular-google-maps/dist/angular-google-maps.min.js"></script>

<!-- marker clusterer -->
<!-- angular google maps -->
<!--script type="text/javascript" src="https://www.google.com/jsapi"></script-->
<script type="text/javascript" src="scripts/otherLibraries/jsapi.js"></script>
<!--script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyANY96AhQijBZgSXQ6RWkYUlO5fxCh6OMU&sensor=false'></script-->
 
<!-- angular google plus -->
<script src="bower_components/angular-google-plus/dist/angular-google-plus.min.js"></script>
<!-- angular at-table -->
<script src="bower_components/at-table/dist/angular-table.js"></script>
 
<!--script type="text/javascript">
    google.load('search', '1');
</script>
<script type="text/javascript">
    google.load("feeds", "1");
</script>
<!-- angular datepicker -->
<script src="scripts/controllers/angular-datepicker.js"></script>
<!-- linq for quering in elastic widget -->
 
<script type="text/javascript" src="bower_components/angular-utils-pagination/dirPagination.js"></script>

<script>
    var script = '<script type="text/javascript" src="src/markerclusterer';
    if (document.location.search.indexOf('compiled') !== -1) {
        script += '_compiled';
    }
    script += '.js"><' + '/script>';
    document.write(script);
</script>

<!--  new changes  -->
<script type="text/javascript" src="bower_components/angular-messages/angular-messages.min.js"></script>

<!--script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.15.0/TweenMax.min.js"></script-->
<script type="text/javascript" src="scripts/loginBackground.js"></script>
<!-- ng file upload -->
<!-- <script src="bower_components/ng-file-upload-shim/ng-file-upload-shim.min.js"></script> --> <!-- for no html5 browsers support -->
<script src="bower_components/ng-file-upload-shim/ng-file-upload.min.js"></script>

<!-- video player -->
<script src="scripts/otherLibraries/videoPlayer/videogular.js"></script>
<script src="scripts/otherLibraries/videoPlayer/vg-controls.js"></script>
<script src="scripts/otherLibraries/videoPlayer/youtube.js"></script>

<!-- payment gateway >
<-- script src="https://checkout.stripe.com/checkout.js"--></script>
 <script src="scripts/otherLibraries/checkout.js"></script>
<script src="../boarding/scripts/stripe.payment.tool.js"></script>

<!-- Temporary map -->
<script type="text/javascript" src="map_toBedeleted/tempMapCtrl.js"></script>

<!--script type="text/javascript" src="//code.highcharts.com/modules/drilldown.js"></script-->
<script type="text/javascript" src="//code.highcharts.com/maps/modules/map.js"></script>
<script  type="text/javascript" src="//code.highcharts.com/maps/modules/data.js"></script>
<!--script src="//code.highcharts.com/maps/modules/drilldown.js"></script-->
<script src="//code.highcharts.com/mapdata/countries/us/us-all.js"></script>
<script type="text/javascript" src="map_toBedeleted/world-continents.js"></script>
<script src="//code.highcharts.com/mapdata/custom/asia.js"></script>
<script src="//code.highcharts.com/modules/exporting.js"></script>
<script src="//code.highcharts.com/mapdata/custom/oceania.js"></script>
<script src="//code.highcharts.com/mapdata/custom/europe.js"></script>
<script type="text/javascript" src="map_toBedeleted/lk-all.js"></script>

<script src="//code.highcharts.com/mapdata/custom/south-america.js"></script>
</html>
