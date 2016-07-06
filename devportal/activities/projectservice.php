<?php
	
	require_once (CORE_PATH . "/extservices.php");

	class Project {
		public $appKey;
		public $name;
		public $secretKey;
		public $description;
		public $category;
		public $type;
		public $editor;
	}

	class TenantProjectMapping {
		public $mapId;
		public $appKey;
		public $tenantId;
	}

	class UserProjectMapping {
		public $mapId;
		public $appKey;
		public $userId;
	}

	class ProjectFile {
		public $name;
		public $files;
		public $folder;
	}


	class ProjectAppBundle {
		public $appKey;
		public $price;
		public $totalPrice;
		public $apps;
	}

	class ProjectService {

		private function create(){

			$pState =  json_decode(Flight::request()->getBody());

			var_dump($pState);

			$pDesc = $pState->pdparams->description;
			$pReq = $pState->pdparams->requirements;
			$pType = $pState->pdparams->projectType;
			
			$name = $pDesc->title;
	        $appKey = $pDesc->appKey;
	        $secKey = $pDesc->secretKey;
	        $authData = json_decode($_COOKIE["authData"]);
	        $userName = $authData->Email;

			$destFolder = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $appKey . "/resources";
			if (!file_exists($destFolder)) mkdir($destFolder, 0777, true);

			$descObj;

			switch($pType){
				case "template":
					$pTemp = $pState->pdparams->templates;
					$cId = $pTemp->category->folder;
					$tId = $pTemp->template->folder;
			        $templateFolder =  TEMPLATE_PATH. '/' . $cId . '/' . $tId;

					recurse_copy($templateFolder, $destFolder);

					$descObj = $this->getDescByTemplate($cId, $tId);
					$descObj->template = new stdClass();
					$descObj->template->id = $tId;
					$descObj->template->category = $cId;
					break;
				case "bundle":
					$descObj = $this->getBlankDesc($appKey, "APPBUNDLE");
					$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"appbundle","123");
					$bundleObj = new ProjectAppBundle();
					$bundleObj->appKey = $appKey;
					$bundleObj->price = 0;
					$bundleObj->totalPrice = 0;
					$client->store()->byKeyField("appKey")->andStore($bundleObj);
					$descObj->template = new stdClass();
					$descObj->template->id = "bundle";
					$descObj->template->category = "bundle";
					break;
				default:
					$descObj = $this->getBlankDesc($appKey, "HTML5");
					$descObj->template = new stdClass();
					$descObj->template->id = "html5";
					$descObj->template->category = "html5";
					break;
			}


	        $saveObj = new Project();
	        $saveObj->appKey = $appKey;
	        $saveObj->secretKey = $secKey;
	        $saveObj->name = $name;
			$saveObj->description = $pDesc->description;
			$saveObj->category = $pDesc->category;
			$saveObj->type = "";//$pDesc->type;

			if ($pType == "bundle") $saveObj->editor = "bundle";
			else $saveObj->editor = "edit";

			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projects","123");
			$client->store()->byKeyField("appKey")->andStore($saveObj);

			$descObj->appKey = $appKey;

			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectsettings","123");
			$client->store()->byKeyField("appKey")->andStore($descObj);
		 	
			$saveObj = new TenantProjectMapping();
			$saveObj->appKey = $appKey;
			$saveObj->tenantId = DuoWorldCommon::GetHost();
			$saveObj->mapId = $saveObj->appKey . "." . $saveObj->tenantId;
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectmappingtenant","123");
			$client->store()->byKeyField("mapId")->andStore($saveObj);


			$allShares;
			if (isset($pReq->people)) $allShares = $pReq->people;
			else $allShares = array();
			
			$allShares = $this->mergeDefaultShares($userName, $authData, $allShares);
			$this->updateSharesDb($appKey, $allShares, true);

	        echo "{\"success\":true}";

		}

		private function getAppBundle($appKey){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"appbundle","123");
			$bundleObj = $client->get()->byKey($appKey);
			echo json_encode($bundleObj);
		}

		private function saveAppBundle($appKey){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"appbundle","123");
			$bundleObj =  json_decode(Flight::request()->getBody());
			$client->store()->byKeyField("appKey")->andStore($bundleObj);
		}

		private function getDescByTemplate($cId, $tId){
			$descFile =  TEMPLATE_PATH. '/' . $cId . '/' . $tId . '/project.json';
			$descStr = file_get_contents($descFile);
			$descObj = json_decode($descStr);
			return $descObj;
		}

		private function getBlankDesc($appKey, $type){
			$descStr = '{"appKey" : "' .$appKey .'","version":"1.0","type":"' . $type .'","jiraComponentId":"","data":{},"resources":[],"publishAllResources" : true,"config":[]}';
			$descObj = json_decode($descStr);
			return $descObj;
		}

		private function getKey($name){
			$timestamp = date_format(date_create(), 'U');
			return md5(DuoWorldCommon::GetHost() . $timestamp . $name);
		}

		private function getKeys($name){
	        $appKey = $this->getKey($name);
	        $secKey = $this->getKey($name . '_SECRET');
			echo "{\"app\":\"" . $appKey . "\", \"secret\":\"" . $secKey . "\"}";
		}

		private function getAllProjectsUser(){
	        $authData = json_decode($_COOKIE["authData"]);
	        $userName = $authData->Email;
			$this->getGenericMappings("projectmappinguser", "userId", $userName);
		}

		private function getAllProjectsTenant(){
			$this->getGenericMappings("projectmappingtenant", "tenantId", DuoWorldCommon::GetHost());	
		}

		private function getGenericMappings($index,$key,$value){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),$index,"123");
			
			$tmpMappings = $client->get()->byFiltering("SELECT * FROM ". $index ." WHERE ".$key . "='". $value ."'");

			$allMappings = array();
			foreach ($tmpMappings as $mapping)
				if ($mapping[$key] == $value)
					array_push($allMappings, $mapping);
			
			
			$outData = array();

			$inString = "";
			$isFirst=true;
			foreach($allMappings as $mapping){
				if ($isFirst) $isFirst = false;
				else $inString .= ",";
				$inString .= "'". $mapping["appKey"] . "'";
			}

			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projects","123");
			$outData = $client->get()->byFiltering("SELECT * FROM ". $index ." WHERE appKey IN (". $inString .")");		
			echo json_encode($outData);
		}

		private function getAllProjectInvites(){

		}

		private function getAllFiles($appKey){
			$destFolder = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $appKey . "/resources";
			echo json_encode($this->dirToArray($destFolder, $destFolder));
		}

		function dirToArray($dest, $dir) {
		  
		   $result = array();

		   $cdir = scandir($dir);
		   foreach ($cdir as $key => $value){
		      if (!in_array($value,array(".",".."))){
				$node = new ProjectFile();
				$node->name = $value;
				$node->folder = str_replace("\\","/",str_replace($dest , "", $dir));
				//if (strlen($node->folder) == 0) $node->folder = "/";
				if (is_dir($dir . DIRECTORY_SEPARATOR . $value))
					$node->files = $this->dirToArray($dest, $dir . DIRECTORY_SEPARATOR . $value);
				else
					unset($node->files);
				array_push($result, $node);
		      }
		   }
		  
		   return $result;
		} 

		function download($appKey,$filename){
		    $folder = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $appKey . "/resources";
		    $zipname = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $appKey . "/resources/" . $filename;
		    
		    zip($folder, $zipname);

		    header('Content-Type: application/zip');
		    header("Content-Disposition: attachment; filename=" + $filename);

		    readfile($zipname);
		    unlink($zipname);
		}


		function appIconUpload($appKey){
			$fileName = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $appKey . "/icon.png";
			$content = Flight::request()->getBody();
			if ($content =="N/A")
				copy(DEVPORTAL_PATH . "/appicons/default.png", $fileName);
			else
				file_put_contents($fileName, $content);
		}

		function docUpload($appKey){
			$fileName = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $appKey . "/document.pdf";
			$content = Flight::request()->getBody();
			file_put_contents($fileName, $content);
		}

		function getProject($appKey){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projects","123");
			$oneProject = $client->get()->byKey($appKey);
			echo json_encode($oneProject);
		}

		function deleteProject($appKey){
			
			$authData = json_decode($_COOKIE["authData"]);

			$client_ps = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectshares","123");
			$result = $client_ps->get()->byKey($appKey);
			$len = sizeof($result["shares"]);
			if ($len ==0 || $len == 1 || (strcmp($authData->Email, "admin@duoweb.info")==0)) {
				$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projects","123");
				$client->delete()->byKey($appKey);
				$client_ps->delete()->byKey($appKey);
			}

			echo json_encode($oneProject);
		}

		function updateProject($appKey){
			$saveObj =  json_decode(Flight::request()->getBody());

			if (isset($saveObj->desc)){
				$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projects","123");
				$client->store()->byKeyField("appKey")->andStore($saveObj->desc);
			}

			if (isset($saveObj->settings)){
				$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectsettings","123");
				$client->store()->byKeyField("appKey")->andStore($saveObj->settings);
			}
			
			if (isset($saveObj->scope)){
				$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectscope","123");
				$client->store()->byKeyField("appKey")->andStoreArray($saveObj->scope);
			}

			header("Content-type: application/json");
			echo '{"success":true}';
		}

		function getShareUsers(){
			$proxy = new AuthProxy();
			$mappings = $proxy->GetTenantUsers(DuoWorldCommon::GetHost());
			$users = array();
			foreach ($mappings as $mapping){
				$client = ObjectStoreClient::WithNamespace("com.duosoftware.auth","users","123");
				$res = $client->get()->bySearching("UserID:" . $mapping);
				if (!isset($res["IsSuccess"]))
				if (sizeof($res)>0)
					array_push($users, array("EmailAddress"=> $res[0]["EmailAddress"],"Name"=> $res[0]["Name"],"UserID"=> $res[0]["UserID"]));
				
			}


			if (sizeof($users) ==0 ){
				array_push($users, array("EmailAddress"=> "admin@duoweb.info","Name"=> "Administrator","UserID"=> "0"));
				$authData = json_decode($_COOKIE["authData"]);
				if (strcmp($authData->Email, "admin@duoweb.info") != 0)
					array_push($users, array("EmailAddress"=> $authData->Email,"Name"=> $authData->Name,"UserID"=> $authData->UserID));
			}

			echo json_encode($users);
			
		}

		function getShares($appKey){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectshares","123");
			$result = $client->get()->byKey($appKey);
			echo json_encode($result);
		}

		function addShare($appKey,$userName){
			$saveObj = new UserProjectMapping();
			$saveObj->appKey = $appKey;
			$saveObj->userId = $userName;
			$saveObj->mapId = $saveObj->appKey . "." . $saveObj->userId;
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectmappinguser","123");
			$client->store()->byKeyField("mapId")->andStore($saveObj);
		}

		function removeShare($appKey,$userId){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectmappinguser","123");
			$client->delete()->byKeyField("mapId")->andDelete($appKey. "." . $userId);
		}

		function updateSharesDb($appKey, $newObj, $isNew){
			$addShares = $isNew ? $newObj : array();
			$removeShares = array();

			if (!$isNew){
				$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectshares","123");
				$currentObj = $client->get()->byKey($appKey);
				echo "current shares:";
				var_dump($currentObj);
				if (!isset($currentObj->IsSuccess)){

					foreach ($newObj as $nwo){
						$isAvailable = false;
						foreach ($currentObj as $cuo) {
							if (strcmp($cuo["email"], $nwo["email"]) ==0){
								$isAvailable = true;
								break;
							}
						}

						if (!$isAvailable)
							array_push($addShares, $nwo);
						
					}

					foreach ($currentObj as $cuo){
						$isAvailable = false;
						foreach ($newObj as $nwo) {
							if (strcmp($cuo["email"], $nwo["email"]) ==0){
								$isAvailable = true;
								break;
							}
						}

						if (!$isAvailable)
							array_push($removeShares, $cuo);
						
					}
				}
			}


			foreach ($addShares as $share){
				$tmpshare;
				if (is_object($share)) $tmpshare = get_object_vars($share);
				else $tmpshare = $share;

				$this->addShare($appKey, $tmpshare["email"]);
			}

			foreach ($removeShares as $share){
				$tmpshare;
				if (is_object($share)) $tmpshare = get_object_vars($share);
				else $tmpshare = $share;

				$this->removeShare($appKey, $share["email"]);
			}



			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectshares","123");
			$storeArray = $arrayName = array('appKey' => $appKey, "shares" => $newObj);
			$shareObj = $client->store()->byKeyField("appKey")->andStoreArray($storeArray);
			
		}


		private function mergeDefaultShares($userName, $authData, $allShares){
			$defaultShares;
			if (strcmp("admin@duoweb.info", $userName)  == 0) $defaultShares = array("admin@duoweb.info");
			else $defaultShares = array($userName, "admin@duoweb.info"); 

			//var_dump($allShares);
			//http_response_code(501);
			//exit();

			foreach ($defaultShares as $share){
				$isAvailable = false;

				foreach ($allShares as $cShare)
				if (isset($cShare->email))
				if (strcmp($cShare->email, $share) == 0){
					$isAvailable = true;
					break;
				}

				if ($isAvailable == false){
					//[{"name":"Administrator","email":"admin@duoweb.info","image":"views/images/user.png","_lowername":"administrator"}] 
					$uName = (strcmp("admin@duoweb.info", $share) ==0) ? "Administrator" : $authData->Name;
					$tmpObj = $arrayName = array('name' => $uName, "email" => $share, "image"=>"views/images/user.png", "_lowername"=> strtolower ($uName));
					array_push($allShares, $tmpObj);
				}
			}

			return $allShares;
		}

		private function updateShares($appKey){

	        $authData = json_decode($_COOKIE["authData"]);
	        $userName = $authData->Email;

			$allShares = json_decode(Flight::request()->getBody());
			
			$saveShares = $this->mergeDefaultShares($userName, $authData, $allShares);
			echo "Saving these shares!!!";
			var_dump($saveShares);
			$this->updateSharesDb($appKey, $saveShares, false);
		}

		private function publish($appKey){
			$results = (new Publisher($appKey,[MAIN_DOMAIN, $_SERVER["HTTP_HOST"] ]))->Publish();
			header("Content-type: application/json");
			echo json_encode($results, JSON_PRETTY_PRINT);
		}

		private function getProjectSettings($appKey){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectsettings","123");
			$oneProject = $client->get()->byKey($appKey);

			header("Content-type: application/json");
			echo json_encode($oneProject);
		}

		private function getScope($appKey){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectscope","123");
			$allFunctions = $client->get()->byKey($appKey);
			$canCreateBlank = false;

			if (!is_object($allFunctions)) $canCreateBlank = true;
			else if (!isset($allFunctions->appKey))$canCreateBlank = true;
			

			if ($canCreateBlank){
				$allFunctions = new stdClass();
				$allFunctions->appKey = $appKey;
				$allFunctions->scope = new stdClass();
				$allFunctions->scope->data = array();
				$allFunctions->scope->functions = array();
			}

			header("Content-type: application/json");
			echo json_encode($allFunctions);
		}

		function __construct(){
			/////Creation
			Flight::route("GET /project/create/key/@name", function ($name){ $this->getKeys($name); });
			Flight::route("POST /project/create", function (){ $this->create(); });

			/////Retrieval
			Flight::route("GET /project/get/@appKey", function ($appKey){ $this->getProject($appKey); });
			Flight::route("GET /project/getuser", function (){ $this->getAllProjectsUser(); });
			Flight::route("GET /project/gettenant", function (){ $this->getAllProjectsTenant(); });
			Flight::route("GET /project/gettenantinvites", function (){ $this->getAllProjectInvites(); });

			/////Modification
			Flight::route("GET /project/delete/@appKey", function ($appKey){ $this->deleteProject($appKey); });
			Flight::route("POST /project/update/@appKey", function ($appKey){ $this->updateProject($appKey); });
			

			/////Files		
			Flight::route("GET /project/files/@appKey", function ($appKey){ $this->getAllFiles($appKey); });
			Flight::route("GET /project/download/@appKey/@filename", function ($appKey, $filename){ $this->download($appKey,$filename); });
			Flight::route("POST /project/iconupload/@appKey", function ($appKey){ $this->appIconUpload($appKey); });
			Flight::route("POST /project/docupload/@appKey", function ($appKey){ $this->docUpload($appKey); });

			/////Bundling
			Flight::route("GET /project/getBundle/@appKey", function ($appKey){ $this->getAppBundle($appKey); });
			Flight::route("POST /project/saveBundle/@appKey", function ($appKey){ $this->saveAppBundle($appKey); });

			/////Sharing
			Flight::route("GET /project/share/getusers", function (){ $this->getShareUsers(); });
			Flight::route("GET /project/share/get/@appKey", function ($appKey){ $this->getShares($appKey); });
			Flight::route("POST /project/share/update/@appKey", function ($appKey){ $this->updateShares($appKey); });

			Flight::route("POST /project/publish/@appKey", function ($appKey){ $this->publish($appKey); });
			Flight::route("GET /project/settings/@appKey", function ($appKey){ $this->getProjectSettings($appKey); });

			/////Functionality Seggregation
			Flight::route("GET /project/scope/@appKey", function ($appkey) {$this->getScope($appkey);});
			
			//Flight::route("GET /project/share/remove/@appKey/@userid", function ($appKey, $userId){ $this->addShare(); });
			//Flight::route("GET /project/share/add/@appKey/@userid", function ($appKey, $userId){ $this->removeShare($appKey,$userId); });
		}
	}
?>
