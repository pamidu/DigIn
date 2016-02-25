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
        }
    };
    $scope.reportFiledList = reportFiledList;


    $scope.eventHandler = {
        onChangeRadioBtn: function () {
            var val = privateFun.onChangeRadio();
        }
    }
});
