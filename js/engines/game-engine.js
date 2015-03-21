/* engine.js
 * This class provides the game loop functionality in which entities are
 * updated and rendered. This class handles collisions and provides
 * the ability to start, stop, and reset the game
 */
(function (global) {
    'use strict';

    var map;
    var player;
    var npcs;
    var state;
    var level;

    /* Initializes with required parameters
     * and sets the default variables
     */
    function initialize(gameMap, thePlayer) {
        map = gameMap;
        player = thePlayer;
        npcs = global.NpcGenerator.getNpcCollection();
        state = global.EngineStateEnum.NOT_STARTED;
        level = 1;
    }

    // Returns true if the engine has started
    function isStarted() {
        return state !== global.EngineStateEnum.STARTED;
    }

    // Iterates through the given array and invoke update
    function updateAll(spirits) {
        spirits.forEach(function (spirit) {
            spirit.update();
        });
    }

    /* If the player is safe (by which means he/she reached the water)
     * he/she will be reset. Otherwise, updates all npcs including the player
     */
    function update() {
        if (isStarted()) {
            return;
        }

        player.update();
        if (player.isSafe) {
            reset();
        } else {
            updateAll(npcs);
        }
    }

    /* If the collided enemy is not a heart, it stops the game
     * and displays a dialog to restart the game
     * A heart item is considered non-collidable as explained in README.md
     */
    function handleEnemyCollision(enemy) {
        if (enemy.image === global.Resources.get(global.AppResources.item.heart)) {
            return;
        }

        stop();
        global.NpcGenerator.stop();
        global.RestartDialog.open();
    }

    // Calls onCollision for the given item
    function handleItemCollision(item) {
        item.onCollision();
    }

    // Provides a function for handling collisions for NPCs.
    function handleCollisionFn(npc) {
        return function () {
            if (npc instanceof global.AutomatedSpirit) {
                handleEnemyCollision(npc);
            } else {
                handleItemCollision(npc);
            }
        };
    }

    // Checks if a NPC is collided with the player and handles it if so
    function checkAndHandleCollisions() {
        npcs.forEach(function (npc) {
            if (!npc.isCollided(player)) {
                return;
            }

            global.requestAnimationFrame(handleCollisionFn(npc));
        });
    }

    // Renders the graphics for NPCs, player, and map
    function render() {
        if (state !== global.EngineStateEnum.STARTED) {
            return;
        }

        map.render();
        player.render();
        npcs.forEach(function (npc) {
            npc.render();
        });

        checkAndHandleCollisions();
    }

    // Start or resume the game
    function start() {
        state = global.EngineStateEnum.STARTED;
        npcs.forEach(function (npc) {
            if (npc instanceof global.AutomatedSpirit) {
                npc.start();
            } else {
                npc.startTimer();
            }
        });
    }

    // Stop or pause the game
    function stop() {
        state = global.EngineStateEnum.STOPPED;
        npcs.forEach(function (npc) {
            if (npc instanceof global.AutomatedSpirit) {
                npc.stop();
            } else {
                npc.stopTimer();
            }
        });
    }

    // Resets the game and increment the level (difficulty)
    function reset() {
        global.NpcGenerator.stepUp();
        player.reset();
        level++;
    }

    function getCurrentLevel() {
        return level;
    }

    global.GameEngine = {
        getCurrentLevel: getCurrentLevel,
        initialize: initialize,
        update: update,
        render: render,
        start: start,
        stop: stop,
        reset: reset
    };
})(window);