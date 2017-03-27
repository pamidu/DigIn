/*!
* GoogleMap: v0.0.1
* Authour: Dilshan Liyanage
*/

'use strict';

var GoogleMapModule = angular.module('GoogleMap',['DiginServiceLibrary']);

GoogleMapModule.directive('googleMapInSettings', ['NgMap','$timeout','$http','$state', function(NgMap, $timeout,$http,$state) {
  return {
	restrict: 'E',
	templateUrl: 'modules/GoogleMap/GoogleMapInSettings.html',
	scope:{
		config: "="
	},
	link: function(scope,element){
		
		scope.inDashboard = false;
		if($state.current.name == "dashboard")
		{
			scope.inDashboard = true;
		}else{
			scope.inDashboard = false;
		}
		
		
		scope.dynMarkers = [];

		NgMap.getMap().then(function(map) {
			for (var i=0; i < scope.config.Result.features.length; i++) {
				var html = "";
				var position = scope.config.Result.features[i].geometry.coordinates;
				for (var j=0; j < scope.config.Result.features[i].properties.aggregate_measures.length; j++) {
					var currentMeasure = scope.config.Result.features[i].properties.aggregate_measures[j];
					html += "<text class='infowindow-textcolor'>"+currentMeasure.measure+" of "+currentMeasure.field+": "+currentMeasure.value+"</text><br/>";
				}
				createMarker(position,map,html);
			}
		  scope.markerClusterer = new MarkerClusterer(map, scope.dynMarkers, {});
		});

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
		
		scope.$on('widget-resized', function(event, args) {
			NgMap.getMap().then(function(map) {
				var center = map.getCenter();
				google.maps.event.trigger(map, "resize");
				map.setCenter(center);
			});			
		});


	} //end of link
  };
}]);

GoogleMapModule.directive('googleMap',['NgMap','$state', function(NgMap,$state) {
  return {
	restrict: 'E',
	templateUrl: 'modules/GoogleMap/mapView.html',
	link: function(scope,element){
							
		scope.inDashboard = false;
		if($state.current.name == "dashboard")
		{
			console.log("dashboard");
			scope.inDashboard = true;
		}else{
			console.log("chart designer");
			scope.inDashboard = false;
		}
		
		scope.$on('widget-resized', function(event, args) {
			NgMap.getMap().then(function(map) {
				var center = map.getCenter();
				google.maps.event.trigger(map, "resize");
				map.setCenter(center);
			});			
		});


	} //end of link
  };
}]);

DiginHighChartsModule.directive('googleMapSettings',['$rootScope','notifications', function($rootScope,notifications) {
    return {
         restrict: 'E',
         templateUrl: 'modules/GoogleMap/GoogleMapSettings.html',
         scope: {
			mapSettings: '=',
			submitForm: '&'
          },
         link: function(scope,element){
						
			scope.mapSettings.locatorType = "geo_code";
			
			scope.submit = function()
			{
				if(scope.mapSettingsForm.$valid)
				{
					console.log(scope.mapSettings);
					scope.submitForm();
				}else{
					console.log("invalid");
				}
			}
			
			scope.restoreSettings = function()
			{
				scope.submitForm();
			}
         } //end of link
    };
}]);

GoogleMapModule.factory('generateGoogleMap', ['$rootScope','notifications','Digin_Engine_API','$http', function($rootScope, notifications,Digin_Engine_API,$http) {
	return {
		generate: function(settingConfig, selectedDB, datasource_id, selectedMeasures, callback) {
			
			//start of forming url
			var selectedMeasuresForUrl = [];
			var measureName = "";
			var measureType = "";
			var geojsonUrl = "";
			for (var i = 0, len = selectedMeasures.length; i<len; ++i){
				measureName = selectedMeasures[i].name;
				measureType = selectedMeasures[i].aggType.toLowerCase();
				selectedMeasuresForUrl.push({[measureName] : measureType});
			}
			selectedMeasuresForUrl = JSON.stringify(selectedMeasuresForUrl).replaceAll('"', "'");
			
			if(settingConfig.locatorType == "geo_code"){
				geojsonUrl = Digin_Engine_API+"geocoordinate?method=geo_code&SecurityToken="+$rootScope.authObject.SecurityToken+"&dbtype="+selectedDB+"&datasource_id="+datasource_id+"&measures="+selectedMeasuresForUrl+"&latitude="+settingConfig.latitude.name+"&longitude="+settingConfig.longitude.name;
			}else if(settingConfig.locatorType == "reverse_geo_code")
			{
				
			}
			//end of forming url
			
			$http.get(geojsonUrl)
			   .then(function(result) {
					callback(result.data);
				},function errorCallback(response) {
					console.log(response);
				});//end of $http
			
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
			