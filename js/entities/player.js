/* player.js
 * This class represents the player
 */
(function (global) {
    'use strict';

    /* The player's position is bound by the map
     * The player's position is in terms of columns and rows instead of x and y
     * The player's position is bound by the map
     */
    global.Player = function (map, image, controller, initialPosition) {
        global.Spirit.call(this, map, image);
        var boundaryRectangle = PositionUtility.getRectangle(0, 0, map.dimension.columnCount - 1, map.dimension.rowCount - 1);
        this.setMovementBoundary(boundaryRectangle);
        this.isSafe = false;
        this.initialPosition = initialPosition;
        initializeController(this, controller);
        this.reset();
    };

    global.Player.prototype = Object.create(global.Spirit.prototype);

    global.Player.prototype.constructor = global.Player;

    // Hooks up the player's movement control to the given controller
    function initializeController(player, controller) {
        controller.onLeft.push(function () {
            player.move(DirectionsEnum.LEFT);
        });
        controller.onRight.push(function () {
            player.move(DirectionsEnum.RIGHT);
        });
        controller.onUp.push(function () {
            player.move(DirectionsEnum.UP);
        });
        controller.onDown.push(function () {
            player.move(DirectionsEnum.DOWN);
        });
    }

    // Resets the player's position back to the initial position
    global.Player.prototype.reset = function () {
        this.setPosition(this.initialPosition.x, this.initialPosition.y);
    };

    // Moves the player by 1 (block) in the direction provided
    global.Player.prototype.move = function (direction) {
        var x = this.position.x;
        var y = this.position.y;
        switch (direction) {
            case global.DirectionsEnum.LEFT:
                this.position.x = this.getValidXPosition(x - 1);
                break;
            case global.DirectionsEnum.RIGHT:
                this.position.x = this.getValidXPosition(x + 1);
                break;
            case global.DirectionsEnum.UP:
                this.position.y = this.getValidYPosition(y - 1);
                break;
            case global.DirectionsEnum.DOWN:
                this.position.y = this.getValidYPosition(y + 1);
                break;
            default:
                break;
        }
    };

    /* Updates the player's data including whether it has reached the water
     * which is indicated by the variable isSafe
     */
    global.Player.prototype.update = function () {
        this.isSafe = this.position.y == 0;
    };

    // Renders the player's graphics
    global.Player.prototype.render = function () {
        var context = this.map.canvas.getContext('2d');
        var block = this.map.getBlockByColumnRow(this.position.x, this.position.y);
        var playerWidth = this.map.dimension.blockSize.width;
        var playerHeight = this.map.dimension.blockSize.height * 1.8;
        context.drawImage(this.image, block.origin.x, block.origin.y, playerWidth, playerHeight);
    };
})(this);