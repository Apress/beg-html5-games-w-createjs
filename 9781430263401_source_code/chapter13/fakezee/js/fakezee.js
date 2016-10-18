// constants
var TITLE_YPOS = 20;
var DICE_TRAY_POSITION = {x: 25, y: 90};
var SCORE_CARD_POSITION = {x: 20, y: 175};
var SCOREBOARD_POSITION = {x: 25, y: 685};
var NUM_DICE = 5;
var NUM_SCORES = 13;
var NUM_ROLLS = 3;

// createjs
var canvas, stage, queue, spritesheet, preloader;

// display objects
var title, diceTray, scoreboard, scoreCard;

// score card buttons
var scorecardButtons = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'threeKind', 'fourKind', 'small', 'large', 'fullHouse', 'chance'];
var scorecardButtonKeys = [1, 2, 3, 4, 5, 6, 2, 3, 3, 4, 0, 0];

// game values to reset
var section1Score = 0;
var section2Score = 0;
var bonusScore = 0;
var totalScore = 0;
var rollsLeft = 3;
var numScored = 0;
var diceValues = [];
var scoredFakezee = false;

function init() {
    canvas = document.getElementById('canvas');
    stage = new createjs.Stage(canvas);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on('tick', stage);
    optimizeForTouchAndScreens();
    preload();
}
function optimizeForTouchAndScreens() {
    if (typeof window.orientation !== 'undefined') {
        window.onorientationchange = onOrientationChange;
        if (createjs.Touch.isSupported()) {
            createjs.Touch.enable(stage);
        }
        onOrientationChange();
    } else {
        window.onresize = resizeGame;
        resizeGame();
    }
}
function onOrientationChange() {
    setTimeout(resizeGame, 100);
}
function resizeGame() {
    var nTop, nLeft, scale;
    var gameWrapper = document.getElementById('gameWrapper');
    var bg = document.getElementById('bg');
    var w = window.innerWidth;
    var h = window.innerHeight;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var widthToHeight = canvas.width / canvas.height;
    var newWidthToHeight = newWidth / newHeight;
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        scale = newWidth / canvas.width;
        nLeft = (w / 2) - (newWidth / 2);
        gameWrapper.style.left = (nLeft) + "px";
        gameWrapper.style.top = "0px";
    }
    else {
        newHeight = newWidth / widthToHeight;
        scale = newHeight / canvas.height;
        nTop = (h / 2) - (newHeight / 2);
        gameWrapper.style.top = (nTop) + "px";
        gameWrapper.style.left = "0px";
    }
    canvas.setAttribute("style", "-webkit-transform:scale(" + scale + ")");
    bg.setAttribute("style", "-webkit-transform:scale(" + scale + ")");
    window.scrollTo(0, 0);
}

function preload() {
    queue = new createjs.LoadQueue();
    queue.loadManifest([
        {id:"sheetData", src:"js/fakezee.json",callback:setupSpritesheet}
    ]);
}
function setupSpritesheet(data){
    spritesheet = new createjs.SpriteSheet(data);
    initGame();
}

function initGame() {
    buildTitle();
    buildDiceTray();
    buildScoreCard();
    buildScoreboard();
    revealGame();
}

function buildTitle() {
    title = new createjs.Sprite(spritesheet, 'logoSmall');
    title.regX = title.getBounds().width / 2;
    title.x = canvas.width / 2;
    title.y = TITLE_YPOS;
    title.alpha = 0;
    stage.addChild(title);
}

function buildDiceTray() {
    var trayBG, rollMsg, rollBtn, rollBG, rollsTxt, i, die;
    var rollBtnOffset = -27;
    var hGap = 60;
    var xPos = 37;
    var yPos = 37
    //dice tray container
    diceTray = new createjs.Container();
    diceTray.x = DICE_TRAY_POSITION.x;
    diceTray.y = DICE_TRAY_POSITION.y;
    diceTray.alpha = 0;
    //tray bg
    trayBG = new createjs.Sprite(spritesheet, 'diceTray');
    diceTray.addChild(trayBG);
    //dice
    for (i = 0; i < NUM_DICE; i++) {
        die = new createjs.Sprite(spritesheet, 'die');
        die.name = 'die' + i;
        die.paused = true;
        // die.visible = false;
        die.mouseEnabled = false;
        die.regX = die.getBounds().width / 2;
        die.regY = die.getBounds().height / 2;
        die.x = xPos;
        die.y = yPos;
        die.hold = false;
        die.on('click', holdDie);
        xPos += hGap;
        diceTray.addChild(die);
    }
    //roll button
    rollBtn = new createjs.Container();
    rollBtn.name = 'rollBtn';
    rollBtn.visible = false;
    rollBtn.x = xPos;
    rollBtn.y = yPos;
    rollBG = new createjs.Sprite(spritesheet, 'rollButton');
    rollBtn.addChild(rollBG);
    //roll text
    rollsTxt = new createjs.Text(rollsLeft, '27px Calibri', '#FFF');
    rollsTxt.name = 'rollsTxt';
    rollsTxt.textAlign = 'center';
    rollsTxt.textBaseline = 'middle';
    rollsTxt.x = rollBtn.getBounds().width / 2;
    rollsTxt.y = rollBtn.getBounds().height / 2;
    //add roll button
    rollBtn.regX = rollBtn.getBounds().width / 2;
    rollBtn.regY = rollBtn.getBounds().height / 2;
    rollBtn.addChild(rollsTxt);
    rollBtn.on('click', rollDice);
    diceTray.addChild(rollBtn);
    stage.addChild(diceTray);
}

function buildScoreCard() {
    var i, btn, scoreMsg, scoreTxt;
    var xPos = 0;
    var yPos = 0;
    var row = 0;
    var vGap = 49;
    var hGap = 290;
    var btnsPerRow = 6;
    var fakezeeBtnYPos = 75;
    var scoreMsgYPos = 400;
    var section = 1;
    scoreCard = new createjs.Container();
    scoreCard.mouseEnabled = false;
    scoreCard.x = SCORE_CARD_POSITION.x;
    scoreCard.y = SCORE_CARD_POSITION.y;
    // score buttons
    for (i = 0; i < scorecardButtons.length; i++) {
        btn = new createjs.Sprite(spritesheet, scorecardButtons[i]);
        btn.paused = true;
        btn.name = scorecardButtons[i];
        btn.key = scorecardButtonKeys[i];
        btn.section = section;
        btn.y = yPos;
        btn.x = xPos;
        btn.framerate = 30;
        btn.on('animationend', function (e) {
            this.stop();
        });
        btn.on('click', onScoreCardBtnClick);
        scoreCard.addChild(btn);
        yPos += vGap;
        row++;
        if (row === btnsPerRow) {
            section++;
            row = 0;
            yPos = 0;
            xPos += hGap;
        }
    }
    // fakezee button
    btn = new createjs.Sprite(spritesheet, 'fakezee');
    btn.paused = true;
    btn.name = btn.key = 'fakezee';
    btn.section = 2;
    btn.regX = btn.getBounds().width / 2;
    btn.regY = btn.getBounds().height / 2;
    btn.x = scoreCard.getBounds().width / 2;
    btn.y = 345;
    btn.alpha = 0;
    btn.on('click', onScoreCardBtnClick);
    scoreCard.addChild(btn);
    //score message
    scoreMsg = new createjs.Sprite(spritesheet, 'totalScoreLabel');
    scoreMsg.name = 'scoreMsg';
    scoreMsg.regX = scoreMsg.getBounds().width / 2;
    scoreMsg.x = scoreCard.getBounds().width / 2;
    scoreMsg.y = scoreMsgYPos;
    scoreMsg.alpha = 0;
    scoreCard.addChild(scoreMsg);
    // score
    scoreTxt = new createjs.Text('0', '50px Calibri', '#FFF');
    scoreTxt.name = 'scoreTxt';
    scoreTxt.textAlign = 'center';
    scoreTxt.x = scoreCard.getBounds().width / 2;
    scoreTxt.y = scoreMsg.y + 30;
    scoreTxt.alpha = 0;
    scoreCard.addChild(scoreTxt);
    stage.addChild(scoreCard);
}

function buildScoreboard() {
    var scoreBar, txt, xPos;
    var padding = 2;
    var sec1XPos = 12;
    var sec2XPos = 145;
    var bonusXPos = 280;
    scoreboard = new createjs.Container();
    scoreboard.x = SCOREBOARD_POSITION.x;
    scoreboard.y = SCOREBOARD_POSITION.y;
    scoreboard.alpha = 0;
    scoreBar = new createjs.Sprite(spritesheet, 'scoreBar');
    scoreboard.addChild(scoreBar);
    //section 1
    txt = createScoreboardText('Section 1 Score:', sec1XPos, padding)
    scoreboard.addChild(txt);
    xPos = txt.getMeasuredWidth() + txt.x + padding;
    txt = createScoreboardText(section1Score, xPos, padding, 'section1Txt');
    scoreboard.addChild(txt);
    //section 2
    txt = createScoreboardText('Section 2 Score:', sec2XPos, padding);
    scoreboard.addChild(txt);
    xPos = txt.getMeasuredWidth() + txt.x + padding;
    txt = createScoreboardText(section2Score, xPos, padding, 'section2Txt');
    scoreboard.addChild(txt);
    //bonus
    txt = createScoreboardText('Bonus Score', bonusXPos, padding);
    scoreboard.addChild(txt);
    xPos = txt.getMeasuredWidth() + txt.x + padding;
    txt = createScoreboardText(bonusScore, xPos, padding, 'bonusTxt');
    scoreboard.addChild(txt);
    stage.addChild(scoreboard);
}

function createScoreboardText(label, x, y, name) {
    var txt = new createjs.Text(label, '16px Calibri', '#FFF');
    txt.x = x;
    txt.y = y + 3;
    txt.name = name;
    return txt;
}

function revealGame() {
    setTimeout(revealTitle, 100);
    setTimeout(revealDiceTray, 500);
    setTimeout(revealScoreCard, 1900);
    setTimeout(revealScoreboard, 3500);
}

function revealTitle() {
    createjs.Tween.get(title).to({alpha: 1}, 400);
}

function revealDiceTray() {
    var i, die, delay, btn, rollMessage;
    createjs.Tween.get(diceTray).to({alpha: 1}, 500);
    for (i = 0; i < NUM_DICE; i++) {
        die = diceTray.getChildByName('die' + i);
        die.scaleX = die.scaleY = 0;
        die.visible = true;
        delay = (i * 150) + 500;
        createjs.Tween.get(die).wait(delay).to({scaleX: 1, scaleY: 1}, 1000, createjs.Ease.elasticOut);
    }
    btn = diceTray.getChildByName('rollBtn');
    btn.scaleX = btn.scaleY = 0;
    btn.visible = true;
    delay += 150;
    createjs.Tween.get(btn).wait(delay)
        .to({scaleX: 1, scaleY: 1, rotation: 0}, 1000, createjs.Ease.elasticOut);
}

function revealScoreCard() {
    var btn, timer;
    var len = scorecardButtons.length;
    var i = 0;
    timer = setInterval(function () {
        btn = scoreCard.getChildAt(i);
        btn.play();
        i++;
        if (i === len) {
            clearInterval(timer);
            btn = scoreCard.getChildByName('fakezee');
            btn.y -= 10;
            createjs.Tween.get(btn).to({alpha: 1, y: btn.y + 10}, 500);
        }
    }, 100);
}

function revealScoreboard() {
    var totalScoreMsg = scoreCard.getChildByName('scoreMsg');
    var totalScoreTxt = scoreCard.getChildByName('scoreTxt');
    createjs.Tween.get(totalScoreTxt).to({alpha: 1}, 500);
    createjs.Tween.get(totalScoreMsg).to({alpha: 1}, 500);
    createjs.Tween.get(scoreboard).to({alpha: 1}, 500);
}

////GAME PLAY
function rollDice(e) {
    console.log(e);
    var i, die;
    var rollBtn = e.currentTarget;
    var rollsTxt = rollBtn.getChildByName('rollsTxt');
    enableDice(false);
    scoreCard.mouseEnabled = false;
    rollBtn.mouseEnabled = false;
    rollBtn.alpha = .7;
    rollsLeft -= 1;
    rollsTxt.text = rollsLeft;
    for (i = 0; i < NUM_DICE; i++) {
        die = diceTray.getChildByName('die' + i);
        if (die.hold) {
            continue;
        }
        die.framerate = Math.floor(Math.random() * 10) + 20;
        die.play();
    }
    setTimeout(stopDice, 1000);
}

function stopDice() {
    var i, die;
    diceValues = [];
    for (i = 0; i < NUM_DICE; i++) {
        die = diceTray.getChildByName('die' + i);
        die.stop();
        diceValues[i] = Math.floor(die.currentAnimationFrame) + 1;
    }
    if (rollsLeft > 0) {
        enableDice(true);
        var rollBtn = diceTray.getChildByName('rollBtn');
        rollBtn.alpha = 1;
        rollBtn.mouseEnabled = true;
    }
    scoreCard.mouseEnabled = true;
}

function enableDice(enable) {
    var die;
    for (i = 0; i < NUM_DICE; i++) {
        die = diceTray.getChildByName('die' + i);
        die.mouseEnabled = enable;
    }
}

function holdDie(e) {
    var die = e.target;
    if (!die.hold) {
        die.hold = true;
        die.alpha = .7;
    }
    else {
        die.hold = false;
        die.alpha = 1;
    }
}

function onScoreCardBtnClick(e) {
    var btn = e.target;
    btn.mouseEnabled = false;
    scoreCard.mouseEnabled = false;
    var score = Scoring.getScore(btn.name, diceValues, btn.key);
    if (scoredFakezee) {
        bonusScore += Scoring.getScore('bonus', diceValues, null);
    }
    if (btn.name == 'fakezee' && score == 50) {
        scoredFakezee = true;
    }
    btn.gotoAndStop(btn.name + '_score');
    updateScore(btn, score);
    updateScoreboard();
    evalGame();
}

function updateScore(btn, score) {
    var label = new createjs.Text(score, '27px Calibri', '#FFF');
    var labelXOffset;
    var labelYOffset;
    switch (btn.section) {
        case 1:
            section1Score += score;
            labelXOffset = 70;
            labelYOffset = 11;
            break;
        case 2:
            section2Score += score;
            if (btn.name == 'fakezee') {
                labelXOffset = 0;
                labelYOffset = -15;

            }
            else {
                labelXOffset = 35;
                labelYOffset = 10;
            }
            break;
    }
    label.name = 'label';
    label.textAlign = 'center';
    label.x = btn.x + labelXOffset;
    label.y = btn.y + labelYOffset;
    scoreCard.addChild(label);
}

function updateScoreboard() {
    var section1Txt = scoreboard.getChildByName('section1Txt');
    var section2Txt = scoreboard.getChildByName('section2Txt');
    var bonusTxt = scoreboard.getChildByName('bonusTxt');
    var totalScoreTxt = scoreCard.getChildByName('scoreTxt');
    section1Txt.text = section1Score;
    section2Txt.text = section2Score;
    bonusTxt.text = bonusScore;
    totalScoreTxt.text = totalScore = (section1Score + section2Score + bonusScore);
}

function evalGame() {
    numScored++;
    if (numScored == NUM_SCORES) {
        setTimeout(gameOver, 1500);
    }
    else {
        resetDiceTray();
    }
}

function resetDiceTray() {
    var die;
    var rollBtn = diceTray.getChildByName('rollBtn');
    var rollsTxt = rollBtn.getChildByName('rollsTxt');
    for (i = 0; i < NUM_DICE; i++) {
        die = diceTray.getChildByName('die' + i);
        die.alpha = 1;
        die.mouseEnabled = false;
        die.hold = false;
    }
    rollBtn.alpha = 1;
    rollBtn.mouseEnabled = true;
    rollsLeft = rollsTxt.text = NUM_ROLLS;
}

function gameOver() {
    var playAgainBtn = new createjs.Sprite(spritesheet, 'playAgain');
    var fakezeeBtn = scoreCard.getChildByName('fakezee');
    playAgainBtn.regX = fakezeeBtn.regX;
    playAgainBtn.regY = fakezeeBtn.regY;
    playAgainBtn.x = fakezeeBtn.x;
    playAgainBtn.y = fakezeeBtn.y;
    playAgainBtn.on('click', replayGame);
    scoreCard.addChild(playAgainBtn);
    scoreCard.mouseEnabled = true;
}

function replayGame() {
    section1Score = section2Score = bonusScore = numScored = 0;
    rollsLeft = NUM_ROLLS;
    stage.removeAllChildren();
    initGame();
}
