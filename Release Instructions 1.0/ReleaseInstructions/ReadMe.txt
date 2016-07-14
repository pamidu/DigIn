Live server-------------------------------------
/var/www/html/include/config.php
1. include -> config.php
	$mainDomain="digin.io";

2. entry -> entry.js
	in loggin success - put this line
		$window.location.href = "/s.php?securityToken=" + data.Data.SecurityToken;





Local machine---------------------------------------

1. include -> config.php
	$mainDomain="localhost:8080";

2. entry -> entry.js
	in loggin success - put this line  
                    document.cookie = "securityToken=" + data.Data.SecurityToken + "; path=/";
                    document.cookie = "authData=" + encodeURIComponent(JSON.stringify(data.Data.AuthData)) + "; path=/";
                    window.location.href = "http://localhost:8080/git/digin/shell";


