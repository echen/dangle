/* 
 * xdata: array of x-coordinates
 * ydata: array of y-coordinates
 * xlab, ylab: labels for the axes
 * tangleUpdater: a function called when a new point is selected,
 *   in order to update the Tangle side of things, 
 */
function makeScatterplot(xdata, ydata, xlab, ylab, tangleUpdater) {
  
	var data = d3.range(xdata.length).map(function(i) {
	  return [xdata[i], ydata[i]];
	});

	var w             = 200,
	    h             = 200,
	    leftPadding   = 50,   // space for y-axis labels
	    rightPadding  = 10,    // space at right (so the rightmost tick mark isn't cut off)
	    bottomPadding = 30,   // space for x-axis labels
	    topPadding    = 5,    // space at top (so the topmost tick mark isn't cut off)	    
	    x = d3.scale.linear().domain([d3.min(xdata), d3.max(xdata)]).range([0, w]),
	    y = d3.scale.linear().domain([d3.min(ydata), d3.max(ydata)]).range([h, 0]);
	    
	var gridlineOpacity       = 0.7,
	    pointRadius           = 1,
	    selectedPointRadius   = 5;

	var vis = 
	  d3.select("body")
	    .append("svg")
	      .attr("width", w + leftPadding + rightPadding)
	      .attr("height", h + topPadding + bottomPadding)
	    .append("g")
	      .attr("transform", "translate(" + leftPadding + "," + topPadding + ")");

  /*
   * x-axis stuff
   */
	var xrule = 
	  vis
	    .selectAll("g.x")
	    .data(x.ticks(10))
	    .enter()
	    .append("g")
	      .attr("class", "x");
	      
	// Add vertical gridlines.
	xrule.append("line")
	    .attr("x1", x)
	    .attr("x2", x)
	    .attr("y1", 0)
	    .attr("y2", h)
	    .attr("opacity", gridlineOpacity);
  
	// Add x-axis tick labels.	
	xrule.append("text")
	    .attr("x", x)
	    .attr("y", h + 3)
	    .attr("dy", ".71em")
	    .attr("text-anchor", "middle")
	    .text(x.tickFormat(10));
	    
	// Add x-axis label.
	vis.append("text")
	  .attr("class", "axislabel")
	  .attr("x", w * 0.5)
	  .attr("y", h + 22)
	  .attr("text-anchor", "middle")
	  .text(xlab);
	  
  /*
	 * y-axis stuff
	 */
	var yrule = 
	  vis
	    .selectAll("g.y")
	    .data(y.ticks(10))
	    .enter()
	    .append("g")
	    .attr("class", "y");

  // Add horizontal lines.
	yrule.append("line")
	    .attr("x1", 0)
	    .attr("x2", w)
	    .attr("y1", y)
	    .attr("y2", y)
	    .attr("opacity", gridlineOpacity);

  // Add y-axis tick labels.
	yrule.append("text")
	    .attr("x", -3)
	    .attr("y", y)
	    .attr("dy", ".35em")
	    .attr("text-anchor", "end")
	    .text(y.tickFormat(10));
	    
	// Add y-axis label.
	vis.append("text")
	  .attr("class", "axislabel")
    .attr("transform", "rotate(-90)")	
    .attr("x", -h / 2)
	  .attr("y", -30)
	  .attr("text-anchor", "middle")
	  .text(ylab)

  /*
   * Make bounding box.
   */
  vis.append("line")
    .attr("class", "boundingbox")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", h);

  vis.append("line")
    .attr("class", "boundingbox")
    .attr("x1", 0)
    .attr("x2", w)
    .attr("y1", h)
    .attr("y2", h);    
  
  /*  
	vis.append("rect")
	    .attr("width", w)
	    .attr("height", h)
	    .attr("opacity", 0.3);
	*/

  /*
   * Add datapoints.
   */
	var circles =
	  vis
	    .selectAll("circle")
	    .data(data)
	    .enter()
	    .append("circle")
	    .attr("class", "dot")
	    .attr("index", function(d, i) { return i; })	    
	    .attr("cx", function(d) { return x(d[0]); })
	    .attr("cy", function(d) { return y(d[1]); })
	    .attr("r", pointRadius);

  /*
   * Clip so that only mouseovers within the graph grid
   * (e.g., not mouseovers on the x-axis label or whatever)
   * fire off an event to update the point being selected.
   */
  var clipbox = 
    vis      
      .append("clipPath")
        .attr("id", "clipbox")
      .append("rect")
        .attr("width", w)
        .attr("height", h);
            
  /*
   * Add a way to select a point even if not directly mousing over it.
   *
   * Not sure if this is the best way, but right now I draw a thin rectangle around each
   * point, and if you mouseover the rectangle, the associated point is selected.
   * Note that this assumes no two points have the same x-value but different y-values
   * (i.e., we're plotting functions).
   * 
   * TODO: Maybe use a Voronoi layout instead?
   */
  vis
    .selectAll("path")
    .data(data)
    .enter()
    .append("svg:path")
    // Make a rectangle around each point.
    .attr("d", function(d, i) { 
      var verts = [[x(d[0]) - 1, y(0)],[x(d[0]) + 1, y(0)],[x(d[0]) + 1,y(h)],[x(d[0]) - 1,y(h)]];
      if (verts.length > 0) {
        return "M" + verts.join(",") + "Z";
      } else {
        return "M 0 0 Z";
      }      
    })
    .attr("clip-path", "url(#clipbox)")
    // Don't show the rectangle!
    .attr('fill-opacity', 0)
    // When mousing over the rectangle, select the associated point.
    .on("mouseover", function(d, i) {      
      // Unselect previous points.
      // TODO: It's probably better to use the mouseout event to do
      // this instead, but I'm not sure how to make the point persist
      // if you move outside the box...
      d3.selectAll("circle").attr("r", pointRadius);
      
      // Select the current point.
      d3.selectAll("circle[index='" + i + "']")
        .attr("r", selectedPointRadius)
        
      // New point has been selected! Update Tangle as well.
      tangleUpdater(i);
    })
    /*.on("mouseout", function(d, i) {
      d3.selectAll("circle[index='" + i + "']")
        .attr("r", pointRadius);
    });*/
}
