(function () {

    window.game = window.game || {}

    function BattlePanel(hero) {
        this.hero = hero;
        this.initialize();
    }

    var p = BattlePanel.prototype = new createjs.Container();

    p.Container_initialize = p.initialize;

    p.SPEED = 8;

    p.hero = null;
    p.waitBar = null;
    p.buttonHolder = null;
    p.hpTxt = null;

    p.waitingToAttack = null;
    p.currentAttackButton = null;

    p.initialize = function () {
        this.Container_initialize();
        this.addWaitBar();
        this.addBG();
        this.addHeroHP();
        this.addButtons();
        this.disableButtons();
    }
    p.addWaitBar = function () {
        var progressWidth = 365;
        var progressBG = new createjs.Shape();
        this.waitingToAttack = false;
        this.waitBar = new createjs.Shape();
        progressBG.graphics.beginFill('#b6b6b6').drawRect(0, 0, progressWidth, 40);
        this.waitBar.graphics.beginFill('#45c153').drawRect(0, 0, progressWidth, 40);
        this.waitBar.scaleX = 0;
        progressBG.x = this.waitBar.x = screen_width - progressWidth;
        this.addChild(progressBG, this.waitBar);
    }
    p.addBG = function () {
        var bg = new createjs.Sprite(spritesheet, 'battlePanel');
        this.addChild(bg);
    }
    p.addHeroHP = function () {
        var hero = new createjs.Sprite(spritesheet, 'hero');
        hero.y = -15;
        hero.x = 20;
        this.addChild(hero);
        this.hpTxt = new createjs.BitmapText('', spritesheet);
        this.hpTxt.letterSpacing = 3;
        this.hpTxt.x = 150;
        this.hpTxt.y = 15;
        this.addChild(this.hpTxt);
    }
    p.addButtons = function () {
        var i, btn, btnWidth, prevButton;
        var btns = ['attack', 'potion', 'fire', 'earth', 'lightning' ];
        var player = data.PlayerData.player;
        var xPos = 70;
        var yPos = 140;
        var btnSpacing = 5;
        var len = btns.length;
        this.buttonHolder = new createjs.Container();
        for (i = 0; i < len; i++) {
            btn = new game.BattleButton(btns[i], player[btns[i]]);
            btnWidth = btn.getBounds().width;
            if (prevButton != null) {
                btn.x = ((prevButton.x + (prevButton.getBounds().width / 2)) + btnWidth / 2) + btnSpacing;
            }
            else {
                btn.x = xPos;
            }
            btn.y = yPos;
            btn.on('click', this.onAttackButtonSelected, this);
            this.buttonHolder.addChild(btn);
            prevButton = btn;
        }
        this.addChild(this.buttonHolder);
    }
    p.disableButtons = function () {
        var i, btn;
        var len = this.buttonHolder.getNumChildren();
        for (i = 0; i < len; i++) {
            btn = this.buttonHolder.getChildAt(i);
            btn.disableButton();
        }
    }
    p.enableButtons = function () {
        var i, btn;
        var len = this.buttonHolder.getNumChildren();
        for (i = 0; i < len; i++) {
            btn = this.buttonHolder.getChildAt(i);
            if (btn.quanity > 0 || btn.quanity < 0) {
                btn.enableButton();
            }
        }
    }
    p.onAttackButtonSelected = function (e) {
        if (this.currentAttackButton != null) {
            this.currentAttackButton.enableButton();
        }
        this.currentAttackButton = e.currentTarget;
        this.currentAttackButton.selectButton();
        var event = new events.BattleButtonEvent(events.ATTACK_BUTTON_SELECTED, false, false, this.currentAttackButton.type);
        this.dispatchEvent(event);
    }
    p.update = function () {
        if (!this.waitingToAttack) {
            this.updateWaitBar();
        }
        this.updateStats();
    }
    p.updateWaitBar = function () {
        var scale = this.waitBar.scaleX + (.001 * this.SPEED);
        if (scale > 1) {
            scale = 1;
        }
        this.waitBar.scaleX = scale;
        if (scale == 1) {
            this.waitingToAttack = true;
            this.enableButtons();
        }
    }
    p.updateStats = function () {
        this.hpTxt.text = this.hero.HP + '_' + this.hero.maxHP;
    }
    p.resetPanel = function () {
        this.waitingToAttack = false;
        this.waitBar.scaleX = 0;
        this.disableButtons();
        this.mouseEnabled = true;
        this.currentAttackButton = null;
    }

    window.game.BattlePanel = BattlePanel;

}());