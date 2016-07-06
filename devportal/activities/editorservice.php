<?php
	require_once (CORE_PATH . "/extservices.php");
	class FileLock{
		public $uid;
		public $fileid;
	}
	
	class EditorService {

		private function cd($appKey, $fid){
			$folder = base64_decode($fid);

			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"projectfiles","123");
			$output = $client->get()->byFiltering("select * from projectfiles where folder='". $folder . "' AND appKey='" . $appKey ."'");

			return (json_encode($output));
			
		}

		private function save($appKey, $file){
			$fileName = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/". $appKey . "/resources/" . $file;
			file_put_contents($fileName, Flight::request()->getBody());
		}

		function get ($appKey, $file){
			$fileName = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $appKey . "/resources/" . $file;
			
			$ext = pathinfo($fileName, PATHINFO_EXTENSION);
			if ($ext == "json" || $ext == "js"){
			header( "Content-type: application/javascript");
			}else{
					$finfo = finfo_open(FILEINFO_MIME_TYPE);
					header( "Content-type: ". finfo_file($finfo, $fileName));
					finfo_close($finfo);				
			}

			$contents = file_get_contents($fileName, false);
			readfile($fileName);
		}

		private function lock($appKey, $fid, $userName){
			$client = ObjectStoreClient::WithNamespace(DuoWorldCommon::GetHost(),"filelocks","123");

		}

		private function unlock($appKey, $fid, $userName){
			
		}


		private function rename ($appKey, $file,$newname){
			$fileName = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $appKey . "/resources/" . $file; 
 			rename($fileName,substr($fileName, 0, strrpos($fileName,"/")) . "/". $newname);
		}

		private function newFolder ($appKey, $file){
			$fileName = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $appKey . "/resources/" . $file;
			mkdir($fileName);
		}

		private function newFile ($appKey, $file){
			$fileName = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $appKey . "/resources/" . $file;
			file_put_contents($fileName, Flight::request()->getBody());
		}

		private function delete ($appKey, $file){
			$fileName = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $appKey . "/resources/" . $file;
			$this->recursive_delete($fileName);
		}

		function recursive_delete($path){
		    if (is_dir($path) === true){
		        $files = array_diff(scandir($path), array('.', '..'));

		        foreach ($files as $file)
		            $this->recursive_delete(realpath($path) . '/' . $file);

		        return rmdir($path);
		    }

		    else if (is_file($path) === true)
		        return unlink($path);

		    return false;
		}

		function fileUpload($appKey, $file){
			$fileName = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $appKey . "/resources/" . $file;

			$destFolder = STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $appKey . "/resources";
			if (!file_exists($destFolder)) mkdir($destFolder, 0777, true);

			file_put_contents($fileName, Flight::request()->getBody());

			$path_info = pathinfo($fileName);

			//echo $path_info['extension'];
			//http_response_code(501);

			if ($path_info['extension'] == "zip"){
				$zip = new ZipArchive;
				if ($zip->open($fileName) === TRUE) {
				    $zip->extractTo(STORAGE_LOCATION . "/" . DuoWorldCommon::GetHost() . "/devapps/" . $appKey . "/resources/");
				    $zip->close();
				}
			}
		}

		function __construct(){
			
			//Flight::route("GET /editor/cd/@appKey/@fid", function ($appKey, $fid){ $this->cd($appKey, $fid); });
			//Flight::route("GET /editor/delete/@appKey/@fid", function ($appKey, $fid){ $this->delete($appKey, $fid); });
			
			Flight::route("POST /editor/newfile/@appKey/@file", function ($appKey, $file){ $this->newFile ($appKey, base64_decode($file) ); });
			Flight::route("GET /editor/newfolder/@appKey/@file", function ($appKey, $file){$this->newFolder ($appKey, base64_decode($file) ); });
			Flight::route("GET /editor/delete/@appKey/@file", function ($appKey, $file){ $this->delete ($appKey, base64_decode($file) ); });
			Flight::route("GET /editor/rename/@appKey/@newname/@file", function ($appKey, $newname, $file){ $this->rename ($appKey, base64_decode($file),$newname) ; });


			Flight::route("POST /editor/save/@appKey/@file", function ($appKey, $file){ $this->save($appKey, base64_decode($file)); });
			Flight::route("GET /editor/file/@appKey/@file", function ($appKey, $file){ $this->get ($appKey, base64_decode($file) ); });
			Flight::route("POST /editor/fileupload/@appKey/@file", function ($appKey, $file){ $this->fileUpload($appKey, base64_decode($file) ); });
		}
	}
?>
