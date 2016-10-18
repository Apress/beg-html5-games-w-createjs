(function() {

    var Pig = function(ss) {
        this.initialize(ss);
    }
    Pig.prototype = new createjs.Sprite();

    Pig.prototype.Sprite_initialize = Pig.prototype.initialize;

    Pig.prototype.initialize = function(ss) {
        this.Sprite_initialize(ss);
        this.play();
        // add custom setup logic here.
    }

    window.Pig = Pig;
}());
