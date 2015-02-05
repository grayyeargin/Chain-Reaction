window.onload = function() {

// create global variables for DOM elements
var board = document.getElementById("game");
var context = board.getContext("2d");
var gameOptions = document.getElementById("game-options");
var nextLevelButton = document.getElementById('next-level');
var playAgainButton = document.getElementById('play-again');
var levelEl = document.getElementById("level");
var hitsLeftEl = document.getElementById('hits-left');
var scoreEl = document.getElementById('score');
var gameOptionButton = document.getElementById('finished-remark');

// global variables for game play
var colors = ['#bc13fe', '#FF9933', '#7FFF00', '#00BFFF', '#FF0000'];
var explosionColors = ['rgba(127, 255, 0, 0.6)', 'rgba(25, 181, 254, 0.6)', 'rgba(249, 191, 59, 0.6)', 'rgba(188, 19, 254, 0.6)'];
var sassyLossComments = ["Bummer dude... You lost", "Try getting more 'splosions next time", "'A' for effort. 'F+' for actual success", "You didn't win, BUT you are excellent at losing", "Don't sweat the loss, I am sure you are good at something"];
var comment = sassyLossComments[Math.floor(Math.random() * sassyLossComments.length)];
var scoreCount = 0;
var balls = [];
var level = 1;
var percentHit = 0.1;
var ballCount = 20;
var minimumScore = 2;
var hitsLeft = minimumScore;
width = board.width = 800;
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

createBalls(ballCount);



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
	if (explosions) {
			explosionSize();
	}
}

// Move balls every 10ms
var moveGame = setInterval(moveBalls, 15);

// Holds explosion data
var explosions;

// function that will create first explosion, and pass data into explosion array
var clickExplosion = function(e) {
	var x = e.x;
	var y = e.y;
	x -= board.offsetLeft;
  y -= board.offsetTop;
	explosions = [];
	context.beginPath();
	context.arc(x,y,1,0,Math.PI*2);
	context.fillStyle = '#F5AB35';
	context.fill();
	explosions.push({
		cx: x,
		cy: y,
		radius: 1,
		color: '#F5AB35',
		sizeInt: .5,
		start: 0,
		end: Math.PI*2
	});
	//remove explosion on click, so only one manual explosion can be made
	board.removeEventListener("click", clickExplosion);
}

function endGame(){
	if (scoreCount >= minimumScore){
		explosions = null;
		gameOptions.style.display = "block";
	} else {
		gameOptionButton.innerHTML = comment;
		nextLevelButton.style.display = "none";
		playAgainButton.style.display = "block";
		gameOptions.style.display = "block";
	}
}
// create event listener to create first explosion
board.addEventListener("click", clickExplosion);

// goes through every explosion and calls function sizer to resize each explosion
function explosionSize() {
	if (explosions.length === 0){

			endGame();
	}
	for (k = 0; k < explosions.length; k++) {
		sizer(explosions[k]);
	}
}

// takes explosion data as an argument, and resizes depending on state
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
		context.fillStyle = exp.color;
		context.fill();
		explosions[k] = ({
			cx: exp.cx,
			cy: exp.cy,
			color: exp.color,
			radius: exp.radius,
			sizeInt: exp.sizeInt,
			start: 0,
			end: Math.PI*2
		});
		// call checkHit function and pass in explosion data
		checkHit(exp);

	}
}

// function that takes in explosion data as argument, then goes through each ball data to see if ball is in explosion area
function checkHit(exp){
	for (j = 0; j < balls.length; j++) {
		var ball = balls[j];
		if (context.isPointInPath(ball.cx, ball.cy)){
			scoreCount = scoreCount + 1;
			if (hitsLeft != 0) {
				hitsLeft -= 1;
				hitsLeftEl.innerHTML = hitsLeft;
			}
			scoreEl.innerHTML = scoreCount;
			explosions.push({
				cx: ball.cx,
				cy: ball.cy,
				color: explosionColors[Math.floor(Math.random() * explosionColors.length)],
				radius: 1,
				sizeInt: .5,
				start: 0,
				end: Math.PI*2
			});
			// remove ball from array if in explosion area
			balls.splice(j, 1);
		}
	}
}




// action for when you click next level button
function nextLevel() {
	balls = [];
	comment = sassyLossComments[Math.floor(Math.random() * sassyLossComments.length)];
	gameOptions.style.display = "none";
	context.clearRect(0,0,width,height);
	scoreCount = 0;
	scoreEl.innerHTML = scoreCount;
	level += 1;
	levelEl.innerHTML = level;
	if (percentHit <= 0.8) {
		percentHit += 0.1;
	} 
	if (level <= 6) {
		ballCount += 15;
	} else {
		ballCount -= 10;
	}
	minimumScore = Math.floor(ballCount * percentHit);
	hitsLeft = minimumScore;
	hitsLeftEl.innerHTML = hitsLeft;

	createBalls(ballCount);
	board.addEventListener("click", clickExplosion);
}

function restartGame(){
	location.reload();
}

nextLevelButton.addEventListener("click", nextLevel);
playAgainButton.addEventListener("click", restartGame);







}





