//JavaScript HTML5 Canvas example by Dan Gries, rectangleworld.com.
//The basic setup here, including the debugging code and window load listener, is copied from 'HTML5 Canvas' by Fulton & Fulton.

var leftImg = new Image();
leftImg.src = '../images/UI/left.png';
var rightImg = new Image();
rightImg.src = '../images/UI/right.png'; 
var homeButton = new Image();
homeButton.src = '../images/UI/home_button.png'; 

var informationButton = new Image();
informationButton.src = "../images/UI/information_button.png";
var informationScreen = new Image();
informationScreen.src = "../images/UI/information.png";

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
	var currentPage = 0;

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

    var cartMaxItem;
    var cartStartIndex;
    var cartDragIndex;
    var cartDragging;

    var cartDragHoldX;
    var cartDragHoldY;
    var timer;
    var cartTargetX;
    var cartTargetY;


	
	function init() {
        numShapes = 6;
        curPage = 0;
        easeAmount = 0.450;
		budget = 200;
        totalPrice = 0;
        dragIndex = -1;

        cartStartIndex = 0;
        numCartItems = 4;
        cartMaxItem = 0;
        cartDragging = false;
        cartDragIndex = -1;

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
        
        btnGoHome = new Button(theCanvas.width - 73, 305,
            67, 32, null, BUTTON_GO_HOME, homeButton);


        var ARROW_BTN_WIDTH = 38;
        var ARROW_BTN_HEIGHT = 108;
        var ARROW_DIFF_X = 3;
        var CART_ARROW_Y = 430;

        btnCartLeft = new Button(ARROW_DIFF_X, CART_ARROW_Y - ARROW_BTN_HEIGHT/ 2,
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
        
        btnInfo = new Button(theCanvas.width - INFO_BTN_WIDTH, 0, INFO_BTN_WIDTH, INFO_BTN_HEIGHT, null, BUTTON_INFO, informationButton);
        
        
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
		for (i = 0; i < numShapes; i++) {
			if (shapes[i].hitTest(mouseX, mouseY)) {	
				dragging = true;
				//the following variable will be reset if this loop repeats with another successful hit:
                dragIndex = i;
                break;
			}
        }

        var max = Math.min(cartMaxItem, cart.length - cartStartIndex);
        for (i = 0; i < cartMaxItem; ++i) {
            if (cart[i + cartStartIndex].hitTest(mouseX, mouseY)) {
                cartDragging = true;
                //the following variable will be reset if this loop repeats with another successful hit:
                cartDragIndex = i + cartStartIndex;
                break;
            }
        }
		
        if (btnInfo.mouseDownListener(mouseX, mouseY)){
            ToggleInfo();
        }
		else if (dragging) {
			window.addEventListener("mousemove", mouseMoveListener, false);
			
            //place currently dragged shape on top
            shapes.splice(numShapes - 1, 0, shapes.splice(dragIndex, 1)[0]);
			
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
        else if (cartDragging) {
            window.addEventListener("mousemove", mouseMoveListener, false);

            //shapeto drag is now last one in array
            cartDragHoldX = mouseX - cart[cartDragIndex].x;
            cartDragHoldY = mouseY - cart[cartDragIndex].y;

            //The "target" position is where the object should be if it were to move there instantaneously. But we will
            //set up the code so that this target position is approached gradually, producing a smooth motion.
            cartTargetX = mouseX - cartDragHoldX;
            cartTargetY = mouseY - cartDragHoldY;

            //start timer
            timer = setInterval(onTimerTick, 1000 / 30);
        }
        else if (btnGoHome.mouseDownListener(mouseX, mouseY)) {
            GoHome();
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
        if (dragIndex != -1) {
            //because of reordering, the dragging shape is the last one in the array.
            shapes[numShapes - 1].x = shapes[numShapes - 1].x + easeAmount * (targetX - shapes[numShapes - 1].x);
            shapes[numShapes - 1].y = shapes[numShapes - 1].y + easeAmount * (targetY - shapes[numShapes - 1].y);

            //stop the timer when the target position is reached (close enough)
            if ((!dragging) && (Math.abs(shapes[numShapes - 1].x - targetX) < 0.1) && (Math.abs(shapes[numShapes - 1].y - targetY) < 0.1)) {
                shapes[numShapes - 1].x = targetX;
                shapes[numShapes - 1].y = targetY;
                //stop timer:
                clearInterval(timer);

                dragIndex = -1;
            }
        }

        if (cartDragIndex != -1) {
            //because of reordering, the dragging shape is the last one in the array.
            cart[cartDragIndex].x = cart[cartDragIndex].x + easeAmount * (cartTargetX - cart[cartDragIndex].x);
            cart[cartDragIndex].y = cart[cartDragIndex].y + easeAmount * (cartTargetY - cart[cartDragIndex].y);

            //stop the timer when the target position is reached (close enough)
            if ((!cartDragging) && (Math.abs(cart[cartDragIndex].x - cartTargetX) < 0.1) && (Math.abs(cart[cartDragIndex].y - cartTargetY) < 0.1)) {
                cart[cartDragIndex].x = cartTargetX;
                cart[cartDragIndex].y = cartTargetY;
                //stop timer:
                clearInterval(timer);

                cartDragIndex = -1;
            }
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
			targetX = shapes[numShapes - 1].origX;
            targetY = shapes[numShapes - 1].origY;
        }

        if (cartDragging) {
            cartDragging = false;
            window.removeEventListener("mousemove", mouseMoveListener, false);
            if (mouseX >= 0 && mouseY >= 370 && mouseY < theCanvas.height) {
                cartTargetX = cart[cartDragIndex].origX;
                cartTargetY = cart[cartDragIndex].origY;
            }
            else {
                removeFromCart();
            }
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

        posX = mouseX - cartDragHoldX;
        posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
        posY = mouseY - cartDragHoldY;
        posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

        cartTargetX = posX;
        cartTargetY = posY;
	}
		
	function drawShapes() {
        var i;
        var startIndex = curPage * numShapes;
        var max = Math.min(numShapes, shapes.length - startIndex);
        for (i = 0; i < max; i++) {
			shapes[i + curPage * numShapes].drawToContext(context);
		}
	}

    function drawCart() {
		var i;
        var max = Math.min(cartMaxItem, cart.length - cartStartIndex);
        for (i = 0; i < cartMaxItem; ++i) {
            if (cartStartIndex + i == cartDragIndex && cartDragging) {
                continue;
            }
            cart[cartStartIndex + i].setX(i * 80 + 40);
            cart[cartStartIndex + i].drawToContext(context);
        }

        if (cartDragging) {
            cart[cartDragIndex].drawToContext(context);
        }
	}
	

	function drawTotal() {		
		context.fillText("totalPrice:" + totalPrice, 200, 10)
		context.fillText("budget:" + budget, 200, 20)
    }
    
    function drawInfo() {
        context.fillStyle = "#000000";
        context.textAlign = "left";
        context.drawImage(informationScreen, 0, 0);  
    }

	function drawScreen() {
		//bg
		context.drawImage(img, 0, 0);
		
        drawShapes();
        
        btnGoHome.drawToContext(context);
        btnCartLeft.drawToContext(context);
        btnCartRight.drawToContext(context);
		btnNext.drawToContext(context);
		btnPrev.drawToContext(context);
        btnInfo.drawToContext(context);

        if (cart != null) {
            drawCart();
        }
		
		drawTotal();

        if (showInfo) {
            drawInfo();
        }
    }
    
    function getShapes() {
		var i;
		var price;
		if (shapes[numShapes-1].foodData == null){
			price = 20;
		}
		else{
			price = shapes[numShapes -1].foodData.Price;
		}
        if (mouseX >= 0 && mouseY >= 370 && mouseY < theCanvas.height && budget >= totalPrice + price) {
            var temp = new StoreItem(cart.length * 80, 370, 80, 80, shapes[numShapes - 1].foodData);
			// need to copy values
            temp.hunger = shapes[numShapes -1].hunger;
            temp.grain = shapes[numShapes -1].grain;
            temp.vegetable = shapes[numShapes -1].vegetable;
            temp.meat = shapes[numShapes -1].meat;
			temp.refreshProgressBar();
			totalPrice += price;
            cart.push(temp);
            cartMaxItem = Math.min(numCartItems, cart.length - cartStartIndex);
		}
    }

    function removeFromCart() {
        var price;
        if (cart[cartDragIndex].foodData == null) {
            price = 20;
        }
        else {
            price = cart[cartDragIndex].foodData.Price;
        }

        totalPrice -= price;

        cart.splice(cartDragIndex, 1);
        cartDragIndex = -1;
        cartMaxItem = Math.min(numCartItems, cart.length - cartStartIndex);
    }
	
    function GoHome() {
        document.writeln("Go Home");
    }

    function CartLeft() {
		if(currentPage > 0){
			currentPage--;
		}

        cartStartIndex = currentPage * numCartItems;
        cartMaxItem = Math.min(numCartItems, cart.length - cartStartIndex);

        drawScreen();
    }

    function CartRight() {
        if (currentPage != Math.floor((cart.length - 1) / numCartItems)) {
			currentPage++;
		}

        cartStartIndex = currentPage * numCartItems;
        cartMaxItem = Math.min(numCartItems, cart.length - cartStartIndex);

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
