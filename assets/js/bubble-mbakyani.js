d3.csv("new33.csv", function(data){
    console.log(data)});
		
	d3.csv('new33.csv', function (data) {
	  // Variables
	  var body = d3.select('#my_dataviz2')
		var margin = { top: 50, right: 50, bottom: 50, left: 50 }
		var h = 500 - margin.top - margin.bottom
		var w = 500 - margin.left - margin.right
		// Scales
	  var colorScale = d3.scale.ordinal()
						.domain([function (d) { return d.General }])
						.range(["Black","Purple","Purple","Purple","Green","Yellow","Purple","Blue","Blue","Green","Grey","Blue","Yellow","Yellow","Purple","Purple",
						"Green","Blue","Orange","Red","Green","Blue","Purple","Purple","Purple","Purple","Grey","Blue","Yellow","Blue","Grey","Grey","Blue",
						"Grey"])
	  var xScale = d3.scale.linear()
		.domain([
			5,
			50
			])
		.range([0,w])
	  var yScale = d3.scale.linear()
		.domain([
			3.9,
			d3.max([0,d3.max(data,function (d) { return d.Rating })])
			])
		.range([h,0])
		// SVG
		var svg = body.append('svg')
			.attr('height',h + margin.top + margin.bottom)
			.attr('width',w + margin.left + margin.right)
		  .append('g')
			.attr('transform','translate(' + margin.left + ',' + margin.top + ')')
		// X-axis
		var xAxis = d3.svg.axis()
		  .scale(xScale)
		  //.ticks(5)
		  .orient('bottom')
	  // Y-axis
		var yAxis = d3.svg.axis()
		  .scale(yScale)
		  .ticks(5)
		  .orient('left')
		  
		
		
	  // Circles
	  var circles = svg.selectAll('circle')
		  .data(data)
		  .enter()
		.append('circle')
		  .attr('cx',function (d) { return xScale(d.Size) })
		  .attr('cy',function (d) { return yScale(d.Rating) })
		  .attr('r',function(d){return Math.sqrt(Math.sqrt(d.Install/500))})
		  .attr('stroke','black')
		  .attr('stroke-width',1)
		  .attr('fill',function (d,i) { return colorScale(i) })
		  .on('mouseover', function () {
			d3.select(this)
			  .transition()
			  .duration(500)
			  .attr('r',function(d){return 2*Math.sqrt(Math.sqrt(d.Install/500))})
			  .attr('stroke-width',3)
		  })
		  .on('mouseout', function () {
			d3.select(this)
			  .transition()
			  .duration(500)
			  .attr('r',function(d){return Math.sqrt(Math.sqrt(d.Install/500))})
			  .attr('stroke-width',1)
		  })
		.append('title') // Tooltip
		  .text(function (d) { return d.Category +
							   '\nSize App  : ' + d.Size +
							   '\nRating    : ' + d.Rating+
							   '\nDownloaded: ' + d.Install})
							   
							   
	  // X-axis
	  svg.append('g')
		  .attr('class','axis')
		  .attr('transform', 'translate(0,' + h + ')')
		  .call(xAxis)
		.append('text') // X-axis Label
		  .attr('class','label')
		  .attr('y',25)
		  .attr('x',w+5)
		  .attr('dy','.71em')
		  .style('text-anchor','end')
		  .text('Size App (in Mb)')
	  // Y-axis
	  svg.append('g')
		  .attr('class', 'axis')
		  //.attr('transform','translate(50,0)')
		  .call(yAxis)
		.append('text') // y-axis Label
		  .attr('class','label')
		  .attr('transform','rotate(-90)')
		  .attr('x',0)
		  .attr('y',-35)
		  .attr('dy','.71em')
		  .style('text-anchor','end')
		  .text('Rating App')
	})