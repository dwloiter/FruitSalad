// Simple class example
var fruit_apple = new Image();  
fruit_apple.src = '../images/apple.png'; 

function StoreItem(posX, posY, width, height) {
    // position
    this.x = posX;
    this.y = posY;

    // size
    this.width = width;
    this.height = height;

    // temp data. max is 100
    this.hunger = 10;

    switch (Math.floor(Math.random() * 3)) {
        case 1:
            this.meat = 10;
            this.grain = 0;
            this.vegetable = 0;
            break;

        case 2:
            this.meat = 0;
            this.grain = 10;
            this.vegetable = 0;
            break;

        default:
            this.meat = 0;
            this.grain = 0;
            this.vegetable = 10;
            break;
    }

    var progressWidth = this.width - 20;
    var progressHeight = 5;
    var diffY = 8;
    var progressX = 10 + this.x;
    var progressCurY = this.y + this.height;
    var max = 100;

    this.hungerProgressBar = new ProgressBar(progressX, progressCurY, progressWidth, progressHeight, this.hunger, max);
    progressCurY += diffY;
    this.meatProgressBar = new ProgressBar(progressX, progressCurY, progressWidth, progressHeight, this.meat, max);
    progressCurY += diffY;
    this.grainProgressBar = new ProgressBar(progressX, progressCurY, progressWidth, progressHeight, this.grain, max);
    progressCurY += diffY;
    this.vegetableProgressBar = new ProgressBar(progressX, progressCurY, progressWidth, progressHeight, this.vegetable, max);
}

//The function below returns a Boolean value representing whether the point with the coordinates supplied "hits" the particle.
StoreItem.prototype.hitTest = function (hitX, hitY) {
    return (hitX > this.x && hitX < this.x + this.width && hitY > this.y && hitY < this.y + this.height);
}

//A function for drawing the particle.
StoreItem.prototype.drawToContext = function (theContext) {

    theContext.drawImage(fruit_apple, this.x, this.y, this.width, this.height);

    this.hungerProgressBar.drawToContext(theContext);
    this.meatProgressBar.drawToContext(theContext);
    this.grainProgressBar.drawToContext(theContext);
    this.vegetableProgressBar.drawToContext(theContext);

}