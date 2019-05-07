// set the dimensions and margins of the graph
var width = 570
height = 450
margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'  

// Create dummy data

var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width)
.attr("height", height)
.append("g");

svg.append("g")
.attr("class", "slices");
svg.append("g")
.attr("class", "labels");
svg.append("g")
.attr("class", "lines");	

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


var data1 = {Knowledge:935,Economy:1377,Hobby:1929,Social:2097,Games:1144,Family:1972,Others:1386};

// set the color scale

var color1 = d3.scaleOrdinal()
.domain(["Knowledge", "Econnomy", "Hobby", "Social", "Games", "Family", "Others"])
.range(d3.schemeDark2);


var arc = d3.arc()
.innerRadius(radius * 0.4)         // This is the size of the donut hole
.outerRadius(radius * 0.8)

// Another arc that won't be drawn. Just for labels positionning
var outerArc = d3.arc()
.innerRadius(radius * 0.9)
.outerRadius(radius * 0.9)


change(data1,color1);

function change(data,color){
                // Compute the position of each group on the pie:
var pie = d3.pie()
  .sort(null) // Do not sort group by size
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data))

// The arc generator

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.


var slice = svg.select(".slices").selectAll("path.slice")
        .data(data_ready);
slice.enter()
.insert("path")
.style("fill", function(d) { return color(d.data.key); })
.attr("class", "slice");


slice
.transition().duration(1000)
.attrTween("d", function(d) {
    this._current = this._current || d;
    var interpolate = d3.interpolate(this._current, d);
    this._current = interpolate(0);
    return function(t) {
        return arc(interpolate(t));
    };
})


slice.exit()
.remove();

// Add the polylines between chart and labels:

var text = svg.select(".labels").selectAll("text")
.data(data_ready);

text.enter()
.append("text")
.attr("dy", ".35em")
.text(function(d) {
    return d.data.label;
});

function midAngle(d){
return d.startAngle + (d.endAngle - d.startAngle)/2;
}

text.transition().duration(1000)
.attrTween("transform", function(d) {
    this._current = this._current || d;
    var interpolate = d3.interpolate(this._current, d);
    this._current = interpolate(0);
    return function(t) {
        var d2 = interpolate(t);
        var pos = outerArc.centroid(d2);
        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
        return "translate("+ pos +")";
    };
})
.styleTween("text-anchor", function(d){
    this._current = this._current || d;
    var interpolate = d3.interpolate(this._current, d);
    this._current = interpolate(0);
    return function(t) {
        var d2 = interpolate(t);
        return midAngle(d2) < Math.PI ? "start":"end";
    };
});

text.exit()
.remove();	

var polyline=svg
  .selectAll('allPolylines')
  .data(data_ready)
  .enter();
  
polyline.exit().remove();  
  
polyline  
  .append('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function(d) {
      var posA = arc.centroid(d) // line insertion in the slice
      var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    });
    
polyline.exit().remove();	
    
    

<!-- // Add the polylines between chart and labels: -->
svg
  .selectAll('allLabels')
  .data(data_ready)
  .enter()
  .append('text')
    .text( function(d) { console.log(d.data.key) ; return (d.data.key + ":" + d.data.value )} )
    .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
    })
    .style('text-anchor', function(d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    })
    
    

}

change(data1,color1);