
var data;



$(document).ready(function(){
  d3.tsv(`./../data/d3-data-obj.tsv`, function(error, pageData) {
    if (error) throw error;
    data = pageData;

    var maxRadius = 10, // maximum radius of circle
        padding = 2, // padding between circles; also minimum radius
        margin = {top: 100, right: 100, bottom: 100, left: 100},
        width = 900 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom;

    var k = 10, // initial number of candidates to consider per circle
        m = 20, // initial number of circles to add per frame
        n = data.length, // remaining number of circles to add
        newCircle = bestCircleGenerator(maxRadius, padding);

    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var circlePositions = [];
    var pageViews = [];
    var entityTypes = {};

    async.forEach(data, (page, cb) => {

      var circle = newCircle(k);
      circlePositions.push(circle);
      
      pageViews.push(parseInt(page.PageViews));
      if(typeof entityTypes[page.EntityType.toUpperCase()] === "undefined"){
        entityTypes[page.EntityType.toUpperCase()] = 0;
      }
      entityTypes[page.EntityType.toUpperCase()]++;
      async.setImmediate(() => { cb(); });

    }, () => {

      var sortedKeys = Object.keys(entityTypes).sort((a, b) => { return entityTypes[b] - entityTypes[a]})
      sortedKeys.forEach((a) => { console.log(`${entityTypes[a]} \t ${a}` )})
      console.log(entityTypes)
      circlePositions = circlePositions.sort((a, b) => { 
        if(parseInt(a[1]) ===  parseInt(b[1])){
          return a[0] - b[0];
        }
        return a[1] - b[1];
      });

      data = data.sort((a, b) => { return parseInt(b.PageViews) - parseInt(a.PageViews) })
      
      var radiusScale = d3.scale.linear()
                          .domain([0, d3.max(pageViews)  ])
                          .range([1, 15])


      svg.selectAll(".circle")
        .data(data)
         .enter()
          .append("circle")
            .attr("cy", (d, i) => { return circlePositions[i][1] + 100})
            .attr("cx", (d, i) => { return circlePositions[i][0]})
            .attr("r", (d, i) => { 
             
              return radiusScale(parseInt(d.PageViews)); 
            })
            .style("fill", "rgba(0,0,0,0.6)")
          .on("mouseover", (d) => {
            console.log(d)
          })
        .transition()
          .duration((d, i) => { return (i + 1) * 0.9})
            .attr("cy", (d, i) => { return circlePositions[i][1]});

    })


   


    
    function bestCircleGenerator(maxRadius, padding) {
      var quadtree = d3.geom.quadtree().extent([[0, 0], [width, height]])([]),
          searchRadius = maxRadius * 2,
          maxRadius2 = maxRadius * maxRadius;

      return function(k) {
        var bestX, bestY, bestDistance = 0;

        for (var i = 0; i < k || bestDistance < padding; ++i) {
          var x = Math.random() * width,
              y = Math.random() * height,
              rx1 = x - searchRadius,
              rx2 = x + searchRadius,
              ry1 = y - searchRadius,
              ry2 = y + searchRadius,
              minDistance = maxRadius; // minimum distance for this candidate

          quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (p = quad.point) {
              var p,
                  dx = x - p[0],
                  dy = y - p[1],
                  d2 = dx * dx + dy * dy,
                  r2 = p[2] * p[2];
              if (d2 < r2) return minDistance = 0, true; // within a circle
              var d = Math.sqrt(d2) - p[2];
              if (d < minDistance) minDistance = d;
            }
            return !minDistance || x1 > rx2 || x2 < rx1 || y1 > ry2 || y2 < ry1; // or outside search radius
          });

          if (minDistance > bestDistance) bestX = x, bestY = y, bestDistance = minDistance;
        }

        var best = [bestX, bestY, bestDistance - padding];
        quadtree.add(best);
        return best;
      };
    }



  }) 
});

