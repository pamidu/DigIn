<?php

$mainDomain="onprem.duodigin.lk";
//$mainDomain="localhost:8081";

$authURI="http://onprem.duodigin.lk:3048/";
$objURI="http://onprem.duodigin.lk:3000/";
$fullhost=strtolower($_SERVER['HTTP_HOST']);
define("ROOT_PATH", $_SERVER['DOCUMENT_ROOT']);
define("MEDIA_PATH", "/var/media");
define("APPICON_PATH", "/var/www/html/devportal/appicons");
        //define("BASE_PATH", "/var/www/html/medialib");
        //define("STORAGE_PATH", BASE_PATH . "/media");
        //define("THUMB_PATH", BASE_PATH . "/thumbnails");
define("SVC_OS_URL", "http://onprem.duodigin.lk:3000");
define("SVC_OS_BULK_URL", "http://localhost/transfer");
define("SVC_AUTH_URL", "http://onprem.duodigin.lk:3048");
define("SVC_CEB_URL", "http://localhost:3500");
define("SVC_SMOOTHFLOW_URL", "http://smoothflow.io");

define("Digin_Domain", "onprem.duodigin.lk");
define("Digin_Engine_API", "http://onprem.duodigin.lk/DigInEngine/");
define("PAYMENT_GATWAY", "stripe");
define("onsite", true);

?>








