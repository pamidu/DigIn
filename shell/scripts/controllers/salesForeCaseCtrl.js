/**
 * Created by Damith on 1/27/2016.
 */
routerApp.controller('salesForeCaseCtrl', function ($scope, $mdDialog) {
    $scope.slider = {
        businessGrowth: {
            value: 100
        },
        churnRate: {
            value: 100
        },
        options: {
            id: 'slider-id',

            onStart: function (id) {
                // logs 'on start slider-id'
            },
            onChange: function (id) {
                // logs 'on change slider-id'
            },
            onEnd: function (id) {
                // logs 'on end slider-id'
            }
        }
    };

    //create highchart
    $scope.q1Row = {
        options: {
            chart: {
                type: "column",
                backgroundColor: null,
                spacingBottom: 15,
                spacingTop: 10,
                spacingLeft: 10,
                spacingRight: 10,
                height: 150,
                width: 350
            }, plotOptions: {column: {borderWidth: 0, groupPadding: 0, shadow: !1}}
        },
        title: {
            text: '',
            style: {
                display: 'none'
            }
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: ''
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#FAFAFA'
            }]
        },
        tooltip: {},
//        legend: {
//            layout: 'vertical',
//            align: 'right',
//            verticalAlign: 'middle',
//            borderWidth: 0
//        },
        series: [{
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            color: '#757575',
            showInLegend: false
        }, {
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            color: '#BDBDBD',
            showInLegend: false
        }]
    };

    //download  sales forecast
    $scope.onClickDownload = function () {
        $mdDialog.show({
            controller: forecastDownloadCtrl,
            templateUrl: 'views/salesForecast/download_Temp.html',
            clickOutsideToClose: true,
            locals: {}
        });

    }

});

function forecastDownloadCtrl($scope, $mdDialog) {
    $scope.closeDialog = function () {
        $mdDialog.hide();
    }
}
