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
			NgMap.getMap().then(function(map) {
				for (var i=0; i<result.data.Result.features.length; i++) {
					var html = "";
					var position = result.data.Result.features[i].geometry.coordinates;
					for (var j=0; j<result.data.Result.features[i].properties.aggregate_measures.length; j++) {
						var currentMeasure = result.data.Result.features[i].properties.aggregate_measures[j];
						html += "<text class='infowindow-textcolor'>"+currentMeasure.measure+" of "+currentMeasure.field+": "+currentMeasure.value+"</text><br/>";
					}
					createMarker(position,map,html);
				}
			  scope.markerClusterer = new MarkerClusterer(map, scope.dynMarkers, {});
			});
		},function errorCallback(response) {
			console.log(response);
		});//end of $http
		
		function createMarker(position, map, html) {
			var latLng = new google.maps.LatLng(position[1],position[0]);
			var marker = new google.maps.Marker({position:latLng, title:"Hello World!"});
			google.maps.event.addListener(marker, 'click', function(data) {
				infowindow.setContent(html);
				infowindow.open(map, marker);
			});
			scope.dynMarkers.push(marker);
		}//end of create marker
		
		var infowindow = new google.maps.InfoWindow(
		{ 
			size: new google.maps.Size(150,50)
		});


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
			