/* 
===================
==== VARIABLES ==== 
===================
*/
var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');

var gameStart = false;

var img = new Image();  
img.src = '../images/UI/shelf.jpg'; 

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
	context.fillText("Fruit Salad", canvas.width/2, canvas.height/2);
    
    /* Instructions */
	context.font = "15px Courier";
	context.fillText("Click or Tap To Start", canvas.width/2, canvas.height/2 + 35);
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
/* Event listener: If mousedown... */
document.body.addEventListener("mousedown", function(event){
    // If game is not started.
    if (!gameStart) {
        gameStart = true;
        canvasApp(); // Run startGame
    }
});

var foodImages = new Map();

$(function () {
    $.ajax({
        url: '../php/FoodDataLoad.php',                  //the script to call to get data          
        type: "post",
        data: { getData: true },
        dataType: 'json',                //data format      
        success: function (data)          //on recieve of reply
        {
            foodDatas = data;
            var i;
            for (i = 0; i < foodDatas.length; ++i)
            {
                var tempImage = new Image();
                tempImage.src = '../images/Food/' + foodDatas[i].Name + '.png';
                foodImages.set(foodDatas[i].Name, tempImage);
            }
        }
    });
});

/* Run main menu screen */
main_menu();

/* Login js */
    
// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var modal = document.getElementById('id02');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}