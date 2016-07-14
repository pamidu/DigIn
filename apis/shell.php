<?php

require_once ($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
require_once(ROOT_PATH . "/include/duoapi/tenantapiproxy.php");

class OtherTenantData {
	public $Email;
	public $UserName;
}

if(!isset($_COOKIE["securityToken"])){
	header("Location: http://". $mainDomain. "/index1.php"); 
}

$secToken = $_COOKIE["securityToken"];
$authObj = json_decode($_COOKIE["authData"]);
$tenantService = new TenantProxy($secToken);

$uriuser = substr($email, 0, strpos($email, "@")) . "." . $mainDomain;

if(IsTenantAlreadyRegisterd()){
	// Tenant already created.	
	return;
}

$responseTenant = CreateTenant();
if(isset($responseTenant->TenantID)) {
	header("Location: http://". $uriuser. "/s.php?securityToken=" . $secToken);
}

function IsTenantAlreadyRegisterd() {
	$isRegisted = false;

	$response = $tenantService->GetTenant($uriuser);
	if(isset($response->UserID)) {
		$isRegisted = true;
	}

	return $isRegisted;
}

function CreateTenant() {

	$authObj = json_decode($_COOKIE["authData"]);

	$tenantObj = new CreateTenantRequest();
	//$tenantObj->Shell = "/#/welcome";
	$tenantObj->Shell = "/ui.html#/welcome";
	unset($tenantObj->Statistic);
	$tenantObj->Private = true;
	$tenantObj->TenantID = $uriuser;
	$tenantObj->Name = ""; 

	$otherData = new OtherTenantData();
	$otherData->Email = $authObj->Email;
	$otherData->UserName = $authObj->Username;
	$tenantObj->OtherData = $otherData;

	$tenantResponse = $tenantService->CreateTenant($tenantObj);
	return $tenantResponse;
}




?>