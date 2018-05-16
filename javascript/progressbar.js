// HUNGER
function ProgressBar1(posX, posY, width, height, current, max)
{
    // position
    this.x = posX;
    this.y = posY;

    // size
    this.width = width;
    this.height = height;

    this.bgcolor = "#FFFFFF";
    this.vcolor = "#4169e1";
    
    // data
    this.current = current;
    this.max = max;
}


// MEAT
function ProgressBar2(posX, posY, width, height, current, max)
{
    // position
    this.x = posX;
    this.y = posY;

    // size
    this.width = width;
    this.height = height;

    this.bgcolor = "#FFFFFF";
    this.vcolor = "#ED4337";
    
    // data
    this.current = current;
    this.max = max;
}

// GRAIN
function ProgressBar3(posX, posY, width, height, current, max)
{
    // position
    this.x = posX;
    this.y = posY;

    // size
    this.width = width;
    this.height = height;

    this.bgcolor = "#FFFFFF";
    this.vcolor = "#ffa500";
    
    // data
    this.current = current;
    this.max = max;
}


// VEGETABLE
function ProgressBar4(posX, posY, width, height, current, max)
{
    // position
    this.x = posX;
    this.y = posY;

    // size
    this.width = width;
    this.height = height;

    this.bgcolor = "#FFFFFF";
    this.vcolor = "#50c878";
    
    // data
    this.current = current;
    this.max = max;
}

// draw progressbar
ProgressBar1.prototype.drawToContext = function (theContext)
{
    theContext.fillStyle = this.bgcolor;
    theContext.fillRect(this.x, this.y, this.width, this.height);

    theContext.fillStyle = this.vcolor;
    theContext.fillRect(this.x, this.y, this.width * (this.current / this.max), this.height);
}

// draw progressbar
ProgressBar2.prototype.drawToContext = function (theContext)
{
    theContext.fillStyle = this.bgcolor;
    theContext.fillRect(this.x, this.y, this.width, this.height);

    theContext.fillStyle = this.vcolor;
    theContext.fillRect(this.x, this.y, this.width * (this.current / this.max), this.height);
}

// draw progressbar
ProgressBar3.prototype.drawToContext = function (theContext)
{
    theContext.fillStyle = this.bgcolor;
    theContext.fillRect(this.x, this.y, this.width, this.height);

    theContext.fillStyle = this.vcolor;
    theContext.fillRect(this.x, this.y, this.width * (this.current / this.max), this.height);
}

// draw progressbar
ProgressBar4.prototype.drawToContext = function (theContext)
{
    theContext.fillStyle = this.bgcolor;
    theContext.fillRect(this.x, this.y, this.width, this.height);

    theContext.fillStyle = this.vcolor;
    theContext.fillRect(this.x, this.y, this.width * (this.current / this.max), this.height);
}