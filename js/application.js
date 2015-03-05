/* application.js
 * This is the main script that sets up everything
 */
(function () {
    'use strict';

    var canvas;
    var map;
    var player;

    // Loads all image resources
    function initializeResources() {
        for (var resourceType in AppResources) {
            if (AppResources.hasOwnProperty(resourceType)) {
                var appResourceType = AppResources[resourceType];
                for (var resource in  appResourceType) {
                    if (appResourceType.hasOwnProperty(resource)) {
                        Resources.load(appResourceType[resource]);
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
        var grass = Resources.get(AppResources.block.grass);
        var stone = Resources.get(AppResources.block.stone);
        var water = Resources.get(AppResources.block.water);
        var selector = Resources.get(AppResources.block.selector);
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

        var keyboardController = new KeyboardController();
        var playerImage = Resources.get(AppResources.player.boy);
        var initialPosition = {x: Math.floor(map.dimension.columnCount / 2), y: Math.floor(map.dimension.rowCount - 1)};
        player = new Player(map, playerImage, keyboardController, initialPosition);

        NpcGenerator.initialize(map, player);
        GameEngine.initialize(map, player);
        Gamepad.initialize(canvas, map);

        InformationBoard.initialize(canvas, map);
    }

    // This is the main loop of the game where everything is updated and rendered
    function mainLoop() {
        GameEngine.update();
        GameEngine.render();
        InformationBoard.display();
        Gamepad.display();
        window.requestAnimationFrame(mainLoop);
    }

    // Starts the game by first asking the user to select his/her character
    function start() {
        CharacterSelectionDialog.open();
        map.render();
        CharacterSelectionDialog.onClose = function () {
            player.setImage(CharacterSelectionDialog.getSelectedPlayer());
            player.render();
            mainLoop();
        };
    }

    initializeResources();
    Resources.onReady(function () {
        initialize();
        start();
    });

})();
