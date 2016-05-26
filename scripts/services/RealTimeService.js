
routerApp.service('RealTimeService', ['$q', function($q) {
  var analytics = [{
      name: 'RealTime',
      iconurl: 'bower_components/material-design-icons/device/svg/production/ic_dvr_24px.svg',
      imgurl: 'http://104.155.232.234/#/dashboard/file/default.json',
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