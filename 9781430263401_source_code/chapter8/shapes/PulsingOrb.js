(function () {

    var PulsingOrb = function (color,size) {
        this.initialize(color,size);
    }

    var p = PulsingOrb.prototype = new createjs.Shape();

    p.count = 0;

    PulsingOrb.prototype.Shape_initialize = p.initialize;

    PulsingOrb.prototype.initialize = function (color,size) {
        size = size != undefined ? size : 20;
        color = color != undefined ? color : '#F00';
        this.Shape_initialize();
        this.alpha = Math.random();
        this.graphics.beginFill(color).drawCircle(0, 0, size);
        this.on('tick', this.pulse);
    }
    PulsingOrb.prototype.pulse = function () {
        this.alpha = Math.cos(this.count++ * 0.1) * 0.4 + 0.6;
    }
    window.PulsingOrb = PulsingOrb;
}());