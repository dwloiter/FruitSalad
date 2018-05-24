
var POPUP_MARGIN_X = 10;
var POPUP_MARGIN_Y = 10;
var POPUP_TEXT_DIFF_Y = 10;
var POPUP_NO_BTN = 0;
var POPUP_BTN_OK = 1;

var PopupTimer;

function Popup(width, height, bgImage) {
    this.x = this.width / 2;
    this.y = this.height / 2;

    // size
    this.width = width;
    this.height = height;
    this.origHeight = height;

    // color
    this.bgcolor = "#00FF";
    this.textColor = "#FFFF00";

    // image
    this.bgImage = bgImage;

    this.showButton = POPUP_NO_BTN;
    this.btn = new Button(0, 0, 50, 20, "OK", 0, null);
    this.isShow = false;
}


Popup.prototype.showMessage = function (theContext, message, showButton, duration, callback)
{
    var size = theContext.measureText(message);
    this.width = size.width + POPUP_MARGIN_X;
    if (message == "") {
        this.width = 450;
        this.height = 500;
        }
    this.x = (theContext.canvas.width - this.width) / 2;
    this.y = (theContext.canvas.height - this.height) / 2;
    this.btn.x = (theContext.canvas.width - this.btn.width) / 2;
    this.btn.y = (theContext.canvas.height - this.btn.height) / 2 + 20;

    this.showButton = showButton;
    this.message = message;
    this.callback = callback;

    if (showButton == POPUP_NO_BTN)
    {
        var t = this;
        PopupTimer = setInterval(function () { t.close(); }, duration);
    }

    this.isShow = true;
}

/*
Popup.prototype.showMessage = function (theContext, image, showButton, duration, callback)
{
    this.width = size.width + POPUP_MARGIN_X;
    this.x = (theContext.canvas.width - this.width) / 2;
    this.y = (theContext.canvas.height - this.height) / 2;
    this.btn.x = (theContext.canvas.width - this.btn.width) / 2;
    this.btn.y = (theContext.canvas.height - this.btn.height) / 2 + 20;

    this.showButton = showButton;
    this.callback = callback;

    if (showButton == POPUP_NO_BTN)
    {
        var t = this;
        PopupTimer = setInterval(function () { t.close(); }, duration);
    }

    this.isShow = true;
}
*/

Popup.prototype.mouseDownListener = function (mouseX, mouseY) {
    if (this.isShow) {

        if (this.showButton && this.btn.mouseDownListener(mouseX, mouseY)) {
            this.close();
        }
        return true;
    }

    return false;
}

Popup.prototype.close = function () {
    clearInterval(PopupTimer);
    this.isShow = false;
    this.callback();
}

// draw button
Popup.prototype.drawToContext = function (theContext) {
    if (!this.isShow)
    {
        return;
    }

    if (this.showButton == POPUP_BTN_OK)
    {
        this.height = this.origHeight + this.btn.height + 10;
    }

    if (this.bgImage != null)
    {
        theContext.drawImage(this.bgImage, this.x, this.y, this.width, this.height);
    }
    else
    {
        theContext.fillStyle = this.bgcolor;
        theContext.fillRect(this.x, this.y, this.width, this.height);
    }
    theContext.fillStyle = this.textColor;
    theContext.textAlign = "center";
    theContext.fillText(this.message, this.x + this.width / 2, this.y + POPUP_TEXT_DIFF_Y);

    if (this.showButton == POPUP_BTN_OK)
    {
        this.btn.x = this.x + (this.width - this.btn.width) / 2;
        this.btn.y = this.y + this.height - this.btn.height - 5;
        this.btn.drawToContext(theContext);
    }
}