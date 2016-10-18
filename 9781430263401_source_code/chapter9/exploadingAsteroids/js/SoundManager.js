(function () {

    window.game = window.game || {};

    var SoundManager = function (sfxVolume, soundtrackVolume) {
        this.sfxVolume = sfxVolume;
        this.soundtrackVolume = soundtrackVolume;
        this.initialize();
    }
    var p = SoundManager.prototype = new createjs.EventDispatcher();

    p.EventDispatcher_initialize = p.initialize;

    p.sfxVolume = 1;
    p.soundtrackVolume = 1;

    p.initialize = function () {
        this.EventDispatcher_initialize();
    }

    p.playSFX = function (id) {
        createjs.Sound.play(id, 0, 0, 0, 0, this.sfxVolume);
    }

    window.game.SoundManager = SoundManager;

}());
