<?php
		function zip($source, $destination){
		    if (!extension_loaded('zip') || !file_exists($source))
		        return false;

		    $zip = new ZipArchive();
		    if (!$zip->open($destination, ZIPARCHIVE::CREATE))
		        return false;

		    $source = str_replace('\\', '/', realpath($source));

		    if (is_dir($source) === true){
		        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source), RecursiveIteratorIterator::SELF_FIRST);

		        foreach ($files as $file){

		            $file = str_replace('\\', '/', $file);

		            if( in_array(substr($file, strrpos($file, '/')+1), array('.', '..')) )
		                continue;
		        	
		            //$file = str_replace($source, "", realpath($file)); //;
		            if (is_dir($file) === true){
		                $zip->addEmptyDir(str_replace($source . '/', '', $file . '/'));
		            }
		            else if (is_file($file) === true){
		                $zip->addFromString(str_replace($source . '/', '', $file), file_get_contents($file));
		            }
		        }
		    }
		    else if (is_file($source) === true){
		        $zip->addFromString(basename($source), file_get_contents($source));
		    }

		    return $zip->close();
		}

		function recurse_copy($src,$dst) { 
		    $dir = opendir($src); 
		    @mkdir($dst); 
		    while(false !== ( $file = readdir($dir)) ) { 
		        if (( $file != '.' ) && ( $file != '..' )) { 
		        	if (($file != 'project.json') && ($file != 'template.json') && ($file != 'template.png')){
			            if ( is_dir($src . '/' . $file) ) { 
			                recurse_copy($src . '/' . $file,$dst . '/' . $file); 
			            } 
			            else { 
			                copy($src . '/' . $file,$dst . '/' . $file); 
			            } 		        		
		        	}

		        } 
		    } 
		    closedir($dir); 
		} 


		function recurse_rmdir($dir) {
		  $files = array_diff(scandir($dir), array('.','..'));
		  foreach ($files as $file) {
		    (is_dir("$dir/$file")) ? recurse_rmdir("$dir/$file") : unlink("$dir/$file");
		  }
		  return rmdir($dir);
		}

		function getServer(){
			return "localhost:81";
		}

?>