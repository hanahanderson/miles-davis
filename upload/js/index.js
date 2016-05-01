
var data;
var dates;
var genres;
var mentions;
var imageObj;
var entityTypeObj = {};
var mentionsObj = {};
var mentionSectionObj = {};

var containerWidth = 1145;
var containerHeight = 753;

var numRectPerRow = 30;
var rectHeight = 25;
//var rectWidth = 25;
var rectWidth = Math.floor(containerWidth / numRectPerRow);
var rectPadding = 0;

var svg;
var tooltip;
var nodeContainer;
var circles;
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

  
  var numPerRow = 80;
  var squareWidth = containerWidth / numPerRow;
  var squareHeight = squareWidth;

  function squareCoords(i) {

    return {
      left:  (i % numPerRow) * squareWidth,
      top: Math.floor(i / numPerRow) * squareHeight
    }
  }

  nodeContainer = d3.select("#grid").selectAll(".grid-item")
    .data(data)
    .enter()
    .append("div")
      .attr("class", "grid-item")
      // .attr("transform", (d, i) => {
      //   var x = squareCoords(i).left;
      //   var y = squareCoords(i).top;
      //   return `translate(${x}, ${y})`;
      // })


  nodeContainer.style("width", `${squareWidth}px`)
      .style("height", `${squareHeight}px`)
      .style("left", (d, i) => { return `${squareCoords(i).left}px`; })
      .style("top", (d, i) => { return `${squareCoords(i).top}px`;})
      .style("background-image", 'url("http://cp91279.biography.com/BIO_Bio-Shorts_0_Miles-Davis_150550_SF_HD_768x432-16x9.jpg")')
      .style("background-size", "1145px 753px")
      .style("background-position", (d, i) => { return `-${squareCoords(i).left}px -${squareCoords(i).top}px`})
      .style("color", "rgba(0,0,0,0)")
      .text((d, i) => { return d.Name; })




  // nodeContainer = svg.selectAll(".circle")
  //   .data(data)
  //   .enter()
  //   .append("g")
  //     .attr("transform", (d, i) => {
  //       var x = (i % numRectPerRow) * (rectWidth + rectPadding);
  //       var y = (Math.floor(i / numRectPerRow) * (rectHeight + rectPadding)) + 100 
  //       return `translate(${x}, ${y})`;
  //     })
  //     .on("mouseover", (d) => {
  //       mouseoverEnabled(d, true);
  //     })
  
  //setTimeout(() => {
    // nodeContainer.transition()
    //   //.delay((d, i) => { return (i + 1) * 2 * Math.random()})
    //   //.delay((d, i) => { return (i + 1) * 2 * Math.random()})
    //   .delay(1000)
    //   .duration(2000)
    //     .style("-webkit-filter", (d, i) => { return `grayscale(${100 * Math.random()}%)` })
    //     .style("filter", (d, i) => { return `grayscale(${100 * Math.random()}%)` })
  //}, 500);


  setTimeout(() => {
    nodeContainer.transition()
      .delay((d, i) => { return (i + 1) * 2 * Math.random()})
      .duration(200)
        .style("width", `${rectWidth}px`)
        .style("height", `${rectHeight}px`)
        .style("color", "black")
        .style("background-image", null)
        .style("background-color", (d, i) => { return `rgba(34, 49, 63, ${Math.random() * 0.7})` })
        .style("left", (d, i) => { return `${(i % numRectPerRow) * (rectWidth + rectPadding)}px`; })
        .style("top", (d, i) => { return `${Math.floor(i / numRectPerRow) * (rectHeight + rectPadding)}px`;})
        //.style("top", (d, i) => { return `${squareCoords(i).top * 2 * Math.random() }px`;})

   $(".filter-container").css("display", "block")


    nodeContainer.on("mouseover", (d) => {
      mouseoverEnabled(d, true);
    })
  }, 3000);

  // nodeContainer.transition()
  //     .delay(3000)
  //     .duration((d, i) => { return (i + 1) * 2 * Math.random()})
  //       .style("position", "inherit")
  //       .style("padding", "5px")
  //       .style("margin", "2px")
  //       .style("border", "1px solid grey")
  //       .style("border-radius", "3px")
  //       .style("width", null)
  //       .style("height", null)
  //       .style("color", "black")
  //       .style("background-image", null)
  //       .style("background-color", `whitesmoke`)
    
  //       // .style("left", (d, i) => { return `${(i % numRectPerRow) * (rectWidth + rectPadding)}px`; })
  //       // .style("top", (d, i) => { return `${Math.floor(i / numRectPerRow) * (rectHeight + rectPadding)}px`;})
      
  //   setTimeout(() => {
  //     $("#grid").css("width", "100%").css("height", null)
  //    

  //   }, 2000)
    $("#node-count").text(data.length)


}

function resetCircles() {
  $("#node-count").text(data.length)
  nodeContainer
    .classed("hidden", false)
    .on("mouseover", (d) => {
      mouseoverEnabled(d, true);
    })
    .transition()
    // .duration((d, i) => { return i * Math.random() * 0.5 })
    //   .style("left", (d, i) => { return `${(i % numRectPerRow) * (rectWidth + rectPadding)}px`; })
    //   .style("top", (d, i) => { return `${Math.floor(i / numRectPerRow) * (rectHeight + rectPadding)}px`;})
        
      // .attr("transform", (d, i) => {
      //   var x = (i % numRectPerRow) * (rectWidth + rectPadding);
      //   var y = (Math.floor(i / numRectPerRow) * (rectHeight + rectPadding)) 
      //   return `translate(${x}, ${y})`;
      // })
      
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
        .style("left", (d, i) => { 
          var positionIndex = i;
          var index = filteredIndexes.indexOf(i);
          
          if(index !== -1){
            positionIndex = index;
          }
          return `${(positionIndex % numRectPerRow) * (rectWidth + rectPadding)}px`; 
        })
        .style("top", (d, i) => { 
          var positionIndex = i;
          var index = filteredIndexes.indexOf(i);
          
          if(index !== -1){
            positionIndex = index;
          }
          return `${Math.floor(positionIndex / numRectPerRow) * (rectHeight + rectPadding)}px`;
        })
        
        // .attr("transform", (d, i) => {
        //   var positionIndex = i;
        //   var index = filteredIndexes.indexOf(i);
          
        //   if(index !== -1){
        //     positionIndex = index;
        //   }
        //   var x = (positionIndex % numRectPerRow) * (rectWidth + rectPadding);
        //   var y = Math.floor(positionIndex / numRectPerRow) * (rectHeight + rectPadding)
        //   return `translate(${x}, ${y})`;
        // })

        
  } else {
     resetCircles();
  } 
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

    tooltip.transition()    
        .duration(200)    
        .style("opacity", 1);    
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
        .style("left", (d3.event.pageX + 10) + "px")   
        .style("top", (d3.event.pageY + 10) + "px");  

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

  }
}


$(document).ready(function(){

  async.series({
    getPageData: (cb) => {
      d3.tsv(`./../data/d3-data-obj.tsv`, function(error, pageData) {
        if (error) throw error;
      
        data = pageData;
        data = data.sort((a, b) => { return parseInt(b.PageViews) - parseInt(a.PageViews) })

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

