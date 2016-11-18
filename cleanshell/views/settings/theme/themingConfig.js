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
        '50': '#8859c1',
        '100': '#7b47ba',
        '200': '#6f3fa9',
        '300': '#623896',
        '400': '#563184',
        '500': '#4a2a71',
        '600': '#3e235e',
        '700': '#321c4c',
        '800': '#251539',
        '900': '#190e27',
        'A100': '#956cc8',
        'A200': '#a37ecf',
        'A400': '#b091d6',
        'A700': '#0d0714',
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


	 
		this.changeTheme = function(color) {
			
			var primaryColor = $mdColors.getThemeColor(color.theme+'-primary-500');
			var accentColor = $mdColors.getThemeColor(color.theme+'-accent-500');
					
			$rootScope.theme = color.theme;
			
			$('.has-sub').css('border-left',"3px solid #d7d8da").hover(
			function(){
				$(this).css('border-left',"3px solid "+accentColor);
			},
			function(){
				$(this).css('border-left',"3px solid #d7d8da");
			});
			
			$('.hover-color').css('color',primaryColor).hover(
			function(){
				$(this).css('color',accentColor);
			},
			function(){
				$(this).css('color',primaryColor);
			});
		}
}])

