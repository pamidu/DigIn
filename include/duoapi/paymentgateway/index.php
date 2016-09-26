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
		case 'addPackage':
			$postString = file_get_contents ( 'php://input' );
			$handler->addPayment($postString);
			break;
		case 'updatePackage':	
			$postString = file_get_contents ( 'php://input' );
			$handler->updatePayment($postString);
			break;
		default:
			echo "no such method";
			break;
	}


class stripePayment{
	//#Add package
	public function addPayment($jsonString){
		$input = json_decode($jsonString);
		$planInfo = $input->plan;
		$token = $input->token;
		$addPackage = new CloudCharge();
		$response = $addPackage->plan()->subscribeToCustomplan($token ,$planInfo);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}
	
	/*public function updatePayment($jsonString){
		$input = json_decode($jsonString,true);
		$planInfo = $input["plan"];
		$updatePackage = new CloudCharge();
		$response = $updatePackage->plan()->customize($planInfo);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}*/

	//#Customize package
	public function updatePayment($jsonString){
		$input = json_decode($jsonString);
		$planInfo = $input->plan;
		$updatePackage = new CloudCharge();
		$response = $updatePackage->plan()->customize($planInfo);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}
	
	
}
