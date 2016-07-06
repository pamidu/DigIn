<?php

	class Publisher {

		private $appKey;
		private $tempPath;
		private $resPath;
		private $tenants;

		public function Publish(){
			
			if (!file_exists($this->resPath))
				mkdir($this->resPath, 0777, true);

			$appFile = "$this->tempPath/app.json";
			$descFile = "$this->tempPath/descriptor.json";
			$scopeFile = "$this->tempPath/scope.json";
			
			$descriptor = $this->getDescriptor();
			$settings = $this->getSettings();

			$publishResults;
			$bundledApps;
			if (strcmp($settings->type, "APPBUNDLE") == 0){
				$publishResults = $this->publishAppBundle();
				$bundledApps = $this->generateBundleList();
			}

			switch ($settings->type){
				case "wfactivity":
					$this->publishActivity($settings, $descriptor);
					break;
				default:
					$appObject = $this->getProject($descriptor);
					$scopeObjet = $this->getScope();

					if (isset($bundledApps)) $appObject->Apps = $bundledApps;

					file_put_contents($appFile, json_encode($appObject));
					file_put_contents($descFile, json_encode($settings));
					file_put_contents($scopeFile, json_encode($scopeObjet));

					$wsPath = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $this->appKey . "/resources";
					recurse_copy($wsPath, $this->resPath);

					$iconFile = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $this->appKey . "/icon.png";
					copy($iconFile, "$this->tempPath/icon.png");

					$zipName = TEMP_PATH."/". "publish_$this->appKey.zip";
					zip($this->tempPath,  $zipName);

					recurse_rmdir($this->tempPath);
					$publishResults = $this->postZip($zipName);
					unlink ($zipName);
					break;
			}

			$marketObj =  json_decode(Flight::request()->getBody());
			
			if (isset($marketObj->appKey)){
				if (isset($marketObj->osHeaders))unset($marketObj->osHeaders);
				if (isset($marketObj->secretKey))unset($marketObj->secretKey);
				if (isset($marketObj->iconUrl)) $marketObj->iconUrl .= "http://" . MAIN_DOMAIN;
				$client = ObjectStoreClient::WithNamespace(MAIN_DOMAIN,"appstoreapps","123");	
				$client->store()->byKeyField("appKey")->andStore($marketObj);
			}
			
			return $publishResults;
		}

		private function generateBundleList(){
			$appArray = array();

			$bundleFile =  STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $this->appKey . "/resources/bundle.json";
			$bundleObj = json_decode(file_get_contents($bundleFile));
			
			foreach (((array)$bundleObj) as $bKey=>$bValue)
			if ($bValue){
				$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projects","123");
				$oneProject = $client->get()->byKey($bKey);

				$appObj = new stdClass();
				$appObj->ApplicationID = $oneProject->appKey;
				$appObj->SecretKey = $oneProject->secretKey;
				$appObj->Name = $oneProject->name;
				$appObj->Description = $oneProject->description;
				$appObj->AppType = $oneProject->type;
				$appObj->AppUri = "//";
				$appObj->ImageId = "";
				$appObj->iconUrl = "/apps/$oneProject->appKey/?meta=icon";

				array_push($appArray, $appObj);
			}

			return $appArray;
		}

		private function publishAppBundle(){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"appbundle","123");
			$bundleObj = $client->get()->byKey($this->appKey);

			$resultLog = new stdClass();

			if (isset($bundleObj->apps)){
				foreach($bundleObj->apps as $app=>$appV){
					if ($appV === TRUE)
						$resultLog->$app = (new Publisher($app,$this->tenants))->Publish();			
				}
				$bundleFile =  STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $this->appKey . "/resources/bundle.json";
				file_put_contents($bundleFile, json_encode($bundleObj->apps));
			}

			return $resultLog;
		}

		private function publishActivity($desc,$project){
			$codePath = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $this->appKey . "/resources/template.go";
			$codeData =  file_get_contents($codePath);

			if (!isset($desc->data->activityName))
				$desc->data->activityName = str_replace(" ", "_", $project->name);
			else if (strlen($desc->data->activityName) ==0 )
				$desc->data->activityName = str_replace(" ", "_", $project->name);

			if (!isset($desc->data->activityDescription))
				$desc->data->activityDescription = $project->description;
			else if (strlen($desc->data->activityDescription) ==0 )
				$desc->data->activityDescription = $project->description;

			$postData = new stdClass();
			$postData->ID = $this->appKey;
			$postData->ActivityName = $desc->data->activityName;
			$postData->Description = $desc->data->activityDescription;
			$postData->GoCode = $codeData;

		    $ch = curl_init();
			curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
			curl_setopt($ch, CURLOPT_POST,1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData)); 
		    curl_setopt($ch, CURLOPT_URL, SVC_SMOOTHFLOW_URL . "/processengine/PublishActivity/$postData->ActivityName/$this->appKey");
		    $data = curl_exec($ch);
		    $resultObject = json_encode($data);
		    echo $data;
		    curl_close($ch);

		    if (is_object($resultObject))
		    	if (isset($resultObject->Status))
		    		if ($resultObject->Status)
		    			$this->publishExtraAvtivityData($desc, $project);
		}

		private function publishExtraAvtivityData($desc, $project){
			/*
        $otherInfo = new stdClass();

        $otherInfo->library_id = $scope.createuuid(); //js
        $otherInfo->schema_id = 0;
        $otherInfo->parentView = "default";
        $otherInfo->Name = saveevent.data.ActivityID; //js
        $otherInfo->Description = saveevent.data.Description; //js
        $otherInfo->X = 0;
        $otherInfo->Y = 0;
        $otherInfo->Icon = 'ion-ios-photos';
        $otherInfo->Variables = saveevent.data.Variables; //js
        $otherInfo->Type = 'activity';
        $otherInfo->Category = 'activity';

        $otherInfo->ControlEditDisabled = true;
        $otherInfo->SourceEndpoints = array(array("id" => 0, "location" => "BottomCenter"));
        $otherInfo->TargetEndpoints = array(array("id" => 0, "location" => "TopCenter"));
        $otherInfo->OtherData = array("Name" => "", "MobileNo" => , "Email" => "", Company=>"");
        $otherInfo->Annotation = "";
        $otherInfo->DisplayName = saveevent.data.DisplayName; //js
			*/
		}

		private function getDescriptor(){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projects","123");
			$oneProject = $client->get()->byKey($this->appKey);
			return $oneProject;
		}

		private function getProject($oneProject){

			$appObj = new stdClass();
			$appObj->ApplicationID = $oneProject->appKey;
			$appObj->SecretKey = $oneProject->secretKey;
			$appObj->Name = $oneProject->name;
			$appObj->Description = $oneProject->description;
			$appObj->AppType = $oneProject->type;
			$appObj->AppUri = "//";
			$appObj->ImageId = "";
			$appObj->iconUrl = "/apps/$oneProject->appKey/?meta=icon";
			return $appObj;
		}

		private function getScope(){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectscope","123");
			$oneProject = $client->get()->byKey($this->appKey);
			
			$canCreatenew = false;

			if (!is_object($oneProject))$canCreatenew = true;
			else if (!isset($oneProject->appKey)) $canCreatenew = true;

			if ($canCreatenew){
				$oneProject = new stdClass();
				$oneProject->appKey = $this->appKey;
				$oneProject->scope = new stdClass();
				$oneProject->scope->data = array();
				$oneProject->scope->functions = array();
			}

			if (isset($oneProject->__osHeaders))
				unset($oneProject->__osHeaders);
			
			return $oneProject;
		}

		private function getSettings(){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectsettings","123");
			$oneProject = $client->get()->byKey($this->appKey);
			return $oneProject;
		}

		private function postZip($zipName){
			$zipContents = file_get_contents($zipName);

			$resultLog = new stdClass();

			foreach ($this->tenants as $tenant){
			    $ch = curl_init();

				curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
				curl_setopt($ch, CURLOPT_POST,1);
				curl_setopt($ch, CURLOPT_POSTFIELDS, $zipContents); 
				curl_setopt($ch, CURLOPT_HTTPHEADER, array("Host: $tenant")); 
				curl_setopt($ch, CURLOPT_COOKIE, "securityToken=" . $_COOKIE["securityToken"] . "; authData=". $_COOKIE["authData"]);
			    curl_setopt($ch, CURLOPT_URL, "http://localhost/apps/$this->appKey");
			    $data = curl_exec($ch);
			    $resultLog->$tenant = json_decode($data);
			    curl_close($ch);
			}

			return $resultLog;
		}

		function __construct($appKey, $tenants){
			$this->tenants = $tenants;
			$this->appKey = $appKey;
			$this->tempPath = TEMP_PATH . "/publish_$appKey";
			$this->resPath = "$this->tempPath/resources";
		}
	}


?>
