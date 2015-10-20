
//var app = angular.module('emailApp', ['ngMaterial', 'ngMdIcons']);

routerApp.controller('emailCtrl', ['$scope','$rootScope', function( $scope, $rootScope){
  console.log("$rootScope");
  console.log($rootScope.a);

  
  
  $scope.generateSnapshot = function(){
    document.getElementById("canvasTest").appendChild($rootScope.a); 
  };
  
  //console.log($rootScope.b);
	$scope.sendMail = function(wpdomain){
	   
	};

  /*html2canvas($rootScope, {
            onrendered: function(canvas) {
                
                console.log("canvas emailCtrl");
                console.log(canvas);
                
            }
  });*/
  
}]); 

// app.config(function($mdThemingProvider) {
//   var customBlueMap = $mdThemingProvider.extendPalette('blue', {
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