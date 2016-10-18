(function (window) {

    window.game = window.game || {}

    function EnemyHealthBar(maxHP) {
        this.maxHP = this.HP = maxHP;
        this.initialize();
    }

    var p = EnemyHealthBar.prototype = new createjs.Container();

    p.Container_initialize = p.initialize;

    p.progressBar = null;
    p.maxHP = null;
    p.HP = null;
    p.hpTxt = null;

    p.initialize = function () {
        this.Container_initialize();
        this.addHealthBar();
        this.addHP();
    }
    p.addHealthBar = function () {
        var barXOffset = 10;
        var enemyBar = new createjs.Sprite(spritesheet, 'enemyBar');
        var enemyBarBounds = enemyBar.getBounds();
        var barBG = new createjs.Shape();
        barBG.graphics.beginFill('#b6b6b6').drawRect(0, 0, enemyBarBounds.width, enemyBarBounds.height);
        this.progressBar = new createjs.Shape();
        this.progressBar.graphics.beginFill('#c14545').drawRect(0, 0, enemyBarBounds.width - barXOffset, enemyBarBounds.height);
        this.progressBar.x = barXOffset;
        this.addChild(barBG, this.progressBar, enemyBar);
    }
    p.addHP = function () {
        var txtXOffset = 8;
        var yPOs = 13;
        this.hpTxt = new createjs.BitmapText(this.HP.toString(), spritesheet);
        this.hpTxt.letterSpacing = 2;
        this.hpTxt.x = this.getBounds().width / 2 - txtXOffset;
        this.hpTxt.y = yPOs;
        this.addChild(this.hpTxt);
    }
    p.updateHP = function (HP) {
        var perc;
        this.HP = this.HP - HP < 0 ? 0 : this.HP - HP;
        perc = this.HP / this.maxHP;
        this.removeChild(this.hpTxt);
        this.addHP();
        createjs.Tween.get(this.progressBar).to({scaleX:perc}, 400);
    }

    window.game.EnemyHealthBar = EnemyHealthBar;

}(window));