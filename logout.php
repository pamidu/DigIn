
<?php
	session_start();
	require_once ("include/config.php");
	require_once ("include/session.php");
		
	if(isset($_COOKIE['securityToken'])){
		$ch=curl_init();
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
				    	//'SecurityToken :'.$_COOKIE['securityToken'],
				    	'X-Apple-Store-Front: 143444,12'
	    ));
		
		curl_setopt($ch, CURLOPT_URL, $GLOBALS['authURI'].'/LogOut/'.$_COOKIE['securityToken']);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$data = curl_exec($ch);
		echo $data; 
				
		setcookie ("securityToken", "", time() - 3600);
		setcookie ("authData", "", time() - 3600);
		setcookie ("tenantData", "", time() - 3600);		
		
		echo $_SESSION;
		
		unset($_COOKIE["securityToken"]);
		unset($_COOKIE["authData"]);
		unset($_COOKIE["tenantData"]);		
		
		unset($_SESSION);
	
		//header("Location: /entry");
		header("Location: http://". $mainDomain . "/entry");
	}else{
		//header("Location: /entry");
		header("Location: http://". $mainDomain . "/entry");
	}
			
?>
