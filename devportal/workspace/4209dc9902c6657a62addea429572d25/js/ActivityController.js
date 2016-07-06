/* use strict */

app.controller('ActivityController', ['$scope', '$mdDialog', '$mdToast', '$objectstore', '$rootScope', function ($scope, $mdDialog, $mdToast, $objectstore, $rootScope) {

    $scope.activitylist = [];
    $scope.types = ['InArgument', 'OutArgument'];
    $scope.priorities = ['Mandatory', 'NotMandatory', 'custom'];
    $scope.datatypes = ['String', 'Int', 'Float'];

    $scope.getallActivities = function () {
        $scope.activitylist = [];
        var client = $objectstore.getClient("process_activities");
        client.onGetMany(function (data) {
            if (data) {
                console.log(data);
                data = $scope.checkFormat(data);
                $scope.activitylist = data;
                document.getElementById("windowloading").style.display = "none";
            }
        });
        client.getByFiltering("*");
    }
    $scope.getallActivities();

    $scope.checkFormat = function (data) {
        var obj = {
            Name: 'anonymous',
            Email: 'default',
            MobileNo: 'default',
            Company: 'default'

        };
        for (i = 0; i < data.length; i++) {
            if (data[i].OtherData.Name == undefined) {
                data[i].OtherData = obj;
            };
        };

        console.log(data);
        return data;
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.open = function (activity) {
        $scope.activity = activity;
    };

    $scope.save = function (data, event) {
        var obj = {
            Name: 'anonymous',
            Email: 'default',
            MobileNo: 'default',
            Company: 'default'

        };
        if (data.OtherData == undefined) {
            data.OtherData = obj;
        };
        if (angular.isDefined(data)) {
            var returnObj = {
                "data": data,
                "event": event
            }
            $mdDialog.hide(returnObj);
        }
    };

    $scope.update = function (data, event) {
        console.log(data);
        if (angular.isDefined(data)) {
            var returnObj = {
                "data": data,
                "event": event
            }
            $mdDialog.hide(returnObj);
        }
    };

    $scope.remove = function (data, event) {
        console.log(data);
        if (angular.isDefined(data)) {
            var returnObj = {
                "data": data,
                "event": event
            }
            $mdDialog.hide(returnObj);
        }
    };

    $scope.addArgument = function (id) {

        var obj = {
            Key: $scope.key,
            Category: $scope.category,
            Priority: $scope.priority,
            Value: "",
            DataType: $scope.DataType
        };
        var flag = false;
        var newActivity = true;

        for (i = 0; i < $scope.activitylist.length; i++) {
            if (id == $scope.activitylist[i].library_id) {
                newActivity = false;
                if ($scope.activitylist[i].Variables == undefined) {
                    $scope.activitylist[i].Variables = [];
                };
                for (x = 0; x < $scope.activitylist[i].Variables.length; x++) {
                    if ($scope.activitylist[i].Variables[x].Key == obj.Key)
                        flag = true;

                };
                if (flag == false) {
                    $scope.activitylist[i].Variables.push(obj);
                    $scope.showMessage('Argument added!');
                    $scope.key = "";
                    $scope.category = "";
                } else {
                    $scope.showMessage('Key already exists!');
                };
            };
        };

        if (newActivity == true) {

            console.log("hello");
            var tempobj = {
                Variables: []
            };
            tempobj.Variables.push(obj);
            $scope.activitylist.push(tempobj);

            var z = parseInt($scope.activitylist.length - 1);
            $scope.activity = $scope.activitylist[z];
            $scope.showMessage('Argument added!');
            $scope.key = "";
            $scope.category = "";
            console.log($scope.activity, $scope.activitylist, z);
        };

    };

    $scope.deleteArgument = function (id, key) {
        for (i = 0; i < $scope.activitylist.length; i++) {
            if (id == $scope.activitylist[i].library_id) {
                for (x = 0; x < $scope.activitylist[i].Variables.length; x++) {
                    if ($scope.activitylist[i].Variables[x].Key == key)
                        $scope.activitylist[i].Variables.splice(x, 1);
                    $scope.showMessage('Argument Deleted');

                }
            };
        };

    };

    $scope.showMessage = function (msg) {
        $mdToast.show(
            $mdToast.simple()
            .content(msg)
            .position('bottom right')
            .hideDelay(3000)
        );
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
