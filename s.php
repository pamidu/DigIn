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
	//exit();

	

	if(isset($_GET["SID"])){
		session_id($_GET["SID"]);
	}

	if (isset($_GET["r"])){
		//$_COOKIE['h']=$_GET["r"];
		setcookie("h", $_GET["r"]);

	}
	

	if (isset($_GET["securityToken"])){
		setcookie("securityToken", $_GET["securityToken"]);
		if(createSessionDmian()){
			//echo "chamila 0"; exit();
			////when 1st, 2nd  login --2
			if(isset($_COOKIE['h'])){
				//echo "chamila 1"; exit();
				header("Location: ".$_COOKIE['h']."?securityToken=".$_COOKIE["securityToken"]);
				cookie_unset('h');
				exit();		
			}
			else{
				////when 1st 2nd login --3
				//echo "chamila 11"; exit();
				header("Location: /");
				exit();
			}
		}
		else
		{
			//echo "chamila 111"; exit();
			////when 1st, 2nd  login --1
			header("Location: http://".$mainDomain."/login.php?r=http://".$_SERVER['HTTP_HOST']."/s.php");
			exit();
		}
	}


	if(!isset($_COOKIE["securityToken"])){
		//echo "chamila 2"; exit();
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
		echo "chamila 3"; exit();	
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
		//echo "chamila 4"; exit();	
		header("Location: http://".$_GET["l"]."/s.php?securityToken=".$_COOKIE["securityToken"]);
		exit();
	}
?>
