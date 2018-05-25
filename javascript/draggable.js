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

var no_money = new Image();
no_money.src = "../images/no_money.png";

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
    var cartPageOrig;

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

    var popup;

    var isTouch;
	
	function init() {
        numShapes = 6;
        curPage = 0;
        easeAmount = 0.450;
		budget = 400;
        totalPrice = 0;

        dragIndex = -1;

        cartStartIndex = 0;
        numCartItems = 4;
        cartMaxItem = 0;
        cartDragging = false;
        cartDragIndex = -1;

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
        btnGoHome = new Button(theCanvas.width - 73, 305,
            67, 32, null, BUTTON_GO_HOME, homeButton);

        var ARROW_BTN_WIDTH = 38;
        var ARROW_BTN_HEIGHT = 108;
        var ARROW_DIFF_X = 3;
        var CART_ARROW_Y = 430;

        btnCartLeft = new Button(ARROW_DIFF_X, CART_ARROW_Y - ARROW_BTN_HEIGHT / 2,
            ARROW_BTN_WIDTH, ARROW_BTN_HEIGHT, null, BUTTON_CART_LEFT, leftImg);
        btnCartLeft.enabled = false;
        btnCartRight = new Button(theCanvas.width - ARROW_DIFF_X - ARROW_BTN_WIDTH, CART_ARROW_Y - ARROW_BTN_HEIGHT / 2,
            ARROW_BTN_WIDTH, ARROW_BTN_HEIGHT, null, BUTTON_CART_RIGHT, rightImg);
        btnCartRight.enabled = false;

        var SHOP_ARROW_Y = 100;
			
        btnPrev = new Button(ARROW_DIFF_X, SHOP_ARROW_Y,
            ARROW_BTN_WIDTH, ARROW_BTN_HEIGHT, null, BUTTON_PREV, leftImg);
        btnPrev.enabled = false;
        btnNext = new Button(theCanvas.width - ARROW_DIFF_X - ARROW_BTN_WIDTH, SHOP_ARROW_Y,
            ARROW_BTN_WIDTH, ARROW_BTN_HEIGHT, null, BUTTON_NEXT, rightImg);
        
        var INFO_BTN_WIDTH = 40;
        var INFO_BTN_HEIGHT = 40;
        
        btnInfo = new Button(theCanvas.width - INFO_BTN_WIDTH, 0, INFO_BTN_WIDTH, INFO_BTN_HEIGHT, null, BUTTON_INFO, informationButton);

        popup = new Popup(10, 30, no_money);
        
        // draw
        drawScreen();

        isTouch = "ontouchstart" in window;

        if (isTouch) {
            theCanvas.addEventListener("touchstart", touchStartEventListener, false);
        }
        else {
            theCanvas.addEventListener("mousedown", mouseDownListener, false);
        }
    }

    function touchStartEventListener(event) {
        var touch = event.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        
        if (event.preventDefault) {
            event.preventDefault();
        }
        
        mouseDownListener(mouseEvent);
    }

    function touchEndEventListener(event) {
        var touch = event.touches[0];
        var mouseEvent = new MouseEvent("mouseup", {
            clientX: mouseX,
            clientY: mouseY
        });
        mouseUpListener(mouseEvent);
    }

    function touchMoveEventListener(event) {
        var touch = event.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        mouseMoveListener(mouseEvent);
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

        if (popup.isShow && popup.mouseDownListener(mouseX, mouseY)) {
            return false;
        }

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

        max = Math.min(cartMaxItem, cart.length - cartStartIndex);
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
            if (isTouch) {
                window.addEventListener("touchmove", touchMoveEventListener, false);
            }
            else {
                window.addEventListener("mousemove", mouseMoveListener, false);
            }
			
			//shapeto drag is now last one in array
			dragHoldX = mouseX - shapes[dragIndex].x;
			dragHoldY = mouseY - shapes[dragIndex].y;
			
			//The "target" position is where the object should be if it were to move there instantaneously. But we will
			//set up the code so that this target position is approached gradually, producing a smooth motion.
			targetX = mouseX - dragHoldX;
			targetY = mouseY - dragHoldY;

			//start timer
            if (timer != null) {
                clearInterval(timer);
            }
            timer = setInterval(onTimerTick, 1000 / 30);

            cartPageOrig = currentPage;
        }
        else if (cartDragging) {
            if (isTouch) {
                window.addEventListener("touchmove", touchMoveEventListener, false);
            }
            else {
                window.addEventListener("mousemove", mouseMoveListener, false);
            }

            //shapeto drag is now last one in array
            cartDragHoldX = mouseX - cart[cartDragIndex].x;
            cartDragHoldY = mouseY - cart[cartDragIndex].y;

            //The "target" position is where the object should be if it were to move there instantaneously. But we will
            //set up the code so that this target position is approached gradually, producing a smooth motion.
            cartTargetX = mouseX - cartDragHoldX;
            cartTargetY = mouseY - cartDragHoldY;

            //start timer
            if (timer != null) {
                clearInterval(timer);
            }
            timer = setInterval(onTimerTick, 1000 / 30);
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

        if (isTouch) {
            theCanvas.removeEventListener("touchstart", touchStartEventListener, false);
            window.addEventListener("touchend", touchEndEventListener, false);
        }
        else {
            theCanvas.removeEventListener("mousedown", mouseDownListener, false);
            window.addEventListener("mouseup", mouseUpListener, false);
        }

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
        if (dragIndex != -1) {
            //because of reordering, the dragging shape is the last one in the array.
            shapes[dragIndex].x = shapes[dragIndex].x + easeAmount * (targetX - shapes[dragIndex].x);
            shapes[dragIndex].y = shapes[dragIndex].y + easeAmount * (targetY - shapes[dragIndex].y);

            //stop the timer when the target position is reached (close enough)
            if ((!dragging) && (Math.abs(shapes[dragIndex].x - targetX) < 0.1) && (Math.abs(shapes[dragIndex].y - targetY) < 0.1)) {
                shapes[dragIndex].x = targetX;
                shapes[dragIndex].y = targetY;
                //stop timer:
                clearInterval(timer);

                dragIndex = -1;
            }
            else if (dragging) {
                if (isInCart(shapes[dragIndex].x, shapes[dragIndex].y)) {
                    currentPage = Math.floor(cart.length / numCartItems);
                    cartStartIndex = currentPage * numCartItems;
                    cartMaxItem = Math.min(numCartItems, cart.length - cartStartIndex);
                }
                else {
                    currentPage = cartPageOrig;
                    cartStartIndex = currentPage * numCartItems;
                    cartMaxItem = Math.min(numCartItems, cart.length - cartStartIndex);
                }
            }
        }
        else if (cartDragIndex != -1) {
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
        if (isTouch) {
            theCanvas.addEventListener("touchstart", touchStartEventListener, false);
            window.removeEventListener("touchend", touchEndEventListener, false);
        }
        else {
            theCanvas.addEventListener("mousedown", mouseDownListener, false);
            window.removeEventListener("mouseup", mouseUpListener, false);
        }
		if (dragging) {
			dragging = false;
            if (isTouch) {
                window.removeEventListener("touchmove", touchMoveEventListener, false);
            }
            else {
                window.removeEventListener("mousemove", mouseMoveListener, false);
            }
            getShapes();
			targetX = shapes[dragIndex].origX;
            targetY = shapes[dragIndex].origY;
        }

        if (cartDragging) {
            cartDragging = false;
            if (isTouch) {
                window.removeEventListener("touchmove", touchMoveEventListener, false);
            }
            else {
                window.removeEventListener("mousemove", mouseMoveListener, false);
            }
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
        var minX = 40;
        var maxX = theCanvas.width - 40;
        var minY = 40;
        var maxY = theCanvas.height - 40;
		
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
	    context.font = "22px Comfortaa";
        context.fillStyle = "#FFF";
        context.textAlign = "left";
		context.fillText("Cart Total: " + totalPrice, 85, 320);
		context.fillText("Max Budget: " + budget, 270, 320);
    }
    
    function drawInfo() {
        context.fillStyle = "#000000";
        context.textAlign = "left";
        context.drawImage(informationScreen, 0, 0);  
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

        popup.drawToContext(context);

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
        if (isInCart(mouseX, mouseY)) {
            if (budget >= totalPrice + price) {
                var temp = new StoreItem(cart.length * 80, 370, 80, 80, shapes[dragIndex].foodData);
                // need to copy values
                temp.hunger = shapes[dragIndex].hunger;
                temp.grain = shapes[dragIndex].grain;
                temp.vegetable = shapes[dragIndex].vegetable;
                temp.meat = shapes[dragIndex].meat;
                temp.refreshProgressBar();
                totalPrice += price;
                cart.push(temp);
                cartMaxItem = Math.min(numCartItems, cart.length - cartStartIndex);
            }
            else {
                popup.showMessage(context, "", POPUP_NO_BTN, 3750, drawScreen);
            }
        }
        else {
            currentPage = cartPageOrig;
            cartStartIndex = currentPage * numCartItems;
            cartMaxItem = Math.min(numCartItems, cart.length - cartStartIndex);
        }

		AutoHideCartBtn();
    }

    function isInCart(x, y) {
        return x >= 0 && y >= 370 && y < theCanvas.height;
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
        if (cartMaxItem == 0) {
            CartLeft();
        }
        
        AutoHideCartBtn();
        clearInterval(timer);
        drawScreen();
    }
	
    function GoHome() {
        if (isTouch) {
            theCanvas.removeEventListener("touchstart", touchStartEventListener, false);
            window.removeEventListener("touchend", touchEndEventListener, false);
            window.removeEventListener("touchmove", touchMoveEventListener, false);
        }
        else {
            theCanvas.removeEventListener("mousedown", mouseDownListener, false);
            window.removeEventListener("mouseup", mouseUpListener, false);
            window.removeEventListener("mousemove", mouseMoveListener, false);
        }
        clearInterval(timer);
        home(cart);
    }

    function CartLeft() {
		if(currentPage > 0){
			currentPage--;
		}
        
        AutoHideCartBtn();

        cartStartIndex = currentPage * numCartItems;
        cartMaxItem = Math.min(numCartItems, cart.length - cartStartIndex);

        drawScreen();
    }

    function CartRight() {
        if (currentPage != Math.floor((cart.length - 1) / numCartItems)) {
			currentPage++;
		}
        
        AutoHideCartBtn();

        cartStartIndex = currentPage * numCartItems;
        cartMaxItem = Math.min(numCartItems, cart.length - cartStartIndex);

		drawScreen();
    }
    
    function AutoHideCartBtn() {
        btnCartLeft.enabled = currentPage != 0;
        btnCartRight.enabled = cart.length != 0 && currentPage != Math.floor((cart.length - 1) / numCartItems);
    }

    function GoPrev() {
        if (curPage > 0) {
            curPage--;
        }
        AutoHideShopBtn();
        drawScreen();
    }

    function GoNext() {
        if (curPage != Math.floor((shapes.length - 1) / numShapes)) {
            curPage++;
        }
        AutoHideShopBtn();
        drawScreen();
    }
    
    function AutoHideShopBtn() {
        btnPrev.enabled = curPage != 0;
        btnNext.enabled = curPage != Math.floor((shapes.length - 1) / numShapes);
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
