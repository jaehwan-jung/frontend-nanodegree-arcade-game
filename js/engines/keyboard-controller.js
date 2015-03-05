/* keyboard-controller.js
 * This class is a wrapper for the keyboard input handler library
 * Provides the ability to attach multiple handlers to each key input type
 */
(function (global) {
    'use strict';

    global.KeyboardController = function () {
        this.onLeft = [];
        this.onRight = [];
        this.onUp = [];
        this.onDown = [];
        initialize.call(this);
    };

    function runAllCallbacksFn(callbacks) {
        return function () {
            callbacks.forEach(function (callback) {
                callback();
            });
        };
    }

    function initialize() {
        var keyboardHandler = new Kibo(window);

        keyboardHandler.down(['left'], runAllCallbacksFn(this.onLeft));
        keyboardHandler.down(['right'], runAllCallbacksFn(this.onRight));
        keyboardHandler.down(['up'], runAllCallbacksFn(this.onUp));
        keyboardHandler.down(['down'], runAllCallbacksFn(this.onDown));
    }
})(window);