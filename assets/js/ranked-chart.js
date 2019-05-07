(function(){

    var margin = {top: 50, bottom: 0, left:250, right: 40};
    var width = 900 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var xScale = d3.scale.linear().range([0, width]);
    var yScale = d3.scale.ordinal().rangeRoundBands([0, height], 0.2,0);

    var numTicks = 6;
    var xAxis = d3.svg.axis().scale(xScale)
                    .orient("top")
                    .tickSize((-height))
                    .ticks(numTicks);

    var svg = d3.select("body").append("svg")
                .attr("width", width+margin.left+margin.right)
                .attr("height", height+margin.top+margin.bottom)
                .attr("class", "base-svg");

    var barSvg = svg.append("g")
                .attr("transform", "translate("+margin.left+","+margin.top+")")
                .attr("class", "bar-svg");

    var x = barSvg.append("g")
            .attr("class", "x-axis");

    var url = "csvjson.json";

    d3.json(url, function(data) {

        var xMax = d3.max(data, function(d) { return d.Freq; } );
        var xMin = 0;
        xScale.domain([xMin, xMax]);
        yScale.domain(data.map(function(d) { return d.Category; }));

        d3.select(".base-svg").append("text")
            .attr("x", margin.left)
            .attr("y", (margin.top)/2)
            .attr("text-anchor", "start")
            .text("Kategori App Google Playstore yang Paling Banyak di Unggah Pada Tahun 2018")
            .attr("class", "title");

        var groups = barSvg.append("g").attr("class", "labels")
                    .selectAll("text")
                    .data(data)
                    .enter()
                    .append("g");

        groups.append("text")
                .attr("x", "0")
                .attr("y", function(d) { return yScale(d.Category); })
                .text(function(d) { return d.Category; })
                .attr("text-anchor", "end")
                .attr("dy", "0.9em")
                .attr("dx", "-.32em")
                .attr("font-size","10px")
                .attr("id", function(d,i) { return "label"+i; });

        var bars = groups
                    .attr("class", "bars")
                    .append("rect")
                    .attr("width", function(d) { return xScale(d.Freq); })
                    .attr("height", height/50)
                    .attr("x", xScale(xMin))
                    .attr("y", function(d) { return yScale(d.Category); })
                    .attr("id", function(d,i) { return "bar"+i; });

        groups.append("text")
                .attr("x", function(d) { return xScale(d.Freq); })
                .attr("y", function(d) { return yScale(d.Category); })
                .text(function(d) { return d.Freq; })
                .attr("text-anchor", "end")
                .attr("dy", "0.9em")
                .attr("dx", "-.32em")
                .attr("id", "precise-value");

        bars
            .on("mouseover", function() {
                var currentGroup = d3.select(this.parentNode);
                currentGroup.select("rect").style("fill", "brown");
                currentGroup.select("text").style("font-weight", "bold");
            })
            .on("mouseout", function() {
                var currentGroup = d3.select(this.parentNode);
                currentGroup.select("rect").style("fill", "steelblue");
                currentGroup.select("text").style("font-weight", "normal");
            });

        x.call(xAxis);
        var grid = xScale.ticks(numTicks);
        barSvg.append("g").attr("class", "grid")
            .selectAll("line")
            .data(grid, function(d) { return d; })
            .enter().append("line")
                .attr("y1", 0)
                .attr("y2", height+margin.bottom)
                .attr("x1", function(d) { return xScale(d); })
                .attr("x2", function(d) { return xScale(d); })
                .attr("stroke", "white");

        //svg.selectAll("rect")
            //.transition()
            //.duration(2000)
            //.attr("x", function(d) { return xScale(d.Freq); })
    });

})();
