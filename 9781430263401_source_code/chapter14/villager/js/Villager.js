    (function (window) {

        window.game = window.game || {}

        function Villager() {
            this.initialize();
        }

        var p = Villager.prototype = new createjs.Container();


        p.Container_initialize = p.initialize;

        p.initialize = function () {
            this.Container_initialize();
            canvas = document.getElementById('canvas');
            screen_width = canvas.width;
            screen_height = canvas.height;
            stage = new createjs.Stage(canvas);
            game.Device.prepare();
            this.preloadAssets();
        }
        p.preloadAssets = function () {
            game.assets = new game.AssetManager();
            this.preloader = new ui.Preloader('#d2354c', '#FFF');
            this.preloader.x = (canvas.width / 2) - (this.preloader.width / 2);
            this.preloader.y = (canvas.height / 2) - (this.preloader.height / 2);
            stage.addChild(this.preloader);
            game.assets.on(game.assets.ASSETS_PROGRESS, this.onAssetsProgress, this);
            game.assets.on(game.assets.ASSETS_COMPLETE, this.assetsReady, this);
            game.assets.preloadAssets();
        }
        p.onAssetsProgress = function () {
            this.preloader.update(game.assets.loadProgress);
            stage.update();
        }
        p.assetsReady = function () {
            stage.removeChild(this.preloader);
            this.createSpriteSheet();
            this.gameReady();
        }
        p.createSpriteSheet = function () {
            var assets = game.assets;
            spritesheet = new createjs.SpriteSheet(assets.getAsset(assets.GAME_SPRITES_DATA));
            fontsheet = new createjs.SpriteSheet(assets.getAsset(assets.FONT_SHEET_DATA));
        }
        p.gameReady = function () {
            createjs.Ticker.setFPS(60);
            createjs.Ticker.on("tick", this.onTick, this);
            this.changeState(game.GameStates.MAIN_MENU);
        }
        p.changeState = function (state) {
            switch (state) {
                case game.GameStates.MAIN_MENU:
                    this.currentGameStateFunction = this.gameStateMainMenu;
                    break;
                case game.GameStates.LEVEL_SELECT:
                    this.currentGameStateFunction = this.gameStateLevelSelect;
                    break;
                case game.GameStates.GAME:
                    this.currentGameStateFunction = this.gameStateGame;
                    break;
                case game.GameStates.LEVEL_COMPLETE:
                    this.currentGameStateFunction = this.gameStateLevelComplete;
                    break;
                case game.GameStates.RUN_SCENE:
                    this.currentGameStateFunction = this.gameStateRunScene;
                    break;
            }
        }
        p.onStateEvent = function (e, obj) {
            this.changeState(obj.state);
        }
        p.disposeCurrentScene = function () {
            if (this.currentScene != null) {
                stage.removeChild(this.currentScene);
                if (this.currentScene.dispose) {
                    this.currentScene.dispose();
                }
                this.currentScene = null;
            }
        }
        p.gameStateMainMenu = function () {
            var scene = new game.GameMenu();
            scene.on(game.GameStateEvents.GAME, this.onStateEvent, this, true, {state:game.GameStates.GAME});
            scene.on(game.GameStateEvents.LEVEL_SELECT, this.onStateEvent, this, true, {state:game.GameStates.LEVEL_SELECT});
            stage.addChild(scene);
            this.disposeCurrentScene();
            this.currentScene = scene;
            this.changeState(game.GameStates.RUN_SCENE);
        }
        p.gameStateLevelSelect = function () {
            var scene = new game.LevelSelect()
            scene.on(game.GameStateEvents.GAME, this.onStateEvent, this, true, {state:game.GameStates.GAME});
            scene.on(game.GameStateEvents.MAIN_MENU, this.onStateEvent, this, true, {state:game.GameStates.MAIN_MENU});
            stage.addChild(scene);
            this.disposeCurrentScene();
            this.currentScene = scene;
            this.changeState(game.GameStates.RUN_SCENE);
        }
        p.gameStateGame = function (tickEvent) {
            var gameData = data.GameData.levelData[data.GameData.currentLevel - 1];
            var scene = new game.Game(gameData, tickEvent.time);
            scene.on(game.GameStateEvents.LEVEL_COMPLETE, this.onStateEvent, this, true, {state:game.GameStates.LEVEL_COMPLETE});
            scene.on(game.GameStateEvents.MAIN_MENU, this.onStateEvent, this, true, {state:game.GameStates.MAIN_MENU});
            stage.addChild(scene);
            this.disposeCurrentScene()
            this.currentScene = scene;
            this.changeState(game.GameStates.RUN_SCENE);
        }
        p.gameStateLevelComplete = function () {
            var scene = new game.LevelComplete();
            scene.on(game.GameStateEvents.LEVEL_SELECT, this.onStateEvent, this, true, {state:game.GameStates.LEVEL_SELECT});
            stage.addChild(scene);
            this.disposeCurrentScene();
            this.currentScene = scene;
            this.changeState(game.GameStates.RUN_SCENE);
        }
        p.gameStateRunScene = function (tickEvent) {
            if (this.currentScene.run) {
                this.currentScene.run(tickEvent);
            }
        }
        p.onTick = function (e) {
            if (this.currentGameStateFunction != null) {
                this.currentGameStateFunction(e);
            }
            stage.update();
        }

        window.game.Villager = Villager;

    }(window));