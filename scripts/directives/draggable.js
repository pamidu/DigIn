routerApp.directive('draggable', function() {
  return {
        // A = attribute, E = Element, C = Class and M = HTML Comment
        restrict:'A',
        //The link function is responsible for registering DOM listeners as well as updating the DOM.
        link: function(scope, element, attrs) {

          console.log("Let draggable item snap back to previous position");
          element.draggable({

                 stop:function(event,ui) {
                          console.log("Check if its printing")
                          event.stopPropagation();
                                },

                            // let it go back to its original position

                revert:true
              });
            }
         };
     });