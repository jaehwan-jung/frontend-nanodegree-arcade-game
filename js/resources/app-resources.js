/* app-resources.js
 * Represents a collections of all images
 */
(function (module) {
    'use strict';

    var imageFolder = 'images/';

    module.AppResources = {
        block: {
            grass: imageFolder + 'grass-block.png',
            stone: imageFolder + 'stone-block.png',
            water: imageFolder + 'water-block.png',
            selector: imageFolder + 'Selector.png'
        },
        item: {
            heart: imageFolder + 'Heart.png',
            gemOrange: imageFolder + 'Gem Orange.png',
            gemBlue: imageFolder + 'Gem Blue.png',
            gemGreen: imageFolder + 'Gem Green.png',
            key: imageFolder + 'Key.png',
            rock: imageFolder + 'Rock.png',
            star: imageFolder + 'Star.png'
        },
        enemy: {
            bug: imageFolder + 'enemy-bug.png'
        },
        player: {
            boy: imageFolder + 'char-boy.png',
            catGirl: imageFolder + 'char-cat-girl.png',
            hornGirl: imageFolder + 'char-horn-girl.png',
            pinkGirl: imageFolder + 'char-pink-girl.png',
            princess: imageFolder + 'char-princess-girl.png'
        },
        buttons: {
            start: imageFolder + 'start-button.png',
            stop: imageFolder + 'stop-button.png',
            restart: imageFolder + 'restart-button.png'
        }
    };
})(this);