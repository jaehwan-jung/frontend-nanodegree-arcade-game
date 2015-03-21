/* application.js
 * This is the main script that sets up everything
 */
(function (global) {
    'use strict';

    var canvas;
    var map;
    var player;

    // Loads all image resources
    function initializeResources() {
        for (var resourceType in global.AppResources) {
            if (global.AppResources.hasOwnProperty(resourceType)) {
                var appResourceType = global.AppResources[resourceType];
                for (var resource in  appResourceType) {
                    if (appResourceType.hasOwnProperty(resource)) {
                        global.Resources.load(appResourceType[resource]);
                    }
                }
            }
        }
    }

    // Creates the canvas
    function initializeCanvas() {
        canvas = document.createElement('canvas');
        canvas.width = 700;
        canvas.height = 900;
        document.body.appendChild(canvas);
    }

    // Creates the map
    function initializeMap() {
        var grass = global.Resources.get(global.AppResources.block.grass);
        var stone = global.Resources.get(global.AppResources.block.stone);
        var water = global.Resources.get(global.AppResources.block.water);
        var selector = global.Resources.get(global.AppResources.block.selector);
        var matrix = [
            [water, water, water, water, water, water, water, water, water],
            [stone, stone, stone, stone, stone, stone, stone, stone, stone],
            [stone, stone, stone, stone, stone, stone, stone, stone, stone],
            [grass, grass, grass, grass, grass, grass, grass, grass, grass],
            [stone, stone, stone, stone, stone, stone, stone, stone, stone],
            [stone, stone, stone, stone, stone, stone, stone, stone, stone],
            [grass, grass, grass, grass, grass, grass, grass, grass, grass],
            [stone, stone, stone, stone, stone, stone, stone, stone, stone],
            [grass, grass, grass, grass, selector, grass, grass, grass, grass]
        ];
        map = new Map(canvas);
        map.setMap(matrix);
    }

    // Initializes the game. This is the very first point of the whole application.
    function initialize() {
        initializeCanvas();
        initializeMap();

        var keyboardController = new global.KeyboardController();
        var playerImage = global.Resources.get(global.AppResources.player.boy);
        var initialPosition = {x: Math.floor(map.dimension.columnCount / 2), y: Math.floor(map.dimension.rowCount - 1)};
        player = new global.Player(map, playerImage, keyboardController, initialPosition);

        global.NpcGenerator.initialize(map, player);
        global.GameEngine.initialize(map, player);
        global.Gamepad.initialize(canvas, map);
        global.InformationBoard.initialize(canvas, map);
    }

    // This is the main loop of the game where everything is updated and rendered
    function mainLoop() {
        global.GameEngine.update();
        global.GameEngine.render();
        global.InformationBoard.display();
        global.Gamepad.display();
        window.requestAnimationFrame(mainLoop);
    }

    // Starts the game by first asking the user to select his/her character
    function start() {
        global.CharacterSelectionDialog.open();
        map.render();
        global.CharacterSelectionDialog.onClose.push(function () {
            player.setImage(global.CharacterSelectionDialog.getSelectedPlayer());
            player.render();
            mainLoop();
        });
    }

    initializeResources();
    global.Resources.onReady(function () {
        initialize();
        start();
    });

})(window);
