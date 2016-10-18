(function () {

    window.game = window.game || {}

    function GameMenu() {
        this.initialize();
    }

    var p = GameMenu.prototype = new createjs.Container();

    p.Container_initialize = p.initialize;

    p.gameBtn = null;
    p.contBtn = null;

    p.initialize = function () {
        this.Container_initialize();
        this.addBG();
        this.addTitle();
        this.addButtons()
    }
    p.addBG = function () {
        var bg = new createjs.Bitmap(game.assets.getAsset(game.assets.MENU_BG));
        this.addChild(bg);
    }
    p.addTitle = function () {
        var title = new createjs.Sprite(spritesheet, 'title');
        title.x = 60;
        this.addChild(title);
    }
    p.addButtons = function () {
        var bounds;
        var yPos = 850;
        this.gameBtn = new createjs.Sprite(spritesheet, 'gameBtn');
        bounds = this.gameBtn.getBounds();
        this.gameBtn.regX = bounds.width / 2;
        this.gameBtn.x = screen_width / 2;
        this.gameBtn.y = yPos;
        this.contBtn = this.gameBtn.clone();
        this.contBtn.gotoAndStop('continueBtn');
        this.contBtn.y = (yPos + bounds.height * 1.5);
        this.gameBtn.on('click', this.onButtonClick, this);
        this.contBtn.on('click', this.onButtonClick, this);
        this.addChild(this.gameBtn, this.contBtn);
    }
    p.onButtonClick = function (e) {
        var newGame;
        var btn = e.target
        if (btn == this.gameBtn) {
            localStorage.clear();
            data.PlayerData.setLocalStorage();
        }
        this.dispatchEvent(game.GameStateEvents.LEVEL_SELECT);
    }
    window.game.GameMenu = GameMenu;

}());