window.onload = function() {

// Global Variables
Random = Math.random;
var board = document.getElementById("game");
var context = board.getContext("2d");

width = board.width = 700;
height = board.height = 500;	


// Clear Board every .01s
setInterval(function(){
	context.clearRect(0,0,width,height);
},10);


// Create n balls
for (i=0; i < 10; i++) {
	moveBall();
}


function moveBall() {
	var x = Math.floor(Math.random() * width),
			y = Math.floor(Math.random() * height),
			xInt = [1, -1][Math.floor(Math.random() * 2)],
			yInt = [1, -1][Math.floor(Math.random() * 2)]



	function setBall(){

		if ( x === 0 ) {
			xInt = 1;
		} else if ( x === width ) {
			xInt = -1;
		} else if ( y === 0 ) {
			yInt = 1;
		} else if ( y === height ) {
			yInt = -1;
		}

		x += xInt;
		y += yInt;
		
		// context.clearRect(0,0,width,height);
		context.beginPath();
		context.arc(x,y,5,0,Math.PI*2);
		context.fill();

		setTimeout(setBall, 10);
	}

	setBall();
}




board.addEventListener("click", function(e){
	var radius = 1;
	var sizeInt = .5
	function sizer(){
		if (radius === 50.0) {
			sizeInt = -.5;
		}

		radius += sizeInt;

		context.beginPath();
		context.arc(e.pageX,e.pageY,radius,0,Math.PI*2);
		context.fill();
		debugger;

		setTimeout(sizer, 10);
	}
	sizer();
});



}


function explosionPixels() {

}

