

function ProgressBar(posX, posY, width, height, current, max)
{
    // position
    this.x = posX;
    this.y = posY;

    // size
    this.width = width;
    this.height = height;

    this.bgcolor = "#FFFFFF";
    this.vcolor = "#FF0000";
    
    // data
    this.current = current;
    this.max = max;
}

// draw progressbar
ProgressBar.prototype.drawToContext = function (theContext)
{
    theContext.fillStyle = this.bgcolor;
    theContext.fillRect(this.x, this.y, this.width, this.height);

    theContext.fillStyle = this.vcolor;
    theContext.fillRect(this.x, this.y, this.width * (this.current / this.max), this.height);
}