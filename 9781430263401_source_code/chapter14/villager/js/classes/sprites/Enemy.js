(function () {

    window.game = window.game || {}

    function Enemy(type) {
        this.data = data.EnemyData[type];
        this.initialize();
    }

    var p = Enemy.prototype = new createjs.Container();

    p.data = null;
    p.enemySprite = null;
    p.targetSprite = null;
    p.magicSprite = null;
    p.healthBar = null;

    p.targetTween = null;
    p.targetable = false;

    p.Container_initialize = p.initialize;

    p.initialize = function () {
        this.Container_initialize();
        this.createEnemySprite();
        this.createTargetIndicator();
        this.createHealthBar();
        this.mouseEnabled = false;
    }
    p.createEnemySprite = function () {
        this.enemySprite = new createjs.Sprite(spritesheet, this.data.frame);
        this.addChild(this.enemySprite);
    }
    p.createTargetIndicator = function () {
        var bounds;
        var targetYPos = 90;
        var tweenSpeed = 700;
        this.targetSprite = new createjs.Sprite(spritesheet, 'target');
        bounds = this.targetSprite.getBounds();
        this.targetSprite.regX = bounds.width / 2;
        this.targetSprite.regY = bounds.height / 2;
        this.targetSprite.y = targetYPos;
        this.targetSprite.x = this.enemySprite.getBounds().width / 2;
        this.targetTween = createjs.Tween.get(this.targetSprite, {loop:true}).to({alpha:.3}, tweenSpeed).to({alpha:1}, tweenSpeed);
        this.targetTween.setPaused(true);
        this.targetSprite.visible = false;
        this.addChild(this.targetSprite);
    }
    p.createHealthBar = function () {
        var enemyBounds = this.enemySprite.getBounds();
        this.healthBar = new game.EnemyHealthBar(this.data.maxHP);
        this.healthBar.y = enemyBounds.height + 10;
        this.healthBar.x = (enemyBounds.width / 2) - (this.healthBar.getBounds().width / 2);
        this.addChild(this.healthBar);
    }
    //attack hero
    p.playAttackAnimation = function () {
        var air = 80;
        createjs.Tween.get(this.enemySprite)
            .to({y:this.enemySprite.y - air}, 500, createjs.Ease.bounceOut)
            .to({y:this.enemySprite.y}, 500, createjs.Ease.bounceOut)
            .call(function () {
                this.dispatchEvent(events.ENEMY_ATTACK_ANIMATION_COMPLETE);
            }, null, this)
    }
    //attacked by hero
    p.enableTarget = function () {
        this.targetTween.setPaused(false);
        this.targetable = this.targetSprite.visible = this.mouseEnabled = true;
    }
    p.disableTarget = function () {
        this.targetTween.setPaused(true);
        this.targetable = this.targetSprite.visible = this.mouseEnabled = false;
    }
    p.takeDamage = function (power, attackType) {
        var damage = power - this.data.defense;
        this.playAttackedAnimation();
        switch (attackType) {
            case 'fire':
                damage += this.getFireDamage();
                break;
            case 'earth':
                damage += this.getEarthDamage();
                break;
            case 'lightning':
                damage += this.getLightningDamage();
                break;
            default:
                damage += 0;
                break;
        }
        damage = damage > 0 ? damage : 0;
        this.healthBar.updateHP(damage);
    }
    p.playAttackedAnimation = function () {
        var event;
        var hit = this.enemySprite.clone();
        hit.gotoAndStop(this.data.frame + '_hit');
        this.addChild(hit);
        createjs.Tween.get(hit)
            .to({alpha:.3}, 100, createjs.Ease.bounceInOut)
            .to({alpha:.6}, 100, createjs.Ease.bounceInOut)
            .to({alpha:.2}, 200, createjs.Ease.bounceInOut)
            .to({alpha:.3}, 100, createjs.Ease.bounceInOut)
            .to({alpha:.6}, 100, createjs.Ease.bounceInOut)
            .to({alpha:.2}, 200, createjs.Ease.bounceInOut)
            .call(function (hit) {
                this.removeChild(hit);
                this.removeChild(this.magicSprite);
                this.checkHealth();
            }, [hit], this);
    }
    p.getFireDamage = function () {
        var weakness = this.data.weakness == 'fire' ? 5 : 0;
        this.magicSprite = new createjs.Sprite(spritesheet, 'magic_fire');
        this.magicSprite.y = this.enemySprite.y - this.magicSprite.getBounds().height + this.enemySprite.getBounds().height;
        this.magicSprite.alpha = .3;
        this.addChild(this.magicSprite);
        createjs.Tween.get(this.magicSprite).to({alpha:1}, 100)
            .to({alpha:.3}, 100)
            .to({alpha:.1}, 100)
            .to({alpha:.3}, 100);
        return data.GameData.attackPower.fire + weakness;
    }
    p.getEarthDamage = function () {
        var weakness = this.data.weakness == 'earth' ? 5 : 0;
        this.magicSprite = new createjs.Sprite(spritesheet, 'magic_rock');
        this.magicSprite.regX = this.magicSprite.getBounds().width / 2;
        this.magicSprite.regY = this.magicSprite.getBounds().height / 2;
        this.magicSprite.x = this.enemySprite.x + (this.enemySprite.getBounds().width / 2);
        this.magicSprite.y = -100;
        this.addChild(this.magicSprite);
        createjs.Tween.get(this.magicSprite).to({rotation:720, y:100}, 1000);
        return data.GameData.attackPower.earth + weakness;
    }
    p.getLightningDamage = function () {
        var weakness = this.data.weakness == 'lightning' ? 5 : 0;
        this.magicSprite = new createjs.Sprite(spritesheet, 'magic_lightning');
        this.magicSprite.regX = this.magicSprite.getBounds().width / 2;
        this.magicSprite.regY = this.magicSprite.getBounds().height / 2;
        this.magicSprite.x = this.enemySprite.x + (this.enemySprite.getBounds().width / 2);
        this.magicSprite.y = 100;
        this.magicSprite.scaleX = this.magicSprite.scaleY = .2;
        this.addChild(this.magicSprite);
        createjs.Tween.get(this.magicSprite).to({scaleX:1, scaleY:1}, 1000, createjs.Ease.elasticOut);
        return data.GameData.attackPower.lightning + weakness;
    }
    p.checkHealth = function () {
        var event;
        if (this.healthBar.HP <= 0) {
            this.destroy();
        }
        else {
            event = new createjs.Event(events.ENEMY_ATTACKED_COMPLETE, true);
            this.dispatchEvent(event);
        }
    }
    p.destroy = function () {
        var event;
        this.enemySprite.on('animationend', function () {
            event = new createjs.Event(events.ENEMY_DESTROYED, true);
            this.dispatchEvent(event);
        }, this);
        this.enemySprite.gotoAndPlay(this.data.frame + '_die');
    }
    window.game.Enemy = Enemy;

}());