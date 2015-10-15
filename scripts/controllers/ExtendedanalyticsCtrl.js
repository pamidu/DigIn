 routerApp.controller('ExtendedanalyticsCtrl', ['$scope', '$timeout', '$rootScope','$mdDialog','$sce','$objectstore','Digin_Extended_Analytics',
                                       function($scope, $timeout, $rootScope, $mdDialog,$sce,$objectstore,Digin_Extended_Analytics) {

 $scope.AnalyticsReportURL = Digin_Extended_Analytics;
 
  $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
 

    }
    ]);
  routerApp.controller('ExtendedReportCtrl', ['$scope', '$timeout', '$rootScope','$mdDialog','$sce','$objectstore','Digin_Extended_Reports',
    function($scope, $timeout, $rootScope, $mdDialog,$sce,$objectstore,Digin_Extended_Reports) {
  
   $scope.AnalyticsReportURL = Digin_Extended_Reports;
 
  $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
 
 
  
  }
 ]);

    routerApp.controller('ExtendedDashboardCtrl', ['$scope', '$timeout', '$rootScope','$mdDialog','$sce','$objectstore','Digin_Extended_Dashboard',
    function($scope, $timeout, $rootScope, $mdDialog,$sce,$objectstore,Digin_Extended_Dashboard) {
  
   $scope.AnalyticsDashboardURL = Digin_Extended_Dashboard;
 
  $scope.trustSrc = function(src) {
       return $sce.trustAsResourceUrl(src);
    }
 
 
  
  }
 ]);