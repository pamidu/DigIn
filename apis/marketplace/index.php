<?php

	ini_set('xdebug.var_display_max_depth', 5);
	ini_set('xdebug.var_display_max_children', 256);
	ini_set('xdebug.var_display_max_data', 1024);	

 	require_once ($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
	define ("MAIN_DOMAIN", $mainDomain);

	require_once(ROOT_PATH . "/dwcommon.php");
 	require_once (ROOT_PATH .'/include/flight/Flight.php');
 	require_once (ROOT_PATH .'/include/duoapi/objectstoreproxy.php');

	require_once ("./appservice.php");
	new AppMarketplaceService();


 	Flight::start();

	
			header('Content-Type: application/json');
			header('Access-Control-Allow-Headers: Content-Type');
			header('Access-Control-Allow-Origin: *');
			header('Access-Control-Allow-Methods: GET, POST');
?>
