function canvasApp() {
	var theCanvas = document.getElementById("gameCanvas");
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
	var cart = [];
	var currentPage;
	
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
		var startX = 30;
		var startY = 30;
        var width = 80;
        var height = 80;
        var diffX = 150;
        var diffY = 150;
        var rowItemCount = 3;
        
        for (i = 0; i < numShapes; i++) {

            var tempX = startX + diffX * (i % rowItemCount);
            var tempY = startY + diffY * Math.floor(i / rowItemCount);
			
            tempShape = new StoreItem(tempX, tempY, width, height);
			
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
			getShapes();
			targetX = shapes[shapes.length - 1].origX;
			targetY = shapes[shapes.length - 1].origY;
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

	function drawCart() {
		var i;
		currentPage = 0;
		var cartMaxItem = 4;
		var startIndex = currentPage * cartMaxItem;
		for (i = currentPage; cart != null && i < cartMaxItem; ++i){
			cart[startIndex + i].x = i * 80;
			cart[startIndex + i].drawToContext(context);
		}
	}
	
	function drawScreen() {
		//bg
		context.fillStyle = "#ffffff";
        context.fillRect(0, 0, theCanvas.width, theCanvas.height);
		context.drawImage(img, 0, 0, 450, 320);
		context.rect(0, 370, 450, 130);
		context.stroke();
		
		drawShapes();
		drawCart();
		drawNext();
		drawBack();
	}
	
	function getShapes() {
		var i;
		if(mouseX >= 0 && mouseY >= 370 && mouseY < theCanvas.height){
			var temp = new StoreItem(cart.length * 80, 370, 80, 80);
			// need to copy values
			temp.hunger = shapes[shapes.length -1].hunger;
			temp.grain = shapes[shapes.length -1].grain;
			temp.vegetable = shapes[shapes.length -1].vegetable;
			temp.meat = shapes[shapes.length -1].meat;
			temp.refreshProgressBar();
			cart.push(temp);
		}
	}
	
	
	function clearCart(event){
		if(mouseX  && mouseY){
			context.clearRect(0, 370, 450, 130);
			drawNext();
			drawBack();
		}			
	}
	
	function drawNext(){
		context.beginPath();
		context.moveTo(440, 435);
		context.lineTo(420, 480);
		context.lineTo(420, 390);
		context.fill();

		context.fillStyle = "#000000";
	}
	
	function drawBack(){
		context.beginPath();
		context.moveTo(10, 435);
		context.lineTo(30, 480);
		context.lineTo(30, 390);
		context.fill();
		context.fillStyle = "#000000";
		
	}
	
	function displayPage(){
		if(currentPage > 0){
			
		}
	}
}