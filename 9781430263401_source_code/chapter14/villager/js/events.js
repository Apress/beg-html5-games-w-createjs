window.events = window.events || {};

events.ATTACK_BUTTON_SELECTED = 'attack button selected';
events.ENEMY_ATTACK_ANIMATION_COMPLETE = 'enemy attack animation complete';
events.ENEMY_ATTACKED_COMPLETE = 'enemy attacked complete';
events.ENEMY_DESTROYED = 'enemy destroyed';

(function(){

    function BattleButtonEvent(type,bubbles,cancelable,attackType){
        this.attackType = attackType;
        this.initialize(type,bubbles,cancelable);
    }

    var p = BattleButtonEvent.prototype = new createjs.Event();

    p.attackType = null;

    p.Event_initialize = p.initialize;

    p.initialize = function(type,bubbles,cancelable){
        this.Event_initialize(type,bubbles,cancelable);
    }

    window.events.BattleButtonEvent = BattleButtonEvent;

}());