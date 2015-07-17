var root = {
  "name": "flare",
  "children": [
      {
       "name": "Juniper Networks",
       "children": [
        {"name": "Juniper Networks", "size": 159990}
       ]
      },
      {
       "name": "LinkedIn",
       "children": [
        {"name": "LinkedIn", "size": 136427}
       ]
      },
      {
       "name": "YAHOO!",
       "children": [
        {"name": "YAHOO!", "size": 130312}
       ]
      },
      {
       "name": "Google",
       "children": [
        {"name": "Google", "size": 127143}
       ]
      },
      {
       "name": "Twitter",
       "children": [
        {"name": "Twitter", "size": 124863}
       ]
      },
      {
       "name": "Apple",
       "children": [
        {"name": "Apple", "size": 124630}
       ]
      },
      {
       "name": "Oracle",
       "children": [
        {"name": "Oracle", "size": 122905}
       ]
      },
      {
       "name": "Walmart",
       "children": [
        {"name": "Walmart", "size": 122110}
       ]
      },
      {
       "name": "Facebook",
       "children": [
        {"name": "Facebook", "size": 121507}
       ]
      },
      {
       "name": "Integral",
       "children": [
        {"name": "Integral", "size": 117927}
       ]
      },
      {
       "name": "ARISTA",
       "children": [
        {"name": "ARISTA", "size": 116067}
       ]
      },
      {
       "name": "NVIDIA",
       "children": [
        {"name": "NVIDIA", "size": 115649}
       ]
      },
      {
       "name": "ebay",
       "children": [
        {"name": "ebay", "size": 114720}
       ]
      },
      {
       "name": "Amazon",
       "children": [
        {"name": "Amazon", "size": 110907}
       ]
      },
      {
       "name": "HP",
       "children": [
        {"name": "HP", "size": 110506}
       ]
      },
      {
       "name": "Brocade",
       "children": [
        {"name": "Brocade", "size": 110069}
       ]
      },
      {
       "name": "Cisco",
       "children": [
        {"name": "Cisco", "size": 109491}
       ]
      },
      {
       "name": "Microsoft",
       "children": [
        {"name": "Microsoft", "size": 108611}
       ]
      },
      {
       "name": "Intel",
       "children": [
        {"name": "Intel", "size": 108210}
       ]
      },
      {
       "name": "INTUIT",
       "children": [
        {"name": "INTUIT", "size": 104440}
       ]
      },
      {
       "name": "Expedia",
       "children": [
        {"name": "Expedia", "size": 105126}
       ]
      },
      {
       "name": "ERICSSON",
       "children": [
        {"name": "ERICSSON", "size": 102610}
       ]
      },
      {
       "name": "FACTSET",
       "children": [
        {"name": "FACTSET", "size": 102486}
       ]
      },
      {
       "name": "BROADCOM",
       "children": [
        {"name": "BROADCOM", "size": 101808}
       ]
      },
      {
       "name": "QUALCOMM",
       "children": [
        {"name": "QUALCOMM", "size": 101094}
       ]
      },
    ]
};

var diameter = 600,
    format = d3.format(",d"),
    color = d3.scale.category20();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("#canvas-svg").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

var node = svg.selectAll(".node")
  .data(bubble.nodes(classes(root))
  .filter(function(d) { return !d.children; }))
.enter().append("g")
  .attr("class", "node")
  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

node.append("circle")
  .attr("r", function(d) { return d.r; })
  .style("fill", function(d) { return color(d.packageName); });

node.append("text")
  .attr("dy", "0em")
  .style("text-anchor", "middle")
  .text(function(d) { return d.className.substring(0, d.r / 3); });

node.append("text")
  .attr("dy", "1.3em")
  .style("font-size", "12px")
  .style("text-anchor", "middle")
  .text(function(d) { return "$" + format(d.value).substring(0, d.r / 3); });

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");