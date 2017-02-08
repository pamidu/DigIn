
<?php

	if ($_SERVER['DOCUMENT_ROOT']=="/var/www/html"){
       require_once($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
    }
    else{
       require_once($_SERVER['DOCUMENT_ROOT'] . "/2017-02-08/Digin/include/config.php");
    }

    if(onsite) {
        include("signin_onsite.html");
    } else {
        include("signin_cloud.html");
    } 
?>




