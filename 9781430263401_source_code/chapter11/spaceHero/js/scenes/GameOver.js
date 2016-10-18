(function (window) {

    window.game = window.game || {}

    function GameOver() {
        this.initialize();
    }

    var p = GameOver.prototype = new createjs.Container();

    p.Container_initialize = p.initialize;

    p.initialize = function () {
        this.Container_initialize();
        createjs.Sound.stop();
        this.addMessage();
        this.addScore();
        this.addButton();
    }
    p.addMessage = function () {
        var msg = new createjs.Sprite(spritesheet, 'gameOver');
        msg.regX = msg.getBounds().width / 2;
        msg.regY = msg.getBounds().height / 2;
        msg.x = screen_width / 2;
        msg.y = 250;
        msg.scaleX = msg.scaleY = 0;
        createjs.Tween.get(msg).to({scaleX:1, scaleY:1, rotation:360}, 500);
        this.addChild(msg);
    }
    p.addScore = function () {
        var scorePoint = {x:220, y:310};
        var scoreTxt = new createjs.BitmapText(game.score, spritesheet);
        scoreTxt.x = scorePoint.x;
        scoreTxt.y = scorePoint.y;
        this.addChild(scoreTxt);
    }
    p.addButton = function () {
        var playBtn, menuBtn;
        var playBtnPoint = {x:140, y:380};
        var menuBtnPoint = {x:310, y:380};
        var me = this;
        playBtn = new ui.SimpleButton('Play Again');
        playBtn.on('click', this.playAgain, this);
        playBtn.setButton({upColor:'#d2354c', color:'#FFF', borderColor:'#FFF', overColor:'#900'});
        playBtn.x = playBtnPoint.x;
        playBtn.y = playBtnPoint.y;
        this.addChild(playBtn);
        menuBtn = new ui.SimpleButton('Main Menu');
        menuBtn.on('click', this.mainMenu, this);
        menuBtn.setButton({upColor:'#d2354c', color:'#FFF', borderColor:'#FFF', overColor:'#900'});
        menuBtn.x = menuBtnPoint.x;
        menuBtn.y = menuBtnPoint.y;
        this.addChild(menuBtn);
    }
    p.playAgain = function (e) {
        this.dispatchEvent(game.GameStateEvents.GAME);
    }
    p.mainMenu = function (e) {
        this.dispatchEvent(game.GameStateEvents.MAIN_MENU);
    }

    window.game.GameOver = GameOver;

}(window));