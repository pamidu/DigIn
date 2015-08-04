
routerApp.service('AnalyticsService', ['$q', function($q) {
  var analytics = [{
      name: 'Analytics',
      iconurl: 'bower_components/material-design-icons/device/svg/production/ic_dvr_24px.svg',
      imgurl: 'http://bi2.io/demo-update.html',
      content: ' '
  } 


   ];

  // Promise-based API
  return {
      loadAll: function() {
    
          return $q.when(analytics);
      }
  };
}]);


routerApp.service('ExtendedAnalyticsService', ['$q', function($q) {
  var analytics = [{
      name: 'Analytics',
      iconurl: 'bower_components/material-design-icons/device/svg/production/ic_dvr_24px.svg',
      imgurl: 'http://192.168.1.148:8080/DuoDigin/api/repos/xanalyzer/service/selectSchema?ts=1431934755131',
      content: ' '
  } 


   ];

  // Promise-based API
  return {
      loadAll: function() {
    
          return $q.when(analytics);
      }
  };
}]);

routerApp.service('d3Service', ['$q', function($q) {
  var analytics = [{
      name: 'd3',
      iconurl: 'bower_components/material-design-icons/device/svg/production/ic_dvr_24px.svg',
      imgurl: 'http://104.236.68.121/d3master/',
      content: ' '
  } 


   ];

  // Promise-based API
  return {
      loadAll: function() {
    
          return $q.when(analytics);
      }
  };
}]);