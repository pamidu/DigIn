<?php
	class MediaService {
		
		private function uploadMedia($id){
		  $namespace = $__SERVER["HTTP_HOST"];
		 	$filepath = MEDIA_PATH . "/" . $namespace . "/application";
			
			if (!file_exists(MEDIA_PATH)) mkdir(MEDIA_PATH);
      if (!file_exists(MEDIA_PATH . "/" . $namespace)) mkdir(MEDIA_PATH . "/" . $namespace);
      if (!file_exists($filepath)) mkdir($filepath);
      if (!file_exists($filepath . "/" . $id)) mkdir($filepath . "/" . $id);
		
		  $zipFile = "./$namespace.application.$id.zip";
			file_put_contents($zipFile, Flight::request()->getBody());

			$path_info = pathinfo($fileName);

			//echo $path_info['extension'];
			//http_response_code(501);

				$zip = new ZipArchive;
				if ($zip->open($zipFile) === TRUE) {
				    $zip->extractTo($filepath . "/" . $id);
				    $zip->close();
				}
		}
	
		function __construct(){
			Flight::route("POST @id", function($id){$this->uploadMedia($id);});
		}
	}
?>
