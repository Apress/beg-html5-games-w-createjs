(function () {

    window.game = window.game || {}

    function LevelComplete() {
        this.initialize();
    }

    var p = LevelComplete.prototype = new createjs.Container();

    p.Container_initialize = p.initialize;

    p.currentPower = null;
    p.powerIncrease = null;
    p.currentDefense = null;
    p.defenseIncrease = null;
    p.currentMAX_HP = null;
    p.maxHPIncrease = null;
    p.currentCoins = null;
    p.coinsIncrease = null;

    p.initialize = function () {
        this.Container_initialize();
        this.updateLevel();
        this.updateStats();
        this.addBG();
        this.addLevelMessaging();
        this.addShop();
        this.drawContinueButton();
    }
    p.updateLevel = function () {
        if (data.GameData.currentLevel == data.PlayerData.player.gameLevel) {
            data.PlayerData.player.gameLevel = (data.PlayerData.player.gameLevel * 1) + 1;
        }
    }
    p.updateStats = function () {
        var player = data.PlayerData.player;
        var currentLevel = data.GameData.levelData[data.GameData.currentLevel - 1];
        this.currentPower = data.PlayerData.player.power * 1;
        this.powerIncrease = currentLevel.powerIncreaseAwarded * 1;
        this.currentDefense = data.PlayerData.player.defense * 1;
        this.defenseIncrease = currentLevel.defenseIncreaseAwarded * 1;
        this.currentMAX_HP = data.PlayerData.player.maxHP * 1;
        this.maxHPIncrease = currentLevel.HPEarned;
        this.currentCoins = data.PlayerData.player.coins * 1;
        this.coinsIncrease = currentLevel.coinsAwarded * 1;
        player.power = this.currentPower + this.powerIncrease;
        player.defense = this.currentDefense + this.defenseIncrease;
        player.maxHP = this.currentMAX_HP + this.maxHPIncrease;
        player.coins = this.currentCoins + this.coinsIncrease;
    }
    p.addBG = function () {
        var bg = new createjs.Bitmap(game.assets.getAsset(game.assets.MENU_BG));
        this.addChild(bg);
    }
    p.addLevelMessaging = function () {
        var txt;
        var xPos = 30;
        var yPos = 40;
        var vGap = 90;
        var msgWidth = 600;
        var msgHeight = 470;
        var msgPos = {x:20, y:40};
        var msgContainer = new createjs.Container();
        //bg
        var containerBG = new createjs.Shape();
        containerBG.graphics.beginFill('#f7f4ef').drawRect(0, 0, msgWidth, msgHeight);
        //title
        txt = this.getBitmapTxt('LEVEL COMPLETE!', xPos, yPos);
        msgContainer.addChild(containerBG, txt);
        //attack
        yPos += vGap;
        txt = this.getBitmapTxt('ATTACK INCREASE_ + ' + this.powerIncrease + ' = ' + data.PlayerData.player.power, xPos, yPos);
        msgContainer.addChild(txt);
        //defense
        yPos += vGap;
        txt = this.getBitmapTxt('DEFENSE INCREASE_ + ' + this.defenseIncrease + ' = ' + data.PlayerData.player.defense, xPos, yPos);
        msgContainer.addChild(txt);
        //HP
        yPos += vGap;
        txt = this.getBitmapTxt('HP INCREASE_ + ' + this.maxHPIncrease + ' = ' + data.PlayerData.player.maxHP, xPos, yPos);
        msgContainer.addChild(txt);
        //coins
        yPos += vGap;
        txt = this.getBitmapTxt('COINS EARNED_ + ' + this.coinsIncrease + ' = ' + data.PlayerData.player.coins, xPos, yPos);
        msgContainer.addChild(txt);
        //add and position container
        this.addChild(msgContainer);
        msgContainer.x = msgPos.x;
        msgContainer.y = msgPos.y;
        msgContainer.cache(0, 0, msgWidth, msgHeight);
    }
    p.getBitmapTxt = function (txt, x, y) {
        var txt = new createjs.BitmapText(txt, fontsheet);
        txt.letterSpacing = 6;
        txt.x = x;
        txt.y = y;
        return txt;
    }
    p.addShop = function () {
        var shop = new game.MagicShop();
        shop.x = 20;
        shop.y = 550;
        this.addChild(shop);
    }
    p.drawContinueButton = function () {
        var btn = new createjs.Sprite(spritesheet, 'continueBtn');
        btn.x = (screen_width / 2) - (btn.getBounds().width / 2);
        btn.y = 1020;
        btn.on('click', this.onButtonClick, this);
        this.addChild(btn);
    }
    p.onButtonClick = function (e) {
        this.dispatchEvent(game.GameStateEvents.LEVEL_SELECT);
    }
    window.game.LevelComplete = LevelComplete;

}());