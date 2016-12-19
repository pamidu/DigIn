
<?php

    if ($_SERVER['DOCUMENT_ROOT']=="/var/www/html"){
       require_once($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
    }
    else{
       require_once($_SERVER['DOCUMENT_ROOT'] . "/Digin/include/config.php");
    }

    if(onsite) {
        include("completed_onsite.html");
    } else {
        include("completed_cloud.html");
    } 
?>

