// /*
//   missing entity types
//   'Alfred_%22Pee_Wee%22_Ellis' - Musical Artist
//   'Leon_%22Ndugu%22_Chancler' - Musical Artist
//   'Coltrane_%22Live%22_at_the_Village_Vanguard' - Album
//   'Andy_%22Stoker%22_Growcott' - Musical Artist
//   'The_Complete_%22Is%22_Sessions' - Album
//   'Oscar_Peterson_%2B_Harry_Edison_%2B_Eddie_%22Cleanhead%22_Vinson' - Album
//   'James_%22Tootie%22_Hogan' - Musical Artist
//   'The_Bill_Evans_Trio_%22Live%22' - Album
//   'Jimmy_%22Jammin%27%22_Smith' - Musical Artist
// */



// //works
// var worksRegex = new RegExp(/album\)|albums|ballads|books|comics titles|compositions|dances|discographies|documentaries|episodes|films|grammy award for|jazz standards|live album|magazines|music history|music related lists|musicals|novels|radio programs|songs|singles|soundtracks|television series|video games/, "gi");

// //musicians
// var musiciansRegex = new RegExp(/accordionists|audio engineers|band\)|\(band\) members|band members|bandleaders|baritones|bassists|bassoonists|beatboxers|cellists|choreographers|clarinetists|composers|conductors|dancers|djs|drummers|ensembles|flautists|flugelhornists|frank sinatra|guitarists|harpists|hip hop groups|horn players|instrumentalists|jazz organizations|keyboardist|keyboardists|keytarists|lyricists|mandolinists|mastering engineers|military personnel|music groups|music organizations|musical advocacy groups|musical artist|musical groups|musical quartets|musician\)|musicians|occupations in music|orchestra members|percussionists|performers|pianists|production companies|rappers|recordings artists|record labels|records artists|record producers|rock groups|saxophonists|singer\)|singers|songwriters|sopranos|trombonists|trumpeters|tubists|violinists|vibraphonists/, "gi");

// //people
// var peopleRegex = new RegExp(/actors|actresses|activists|artists|births|biographers|boxing promoters|businesspeople|deaths|directors|dramatists|entertainers|fictional characters|filmmakers|historians|journalists|linguists|models|novelists|painters|passions characters|people from|personalities|playwrights|photographers|poets|politicians|presenters|producers|scientist|sculptors|socialists|sports announcers|surgeon|writers/, "gi");

// //events
// var eventsRegex = new RegExp(/\d{4}s|\d{4} in|annual events|awards|award categories|award ceremony|concert tours|concerts|days of the year|deaths by person|festivals|grammy award|recurring events|world\'s fairs/, "gi");

// //places
// var placesRegex = new RegExp(/buildings|cities|by city|by country|concert halls|districts in the united states|educational institutions |establishments|event venues |districts|districts and streets|hotels|jazz clubs|lincoln center|music venues|neighborhoods in|nightclubs|populated places|recording studios|restaurants|squares in |schools in|stadium|states|streets in|structures|territories|towns|venues|villages|washington\, d\.c\.|upstate new york|five points\, denver/, "gi");

// //genres
// var genresRegex = new RegExp(/australian jazz|british music|cabaret|classical music|counterculture|culture of|culture canon|drums|electro music|electronic organs|ethnic music in|experimental music|film styles|funk|genre|genres|industrial music|instruments|jazz by nationality|jazz terminology|modes|musical scales|musical subcultures|musical techniques|pitched percussion|popular culture|styles of music/, "gi");

// //companies
// var companiesRegex = new RegExp(/companies|headphones manufacturers|subsidiary/, "gi")


// function getSubject(d, callback) {

//   var URL = d.URL;

//   //other
//     //companies
//     //headphones manufacturers
//     //music industry associations
    

//   //---Jimmy_Powell_(musician)


//   var subjectList = pageSubjectObj[URL] || [];

//   if( !URL.toLowerCase().startsWith("draft:") 
//     && !URL.toLowerCase().startsWith("file:")
//     && !URL.toLowerCase().startsWith("portal:")
//     && !URL.toLowerCase().startsWith("talk:")
//     && !URL.toLowerCase().startsWith("user:") 
//     && !URL.toLowerCase().startsWith("user talk:")
//     && !URL.toLowerCase().startsWith("wikipedia:")
//     && !URL.toLowerCase().startsWith("wikipedia talk:")){
//       subjectList.push(URL)
//   }

//   subjectList.push(d.EntityType);

//   var subjectIdentifiers = {
//     works: [],
//     musicians: [],
//     people: [],
//     events: [],
//     places: [],
//     genres: [],
//     companies: []
//   }

//   async.forEach(subjectList, function (subject, cb) {

//     if(subject.match(worksRegex)){
//       subjectIdentifiers.works = subjectIdentifiers.works.concat(subject.match(worksRegex));
//     }
//     if(subject.match(musiciansRegex)){
//       subjectIdentifiers.musicians = subjectIdentifiers.musicians.concat(subject.match(musiciansRegex));
//     }
//     if(subject.match(peopleRegex)){
//       subjectIdentifiers.people = subjectIdentifiers.people.concat(subject.match(peopleRegex));
//     }
//     if(subject.match(eventsRegex)){
//       subjectIdentifiers.events = subjectIdentifiers.events.concat(subject.match(eventsRegex));
//     }
//     if(subject.match(placesRegex)){
//       subjectIdentifiers.places = subjectIdentifiers.places.concat(subject.match(placesRegex));
//     }
//     if(subject.match(genresRegex)){
//       subjectIdentifiers.genres = subjectIdentifiers.genres.concat(subject.match(genresRegex));
//     }
//     if(subject.match(companiesRegex)){
//       subjectIdentifiers.companies = subjectIdentifiers.companies.concat(subject.match(companiesRegex));
//     }

//     async.setImmediate(function() { cb(); });


//   }, function () {
//     callback(subjectIdentifiers);
//   });


// }





// var data;
// var dates;
// var genres;
// var genreObj = {}
// var mentions;
// var imageObj = {};
// var mentionsObj = {};
// var mentionSectionObj = {};
// var locationSubjectObj = {};
// var pageLocationObj = {};
// var pageLinkMappingObj = {};
// var placeObj = {};
// var subjectObj = {};
// var pageSubjectObj = {};
// var mainSubjectObj = {};
// var pageArtistObj = {};
// var artistOfObj = {};

// var nodesObj = {};

// var subjectMentionMappingObj = {
//   works: [],
//   musicians: [],
//   people: [],
//   events: [],
//   places: [],
//   genres: [],
//   companies: [],
//   other: []
// }

// var subjectColors = {
//   works: "#F7CA18", //yellow
//   musicians: "#D91E18", //red
//   people: "#E87E04", //orange
//   events: "#26A65B", //green
//   places: "#9B59B6", //purple
//   genres: "#3498DB", //blue
//   companies: "#BDC3C7",
//   other: "#BDC3C7"
// }

// var containerWidth = 1145;
// var containerHeight = 753;

var containerWidth = 300;
var containerHeight = 600;

var numRectPerRow = 40;
//var rectWidth = 25;
var rectWidth = Math.floor(containerWidth / numRectPerRow);
var rectHeight = rectWidth;
var rectPadding = 2;

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
      .delay(1000)    
      .duration(100)
      .style("opacity", 0);    
  })

  
  var numPerRow = 80;
  var squareWidth = containerWidth / numPerRow;
  var squareHeight = squareWidth;

  function squareCoords(i) {

    return {
      top:  (i % numPerRow) * squareWidth,
      left: Math.floor(i / numPerRow) * squareHeight
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
      .style("border", function(d, i) {
        if(typeof d.artists === "undefined"){
          return "";
        }
        for(var a in d.artists){
          if(d.artists[a].name.match(/miles davis/gi)){
            return "1px solid black";
          }
        }

        return "";
      })
      // .html(function (d, i) { 
      //   var pageName = d.Name;

      //   if(typeof d.artists !== "undefined"){
      //     var spanStyle = "font-weight: bolder"
      //     var artistArray = [];
      //     for(var x in d.artists){
      //       artistArray.push(d.artists[x].name);
      //     }
      //     pageName += `<small><i> by ${artistArray.join(", ")}</i></small>`
      //   }
      //   return `<span style='${spanStyle}'>${pageName}</span>`; 
      // })

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
          .style("top", function (d, i) { return `${(i % numRectPerRow) * (rectWidth + rectPadding)}px`; })
          .style("left", function (d, i) { return `${Math.floor(i / numRectPerRow) * (rectHeight + rectPadding)}px`;})
          .style("color", "black")
          .style("background-image", null)
          .style("opacity", 1)
          .style("background-color", function (d, i) { return subjectColors[d.mainSubjectType] })
          

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
    $("#entity-type-select input:not([value=null]):checked").each(function (j, t) { selectedEntityTypes.push($(t).val()); });

    var selectedMentionHeaders = [];
    var selectedMentionHeadersCount = {};

    $("#section-select input:not([value=null]):checked").each(function (j, a) { 
      selectedMentionHeadersCount[$(a).val()] = [];
      selectedMentionHeaders.push($(a).val()); 
    });

    var searchTerm = $(".search-label input").val().trim();
    var re = new RegExp("\\b" + d3.requote(searchTerm), "i");
  
    var filteredIndexes = data.map(function (a, i) { 

      var useIndex = true;
      if(moreThan500){
        if(parseInt(a.PageViews) < 500){
          useIndex = false;
        }
      }

      if(useIndex){
        if(selectedEntityTypes.indexOf(a.mainSubjectType.toLowerCase()) === -1
          && selectedEntityTypes.indexOf("null") === -1){
          useIndex = false;
        }
      }

      if(useIndex){
        
        useIndex = false;
        selectedMentionHeaders.forEach(function (header) {
        
          if(mentionSectionObj[header].indexOf(a.URL) !== -1){
            useIndex = true;
            if (selectedMentionHeadersCount[header].indexOf(a.URL) === -1){
              selectedMentionHeadersCount[header].push(a.URL) 
            }

          }
        })

        if(selectedMentionHeaders.indexOf("null") !== -1){
          useIndex = true;
        }

      }

      if(useIndex){
        if(searchTerm.length > 2){
          useIndex = re.test(a.Name); 
        }
      }

      return (useIndex? i: -1);

    }).filter(function (a) { return a !== -1});

    $("#node-count").text(filteredIndexes.length)


    for(var sectionHeader in selectedMentionHeadersCount){
      var count = selectedMentionHeadersCount[sectionHeader].length;

      $(`#section-select input[value="${sectionHeader}"]`)
        .closest(".check-button").find("small").html(`(<text>${count}</text>)`);
    }

    // $(`#section-select input:not([value=null])`)
    //   .closest('.checkbox')
    //   .sort(function (a, b) {
    //     return parseInt($(b).find("small text").text()) - parseInt($(a).find("small text").text())
    //   })

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
        .style("top", function (d, i){ 
          var positionIndex = i;
          var index = filteredIndexes.indexOf(i);
          
          if(index !== -1){
            positionIndex = index;
          }
          return `${(positionIndex % numRectPerRow) * (rectWidth + rectPadding)}px`; 
        })
        .style("left", function (d, i){ 
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
    console.log("--------------------")
    console.log(d);
    var image = d.imageURL;

    var imageHTML = "";

    if(typeof image !== "undefined" && image !== "undefined"){
      imageHTML = `<img src="http:${image}" style="width: 100px; float: left; margin: 10px"/>`;
    }

    var mentionHTML = "";

    if(typeof mentionsObj[d.URL] !== "undefined"){
      mentionHTML = mentionsObj[d.URL].map(function (m) {
        return `<h4>${m.sectionHeader}</h4>${m.quote.replace(/Miles Davis/gi, "<b>Miles Davis</b>")}`;
      }).join("");
    }

    var pageName = d.Name;
    if(typeof d.artists !== "undefined"){
      var artistArray = [];
      for(var x in d.artists){
        artistArray.push(d.artists[x].name);
      }
      pageName += `<small><i> <br>by ${artistArray.join(", ")}</i></small>`
    }

    if(typeof d.years !== "undefined"){
      var years = [];
      for(var x in d.years){
        years.push(d.years[x]);
      }
      pageName += `<br><small><i> <br>${years.join(", ")}</i></small>`
    }


    tooltip.transition()    
        .duration(200)    
        .style("opacity", 1);   

    tooltip.html(
        `<table>
          <tbody>
            <tr>
              <td>
                <h4>${pageName}</h4>
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

    var filterContainer = $(this).closest(".circle-filter")
    var containerId = $(filterContainer).attr("id");
    var value = $(this).val();

    if(value === "null"){
      
      $(`#${containerId} input`).prop("checked", $(this).is(":checked")) 
      
    } else {

      var allSelected = ($(`#${containerId} input:not([value=null]):checked`).length === $(`#${containerId} input:not([value=null])`).length)
      $(`#${containerId} input[value=null]`).prop("checked", allSelected) 
     
    }

      
    if(containerId === "entity-type-select"){

      $("#section-select input:not([value=null])").closest(".check-button").hide();

      var selectedSubjectTypes = $("#entity-type-select input:not([value=null]):checked");

      var visibleSections = [];
      selectedSubjectTypes.each(function(i, subjectType) {
        var subjectVal = $(subjectType).val();

        for(var x in subjectMentionMappingObj[subjectVal]){
          if(visibleSections.indexOf(subjectMentionMappingObj[subjectVal][x]) === -1){
            visibleSections.push(subjectMentionMappingObj[subjectVal][x])
          }
        }

      });

      var visibleSectionsSelector = visibleSections.map(function(sectionHeader) {
        return `#section-select input[value="${sectionHeader}"]`;
      }).join(", ");

      $(visibleSectionsSelector).closest(".check-button").show();

    }

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

function inDecade(d) {

  var thisDecade = parseInt(currentDecadeHeader);
  var isInDecade = false;
  for(var y in d.years){
    var matchedYears = d.years[y].match(/\d{4}/gi);
    if(matchedYears){
      for(var m in matchedYears){
        var thisMatchedYear = parseInt(matchedYears[m]);
        if(parseInt(thisMatchedYear / 10) * 10 === thisDecade){
          isInDecade = true;
        }
      }
    }
  }
  return isInDecade;
}


function drawDecades(){
  var topDecadeHeader = $(`.decade-header[data-decade='${currentDecadeHeader}']`);
  
  var filteredIndexes = data.map(function (d, i) { 
    return (inDecade(d)? i: -1);

  }).filter(function (a) { return a !== -1});


  nodeContainer
    .classed("hidden", function (d, i){
      return !inDecade(d);
    })
    .on("mouseover", function (d, i){
      mouseoverEnabled(d, inDecade(d));
    })
    .transition() 
      .duration(800)
      .style("top", function (d, i){ 
          var positionIndex = i;
          var index = filteredIndexes.indexOf(i);
          
          if(index !== -1){
            positionIndex = index;
          }
          return `${topDecadeHeader.offset().top - 230 + 
            ((positionIndex % numRectPerRow) * (rectWidth + rectPadding))}px`; 
        })
        .style("left", function (d, i){ 
          var positionIndex = i;
          var index = filteredIndexes.indexOf(i);
          
          if(index !== -1){
            positionIndex = index;
          }
          return `${Math.floor(positionIndex / numRectPerRow) * (rectHeight + rectPadding)}px`;
        })

      // .style("top", function (d, i){ 
      //   return `${topDecadeHeader.offset().top - 230 + (0.1 * i)}px`; 
      // });


}

var currentDecadeHeader = null;
var subjects;

$(document).ready(function(){

  loadData(function() {
    
      drawCircles();
      initialiseFilters();
      
      var decades = ["1950", "1960", "1970", "1980", "1990", "2000", "2010"];

      for(var d in decades){
        $("#decade-container").append(`
          <div 
            class='decade-header'
            style='height: 500px; width: 100%' 
            id='${decades[d]}-header' data-decade='${decades[d]}'>
              <hr>
              <h1>${decades[d]}s</h1>
          </div>
        `);
      }

      $(document).on("scroll", function() {

        if($(window).scrollTop() < 600){
          if(currentDecadeHeader !== null){
            redrawCircles();
            currentDecadeHeader = null;
          }

        } else {
          var visibleHeaders = []

          $(".decade-header").each(function(i, h) { 
            if($(h).offset().top + 200 > $(window).scrollTop()){
              visibleHeaders.push(h)
            }
          });

          if(visibleHeaders.length > 0){
            if($(visibleHeaders[0]).data("decade") !== currentDecadeHeader){
              currentDecadeHeader = $(visibleHeaders[0]).data("decade");
              drawDecades();
            }
          }

        }
      })
  })
  // async.series({
  //   getImageData: function (cb) {
  //     d3.tsv(`./../data/d3-data-obj-image.tsv`, function(error, imageData) {
  //       if (error) throw error;
        
  //       imageObj = {};
  //       imageData.forEach(function (d) { 
  //         imageObj[d["Page URL"]] = d["image URL"];
  //       })

  //       cb();
  //     });
  //   },
  //   getSubjects: function (cb) {
  //     d3.tsv(`./../data/d3-data-obj-subject.tsv`, function(error, subjectData) {
  //       if (error) throw error;

  //       subjects = subjectData;
  //       subjectData.forEach(function (d) { 
  //         var subject = d.Value
  //                     .replace(/(.)+\:/, "")
  //                     .replace(/[\_|\-]+/g, " ").toLowerCase();
  //         if(typeof subjectObj[subject] === "undefined"){
  //          subjectObj[subject] = 0;
  //         }
  //         subjectObj[subject]++;

  //         if(typeof pageSubjectObj[d.URL] === "undefined"){
  //           pageSubjectObj[d.URL] = [];
  //         }
          
  //         pageSubjectObj[d.URL].push(subject)
  //       })

  //       cb();
  //     });
  //   },
  //   getArtist: function (cb) {
  //     d3.tsv(`./../data/d3-data-obj-music.tsv`, function(error, artistData) {
  //       if (error) throw error;

  //       artistData.forEach(function (d) { 

  //         var artistURL = d.Value.replace(/(.)+\:/, "");
  //         var artist = artistURL.replace(/[\_|\-]+/g, " ");

  //         if(typeof pageArtistObj[d.URL] === "undefined"){
  //           pageArtistObj[d.URL] = [];
  //         }
          
  //         pageArtistObj[d.URL].push({
  //           value: d.Value,
  //           name: artist
  //         });

  //         if(typeof artistOfObj[artistURL] === "undefined"){
  //           artistOfObj[artistURL] = [];
  //         }

  //         artistOfObj[artistURL].push(d.URL);

  //       });


  //       cb();
  //     });
  //   },
  //   getMetaDataLinks: function (cb) {
  //     d3.tsv(`./../data/d3-data-obj-url-link.tsv`, function(error, linkData) {
  //       if (error) throw error;

  //       var connectionAttr = [];
  //       linkData.forEach(function (d) { 
          
  //         var attr = d.Attr.replace(/(.)+\:/, "")
  //                       //.replace(" of", "")
  //                       .toLowerCase();

  //         if(attr !== "subject"){

  //           if(connectionAttr.indexOf(attr) === -1){
  //             connectionAttr.push(attr) 
  //           }

  //           if(typeof pageLinkMappingObj[d.URL] === "undefined"){
  //             pageLinkMappingObj[d.URL] = {};
  //           } 

  //           if(typeof pageLinkMappingObj[d.URL][attr] === "undefined"){
  //             pageLinkMappingObj[d.URL][attr] = [];
  //           }
            
  //           if(pageLinkMappingObj[d.URL][attr].indexOf(d.Value) === -1){
  //             pageLinkMappingObj[d.URL][attr].push(d.Value)
  //           }
  //         }

  //       }); 

  //       // console.log(pageLinkMappingObj)
  //       // console.log(connectionAttr.sort())

  //       cb();
  //     });
  //   },
  //   getDatesData: function (cb) {
  //     d3.tsv(`./../data/d3-data-obj-dates.tsv`, function(error, datesData) {
  //       if (error) throw error;
  //       dates = datesData;

  //       var dateObj = {};
  //       dates.forEach(function (d) { 
  //         var dateAttr = d.DateAttr.replace(/(.)+\:/, "").replace(/[\_|\-]+/g, " ").toLowerCase();
  //         if(typeof dateObj[dateAttr] === "undefined"){
  //          dateObj[dateAttr] = 0;
  //         }
  //         dateObj[dateAttr]++
  //       })

  //       var popularDates = Object.keys(dateObj).sort(function (a, b) { return dateObj[b] - dateObj[a] });
  //       // console.log(popularDates.length)
  //       // console.log(popularDates)

  //       cb();
  //     });
  //   },
  //   getGenreData: function (cb) {
  //       d3.tsv(`./../data/d3-data-obj-genres.tsv`, function(error, genreData) {
  //         if (error) throw error;
  //         genres = genreData;

  //         genreObj = {};
  //         genres.forEach(function (d) { 
  //           if(typeof genreObj[d.URL] === "undefined"){
  //            genreObj[d.URL] = {};
  //           }

  //           var genreAttr = d.GenreAttr.replace(/(.)+\:/, "");
  //           var val = d.Genre.replace(/(.)+\:/, "");

  //           if(typeof genreObj[d.URL][genreAttr] === "undefined"){
  //             genreObj[d.URL][genreAttr] = [];
  //           }
  //           if(genreObj[d.URL][genreAttr].indexOf(val) === -1){
  //             genreObj[d.URL][genreAttr].push(val)
  //           }
  //         })

  //         // console.log(popularGenres.length)
  //         // console.log(popularGenres)
  //         cb();
  //       });
  //     },
  //     // getType: function (cb) {
  //     //   d3.tsv(`./../data/d3-data-obj-types.tsv`, function(error, typeData) {
  //     //     if (error) throw error;
  //     //     types = typeData;

  //     //     var typeObj = {};
  //     //     types.forEach(function (d) { 
  //     //       var rdfType = d.Value
  //     //                   //.replace(/(.)+\:/, "")
  //     //                   .replace(/[\_|\-]+/g, " ").toLowerCase();
  //     //       if(typeof typeObj[rdfType] === "undefined"){
  //     //        typeObj[rdfType] = 0;
  //     //       }
  //     //       typeObj[rdfType]++
  //     //     })

  //     //     var popularTypes = Object.keys(typeObj).sort(function (a, b) { return typeObj[b] - typeObj[a] });
  //     //     // console.log(popularTypes.length)
  //     //     // console.log(popularTypes.map(function (t) { return `${typeObj[t]}\t${t}\n`}).join(""))

  //     //     cb();
  //     //   });
  //     // },
  //   getFrom: function (cb) {
  //     d3.tsv(`./../data/d3-data-obj-from.tsv`, function(error, fromData) {
  //       if (error) throw error;
  //       froms = fromData;

  //       locationSubjectObj = {};
  //       placeObj = {};
  //       froms.forEach(function (d) { 

  //         var parts = d.Value.replace(/(.)+\:/, "").toLowerCase().split("_from_");

  //         if(typeof locationSubjectObj[parts[0]] === "undefined"){
  //          locationSubjectObj[parts[0]] = [];
  //         }
  //         locationSubjectObj[parts[0]].push(d);

  //         var place = parts[1].replace(/(.)+\,/, "").replace(/\_/g, " ").trim();

  //         if(typeof placeObj[place] === "undefined"){
  //          placeObj[place] = [];
  //         }
  //         placeObj[place].push(d);

  //         if(typeof pageLocationObj[d.URL] === "undefined"){
  //           pageLocationObj[d.URL] = [];
  //         }

  //         if(pageLocationObj[d.URL].indexOf(place) === -1){
  //           pageLocationObj[d.URL].push(place);

  //         }
         
  //       })

  //       console.log(locationSubjectObj);
  //       console.log(placeObj);

  //       cb();
  //     });
  //   },
  //   getPageData: function (cb) {
  //     d3.tsv(`./../data/d3-data-obj.tsv`, function(error, pageData) {
  //       if (error) throw error;
      
  //       data = pageData;
        
  //       var subjectIdentifierCount = {
  //         works: 0,
  //         musicians: 0,
  //         people: 0,
  //         events: 0,
  //         places: 0,
  //         genres: 0,
  //         companies: 0,
  //         other: 0
  //       }

  //       async.forEach(data, function(d, cb1) { 

  //         d.imageURL = imageObj[d.URL];
  //         d.subjects = pageSubjectObj[d.URL];
  //         d.years = [];
  //         d.associatedYears = [];


  //         if(typeof pageLinkMappingObj[d.URL] !== "undefined"){
  //           d.otherPageLinks = pageLinkMappingObj[d.URL];
  //         }

  //         if(typeof pageArtistObj[d.URL] !== "undefined"){
  //           d.artists = pageArtistObj[d.URL];
  //         }
  //         if(typeof artistOfObj[d.URL] !== "undefined"){
  //           d.artistsOf = artistOfObj[d.URL];
  //         }
  //         if(typeof pageLocationObj[d.URL] !== "undefined"){
  //           d.locations = pageLocationObj[d.URL]
  //         }


  //         function addToDecades (subjects, yearsAttr){
  //           for(var x in subjects){
  //             var subject = subjects[x];

  //             if(subject.match(/\d{4}/gi) && !subject.match(/birth|death|disestablish|set in( the)* \d{2}/gi)){
  //               d[yearsAttr].push(subject);
  //             }
  //           }
  //         }

  //         addToDecades(d.subjects, "years");

  //         var associatedSubjectURLs = [];

  //         if(typeof d.artistsOf !== "undefined"){
  //           for(var x in d.artistsOf){
  //             var worksURL = d.artistsOf[x];
  //             if(associatedSubjectURLs.indexOf(worksURL) === -1){
  //               associatedSubjectURLs.push(worksURL)
  //             }
  //           }
  //         }

  //         if(typeof d.artists !== "undefined"){
  //           for(var x in d.artists){
  //             var worksURL = d.artists[x];
  //             if(associatedSubjectURLs.indexOf(worksURL) === -1){
  //               associatedSubjectURLs.push(worksURL)
  //             }
  //           }
  //         }

  //         if(typeof d.otherPageLinks !== "undefined"){
  //           for(var x in d.otherPageLinks){
  //             for(var y in d.otherPageLinks[x]){
  //               var worksURL = d.otherPageLinks[x][y];
  //               if(associatedSubjectURLs.indexOf(worksURL) === -1){
  //                 associatedSubjectURLs.push(worksURL)
  //               }
  //             }
  //           }
  //         } 

  //         for(var x in associatedSubjectURLs){
  //           var worksURL = associatedSubjectURLs[x];
  //            addToDecades(pageSubjectObj[worksURL], "associatedYears");
  //         }

  //         getSubject(d, function(subjectIdentifiers){ 
  //           d.subjectIdentifiers = subjectIdentifiers;

  //           var mostIdentifiers = Object.keys(subjectIdentifiers)
  //                                   .filter(function(sub){
  //                                     return subjectIdentifiers[sub].length > 0;
  //                                   }).sort((a, b) => { return subjectIdentifiers[b].length - subjectIdentifiers[a].length});

  //           d.mainSubjectType = "other";
  //           if(mostIdentifiers.length > 0){

  //             d.mainSubjectType = mostIdentifiers[0];

  //             if(d.mainSubjectType === "people" && subjectIdentifiers["musicians"].length > 0){
  //               d.mainSubjectType = "musicians";
  //             }

  //           } 

  //           for(var x in subjectIdentifiers){
  //             if(x.match(d.EntityType, "gi")){
  //               d.mainSubjectType = x;
  //             }
  //           }

  //           mainSubjectObj[d.URL] = d.mainSubjectType;

  //           subjectIdentifierCount[d.mainSubjectType]++;   
  //           async.setImmediate(function() { cb1(); });
  //         });

  //       }, function() {

  //         var typeOrder = ["musicians", "works", "people", "genres", "events", "places", "companies", "other"]
  //         data = data.sort(function (a, b) { 

  //           if(a.mainSubjectType !== b.mainSubjectType){
  //             return typeOrder.indexOf(a.mainSubjectType) - typeOrder.indexOf(b.mainSubjectType);
  //           } else {
  //             if(a.mainSubjectType === "works"){
  //               if(typeof a.artists === "undefined" && typeof b.artists !== "undefined"){
  //                 return 1;
  //               }
  //               if(typeof b.artists === "undefined" && typeof a.artists !== "undefined"){
  //                 return -1;
  //               }
  //             }
  //             return parseInt(b.PageViews) - parseInt(a.PageViews); 
  //           }

  //         });

  //         Object.keys(subjectIdentifierCount).sort(function (a, b) { 
  //           return subjectIdentifierCount[b] - subjectIdentifierCount[a] 
  //         })
  //         .forEach(function (subject) {
  //           $("#entity-type-select")
  //              .append($(
  //               `<div class="check-button">
  //                 <label>
  //                   <input value='${subject}' type='checkbox' checked/> 
  //                   <span>${subject} <small>(${subjectIdentifierCount[subject]})</small> </span>
  //                 </label>
  //               </div>`)) ; 
  //         });

  //         cb();

  //       });

  //     });
  //   },
  //   getMentionData: function (cb) {
  //     d3.tsv(`./../data/d3-data-obj-mentions.tsv`, function(error, mentionData) {
  //       if (error) throw error;
  //       mentions = mentionData;

  //       mentions = mentions.sort(function (a, b) { 
  //         if(parseInt(a.sectionIndex) === parseInt(b.sectionIndex)){
  //           return parseInt(a.wordCountBeforeSection) - parseInt(b.wordCountBeforeSection);
  //         } 
  //         return parseInt(a.sectionIndex) - parseInt(b.sectionIndex)
  //       });
        
  //       mentions.forEach(function (d) {
  //         if(typeof mentionsObj[d.URL] === "undefined"){
  //           mentionsObj[d.URL] = [];
  //         }
  //         mentionsObj[d.URL].push(d);

  //         var sectionHeader = d.sectionHeader.replace(/[^a-z|A-Z|0-9|\s]/gi, "").toLowerCase();
  //         if(sectionHeader.trim().length === 0) {
  //           sectionHeader = "first paragraph";
  //         }

  //         if(typeof mentionSectionObj[sectionHeader] === "undefined"){
  //           mentionSectionObj[sectionHeader] = [];
  //         }

  //         if(mentionSectionObj[sectionHeader].indexOf(d.URL) === -1){
  //           mentionSectionObj[sectionHeader].push(d.URL);
  //         }

  //         var mainSubjectType = mainSubjectObj[d.URL];

  //         if(typeof subjectMentionMappingObj[mainSubjectType] !== "undefined"){
  //           if(subjectMentionMappingObj[mainSubjectType].indexOf(sectionHeader) === -1 ){
  //             subjectMentionMappingObj[mainSubjectType].push(sectionHeader);
  //           }
  //         }
  //       });

  //       Object.keys(mentionSectionObj)
  //         .filter(function(a) { return mentionSectionObj[a].length > 3 })
  //         .sort(function (a, b) { 
  //           return mentionSectionObj[b].length - mentionSectionObj[a].length; 
  //         })
  //         .forEach(function (sectionHeader) {
  //           $("#section-select")
  //             .append($(
  //               `<div class="check-button">
  //                 <label>
  //                   <input value='${sectionHeader}' type='checkbox' checked/> 
  //                   <span>${sectionHeader} 
  //                     <small>(${mentionSectionObj[sectionHeader].length})</small> 
  //                   </span>
  //                 </label>
  //               </div>`));
  //         });


  //       cb();
  //     });
  //   },
  //   done: function () {
  //     drawCircles();

  //     initialiseFilters();
      


  //     var decades = ["1950", "1960", "1970", "1980", "1990", "2000", "2010"];

  //     for(var d in decades){
  //       $("#decade-container").append(`
  //         <div 
  //           class='decade-header'
  //           style='height: 500px; width: 100%' 
  //           id='${decades[d]}-header' data-decade='${decades[d]}'>
  //             <hr>
  //             <h1>${decades[d]}s</h1>
  //         </div>
  //       `);
  //     }

  //     $(document).on("scroll", function() {

  //       if($(window).scrollTop() < 600){
  //         if(currentDecadeHeader !== null){
  //           redrawCircles();
  //           currentDecadeHeader = null;
  //         }

  //       } else {
  //         var visibleHeaders = []

  //         $(".decade-header").each(function(i, h) { 
  //           if($(h).offset().top + 200 > $(window).scrollTop()){
  //             visibleHeaders.push(h)
  //           }
  //         });

  //         if(visibleHeaders.length > 0){
  //           if($(visibleHeaders[0]).data("decade") !== currentDecadeHeader){
  //             currentDecadeHeader = $(visibleHeaders[0]).data("decade");
  //             drawDecades();
  //           }
  //         }

  //       }
  //     })

  //   }
  // })



});

