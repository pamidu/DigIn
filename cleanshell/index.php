<!DOCTYPE html>
<?php 

     if ($_SERVER['DOCUMENT_ROOT']=="/var/www/html"){
        require_once($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
        require_once($_SERVER['DOCUMENT_ROOT'] . "/include/session.php");
     }
     else{
        require_once($_SERVER['DOCUMENT_ROOT'] . "/Digin/include/config.php");
        require_once($_SERVER['DOCUMENT_ROOT'] . "/Digin/include/session.php");
     }
    INTS();
    if(!isset($_COOKIE["securityToken"])){
        header("Location: http://".$mainDomain."/entry");
        exit(); 
    }
?>

<html ng-app="DuoDiginRt">
<head>
	<title>DigIn - Beyond BI</title>
	<meta name="author" content="Sajeetharan" />
	<meta name="description" content="Know everything your data is telling you with the platform that gives you everything." />
    <meta name="keywords" content="data integration, analytics, and visualization" />
    <meta name="viewport" content="user-scalable=no ,width=device-width ,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
	<link rel="icon" href="favicon.ico" type="image/x-icon">
	<link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon">
	<link rel="icon" href="images/favicon.ico" type="image/x-icon">
	
	<!-- build:css styles/styles.css-->
	<link rel="stylesheet" type="text/css" href="bower_components/angular-material/angular-material.min.css">
	<link rel="stylesheet" type="text/css" href="styles/icons/digin-main/digin-main.css">
	<link rel="stylesheet" type="text/css" href="styles/icons/themify/themify-icons.css">
	<link rel="stylesheet" type="text/css" href="styles/index.css">
	<link rel="stylesheet" type="text/css" href="styles/layout.css">
	<link rel="stylesheet" type="text/css" href="styles/libs/bootstrap.css">
	<link rel="stylesheet" type="text/css" href="styles/libs/directive_library.css">
	<link rel="stylesheet" type="text/css" href="bower_components/md-steppers/dist/md-steppers.css">
	<link rel="stylesheet" type="text/css" href="bower_components/angular-gridster/dist/angular-gridster.min.css"/>
	<link rel="stylesheet" type="text/css" href="bower_components/v-accordion/dist/v-accordion.min.css"/>
	<link rel="stylesheet" type="text/css" href="styles/libs/ng-croppie.min.css">
	<link rel="stylesheet" type="text/css" href="styles/libs/cellCursor.css">
	<link rel="stylesheet" type="text/css" href="styles/introjs.css">
	<link rel="stylesheet" type="text/css" href="bower_components/angularjs-slider/dist/rzslider.min.css">
	<!-- endbuild -->

</head>
<body ng-controller="NavCtrl as ctrl" layout="column">
	<!--START OF PRELOADER--> <!--the below css lines are given here to improve load efficency rather than fetching an additional file on the initial load-->
	<div style="background:#2795d8;width:100%;height:100%;display:block" id="preload">
		<div style=" position:fixed;top: 50%;left: 50%;width:30em;height:18em;margin-top: -9em;margin-left: -15em;">
			<style>

			#loadSection {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 40px;
				font-family: Roboto,"Helvetica Neue",sans-serif;
				font-weight: 300;
				color: white;
				margin-top: 40px;
			}

			section div {
				transform: scale(0, 0);
				animation: scaler 1.5s ease-in-out infinite;
			}

			.delay1 {
				-webkit-animation-delay: .1s;
				animation-delay: .1s;
			}
			.delay2 {
				-webkit-animation-delay: .2s;
				animation-delay: .2s;
			}
			.delay3 {
				-webkit-animation-delay: .3s;
				animation-delay: .3s;
			}
			.delay4 {
				-webkit-animation-delay: .4s;
				animation-delay: .4s;
			}
			.delay5 {
				-webkit-animation-delay: .5s;
				animation-delay: .5s;
			}
			.delay6 {
				-webkit-animation-delay: .6s;
				animation-delay: .6s;
			}

			@media (max-width: 768px) {
				section {
					font-size: 50px;
				}
			}

			@keyframes scaler {
				0% {
					transform: scale(0,0);
				}
				50% {
					transform: scale(1, 1);
				}
				100% {
					transform: scale(0, 0);
				}
			}
			#diginLoaderLogo {

				background-repeat:no-repeat;
				width:300px;
				z-index:5;

				
				-webkit-transform-origin: 0 0;
				-ms-transform-origin: 0 0;
				transform-origin: 0 0;
				
				
				-webkit-animation: diginLogoAnimation 5s ease-in-out infinite alternate;
				animation: diginLogoAnimation 5s ease-in-out infinite alternate;
			}

			@-webkit-keyframes diginLogoAnimation {
				0% {
					-webkit-transform: scale(1.0);
				}
				100% {
					-webkit-transform: scale(1.05);
				}
			}

			@keyframes diginLogoAnimation {
				0% {
					transform: scale(1.0);
				}
				100% {
					transform: scale(1.05);
				}
			}
			
			.fadeIn {
				-webkit-animation: fadeIn .8s forwards;
				animation: fadeIn .8s forwards;
			}

			@keyframes fadeIn {
				0% {opacity: 0;}
				100% {opacity: 1;}
			}

			@-webkit-keyframes fadeIn {
				0% {opacity: 0;}
				100% {opacity: 1;}
			}
			
			.fadeInFast {
				-webkit-animation: fadeInFast .4s forwards;
				animation: fadeInFast .8s forwards;
			}

			@keyframes fadeInFast {
				0% {opacity: 0;}
				100% {opacity: 1;}
			}

			@-webkit-keyframes fadeInFast {
				0% {opacity: 0;}
				100% {opacity: 1;}
			}
			
			.fadeOutFast {
				-webkit-animation: fadeOutFast .4s forwards;
				animation: fadeOutFast .8s forwards;
			}

			@keyframes fadeOutFast {
				0% {opacity: 1;}
				100% {opacity: 0;}
			}

			@-webkit-keyframes fadeOutFast {
				0% {opacity: 1;}
				100% {opacity: 0;}
			}
			
			/*.fade.ng-hide {
			  opacity: 0;
			}

			.fade.ng-hide-remove,
			.fade.ng-hide-add {
			  display: block !important;
			}

			.fade.ng-hide-remove {
			  transition: all linear 100ms;
			}

			.fade.ng-hide-add {
			  transition: all linear 100ms;
			}*/
			
			.fadeHeaderToggle {
			  -webkit-transition: top linear 0.2s;
			  transition: top linear 0.2s;
			  top: 45px;
			}
			.fadeHeaderToggle.ng-hide {
			  top: 30px;
			}
			.fadeHeaderToggle.ng-hide-add,
			.fadeHeaderToggle.ng-hide-remove {
			  display: block!important;
			}
			
			.fadeSideMenuToggle {
			  -webkit-transition: left linear 0.2s;
			  transition: left linear 0.2s;
			  left: -2px;
			  overflow: inherit;
			}
			.fadeSideMenuToggle.ng-hide {
			  left: -20px;
			}
			.fadeSideMenuToggle.ng-hide-add,
			.fadeSideMenuToggle.ng-hide-remove {
			  display: block!important;
			}

		</style>
		<center>
			<img id="diginLoaderLogo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAEsCAMAAAAo4z2kAAAAUVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////8IN+deAAAAGnRSTlMA/fob9kT07+fXt6l44jbNw5SFTtzSn2hZGTlFDcsAAAh9SURBVHja7NxhahsxEIDR0TYlTRrcJqYU5v4H7ZKUEpo2stc71sZ+7wBiYT/0QyMUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFen3QSsrmVOAet3pSxKupq1gHW7UhYVXSmLiq6URUVXyqKiK2VR0ZWyqOhKWVR0pSwqulIWFV0pi4qulEVFV8qioitlUdGVsqjoSllUdKUsKrpSFhVdKYuKrpRFRVfKoqIrZTG+K2VxWFfKYhtdKYt+V8piO10pi/e7Uhbb6kpZ/L8rZbG+TGURscGwlMU/pLKYbTIsZfFGKovZRsPKDHgtlcVsu2Epi9dSWcy2HJayqAkrPwW8SGUx23hYyuK3VBYVsqflcXYBB4QVUx7nc8ABYSmLmrCiKYv1w1JWoS8Xe6qcPbGkrJ/xQdy3fNb2McDNBY8rsicWlfUQK2pvTS/unv2Ipab84zbOrV30HCx7oqCsoncGp5OWnuKs2oUPWLMnxpY15VFae4qD3eZszJ7VLn5ynz2xtKynrb+Cs8+/7OMsdrt2BVdCsmf5X34s+rq+adlmOMVZ3F3FXaPsieVlfR0VVraHRYvHWVzHJbbsiZFl5XLCGit7YmRZeQJhDZU9cVJZ9+PCSmGNlD1xWlnfx4WVO2GNkz1xYlnfxoWVj8L6xd6dbjcNg0EYnrETJ2ShodAWvvu/UCAs50DrSko1tlzP+7vHS/3ETrwpu9lhTSor3ti2xdMNhnUNb5b1MB8stniC1LCu4e2yvtRaOox0z1FZDV7SMaxrqCDrrIV17ZHlJzy6vAOhYUlg1ZC1V8FKLxZea5e3vzIsBSyBLBUs4FJ4SfpzF9e6z3glw1LAEsjSwcLhhTk3lmFdQyVZu2lg4dj82wYN6xoEspSwQMNqoTSsarKGaWBhMKwGSsMSyNLCgmE1UBpWRVkbwzKsP6GqLMMyrN+hqqzOsAzrV6gsq1FY/StTNywJrMqy2CKse5Zu4scPPzp3PyMfDas+rHJZzcH6wpKpd4znkVstrHO8EMlPaLQ0rPqy2oLVlVwwYozHJxmsXYzHNt/tk4YlkNUQLBZM/RKp2CtgbZY4RlYNWIjC2AisLQumfmJkxOqwuMzh19KwJLKksO6S8yrfxB9Z7a5Gza/uz2irNCyNrIXBYuTHj9VgMfI7oqnSsESylgSrj7JYCVYUdUZLpWGpZC0IFquOoyC7yL9BQ1WD1RfLWgwsRnFEBc6LHkE5DUsnSwVrVxdWFzc0vBnWYdljc6dhCWWJYG3qwoqbejOshQ8ZGamglLUEWEPth7ArPlPQ8JMjNWHhYxTGBcBivBD/FmOJ95Mk2fKxsCosbItltQ8rY7/wRAms9KXIezZ7LEzDEstaHqw9XmhHLSxipJXAukHWwmARI+2UsPaLu72rNixs3zcsYrROB4sYr1sJLDy9a1gfMB5lsPBaa4GF03uGBcOaDRZOM8OiDhYNa0ZYOBmWYSlg4d6wDEsBC4+GZVgKWDgalmEpYOFoWIalgIWDYRmWAhYuhmVYCli4MyzDUsDCnWEZlgIW7gzLsBSw8MGwDEsBC2fDMiwFLOwNy7AUsLA3LMNSwMLesAxLAQs7wzIsBSwMhmVYClgYDMuwFLAwGJZhKWCBhmVYgiWl91iGJYBFf8cyLAEsruNXYRjWtLC4kvNYhjUtLK7lzLthTQqLq7lWaFhTwuJ67m4wrAlhcUX3YxnWZLD6Vd2abFhTwdqu62EKw5oI1mllj38Z1jSwjmt7YNWwJoF1Wd0j9oY1Bazz+l4KYlgTwNqt8DVGhqWH1cWMsMKw5k8DizEjLBpWA0lgMeaDdYj/gmFltQBYDBms8nlvDCurBcBizAZrSCy/FBYNSwqLMResM+NZx7qwYofRwrCUsBg6WKWqIojKsKLDSA+GpYTFEMIaMNKXsdmiOqxgjxfaMgxLCCtCCKs8CmBF8IB/OzIiDEsHq6+96QWuijfxYWxE5t3Xy8CfRYRhKWFtq296gSvBePKGpYV1ku5SyjujDiwY1qywjspdSnnsUQvW2bBmhHUncAXFYbAcFmhYs8E6S7a95DBYDgt7w5oJ1nCLKxmsT0BdWAANaw5YnexYpZlwOSwcDGt6WIziOmhg9Teu/AbJNgJYfMz4K37NXQt+QytFKo2rAQpYKKx0cVgZFnOWjR9z14JoqEglcbWHABaKK2F1rWeMxzJY/ILXesYqvRZNFakUrh7QRjdtkE9kPO+Y/5WtYD/EPnMteEFjRSqBqwMaqebnPB8WIzZZE2PubPmE5opU9V19QislWIlgHe6RURCZNfSNvQRWdVcNfroqFW3+8M+rLVhR3hbvNsOqBKuP8nq83wyrDqxt5LSi/zbXs6rKTpFbm2fwABhWgx3tyrAEPdiVYQna29X39u41J2EggMLojOJbSTTGmNn/QhVi/CVCsdc+5pwdNPkgzfQWhBVwrSthBVRdOW7Y0dV/qMLS1ei2tasju73pu7oo6/ZeezsL3pm+q5lN0M63rbV6yPBl+q5uy1rUJY7OluGMru7Karir/DZ9Vyv65G50FdKWPBf9OyuOjMs23GNZj+d2sm3hZFe9z0Xr4t5CWoSX7uei7q8S7rufi9Z2kk3B/Gr0L6ybgvnVIK/tqPpUGGSjq1K7u+LfmDOMprfr/YmuWABd8UlXLIOu2Jk+rLXPRRk7LCfPjKjbuShZ3c5FyWpDzO4nVpmtNsBbgRN1OhclrdO5KGmdzkVJ63MuSpzHOEToighdEaErInRFhK6I0BURuuIgrz0xO+aiRJiLEtEOey1wLnNRIsxFiTAXJcJclAhzUSLMRYlw3E6ErojQFRG6IkJXROiKCF0RoSsidEWEuSgR/tiKCHNRIsxFiWh7DwVGZS5KhLkoEeaiRJiLAgAAAAAAAAAAAAAAAAAAAMBxH2VN+JIi4H0pAAAAAElFTkSuQmCC"/>
		</center>
		<section id="loadSection">
            <div att="letter" class="">L</div>
            <div att="letter" class="delay1">O</div>
            <div att="letter" class="delay2">A</div>
            <div att="letter" class="delay3">D</div>
            <div att="letter" class="delay4">I</div>
            <div att="letter" class="delay5">N</div>
            <div att="letter" class="delay6">G</div>
        </section>

		</div>
	</div>
	<!--END OF PRELOADER-->
	
	<!--START OF APPLICATION CONTAINER-->
	<div id="themeStart" layout="column" ng-cloak md-theme="{{$root.theme}}">
		<toastino></toastino>
		<div class="blut-log-wrapper" style="z-index:58 !important">
			<div class="left-toggle-wrapper md-primary" md-colors="{background:'primary'}">
				<img ng-src="{{userSettings.logo_path}}" err-src="images/digin43x43.png"/>
				 <md-tooltip md-direction="right">
				  v4.0.0.0
				</md-tooltip>
			</div>
		</div>
		<md-content class="main-toolbar" style="z-index:58 !important;" ng-mouseenter="headerToggleVisible = true" ng-mouseleave="headerToggleVisible = false">
		
			<div layout="row" layout-align="space-between center" style="padding: 0 25px">
				<div class="blut-search-wrapper hover-color" ng-click="perform($event,'Search')" layout="row" flex>
					<i class="icon-search"></i>
					<span hide-sm hide-xs>Search</span>
				</div>
				<div class="blut-current-view border-left-light" flex hide-xs hide-sm>
					{{currentView}}
				</div>
				<div layout="row" layout-align="end center" class="blut-search-right-wrapper border-left-light">

					<div class="blut-header-icon" ng-click="navigate($event,'#/home')">
						<i class="icon-house-outline hover-color" md-colors="{color:'primary'}" id="home"></i>
						<md-tooltip md-direction="bottom">Go Home</md-tooltip>
					</div>
					<div class="blut-header-icon" ng-click="perform($event,'TV Mode')" hide-sm hide-xs>
						<i ng-hide="fullscreenOn" class="icon-full-size hover-color" md-colors="{color:'primary'}" id="fullscreen"></i>
						<svg style="cursor:pointer" ng-show="fullscreenOn" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" hight="10" width="22" x="22px" y="0px" viewBox="0 0 490.1 490.1" style="enable-background:new 0 0 490.1 490.1;" xml:space="preserve"><g><g><path md-colors="{fill:'primary'}" d="M296,80.85c0-6.8-5.5-12.3-12.3-12.3s-12.3,5.5-12.3,12.3v125.5c0,6.8,5.5,12.3,12.3,12.3h125.5c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3h-95.9l173-173c4.8-4.8,4.8-12.5,0-17.3s-12.5-4.8-17.3,0l-173,173L296,80.85L296,80.85z"/><path md-colors="{fill:'primary'}" d="M20.9,486.45l173.1-173v95.9c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-125.5c0-6.8-5.5-12.3-12.3-12.3H80.8c-6.8,0-12.3,5.5-12.3,12.3s5.5,12.2,12.3,12.2h95.9l-173,173c-4.8,4.8-4.8,12.5,0,17.3c2.4,2.4,5.5,3.6,8.7,3.6S18.5,488.85,20.9,486.45z"/><path md-colors="{fill:'primary'}" d="M206.2,68.55c-6.8,0-12.3,5.5-12.3,12.3v95.9L20.9,3.65c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l173,173H80.8c-6.8,0-12.3,5.5-12.3,12.3s5.5,12.3,12.3,12.3h125.5c6.8,0,12.3-5.5,12.3-12.3V80.85C218.5,74.05,213,68.55,206.2,68.55z"/><path md-colors="{fill:'primary'}" d="M421.5,283.85c0-6.8-5.5-12.3-12.3-12.3H283.8c-6.8,0-12.3,5.5-12.3,12.3v125.5c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-95.9l173,173c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-173-173h95.9C416,296.05,421.5,290.65,421.5,283.85z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
						<md-tooltip md-direction="bottom">Turn <span ng-hide="fullscreenOn">On</span><span ng-show="fullscreenOn">Off</span> Fullscreen</md-tooltip>
					</div>
					<div class="blut-header-icon" ng-click="perform($event,'Clear Widgets')"  hide-sm hide-xs>
						<i class="icon-broom hover-color" md-colors="{color:'primary'}" id="clearWidgets"></i>
						<md-tooltip md-direction="bottom">Clear Widgets</md-tooltip>
					</div>
					<div class="blut-header-icon" ng-click="perform($event,'Save')"  hide-sm hide-xs>
						<i class="ti-save hover-color" md-colors="{color:'primary'}" id="save"></i>
						<md-tooltip md-direction="bottom">Save Dashboard</md-tooltip>
					</div>
					<md-menu md-position-mode="target-right target"  hide-sm hide-xs>
					  <div class="blut-header-icon" aria-label="Open demo menu" class="md-icon-button" ng-click="$mdMenu.open($event)""> <!--$mdOpenMenu($event)-->
						<i class="ti-share hover-color" md-colors="{color:'primary'}" id="share"></i>
					  </div>
					  <md-menu-content ng-class="{'applyDarkBackground': $root.applyDark == true}" >
						<md-menu-item>
						  <md-button ng-click="navigate($event, '#/shareDashboard')">
							  <div layout="row" flex>
								<p flex>Share Dashboard</p>
							  </div>
						  </md-button>
						</md-menu-item>
						<md-menu-item>
						  <md-button ng-click="navigate($event, '#/shareDataset')">
							  <div layout="row" flex>
								<p flex>Share Dataset</p>
							  </div>
						  </md-button>
						</md-menu-item>
					  </md-menu-content>
					</md-menu>
					<!--div flex="10" class="blut-header-icon" ng-click="navigate('Help')">
						<i class="ti-help-alt"></i>
					</div-->
					<div class="blut-header-icon" ng-click="perform($event,'Notifications')" id="notifications">
						<i class="ti-bell hover-color" md-colors="{color:'primary'}"></i>
						<div md-colors="{background:'accent'}"  style="width:15px;height:15px;border-radius:16px;color:white;margin-top:-30px;margin-left:15px;font-size:10px;font-weight:700;position:absolute"><div style="margin-left:4px;margin-top:1px;" ng-if="notifications.length <=9">{{notifications.length}}</div><div style="margin-left:1px;margin-top:3px;" ng-if="notifications.length > 9">{{notifications.length}}</div></div>
						<md-tooltip md-direction="bottom">Notifications</md-tooltip>
					</div>


					<div class="blut-profile-wrapper-header border-left-light">
						<div layout="row" class="blut-login-user pull-right">
							<p ng-model="username" hide-sm hide-xs>{{$root.authObject.Email}}</p>
							<div class="login-img">
								<img ng-src="{{userSettings.dp_path}}" err-src="images/signup-user.png" />
							</div>

							<div class="dropdown">
							  <button class="dropbtn" md-colors="{background:'accent'}"><i class="ti-angle-down"></i></button>
							  <md-content class="dropdown-content">
								<a ng-click="navigate($event,'Switch Tenant')">Switch Tenant</a>
								<!--a ng-click="navigate($event,'Invite User')">Invite user</a>
								<a ng-click="navigate($event,'Profile Settings')">Profile Settings</a-->
								<a ng-click="navigate($event,'#/myAccount')">My Account</a>
								<a ng-click="Introduce()">Help</a>
								<a ng-click="navigate($event,'Logout')">Logout</a>
							  </md-content>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<md-content class="blut-search-toggle  hover-color fadeHeaderToggle"  ng-show="headerToggleVisible || !showHeader" md-colors="{color:'primary'}" ng-click="topMenuToggle();topMenuToggle2()">
				<span ng-if="!showHeader" class="ti-angle-down"></span>
				<span ng-if="showHeader" class="ti-angle-up"></span>
			</md-content>
			
		</md-content>
		
		<md-sidenav class="md-sidenav-right md-whiteframe-z2" md-component-id="notifications" style="overflow-y:hidden;z-index:1501;">

			<md-toolbar class="md-primary" style="min-height: 45px;height:45px;">
				<div layout="row" layout-align="space-between center">
					<div layout="row" layout-align="start center">
						<md-button class="md-icon-button" ng-click="openNotifications()" aria-label="close" hide-lg hide-md hide-gt-lg hide-gt-sm>
							<i class="ti-close" style="font-size:15px"></i>
						</md-button>
						<h1 class="md-toolbar-tools" style="color:white">Notifications</h1>
					</div>
					<div layout="row">
						<i class="ti-volume" style="margin-top: 20px;margin-right: 8px;"> </i>
						<md-switch ng-model="notificationAudio" aria-label="Switch 1"></md-switch>
					</div>
				</div>
			</md-toolbar>
			<md-content style="overflow-y:scroll;height:calc(100% - 130px);padding:0" ng-if="notifications.length >= 1">
				<md-list style="padding:0">
					<md-list-item class="md-3-line" ng-repeat="notification in notifications" ng-click="openNotification(notification.href)">
					  <span class="{{notification.icon}}" style="font-size:35px;color:{{notification.color}}"></span><!--md-colors="{color:'{{$root.h1color}}-A700'}" -->
					  <div class="md-list-item-text" layout="column" style="padding-left: 15px">
						<h3>{{ notification.title }}</h3>
						<p>{{ notification.message }}</p>
					  </div>
					  <md-button class="md-icon-button icon-cancel md-secondary" ng-click="diginComponents.deleteDashboard(dashboard,$event);$event.stopPropagation()" style="font-size:10px;" aria-label="delete">
					  </md-button>
					</md-list-item>
				</md-list>
			</md-content>
			<md-content style="padding:0;height:calc(100% - 130px)" ng-if="notifications.length < 1" layout="column" layout-align="center center">
				<p>There are no Notifications</p>
			</md-content>
				

		</md-sidenav>
		
		<md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id="searchBar" style="overflow-y:hidden;z-index:1501;">


			<md-toolbar class="md-primary" style="min-height: 45px;height:45px;">
				<div layout="row" layout-align="space-between center">

					<div class="search-box">
						<input style="width:200px" placeholder="search dashboard or report..." ng-model="SearchComponents">
					</div>
					<md-button class="md-icon-button"  ng-click="openSearchBar()" aria-label="open search" hide-lg hide-md hide-gt-lg hide-gt-sm>
						<i class="ti-close" style="font-size:15px"></i>
					</md-button>
				</div>
			</md-toolbar>
			<md-content style="overflow-y:scroll;height:calc(100% - 45px);padding:0">
				<div class="dashboard-wrapper">
					<h3 style="color: #9a9a9a;margin-left:10px">Dashboards</h3>
				</div>
				<md-list style="padding:0">
					<md-list-item id="dashboardList"  ng-repeat="dashboard in dashboards | filter:SearchComponents" ng-click="diginComponents.goDashboard($event, dashboard)">
					    <md-radio-group class="setDefaultBtn" ng-model="data.defaultDashboard" ng-click="diginComponents.setDefaultDashboard($event, dashboard)" ng-mouseover="setDashboardHover($event)" ng-mouseleave="unsetDashboardHover($event)">
							<md-radio-button value="{{dashboard.compID}}" class="md-primary" style="float: left;" aria-label="{{dashboard.compID}}">
							</md-radio-button>
						</md-radio-group>
						<span class="ti-pie-chart" md-colors="{color:'{{$root.h1color}}-A700'}" style="font-size:35px; padding-right: 15px"></span>
						<p class="list-item-margin">{{dashboard.compName}}</p>
						<md-button class="md-icon-button icon-cancel md-secondary" ng-click="diginComponents.deleteDashboard(dashboard,$event);$event.stopPropagation()" style="margin-top: 10px !important;font-size:10px;" aria-label="delete">
						</md-button>
					 </md-list-item>
				</md-list>
				<div class="custom-tooltip" ng-show="showTip" style="top:{{clientY}}; left:{{clientX}};">
					Set as default dashbaord
				</div>
				<div class="dashboard-wrapper">
					<h3 style="color: #9a9a9a;margin-left:10px">Reports</h3>
				</div>
				
				<md-list style="padding:0">
					<md-list-item id="catogory" ng-repeat="report in reports | filter:SearchComponents" ng-click="diginComponents.goReport(report)">
						<span class="ti-bar-chart" md-colors="{color:'{{$root.h1color}}-A700'}" style="font-size:35px; padding-right: 15px"></span>
						<p class="list-item-margin">{{report.compName}}</p>
						<md-button class="md-icon-button icon-cancel md-secondary" ng-click="diginComponents.deleteReport(dashboard,$event);$event.stopPropagation()" style="margin-top: 10px !important;font-size:10px;" aria-label="delete">
						</md-button>
					 </md-list-item>
				</md-list>

			</md-content>
			

		</md-sidenav>
		
		<md-content class="main-sidemenu" style="z-index:58 !important;" ng-mouseenter="sideMenuToggleVisible = true" ng-mouseleave="sideMenuToggleVisible = false" ng-intro-options="IntroOptions" ng-intro-method="Introduce"><!--ng-intro-autostart="firstTime"-->
			<div id="cssmenu">
				<ul>
					<li style="height:30px;font-size:24px"  id="step1"><a md-colors="{color:'primary'}" ></a>

					</li>
					<li class="has-sub" style="height:50px;font-size:24px" ng-click="navigate($event,'Create Dashboard')">
						<md-tooltip md-direction="right">Create Dashboard</md-tooltip>
						<a class="hover-color" md-colors="{color:'primary'}"><i class="icon-add-page" id="addPage"></i></a>
					</li>
					<li style="height:50px;font-size:24px" class="active has-sub"><a class="hover-color" md-colors="{color:'primary'}" ><i class="icon-report" id="reports"></i></a>
						<ul>
							<li><a class="cssmenu-heading" md-colors="{color:'primary-600'}">Reports</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-filter sub-menu-icon"></i>Report Development</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-notepad sub-menu-icon"></i>Published Reports</a></li>
						</ul>
					</li>
					<!--li class="has-sub" style="height:50px;font-size:24px" ng-click="navigate($event,'RealTime')" id="step2">
						<md-tooltip md-direction="right">RealTime</md-tooltip>
						<a class="hover-color" md-colors="{color:'primary'}"><i class="icon-clock"></i></a>
					</li>
					<!--li style="height:50px;font-size:24px" ng-click="navigate($event,'DataSource')"><a><i class="icon-database"></i></a></li-->
					<li style="height:50px;font-size:24px" class="active has-sub"><a id="step3" class="hover-color" md-colors="{color:'primary'}"><i class="icon-database" id="datasource"></i></a>
						<ul>
							<li><a class="cssmenu-heading" md-colors="{color:'primary-600'}">Data Source</a></li>
							<li ng-click="navigate($event,'#/visualize_data')"><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-pie-chart sub-menu-icon"></i>Visualize Data</a></li>
							<li ng-click="navigate($event,'#/upload_source')"><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-upload sub-menu-icon"></i>Upload Source</a></li>
							<li ng-click="navigate($event,'#/user_assistance')"><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-wand sub-menu-icon"></i>User Assistance</a></li>
							<li ng-click="navigate($event,'#/datasourceSettings')"><a class="hover-color" md-colors="{color:'primary'}"><i class="icon-settings sub-menu-icon"></i>Datasource Settings</a></li>
							
						</ul>
					</li>
					<li class="has-sub" style="height:50px;font-size:24px" ng-click="perform($event,'AddWidget')">
						<md-tooltip md-direction="right">Add Widget</md-tooltip>
						<a class="hover-color" md-colors="{color:'primary'}"><i class="icon-plugin" id="addWidgets"></i></a>
					</li>
					<li class="has-sub" style="height:50px;font-size:24px" class="active has-sub"><a class="hover-color" md-colors="{color:'primary'}"><i class="icon-profile" id="socialMedia"></i></a>
						<ul>
							<li><a class="cssmenu-heading" md-colors="{color:'primary-600'}">Social Media</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}" href="#/facebook"><i class="ti-facebook sub-menu-icon"></i>Facebook</a></li>
						 
						</ul>
					</li>
					<li class="has-sub" style="height:50px;font-size:24px" class="active has-sub"><a class="hover-color" md-colors="{color:'primary'}"><i class="icon-share" id="shareSocial"></i></a>
						<ul>
							<li><a class="cssmenu-heading" md-colors="{color:'primary-600'}">Share</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-facebook sub-menu-icon"></i>Facebook</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-google sub-menu-icon"></i>Google+</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-twitter sub-menu-icon"></i>Twitter</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-linkedin sub-menu-icon"></i>Linkedin</a></li>
							<li><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-email sub-menu-icon"></i>Email</a></li>
						</ul>
					</li>
					<li class="has-sub" style="height:50px;font-size:24px" class="active has-sub"><a class="hover-color" md-colors="{color:'primary'}"><i class="icon-settings" id="settings"></i></a>
						<ul>
							<li><a class="cssmenu-heading" md-colors="{color:'primary-600'}">Settings</a></li>
							<!--li class="has-sub" ng-click="navigate($event,'createNewUser')"><a><i class="ti-user sub-menu-icon"></i>New user</a></li>
							<li class="has-sub" ng-click="navigate($event,'shareDashboard')"><a><i class="ti-share sub-menu-icon"></i>Share Dashboard</a></li>
							<li class="has-sub" ng-click="navigate($event,'userSettings')"><a><i class="ti-pencil sub-menu-icon"></i>User settings</a></li>
							<li class="has-sub" ng-click="navigate($event,'accountSettings')"><a><i class="ti-settings sub-menu-icon"></i>Account settings</a></li>
							<li class="has-sub" ng-click="navigate($event,'groups')"><a><i class="icon-group sub-menu-icon"></i>Groups</a></li-->
							<li ng-click="navigate($event,'#/userAdministrator')"><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-user sub-menu-icon"></i>User Administrator</a></li>
							<li ng-click="navigate($event,'#/systemSettings')"><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-settings sub-menu-icon"></i>System Settings</a></li>
							<li ng-click="navigate($event,'#/theme')"><a class="hover-color" md-colors="{color:'primary'}"><i class="ti-palette sub-menu-icon"></i>Themes</a></li>
						</ul>
					</li>

				</ul>
				<md-content class="left-menu-toggle hover-color fadeSideMenuToggle" ng-show="sideMenuToggleVisible || !showSideMenu" md-colors="{color:'primary'}" ng-click="leftMenuToggle()">
					<span ng-if="!showSideMenu" class="ti-angle-right"></span>
					<span ng-if="showSideMenu" class="ti-angle-left"></span>
				</md-content>
			</div>
		</md-content>

		<md-content style="background:transparent">
			
			<div ui-view></div>
			<alert-offline ng-show="online==false"></alert-offline>
		</md-content>
	</div>
	<!--END OF APPLICATION CONTAINER-->
	
	
	<!-- build:js scripts/script.js -->
	<script src="bower_components/jquery/dist/jquery.min.js"></script>
	<script src="bower_components/lodash/dist/lodash.min.js"></script>
	<script src="bower_components/angular/angular.min.js"></script>
	<script src="bower_components/angular-animate/angular-animate.min.js"></script>
	<script src="bower_components/angular-aria/angular-aria.min.js"></script>
	<script src="bower_components/angular-material/angular-material.min.js"></script>
	<script src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
	<script src="bower_components/angular-messages/angular-messages.min.js"></script>
	<script src="bower_components/ng-file-upload-shim/ng-file-upload.min.js"></script>
	
	<!--Google Maps start-->
	<script src="bower_components/angular-simple-logger/dist/angular-simple-logger.min.js"></script>
	<script src="bower_components/angular-google-maps/dist/angular-google-maps.min.js"></script>
	<!--Google Maps end-->

    <script src="bower_components/angular-gridster/dist/angular-gridster.min.js"></script>
	<script src="js/libs/uimicrokernel.js"></script>

	<script src="../shell/scripts/config.js"></script>
	<script src="js/services/diginservicehandler.js"></script>
	<script src="js/services/utility.js"></script>
	<script src="js/libs/directivelibrary.js"></script>
	<script src="bower_components/md-steppers/dist/md-steppers.js"></script>
	<script src="https://code.highcharts.com/stock/highstock.js"></script>
	<!--script src="bower_components/highcharts-ng/dist/highcharts-ng.js"></script-->
	<script type="text/javascript" src="js/libs/highcharts-ng.js"></script>
	<script src="js/libs/digin-gridster.js"></script>
	
	<script src="http://code.highcharts.com/modules/exporting.js"></script>
	<script type="text/javascript" src="http://code.highcharts.com/modules/drilldown.js"></script>
	<script type="text/javascript" src="bower_components/highcharts/highcharts-3d.js"></script>
	<script type="text/javascript" src="bower_components/highcharts/highcharts-more.js"></script>
	<script type="text/javascript" src="bower_components/v-accordion/dist/v-accordion.min.js"></script>
	<script type="text/javascript" src="js/libs/ng-croppie.min.js"></script>
	<script src="bower_components/intro.js/minified/intro.min.js"></script>
	<script src="bower_components/angular-intro.js/build/angular-intro.min.js"></script>
	<script src="bower_components/angularjs-slider/dist/rzslider.min.js"></script>
	<script src="js/libs/cellCursor.js"></script>
	
	<!-- PouchDB -->
	<script src="bower_components/pouchdb/dist/pouchdb.js"></script>
	<script src="bower_components/angular-pouchdb/angular-pouchdb.min.js"></script>
	
	<!--for rss feeds>
	<script type="text/javascript" src="https://www.google.com/jsapi"></script>
	<script type="text/javascript">
	  google.load("feeds", "1");
	</script-->


	<script src="js/app.js"></script>
	<script src="views/settings/theme/themingConfig.js"></script>
	<script src="js/services/DiginServices.js"></script>
	<script src="js/services/PackageServices.js"></script>
	<script src="views/settings/myAccount/UserServices.js"></script>
	<script src="js/controllers/NavCtrl.js"></script>

	<script src="dialogs/addWidget/addWidgetCtrl.js"></script>
	<script src="dialogs/createDashboard/createDashboardCtrl.js"></script>
	<script src="dialogs/saveDashboard/saveDashboardCtrl.js"></script>
	<script src="dialogs/saveDashboard/saveDashboardService.js"></script>
	<script src="dialogs/switchTenant/switchTenantCtrl.js"></script>
	<script src="views/home/homeCtrl.js"></script>
	<script src="views/settings/myAccount/myAccountCtrl.js"></script>
	<script src="views/settings/myAccount/addaLaCarte/addaLaCarteCtrl.js"></script>
	<script src="views/settings/userAdministrator/userAdministratorCtrl.js"></script>
	<script src="views/settings/createNewUser/createNewUserCtrl.js"></script>
	<script src="views/settings/shareDashboard/shareDashboardCtrl.js"></script>
	<script src="views/settings/userSettings/userSettingsCtrl.js"></script>
	<script src="views/settings/theme/themeCtrl.js"></script>
	<script src="views/dashboard/dashboardCtrl.js"></script>
	<script src="views/dashboard/renamePage/renamePageCtrl.js"></script>
	<script src="views/settings/systemSettings/systemSettingsCtrl.js"></script>
	<script src="views/user_assistance/user_assistanceCtrl.js"></script>
	<script src="views/query_builder/query_builderCtrl.js"></script>
	<script src="views/social/facebook/facebookCtrl.js"></script>
	<script src="views/settings/dashboardShare/sharedashboardgroupsCtrl.js"></script>
	<script src="views/settings/datasetShare/datasetShareCtrl.js"></script>
	<script src="views/data_source/data_source_settings/datasourceFactory.js"></script>
	<script src="views/data_source/data_source_settings/datasourceSettingsCtrl.js"></script>
	<script src="js/services/tabularService.js"></script>
	
	<!--Developer view is only for developers, Please remove this on production-->
	<script src="views/developer/developerCtrl.js"></script>

	<!--Payment stripe-->
    <script src="https://checkout.stripe.com/checkout.js"></script>
    <script src="js/stripe.payment.tool.js"></script>

	
	<!--Widgets Controllers-->
	<script src="views/widgets/clock/clockCtrl.js"></script>
	<script src="views/widgets/custom/google_maps/gmapsCtrl.js"></script>
	<script src="views/widgets/blogging/WordPress/wordpressInitCtrl.js"></script>
	<script src="views/widgets/blogging/RssFeeds/rssInitCtrl.js"></script>
	<script src="views/widgets/blogging/Gnews/gnewsInitCtrl.js"></script>
	
	<script src="views/widgets/custom/view_image/imInitCtrl.js"></script>
	
	
	<script src="views/widgets/custom/realTime/realTimeCtrl.js"></script>
	
	
	<!--temp map-->

	<script type="text/javascript" src="//code.highcharts.com/maps/modules/map.js"></script>
	<script type="text/javascript" src="//code.highcharts.com/maps/modules/data.js"></script>
	<script src="//code.highcharts.com/mapdata/countries/us/us-all.js"></script>
	<script type="text/javascript" src="map_toBedeleted/world-continents.js"></script>
	<script src="//code.highcharts.com/mapdata/custom/asia.js"></script>
	<script src="//code.highcharts.com/modules/exporting.js"></script>
	<script src="//code.highcharts.com/mapdata/custom/oceania.js"></script>
	<script src="//code.highcharts.com/mapdata/custom/europe.js"></script>
	<script type="text/javascript" src="map_toBedeleted/lk-all.js"></script>
	<script src="//code.highcharts.com/mapdata/custom/south-america.js"></script>
	<script type="text/javascript" src="map_toBedeleted/tempMapCtrl.js"></script>
	
	<!-- endbuild -->
	<!--Widgets Controllers-->
	<script>
	$(document).ready(function(){
		var preload = document.getElementById("preload");
		preload.style.display = "none";
	});
	</script>

	
</body>
</html>
