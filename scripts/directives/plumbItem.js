  routerApp.directive('plumbItem', function() {
    return {
      restrict: 'A',       
      link: function (scope, element, attrs) {
        //console.log("Add plumbing for the 'item' element");

        jsPlumb.makeTarget(element, {
          endpoint:"Blank",
          anchor:[ "Perimeter", { shape:"Square", anchorCount:8 }],
          connectorOverlays:[ 
          [ "Arrow", { width:30, length:30, location:1, id:"arrow" } ]
          ]
        });
        jsPlumb.draggable(element, {            
          containment: 'parent',
          stop: function (evt, ui) {
             var pos = $(this).offset();
             scope.widget.top = element.position().top+'px';
             scope.widget.left = element.position().left+'px';
            }
        });

      }
    };
  });
