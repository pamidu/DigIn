<?php 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include ($_SERVER["DOCUMENT_ROOT"] . "/include/config.php");
include ($_SERVER["DOCUMENT_ROOT"] . "/include/session.php");
$error='';

//$_POST = json_decode(file_get_contents('php://input'), true);

	// var_dump($_COOKIE['securityToken']);
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
		
		//$s=curl_error($ch);
		
		curl_close($ch);
		
		//var_dump($baseUrl); exit();
		
		if(isset($authObject))
		{	
			if(isset($authObject->SecurityToken)){
				setcookie('securityToken',$authObject->SecurityToken,time()+86400,"/");
				setcookie('authData',json_encode($authObject),time()+86400,"/");
				$_SESSION['securityToken']=$authObject->SecurityToken;
				$_SESSION['userObject']=$authObject;

				if(isset($_SESSION['r']))
				{
					//header("Location: ".$_SESSION['r']."?securityToken=".$_SESSION["securityToken"]);
					//var_dump($_SESSION['r']."#/change?o=".$password); exit();
					//header("Location: ".$_SESSION['r']."#/change?o=".$password);
					
					//header("Location: /entry?r=http://www.prod.digin.io/entry/#/change?o=".$password);
					header("Location: /entry?r=http://www.".$mainDomain."/entry/#/change?o=".$password);
					
					session_unset('r');
					exit();
				}
				else
				{
						echo '{"Status":false,"Message":"Redirection Failed."}';
		        exit();	
				}
			}
			var_dump($authObject);
			//header("Location: http://".$mainDomain."/entry/#/change?o=".$password);
			exit();
		}
		else{
			echo '{"Status":false,"Message":"Please try again with correct credentials these are not valied unautheized access."}';
			exit();
		}		
	}
}

?>


