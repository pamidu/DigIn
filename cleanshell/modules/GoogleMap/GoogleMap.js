/*!
* GoogleMap: v0.0.1
* Authour: Dilshan Liyanage
*/

'use strict';

var GoogleMapModule = angular.module('GoogleMap',['DiginServiceLibrary']);

GoogleMapModule.directive('googleMapInSettings', ['NgMap','$timeout','$http', function(NgMap, $timeout,$http) {
  return {
	restrict: 'E',
	templateUrl: 'modules/GoogleMap/GoogleMapInSettings.html',
	scope:{
		geojsonUrl: "@"
	},
	link: function(scope,element){
		
		scope.dynMarkers = [];
		
		$http.get(scope.geojsonUrl)
	   .then(function(result) {
			//console.log(result.data.features);
			NgMap.getMap().then(function(map) {
				console.log(result);
	  
				for (var i=0; i<result.data.Result.features.length; i++) {
					var position = result.data.Result.features[i].geometry.coordinates;
					//console.log(position[0],position[1]);
					var latLng = new google.maps.LatLng(position[1],position[0]);
					scope.dynMarkers.push(new google.maps.Marker({position:latLng}));
				}
			  scope.markerClusterer = new MarkerClusterer(map, scope.dynMarkers, {});
			});
		},function errorCallback(response) {
			console.log(response);
		});

	} //end of link
  };
}]);
/*
GoogleMapModule.directive('googleMapInSettings', ['NgMap','$timeout', function(NgMap, $timeout) {
  return {
	restrict: 'E',
	templateUrl: 'modules/GoogleMap/GoogleMapInSettings.html',
	scope:{
		geojsonUrl: "@"
	},
	link: function(scope,element){
		
		scope.showMapData = false;
		
		$timeout(function(){
			scope.showMapData = true;
		},200);
		
		scope.map = {};
		scope.lat = 0;//6.933072734145719;
		scope.lng = 0;//79.88897323608397;
		scope.aggregate_measures = [];
		scope.dynMarkers = [];
		
		NgMap.getMap().then(function(map) {
			console.log(map);
			scope.map = map;
			
			for (var i=0; i<998; i++) {
				var latLng = new google.maps.LatLng(markers[i].position[0], markers[i].position[1]);
				scope.dynMarkers.push(new google.maps.Marker({position:latLng}));
			}
			scope.markerClusterer = new MarkerClusterer(map, scope.dynMarkers, {});
		});
		
		scope.stores = {
			foo: { position:[41, -87], items: [1,2,3,4]},
			bar:{ position:[41, -83], items: [5,6,7,8]}
		  };
		  
		  
		  scope.showStore = function(evt, storeId) {
			scope.store = scope.stores[storeId];
			scope.map.showInfoWindow('foo', this);
		  };

		scope.showMeasure = function(evt)
		{
			scope.aggregate_measures = evt.feature.f.aggregate_measures;
			console.log(this);
			console.log(evt);
			
			scope.lat = evt.latLng.lat();
			scope.lng = evt.latLng.lng();
			//this.getPosition()
						
			scope.map.showInfoWindow('measureswindow');

		}
	
	} //end of link
  };
}]);*/

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

GoogleMapModule.factory('generateGoogleMap', ['$rootScope','notifications','Digin_Engine_API', function($rootScope, notifications,Digin_Engine_API) {
	return {
		generate: function(settingConfig, selectedDB, datasource_id, selectedMeasures, callback) {
			var selectedMeasuresForUrl = [];
			var measureName = "";
			var measureType = "";
			var SecurityToken = $rootScope.authObject.SecurityToken;
			for (var i = 0, len = selectedMeasures.length; i<len; ++i){
				measureName = selectedMeasures[i].name;
				measureType = selectedMeasures[i].aggType.toLowerCase();
				selectedMeasuresForUrl.push({[measureName] : measureType});
			}
			selectedMeasuresForUrl = JSON.stringify(selectedMeasuresForUrl).replaceAll('"', "'");
			
			if(settingConfig.locatorType == "geo_code"){
				var geojsonUrl = Digin_Engine_API+"geocoordinate?method=geo_code&SecurityToken="+SecurityToken+"&dbtype="+selectedDB+"&datasource_id="+datasource_id+"&measures="+selectedMeasuresForUrl+"&latitude="+settingConfig.latitude.name+"&longitude="+settingConfig.longitude.name;
				callback(geojsonUrl);
			}else if(settingConfig.locatorType == "reverse_geo_code")
			{
				
			}
		},mapValidations: function(settings){
			var isChartConditionsOk = false;
			
			switch (settings.locatorType) {
                case "geo_code":
					if(settings.longitude && settings.latitude)
					{
						isChartConditionsOk = true;
					}else{
						notifications.toast(2,"Please select longitude and latitude columns");
					}
					break;
				case "reverse_geo_code":
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
			