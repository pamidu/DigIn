<?php

class TestService {

	public function common() {
		echo "common";
	}

	function __construct() {
		Flight::route("GET /test/common", function(){
			$this->common();
		});
	}

}

?>
