DiginApp.config(['$mdThemingProvider', function($mdThemingProvider) {

	$mdThemingProvider.definePalette('customPrimary', {
        '50': '#66dffe',
        '100': '#4ddafd',
        '200': '#33d5fd',
        '300': '#1acffd',
        '400': '#02c9fb',
        '500': '#02b5e2',	
        '600': '#02a1c9',
        '700': '#028caf',
        '800': '#017896',
        '900': '#01647d',
        'A100': '#7fe4fe',
        'A200': '#98eafe',
        'A400': '#b2effe',
        'A700': '#015064',
		'section': '#DBDBDB',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  
  $mdThemingProvider.definePalette('customAccent', {
	    '50': '#815004',
        '100': '#9a5f04',
        '200': '#b36e05',
        '300': '#cc7d06',
        '400': '#e58d06',
        '500': '#f89b0c',
        '600': '#faaf3e',
        '700': '#fab957',
        '800': '#fbc46f',
        '900': '#fcce88',
        'A100': '#faaf3e',
        'A200': '#f9a525',
        'A400': '#f89b0c',
        'A700': '#fcd8a1',
		'section': '#434343',
		'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
											// on this palette should be dark or light

		'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
		 '200', '300', '400', 'A100'],
		'contrastLightColors': undefined    // could also specify this if default was 'dark'
	 });

  $mdThemingProvider.theme('default')
    .primaryPalette('customPrimary')
	.accentPalette('customAccent')

	$mdThemingProvider.definePalette('redPrimary', {
        '50': '#e69a96',
        '100': '#e18681',
        '200': '#dc736d',
        '300': '#d75f58',
        '400': '#d24b44',
        '500': '#cb3931',
        '600': '#b6332c',
        '700': '#a22d27',
        '800': '#8d2822',
        '900': '#79221d',
        'A100': '#ebaeaa',
        'A200': '#f0c1bf',
        'A400': '#f4d5d3',
        'A700': '#641c18',
		'section': '#DBDBDB',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  
  $mdThemingProvider.definePalette('redAccent', {
	    '50': '#084442',
        '100': '#0b5a58',
        '200': '#0e716e',
        '300': '#118885',
        '400': '#139f9b',
        '500': '#16b5b1',
        '600': '#1ce3dd',
        '700': '#32e6e1',
        '800': '#49e9e4',
        '900': '#60ebe8',
        'A100': '#1ce3dd',
        'A200': '#19ccc7',
        'A400': '#16b5b1',
        'A700': '#76eeeb',
		'section': '#434343',
		'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
											// on this palette should be dark or light

		'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
		 '200', '300', '400', 'A100'],
		'contrastLightColors': undefined    // could also specify this if default was 'dark'
	 });

  $mdThemingProvider.theme('redTheme')
    .primaryPalette('redPrimary')
	.accentPalette('redAccent')
	
	$mdThemingProvider.definePalette('purplePrimary', {
        '50': '#cbb6e4',
        '100': '#bda3dd',
        '200': '#b091d6',
        '300': '#a37ecf',
        '400': '#956cc8',
        '500': '#8859c1',
        '600': '#7b46ba',
        '700': '#6e3fa8',
        '800': '#623896',
        '900': '#563183',
        'A100': '#d8c8eb',
        'A200': '#e5dbf2',
        'A400': '#f2eef8',
        'A700': '#4a2a70',
		'section': '#DBDBDB',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  
  $mdThemingProvider.definePalette('purpleAccent', {
	    '50': '#1c3002',
        '100': '#2a4803',
        '200': '#386104',
        '300': '#467906',
        '400': '#549107',
        '500': '#62aa08',
        '600': '#7eda0a',
        '700': '#8cf30b',
        '800': '#98f523',
        '900': '#a3f63b',
        'A100': '#7eda0a',
        'A200': '#70c209',
        'A400': '#62aa08',
        'A700': '#aff753',
		'section': '#434343',
		'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
											// on this palette should be dark or light

		'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
		 '200', '300', '400', 'A100'],
		'contrastLightColors': undefined    // could also specify this if default was 'dark'
	 });

  $mdThemingProvider.theme('purpleTheme')
    .primaryPalette('purplePrimary')
	.accentPalette('purpleAccent')
	
		$mdThemingProvider.definePalette('orangePrimary', {
        '50': '#f1d191',
        '100': '#eec87b',
        '200': '#ecbe64',
        '300': '#e9b54d',
        '400': '#e6ab37',
        '500': '#e3a220',
        '600': '#cf931a',
        '700': '#b98317',
        '800': '#a27314',
        '900': '#8b6312',
        'A100': '#f4dba8',
        'A200': '#f7e4bf',
        'A400': '#faeed5',
        'A700': '#75530f',
		'section': '#DBDBDB',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  
  $mdThemingProvider.definePalette('orangeAccent', {
	     '50': '#0e42ac',
        '100': '#104bc3',
        '200': '#1255db',
        '300': '#1a60ec',
        '400': '#3270ee',
        '500': '#4981f0',
        '600': '#79a1f4',
        '700': '#90b2f6',
        '800': '#a8c2f8',
        '900': '#bfd3fa',
        'A100': '#79a1f4',
        'A200': '#6191f2',
        'A400': '#4981f0',
        'A700': '#d7e3fc',
		'section': '#434343',
		'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
											// on this palette should be dark or light

		'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
		 '200', '300', '400', 'A100'],
		'contrastLightColors': undefined    // could also specify this if default was 'dark'
	 });

  $mdThemingProvider.theme('orangeTheme')
    .primaryPalette('orangePrimary')
	.accentPalette('orangeAccent')
	
	$mdThemingProvider.definePalette('bluePrimary', {
        '50': '#87cef5',
        '100': '#70c4f3',
        '200': '#58baf1',
        '300': '#40b1f0',
        '400': '#29a7ee',
        '500': '#139dea',
        '600': '#118dd2',
        '700': '#0f7dbb',
        '800': '#0d6ea3',
        '900': '#0b5e8c',
        'A100': '#9fd8f7',
        'A200': '#b6e1f9',
        'A400': '#ceebfb',
        'A700': '#094e74',
		'section': '#DBDBDB',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  
  $mdThemingProvider.definePalette('blueAccent', {
	    '50': '#001612',
        '100': '#002f26',
        '200': '#00493a',
        '300': '#00624f',
        '400': '#007c63',
        '500': '#009578',
        '600': '#00c8a0',
        '700': '#00e2b5',
        '800': '#00fbc9',
        '900': '#16ffd0',
        'A100': '#00c8a0',
        'A200': '#00af8c',
        'A400': '#009578',
        'A700': '#2fffd5',
		'section': '#434343',
		'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
											// on this palette should be dark or light

		'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
		 '200', '300', '400', 'A100'],
		'contrastLightColors': undefined    // could also specify this if default was 'dark'
	 });

  $mdThemingProvider.theme('blueTheme')
    .primaryPalette('bluePrimary')
	.accentPalette('blueAccent')
	
	$mdThemingProvider.definePalette('greenPrimary', {
        '50': '#aedb90',
        '100': '#a0d57d',
        '200': '#92ce6a',
        '300': '#84c857',
        '400': '#76c244',
        '500': '#6ab23a',
        '600': '#5f9f34',
        '700': '#538c2d',
        '800': '#487827',
        '900': '#3c6521',
        'A100': '#bce1a4',
        'A200': '#cae8b7',
        'A400': '#d8eeca',
        'A700': '#31521b',
		'section': '#DBDBDB',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  
  $mdThemingProvider.definePalette('greenAccent', {
	    '50': '#740e40',
        '100': '#8a114d',
        '200': '#a11459',
        '300': '#b81766',
        '400': '#ce1a72',
        '500': '#e31e7f',
        '600': '#e94c99',
        '700': '#ec62a6',
        '800': '#ee79b3',
        '900': '#f190c0',
        'A100': '#e94c99',
        'A200': '#e6358c',
        'A400': '#e31e7f',
        'A700': '#f4a6cd',
		'section': '#434343',
		'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
											// on this palette should be dark or light

		'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
		 '200', '300', '400', 'A100'],
		'contrastLightColors': undefined    // could also specify this if default was 'dark'
	 });

  $mdThemingProvider.theme('greenTheme')
    .primaryPalette('greenPrimary')
	.accentPalette('greenAccent')
	
	

	//Dark
	$mdThemingProvider.theme('defaultDark')
      .primaryPalette('customPrimary')
	  .accentPalette('customAccent')
      .dark();
	  
	 $mdThemingProvider.theme('redThemeDark')
      .primaryPalette('redPrimary')
	  .accentPalette('redAccent')
      .dark();
	  
	  $mdThemingProvider.theme('purpleThemeDark')
      .primaryPalette('purplePrimary')
	  .accentPalette('purpleAccent')
      .dark();
	  
	 $mdThemingProvider.theme('orangeThemeDark')
      .primaryPalette('orangePrimary')
	  .accentPalette('orangeAccent')
      .dark();
	  
	 $mdThemingProvider.theme('blueThemeDark')
      .primaryPalette('bluePrimary')
	  .accentPalette('blueAccent')
      .dark();
	  
	 $mdThemingProvider.theme('greenThemeDark')
      .primaryPalette('greenPrimary')
	  .accentPalette('greenAccent')
      .dark();
	
	
	$mdThemingProvider.alwaysWatchTheme(true);
	
}])

DiginApp.service('colorManager',['$rootScope','$mdTheming','$mdColors', function($rootScope,$mdTheming, $mdColors){


	 
		this.changeTheme = function(theme) {

			if(theme.substr(theme.length - 4) == "Dark")
			{
				$rootScope.lightOrDark = "Dark";
				$rootScope.currentColor = theme.slice(0, -4);
				$rootScope.theme = theme;
				darken();

			}else{
				$rootScope.lightOrDark = "Light";
				$rootScope.currentColor = theme;
				$rootScope.theme = theme;
				lighten();				
			}
			
			window.themeInfo = $rootScope.theme;
			changeHoverColors();

		}
		
		function changeHoverColors()
		{
			var primaryColor = $mdColors.getThemeColor($rootScope.currentColor+'-primary-500');
			var accentColor = $mdColors.getThemeColor($rootScope.currentColor+'-accent-500');

			angular.element('.has-sub').css('border-left',"3px solid #8b8b8b").hover(
			function(){
				angular.element(this).css('border-left',"3px solid "+accentColor);
			},
			function(){
				angular.element(this).css('border-left',"3px solid #8b8b8b");
			});
			
			angular.element('.hover-color').css('color',primaryColor).hover(
			function(){
				angular.element(this).css('color',accentColor);
			},
			function(){
				angular.element(this).css('color',primaryColor);
			});
		}
		
		this.changeMainTheme = function(lightOrDark) {

			if(lightOrDark.theme == 'Dark')
			{
				
				$rootScope.theme = $rootScope.currentColor + lightOrDark.theme;
				$rootScope.lightOrDark = lightOrDark.theme;
				darken();
			}else{
				$rootScope.theme = $rootScope.currentColor;
				$rootScope.lightOrDark = lightOrDark.theme;
				lighten();
			}
			window.themeInfo = $rootScope.theme;
		}
		
		function darken()
		{
			$rootScope.h1color = "accent";
			angular.element('body').css('background',"rgb(88, 88, 88)");
			angular.element('#cssmenu ul ul li').css('background',"rgb(48,48,48)");
			angular.element('#cssmenu ul ul li').addClass("dark");
			angular.element('#cssmenu ul ul li a').addClass("dark");
			angular.element('.border-left-light').addClass("border-left-dark");
			angular.element('md-menu-content').css('background-color',"black");
			$rootScope.applyDark = true;
			//$("input").attr("disabled", true).css("background-color","#707070");
		}
		
		function lighten()
		{
			$rootScope.h1color = "primary";
			angular.element('body').css('background',"rgba(230, 230, 230, 1)");
			angular.element('#cssmenu ul ul li').css('background',"white");
			angular.element('#cssmenu ul ul li').removeClass("dark");
			angular.element('#cssmenu ul ul li a').removeClass("dark");
			angular.element('.border-left-light').removeClass('border-left-dark');
			angular.element('md-menu-content').css('background-color',"white", 'important');
			$rootScope.applyDark = false;
			//$("input").attr("disabled", true).css("background-color","#e9e9e9");
		}
		
		//The purpose of this function is to reinforce some ui elements with theme colors inside child views (The initial changeTheme doesn't do it)
		this.reinforceTheme = function() {
			if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
			{
				angular.element('md-tabs-wrapper').css('background-color',"rgb(48,48,48)", 'important');
			}else{
				angular.element('md-tabs-wrapper').css('background-color',"white", 'important');
			}
			changeHoverColors();
		}
		
}])

