<?php
	session_start();
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost:3048/Login/dilshan@gmail.com/admin/duosoftware.com');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $data = curl_exec($ch);
    $authObject = json_decode($data);
    curl_close($ch);
	var_dump($data);

	setcookie('securityToken',$authObject->SecurityToken, time() + (86400 * 30), "/");
	setcookie('authData',json_encode($authObject), time() + (86400 * 30), "/");
	$_SESSION['securityToken']=$authObject->SecurityToken;
	$_SESSION['userObject']=$data;
?>
