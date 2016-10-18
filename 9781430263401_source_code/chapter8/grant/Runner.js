(function () {

    window.sprites = window.sprites || {};

    var Runner = function (spritesheet) {
        this.initialize(spritesheet);
    }
    var p = Runner.prototype = new createjs.Sprite();

    p.Sprite_initialize = p.initialize;

    p.speed = 0;

    p.initialize = function (spritesheet) {
        this.Sprite_initialize(spritesheet, 'idle');
        this.on('tick', function (e) {
            this.x += this.speed;
            if (this.x > stage.canvas.width) {
                this.x = -this.getBounds().width;
            }
        })
    }
    p.run = function () {
        if (this.currentAnimation === 'idle') {
            this.gotoAndPlay('run');
            this.speed = 10;
        }
    }
    p.jump = function () {
        if (this.currentAnimation != 'jump') {
            this.gotoAndPlay('jump');
            this.on('animationend', function (e) {
                if (this.speed > 0) {
                    this.gotoAndPlay('run');
                }
            })
        }
    }
    p.stand = function () {
        if (this.currentAnimation === 'run') {
            this.gotoAndStop('idle');
            this.speed = 0;
        }
    }


    window.sprites.Runner = Runner;
}());