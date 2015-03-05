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
        initializeClickHandler(this);
    };

    // Adds onclick event handler to the button
    function initializeClickHandler(button) {
        button.canvas.addEventListener('click', onClickedFn(button));
    }

    // Returns a function that runs the button's onclick event handler if clicked on it
    function onClickedFn(button) {
        return function (position) {
            var targetRectangle = PositionUtility.getRectangle(button.position.x, button.position.y, button.width, button.height);
            if (PositionUtility.isClicked(position, targetRectangle, button.canvas, global.document.body)) {
                button.onButtonClick();
            }
        };
    }

    // Renders the button graphics
    global.Gamepad.prototype.display = function () {
        var context = this.canvas.getContext('2d');
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    };
})(this);