routerApp.directive('getWidth', ['$timeout', '$location', function($timeout, $location) {
    return {
        scope: {
            callbackFn: "&"
        },
        link: function(scope, elem, attrs) {
            scope.callbackFn({
                width: elem[0].clientWidth,
                height: elem[0].clientHeight
            });
        }
    }
}]);


//ng enter directive
routerApp.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter, {
                        'event': event
                    });
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
            words: '=',
            width: '=',
            height: '=',
        },
        template: '<div id="wordCanvas" style="height:100%;width:100%;"></div>',
        link: function(scope, element) {
            scope.wordCloudInit = function() {
                var fill = d3.scale.category20();
                var canvasWidth = 800;
                var canvasHeight = 320;
                //         alert('width:'+canvasWidth+' height:'+canvasHeight); 
                d3.layout.cloud().size([canvasWidth, canvasHeight])
                    .words(scope.words.map(function(d) {
                        console.log(d.name);
                        return {
                            text: d.name,
                            size: d.val + 20
                        };
                    }))
                    .rotate(function() {
                        return ~~(Math.random() * 2) * 90;
                    })
                    .font("Impact")
                    .text(function(d) {
                        return d.text;
                    })
                    .fontSize(function(d) {
                        return d.size;
                    })
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
                    var svg = document.getElementById("wordCanvas");
                    if (svg.childNodes.length == 0) {

                        d3.select("#wordCanvas").append("svg")
                            .attr("width", canvasWidth)
                            .attr("height", canvasHeight)
                            .append("g")
                            .attr("transform", "translate(505,120)")
                            .selectAll("text")
                            .data(words)
                            .enter().append("text")
                            .style("font-size", function(d) {
                                return d.size + "px";
                            })
                            .style("font-family", "Impact")
                            .style("fill", function(d, i) {
                                return fill(i);
                            })
                            //.style("margin", function(d) {return d.size + "px"})
                            .attr("text-anchor", "middle")
                            .attr("transform", function(d) {
                                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                            })
                            .text(function(d) {
                                //console.log(d.text);
                                return d.text;
                            });
                    }

                }
            };

            scope.$on('getWordCloudData', function(event, data) {
                //console.log('word cloud data:' + JSON.stringify(data.wordData));
                scope.words = data.wordData;
                scope.wordCloudInit();
            });
        }
    }
});


//pivot summary
routerApp.directive('pivotSummary', function() {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            summary: '=',
            fields: '='
        },
        template: '<div id="grid" style="height:100%; overflow:scroll"></div>',
        link: function(scope, element) {
            scope.selectedFields = scope.summary;

            scope.$watch('summary', function(newValue, oldValue) {
                if (newValue) {
                    scope.drawSummary(newValue);
                }
            });

            scope.drawSummary = function(summaryData) {
                scope.selectedFields = summaryData;
                scope.products = [];
                product = {};
                for (var i = 0; i < scope.selectedFields.length; i++) {
                    var data = scope.selectedFields[i],
                        product = {};
                    for (var j = 0; j < scope.fields.length; j++) {
                        var field = scope.fields[j];
                        product[field] = data[field];
                    }
                    scope.products.push(product);
                }

                var renderers = $.extend($.pivotUtilities.renderers, $.pivotUtilities.gchart_renderers, $.pivotUtilities.d3_renderers);
                $("#grid").pivotUI(scope.products, {
                    // renderers: renderers,
                    rows: [scope.selectedFields[0]],
                    cols: [scope.selectedFields[1]],

                    // rendererName: "Table"         
                });
            }

            if (typeof scope.selectedFields != "undefined")
                scope.drawSummary(scope.selectedFields);

            scope.$on('getPivotSummaryData', function(event, data) {
                console.log('word cloud data:' + JSON.stringify(data.wordData));
                scope.selectedFields = data.sumData;
                scope.fields = data.fields;
                scope.drawSummary();
            });
        }
    }
});


routerApp.service('layoutManager',['$mdToast','$mdDialog', function($mdToast,$mdDialog){
	
	this.hideHeader = function() {
		console.log("hide header");
		$('.main-headbar-slide').animate({
			top: '-45px'
		}, 200);
		
		$('.dropdown').animate({
			top: '-45px'
		},200)
		
		$('.card-container').animate({
			paddingTop: '30px'
		},200)
		
		/*$('md-tabs-content-wrapper').animate({
			height: '100vh'
		},200)*/
		
		return false;
	}
	this.showHeader = function(){
		$('.main-headbar-slide').animate({
			top: '0px'
		}, 200);
		
		$('.dropdown').animate({
			top: '15px'
		},200)
		
		$('.card-container').animate({
			paddingTop: '70px'
		},200)
		
		var newHeight = $('md-tabs-content-wrapper').height(); //- 45;
		
		$('md-tabs-content-wrapper').animate({
			height: newHeight
		},200)
		return true;
	}
	
	this.hideSideMenu = function(){
		$('.left-menu-slide').animate({
			left: '-45px'
		}, 200);
		$('.card-container').animate({
			paddingLeft: '0px'
		},200)
		return false;
	}
	this.showSideMenu = function(){
		$('.left-menu-slide').animate({
			left: '0px'
		}, 200);
		$('.card-container').animate({
			paddingLeft: '45px'
		},200)
		return true;
	}
}])