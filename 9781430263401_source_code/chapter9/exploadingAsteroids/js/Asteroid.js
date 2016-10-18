(function () {

    window.game = window.game || {};

    var Asteroid = function (spritesheet) {
        this.initialize(spritesheet);
    }
    var p = Asteroid.prototype = new createjs.Sprite();

    p.Sprite_initialize = p.initialize;

    p.EXPLOSION_COMPLETE = 'explosion complete';

    p.bounds = null;
    p.speed = null;

    p.initialize = function (spritesheet) {
        this.Sprite_initialize(spritesheet);
        var frame = this.speed = Math.floor(Math.random() * 4) + 1;
        this.gotoAndStop('asteroid' + this.frame);
        this.bounds = this.getBounds();
        this.regX = this.bounds.width / 2;
        this.regY = this.bounds.height / 2;
        this.on('tick', this.move);
    }
    p.move = function (e) {
        this.rotation += this.speed;
        this.y += this.speed * 2;
        if (this.y > canvas.height + this.bounds.height) {
            this.y = -this.bounds.height;
        }
    }
    p.explode = function () {
        this.speed /= 2;
        this.on('animationend', this.explosionComplete);
        this.gotoAndPlay('explosion');
        createjs.Sound.play(game.assets.EXPLOSION);
    }
    p.explosionComplete = function (e) {
        this.stop();
        this.dispatchEvent(this.EXPLOSION_COMPLETE);
    }

    window.game.Asteroid = Asteroid;
}());