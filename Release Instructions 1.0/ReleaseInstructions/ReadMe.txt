Live server-------------------------------------
/var/www/html/include/config.php
1. include -> config.php
	$mainDomain="digin.io";

2. entry -> assets -> js -> config.js
    .constant('IsLocal', false) 
 


Local machine---------------------------------------

1. include -> config.php
	$mainDomain="localhost:8080";

2. entry -> assets -> js -> config.js
	.constant('IsLocal', true)
    .constant('Local_Shell_Path', 'http://localhost:8080/git/digin/shell')

