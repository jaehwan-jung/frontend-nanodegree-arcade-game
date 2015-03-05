/* engine.js
 * This class provides the game loop functionality in which entities are
 * updated and rendered. This class handles collisions and provides
 * the ability to start, stop, and reset the game
 */
(function (global) {
    'use strict';

    var DEFAULT_GAME_LEVEL = 1;

    /* Initializes with required parameters
     * and sets the default variables
     */
    function initialize(map, player) {
        this.map = map;
        this.player = player;
        this.npcs = global.NpcGenerator.npcCollection;
        this.state = EngineStateEnum.NOT_STARTED;
        this.level = DEFAULT_GAME_LEVEL;
    }

    // Returns true if the engine has started
    function isStarted() {
        return this.state !== EngineStateEnum.STARTED;
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
        if (isStarted.call(this))
            return;

        this.player.update();
        this.player.isSafe ? this.reset() : updateAll(this.npcs);
    }

    /* If the collided enemy is not a heart, it stops the game
     * and displays a dialog to restart the game
     * A heart item is considered non-collidable as explained in README.md
     */
    function handleEnemyCollision(enemy) {
        if (enemy.image === Resources.get(AppResources.item.heart))
            return;

        this.stop();
        global.NpcGenerator.stop();
        RestartDialog.open();
    }

    // Calls onCollision for the given item
    function handleItemCollision(item) {
        item.onCollision();
    }

    // Provides a function for handling collisions for NPCs.
    function handleCollisionFn(npc) {
        return function () {
            (npc instanceof AutomatedSpirit) ? handleEnemyCollision.call(this, npc) : handleItemCollision(npc);
        }.bind(this);
    }

    // Checks if a NPC is collided with the player and handles it if so
    function checkAndHandleCollisions() {
        this.npcs.forEach(function (npc) {
            if (!npc.isCollided(this.player))
                return;

            global.requestAnimationFrame(handleCollisionFn.call(this, npc));
        }.bind(this));
    }

    // Renders the graphics for NPCs, player, and map
    function render() {
        if (this.state !== EngineStateEnum.STARTED)
            return;

        this.map.render();
        this.player.render();
        this.npcs.forEach(function (npc) {
            npc.render();
        });

        checkAndHandleCollisions.call(this);
    }

    // Start or resume the game
    function start() {
        this.state = EngineStateEnum.STARTED;
        this.npcs.forEach(function (npc) {
            (npc instanceof AutomatedSpirit) ? npc.start() : npc.startTimer();
        });
    }

    // Stop or pause the game
    function stop() {
        this.state = EngineStateEnum.STOPPED;
        this.npcs.forEach(function (npc) {
            (npc instanceof AutomatedSpirit) ? npc.stop() : npc.stopTimer();
        });
    }

    // Resets the game and increment the level (difficulty)
    function reset() {
        global.NpcGenerator.stepUp();
        this.player.reset();
        this.level++;
    }

    global.GameEngine = {
        initialize: initialize,
        update: update,
        render: render,
        start: start,
        stop: stop,
        reset: reset
    }
})(window);