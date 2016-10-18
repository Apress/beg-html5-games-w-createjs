(function (window) {

    window.game = window.game || {}

    function Game() {
        this.initialize();
    }

    var p = Game.prototype = new createjs.Container();

    p.Container_initialize = p.initialize;

    // Hero
    p.heroShip = null;
    p.heroBulletPool = null;
    p.heroBullets = null;

    // Enemies
    p.enemyPool = null;
    p.enemies = null;
    p.enemyBulletPool = null;
    p.enemyBullets = null;
    p.enemyLastSpawnTime = null;
    p.enemySpawnWaiter = 2000;

    // SPRITES
    p.stars = null;
    p.explosionPool = null;
    p.healthMeter = null;
    p.lifeBox = null;
    p.scoreboard = null;

    //
    p.leftWall = null;
    p.rightWall = null;
    p.ceiling = null;
    p.floor = null;
    p.betweenLevels = true;
    p.numLives = 3;
    p.delta = null;

    // Controls
    p.leftKeyDown = false;
    p.rightKeyDown = false;
    p.upKeyDown = false;
    p.downKeyDown = false;

    p.initialize = function () {
        this.Container_initialize();
        this.setProperties();
        this.buildStarField();
        this.buildSprites();
        this.setWalls();
        this.setControls();
        createjs.Sound.play(game.assets.SOUNDTRACK);
    }
    p.setProperties = function () {
        this.heroBulletPool = [];
        this.heroBullets = [];
        this.enemyPool = [];
        this.enemies = [];
        this.enemyBulletPool = [];
        this.enemyBullets = [];
        this.stars = [];
        this.explosionPool = [];
        this.betweenLevels = false;
        this.enemyLastSpawnTime = 0;
    }
    p.buildStarField = function () {
        var star;
        var numStars = 20;
        for (i = 0; i < numStars; i++) {
            star = new createjs.Sprite(spritesheet, 'star3');
            star.speed = Utils.getRandomNumber(100, 200);
            star.x = Math.random() * screen_width;
            star.y = Math.random() * screen_height;
            this.addChild(star);
            this.stars.push(star);
        }
    }
    p.buildSprites = function () {
        this.heroShip = new game.HeroShip();
        this.heroShip.on(this.heroShip.EXPLOSION_COMPLETE, this.checkGame, this);
        this.heroShip.x = screen_width / 2;
        this.heroShip.y = screen_height - this.heroShip.getBounds().height;
        this.heroBulletPool = new game.SpritePool(game.Bullet, 20);
        this.enemyBulletPool = new game.SpritePool(game.Bullet, 20);
        this.enemyPool = new game.SpritePool(game.EnemyShip, 10);
        this.explosionPool = new game.SpritePool(game.Explosion, 10);
        this.healthMeter = new game.HealthMeter();
        this.scoreboard = new game.Scoreboard();
        this.lifeBox = new game.LifeBox(this.numLives);
        this.addChild(this.heroShip, this.healthMeter, this.scoreboard, this.lifeBox);
    }
    p.setWalls = function () {
        this.leftWall = this.heroShip.getBounds().width / 2;
        this.rightWall = screen_width - this.heroShip.getBounds().width / 2;
        this.floor = screen_height - this.heroShip.getBounds().height;
        this.ceiling = screen_height - (this.heroShip.getBounds().height * 3);
    }
    p.setControls = function () {
        document.onkeydown = this.handleKeyDown.bind(this);
        document.onkeyup = this.handleKeyUp.bind(this);

    }
    p.handleKeyDown = function (e) {
        e = !e ? window.event : e;
        switch (e.keyCode) {
            case ARROW_KEY_LEFT:
                this.leftKeyDown = true;
                break;
            case ARROW_KEY_RIGHT:
                this.rightKeyDown = true;
                break;
            case ARROW_KEY_UP:
                this.upKeyDown = true;
                break;
            case ARROW_KEY_DOWN:
                this.downKeyDown = true;
                break;
        }
    }
    p.handleKeyUp = function (e) {
        e = !e ? window.event : e;
        switch (e.keyCode) {
            case ARROW_KEY_LEFT:
                this.leftKeyDown = false;
                break;
            case ARROW_KEY_RIGHT:
                this.rightKeyDown = false;
                break;
            case ARROW_KEY_SPACE:
                this.spawnHeroBullet();
                break;
            case ARROW_KEY_UP:
                this.upKeyDown = false;
                break;
            case ARROW_KEY_DOWN:
                this.downKeyDown = false;
                break;
        }
    }
    /*
     *
     * UPDATE FUNCTIONS
     *
     */
    p.updateStars = function () {
        var i, star, velY, speed, nextY;
        var len = this.stars.length;
        for (i = 0; i < len; i++) {
            star = this.stars[i];
            velY = star.speed * this.delta / 1000;
            nextY = star.y + velY;
            if (nextY > screen_height) {
                nextY = -10
            }
            star.nextY = nextY;
        }
    }
    p.updateHeroShip = function () {
        var velocity = this.heroShip.speed * this.delta / 1000;
        var nextX = this.heroShip.x;
        var nextY = this.heroShip.y;
        if (this.leftKeyDown) {
            nextX -= velocity;
            if (nextX < this.leftWall) {
                nextX = this.leftWall;
            }
        }
        else if (this.rightKeyDown) {
            nextX += velocity;
            if (nextX > this.rightWall) {
                nextX = this.rightWall;
            }
        }
        else if (this.downKeyDown) {
            nextY += velocity;
            if (nextY > this.floor) {
                nextY = this.floor;
            }
        }
        else if (this.upKeyDown) {
            nextY -= velocity;
            if (nextY < this.ceiling) {
                nextY = this.ceiling;
            }
        }
        this.heroShip.nextX = nextX;
        this.heroShip.nextY = nextY;
    }
    p.updateEnemies = function () {
        var enemy, i, velY;
        var len = this.enemies.length - 1;
        for (i = len; i >= 0; i--) {
            enemy = this.enemies[i];
            velY = enemy.speed * this.delta / 1000;
            enemy.nextY = enemy.y + velY;
            if (enemy.nextY > screen_height) {
                enemy.reset();
                this.enemyPool.returnSprite(enemy);
                this.removeChild(enemy);
                this.enemies.splice(i, 1);
            }
        }
    }
    p.updateHeroBullets = function () {
        var bullet, i, velY;
        var len = this.heroBullets.length - 1;
        for (i = len; i >= 0; i--) {
            bullet = this.heroBullets[i];
            velY = bullet.speed * this.delta / 1000;
            bullet.nextY = bullet.y - velY;
            if (bullet.nextY < 0) {
                this.heroBulletPool.returnSprite(bullet);
                this.removeChild(bullet);
                this.heroBullets.splice(i, 1);
            }
        }
    }
    p.updateEnemyBullets = function () {
        var bullet, i, velY;
        var len = this.enemyBullets.length - 1;
        for (i = len; i >= 0; i--) {
            bullet = this.enemyBullets[i];
            velY = bullet.speed * this.delta / 1000;
            bullet.nextY = bullet.y + velY;
            if (bullet.nextY > screen_height) {
                this.enemyBulletPool.returnSprite(bullet);
                this.removeChild(bullet);
                this.enemyBullets.splice(i, 1);
            }
        }
    }
    /*
     *
     * RENDER FUNCTIONS
     *
     */
    p.renderStars = function () {
        var i, star;
        for (i = 0; i < this.stars.length; i++) {
            star = this.stars[i];
            star.y = star.nextY;
        }
    }
    p.renderHeroShip = function () {
        this.heroShip.x = this.heroShip.nextX;
        this.heroShip.y = this.heroShip.nextY;
    }
    p.renderHeroBullets = function () {
        var bullet, i;
        var len = this.heroBullets.length - 1;
        for (i = len; i >= 0; i--) {
            bullet = this.heroBullets[i];
            if (bullet.shouldDie) {
                this.removeChild(bullet);
                bullet.reset();
                this.heroBulletPool.returnSprite(bullet);
                this.heroBullets.splice(i, 1);
            }
            else {
                bullet.y = bullet.nextY;
            }
        }
    }
    p.renderEnemyBullets = function () {
        var bullet, i;
        var len = this.enemyBullets.length - 1;
        for (i = len; i >= 0; i--) {
            bullet = this.enemyBullets[i];
            if (bullet.shouldDie) {
                this.removeChild(bullet);
                bullet.reset();
                this.enemyBulletPool.returnSprite(bullet);
                this.enemyBullets.splice(i, 1);
            }
            else {
                bullet.y = bullet.nextY;
            }
        }
    }
    p.renderEnemies = function () {
        var enemy, i;
        var len = this.enemies.length - 1;
        for (i = len; i >= 0; i--) {
            enemy = this.enemies[i];
            if (enemy.shouldDie) {
                this.scoreboard.updateScore(enemy.points);
                this.enemies.splice(i, 1);
                this.removeChild(enemy);
                this.spawnEnemyExplosion(enemy.x, enemy.y);
                enemy.reset();
                this.enemyPool.returnSprite(enemy);
            }
            else {
                enemy.y = enemy.nextY;
            }
        }
    }
    /*
     *
     * CHECK FUNCTIONS
     *
     */
    p.checkForEnemySpawn = function (time) {
        if (time - this.enemyLastSpawnTime > this.enemySpawnWaiter) {
            this.spawnEnemyShip();
            this.enemyLastSpawnTime = time;
        }
    }
    p.checkForEnemyFire = function (time) {
        var enemy, i;
        var len = this.enemies.length - 1;
        for (i = len; i >= 0; i--) {
            enemy = this.enemies[i];
            if (time - enemy.lastFired > enemy.fireDelay) {
                this.spawnEnemyBullet(enemy);
                enemy.lastFired = time;
            }
        }
    }
    p.checkHeroBullets = function () {
        var i, b, bullet, enemy, collision;
        for (i in this.enemies) {
            enemy = this.enemies[i];
            for (b in this.heroBullets) {
                bullet = this.heroBullets[b];
                collision = ndgmr.checkPixelCollision(enemy, bullet);
                if (collision) {
                    enemy.takeDamage();
                    bullet.shouldDie = true;
                }
            }
        }
    }
    p.checkEnemyBullets = function () {
        var b, bullet, collision;
        for (b in this.enemyBullets) {
            bullet = this.enemyBullets[b];
            collision = ndgmr.checkPixelCollision(this.heroShip, bullet);
            if (collision) {
                bullet.shouldDie = true;
                this.heroShip.takeDamage();
                this.healthMeter.takeDamage(10);
            }
        }
    }
    p.checkShips = function () {
        var enemy, i;
        var len = this.enemies.length - 1;
        for (i = len; i >= 0; i--) {
            enemy = this.enemies[i];
            if (enemy.y > screen_height / 2) {
                collision = ndgmr.checkPixelCollision(this.heroShip, enemy);
                if (collision) {
                    this.removeChild(enemy);
                    this.enemies.splice(i, 1);
                    this.spawnEnemyExplosion(enemy.x, enemy.y);
                    this.heroShip.shouldDie = true;
                    break;
                }
            }
        }
    }
    p.checkHealth = function (e) {
        if (this.healthMeter.empty) {
            this.heroShip.shouldDie = true;
        }
    }
    p.checkHero = function () {
        if (this.heroShip.shouldDie) {
            this.numLives--;
            this.heroShip.explode();
            this.lifeBox.removeLife();
            this.betweenLevels = true;
        }
    }
    p.checkGame = function (e) {
        if (this.numLives > 0) {
            this.heroShip.reset();
            this.heroShip.makeInvincible(true);
            this.healthMeter.reset();
            this.betweenLevels = false;
        }
        else {
            game.score = this.scoreboard.getScore();
            this.dispose();
            this.dispatchEvent(game.GameStateEvents.GAME_OVER);
        }
    }
    /*
     *
     * SPAWN FUNCTION
     *
     */
    p.spawnEnemyShip = function () {
        var enemy = this.enemyPool.getSprite();
        enemy.y = -enemy.getBounds().height;
        enemy.x = Utils.getRandomNumber(enemy.getBounds().width, screen_width - enemy.getBounds().width);
        this.addChild(enemy);
        this.enemies.push(enemy);
    }
    p.spawnEnemyBullet = function (enemy) {
        var bullet = this.enemyBulletPool.getSprite();
        bullet.currentAnimationFrame = 1;
        bullet.y = enemy.y;
        bullet.x = enemy.x;
        this.addChildAt(bullet, 0);
        this.enemyBullets.push(bullet);
    }
    p.spawnHeroBullet = function () {
        var bullet = this.heroBulletPool.getSprite();
        bullet.x = this.heroShip.x;
        bullet.y = this.heroShip.y - this.heroShip.getBounds().height / 2;
        this.addChildAt(bullet, 0);
        this.heroBullets.push(bullet)
    }
    p.spawnEnemyExplosion = function (x, y) {
        var explosion = this.explosionPool.getSprite();
        explosion.x = x - 45;
        explosion.y = y - 30;
        this.addChild(explosion);
        explosion.on('animationend', this.explosionComplete, this, true);
        explosion.play();
        createjs.Sound.play(game.assets.EXPLOSION);
    }
    p.explosionComplete = function (e) {
        var explosion = e.target;
        this.removeChild(explosion);
        this.explosionPool.returnSprite(explosion);
    }

    /*
     *
     * GAME LOOP
     *
     */
    p.update = function () {
        this.updateStars();
        this.updateHeroShip()
        this.updateEnemies();
        this.updateHeroBullets();
        this.updateEnemyBullets();
    }
    p.render = function () {
        this.renderStars();
        this.renderHeroShip();
        this.renderEnemies();
        this.renderHeroBullets();
        this.renderEnemyBullets();
    }
    p.run = function (tickEvent) {
        this.delta = tickEvent.delta;
        if (!this.betweenLevels) {
            this.update();
            this.render();
            this.checkForEnemySpawn(tickEvent.time);
            this.checkForEnemyFire(tickEvent.time);
            this.checkHeroBullets();
            if (!this.heroShip.invincible) {
                this.checkEnemyBullets();
                this.checkShips();
            }
            this.checkHealth();
            this.checkHero();
        }
    }
    p.dispose = function () {
        document.onkeydown = null;
        document.onkeyup = null;
    }
    window.game.Game = Game;

}(window));