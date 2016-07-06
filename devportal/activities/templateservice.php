<?php
	require_once (CORE_PATH . "/extservices.php");

	class TemplateService {

		private function getCategories(){
		    $allProjects = [];
		    
		    foreach (new DirectoryIterator(TEMPLATE_PATH) as $tempFolder) {
		        if ($tempFolder->isDot() || $tempFolder->getFilename() == "default") continue;
		        if ($tempFolder->isDir()) {

		            $fullTempPath = $tempFolder->getPath() . "/" . $tempFolder->getFilename();
		            $tempFileName = $fullTempPath . "/category.json";
		            $tempFile = fopen($tempFileName, "r");
		            $tempDetails = fread($tempFile,filesize($tempFileName));
		            $tempObject = json_decode($tempDetails);
		            $imageUrl = DuoWorldCommon::GetHost() . "/templates/" . $tempFolder->getFilename(). "/category.png";
		            fclose($tempFile);

		            $retObj = [];

		       		$retObj["name"] = $tempObject->name;
		       		$retObj["description"] = $tempObject->description;
		       		
		       		if (isset ($tempObject->type)) $retObj["type"] = $tempObject->type;
		       		else $retObj["type"] = "application";
		       		
		       		$retObj["folder"] = $tempFolder->getFilename();

		            array_push($allProjects,  $retObj);
		        }
		    }

			header("Content-type: application/json");
		    echo json_encode($allProjects);
		}

		private function getTemplatesByCategory($cid){
			$fullTempPath = TEMPLATE_PATH . "/" . $cid;

			$currentCategories = [];
	        foreach (new DirectoryIterator($fullTempPath) as $catFolder) {
	            if ($catFolder->isDot()) continue;
	            if ($catFolder->isDir()){
	                $fullCatPath = $catFolder->getPath() . "/" . $catFolder->getFilename();
	                
	                $catFileName = $fullCatPath . "/template.json";
	                $catFile = fopen($catFileName, "r");
	                $catDetails = fread($catFile,filesize($catFileName));
	                $catObject = json_decode($catDetails);
	                //$imageUrl = $templateUrl . $tempFolder->getFilename(). "/template.png";
	                fclose($catFile);

	                $catItem;
	                $catItem["folder"] = $catFolder->getFilename();
	                $catItem["name"] = $catObject->name;
	                $catItem["imageUrl"] = "/devportal/templates/projects/" . $cid . "/" . $catFolder->getFilename() . "/template.png";
	                array_push($currentCategories,  $catItem);
	            }
	        }

			header("Content-type: application/json");
	        echo json_encode($currentCategories);
		}

		private function getFileCategories(){
		    $allProjects = [];
		    
		    foreach (new DirectoryIterator(TEMPLATE_FILE_PATH) as $tempFolder) {
		        if ($tempFolder->isDot() || $tempFolder->getFilename() == "default") continue;
		        if ($tempFolder->isDir()) {

		            $fullTempPath = $tempFolder->getPath() . "/" . $tempFolder->getFilename();
		            $tempFileName = $fullTempPath . "/category.json";
		            $tempFile = fopen($tempFileName, "r");
		            $tempDetails = fread($tempFile,filesize($tempFileName));
		            $tempObject = json_decode($tempDetails);
		            $imageUrl = DuoWorldCommon::GetHost() . "/templates/" . $tempFolder->getFilename(). "/category.png";
		            fclose($tempFile);

		            $retObj = [];

		       		$retObj["name"] = $tempObject->name;
		       		$retObj["description"] = $tempObject->description;
		       		$retObj["folder"] = $tempFolder->getFilename();

		            array_push($allProjects,  $retObj);
		        }
		    }

			header("Content-type: application/json");
		    echo json_encode($allProjects);
		}

		private function getFileTemplatesByCategory($cid){
			$fullTempPath = TEMPLATE_FILE_PATH . "/" . $cid;

			$currentCategories = [];
	        foreach (new DirectoryIterator($fullTempPath) as $catFolder) {
	            if ($catFolder->isDot()) continue;
	            if ($catFolder->isDir()){
	                $fullCatPath = $catFolder->getPath() . "/" . $catFolder->getFilename();
	                
	                $catFileName = $fullCatPath . "/template.json";
	                $catFile = fopen($catFileName, "r");
	                $catDetails = fread($catFile,filesize($catFileName));
	                $catObject = json_decode($catDetails);
	                //$imageUrl = $templateUrl . $tempFolder->getFilename(). "/template.png";
	                fclose($catFile);

	                $catItem;
	                $catItem["folder"] = $catFolder->getFilename();
	                $catItem["name"] = $catObject->name;
	                $catItem["imageUrl"] = "/devportal/templates/" . $cid . "/" . $catFolder->getFilename() . "/template.png";
	                array_push($currentCategories,  $catItem);
	            }
	        }

			header("Content-type: application/json");
	        echo json_encode($currentCategories);
		}


		private function getSnippetCategories(){
		    $allProjects = [];
		    
		    foreach (new DirectoryIterator(TEMPLATE_SNIPPET_PATH) as $tempFolder) {
		        if ($tempFolder->isDot() || $tempFolder->getFilename() == "default") continue;
		        if ($tempFolder->isDir()) {

		            $fullTempPath = $tempFolder->getPath() . "/" . $tempFolder->getFilename();
		            $tempFileName = $fullTempPath . "/category.json";
		            $tempFile = fopen($tempFileName, "r");
		            $tempDetails = fread($tempFile,filesize($tempFileName));
		            $tempObject = json_decode($tempDetails);
		            $imageUrl = DuoWorldCommon::GetHost() . "/templates/" . $tempFolder->getFilename(). "/category.png";
		            fclose($tempFile);

		            $retObj = [];

		       		$retObj["name"] = $tempObject->name;
		       		$retObj["description"] = $tempObject->description;
		       		$retObj["folder"] = $tempFolder->getFilename();

		            array_push($allProjects,  $retObj);
		        }
		    }
		
			header("Content-type: application/json");
		    echo json_encode($allProjects);
		}

		private function getSnippetTemplatesByCategory($cid){
			$fullTempPath = TEMPLATE_SNIPPET_PATH . "/" . $cid;

			$currentCategories = [];
	        foreach (new DirectoryIterator($fullTempPath) as $catFolder) {
	            if ($catFolder->isDot() || $catFolder->isDir()) continue;
	            if ($catFolder->isFile())
				if (strcmp($catFolder->getFilename(), "category.json") !=0)
	            {
	                $fullCatPath = $catFolder->getPath() . "/" . $catFolder->getFilename();
	                
	                $catFile = fopen($fullCatPath, "r");
	                $catDetails = fread($catFile,filesize($fullCatPath));
	                $catObject = json_decode($catDetails);
	                fclose($catFile);

	                array_push($currentCategories,  $catObject);
	            }
	        }
			
			header("Content-type: application/json");
	        echo json_encode($currentCategories);
		}

		private function getSettings($cid, $tid){
			$fileName = TEMPLATE_PATH. "/$cid/$tid/template.json";
			$settings;

			if (file_exists($fileName)){
				$sObj = json_decode(file_get_contents($fileName));
				if (isset($sObj->settings))
					$settings = $sObj->settings;
			}

			if (!isset($settings))
				$settings = new stdClass();

			header("Content-type: application/json");
			echo json_encode($settings);

		}

		function __construct(){
			Flight::route("GET /templates/byid/@cid", function ($cid){ $this->getTemplatesByCategory($cid); });
			Flight::route("GET /templates/categories", function (){ $this->getCategories(); });
			Flight::route("GET /templates/files/byid/@cid", function ($cid){ $this->getFileTemplatesByCategory($cid); });
			Flight::route("GET /templates/files/categories", function (){ $this->getFileCategories(); });
			Flight::route("GET /templates/snippets/byid/@cid", function ($cid){ $this->getSnippetTemplatesByCategory($cid); });
			Flight::route("GET /templates/snippets/categories", function (){ $this->getSnippetCategories(); });
			Flight::route("GET /templates/settings/@cid/@tid", function ($cid, $tid){ $this->getSettings($cid, $tid); });
		}
	}
?>
