
var data;
var dates;
var genres;
var mentions;
var imageObj;

var svg;
var tooltip;
var circles;
var circlePositions;

function drawCircles () {

  //another one http://bl.ocks.org/mbostock/b07f8ae91c5e9e45719c

  
    var maxRadius = 8, // maximum radius of circle
        padding = 1, // padding between circles; also minimum radius
        margin = {top: 100, right: 100, bottom: 100, left: 100},
        width = 900 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom;

    var k = 10, // initial number of candidates to consider per circle
        m = 20, // initial number of circles to add per frame
        n = data.length, // remaining number of circles to add
        newCircle = bestCircleGenerator(maxRadius, padding);

    svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    tooltip = d3.select("body").append("div").attr("class", "tooltip")


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

      // var sortedKeys = Object.keys(entityTypes).sort((a, b) => { return entityTypes[b] - entityTypes[a]})
      // sortedKeys.forEach((a) => { console.log(`${entityTypes[a]} \t ${a}` )})
      
      circlePositions = circlePositions.sort((a, b) => { 
        if(parseInt(a[1]) ===  parseInt(b[1])){
          return a[0] - b[0];
        }
        return a[1] - b[1];
      });

      data = data.sort((a, b) => { return parseInt(b.PageViews) - parseInt(a.PageViews) })
      
      var radiusScale = d3.scale.linear()
                          .domain([0, d3.max(pageViews)  ])
                          .range([5, 15])


      circles = svg.selectAll(".circle")
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
            console.log(d);

            var image = imageObj[d.URL];

            var imageHTML = "";

            if(typeof image !== "undefined" && image !== "undefined"){
              imageHTML = `<img src="http:${image}"/><br>`;
            }

            //d3.select(this).style("fill", "red")
            tooltip.transition()    
                .duration(200)    
                .style("opacity", .9);    
            tooltip.html(
                  `${imageHTML}${d.Name}`
                )  
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY) + "px");  

          }).
          on("mouseout", (d) => {

           // d3.select(this).style("fill", "rgba(0,0,0,0.6)")
            // tooltip.transition()   
            //     .duration(0)    
            //     .style("opacity", 0);  
          });

        circles.transition()
          .duration((d, i) => { return (i + 1) * 2 * Math.random()})
            .attr("cy", (d, i) => { return circlePositions[i][1]})
       

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


  // var svg = d3.select("svg"),
  //     size = +svg.attr("width");

  // var color = d3.scaleRainbow()
  //     .domain([0, 2 * Math.PI]);

  // var mostViewed = d3.max(data, (a) => { return parseInt(a.PageViews)});

  // var sizeScale = d3.scaleLog().domain([0, mostViewed]).range([3, 10])
  // var circles = data.map(function(point) { 
  //   point.r = Math.max(1, sizeScale(parseInt(point.PageViews)))
  //   return point;
  // });


  // svg
  //   .select("g")
  //   .selectAll("circle")
  //   .data(d3.packSiblings(circles) )
  //   .enter().append("circle")
  //     .style("fill", function(d) { return color(d.angle = Math.atan2(d.y, d.x)); })
  //     .attr("cx", function(d) { return Math.cos(d.angle) * (size / Math.SQRT2 + 30) })
  //     .attr("cy", function(d) { return Math.sin(d.angle) * (size / Math.SQRT2 + 30); })
  //     .attr("r", function(d) { return d.r - 0.25; })
  //   .transition()
  //     .ease(d3.easeCubicOut)
  //     .delay(function(d, i) { return i * 0.7; })
  //     .duration(500)
  //     .attr("cx", function(d, i) { 
  //       return (d.x * 3)
  //     })
  //     .attr("cy", function(d, i) { return d.y });

}
  
function resetCircles() {
  circles
    .transition()
    .duration((d, i) => { return i * Math.random() * 0.5 })
      .style("fill", "rgba(0,0,0,0.6)");
}
function redrawCircles () {
  //svg.transition();

  if($("#500-views").is(":checked")){
   // svg.selectAll(".circle")
   circles
    .transition() 
    .duration((d, i) => { return i * Math.random() })
      .style("fill", (d, i) => { 
        if(parseInt(d.PageViews) > 500){
          return "red"
        }
        return "rgba(0,0,0,0.2)"
      });
  } else {
     resetCircles();
  } 
}

$(document).ready(function(){

  $("#500-views").on("change", function() {
    redrawCircles();
  });
  async.series({
    getPageData: (cb) => {
      d3.tsv(`./../data/d3-data-obj.tsv`, function(error, pageData) {
        if (error) throw error;
        data = pageData;
        cb();
      });
    },
    getDatesData: (cb) => {
      d3.tsv(`./../data/d3-data-obj-dates.tsv`, function(error, datesData) {
        if (error) throw error;
        dates = datesData;

        var dateObj = {};
        dates.forEach((g) => { 
          var dateAttr = g.DateAttr.replace(/(.)+\:/, "").replace(/[\_|\-]+/g, " ").toLowerCase();
          if(typeof dateObj[dateAttr] === "undefined"){
           dateObj[dateAttr] = 0;
          }
          dateObj[dateAttr]++
        })

        var popularDates = Object.keys(dateObj).sort((a, b) => { return dateObj[b] - dateObj[a] });
        console.log(popularDates.length)
        console.log(popularDates)

        cb();
      });
    },
    getGenreData: (cb) => {
      d3.tsv(`./../data/d3-data-obj-genres.tsv`, function(error, genreData) {
        if (error) throw error;
        genres = genreData;

        var genreObj = {};
        genres.forEach((g) => { 
          var gen = g.Genre.replace(/(.)+\:/, "").replace(/[\_|\-]+/g, " ").toLowerCase();
          if(typeof genreObj[gen] === "undefined"){
           genreObj[gen] = 0;
          }
          genreObj[gen]++
        })

        var popularGenres = Object.keys(genreObj).sort((a, b) => { return genreObj[b] - genreObj[a] });
        console.log(popularGenres.length)
        console.log(popularGenres)
        cb();
      });
    },
    getMentionData: (cb) => {
      d3.tsv(`./../data/d3-data-obj-mentions.tsv`, function(error, mentionData) {
        if (error) throw error;
        mentions = mentionData;

        mentions = mentions.sort((a, b) => { 
          if(parseInt(a.sectionIndex) === parseInt(b.sectionIndex)){
            return parseInt(a.wordCountBeforeSection) - parseInt(b.wordCountBeforeSection);
          } 
          return parseInt(a.sectionIndex) - parseInt(b.sectionIndex)
        });
        
        cb();
      });
    },
    getImageData: (cb) => {
      d3.tsv(`./../data/d3-data-obj-image.tsv`, function(error, imageData) {
        if (error) throw error;
        
        imageObj = {};
        imageData.forEach((g) => { 
          imageObj[g["Page URL"]] = g["image URL"];
        })

        
        cb();
      });
    },
    done: () => {
      drawCircles();
    }
  })



});

