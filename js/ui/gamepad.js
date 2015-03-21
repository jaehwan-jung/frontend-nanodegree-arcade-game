/* global.Gamepad.js
 * Represents 
 */
(function (global) {
    'use strict';

    var BUTTON_SIZE_MULTIPLIER = 0.5;

    var canvas;
    var map;
    var width;
    var height;
    var y;
    var startStopButton;
    var restartButton;

    // Initializes the button with required parameters
    function initialize(theCanvas, gameMap) {
        canvas = theCanvas;
        map = gameMap;
        width = map.dimension.width;
        height = canvas.height - map.dimension.height;
        y = map.dimension.height * 0.9;
        startStopButton = createStartStopButton();
        restartButton = createRestartButton();
    }

    // Returns the start button which turns into the stop button upon click and vice versa
    // This button starts or resumes the game when it's the start button.
    // When it's the stop button, it pauses the game.
    function createStartStopButton() {
        var startButtonImage = global.Resources.get(global.AppResources.buttons.start);
        var stopButtonImage = global.Resources.get(global.AppResources.buttons.stop);
        var buttonWidth = height * BUTTON_SIZE_MULTIPLIER;
        var buttonHeight = height * BUTTON_SIZE_MULTIPLIER;
        var position = {
            x: width / 2 - buttonWidth,
            y: y
        };
        var onStartStopButtonClick = function () {
            if (startStopButton.image === startButtonImage) {
                startStopButton.image = stopButtonImage;
                global.GameEngine.start();
                global.NpcGenerator.start();
            } else {
                startStopButton.image = startButtonImage;
                global.GameEngine.stop();
                global.NpcGenerator.stop();
            }
        };
        return new global.Button(canvas, startButtonImage, position, buttonWidth, buttonHeight, onStartStopButtonClick);
    }

    /* Returns the restart button with its onclick handler attached
     * The restart button completely restarts the game
     */
    function createRestartButton() {
        var image = global.Resources.get(global.AppResources.buttons.restart);
        var buttonWidth = height * BUTTON_SIZE_MULTIPLIER;
        var position = {
            x: width / 2,
            y: y
        };
        var onRestartButtonClick = function () {
            location.reload();
        };
        return new global.Button(canvas, image, position, buttonWidth, buttonWidth, onRestartButtonClick);
    }

    // Displays the global.Gamepad thereby displaying buttons
    function display() {
        var context = canvas.getContext('2d');
        context.drawImage(startStopButton.image, startStopButton.position.x, startStopButton.position.y,
            startStopButton.width, startStopButton.height);
        context.drawImage(restartButton.image, restartButton.position.x, restartButton.position.y,
            restartButton.width, restartButton.height);
    }

    global.Gamepad = {
        initialize: initialize,
        display: display
    };

})(window);