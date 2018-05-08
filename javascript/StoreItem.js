// Simple class example
var fruit_apple = new Image();  
fruit_apple.src = '../images/apple.png'; 


function StoreItem(posX, posY) {
		this.x = posX;
		this.y = posY;
		this.velX = 0;
		this.velY = 0;
		this.accelX = 0;
		this.accelY = 0;
		this.color = "#FF0000";
        this.radius = 10;
}

//The function below returns a Boolean value representing whether the point with the coordinates supplied "hits" the particle.
StoreItem.prototype.hitTest = function(hitX,hitY) {
	return((hitX > this.x - this.radius)&&(hitX < this.x + this.radius)&&(hitY > this.y - this.radius)&&(hitY < this.y + this.radius));
}

//A function for drawing the particle.
StoreItem.prototype.drawToContext = function (theContext) {    
    theContext.drawImage(fruit_apple, this.x, this.y, this.radius, this.radius);
	//theContext.fillStyle = this.color;
	//theContext.fillRect(this.x - this.radius, this.y - this.radius, 2*this.radius, 2*this.radius);
}