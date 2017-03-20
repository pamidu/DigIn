/*!
* GoogleMap: v0.0.1
* Authour: Dilshan Liyanage
*/

'use strict';

var GoogleMapModule = angular.module('GoogleMap',['DiginServiceLibrary']);

GoogleMapModule.directive('googleMapInSettings', function() {
  return {
	restrict: 'E',
	templateUrl: 'modules/GoogleMap/GoogleMapInSettings.html',
	link: function(scope,element){
		
		scope.styles= [{
          'featureType': 'all',
          'elementType': 'all',
          'stylers': [{'visibility': 'off'}]
        }, {
          'featureType': 'landscape',
          'elementType': 'geometry',
          'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
        }, {
          'featureType': 'water',
          'elementType': 'labels',
          'stylers': [{'visibility': 'off'}]
        }, {
          'featureType': 'water',
          'elementType': 'geometry',
          'stylers': [{'visibility': 'on'}, {'hue': '#5f94ff'}, {'lightness': 60}]
        }];

	} //end of link
  };
});

GoogleMapModule.directive('googleMap',['NgMap', function(NgMap) {
  return {
	restrict: 'E',
	templateUrl: 'modules/GoogleMap/mapView.html',
	link: function(scope,element){
		
		scope.$on('widget-resized', function(event, args) {

			var anyThing = args;
			console.log(anyThing);
			NgMap.getMap().then(function(map) {
				var center = map.getCenter();
				google.maps.event.trigger(map, "resize");
				map.setCenter(center);
			});

			
		});
		
		scope.styles= [{
          'featureType': 'all',
          'elementType': 'all',
          'stylers': [{'visibility': 'off'}]
        }, {
          'featureType': 'landscape',
          'elementType': 'geometry',
          'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
        }, {
          'featureType': 'water',
          'elementType': 'labels',
          'stylers': [{'visibility': 'off'}]
        }, {
          'featureType': 'water',
          'elementType': 'geometry',
          'stylers': [{'visibility': 'on'}, {'hue': '#5f94ff'}, {'lightness': 60}]
        }];

	} //end of link
  };
}]);

DiginHighChartsModule.directive('googleMapSettings',['$rootScope','notifications', function($rootScope,notifications) {
    return {
         restrict: 'E',
         templateUrl: 'modules/GoogleMap/GoogleMapSettings.html',
         scope: {
			mapSettings: '='
          },
         link: function(scope,element){
			 
			scope.mapSettings.locatorType = "geo_code";
			
			scope.$on('press-submit', function(event, args) {
				scope.mapSettingsForm.$setSubmitted();
				if(scope.mapSettingsForm.$valid)
				{
					args.callbackFunction(true);
				}else{
					args.callbackFunction(false);
				}
			   
			  
			 })
         } //end of link
    };
}]);

GoogleMapModule.factory('generateGoogleMap', ['notifications', function(notifications) {
	return {
		generate: function(number) {
			 return number + 1;
		},mapValidations: function(settings){
			var isChartConditionsOk = false;
			
			switch (settings.locatorType) {
                case "geocodes":
					if(settings.longitude && settings.latitude)
					{
						isChartConditionsOk = true;
					}else{
						notifications.toast(2,"Please select longitude and latitude columns");
					}
					break;
				case "address":
					if(settings.address)
					{
						isChartConditionsOk = true;
					}else{
						notifications.toast(2,"Please select an address column");
					}
					break;
			}
			return isChartConditionsOk;
		
		}
		
   }
}]);//END OF DiginServices