app.controller('TestWorkflowController', ['$scope', '$mdDialog', '$rootScope', 'dataHandler', '$auth', '$v6urls', function ($scope, $mdDialog, $rootScope, dataHandler, $auth, $v6urls) {


    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.arguments = [];

    $scope.SessionDetails = $auth.getSession();
    $v6urls.auth = ($v6urls.auth).slice(7, -5);

    var arguments = dataHandler.retrieveArguments();
    console.log(arguments);
    for (i = 0; i < arguments.length; i++) {
        if (arguments[i].Category == 'InArgument') {
            var obj = {
                Key: arguments[i].Key,
                Value: ''
            };
            $scope.arguments.push(obj);
        };
    };

    for (b = 0; b < $scope.arguments.length; b++) {
        if ($scope.arguments[b].Key == "InLog") {
            $scope.arguments[b].Value = "log";
        };
        if ($scope.arguments[b].Key == "InSecurityToken") {
            $scope.arguments[b].Value = $scope.SessionDetails.SecurityToken;
        };
        if ($scope.arguments[b].Key == "InNamespace") {
            $scope.arguments[b].Value = $v6urls.auth;
            console.log($scope.arguments[b].Value);
        };
    };



    $scope.test = function () {
        var JSONString = "";
        JSONString += "{"
        for (a = 0; a < $scope.arguments.length; a++) {
            JSONString += '"' + $scope.arguments[a].Key + '":"' + $scope.arguments[a].Value + '",'
        };
        JSONString += "}"
        console.log(JSONString);
        $mdDialog.hide(JSONString);
    };
    $scope.testJason = function (data) {
        console.log(data);
        $mdDialog.hide(data);
    };

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
    }

}]);
