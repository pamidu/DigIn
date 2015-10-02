routerApp.directive('resizable', function () {

    return {
        restrict: 'A',
        scope: {
            callback: '&onResize',
            widget:'='
        },
        link: function postLink(scope, elem, attrs) {
            elem.resizable({
                minHeight: 300,
                minWidth: 320
            });
            elem.on('resize', function (evt, ui) {
              var pos = {top:elem.position().top, left:elem.position().left};  
              scope.$apply(function() {
                if (scope.callback) {  
                  scope.callback({$evt: evt, $ui: ui, $pos: pos}); 
                }                
              })
            });
        }
    };
  });