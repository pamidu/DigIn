var app = angular.module("diginLogin", ['ngMaterial']);

app.controller("LoginCtrl", ['$scope', '$http', '$mdToast', '$animate', function ($scope, $http, $mdToast, $animate) {
    $scope.login = function () {

        alert("authentication....!");
        var loginAuth = {
            'useName': 'admin',
            'pwd': 'admin',
            authDetail: {
                'user': $scope.txtUname.trim().toString(),
                'pwd': $scope.txtPwd.trim().toString()
            }
        };
        alert(JSON.stringify(loginAuth));

        if (loginAuth.authDetail.user == null ||
            loginAuth.authDetail.pwd == null) {
            var tmpl = '<md-toast><span flex>username or password incorrect</span></md-toast>';
            $mdToast.show({
                template: tmpl,
                hideDelay: 4000,
                // position: $scope.getToastPosition()
            });
            return;
        }
    };
}]);

app.config(function ($mdThemingProvider, $httpProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('orange');
});
