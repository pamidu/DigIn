routerApp.controller("welcomePageCtrl", ['$scope', '$http', '$mdToast', '$animate', '$window', '$auth', '$state',


    function ($scope, $http, $mdToast, $animate, $window, $auth, $state) {
        $scope.isLoggedin = true;

        $scope.notShowWelcome = function () {

            localStorage.setItem('notShowWelcome', true);
            $scope.skip();
        }

        $scope.skip = function () {
            $scope.isLoggedin = true;
            $state.go('home.welcomeSearch');
        };

        $scope.start = function () {

            $scope.isLoggedin = true;
            $state.go('videos');

        };


    }]);