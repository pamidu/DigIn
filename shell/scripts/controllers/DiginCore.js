/*
 ----------------------Summary-------------------------------
 | Controllers listed below are here                        |
 ------------------------------------------------------------
 |      showWidgetCtrl                                      |

 |      DashboardCtrl                                       |
 |      ReportCtrl                                          |
 |      analyticsCtrl                                       |
 |      d3PluginCtrl                                        |
 |      ExtendedanalyticsCtrl                               |
 |      ExtendedReportCtrl                                  |
 |      ExtendedDashboardCtrl                               |
 |      summarizeCtrl                                       |
 |      settingsCtrl                                        |
 |      pStackCtrl                                          |
 ------------------------------------------------------------
 */
routerApp.controller('showWidgetCtrl', function($scope, $mdDialog, widget) {

    $scope.widget = angular.copy(widget);
    $scope.dHeight = $scope.widget.widgetData.height + 100;

    $scope.returnWidth = function(width, height) {
        console.log("width here", width, height);
        if ($scope.widget.widgetData.initCtrl == "elasticInit") {
            console.log('elastic');
            $scope.widget.widgetData.highchartsNG.size.width = parseInt(width);
            $scope.widget.widgetData.highchartsNG.size.height = parseInt(height);
        }
    };
    var reSizeWidget = function() {
        $scope.widget.widgetData.highchartsNG.size.width = parseInt(600);
        $scope.widget.widgetData.highchartsNG.size.height = parseInt(400);
    }

    $scope.setChartSize = function(data) {
        console.log(data);
        setTimeout(function() {
            reSizeWidget();
        }, 50);
    }

    $scope.closeDialog = function() {
        $mdDialog.hide();
    };

});




function googleMapsCtrl($scope, $mdDialog, wid, $http) {

    $scope.closeDialog = function() {
        $mdDialog.hide();
    };
};


routerApp.controller('ReportsDevCtrl', ['$scope', '$mdSidenav', '$sce', 'ReportService',
    '$timeout', '$log',
    function($scope, $mdSidenav, $sce, ReportService, $timeout,
        $log) {
        var allMuppets = [];
        $scope.selected = null;
        $scope.muppets = allMuppets;
        $scope.selectMuppet = selectMuppet;

        loadMuppets();
        $scope.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            }
            // $scope.applyCSS = function () {
            //   //  cssInjector.add("/styles/css/style1.css");
            // }
            //*******************
            // Internal Methods
            //*******************
        function loadMuppets() {
            ReportService.loadAll()
                .then(function(muppets) {
                    allMuppets = muppets;
                    $scope.muppets = [].concat(muppets);
                    $scope.selected = $scope.muppets[0];
                })
        }

        function toggleSidenav(name) {
            $mdSidenav(name).toggle();
        }


        function selectMuppet(muppet) {
            $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;

            $scope.toggleSidenav('left');
        }
    }
]);
routerApp.controller('ReportCtrl', ['$scope', 'dynamicallyReportSrv', '$localStorage', 'Digin_Engine_API', 'Digin_Tomcat_Base', 'fileUpload', '$http', 'Upload', 'ngToast', 'Digin_Domain','$state','$mdDialog','$window','$rootScope',
    function($scope, dynamicallyReportSrv, $localStorage, Digin_Engine_API, Digin_Tomcat_Base, fileUpload, $http, Upload, ngToast, Digin_Domain,$state,$mdDialog,$window,$rootScope) {


        // update damith
        // get all reports details
        var privateFun = (function() {
            var rptService = $localStorage.erportServices;
            var reqParameter = {
                apiBase: Digin_Engine_API,
                tomCatBase: Digin_Tomcat_Base,
                token: '',
                reportName: '',
                queryFiled: '',
                userInfo: ''
            };
            var getSession = function() {
                reqParameter.token = getCookie("securityToken");
            };
            $scope.Download = function(){
            $window.open('https://sourceforge.net/projects/pentaho/files/Report%20Designer/5.3/', '_blank');
        };




            var startReportService = function() {
                if (rptService == 0) {
                    dynamicallyReportSrv.startReportServer(reqParameter).success(function(res) {
                        $localStorage.erportServices = 1;
                    }).error(function(err) {
                        //false
                    });
                }
            }; //end

            $scope.goBackFromReports = function(){

               $state.go('home.welcomeSearch');
            }
            return {
                getAllReport: function() {
                    reqParameter.userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
                    $scope.reports = [];
                    getSession();
                    startReportService();
                    dynamicallyReportSrv.getAllComponents(reqParameter).success(function(data) {
                        $rootScope.reports = [];
                        angular.forEach(data.Result, function(key) {
                            if (key.compType == "Report") {
                                $scope.reports.push({
                                    splitName: key.compName,
                                    path: '/dynamically-report-builder',
                                    reportId: key.compID
                                });

                                $rootScope.reports.push({
                                    splitName: key.compName,
                                    path: '/dynamically-report-builder',
                                    reportId: key.compID
                                });
                                   
                            }
                        });

                    }).error(function(error) {

                    });
                }
            }
        }());

        privateFun.getAllReport();

        $scope.reports = [];
        $scope.preloader = false;

        $scope.log = '';

        $scope.upload = function(files) {
            console.log(files);
            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
            var uploadFlag;
            var storeFlag;
            var repid = null;
            

            if (files && files.length) {
               

                for (var i = 0; i < files.length; i++) {
                    var lim = i == 0 ? "" : "-" + i;


                    if(typeof $rootScope.reports != "undefined" ){
                       for(var j=0; j<$rootScope.reports.length;j++){
                            if($rootScope.reports[j].splitName+".zip" == files[i].name || $rootScope.reports[j].splitName+".rar" == files[i].name){
                                repid = $rootScope.reports[j].reportId;
                            }
                        } 

                        if(repid != null){
                              var confirm = $mdDialog.confirm()
                                  .title('Upload Report')
                                  .textContent('Do you want to overwrite the existing report?')
                                  .ariaLabel('Lucky day')
                                  .ok('yes')
                                  .cancel('no');
                                    $mdDialog.show(confirm).then(function() {
                                       $scope.preloader = true;
                                        $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
                                        Upload.upload({
                                                url: Digin_Engine_API + 'file_upload',
                                                headers: {
                                                    'Content-Type': 'multipart/form-data',
                                                },
                                                data: {
                                                    file: files[0],
                                                    db: 'BigQuery',
                                                    SecurityToken: userInfo.SecurityToken,
                                                    other_data: 'prpt_reports'
                                                }
                                            }).success(function(data) {
                                                console.log(data);
                                                uploadFlag = true;
                                                console.log($scope.reports);
                                                $scope.preloader = false;
                                                $scope.diginLogo = 'digin-logo-wrapper2';
                                                if (uploadFlag && storeFlag) {
                                                    fireMsg('1', 'Successfully uploaded!');
                                                    privateFun.getAllReport();
                                                }
                                            }).error(function(data) {
                                                console.log(data);
                                                uploadFlag = false;
                                                fireMsg('0', 'Error uploading file!');
                                                $scope.preloader = false;
                                                $scope.diginLogo = 'digin-logo-wrapper2';
                                            });

                                            var dashboardObject = {

                                                "pages": [],
                                                "compClass": '',
                                                "compType": "Report",
                                                "compCategory": "",
                                                "compID": repid,
                                                "compName": files[0].name.replace(/\.[^/.]+$/, ""),
                                                "refreshInterval": 0,
                                                "filterDetails": [],
                                                "deletions": {
                                                    "componentIDs": [],
                                                    "pageIDs": [],
                                                    "widgetIDs": []
                                                }
                                            }

                                            $http({
                                                method: 'POST',

                                                url: Digin_Engine_API + 'store_component',
                                                data: angular.fromJson(CircularJSON.stringify(dashboardObject)),
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'SecurityToken': userInfo.SecurityToken
                                                }
                                            }).success(function(data) {
                                                storeFlag = true;
                                                if (uploadFlag && storeFlag) {
                                                    fireMsg('1', 'Successfully uploaded!');
                                                    privateFun.getAllReport();
                                                    
                                                }
                                            }).error(function(data) {
                                                storeFlag = false;
                                                fireMsg('2', 'Error uploading file!');
                                            })
                                    }, function() {
                                      
                                });
                        }else{

                            $scope.preloader = true;
                            $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
                            Upload.upload({
                                    url: Digin_Engine_API + 'file_upload',
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                    data: {
                                        file: files[i],
                                        db: 'BigQuery',
                                        SecurityToken: userInfo.SecurityToken,
                                        other_data: 'prpt_reports'
                                    }
                                }).success(function(data) {
                                    console.log(data);
                                    uploadFlag = true;
                                    console.log($scope.reports);
                                    $scope.preloader = false;
                                    $scope.diginLogo = 'digin-logo-wrapper2';
                                    if (uploadFlag && storeFlag) {
                                        fireMsg('1', 'Successfully uploaded!');
                                        privateFun.getAllReport();
                                    }
                                }).error(function(data) {
                                    console.log(data);
                                    uploadFlag = false;
                                    fireMsg('0', 'Error uploading file!');
                                    $scope.preloader = false;
                                    $scope.diginLogo = 'digin-logo-wrapper2';
                                });

                                var dashboardObject = {

                                    "pages": [],
                                    "compClass": '',
                                    "compType": "Report",
                                    "compCategory": "",
                                    "compID": repid,
                                    "compName": files[i].name.replace(/\.[^/.]+$/, ""),
                                    "refreshInterval": 0,
                                    "filterDetails": [],
                                    "deletions": {
                                        "componentIDs": [],
                                        "pageIDs": [],
                                        "widgetIDs": []
                                    }
                                }

                                $http({
                                    method: 'POST',

                                    url: Digin_Engine_API + 'store_component',
                                    data: angular.fromJson(CircularJSON.stringify(dashboardObject)),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'SecurityToken': userInfo.SecurityToken
                                    }
                                }).success(function(data) {
                                    storeFlag = true;
                                    if (uploadFlag && storeFlag) {
                                        fireMsg('1', 'Successfully uploaded!');
                                        privateFun.getAllReport();
                                        
                                    }
                                }).error(function(data) {
                                    storeFlag = false;
                                    fireMsg('2', 'Error uploading file!');
                                })
                        }
                    }
         
                }
            }
        };

        function fireMsg(msgType, content) {
            ngToast.dismiss();
            var _className;
            if (msgType == '0') {
                _className = 'danger';
            } else if (msgType == '1') {
                _className = 'success';
            }
            ngToast.create({
                className: _className,
                content: content,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                dismissOnClick: true
            });
        }
    }
]);


routerApp.controller('RealTimeController', ['$scope', '$sce', 'RealTimeService',
    '$timeout', '$log', '$mdDialog',
    function($scope, $sce, RealTimeService, $timeout, $log, mdDialog) {

        $scope.products = [];
        var allMuppets = [];
        $scope.selected = null;
        $scope.muppets = allMuppets;
        $scope.selectMuppet = selectMuppet;

        loadMuppets();
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }

        function selectMuppet(muppet) {
            $scope.selected = angular.isNumber(muppet) ? $scope.muppets[muppet] : muppet;

            $scope.toggleSidenav('left');
        }

        function loadMuppets() {
            RealTimeService.loadAll()
                .then(function(muppets) {
                    allMuppets = muppets;
                    $scope.muppets = [].concat(muppets);
                    $scope.selected = $scope.muppets[0];
                })
        }


    }
])


routerApp.controller('summarizeCtrl', ['$scope', '$http', '$objectstore', '$mdDialog', '$rootScope', '$q', '$timeout',
    function($scope, $http, $objectstore, $mdDialog, $rootScope, $q, $timeout) {
        $scope.indexes = [];

        var self = this;
        self.selectedItem = null;
        self.searchText = null;
        self.querySearch = querySearch;
        self.simulateQuery = false;
        self.isDisabled = false;

        $scope.selectedFields = [];
        var parameter = "";
        $scope.products = [];


        $scope.getFields = function(index) {
            $scope.selectedFields = [];
            var client = $objectstore.getClient("com.duosoftware.com", index.display);
            client.onGetMany(function(data) {
                if (data) {
                    $scope.selectedFields = data;
                    var client = $objectstore.getClient("com.duosoftware.com", index.display);
                    client.onGetMany(function(datae) {
                        if (datae) {
                            $scope.products = [];
                            for (var i = 0; i < datae.length; i++) {
                                var data = datae[i],
                                    product = {};
                                for (var j = 0; j < $scope.selectedFields.length; j++) {
                                    var field = $scope.selectedFields[j];
                                    product[field] = data[field];
                                }
                                $scope.products.push(product);
                            }
                            pivotUi();
                        }
                    });
                    client.getByFiltering("*");

                }
            });

            client.getFields("com.duosoftware.com", index.display);
        }

        $scope.remove = function() {
            // Easily hides most recent dialog shown...
            // no specific instance reference is needed.
            $mdDialog.hide();
        };

        function pivotUi() {
            var renderers = $.extend($.pivotUtilities.renderers, $.pivotUtilities.gchart_renderers, $.pivotUtilities.d3_renderers);
            $("#tableoutput").pivotUI($scope.products, {
                renderers: renderers,
                rows: [$scope.selectedFields[0]],
                cols: [$scope.selectedFields[1]],

                rendererName: "Table"
            });
        }

        function querySearch(query) {
            var results = query ? $rootScope.indexes.filter(createFilterFor(query)) : [],
                deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function() {
                    deferred.resolve(results);
                }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }
    }
]);

routerApp.controller('settingsCtrl', ['$scope', '$rootScope', '$http', '$state', '$mdDialog', '$objectstore', '$mdToast',
    function($scope, $rootScope, $http, $state, $mdDialog, $objectstore, $mdToast) {
        var featureObj = localStorage.getItem("featureObject");
        $scope.User_Name = "";
        $scope.User_Email = "";

        $scope.username = localStorage.getItem('username');

        // getJSONData($http, 'features', function (data) {
        //     $scope.featureOrigin = data;
        var obj = JSON.parse(featureObj);
        if (featureObj === null) {
            $scope.features = null;
            $scope.selected = [];
        } else {
            $scope.selected = [];
            for (i = 0; i < obj.length; i++) {
                if (obj[i].stateStr === "Enabled")
                    $scope.selected.push(obj[i]);
            }
            $scope.features = obj;

        }
        // });

        $scope.toggle = function(item, list) {

            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
                item.state = false;
                item.stateStr = "Disabled";
            } else {
                list.push(item);
                item.state = true;
                item.stateStr = "Enabled";
            }
        };

        $scope.close = function() {
            $mdDialog.cancel();
        };

        $scope.test = function(item) {

            return false;
        };

        $scope.finish = function() {

            for (i = 0; i < $scope.selected.length; i++) {
                for (j = 0; j < $scope.features.length; j++) {
                    if ($scope.features[j].title == $scope.selected[i].title) {
                        $scope.features[j].state = true;
                        $scope.features[j].stateStr = "Enabled";
                    }
                }
            }

            getJSONData($http, 'menu', function(data) {

                var orignArray = [];
                for (i = 0; i < $scope.features.length; i++) {
                    if ($scope.features[i].state == true)
                        orignArray.push($scope.features[i]);
                }
                $scope.menu = orignArray.concat(data);

            });
            localStorage.setItem("featureObject", JSON.stringify($scope.features));
            $mdDialog.show({
                controller: 'settingsCtrl',
                templateUrl: 'views/settings-save.html',
                resolve: {}
            });

        };

        $scope.saveSettingsDetails = function() {

            window.location = "home.html";
        };


        $scope.closeDialog = function() {

            $mdDialog.hide();
        };

        $scope.addUser = function() {

            if ($scope.user.password == $scope.user.confirmPassword) {
                var SignUpBtn = document.getElementById("mySignup").disabled = true;
                var fullname = $scope.user.firstName + " " + $scope.user.lastName;
                var pentUserName = $scope.user.email;
                var pentPassword = $scope.user.password;
                $scope.user = {
                    "EmailAddress": $scope.user.email,
                    "Name": fullname,
                    "Password": $scope.user.password,
                    "ConfirmPassword": $scope.user.confirmPassword
                };

                $http({
                    method: 'POST',
                    url: 'http://duoworld.duoweb.info:3048/UserRegistation/',
                    data: angular.toJson($scope.user),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }

                }).success(function(data, status, headers, config) {
                    $scope.User_Name = data.Name;
                    $scope.User_Email = data.EmailAddress;
                    //setting the name of the profile
                    var userDetails = {
                        name: fullname,
                        phone: '',
                        email: $scope.user.EmailAddress,
                        company: "",
                        country: "",
                        zipcode: "",
                        bannerPicture: 'fromObjectStore',
                        id: "admin@duosoftware.com"
                    };

                    if (!data.Active) {

                        //setting the userdetails
                        var client = $objectstore.getClient("duosoftware.com", "profile", true);
                        client.onError(function(data) {
                            $mdToast.show({
                                position: "bottom right",
                                template: "<md-toast>Successfully created your profile,Please check your Email for verification!</md-toast>"
                            });
                        });
                        client.onComplete(function(data) {
                            // $mdToast.show({
                            //     position: "bottom right",
                            //     template: "<md-toast>Successfully created your profile,Please check your Email for verification!</md-toast>"
                            // });
                            $http({
                                method: 'PUT',
                                url: 'http://104.131.48.155:8080/pentaho/api/userroledao/createUser',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    "userName": pentUserName,
                                    "password": pentPassword
                                }

                            }).
                            success(function(data, status) {
                                $mdToast.show({
                                    position: "bottom right",
                                    template: "<md-toast>Successfully created your profile,Please check your Email for verification!</md-toast>"
                                });
                                var SignUpBtn = document.getElementById("mySignup").disabled = false;
                            }).
                            error(function(data, status) {
                                alert("Request failed");

                            });
                        });
                        client.update(userDetails, {
                            KeyProperty: "email"
                        });
                    } else {

                        $mdToast.show({
                            position: "bottom right",
                            template: "<md-toast>There is a problem in registering or you have already been registered!!</md-toast>"
                        });


                    }


                }).error(function(data, status, headers, config) {

                    $mdToast.show({
                        position: "bottom right",
                        template: "<md-toast>Please Try again !!</md-toast>"
                    });
                });
            } else {
                $mdToast.show({
                    position: "bottom right",
                    template: "<md-toast>Mismatched passwords</md-toast>"
                });
            }
        };
    }
]);


routerApp.controller('gmapsController', ['$scope', '$rootScope', '$mdDialog', '$state', '$http', '$timeout',
    function($scope, $rootScope, $mdDialog, $state, $http, $timeout) {
        $scope.arrAdds = [];
        $scope.arrAdds = [{
            "customerid": "46837",
            "customername": "Maryann Huddleston",
            "total_sales": "93,6698 Rs",
            "add": "Colombo"
        }, {
            "customerid": "23983",
            "customername": "Sointu Savonheimo",
            "total_sales": "80,7523 Rs",
            "add": "Jafna"
        }, {
            "customerid": "32367",
            "customername": "Debbie Molina",
            "total_sales": "29,0392 Rs",
            "add": "Mount Lavinia"
        }, {
            "customerid": "3409",
            "customername": "Anindya Ghatak",
            "total_sales": "15,6281 Rs",
            "add": "Galle"
        }, {
            "customerid": "23742",
            "customername": "Jai Lamble",
            "total_sales": "27, 9327 Rs",
            "add": "Yakkala"
        }, {
            "customerid": "63000",
            "customername": "Radha Barua",
            "total_sales": "16,995 Rs",
            "add": "Matugama"
        }, {
            "customerid": "83280",
            "customername": "Edmee Glissen",
            "total_sales": "31,5608 Rs",
            "add": "Dehiwala"
        }, {
            "customerid": "92868",
            "customername": "Baran Jonsson",
            "total_sales": "54, 0102 Rs",
            "add": "Ratnapura"
        }, {
            "customerid": "22445",
            "customername": "Magdalena Michnova",
            "total_sales": "89, 3444 Rs",
            "add": "Kottawa"
        }, {
            "customerid": "47603",
            "customername": "Chandrashekhar Dasgupta",
            "total_sales": "31, 4401 Rs",
            "add": "Kandy"
        }];


        $scope.setMap = function() {
            $timeout(function() {
                $rootScope.$broadcast('getLocations', {
                    addData: $scope.arrAdds
                });
            })
        }
    }
]);
routerApp.directive('highchartTest', [function() {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function(scope, element, attrs) {

            scope.$watch(attrs.chart, function() {

                if (!attrs.chart) return;

                var chart = scope.$eval(attrs.chart);

                angular.element(element).highcharts(chart);
            });

        }
    }
}]);
routerApp.controller('geomap', ['$scope', '$rootScope', '$mdDialog', '$state', '$http', '$timeout',
    function($scope, $rootScope, $mdDialog, $state, $http, $timeout) {
 

 
    }
]);