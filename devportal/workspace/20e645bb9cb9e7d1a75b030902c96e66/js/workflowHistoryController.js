app.controller('HistoryController', ['$scope', '$mdDialog', '$objectstore', '$rootScope', '$mdSidenav', function ($scope, $mdDialog, $objectstore, $rootScope, $mdSidenav) {



    $scope.showWorkflowDetails = function () {
        $scope.getHistory();
        $mdSidenav('right-details').toggle()
            .then(function () {});
    };

    $scope.getHistory = function () {
        $scope.workflowHistory = [];
        $rootScope.workflowHistory = [];
        console.log($rootScope.parentWorkflowData.version.length);
        for (i = 0; i < $rootScope.parentWorkflowData.version.length; i++) {
            $scope.getWorkflowDetails($rootScope.parentWorkflowData.version[i]);
            //$scope.workflowHistory.push(result);
            //console.log(result, $scope.workflowHistory, $rootScope.parentWorkflowData.version[i]);
        };
    };


    $scope.getWorkflowDetails = function (key) {
        console.log(key);
        $scope.tempResult = {};
        var client = $objectstore.getClient("process_flows");
        client.onGetOne(function (data) {
            console.log(data);
            $scope.tempResult = {
                "data": data,
                "event": event
            }
            $scope.saveObj($scope.tempResult);
        }).getByKey(key);
    };

    $scope.saveObj = function (data) {
        $scope.workflowHistory.push(data);
        $rootScope.workflowHistory = $scope.workflowHistory;
        console.log(data, $scope.workflowHistory);
    }

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
