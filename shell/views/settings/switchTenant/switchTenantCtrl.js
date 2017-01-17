 routerApp.controller('switchTenantCtrl',['$scope','$mdDialog','$http','Digin_Tenant','auth_Path', function ($scope,$mdDialog,$http,Digin_Tenant,auth_Path) {

    //$http.get(Digin_Tenant + '/tenant/GetTenants/' + '15430a361f730ec5ea2d79f60d0fa78e')
    $http.get(auth_Path+'tenant/GetTenants/' + getCookie('securityToken'))
    .success(function (response) {
        $scope.tennants = response;
    });

    $scope.cancel = function() {
    $mdDialog.cancel();
    };

    $scope.submit = function()
    {

    }

    $scope.showConfirmation = function (tennant, event) {
        var confirm = $mdDialog.confirm()
            .title('Do you want to switching to ' + tennant)
            .targetEvent(event)
            .ok('Yes!')
            .cancel('No!');
        $mdDialog.show(confirm).then(function () {
            $scope.status = 'Yes';
            window.open("http://" + tennant + "/#/home");
        }, function () {
            $scope.status = 'No';
        });
    };
    $scope.close = function () {
        $mdDialog.cancel();
    };



}])