/* button.js
 * Represents a button such as the start, stop, and restart button
 */
(function (global) {
    'use strict';

    global.Button = function (canvas, image, position, width, height, onButtonClick) {
        this.canvas = canvas;
        this.image = image;
        this.position = position;
        this.width = width;
        this.height = height;
        this.onButtonClick = onButtonClick;
        this.canvas.addEventListener('click', onClickedFn(this));
    };

    // Returns a function that runs the button's onclick event handler if clicked on it
    function onClickedFn(button) {
        return function (position) {
            var targetRectangle = global.PositionUtility.getRectangle(button.position.x, button.position.y, button.width, button.height);
            if (global.PositionUtility.isClicked(position, targetRectangle, button.canvas, global.document.body)) {
                button.onButtonClick();
            }
        };
    }

    // Renders the button graphics
    global.Gamepad.prototype.display = function () {
        var context = this.canvas.getContext('2d');
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    };
})(window);