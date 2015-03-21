/* automated-spirit.js
 * This class represents a spirit that moves automatically according
 * to the provided direction and speed parameters
 * Subclass of Spirit
 */
(function (global) {
    'use strict';

    global.AutomatedSpirit = function (map, image, direction, speed) {
        global.Spirit.call(this, map, image);
        this.direction = direction;
        this.speed = speed;
    };

    global.AutomatedSpirit.prototype = Object.create(global.Spirit.prototype);

    global.AutomatedSpirit.prototype.constructor = global.AutomatedSpirit;

    // Starts moving the spirit if it is active
    global.AutomatedSpirit.prototype.start = function () {
        if (this.state === global.SpiritStatesEnum.ACTIVE) {
            return;
        }

        if (this.lastTimeInMilliSeconds === undefined) {
            this.lastTimeInMilliSeconds = Date.now();
        }

        this.state = global.SpiritStatesEnum.ACTIVE;
    };

    // Stops moving the spirit if it is active
    global.AutomatedSpirit.prototype.stop = function () {
        if (this.state !== global.SpiritStatesEnum.ACTIVE) {
            return;
        }

        this.stoppedTime = Date.now();
        this.state = global.SpiritStatesEnum.INACTIVE;
    };

    // Calculates the distance moved from the last time the spirit was updated & rendered
    var getDeltaPosition = function (speed, now, lastTimeInMilliSeconds) {
        var timeElapsedInSeconds = (now - lastTimeInMilliSeconds) / 1000;
        return speed * timeElapsedInSeconds;
    };

    // Returns the spirit's new position to be rendered using the provided delta position
    function getNewPosition(direction, x, y, deltaPosition) {
        var newX = x;
        var newY = y;
        switch (direction) {
            case global.DirectionsEnum.LEFT:
                newX = x - deltaPosition;
                break;
            case global.DirectionsEnum.RIGHT:
                newX = x + deltaPosition;
                break;
            case global.DirectionsEnum.UP:
                newY = y - deltaPosition;
                break;
            case global.DirectionsEnum.DOWN:
                newY = y + deltaPosition;
                break;
        }
        return {x: newX, y: newY};
    }

    // Returns the spirit's new position to be rendered
    global.AutomatedSpirit.prototype.getNextPosition = function (position) {
        var now = Date.now();
        var deltaPosition;
        if (this.stoppedTime === undefined) {
            deltaPosition = getDeltaPosition(this.speed, now, this.lastTimeInMilliSeconds);
        } else {
            deltaPosition = getDeltaPosition(this.speed, this.stoppedTime, this.lastTimeInMilliSeconds);
            this.stoppedTime = undefined;
        }

        this.lastTimeInMilliSeconds = now;

        return getNewPosition(this.direction, position.x, position.y, deltaPosition);
    };
}(window));
