  routerApp.directive('plumbItem', function() {
    return {
      replace: true,
      controller: 'mainController',
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
           stop:function(event,ui) {
                          //console.log("Check if its printing")
                          event.stopPropagation();
                                },
          containment: 'parent'


        });
      }
    };
  });
