/* item.js
 * This class represents items such as gems, stars, and hearts.
 * Each item type has its own effect such as removing all enemies on the screen
 * upon contact with the player.
 */
(function (global) {
    'use strict';

    global.Item = function (map, image, onCollision) {
        global.Spirit.call(this, map, image);
        var boundaryRectangle = global.PositionUtility.getRectangle(0, 0, map.dimension.columnCount - 1, map.dimension.rowCount - 2);
        this.setMovementBoundary(boundaryRectangle);
        this.onCollision = onCollisionFn(onCollision);
        this.timeout = 4000;
        this.created = Date.now();
    };

    global.Item.prototype = Object.create(global.Spirit.prototype);

    global.Item.prototype.constructor = global.Item;

    // Returns a wrapper function for the provided onCollision function
    function onCollisionFn(onCollision) {
        return function () {
            if (this.state !== global.SpiritStatesEnum.ACTIVE) {
                return;
            }

            onCollision();
            this.state = global.SpiritStatesEnum.EXPIRED;
        };
    }

    // Starts checking the timeout for expiring the item
    global.Item.prototype.startTimer = function () {
        this.state = global.SpiritStatesEnum.ACTIVE;
    };

    // Stops checking the timeout for expiring the item
    global.Item.prototype.stopTimer = function () {
        this.state = global.SpiritStatesEnum.INACTIVE;
    };

    // Updates the item's data including checking whether the item needs to expire
    global.Item.prototype.update = function () {
        if (this.state !== global.SpiritStatesEnum.ACTIVE) {
            return;
        }

        if ((Date.now() - this.created) > this.timeout) {
            this.state = global.SpiritStatesEnum.EXPIRED;
        }
    };

    // Renders the item's graphics
    global.Item.prototype.render = function () {
        if (this.state !== global.SpiritStatesEnum.ACTIVE) {
            return;
        }

        var context = this.map.canvas.getContext('2d');
        var block = this.map.getBlockByColumnRow(this.position.x, this.position.y);
        var enemyWidth = this.map.dimension.blockSize.width;
        var enemyHeight = this.map.dimension.blockSize.height * 1.5;
        context.drawImage(this.image, block.origin.x, block.origin.y + enemyHeight * 0.1, enemyWidth, enemyHeight);
    };
}(window));
