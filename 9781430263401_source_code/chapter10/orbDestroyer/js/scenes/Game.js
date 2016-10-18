(function (window) {

    window.game = window.game || {}

    function Game() {
        this.initialize();
    }

    var p = Game.prototype = new createjs.Container();

    p.Container_initialize = p.initialize;

    p.msgTxt = null;
    p.orbContainer = null;

    p.initialize = function () {
        this.Container_initialize();
        this.addBG();
        this.addMessages();
        this.createOrbContainer();
        this.createOrbs();
    }
    p.addBG = function () {
        var bg = new createjs.Shape();
        bg.graphics.beginFill('#92CBD6').drawRect(0, 0, canvas.width, canvas.height);
        this.addChild(bg);
    }
    p.addMessages = function () {
        this.msgTxt = new createjs.Text("HELLO", '24px Arial', '#FFF');
        this.addChild(this.msgTxt);
    }
    p.createOrbContainer = function () {
        this.orbContainer = new createjs.Container();
        this.addChild(this.orbContainer);
    }
    p.createOrbs = function () {
        var i, orb, color;
        var orbs = this.orbContainer;
        var numOrbs = 12;
        var orbSize = 25;
        for (i = 0; i < numOrbs; i++) {
            color = '#' + Math.floor(Math.random() * 16777215).toString(16)
            orb = new PulsingOrb(color, orbSize);
            orb.speed = Math.random() * 4;
            orb.size = orbSize;
            orb.x = orbSize;
            orb.y = orbSize + (i * orbSize * 2);
            orb.on('click', this.onOrbClick, this);
            orbs.addChild(orb);
        }
    }
    p.onOrbClick = function (e) {
        this.orbContainer.removeChild(e.target);
    }
    p.update = function () {
        var i, orb, nextX;
        var len = this.orbContainer.getNumChildren();
        for (i = 0; i < len; i++) {
            orb = this.orbContainer.getChildAt(i);
            nextX = orb.x + orb.speed;
            if (nextX + orb.size > canvas.width) {
                nextX = canvas.width - orb.size;
                orb.speed *= -1;
            }
            else if (nextX - orb.size < 0) {
                nextX = orb.size;
                orb.speed *= -1;
            }
            orb.nextX = nextX;
        }
    }
    p.render = function () {
        var i, orb;
        var len = this.orbContainer.getNumChildren();
        for (i = 0; i < len; i++) {
            orb = this.orbContainer.getChildAt(i);
            orb.x = orb.nextX;
        }
        this.msgTxt.text = "ORBS LEFT: " + this.orbContainer.getNumChildren();
    }
    p.checkGame = function () {
        if (!this.orbContainer.getNumChildren()) {
            this.dispatchEvent(game.GameStateEvents.GAME_OVER);
        }
    }
    p.run = function () {
        this.update();
        this.render();
        this.checkGame();
    }

    window.game.Game = Game;

}(window));