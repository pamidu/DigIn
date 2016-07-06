<?php
	require_once($_SERVER["DOCUMENT_ROOT"] . "/dwcommon.php");
	require_once($_SERVER["DOCUMENT_ROOT"] . "/include/config.php");
	require_once("../config.php");

	$currentPath = str_replace(str_replace("\\","/", strtolower($_SERVER["DOCUMENT_ROOT"])), "", str_replace("\\","/", strtolower(dirname(__FILE__))));
	$relativeUrl = str_replace($currentPath, "", $_SERVER["REQUEST_URI"]);
	$relativeUrl = str_replace(".png","",$relativeUrl);
	$fileName = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps" . $relativeUrl . "/icon.png";

	header("Content-type: image/png");

	if (file_exists($fileName))
	        echo file_get_contents($fileName);
	else
	        echo file_get_contents(DEVPORTAL_PATH. "/appicons/default.png");

?>