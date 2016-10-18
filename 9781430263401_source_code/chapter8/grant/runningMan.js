var stage, queue, preloader, spritesheet, runner;

function preload() {
    queue = new createjs.LoadQueue();
    queue.loadManifest([
        {id:"runner", src:"img/runningMan.png"}
    ],false);
    init();
}
function init(){
    stage = new createjs.Stage(document.getElementById('canvas'));
    createjs.Ticker.on('tick', stage);
    stage.enableMouseOver();
    preloader = new ui.Preloader('#FFF','#000');
    preloader.x = (stage.canvas.width / 2) - (preloader.width / 2);
    preloader.y = (stage.canvas.height / 2) - (preloader.height / 2);
    stage.addChild(preloader);
    queue.addEventListener("complete", initGame);
    queue.addEventListener('progress', onFileProgress);
    queue.load();
}
function onFileProgress(e) {
    preloader.update(e.progress);
}
function initGame() {
    stage.removeChild(preloader);
    preloader = null;
    spritesheet = new createjs.SpriteSheet({
        "images":[queue.getResult("runner")],
        "frames":{"regX":0, "height":292, "count":64, "regY":0, "width":165},
        "animations":{"idle":[60], "run":[0, 25], "jump":[31, 60, 'idle']}
    });
    buildRunner();
    buildButtons();
}
function buildRunner() {
    runner = new sprites.Runner(spritesheet);
    runner.y = 100;
    stage.addChild(runner);
}
function buildButtons() {
    var jumpBtn = new ui.SimpleButton("JUMP");
    var runBtn = new ui.SimpleButton("RUN");
    var idleBtn = new ui.SimpleButton("IDLE");
    jumpBtn.on('click', function (e) {
        runner.jump();
    });
    runBtn.on('click', function (e) {
        runner.run();
    });
    runBtn.x = jumpBtn.width + 10;
    idleBtn.on('click', function (e) {
        runner.stand();
    });
    idleBtn.x = runBtn.x + runBtn.width + 10;
    stage.addChild(jumpBtn, runBtn, idleBtn);
}
