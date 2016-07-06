routerApp.directive('postRender', [ '$timeout', function($timeout) {
  var def = {
    restrict : 'A', 
    terminal : true,
    transclude : true,
    link : function(scope, element, attrs) {
                $timeout(scope.redraw, 0);  //Calling a scoped method
              }
            };
            return def;
          }]);