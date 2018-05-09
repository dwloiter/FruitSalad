

function Button(posX, posY, width, height, message)
{
    // position
    this.x = posX;
    this.y = posY;

    // size
    this.width = width;
    this.height = height;

    this.bgcolor = "#00FFFF";
    this.textColor = "#FF0000";
    
    // data
    this.message = message;
}

// draw progressbar
Button.prototype.drawToContext = function (theContext)
{
    theContext.fillStyle = this.bgcolor;
    theContext.fillRect(this.x, this.y, this.width, this.height);

    theContext.fillStyle = this.textColor;
    theContext.textAlign = "center";
    theContext.fillText(this.message, this.x + this.width / 2, this.y + this.height / 2);
}