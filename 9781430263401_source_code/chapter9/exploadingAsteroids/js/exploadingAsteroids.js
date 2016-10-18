window.game = window.game || {};

var canvas, stage, assets, preloader, spritesheet;

var spawnDelay = 40;
var count = 0;

function init() {
    canvas = document.getElementById('canvas');
    stage = new createjs.Stage(canvas);
    createjs.Ticker.setFPS(30);
    game.assets = new game.AssetManager();
    preloadAssets();
}
function preloadAssets() {
    preloader = new ui.Preloader('#0F0', '#FFF');
    preloader.x = (stage.canvas.width / 2) - (preloader.width / 2);
    preloader.y = (stage.canvas.height / 2) - (preloader.height / 2);
    stage.addChild(preloader);
    game.assets.on(game.assets.ASSETS_PROGRESS, assetsProgress);
    game.assets.on(game.assets.ASSETS_COMPLETE, assetsComplete);
    game.assets.preloadAssets();
}
function assetsProgress(e) {
    preloader.update(e.target.loadProgress);
    stage.update();
}
function assetsComplete(e) {
    stage.removeChild(preloader);
    createSpriteSheet();
    buildStartMenu();
}
function createSpriteSheet() {
    spritesheet = new createjs.SpriteSheet(game.assets.getAsset(game.assets.GAME_SPRITES_DATA));
}
function buildStartMenu() {
    var button = new ui.SimpleButton('PLAY GAME');
    button.regX = button.width / 2;
    button.regY = button.height / 2;
    button.x = canvas.width / 2;
    button.y = canvas.height / 2;
    button.on('click', startGame);
    stage.addChild(button);
    stage.update();
}
function startGame() {
    var assets = game.assets;
    stage.removeAllChildren();
    createjs.Sound.play(assets.EXPLOSION)
    createjs.Sound.play(assets.SOUNDTRACK,0,0,0,10,.5);
    createjs.Ticker.on('tick', onTick);
}
function spawnAsteroid() {
    var a = new game.Asteroid(spritesheet);
    a.x = Math.random() * canvas.width;
    a.on('click', onAsteroidClick);
    a.on(a.EXPLOSION_COMPLETE, destroyAsteroid);
    stage.addChild(a);
}
function onAsteroidClick(e) {
    e.target.explode();
}
function destroyAsteroid(e) {
    stage.removeChild(e.target);
}
function checkForSpawn() {
    if (count == spawnDelay) {
        spawnAsteroid();
        count = 0;
    }
}
function onTick(e) {
    count++;
    checkForSpawn();
    stage.update();
}