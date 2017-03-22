<?php
	/*
	$mainDomain="dev.digin.io";
	$authURI="http://dev.auth.digin.io:3048/"; //#Note : http://dev.auth.digin.io:3048/
	$objURI="http://dev.auth.digin.io:3000/"; //#Note : http://dev.auth.digin.io:3000/
	$fullhost=strtolower($_SERVER['HTTP_HOST']);
	define("ROOT_PATH", $_SERVER['DOCUMENT_ROOT']);
	define("MEDIA_PATH", "/var/media");
	define("APPICON_PATH", "/var/www/html/devportal/appicons");
	define("SVC_OS_URL", "http://dev.auth.digin.io:3000"); //#Note : http://dev.auth.digin.io:3000
	define("SVC_OS_BULK_URL", "http://prod.auth.digin.io/transfer");
	define("SVC_AUTH_URL", "http://dev.auth.digin.io:3048"); //#Note : http://dev.auth.digin.io:3048
	define("SVC_CEB_URL", "http://dev.auth.digin.io:3500");  //#Note : http://dev.auth.digin.io:3500
	define("Digin_Domain", "dev.digin.io"); //#Note : dev.digin.io
	define("Digin_Engine_API", "http://dev.digin.io/DigInEngine/"); //Note : http://dev.digin.io/DigInEngine/
	define("PAYMENT_GATWAY", "stripe"); 
	define("onsite", false);
	*/

	$mainDomain="ddigin.io";
	$authURI="http://prod.proxy.auth.digin.io/"; //#Note : http://dev.auth.digin.io:3048/
	$objURI="http://prod.proxy.auth.digin.io:3000/"; //#Note : http://dev.auth.digin.io:3000/
	$fullhost=strtolower($_SERVER['HTTP_HOST']);
	define("ROOT_PATH", $_SERVER['DOCUMENT_ROOT']);
	define("MEDIA_PATH", "/var/media");
	define("APPICON_PATH", "/var/www/html/devportal/appicons");
	define("SVC_OS_URL", "http://prod.proxy.auth.digin.io:3000"); //#Note : http://dev.auth.digin.io:3000
	define("SVC_OS_BULK_URL", "http://prod.auth.digin.io/transfer");
	define("SVC_AUTH_URL", "http://prod.proxy.auth.digin.io"); //#Note : http://dev.auth.digin.io:3048
	define("SVC_CEB_URL", "http://prod.proxy.auth.digin.io:3500");  //#Note : http://dev.auth.digin.io:3500
	define("Digin_Domain", "digin.io"); //#Note : dev.digin.io
	define("Digin_Engine_API", "http://prod.proxy.diginengine.digin.io/"); //Note : http://dev.digin.io/DigInEngine/
	define("PAYMENT_GATWAY", "stripe"); 
	define("onsite", false); 

?>