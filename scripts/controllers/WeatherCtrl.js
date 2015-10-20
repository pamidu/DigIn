var app=angular.module('weApp',['ngMaterial', 'ngMdIcons']);

app.controller('weCtrl', ['$scope', 'weatherService', function($scope, weatherService) {
  $scope.zip ='Colombo';
	$scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  	};
  function fetchWeather(zip) {
    weatherService.getWeather(zip).then(function(data){
      $scope.place = data;
      countUp($scope.place.item.condition.temp);
      
    }); 
  }
  
  fetchWeather('colombo');
  $scope.findWeather = function(zip) {
    $scope.place = '';
    fetchWeather(zip);
  };

function countUp(count)
{
  // var a = Math.round(count - 32) ;
  // var b= a*5/9;
  var div_by = 100,
      speed = Math.round(count / div_by),
      $display = $('.count'),
      run_count = 1,
      int_speed = 24
      tt = 0;
  
  var int = setInterval(function() {
    if(tt <= count){
      $display.text(tt+'°F');
      tt++;
    } else if(parseInt($display.text()) < count) {
      var curr_count = parseInt($display.text());
      $display.text(curr_count);
    } else {
      clearInterval(int);
    }
  }, int_speed);
}


}]);

app.factory('weatherService', ['$http', '$q', function ($http, $q){
  function getWeather (zip) {
    var deferred = $q.defer();
    $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + zip + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
      .success(function(data){
        deferred.resolve(data.query.results.channel);
      })
      .error(function(err){
        console.log('Error retrieving markets');
        deferred.reject(err);
      });
    return deferred.promise;
  }
  
  return {
    getWeather: getWeather
  };
}]);
app.config(function($mdThemingProvider) {
  var customBlueMap = $mdThemingProvider.extendPalette('grey', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});