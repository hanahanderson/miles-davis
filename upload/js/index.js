/*
  missing entity types
  'Alfred_%22Pee_Wee%22_Ellis' - Musical Artist
  'Leon_%22Ndugu%22_Chancler' - Musical Artist
  'Coltrane_%22Live%22_at_the_Village_Vanguard' - Album
  'Andy_%22Stoker%22_Growcott' - Musical Artist
  'The_Complete_%22Is%22_Sessions' - Album
  'Oscar_Peterson_%2B_Harry_Edison_%2B_Eddie_%22Cleanhead%22_Vinson' - Album
  'James_%22Tootie%22_Hogan' - Musical Artist
  'The_Bill_Evans_Trio_%22Live%22' - Album
  'Jimmy_%22Jammin%27%22_Smith' - Musical Artist
*/



function getSubject(URL) {

  var subjectList = pageSubjectObj[URL];

  var identifiers = [];



  //works
    //albums
    //books
    //comics titles
    //compositions
    //discographies
    //documentaries
    //episodes
    //films by/set/directed/
    //grammy award for
    //jazz standards
    //live album
    //magazines
    //music history
    //music related lists
    //musicals
    //novels
    //songs
    //singles
    //soundtracks
    //television series


  //musicians
    //accordionists
    //audio engineers
    //(band) members
    //band members
    //bandleaders
    //baritones
    //bassists
    //bassoonists
    //beatboxers
    //cellists
    //choreographers
    //clarinetists
    //composers
    //conductors
    //dancers
    //djs
    //drummers
    //ensembles
    //flautists
    //flugelhornists
    //frank sinatra
    //guitarists
    //harpists
    //hip hop groups
    //instrumentalists
    //keyboardists
    //keytarists
    //lyricists
    //mandolinists
    //mastering engineers
    //music groups
    //musical advocacy groups
    //musical groups
    //musical quartets
    //musicians
    //occupations in music
    //orchestra members
    //percussionists
    //performers
    //pianists
    //production companies
    //rappers
    //recordings artists
    //record labels
    //records artists
    //record producers
    //rock groups
    //saxophonists
    //singers
    //songwriters
    //sopranos
    //trombonists
    //trumpeters
    //tubists
    //violinists
    //vibraphonists


  //people
    //actors
    //actresses
    //activists
    //artists
    //births
    //biographers
    //boxing promoters
    //businesspeople
    //deaths
    //directors
    //dramatists
    //entertainers
    //fictional characters
    //filmmakers
    //historians
    //journalists
    //models
    //novelists
    //passions characters
    //people from
    //personalities
    //playwrights
    //photographers
    //poets
    //politicians
    //presenters
    //producers
    //sports announcers
    //writers



  //events
    //annual events
    //awards
    //award ceremony
    //concert tours
    //concerts
    //days of the year
    //deaths by person
    //decade "1996s".match(/\d{4}s/gi) or
    //festivals
    //recurring events
    //time period  - "1996 in music".match(/\d{4} in/gi)
    //world's fairs


  //places
    //buildings
    //cities
    //by city
    //by country
    //concert halls
    //districts in the united states
    //educational institutions 
    //establishments
    //event venues 
    //districts
    //districts and streets
    //hotels
    //jazz clubs
    //music venues
    //neighborhoods in
    //nightclubs
    //populated places
    //recording studios
    //restaurants
    //squares in 
    //schools in
    //states
    //streets in
    //structures
    //territories
    //towns
    //venues


    //washington, d.c.
    //upstate new york
    //five points, denver


  //genres
    //australian jazz
    //british music
    //cabaret
    //classical music
    //counterculture
    //culture of
    //culture canon
    //drums
    //electro music
    //electronic organs
    //ethnic music in
    //experimental music
    //film styles
    //funk
    //genre
    //genres
    //instruments
    //jazz by nationality
    //jazz terminology
    //modes
    //musical subcultures
    //musical techniques
    //pitched percussion
    //popular culture
    //styles of music


  //influenced


  //other
    //companies
    //headphones manufacturers
    //music industry associations
    

  //---George_Russell_(composer)


  subjectList.forEach(function (subject) {
    if(subject.match(/album/gi)){
      if(identifiers.indexOf("album") === -1){
        identifiers.push("album");
      }
    }
  })



}












var data;
var dates;
var genres;
var mentions;
var imageObj = {};
var entityTypeObj = {};
var mentionsObj = {};
var mentionSectionObj = {};
var locationSubjectObj = {};
var placeObj = {};
var subjectObj = {};
var pageSubjectObj = {};

var containerWidth = 1145;
var containerHeight = 753;

var numRectPerRow = 15;
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

  tooltip = d3.select("body")
    .append("div") 
      .attr("class", "tooltip")
      .style("opacity", 0)


  svg.on("mouseout", function () {
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
      // .attr("transform", function (d, i) {
      //   var x = squareCoords(i).left;
      //   var y = squareCoords(i).top;
      //   return `translate(${x}, ${y})`;
      // })

  var backgroundImage = "http://cp91279.biography.com/BIO_Bio-Shorts_0_Miles-Davis_150550_SF_HD_768x432-16x9.jpg";

  nodeContainer.style("width", `${squareWidth}px`)
      .style("height", `${squareHeight}px`)
      .style("left", function (d, i) { return `${squareCoords(i).left}px`; })
      .style("top", function (d, i) { return `${squareCoords(i).top}px`; })
      .style("background-image", `url("${backgroundImage}")`)
      .style("background-size", "1145px 753px")
      .style("background-position", function (d, i) { return `-${squareCoords(i).left}px -${squareCoords(i).top}px`})
      .style("color", "rgba(0,0,0,0)")
      .text(function (d, i) { return d.Name; })

  d3.select("body")
    .style("height", "3000px")

  d3.select("#grid")
    .style("position", "fixed")
    .style("background-image", `url("${backgroundImage}")`)
  var hasDrawnGrid = false;

  // $(window).on("scroll", function () {

  //   if(!hasDrawnGrid){
  //     nodeContainer
  //       .style("-webkit-filter", "grayscale(100%)")
  //       .style("filter", "grayscale(100%)")
  //       .style("opacity", function (d, i) { 
  //         var pos = squareCoords(i).top + $(window).scrollTop();
  //         return `${Math.min((pos * 1.5 / $("#grid").height()), 1)}` })
  //       // .style("-webkit-filter", function (d, i) { 
  //       //   var pos = squareCoords(i).top + $(window).scrollTop();
  //       //   return `grayscale(${Math.min((pos / $("#grid").height()) * 100, 100)}%)` })
  //       // .style("filter", function (d, i) { 
  //       //   var pos = squareCoords(i).top + $(window).scrollTop();
          
  //       //   return `grayscale(${Math.min((pos / $("#grid").height()) * 100, 100) }%)` })
  //   }

  //   if($(window).scrollTop() > 300){
      hasDrawnGrid = true;
      $(window).unbind("scroll");

       nodeContainer.transition()
        .duration(function (d, i) { return (i + 1) * 2 * Math.random()})
        //.duration(200)
          .style("width", `${rectWidth}px`)
          .style("height", `${rectHeight}px`)
          .style("left", function (d, i) { return `${(i % numRectPerRow) * (rectWidth + rectPadding)}px`; })
          .style("top", function (d, i) { return `${Math.floor(i / numRectPerRow) * (rectHeight + rectPadding)}px`;})
          .style("color", "black")
          .style("background-image", null)
          .style("opacity", 1)
          .style("background-color", function (d, i) { return `rgba(34, 49, 63, ${Math.random() * 0.7})` })
          

      d3.select("#grid")
        .style("position", "absolute")
        .style("background-image", null);
      
      $(".filter-container").css("display", "block")

      $("#node-count").text(data.length)

      nodeContainer.on("mouseover", function (d) {
        mouseoverEnabled(d, true);
      })

  //   }

  // })


  // setTimeout(function () {
  //  
  // }, 3000);



}

function resetCircles() {
  $("#node-count").text(data.length)
  nodeContainer
    .classed("hidden", false)
    .on("mouseover", function (d) {
      mouseoverEnabled(d, true);
    })
    .transition()
    // .duration(function (d, i) { return i * Math.random() * 0.5 })
    //   .style("left", function (d, i) { return `${(i % numRectPerRow) * (rectWidth + rectPadding)}px`; })
    //   .style("top", function (d, i) { return `${Math.floor(i / numRectPerRow) * (rectHeight + rectPadding)}px`;})
        
      // .attr("transform", function (d, i) {
      //   var x = (i % numRectPerRow) * (rectWidth + rectPadding);
      //   var y = (Math.floor(i / numRectPerRow) * (rectHeight + rectPadding)) 
      //   return `translate(${x}, ${y})`;
      // })
      
}
function redrawCircles () {
  
  // if($("#500-views").is(":checked") 
  //   || $("#entity-type-select input:not([value=null]):checked").length > 0
  //   || $("#section-select input:not([value=null]):checked").length > 0){
        
    var moreThan500 = $("#500-views").is(":checked")
    var selectedEntityTypes = [];
    $("#entity-type-select input:checked").each(function (j, t) { selectedEntityTypes.push($(t).val()); });

    var selectedMentionHeaders = [];
    $("#section-select input:checked").map(function (j, a) { selectedMentionHeaders.push($(a).val()); });

    var searchTerm = $(".search-label input").val().trim();
    var re = new RegExp("\\b" + d3.requote(searchTerm), "i");
  
    var filteredIndexes = data.map(function (a, i) { 

      var useIndex = true;
      if(moreThan500){
        if(parseInt(a.PageViews) < 500){
          useIndex = false;
        }
      }

      if(useIndex //&& selectedEntityTypes.indexOf("null") === -1 
        ){
        if(selectedEntityTypes.indexOf(a.EntityType.toLowerCase()) === -1){
          useIndex = false;
        }
      }

      if(useIndex && selectedMentionHeaders.indexOf("null") === -1
        ){

        useIndex = false;

        selectedMentionHeaders.forEach(function (header) {
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

    }).filter(function (a) { return a !== -1});


    $("#node-count").text(filteredIndexes.length)

    nodeContainer
      .classed("hidden", function (d, i){
        var index = filteredIndexes.indexOf(i); 
        return index === -1;
      })
      .on("mouseover", function (d, i){
          var index = filteredIndexes.indexOf(i); 
          mouseoverEnabled(d, index !== -1);
        })
      .transition() 
        .duration(800)
        .style("left", function (d, i){ 
          var positionIndex = i;
          var index = filteredIndexes.indexOf(i);
          
          if(index !== -1){
            positionIndex = index;
          }
          return `${(positionIndex % numRectPerRow) * (rectWidth + rectPadding)}px`; 
        })
        .style("top", function (d, i){ 
          var positionIndex = i;
          var index = filteredIndexes.indexOf(i);
          
          if(index !== -1){
            positionIndex = index;
          }
          return `${Math.floor(positionIndex / numRectPerRow) * (rectHeight + rectPadding)}px`;
        })
        
        // .attr("transform", function (d, i) {
        //   var positionIndex = i;
        //   var index = filteredIndexes.indexOf(i);
          
        //   if(index !== -1){
        //     positionIndex = index;
        //   }
        //   var x = (positionIndex % numRectPerRow) * (rectWidth + rectPadding);
        //   var y = Math.floor(positionIndex / numRectPerRow) * (rectHeight + rectPadding)
        //   return `translate(${x}, ${y})`;
        // })

        
  // } else {
  //    resetCircles();
  // } 
}


function mouseoverEnabled (d, enabled){
  if(enabled){
     console.log(d);

    var image = imageObj[d.URL];

    var imageHTML = "";

    if(typeof image !== "undefined" && image !== "undefined"){
      imageHTML = `<img src="http:${image}" style="width: 100px; float: left; margin: 10px"/>`;
    }

    var mentionHTML = mentionsObj[d.URL].map(function (m) {
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

    console.log("hello")
    var filterContainer = $(this).closest(".circle-filter")
    var containerId = $(filterContainer).attr("id");
    var value = $(this).val();

    if(value === "null"){
      
      $(`#${containerId} input`).prop("checked", $(this).is(":checked")) 
      
      redrawCircles();
    } else {

      var allSelected = ($(`#${containerId} input:not([value=null]):checked`).length === $(`#${containerId} input:not([value=null])`).length)
      
      $(`#${containerId} input[value=null]`).prop("checked", allSelected) 
    
        

      redrawCircles();
    }
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
    getPageData: function (cb) {
      d3.tsv(`./../data/d3-data-obj.tsv`, function(error, pageData) {
        if (error) throw error;
      
        data = pageData;
        data = data.sort(function (a, b) { return parseInt(b.PageViews) - parseInt(a.PageViews) })

        data.forEach(function (g) { 

          if(g.EntityType.toLowerCase() === "q11424"){ g.EntityType = "Film"; }
          if(g.EntityType.toLowerCase() === "group100031264"){ g.EntityType = "Group"; }
          if(g.EntityType.toLowerCase() === "agent114778436"){ g.EntityType = "Drug"; }


          var entityType = g.EntityType.toLowerCase();
          if(typeof entityTypeObj[entityType] === "undefined"){
           entityTypeObj[entityType] = 0;
          }
          entityTypeObj[entityType]++
        });

        Object.keys(entityTypeObj).sort(function (a, b) { 
          return entityTypeObj[b] - entityTypeObj[a] 
        })
        .forEach(function (entityType) {
          $("#entity-type-select")
             .append($(
              `<div class="check-button">
                <label>
                  <input value='${entityType}' type='checkbox' checked/> 
                  <span>${entityType} <small>(${entityTypeObj[entityType]})</small> </span>
                </label>
              </div>`))  
        })

        cb();
      });
    },
    getMentionData: function (cb) {
      d3.tsv(`./../data/d3-data-obj-mentions.tsv`, function(error, mentionData) {
        if (error) throw error;
        mentions = mentionData;

        mentions = mentions.sort(function (a, b) { 
          if(parseInt(a.sectionIndex) === parseInt(b.sectionIndex)){
            return parseInt(a.wordCountBeforeSection) - parseInt(b.wordCountBeforeSection);
          } 
          return parseInt(a.sectionIndex) - parseInt(b.sectionIndex)
        });
        
        mentions.forEach(function (m) {
          if(typeof mentionsObj[m.URL] === "undefined"){
            mentionsObj[m.URL] = [];
          }
          mentionsObj[m.URL].push(m);

          var sectionHeader = m.sectionHeader.toLowerCase();
          if(sectionHeader.trim().length === 0) {
            sectionHeader = "first paragraph";
          }

          if(typeof mentionSectionObj[sectionHeader] === "undefined"){
            mentionSectionObj[sectionHeader] = [];
          }

          if(mentionSectionObj[sectionHeader].indexOf(m.URL) === -1){
            mentionSectionObj[sectionHeader].push(m.URL);
          }

        });

        Object.keys(mentionSectionObj).sort(function (a, b) { 
          return mentionSectionObj[b].length - mentionSectionObj[a].length 
        })
        .forEach(function (sectionHeader) {
          $("#section-select")
            .append($(
              `<div class="check-button">
                <label>
                  <input value='${sectionHeader}' type='checkbox' checked/> 
                  <span>${sectionHeader} <small>(${mentionSectionObj[sectionHeader].length})</small> </span>
                </label>
              </div>`))
        })


        cb();
      });
    },
    getDatesData: function (cb) {
      d3.tsv(`./../data/d3-data-obj-dates.tsv`, function(error, datesData) {
        if (error) throw error;
        dates = datesData;

        var dateObj = {};
        dates.forEach(function (g) { 
          var dateAttr = g.DateAttr.replace(/(.)+\:/, "").replace(/[\_|\-]+/g, " ").toLowerCase();
          if(typeof dateObj[dateAttr] === "undefined"){
           dateObj[dateAttr] = 0;
          }
          dateObj[dateAttr]++
        })

        var popularDates = Object.keys(dateObj).sort(function (a, b) { return dateObj[b] - dateObj[a] });
        // console.log(popularDates.length)
        // console.log(popularDates)

        cb();
      });
    },
    getGenreData: function (cb) {
      d3.tsv(`./../data/d3-data-obj-genres.tsv`, function(error, genreData) {
        if (error) throw error;
        genres = genreData;

        var genreObj = {};
        genres.forEach(function (g) { 
          var gen = g.Genre.replace(/(.)+\:/, "").replace(/[\_|\-]+/g, " ").toLowerCase();
          if(typeof genreObj[gen] === "undefined"){
           genreObj[gen] = 0;
          }
          genreObj[gen]++
        })

        var popularGenres = Object.keys(genreObj).sort(function (a, b) { return genreObj[b] - genreObj[a] });
        // console.log(popularGenres.length)
        // console.log(popularGenres)
        cb();
      });
    },
    getType: function (cb) {
      d3.tsv(`./../data/d3-data-obj-types.tsv`, function(error, typeData) {
        if (error) throw error;
        types = typeData;

        var typeObj = {};
        types.forEach(function (g) { 
          var rdfType = g.Value
                      //.replace(/(.)+\:/, "")
                      .replace(/[\_|\-]+/g, " ").toLowerCase();
          if(typeof typeObj[rdfType] === "undefined"){
           typeObj[rdfType] = 0;
          }
          typeObj[rdfType]++
        })

        var popularTypes = Object.keys(typeObj).sort(function (a, b) { return typeObj[b] - typeObj[a] });
        // console.log(popularTypes.length)
        // console.log(popularTypes.map(function (t) { return `${typeObj[t]}\t${t}\n`}).join(""))

        cb();
      });
    },
    getSubjects: function (cb) {
      d3.tsv(`./../data/d3-data-obj-subject.tsv`, function(error, subjectData) {
        if (error) throw error;

        subjectData.forEach(function (g) { 
          var subject = g.Value
                      .replace(/(.)+\:/, "")
                      .replace(/[\_|\-]+/g, " ").toLowerCase();
          if(typeof subjectObj[subject] === "undefined"){
           subjectObj[subject] = 0;
          }
          subjectObj[subject]++;

          if(typeof pageSubjectObj[g.URL] === "undefined"){
            pageSubjectObj[g.URL] = [];
          }
          
          pageSubjectObj[g.URL].push(subject)
        })

        cb();
      });
    },
    getFrom: function (cb) {
      d3.tsv(`./../data/d3-data-obj-from.tsv`, function(error, fromData) {
        if (error) throw error;
        froms = fromData;

        locationSubjectObj = {};
        placeObj = {};
        froms.forEach(function (g) { 

          var parts = g.Value.replace(/(.)+\:/, "").toLowerCase().split("_from_");

          if(typeof locationSubjectObj[parts[0]] === "undefined"){
           locationSubjectObj[parts[0]] = [];
          }
          locationSubjectObj[parts[0]].push(g);

          var place = parts[1].replace(/(.)+\,/, "").replace(/\_/g, " ").trim();

          if(typeof placeObj[place] === "undefined"){
           placeObj[place] = [];
          }
          placeObj[place].push(g);

        })

        console.log(locationSubjectObj);
        console.log(placeObj);

        cb();
      });
    },
    getImageData: function (cb) {
      d3.tsv(`./../data/d3-data-obj-image.tsv`, function(error, imageData) {
        if (error) throw error;
        
        imageObj = {};
        imageData.forEach(function (g) { 
          imageObj[g["Page URL"]] = g["image URL"];
        })

        cb();
      });
    },
    done: function () {
      drawCircles();

      initialiseFilters();
     
    }
  })



});

