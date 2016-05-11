
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
	return b.PageViews - a.PageViews;
};


var PageViewScale = d3.scale.linear().domain([1,4062937]).range([1,4000]).clamp(true)

var bubble = d3.layout.pack()
  .size([500, 500])
	.value(function(d) { return PageViewScale(d.PageViews); })
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


function drawCanvas() {

  context.clearRect(0, 0, chart.attr("width"), chart.attr("height"));

  if(isDecadeHistogram && !isPicture) {
  	for(var x = 1940; x < 2020; x+= 10){
  		context.beginPath();
  		context.strokeStyle = "white"
  		context.moveTo(yearsXScale(x) -10 , 50);
			context.lineTo(yearsXScale(x) -10, chartHeight - 180);
			context.stroke();
			context.closePath();
  	}
  }

  var elements = dataContainer.selectAll("custom.rect");
  elements.each(function(d) {
    var node = d3.select(this);

    context.beginPath();

    var nodeRadius = d.r;
    if(d.hidden){
    	context.fillStyle = "rgba(0,0,0,0)";
    } else {
    	if(isPicture){
    		context.fillStyle = "whitesmoke";

    	} else {
	    	context.fillStyle =
	    	(scrollEntityType === null || scrollEntityType === d.mainSubjectType?
	    		subjectColors[d.mainSubjectType] :
	    		"rgba(255,255,255,0.4)");
	    }
    }
    context.beginPath();
    context.arc(d.x, d.y, nodeRadius, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
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

  var voronoi = d3.geom.voronoi()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; })
		.clipExtent([[0, 0], [chart.attr("width"), chart.attr("height")]]);

  $(".voronoiWrapper").html("")
	//Create the Voronoi diagram
	voronoiGroup.selectAll("path")
		.data(voronoi(data.filter(function(d) { return !d.hidden; }))) //Use vononoi() with your dataset inside
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

	data = data.map(function(d, i){
		var picturePoint = pictureCoords[i];
		d.x = picturePoint[0];
		d.y = picturePoint[1];
		d.r = picturePoint[2];
		d.hidden = false;
		return d;
	});
  drawDataBinding();
	updateVoronoi();
}

//Show the tooltip on the hovered over circle
function showTooltip(d) {
	$(this).popover({
		placement: 'auto top', //place the tooltip above the item
		container: '#vis', //the name (class or id) of the container
		trigger: 'manual',
		html : true,
		content: function() { //the html content to show inside the tooltip
			return "<span style='font-size: 11px; text-align: center;'>" + d.Name + "</span>"; }
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

	isDecadeHistogram = !isDecadeHistogram;

	if(isDecadeHistogram){
		var years = {};

		data = data.map(function(d) {

			d.hidden = true;

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

	      d.x = yearsXScale(matchedYear);
				years[matchedYear]++;
				d.y = chartHeight - ((years[matchedYear] * 4) + 180);
				d.r = 2
			}

			return d;
		});
	} else {
		data = data.map(function(d, i){
			d.r = nodeHeight / 2;
			d.y = ((i % numPerColumn) * (nodeHeight + 2)) + 11;
			d.x = (Math.floor(i / numPerColumn) * (nodeHeight + 2)) + 11;
			d.hidden = false;

			return d;
		});
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

		drawDataBinding();
  	isPicture = true;
  	$(".voronoiWrapper").hide();
  	removeTooltip();

		var svgBubble = d3.select("body").append("svg")
	    .attr("width", 500)
	    .attr("height", 500)
	    .attr("class", "bubble")
			;

			console.log(data);

		var root = {};
    root.children = data;
		var packData = bubble.nodes(root);
		packData.splice(0, 1);

		var node = svgBubble.selectAll(".node")
      .data(packData)
    	.enter()
			.append("circle")
      .attr("cx", function(d) {
				return d.x;
			})
			.attr("cy", function(d) {
				return d.y;
			})
			.style("fill","white")
			.attr("r", function(d) { return d.r; })
			;


		isPicture = false;
  	$(".voronoiWrapper").show();

		data = data.map(function(d, i){
			d.r = nodeHeight / 2;
			d.y = ((i % numPerColumn) * (nodeHeight + 2)) + 11;
			d.x = (Math.floor(i / numPerColumn) * (nodeHeight + 2)) + 11;
			d.hidden = false;
			return d;
		});

		updateVoronoi();

  	drawCanvas();

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
