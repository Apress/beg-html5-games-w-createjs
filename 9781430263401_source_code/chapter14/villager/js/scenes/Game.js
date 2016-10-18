(function () {

    window.game = window.game || {}

    function Game(levelData, startTime) {
        this.levelData = levelData;
        this.lastEnemyAttack = startTime;
        this.initialize();
    }

    var p = Game.prototype = new createjs.Container();

    p.Container_initialize = p.initialize;

    p.ENEMY_ATTACK_DURATION = 2500;

    p.gridPos = {x:40, y:60};
    p.grid = [
        {x:10, y:10},
        {x:200, y:10},
        {x:400, y:10},
        {x:10, y:300},
        {x:200, y:300},
        {x:400, y:300},
        {x:10, y:600},
        {x:200, y:600},
        {x:400, y:600}
    ]
    p.bossPos = {x:35, y:60};

    p.battlePanel = null;
    p.enemyHolder = null;

    p.levelData = null;
    p.hero = null;

    p.enemies = null;
    p.lastEnemyAttack = null;
    p.enemiesAreAttacking = null;
    p.currentEnemyAttackCount = null;
    p.currentEnemyAttackIndex = null;

    p.attackSelected = null;
    p.levelComplete = null;



    p.initialize = function () {
        this.Container_initialize();
        this.lastEnemyAttack = this.currentEnemyAttackCount = this.currentEnemyAttackIndex = 0;
        this.enemiesAreAttacking = this.attackSelected = this.levelComplete = false;
        this.setListeners();
        this.createHero();
        this.addBG();
        this.addEnemies();
        this.addBattlePanel();
    }
    p.setListeners = function () {
        this.on(events.ENEMY_ATTACKED_COMPLETE, this.onEnemyAttackedComplete, this);
        this.on(events.ENEMY_DESTROYED, this.onEnemyDestroyed, this);
    }
    p.createHero = function () {
        this.hero = new game.Hero();
    }
    p.addBG = function () {
        var bg = new createjs.Bitmap(game.assets.getAsset(game.assets.BATTLE_BG));
        this.addChild(bg);
    }
    p.addEnemies = function () {
        if (this.levelData.type == 'field') {
            this.populateGrid();
        }
        else {
            this.addBoss();
        }
        this.addChild(this.enemyHolder);
    }
    p.populateGrid = function () {
        var i, startPoint, enemy, point, enemyType;
        var enemies = this.levelData.enemies;
        var len = enemies.length;
        this.enemyHolder = new createjs.Container();
        this.enemyHolder.x = this.gridPos.x;
        this.enemyHolder.y = this.gridPos.y;
        this.enemies = [];
        for (i = 0; i < len; i++) {
            point = this.grid[i];
            enemyType = enemies[i];
            enemy = new game.Enemy(enemyType);
            enemy.x = point.x;
            enemy.y = point.y;
            enemy.on('click', this.attackEnemy, this);
            this.enemyHolder.addChild(enemy);
            this.enemies[i] = enemy;
        }
    }
    p.addBoss = function () {
        var boss;
        this.enemies = []
        this.enemyHolder = new createjs.Container();
        this.enemyHolder.x = this.bossPos.x;
        this.enemyHolder.y = this.bossPos.y;
        boss = new game.Enemy(this.levelData.boss);
        boss.on('click', this.attackEnemy, this);
        this.enemies[0] = boss;
        this.enemyHolder.addChild(boss);
    }
    p.addBattlePanel = function () {
        this.battlePanel = new game.BattlePanel(this.hero);
        this.battlePanel.y = screen_height - this.battlePanel.getBounds().height;
        this.battlePanel.on(events.ATTACK_BUTTON_SELECTED, this.onAttackButtonSelected, this);
        this.addChild(this.battlePanel);
    }
    //hero actions
    p.onAttackButtonSelected = function (e) {
        if (e.attackType == 'potion') {
            this.giveHeroPotion();
        }
        else {
            if (!this.attackSelected) {
                this.enableEnemyTargets();
            }
            this.attackSelected = e.attackType;
        }
    }
    p.giveHeroPotion = function () {
        var btn = this.battlePanel.currentAttackButton;
        btn.updateQuanity(-1);
        this.hero.HP += 20;
        if (this.hero.HP > this.hero.maxHP) {
            this.hero.HP = this.hero.maxHP;
        }
        this.updateHeroInventory('potion');
        this.onEnemyAttackedComplete();
    }
    p.enableEnemyTargets = function () {
        var i, enemy;
        var len = this.enemyHolder.getNumChildren();
        for (i = 0; i < len; i++) {
            enemy = this.enemyHolder.getChildAt(i);
            enemy.enableTarget();
        }
    }
    p.disableEnemyTargets = function () {
        var i, enemy;
        var len = this.enemyHolder.getNumChildren();
        for (i = 0; i < len; i++) {
            enemy = this.enemyHolder.getChildAt(i);
            enemy.disableTarget();
        }
    }
    p.attackEnemy = function (e) {
        var enemy = e.currentTarget;
        var player = data.PlayerData.player;
        var btn = this.battlePanel.currentAttackButton;
        btn.updateQuanity(-1);
        this.updateHeroInventory(this.attackSelected);
        this.disableEnemyTargets();
        this.battlePanel.disableButtons();
        enemy.takeDamage(this.hero.power, this.attackSelected);
    }
    p.onEnemyAttackedComplete = function (e) {
        this.attackSelected = false;
        this.battlePanel.resetPanel();
        this.checkLevel();
    }
    p.onEnemyDestroyed = function (e) {
        var i, enemy;
        for (i = 0; i < this.enemies.length; i++) {
            enemy = this.enemies[i];
            if (enemy === e.target) {
                this.enemies.splice(i, 1);
                break;
            }
        }
        this.enemyHolder.removeChild(e.target);
        this.onEnemyAttackedComplete(null);
    }
    p.updateHeroInventory = function (item) {
        this.hero.updateInventory(item, -1);
    }
    // enemy actions
    p.beginEnemyAttack = function () {
        var enemy;
        this.enemiesAreAttacking = true;
        this.battlePanel.disableButtons();
        this.currentEnemyAttackIndex = this.currentEnemyAttackIndex >= this.enemies.length ? this.currentEnemyAttackIndex - 1 : this.currentEnemyAttackIndex;
        enemy = this.enemies[this.currentEnemyAttackIndex];
        enemy.on(events.ENEMY_ATTACK_ANIMATION_COMPLETE, this.onEnemyAttackAnimationComplete, this, true);
        enemy.playAttackAnimation();
    }
    p.onEnemyAttackAnimationComplete = function (e) {
        var enemy = e.target;
        this.hero.takeDamage(enemy.data.power);
        this.battlePanel.updateStats();
        this.heroAttackedEffects();
    }
    p.evaluateEnemyStreak = function () {
        this.currentEnemyAttackCount++;
        this.currentEnemyAttackIndex++;
        if (this.currentEnemyAttackIndex === this.enemies.length) {
            this.currentEnemyAttackIndex = 0;
        }
        if (!this.levelComplete && this.currentEnemyAttackCount < this.levelData.enemyStreak && this.enemies.length > 0) {
            this.beginEnemyAttack();
        }
        else {
            this.enemyAttacksComplete();
        }
    }
    p.enemyAttacksComplete = function () {
        this.currentEnemyAttackCount = 0;
        this.enemiesAreAttacking = false;
        if (this.battlePanel.waitingToAttack) {
            this.battlePanel.enableButtons();
        }
    }
    //effects
    p.heroAttackedEffects = function () {
        var flash = new createjs.Shape();
        flash.graphics.beginFill('#900').drawRect(0, 0, screen_width, screen_height);
        flash.alpha = 0;
        this.addChild(flash);
        createjs.Tween.get(flash)
            .to({alpha:.6}, 500, createjs.Ease.bounceInOut)
            .to({alpha:0}, 500, createjs.Ease.bounceInOut)
            .call(function (flash) {
                this.removeChild(flash);
                this.evaluateEnemyStreak();
            }, [flash], this);
    }
    //checks
    p.checkEnemyAttack = function (time) {
        if (time >= this.lastEnemyAttack + this.levelData.enemyAttackWait && !this.attackSelected && !this.enemiesAreAttacking) {
            this.lastEnemyAttack = time + (this.ENEMY_ATTACK_DURATION * this.levelData.enemyStreak);
            this.beginEnemyAttack();
        }
    }
    p.checkBattlePanel = function () {
        if (!this.enemiesAreAttacking) {
            this.battlePanel.update();
        }
    }
    p.checkHeroHealth = function () {
        if (this.hero.HP <= 0) {
            this.levelComplete = true;
            this.loseLevel();
        }
    }
    p.checkLevel = function () {
        if (this.enemies.length <= 0) {
            this.levelComplete = true;
            this.winLevel();
        }
    }
    //level over
    p.winLevel = function () {
        this.hero.saveStats();
        createjs.Tween.get(this).wait(1000).call(this.leaveBattle, null, this);
    }
    p.loseLevel = function () {
        var flash = new createjs.Shape();
        flash.graphics.beginFill('#900').drawRect(0, 0, screen_width, screen_height);
        flash.alpha = 0;
        this.addChild(flash);
        createjs.Tween.get(flash)
            .wait(1000)
            .to({alpha:.8}, 2500)
            .call(this.goHome, null, this);
    }
    p.leaveBattle = function () {
        this.dispatchEvent(game.GameStateEvents.LEVEL_COMPLETE);
    }
    p.goHome = function () {
        this.dispatchEvent(game.GameStateEvents.MAIN_MENU);
    }
    //game ticker
    p.run = function (tickerEvent) {
        if (!this.levelComplete) {
            this.checkBattlePanel();
            this.checkEnemyAttack(tickerEvent.time);
            this.checkHeroHealth();
        }
    }
    window.game.Game = Game;

}());