<?php

 	require_once ($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
	require_once (ROOT_PATH ."/include/duoapi/cloudcharge.php");

	//server akakin twa server akak access karadi security reasons nisa access allow karana dana header aka
	header("Access-Control-Allow-Origin: * "); 
	header("Access-Control-Allow-Methods: PUT,POST, GET, DELETE, OPTIONS");  // access permisson for methods 
	header("Access-Control-Allow-Headers: origin, x-requested-with, content-type, securityToken");
	  
	$view = $_GET["view"];

	$handler = new stripePayment();
	switch ($view) {
		case 'puchasePackage':
			$postString = file_get_contents ( 'php://input' );
			$handler->puchasePackage($postString);
			break;
		case 'customizePackage':	
			$postString = file_get_contents ( 'php://input' );
			$handler->customizePackage($postString);
			break;
		case 'upgradePackage':
			$postString = file_get_contents ( 'php://input' );
			$handler->upgradePackage($postString);
			break;
		default:
			echo "no such method";
			break;
	}


class stripePayment{
	
	//#Purchase new package
	public function puchasePackage($jsonString){
		$input = json_decode($jsonString);
		$planInfo = $input->plan;
		$token = $input->token;
		$puchasePackage = new CloudCharge();
		$response = $puchasePackage->plan()->subscribeToCustomplan($token ,$planInfo);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Customize existing package
	public function customizePackage($jsonString){
		$input = json_decode($jsonString);
		$planInfo = $input->plan;
		$customizePackage = new CloudCharge();
		$response = $customizePackage->plan()->customize($planInfo);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}
	
	//#Upgrade package
	public function upgradePackage($jsonString){
		$input = json_decode($jsonString);
		$planInfo = $input->plan;
		$token = $input->token;
		$upgradePackage = new CloudCharge();
		$response = $upgradePackage->plan()->upgrade($token ,$planInfo);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}
	
}
