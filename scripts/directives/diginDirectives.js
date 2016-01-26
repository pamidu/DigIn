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

//word cloud
routerApp.directive('diginWordCloud', function() {

   return {
      restrict: 'E',
      transclude: true,
      scope: {
         words:'=',
         width:'=',
         height:'=',
      },
      template: '<div id="wordCanvas" style="height:100%;width:100%;"></div>',
      link: function(scope, element) {
         
       scope.wordCloudInit = function (){
         var fill = d3.scale.category20();
         var canvasWidth = 1127;
         var canvasHeight = 110;
//         alert('width:'+canvasWidth+' height:'+canvasHeight); 
  d3.layout.cloud().size([canvasWidth, canvasHeight])
      .words(scope.words.map(function(d) {
        return {text: d.name, size: d.val+30};
      }))
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .text(function(d) { return d.text; })
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();

  function draw(words) {
    var aspect = canvasWidth / canvasHeight,
    chart = d3.select('#wordCanvas');
d3.select(window)
  .on("resize", function() {
    var targetWidth = chart.node().getBoundingClientRect().width;
    chart.attr("width", targetWidth);
    chart.attr("height", targetWidth / aspect);
  }); 
     
    d3.select("#wordCanvas").append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)
      .append("g")
        .attr("transform", "translate(550,60)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        //.style("margin", function(d) {return d.size + "px"})
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }
      };
         
         
         
         scope.$on('getWordCloudData',function(event, data){
            console.log('word cloud data:'+JSON.stringify(data.wordData));            
            scope.words = data.wordData;
            scope.wordCloudInit();
         });   
         
         
      }
  }
});
