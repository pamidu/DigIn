<?php 
session_start();
include ("config.php");
include ("session.php");
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
	// else
	// {
	// 	header("location: /git/cloudcharge-duodigin");	
	// 	exit();
	// }
}

if (isset($_POST['userName']) && isset($_POST['password'])) {
	if (empty($_POST['userName']) || empty($_POST['password'])) {
		$error = "Username or Password is invalid";
	}		
	else
	{
		$username=$_POST['userName'];
		$password=$_POST['password'];
		$fullhost=strtolower($_SERVER['HTTP_HOST']);

		$baseUrl="$authURI/Login"."/".$username."/".$password."/duoworld.duoweb.info";

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $baseUrl);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$data=curl_exec($ch);

		$authObject = json_decode($data);
		curl_close($ch);

		if(isset($authObject))
		{	
			if(isset($authObject->SecurityToken)){
				setcookie('securityToken',$authObject->SecurityToken);
				setcookie('authData',json_encode($authObject));
				$_SESSION['securityToken']=$authObject->SecurityToken;
				$_SESSION['userObject']=$authObject;
				if(isset($_SESSION['r']))
				{
					header("Location: ".$_SESSION['r']."?securityToken=".$_SESSION["securityToken"]);
					session_unset('l');
					exit();
				}
				else
				{
					echo '{{login1()}}';
				}
			}
		}
		else{
			
		   echo "User name or Password is incorrect";
		}		
	}
}else
{ 
	 
}

?>
<!DOCTYPE html>
<html ng-app="diginLogin" ng-controller="LoginCtrl">
<head>
	<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
	<link rel="stylesheet" href="bower_components/angular-material/angular-material.css">
	<link rel="stylesheet" href="bower_components/ionicons/css/ionicons.css">
	<link rel="stylesheet" href="styles/css/commonstyle.css">
</head>
<body  ng-cloak>
<div id="gradient"/>
	<div id="viewContainer" layout="row" layout-align="center center" >
		<md-whiteframe id="loginFrame" ng-class="md-whiteframe-z2 " layout="column" layout-align="start center">
		<div id="fw-login-bannerArea" layout="row" layout-align="center center">
			<img ng-src="styles/css/images/loginLogo.png" width="400" height="122">
		</div>
		<md-content class="fullWidth">
		<form name="loginForm" style="padding:16px;" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="POST">
			<md-input-container>
			<label>User Name</label>
			<input required id="userName" name="userName" model="txtUname">
			<!-- <div ng-messages="loginForm.userName.$error">
				<div ng-message="required">This is required.</div>
			</div> -->
		</md-input-container>
		<md-input-container>
		<label>Password</label>
		<input type="password" required id="password" name="password" model="txtPwd">
		<!-- <div ng-messages="loginForm.password.$error">
			<div ng-message="required">This is required.</div>
		</div> -->
	</md-input-container>
	<md-button class="md-raised md-primary" style="width:100%;margin-left: 0px; margin-right: 0px;" type="submit"><span class="loginBtnLabel" ng-click="login()">Login</span></md-button>
	<br/>
	 <md-divider md-inset></md-divider>
	New to Duodigin? <a href="http://duoworld.sossgrid.com/signup/">Signup</a>
</form>
</md-content>
</md-whiteframe>
<div id="companyCygilScroll" class=""></div>
</div>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.3/angular-route.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.13/angular-messages.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.15.0/TweenMax.min.js"></script>
<script src="bower_components/angular-material/angular-material.js"></script>  
<script src="bower_components/angular-animate/angular-animate.js"></script>
<script src="bower_components/angular-aria/angular-aria.js"></script>
<script src="bower_components/hammerjs/hammer.js"></script>
<script src="bower_components/ngStorage/ngStorage.js"></script>
<script src="scripts/vendor/uimicrokernel.js"></script>
<script type="text/javascript" src="scripts/controllers/login.js"></script>	
<script type="text/javascript" src="scripts/loginBackground.js"></script>	
</body>
</html>


