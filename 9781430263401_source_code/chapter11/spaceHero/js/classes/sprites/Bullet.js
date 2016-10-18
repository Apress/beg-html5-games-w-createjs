(function (window) {

    window.game = window.game || {}

    function Bullet() {
        this.initialize();
    }

    var p = Bullet.prototype = new createjs.Sprite();

    p.Sprite_initialize = p.initialize;

    p.speed = 500;
    p.nextY = null;
    p.shouldDie = false;

    p.initialize = function () {
        this.Sprite_initialize(spritesheet, "bullet");
        this.paused = true;
    }
    p.reset = function () {
        this.shouldDie = false;
    }

    window.game.Bullet = Bullet;

}(window));