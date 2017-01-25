//damith
'use strict';

routerApp.controller('welcomeSearchBarCtl', function ($scope, $rootScope, $http, $qbuilder, dynamicallyReportSrv, filterService,
                                                      Digin_Engine_API, Digin_Tomcat_Base, $state, Digin_Domain, ngToast) {

    var privateFun = (function () {
        var reqParameter = {
            apiBase: Digin_Engine_API,
            tomCatBase: Digin_Tomcat_Base,
            token: '',
            reportName: '',
            queryFiled: ''
        };
        var getSession = function () {
            reqParameter.token = getCookie("securityToken");
        };
        return {
            getAllDashboards: function () {
                var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
                $scope.dashboards = [];
                $scope.reports = [];
                $http({
                    method: 'GET',
                    url: Digin_Engine_API + 'get_all_components?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain
                }).success(function (data) {
                        console.log("data getAllDashboards", data);
                        for (var i = 0; i < data.Result.length; i++) {
                            $scope.dashboards.push(
                                {dashboardID: data.Result[i].compID, dashboardName: data.Result[i].compName}
                            );
                        }
                    })
                    .error(function (error) {
                        console.log("error get dashboard...!");
                    });
            },
            getAllReports: function () {
                getSession();
                dynamicallyReportSrv.getAllReports(reqParameter).success(function (data) {
                    if (data.Is_Success) {
                        for (var i = 0; i < data.Result.length; i++) {
                            $scope.reports.push(
                                {name: data.Result[i], path: '/dynamically-report-builder'}
                            );
                        }
                    }
                }).error(function (respose) {
                    console.log('error request getAllReports...');
                });
            }
        }
    })();


    //pagination  option
    $scope.pageConfig = {
        itemsPerPage: 8,
        fillLastPage: true
    }


    //go dashboard
    $scope.goReport = function (report) {
        $state.go('home.DynamicallyReportBuilder', {'reportNme': report});
        $rootScope.currentView ="Reports || "+report;
    }

    // $scope.goDashboard = function (dashboard) {

    //       $('.main-headbar-slide').animate({
    //                         top: '-45px'
    //         }, 300);
    //         //  $('.blut-search-toggele').removeClass('go-up').addClass('go-down');
    //         $('#content1').removeClass('content-m-top40').addClass('content-m-top0');
    //     console.log("dash item", dashboard);

    //     var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));

    //     $http({
    //         method: 'GET',
    //         url: Digin_Engine_API + 'get_component_by_comp_id?comp_id=' + dashboard.dashboardID + '&SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain
    //     })
    //         .success(function (data) {
    //             if (data.Is_Success) {
    //                 console.log("$scope.dashboardObject", $scope.dashboardObject);
    //                 $rootScope.currentView = "Dashboards || "+dashboard.dashboardName;
    //                 $rootScope.dashboard = data.Result;
    //                 ngToast.create({
    //                     className: 'success',
    //                     content: data.Custom_Message,
    //                     horizontalPosition: 'center',
    //                     verticalPosition: 'top',
    //                     dismissOnClick: true
    //                 });
    //                 $rootScope.selectedPageIndx = 0;
    //                 $rootScope.selectedPage = 1;

    //                 var index = 0;
    //                 for (var i = 0; i < $rootScope.dashboard.pages[index].widgets.length; i++) {
    //                     $rootScope.dashboard.pages[index]["isSeen"] = true;
    //                     var widget = $rootScope.dashboard.pages[index].widgets[i];
    //                     console.log('syncing...');
    //                     if (typeof(widget.widgetData.commonSrc) != "undefined") {
    //                         widget.widgetData.syncState = false;
    //                         if (widget.widgetData.selectedChart.chartType != "d3hierarchy" && widget.widgetData.selectedChart.chartType != "d3sunburst") {
    //                             //Clear the filter indication when the chart is re-set
    //                             widget.widgetData.filteredState = false;
    //                             filterService.clearFilters(widget);                                
    //                             $qbuilder.sync(widget.widgetData, function (data) {
    //                                 // if (typeof widget.widgetData.widData.drilled != "undefined" && widget.widgetData.widData.drilled)
    //                                 //     $qbuilder.widInit();
    //                                 //widget.widgetData.syncState = true;
    //                             });
    //                         }
    //                     }
    //                 }
    //                 $state.go('home.Dashboards');
    //             }
    //             else {

    //                 ngToast.create({
    //                     className: 'danger',
    //                     content: data.Custom_Message,
    //                     horizontalPosition: 'center',
    //                     verticalPosition: 'top',
    //                     dismissOnClick: true
    //                 });
    //                 $mdDialog.hide();
    //             }
    //         })
    //         .error(function (error) {
    //             ngToast.create({
    //                 className: 'danger',
    //                 content: 'Failed retrieving Dashboard Details. Please refresh page to load data!',
    //                 horizontalPosition: 'center',
    //                 verticalPosition: 'top',
    //                 dismissOnClick: true
    //             });
    //         });
    // }

});