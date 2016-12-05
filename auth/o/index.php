<?php 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include ($_SERVER["DOCUMENT_ROOT"] . "/include/config.php");
include ($_SERVER["DOCUMENT_ROOT"] . "/include/session.php");
$error='';

if (isset($_GET["r"])){

	$_SESSION['r']=$_GET["r"];
}

if(isset($_COOKIE['securityToken']))
{
	if(isset($_SESSION['r']))
	{
		header("Location: ".$_SESSION['r']."?securityToken=".$_COOKIE["securityToken"]);
		session_unset('r');
		exit();
	}
	else
	{
		header("location: /");	
		exit();
	}

}

if (isset($_GET['e']) && isset($_GET['o'])) {
	if (empty($_GET['e']) || empty($_GET['o'])) {
		echo '{"Status":false,"Message":"Warning Unautherized Access."}';
		exit();
	}		
	else
	{
		$username=$_GET['e'];
		$password=$_GET['o'];
		$fullhost=strtolower($_SERVER['HTTP_HOST']);
		$baseUrl=SVC_AUTH_URL."/Login/".$username."/".$password."/".$fullhost;
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $baseUrl);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$data=curl_exec($ch);
		$authObject = json_decode($data);
		curl_close($ch);	
		
		//--------------------------get domain name
	
		$baseUrl=SVC_AUTH_URL."/tenant/GetTenants/".$authObject->SecurityToken;
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $baseUrl);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$data=curl_exec($ch);
		$tenantObject = json_decode($data);
		curl_close($ch);
	
		//--------------------------get tenant token
		$baseUrl=SVC_AUTH_URL."/GetSession/".$authObject->SecurityToken."/".$tenantObject[0]->TenantID;
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $baseUrl);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$data=curl_exec($ch);
		$tenant = json_decode($data);
		curl_close($ch);

		//---------------------------

		if(isset($authObject))
		{	
			if(isset($authObject->SecurityToken)){
		
				setcookie('securityToken',$tenant->SecurityToken,time()+86400,"/");
				setcookie('authData',json_encode($authObject),time()+86400,"/");
				$_SESSION['securityToken']=$tenant->SecurityToken;
				$_SESSION['userObject']=$authObject;

				if(isset($_SESSION['r']))
				{
					header("Location: /entry?r=http://".$tenantObject[0]->TenantID."/entry/#/change?o=".$password."&x=".$tenant->SecurityToken);		
					//header("Location: /entry?r=http://prod.digin.io/entry/#/change?o=".$password."&x=".$tenant->SecurityToken);							
					session_unset('r');
					exit();
				}
				else
				{
					echo '{"Status":false,"Message":"Redirection Failed."}';
		        exit();	
				}
			}

			exit();
		}
		else{
			echo '{"Status":false,"Message":"Please try again with correct credentials these are not valied unautheized access."}';
			exit();
		}		
	}
}

?>


