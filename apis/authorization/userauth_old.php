<?php

require_once (ROOT_PATH ."/include/duoapi/objectstoreproxy.php");

class LoginRequest {
	public $Username;
	public $Password;
	public $Domian;
}

class UserRegistrationRequest {
    public $EmailAddress;
    public $Name;
    public $Password;
    public $ConfirmPassword;
}

class UserProfile {
    public $bannerPicture;
    public $company;
    public $country;
    public $email;
    public $id;
    public $name;
    public $phone;
    public $timestamp;
    public $username;
    public $zipcode;
}

class UserAuthorization {

	public function Login() {
        $loginData = Flight::request()->data;

        $loginObj = new LoginRequest();
        DuoWorldCommon::mapToObject($loginData, $loginObj);

        if(!$loginObj->Username) {
        	echo '{"Success":false, "Message": "Username is required.", "Data": {}}'; return;
        }

        if(!$loginObj->Password) {
    		echo '{"Success":false, "Message": "Password is required.", "Data": {}}'; return;
        }

    	$fullhost = strtolower($_SERVER['HTTP_HOST']);
    	$loginObj->Domian = $fullhost;

    	$loginUrl = "/Login/" . trim($loginObj->Username) . "/" . trim($loginObj->Password) . "/" . $loginObj->Domian;

    	// curl request goes here.
        $invoker = new WsInvoker(SVC_AUTH_URL);
        $authObj = $invoker->get($loginUrl);
        $authDecoded = json_decode($authObj);

    	if($authDecoded)
    		if(isset($authDecoded->SecurityToken) && isset($authDecoded->UserID)) {
                setcookie('securityToken', $authDecoded->SecurityToken, time()+86400);
                setcookie('authData', $authObj, time()+86400);
                $_SESSION['securityToken'] = $authDecoded->SecurityToken;
                $_SESSION['userObject'] = $authDecoded;

                echo '{"Success":true, "Message": "You have been successfully logged in", "Data": {}}'; return;
    		}else {
    			echo '{"Success":false, "Message":"' . $authObj . '", "Data": {}}'; return;
    		}
    	else {
            echo '{"Success":false, "Message":"' . $authObj . '", "Data": {}}'; return;   
        }

	}

	public function UserRegistration() {
        $regData = Flight::request()->data;
        $regObj = new UserRegistrationRequest();
        $regUrl = "/UserRegistation/";

        foreach ($regObj as $key => $value) {
            if(!isset($regData->$key)) {
                echo '{"Success":false, "Message": "Request payload should contains '. $key .' property.", "Data": {}}'; return;
            }
            if(!$regData->$key) {
                echo '{"Success":false, "Message": "' . $key .'" property is empty or null.", "Data": {}}'; return;
            }
        }

        DuoWorldCommon::mapToObject($regData, $regObj);

        $isRegistered = $this->isEmailAddressAlreadyRegistered($regObj->EmailAddress);
        if($isRegistered) {
            echo '{"Success":false, "Message": "' .$regObj->EmailAddress. ' is already registered.", "Data": {}}'; return;
        }
        
        $regObj->Active = false;
        
        $invoker = new WsInvoker(SVC_AUTH_URL);
        $authObj = $invoker->post($regUrl, $regObj);
        $authDecoded = json_decode($authObj);
        
        if($authDecoded)
            if(isset($authDecoded->UserID) && $authDecoded->UserID) { 
                $isCreated = $this->createProfile($regObj);
                if($isCreated) {
                    echo '{"Success":true, Message": "You have been successfully registed.", "Data": {}}'; return;
                }else {
                    echo '{"Success":false, Message": "Error getting while creating the profile.", "Data": {}}'; return;
                }
            }else {
                echo '{"Success":false, "Message":"' . $authObj . '", "Data": {}}'; return;
            }
        else {
            echo '{"Success":false, "Message":"' . $authObj . '", "Data": {}}'; return;   
        }
	}
    
    private function createProfile($user) {
        $isCreated = false;
        $profile = new UserProfile();

        foreach ($profile as $key => $value) {
           $profile->$key = "";
        }

        $profile->name = $user->Name;
        $profile->email = $user->EmailAddress;
        $profile->bannerPicture = "fromObjectStore";
        $profile->id = "admin@duosoftware.com";

        $client = ObjectStoreClient::WithNamespace("duosoftware.com", "profile","123");
        $response = $client->store()->byKeyField("email")->andStore($profile);
        if(isset($response->IsSuccess)) {
            if($response->IsSuccess) {
                $isCreated = true;
            }
        }

        return $isCreated;
    }
    
    private function isEmailAddressAlreadyRegistered($email) {
        $isRegistered = false;
        $email = trim($email);

        //Email validation
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
             echo '{"Success":false, "Message": "Email address('. $email .') is not in valid format.", "Data": {}}'; return;
        }

        //check requested email address against objectstore.
        $client = ObjectStoreClient::WithNamespace("duosoftware.com", "profile","123");
        $response = $client->get()->byKey($email);
        if(!isset($response->IsSuccess))
            if($response) // email is already registered.
                $isRegistered = true;

        return $isRegistered;
    }

	function __construct() {
		Flight::route("POST /userauthorization/login", function() {
			$this->Login();
		});
        Flight::route("POST /userauthorization/userregistration", function() {
            $this->UserRegistration();
        });
	}

}

?>
