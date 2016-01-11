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


//ng enter directive
routerApp.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    });
