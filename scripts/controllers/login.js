//var app = angular.module("diginLogin", ['ngMaterial']);

routerApp.controller("LoginCtrl", ['$scope', '$http', '$mdToast', '$animate', '$window','$auth', '$state',
    function ($scope, $http, $mdToast, $animate, $window,$auth, $state) {
        $scope.isLoggedin = false;
        $scope.error = {
            isUserName: false,
            isPwd: false,
            event: 0
        };


        //on click login  button - Login user
        $scope.login = function() {
            alert('test');
            $auth.login($scope.txtUname,$scope.txtPwd,"duoworld.duoweb.info");
            $auth.onLoginResult(function () {
                $scope.isLoggedin = true;
                  $state.go('home');
//                $window.location = "home.html";
            });  
            // , 
            // function (errorData){
            //     alert (errorData.description);
            // });
        };
       

        //Register user??
        $scope.registerUser = function() {
            $Auth.register({
                UserID:$scope.txtUname,
                EmailAddress: $scope.txtUname,
                Name: $scope.txtUname,
                Password: $scope.txtPwd,
                ConfirmPassword:$scope.txtPwd,
                Active: true
            }).success(function(data) {
                if (data.error) {
                    alert("Err!");
                }

                if (data.success) {
                    alert("Success!");
                }
            });
        };

    }]);

//app.config(function ($mdThemingProvider, $httpProvider) {
//        $mdThemingProvider.theme('default')
//            .primaryPalette('indigo')
//            .accentPalette('orange');
//    })
//    .factory('focus', function ($timeout, $window) {
//        return function (id) {
//            $timeout(function () {
//                var element = $window.document.getElementById(id);
//                if (element)
//                    element.focus();
//            });
//        };
//    }).directive('keyEnter', function () {
//    return function (scope, element, attrs) {
//        element.bind("keydown keypress", function (event) {
//            if (event.which === 13) {
//                //13 press key Enter
//                scope.$apply(function () {
//                    scope.$eval(attrs.keyEnter);
//                });
//                event.preventDefault();
//            }
//        });
//    };
//});
