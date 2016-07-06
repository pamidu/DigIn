<?php
require_once (ROOT_PATH ."/include/duoapi/objectstoreproxy.php");

class TenantCreationRequest {
    public $TenantID;
    public $TenantType;
    public $Name;
    public $Statistic;
    public $Private;
    public $OtherData;
}

class TenantConfiguration {
    public $companyConfiguration;
    public $shellConfiguration;
    public $defaultAppConfiguration;
    public $tenantId;
}

class TenantService {

    private $securityToken;
    private $apps;
    
    public function ServiceInfo() {
        $info = new stdClass();
        $info->ServiceName = "Tenant Service";
        $info->Version = "1.0.2";
        $info->VersionUpdates = "Added two endpoints, store/get shell configurations.";

        echo json_encode($info);
    }

    public function CreateTenant() {
        $uiData = Flight::request()->data;
        $tenantObj = new TenantCreationRequest();
        $relUrl = "/tenant/CreateTenant/";

        foreach ($tenantObj as $key => $value) {
            if(!isset($uiData->$key)) { 
                echo '{"Success":false, "Message": "Request payload should contains '. $key .' property.", "Data": {}}'; return;
            }
        }

        DuoWorldCommon::mapToObject($uiData, $tenantObj);

        // cross check against database whether tenant id is already registered.
        $tenantResponse = json_decode($this->retriveTenantData($tenantObj->TenantID));
        if(isset($tenantResponse->TenantID) && $tenantResponse->TenantID === $tenantObj->TenantID) {
            echo '{"Success":false, "Message": "' .$tenantObj->TenantID. ' is already registered.", "Data": {"TenantID" :' .$tenantObj->TenantID. '}}'; return;   
           
	}
        
        $appStr = @file_get_contents("appcodes.json");
        if(!$appStr) {
            echo '{"Success":false, "Message": "appcodes.json file not found.", "Data": {}}'; return;
        }
        
        $Ttype = $tenantObj->TenantType;
        $allApps = json_decode($appStr);
        $this->apps = @$allApps->$Ttype;
        if(is_null($this->apps)) {
            echo '{"Success":false, "Message": "Invalid tenant type.", "Data": {}}'; return;
        }

        //$tenantObj->Shell = "ui.html#/home"; // set shell url
	$tenantObj->Shell = "/#/welcome"; // set shell url
        unset($tenantObj->TenantType); 
        
        if(empty($tenantObj->OtherData)) {
            $tenantObj->OtherData = new stdClass();
        }
        // execute post request to auth
        $invoker = new WsInvoker(SVC_AUTH_URL);
        $invoker->addHeader('securityToken', $this->securityToken);
        $tenantObj = $invoker->post($relUrl, $tenantObj);
        $tenantDecoded = json_decode($tenantObj);

        if($tenantDecoded) {
            if(isset($tenantDecoded->TenantID)) {
                $this->installApps($tenantDecoded->TenantID);
                echo '{"Success":true, "Message": "' . $tenantDecoded->TenantID . ' is successfully created.", "Data":' . $tenantObj . '}'; return; 
            }else {
                echo '{"Success":false, "Message": "' . $tenantObj . '", "Data": {}}'; return;    
            }
        }else {
            echo '{"Success":false, "Message": "' . $tenantObj . '", "Data": {}}'; return;    
        }
    }

    public function GetTenantInfo($tenantid) {
        $tenantResponse = $this->retriveTenantData($tenantid);
        $tenantResDecoded = json_decode($tenantResponse);
        if($tenantResDecoded) {
            if(isset($tenantResDecoded->TenantID)) { 
                echo $tenantResponse;
            }else {
                echo '{"Success":false, "Message": "' . $tenantResponse . '", "Data": {}}'; return;   
            }
        }else {
                echo '{"Success":false, "Message": "' . $tenantResponse . '", "Data": {}}'; return;    
        }
    }
    
    public function TranferAdmin($tenantid, $email) {
 
        $tranferUrl = "/tenant/TranferAdmin/";
        $sessionUrl = "/GetSession/";
            
        // execute post request to auth
        $invoker = new WsInvoker(SVC_AUTH_URL);
        $invoker->addHeader('securityToken', $this->securityToken);
        $sessionObj = $invoker->get($sessionUrl . $this->securityToken . "/" . $tenantid);
        $sessionDecoded = json_decode($sessionObj);
        if(isset($sessionDecoded->SecurityToken) && isset($sessionDecoded->UserID)) {
            $invoker = new WsInvoker(SVC_AUTH_URL);
            $invoker->addHeader('securityToken', $sessionDecoded->SecurityToken);
            $tranferObj = $invoker->get($tranferUrl . $email);
            if(!$tranferObj) {
                echo '{"Success":false, "Message": "Failed tenant Transfer.", "Data": {}}'; return; 
            }
            else {
                echo '{"Success":true, "Message": "Successfully tranfered.", "Data": {}}'; return; 
            }
        }else {
            echo '{"Success":false, "Message": "' . $sessionObj . '", "Data": {}}'; return;
        }

    }
    
    public function StoreTenantShellConfig($tenantid) {
        
        $configData = Flight::request()->data;
        $tenantData = json_decode($this->retriveTenantData($tenantid));
        
        if(!isset($tenantData->TenantID) || empty($tenantData->TenantID))  { // tenantid is not valid.
            echo '{"Success":false, "Message": "Invalid tenant id", "Data": {}}'; return;
        }
        
        $tenantConfig = new TenantConfiguration();
        foreach ($tenantConfig as $key => $value) {
            if(!isset($configData->$key)) { 
                echo '{"Success":false, "Message": "Request payload should contains '. $key .' property.", "Data": {}}'; return;
            }
        }

        DuoWorldCommon::mapToObject($configData, $tenantConfig);
    
        $client = ObjectStoreClient::WithNamespace($tenantid, "tenantconfig", $this->securityToken);
        $response = $client->store()->byKeyField("tenantId")->andStore($tenantConfig);
        if(isset($response->IsSuccess)) {
            if($response->IsSuccess) {
                echo '{"Success":true, "Message": "succssfully stored shell configurations.", "Data": {}}'; return; 
            }else {
                 echo '{"Success":false, "Message": "'. $response->Message .'", "Data": {}}'; return; 
            }
        }
    }
    
    public function GetTenantShellConfig() {

        $client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"tenantconfig","123");
        $response = $client->get()->byKey(DuoWorldCommon::GetHost());
        
        if(!isset($response->IsSuccess))
            echo json_encode($response);
        else {
            echo '{"Success":false, "Message": "Error getting while retrieving shell configurations.", "Data": {}}'; return; 
        }
    }
    
    private function retriveTenantData($tenantid) {
        $relUrl = "/tenant/GetTenant/";
        
        // execute post request to auth
        $invoker = new WsInvoker(SVC_AUTH_URL);
        $invoker->addHeader('securityToken', $this->securityToken);
        $tenantObj = $invoker->get($relUrl . $tenantid);
        return $tenantObj;
    }
    
    private function installApps($tenantid) {
        require_once("appinstaller.php");
        $installer = new AppInstaller();
        foreach($this->apps as $app) {
           $installer->install($app, $tenantid);
        }
        return;
    }

    function __construct() {
        
        $this->securityToken = $_COOKIE['securityToken'];
        
        Flight::route("GET /tenant/serviceinfo", function() {
            $this->ServiceInfo();
        });
        Flight::route("POST /tenant", function() {
            $this->CreateTenant();
        });
        Flight::route("GET /tenant/@tenantid", function($tenantid) {
            $this->GetTenantInfo($tenantid);
        });
        Flight::route("GET /tenant/tranferadmin/@tenantid/@email", function($tenantid, $email) {
            $this->TranferAdmin($tenantid, $email);
        });
        Flight::route("POST /tenant/shell/configurations/@tenantid", function($tenantid) {
            $this->StoreTenantShellConfig($tenantid);
        });
        Flight::route("GET /tenant/shell/configurations", function() {
            $this->GetTenantShellConfig(); 
        });
    }
}
