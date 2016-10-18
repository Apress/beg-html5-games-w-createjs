(function () {

    window.game = window.game || {};

    var Assets = {

        //sounds
        EXPLOSION:'explosion',
        SOUNDTRACK_BG:'soundtrack bg',
        GAME_SPRITES:'game sprites',
        assetsPath:'assets/',
        loadManifest:[
            {id:this.EXPLOSION, src:'explosion.mp3|explosion.ogg'},
            {id:this.GAME_SPRITES, src:'gameSprites.png'}
        ],
        queue:null
    }

    Assets.preloadAssets = function () {
        var proxy = new createjs.proxy(this.assetsLoaded,this);
        createjs.Sound.initializeDefaultPlugins();
        this.queue = new createjs.LoadQueue();
        this.queue.installPlugin(createjs.Sound);
        this.queue.addEventListener('complete', proxy);
        this.queue.loadManifest(this.loadManifest, true, this.assetsPath);
    }
    Assets.assetsLoaded = function (e) {
        console.log(this);
    }

    window.game.Assets = Assets;

}());
