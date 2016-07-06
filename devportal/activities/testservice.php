<?php
	require_once (CORE_PATH . "/extservices.php");
	class TestService {
		public function test(){
			echo "Works!!!!!!!";
		}

		function __construct(){
			Flight::route("GET /test", function (){$this->test();});
		}
	}
?>
