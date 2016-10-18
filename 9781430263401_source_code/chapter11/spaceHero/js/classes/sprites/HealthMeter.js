(function (window) {

    window.game = window.game || {}

    function HealthMeter() {
        this.initialize();
    }

    var p = HealthMeter.prototype = new createjs.Container();

    p.meter = null;
    p.maxDamage = null;
    p.damage = 0;
    p.empty = false;

    p.Container_initialize = p.initialize;

    p.initialize = function () {
        this.Container_initialize();
        this.x = this.y = 5;
        this.buildMeter();
    }
    p.buildMeter = function () {
        var health = new createjs.Sprite(spritesheet, 'healthHUD');
        this.meter = new createjs.Sprite(spritesheet, 'progessHUD');
        this.maxDamage = this.meter.spriteSheet.getAnimation(this.meter.currentAnimation).frames.length - 1;
        this.meter.paused = true;
        this.addChild(health, this.meter);
    }
    p.takeDamage = function (damage) {
        this.damage += damage;
        var perc = this.damage / this.maxDamage > 1 ? 1 : this.damage / this.maxDamage;
        var frame = (this.maxDamage * perc);
        createjs.Tween.get(this.meter).to({currentAnimationFrame:frame}, 100)
            .call(this.checkHealth, null, this);
    }
    p.checkHealth = function (e) {
        if (this.meter.currentAnimationFrame === this.maxDamage) {
            this.empty = true;
        }
    }
    p.reset = function (e) {
        this.damage = 0;
        this.empty = false;
        this.meter.currentAnimationFrame = 0;
    }

    window.game.HealthMeter = HealthMeter;

}(window));