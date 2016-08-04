(function() {
    'use strict';

    /* Capitalizes the first letter of a string that is passed through the filter */

    var retailerApp = angular.module("retailerApp");

    retailerApp.filter("firstLetterCaps", firstLetterCaps);

    function firstLetterCaps() {
        return function (word) {
            if (word) {
                var wordsArray = word.split(/[\s]+/),
                    firstLetterCaps = "",
                    minusFirstLetter = "";
                if (wordsArray.length === 1) {
                    firstLetterCaps = word.charAt(0).toUpperCase();
                    minusFirstLetter = word.slice(1, word.length);
                    return firstLetterCaps + minusFirstLetter;
                } else if (wordsArray.length > 1) {
                    var words = wordsArray.map(function (wordInArray) {
                        firstLetterCaps = wordInArray.charAt(0).toUpperCase();
                        minusFirstLetter = wordInArray.slice(1, wordInArray.length);
                        return firstLetterCaps + minusFirstLetter;
                    });
                    return words.join(" ");
                }

            }
        };
    }

}());