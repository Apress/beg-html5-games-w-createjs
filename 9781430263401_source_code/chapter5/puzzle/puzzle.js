const PUZZLE_COLUMNS = 5;
const PUZZLE_ROWS = 3;
const PUZZLE_SIZE = 200;

var stage;
var pieces = [];
var selectedPieces = [];

function init() {
    stage = new createjs.Stage(document.getElementById('canvas'));
    buildPuzzle();
    startGame();
    setTimeout(shufflePuzzle, 2000);
}
function buildPuzzle() {
    var i, piece;
    var l = PUZZLE_COLUMNS * PUZZLE_ROWS;
    var col = 0;
    var row = 0;
    for (i = 0; i < l; i++) {
        piece = new createjs.Bitmap('img/mam.png');
        piece.sourceRect = new createjs.Rectangle(col * PUZZLE_SIZE, row * PUZZLE_SIZE, PUZZLE_SIZE, PUZZLE_SIZE);
        piece.homePoint = {x:col * PUZZLE_SIZE, y:row * PUZZLE_SIZE};
        piece.x = piece.homePoint.x;
        piece.y = piece.homePoint.y;
        stage.addChild(piece);
        pieces[i] = piece;
        col++;
        if (col === PUZZLE_COLUMNS) {
            col = 0;
            row++;
        }
    }
}
function shufflePuzzle() {
    var i, piece, randomIndex;
    var col = 0;
    var row = 0;
    var p = [];
    p = p.concat(pieces);
    var l = p.length;
    for (i = 0; i < l; i++) {
        randomIndex = Math.floor(Math.random() * p.length)
        piece = p[randomIndex];
        p.splice(randomIndex, 1);
        createjs.Tween.get(piece).to({x:col * PUZZLE_SIZE, y:row * PUZZLE_SIZE},200);
        piece.addEventListener('click', onPieceClick);
        col++;
        if (col === PUZZLE_COLUMNS) {
            col = 0;
            row++;
        }
    }
}
function onPieceClick(e) {
    if (selectedPieces === 2) {
        return;
    }
    var piece = e.target;
    var matrix = new createjs.ColorMatrix().adjustColor(15, 10, 100, 180);
    piece.filters = [
        new createjs.ColorMatrixFilter(matrix)
    ];
    piece.cache(0, 0, PUZZLE_SIZE, PUZZLE_SIZE);
    selectedPieces.push(piece);
    if (selectedPieces.length === 2) {
        swapPieces();
    }
}
function swapPieces() {
    var piece1 = selectedPieces[0];
    var piece2 = selectedPieces[1];
    createjs.Tween.get(piece1).wait(300).to({x:piece2.x, y:piece2.y},200);
    createjs.Tween.get(piece2).wait(300).to({x:piece1.x, y:piece1.y},200).call(function(){
        setTimeout(evalPuzzle,200);
    });
}
function evalPuzzle() {
    var win = true;
    var i, piece;
    selectedPieces[0].uncache();
    selectedPieces[1].uncache();
    for (i = 0; i < pieces.length; i++) {
        piece = pieces[i];
        if (piece.x != piece.homePoint.x || piece.y != piece.homePoint.y) {
            win = false;
            break;
        }
    }
    if (win) {
        setTimeout(function () {
            alert('YOU DID IT!');
        }, 200);
    }
    else {
        selectedPieces = [];
    }
}
function startGame() {
    createjs.Ticker.addEventListener("tick", function(){
        stage.update();
    });
    createjs.Ticker.setFPS(60);
}