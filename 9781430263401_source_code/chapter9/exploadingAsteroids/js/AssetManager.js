(function () {

    window.game = window.game || {};

    var AssetManager = function () {
        this.initialize();
    }
    var p = AssetManager.prototype = new createjs.EventDispatcher();

    p.EventDispatcher_initialize = p.initialize;

    //sounds
    p.EXPLOSION = 'explosion';
    p.SOUNDTRACK = 'soundtrack';

    //graphics
    p.GAME_SPRITES = 'game sprites';

    //data
    p.GAME_SPRITES_DATA = 'game sprites data'

    //events
    p.ASSETS_PROGRESS = 'assets progress';
    p.ASSETS_COMPLETE = 'assets complete';

    p.assetsPath = 'assets/';

    p.loadManifest = null;
    p.queue = null;
    p.loadProgress = 0;

    p.initialize = function () {
        this.EventDispatcher_initialize();
        this.loadManifest = [
            {id: this.EXPLOSION, src: this.assetsPath + 'explosion.mp3'},
            {id: this.SOUNDTRACK, src: this.assetsPath + 'dreamRaid1.mp3'},
            {id: this.GAME_SPRITES_DATA, src: this.assetsPath + 'gameSpritesData.json'},
            {id: this.GAME_SPRITES, src: this.assetsPath + 'gameSprites.png'}
        ];
    }
    p.preloadAssets = function () {
        var progressProxy = new createjs.proxy(this.assetsProgress, this);
        var completeProxy = new createjs.proxy(this.assetsLoaded, this);
        createjs.Sound.initializeDefaultPlugins();
        this.queue = new createjs.LoadQueue();
        this.queue.installPlugin(createjs.Sound);
        this.queue.addEventListener('complete', completeProxy);
        this.queue.addEventListener('progress', progressProxy);
        createjs.Sound.alternateExtensions = ["ogg"];
        this.queue.loadManifest(this.loadManifest);
    }
    p.assetsProgress = function (e) {
        this.loadProgress = e.progress;
        var event = new createjs.Event(this.ASSETS_PROGRESS);
        this.dispatchEvent(event);
    }
    p.assetsLoaded = function (e) {
        var event = new createjs.Event(this.ASSETS_COMPLETE);
        this.dispatchEvent(event);
    }
    p.getAsset = function (asset) {
        return this.queue.getResult(asset);
    }

    window.game.AssetManager = AssetManager;

}());
