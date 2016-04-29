
var data;
var dates;
var genres;
var mentions;
var imageObj;
var entityTypeObj = {};
var mentionsObj = {};
var mentionSectionObj = {};

var rectHeight = 25;
var rectWidth = 25;
var numRectPerRow = 30;
var rectPadding = 0;

var svg;
var tooltip;
var nodeContainer;
var circles;
var circlePositions;
var nodeColor = "#22313F";

var imageColors = []; 

function drawCircles () {

  //another one http://bl.ocks.org/mbostock/b07f8ae91c5e9e45719c

  
    var maxRadius = 10, // maximum radius of circle
        padding = 1.5, // padding between circles; also minimum radius
        margin = {top: 10, right: 10, bottom: 100, left: 10},
        width = 1000 - margin.left - margin.right,
        height = 5000 - margin.top - margin.bottom;

    var k = 10, // initial number of candidates to consider per circle
        m = 20, // initial number of circles to add per frame
        n = data.length, // remaining number of circles to add
        newCircle = bestCircleGenerator(maxRadius, padding);

    svg = d3.select("#bubble-container")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    tooltip = d3.select("body").append("div").attr("class", "tooltip")

    svg.on("mouseout", () => {
      tooltip.transition()    
        .delay(10000)    
        .duration(100)
        .style("opacity", 0);    
    })

    circlePositions = [];
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



      nodeContainer = svg.selectAll(".circle")
        .data(data)
        .enter()
        .append("g")
          .attr("transform", (d, i) => {
            var x = (i % numRectPerRow) * (rectWidth + rectPadding);
            var y = (Math.floor(i / numRectPerRow) * (rectHeight + rectPadding)) + 100 
            return `translate(${x}, ${y})`;
          })
          .on("mouseover", (d) => {
            mouseoverEnabled(d, true);
          })
          .on("mouseout", (d) => {

           // d3.select(this).style("fill", "rgba(0,0,0,0.6)")
            // tooltip.transition()   
            //     .duration(0)    
            //     .style("opacity", 0);  
          })
          // .attr("x", (d, i) => { return (i % numRectPerRow) * (rectWidth + rectPadding) })
          // .attr("y", (d, i) => { return (Math.floor(i / numRectPerRow) * (rectHeight + rectPadding)) + 100 })

      // circles = nodeContainer.append("svg:rect")
      //     .attr("width", rectWidth)
      //     .attr("height", rectHeight)
        // .append("svg:circle")
        //   .attr("cx", (d, i) => { return circlePositions[i][0] })
        //   .attr("cy", (d, i) => { return circlePositions[i][1] + 100 })
        //   .attr("r", (d, i) => { return circlePositions[i][2] })
          // .style("fill", nodeColor)
          // .style("fill-opacity", (d) => { return (Math.random() + .5) / 2 })
          

      nodeContainer.transition()
          .duration((d, i) => { return (i + 1) * 2 * Math.random()})
            .attr("transform", (d, i) => {
              var x = (i % numRectPerRow) * (rectWidth + rectPadding);
              var y = (Math.floor(i / numRectPerRow) * (rectHeight + rectPadding)) 
              return `translate(${x}, ${y})`;
            })
            //.attr("y", (d, i) => { return (Math.floor(i / numRectPerRow) * (rectHeight + rectPadding))})
            //.attr("cy", (d, i) => { return circlePositions[i][1]})
        

      // nodeContainer
      //   .append("text")
      //     .text((d, i) => { return d.Name; })
      //     .style("transform", "translate(6px, 15px);")

      var imageSquares = nodeContainer.append("svg:image")
        .attr("xlink:href",  function(d) { 
          var image = imageObj[d.URL];
          if(typeof image !== "undefined" && image !== "undefined" && image !== "null"){
            return `https:${image}`;
          }
          return "null";
        })
        //.attr("x", -25)
        // .attr("y", -25)
        .attr("height", rectHeight)
        .attr("width", rectHeight);
        
      

        $("#node-count").text(data.length)

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

function mouseoverEnabled (d, enabled){
  if(enabled){
     console.log(d);

    var image = imageObj[d.URL];

    var imageHTML = "";

    if(typeof image !== "undefined" && image !== "undefined"){
      imageHTML = `<img src="http:${image}" style="width: 100px; float: left; margin: 10px"/>`;
    }

    var mentionHTML = mentionsObj[d.URL].map((m) => {
      return `<h4>${m.sectionHeader}</h4>${m.quote.replace(/Miles Davis/gi, "<b>Miles Davis</b>")}`;
    }).join("");

    //d3.select(this).style("fill", "red")
    tooltip.transition()    
        .duration(200)    
        .style("opacity", .9);    
    tooltip.html(
        `<table>
          <tbody>
            <tr>
              <td>
                <h4>${d.Name}</h4>
                ${imageHTML}
                ${mentionHTML}
              </td>
            </tr>
          </tbody>
        </table>`)  
        .style("left", (d3.event.pageX + 20) + "px")   
        .style("top", (d3.event.pageY + 20) + "px");  

  }
}
  
function resetCircles() {
  $("#node-count").text(data.length)
  nodeContainer
    .classed("hidden", false)
    .on("mouseover", (d) => {
      mouseoverEnabled(d, true);
    })
    .transition()
    .duration((d, i) => { return i * Math.random() * 0.5 })
      .attr("transform", (d, i) => {
        var x = (i % numRectPerRow) * (rectWidth + rectPadding);
        var y = (Math.floor(i / numRectPerRow) * (rectHeight + rectPadding)) 
        return `translate(${x}, ${y})`;
      })
      // .attr("x", (d, i) => { return (i % numRectPerRow) * (rectWidth + rectPadding) })
      // .attr("y", (d, i) => { return (Math.floor(i / numRectPerRow) * (rectHeight + rectPadding)) });
      // .attr("cx", (d, i) => { return circlePositions[i][0] })
      // .attr("cy", (d, i) => { return circlePositions[i][1] })
      //.attr("r", (d, i) => { return circlePositions[i][2] })

  // circles.style("fill", nodeColor)
  //     .style("fill-opacity", (d) => { return (Math.random() + .5) / 2 })
  //    ;
}
function redrawCircles () {
  
  if($("#500-views").is(":checked") 
    || $("#entity-type-select input:checked").length > 0
    || $("#section-select input:checked").length > 0){
        
    var moreThan500 = $("#500-views").is(":checked")
    var selectedEntityTypes = [];
    $("#entity-type-select input:checked").each((j, t) => { selectedEntityTypes.push($(t).val()); });

    var selectedMentionHeaders = [];
    $("#section-select input:checked").map((j, a) => { selectedMentionHeaders.push($(a).val()); });

    var searchTerm = $(".search-label input").val().trim();
    var re = new RegExp("\\b" + d3.requote(searchTerm), "i");
  
    var filteredIndexes = data.map((a, i) => { 

      var useIndex = true;
      if(moreThan500){
        if(parseInt(a.PageViews) < 500){
          useIndex = false;
        }
      }

      if(useIndex && selectedEntityTypes.indexOf("null") === -1 ){
        if(selectedEntityTypes.indexOf(a.EntityType.toLowerCase()) === -1){
          useIndex = false;
        }
      }

      if(useIndex && selectedMentionHeaders.indexOf("null") === -1){

        useIndex = false;

        selectedMentionHeaders.forEach((header) => {
          if(mentionSectionObj[header].indexOf(a.URL) !== -1){
            useIndex = true;
          }
        })

      }

      if(useIndex){
        if(searchTerm.length > 2){
          useIndex = re.test(a.Name); 
        }
      }


      return (useIndex? i: -1);

    }).filter((a) => { return a !== -1});


    $("#node-count").text(filteredIndexes.length)

    nodeContainer
      .classed("hidden", (d, i) => {
        var index = filteredIndexes.indexOf(i); 
        return index === -1;
      })
      .on("mouseover", (d, i) => {
          var index = filteredIndexes.indexOf(i); 
          mouseoverEnabled(d, index !== -1);
        })
      .transition() 
        .duration(800)
        .attr("transform", (d, i) => {
          var positionIndex = i;
          var index = filteredIndexes.indexOf(i);
          
          if(index !== -1){
            positionIndex = index;
          }
          var x = (positionIndex % numRectPerRow) * (rectWidth + rectPadding);
          var y = Math.floor(positionIndex / numRectPerRow) * (rectHeight + rectPadding)
          return `translate(${x}, ${y})`;
        })

        // .attr("x", (d, i) => { 
        //   var index = filteredIndexes.indexOf(i);
        //   if(index !== -1){
        //     return (index % numRectPerRow) * (rectWidth + rectPadding);
        //   }
        //   return (i % numRectPerRow) * (rectWidth + rectPadding);
        // })
        // .attr("y", (d, i) => { 
        //   var index = filteredIndexes.indexOf(i);
        //   if(index !== -1){
        //     return Math.floor(index / numRectPerRow) * (rectHeight + rectPadding);
        //   }
        //   return Math.floor(i / numRectPerRow) * (rectHeight + rectPadding);
        // });
        // .attr("cx", (d, i) => { 
        //   var index = filteredIndexes.indexOf(i);
        //   if(index !== -1){
        //     return circlePositions[index][0];
        //   }
        //   return circlePositions[i][0];
        // })
        // .attr("cy", (d, i) => { 
        //   var index = filteredIndexes.indexOf(i);
        //   if(index !== -1){
        //     return circlePositions[index][1];
        //   }
        //   return circlePositions[i][1];
        // })
        // .attr("r", (d, i) => { 
        //   var index = filteredIndexes.indexOf(i);
        //   if(index !== -1){
        //     return circlePositions[index][2];
        //   }
        //   return circlePositions[i][2];
        // })
      // circles.style("fill", (d, i) => {
      //     var index = filteredIndexes.indexOf(i); 
      //     if(index !== -1){
      //       return nodeColor;
      //     }
      //     return "rgba(0,0,0,0)" ;
      //   })
      //   .style("fill-opacity", (d, i) => { 
      //     var index = filteredIndexes.indexOf(i); 
      //     if(index !== -1){
      //       return (Math.random() + .5) / 2 ;
      //     }
      //     return 0;
      //   })
      //   ;
  } else {
     resetCircles();
  } 
}

function initialiseFilters() {
  $(".circle-filter input").on("change", function() {
    redrawCircles();
  });

  var searchInputLabel = d3.select(".search-label input")
    .on("keyup", keyupedLabel);

  function keyupedLabel() {

    if(this.value.trim().length > 2){
     redrawCircles();
    }

    //searchLabel(this.value.trim());
  }

  // function searchLabel(value) {
  //   if (value.length > 2) {
  //     var re = new RegExp("\\b" + d3.requote(value), "i");
  //     nodeContainer.classed("hidden",function(d,i){
  //       return !re.test(d.Name); 
  //     });

  //   } else {
  //     nodeContainer.classed("hidden", false);
  //   }
  // }



}


$(document).ready(function(){

  async.series({
    getPageData: (cb) => {
      d3.tsv(`./../data/d3-data-obj.tsv`, function(error, pageData) {
        if (error) throw error;
        data = pageData;

        data.forEach((g) => { 
          var entityType = g.EntityType.toLowerCase();
          if(typeof entityTypeObj[entityType] === "undefined"){
           entityTypeObj[entityType] = 0;
          }
          entityTypeObj[entityType]++
        });

        Object.keys(entityTypeObj).sort((a, b) => { 
          return entityTypeObj[b] - entityTypeObj[a] 
        })
        .forEach((entityType) => {
          $("#entity-type-select")
             .append($(
              `<div class="check-button">
                <label>
                  <input value='${entityType}' type='checkbox'/> 
                  <span>${entityType}</span>
                </label>
              </div>`))  
        })

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
        
        mentions.forEach((m) => {
          if(typeof mentionsObj[m.URL] === "undefined"){
            mentionsObj[m.URL] = [];
          }
          mentionsObj[m.URL].push(m);

          if(typeof mentionSectionObj[m.sectionHeader.toLowerCase()] === "undefined"){
            mentionSectionObj[m.sectionHeader.toLowerCase()] = [];
          }

          if(mentionSectionObj[m.sectionHeader.toLowerCase()].indexOf(m.URL) === -1){
            mentionSectionObj[m.sectionHeader.toLowerCase()].push(m.URL);
          }

        })


        Object.keys(mentionSectionObj).sort((a, b) => { 
          return mentionSectionObj[b].length - mentionSectionObj[a].length 
        })
        .forEach((sectionHeader) => {
          $("#section-select")
            .append($(
              `<div class="check-button">
                <label>
                  <input value='${sectionHeader}' type='checkbox'/> 
                  <span>${sectionHeader}</span>
                </label>
              </div>`))
        })


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
        // console.log(popularDates.length)
        // console.log(popularDates)

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
        // console.log(popularGenres.length)
        // console.log(popularGenres)
        cb();
      });
    },
    getType: (cb) => {
      d3.tsv(`./../data/d3-data-obj-types.tsv`, function(error, typeData) {
        if (error) throw error;
        types = typeData;

        var typeObj = {};
        types.forEach((g) => { 
          var rdfType = g.Value
                      //.replace(/(.)+\:/, "")
                      .replace(/[\_|\-]+/g, " ").toLowerCase();
          if(typeof typeObj[rdfType] === "undefined"){
           typeObj[rdfType] = 0;
          }
          typeObj[rdfType]++
        })

        var popularTypes = Object.keys(typeObj).sort((a, b) => { return typeObj[b] - typeObj[a] });
        // console.log(popularTypes.length)
        // console.log(popularTypes.map((t) => { return `${typeObj[t]}\t${t}\n`}).join(""))

        cb();
      });
    },
    getFrom: (cb) => {
      d3.tsv(`./../data/d3-data-obj-from.tsv`, function(error, fromData) {
        if (error) throw error;
        froms = fromData;

        var subjectObj = {};
        var placeObj = {};
        froms.forEach((g) => { 

          var parts = g.Value.replace(/(.)+\:/, "").toLowerCase().split("_from_");

          if(typeof subjectObj[parts[0]] === "undefined"){
           subjectObj[parts[0]] = [];
          }
          subjectObj[parts[0]].push(g);

          var place = parts[1].replace(/(.)+\,/, "").replace(/\_/g, " ").trim();

          if(typeof placeObj[place] === "undefined"){
           placeObj[place] = [];
          }
          placeObj[place].push(g);

        })

        console.log(subjectObj);
        console.log(placeObj);

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

      initialiseFilters();
     
    }
  })



});

