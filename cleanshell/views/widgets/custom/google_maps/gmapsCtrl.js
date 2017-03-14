DiginApp.controller('gmapsCtrl', ['$scope', '$rootScope', '$mdDialog', '$state', '$http', '$timeout','NgMap', function($scope, $rootScope, $mdDialog, $state, $http, $timeout,NgMap) {
	 
	 $scope.$on('widget-resized', function(event, args) {

		var anyThing = args;
		console.log(anyThing);
		NgMap.getMap().then(function(map) {
			var center = map.getCenter();
			google.maps.event.trigger(map, "resize");
			map.setCenter(center);
		});

		
	});
	
	$scope.styles= [{
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
	 

	 
}]);