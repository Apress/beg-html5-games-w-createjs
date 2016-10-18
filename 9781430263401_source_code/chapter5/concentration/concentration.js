var stage, queue;

var faces = ['garlic', 'onion', 'pepper', 'potato', 'spinach', 'tomato'];
var cards = [];
var cardsFlipped = [];
var matches = 0;

function preload() {
    queue = new createjs.LoadQueue();
    queue.addEventListener("complete", init);
    queue.loadManifest([
        {id:"shell", src:"img/card.png"},
        {id:"back", src:"img/back.png"},
        {id:"garlic", src:"img/garlic.png"},
        {id:"onion", src:"img/onion.png"},
        {id:"pepper", src:"img/pepper.png"},
        {id:"potato", src:"img/potato.png"},
        {id:"spinach", src:"img/spinach.png"},
        {id:"tomato", src:"img/tomato.png"}
    ]);
}

function init() {
    stage = new createjs.Stage(document.getElementById('canvas'));
    startGame();
    buildCards();
    shuffleCards();
    dealCards();
}
function buildCards() {
    var i, card, card2, bmp, label, face;
    for (i = 0; i < faces.length; i++) {
        card = new createjs.Container();
        bmp = new createjs.Bitmap(queue.getResult('shell'));
        bmp.shadow = new createjs.Shadow("#666", 3, 3, 5);
        card.regX = bmp.image.width / 2;
        card.regY = bmp.image.height / 2;
        card.addChild(bmp);
        face = faces[i]
        bmp = new createjs.Bitmap(queue.getResult(face));
        bmp.regX = bmp.image.width / 2;
        bmp.regY = bmp.image.height / 2;
        bmp.x = card.regX;
        bmp.y = 70;
        card.addChild(bmp);
        label = new createjs.Text(faces[i].toUpperCase(), "20px Arial", "#009900");
        label.textAlign = 'center';
        label.x = card.regX;
        label.y = 144;
        card.addChild(label);
        bmp = new createjs.Bitmap(queue.getResult('back'));
        bmp.name = 'back';
        card.addChild(bmp);
        card2 = card.clone(true);
        card.key = card2.key = faces[i];
        cards.push(card, card2);
    }
}
function shuffleCards() {
    var i, card, randomIndex;
    var l = cards.length;
    var shuffledCards = [];
    for (i = 0; i < l; i++) {
        randomIndex = Math.floor(Math.random() * cards.length);
        shuffledCards.push(cards[randomIndex]);
        cards.splice(randomIndex, 1);
    }
    cards = cards.concat(shuffledCards);
}
function dealCards() {
    var i, card;
    var xPos = 100;
    var yPos = 100;
    var count = 0;
    for (i = 0; i < cards.length; i++) {
        card = cards[i];
        card.x = -200;
        card.y = 400;
        card.rotation = Math.random() * 600;
        card.addEventListener('click', flipCard);
        stage.addChild(card);
        createjs.Tween.get(card)
            .wait(i * 100)
            .to({x:xPos, y:yPos, rotation:0}, 300);
        xPos += 150;
        count++;
        if (count === 4) {
            count = 0;
            xPos = 100;
            yPos += 220;
        }
    }
}
function flipCard(e) {
    if (cardsFlipped.length === 2) {
        return;
    }
    var card = e.currentTarget;
    card.mouseEnabled = false;
    card.getChildByName('back').visible = false;
    cardsFlipped.push(card);
    if (cardsFlipped.length === 2) {
        evalCardsFlipped();
    }
}
function evalCardsFlipped() {
    if (cardsFlipped[0].key === cardsFlipped[1].key) {
        matches++;
        evalGame();
    }
    else {
        setTimeout(resetFlippedCards, 1000);
    }
}
function resetFlippedCards() {
    cardsFlipped[0].mouseEnabled = cardsFlipped[1].mouseEnabled = true;
    cardsFlipped[0].getChildByName('back').visible = true;
    cardsFlipped[1].getChildByName('back').visible = true;
    cardsFlipped = [];
}
function evalGame() {
    if (matches === faces.length) {
        setTimeout(function () {
            alert('YOU WIN!')
        }, 300)
    }
    else {
        cardsFlipped = [];
    }
}
function startGame() {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", function (e) {
        stage.update();
    });
}