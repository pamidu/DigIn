<?php
	require_once (ROOT_PATH ."/include/duoapi/objectstoreproxy.php");
	require_once (ROOT_PATH ."/payapi/duoapi/tenantapiproxy.php");
	
	class user{
		public $groupId;
		public $groupname;
		public $users;
		public $parentId;
		public $active;
		
		public function __construct(){
			$this->users = array();
		}
	}
	class Usergroup {
		public function test(){
			echo "Hello World!!!";
		}
		public function addUserGroup(){
			$usergroup=new user();
			$post=json_decode(Flight::request()->getBody());
			DuoWorldCommon::mapToObject($post,$usergroup);
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$usergroup->active=true;
			$respond=$client->store()->byKeyField("groupId")->andStore($usergroup);
			//var_dump($respond);
			 echo json_encode($respond);
		}
		public function addUserToGroup(){
		$post=json_decode(Flight::request()->getBody());
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$respond=$client->get()->byKey($post->groupId);
			//var_dump($respond->users);
			if(empty($respond)){
				header('Content-Type: application/json');
				echo json_encode('{"issucces":"false","reason":"please add user group first"}');
			}else{
				foreach ($post->users as $user) {
					// echo "$respond";
					// echo $respond[0];
					array_push($respond->users,$user);
				}
				$Inrespond=$client->store()->byKeyField("groupId")->andStore($respond);
				echo json_encode($Inrespond);
			}
		}
		public function getUserFromGroup($groupId){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$respond=$client->get()->byKey($groupId);
			echo json_encode($respond->users);
			
			
		}
		public function getGroupsFromUser($userId){
			//$post=json_decode(Flight::request()->getBody());
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$respond=$client->get()->byFiltering($userId);
			echo json_encode($respond);
			
		}
		public function removeUserFromGroup(){
			$post=json_decode(Flight::request()->getBody());
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$respond=$client->get()->byKey($post->groupId);
			echo json_encode(sizeof($post->users));
			// var_dump($post->users);
			echo json_encode(empty($post->users));
			if(!empty($post->users)){
				foreach ($post->users as $rmUser ) {
					echo json_encode($rmUser);
					if(($key = array_search($rmUser,$respond->users)) !== false) {
    					$k = array_search($rmUser, $respond->users);
    				if($k==0){
    					array_splice($respond->users, $k, 1);
    				}
    				else{
    					array_splice($respond->users, $k, $k);
    				}
    				$Inrespond=$client->store()->byKeyField("groupId")->andStore($respond);
    				
					}			
					else{
						//echo json_encode("user not  found...");
					}
				}
			}
			echo json_encode($Inrespond);
		}
		public function removeUserGroup($groupId){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$respond=$client->get()->byKey($groupId);
			$respond->active=false;
			$Inrespond=$client->store()->byKeyField("groupId")->andStore($respond);
			echo json_encode($Inrespond);
		
		}
		public function getAllGroups(){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$respond=$client->get()->andSearch("active:" . true);
			echo json_encode($respond);
		}
		private function getSharableObjects(){
			$authData = json_decode($_COOKIE["authData"]);
			$proxy = new TenantProxy($authData->SecurityToken);
			$mappings = $proxy->GetTenantUsers(DuoWorldCommon::GetHost());
			
			$users = array();
			$inStr = "";
			$isFirst = true;
			foreach ($mappings as $mapping){
				if ($isFirst) $isFirst = false;
				else $inStr .=",";
				$inStr .= "'$mapping'";
			}
			$client = ObjectStoreClient::WithNamespace("com.duosoftware.auth","users","123");
			$query = "select * from users where UserID in (" . $inStr . ")";
			$allTenantUsers = $client->get()->byFiltering($query);
			if (sizeof($allTenantUsers) ==0){
				array_push($users, array("Id"=> "admin@duoweb.info","Name"=> "Administrator","UserID"=> "0", "Type"=>"User"));
				$authData = json_decode($_COOKIE["authData"]);
				if (strcmp($authData->Email, "admin@duoweb.info") != 0)
					array_push($users, array("Id"=> $authData->Email,"Name"=> $authData->Name,"UserID"=> $authData->UserID, "Type"=>"User"));
			} else {
				foreach ($allTenantUsers as $user)
					array_push($users, array("Id"=> $user["EmailAddress"],"Name"=> $user["Name"],"UserID"=> $user["UserID"], "Type"=>"User"));
			}
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"UserGroup","123");
			$allGroups = $client->get()->andSearch("active:" . true);
			if (sizeof($allGroups) !=0) {
				foreach ($allGroups as $group)
					if (isset($group["groupId"]) && isset($group["active"]))
						if ($group["active"] === true)
							array_push($users, array("Id"=> $group["groupId"],"Name"=> (isset($group["groupname"])? $group["groupname"] : ""),"UserID"=> $group["groupId"], "Type"=>"Group"));
			}
			echo json_encode($users);
		}
		private function saveUiShareData($appKey){
			$post=json_decode(Flight::request()->getBody());
			$uiState = new stdClass();
			$uiState->appKey = $appKey;
			$uiState->shares = $post;
			$canShare  = false;
			$canUnshare = false;
			
			//"[{"name":"Lasitha Senanayake","email":"lasitha.senanayake@gmail.com","image":"img/user.png","_lowername":"lasitha senanayake","$$hashKey":"object:66"}]"
			$addShareUrl = "http://" . $_SERVER["HTTP_HOST"] . "/apps/$appKey?share=";
			$removeShareUrl = "http://" . $_SERVER["HTTP_HOST"] . "/apps/$appKey?unshare=";
			$previousShares = new stdClass();
			$tmpShares = $this->getUserShares($appKey);	
			if (!isset($tmpShares) || !is_array($tmpShares))
				$previousShares->shares = [];
			else 
				$previousShares->shares = $tmpShares;
			$isFirst = true;
			foreach ($uiState->shares as $share)
			{
				$isFound = false;
				foreach ($previousShares->shares as $pShare)
					if (strcmp($pShare->id, $share->id) === 0){
						$isFound = true;
						break;
					}
				if (!$isFound){
					if ($isFirst) $isFirst = false;
					else $addShareUrl .= ",";
					$addShareUrl .= "$share->type:$share->id";
					$canShare = true;
				}
					
			}
			$isFirst = true;
			foreach ($previousShares->shares as $share)
			{
				$isFound = false;
				foreach ($uiState->shares as $pShare)
					if (strcmp($pShare->id, $share->id) === 0){
						$isFound = true;
						break;
					}
				if (!$isFound){
					if ($isFirst) $isFirst = false;
					else $removeShareUrl .= ",";
					$removeShareUrl .= "$share->type:$share->id";
					$canUnshare = true;
				}
					
			}
			if ($this->callShareUrl($addShareUrl, $canShare)){
				if ($this->callShareUrl($removeShareUrl, $canUnshare)){
					$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"SettingAppShares","123");
					$respond=$client->store()->byKeyField("appKey")->andStore($uiState);
					if (isset($respond->IsSuccess)){
						if ($respond->IsSuccess)
							echo '{"success" : true, "message" : "user/group sharing/unsharing successfule"}';
						else
							echo '{"success" : false, "message" : "error saving ui state in object store"}';	
					}else
						echo '{"success" : false, "message" : "error saving ui state in object store"}';	
				}else{
					echo '{"success" : false, "message" : "error sharing apps to selected groups/users"}';	
				}
			}else{
				echo '{"success" : false, "message" : "error sharing apps to selected groups/users"}';
			}
		}
		private function callShareUrl($url, $isValid){
			if (!isset($isValid))
				return true;
			if (!$isValid)
				return true;
			$cookies = array();
			foreach ($_COOKIE as $key => $value)
			    if ($key != 'Array')
			        $cookies[] = $key . '=' . $value;
	
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_COOKIE, implode(';', $cookies));
			curl_setopt($ch, CURLOPT_HTTPGET,true);
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_HTTPHEADER,  array('Host: '. DuoWorldCommon::GetHost(), 'Content-Type: application/json' ));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$result = curl_exec($ch);
			return json_decode($result);
		}
		private function loadUiShareData($appKey){
			$shares = $this->getUserShares($appKey);
			echo json_encode($shares);
		}		
		private function getUserShares($appKey){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"SettingAppShares","123");
			$data=$client->get()->byKey($appKey);
			$shares;
			if (is_object($data)){
				if (isset($data->IsSuccess))
					$shares = new stdClass();
				else
					$shares = $data->shares;
			}
			
			if (!isset($shares))
				$shares = array();
			return $shares;
		}
		function __construct(){
			Flight::route("GET /test", function (){$this->test();});
			Flight::route("POST /addUserGroup", function (){$this->addUserGroup();});
			Flight::route("POST /addUserToGroup", function (){$this->addUserToGroup();});
			Flight::route("GET /getUserFromGroup/@groupId", function ($groupId){$this->getUserFromGroup($groupId);});
			Flight::route("GET /getGroupsFromUser/@userId", function ($userId){$this->getGroupsFromUser($userId);});
			Flight::route("POST /removeUserFromGroup", function (){$this->removeUserFromGroup();});
			Flight::route("GET /removeUserGroup/@groupId", function ($groupId){$this->removeUserGroup($groupId);});
			Flight::route("GET /getAllGroups/", function (){$this->getAllGroups();});
			Flight::route("GET /getSharableObjects/", function (){$this->getSharableObjects();});
			Flight::route("POST /saveUiShareData/@appKey", function ($appKey){$this->saveUiShareData($appKey);});
			Flight::route("GET /loadUiShareData/@appKey", function ($appKey){$this->loadUiShareData($appKey);});
		}
	}
?>