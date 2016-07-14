<?php

require_once ("include/config.php");
require_once ("include/session.php");

$fullHost = strtolower($_SERVER['HTTP_HOST']);
INTS();

switch ($fullHost) {
       case $mainDomain:
          if(!isset($_COOKIE["securityToken"])){
              header("Location: http://www.".$mainDomain);
          }else{
            getURI();
          }
        break;
        case "www." . $mainDomain:
        if(!isset($_COOKIE["securityToken"])){
          include ("login/index.html");
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
            header("Location: http://".$mainDomain."/login.php?r=http://".$_SERVER['HTTP_HOST'].'/s.php');

        }
                //echo "string";
        exit();
    }
    getURI();

    break;
}


?>



