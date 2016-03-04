/**
 * Created by Damith on 2/24/2016.
 */

routerApp.controller('dynamicallyReportCtrl', function ($scope) {


    var privateFun = (function () {

        var onChangeRadioInstance;

        function onChangeRadioBtn() {
            function changedValue() {
                return '1';
            }

            function reset() {
                $scope.reportFiledList.selectedRadio = '';
                return '0';
            }

            return {
                changedValue: changedValue,
                reset: reset
            };
        }

        return {
            onChangeRadio: function () {
                if (!onChangeRadioInstance) {
                    onChangeRadioInstance = onChangeRadioBtn();
                }
                return onChangeRadioInstance;
            }
        }
    })();

    //
    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
    };
    var reportFiledList = {
        radioBtn: {
            selectedRadio: '',
            headerName: 'test radio',
            hasRadioBtn: [{value: 0, name: 'test1'},
                {value: 1, name: 'test1'},
                {value: 2, name: 'test1'},
                {value: 3, name: 'test1'},
                {value: 4, name: 'test1'},
                {value: 5, name: 'test1'}]
        },
        checkBox: {
            selectedCheckBox: [],
            headerName: 'test checkbox',
            items: [1, 2, 3, 4, 5]
        }, textBox: {
            headerName: 'test textbox',
            txtFiled: [{name: 'enter test', value: ''},
                {name: 'enter test2', value: ''},
                {name: 'enter test3', value: ''}]
        },
        fromDate: '',
        toDate: '',
        cafDate: '',
        tags: [
            {id: 0, name: "SKY"},
            {id: 1, name: "SKY2"}],
        customerNames: [
            {id: 0, name: 'RAJESWARI N'},
            {id: 1, name: 'CHANDRASEKAR K'},
            {id: 2, name: 'ANITHA B'},
            {id: 3, name: 'ANANDALATCHOUMY S'},
            {id: 4, name: 'ANURADHA R'},
            {id: 5, name: 'VENKATESAN A'},
            {id: 6, name: 'MURUGESAN S'},
            {id: 7, name: 'GANESAN S'},
            {id: 8, name: 'THIRUMANGAI G'}
        ]
    };
    $scope.reportFiledList = reportFiledList;


    $scope.eventHandler = {
        onChangeRadioBtn: function () {
            var val = privateFun.onChangeRadio();
        },
        select2Options: {
            formatNoMatches: function (term) {
                console.log("Term: " + term);
                var message = '<a ng-click="addTag()">Add tag:"' + term + '"</a>';
                if (!$scope.$$phase) {
                    $scope.$apply(function () {
                        $scope.noResultsTag = term;
                    });
                }
                return message;
            }
        }
    }

    //test code
    $scope.noResultsTag = null;
    $scope.addTag = function () {
        $scope.tags.push({
            id: $scope.tags.length,
            name: $scope.noResultsTag
        });
    };
    $scope.$watch('noResultsTag', function (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
            $timeout(function () {
                var noResultsLink = $('.select2-no-results');
                console.log(noResultsLink.contents());
                $compile(noResultsLink.contents())($scope);
            });
        }
    }, true);

}).directive("select2", function ($timeout, $parse) {
    return {
        restrict: 'AC',
        require: 'ngModel',
        link: function (scope, element, attrs) {
            console.log(attrs);
            $timeout(function () {
                element.select2();
                element.select2Initialized = true;
            });
        }
    };
}).directive("datepicker", function () {
    return {
        restrict: "A",
        link: function (scope, el, attr) {
            el.datepicker({
                dateFormat: 'yy-mm-dd'
            });
        }
    };
})
