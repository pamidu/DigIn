<?php

	session_start();
	require_once ("include/config.php");
	require_once ("include/session.php");
	header('Access-Control-Allow-Origin: *');
 	header('Access-Control-Allow-Methods: GET, POST');
	
	if(isset($_GET["logout"])){
		setcookie ("securityToken", "", time() - 3600);
		setcookie ("authData", "", time() - 3600);
		unset($_COOKIE["securityToken"]);
		unset($_COOKIE["authData"]);
		unset($_SESSION);
		header("Location: http://".$mainDomain."/logout.php");
		//echo $_SERVER['HTTP_HOST'] . " - Logout ";

		exit();
	}


	

	if(isset($_GET["SID"])){
		session_id($_GET["SID"]);
	}

	if (isset($_GET["r"])){
		setcookie("h", $_GET["r"]);

	}
	

	if (isset($_GET["securityToken"])){
		setcookie("securityToken", $_GET["securityToken"]);
		if(createSessionDmian()){
			if(isset($_COOKIE['h'])){
				header("Location: ".$_COOKIE['h']."?securityToken=".$_COOKIE["securityToken"]);
				cookie_unset('h');
				exit();		
			}
			else{
				header("Location: /");
				exit();
			}
		}
		else
		{
			header("Location: http://".$mainDomain."/login.php?r=http://".$_SERVER['HTTP_HOST']."/s.php");
			exit();
		}
	}


	if(!isset($_COOKIE["securityToken"])){
		if($mainDomain!=$_SERVER['HTTP_HOST'])
		{
			header("Location: http://".$mainDomain."/login.php?r=http://".$_SERVER['HTTP_HOST'].'/s.php');
		}
		else
		{
			header("Location: http://".$mainDomain."/login.php?r=http://".$_SERVER['HTTP_HOST'].'/s.php');

		}
		exit();
	}
	else
	{
		if(isset($_COOKIE['h'])){
			header("Location: ".$_COOKIE['h']."?securityToken=".$_COOKIE["securityToken"]);
			cookie_unset('h');
			exit();		
		}
		else
		{
			header("Location: /");
			exit();
		}
	}

	

	if(isset($_GET["l"]))
	{
		header("Location: http://".$_GET["l"]."/s.php?securityToken=".$_COOKIE["securityToken"]);
		exit();
	}
?>
