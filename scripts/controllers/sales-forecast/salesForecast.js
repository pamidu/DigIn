routerApp.controller('salesForecastCtrl', function($scope, $mdDialog, $location, $http, Digin_Engine_API1) {

    $scope.forecastInit = function() {
        var sales = [{
            "year": "2009",
            "month": "01",
            "sales": "516302.9595000003",
            "tot_units": "5552"
        }, {
            "year": "2009",
            "month": "02",
            "sales": "332480.6365",
            "tot_units": "4027"
        }, {
            "year": "2009",
            "month": "03",
            "sales": "411628.72899999993",
            "tot_units": "4258"
        }, {
            "year": "2009",
            "month": "04",
            "sales": "393276.4820000002",
            "tot_units": "4512"
        }, {
            "year": "2009",
            "month": "05",
            "sales": "230145.53799999997",
            "tot_units": "4829"
        }, {
            "year": "2009",
            "month": "06",
            "sales": "263456.06799999997",
            "tot_units": "4176"
        }, {
            "year": "2009",
            "month": "07",
            "sales": "380503.97000000003",
            "tot_units": "4815"
        }, {
            "year": "2009",
            "month": "08",
            "sales": "329754.715",
            "tot_units": "4880"
        }, {
            "year": "2009",
            "month": "09",
            "sales": "325292.3145000001",
            "tot_units": "4805"
        }, {
            "year": "2009",
            "month": "10",
            "sales": "361555.26650000014",
            "tot_units": "4215"
        }, {
            "year": "2009",
            "month": "11",
            "sales": "248933.42599999995",
            "tot_units": "4036"
        }, {
            "year": "2009",
            "month": "12",
            "sales": "415809.3505000001",
            "tot_units": "4275"
        }, {
            "year": "2010",
            "month": "01",
            "sales": "336526.6805000001",
            "tot_units": "4248"
        }, {
            "year": "2010",
            "month": "02",
            "sales": "271580.50800000003",
            "tot_units": "4386"
        }, {
            "year": "2010",
            "month": "03",
            "sales": "217808.00649999996",
            "tot_units": "4061"
        }, {
            "year": "2010",
            "month": "04",
            "sales": "266968.5889999999",
            "tot_units": "3600"
        }, {
            "year": "2010",
            "month": "05",
            "sales": "283534.2849999998",
            "tot_units": "5554"
        }, {
            "year": "2010",
            "month": "06",
            "sales": "293080.6649999999",
            "tot_units": "4370"
        }, {
            "year": "2010",
            "month": "07",
            "sales": "229885.49850000005",
            "tot_units": "4304"
        }, {
            "year": "2010",
            "month": "08",
            "sales": "207937.00900000002",
            "tot_units": "4558"
        }, {
            "year": "2010",
            "month": "09",
            "sales": "418343.27849999996",
            "tot_units": "5020"
        }, {
            "year": "2010",
            "month": "10",
            "sales": "365251.985",
            "tot_units": "4892"
        }, {
            "year": "2010",
            "month": "11",
            "sales": "290670.34550000005",
            "tot_units": "4463"
        }, {
            "year": "2010",
            "month": "12",
            "sales": "368093.95400000014",
            "tot_units": "4928"
        }, {
            "year": "2011",
            "month": "01",
            "sales": "251467.22800000006",
            "tot_units": "3673"
        }, {
            "year": "2011",
            "month": "02",
            "sales": "299890.141",
            "tot_units": "4051"
        }, {
            "year": "2011",
            "month": "03",
            "sales": "296035.8710000001",
            "tot_units": "4108"
        }, {
            "year": "2011",
            "month": "04",
            "sales": "288213.3970000002",
            "tot_units": "4623"
        }, {
            "year": "2011",
            "month": "05",
            "sales": "262628.4960000001",
            "tot_units": "5283"
        }, {
            "year": "2011",
            "month": "06",
            "sales": "197740.84550000002",
            "tot_units": "4077"
        }, {
            "year": "2011",
            "month": "07",
            "sales": "287905.18650000007",
            "tot_units": "4391"
        }, {
            "year": "2011",
            "month": "08",
            "sales": "274578.4795",
            "tot_units": "3781"
        }, {
            "year": "2011",
            "month": "09",
            "sales": "276049.796",
            "tot_units": "4055"
        }, {
            "year": "2011",
            "month": "10",
            "sales": "305660.451",
            "tot_units": "4047"
        }, {
            "year": "2011",
            "month": "11",
            "sales": "367769.4960000002",
            "tot_units": "4397"
        }, {
            "year": "2011",
            "month": "12",
            "sales": "328877.3144999999",
            "tot_units": "5078"
        }, {
            "year": "2012",
            "month": "01",
            "sales": "340626.5070000001",
            "tot_units": "4479"
        }, {
            "year": "2012",
            "month": "02",
            "sales": "276132.49900000007",
            "tot_units": "4138"
        }, {
            "year": "2012",
            "month": "03",
            "sales": "348208.3250000001",
            "tot_units": "4837"
        }, {
            "year": "2012",
            "month": "04",
            "sales": "268024.97000000003",
            "tot_units": "4535"
        }, {
            "year": "2012",
            "month": "05",
            "sales": "384588.06150000036",
            "tot_units": "5607"
        }, {
            "year": "2012",
            "month": "06",
            "sales": "276580.93549999996",
            "tot_units": "3911"
        }, {
            "year": "2012",
            "month": "07",
            "sales": "242809.69950000013",
            "tot_units": "4419"
        }, {
            "year": "2012",
            "month": "08",
            "sales": "302745.1234999999",
            "tot_units": "4848"
        }, {
            "year": "2012",
            "month": "09",
            "sales": "318271.5664999997",
            "tot_units": "5236"
        }, {
            "year": "2012",
            "month": "10",
            "sales": "351246.73250000016",
            "tot_units": "5124"
        }, {
            "year": "2012",
            "month": "11",
            "sales": "256020.10399999996",
            "tot_units": "3355"
        }, {
            "year": "2012",
            "month": "12",
            "sales": "354709.3380000001",
            "tot_units": "3960"
        }];

        var sortedSales = sales.sort(function(a, b) {
            return parseFloat(a.year) - parseFloat(b.year);
        });

        var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        $scope.yearObjArr = [];
        var currYr = 0;

        for (i = 0; i < sales.length; i++) {
            var yObj = {};
            if (currYr == sales[i].year) {
                var curYObj = $scope.yearObjArr.filter(function(obj) {
                    return obj.year == sales[i].year;
                });
                $scope.yearObjArr = $scope.yearObjArr.filter(function(obj) {
                    return obj.year !== sales[i].year;
                });
                curYObj[0][monthArr[parseInt(sales[i].month) - 1]] = {
                    sales: Math.round(sales[i].sales * 100) / 100,
                    units: sales[i].tot_units
                };
                $scope.yearObjArr.push(curYObj[0]);

            } else {
                yObj["year"] = sales[i].year;
                yObj[monthArr[parseInt(sales[i].month) - 1]] = {
                    sales: Math.round(sales[i].sales * 100) / 100,
                    units: sales[i].tot_units
                };
                $scope.yearObjArr.push(yObj);
                currYr = sales[i].year;
            }

        }
    };



    console.log(JSON.stringify($scope.yearObjArr));

    $scope.slider = {
        businessGrowth: {
            value: 30
        },
        movingvalue: {
            value: 7
        },
        options: {
            id: 'slider-id',

            onStart: function(id) {
                // logs 'on start slider-id'
            },
            onChange: function(id) {

            },
            onEnd: function(id) {
                // logs 'on end slider-id'
            }
        }
    };


    $scope.slider.movingvalue.value = 10;
    $scope.dataIndicator = false;

    $scope.slider.model = "Additive";

    $scope.models = [{
        name: "Additive"
    }, {
        name: "Multiplicative"
    }, {
        name: "Linear"
    }];

    $scope.changesale = function(name) {
            $scope.dataIndicator = true;
            $scope.getPageDetails(name);
        }
        //create highchart
    $scope.q1Row = {
        options: {
            chart: {
                type: "column",
                backgroundColor: null,
                //spacingBottom: 15,
                //spacingTop: 10,
                //spacingLeft: 10,
                //spacingRight: 10,
                height: 150,
                //                width: 350
            },
            plotOptions: {
                column: {
                    borderWidth: 0,
                    groupPadding: 0,
                    shadow: !1
                }
            }
        },
        title: {
            text: '',
            style: {
                display: 'none'
            }
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ]
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

    function generateChart(data) {
        configSeries = [];
        $scope.totalsales = 0;
        $scope.rmserror = 0;
        $scope.totalViews = 0;
        $scope.averageData = [];
        $scope.upperdata = [];
        $scope.lowerdata = [];
        $scope.forecastdata = [];
        $scope.configData = [];
        var colorObj = {
            'page_views': '#00796B',
            'page_fans': '#B2DFDB',
            'page_stories': '#FFFFFF'
        };
        data.forEach(function(entry) {
            if (entry.target == 'RMSE') {

                $scope.rmserror =  Math.round(entry.value * 100) / 100;
            }
            if (entry.target == 'TotalForecastedVal') {
                var total =  Math.round(entry.tot * 100) / 100 ;
                $scope.totalsales = total + "RS";

            }
            var seriesName = '';

            if (entry.target == 'Historical_values') {
                entry.datapoints.forEach(function(value) {
                    $scope.averageData.push(value[0]);
                    $scope.configData.push(value[1]);
                    $scope.forecastdata.push(value[0]);
                    $scope.upperdata.push(0);
                    $scope.lowerdata.push(0);
                });

            } else if (entry.target == 'Upper') {
                entry.datapoints.forEach(function(value) {
                    $scope.upperdata.push(value[0]);
                    $scope.configData.push(value[1]);

                });


            } else if (entry.target == 'Lower') {
                entry.datapoints.forEach(function(value) {

                    $scope.lowerdata.push(value[0]);
                    $scope.configData.push(value[1]);

                });
            } else if (entry.target == 'Forecast') {
                entry.datapoints.forEach(function(value) {
                    $scope.forecastdata.push(value[0]);
                    $scope.configData.push(value[1]);

                });


            }










        });



        $scope.highchartsNG = {
            options: {
                chart: {
                    type: "line",
                    zoomType: 'x',
                    backgroundColor: null,
                    spacingBottom: 15,
                    spacingTop: 10,
                    spacingLeft: 10,
                    spacingRight: 10,
                    height: 300
                },
                plotOptions: {
                    column: {
                        borderWidth: 0,
                        groupPadding: 0,
                        shadow: !1
                    }
                }
            },
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            xAxis: {
                categories: $scope.configData
            },

            yAxis: {
                title: {
                    text: 'Forecast'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            size: {
                height: 500,
                width: 1200
            },
            //        legend: {
            //            layout: 'vertical',
            //            align: 'right',
            //            verticalAlign: 'middle',
            //            borderWidth: 0
            //        },
            series: [{
                    name: 'Historical_values',
                    data: $scope.averageData,
                    color: '#1976D2'
                }, {
                    name: 'Upper',
                    data: $scope.upperdata,
                    color: '#CDDC39'
                }, {
                    name: 'Lower',
                    data: $scope.lowerdata,
                    color: '#D32F2F'
                }, {
                    name: 'Forecast',
                    data: $scope.forecastdata,
                    color: '#303F9F'
                }

            ]
        };

        console.log($scope.highchartsNG.series);
    };


    $scope.getPageDetails = function(name) {
        var serviceUrl = Digin_Engine_API1 + "forecast?model=" + name.name + "&pred_error_level=0.01&alpha=0&beta=53&gamma=34&fcast_days=" + $scope.slider.businessGrowth.value + "&table_name=[Demo.forcast_superstoresales]&field_name_d=Date&field_name_f=Sales&steps_pday=1&m=" + $scope.slider.movingvalue.value + "&interval=Daily";
        http: //localhost:8080/forecast?model=Additive&pred_error_level=0.0001&alpha=0&beta=53&gamma=34&fcast_days=30&table_name=[Demo.forcast_superstoresales]&field_name_d=Date&field_name_f=Sales&steps_pday=1&m=7&interval=Daily
            getServiceResponse(serviceUrl, function(data) {

                $scope.dataIndicator = false;
                generateChart(data);

            });
    };




    function getServiceResponse(serviceUrl, callback) {
        console.log('Sevice URL:' + serviceUrl);
        $http({
            method: 'GET',
            url: serviceUrl
        }).success(function(data, status) {
            callback(data);
        }).error(function(data, status) {
            console.log('unexpected error occured');
        });
    };

    //download  sales forecast
    $scope.onClickDownload = function() {
        $mdDialog.show({
            controller: forecastDownloadCtrl,
            templateUrl: 'views/salesForecast/download_Temp.html',
            clickOutsideToClose: true,
            locals: {}
        });

    }

});

function forecastDownloadCtrl($scope, $mdDialog) {
    $scope.closeDialog = function() {
        $mdDialog.hide();
    }

    $scope.test = function() {
        html2canvas($("#tblForecast"), {
            onrendered: function(canvas) {
                var imgData = canvas.toDataURL(
                    'image/png');
                width = (canvas.width * 25.4) / 115, // DPI
                    height = (canvas.height * 25.4) / 115; // DPI
                var doc = new jsPDF('landscape');
                doc.addImage(imgData, 'PNG', 15, 50, width, height);
                doc.save('forcast-data.pdf');
            }
        });
    };


}
