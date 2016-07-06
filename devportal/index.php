<?php

	ini_set('xdebug.var_display_max_depth', 5);
	ini_set('xdebug.var_display_max_children', 256);
	ini_set('xdebug.var_display_max_data', 1024);	
	

	//if ($_SERVER['REQUEST_METHOD'] != "OPTIONS"){
		require_once($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
		require_once ("config.php");
		require_once(ROOT_PATH . "/dwcommon.php");
		require_once ("common.php");

		require_once ('./flight/Flight.php');

		require_once ("./activities/projectservice.php");
		require_once ("./activities/templateservice.php");
		require_once ("./activities/editorservice.php");
		require_once ("./activities/testservice.php");

		new ProjectService();
		new EditorService();
		new TemplateService();
		new TestService();

		Flight::route("GET /", function (){ 
			
			if (USE_NEW_SHELL == false){
				header("Location: /devportalui");
				exit();
			}
			else
				include ("views/shell.html");
		});
		Flight::start();
	//}

	//header('Access-Control-Allow-Origin: *');
	//header('Access-Control-Allow-Methods: GET, POST');  
?>
