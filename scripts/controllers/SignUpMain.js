// var app = angular.module('Fsignup', ['uiMicrokernel', 'ngMaterial']);

routerApp.controller('signUpCtrl', ['$scope', '$mdToast', '$animate', '$http', '$objectstore','$state', function ($scope, $mdToast, $animate, $http, $objectstore,$state) {

        $scope.signup = function() {
                $scope.isLoggedin = false;
                  $state.go('signup');
        };
        $scope.login = function() {
                $scope.isLoggedin = false;
                  $state.go('login');
        };
        $scope.main = function() {
                $scope.isLoggedin = true;
                  $state.go('main');
        };
        $scope.home = function() {
                $scope.isLoggedin = true;
                  $state.go('home');
        };
        $scope.welcome = function() {
                $scope.isLoggedin = true;
                  $state.go('welcome');
        };

    var delay = 2000;
    $scope.User_Name = "";
    $scope.User_Email = "";

    $scope.submit = function () {
        if ($scope.user.password == $scope.user.confirmPassword) {
            var SignUpBtn = document.getElementById("mySignup").disabled = true;
            var fullname = $scope.user.firstName + " " + $scope.user.lastName;
            $scope.user = {
                "EmailAddress": $scope.user.email,
                "Name": fullname,
                "Password": $scope.user.password,
                "ConfirmPassword": $scope.user.confirmPassword,
                "Domain":$scope.user.domain
            };
            console.log($scope.user);

            $http({
                method: 'POST',
                url: 'http://104.197.27.7:3048//UserRegistation/',
                data: angular.toJson($scope.user),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }

            }).success(function (data, status, headers, config) {
                $scope.User_Name = data.Name;
                $scope.User_Email = data.EmailAddress;
                //setting the name of the profile
                var userDetails = {
                    name: fullname,
                    phone: '',
                    email: $scope.user.EmailAddress,
                    company: $scope.user.Domain,
                    country: "",
                    zipcode: "",
                    bannerPicture: 'fromObjectStore',
                    id: "admin@duosoftware.com"
                };
                if (!data.Active) {
                    console.log(data);

                    //setting the userdetails
                    var client = $objectstore.getClient("duosoftware.com", "profile", true);
                    client.onError(function (data) {
                        $mdToast.show({
                            position: "bottom right",
                            template: "<md-toast>Successfully created your profile,Please check your Email for verification!</md-toast>"
                        });
                    });
                    client.onComplete(function (data) {
                        $mdToast.show({
                            position: "bottom right",
                            template: "<md-toast>Successfully created your profile,Please check your Email for verification!</md-toast>"
                        });
                    });
                    client.update(userDetails, {
                        KeyProperty: "email"
                    });


                    setTimeout(function () {

                        //location.href = "http://duoworld.duoweb.info/successpage";
                        $scope.showFailure = false;
                        $scope.showRegistration = false;
                        $scope.showSuccess = true;
                    }, delay);
                } else {

                    $mdToast.show({
                        position: "bottom right",
                        template: "<md-toast>There is a problem in registering or you have already been registered!!</md-toast>"
                    });

                    setTimeout(function () {

                        $scope.showFailure = true;
                        $scope.showRegistration = false;
                        $scope.showSuccess = false;

                        //location.href="http://duoworld.duoweb.info/signup/";
                    }, 3000);


                }


            }).error(function (data, status, headers, config) {

                $mdToast.show({
                    position: "bottom right",
                    template: "<md-toast>Please Try again !!</md-toast>"
                });
                setTimeout(function () {
                    //location.href = "http://duoworld.duoweb.info/login.php?r=http://dw.duoweb.info/s.php#/duoworld-framework/dock";
                    $scope.showFailure = true;
                    $scope.showRegistration = false;
                    $scope.showSuccess = false;
                }, 4000)

            });


        } else {
            $scope.user.password = "";
            $scope.user.confirmPassword = "";
            $mdToast.show({
                position: "bottom right",
                template: "<md-toast>Passwords did not match!</md-toast>"
            });
        }

    }

/*
    $scope.directDuoDiginLogin = function () {
        //location.href = "http://duoworld.duoweb.info/login.php?r=http://dw.duoweb.info/s.php#/duoworld-framework/dock";
        location.href = "login.html"
    }
    $scope.directDuoDiginMain = function () {
        location.href = "http://duoworld.duoweb.info";
    }
    $scope.directDuoDiginSignUp = function () {
        //location.href = "http://duoworld.duoweb.info/signup/"
        location.href = "signup.html"
    }
    $scope.directDuoDiginHome = function () {
        location.href = "home.html"
    }
*/

}])
