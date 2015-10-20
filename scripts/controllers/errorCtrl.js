routerApp.controller('errorCtrl', ['$scope','$objectstore','$mdDialog', function ($scope,

$objectstore,$mdDialog) {
  $scope.closeDialog = function() {
            // Easily hides most recent dialog shown...
           // no specific instance reference is needed.
            $mdDialog.hide();
        };


}]);