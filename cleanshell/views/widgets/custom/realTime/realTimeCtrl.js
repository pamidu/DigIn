DiginApp.controller('realTimeCtrl', ['$scope', '$state', '$http', '$interval',
    function($scope, $state, $http, $interval) {
            $scope.temp = 1770697;

            $interval(function () {
                //var ranId =$scope.random();
                    var x =  Math.floor(Math.random() * 10) + 1;
                    $scope.temp = $scope.temp + x;

                    $scope.value = numberWithCommas($scope.temp);


            }, 3000);
			
		function numberWithCommas(x) {
             return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
			
	}
]);