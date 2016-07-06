/* use strict */

app.controller('PublishController', ['$scope', '$mdDialog', '$objectstore', '$rootScope', function ($scope, $mdDialog, $objectstore, $rootScope) {

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.publishWF = function (data, event) {
        console.log(data);
        if (angular.isDefined(data)) {
            var returnObj = {
                "data": data,
                "event": event,
                availability: false
            };

            for (i = 0; i < $scope.publishlist.length; i++) {
                if ($scope.publishlist[i].ProcessCode == data.ProcessCode) {
                    returnObj.data = $scope.publishlist[i];
                    returnObj.availability = true;
                };
            };

            $mdDialog.hide(returnObj);
        }
    };

    $scope.open = function (data) {
        $scope.publish = data;
    };

    $scope.publishlist = [];

    $scope.getallpublishList = function () {
        var client = $objectstore.getClient("process_mapping");
        client.onGetMany(function (data) {
            if (data) {
                console.log(data);
                $scope.publishlist = data;
                document.getElementById("windowloading").style.display = "none";
            }
        });
        client.getByFiltering("*");
    }
    $scope.getallpublishList();

    //dynamic themeing
    $scope.theme = sessionStorage.cur_theme || 'default';
    $rootScope.changeColor = function () {
            //$scope.theme = color.theme;
            $scope.theme = sessionStorage.cur_theme || 'default';
            $scope.themeList = ThemeService();
            console.log('Current Theme', $scope.theme);
            $scope.clickIconMorph = function (value) {
                console.log(value);
                if (value != undefined) {
                    $scope.theme = value + '-theme';
                    sessionStorage.setItem("cur_theme", $scope.theme);
                    console.log('Changed theme', $scope.theme, value);
                    $scope.accent_color = value;
                    //$scope.$apply();
                    //$scope.$digest();
                }
            };
        } //end of dynamic themeing

}]);
