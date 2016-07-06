<?php
	define("DEVPORTAL_PATH", ROOT_PATH. "/devportal");
	define("BASE_PATH", DEVPORTAL_PATH . "/activities");
	define("TEMPLATE_PATH", DEVPORTAL_PATH . "/templates/projects");
	define("TEMPLATE_FILE_PATH", DEVPORTAL_PATH . "/templates/files");
	define("TEMPLATE_SNIPPET_PATH", DEVPORTAL_PATH . "/templates/snippets");
	define("CORE_PATH", DEVPORTAL_PATH . "/core");
	define("STORAGE_LOCATION", MEDIA_PATH);
	define("TEMP_PATH", DEVPORTAL_PATH ."/temp");
	define("MAIN_DOMAIN", $mainDomain);

	if (!defined("APPICON_PATH"))
		define ("APPICON_PATH", "");

	define ("USE_NEW_SHELL", true);
?>
