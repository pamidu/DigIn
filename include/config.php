<?php

$mainDomain="digin.io";
//$mainDomain="localhost:8080";

$authURI="http://104.197.27.7:3048/";
$objURI="http://104.197.27.7:3000/";
$fullhost=strtolower($_SERVER['HTTP_HOST']);
define("ROOT_PATH", $_SERVER['DOCUMENT_ROOT']);
define("MEDIA_PATH", "/var/media");
define("APPICON_PATH", "/var/www/html/devportal/appicons");
        //define("BASE_PATH", "/var/www/html/medialib");
        //define("STORAGE_PATH", BASE_PATH . "/media");
        //define("THUMB_PATH", BASE_PATH . "/thumbnails");
define("SVC_OS_URL", "http://104.197.27.7:3000");
define("SVC_OS_BULK_URL", "http://104.197.27.7/transfer");
define("SVC_AUTH_URL", "http://104.197.27.7:3048");
define("SVC_CEB_URL", "http://104.197.27.7:3500");
define("SVC_SMOOTHFLOW_URL", "http://smoothflow.io");

define("Digin_Domain", "digin.io");
define("Digin_Engine_API", "http://digin.io:1929/");
?>

