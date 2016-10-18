var stage;
var shapes = [];
var slots = [];
var score = 0;

function init() {
    stage = new createjs.Stage("canvas");
    buildShapes();
    setShapes();
    startGame();
}
function buildShapes() {
    var colors = ['blue', 'red', 'green', 'yellow'];
    var i, shape, slot;
    for (i = 0; i < 4; i++) {
        //slots
        slot = new createjs.Shape();
        slot.graphics.beginStroke(colors[i]);
        slot.graphics.beginFill(createjs.Graphics.getRGB(255, 255, 255, 1));
        slot.graphics.drawRect(0, 0, 100, 100);
        slot.regX = slot.regY = 50;
        slot.key = i;
        slot.y = 80;
        slot.x = (i * 130) + 100;
        stage.addChild(slot);
        slots.push(slot);
        //shapes
        shape = new createjs.Shape();
        shape.graphics.beginFill(colors[i]);
        shape.graphics.drawRect(0, 0, 100, 100);
        shape.regX = shape.regY = 50;
        shape.key = i;
        shapes.push(shape);
    }
}
function setShapes() {
    var i, r, shape;
    var l = shapes.length;
    for (i = 0; i < l; i++) {
        r = Math.floor(Math.random() * shapes.length);
        shape = shapes[r];
        shape.homeY = 320;
        shape.homeX = (i * 130) + 100;
        shape.y = shape.homeY;
        shape.x = shape.homeX;
        shape.addEventListener("mousedown", startDrag);
        stage.addChild(shape);
        shapes.splice(r, 1);
    }
}
function startGame() {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", function (e) {
        stage.update();
    });
}
function startDrag(e) {
    var shape = e.target;
    var slot = slots[shape.key];
    stage.setChildIndex(shape, stage.getNumChildren() - 1);
    stage.addEventListener('stagemousemove', function (e) {
        shape.x = e.stageX;
        shape.y = e.stageY;
    });
    stage.addEventListener('stagemouseup', function (e) {
        stage.removeAllEventListeners();
        var pt = slot.globalToLocal(stage.mouseX, stage.mouseY);
        if (slot.hitTest(pt.x, pt.y)) {
            shape.removeEventListener("mousedown",startDrag);
            score++;
            createjs.Tween.get(shape).to({x:slot.x, y:slot.y}, 200, createjs.Ease.quadOut).call(checkGame);
            console.log('h');
        }
        else {
            createjs.Tween.get(shape).to({x:shape.homeX, y:shape.homeY}, 200, createjs.Ease.quadOut);
        }
    });
}
function checkGame(){
    if(score == 4){
        alert('You Win!');
    }
}