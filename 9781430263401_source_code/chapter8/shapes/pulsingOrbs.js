var stage;

function init() {
    stage = new createjs.Stage(document.getElementById('canvas'));
    createjs.Ticker.addEventListener("tick", stage);
    drawBackground();
    setListeners();
}

function drawBackground() {
    var bg = new createjs.Shape();
    bg.graphics.beginFill('#A9BBC9').drawRect(0, 0, stage.canvas.width, stage.canvas.height);
    stage.addChild(bg);
}

function setListeners() {
    stage.on('stagemousedown', drawOrb);
    window.onkeyup = takeSnapShot;
}

function drawOrb(e) {
    var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    var randomSize = Math.floor(Math.random() * 100) + 20;
    var orb = new PulsingOrb(randomColor, randomSize);
    orb.x = e.stageX;
    orb.y = e.stageY;
    stage.addChild(orb);
}

function takeSnapShot(e) {
    if (e.keyCode === 13) {
        var img = stage.canvas.toDataURL("image/png");
        window.open(img);
    }
}