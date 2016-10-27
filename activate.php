<?php

require_once ($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
$token= $_GET['token'];
$email= $_GET['email'];
 
$curl = curl_init();
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt ($curl, CURLOPT_URL, SVC_AUTH_URL."/UserActivation/".$token);
$status=curl_exec ($curl);
curl_close ($curl);
	
	if($status==true){
			echo '{"success":true,"message":"Account ativated successfully."}';
			//header("Location:http://".$mainDomain."/entry/#/signin?activated=true&id=".$email);
			header("Location:http://".$mainDomain."/entry/#/signin?activated=true");

		/*
		$response = createDataSet($email);
		if($response){
			echo '{"success":true,"message":"Account ativated and DataSet created successfully."}';
			//header("Location: http://".$mainDomain."/entry/#/signin?activated=true");
			header("Location: http://www.digin.io");
		}	
		*/
	}
	else{
		echo '{"success":false,"message":"Error occured"}';
		//header("Location: http://".$mainDomain."/entry/#/signin?activated=false&id=".$email);
		header("Location: http://".$mainDomain."/entry/#/signin?activated=false");
	}

	
	function createDataSet($email)
	{	
		$dtSetName=str_replace("@","_",$email);
		$dtSetName=str_replace(".","_",$dtSetName);
		$ch = curl_init();  
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$url= Digin_Engine_API.'createDataset?dataSetName=' . $dtSetName . '&tableName=' . $dtSetName . '&db=bigquery&Domain=' . Digin_Domain;
		//echo $url; exit();
		curl_setopt($ch, CURLOPT_URL, $url);
		$dtSetStatus = curl_exec($ch);
		$dtSetStatusDecoded = json_decode($dtSetStatus);
		curl_close($ch);	
		return ($dtSetStatusDecoded->Is_Success) ? true : false;    
	}
 


?>
