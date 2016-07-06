<?php
	define("MAIN_DOMAIN", DuoWorldCommon::GetHost());
	class AppInstaller {
		public function Install($appCode, $tenant){
			$url = "http://" . MAIN_DOMAIN . "/apps/$appCode?install=" . $tenant;
		    $ch = curl_init();
			curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
			curl_setopt($ch, CURLOPT_HTTPHEADER, array("Host: ". MAIN_DOMAIN, "AppKey: $appCode")); 
		    curl_setopt($ch, CURLOPT_URL, $url);
		    $data = curl_exec($ch);
		    curl_close($ch);
		}
	}
?>
