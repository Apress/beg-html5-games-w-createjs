(function () {

    var SpritePool = function (type, length) {
        this.pool = [];
        var i = length;
        while (--i > -1) {
            this.pool[i] = new type();
        }
    }
    SpritePool.prototype.getSprite = function () {
        if (this.pool.length > 0) {
            return this.pool.pop();
        }
        else {
            throw new Error("You ran out of sprites!");
        }
    }
    SpritePool.prototype.returnSprite = function (sprite) {
        this.pool.push(sprite);
    }

    window.game.SpritePool = SpritePool;

}());


