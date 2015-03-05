/* npc-generator.js
 * This class is responsible for creating NPCs such as enemies and items
 * at varying intervals. This NPC generator can be started, stopped and 
 * also stepped up for increased difficulty
 */
(function (global) {

    var DEFAULT_ENEMY_SPAWN_RATE_IN_MILLISECONDS = 2000;
    var DEFAULT_ENEMY_MOVEMENT_SPEED_IN_PIXEL_PER_SECOND = 100;

    var setIntervalId;
    var setTimeoutId;
    var lastTime;
    var heartImage;
    var blueGemImage;
    var starImage;
    var stoneImage;

    function initialize(map, player) {
        this.map = map;
        this.player = player;
        this.npcCollection = [];
        this.enemySpawnRate = DEFAULT_ENEMY_SPAWN_RATE_IN_MILLISECONDS;
        this.enemySpeed = DEFAULT_ENEMY_MOVEMENT_SPEED_IN_PIXEL_PER_SECOND;

        heartImage = Resources.get(AppResources.item.heart);
        blueGemImage = Resources.get(AppResources.item.gemBlue);
        starImage = Resources.get(AppResources.item.star);
        stoneImage = Resources.get(AppResources.block.stone);
    }

    // Returns a random position within the boundaries of the map
    function getRandomPosition() {
        return {
            x: Random.getInteger(0, this.map.dimension.columnCount),
            y: Random.getInteger(0, this.map.dimension.rowCount)
        }
    }

    /* Callback for handling a collision for a heart item
     * A heart item turns all enemies on the map into hearts
     * An enemy which is turned into a heart can't collide with the player
     */
    function onHeartCollision() {
        this.npcCollection.forEach(function (npc) {
            if (npc instanceof Enemy) {
                npc.image = heartImage;
            }
        })
    }

    // Returns a heart item with a collision handler attached
    function createHeart() {
        return new Item(this.map, heartImage, onHeartCollision.bind(this));
    }

    /* Callback for handling a collision for a blue gem item
     * A blue gem basically removes all enemies from the map
     */
    function onBlueGemCollision() {
        this.npcCollection.forEach(function (npc) {
            if (npc instanceof Enemy) {
                npc.state = SpiritStatesEnum.EXPIRED;
            }
        })
    }

    // Returns a blue gem item with a collision handler attached
    function createBlueGem() {
        return new Item(this.map, blueGemImage, onBlueGemCollision.bind(this));
    }

    /* Callback for handling a collision for a star item
     * A star item resets the player's position back to the starting point
     */
    function onStarCollision() {
        var centerColumnIndex = Math.floor(this.map.dimension.columnCount / 2);
        this.player.setPosition(centerColumnIndex, 0);
    }

    // Returns a star item with a collision handler attached
    function createStar() {
        return new Item(this.map, starImage, onStarCollision.bind(this));
    }

    /* Returns an item that is created by randomly picking
     * one of the creation methods. The position is randomly set as well.
     */
    function createRandomItem() {
        var itemCreationFnArray = [createHeart, createBlueGem, createStar];
        var randomIndex = Random.getInteger(0, itemCreationFnArray.length);
        var itemCreationFn = itemCreationFnArray[randomIndex];
        var item = itemCreationFn.call(this);
        var randomPosition = getRandomPosition.call(this);
        item.setPosition(randomPosition.x, randomPosition.y);
        return item;
    }

    // Returns an array of y positions in the map that have stone blocks
    function getValidYPositionsForEnemy() {
        var validPositions = [];
        for (var i = 0; i < this.map.dimension.rowCount; i++) {
            var blockImage = this.map.getBlockByColumnRow(0, i).image;
            if (blockImage === stoneImage)
                validPositions.push(i);
        }
        return validPositions;
    }

    // Returns a random Y position with stone blocks in the map
    function getRandomYPosition() {
        var validPositions = getValidYPositionsForEnemy.call(this);
        var randomIndex = Random.getInteger(0, validPositions.length - 1);
        return validPositions[randomIndex];
    }

    // Returns an enemy with a random speed and position
    function createEnemy() {
        var map = this.map;
        lastTime = Date.now();
        var enemySpeed = Random.getInteger(this.enemySpeed * 0.5, this.enemySpeed);
        var enemy = new Enemy(map, DirectionsEnum.RIGHT, enemySpeed);

        var randomYPosition = getRandomYPosition.call(this);
        var blockPosition = map.getBlockByColumnRow(0, randomYPosition);
        var blockSize = map.dimension.blockSize;
        enemy.setPosition(-blockSize.width, blockPosition.origin.y - blockSize.height * 0.1);

        return enemy;
    }

    // Removes all expired(timeout, outside of the map) spirits
    function purgeExpiredNpcs() {
        var npcCollection = this.npcCollection;
        for (var i = npcCollection.length - 1; i >= 0; i--) {
            if (npcCollection[i].state === SpiritStatesEnum.EXPIRED) {
                npcCollection.splice(i, 1);
            }
        }
    }

    // Creates and starts an enemy and a random item and then removes expired ones
    function createAndPurgeNpc() {
        var item = createRandomItem.call(this);
        this.npcCollection.push(item);
        item.startTimer();

        var enemy = createEnemy.call(this);
        this.npcCollection.push(enemy);
        enemy.start();

        purgeExpiredNpcs.call(this);
    }

    // Returns a random time to be used to create a NPC
    function createRandomSpawnTime() {
        return Random.getInteger(this.enemySpawnRate * 0.5, this.enemySpawnRate);
    }

    // Starts the NPC generator which creates an item and an enemy at varying intervals
    function start() {
        setIntervalId = global.setInterval(function () {
            var spawnTime = createRandomSpawnTime();
            setTimeoutId = global.setTimeout(function () {
                createAndPurgeNpc.call(this);
            }.bind(this), spawnTime);
        }.bind(this), this.enemySpawnRate);
    }

    // Stops the generator
    function stop() {
        global.clearInterval(setTimeoutId);
        global.clearInterval(setIntervalId);
    }

    /* Increases the difficulty of the game by
     * increasing the speed of enemies and
     * the frequency of creating a NPC
     */
    function stepUp() {
        this.enemySpeed = this.enemySpeed * 1.1;
        this.npcCollection.forEach(function (npc) {
            if (npc instanceof AutomatedSpirit) {
                npc.speed = npc.speed * 1.1;
            }
        });
        this.enemySpawnRate = this.enemySpawnRate * 0.9;
        this.stop();
        this.start();
    }

    global.NpcGenerator = {
        initialize: initialize,
        start: start,
        stop: stop,
        stepUp: stepUp
    }
})(this);