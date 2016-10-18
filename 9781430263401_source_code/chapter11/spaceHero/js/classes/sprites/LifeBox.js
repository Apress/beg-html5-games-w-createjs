(function (window) {

    window.game = window.game || {}

    function LifeBox(numLives) {
        this.numLives = numLives;
        this.initialize();
    }

    var p = LifeBox.prototype = new createjs.Container();

    p.numLives = null;

    p.Container_initialize = p.initialize;

    p.initialize = function () {
        this.Container_initialize();
        this.buildSprites();
        this.positionBox();
    }
    p.buildSprites = function () {
        var i, life;
        var xPos = 0;
        for (i = 0; i < this.numLives; i++) {
            life = new createjs.Sprite(spritesheet, 'life');
            life.paused = true;
            life.x = xPos;
            this.addChild(life);
            xPos += life.getBounds().width;
        }
    }
    p.positionBox = function () {
        this.x = screen_width - this.getBounds().width;
        this.y = screen_height - this.getBounds().height;
    }
    p.removeLife = function () {
        var life = this.getChildAt(0);
        life.on('animationend', function (e) {
            e.target.stop();
            this.removeChild(e.target);
        }, this)
        life.play();
    }

    window.game.LifeBox = LifeBox;

}(window));