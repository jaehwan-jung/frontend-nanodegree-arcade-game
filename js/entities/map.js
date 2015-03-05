/* map.js
 * This class represents the map on which all NPCs and the player are moved
 */
(function (global) {
    'use strict';

    global.Map = function (canvas) {
        this.canvas = canvas;
        this.dimension = {
            width: canvas.width,
            height: canvas.height * 0.8
        };
    };

    function getUnitSize(length, count) {
        return length / count;
    }

    /* Sets the map using a 2-D array (N x M) of images
     * Parses the given matrix to get the row and column counts
     * and the size of each block
     */
    global.Map.prototype.setMap = function (matrix) {
        this.matrix = matrix;
        this.dimension.columnCount = matrix.length;
        this.dimension.rowCount = matrix[0].length;
        this.dimension.blockSize = {
            width: getUnitSize(this.dimension.width, this.dimension.columnCount),
            height: getUnitSize(this.dimension.height, this.dimension.rowCount) * 0.8
        };
    };

    /* Returns the block located at the position represented by column and row
     * The block contains an image and its position relative to the canvas's origin
     */
    global.Map.prototype.getBlockByColumnRow = function (column, row) {
        return {
            image: this.matrix[row][column],
            origin: {
                x: column * this.dimension.blockSize.width,
                y: row * this.dimension.blockSize.height
            }
        }
    };

    // Renders the map
    global.Map.prototype.render = function () {
        var context = this.canvas.getContext('2d');
        for (var row = 0; row < this.dimension.rowCount; row++) {
            for (var col = 0; col < this.dimension.columnCount; col++) {
                var blockImage = this.matrix[row][col];
                var blockWidth = this.dimension.blockSize.width;
                var blockHeight = this.dimension.blockSize.height;
                context.drawImage(blockImage, col * blockWidth, row * blockHeight, blockWidth, blockHeight * 2);
            }
        }
    };

})(this);