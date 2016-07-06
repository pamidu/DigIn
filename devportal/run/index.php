<?php
	require_once($_SERVER["DOCUMENT_ROOT"] . "/include/config.php");
	require_once(ROOT_PATH. "/dwcommon.php");
	require_once(ROOT_PATH. "/devportal/config.php");


	function system_extension_mime_types() {
	    $out = array();
	    $file = fopen('mime.types', 'r');
	    while(($line = fgets($file)) !== false) {
	        $line = trim(preg_replace('/#.*/', '', $line));
	        if(!$line)
	            continue;
	        $parts = preg_split('/\s+/', $line);
	        if(count($parts) == 1)
	            continue;
	        $type = array_shift($parts);
	        foreach($parts as $part)
	            $out[$part] = $type;
	    }
	    fclose($file);
	    return $out;
	}

	function system_extension_mime_type($file) {
	    static $types;
	    if(!isset($types))
	        $types = system_extension_mime_types();
	    $ext = pathinfo($file, PATHINFO_EXTENSION);
	    if(!$ext)
	        $ext = $file;
	    $ext = strtolower($ext);
	    return isset($types[$ext]) ? $types[$ext] : null;
	}

	function getExecutionInfo(){
		$currentPath = str_replace(str_replace("\\","/", strtolower($_SERVER["DOCUMENT_ROOT"])), "", str_replace("\\","/", strtolower(dirname(__FILE__))));
		$relativeUrl = str_replace($currentPath, "", $_SERVER["REQUEST_URI"]);
		
		$parts = explode("/", $relativeUrl);

		if (sizeof($parts) > 1){
			$appKey = $parts[1];
			$rest = str_replace("/$appKey", "", $relativeUrl);

			$outData = new stdClass();
			$outData->appKey = trim($appKey);
			$outData->rest = trim($rest);
			$outData->fullPath = $relativeUrl;
			return $outData;
		}
	}

	function checkCookie($exeInfo){
		$canReload=false;
		if (isset($_COOKIE["DescUpdated"])){
    		unset($_COOKIE['DescUpdated']);
    		setcookie('DescUpdated', null, -1, '/devportal/');
    		$canReload = true;
		}

		if (!isset($_COOKIE["pathinfo-$exeInfo->appKey"])) $canReload = true;

		if ($canReload){
			require_once(ROOT_PATH . "/payapi/duoapi/objectstoreproxy.php");

			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectsettings","123");
			$desc = $client->get()->byKey($exeInfo->appKey);
			
			$defVal;
			if (isset($desc->data))
				if (isset($desc->data->services))
					$defVal = $desc->data->services;

			if (!isset($defVal))
				$defVal = array();

			setcookie("pathinfo-$exeInfo->appKey", json_encode($defVal), time() + (86400 * 30), "/devportal/run/$exeInfo->appKey/resources");

			return $defVal;
		}

		return json_decode($_COOKIE["pathinfo-$exeInfo->appKey"]);
	}

	function handleServiceError($errno, $errstr, $errfile, $errline){
		$message = new stdClass();
		$message->no = $errno;
		$message->message = $errstr;
		$message->file = $errfile;
		$message->line = $errline;

		echo json_encode(DwFramework::ReturnMessage($message, false),JSON_PRETTY_PRINT);
		exit();
	}

	function handleServiceException($exception){
		echo json_encode(DwFramework::ReturnMessage($exception->getMessage(), false),JSON_PRETTY_PRINT);
		exit();
	}

	function executePhpService($exeInfo, $pathInfo, $vars){
		$fileToInclude = STORAGE_LOCATION. "/". DuoWorldCommon::GetHost()  . "/devapps" . "/$exeInfo->appKey/resources". ($pathInfo->phpFile[0] == "/" ? $pathInfo->phpFile : "/". $pathInfo->phpFile);
		if (file_exists($fileToInclude)){
			require_once(ROOT_PATH . "/payapi/duoapi/objectstoreproxy.php");
			require_once(ROOT_PATH . "/payapi/duoapi/cebproxy.php");
			require_once("common.php");

            set_error_handler('handleServiceError');
            set_exception_handler('handleServiceException');

			require_once ($fileToInclude);

			$methodInfo = explode(".", $pathInfo->function);

			if (sizeof($methodInfo) == 2){
				$serviceObj = new $methodInfo[0]();
				header ("Content-type: application/json");
				$outData = call_user_func_array(array($serviceObj, $methodInfo[1]), $vars);
				if (!isset($outData))
					$outData = null;
				
				echo json_encode($outData, JSON_PRETTY_PRINT);
			} else {
				header ("Content-type: application/json");
				echo '{"success": false, "message": "unable to execute method in the php file"}';					
			}
		}else{
			header ("Content-type: application/json");
			echo "{\"success\": false, \"message\": \"unable to execute service ($fileToInclude not found on server)\"}";	
		}
	}

	$exeInfo = getExecutionInfo();

	
	if (isset($exeInfo)){
		$relativeFolder = "$exeInfo->appKey/resources/" . str_replace("/". $exeInfo->appKey, "", $exeInfo->fullPath);

		$actualFile = STORAGE_LOCATION. "/" . DuoWorldCommon::GetHost() . "/devapps/". "$relativeFolder";
		
		if (file_exists($actualFile)){
			if (is_dir($actualFile)){
				if (file_exists($actualFile . "/index.php")){
					header("Location: $exeInfo->appKey/index.php");
					exit();
				}
				else if (file_exists($actualFile . "/index.html")){
					header("Location: $exeInfo->appKey/index.html");
					exit();
				}

				header ("Content-type: application/json");
				echo '{"success": false, "message": "request resource not found (404)"}';	
				http_response_code(404);
			}else{
				$path_parts = pathinfo($actualFile);
				if(strcmp($path_parts['extension'],"php") == 0){
					include($actualFile);
				} else {
					header('Content-Type: '. system_extension_mime_type($actualFile));
					echo file_get_contents($actualFile);	
				}				
			}
		}else{
			$pathObj = checkCookie($exeInfo);

			$validPath;
			$validVars;

			foreach ($pathObj as $path)
			if (strcmp($path->method, $_SERVER["REQUEST_METHOD"]) ==0){
				$pathParts = explode("/", $path->path);
				$currentParts = explode("/", $exeInfo->rest);

				if (sizeof($pathParts) != sizeof($currentParts))
					continue;

				$isValid = true;
				$variables = array();
				$foundVariable = false;
				$foundConstant = false;

				for ($i=1;$i<sizeof($pathParts);$i++){
					$pathPart = $pathParts[$i];

					if ($pathPart[0] == '@' || $pathPart[0] == '$'){
						$foundVariable = true;

						if ($foundConstant) {
							//$variable = array(substr($pathPart, 1) => $currentParts[$i]);
							$variable = $currentParts[$i];
							array_push($variables, $variable);
						} else {
							$isValid = false;
							break;
						}

					} else {
						$foundConstant = true;

						if (strcmp($pathParts[$i], $currentParts[$i]) !=0){
							$isValid = false;
							break;
						}
					}
				}

				if ($isValid){
					$validPath = $path;
					$validVars = $variables;
					break;
				}
			}

			if (isset($validVars) && isset($validPath)){
				executePhpService($exeInfo, $validPath, $validVars);
			} else {
				header ("Content-type: application/json");
				echo '{"success": false, "message": "request resource not found (404)"}'. $actualFile;	
				http_response_code(404);			
			}
		}
	}else{
		header ("Content-type: application/json");
		echo '{"success": false, "message": "no sufficuent parameters provided"}';
	}

?>
