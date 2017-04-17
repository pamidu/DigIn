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
    public $BillingAddress;
    public $Company;
    public $Country;
    public $Email;
    public $Name;
    public $PhoneNumber;
    public $ZipCode;
    public $BannerPicture;
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
        $requestheaders = getallheaders();
        // curl request goes here.
        $invoker = new WsInvoker(SVC_AUTH_URL);
        $invoker->addHeader('User-Agent', $requestheaders["User-Agent"]);
        $invoker->addHeader('PHP', '101');
        $invoker->addHeader('IP', $_SERVER['REMOTE_ADDR']);
        $authObj = $invoker->get($loginUrl);
        $authDecoded = json_decode($authObj);

        if(isset($authDecoded->Error) && $authDecoded->Error) {
            //echo '{"Success":false, "Message": "'. $authDecoded->Message . '", "Data": '. isset($authDecoded->Data) ? json_encode($authDecoded->Data) : null . '}'; return;
            if(isset($authDecoded->Data)){
                $data=json_encode($authDecoded->Data);
            }
            else
            {
                $data="null";
            }
            echo '{"Success":false, "Message": "'. $authDecoded->Message . '", "Data": '.$data.'}'; return;
        }
        
        if(isset($authDecoded->SecurityToken) && isset($authDecoded->UserID)) {
            if (!isset($_SESSION))
                session_start();
                //setcookie('securityToken', $authDecoded->SecurityToken, time() + 86400, "/", $fullhost);
                //setcookie('authData', $authObj, time() + 86400, "/", $fullhost);
                $_SESSION['securityToken'] = $authDecoded->SecurityToken;
                $_SESSION['userObject'] = $authDecoded; 
                
                echo '{"Success":true, "Message": "You have successfully logged in", "Data": {"SecurityToken": "'. $authDecoded->SecurityToken .'","AuthData": '.$authObj.'}}'; return;
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

        $regObj->Active = false;

        $invoker = new WsInvoker(SVC_AUTH_URL);
        $authObj = $invoker->post($regUrl, $regObj);
        $authDecoded = json_decode($authObj);
        
        if(isset($authDecoded->Error) && $authDecoded->Error) {
            echo '{"Success":false, "Message": "'. $authDecoded->Message . '", "Data": {}}'; return;
        }

        if(isset($authDecoded->UserID)) { 
            $isCreated = $this->createProfile($regObj);
                if($isCreated) {
                    echo '{"Success":true, "Message": "You have successfully registed.", "Data": {}}'; return;
                }else {
                    echo '{"Success":false, "Message": "Error getting while creating the profile.", "Data": {}}'; return;
                }
        }
    }

    public function OfflineUserRegistration() {
        $regData = Flight::request()->data;
        $regObj = new UserRegistrationRequest();
        $regUrl = "/InvitedUserRegistration/";

        foreach ($regObj as $key => $value) {
            if(!isset($regData->$key)) {
                echo '{"Success":false, "Message": "Request payload should contains '. $key .' property.", "Data": {}}'; return;
            }
            if(!$regData->$key) {
                echo '{"Success":false, "Message": "' . $key .'" property is empty or null.", "Data": {}}'; return;
            }
        }

        DuoWorldCommon::mapToObject($regData, $regObj);

        $regObj->Active = false;

        $invoker = new WsInvoker(SVC_AUTH_URL);
        $authObj = $invoker->post($regUrl, $regObj);
        $authDecoded = json_decode($authObj);

        if(is_null($authDecoded)) {
            echo '{"Success":false, "Message": "'.$authObj.'", "Data": {}}'; return;
        }
        
        if(isset($authDecoded->Error) && $authDecoded->Error) {
            echo '{"Success":false, "Message": "'. $authDecoded->Message . '", "Data": {}}'; return;
        }

        if(isset($authDecoded->UserID)) { 
            $isCreated = $this->createProfile($regObj);
                if($isCreated) {
                    echo '{"Success":true, "Message": "You have successfully registed.", "Data": {}}'; return;
                }else {
                    echo '{"Success":false, "Message": "Error getting while creating the profile.", "Data": {}}'; return;
                }
        }

    }

    public function OfflineTenantUserRegistration($tenantid) {
        $regData = Flight::request()->data;
        $regObj = new UserRegistrationRequest();
        $regUrl = "/RegisterTenantUserWithTenant/";

        if(empty($tenantid) || is_null($tenantid)) {
            echo '{"Success":false, "Message": "Invalid tenant id.", "Data": {}}'; return;
        }

        $regUrl .= $tenantid;

        foreach ($regObj as $key => $value) {
            if(!isset($regData->$key)) {
                echo '{"Success":false, "Message": "Request payload should contains '. $key .' property.", "Data": {}}'; return;
            }
            if(!$regData->$key) {
                echo '{"Success":false, "Message": "' . $key .'" property is empty or null.", "Data": {}}'; return;
            }
        }

        DuoWorldCommon::mapToObject($regData, $regObj);

        $regObj->Active = false;

        $invoker = new WsInvoker(SVC_AUTH_URL);
        $authObj = $invoker->post($regUrl, $regObj);
        $authDecoded = json_decode($authObj);

        if(is_null($authDecoded)) {
            echo '{"Success":false, "Message": "'.$authObj.'", "Data": {}}'; return;
        }
        
        if(isset($authDecoded->Error) && $authDecoded->Error) {
            echo '{"Success":false, "Message": "'. $authDecoded->Message . '", "Data": {}}'; return;
        }

        if(isset($authDecoded->UserID)) { 
            $isCreated = $this->createProfile($regObj);
                if($isCreated) {
                    echo '{"Success":true, "Message": "You have successfully registed.", "Data": {}}'; return;
                }else {
                    echo '{"Success":false, "Message": "Error getting while creating the profile.", "Data": {}}'; return;
                }
        }

    }

    public function OfflineTenantUserActivation($email) {

        $activationUrl = "/userActivationByAdmin/";

        if(empty($email) || is_null($email)) {
            echo '{"Success":false, "Message": "Tenant user e-mail address required.", "Data": {}}'; return;
        }

        $activationUrl .= $email;
        $requestheaders = getallheaders();

        $invoker = new WsInvoker(SVC_AUTH_URL);
        $invoker->addHeader('securityToken', $requestheaders["securityToken"]);
        $authObj = $invoker->get($activationUrl);
        $authDecoded = json_decode($authObj);

        if($authDecoded) echo '{"Success":true, "Message": "'.$email.' successfully activated.", "Data": {}}';
        else echo '{"Success":false, "Message": "user activation failed.", "Data": {}}';

        return;

    }

    public function ForgotPassword($email) {
        //Email validation
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo '{"Success":false, "Message": "Email address('. $email .') is not in valid format.", "Data": {}}'; return;
        }
        
        $fpUrl = "/ForgotPassword/" . $email . "/requestcode";
        
        $invoker = new WsInvoker(SVC_AUTH_URL);
        $authData = $invoker->get($fpUrl);
        $isReset = ($authData === "true") ? true : false;
        if($isReset) {
            echo '{"Success":true, "Message":"Successfully reset the password.", "Data": {}}'; return;
        }else {
            echo '{"Success":false, "Message":"Password reset failed.", "Data": {}}'; return;
        }
        
    }

    private function createProfile($user) {
        $isCreated = true;
        $profile = new UserProfile();

        foreach ($profile as $key => $value) {
           $profile->$key = "";
        }

        $profile->Name = $user->Name;
        $profile->Email = $user->EmailAddress;
        $profile->BannerPicture = "img/cover.png";

        $namespace = str_replace(".", "", str_replace("@", "", $user->EmailAddress)). "." . $GLOBALS['mainDomain'];
        $client = ObjectStoreClient::WithNamespace($namespace, "profile", "123");
        $proRes = $client->store()->byKeyField("Email")->andStore($profile);

        if(isset($proRes->IsSuccess)) {
            if(!$proRes->IsSuccess) {
                $isCreated = false;
            }
        }

        return $isCreated;
    }

    function __construct() {
        Flight::route("POST /userauthorization/login", function() {
            $this->Login();
        });
        Flight::route("POST /userauthorization/userregistration", function() {
            $this->UserRegistration();
        });
        Flight::route("POST /offline/userregistration", function() {
            $this->OfflineUserRegistration();
        });
        Flight::route("POST /offline/tenantuserregistration/@tenantid", function($tenantid) {
            $this->OfflineTenantUserRegistration($tenantid);
        });
        Flight::route("GET /offline/tenantuser/activation/@email", function($email) {
            $this->OfflineTenantUserActivation($email);
        });
        Flight::route("GET /userauthorization/forgotpassword/@email", function($email) {
            $this->ForgotPassword($email);
        });
    }

}

?>
