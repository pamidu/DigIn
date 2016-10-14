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

		case 'checkSubscription':
			$postString = file_get_contents ( 'php://input' );
			$handler->checkSubscription();
			break;	

		case 'getCustomerInformations':
			$postString = file_get_contents ( 'php://input' );
			$handler->getCustomerInformations();
			break;	

		case 'stopSubscriptionImmediate':
			$postString = file_get_contents ( 'php://input' );
			$handler->stopSubscriptionImmediate();
			break;		

		case 'stopSubscriptionEndOfPeriod':
			$postString = file_get_contents ( 'php://input' );
			$handler->stopSubscriptionEndOfPeriod();
			break;	

		case 'reactiveSubscription':
			$postString = file_get_contents ( 'php://input' );
			$handler->reactiveSubscription();
			break;

		case 'addCard':
			$postString = file_get_contents ( 'php://input' );
			$handler->addCard($postString);
			break;	

		case 'getCardInformation':
			$postString = file_get_contents ( 'php://input' );
			$handler->getCardInformation();
			break;

		case 'deleteCard':
			$postString = file_get_contents ( 'php://input' );
			$handler->deleteCard($postString);
			break;	
			
		case 'setDefaultCard':
			$postString = file_get_contents ( 'php://input' );
			$handler->setDefaultCard($postString);
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
		$upgradePackage = new CloudCharge();
		$response = $upgradePackage->plan()->upgradeToCustomplan($planInfo);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Check substription
	public function checkSubscription(){
		$checkSubscription = new CloudCharge();
		$response = $checkSubscription->plan()->checkSubscription();
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}
	
	//#Get customer information
	public function getCustomerInformations(){
		$getCustomerInformations = new CloudCharge();
		$response = $getCustomerInformations->user()->get();
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Stop subscriptions-Immediate
	public function stopSubscriptionImmediate(){
		$stopSubscriptionImmediate = new CloudCharge();
		$response = $stopSubscriptionImmediate->plan()->stopSubscription(true);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Stop subscriptions-End of Period
	public function stopSubscriptionEndOfPeriod(){
		$stopSubscriptionEndOfPeriod = new CloudCharge();
		$response = $stopSubscriptionEndOfPeriod->plan()->stopSubscription(false);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Stop subscriptions-End of Period
	public function reactiveSubscription(){
		$reactiveSubscription = new CloudCharge();
		$response = $reactiveSubscription->plan()->resubscribe();
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Add card
	public function addCard($jsonString){
		$input = json_decode($jsonString);
		$token = $input->token;
		$default = $input->default;
		$addCard = new CloudCharge();
		$response = $addCard->card()->add($token, $default);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Get card information
	public function getCardInformation(){
		$getCardInformation = new CloudCharge();
		$response = $getCardInformation->card()->getInfo();
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Delete card
	public function deleteCard($jsonString){
		$input = json_decode($jsonString);
		$cardId = $input->cardId;
		$deleteCard = new CloudCharge();
		$response = $deleteCard->card()->remove($cardId);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Set default card 
	public function setDefaultCard($jsonString){	
		echo $jsonString;
		$input = json_decode($jsonString);
		$cardId = $input->cardId;
		$setDefaultCard = new CloudCharge();
		$response = $setDefaultCard->card()->setAsDefault($cardId);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}
	

	
}
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

		case 'checkSubscription':
			$postString = file_get_contents ( 'php://input' );
			$handler->checkSubscription();
			break;	

		case 'getCustomerInformations':
			$postString = file_get_contents ( 'php://input' );
			$handler->getCustomerInformations();
			break;	

		case 'stopSubscriptionImmediate':
			$postString = file_get_contents ( 'php://input' );
			$handler->stopSubscriptionImmediate();
			break;		

		case 'stopSubscriptionEndOfPeriod':
			$postString = file_get_contents ( 'php://input' );
			$handler->stopSubscriptionEndOfPeriod();
			break;	

		case 'reactiveSubscription':
			$postString = file_get_contents ( 'php://input' );
			$handler->reactiveSubscription();
			break;

		case 'addCard':
			$postString = file_get_contents ( 'php://input' );
			$handler->addCard($postString);
			break;	

		case 'getCardInformation':
			$postString = file_get_contents ( 'php://input' );
			$handler->getCardInformation();
			break;

		case 'deleteCard':
			$postString = file_get_contents ( 'php://input' );
			$handler->deleteCard($postString);
			break;	
			
		case 'setDefaultCard':
			$postString = file_get_contents ( 'php://input' );
			$handler->setDefaultCard($postString);
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
		$upgradePackage = new CloudCharge();
		$response = $upgradePackage->plan()->upgradeToCustomplan($planInfo);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Check substription
	public function checkSubscription(){
		$checkSubscription = new CloudCharge();
		$response = $checkSubscription->plan()->checkSubscription();
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}
	
	//#Get customer information
	public function getCustomerInformations(){
		$getCustomerInformations = new CloudCharge();
		$response = $getCustomerInformations->user()->get();
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Stop subscriptions-Immediate
	public function stopSubscriptionImmediate(){
		$stopSubscriptionImmediate = new CloudCharge();
		$response = $stopSubscriptionImmediate->plan()->stopSubscription(true);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Stop subscriptions-End of Period
	public function stopSubscriptionEndOfPeriod(){
		$stopSubscriptionEndOfPeriod = new CloudCharge();
		$response = $stopSubscriptionEndOfPeriod->plan()->stopSubscription(false);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Stop subscriptions-End of Period
	public function reactiveSubscription(){
		$reactiveSubscription = new CloudCharge();
		$response = $reactiveSubscription->plan()->resubscribe();
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Add card
	public function addCard($jsonString){
		$input = json_decode($jsonString);
		$token = $input->token;
		$default = $input->default;
		$addCard = new CloudCharge();
		$response = $addCard->card()->add($token, $default);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Get card information
	public function getCardInformation(){
		$getCardInformation = new CloudCharge();
		$response = $getCardInformation->card()->getInfo();
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Delete card
	public function deleteCard($jsonString){
		$input = json_decode($jsonString);
		$cardId = $input->cardId;
		$deleteCard = new CloudCharge();
		$response = $deleteCard->card()->remove($cardId);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}

	//#Set default card 
	public function setDefaultCard($jsonString){	
		echo $jsonString;
		$input = json_decode($jsonString);
		$cardId = $input->cardId;
		$setDefaultCard = new CloudCharge();
		$response = $setDefaultCard->card()->setAsDefault($cardId);
		$encodeVal = json_encode($response);
		echo $encodeVal;
	}
	

	
}
