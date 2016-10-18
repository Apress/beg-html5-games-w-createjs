(function () {

    var Scoring = {
        dice:[],
        btnKey:null
    };

    Scoring.getScore = function (type, dice, key) {
        dice.sort();
        this.dice = dice;
        this.btnKey = key;
        switch (type) {
            case 'ones':
            case 'twos':
            case 'threes':
            case 'fours':
            case 'fives':
            case 'sixes':
                return this.getNumberScore();
                break;
            case 'threeKind':
            case 'fourKind':
                return this.getKinds();
                break;
            case 'small':
            case 'large':
                this.dice = this.uniqueArray(this.dice);
                return this.getStraights();
                break;
            case 'fullHouse':
                return this.getFullHouse();
                break;
            case 'chance':
                return this.getChance();
                break;
            case 'fakezee':
                return this.getFakezee();
                break;
            case 'bonus':
                return this.getFakezee() * 2;
                break;
        }
    }
    Scoring.getNumberScore = function () {
        var i, value;
        var score = 0;
        for (i = 0; i < this.dice.length; i++) {
            if (this.dice[i] == this.btnKey) {
                score += this.dice[i];
            }
        }
        return score;
    }
    Scoring.getKinds = function () {
        var i;
        var match = 0;
        var score = 0;
        var pass = false;
        var matchesNeeded = this.btnKey;
        var len = this.dice.length;
        for (i = 0; i < len; i++) {
            score += this.dice[i];
            if (this.dice[i] == this.dice[i + 1]) {
                if (i != this.dice.length) {
                    match++;
                    if (match >= matchesNeeded) {
                        pass = true;
                    }
                }
            }
            else {
                match = 0;
            }
        }
        score = (pass ? score : 0);
        return score;
    }
    Scoring.getStraights = function () {
        var i;
        var match = 0;
        var score = this.btnKey == 3 ? 30 : 40;
        var matchesNeeded = this.btnKey;
        var pass = false;
        var len = this.dice.length - 1;
        for (i = 0; i < len; i++) {
            if (this.dice[i] == (this.dice[i + 1] - 1)) {
                match++;
                if (match >= matchesNeeded) {
                    pass = true;
                    break;
                }
            }
            else {
                match = 0;
            }
        }
        score = pass ? score : 0;
        return score;
    }
    Scoring.getFullHouse = function () {
        var pass = false;
        var score = 0;
        if (this.dice[0] == this.dice[1] && this.dice[1] != this.dice[2] && this.dice[2] == this.dice[3] && this.dice[3] == this.dice[4]) {
            pass = true;
        }
        else if (this.dice[0] == this.dice[1] && this.dice[1] == this.dice[2] && this.dice[2] != this.dice[3] && this.dice[3] == this.dice[4]) {
            pass = true;
        }
        score = (pass ? 25 : 0);
        return score;
    }
    Scoring.getChance = function () {
        var score = 0;
        for (var i = 0; i < this.dice.length; i++) {
            score += this.dice[i];
        }
        return score;
    }
    Scoring.getFakezee = function () {
        var pass = false;
        var score = 0;
        if (this.dice[0] == this.dice[1] && this.dice[1] == this.dice[2] && this.dice[2] == this.dice[3] && this.dice[3] == this.dice[4]) {
            pass = true;
        }
        score = (pass ? 50 : 0);
        return score;
    }
    //UTIL
    Scoring.sortNumber = function (a, b) {
        return a - b;
    }
    Scoring.uniqueArray = function (a) {
        var temp = {};
        for (var i = 0; i < a.length; i++) {
            temp[a[i]] = true;
        }
        console.log(temp);
        var r = [];
        for (var k in temp) {
            r.push(k / 1);
        }
        return r;
    }

    window.Scoring = Scoring;

}());
