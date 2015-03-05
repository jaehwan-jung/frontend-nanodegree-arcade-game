/* information-board.js
 * This class represents the board that shows the level of the game
 * Can be extended to show any other information related to the game
 */
(function (global) {
    'use strict';

    // Initializes the board with required parameters
    function initialize(canvas, map) {
        this.canvas = canvas;
        this.map = map;
    }

    // Displays the information about the game
    function display() {
        function removePreviousScore() {
            context.fillStyle = 'white';
            context.fillText('Level - ' + (global.GameEngine.level - 1), 10, this.map.dimension.height * 0.95);
        }

        function displayScore() {
            var gradient = context.createLinearGradient(0, 0, this.canvas.width * 0.2, 0);
            gradient.addColorStop(0, 'blue');
            gradient.addColorStop(0.5, 'red');
            gradient.addColorStop(1.0, 'magenta');
            context.fillStyle = gradient;
            context.fillText('Level - ' + global.GameEngine.level, 10, this.map.dimension.height * 0.95);
        }

        var context = this.canvas.getContext('2d');
        context.font = '30px Verdana';

        removePreviousScore.call(this);
        displayScore.call(this);
    }

    global.InformationBoard = {
        initialize: initialize,
        display: display
    }

})(this);