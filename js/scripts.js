window.onload = function() {













// board.addEventListener("click", function(e){
// 	var radius = 1;
// 	var sizeInt = .5
// 	function sizer(){
// 		if (radius === 50.0) {
// 			sizeInt = -.5;
// 		}

// 		radius += sizeInt;

// 		context.beginPath();
// 		context.arc(e.pageX,e.pageY,radius,0,Math.PI*2);
// 		explosions.push(e.pageX)
// 		context.fill();

// 		setTimeout(sizer, 10);
// 	}
// 	sizer();
// });











var board = document.getElementById("game");
var context = board.getContext("2d");
var colors = ['#F22613', '#663399', '#4183D7', '#E87E04', '#F9BF3B', '#22313F'];
var scoreCount = 0;
var balls = [];
width = board.width = 700;
height = board.height = 500;

// create initial data for each ball
function createBalls(num){
	for (i = 0; i < num; i++) {
		balls.push({
			cx: Math.floor(Math.random() * width),
			cy: Math.floor(Math.random() * height),
			radius: 5,
			start: 0,
			end: Math.PI*2,
			color: colors[Math.floor(Math.random() * colors.length)],
			xInt: [1, -1][Math.floor(Math.random() * 2)],
			yInt: [1, -1][Math.floor(Math.random() * 2)]
		})
	}
}

createBalls(100);



// Move balls
function moveBalls(){
	context.clearRect(0,0,width,height);
	for (i = 0; i < balls.length; i++) {
		var arc = balls[i];
		if ( arc.cx === 0 ) {
			arc.xInt = 1;
		} else if ( arc.cx === width ) {
			arc.xInt = -1;
		} else if ( arc.cy === 0 ) {
			arc.yInt = 1;
		} else if ( arc.cy === height ) {
			arc.yInt = -1;
		}

		arc.cx += arc.xInt;
		arc.cy += arc.yInt;

		context.beginPath();
		context.arc(arc.cx,arc.cy, arc.radius, arc.start, arc.end);
		context.fillStyle = arc.color;
		context.fill();
		balls[i] = {
			cx: arc.cx,
			cy: arc.cy, 
			radius: arc.radius, 
			start: arc.start, 
			end: arc.end,
			color: arc.color,
			xInt: arc.xInt,
			yInt: arc.yInt
		}
	}
	if (explosions.length != 0) {
			explosionSize();
	}
}

// Move balls every 10ms
setInterval(moveBalls, 15);


var explosions = [];

board.addEventListener("click", function(e){
	context.beginPath();
	context.arc(e.pageX,e.pageY,1,0,Math.PI*2);
	context.fillStyle = '#000000';
	context.fill();
	explosions.push({
		cx: e.pageX,
		cy: e.pageY,
		radius: 1,
		sizeInt: .5,
		start: 0,
		end: Math.PI*2
	});
});

function explosionSize() {
	for (k = 0; k < explosions.length; k++) {
		var exp = explosions[k];
		sizer(exp);
	}
}

function sizer(exp) {
	if (exp.radius === 50.0) {
		exp.sizeInt = -.5;
	}
	if ( exp.radius < 1) {
		explosions.splice(k, 1);
	} else {
		exp.radius += exp.sizeInt;
		context.beginPath();
		context.arc(exp.cx, exp.cy, exp.radius, 0, Math.PI*2);
		context.fillStyle = '#000000';
		context.fill();
		explosions[k] = ({
			cx: exp.cx,
			cy: exp.cy,
			radius: exp.radius,
			sizeInt: exp.sizeInt,
			start: 0,
			end: Math.PI*2
		});
		checkHit(exp);

	}
}

function checkHit(exp){
	for (j = 0; j < balls.length; j++) {
		var ball = balls[j];
		if (context.isPointInPath(ball.cx, ball.cy)){
			scoreCount = scoreCount + 1;
			console.log(scoreCount);
			document.getElementById('score').innerHTML = "" + scoreCount;
			explosions.push({
				cx: ball.cx,
				cy: ball.cy,
				radius: 1,
				sizeInt: .5,
				start: 0,
				end: Math.PI*2
			});
			balls.splice(j, 1);
		}
	}
}







}





