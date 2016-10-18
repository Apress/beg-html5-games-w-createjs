(function () {

    window.game = window.game || {}

    function Hero() {
        this.initialize();
    }

    var p = Hero.prototype = new createjs.EventDispatcher();

    p.EventDispatcher_initialize = p.initialize;

    p.HP = null;
    p.maxHP = null;
    p.power = null;
    p.defense = null;
    p.potion = null;
    p.earth = null;
    p.fire = null;
    p.lightning = null;
    p.gameLevel = null;

    p.initialize = function () {
        this.EventDispatcher_initialize();
        this.loadData()
    }
    p.loadData = function () {
        var value;
        var data = window.data.PlayerData.player;
        for (var key in data) {
            value = data[key];
            this[key] = (value * 1);
        }
        this.HP = this.maxHP;
    }
    p.takeDamage = function (damage) {
        var totalDamage = damage - this.defense;
        this.HP -= totalDamage > 0 ? totalDamage : 0;
        this.HP = this.HP >= 0 ? this.HP : 0;
    }
    p.updateInventory = function (item, quanity) {
        this[item] += quanity;
    }
    p.saveStats = function () {
        var value;
        var data = window.data.PlayerData.player;
        for (var key in data) {
            value = this[key];
            data[key] = (value * 1);
        }
    }

    window.game.Hero = Hero;

}());