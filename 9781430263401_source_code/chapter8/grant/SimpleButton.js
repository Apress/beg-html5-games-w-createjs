(function () {

    window.ui = window.ui || {};

    var SimpleButton = function (label) {
        this.label = label;
        this.initialize();
    }
    SimpleButton.prototype = new createjs.Container();

    // SimpleButton properties
    SimpleButton.prototype.background;
    SimpleButton.prototype.label;
    SimpleButton.prototype.width;
    SimpleButton.prototype.height;
    SimpleButton.prototype.fontSize = 24;
    SimpleButton.prototype.borderColor = '#000';
    SimpleButton.prototype.buttonColor = '#ccc';
    SimpleButton.prototype.upColor = '#ccc';
    SimpleButton.prototype.overColor = '#aaa';

    SimpleButton.prototype.Container_initialize = SimpleButton.prototype.initialize;

    SimpleButton.prototype.initialize = function (label) {
        this.Container_initialize();
        this.drawButton();
        this.setButtonListeners();
    }
    SimpleButton.prototype.drawButton = function(){
        this.removeAllChildren();
        var labelTxt = new createjs.Text(this.label,this.fontSize + 'px Arial');
        labelTxt.textAlign = 'center';
        labelTxt.textBaseline = 'top';
        this.width = labelTxt.getMeasuredWidth() + 30;
        this.height = labelTxt.getMeasuredHeight() + 20;
        labelTxt.x = this.width / 2;
        labelTxt.y = 10;
        this.background = new createjs.Shape();
        this.background.graphics.beginStroke(this.borderColor).beginFill(this.buttonColor).drawRect(0,0,this.width,this.height);
        this.addChild(this.background,labelTxt);
    }
    SimpleButton.prototype.setButtonListeners = function(){
        this.cursor = 'pointer';
        this.on('rollover',this.onButtonOver);
        this.on('rollout',this.onButtonOut);
    }
    SimpleButton.prototype.onButtonOver = function(){
        this.buttonColor = this.overColor;
        this.drawButton();
    }
    SimpleButton.prototype.onButtonOut = function(){
        this.buttonColor = this.upColor;
        this.drawButton();
    }

    // Set methods
    SimpleButton.prototype.setUpColor = function(color){
        this.upColor = color;
        this.buttonColor = color;
        this.drawButton();
    }
    SimpleButton.prototype.setOverColor = function(color){
        this.overColor = color;
    }
    SimpleButton.prototype.setFontSize = function(size){
        this.fontSize = size;
        this.drawButton();
    }

    window.ui.SimpleButton = SimpleButton;
}());
