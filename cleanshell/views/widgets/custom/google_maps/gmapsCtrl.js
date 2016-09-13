DiginApp.controller('gmapsCtrl', ['$scope', '$rootScope', '$mdDialog', '$state', '$http', '$timeout',
    function($scope, $rootScope, $mdDialog, $state, $http, $timeout) {
	  $scope.map = {
          dragZoom: {options: {}},
          center: {
            latitude: 6.826898,
            longitude: 80.178223
          },
          pan: true,
          zoom: 8,
          refresh: true,
          events: {},
          bounds: {}
        };
    }
]);