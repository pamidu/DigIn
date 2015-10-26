var app = angular.module("diginLogin", ['ngMaterial']);

app.controller("LoginCtrl", ['$scope', '$http', '$mdToast', '$animate', function ($scope, $http, $mdToast, $animate) {
    $scope.login = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:8080/pentaho/j_spring_security_check',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {
                j_username: $scope.txtUname,
                j_password: $scope.txtPwd
            }

        }).
        success(function (data, status) {
            localStorage.setItem('username', $scope.txtUname);

            $scope.username = "admin";

            if (data.match(/Pentaho User Console - Login/g) == null)
                window.location = "home.html";
            else {
                alert('username or password incorrect');

                var tmpl = '<md-toast><span flex>username or password incorrect</span></md-toast>';
                $scope.toastPosition = {
                    bottom: false,
                    top: true,
                    left: false,
                    right: true
                };
                $mdToast.show({
                    template: tmpl,
                    hideDelay: 4000,
                    // position: $scope.getToastPosition()
                });
            }
        }).
        error(function (data, status) {
            alert("Request failed");

        });

        $scope.loggedIn = false;

    };
}]);

app.config(function ($mdThemingProvider, $httpProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('orange');
});
