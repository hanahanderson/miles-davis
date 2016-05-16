
var entityTypes = ["musicians", "works", "people", "genres", "events", "places", "companies", "other"];
var visScrollEvents = [];


var controller = new ScrollMagic.Controller();

var layoutType = [ "bubble", /*"picture", "grid",*/ "decade", "decade_split"];
var layoutIndex = 0;

var chartWidth = 710;
var chartHeight = 700;

var bubbleWidth = 500;
var bubbleHeight = 500;

var numPerColumn = 60;
var nodeHeight = 4;
var padding = 1;

var isPicture = false;

var scrollEntityType = null;

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

var base = d3.select("#vis-1");

base.style("width", bubbleWidth + "px")
		.style("height", bubbleHeight + "px")

var chart1 = base.append("canvas")
		.style("width", bubbleWidth + 'px')
	  .style("height", bubbleHeight + 'px')
	  .attr("width", bubbleWidth)
	  .attr("height", bubbleHeight)
		.style("position", "absolute")
		;

var base2 = d3.select("#vis-2");

base2.style("width", bubbleWidth + "px")
		.style("height", bubbleHeight + "px")

var chart2 = base2.append("canvas")
		.style("width", chartWidth + 'px')
	  .style("height", chartHeight + 'px')
	  .attr("width", chartWidth)
	  .attr("height", chartHeight)
		.style("position", "absolute")
		;

var context1 = chart1.node().getContext("2d");
var context2 = chart2.node().getContext("2d");

// Create an in memory only element of type 'custom'
var detachedContainer1 = document.createElement("custom");
var detachedContainer2 = document.createElement("custom");

// Create a d3 selection for the detached container. We won't
// actually be attaching it to the DOM.
var dataContainer1 = d3.select(detachedContainer1);
var dataContainer2 = d3.select(detachedContainer2);

//Initiate a group element to place the voronoi diagram in
var voronoiGroup1 = base.append("svg")
	.attr("width", bubbleWidth)
	.attr("height", bubbleHeight)
	.attr("class", "voronoi-svg")
	.style("position", "absolute")
	.style("top", "0px")
	.append("g")
	.attr("class", "voronoiWrapper")
	;

var voronoiGroup2 = base2.append("svg")
	.attr("width", chartWidth)
	.attr("height", chartHeight)
	.attr("class", "voronoi-svg")
	.style("position", "absolute")
	.style("top", "0px")
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

	var contexts = [context1, context2];
	var charts = [chart1, chart2];

	for(var c = 0; c < contexts.length; c++){
		var context = contexts[c];
		var chart = charts[c]
		//var layoutMode = layoutType[layoutIndex];

		var layoutMode = "";

		if(c === 0){
			layoutMode = "bubble";
		} else if (c === 1){
			layoutMode = "decade_split"
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
	  		context.moveTo(yearsXScale(x) -10 , 0);
				context.lineTo(yearsXScale(x) -10, chartHeight - 165 + decadeHeightPadding);
				context.stroke();
				context.closePath();

				context.fillStyle = "white";
				context.textAlign = "center";
				context.fillText(x +"s", yearsXScale(x)+ 30, chartHeight - 165 + decadeHeightPadding);

	  	}


	  }

	  var elements = dataContainer1.selectAll("custom.rect");
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
	    		if(scrollEntityType === null){
	    			if(layoutMode === "bubble"){
	    				context.fillStyle = "white";
	    			}
	    		} else {
						context.fillStyle =
				    	(scrollEntityType === d.mainSubjectType ?
				    		subjectColors[d.mainSubjectType] :
				    		"rgba(255,255,255,0.4)");
	    		}

		    }
		    context.beginPath();
		    context.arc(layout.x, layout.y, layout.r, 0, 2 * Math.PI, false);
		    context.fill();
		    context.closePath();

	    }
	  });



	}



}

function drawDataBinding() {

	var dataContainers = [dataContainer1, dataContainer2]
	for(var x in dataContainers){
		var dataContainer = dataContainers[x];

		var dataBinding = dataContainer.selectAll("custom.rect")
	    .data(data, function(d) { return d.URL; });

		dataBinding.enter()
	    .append("custom")
	    .classed("rect", true)
	    .attr("r",function(d){
				return d.r;
			})
			;

	}

	drawCanvas();

}

function updateVoronoi () {


	var voronoiGroups = [voronoiGroup1, voronoiGroup2];

	for(var v = 0; v < voronoiGroups.length; v++){
		var voronoiGroup = voronoiGroups[v];

		var layoutMode = "";

		if(v === 0){
			layoutMode = "bubble";
		} else if (v === 1){
			layoutMode = "decade_split"
		}

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

	  $(voronoiGroup).html("")
		//Create the Voronoi diagram
		voronoiGroup.selectAll("path")
			.data(voronoi(data.filter(function(d) { return !d.layout[layoutMode].hidden; }))) //Use vononoi() with your dataset inside
			.enter().append("path")
			.attr("d", function(d, i) { return "M" + d.join("L") + "Z"; })
			.datum(function(d, i) { return d.point; })
			//Give each cell a unique class where the unique part corresponds to the circle classes
			.attr("class", function(d,i) { return "voronoi " })
			// .style("stroke", "#2074A0") //I use this to look at how the cells are dispersed as a check
			.on("mouseover", showTooltip)
			.on("mouseout",  removeTooltip);

		}

}

function drawChart() {
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
		container: 'body', //the name (class or id) of the container
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

var picturePointWidth = 709,
				picturePointHeight = 406;

function drawIntroPicture() {

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
			;

		var dotPlotDots = d3.selectAll(".dot-plot");

		// dotPlot
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
		    dotPlot
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

function thirdChart(){

}


$(document).ready(function() {

	drawIntroPicture();

	loadData(function() {


		// var voronoi = d3.geom.voronoi()
		// 	.x(function(d, i) { return pictureCoords[i][0]; })
		// 	.y(function(d, i) { return pictureCoords[i][1]; })
		// 	.clipExtent([[0, 0], [picturePointWidth, picturePointHeight]]);

		// //Create the Voronoi diagram
		// 	d3.select(".intro-vis-miles")
	 //  		.append("svg")
	 //  		.attr("class", "intro-voroni-picture")
	 //    	.attr("width", picturePointWidth)
	 //    	.attr("height", picturePointHeight)
  //   	.selectAll("path")
		// 		.data(voronoi(data)) //Use vononoi() with your dataset inside
		// 	.enter()
		// 	.append("path")
		// 		.attr("d", function(d, i) { return "M" + d.join("L") + "Z"; })
		// 		.datum(function(d, i) { return d.point; })
		// 		//Give each cell a unique class where the unique part corresponds to the circle classes
		// 		.attr("class", function(d,i) { return "voronoi " })
		// 		.style("stroke", "#2074A0") //I use this to look at how the cells are dispersed as a check
		// 		.on("mouseover", showTooltip)
		// 		.on("mouseout",  removeTooltip);


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

		drawDataBinding();
		updateVoronoi();

  	drawCanvas();

  	removeTooltip();

  	for(var x in entityTypes){

		  var typeCount = data.filter(function(d){ return d.mainSubjectType === entityTypes[x] }).length;

  		$(".first-chart-prose").append(
			  '<div class="first-chart-text-section">'
					+ '<h1 class="first-chart-section-head ' + entityTypes[x] + '">' + entityTypes[x] + " <small>" + ((typeCount / data.length) * 100).toFixed(0) + "% of Pages <small>(" + typeCount + ' pages)</small> </small></h1>'
					+ '<p class="first-chart-section-text">In 2006, Davis was inducted into the Rock and Roll Hall of Fame,[2] which recognized him as "one of the key figures in the history of jazz"</p>'
				+ '</div>'
  		)

  		$(".filter-items").append("<a href='#' class='first-chart-filter " + entityTypes[x]
	  														+ "' data-entity-type='"+ entityTypes[x] + "'>"
	  															+ entityTypes[x]
	  														+ "</a>");
  	}

  	$(".first-chart-filter").on("click", function(e){

  		e.preventDefault();
  		var entityType = $(this).data("entity-type");
  		var scrollEvent = visScrollEvents[0];

  		var filterTypeIndex = entityTypes.indexOf(entityType);
  		var startPosition = scrollEvent.scrollEvent.triggerPosition();

  		var progress = filterTypeIndex / entityTypes.length;

  		controller.scrollTo(startPosition + (progress * 700))
  		controller.update(true);

  	})

		function drawThirdChart(){

			var base = d3.select("#vis-3");

			var thirdData = data.filter(function(d,i){
				d.nestCount = i;
				return d.EntityType = "musical artist";
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
					return mentionsObj[d.URL][0]["quote"].slice(0,180);
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

			var pinOffset = -100;
			var pinDuration = 700;
			if(i === 1){
				pinOffset = -50;
				pinDuration = 700;
			}

			var pinChart = new ScrollMagic.Scene({
					triggerElement: "#trigger-" + (i + 1),
					triggerHook:0,
					offset: pinOffset,
					duration:pinDuration
				})
				.addIndicators({name: "pin " + i + " chart"}) // add indicators (requires plugin)
				.setPin("#vis-" + (i + 1), {pushFollowers: false})
				.addTo(controller)
				;

			var chartEvent = new ScrollMagic.Scene({
					triggerElement: "#trigger-" + (i + 1) ,
					duration:700,
					triggerHook:0,
					offset:10
				})
			  .addIndicators({name: "entity type "}) // add indicators
			  .addTo(controller)
			  .on("enter", function (e) {
			  	$(".first-chart-section-head, .first-chart-filter").css("color", "lightgrey");
			  	drawCanvas();
			  })
			  .on("leave",function(e){
				  scrollEntityType = null;
			  	$(".first-chart-section-head, .first-chart-filter").css("color", "lightgrey");
			  	drawCanvas();
			  })
			  .on("progress", function (e) {

			  	var progress = e.progress;
			  	var progressPosition = Math.min(Math.round(progress * entityTypes.length), entityTypes.length );

			  	var newScrollEntityType = entityTypes[progressPosition];

			  	$(".first-chart-section-head, .first-chart-filter").css("color", "lightgrey");
			  	$(".first-chart-section-head." + scrollEntityType + ", .first-chart-filter." + scrollEntityType).css("color",  subjectColors[scrollEntityType]);

			  	if(scrollEntityType !== newScrollEntityType){

			  		scrollEntityType = newScrollEntityType;

				  	drawCanvas();

				  }
				})
				;

			 	visScrollEvents.push({
			 		pinEvent: pinChart,
			 		scrollEvent: chartEvent
			 	});
		});



	})
})
