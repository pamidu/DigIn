/*!
* GoogleMap: v0.0.1
* Authour: Dilshan Liyanage
*/

'use strict';

var GoogleMapModule = angular.module('GoogleMap',['DiginServiceLibrary']);

GoogleMapModule.directive('googleMapInSettings', ['NgMap', function(NgMap) {
  return {
	restrict: 'E',
	templateUrl: 'modules/GoogleMap/GoogleMapInSettings.html',
	scope:{
		geojsonUrl: "@"
	},
	link: function(scope,element){
		
		console.log(scope.geojsonUrl);
		scope.setData = "modules/GoogleMap/samplegeojson.json";
		
		scope.areaData = {
		 "type": "FeatureCollection",
		 "features": [{
		  "geometry": {
		   "type": "Point",
		   "coordinates": [79.88897323608397, 6.933072734145719]
		  },
		  "type": "Feature",
		  "properties": {
		   "aggregate_measures": [{
			"field": "st",
			"value": 19.0,
			"measure": "avg"
		   }]
		  }
		 }]
		};
		
		scope.map = {};
		scope.lat = 0;//6.933072734145719;
		scope.lng = 0;//79.88897323608397;
			
		NgMap.getMap().then(function(map) {
			//console.log(map);
			scope.map = map;
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
			console.log(evt);
			this.position = angular.copy(evt.latLng)
			this.id = "measureswindow";
			this.anchorPoint = {f: true,x: 0, y: -40};
			console.log(this);
			
			scope.lat = evt.latLng.lat();
			scope.lng = evt.latLng.lng();
			
			scope.map.showInfoWindow('measureswindow', this);

		}
		
		scope.showStore = function(evt, storeId) {
			console.log(evt);
			console.log(this);
			scope.store = scope.stores[storeId];
			scope.map.showInfoWindow('foo', this);
		};
	
	} //end of link
  };
}]);

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
			console.log(selectedMeasuresForUrl);
			selectedMeasuresForUrl = JSON.stringify(selectedMeasuresForUrl)
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