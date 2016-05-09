

var chartWidth = 700;
var chartHeight = 700;

var base = d3.select("#vis");

base.style("width", chartWidth + "px")
		.style("height", chartHeight + "px")

var chart = base.append("canvas")
						.style("width", chartWidth + 'px')
					  .style("height", chartHeight + 'px')
					  .attr("width", chartWidth)
					  .attr("height", chartHeight)
						.style("position", "absolute")
						.style("top", "80px");

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
	  									.style("position", "absolute")
    									.style("top", "80px")
										.append("g")
											.attr("class", "voronoiWrapper");
										
var ease = d3.ease('cubic-in-out');
var timeScale = d3.scale.linear()
	.domain([0, 1000])
	.range([0,1]);



var minYear = 1930;
var yearsXScale = d3.scale.linear().domain([minYear, 2016]).range([10, chartWidth - 10])


function drawCanvas() {

  // clear canvas
  // context.fillStyle = "rgba(0,0,0,0)";
  // context.rect(0,0,chart.attr("width"),chart.attr("height"));
  // context.fill();
  context.clearRect(0, 0, chart.attr("width"), chart.attr("height"));

  if(isDecadeHistogram) {
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

    if(d.hidden){
    	context.fillStyle = "rgba(0,0,0,0)";
    } else {
    	context.fillStyle = 
    	(scrollEntityType === null || scrollEntityType === d.mainSubjectType? 
    		subjectColors[d.mainSubjectType] :
    		"rgba(255,255,255,0.4)");
    }

    context.beginPath();
		context.moveTo(d.x, d.y);
    //context.rect(node.attr("x"), node.attr("y"), node.attr("size"), node.attr("size"));
    context.arc(d.x, d.y, d.r, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();

  });

 


}

function drawDataBinding() {
  // var scale = d3.scale.linear()
  //   .range([0, 900])
  //   .domain(d3.extent(data.map(function(d){ return d.x })));

  var dataBinding = dataContainer.selectAll("custom.rect")
    .data(data);

  // dataBinding
  //   	.attr("r", 4)
  //   .transition()
  //   .duration(1000)
	 //    .attr("r", 15)
	 //    .attr("fillStyle", "green");

	dataBinding.enter()
    .append("custom")
    .classed("rect", true)
    .attr("r",function(d){ return  d.r })

  // dataBinding.exit()
  //   	.attr("r", 4)
  //   .transition()
  //   .duration(1000)
	 //    .attr("r", 5)
	 //    .attr("fillStyle", "lightgrey");

	drawCanvas();


}

var numPerColumn = 60;
var nodeHeight =8;
var padding = 1;

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
    .style("stroke", "rgba(255,255,255,0.2)")
    .style("stroke-width", "0.5px")
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", showTooltip)
		.on("mouseout",  removeTooltip);
}

function drawChart() {
	// drawCustom([1,2,13,20,23]);

	// // uncomment this, to see the transition~
	// drawCustom([1,2,12,16,20]);

	data = data.map(function(d, i){
		d.r = nodeHeight / 2;
		d.y = ((i % numPerColumn) * (nodeHeight + 2)) + 11;
		d.x = (Math.floor(i / numPerColumn) * (nodeHeight + 2)) + 11;
		d.hidden = false;

		return d;
	});

	updateVoronoi();

	d3.timer(drawDataBinding);
}

var scrollEntityType = null;
var controller = new ScrollMagic.Controller();

var event = new ScrollMagic.Scene({
	triggerElement: "#trigger-1",
	duration:400,
	triggerHook:0, 
	offset:10})
  .addIndicators({name: "expand"}) // add indicators
  .addTo(controller)
  .on("enter", function (e) {
  	// d3.select("#vis")
  	// 	.style("position", "fixed");
  })
  .on("leave",function(e){
  	// d3.select("#vis")
	  // 		.style("position", "relative");
	  scrollEntityType = null;
	  $("#section-header").html("");
  })
  .on("progress", function (e) {
  	var entityTypes = ["musicians", "works", "people", "genres", "events", "places", "companies", "other"];

  	var progress = e.progress;
  	var progressPosition = Math.round(progress * entityTypes.length);

  	scrollEntityType = entityTypes[progressPosition];

	  $("#section-header")
	  	.html(scrollEntityType)
	  	.css("color", subjectColors[scrollEntityType])
	  	;
	});


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

});

$(document).ready(function() {
	loadData(function() {
		drawChart();
	})
})

