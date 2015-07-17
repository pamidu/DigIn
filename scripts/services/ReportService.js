
routerApp.service('ReportService', ['$q', function($q) {
  var muppets = [{
      name: 'Products',
      iconurl: 'bower_components/material-design-icons/device/svg/production/ic_dvr_24px.svg',
      imgurl: 'https://192.168.1.201/#/extension/templates',
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