<?php

require_once ("include/config.php");
require_once ("include/session.php");

$fullHost = strtolower($_SERVER['HTTP_HOST']);

switch ($fullHost) {
    case $mainDomain: // digin.io
        if(isset($_COOKIE["securityToken"])){
			//echo 'chamila4'; exit();
            //include ("index1.php");
			getURI();
		}
        else{
			//echo 'chamila5'; exit();
            getURI();
		}
        break;
    case "www." . $mainDomain: // www.digin.io
        if(!isset($_COOKIE["securityToken"])){
			//echo 'chamila6'; exit();
            include ("index1.php");
			
			}
        else{
			//echo 'chamila7'; exit();
			getURI();
		}
        break;
    default:
    if(!isset($_COOKIE["securityToken"])) {
		//echo 'chamila8'; exit();
        if($mainDomain != $_SERVER['HTTP_HOST']){ 
			//echo 'chamila9'; exit();
            header("Location: http://". $mainDomain . "/login.php?r=http://" . $_SERVER['HTTP_HOST'] . '/s.php'); 
		}
        exit();
    }
	
	//echo 'chamila10'; exit();
	//include ("index1.php");
	getURI();
	
    break;
}













/*
require_once ("include/config.php");
require_once ("include/session.php");
$fullHost = strtolower($_SERVER['HTTP_HOST']);

switch ($fullHost) {
    case $mainDomain:
        if(!isset($_COOKIE["securityToken"])){
              include ("index1.php");
        }else{
            getURI();  
        }
        break;
    case "www.".$mainDomain:
        if(!isset($_COOKIE["securityToken"])){
          include ("index1.php");
      }else{
        getURI();

    }
        break;
    default:
    if(!isset($_COOKIE["securityToken"])){
        if($mainDomain!=$_SERVER['HTTP_HOST'])
        {
            header("Location: http://".$mainDomain."/login.php?r=http://".$_SERVER['HTTP_HOST'].'/s.php');
	            
	}
        else
        {
            header("Location: http://".$mainDomain."/#/login?r=http://".$_SERVER['HTTP_HOST'].'/s.php');
        }
                //echo "string";
        exit();
    }
    include ("index1.php");
    break;
}
*/
?>



