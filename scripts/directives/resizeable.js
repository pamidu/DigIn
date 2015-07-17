routerApp.directive('resizeable', function() {
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {

            $(element).resizable({
                resize: function(event, ui) {

                  
                    if (widgetPlugin == "ElasticSearch") {    
                          var dataJ = JSON.parse(attrs.identifier);
                    var widgetId = dataJ.id;
                    var widgetPlugin = dataJ.uniqueType;

                        var index = $('#' + widgetId).data('highchartsChart');
                        var chart = Highcharts.charts[index];
                        height = ui.size.height - 100;
                        width = ui.size.width - 40;
                        chart.setSize(width, height, doAnimation = true);
                        jsPlumb.repaint(ui.helper);
                    }
                       if (widgetPlugin != "ElasticSearch") {    
                        
                        height = ui.size.height - 100;
                        width = ui.size.width - 40;
                        $(".widgetresize").css("height", height);
                         $(".widgetresize").css("width",  width);
                     
                    }
                },
                handles: "all"

            });
        }
    };
});
