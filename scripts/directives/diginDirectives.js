routerApp.directive('getWidth', ['$timeout', '$location', function($timeout, $location) {
  return {
    scope: {
      callbackFn: "&"
    },
    link: function(scope, elem, attrs) {
      scope.callbackFn({width: elem[0].clientWidth,height: elem[0].clientHeight});
    }
  }
}]);
