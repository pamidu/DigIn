routerApp.controller("welcomePageCtrl", ['$scope', '$http', '$mdToast', '$animate', '$window','$auth', '$state',
    
    
    function ($scope, $http, $mdToast, $animate, $window,$auth, $state) {
    	$scope.isLoggedin = true;


        $scope.skip = function() {
                $scope.isLoggedin = true;
                  $state.go('home');

        };

         $scope.start = function() {
                $scope.isLoggedin = true;
                  $state.go('');

        };

        
}]);