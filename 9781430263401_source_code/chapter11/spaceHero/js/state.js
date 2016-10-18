(function () {

    window.game = window.game || {};

    var GameStates = {
        MAIN_MENU:0,
        RUN_SCENE:1,
        GAME:10,
        GAME_OVER:20
    }

    var GameStateEvents = {
        MAIN_MENU:'main menu event',
        GAME_OVER:'game over event',
        MAIN_MENU_SELECT:'game menu select event',
        GAME:'game event'
    }

    window.game.GameStates = GameStates;
    window.game.GameStateEvents = GameStateEvents;

}());
