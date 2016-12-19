<?php
    if ($_SERVER['DOCUMENT_ROOT']=="/var/www/html"){
       require_once($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
    }
    else{
       require_once($_SERVER['DOCUMENT_ROOT'] . "/Digin/include/config.php");
    }

    if(onsite) {
        include("companyReg_onsite.html");
    } else {
        include("companyReg_cloud.html");
    } 
?>