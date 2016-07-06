routerApp.directive('resizeable', function() {
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {
              var dataJ = JSON.parse(attrs.identifier);
           var widgetPlugin = dataJ.uniqueType;
   var widgetId = dataJ.id;
            $(element).resizable({
                resize: function(event, ui) {

                  
                    if (widgetPlugin == "ElasticSearch") {    
                        
                     
                   
                        var index = $('#' + widgetId).data('highchartsChart');
                        var chart = Highcharts.charts[index];
                        height = ui.size.height - 100;
                        width = ui.size.width - 40;
                        chart.setSize(width, height, doAnimation = true);
                        jsPlumb.repaint(ui.helper);
                    }


                       if (widgetPlugin != "ElasticSearch") {    
                       
                        height = ui.size.height;
                        width = ui.size.width;
                       
                     
                    }
                },
                handles: "all"

            });
        }
    };
});
