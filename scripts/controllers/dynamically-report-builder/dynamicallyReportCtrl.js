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
        }
    };
    $scope.reportFiledList = reportFiledList;


    $scope.eventHandler = {
        onChangeRadioBtn: function () {
            var val = privateFun.onChangeRadio();
        }
    }
})
;
