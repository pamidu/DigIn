<?php

class DwFramework {
	public static function GetRawBody(){
	    $rawInput = fopen('php://input', 'r');
	    $tempStream = fopen('php://temp', 'r+');
	    stream_copy_to_stream($rawInput, $tempStream);
	    rewind($tempStream);

	    return stream_get_contents($tempStream);
	}

	public static function GetJsonBody(){
		return json_decode(DwFramework::GetRawBody(),JSON_PRETTY_PRINT);
	}

	public static function ReturnMessage($message, $isSuccess=true){
		if (!$isSuccess)
			http_response_code(501);

		return array('isSuccess' =>  $isSuccess, 'message' => $message);
	}


}

?>