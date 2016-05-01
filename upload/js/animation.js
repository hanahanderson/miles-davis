$(document).ready(() => {
	console.log("hello")


	var numPerRow = 80;
	var containerWidth = 1145;
	var containerHeight = 753;
	var squareWidth = containerWidth / numPerRow;
	var squareHeight = squareWidth;

	for(var x = 0; x < 4000; x++){
		var left = (x % numPerRow) * squareWidth;
		var top = Math.floor(x / numPerRow) * squareHeight;
		$("#grid").append(
			`<div 
				class="grid-item"
				style="
							width: ${squareWidth}px; 
							height: ${squareWidth}px; 
							left: ${left}px;
							top: ${top}px;
							background-size: 1145px 753px ;
							background-position:-${left}px -${top}px "></div>`
		)
	};



})