//author: sajeetharan
//date : 11/03/2015

routerApp.directive('linearChart', function() {
    return {
        restrict: 'EA',
        transclude: true,
        scope: {
            chartData: '='
        },
        controller: 'hierarchySummaryCtrl',
        link: function(scope, elem, attrs) {

            var svg;
            elem.bind("onmouseover", function(event) {

                scope.svg = svg;
                console.log("hierarchy svg", scope.svg);
                scope.$apply();
            });

            scope.$watch('chartData', function(newValue, oldValue) {
                if (newValue) {
                    scope.drawHierarchicalSummary(newValue.data,newValue.id);
                }
            });

            scope.drawHierarchicalSummary = function(rootData,divID) {
                var width = 400,
                    height = 320,
                    root;


                var force = d3.layout.force()
                    .linkDistance(80)
                    .charge(-120)
                    .gravity(.05)
                    .size([width, height])
                    .on("tick", tick);
                    
                var divid = "#" + divID;
                d3.select(divid).selectAll("*").remove();

                svg = d3.select(divid)
                    .append("svg").attr("viewBox", "0 0  490 490")
                    .attr("width", '100%')
                    .attr("height", '100%');

                var link = svg.selectAll(".link"),
                    node = svg.selectAll(".node");
                root = rootData;
                update();
                 startVis();
                console.log(svg);
                scope.setSvg(svg[0][0].innerHTML);

                function startVis() {
                    console.log('start');


                    //root = data;
                    var nodes = flatten(root);
                    nodes.forEach(function(d) {
                        d._children = d.children;
                        d.children = null;
                    });
                    update();
                }

               

                function update() {
                    console.log(nodes)  
                    var nodes = flatten(root),                    
                    links = d3.layout.tree().links(nodes);
                  
                    var nodes = flatten(rootData),                    
                    links = d3.layout.tree().links(nodes);
                     

                    console.log(links)
                     
                    force.nodes(nodes)
                        .links(links)
                        .start();

                    // Update links.
                    link = link.data(links, function(d) {
                        return d.target.id;
                    });

                    link.exit().remove();

                    link.enter().insert("line", ".node")
                        .attr("class", "link");

                    // Update nodes.
                    node = node.data(nodes, function(d) {
                        return d.id;
                    });

                    node.exit().remove();

                    var nodeEnter = node.enter().append("g")
                        .attr("class", "node")
                        .on("click", click)
                        .call(force.drag);

                    nodeEnter.append("circle")
                        .attr("r", function(d) {
                            return Math.sqrt(d.size) / 5 || 4.5;
                        });

                    nodeEnter.append("text")
                        .attr("dy", ".25em")
                        .text(function(d) {
                            return d.name + ", Count: " + d.size;
                        });

                    node.select("circle")
                        .style("fill", color);
                }

                function tick() {
                    link.attr("x1", function(d) {
                            return d.source.x;
                        })
                        .attr("y1", function(d) {
                            return d.source.y;
                        })
                        .attr("x2", function(d) {
                            return d.target.x;
                        })
                        .attr("y2", function(d) {
                            return d.target.y;
                        });

                    node.attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
                }

                function color(d) {
                    return d._children ? "#FFEB3B" // collapsed package
                        :
                        d.children ? "#F44336" // expanded package
                        :
                        "#D32F2F"; // leaf node
                }

                // Toggle children on click.
                function click(d) {
                    if (d3.event.defaultPrevented) return; // ignore drag
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;

                    }
                    update();
                }

                // Returns a list of all nodes under the root.
                function flatten(root) {
                    var nodes = [],
                        i = 0;

                    function recurse(node) {
                        if (node.children) node.children.forEach(recurse);
                        if (!node.id) node.id = ++i;
                        nodes.push(node);
                    }

                    recurse(root);
                    return nodes;
                }
            };

           


       

        }
    };
});

routerApp.directive('sunburstChart', function() {
    return {
        restrict: 'EA',
        transclude: true,
        scope: {
            chartData : '='
        },
        link: function(scope, elem, attrs) {

            scope.$watch('chartData', function(newValue, oldValue) {
                if (newValue){
                    scope.drawSunburstSummary(newValue.data,newValue.id,newValue.attribute,newValue.dec);
                }
            });

            scope.drawSunburstSummary = function(rootData,divID,attribute,decimal){
                var width = 300,
                        height = 290,
                        radius = Math.min(width, height) / 2;

                    var x = d3.scale.linear()
                        .range([0, 2 * Math.PI]);

                    var y = d3.scale.sqrt()
                        .range([0, radius]);

                    var color = d3.scale.category10();
                    
                    var divid = "#" + divID;
                    d3.select(divid).selectAll("*").remove();
                    
                    svg = d3.select(divid)
                        .append("svg").attr("viewBox", "0 0  300  300")
                        .attr("width", '100%')
                        .attr("height", '100%')
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ") rotate(-90 0 0)");
                    
                    var div = d3.select(divid).append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);

                    var partition = d3.layout.partition()
                        .value(function(d) {
                            return d.size;
                        });

                    var arc = d3.svg.arc()
                        .startAngle(function(d) {
                            return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
                        })
                        .endAngle(function(d) {
                            return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
                        })
                        .innerRadius(function(d) {
                            return Math.max(0, y(d.y));
                        })
                        .outerRadius(function(d) {
                            return Math.max(0, y(d.y + d.dy));
                        });

                    var g = svg.selectAll("g")
                        .data(partition.nodes(rootData))
                        .enter().append("g");

                    var path = g.append("path")
                        .attr("d", arc)
                        .style("fill", function(d) {
                            return color((d.children ? d : d.parent).name);
                        })
                        .style("stroke", function(d) {
                            var hex = color((d.children ? d : d.parent).name);
                            // validate hex string
                            hex = String(hex).replace(/[^0-9a-f]/gi, '');
                            if (hex.length < 6) {
                                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
                            }
                            lum = 0.8;
                            // convert to decimal and change luminosity
                            var rgb = "#", c, i;
                            for (i = 0; i < 3; i++) {
                                c = parseInt(hex.substr(i*2,2), 16);
                                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                                rgb += ("00"+c).substr(c.length);
                            }
                            return rgb;                            
                        })
                        .on("click", click)
                        /*The following two '.on' attributes for tooltip*/
                        .on("mouseover", function(d) {
                            div.transition()
                                .duration(200)
                                .style("opacity", .9);
                            var sizeStr = "";
                            if (typeof d.size != 'undefined') sizeStr = "<br/> <b>" + attribute + ":"  + d.size.toFixed(decimal) + "</b>";
                            div.html(d.name + sizeStr)
                                .style("left", 100 + "px")
                                .style("top", 300 + "px");

                        })
                        .on("mousemove", function(d) {
                            div.style("top", (d3.event.pageY)+"px")
                                .style("left", (d3.event.pageX)+"px");
                        })
                        .on("mouseout", function(d) {
                            div.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });
                    //.append("text")
                    var text = g.append("text")
                        .attr("x", function(d) {
                            return y(d.y);
                        })
                        .attr("dx", "6") // margin
                        .attr("dy", ".35em") // vertical-align
                        .attr("transform", function(d) {
                            return "rotate(" + computeTextRotation(d) + ")";
                        })
                        .text(function(d) {
                              return d.name;

                        })
                        .style("fill", function(d) {
                            var angle = computeArcSize(d);
                            if (angle < 0.1){
                                return "none";
                            }else {
                                return "#008080";
                            }
                        });

                    function computeTextRotation(d) {
                        var angle = x(d.x + d.dx / 2) - Math.PI / 2;
                        return angle / Math.PI * 180;
                    }

                    function computeArcSize(d) {
                        var startAngle = Math.max(0, Math.min(2 * Math.PI, x(d.x)));
                        var endAngle = Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));                            
                        var angle =  endAngle - startAngle;
                        return angle;                        
                    }

                    function click(d) {
                            // fade out all text elements
                            if (d.size !== undefined) {
                                d.size += 100;
                            };
                            text.transition().attr("opacity", 0);

                            path.transition()
                                .duration(750)
                                .attrTween("d", arcTween(d))
                                .each("end", function(e, i) {
                                    // check if the animated element's data e lies within the visible angle span given in d
                                    if (e.x >= d.x && e.x < (d.x + d.dx)) {
                                        // get a selection of the associated text element
                                        var arcText = d3.select(this.parentNode).select("text");
                                        // fade in the text element and recalculate positions
                                        arcText.transition().duration(750)
                                            .attr("opacity", 1)
                                            .attr("transform", function() {
                                                return "rotate(" + computeTextRotation(e) + ")"
                                            })
                                            .attr("x", function(d) {
                                                return y(d.y);
                                            })
                                            .style("fill",function(d){
                                                var angle = computeArcSize(d);
                                                if (angle < 0.06){
                                                    return "none";
                                                }else {
                                                    return "#008080";
                                                }                                                
                                            });
                                    }
                                });
                        } //});

                    // Word wrap!
                    var insertLinebreaks = function(t, d, width) {
                        alert(0)
                        var el = d3.select(t);
                        var p = d3.select(t.parentNode);
                        p.append("g")
                            .attr("x", function(d) {
                                return y(d.y);
                            })
                            //    .attr("dx", "6") // margin
                            //.attr("dy", ".35em") // vertical-align
                            .attr("transform", function(d) {
                                return "rotate(" + computeTextRotation(d) + ")";
                            })
                            //p
                            .append("foreignObject")
                            .attr('x', -width / 2)
                            .attr("width", width)
                            .attr("height", 200)
                            .append("xhtml:p")
                            .attr('style', 'word-wrap: break-word; text-align:center;')
                            .html(d.name);
                        alert(1)
                        el.remove();
                        alert(2)
                    };

                    function arcTween(d) {
                        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                            yd = d3.interpolate(y.domain(), [d.y, 1]),
                            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
                        return function(d, i) {
                            return i ? function(t) {
                                return arc(d);
                            } : function(t) {
                                x.domain(xd(t));
                                y.domain(yd(t)).range(yr(t));
                                return arc(d);
                            };
                        };
                    }
            };
            
            if(typeof scope.chartData != "undefined"){
                scope.drawSunburstSummary(scope.chartData.data, scope.chartData.id, scope.chartData.attribute, scope.chartData.dec);
            }
            


        }
    };
});