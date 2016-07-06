app.controller('ErrorController', ['$scope', '$mdDialog', '$mdToast', '$objectstore', '$rootScope', 'dataHandler', function ($scope, $mdDialog, $mdToast, $objectstore, $rootScope, dataHandler) {

    $scope.errors = dataHandler.validateWorkflow();

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.skip = function () {
        var data = 'skip';
        $mdDialog.hide(data);
    };

    $scope.errorCount = $scope.errors.length;

}]);
