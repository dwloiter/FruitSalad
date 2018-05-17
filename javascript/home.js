//JavaScript HTML5 Canvas example by Dan Gries, rectangleworld.com.
//The basic setup here, including the debugging code and window load listener, is copied from 'HTML5 Canvas' by Fulton & Fulton.

var leftImg = new Image();
leftImg.src = '../images/UI/left.png';
var rightImg = new Image();
rightImg.src = '../images/UI/right.png'; 

var day1Image = new Image();
day1Image.src = '../images/UI/day_1.png'; 
var day2Image = new Image();
day2Image.src = '../images/UI/day_2.png'; 
var day3Image = new Image();
day3Image.src = '../images/UI/day_3.png'; 
var day4Image = new Image();
day4Image.src = '../images/UI/day_4.png'; 
var day5Image = new Image();
day5Image.src = '../images/UI/day_5.png'; 
var day6Image = new Image();
day6Image.src = '../images/UI/day_6.png'; 
var day7Image = new Image();
day7Image.src = '../images/UI/day_7.png'; 


var homeBackground = new Image();
homeBackground.src = '../images/UI/home_screen.jpg'; 

var nextDayButton = new Image();
nextDayButton.src = '../images/UI/next_day.png'; 

function home(cart) {
	
	var theCanvas = document.getElementById("gameCanvas");
	var context = theCanvas.getContext("2d");
	
	init();
    
    var currentDay = 0;
	
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
	var currentPage;
	var dish = [];

    var BUTTON_TOMORROW;
    var BUTTON_CART_LEFT;
    var BUTTON_CART_RIGHT;

    var EAT_AREA_X;
    var EAT_AREA_Y;
    var EAT_AREA_WIDTH;
    var EAT_AREA_HEIGHT;
	
	var MAX_HUNGER = 100;

    var btnTomorrow;

    var totalHunger;
    var totalMeat;
    var totalGrain;
    var totalVegetable;

    var hungerProgressBar;
    var meatProgressBar;
    var grainProgressBar;
    var vegetableProgressBar;

    var cartMaxItem;
    var cartStartIndex;

    function init() {
        numCartItems = 4;
        curCartIndex = 0;
        currentPage = 0;
        easeAmount = 0.45;

        cartStartIndex = 0;
        cartMaxItem = Math.min(numCartItems, cart.length - cartStartIndex);

        BUTTON_TOMORROW = 1;
        BUTTON_CART_LEFT = 2;
        BUTTON_CART_RIGHT = 3;
		
        // create buttons
        //btnTomorrow = new Button(300, 300, 100, 40, "Tomorrow", BUTTON_TOMORROW, null);
        
        btnTomorrow = new Button(theCanvas.width - 90, 300, 90, 30, null, BUTTON_TOMORROW, nextDayButton);
        

        var ARROW_BTN_WIDTH = 38;
        var ARROW_BTN_HEIGHT = 108;
        var ARROW_DIFF_X = 3;
        var CART_ARROW_Y = 430;

        btnCartLeft = new Button(ARROW_DIFF_X, CART_ARROW_Y - ARROW_BTN_HEIGHT / 2,
            ARROW_BTN_WIDTH, ARROW_BTN_HEIGHT, null, BUTTON_CART_LEFT, leftImg);
        btnCartRight = new Button(theCanvas.width - ARROW_DIFF_X - ARROW_BTN_WIDTH, CART_ARROW_Y - ARROW_BTN_HEIGHT / 2,
            ARROW_BTN_WIDTH, ARROW_BTN_HEIGHT, null, BUTTON_CART_RIGHT, rightImg);

        // TODO: test
        // need to set 0
        totalHunger = 0;
        totalMeat = 0;
        totalGrain = 0;
        totalVegetable = 0;

        var progressWidth = theCanvas.width;
        var progressHeight = 8;
        var diffY = 10;
        var progressX = 0;
        var progressCurY = 332;
        var max = 100;

        hungerProgressBar = new ProgressBar(progressX, progressCurY, progressWidth, progressHeight, totalHunger, max);
        progressCurY += diffY;
        meatProgressBar = new ProgressBar(progressX, progressCurY, progressWidth, progressHeight, totalMeat, max);
        progressCurY += diffY;
        grainProgressBar = new ProgressBar(progressX, progressCurY, progressWidth, progressHeight, totalGrain, max);
        progressCurY += diffY;
        vegetableProgressBar = new ProgressBar(progressX, progressCurY, progressWidth, progressHeight, totalVegetable, max);

        EAT_AREA_X = 0;
        EAT_AREA_Y = 0;
        EAT_AREA_WIDTH = theCanvas.width;
        EAT_AREA_HEIGHT = 330;

        // draw
		drawScreen();
		
        theCanvas.addEventListener("mousedown", mouseDownListener, false);

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
        for (i = 0; i < cartMaxItem; i++) {
			if (cart[i + cartStartIndex].hitTest(mouseX, mouseY)) {	
				dragging = true;
				//the following variable will be reset if this loop repeats with another successful hit:
				dragIndex = i + cartStartIndex;
			}
		}
		
		if (dragging) {
			window.addEventListener("mousemove", mouseMoveListener, false);
			
			//shapeto drag is now last one in array
            dragHoldX = mouseX - cart[dragIndex].x;
            dragHoldY = mouseY - cart[dragIndex].y;
			
			//The "target" position is where the object should be if it were to move there instantaneously. But we will
			//set up the code so that this target position is approached gradually, producing a smooth motion.
			targetX = mouseX - dragHoldX;
			targetY = mouseY - dragHoldY;
			
			//start timer
			timer = setInterval(onTimerTick, 1000/30);
        }
        else if (btnTomorrow.mouseDownListener(mouseX, mouseY)) {
            GoTomorrow();
        }
        else if (btnCartLeft.mouseDownListener(mouseX, mouseY)) {
            CartLeft();
        }
        else if (btnCartRight.mouseDownListener(mouseX, mouseY)) {
            CartRight();
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
			cart[dragIndex].x = cart[dragIndex].x + easeAmount * (targetX - cart[dragIndex].x);
			cart[dragIndex].y = cart[dragIndex].y + easeAmount * (targetY - cart[dragIndex].y);
			
			//stop the timer when the target position is reached (close enough)
			if ((!dragging) && (Math.abs(cart[dragIndex].x - targetX) < 0.1) && (Math.abs(cart[dragIndex].y - targetY) < 0.1)) {
				cart[dragIndex].x = targetX;
				cart[dragIndex].y = targetY;
				//stop timer:
				clearInterval(timer);
                
                dragIndex = -1;s
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
            if (mouseX >= EAT_AREA_X && mouseX <= EAT_AREA_X + EAT_AREA_WIDTH &&
                mouseY >= EAT_AREA_Y && mouseY <= EAT_AREA_Y + EAT_AREA_HEIGHT) {
                Eat();
            }
            else {
                targetX = cart[dragIndex].origX;
                targetY = cart[dragIndex].origY;
            }
		}
	}

	function mouseMoveListener(evt) {
		var posX;
		var posY;
        var minX = cart[dragIndex].width / 2;
        var maxX = theCanvas.width - cart[dragIndex].width / 2;
        var minY = cart[dragIndex].height / 2;
        var maxY = theCanvas.height - cart[dragIndex].height / 2;

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
		
    function drawCart() {
		var i;
        for (i = 0; i < cartMaxItem; ++i) {
            if (i == dragIndex && dragging) {
                continue;
            }
			cart[cartStartIndex + i].setX(i * 80 + 40);
			cart[cartStartIndex + i].drawToContext(context);
        }

        if (dragging) {
            cart[dragIndex].drawToContext(context);
        }
	}
	
	function drawScreen() {
		//bg
        context.drawImage(homeBackground, 0, 0);
		
        btnTomorrow.drawToContext(context);
        btnCartLeft.drawToContext(context);
        btnCartRight.drawToContext(context);

        hungerProgressBar.drawToContext(context);
        meatProgressBar.drawToContext(context);
        grainProgressBar.drawToContext(context);
        vegetableProgressBar.drawToContext(context);
        
        dayDisplay(currentDay);

        if (cart != null) {
            drawCart();
        }
    }

    function Eat() {
        if(mouseX >= 0 && mouseY >= 0 && mouseY <= 300){
			if(hungerProgressBar.current < MAX_HUNGER) {
				hungerProgressBar.current = Math.min(hungerProgressBar.current + cart[dragIndex].hunger, MAX_HUNGER);
				meatProgressBar.current = Math.min(meatProgressBar.current + cart[dragIndex].meat, MAX_HUNGER);
				grainProgressBar.current = Math.min(grainProgressBar.current + cart[dragIndex].grain, MAX_HUNGER);
				vegetableProgressBar.current = Math.min(vegetableProgressBar.current + cart[dragIndex].vegetable, MAX_HUNGER);
				cart.splice(dragIndex, 1);
				dragIndex = -1;
		        cartMaxItem = Math.min(numCartItems, cart.length - cartStartIndex);
			}
			else {
				targetX = cart[dragIndex].origX;
                targetY = cart[dragIndex].origY;
			}
		}
		
    }
    
    function GoTomorrow() {
		hungerProgressBar.current = 0;
		meatProgressBar.current = 0;
		grainProgressBar.current = 0;
		vegetableProgressBar.current = 0;
        
        currentDay += 1; //increase day by 1
        drawScreen();
    }
    
    function dayDisplay(currentDay) {
        switch (currentDay) {
            case 1:
                context.drawImage(day2Image,theCanvas.width - 60, 10, 50, 25);
                break;
            case 2:
                context.drawImage(day3Image,theCanvas.width - 60, 10, 50, 25);
                break;
            case 3:
                context.drawImage(day4Image,theCanvas.width - 60, 10, 50, 25);
                break;
            case 4:
                context.drawImage(day5Image,theCanvas.width - 60, 10, 50, 25);
                break;
            case 5:
                context.drawImage(day6Image,theCanvas.width - 60, 10, 50, 25);
                break;
            case 6:
                context.drawImage(day7Image,theCanvas.width - 60, 10, 50, 25); 
                break;
            default:
                context.drawImage(day1Image,theCanvas.width - 60, 10, 50, 25);
                break;
        }  
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
        if (currentPage != Math.floor((cart.length - 1) / 4)) {
			currentPage++;
		}

        cartStartIndex = currentPage * numCartItems;
        cartMaxItem = Math.min(numCartItems, cart.length - cartStartIndex);

        drawScreen();
    }	
}
