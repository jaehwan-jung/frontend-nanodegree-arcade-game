/* npc-generator.js
 * This class is responsible for creating NPCs such as enemies and items
 * at varying intervals. This NPC generator can be started, stopped and 
 * also stepped up for increased difficulty
 */
(function (global) {
    'use strict';

    var DEFAULT_ENEMY_SPAWN_RATE_IN_MILLISECONDS = 1500;
    var DEFAULT_ENEMY_MOVEMENT_SPEED_IN_PIXEL_PER_SECOND = 100;

    var map;
    var player;
    var npcCollection;
    var enemySpawnRate;
    var defaultEnemySpeed;

    var setIntervalId;
    var setTimeoutId;
    var lastTime;
    var heartImage;
    var blueGemImage;
    var starImage;
    var stoneImage;

    function initialize(gameMap, thePlayer) {
        map = gameMap;
        player = thePlayer;
        npcCollection = [];
        enemySpawnRate = DEFAULT_ENEMY_SPAWN_RATE_IN_MILLISECONDS;
        defaultEnemySpeed = DEFAULT_ENEMY_MOVEMENT_SPEED_IN_PIXEL_PER_SECOND;

        heartImage = global.Resources.get(global.AppResources.item.heart);
        blueGemImage = global.Resources.get(global.AppResources.item.gemBlue);
        starImage = global.Resources.get(global.AppResources.item.star);
        stoneImage = global.Resources.get(global.AppResources.block.stone);
    }

    // Returns a random position within the boundaries of the map
    function getRandomPosition() {
        return {
            x: global.Random.getInteger(0, map.dimension.columnCount),
            y: global.Random.getInteger(0, map.dimension.rowCount)
        };
    }

    /* Callback for handling a collision for a heart item
     * A heart item turns all enemies on the map into hearts
     * An enemy which is turned into a heart can't collide with the player
     */
    function onHeartCollision() {
        npcCollection.forEach(function (npc) {
            if (npc instanceof global.Enemy) {
                npc.image = heartImage;
            }
        });
    }

    // Returns a heart item with a collision handler attached
    function createHeart() {
        return new global.Item(map, heartImage, onHeartCollision);
    }

    /* Callback for handling a collision for a blue gem item
     * A blue gem basically removes all enemies from the map
     */
    function onBlueGemCollision() {
        npcCollection.forEach(function (npc) {
            if (npc instanceof global.Enemy) {
                npc.state = global.SpiritStatesEnum.EXPIRED;
            }
        });
    }

    // Returns a blue gem item with a collision handler attached
    function createBlueGem() {
        return new global.Item(map, blueGemImage, onBlueGemCollision);
    }

    /* Callback for handling a collision for a star item
     * A star item resets the player's position back to the starting point
     */
    function onStarCollision() {
        var centerColumnIndex = Math.floor(map.dimension.columnCount / 2);
        player.setPosition(centerColumnIndex, 0);
    }

    // Returns a star item with a collision handler attached
    function createStar() {
        return new global.Item(map, starImage, onStarCollision);
    }

    /* Returns an item that is created by randomly picking
     * one of the creation methods. The position is randomly set as well.
     */
    function createRandomItem() {
        var itemCreationFnArray = [createHeart, createBlueGem, createStar];
        var randomIndex = global.Random.getInteger(0, itemCreationFnArray.length);
        var itemCreationFn = itemCreationFnArray[randomIndex];
        var item = itemCreationFn();
        var randomPosition = getRandomPosition();
        item.setPosition(randomPosition.x, randomPosition.y);
        return item;
    }

    // Returns an array of y positions in the map that have stone blocks
    function getValidYPositionsForEnemy() {
        var validPositions = [];
        for (var i = 0; i < map.dimension.rowCount; i++) {
            var blockImage = map.getBlockByColumnRow(0, i).image;
            if (blockImage === stoneImage) {
                validPositions.push(i);
            }
        }
        return validPositions;
    }

    // Returns a random Y position with stone blocks in the map
    function getRandomYPosition() {
        var validPositions = getValidYPositionsForEnemy();
        var randomIndex = global.Random.getInteger(0, validPositions.length - 1);
        return validPositions[randomIndex];
    }

    // Returns an enemy with a random speed and position
    function createEnemy() {
        lastTime = Date.now();
        var enemySpeed = global.Random.getInteger(defaultEnemySpeed * 0.5, defaultEnemySpeed);
        var enemy = new global.Enemy(map, global.DirectionsEnum.RIGHT, enemySpeed);

        var randomYPosition = getRandomYPosition();
        var blockPosition = map.getBlockByColumnRow(0, randomYPosition);
        var blockSize = map.dimension.blockSize;
        enemy.setPosition(-blockSize.width, blockPosition.origin.y - blockSize.height * 0.1);

        return enemy;
    }

    // Removes all expired(timeout, outside of the map) spirits
    function purgeExpiredNpcs() {
        for (var i = npcCollection.length - 1; i >= 0; i--) {
            if (npcCollection[i].state === global.SpiritStatesEnum.EXPIRED) {
                npcCollection.splice(i, 1);
            }
        }
    }

    // Creates and starts an enemy and a random item and then removes expired ones
    function createAndPurgeNpc() {
        var item = createRandomItem();
        npcCollection.push(item);
        item.startTimer();

        var enemy = createEnemy();
        npcCollection.push(enemy);
        enemy.start();

        purgeExpiredNpcs();
    }

    // Returns a random time to be used to create a NPC
    function createRandomSpawnTime() {
        return global.Random.getInteger(enemySpawnRate * 0.5, enemySpawnRate);
    }

    // Starts the NPC generator which creates an item and an enemy at varying intervals
    function start() {
        setIntervalId = window.setInterval(function () {
            var spawnTime = createRandomSpawnTime();
            setTimeoutId = window.setTimeout(function () {
                createAndPurgeNpc.call();
            }, spawnTime);
        }, enemySpawnRate);
    }

    // Stops the generator
    function stop() {
        window.clearInterval(setTimeoutId);
        window.clearInterval(setIntervalId);
    }

    /* Increases the difficulty of the game by
     * increasing the speed of enemies and
     * the frequency of creating a NPC
     */
    function stepUp() {
        defaultEnemySpeed = defaultEnemySpeed * 1.1;
        npcCollection.forEach(function (npc) {
            if (npc instanceof global.AutomatedSpirit) {
                npc.speed = npc.speed * 1.1;
            }
        });
        enemySpawnRate = enemySpawnRate * 0.9;
        stop();
        start();
    }

    function getNpcCollection() {
        return npcCollection;
    }

    global.NpcGenerator = {
        initialize: initialize,
        start: start,
        stop: stop,
        stepUp: stepUp,
        getNpcCollection: getNpcCollection
    };

})(window);