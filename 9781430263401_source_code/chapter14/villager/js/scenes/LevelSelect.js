(function (window) {

    window.game = window.game || {}

    function LevelSelect() {
        this.initialize();
    }

    var p = LevelSelect.prototype = new createjs.Container();

    p.Container_initialize = p.initialize;

    p.initialize = function () {
        this.Container_initialize();
        this.addBG();
        this.addBackButton();
        this.addLevelButtons();
    }
    p.addBG = function () {
        var bg = new createjs.Bitmap(game.assets.getAsset(game.assets.MENU_BG));
        this.addChild(bg);
    }
    p.addBackButton = function () {
        var btn = new createjs.Sprite(spritesheet, 'backBtn');
        btn.on('click', this.onBackButtonClick, this);
        this.addChild(btn);
    }
    p.addLevelButtons = function () {
        var i, btn, btnBounds, level, frame;
        var numLevels = data.GameData.levelData.length;
        var gameLevel = data.PlayerData.player.gameLevel;
        var col = 0;
        var hGap = 34;
        var vGap = 92;
        var xPos = 50;
        var yPos = 260;
        for (i = 0; i < numLevels; i++) {
            level = i + 1;
            frame = level <= gameLevel ? 'level' + level : 'lock';
            btn = new createjs.Sprite(spritesheet, frame);
            btnBounds = btn.getBounds();
            btn.level = level;
            btn.x = xPos;
            btn.y = yPos;
            btn.mouseEnabled = level <= gameLevel;
            btn.on('click', this.onLevelButtonClick, this);
            this.addChild(btn);
            xPos += btnBounds.width + hGap;
            col++;
            if (col > 2) {
                col = 0;
                xPos = 50;
                yPos += btn.getBounds().height + vGap;
            }
        }
    }
    p.onBackButtonClick = function(e){
        this.dispatchEvent(game.GameStateEvents.MAIN_MENU);
    }
    p.onLevelButtonClick = function (e) {
        var btn = e.target;
        data.GameData.currentLevel = btn.level;
        this.dispatchEvent(game.GameStateEvents.GAME);
    }
    window.game.LevelSelect = LevelSelect;

}(window));