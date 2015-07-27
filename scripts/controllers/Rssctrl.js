// google.load("feeds", "1");

var app = angular.module('rssWidget', ['ngMaterial', 'ngMdIcons','ngSanitize']);

app.controller('AppCtrl',function( $scope){
  
  $scope.callRss = function(rssAddress){

        $scope.entryArray = [];
        google.load("feeds", "1");
        var feed = new google.feeds.Feed(rssAddress);
        feed.setNumEntries(100);
       
        feed.load(function(result) {
        if (!result.error) {
         
          for (var i = 0; i < result.feed.entries.length; i++) {

            var entry = result.feed.entries[i];

            $scope.entryContent = entry.content;
            $scope.entryArray.push(entry);
            
            $scope.$apply();
          }
        }
      });
  };
  
}); 

app.config(function($mdThemingProvider) {
  var customBlueMap = $mdThemingProvider.extendPalette('grey', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('grey', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('grey', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});