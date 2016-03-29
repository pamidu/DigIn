<?php
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

?>



