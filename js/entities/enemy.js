/* enemy.js
 * This class represents enemies that the player has to dodge to win
 * Inherits Spirit because it is a NPC
 * Inherits AutomatedSpirit because it moves automatically
 */
(function (global) {
    'use strict';

    global.Enemy = function (map, direction, speed) {
        var image = global.Resources.get(global.AppResources.enemy.bug);
        global.AutomatedSpirit.call(this, map, image, direction, speed);
        var boundaryRectangle = global.PositionUtility.getRectangle(-200, 0, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        this.setMovementBoundary(boundaryRectangle);
    };

    global.Enemy.prototype = Object.create(global.AutomatedSpirit.prototype);

    global.Enemy.prototype.constructor = global.Enemy;

    // Updates the enemy's data
    global.Enemy.prototype.update = function () {
        if (this.state !== global.SpiritStatesEnum.ACTIVE) {
            return;
        }

        var position = this.getNextPosition(this.position);
        this.setPosition(position.x, position.y);
    };

    // Renders the enemy's graphics
    global.Enemy.prototype.render = function () {
        if (this.state !== global.SpiritStatesEnum.ACTIVE) {
            return;
        }

        var context = this.map.canvas.getContext('2d');
        var enemyWidth = this.map.dimension.blockSize.width;
        var enemyHeight = this.map.dimension.blockSize.height * 1.8;
        context.drawImage(this.image, this.position.x, this.position.y, enemyWidth, enemyHeight);
    };

    // Returns true if the enemy has collided with the player
    global.Enemy.prototype.isCollided = function (player) {
        var playerPosition = this.map.getBlockByColumnRow(player.position.x, player.position.y).origin;
        return global.PositionUtility.areWithinTolerance(playerPosition.x, this.position.x, this.map.dimension.blockSize.width * 0.7) &&
            global.PositionUtility.areWithinTolerance(playerPosition.y, this.position.y, this.map.dimension.blockSize.height * 0.2);
    };

})(window);