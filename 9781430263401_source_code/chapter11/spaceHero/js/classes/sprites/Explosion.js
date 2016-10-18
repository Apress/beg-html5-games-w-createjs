(function (window) {

    window.game = window.game || {}

    function Explosion() {
        this.initialize();
    }

    var p = Explosion.prototype = new createjs.Sprite();

    p.Sprite_initialize = p.initialize;

    p.initialize = function () {
        this.Sprite_initialize(spritesheet,'explosion');
        this.paused = true;
    }
    p.reset = function(){
        this.gotoAndStop('explosion');
    }

    window.game.Explosion = Explosion;

}(window));