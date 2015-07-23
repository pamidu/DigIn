var app = angular.module("diginLogin", ['ngMaterial', 'ngAnimate','ngStorage']);

app.controller("LoginCtrl", ['$scope', '$http', '$templateCache', '$rootScope', '$location', '$window','$localStorage', function($scope, $http, $templateCache, $rootScope, $location, $window,$localStorage) {
  $scope.submitForm = function(isValid) {
    $scope.submitted = true;
    // Check to make sure the form is completely valid
    if (isValid) {
        alert('Form is valid');
    }
  };
    $scope.errorDiv = true;
    $scope.errorMsg = '';
    $scope.currentUser = '';
    $scope.password = '';
    $scope.loggedIn = true;
    // $rootScope.uname=$scope.txtUname;
    // $rootScope.pwd=$scope.txtPwd;
    $localStorage.uname=$scope.txtUname;
    $localStorage.pwd=$scope.txtPwd;


    // $scope.login = function() {
    //     $rootScope.currentUser = $scope.currentUser;
    //     localStorage.setItem("LoginName", $scope.currentUser);

    //     if ($scope.currentUser == '') {
    //         $scope.errorDiv = false;
    //         $scope.errorMsg = 'username cannot be empty';
    //     } else if ($scope.password == '') {
    //         $scope.errorDiv = false;
    //         $scope.errorMsg = 'password cannot be empty';
    //     } else if ($scope.currentUser == 'admin' && $scope.password == 'admin') {
    //         $http.defaults.headers.put = {
    //             'Access-Control-Allow-Origin': '*',
    //             'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    //             'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
    //         };
    //         $http.defaults.useXDomain = true;



    //         $scope.errorDiv = true;
    //         //window.location = "home.html"  ;
    //     } else {
    //         $scope.errorDiv = false;
    //         $scope.errorMsg = 'username or password is incorrect';
    //     }

    // }


    $scope.login1 = function() {

        if ($scope.loggedIn && $scope.txtUname != '') {
            $scope.txtUname = '';
            $scope.txtPwd = '';
            $http({
                method: 'POST',
              //  url: 'http://104.236.192.147:8281/pentaho/j_spring_security_check?j_username='+$localStorage.uname+'&j_password='+$localStorage.pwd+"'",
                url: 'http://104.236.192.147:8080/DuoDigin/j_spring_security_check?j_username=admin&j_password=password',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
                }
                
            }).
            success(function(data, status) {
               
                window.location = "home.html";
            }).
            error(function(data, status) {
                alert("Request failed");

            });
        }
        $scope.loggedIn = false;

    };


    $scope.go = function(path) {
        $location.path("/Home");
    };

    $scope.enter = function(keyEvent) {
        if (keyEvent.which === 13) {
            $scope.login();
        }
    }
}]);

app.config(function($mdThemingProvider, $httpProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('orange');
});