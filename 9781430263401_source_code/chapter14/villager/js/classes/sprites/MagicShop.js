(function () {
    window.game = window.game || {}
    function MagicShop() {
        this.initialize();
    }

    var p = MagicShop.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;
    p.coinsTxt = null;
    p.totalCoins = null;
    p.magicData = null;
    p.initialize = function () {
        this.Container_initialize();
        this.totalCoins = data.PlayerData.player.coins;
        this.magicData = data.GameData.magicCosts;
        this.addStoreMessaging();
        this.addPurse();
        this.addItemButtons();
    }
    p.addStoreMessaging = function () {
        var txt;
        var storeWidth = 600;
        var storeHeight = 440;
        var xPos = 20;
        var yPos = 20;
        var vGap = 70;
        var storeBG = new createjs.Shape();
        storeBG.graphics.beginFill('#f7f4ef').drawRect(0, 0, storeWidth, storeHeight);
        txt = this.getBitmapTxt('MAGIC SHOP', xPos, yPos);
        this.addChild(storeBG, txt);
        yPos += vGap;
        txt = this.getBitmapTxt('POTION_ ' + this.magicData.potion + ' COINS', xPos, yPos, .7);
        this.addChild(txt);
        yPos += vGap * .7;
        txt = this.getBitmapTxt('FIRE_ ' + this.magicData.fire + ' COINS', xPos, yPos, .7);
        this.addChild(txt);
        yPos += vGap * .7;
        txt = this.getBitmapTxt('EARTH_ ' + this.magicData.earth + ' COINS', xPos, yPos, .7);
        this.addChild(txt);
        yPos += vGap * .7;
        txt = this.getBitmapTxt('LIGHTNING_ ' + this.magicData.lightning + ' COINS', xPos, yPos, .7);
        this.addChild(txt);
    }
    p.addPurse = function () {
        var coin;
        var xPos = 530;
        var yPos = 20;
        var coinOffsetX = -45;
        var coinOffsetY = -8;
        coin = new createjs.Sprite(spritesheet, 'coin');
        coin.paused = true;
        coin.x = xPos + coinOffsetX;
        coin.y = yPos + coinOffsetY;
        createjs.Tween.get(coin, {loop: true}).to({currentAnimationFrame: 8}, 600)
        this.coinsTxt = this.getBitmapTxt('x' + this.totalCoins, xPos, yPos, .6);
        this.addChild(coin, this.coinsTxt);
    }
    p.getBitmapTxt = function (txt, x, y, scale) {
        var txt = new createjs.BitmapText(txt, fontsheet);
        txt.letterSpacing = 6;
        txt.x = x;
        txt.y = y;
        txt.scaleX = txt.scaleY = scale != null ? scale : 1;
        return txt;
    }
    p.addItemButtons = function () {
        var i, btn, btnWidth, prevButton, txt, cost, magicType;
        var btns = ['potion', 'fire', 'earth', 'lightning' ];
        var playerData = window.data.PlayerData.player;
        var xPos = 70;
        var yPos = 380;
        var btnSpacing = 20;
        var len = btns.length;
        for (i = 0; i < len; i++) {
            magicType = btns[i];
            cost = this.magicData[magicType];
            btn = new game.BattleButton(magicType, playerData[magicType]);
            btn.name = 'btn_' + magicType;
            btn.on('click', this.purchaseItem, this, false, {cost: cost});
            if (cost > this.totalCoins) {
                btn.disableButton();
            }
            btnWidth = btn.getBounds().width;
            if (prevButton != null) {
                btn.x = ((prevButton.x + (prevButton.getBounds().width / 2)) +
                    btnWidth / 2) + btnSpacing;
            }
            else {
                btn.x = xPos;
            }
            btn.y = yPos;
            this.addChild(btn);
            prevButton = btn;
        }
        txt = this.getBitmapTxt('CLICK ITEM TO PURCHASE', 20, 400, .6);
        this.addChild(txt);
    }
    p.purchaseItem = function (e, data) {
        var player = window.data.PlayerData.player;
        var btn = e.currentTarget;
        var item = btn.type;
        var cost = data.cost;
        btn.updateQuanity(1);
        player[item] = btn.quanity;
        this.totalCoins -= cost;
        player.coins = this.totalCoins;
        this.updatePurse(cost);
        this.evaluatePurse();
    }
    p.updatePurse = function (cost) {
        var xPos = this.coinsTxt.x;
        var yPos = this.coinsTxt.y;
        this.removeChild(this.coinsTxt);
        this.coinsTxt = this.getBitmapTxt('x' + this.totalCoins, xPos, yPos, .6);
        this.addChild(this.coinsTxt);
    }
    p.evaluatePurse = function () {
        var i, btn, cost;
        var btns = ['potion', 'fire', 'earth', 'lightning' ];
        var len = btns.length;
        for (i = 0; i < len; i++) {
            cost = this.magicData[btns[i]];
            btn = this.getChildByName('btn_' + btns[i]);
            if (cost > this.totalCoins) {
                btn.disableButton();
            }
        }
    }
    window.game.MagicShop = MagicShop;
}());