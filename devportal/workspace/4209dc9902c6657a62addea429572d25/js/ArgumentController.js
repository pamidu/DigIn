app.controller('ArgumentController', ['$scope', '$mdDialog', '$mdToast', '$objectstore', '$rootScope', 'dataHandler', function ($scope, $mdDialog, $mdToast, $objectstore, $rootScope, dataHandler) {

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.publish = function () {
        console.log("Publish button was clicked.");
    }
    $scope.cancel = function () {
        $scope.updateArguments();
        $mdDialog.cancel();
    };

    $scope.types = ['Custom', 'InArgument', 'OutArgument'];
    $scope.datatypes = ['String', 'Int', 'Float'];

    $scope.arguments = [];

    $scope.Key = "";

    $rootScope.checkForErrors = function (ev) {
        removeSpecialCharacters();
    };

    function removeSpecialCharacters() {
        //console.log($scope.Key);
        $scope.Key = $scope.Key.replace(/[^\w]/gi, '');
        //console.log($scope.Key);
    };

    $scope.addArguments = function () {
        var data = {
            Key: $scope.Key,
            Value: $scope.Value,
            Category: $scope.Category,
            Type: 'dynamic',
            Priority: 'NotMandatory',
            Group: 'default',
            DataType: $scope.DataType
        };
        var tflag = $scope.checkType($scope.Value);
        if (tflag == true) {
            data.Type = 'dynamic';
        };
        var flag = dataHandler.AddArguments(data);
        if (flag == true) {
            $scope.showSimpleToast("Key already exists!");
        } else {
            $scope.showSimpleToast("Key added successfully");
        };

    };

    $scope.checkType = function (value) {
        for (i = 0; i < $scope.arguments.length; i++) {
            if ($scope.arguments[i].Key == value) {
                var flag = true;
            };
        };

        return flag;
    };

    $scope.removeArgument = function (key) {
        console.log(key);
        dataHandler.removeArgument(key);
    };

    //    $scope.selectedItemChange = function (item) {
    //        //console.log(item);
    //        var tflag = $scope.checkType(item.value);
    //        if (tflag == true) {
    //            for (i = 0; i < $scope.arguments.length; i++) {
    //                if ($scope.arguments[i].key == item.key) {
    //                    $scope.arguments[i].type = 'dynamic';
    //                };
    //            };
    //        } else {
    //            for (i = 0; i < $scope.arguments.length; i++) {
    //                if ($scope.arguments[i].key == item.key) {
    //                    $scope.arguments[i].type = 'hardcoded';
    //                };
    //            };
    //        };
    //
    //
    //    }

    $scope.showSimpleToast = function (msg) {
        $mdToast.show(
            $mdToast.simple()
            .content(msg)
            .position("bottom left")
            .hideDelay(1000)
        );
    };

    $scope.updateArguments = function () {
        var data = {
            Key: $scope.Key,
            Value: $scope.Value,
            Category: $scope.Category
        };
        dataHandler.updateArguments(data);

    };

    $scope.retrieveArguments = function () {
        $scope.arguments = dataHandler.retrieveArguments();
        console.log($scope.arguments);
    };



    $scope.retrieveArguments();

    $scope.showData = function (query) {
        //alert(query);
        var results = query ? $scope.arguments.filter(createFilterFor(query)) : [];
        return results;
    };


    function createFilterFor(query) {
        //var lowercaseQuery = angular.lowercase(query);
        return function filterFn(argument) {
            return (argument.Key.indexOf(query) === 0);
        };
    }


    $scope.scrollbarconfigArgument = {
            autoHideScrollbar: false,
            theme: 'minimal-dark',
            setHeight: "40vh",
            axis: 'y',
            advanced: {
                updateOnContentResize: true
            },
            scrollInertia: 300
        }
        //dynamic themeing
    $scope.theme = sessionStorage.cur_theme || 'default';
    $rootScope.changeColor = function () {
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
