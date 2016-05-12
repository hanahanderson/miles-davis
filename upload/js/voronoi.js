

var layoutType = [ "bubble", /*"picture", "grid",*/ "decade", "decade-split"];
var layoutIndex = 0;

var chartWidth = 710;
var chartHeight = 700;

var numPerColumn = 60;
var nodeHeight = 4;
var padding = 1;

var isPicture = false;

var scrollEntityType = null;

var base = d3.select("#vis");

base.style("width", chartWidth + "px")
		.style("height", chartHeight + "px")

var chart = base.append("canvas")
		.style("width", chartWidth + 'px')
	  .style("height", chartHeight + 'px')
	  .attr("width", chartWidth)
	  .attr("height", chartHeight)
		.style("position", "absolute")
		.style("top", "80px")
		;


function d3_layout_packSort(a, b) {
	return parseInt(b.PageViews) - parseInt(a.PageViews);
};


var PageViewScale = d3.scale.linear().domain([1,4062937]).range([1,4000]).clamp(true)

var bubble = d3.layout.pack()
  .size([500, 500])
	.value(function(d) { return PageViewScale(parseInt(d.PageViews)); })
  .sort(d3_layout_packSort)
  .padding(10)
  ;

var context = chart.node().getContext("2d");

// Create an in memory only element of type 'custom'
var detachedContainer = document.createElement("custom");

// Create a d3 selection for the detached container. We won't
// actually be attaching it to the DOM.
var dataContainer = d3.select(detachedContainer);

//Initiate a group element to place the voronoi diagram in
var voronoiGroup = base.append("svg")
	.attr("width", chartWidth)
	.attr("height", chartHeight)
	.attr("class", "voronoi-svg")
	.style("position", "absolute")
	.style("top", "80px")
	.append("g")
	.attr("class", "voronoiWrapper")
	;

var ease = d3.ease('cubic-in-out');
var timeScale = d3.scale.linear()
	.domain([0, 1000])
	.range([0,1]);

var minYear = 1930;
var yearsXScale = d3.scale.linear().domain([minYear, 2016]).range([10, chartWidth - 10])
var decadeTypeLabels = [];

function drawCanvas() {


  var layoutMode = layoutType[layoutIndex];
  
  context.clearRect(0, 0, chart.attr("width"), chart.attr("height"));

  if(["decade", "decade-split"].indexOf(layoutMode) !== -1) {

  	var decadeHeightPadding = 0;

  	if(layoutMode === "decade-split"){
  		decadeHeightPadding = 130;

  		for(var l in decadeTypeLabels){
  			var label = decadeTypeLabels[l];
	  		context.fillStyle = subjectColors[label.label];
				//context.textAlign = "center";
				context.fillText(label.label, 
					50, 
					chartHeight - 180 + decadeHeightPadding - ( (label.baseLine + (label.maxYears / 2)) * 5 )); 

  		}

  	}
  	context.beginPath();
		context.strokeStyle = "rgba(255,255,255,0.9)";
		context.moveTo(yearsXScale(1940) -10 , chartHeight - 178 + decadeHeightPadding);
		context.lineTo(yearsXScale(2017) -10, chartHeight - 178 + decadeHeightPadding);
		context.stroke();
		context.closePath();

  	for(var x = 1940; x < 2020; x+= 10){
  		context.beginPath();
  		context.strokeStyle = "rgba(255,255,255,0.3)";
  		context.moveTo(yearsXScale(x) -10 , 0);
			context.lineTo(yearsXScale(x) -10, chartHeight - 165 + decadeHeightPadding);
			context.stroke();
			context.closePath();

			context.fillStyle = "white";
			context.textAlign = "center";
			context.fillText(x +"s", yearsXScale(x)+ 30, chartHeight - 165 + decadeHeightPadding); 

  	}


  }

  var elements = dataContainer.selectAll("custom.rect");
  elements.each(function(d) {

  	var layout = d.layout[layoutMode];
    var node = d3.select(this);

   // context.beginPath();

    var nodeRadius = layout.r;
    if(layout.hidden){
    	context.fillStyle = "rgba(0,0,0,0)";
    } else {
    	if(layoutMode === "picture"){
    		context.fillStyle = "whitesmoke";

    	} else {
    		context.fillStyle =	subjectColors[d.mainSubjectType];
	    	// context.fillStyle =
	    	// (scrollEntityType === null || scrollEntityType === d.mainSubjectType?
	    	// 	subjectColors[d.mainSubjectType] :
	    	// 	"rgba(255,255,255,0.4)");
	    }
	    context.beginPath();
	    context.arc(layout.x, layout.y, layout.r, 0, 2 * Math.PI, false);
	    context.fill();
	    context.closePath();

    }
  });

}

function drawDataBinding() {

  var dataBinding = dataContainer.selectAll("custom.rect")
    .data(data, function(d) { return d.URL; });

	dataBinding.enter()
    .append("custom")
    .classed("rect", true)
    .attr("r",function(d){
			return d.r;
		})
		;

	drawCanvas();

}


function updateVoronoi () {

  var layoutMode = layoutType[layoutIndex];
  
  var voronoi = d3.geom.voronoi()
		.x(function(d) { 
			var layout = d.layout[layoutMode];
			return layout.x; 
		})
		.y(function(d) { 
			var layout = d.layout[layoutMode];
			return layout.y; 
		})
		.clipExtent([[0, 0], [chart.attr("width"), chart.attr("height")]]);

  $(".voronoiWrapper").html("")
	//Create the Voronoi diagram
	voronoiGroup.selectAll("path")
		.data(voronoi(data.filter(function(d) { return !d.layout[layoutMode].hidden; }))) //Use vononoi() with your dataset inside
		.enter().append("path")
		.attr("d", function(d, i) { return "M" + d.join("L") + "Z"; })
		.datum(function(d, i) { return d.point; })
		//Give each cell a unique class where the unique part corresponds to the circle classes
		.attr("class", function(d,i) { return "voronoi " })
		//.style("stroke", "#2074A0") //I use this to look at how the cells are dispersed as a check
		.on("mouseover", showTooltip)
		.on("mouseout",  removeTooltip);
}

function drawChart() {

	// data = data.map(function(d, i){
	// 	var picturePoint = pictureCoords[i];
	// 	d.x = picturePoint[0];
	// 	d.y = picturePoint[1];
	// 	d.r = picturePoint[2];
	// 	d.hidden = false;
	// 	return d;
	// });
  drawDataBinding();
	updateVoronoi();
}

//Show the tooltip on the hovered over circle
function showTooltip(d) {
	var imageHTML = "";

	if(d.imageURL !== null && typeof d.imageURL !== "undefined" && d.imageURL !== "undefined"){
		imageHTML = `<div style='background-image: url("http:${d.imageURL}")' class='voronoi-tooltip-image'/></div>`;
	}

	var mentionsHTML = "";
	if(typeof mentionsObj[d.URL] !== "undefined"){
		var mentionsBySection = {};
		mentionsObj[d.URL].forEach(function(m) {
			if(typeof mentionsBySection[m.sectionHeader] === "undefined"){
				mentionsBySection[m.sectionHeader] = [];
			}
			mentionsBySection[m.sectionHeader].push(m);
		});

		for(var s in mentionsBySection){
			mentionsHTML += `<div class="section-header-name"> Wiki Section: <b>${s}</b> </div> <br>`;
			for(var m in mentionsBySection[s]){
				mentionsHTML += mentionsBySection[s][m].quote.replace(/Miles Davis/gi, "<b>Miles Davis</b>") + "<br>";
			}
			if(Object.keys(mentionsBySection).length > 1) {
				mentionsHTML += "<hr>";
			}
		}
	}

	var worksRow = "";
	if(typeof d.artistsOf !== "undefined") {
		var works = data.filter(function(a) { return d.artistsOf.indexOf(a.URL) !== -1 })
										.sort(function(a, b) { return a.Name < b.Name });

		var worksHTML = "<br>";
		for(var w in works){

			var workImage = "";
			if(works[w].imageURL !== null && 
				typeof works[w].imageURL !== "undefined" 
				&& works[w].imageURL !== "undefined"){
				workImage = `<div style='background-image: url("http:${works[w].imageURL}")' class='voronoi-tooltip-image works-image'/></div>`;
			}

			worksHTML += `<tr>
										<td>${workImage} </td>
										<td><b class='works-name'>${works[w].Name}</b></td>
									</tr>`;
		}

		worksRow = `<tr>
								<td colspan="2" class="works-list"> 
									<table>
										${worksHTML} 
									<table>
								</td>
							</tr>`;
	}

	$(this).popover({
		placement: 'auto top', //place the tooltip above the item
		container: '#vis', //the name (class or id) of the container
		trigger: 'manual',
		html : true,
		content: function() { //the html content to show inside the tooltip
			return `<span class="voronoi-tooltip">
						 	 <table>
								<tbody>
									<tr>
										<td> 
											${imageHTML}
											<br>
											<b> ${d.Name} <b>
										</td>
										<td class="quote-container"> ${mentionsHTML} </td>
									</tr>
									${worksRow}
								</tbody>
							</table>
						</span>`; 
		}
	});
	$(this).popover('show');
}//function showTooltip

//Hide the tooltip when the mouse moves away
function removeTooltip() {
	//Hide the tooltip
	$('.popover').each(function() {
		$(this).remove();
	});
}//function removeTooltip

function getYear (yearsArray){
	if(yearsArray.length === 0) {
		return null;
	}

	for(var y in yearsArray){
		var matchedYears = yearsArray[y].match(/\d{4}/gi);
    if(matchedYears){
    	var thisMatchedYear = parseInt(matchedYears[0]);
      var thisDecade = (parseInt(thisMatchedYear / 10) * 10);
      if(thisDecade > minYear){
      	return thisMatchedYear;
      }
    }
	}

	return null;

}

var isDecadeHistogram = false;

$("#transform-to-decades").on("click", function() {

	layoutIndex ++;
	if(layoutIndex >= layoutType.length){
		layoutIndex = 0;
	}

	updateVoronoi();
	drawDataBinding();

});



$(document).ready(function() {
	loadData(function() {

		var picturePointWidth = 709,
				picturePointHeight = 406;

		d3.selectAll(".star-filler").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.append("g")
			.selectAll("circle")
			.data(d3.range(300))
			.enter()
			.append("circle")
			.attr("fill", function(d,i){
				return "white"
			})
			.attr("cx", function(d){
				return Math.ceil(Math.random()*100)+"%";
			})
			.attr("cy",function(d){
				return Math.ceil(Math.random()*100)+"%";
			})
			.attr("r",function(d){
				return Math.random();
			})
			;

		var svgTwo = d3.select(".intro-vis-miles")
  		.append("svg")
    	.attr("width", picturePointWidth)
    	.attr("height", picturePointHeight)
    	.attr("class", "picture-point")
			;

		var voronoi = d3.geom.voronoi()
			.x(function(d, i) { return pictureCoords[i][0]; })
			.y(function(d, i) { return pictureCoords[i][1]; })
			.clipExtent([[0, 0], [picturePointWidth, picturePointHeight]]);

		//Create the Voronoi diagram
			d3.select(".intro-vis-miles")
	  		.append("svg")
	  		.attr("class", "intro-voroni-picture")
	    	.attr("width", picturePointWidth)
	    	.attr("height", picturePointHeight)
    	.selectAll("path")
				.data(voronoi(data)) //Use vononoi() with your dataset inside
			.enter()
			.append("path")
				.attr("d", function(d, i) { return "M" + d.join("L") + "Z"; })
				.datum(function(d, i) { return d.point; })
				//Give each cell a unique class where the unique part corresponds to the circle classes
				.attr("class", function(d,i) { return "voronoi " })
				.style("stroke", "#2074A0") //I use this to look at how the cells are dispersed as a check
				.on("mouseover", showTooltip)
				.on("mouseout",  removeTooltip);


		var dotPlot = svgTwo.append("g")
      .selectAll("circle")
      .data(pictureCoords)
      .enter()
			.append("circle")
      .attr("class", function(d,i){
				if(d[2]> 1){
          return "dot-plot circle-plot";
        }
        else if(Math.random()>.75){
          return "dot-plot circle-plot"
        }
        else if(Math.random()>.5){
					return "circle-plot"
					// return "dot-plot-two circle-plot"
        }
				return "circle-plot"
      })
      .attr("cx", function(d){
        return d[0];
      })
      .attr("cy",function(d){
        return d[1];
      })
      .attr("r",function(d){
        return d[2]
      })

		

		//var dotPlotDots = d3.selectAll(".dot-plot");

		// dotPlotDots
		// 	.transition()
		// 	.duration(5000)
		// 	.delay(function(d,i){
		// 		return Math.random()*5000;
		// 	})
		// 	.attr("r",0)
		// 	.transition()
		// 	.duration(5000)
		// 	.delay(function(d,i){
		// 		return Math.random()*5000 + 8000;
		// 	})
		// 	.attr("r",function(d,i){
		// 		return d[2];
		// 	})
		// 	;

		// function twinkle(){
		//   setInterval(function(){
		//     dotPlotDots
		//       .transition()
		//       .duration(5000)
		//       .delay(function(d,i){
		//         return Math.random()*5000;
		//       })
		//       .attr("r",0)
		//       .transition()
		//       .duration(5000)
		//       .delay(function(d,i){
		//         return Math.random()*5000 + 8000;
		//       })
		//       .attr("r",function(d,i){
		//         return d[2];
		//       })
		//       ;
		//   }, 18000);
		// }

		// twinkle();


		// var svgBubble = d3.select("body").append("svg")
	 //    .attr("width", 500)
	 //    .attr("height", 500)
	 //    .attr("class", "bubble")
		// 	;

		var root = {
			children: data
		};
		var packData = bubble.nodes(root);
		packData.splice(0, 1);
		// var node = svgBubble.selectAll(".node")
  //     .data(packData)
  //   	.enter()
		// 	.append("circle")
  //     .attr("cx", function(d) {
		// 		return d.x;
		// 	})
		// 	.attr("cy", function(d) {
		// 		return d.y;
		// 	})
		// 	.style("fill","white")
		// 	.attr("r", function(d) { return d.r; })
		// 	;

  	var years = {};
  	var maxYearsByType = 0;
  	var maxYearBase = 0;
  	var entityTypeYears = {};

  	var thisType;
		data = packData.map(function(d, i){

			if(typeof thisType === "undefined"){
				thisType = d.mainSubjectType;
			}


			if(d.mainSubjectType !== thisType){

				maxYearsByType = d3.max(Object.keys(entityTypeYears).map(function(y) { return entityTypeYears[y] }));
				decadeTypeLabels.push({
					label: thisType,
					maxYears: maxYearsByType,
					baseLine: maxYearBase
				});

				maxYearBase += maxYearsByType;


			  thisType = d.mainSubjectType;
				
				entityTypeYears = {};
			}



			var decadeLayout = { hidden: true };
			var decadeSplitLayout = { hidden: true};
			var matchedYear = getYear(d.years);

			if(matchedYear === null){
				matchedYear = getYear(d.associatedYears);
			}
			d.year = matchedYear;

			if(matchedYear !== null){
				d.hidden = false;
	      if(typeof years[matchedYear] === "undefined"){
	      	years[matchedYear] = 0;
	      }
				years[matchedYear]++;

				decadeLayout = {
					x: yearsXScale(matchedYear),
					y: chartHeight - ((years[matchedYear] * 5) + 180),
					r: 2,
					hidden: false
				}

				if(typeof entityTypeYears[matchedYear] === "undefined"){
	      	entityTypeYears[matchedYear] = 0;
	      }
				entityTypeYears[matchedYear]++;

				decadeSplitLayout = {
					x: yearsXScale(matchedYear),
					y: chartHeight - ((entityTypeYears[matchedYear] * 5 ) + 50 + (maxYearBase* 5)),
					r: 2,
					hidden: false
				}
			}

			d.layout = {
				picture: {
					x: pictureCoords[i][0],
					y: pictureCoords[i][1],
					r: pictureCoords[i][2],
					hidden: false
				},
				bubble: {
					x: d.x,
					y: d.y,
					r: d.r,
					hidden: false
				},
				decade: decadeLayout,
				"decade-split": decadeSplitLayout,
				grid: {
					x: (Math.floor(i / numPerColumn) * (nodeHeight + 2)) + 11,
					y: ((i % numPerColumn) * (nodeHeight + 2)) + 11,
					r: nodeHeight / 2,
					hidden: false
				}
			};
			return d;
		});

		decadeTypeLabels.push({
			label: thisType,
			maxYears: maxYearsByType,
			baseLine: maxYearBase
		});

		drawDataBinding();
		updateVoronoi();

  	drawCanvas();


  	removeTooltip();

		var controller = new ScrollMagic.Controller();

		// var pictureEvent = new ScrollMagic.Scene({
		// 		triggerElement: "#trigger-1",
		// 		duration:400,
		// 		triggerHook:0,
		// 		offset: -200
		// 	})
		//   .addIndicators({name: "picture"}) // add indicators
		//   .addTo(controller)
		//   .on("enter", function (e) {
		//   	isPicture = true;
		//   	$(".voronoiWrapper").hide();
		//   	removeTooltip();
		//
		// 		data = data.map(function(d, i){
		// 			var picturePoint = pictureCoords[i];
		// 			d.x = picturePoint[0];
		// 			d.y = picturePoint[1];
		// 			d.r = picturePoint[2];
		//
		// 			d.hidden = false;
		//
		// 			return d;
		// 		});
		//
		// 		//d3.timer(drawCanvas);
		// 		drawCanvas();
		//
		//   })
		//   .on("leave", function (e) {
		//   	isPicture = false;
		//   })
		// 	;

		// var chartEvent = new ScrollMagic.Scene({
		// 		triggerElement: "#trigger-2",
		// 		duration:400,
		// 		triggerHook:0,
		// 		offset:200
		// 	})
		//   .addIndicators({name: "thing"}) // add indicators
		//   .addTo(controller)
		//   .on("enter", function (e) {
		//
		// 		isPicture = false;
		//   	$(".voronoiWrapper").show();
		//
		// 		data = data.map(function(d, i){
		// 			d.r = nodeHeight / 2;
		// 			d.y = ((i % numPerColumn) * (nodeHeight + 2)) + 11;
		// 			d.x = (Math.floor(i / numPerColumn) * (nodeHeight + 2)) + 11;
		// 			d.hidden = false;
		//
		// 			return d;
		// 		});
		//   	updateVoronoi();
		//
		//   	d3.select("#vis")
		//   		.style("position", "fixed");
		//
		//   	drawCanvas();
		//   })
		//   .on("leave",function(e){
		//   	d3.select("#vis")
		// 	  		.style("position", "relative");
		// 	  scrollEntityType = null;
		// 	  $("#section-header").html("");
		//
		//   	drawCanvas();
		//   })
		//   .on("progress", function (e) {
		//   	var entityTypes = ["musicians", "works", "people", "genres", "events", "places", "companies", "other"];
		//
		//   	var progress = e.progress;
		//   	var progressPosition = Math.round(progress * entityTypes.length);
		//
		//   	var newScrollEntityType = entityTypes[progressPosition];
		//
		//   	if(scrollEntityType !== newScrollEntityType){
		//
		//   		scrollEntityType = newScrollEntityType
		//
		// 	  	drawCanvas();
		//
		// 		  $("#section-header")
		// 		  	.html(scrollEntityType)
		// 		  	.css("color", subjectColors[scrollEntityType])
		// 		  	;
		//
		// 	  }
		// 	});

	})
})
