<?php
$mainDomain="duoworld.com";
$authURI="http://digin.io:3048/";
$objURI="http://digin.io:3000/";
$fullhost=strtolower($_SERVER['HTTP_HOST']);
define("ROOT_PATH", $_SERVER['DOCUMENT_ROOT']);
define("MEDIA_PATH", "/var/media");
define("APPICON_PATH", "/var/www/html/devportal/appicons");
        //define("BASE_PATH", "/var/www/html/medialib");
        //define("STORAGE_PATH", BASE_PATH . "/media");
        //define("THUMB_PATH", BASE_PATH . "/thumbnails");
define("SVC_OS_URL", "http://digin.io:3000");
define("SVC_OS_BULK_URL", "http://digin.io/transfer");
define("SVC_AUTH_URL", "http://digin.io:3048");
define("SVC_CEB_URL", "http://digin.io:3500");
define("SVC_SMOOTHFLOW_URL", "http://smoothflow.io");
?>
