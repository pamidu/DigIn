$(window).load(function() {
     $('#pagePreLoader').hide();
  });

var routerApp = angular.module('DuoDiginRt', ['ngMaterial', 'uiMicrokernel', "highcharts-ng", 'angular.css.injector',
    'ui.router',
    '720kb.socialshare',
    'FBAngular',
    'ngStorage',
    'configuration',
    'directivelibrary',
    'ngMdIcons',
    'countTo',
    'pjTts',
    'nvd3',
    'gridster'
])

routerApp.config(["$locationProvider", "$httpProvider", "$stateProvider",function($locationProvider, $httpProvider, $stateProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'multipart/form-data';
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded";
    $stateProvider
        .state('Dashboards', {
            url: "/Dashboards",
            controller: 'DashboardCtrl',
            templateUrl: "views/charts.html"
        })
        .state('Reports', {
            url: "/Reports",
            controller: 'ReportCtrl',
            templateUrl: "views/reports.html"
        })
        .state('Analytics', {
            url: "/Analytics",
            controller: 'analyticsCtrl',
            templateUrl: "views/analytics.html"
        })
        .state('RealTime', {
            url: "/RealTime",
            controller: 'RealTimeController',
            templateUrl: "views/realtime.html"
        })

    .state('Digin P Stack', {
            url: "/Digin P Stack",
            controller: 'ExtendedanalyticsCtrl',
            templateUrl: "views/extended-analytics.html"
        })
        .state('Interactive Report', {
            url: "/Interactive Report",
            controller: 'ExtendedReportCtrl',
            templateUrl: "views/extended-reports.html"
        })
        .state('Analysis Report', {
            url: "/Analysis Report",
            controller: 'ExtendedanalyticsCtrl',
            templateUrl: "views/extended-analytics.html"
        })
        .state('Dashboard', {
            url: "/Dashboard",
            controller: 'ExtendedDashboardCtrl',
            templateUrl: "views/extended-dashboard.html"
        })
         .state('D3plugins', {
            url: "/D3plugins",
            controller: 'd3PluginCtrl',
            templateUrl: "views/D3Plugin/d3View.html"
        })
        .state('PivotTable', {
            url: "/PivotTable",
            controller: 'summarizeCtrl',
            templateUrl: "views/pivottable.html"
        })
         .state('ReportViewer', {
            url: '/ReportViewer:param' ,
            controller: 'ReportViewerControl',
            templateUrl: "views/Report_viewer.html" 
             
        })
           .state('DashboardViewer', {
            url: '/DashboardViewer:param' ,
            controller: 'DashboardViewerControl',
            templateUrl: "views/Dashboard_viewer.html" 
             
        })
            .state('CustomDashboardViewer', {
            url: "/CustomDashboard:param",
            controller: 'DashboardCtrl',
            templateUrl: "views/charts.html"
        })
             .state('AnalyzerViewer', {
            url: '/AnalyzerViewer:param' ,
            controller: 'AnalyzerViewerControl',
            templateUrl: "views/Analyzer_viewer.html" 
             
        })
             .state('Settings', {
            url: '/settings' ,
            controller: 'settingsCtrl',
            templateUrl: "views/settings.html" 
             
        })
             .state('Grid', {
            url: '/Grid' ,
            controller: 'DashboardCtrl',
            templateUrl: "views/chartsGridster.html" 
             
        })
}]);


 routerApp.controller('ReportViewerControl', ['$scope','$rootScope', '$stateParams','Digin_ReportViewer','$sce',
                                       function($scope,$rootScope,$stateParams,Digin_ReportViewer,$sce) {

     //here i need to append the report url ,
 
    $scope.reportURL = Digin_ReportViewer+"3A"+ $rootScope.username+"%3AReports%3A"+$stateParams.param+"/viewer?" ; 

    $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
 

    }
    ]);
  routerApp.controller('DashboardViewerControl', ['$scope','$rootScope', '$stateParams','Digin_DashboardViewer','$sce',
                                       function($scope,$rootScope,$stateParams,Digin_DashboardViewer,$sce) {

     //here i need to append the report url ,
 
    $scope.reportURL = Digin_DashboardViewer+"3A"+ $rootScope.username+"%3ADashboards%3A"+$stateParams.param+"/viewer?" ; 

    $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
 

    }
    ]);
   routerApp.controller('AnalyzerViewerControl', ['$scope','$rootScope', '$stateParams','Digin_AnalyzerViewer','$sce','$localStorage',
                                       function($scope,$rootScope,$stateParams,Digin_AnalyzerViewer,$sce,$localStorage) {

 

    $scope.reportURL = Digin_AnalyzerViewer+"3A"+ $rootScope.username+"%3AAnalyzer%3A"+$stateParams.param+"/editor?" ; 

    $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }

    
    }
    ]);


routerApp.run(['$rootScope', function($rootScope) {




}]);


routerApp.controller('mainController', ['$scope', '$http', function(scope, http) {}]);

routerApp.controller('savePentahoCtrl', ['$scope', '$http','$objectstore','$mdDialog','$rootScope', 

function ($scope, $http,$objectstore,$mdDialog,$rootScope) {   
 
       $scope.closeDialog = function() {
            // Easily hides most recent dialog shown...
           // no specific instance reference is needed.
            $mdDialog.hide();
        };
      $scope.dashboardName ="";
      $scope.dashboardType = $rootScope.dashboard.dashboardType;
      $scope.dashboardCulture = $rootScope.dashboard.dashboardCulture;
      $scope.dashboardDate = $rootScope.dashboard.dashboardDate;

      $scope.saveDashboardDetails = function(){
      $rootScope.dashboard.dashboardName = $scope.dashboardName;
       
      var client = $objectstore.getClient("com.duosoftware.com","duodigin_dashboard");
      client.onComplete(function(data){ 
           $mdDialog.hide();
            $mdDialog.show({
            controller: 'successCtrl',  
      templateUrl: 'views/dialog_success.html',
        resolve: {
          
        }
    })
      });
      client.onError(function(data){
            $mdDialog.hide();
            $mdDialog.show({
            controller: 'errorCtrl',
      templateUrl: 'views/dialog_error.html',
        resolve: {
          
        }
    })
      });
      
  
      client.insert([$rootScope.dashboard], {KeyProperty:"dashboardName"});           
     
             
      }

 
}]);