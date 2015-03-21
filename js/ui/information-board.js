/* information-board.js
 * This class represents the board that shows the level of the game
 * Can be extended to show any other information related to the game
 */
(function (global) {
    'use strict';

    var canvas;
    var map;

    // Initializes the board with required parameters
    function initialize(theCanvas, gameMap) {
        canvas = theCanvas;
        map = gameMap;
    }

    // Displays the information about the game
    function display() {
        function removePreviousScore(currentLevel) {
            context.fillStyle = 'white';
            context.fillText('Level - ' + (currentLevel - 1), 10, map.dimension.height * 0.95);
        }

        function displayScore(currentLevel) {
            var gradient = context.createLinearGradient(0, 0, canvas.width * 0.2, 0);
            gradient.addColorStop(0, 'blue');
            gradient.addColorStop(0.5, 'red');
            gradient.addColorStop(1.0, 'magenta');
            context.fillStyle = gradient;
            context.fillText('Level - ' + currentLevel, 10, map.dimension.height * 0.95);
        }

        var currentLevel = global.GameEngine.getCurrentLevel();

        var context = canvas.getContext('2d');
        context.font = '30px Verdana';

        removePreviousScore(currentLevel);
        displayScore(currentLevel);
    }

    global.InformationBoard = {
        initialize: initialize,
        display: display
    };

})(window);