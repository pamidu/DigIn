//var app = angular.module("diginLogin", ['ngMaterial']);

routerApp.controller("LoginCtrl", ['$scope', '$http', '$mdToast', '$animate', '$window','$auth', '$state','$rootScope',
    function ($scope, $http, $mdToast, $animate, $window,$auth, $state, $rootScope) {
        $scope.isLoggedin = false;
        $scope.error = {
            isUserName: false,
            isPwd: false,
            event: 0
        };
        
        $scope.signup = function() {
                $scope.isLoggedin = false;
                  $state.go('signup');
        };

        //on click login  button - Login user
        $scope.login = function() {
            $auth.login($scope.txtUname,$scope.txtPwd,"duoworld.duoweb.info");
            
            $auth.onLoginResult(function (event, data) {
                $scope.isLoggedin = true;

                $rootScope.username = $scope.txtUname;
                localStorage.setItem('username', $scope.txtUname);

                
                var userInfo = $auth.getSession();         
                /*console.log("user data:"+JSON.stringify(userInfo));*/

                $rootScope.name=userInfo.Name;
                localStorage.setItem('name', userInfo.Name);

                $rootScope.email=userInfo.Email;
                localStorage.setItem('email', userInfo.Email);

                $state.go('home'); 

            });
            
            $auth.onLoginError(function(event, data){
                validate(data.message, $mdToast, $scope);
//                alert();
            });
        };
       

//        //Register user??
//        $scope.registerUser = function() {
//            $Auth.register({
//                UserID:$scope.txtUname,
//                EmailAddress: $scope.txtUname,
//                Name: $scope.txtUname,
//                Password: $scope.txtPwd,
//                ConfirmPassword:$scope.txtPwd,
//                Active: true
//            }).success(function(data) {
//                if (data.error) {
//                    alert("Err!");
//                }
//
//                if (data.success) {
//                    alert("Success!");
//                }
//            });
//        };

    }]).directive('keyEnter', function () {
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
