
routerApp.service('RealTimeService', ['$q','RealTime', function($q,RealTime) {
  var analytics = [{
      name: 'RealTime',
      iconurl: 'bower_components/material-design-icons/device/svg/production/ic_dvr_24px.svg',
      imgurl: RealTime ,
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