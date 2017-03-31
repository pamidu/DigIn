<?php

	if ($_SERVER['DOCUMENT_ROOT']=="/var/www/html"){
        require_once($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
     }
     else{
        require_once($_SERVER['DOCUMENT_ROOT'] . "/Digin/include/config.php");
     }


	function updateLatestPackageDetail($token)
	{		
		$ch = curl_init();  
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$url= Digin_Engine_API.'check_subscription?SecurityToken='.$token;		
		//$url= 'http://dev.digin.io/DigInEngine/check_subscription?SecurityToken='.$token;	
		//$url= 'http://192.168.5.188:8080/check_subscription?SecurityToken=d02acf67065fe173fcd7494014c71bea'
		curl_setopt($ch, CURLOPT_URL, $url);
		$result = json_decode(curl_exec($ch)); 
		curl_close($ch);	
		return true;
	}

	function checkExceedBlock($token)
	{	
		$ch = curl_init();  
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$url= Digin_Engine_API.'get_usage_summary?SecurityToken='.$token;	
		//http://dev.digin.io/DigInEngine/get_usage_summary?SecurityToken=.$token;	
		curl_setopt($ch, CURLOPT_URL, $url);
		$result = json_decode(curl_exec($ch)); 	
		$objLength=count($result->Result->exceed_blocked); 
		curl_close($ch);
		
		if($objLength>0){
			$storage=$result->Result->exceed_blocked->storage;
			$data=$result->Result->exceed_blocked->data;
			$users=$result->Result->exceed_blocked->users; 
			
			if($storage ||  $data || $users){
					$blockStatus= true;
			}
			else{
				$blockStatus= false;			
			}
		}
		else{
			$blockStatus= true;
		}
		return $blockStatus;
	}

	function checkSubscriptionStatus($token)
	{		
		$ch = curl_init();  
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$url= Digin_Engine_API.'get_packages?get_type=detail&SecurityToken='.$token;	
		//$url= 'http://dev.digin.io/DigInEngine/get_packages?get_type=detail&SecurityToken='.$token;	
		curl_setopt($ch, CURLOPT_URL, $url);
		$result = json_decode(curl_exec($ch)); 
		curl_close($ch);	
		$subscriptionData=[];	
		$subscriptionStatus= $result->Result[0]->user_status;
		$remainingDays= $result->Result[0]->remaining_days; 
		$packageId= $result->Result[0]->package_id; 
		$subscriptionData[0]=$subscriptionStatus;
		$subscriptionData[1]=$remainingDays;
		$subscriptionData[2]=$packageId;
		return $subscriptionData;
		
	}

function createSessionDmian(){
	$Host = strtolower($_SERVER['HTTP_HOST']);
	//echo "$authURI";
	if(isset($_COOKIE['securityToken'])){
		$obj=getSession($_COOKIE['securityToken'],"");
		//ho $_COOKIE['securityToken'];
		//var_dump($obj);
		//it();
		if(isset($obj))
		{
			$_SESSION['userObject']=$obj;
			echo "string 1";
			//setcookie('authData')
			//if(!isset($_COOKIE['authData'])){
			    echo "cookie not set";
			    $obj=getSession($_COOKIE['securityToken'],$Host);
			    //var_dump($obj);
			    if( isset($obj) && $obj->SecurityToken!=""){
			    	echo "set....1";
			    	$_SESSION[$Host]=$obj;
			    	setcookie("securityToken", $obj->SecurityToken,time()+86400);
			    	setcookie("authData", json_encode($obj),time()+86400);
			    	return true;
			    }
			    else
			    {
			    	return false;
			    }
			//}else{
				//return true;
			//}
		}else{
			return false;
		}	
	}
	else
	{
		return false;
	}
}
function getSession($securityToken,$domain){
	$ch=curl_init();
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(
	'securityToken : ""',
	'X-Apple-Store-Front: 143444,12'
	));
	if($domain==""){
		$domain="Nil";
	}
	curl_setopt($ch, CURLOPT_URL, SVC_AUTH_URL.'/GetSession/'.$securityToken.'/'.$domain.'');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$data = curl_exec($ch);
	$obj = json_decode($data);
	return $obj;
}
function INTS(){
	if(isset($_COOKIE["securityToken"])){
		$data=getSession($_COOKIE["securityToken"],"");
		if(!isset($data)){
			setcookie ("securityToken", "", time() - 3600);
		    setcookie ("authData", "", time() - 3600);
		    unset($_COOKIE["securityToken"]);
		    unset($_COOKIE["authData"]);
		    unset($_SESSION);
		    if($mainDomain!=strtolower($_SERVER['HTTP_HOST'])){
			header("Location: http://".$mainDomain."/");
			exit();
		    }
		}else{
			if(isset($data->Error)){
			   	setcookie ("securityToken", "", time() - 3600);
		    		setcookie ("authData", "", time() - 3600);
		    		unset($_COOKIE["securityToken"]);
		    		unset($_COOKIE["authData"]);
			    	unset($_SESSION);
			    	if($mainDomain!=strtolower($_SERVER['HTTP_HOST'])){
					header("Location: http://".$mainDomain."/");
					exit();
			    	}
			}
		}
	}
}

	function getURI(){

			if(!isset($_COOKIE["securityToken"])){
				header("Location: s.php?r=index.php");
				exit();
			}
			$uri=$GLOBALS['objURI'];
		    $serchfild=strtolower($_SERVER['HTTP_HOST']);
			$ch=curl_init();
			curl_setopt($ch, CURLOPT_HTTPHEADER, array(
		    'SecurityToken :'.$_COOKIE['securityToken'],
		    'X-Apple-Store-Front: 143444,12'
		    ));
			curl_setopt($ch, CURLOPT_URL, SVC_AUTH_URL.'/tenant/GetTenants/'.$_COOKIE['securityToken']);
		    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		    $data = curl_exec($ch);
		    $obj = json_decode($data);
		    //var_dump($obj);
		    if (isset($obj)){
		    	if(count($obj)!=0){
		    		setcookie("tenantData", json_encode($obj));
		    		$tid=$obj[0]->TenantID;
		    		foreach ($obj as &$value) {
    					if($serchfild==strtolower($value->TenantID)){
    						$tid=$serchfild;
    					}
					}
				
		    		$ch=curl_init();
		    		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
		    		'SecurityToken :'.$_COOKIE['securityToken'],
		    		'X-Apple-Store-Front: 143444,12'
		    		));
		    		curl_setopt($ch, CURLOPT_URL, SVC_AUTH_URL.'/tenant/GetTenant/'.$tid);
				    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
				    $data = curl_exec($ch);
				    $obj = json_decode($data);
					
					//#Added by chamila
					//--------get security tokan to tenant domain before redirecting-------------------					
					$ch=curl_init();
		    		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
		    		'SecurityToken :'.$_COOKIE['securityToken'],
		    		'X-Apple-Store-Front: 143444,12'
		    		));
		    		curl_setopt($ch, CURLOPT_URL, SVC_AUTH_URL.'/GetSession/'.$_COOKIE['securityToken'].'/'.$tid);
				    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
				    $SessionDet = curl_exec($ch);
				    $SessionDet = json_decode($SessionDet);
					$tenantToken= $SessionDet->SecurityToken;			
					
					//#checking subscription status and blocking status
					if($tenantToken!=NULL){
						session_start();
						$blockStatus=checkExceedBlock($tenantToken);
						$_SESSION["blockStatus"] = $blockStatus;	

						if($blockStatus){$myAccount=true; $blocking=true;} 									
						else{	
								//$_SESSION["subscriptionStatus"] = $subscriptionData[0];
								//$_SESSION["remainingDays"] = $subscriptionData[1];	
								$subscriptionData = checkSubscriptionStatus($tenantToken);		
								if($subscriptionData[0]=="active" ){
									if($subscriptionData[1]>=0){
										$myAccount=false;	
										$blocking=false;
									} else{
										if($subscriptionData[2]=="1003"){  //Trial period has been expired
											$myAccount=true;
											$blocking=true;
										}
										else{
											if($subscriptionData[1]>=-15){  //14 days payment due grace period - can work but need to put warning
												if(updateLatestPackageDetail($token)){  //need to check with cloud charge to verify latest payement status
													$myAccount=true;
													$blocking=false;
												}											
											} else{
												$myAccount=true;  // Grace period also has been expired, user can not continue with system.
												$blocking=true;
											};
										}											
									};
								}
								else if($subscriptionData[0]=="due" ){ //14 days payment due grace period - can work but need to put warning
										$myAccount=true;
										$blocking=false;
								}
								else if($subscriptionData[0]=="deactive" ){ //System admin has been deactivate account - need to give msg to activate account.
										$myAccount=true;
										$blocking=true;
								}
								else{
									$myAccount=true;
									$blocking=true;
								};	

								$_SESSION["ShowMyAccount"] = $myAccount;
								$_SESSION["Blocking"] = $blocking;		
						}	
						
						/*var_dump('--------------------'); 
						var_dump($_SESSION["blockStatus"]); 
						var_dump($_SESSION["subscriptionStatus"]);
						var_dump($_SESSION["remainingDays"]);
						var_dump('--------------------'); 
						exit();*/
					}

					//-------------------------------------------------------
					
				    if(isset($obj))
				    {
				    	if($obj->TenantID!=""){
						if ($obj->TenantID==strtolower($_SERVER['HTTP_HOST'])){
								//var_dump($obj); exit(); 
								//header("Location: http://".$obj->TenantID."/shell");
								//http://digin.dev.digin.io/shell/#/home/myAccount
								//http://digin.dev.digin.io/shell/#/home/welcome-search
								
								header("Location: http://".$obj->TenantID."/cleanshell");	

								/*if($myAccount==true){
									header("Location: http://".$obj->TenantID."/shell/#/home/myAccount");
								}
								else{
									header("Location: http://".$obj->TenantID."/shell/#/home/welcome-search");
								}	*/							
		    					exit();
						}else{
							header("Location: http://".$obj->TenantID."/s.php?securityToken=".$_COOKIE["securityToken"]);
		    					exit();	
						}
		    			}
		    			else
		    			{
		    				// header("Location: payapi/shell.php");
		    				header("Location: boarding/");
		    				exit();
		    			}
		    		}
		    		else
		    		{
		    				// header("Location: payapi/shell.php");
		    				header("Location: boarding/");
		    				exit();
		    		}
		    		
		    	}else{
		    		$ch=curl_init();
		    		curl_setopt($ch, CURLOPT_URL, SVC_AUTH_URL.'/tenant/GetTenant/'.$serchfild);
				    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
				    $data = curl_exec($ch);
				    $obj = json_decode($data);
				    if(isset($obj))
				    {
				    	if($obj->TenantID!=""){
		    				include("notauthorized.php");
		    			}
		    			else
		    			{
		    				header("Location: boarding/");
		    				// header("Location: payapi/shell.php");
		    			}
		    		}
		    	}	
		    }else{
		    	//include("t.php");
		    }
		    // header("Location: payapi/shell.php");
		    header("Location: boarding/");
}
?>




