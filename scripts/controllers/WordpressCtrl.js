// $(window).load(function() {
//      $('#pagePreLoader').hide();
//      $('#tab1-content').hide();
//   });

// var app = angular.module('WordpressWidget', ['ngMaterial', 'ngMdIcons']);

// app.controller('AppCtrl',function( $scope, $http){

//   $scope.callWordpress = function(wpdomain){

//         $('#pagePreLoader').show();
//         $scope.posts = [];
      
//         var wpapi = "http://public-api.wordpress.com/rest/v1/sites/";
//         var choice = "/posts";
//         var callbackString = '/?callback=JSON_CALLBACK';
//         var message = $http.jsonp(wpapi+wpdomain+choice+callbackString).
//         success(function(data, status) {
//                   //console.log(data);

//                   var numberOfPosts = data.posts.length;
//                   var i=0;
                
//                   for(i=0; i < numberOfPosts; i++){
//                       $scope.posts.push(data.posts[i]);
//                   }
//         }).
//         error(function(data, status) {
//               console.log(message);
//         });

//         setTimeout(
//           function(){ 
//             $('#pagePreLoader').hide();
//             $('#tab1-content').show();
//           }, 
//         5000);   
//   }; 
// }); 

// app.directive('userAvatar', function() {
//   return {
//     replace: true,
//     template : '<img class="user-avatar" height="60px" width="60px" border="0" alt="Null" src="{{post.author.avatar_URL}}"/>'
//   };
// });

// app.config(function($mdThemingProvider) {
//   var customBlueMap = $mdThemingProvider.extendPalette('grey', {
//     'contrastDefaultColor': 'light',
//     'contrastDarkColors': ['50'],
//     '50': 'ffffff'
//   });
//   $mdThemingProvider.definePalette('customBlue', customBlueMap);
//   $mdThemingProvider.theme('default')
//     .primaryPalette('customBlue', {
//       'default': '500',
//       'hue-1': '50'
//     })
//     .accentPalette('pink');
//   $mdThemingProvider.theme('input', 'default')
//         .primaryPalette('grey')
// });