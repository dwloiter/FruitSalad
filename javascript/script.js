/* 
===================
==== VARIABLES ==== 
===================
*/
var canvas = document.getElementById('gamecanvas');
var context = canvas.getContext('2d');

var gameStart = false;

var img = new Image();  
img.src = '../images/shelf.jpg'; 

var foodDatas;


/* 
===================
==== FUNCTIONS ==== 
===================
*/
//  Main Menu display. (TEXT)
function main_menu(){
    /* Main Title */
	context.font = "45px Courier";
	context.fillStyle = "#653789";
	context.textAlign = "center";
	context.fillText("HTML5 Game", canvas.width/2, canvas.height/2);
    
    /* Instructions */
	context.font = "15px Courier";
	context.fillText("Press ENTER To Start", canvas.width/2, canvas.height/2 + 35);
}

/*  Start game function. */
function startGame(){
	gameStart = true;
	clear();
    
    context.drawImage(img, 0, 0);
}

/* Clear function: Clears all things on canvas when called. */
function clear(){
	context.clearRect(0, 0, 1000, 1000);
}



/*
=====================
===== Main Code =====
=====================
*/
/* Event listener: If ENTER is pressed... */
document.body.addEventListener("keydown", function(event){
    // If ENTER (keyCode 13) is pressed AND game is not started.
    if (event.keyCode == 13 && !gameStart) {
        startGame();
	}

});

$(function () {
    $.ajax({
        url: '../php/FoodDataLoad.php',                  //the script to call to get data          
        type: "post",
        data: { getData: true },
        dataType: 'json',                //data format      
        success: function (data)          //on recieve of reply
        {
            foodDatas = data;

            gameStart = true;
            canvasApp();
        }
    });
});

/* Run main menu screen */
main_menu();