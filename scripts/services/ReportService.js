
routerApp.service('ReportService', ['$q', function($q) {
  var muppets = [{
      name: 'Products',
      iconurl: 'bower_components/material-design-icons/device/svg/production/ic_dvr_24px.svg',
      imgurl: 'http://104.155.232.234:443/',
      content: ' '
  } 


   ];

  // Promise-based API
  return {
      loadAll: function() {
          // Simulate async nature of real remote calls
          return $q.when(muppets);
      }
  };
}]);