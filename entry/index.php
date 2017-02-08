<?php
    if (isset($_GET["r"]))
    {
        $_SESSION['r']=$_GET["r"];
    }

    if(isset($_COOKIE['securityToken']))   
    {
         if(isset($_SESSION['r']))
         {
              header("Location: ".$_SESSION['r']."?securityToken=".$_COOKIE["securityToken"]);
              session_unset('r');
              exit();
         }
         else
         {
              //header("location: /Digin"); //Use for local *Note: Local digin folder path
              header("location: /"); //use for live 
              exit();
         }
    }
?>



<!DOCTYPE html>
<html lang="en" ng-app="digin-entry">
<head>
    <meta charset="UTF-8">
    <title>DigIn - Beyond BI</title>
    <link rel="shortcut icon" href="./image/login-logo.png" type="image/png">
    
    <!-- #style area -->
    <link rel="stylesheet" type="text/css" href="bower_components/angular-material/angular-material.css">
    <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="assets/css/customer.css">
    <link rel="stylesheet" type="text/css" href="assets/css/customer-1.0.css">
    <link rel="stylesheet" type="text/css" href="bower_components/ngToast/dist/ngToast-animations.min.css">
    <link rel="stylesheet" type="text/css" href="assets/css/animate.css">
    <link rel="stylesheet" type="text/css" href="assets/css/commonstyle.css">
    <link rel="stylesheet" type="text/css" href="assets/css/admin1.css">
    <link rel="stylesheet" type="text/css" href="bower_components/ngToast/dist/ngToast.css">
    <link rel="stylesheet" type="text/css" href="bower_components/ngToast/dist/ngToast.min.css">

    <!-- google font -->
    <!--link href='https://fonts.googleapis.com/css?family=Ek+Mukta:200,300' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,500,700,300,100' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Dosis:700' rel='stylesheet' type='text/css'-->


</head>
<body>

<div ui-view>
</div>

<!-- #script area -->
</body>
<script type="text/javascript" src="bower_components/angular/angular.js"></script>
<script type="text/javascript" src="bower_components/angular-aria/angular-aria.js"></script>
<script type="text/javascript" src="bower_components/angular-ui-router/release/angular-ui-router.js"></script>
<script type="text/javascript" src="bower_components/angular-animate/angular-animate.js"></script>
<script type="text/javascript" src="bower_components/angular-route/angular-route.js"></script>
<script type="text/javascript" src="bower_components/angular-material/angular-material.js"></script>
<script type="text/javascript" src="bower_components/angular-material/angular-material.js"></script>
<script type="text/javascript" src="bower_components/ngToast/dist/ngToast.min.js"></script>
<script type="text/javascript" src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script type="text/javascript" src="bower_components/angular-messages/angular-messages.min.js"></script>
<script src="bower_components/angular/angular-cookies.min.js"></script>
<script type="text/javascript" src="../shell/scripts/config.js"></script>
<script type="text/javascript" src="entry.js"></script>



</html>