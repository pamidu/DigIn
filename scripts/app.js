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
    'gridster','lk-google-picker', 'ngSanitize'
])

routerApp.config(["$locationProvider", "$httpProvider", "$stateProvider", "lkGoogleSettingsProvider",function($locationProvider, $httpProvider, $stateProvider, lkGoogleSettingsProvider) {
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

             lkGoogleSettingsProvider.configure({
    apiKey   : 'AIzaSyA9fv9lYQdt1XV6wooFtItxYlMF8Y9t1ao',
    clientId : '468951747947-jb7obcgd91m7379q4nn7vroid8g37ds0.apps.googleusercontent.com',
    scope : ['https://www.googleapis.com/auth/drive']
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

  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


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


routerApp.service('VideosService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

  var service = this;

  var youtube = {
    ready: false,
    player: null,
    playerId: null,
    videoId: null,
    videoTitle: null,
    playerHeight: '480',
    playerWidth: '640',
    state: ''
  };
  var results = [];
  var upcoming = [
    {id: 'kRJuY6ZDLPo', title: 'La Roux - In for the Kill (Twelves Remix)'},
    {id: '45YSGFctLws', title: 'Shout Out Louds - Illusions'},
    {id: 'ktoaj1IpTbw', title: 'CHVRCHES - Gun'},
    {id: '8Zh0tY2NfLs', title: 'N.E.R.D. ft. Nelly Furtado - Hot N\' Fun (Boys Noize Remix) HQ'},
    {id: 'zwJPcRtbzDk', title: 'Daft Punk - Human After All (SebastiAn Remix)'},
    {id: 'sEwM6ERq0gc', title: 'HAIM - Forever (Official Music Video)'},
    {id: 'fTK4XTvZWmk', title: 'Housse De Racket â˜â˜€â˜ Apocalypso'}
  ];
  var history = [
    {id: 'XKa7Ywiv734', title: '[OFFICIAL HD] Daft Punk - Give Life Back To Music (feat. Nile Rodgers)'}
  ];

  $window.onYouTubeIframeAPIReady = function () {
    $log.info('Youtube API is ready');
    youtube.ready = true;
    service.bindPlayer('placeholder');
    service.loadPlayer();
    $rootScope.$apply();
  };

  function onYoutubeReady (event) {
    $log.info('YouTube Player is ready');
    youtube.player.cueVideoById(history[0].id);
    youtube.videoId = history[0].id;
    youtube.videoTitle = history[0].title;
  }

  function onYoutubeStateChange (event) {
    if (event.data == YT.PlayerState.PLAYING) {
      youtube.state = 'playing';
    } else if (event.data == YT.PlayerState.PAUSED) {
      youtube.state = 'paused';
    } else if (event.data == YT.PlayerState.ENDED) {
      youtube.state = 'ended';
      service.launchPlayer(upcoming[0].id, upcoming[0].title);
      service.archiveVideo(upcoming[0].id, upcoming[0].title);
      service.deleteVideo(upcoming, upcoming[0].id);
    }
    $rootScope.$apply();
  }

  this.bindPlayer = function (elementId) {
    $log.info('Binding to ' + elementId);
    youtube.playerId = elementId;
  };

  this.createPlayer = function () {
    $log.info('Creating a new Youtube player for DOM id ' + youtube.playerId + ' and video ' + youtube.videoId);
    return new YT.Player(youtube.playerId, {
      height: youtube.playerHeight,
      width: youtube.playerWidth,
      playerVars: {
        rel: 0,
        showinfo: 0
      },
      events: {
        'onReady': onYoutubeReady,
        'onStateChange': onYoutubeStateChange
      }
    });
  };

  this.loadPlayer = function () {
    if (youtube.ready && youtube.playerId) {
      if (youtube.player) {
        youtube.player.destroy();
      }
      youtube.player = service.createPlayer();
    }
  };

  this.launchPlayer = function (id, title) {
    youtube.player.loadVideoById(id);
    youtube.videoId = id;
    youtube.videoTitle = title;
    return youtube;
  }

  this.listResults = function (data) {
    results.length = 0;
    for (var i = data.items.length - 1; i >= 0; i--) {
      results.push({
        id: data.items[i].id.videoId, 
        title: data.items[i].snippet.title,
        description: data.items[i].snippet.description,
        datetimee: data.items[i].snippet.publishedAt,
        lbc: data.items[i].snippet.liveBroadcastContent,
        ciid: data.items[i].snippet.channelId,
        kidd: data.items[i].id.kind,
        thumbnail: data.items[i].snippet.thumbnails.default.url,
        author: data.items[i].snippet.channelTitle
        
      });
    }
    return results;
  }

  this.queueVideo = function (id, title) {
    upcoming.push({
      id: id,
      title: title
    });
    return upcoming;
  };

  this.archiveVideo = function (id, title) {
    history.unshift({
      id: id,
      title: title
    });
    return history;
  };

  this.deleteVideo = function (list, id) {
    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i].id === id) {
        list.splice(i, 1);
        break;
      }
    }
  };

  this.getYoutube = function () {
    return youtube;
  };

  this.getResults = function () {
    return results;
  };

  this.getUpcoming = function () {
    return upcoming;
  };

  this.getHistory = function () {
    return history;
  };

}]);