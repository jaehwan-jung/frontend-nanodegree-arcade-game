/* random.js
 * A utility class to generate random numbers
 */
(function (module) {
    'use strict';

    // Returns a random integer
    function getInteger(minInclusive, maxExclusive) {
        return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive;
    }

    module.Random = {
        getInteger: getInteger
    }

}(this));
