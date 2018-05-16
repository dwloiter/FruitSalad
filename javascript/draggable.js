//JavaScript HTML5 Canvas example by Dan Gries, rectangleworld.com.
//The basic setup here, including the debugging code and window load listener, is copied from 'HTML5 Canvas' by Fulton & Fulton.

var leftImg = new Image();
leftImg.src = '../images/left.png';
var rightImg = new Image();
rightImg.src = '../images/right.png'; 

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

    var BUTTON_GO_HOME;
    var BUTTON_CART_LEFT;
    var BUTTON_CART_RIGHT;
	var BUTTON_NEXT;
	var BUTTON_PREV;
    var BUTTON_INFO;

    var btnGoHome;
	
	var curPage;

	var budget;
	var totalPrice;

	
	function init() {
        numShapes = 6;
        curPage = 0;
        easeAmount = 0.450;
		budget = 200;
        totalPrice = 0;

        currentPage = 0;

        BUTTON_GO_HOME = 1;
        BUTTON_CART_LEFT = 2;
        BUTTON_CART_RIGHT = 3;
        BUTTON_NEXT = 4;
        BUTTON_PREV = 5;
        BUTTON_INFO = 6;
        
        showInfo = false;
		
		shapes = [];
		
        makeShapes();

        // create buttons
        btnGoHome = new Button(300, 300, 100, 40, "GoHome", BUTTON_GO_HOME, null);

        var ARROW_BTN_WIDTH = 38;
        var ARROW_BTN_HEIGHT = 108;
        var ARROW_DIFF_X = 3;
        var CART_ARROW_Y = 430;

        btnCartLeft = new Button(ARROW_DIFF_X, CART_ARROW_Y - ARROW_BTN_HEIGHT / 2,
            ARROW_BTN_WIDTH, ARROW_BTN_HEIGHT, null, BUTTON_CART_LEFT, leftImg);
        btnCartRight = new Button(theCanvas.width - ARROW_DIFF_X - ARROW_BTN_WIDTH, CART_ARROW_Y - ARROW_BTN_HEIGHT / 2,
            ARROW_BTN_WIDTH, ARROW_BTN_HEIGHT, null, BUTTON_CART_RIGHT, rightImg);

        var SHOP_ARROW_Y = 100;
			
        btnPrev = new Button(ARROW_DIFF_X, SHOP_ARROW_Y,
            ARROW_BTN_WIDTH, ARROW_BTN_HEIGHT, null, BUTTON_PREV, leftImg);
        btnNext = new Button(theCanvas.width - ARROW_DIFF_X - ARROW_BTN_WIDTH, SHOP_ARROW_Y,
            ARROW_BTN_WIDTH, ARROW_BTN_HEIGHT, null, BUTTON_NEXT, rightImg);
        
        var INFO_BTN_WIDTH = 40;
        var INFO_BTN_HEIGHT = 40;
        
        btnInfo = new Button(theCanvas.width - INFO_BTN_WIDTH, 0,
                            INFO_BTN_WIDTH, INFO_BTN_HEIGHT, "!", BUTTON_INFO, null);

        // draw
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

        if (foodDatas != null) {
            for (i = 0; i < foodDatas.length; i++) {
                var index = i % numShapes;
                var tempX = startX + diffX * (index % rowItemCount);
                var tempY = startY + diffY * Math.floor(index / rowItemCount);

                tempShape = new StoreItem(tempX, tempY, width, height, foodDatas[i]);

                shapes.push(tempShape);
            }
        }
        else {
            for (i = 0; i < 25; i++) {
                var index = i % numShapes;
                var tempX = startX + diffX * (index % rowItemCount);
                var tempY = startY + diffY * Math.floor(index / rowItemCount);

                tempShape = new StoreItem(tempX, tempY, width, height, null);

                shapes.push(tempShape);
            }
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
        var startIndex = curPage * numShapes;
        var max = Math.min(numShapes, shapes.length - startIndex);
        for (i = 0; i < max; i++) {
            if (shapes[i + startIndex].hitTest(mouseX, mouseY)) {	
				dragging = true;
				//the following variable will be reset if this loop repeats with another successful hit:
                dragIndex = i + startIndex;
                break;
			}
		}
		
        if (btnInfo.mouseDownListener(mouseX, mouseY)){
            ToggleInfo();
        }
		else if (dragging) {
			window.addEventListener("mousemove", mouseMoveListener, false);
			
			//shapeto drag is now last one in array
			dragHoldX = mouseX - shapes[dragIndex].x;
			dragHoldY = mouseY - shapes[dragIndex].y;
			
			//The "target" position is where the object should be if it were to move there instantaneously. But we will
			//set up the code so that this target position is approached gradually, producing a smooth motion.
			targetX = mouseX - dragHoldX;
			targetY = mouseY - dragHoldY;
			
			//start timer
			timer = setInterval(onTimerTick, 1000/30);
        }
        else if (btnCartLeft.mouseDownListener(mouseX, mouseY)) {
            CartLeft();
        }
        else if (btnCartRight.mouseDownListener(mouseX, mouseY)) {
            CartRight();
        }
		else if (btnNext.mouseDownListener(mouseX, mouseY)) {
            GoNext();
        }
		else if (btnPrev.mouseDownListener(mouseX, mouseY)) {
            GoPrev();
        }
		theCanvas.removeEventListener("mousedown", mouseDownListener, false);
        window.addEventListener("mouseup", mouseUpListener, false);

        if (btnGoHome.mouseDownListener(mouseX, mouseY)) {
            GoHome();
        }
		
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
		shapes[dragIndex].x = shapes[dragIndex].x + easeAmount*(targetX - shapes[dragIndex].x);
		shapes[dragIndex].y = shapes[dragIndex].y + easeAmount*(targetY - shapes[dragIndex].y);
		
		//stop the timer when the target position is reached (close enough)
		if ((!dragging)&&(Math.abs(shapes[dragIndex].x - targetX) < 0.1) && (Math.abs(shapes[dragIndex].y - targetY) < 0.1)) {
			shapes[dragIndex].x = targetX;
			shapes[dragIndex].y = targetY;
			//stop timer:
            clearInterval(timer);
            dragIndex = -1;
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
			targetX = shapes[dragIndex].origX;
            targetY = shapes[dragIndex].origY;
		}
	}

	function mouseMoveListener(evt) {
		var posX;
        var posY;
        var minX = shapes[dragIndex].width / 2;
        var maxX = theCanvas.width - shapes[dragIndex].width / 2;
        var minY = shapes[dragIndex].height / 2;
        var maxY = theCanvas.height - shapes[dragIndex].height / 2;
		
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
        var startIndex = curPage * numShapes;
        var max = Math.min(numShapes, shapes.length - startIndex);
        for (i = 0; i < max; i++) {
            if (dragging && dragIndex == i + startIndex) {
                continue
            }
            shapes[i + startIndex].drawToContext(context);
        }

        if (dragging) {
            shapes[dragIndex].drawToContext(context);
        }
	}

    function drawCart() {
		var i;
        var cartMaxItem = 4;
		var startIndex = currentPage * cartMaxItem;
		var max = Math.min(cartMaxItem, cart.length - startIndex);
		for (i = 0; i < max; ++i){
			cart[startIndex + i].setX(i * 80 + 40);
			cart[startIndex + i].drawToContext(context);
		}
	}

	function drawTotal() {		
		context.fillText("totalPrice:" + totalPrice, 200, 10)
		context.fillText("budget:" + budget, 200, 20)
    }

    function drawInfo() {
        context.fillStyle = "#000000";
        context.textAlign = "left";
        context.fillText("dummy text file", 30, 10);    
        context.fillText("change", 30, 30);    
        context.fillText("this", 30, 50);    
        context.fillText("dummy text", 30, 70);    
    }
    
	function drawScreen() {
		//bg
		context.drawImage(img, 0, 0);
		
        btnGoHome.drawToContext(context);
        btnCartLeft.drawToContext(context);
        btnCartRight.drawToContext(context);
		btnNext.drawToContext(context);
		btnPrev.drawToContext(context);

        if (cart != null) {
            drawCart();
        }
		
		drawTotal();

        drawShapes();

        btnInfo.drawToContext(context);

        if (showInfo) {
            drawInfo();
        }
    }
    
    function getShapes() {
		var i;
		var price;
		if (shapes[dragIndex].foodData == null){
			price = 20;
		}
		else{
			price = shapes[dragIndex].foodData.Price;
		}
        if (mouseX >= 0 && mouseY >= 370 && mouseY < theCanvas.height && budget >= totalPrice + price) {
            var temp = new StoreItem(cart.length * 80, 370, 80, 80, shapes[dragIndex].foodData);
			// need to copy values
            temp.hunger = shapes[dragIndex].hunger;
            temp.grain = shapes[dragIndex].grain;
            temp.vegetable = shapes[dragIndex].vegetable;
            temp.meat = shapes[dragIndex].meat;
			temp.refreshProgressBar();
			totalPrice += price;
			cart.push(temp);
		}
	}
	
    function GoHome() {
        window.removeEventListener("mousedown", mouseDownListener, false);
        window.removeEventListener("mouseup", mouseUpListener, false);
        window.removeEventListener("mousemove", mouseMoveListener, false);
        home(cart);
    }

    function CartLeft() {
		if(currentPage > 0){
			currentPage--;
		}
		drawScreen();
    }

    function CartRight() {
        if (currentPage != Math.floor((cart.length - 1) / 4)) {
			currentPage++;
		}
		drawScreen();
       
    }	

    function GoPrev() {
        if (curPage > 0) {
            curPage--;
        }
        drawScreen();
    }

    function GoNext() {
        if (curPage != Math.floor((shapes.length - 1) / numShapes)) {
            curPage++;
        }
        drawScreen();
    }
    
    function ToggleInfo(){
        showInfo = !showInfo;
        if (!showInfo) {
            var INFO_BTN_WIDTH = 40;
            var INFO_BTN_HEIGHT = 40;
            
            btnInfo.x = theCanvas.width - INFO_BTN_WIDTH;
            btnInfo.width = INFO_BTN_WIDTH;
            btnInfo.height = INFO_BTN_HEIGHT;
            btnInfo.message = "i";
        }
        else {
            btnInfo.x = 0;
            btnInfo.width = theCanvas.width;
            btnInfo.height = theCanvas.height;
            btnInfo.message = "";
        }
        drawScreen();
    }
}
