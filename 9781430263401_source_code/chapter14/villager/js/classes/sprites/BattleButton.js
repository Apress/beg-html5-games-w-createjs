(function (window) {

    window.game = window.game || {}

    function BattleButton(frame, quanity) {
        this.initialize(frame, quanity);
    }

    var p = BattleButton.prototype = new createjs.Container();

    p.Container_initialize = p.initialize;

    p.quanityTxt = null;

    p.frame = null;
    p.type = null;
    p.quanity = null;
    p.isDown = null;

    p.initialize = function (frame, quanity) {
        this.Container_initialize();
        this.isDown = false;
        this.frame = this.type = frame;
        this.quanity = quanity * 1;
        this.addSprite();
        this.setQuanity();
        this.cacheButton();
        this.enableButton();
    }
    p.addSprite = function () {
        var sprite = new createjs.Sprite(spritesheet, this.frame);
        var bounds = sprite.getBounds();
        this.setBounds(0, 0, bounds.width, bounds.height);
        this.regX = bounds.width / 2;
        this.regY = bounds.height;
        this.addChild(sprite);
    }
    p.setQuanity = function () {
        if (this.quanity >= 0) {
            var xPos = 25;
            var yOffset = 28;
            var yPos = this.getBounds().height - yOffset;
            this.quanityTxt = new createjs.BitmapText(this.quanity.toString(), spritesheet);
            this.quanityTxt.x = xPos;
            this.quanityTxt.y = yPos;
            this.addChild(this.quanityTxt);
        }
    }
    p.updateQuanity = function (quanity) {
        this.quanity += quanity;
        this.removeChild(this.quanityTxt);
        this.uncache(0, 0, this.getBounds().width, this.getBounds().height);
        this.setQuanity();
        this.cacheButton();
    }
    p.cacheButton = function () {
        this.cache(0, 0, this.getBounds().width, this.getBounds().height);
    }
    p.enableButton = function () {
        this.mouseEnabled = true;
        this.alpha = 1;
        this.resetButton();
    }
    p.disableButton = function () {
        this.mouseEnabled = false;
        this.alpha = .3;
        this.scaleX = this.scaleY = 1;
    }
    p.selectButton = function () {
        this.scaleX = this.scaleY = .9;
        this.mouseEnabled = false;
    }
    p.resetButton = function () {
        createjs.Tween.get(this).to({scaleX:1, scaleY:1}, 100);
    }
    window.game.BattleButton = BattleButton;

}(window));