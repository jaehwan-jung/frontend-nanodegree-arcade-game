/* position-utility.js
 * A utility class to help with dealing with relative positions
 */
(function (module) {
    'use strict';

    /* Returns true if the clicked (absolute) position is within the target rectangle
     * Takes into account the browser window scrolls
     */
    function isClicked(clickedAbsolutePosition, targetRectangle, canvas, documentBody) {
        var x = getRelativePosition(clickedAbsolutePosition.x, canvas.offsetLeft, documentBody.scrollLeft);
        var y = getRelativePosition(clickedAbsolutePosition.y, canvas.offsetTop, documentBody.scrollTop);
        return isWithin(x, targetRectangle.minX, targetRectangle.maxX) && isWithin(y, targetRectangle.minY, targetRectangle.maxY);
    }

    // Returns a relative position using provided offsets
    function getRelativePosition(absolutePosition, canvasOffset, documentScrollOffset) {
        return absolutePosition - canvasOffset + documentScrollOffset;
    }

    // Returns true if two numbers are within the given tolerance
    function areWithinTolerance(value1, value2, tolerance) {
        return Math.abs(value1 - value2) < tolerance;
    }

    // Returns true if the value is within the min and max values
    function isWithin(value, minInclusive, maxInclusive) {
        return value >= minInclusive && value <= maxInclusive;
    }

    // Returns a rectangle is represented by minimum and maximum x & y values
    function getRectangle(x, y, width, height) {
        return {
            minX: x,
            maxX: x + width,
            minY: y,
            maxY: y + height
        }
    }

    module.PositionUtility = {
        isClicked: isClicked,
        getRectangle: getRectangle,
        areWithinTolerance: areWithinTolerance
    };

})(this);