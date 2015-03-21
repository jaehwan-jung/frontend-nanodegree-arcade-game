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
        initialize(this);
    };

    function runAllCallbacksFn(callbacks) {
        return function () {
            callbacks.forEach(function (callback) {
                callback();
            });
        };
    }

    function initialize(keyboardController) {
        var keyboardHandler = new global.Kibo(window);

        keyboardHandler.down(['left'], runAllCallbacksFn(keyboardController.onLeft));
        keyboardHandler.down(['right'], runAllCallbacksFn(keyboardController.onRight));
        keyboardHandler.down(['up'], runAllCallbacksFn(keyboardController.onUp));
        keyboardHandler.down(['down'], runAllCallbacksFn(keyboardController.onDown));
    }
})(window);