
var sectionHeaderNames = [];
var entityTypes = []//["musicians", "works", "people", "genres", "events", "places", "companies", "other"];
var visScrollEvents = [];

var visualisations = [];
var numVisualisations = 2;

var sectionScrollProgress = 0;

var controller = new ScrollMagic.Controller();

var layoutType = [ "bubble", /*"picture", "grid",*/ "decade"/*, "decade_split"*/];
var layoutIndex = 0;

var chartWidth = 710;
var chartHeight = 700;

var bubbleWidth = 500;
var bubbleHeight = 500;

var numPerColumn = 60;
var nodeHeight = 4;
var padding = 1;

var isPicture = false;

var scrollEntityTypePosition = null;
var scrollSectionHeader = null;


function d3_layout_packSort(a, b) {
	return parseInt(b.PageViews) - parseInt(a.PageViews);
	// var aVal = 0;
	// var bVal = 0;
	// if(typeof associatedLinksToObj[a["Page Id"]] !== "undefined"){
	// 	aVal = associatedLinksToObj[a["Page Id"]].length;
	// }
	// if(typeof associatedLinksToObj[b["Page Id"]] !== "undefined"){
	// 	bVal = associatedLinksToObj[b["Page Id"]].length;
	// }
 // 	return bVal - aVal;
};

var PageViewScale = d3.scale.linear().domain([1,4062937]).range([1,4000]).clamp(true)
var mostConnectedScale = d3.scale.linear().domain([1, 574]).range([1,4000]).clamp(true)

var bubble = d3.layout.pack()
  .size([500, 500])
	.value(function(d,i) {
	if(i == 0){
		// console.log(d);
	}
	return PageViewScale(parseInt(d.PageViews));

		// var val = 0;
		// if(typeof associatedLinksToObj[d["Page Id"]] !== "undefined"){
		// 	val = associatedLinksToObj[d["Page Id"]].length;
		// }
		// return mostConnectedScale(val)
	})
	// .value(function(d) { return 10;})
	// .sort(null)
  .sort(d3_layout_packSort)
  .padding(10)
  ;

var ease = d3.ease('cubic-in-out');
var timeScale = d3.scale.linear()
	.domain([0, 1000])
	.range([0,1]);

var minYear = 1930;
var yearsXScale = d3.scale.linear().domain([minYear, 2016]).range([10, chartWidth - 10])
var decadeTypeLabels = [];

function drawCanvas() {

	for(var v = 0; v < visualisations.length; v++){

		var vis = visualisations[v];

		var context = vis.context;
		var chart = vis.chart;
		//var layoutMode = layoutType[layoutIndex];

		var layoutMode = "";

		if(v === 0){
			layoutMode = "bubble";
		} else if (v === 1){
			layoutMode = "decade"
		}
	  context.clearRect(0, 0, chart.attr("width"), chart.attr("height"));

	  if(["decade", "decade_split"].indexOf(layoutMode) !== -1) {

	  	var decadeHeightPadding = 0;

	  	if(layoutMode === "decade_split"){
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
	  		context.moveTo(yearsXScale(x) -10 , 300);
				context.lineTo(yearsXScale(x) -10, chartHeight - 165 + decadeHeightPadding);
				context.stroke();
				context.closePath();

				context.fillStyle = "white";
				context.textAlign = "center";
				context.fillText(x +"s", yearsXScale(x)+ 30, chartHeight - 165 + decadeHeightPadding);

	  	}


	  }

	  vis.circles
	  	.style("background-color", function(d, i) {
	  		var layout = d.layout[layoutMode];
	  		var backgroundColor = "";

	  		if(layout.hidden){
		    	backgroundColor = "rgba(0,0,0,0)";
		    } else {
		    	if(layoutMode === "picture"){
		    		backgroundColor = "whitesmoke";

		    	} else {
		    		backgroundColor =	subjectColors[d.subject];
		    		if(layoutMode === "bubble"){
	    				backgroundColor = "white";
	    			}
	    			if(scrollEntityTypePosition !== null){
	    				var entityTypeFilter = entityTypeFilters[scrollEntityTypePosition];

	    				backgroundColor =
					    	( entityTypeFilter.highlight(d)?
					    		subjectColors[d.subject] :
					    		"rgba(255,255,255,0.4)");
	    			}

		    		if(scrollSectionHeader !== null) {
		    			if(mentionSectionObj[scrollSectionHeader].indexOf(d["Page Id"]) !== -1){
		    				backgroundColor = "white";
		    			} else {
		    				backgroundColor = "rgba(255,255,255,0.4)";
		    			}
		    		}
			    }
			  }

	  		return backgroundColor;
	  	})


	  // var elements = vis.dataContainer.selectAll("custom.rect");
	  // elements.each(function(d) {

	  // 	var layout = d.layout[layoutMode];
	  //   var node = d3.select(this);

	  //  // context.beginPath();

	  //   var nodeRadius = layout.r;
	  //   if(layout.hidden){
	  //   	context.fillStyle = "rgba(0,0,0,0)";
	  //   } else {
	  //   	if(layoutMode === "picture"){
	  //   		context.fillStyle = "whitesmoke";

	  //   	} else {
	  //   		context.fillStyle =	subjectColors[d.subject];
	  //   		if(layoutMode === "bubble"){
   //  				context.fillStyle = "white";
   //  			}
	  //   		if(scrollEntityType !== null){
			// 			context.fillStyle =
			// 	    	(scrollEntityType === d.subject ?
			// 	    		subjectColors[d.subject] :
			// 	    		"rgba(255,255,255,0.4)");
	  //   		}
	  //   		if(scrollSectionHeader !== null) {
	  //   			if(mentionSectionObj[scrollSectionHeader].indexOf(d["Page Id"]) !== -1){
	  //   				context.fillStyle = "white";
	  //   			} else {
	  //   				context.fillStyle = "rgba(255,255,255,0.4)";
	  //   			}
	  //   		}
		 //    }
		 //    context.beginPath();
		 //    context.arc(layout.x, layout.y, layout.r, 0, 2 * Math.PI, false);
		 //    context.fill();
		 //    context.closePath();

	  //   }
	  // });

	}



}

function drawDataBinding() {

	for(var x = 1; x <= numVisualisations; x++) {
		var layoutMode = "";

		if(x === 1){
			layoutMode = "bubble";
		} else if (x === 2){
			layoutMode = "decade"
		}

	  var xMax = d3.max(data.map(function(d) { return d.layout[layoutMode].x })) + 50;
	  var yMax = d3.max(data.map(function(d) { return d.layout[layoutMode].y })) + 50;

		var base = d3.select("#vis-" + x);

		base
			.style("width", xMax + "px")
			.style("height", yMax + "px")
			.on("mousemove",function(d,i){
				var coordinates = d3.mouse(this);
				d3.select(".tooltip-container")
					.style("top",function(d){
						return coordinates[1] + 20 + "px";
					})
					.style("left",function(d){
						return coordinates[0] + 20 + "px";
					})
					;
			})
			;

		// var chart = base.append("canvas")
		// 		.style("width", xMax + 'px')
		// 	  .style("height", yMax + 'px')
		// 	  .attr("width", xMax)
		// 	  .attr("height", yMax)
		// 		.style("position", "absolute")
		// 		;

		var tooltip = base.append("div")
		  .attr("class", "tooltip-container hidden")
		  // .style("opacity", 0)
			;

		// var clips = base.append("svg")
		// 	.style("position", "absolute")
		// 	.style("top", "0px")
		// 	.append("svg:g").attr("id", "point-clips-" + x)
		// 	.selectAll("clipPath")
	  //   .data(data.filter(function(d) { return !d.layout[layoutMode].hidden; }))
	  //   .enter()
		// 	.append("svg:clipPath")
	  //   .attr("id", function(d, i) { return layoutMode+"-clip-"+i;})
	  //   .append("svg:circle")
		// 	;

		// var context = chart.node().getContext("2d");
		// var detachedContainer = document.createElement("custom");
		// var dataContainer = d3.select(detachedContainer);

	  // var voronoi = voronoiLayout(layoutMode)
		//
		// var voronoiGroup = base.append("svg")
		// 		.attr("width", xMax)
		// 		.attr("height", yMax)
		// 		.attr("class", "voronoi-svg")
		// 		.style("position", "absolute")
		// 		.style("top", "0px")
		// 		.append("g")
		// 		.attr("class", "voronoiWrapper")
		// 		.selectAll("path")
		// 		.data(voronoi(data.filter(function(d) { return !d.layout[layoutMode].hidden; }))) //Use vononoi() with your dataset inside
		// 		.enter()
		// 		.append("path")
		// 		;
		//
		// voronoiGroup
		// 	.on("mouseover", showTooltip)
		// 	.on("mouseout",  removeTooltip);

		// var dataBinding = dataContainer.selectAll("custom.rect")
	  //   .data(data, function(d) { return d["Page Id"]; });

		// dataBinding.enter()
	  //   .append("custom")
	  //   .classed("rect", true)
	  //   .attr("r",function(d){
		// 		return d.r;
		// 	})
		// 	;

		var circles = base.append("div")
			.attr("class",function(d){
				if(x==1){
					return "first-chart-data";
				}
				return "second-chart-data";
			})
			.selectAll("div")
			.data(data,function(d){
				return d.page_id;
			})
  		.enter()
			.append("div")
			.attr("class", function(d){
				if(x==1){
					return "node-first-chart " + d.subject;
				}
				return "node-second-chart " + d.subject;
			})
			// .attr("id", function(d, i) { return layoutMode + "-" + d["Page Id"] })
			.style("position", "absolute")
			.style("width", function(d, i) {
	  		var layout = d.layout[layoutMode];
	  		return (layout.r * 2) + "px";
	  	})
	  	.style("height", function(d, i) {
	  		var layout = d.layout[layoutMode];
	  		return (layout.r * 2) + "px";
	  	})
	  	.style("left", function(d, i) {
	  		var layout = d.layout[layoutMode];
	  		return (layout.x - layout.r) + "px";
	  	})
	  	.style("top", function(d, i) {
	  		var layout = d.layout[layoutMode];
	  		return (layout.y - layout.r) + "px";
	  	})
			.on("mouseover", showTooltip)
			.on("mouseout",  removeTooltip);
			;

		// visualisations.push({
		// 	base: base,
		// 	// chart: chart,
		// 	tooltip: tooltip,
		// 	clips: clips,
		// 	// context: context,
		// 	// detachedContainer: detachedContainer,
		// 	// dataContainer: dataContainer,
		// 	voronoiGroup: voronoiGroup,
		// 	circles: circles
		// });

			function drawFilters(){
				if(x==1){

					for(var itemNumber = 0; itemNumber < entityTypeFilters.length; itemNumber++){

						var typeCount = data.filter(function(d){ return entityTypeFilters[itemNumber].highlight(d); }).length;

						d3.select(".first-chart-prose").append("div")
							.attr("class","first-chart-text-section")
							.html(
								'<h1 class="first-chart-section-head">' + entityTypeFilters[itemNumber].name + " <small>" + ((typeCount / data.length) * 100).toFixed(0) + "% of Pages <small>(" + typeCount + ' pages)</small> </small></h1>'
								+ '<p class="first-chart-section-text">In 2006, Davis was inducted into the Rock and Roll Hall of Fame,[2] which recognized him as "one of the key figures in the history of jazz"</p>'
							);

						//please use d3 for creating elements moving forward;
						var firstChartFilters = d3.select(".first-chart-container").select(".filter-items")
							.append("div")
							.datum({name:entityTypeFilters[itemNumber].name,entityNumber:itemNumber})
							// .attr("href","#")
							.attr("class","first-chart-filter")
							.attr("data-entity-type-filter-index",itemNumber)
							.text(entityTypeFilters[itemNumber].name)
							.on("click",function(d){
								d3.select(".first-chart-data").classed("filtered-recording",true);
							})
							;

						// $(".first-chart-filter").each(function(i, f) {
						// 	$(f).on("click", function(e){
						//
						// 		// e.preventDefault();
						// 		// var scrollEvent = visScrollEvents[0];
						// 		// var startPosition = scrollEvent.scrollEvent.triggerPosition();
						// 		// var progress = i / entityTypeFilters.length;
						// 		// controller.scrollTo(startPosition + (progress * 700) + 1)
						// 		// controller.update(true);
						// 	});
						// })
					}
				}
				else if(x==2){

					sectionHeaderNames = Object.keys(mentionSectionObj).filter(function(m) {
						return mentionSectionObj[m].length > 3
					}).sort(function(a, b) { return mentionSectionObj[b].length - mentionSectionObj[a].length });
					//
					for( var sectionItem in sectionHeaderNames) {

						d3.select(".second-chart-container").select(".filter-items")
							.append("div")
							.datum({name:entityTypeFilters[sectionItem],entityNumber:sectionItem})
							// .attr("href","#")
							.attr("class","second-chart-filter " + sectionHeaderNames[sectionItem].replace(/ /g, "-"))
							.attr("data-section-header",sectionHeaderNames[sectionItem])
							.text(sectionHeaderNames[sectionItem])
							.on("click",function(d){
								// d3.select(".first-chart-data").classed("filtered-recording",true);
							})
							;
					}

					// $(".second-chart-filter").each(function(i, f) {
					//
					// 	$(f).on("click", function(e){
					// 		e.preventDefault();
					// 		var sectionHeader = $(this).data("section-header");
					// 		var scrollEvent = visScrollEvents[1];
					//
					// 		var filterTypeIndex = sectionHeaderNames.indexOf(sectionHeader);
					// 		var startPosition = scrollEvent.scrollEvent.triggerPosition();
					//
					// 		var progress = filterTypeIndex / sectionHeaderNames.length;
					//
					// 		controller.scrollTo(startPosition + (progress * 700))
					// 		controller.update(true);
					// 	})
					// }
				}
			}

			drawFilters();


	}//for

	// drawCanvas();

}

function voronoiLayout (layoutMode) {

  var xMax = d3.max(data.map(function(d) { return d.layout[layoutMode].x })) + 15;
  var yMax = d3.max(data.map(function(d) { return d.layout[layoutMode].y })) + 15;

  var voronoi = d3.geom.voronoi()
		.x(function(d) {
			var layout = d.layout[layoutMode];
			return layout.x;
		})
		.y(function(d) {
			var layout = d.layout[layoutMode];
			return layout.y;
		})
		.clipExtent([[0, 0], [xMax, yMax]]);

	return voronoi;

}

function updateVoronoi () {

	for(var v = 0; v < visualisations.length; v++){

		var vis = visualisations[v];

		var voronoiGroup = vis.voronoiGroup;
		var clips = vis.clips;

		var layoutMode = "";

		if(v === 0){
			layoutMode = "bubble";
		} else if (v === 1){
			layoutMode = "decade";
		}

		clips
	      .attr('cx', function(d) { return d.layout[layoutMode].x; })
	      .attr('cy', function(d) { return d.layout[layoutMode].y; })
	      .attr('r', 50);

	  $($(".vis-container")[v]).data("layout-mode", layoutMode);


	  // var xMax = d3.max(data.map(function(d) { return d.layout[layoutMode].x })) + 15;
	  // var yMax = d3.max(data.map(function(d) { return d.layout[layoutMode].y })) + 15;

	  // var voronoi = d3.geom.voronoi()
			// .x(function(d) {
			// 	var layout = d.layout[layoutMode];
			// 	return layout.x;
			// })
			// .y(function(d) {
			// 	var layout = d.layout[layoutMode];
			// 	return layout.y;
			// })
			// .clipExtent([[0, 0], [xMax, yMax]]);

	  //$(voronoiGroup).html("");

	  var voronoi = voronoiLayout(layoutMode)


		//Create the Voronoi diagram
		voronoiGroup
			//.selectAll("path")
			// .data(voronoi(data.filter(function(d) { return !d.layout[layoutMode].hidden; }))) //Use vononoi() with your dataset inside
			// .enter().append("path")
			.attr("d", function(d, i) { return "M" + d.join("L") + "Z"; })
			.datum(function(d, i) { return d.point; })
			//Give each cell a unique class where the unique part corresponds to the circle classes
			.attr("class", function(d,i) { return "voronoi " + layoutMode})
			.attr("clip-path", function(d,i) { return "url(#"+layoutMode+"-clip-"+i+")"; })
			.style("stroke", "#2074A0") //I use this to look at how the cells are dispersed as a check

		}

}

function drawChart() {
  drawDataBinding();
	updateVoronoi();
}

//Show the tooltip on the hovered over circle
function showTooltip(d) {

	d3.select(this)
		.style("background-color","red")
		;

	var chartContainer = $(this).closest(".vis-container");
	var chartContainerPosition = chartContainer.offset();
	var layoutMode = chartContainer.data("layout-mode");

	var layout = d.layout[layoutMode];
	var imageHTML = "";

	if(d.imageURL !== null && typeof d.imageURL !== "undefined" && d.imageURL !== "undefined"){
		imageHTML = `<div style='background-image: url("http:${d.imageURL}")' class='voronoi-tooltip-image'/></div>`;
	}

	var mentionsHTML = "";
	if(typeof mentionsObj["page-"+d["page_id"]] !== "undefined"){
		var mentionsBySection = {};
		mentionsObj["page-"+d["page_id"]].forEach(function(m) {
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


	d3.select(".tooltip-container")
		.style("top","0px")
		.style("left","0px")
		.classed("hidden",false)
		.append("div")
		.attr("class","tooltip-content")
		.html(`<span class="voronoi-tooltip">
						 <table>
							<tbody>
								<tr>
									<td>
										${imageHTML}
										<br>
										<b style='color: ${subjectColors[d.subject]}; text-transform: uppercase'>
											${d.subject}
										</b>
										<br>
										<b> ${d.Name} <b>
									</td>
									<td class="quote-container"> ${mentionsHTML} </td>
								</tr>
								${worksRow}
							</tbody>
						</table>
					</span>`)
		;


	// $(this).popover({
	// 	placement: 'auto top', //place the tooltip above the item
	// 	container: "#" + $(chartContainer).attr("id"), //'body', //the name (class or id) of the container
	// 	trigger: 'manual',
	// 	html : true,
	// 	content: function() { //the html content to show inside the tooltip
	// 		return `<span class="voronoi-tooltip">
	// 					 	 <table>
	// 							<tbody>
	// 								<tr>
	// 									<td>
	// 										${imageHTML}
	// 										<br>
	// 										<b style='color: ${subjectColors[d.subject]}; text-transform: uppercase'>
	// 											${d.subject}
	// 										</b>
	// 										<br>
	// 										<b> ${d.Name} <b>
	// 									</td>
	// 									<td class="quote-container"> ${mentionsHTML} </td>
	// 								</tr>
	// 								${worksRow}
	// 							</tbody>
	// 						</table>
	// 					</span>`;
	// 	}
	// }).data('bs.popover').tip().attr('id', 'my-popover');
	//
	// $(this).popover('show');

}//function showTooltip

//Hide the tooltip when the mouse moves away
function removeTooltip() {

	d3.select(this)
		.style("background-color",null)
		;

	d3.select(".tooltip-container")
		.style("top","0px")
		.style("left","0px")
		.classed("hidden",true)
		.select(".tooltip-content")
		.remove()
		;

	// //Hide the tooltip
	// $('.popover').each(function() {
	// 	$(this).remove();
	// });

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

var picturePointWidth = 709,
	picturePointHeight = 406;

function drawIntroPicture() {

		d3.selectAll(".star-filler").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.append("g")
			.selectAll("circle")
			.data(d3.range(600))
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

		d3.selectAll(".star-filler-two").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.append("g")
			.selectAll("circle")
			.data(d3.range(1500))
			.enter()
			.append("circle")
			.attr("fill", function(d,i){
				return "white"
			})
			.attr("cx", function(d){
				return Math.random()*100+"%";
			})
			.attr("cy",function(d){
				return Math.random()*100+"%";
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

		var dotPlot = svgTwo.append("g")
      .selectAll("circle")
      .data(pictureCoords)
      .enter()
			.append("circle")
      .attr("class", function(d,i){
				if(d[2]> 1){
          return "dot-plot circle-plot";
        }
        else if(Math.random()>.4){
          return "dot-plot circle-plot"
        }
        // else if(Math.random()>.5){
				// 	return "circle-plot"
				// 	// return "dot-plot-two circle-plot"
        // }
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
			;

		var dotPlotDots = d3.selectAll(".dot-plot");

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

		function twinkle(){
		  setInterval(function(){
		    dotPlotDots
		      .transition()
		      .duration(5000)
		      .delay(function(d,i){
		        return Math.random()*5000;
		      })
		      .attr("r",0)
		      .transition()
		      .duration(5000)
		      .delay(function(d,i){
		        return Math.random()*5000 + 8000;
		      })
		      .attr("r",function(d,i){
		        return d[2];
		      })
		      ;
		  }, 18000);
		}

		// twinkle();


		// var svgBubble = d3.select("body").append("svg")
	 //    .attr("width", 500)
	 //    .attr("height", 500)
	 //    .attr("class", "bubble")
		// 	;
}

var entityTypeFilters = [
	{
		name: "Mentioned on Miles Davis' page",
		highlight: function(d) { return d.linked_from_miles }
	}, {
		name: "Miles Davis Work",
		highlight: function(d) { return d.miles_work }
	}, {
		name: "Recordings",
		highlight: function(d) { return d.subject === "recording" }
	}, {
		name: "People/Musicians",
		highlight: function(d) { return ["people", "musicians"].indexOf(d.subject) !== -1}
	}, {
		name: "Places",
		highlight: function(d) { return d.subject === "places" }
	}, {
		name: "Other",
		highlight: function(d) { return ["other", "books", "works", "films", "genres"].indexOf(d.subject) !== -1 }
	}
]

$(document).ready(function() {

	drawIntroPicture();

	loadData(function() {

		entityTypes = d3.set(data.map((d) => { return d.subject })).values();

		var root = {
			children: data
		};
		var packData = bubble.nodes(root);
		packData.splice(0, 1);

  	var years = {};
  	var maxYearsByType = 0;
  	var maxYearBase = 0;
  	var entityTypeYears = {};

  	var thisType;

		data = packData.map(function(d, i){

			if(typeof thisType === "undefined"){
				thisType = d.subject;
			}

			if(d.subject !== thisType){

				maxYearsByType = d3.max(Object.keys(entityTypeYears).map(function(y) { return entityTypeYears[y] }));

				decadeTypeLabels.push({
					label: thisType,
					maxYears: maxYearsByType,
					baseLine: maxYearBase
				})
				;

				maxYearBase += maxYearsByType;

			  thisType = d.subject;

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
				"decade_split": decadeSplitLayout,
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

		for (item in data){
			var id = +data[item]["Page Id"].replace("page-","");
			data[item]["page_id"] = id;
			delete data[item]["Page Id"];
		}

		console.log(data);

		drawDataBinding();

		updateVoronoi();
		//
  	// drawCanvas();
		//
  	// removeTooltip();

		function drawThirdChart(){

			var base = d3.select("#vis-3");

			var thirdData = data.filter(function(d,i){
				d.nestCount = i;
				return d.subject === "musicians";
			})
			;

			var thirdDataNest = d3.nest().key(function(d) {
				return Math.floor(d.nestCount/6);
    	})
    	.entries(thirdData.slice(0,48))
			;

			var baseDataShadow = base.append("div")
				.attr("class","third-chart-shadow")
				.selectAll("div")
				.data(thirdData.slice(0,50))
				.enter()
				.append("div")
				.attr("class","third-data-node-shadow")
				.style("left",function(d,i){
					return d.layout.decade_split.x + "px";
				})
				.style("top",function(d,i){
					return d.layout.decade_split.y - 500 + "px";
				})
				;

			var chartThreeProseSub = base.append("div").attr("class","third-chart-body-prose tk-neuzeit-grotesk")
				.text('In 2006, Davis was inducted into the Rock and Roll Hall of Fame,[2] which recognized him as "one of the key figures in the history of jazz".[2] In 2008, his 1959 album Kind of Blue received its fourth platinum certification from the Recording Industry Association of America (RIAA), for shipments of at least four million copies in the United States.[3] On December 15, 2009, the U.S. House of Representatives passed a symbolic resolution recognizing and commemorating the album Kind of Blue on its 50th anniversary, "honoring the masterpiece and reaffirming jazz as a national treasure".');

			var baseDataBindWapper = base.append("div")
				.attr("class","third-chart-data")
				.selectAll("div")
				.data(thirdDataNest)
				.enter()
				.append("div")
				.attr("class",function(d,i){
					if(i==0){
						return "third-data-row third-data-freeze";
					}
					return "third-data-row";
				})
				;

			var baseDataBind = baseDataBindWapper
				.selectAll("div")
				.data(function(d){
					return d.values;
				})
				.enter()
				.append("div")
				.attr("class","third-data-node")
				.style("left",function(d,i){
					return i*150+"px";
				})
				;

			var pinChartShadow = new ScrollMagic.Scene({
					triggerElement: "#trigger-3",
					triggerHook:0,
					offset: 0,
					duration:2000
				})
				.addIndicators({name: "pin 3 chart"}) // add indicators (requires plugin)
				.setPin(".third-chart-shadow", {pushFollowers: false})
				.addTo(controller)
				;

			var objBubble = baseDataBind.append("div")
				.attr("class","third-section-item-bubble")
				.style("background", function(d, i) {
					var imageURL = "";

					if(d.imageURL !== null && typeof d.imageURL !== "undefined" && d.imageURL !== "undefined"){
						imageURL = d.imageURL;
					}
					return `url("http:${imageURL}")`;
				})
				.style("background-size",  "cover")
		    .style("background-position",  "50% 0%")
		    .style("background-repeat",  "no-repeat")
				;

			var objTitle = baseDataBind.append("p")
				.attr("class","third-section-item-title")
				.text(function(d){
					return d.Name;
				})
				;

			var objDesc = baseDataBind.append("p")
				.attr("class","third-section-item-text")
				.text(function(d){
					return mentionsObj["page-"+d["page_id"]][0]["quote"].slice(0,180);
				})
				;

			var circleSizeScale = d3.scale.linear().domain([1,0]).range([5,40]);

			var chartStage = new ScrollMagic.Scene({
					triggerElement: "#trigger-3",
					duration:200,
					triggerHook:0,
					offset:0
				})
			  .addIndicators({name: "stage "}) // add indicators
			  .addTo(controller)
			  .on("enter", function (e) {
					chartThreeProseSub.transition().duration(300).style("opacity",0);
			  })
			  .on("leave",function(e){
					if(e.target.controller().info("scrollDirection") == "REVERSE"){
						chartThreeProseSub.transition().duration(500).style("opacity",1);
						// objDesc.transition().duration(100).style("opacity",1);
						//
						// objBubble
						// 	.transition().duration(300).style("width",40+"px").style("height",40+"px")
						// 	;
						//
						// objTitle.transition().duration(100).style("opacity",1);
					}
					;

			  })
			  .on("progress", function (e) {
			  	var progress = e.progress;
					// baseDataBind
					// 	.style("left",function(d,i){
					// 		var pointOne;
					// 		var pointTwo;
					//
					// 		pointOne = 150 * i;
					// 		pointTwo = d.layout.decade_split.x - (130/2) + 2;
					// 		var scale = d3.scale.linear().domain([0,1]).range([pointOne,pointTwo]).clamp(true);
					// 		return scale(progress)+"px";
					// 	})
					// 	.style("top",function(d,i){
					// 		var pointOne;
					// 		var pointTwo;
					// 		pointOne = 0;
					// 		pointTwo = d.layout.decade_split.y - 730;
					// 		var scale = d3.scale.linear().domain([0,1]).range([pointOne,pointTwo]).clamp(true);
					// 		return scale(progress)+"px";
					// 	})
					// 	;
				})
				;

			$(".third-data-row").each(function(i, c) {
				var pinChartThird = new ScrollMagic.Scene({
						triggerElement: c,
						triggerHook:0,
						offset: -200
						// ,duration:1000
					})
					.addIndicators({name: "transition 3 pin"}) // add indicators (requires plugin)
					.setPin(c, {pushFollowers: false})
					.addTo(controller)
					;

				var moveChartThird = new ScrollMagic.Scene({
						triggerElement: c,
						triggerHook:0,
						offset: -200,
						duration:300
					})
					.addIndicators({name: "transition 3 section"}) // add indicators (requires plugin)
					.addTo(controller)
					.on("enter",function(e){
						if(e.target.controller().info("scrollDirection") == "FORWARD"){
							var objDesc = d3.select(c).selectAll("div").select(".third-section-item-text");
							var objBubble = d3.select(c).selectAll("div").select("div");
							var objTitle = d3.select(c).selectAll("div").select(".third-section-item-title");

							objDesc.transition().duration(100).style("opacity",0);
							objBubble
								.transition().duration(300).style("width",4+"px").style("height",4+"px")
								;
							objTitle.transition().duration(100).style("opacity",0);
						};
					})
					.on("leave",function(e){
						if(e.target.controller().info("scrollDirection") == "REVERSE"){
							var objDesc = d3.select(c).selectAll("div").select(".third-section-item-text");
							var objBubble = d3.select(c).selectAll("div").select("div");
							var objTitle = d3.select(c).selectAll("div").select(".third-section-item-title");

							objDesc.transition().duration(100).style("opacity",1);
							objBubble
								.transition().duration(300).style("width",40+"px").style("height",40+"px")
								;
							objTitle.transition().duration(100).style("opacity",1);
						}
					})
					.on("progress", function (e) {
						var progress = e.progress;

						d3.select(c).selectAll(".third-data-node")
							.style("left",function(d,count){
								var pointOne;
								var pointTwo;
								pointOne = 150 * count;
								pointTwo = d.layout.decade_split.x - (130/2) + 2;
								var scale = d3.scale.linear().domain([0,1]).range([pointOne,pointTwo]).clamp(true);
								return scale(progress)+"px";
							})
							.style("top",function(d,i){
								var pointOne;
								var pointTwo;
								pointOne = 0;
								pointTwo = d.layout.decade_split.y - 700;
								var scale = d3.scale.linear().domain([0,1]).range([pointOne,pointTwo]).clamp(true);
								return scale(progress)+"px";
							})
						// 	;
					})
					;
			})
			;




			// var chartEventThird = new ScrollMagic.Scene({
			// 		triggerElement: "#trigger-3",
			// 		duration:700,
			// 		triggerHook:0,
			// 		offset:-100
			// 	})
			//   .addIndicators({name: "entity type "}) // add indicators
			//   .addTo(controller)
			//   .on("enter", function (e) {
			//
			//   })
			//   .on("leave",function(e){
			//
			//   })
			//   .on("progress", function (e) {
			//   	var progress = e.progress;
			//
			// 		baseDataBind
			// 			.style("left",function(d,i){
			// 				var pointOne;
			// 				var pointTwo;
			//
			// 				pointOne = 150 * i;
			// 				pointTwo = d.layout.decade_split.x - (130/2) + 1;
			// 				var scale = d3.scale.linear().domain([0,1]).range([pointOne,pointTwo]).clamp(true);
			// 				return scale(progress)+"px";
			// 			})
			// 			.style("top",function(d,i){
			// 				var pointOne;
			// 				var pointTwo;
			// 				pointOne = (1-progress)*300;
			// 				pointTwo = d.layout.decade_split.y - 700;
			// 				var scale = d3.scale.linear().domain([0,1]).range([pointOne,pointTwo]).clamp(true);
			// 				return scale(progress)+"px";
			// 			})
			// 			;
			//
			// 		objBubble
			// 			.style("width",circleSizeScale(progress)+"px")
			// 			.style("height",circleSizeScale(progress)+"px")
			// 			;
			//
			// 	})
			// 	;
		}

		drawThirdChart();

		//build thing for each class vis-container
		$(".vis-container").each(function(i, c) {

			var pinOffset = 100;
			var pinDuration = 400;

			if(i === 1){
				pinOffset = -50;
			}

			var pinChart = new ScrollMagic.Scene({
					triggerElement: ".trigger-" + (i + 1),
					triggerHook:0,
					offset: pinOffset,
					duration: pinDuration
				})
				.addIndicators({name: "pin " + i + " chart"}) // add indicators (requires plugin)
				.setPin("#vis-" + (i + 1))
				// .setPin("#vis-" + (i + 1), {pushFollowers: false})
				.addTo(controller)
				;

			var chartEvent = new ScrollMagic.Scene({
					triggerElement: ".trigger-" + (i + 1) ,
					duration:pinDuration,
					triggerHook:0,
					offset:10
				})
			  .addIndicators({name: "entity type "}) // add indicators
			  .addTo(controller)
			  .on("enter", function (e) {
			  	// $(".first-chart-section-head, .first-chart-filter").css("color", "lightgrey");
			  	// drawCanvas();
			  })
			  .on("leave",function(e){
				  scrollEntityTypePosition = null;
				  scrollSectionHeader = null;
			  	// $(".first-chart-section-head, .first-chart-filter").css("color", "lightgrey");
			  	// drawCanvas();
			  })
			  .on("progress", function (e) {
			  	sectionScrollProgress = e.progress
			  	var progress = e.progress;
			  	if(i === 0){
				  	var progressPosition = Math.min(Math.floor(progress * entityTypeFilters.length), entityTypeFilters.length - 1 );


				  	// $(".first-chart-section-head, .first-chart-filter")
				  	// 	// .css("color", "lightgrey")
				  	// 	// .css("font-weight", "normal")
						// 	;

				  	// $(".first-chart-section-head:nth-of-type(" + (progressPosition + 1) + "), .first-chart-filter:nth-of-type(" + (progressPosition + 1) + ")")
				  	// .css("color",  "white")
				  	// .css("font-weight", "bolder");;

				  	if(scrollEntityTypePosition !== progressPosition){

				  		scrollEntityTypePosition = progressPosition;

							if(scrollEntityTypePosition == 3){
								d3.select(".first-chart-data").classed("filtered-recording",true);
							}
							else{
								d3.select(".first-chart-data").classed("filtered-recording",false);
							}
							// drawCanvas();

					  };
					}

					if(i === 1){
					  // var headerProgress = Math.min(Math.round(progress * sectionHeaderNames.length), sectionHeaderNames.length );
					  // var newScrollSectionHeader = sectionHeaderNames[headerProgress];
						//
					  // if(typeof newScrollSectionHeader !== "undefined"){
						// 	$(".second-chart-filter").css("color", "lightgrey").css("font-weight", "normal");
					  // 	$(".second-chart-filter." + newScrollSectionHeader.replace(/ /g, "-")).css("color",  "white").css("font-weight", "bolder");
						//
						//   if(scrollSectionHeader !== newScrollSectionHeader){
						//   	scrollSectionHeader = newScrollSectionHeader;
						//   	drawCanvas();
						//   }
						// }
					}

				})
				;

				// 	visScrollEvents.push({
				// 		pinEvent: pinChart,
				// 		scrollEvent: chartEvent
				// 	});
		});



	})
})
