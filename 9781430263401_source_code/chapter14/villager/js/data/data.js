(function () {

    window.data = window.data || {};

    var EnemyData = {};
    var GameData = {};
    var PlayerData = {};

    /*ENEMY DATA*/

    EnemyData.troll1 = {
        frame:'troll1',
        maxHP:10,
        weakness:'',
        power:2,
        defense:0
    }
    EnemyData.sorcerer1 = {
        frame:'sorcerer1',
        maxHP:12,
        weakness:'earth',
        power:5,
        defense:2
    }
    EnemyData.troll2 = {
        frame:'troll2',
        maxHP:15,
        weakness:'fire',
        power:8,
        defense:4
    }
    EnemyData.sorcerer2 = {
        frame:'sorcerer2',
        maxHP:18,
        weakness:'lightning',
        power:12,
        defense:6
    }
    EnemyData.minotaur1 = {
        frame:'minotaur1',
        maxHP:22,
        weakness:'earth',
        power:15,
        defense:8
    }
    EnemyData.minotaur2 = {
        frame:'minotaur2',
        maxHP:25,
        weakness:'fire',
        power:20,
        defense:12
    }
    EnemyData.octopus = {
        frame:'octopus',
        maxHP:100,
        weakness:'lightning',
        power:50,
        defense:20
    }
    /*GAME DATA*/

    GameData = {
        currentLevel:1
    }
    GameData.levelData = [
        {
            type:'field',
            enemies:['troll1', 'troll1', 'troll1'],
            enemyStreak:1,
            enemyAttackWait:5000,
            powerIncreaseAwarded:1,
            defenseIncreaseAwarded:0,
            coinsAwarded:3,
            HPEarned:1
        },
        {
            type:'field',
            enemies:['troll1', 'sorcerer1', 'troll1', 'troll1', 'sorcerer1', 'troll1'],
            enemyStreak:2,
            enemyAttackWait:5000,
            powerIncreaseAwarded:2,
            defenseIncreaseAwarded:1,
            coinsAwarded:4,
            HPEarned:3
        },
        {
            type:'field',
            enemies:['troll2', 'sorcerer1', 'troll1', 'troll1', 'sorcerer1', 'troll1'],
            enemyStreak:2,
            enemyAttackWait:5000,
            powerIncreaseAwarded:4,
            defenseIncreaseAwarded:2,
            coinsAwarded:8,
            HPEarned:5
        },
        {
            type:'field',
            enemies:['sorcerer1', 'troll2', 'sorcerer1', 'sorcerer1', 'troll2', 'troll1', 'troll2', 'sorcerer1', 'troll1'],
            enemyStreak:3,
            enemyAttackWait:8000,
            powerIncreaseAwarded:6,
            defenseIncreaseAwarded:4,
            coinsAwarded:12,
            HPEarned:8
        },
        {
            type:'field',
            enemies:['sorcerer1', 'troll2', 'sorcerer2', 'sorcerer2', 'sorcerer1', 'troll2', 'troll2', 'sorcerer1', 'troll1'],
            enemyStreak:3,
            enemyAttackWait:7000,
            powerIncreaseAwarded:10,
            defenseIncreaseAwarded:6,
            coinsAwarded:15,
            HPEarned:12
        },
        {
            type:'field',
            enemies:['troll1', 'minotaur1', 'sorcerer2', 'sorcerer1', 'troll2', 'minotaur1', 'sorcerer2', 'troll2', 'troll1'],
            enemyStreak:3,
            enemyAttackWait:10000,
            powerIncreaseAwarded:1,
            defenseIncreaseAwarded:0,
            coinsAwarded:20,
            HPEarned:15
        },
        {
            type:'field',
            enemies:['troll1', 'minotaur1', 'minotaur2', 'sorcerer1', 'troll2', 'minotaur1', 'sorcerer2', 'minotaur2', 'troll1'],
            enemyStreak:2,
            enemyAttackWait:6000,
            powerIncreaseAwarded:0,
            defenseIncreaseAwarded:0,
            coinsAwarded:0,
            HPEarned:0
        },
        {
            type:'field',
            enemies:['minotaur1', 'minotaur2', 'sorcerer1', 'sorcerer2', 'minotaur2', 'troll2', 'sorcerer2', 'minotaur2', 'minotaur2'],
            enemyStreak:3,
            enemyAttackWait:8000,
            powerIncreaseAwarded:1,
            defenseIncreaseAwarded:0,
            coinsAwarded:3,
            HPEarned:0
        },
        {
            type:'boss',
            boss:'octopus',
            enemyStreak:1,
            enemyAttackWait:4000,
            powerIncreaseAwarded:1,
            defenseIncreaseAwarded:0,
            coinsAwarded:3,
            HPEarned:0
        }
    ];
    GameData.attackPower = {
        attack:0,
        fire:4,
        earth:7,
        lightning:10
    }
    GameData.magicCosts = {
        potion:2,
        fire:5,
        earth:7,
        lightning:10
    }

    /*PLAYER DATA*/

    PlayerData = {
        player:null,
        dataTemplate:{
            board:1,
            level:1,
            maxHP:10,
            power:5,
            defense:1,
            coins:3,
            attack:-1,
            fire:1,
            earth:0,
            lightning:0,
            potion:1,
            gameLevel:1
        },
        getData:function () {
            if (localStorage.gameLevel) {
                this.player = localStorage;
            }
            else {
                this.player = this.setLocalStorage();
            }
        },
        setLocalStorage:function () {
            for (var key in this.dataTemplate) {
                localStorage.setItem(key, this.dataTemplate[key]);
            }
            return localStorage;
        }
    }

    window.data.EnemyData = EnemyData;
    window.data.GameData = GameData;
    window.data.PlayerData = PlayerData;

}());
