'use strict';

/**
 * @ngdoc function
 * @name retailerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the retailerApp
 */
var retailerApp = angular.module('retailerApp');

retailerApp.controller('MainCtrl', ['$scope', '$http', '$timeout', '$location', '$route', 'localStorageService',
    function($scope, $http, $timeout, $location, $route, localStorageService) {
    var vm = this;
    vm.categories = [];
    $scope.currentCategory = '';
    $scope.currentItem = "";
    $scope.categoryHolder = '';
    $scope.allItems = {};
    $scope.infoList = {
         items: []
     };
    $scope.holderInfoList = [];
    $scope.searchTerms = '';
    $scope.compareItems = [];
    $scope.holderCompareItems = [];
    $scope.cartItems = [];
    $scope.cartItemsLength = $scope.cartItems.length;
    $scope.compareItemsLength = $scope.compareItems.length;
    $scope.grandTotal = 0;

    /* Sets the category to be displayed */
    vm.setCategory = function(category) {
        $location.path(category);
        /*
        $('.collapsibleDisplay').fadeOut(100);
        $('.shoppingCartDisplay').hide();
        $('.compareDisplay').hide();
        $('.sortItems').show();

        function display(delay) {
            if (!delay) {
                delay = 150;
            }
            $timeout(function() {
                $scope.currentCategory = category;
                $scope.infoList.items = $scope.allItems[category].slice();
                $timeout(function() {
                    $('.collapsibleDisplay').fadeIn("fast");
                //    $location.path($scope.currentCategory);
                }, 100);
            }, delay);
        }

        if ($scope.allItems[category]) {
            display(150);
        } else {
            getCategoryItems(category, display, 150);
        }
        */
    };

    /* Retrieve the category names, e.g. earrings, rings, and put them
     * into categories array */
    (function() {
        $http.get('/scripts/json/categories.json').
            then(function(response) {
                console.log("GOT DATA");
                vm.categories = response.data.categories;

                /* Initialize category to first category in array */

                if ($location.path()) {
                    // TODO make sure hash and category name are normalized in some way
                    $scope.currentCategory = $location.path().slice(1, $location.path().length);

                //    getCategoryItems($location.path());
                    //vm.setCategory($location.path());
                    $(".collapsibleDisplay").hide();
                    /*
                    $('.collapsibleDisplay').fadeOut(100);
                    $('.shoppingCartDisplay').hide();
                    $('.compareDisplay').hide();
                    $('.sortItems').show();
                    */
                    var display = function(delay) {
                        if (!delay) {
                            delay = 150;
                        }
                        $timeout(function() {
                            $scope.infoList.items = $scope.allItems[$scope.currentCategory].slice();
                            $timeout(function() {
                                $('.collapsibleDisplay').fadeIn("fast");
                            //    $location.path($scope.currentCategory);
                            }, 100);
                        }, delay);
                    };

                    if ($scope.allItems[$scope.currentCategory]) {
                        display(150);
                    } else {
                        getCategoryItems($scope.currentCategory, display, 150);
                    }
                } else {

                    if ($scope.currentCategory === '') {
                      //  getCategoryItems(vm.categories[0]);
                      vm.setCategory(vm.categories[0]);
                    }
                }
                localStorageService.set("categories", vm.categories);
            }, function (response) {
                console.error('response: ', response);
            }
        );
    }());



    /* Items associated with specific categories are in files named as that category.
     * Array of category objects are placed in object allItems as {'categoryName': 'arrayOfCategoryItems'} */
    function getCategoryItems(category, callback, delay) {
        console.log("Got category items");
        var categoryFile = category + '.json';
        $http.get('/scripts/json/' + categoryFile).
            then(function(response) {
                $scope.allItems[category] = response.data.items;
                localStorageService.set("categoryItems", $scope.allItems);
                if (callback) {
                    callback(delay);
                }
            }, function(response) {
                console.error('response: ', response);
            });
    }


    /* Loop through all text properties of all items looking for an exact regex match to searchTerms.
     * If no exact match is found loop though title and and description with each
     * individual word in in searchTerms */
    $scope.searchItems = function() {
        if ($scope.categoryHolder) {
            $scope.currentCategory = $scope.categoryHolder;
        }
        if ($scope.searchTerms.length > 1 && $scope.searchTerms !== '') {
            var searchTerms = $scope.searchTerms.trim(),
                exactTerms = new RegExp(searchTerms, 'i'),
                ws = /[\s]+/,
                words = [],
                infoListObj;
            if ($scope.holderInfoList.length === 0) {
                for (var c = 0, len_c = vm.categories.length; c < len_c; c++) {
                    var tempItems = $scope.allItems[vm.categories[c]];
                    $scope.holderInfoList = $scope.holderInfoList.concat(tempItems);
                }
            }


            words = searchTerms.split(ws);
            $scope.infoList.items.length = 0;
            for (var i = 0, len = $scope.holderInfoList.length; i < len; i++) {
                infoListObj = $scope.holderInfoList[i];
                for (var prop in infoListObj) {
                    if (infoListObj.hasOwnProperty(prop) && prop !== 'image' && prop !== 'imageThumb' && prop !== 'id' && prop !== '$$hashKey') {
                        if (exactTerms.test(infoListObj[prop]) && searchTerms.length > 3) {
                            $scope.infoList.items.push(infoListObj);
                            break;
                        }
                    }
                }
            }
            if ($scope.infoList.items.length === 0) {
                for (var j = 0, len_j = $scope.holderInfoList.length; j < len_j; j++) {
                    infoListObj = $scope.holderInfoList[i];
                    for (var prop_j in infoListObj) {
                        if (infoListObj.hasOwnProperty(prop_j) && prop_j !== 'image' && prop_j !== 'imageThumb'  && prop_j !== 'id' && prop_j !== '$$hashKey' && prop_j !== 'content') {
                            for (var n = 0, len_n = words.length; n < len_n; n++) {
                                var word = new RegExp(words[n], 'i');
                                if (word.test(infoListObj[prop_j])) {
                                    $scope.infoList.items.push(infoListObj);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            $scope.categoryHolder = $scope.currentCategory;
            $scope.currentCategory = 'Search Results: ' + searchTerms;
        }
    };

    $scope.$watch('searchTerms.length', function() {
        if ($scope.searchTerms.length === 0 && $scope.holderInfoList.length > 0) {
            $scope.infoList.items.length = 0;
            vm.setCategory($scope.categoryHolder);
        }
    });

    $scope.$watch('compareItems.length', function() {
       $scope.compareItemsLength = $scope.compareItems.length;
    });

    $scope.$watch('cartItems.length', function() {
       $scope.cartItemsLength = $scope.cartItems.length;
    });

    /* Add an item to the shopping cart and update grandTotal*/
    $scope.addToCart = function(item) {
        item.inCart = true;
        var inArray = false;
        for (var i = 0, len=$scope.cartItems.length; i<len; i++) {
            if (item.id === $scope.cartItems[i].id) {
                inArray = true;
            }
        }
        if (inArray === false) {
            $scope.grandTotal += item.price;
            $scope.cartItems.push(item);
        }
    };

    /* Remove item from the shopping cart and update grandTotal  */
    $scope.removeFromCart = function(item) {
        for (var i = 0, len=$scope.cartItems.length; i<len; i++) {
            if (item === $scope.cartItems[i]) {
                $scope.grandTotal -= item.price;
                $scope.cartItems.splice(i, 1);
                item.inCart = false;
            }
        }
    };


    /* Add an item to be compared */
    $scope.addCompare = function(item) {
        var inArray = false;
        for (var i = 0, len=$scope.compareItems.length; i<len; i++) {
            if (item.id === $scope.compareItems[i].id) {
                inArray = true;
            }
        }
        if (inArray === false) {
            $scope.compareItems.push(item);
        }
    };

    /* Remove Item from compareItems and update compare view accordingly */
    $scope.removeCompare = function(item) {
        var compareElements = $('.compareDisplay li'),
            compareWidth = $(compareElements[0]).width(),
            compareIndex;
        for (var i = 0, len=$scope.compareItems.length; i<len; i++) {
            if (item === $scope.compareItems[i]) {
                compareIndex = i;
                $(compareElements[compareIndex]).hide();
                $scope.compareItems.splice(compareIndex, 1);
                break;
            }
        }
        if (typeof compareIndex !== 'undefined') {
            var key = 0;
            angular.forEach(compareElements, function(element) {
                if (element !== compareElements[compareIndex]) {
                    var left = key * (compareWidth + 25);
                    $(element).css({'left': left + 'px'});
                    key++;
                }
            });
        }
    };

    /* jQuery in used to manipulate/animate the view to simplify controller logic
      * and to reduce the number of directives in the markup */
    $scope.switchView = function(view) {
        if (view === 'compare') {
            if ($scope.compareItems.length > 0) {
                $('.collapsibleDisplay').hide();
                $('.shoppingCartDisplay').hide();
                $('.sortItems').hide();
                $('.compareDisplay').show();
                $('.showItems').show();
                $('body, html').animate({'scrollTop': 0}, 0);
            }
        }
        else if (view === 'cart') {
            $('.compareDisplay').hide();
            $('.collapsibleDisplay').hide();
            $('.shoppingCartDisplay').show();
            $('.sortItems').hide();
            $('.showItems').show();
            $('body, html').animate({'scrollTop': 0}, 0);
        }
    };

    /* Sorts only items currently in infoList.items, i.e. what is currently in view */
    $scope.sortItemsByPrice = function(order) {
        $('.collapsibleDisplay').fadeOut();
        $timeout(function() {
            $scope.infoList.items.sort(function (a, b) {
                var high, low;
                if (order === 'high') {
                    high = b;
                    low = a;
                } else {
                    high = a;
                    low = b;
                }
                if (high.price > low.price) {
                    return 1;
                } else {
                    return -1;
                }
            });
            $('.collapsibleDisplay').fadeIn();
        }, 400);
    };

}]);

retailerApp.directive("scroll", function($window, $document) {
   return function(scope, element, attrs) {
       var body = $("body"),
           collapsibleDisplay = $(".collapsibleDisplay"),
           collapsibleDisplayHeight = 0;

       angular.element($window).bind("scroll", function() {

           if (this.pageYOffset + collapsibleDisplayHeight >= this.innerHeight) {
               console.log("Bottom Reached");
               collapsibleDisplayHeight = 0;
               var numberOfItems = scope.infoList.items.length;
               console.log("numberOfItems: ", numberOfItems);
               scope.infoList.items = scope.allItems[scope.currentCategory].slice(0, numberOfItems + 2);
               scope.$apply();
               //collapsibleDisplayHeight = collapsibleDisplay.height();
           } else {
               collapsibleDisplayHeight = collapsibleDisplay.height();
           }
       });
   }
});

/* This directive is responsible for creating the view of each item and uses jQuery
 * to manipulate the its presentation */
retailerApp.directive('collapsible', ['$window', "$location", function($window, $location){
    return {
        restrict: 'E',
        templateUrl: 'views/collapsible.html',
        link: function(scope, element) {
            var item = $(element.children()[0]),
                header = item.find('.collapsibleHeader'),
                imgThumb = item.find('.collapsibleImgSmall'),
                imgLarge = item.find('.collapsibleImgLarge'),
                content = item.find('.content');


            function expand() {
                var title = item.find(".collapsibleTitle").text();
                scope.currentItem = title;
                $location.hash(scope.currentItem);
                console.log("scope.currentItem: ", scope.currentItem);
                var windowHeight = $window.outerHeight,
                    scrollTo = header.offset().top;

                imgLarge.attr('src', imgThumb.attr('src').replace('thumb_', ''));
                imgThumb.fadeOut();
                $('body, html').animate({scrollTop:scrollTo});
                imgLarge.animate({opacity:1}, 800);
                item.addClass('expand').css({'height':windowHeight});

                imgLarge.on('click', zoomIn);
                header.off('click', expand);
                header.on('click', collapse);
            }

            function collapse() {
                scope.currentItem = "";
                item.removeClass('expand').css({'height':'75px', 'transition':'.8s'});
                imgLarge.animate({'opacity':0}, 320);
                imgThumb.delay(200).fadeIn();
                if (imgLarge.hasClass('zoom')) {
                   zoomOut();
                }
                header.on('click', expand);
                header.off('click', collapse);
                imgLarge.on('click', expand);
            }

            function zoomIn() {
                imgLarge.addClass('zoom');
                content.fadeOut();
                imgLarge.css({'marginLeft': '12%'});
                imgLarge.off('click', zoomIn);
                imgLarge.on('click', zoomOut);
            }

            function zoomOut() {
                imgLarge.css({'marginLeft': 0});
                imgLarge.removeClass('zoom').css({'transition':'.5s'});
                content.fadeIn();
                imgLarge.off('click', zoomOut);
                imgLarge.on('click', zoomIn);
            }

            header.on('click', expand);
            imgThumb.on('click', expand);

        }
    };
}]);


/* This directive is responsible for creating an item to be compared */
retailerApp.directive('compareItem', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/compareItem.html',
        link: function(scope, element) {
            var listItem = element.parent(),
                compareWidth = listItem.width() + 25,
                leftPos = 0;

            for (var i = 0, len=scope.compareItems.length; i<len; i++) {
                leftPos = i * compareWidth;
            }
            $(listItem).css({'left': leftPos});
        }
    };
});


/* This directive is responsible for creating a cartItem, i.e. an item in the shopping cart */
retailerApp.directive('cartItem', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/cartItem.html'
    };
});


/* Capitalizes the first letter of a string that is passed through the filter */
retailerApp.filter('firstLetterCaps', function(){
   return function(word) {
       if (word) {
           var firstLetterCaps = word[0].toUpperCase(),
               minusFirstLetter = word.slice(1, word.length);
           return firstLetterCaps + minusFirstLetter;
       }
   };
});

