var app = angular.module("diginLogin", ['ngMaterial']);

app.controller("LoginCtrl", ['$scope', '$http', '$mdToast', '$animate', '$window', 'focus',
    function ($scope, $http, $mdToast, $animate, $window, focus) {

        $scope.error = {
            isUserName: false,
            isPwd: false,
            event: 0
        };


        //on click login  button
        $scope.login = function () {
            var loginAuth = {
                'useName': 'Demo',
                'pwd': 'Demo',
                authDetail: {
                    'user': $scope.txtUname,
                    'pwd': $scope.txtPwd
                }
            };

            if (angular.isUndefined(loginAuth.authDetail.user)) {
                $scope.error.isUserName = true;
                focus('userName');
                return;
            }
            else if (angular.isUndefined(loginAuth.authDetail.pwd)) {
                $scope.error.isPwd = true;
                focus('password');
                return;
            } else {
                //login authentication
                if (loginAuth.authDetail.user == 'Demo' &&
                    loginAuth.authDetail.pwd == 'Demo') {
                    $window.location = "home.html";
                    return;
                } else {
                    //invalid login detials
                    focus('userName');
                    $scope.error = {
                        isUserName: true,
                        isPwd: true
                    };
                    return;
                }

            }

        };
    }]);

app.config(function ($mdThemingProvider, $httpProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('orange');
    })
    .factory('focus', function ($timeout, $window) {
        return function (id) {
            $timeout(function () {
                var element = $window.document.getElementById(id);
                if (element)
                    element.focus();
            });
        };
    }).directive('keyEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                //13 press key Enter
                scope.$apply(function () {
                    scope.$eval(attrs.keyEnter);
                });
                event.preventDefault();
            }
        });
    };
});
