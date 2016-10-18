(function () {

    window.game = window.game || {};

    var GameStates = {
        RUN_SCENE:0,
        MAIN_MENU:10,
        LEVEL_SELECT_MENU:20,
        GAME:30,
        LEVEL_COMPLETE:40,
        LEVEL_LOSE:50,
    }

    var GameStateEvents = {
        MAIN_MENU:'main menu event',
        LEVEL_SELECT:'level select event',
        LEVEL_COMPLETE:'level complete event',
        MAIN_MENU_SELECT:'game menu select event',
        GAME:'game event'
    }

    window.game.GameStates = GameStates;
    window.game.GameStateEvents = GameStateEvents;

}());
