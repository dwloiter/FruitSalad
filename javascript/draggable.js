//JavaScript HTML5 Canvas example by Dan Gries, rectangleworld.com.
//The basic setup here, including the debugging code and window load listener, is copied from 'HTML5 Canvas' by Fulton & Fulton.


//For debug messages
var Debugger = function() { };
Debugger.log = function(message) {
	try {
		console.log(message);
	}
	catch (exception) {
		return;
	}
}

function canvasApp() {
	
	var theCanvas = document.getElementById("gamecanvas");
	var context = theCanvas.getContext("2d");
	
	init();
	
	var numShapes;
	var shapes;
	var dragIndex;
	var dragging;
	var mouseX;
	var mouseY;
	var dragHoldX;
	var dragHoldY;
	var timer;
	var targetX;
	var targetY;
	var easeAmount;
	
	function init() {
		numShapes = 6;
		easeAmount = 0.45;
		
		shapes = [];
		
		makeShapes();
		
		drawScreen();
		
		theCanvas.addEventListener("mousedown", mouseDownListener, false);
	}
	
	function makeShapes() {
		var i;
		var tempX;
		var tempY;
		var tempRad;
		var tempR;
		var tempG;
		var tempB;
		var tempA;
		var tempColor;
		for (i=0; i < numShapes; i++) {
			tempRad = 5 + Math.floor(Math.random()*20);
			tempX = Math.random()*(theCanvas.width - tempRad);
			tempY = Math.random()*(theCanvas.height - tempRad);
			
			//we set a randomized color, including a random alpha (transparency) value.
			//The color is set using the rgba() method.
			tempR = Math.floor(Math.random()*255);
			tempG = Math.floor(Math.random()*255);
			tempB = Math.floor(Math.random()*255);
			tempA = 0.3 + 0.5*Math.random();
			tempColor = "rgba(" + tempR + "," + tempG + "," + tempB + "," + tempA + ")";
			
			//randomly select either a circle or a square
			if (Math.random() < 0.5) {
				tempShape = new StoreItem(tempX, tempY);
			}
			else {
				tempShape = new StoreItem(tempX, tempY);
			}
			
			tempShape.color = tempColor;
			tempShape.radius = tempRad;
			shapes.push(tempShape);
		}
	}
	
	function mouseDownListener(evt) {
		var i;
		
		//getting mouse position correctly 
		var bRect = theCanvas.getBoundingClientRect();
		mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width);
		mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height);
				
		/*
		Below, we find if a shape was clicked. Since a "hit" on a square or a circle has to be measured differently, the
		hit test is done using the hitTest() function associated to the type of particle. This function is an instance method
		for both the SimpleDiskParticle and SimpleSqureParticle classes we have defined with the external JavaScript sources.		
		*/
		for (i=0; i < numShapes; i++) {
			if (shapes[i].hitTest(mouseX, mouseY)) {	
				dragging = true;
				//the following variable will be reset if this loop repeats with another successful hit:
				dragIndex = i;
			}
		}
		
		if (dragging) {
			window.addEventListener("mousemove", mouseMoveListener, false);
			
			//place currently dragged shape on top
			shapes.push(shapes.splice(dragIndex,1)[0]);
			
			//shapeto drag is now last one in array
			dragHoldX = mouseX - shapes[numShapes-1].x;
			dragHoldY = mouseY - shapes[numShapes-1].y;
			
			//The "target" position is where the object should be if it were to move there instantaneously. But we will
			//set up the code so that this target position is approached gradually, producing a smooth motion.
			targetX = mouseX - dragHoldX;
			targetY = mouseY - dragHoldY;
			
			//start timer
			timer = setInterval(onTimerTick, 1000/30);
		}
		theCanvas.removeEventListener("mousedown", mouseDownListener, false);
		window.addEventListener("mouseup", mouseUpListener, false);
		
		//code below prevents the mouse down from having an effect on the main browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE
		return false;
	}
	
	function onTimerTick() {
		//because of reordering, the dragging shape is the last one in the array.
		shapes[numShapes-1].x = shapes[numShapes-1].x + easeAmount*(targetX - shapes[numShapes-1].x);
		shapes[numShapes-1].y = shapes[numShapes-1].y + easeAmount*(targetY - shapes[numShapes-1].y);
		
		//stop the timer when the target position is reached (close enough)
		if ((!dragging)&&(Math.abs(shapes[numShapes-1].x - targetX) < 0.1) && (Math.abs(shapes[numShapes-1].y - targetY) < 0.1)) {
			shapes[numShapes-1].x = targetX;
			shapes[numShapes-1].y = targetY;
			//stop timer:
			clearInterval(timer);
		}
		drawScreen();
	}
	
	function mouseUpListener(evt) {
		theCanvas.addEventListener("mousedown", mouseDownListener, false);
		window.removeEventListener("mouseup", mouseUpListener, false);
		if (dragging) {
			dragging = false;
			window.removeEventListener("mousemove", mouseMoveListener, false);
		}
	}

	function mouseMoveListener(evt) {
		var posX;
		var posY;
		var shapeRad = shapes[numShapes-1].radius;
		var minX = shapeRad;
		var maxX = theCanvas.width - shapeRad;
		var minY = shapeRad;
		var maxY = theCanvas.height - shapeRad;
		
		//getting mouse position correctly 
		var bRect = theCanvas.getBoundingClientRect();
		mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width);
		mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height);
		
		//clamp x and y positions to prevent object from dragging outside of canvas
		posX = mouseX - dragHoldX;
		posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
		posY = mouseY - dragHoldY;
		posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
		
		targetX = posX;
		targetY = posY;
	}
		
	function drawShapes() {
		var i;
		for (i=0; i < numShapes; i++) {
			//the drawing of the shape is handled by a function inside the external class.
			//we must pass as an argument the context to which we are drawing the shape.
			shapes[i].drawToContext(context);
		}
	}
	
	function drawScreen() {
		//bg
		context.fillStyle = "#ffffff";
        context.fillRect(0, 0, theCanvas.width, theCanvas.height);
		context.drawImage(img, 0, 0, 450, 320);
		context.rect(0, 370, canvas.width, 130);
		context.stroke();
		drawShapes();			
	}
	function next(){
		context.drawImage(img2, 0, 0, 450, 320);
		drawShapes();
	}
	
}
