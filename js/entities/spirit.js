/* spirit.js
 * This class represents the parent class of all NPCs and the player.
 * Contains common functions and variables for NPCs and the player.
 */
(function (global) {
    'use strict';

    global.Spirit = function (map, image) {
        this.map = map;
        this.image = image;
        this.state = global.SpiritStatesEnum.INACTIVE;
        this.position = {x: 0, y: 0};
    };

    global.Spirit.prototype.onExpire = [];

    // Sets the image of the spirit
    global.Spirit.prototype.setImage = function (image) {
        this.image = image;
    };

    // Sets the boundary within which the spirit is allowed to move
    global.Spirit.prototype.setMovementBoundary = function (rectangle) {
        this.rectangle = rectangle;
    };

    // Returns the value if it's with the max and min values. Otherwise either max or min values.
    global.Spirit.prototype.getValidValue = function (value, maxValue, minValue) {
        if (value >= minValue && value <= maxValue) {
            return value;
        }
        this.state = global.SpiritStatesEnum.EXPIRED;
        if (value < minValue) {
            return minValue;
        }
        return maxValue;
    };

    // Returns x if it's with the boundary. Otherwise either max or min value allowed.
    global.Spirit.prototype.getValidXPosition = function (x) {
        return this.getValidValue(x, this.rectangle.maxX, this.rectangle.minX);
    };

    // Returns y if it's with the boundary. Otherwise either max or min value allowed.
    global.Spirit.prototype.getValidYPosition = function (y) {
        return this.getValidValue(y, this.rectangle.maxY, this.rectangle.minY);
    };

    // Sets the position of the spirit
    global.Spirit.prototype.setPosition = function (x, y) {
        this.position.x = this.getValidXPosition(x);
        this.position.y = this.getValidYPosition(y);
        if (this.state !== global.SpiritStatesEnum.EXPIRED) {
            return;
        }

        this.onExpire.forEach(function (callback) {
            callback();
        });
    };

    // Returns true if the spirit is collided with the player
    global.Spirit.prototype.isCollided = function (player) {
        return player.position.x === this.position.x && player.position.y === this.position.y;
    };

})(window);

