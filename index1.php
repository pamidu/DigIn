<!DOCTYPE html>
<html ng-app="DuoDiginRt" ng-controller="LoginCtrl">
<head>
    <title>Digin - Beyond BI</title>
    <link rel="stylesheet" href="styles/css/commonstyle.css">
    <link rel="stylesheet" href="styles/css/login.css">
    <!--  new changes  -->

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="google-signin-client_id"
          content="259839742765-nq163rith421537lnfjt5dor1gr8c3jn.apps.googleusercontent.com">
    <link rel="shortcut icon" href="styles/css/images/innerlogo.ico">
    <!-- <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css"/> -->
    <link rel="stylesheet" href="bower_components/bootstrap/less/glyphicons.less"/>
    <link rel="stylesheet" type="text/css" href="bower_components/angular-bootstrap-colorpicker/css/colorpicker.css">
    <link rel="stylesheet" href="bower_components/angular-material/angular-material.css">
    <!-- <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/0.9.4/angular-material.min.css"> -->
    <link rel="stylesheet" type="text/css" href="bower_components/codemirror/lib/codemirror.css">
    <!-- <link href="styles/css/material-wfont.css" rel="stylesheet">-->
    <link rel="stylesheet" href="http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.4/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="styles/css/directive_library.css">
    <link rel="stylesheet" type="text/css" href="styles/css/pivot.css"/>
    <!-- angular gridster -->
    <link rel="stylesheet" href="bower_components/angular-gridster/dist/angular-gridster.min.css"/>
    <!-- angular slider -->
    <link rel="stylesheet" type="text/css" href="bower_components/angular-slider/rzslider.min.css">
    <link rel="stylesheet" type="text/css" href="styles/css/style.css">
    <link rel="stylesheet" type="text/css" href="styles/css/admin1.css">
    <link rel="stylesheet" type="text/css" href="styles/css/common-data-src.css">
    <!-- nv.d3.css commented for testing pursoses -->
    <!-- <link rel="stylesheet" href="styles/css/nv.d3.css"> -->
    <link rel="stylesheet" type="text/css" href="styles/css/accordion.css">
    <link rel="stylesheet" type="text/css" href="styles/css/indicator.css">
    <link rel="apple-touch-icon" href="../../assets/globals/img/icons/apple-touch-icon.png">
    <!-- <link rel="stylesheet" href="styles/css/DiginD3.css"/> -->
    <!-- event calendar -->
    <link rel="stylesheet" href="styles/css/fullcalendar.css"/>
    <!-- event calendar -->
    <!-- Add IntroJs styles -->
    <link href="bower_components/intro.js/introjs.css" rel="stylesheet">
    <link href="styles/css/widgetSettings.css" rel="stylesheet">
    <!-- damith
        -- web font
        -- google font
        -- customer css
        -- widget style
        -->
    <link rel="stylesheet" href="styles/fonts/font-awesome/font-awesome.min.css" type='text/css'/>
    <link rel="stylesheet" href="bower_components/angular-ui/angular-ui-select2/select2.min.css" type="text/css"/>
    <link rel="stylesheet"
          href="bower_components/angular-ui/anuglar-bootstrap-datepicker/angular-bootstrap-datepicker.css"
          type="text/css"/>
    <link rel="stylesheet" href="styles/fonts/digin-chart/digin-chart.css" type='text/css'/>
    <link rel="stylesheet" href="styles/fonts/themify/themify-icons.css" type='text/css'/>
    <link rel="stylesheet" href="styles/css/digin-on-board.css"/>
    <link rel="stylesheet" href="styles/css/animate.css"/>
    <link rel="stylesheet" href="styles/css/widget-style.css" type='text/css'/>
    <link rel="stylesheet" href="bower_components/notification/ng-Toast/ngToast.min.css" type="text/css"/>
    <link rel="stylesheet" href="styles/css/hover.css" type='text/css'/>
    <link rel="stylesheet" href="bower_components/angular-ui/angular-ui-select2/select2-bootstrap.min.css"
          type='text/css'/>
    <link rel="stylesheet" href="styles/css/customer.css" type='text/css'/>
    <link rel="stylesheet" href="bower_components/v-accordion/v-accordion.min.css" type='text/css'/>
    <link rel="stylesheet" href="styles/css/customer-1.0.css" type='text/css'/>
    <link rel="stylesheet" href="styles/css/socialMedFb.css" type="text/css"/>
    <link href='https://fonts.googleapis.com/css?family=Ek+Mukta:200,300' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,500,700,300,100' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Dosis:700' rel='stylesheet' type='text/css'>
    <script type="text/javascript" src="//platform.linkedin.com/in.js">
        api_key: 75gasspugsl6ow
        authorize: true
        scope: r_basicprofile
        r_emailaddress
    </script>
     <script src="https://apis.google.com/js/client.js"></script> 
    <style type="text/css">
        .ui-resizable {
            position: absolute !important;
        }
    </style>
    <style rel="stylesheet" href="styles/css/init-dash-setup.css" type="text/css"></style>
    <!--  new changes  -->
</head>
<body>
<div ui-view layout="column" id="mainContainer" style="height:100% !important;">
</div>
</body>
<!--  new changes  -->
<!-- search end -->
<script type="text/javascript" src="scripts/vendor/prefixfree.min.js"></script>
<script type="text/javascript" src='scripts/vendor/jquery.js'></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.js"></script>
<script type="text/javascript" src="bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min.js"></script>
<script type="text/javascript" src="http://mrrio.github.io/jsPDF/dist/jspdf.debug.js"></script>
<script type="text/javascript" src="http://html2canvas.hertzen.com/build/html2canvas.js"></script>
<script type="text/javascript" src="scripts/vendor/jquery.jsPlumb-1.4.1-all-min.js"></script>
<script type="text/javascript" src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script type="text/javascript" src="bower_components/bootstrap-colorpicker/js/bootstrap-colorpicker.js"></script>
<script type="text/javascript" src="scripts/vendor/twitteroauth.js"></script>
<script src="bower_components/angular-ui/angular-ui-select2/select2.min.js"></script>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular.js"></script>
<script src="https://github.highcharts.com/highcharts.src.js"></script>
<script type="text/javascript" src="scripts/vendor/highcharts-ng.js"></script>
<script src="http://code.highcharts.com/modules/exporting.js"></script>
<script type="text/javascript" src="http://code.highcharts.com/modules/drilldown.js"></script>
<script type="text/javascript" src="scripts/vendor/google-picker.min.js"></script>
<script type="text/javascript" src="http://code.highcharts.com/highcharts-3d.js"></script>
<!-- <script type="text/javascript" src="scripts/vendor/Googleinitial.js"></script>  -->

<script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>
<script src="http://dimplejs.org/dist/dimple.v2.1.6.min.js"></script>
<script type="text/javascript" src="bower_components/underscore/underscore.js"></script>
<script type="text/javascript" src="scripts/config.js"></script>
<script type="text/javascript" src="bower_components/angular-material/angular-material.js"></script>
<script type="text/javascript" src="bower_components/angular-animate/angular-animate.js"></script>
<script type="text/javascript" src="bower_components/angular-aria/angular-aria.js"></script>
<script type="text/javascript" src="bower_components/hammerjs/hammer.js"></script>
<script type="text/javascript" src="scripts/vendor/oauth.js"></script>
<script type="text/javascript" src="scripts/vendor/zoom.js"></script>
<script type="text/javascript" src="scripts/vendor/global-vendors.js"></script>
<script type="text/javascript" src="scripts/vendor/angular-socialshare.min.js"></script>
<script type="text/javascript" src="scripts/vendor/angular-css-injector.js"></script>
<script type="text/javascript" src="bower_components/notification/ng-Toast/ngToast.min.js"></script>
<script type="text/javascript" src="bower_components/v-accordion/v-accordion.min.js"></script>
<!-- codemirror -->
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
<script type="text/javascript" src="bower_components/anuglar-drag-drop/drag/dragdrop.js"></script>
<script type="text/javascript" src="bower_components/anuglar-drag-drop/ngDraggable.js"></script>
<script type="text/javascript" src="bower_components/anuglar-drag-drop/ui-sortable-angular.js"></script>
<script type="text/javascript" src="scripts/vendor/fullcalendar.js"></script>
<script type="text/javascript" src="scripts/directives/calendar.js"></script>
<!-- filesaver -->
<script type="text/javascript"
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/98887/angular-fullscreen.js"></script>
<script type="text/javascript"
        src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.13/angular-ui-router.min.js"></script>
<script type="text/javascript" src="bower_components/ngstorage/ngStorage.js"></script>
<script type="text/javascript" src="scripts/vendor/pivot.js"></script>
<script type="text/javascript" src="bower_components/d3-plugins/sankey/sankey.js"></script>
<script type="text/javascript" src="bower_components/d3-plugins/hexbin/hexbin.js"></script>
<!-- html2canvas -->
<script type="text/javascript" src="build/html2canvas.js"></script>
<script type="text/javascript" src="scripts/custom/utility.js"></script>
<script type="text/javascript" src="scripts/app.js"></script>
<script type="text/javascript" src="scripts/controllers/login.js"></script>
<script type="text/javascript" src="scripts/controllers/welcomePageCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/SignUpMain.js"></script>
<!-- services start -->
<script type="text/javascript" src="scripts/services/DynamicRealTimeVis.js"></script>
<script type="text/javascript" src="scripts/services/ObjectStoreService.js"></script>
<script type="application/javascript" src="scripts/services/CommonDataService.js"></script>
<script type="application/javascript" src="scripts/services/fbGraphServices.js"></script>
<script type="text/javascript" src="scripts/vendor/twitterservice.js"></script>
<!-- services end -->
<!--  directives start  -->
<script type="application/javascript" src="scripts/directives/commonData.js"></script>
<script type="application/javascript" src="scripts/directives/googleMaps.js"></script>
<!--  directives end    -->
<!-- controller -->
<script type="text/javascript" src="scripts/controllers/NavCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/DiginCore.js"></script>
<script type="text/javascript" src="scripts/controllers/DiginCore2.js"></script>
<script type="text/javascript" src="scripts/directives/plumbItem.js"></script>
<script type="text/javascript" src="scripts/directives/postRender.js"></script>
<script type="text/javascript" src="scripts/directives/accordion.js"></script>
<script type="text/javascript" src="scripts/controllers/chartSettingsCtrl.js"></script>
<script type="text/javascript" src="scripts/directives/resizeable.js"></script>
<script type="text/javascript" src="scripts/directives/droppable.js"></script>
<script type="text/javascript" src="scripts/directives/draggable.js"></script>
<script type="text/javascript" src="scripts/directives/validNumber.js"></script>
<script type="text/javascript" src="scripts/directives/directivelibrary.js"></script>

<script type="text/javascript" src="scripts/services/ReportService.js"></script>
<script type="text/javascript" src="bower_components/FileSaver/FileSaver.js"></script>
<script type="text/javascript" src="scripts/controllers/socialGraph/socialGraphCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/d3PluginCtrl.js"></script>
 
<script type="text/javascript" src="https://jardindesconnaissances.googlecode.com/svn-history/r82/trunk/public/js/d3.layout.cloud.js"></script>
<script type="text/javascript" src="scripts/controllers/socialGraph/SocialAnalysisCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/socialGraph/socialGraphFBCtrl.js"></script>
<script type="text/javascript" src="scripts/directives/diginDirectives.js"></script>
<script type="text/javascript" src="scripts/controllers/socialGraph/socialGraphTwitterCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/sales-forecast/salesForecast.js"></script>
<script type="text/javascript" src="scripts/controllers/setup/dashboardSetupCtrl.js"></script>
<script type="text/javascript" src="scripts/factories/CommonSrcFact.js"></script>
<script type="text/javascript" src="scripts/controllers/query-builder/queryBuilderCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/dynamically-report-builder/dynamicallyReportCtrl.js"></script>
<script type="text/javascript" src="scripts/services/QueryBuilderService.js"></script>
<!--  controllers end   -->
<!-- zeroclipboard -->
<script type="text/javascript" src="bower_components/zeroclipboard/ZeroClipboard.min.js"></script>
<script type="text/javascript" src="scripts/factories/d3Data.js"></script>
<script type="text/javascript" src="scripts/factories/Dashboard.js"></script>
<script type="text/javascript" src="scripts/factories/getTableDataFactories.js"></script>
b
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
<script type="application/javascript" src="scripts/controllers/CommonDataSrcCtrl.js"></script>
<script type="text/javascript" src="scripts/controllers/ExcelCtrl.js"></script>
<!-- Material Icons -->
<script type="text/javascript"
        src="//cdn.jsdelivr.net/angular-material-icons/0.4.0/angular-material-icons.min.js"></script>
<script type="text/javascript" src="scripts/vendor/layout.js"></script>
<!-- svg to canvas -->
<script type="text/javascript" src="scripts/vendor/pleasure.js"></script>
<script type="text/javascript" src="http://gabelerner.github.io/canvg/rgbcolor.js"></script>
<script type="text/javascript" src="http://gabelerner.github.io/canvg/StackBlur.js"></script>
<script type="text/javascript" src="scripts/vendor/nv.d3.js"></script>
<!-- or use another assembly -->
<script type="text/javascript" src="scripts/vendor/angular-nvd3.js"></script>
<script type="text/javascript" src="http://gabelerner.github.io/canvg/canvg.js"></script>
<script type="text/javascript" src="scripts/controllers/angular-touch.js"></script>
<!-- raw -->
<script type="text/javascript" src="scripts/controllers/DiginD3.js"></script>
<!-- charts -->
<script src="scripts/charts/treemap.js"></script>
<script src="scripts/controllers/prediction/prediction.js"></script>
<script src="scripts/charts/d3Force.js"></script>
<script src="scripts/charts/streamgraph.js"></script>
<script src="scripts/charts/scatterPlot.js"></script>
<script src="scripts/charts/packing.js"></script>
<script src="scripts/charts/clusterDendrogram.js"></script>
<script src="scripts/charts/voronoi.js"></script>
<script src="scripts/charts/delaunay.js"></script>
<script src="scripts/charts/alluvial.js"></script>
<script src="scripts/charts/clusterForce.js"></script>
<script src="scripts/charts/convexHull.js"></script>
<script src="scripts/charts/hexagonalBinning.js"></script>
<script src="scripts/charts/reingoldTilford.js"></script>
<script src="scripts/charts/parallelCoordinates.js"></script>
<script src="scripts/charts/circularDendrogram.js"></script>
<script src="scripts/charts/smallMultiplesArea.js"></script>
<script src="scripts/charts/bumpChart.js"></script>
<script src="scripts/charts/sunBurst.js"></script>
<script src="scripts/services/services.js"></script>
<script type="text/javascript" src="scripts/controllers/controllers.js"></script>
<script type="text/javascript" src="scripts/filters/filters.js"></script>
<script type="text/javascript" src="scripts/directives/directives.js"></script>
<!--hight charts update damith -->
<!-- // <script type="text/javascript" src="bower_components/highcharts/highcharts.js"></script> -->
<script type="text/javascript" src="bower_components/highcharts/highcharts-more.js"></script>
<!-- customized angular gridster -->
<script type="text/javascript" src="scripts/controllers/angular-gridster.js"></script>
<script type="text/javascript"
        src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.3/angular-sanitize.min.js"></script>
<!-- intro -->
<script type="text/javascript" src="bower_components/intro.js/minified/intro.min.js"></script>
<script type="text/javascript" src="scripts/controllers/angular-intro.js"></script>
<script type="text/javascript" src="bower_components/codemirror/lib/codemirror.js"></script>
<script type="text/javascript" src="bower_components/codemirror/addon/display/placeholder.js"></script>
<!-- canvastoblob -->
<script type="text/javascript" src="bower_components/canvas-toBlob.js/canvas-toBlob.js"></script>
<!-- filesaver -->
<script type="text/javascript" src="bower_components/FileSaver/FileSaver.js"></script>
<!-- zeroclipboard -->

<script type="text/javascript" src="bower_components/angular-strap/dist/angular-strap.min.js"></script>
<script type="text/javascript" src="bower_components/angular-ui/build/angular-ui.min.js"></script>
<script type="text/javascript"
        src="bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js"></script>
<script type="text/javascript" src="bower_components/zeroclipboard/ZeroClipboard.min.js"></script>
<script type="text/javascript" src="bower_components/angular-ui/angular-ui-select2/select2.min.js"></script>
<script type="text/javascript" src="bower_components/angular-ui/angular-ui-select2/select2.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/ng-csv/0.3.3/ng-csv.min.js"></script>
<!-- angular google maps -->
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script src='//maps.googleapis.com/maps/api/js?sensor=false'></script>
<script src="bower_components/google-map/lodash.min.js"></script>
<script type="text/javascript" src="bower_components/google-map/angular-simple-logger.js"></script>
<script src="bower_components/google-map/angular-google-maps.js"></script>
<!-- marker clusterer -->
<script src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js"></script>
<!-- angular google plus -->
<script src="bower_components/angular-google-plus/dist/angular-google-plus.min.js"></script>
<!-- angular at-table -->
<script src="bower_components/at-table/dist/angular-table.js"></script>
<script type="text/javascript">
    google.load('search', '1');
</script>
<script type="text/javascript">
    google.load("feeds", "1");
</script>
<!-- angular datepicker -->
<script src="scripts/controllers/angular-datepicker.js"></script>
<!-- linq for quering in elastic widget -->
<script type="text/javascript" src="scripts/vendor/linq/linq.js"></script>
<script type="text/javascript" src="bower_components/angular-utils-pagination/dirPagination.js"></script>
<script>
    var script = '<script type="text/javascript" src="src/markerclusterer';
    if (document.location.search.indexOf('compiled') !== -1) {
        script += '_compiled';
    }
    script += '.js"><' + '/script>';
    document.write(script);
</script>
<script>
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-12846745-20']);
    _gaq.push(['_trackPageview']);

    (function () {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    })();
</script>
<script>
    $(document).ready(function () {
        Layout.init();
        $('#pagePreLoader').show();
        $('#content1').css("visibility", "hidden");
        $('#getReport').css("visibility", "hidden");
    });
</script>
<!--  new changes  -->
<script src="http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.13/angular-messages.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.15.0/TweenMax.min.js"></script>
<script type="text/javascript" src="scripts/loginBackground.js"></script>
</html>
