/* gamepad.js
 * Represents 
 */
(function (global) {
    'use strict';

    var BUTTON_SIZE_MULTIPLIER = 0.5;

    // Initializes the button with required parameters
    function initialize(canvas, map) {
        this.canvas = canvas;
        this.map = map;
        this.width = map.dimension.width;
        this.height = canvas.height - map.dimension.height;
        this.y = map.dimension.height * 0.9;
        this.startStopButton = createStartStopButton(this);
        this.restartButton = createRestartButton(this);
    }

    // Returns the start button which turns into the stop button upon click and vice versa
    // This button starts or resumes the game when it's the start button.
    // When it's the stop button, it pauses the game.
    function createStartStopButton(gamepad) {
        var startButtonImage = Resources.get(AppResources.buttons.start);
        var stopButtonImage = Resources.get(AppResources.buttons.stop);
        var width = gamepad.height * BUTTON_SIZE_MULTIPLIER;
        var height = gamepad.height * BUTTON_SIZE_MULTIPLIER;
        var position = {
            x: gamepad.width / 2 - width,
            y: gamepad.y
        };
        var onStartStopButtonClick = function () {
            if (gamepad.startStopButton.image === startButtonImage) {
                gamepad.startStopButton.image = stopButtonImage;
                global.GameEngine.start();
                global.NpcGenerator.start();
            } else {
                gamepad.startStopButton.image = startButtonImage;
                global.GameEngine.stop();
                global.NpcGenerator.stop();
            }
        };
        return new Button(gamepad.canvas, startButtonImage, position, width, height, onStartStopButtonClick);
    }

    /* Returns the restart button with its onclick handler attached
     * The restart button completely restarts the game
     */
    function createRestartButton(gamepad) {
        var image = Resources.get(AppResources.buttons.restart);
        var width = gamepad.height * BUTTON_SIZE_MULTIPLIER;
        var height = gamepad.height * BUTTON_SIZE_MULTIPLIER;
        var position = {
            x: gamepad.width / 2,
            y: gamepad.y
        };
        var onRestartButtonClick = function () {
            location.reload();
        };
        return new Button(gamepad.canvas, image, position, width, height, onRestartButtonClick);
    }

    // Displays the gamepad thereby displaying buttons
    function display() {
        var context = this.canvas.getContext('2d');
        context.drawImage(this.startStopButton.image, this.startStopButton.position.x, this.startStopButton.position.y,
            this.startStopButton.width, this.startStopButton.height);
        context.drawImage(this.restartButton.image, this.restartButton.position.x, this.restartButton.position.y,
            this.restartButton.width, this.restartButton.height);
    }

    global.Gamepad = {
        initialize: initialize,
        display: display
    }
})(this);