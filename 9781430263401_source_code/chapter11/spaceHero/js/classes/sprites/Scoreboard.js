(function (window) {

    window.game = window.game || {}

    function Scoreboard() {
        this.initialize();
    }

    var p = Scoreboard.prototype = new createjs.Container();

    p.scoreTxt;
    p.score = 0;

    p.Container_initialize = p.initialize;

    p.initialize = function () {
        this.Container_initialize();
        this.x = screen_width - 165;
        this.y = 5;
        this.updateScore(0);
    }
    p.updateScore = function (points) {
        var formattedScore;
        this.removeAllChildren();
        this.score += points;
        formattedScore = this.addLeadingZeros(this.score, 7);
        this.scoreTxt = new createjs.BitmapText(formattedScore, spritesheet);
        this.addChild(this.scoreTxt);
    }
    p.addLeadingZeros = function (score, width) {
        score = score + '';
        return score.length >= width ? score : new Array(width - score.length + 1).join(0) + score;
    }
    p.getScore = function () {
        return this.addLeadingZeros(this.score, 7);
    }

    window.game.Scoreboard = Scoreboard;

}(window));