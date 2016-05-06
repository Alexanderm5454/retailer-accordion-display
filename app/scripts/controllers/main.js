'use strict';

/**
 * @ngdoc function
 * @name retailerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the retailerApp
 */
var retailerApp = angular.module('retailerApp');


retailerApp.factory("selectedItem", function() {
    return {"data": {}};
});

retailerApp.factory("urlPath", ["$location", function($location) {

    return {

    };
}]);


retailerApp.factory("wishList", ["localStorageService", function(localStorageService) {
    var items = {};

    function _itemsFromLocalStorage() {
        if (localStorageService.get("wishListItems")) {
            items = localStorageService.get("wishListItems");
        }
    }

    return {
       addItem: function(wishListed, category) {
           /* Adds an item to wishListItems items under its corresponding category */
           if (typeof wishListed === "object" && wishListed.hasOwnProperty("id")) {
               var id = wishListed.id;
               _itemsFromLocalStorage();
               if (!(category in items)) {
                   items[category] = {};
               }
               if (!(id in items[category])) {
                   items[category][id] = wishListed;
                   localStorageService.set("wishListItems", items);
               }
               console.log("items: ", items);
           } else {
               console.error("addItem function parameter 'wishListed' must be an object");
           }
       },

       removeItem: function(unwishListed, category) {
           /* Removes an item from wishListItems and if its corresponding category
            * is an empty object the category is removed as well */
           if (typeof unwishListed === "object" && unwishListed.hasOwnProperty("id")) {
               _itemsFromLocalStorage();
               var id = unwishListed.id;
               if (category in items) {
                   if (id in items[category]) {
                       delete items[category][id];
                       if (JSON.stringify(items[category]) === JSON.stringify({})) {
                           delete items[category];
                       }
                   }
               } else if (!category){
                   for (var cat in items) {
                       if (items.hasOwnProperty(cat)) {
                           if (id in items[cat]) {
                               delete items[cat][id];
                               if (JSON.stringify(items[cat]) === JSON.stringify({})) {
                                   delete items[cat];
                               }
                               break;
                           }
                       }
                   }
               }
               localStorageService.set("wishListItems", items);
               console.log("items: ", items);
           }
       },

       getItems: function(category) {
           _itemsFromLocalStorage();
           return items[category] || {};
       }
   };
}]);

retailerApp.factory("items", ['$http', "$location", function($http, $location) {

    var allItems = {};

    /* Items associated with specific categories are
     * in files named as that category.
     * Array of category objects are placed in object
     * allItems as {'categoryName': 'arrayOfCategoryItems'} */
    function _getCategoryItems(category, callback) {
        console.log("Got category items");
        var categoryFile = category + '.json';
        $http.get('/scripts/json/' + categoryFile).
            then(function(response) {
                allItems[category] = response.data.items;
                sessionStorage.setItem(category, JSON.stringify(allItems[category]));
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }, function(response) {
                console.error('response: ', response);
            });
    }

    return {
        currentCategory: "",
        categories: [],
        infoList: {items: []},
        itemsPerPage: 15,
        pageNumber: 0,
        numberOfPages: 1,

        init: function(callback) {
            /* On a new session we make an ajax call for the top level categories
            *  if it's a continuation of a session top level categories are retrieved from sessionStorage */
            if (!sessionStorage.getItem("categories")) {
                var self = this;
                $http.get('/scripts/json/categories.json').
                    then(function(response) {
                        console.log("GOT DATA");
                        self.categories = response.data.categories;
                        /* categories is an array; it is saved as a string in sessionStorage */
                        sessionStorage.setItem("categories", self.categories);
                        if (callback && typeof callback === 'function') {
                            callback();
                        }
                    }, function(response) {
                        console.error('response: ', response);
                    }
                );
            } else {
                /* sessionStorage stores data a string so its data must be converted to an array */
                this.categories = sessionStorage.getItem("categories").split(",");
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
        },

        setItems: function(callback) {
            if ($location.path()) {
                var path = $location.path().split("/"),
                    categoryPath = path[3];
                for (var i = 0, len = this.categories.length; i < len; i++) {
                    if (categoryPath === this.categories[i]) {
                        this.currentCategory = this.categories[i];
                        break;
                    }
                }
                var self = this;
                var display = function() {
                    self.infoList.items.length = 0;
                    var sliceFrom = 0,
                        sliceTo = self.itemsPerPage,
                        pathPageNumber = parseInt(path[2], 10);

                    self.numberOfPages = Math.ceil(allItems[self.currentCategory].length / self.itemsPerPage);

                    for (var j = 0, len_j = self.numberOfPages; j < len_j; j++) {
                        if (pathPageNumber === j) {
                            self.pageNumber = j;
                            break;
                        }
                    }
                    sliceFrom = self.pageNumber * self.itemsPerPage;
                    sliceTo = sliceFrom + self.itemsPerPage;
                    self.infoList.items = allItems[self.currentCategory].slice(sliceFrom, sliceTo);
                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                };
                if (sessionStorage.getItem(this.currentCategory)) {
                    allItems[this.currentCategory] = JSON.parse(sessionStorage.getItem(this.currentCategory));
                    display();
                } else {
                    if (this.currentCategory === '') {
                        $location.path("jewelry/" + this.categories[0]);
                    }
                    _getCategoryItems(this.currentCategory, display);
                }
            }
        }

    }

}]);


retailerApp.controller('MainCtrl', ['$scope', '$http', '$timeout', '$location', 'localStorageService', "items", "wishList",
    function($scope, $http, $timeout, $location, localStorageService, items, wishList) {
    var vm = this;
    vm.categories = [];
    $scope.currentCategory = '';
    /*
    $scope.currentItem = "";
    $scope.categoryHolder = '';
    $scope.allItems = {};
    */
        $scope.infoList = {
         items: []
     };
    /*
    $scope.holderInfoList = [];
    $scope.searchTerms = '';
    $scope.compareItems = [];
    $scope.holderCompareItems = [];
    $scope.cartItems = [];
    $scope.cartItemsLength = $scope.cartItems.length;
    $scope.compareItemsLength = $scope.compareItems.length;
    $scope.grandTotal = 0;
    */
    $scope.pageNumber = 0;
    $scope.numberOfPages = 1;
    $scope.showPageNumbers = false;



    items.init(function() {
       vm.categories = items.categories;
       items.setItems(function() {
            $scope.infoList.items = items.infoList.items;
            $scope.pageNumber = items.pageNumber;
            $scope.numberOfPages = items.numberOfPages;
        });
        $scope.currentCategory = items.currentCategory;
    });

    var wishListItems = wishList.getItems(items.currentCategory);
    $scope.inWishList = function(id) {
        return id in wishListItems;
    };

    /* Sets the category to be displayed */
    $scope.setCategory = function(category) {
        $scope.pageNumber = 0;
        $location.path("jewelry/" + $scope.pageNumber + "/" + category);
        $("body, html").animate({scrollTop: 0}, 0);
    };


    $scope.pageNav = function(direction) {
        var pageNumberChange = false;
        if (direction === "next" && $scope.pageNumber < $scope.numberOfPages - 1) {
            $scope.pageNumber++;
            pageNumberChange = true;
        }
        else if (direction === "previous" && $scope.pageNumber > 0) {
            $scope.pageNumber--;
            pageNumberChange = true;
        }
        if (pageNumberChange === true) {
            $location.path("jewelry/" + $scope.pageNumber + "/" + $scope.currentCategory);
            $("body, html").animate({scrollTop: 0}, 0);
        }
    };


    $scope.numberOfPagesDisplay = function() {
        $scope.showPageNumbers = $scope.numberOfPages > 1;
        return new Array($scope.numberOfPages);
    };

    $scope.setPageNumber = function(number) {
        $scope.pageNumber = number;
        $location.path("jewelry/" + $scope.pageNumber + "/" + $scope.currentCategory);
        $("body, html").animate({scrollTop: 0}, 0);
    };

    /* Loop through all text properties of all items looking for an exact regex match to searchTerms.
     * If no exact match is found loop though title and and description with each
     * individual word in in searchTerms */
     /*
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
    */

    /* Add an item to the shopping cart and update grandTotal*/
    /*
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
    */
    /* Remove item from the shopping cart and update grandTotal  */
    /*
    $scope.removeFromCart = function(item) {
        for (var i = 0, len=$scope.cartItems.length; i<len; i++) {
            if (item === $scope.cartItems[i]) {
                $scope.grandTotal -= item.price;
                $scope.cartItems.splice(i, 1);
                item.inCart = false;
            }
        }
    };
    */

    /* Add an item to be compared */
    /*
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
    */
    /* Remove Item from compareItems and update compare view accordingly */
    /*
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
    */
    /* jQuery in used to manipulate/animate the view to simplify controller logic
      * and to reduce the number of directives in the markup */

      /*
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
    */

    /* Sorts only items currently in infoList.items, i.e. what is currently in view */
    $scope.sortItemsByPrice = function(order) {
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


retailerApp.directive("grid", ["selectedItem", "wishList", "$location", function(selectedItem, wishList, $location) {
    return {
        restrict: 'E',
        templateUrl: "views/grid.html",
        link: function(scope, element) {
            var $wishListIcon = $(element.find(".wishListIcon")[0]);
            var tooltipOptions = {
                'delay': {"show": 400, "hide": 100},
                'title': "Add to Wish List"
            };


            element.on("mouseover", function () {
                var wishListIcon = element.find(".wishListIcon")[0];
                wishListIcon.style.visibility = "visible";
                if ($wishListIcon.hasClass("wishListIconSelected")) {
                    tooltipOptions.title = "Remove from Wish List";
                }
                $wishListIcon.attr("data-toggle","tooltip").tooltip(tooltipOptions);
            }).on("mouseout", function () {
                if (element.find(".wishListIconNotSelected")[0]) {
                    element.find(".wishListIconNotSelected")[0].style.visibility = "hidden";
                }
            });


            $wishListIcon.on("click", function(e) {
                e.stopPropagation();
              //  console.log("scope.currentCategory: ", scope.currentCategory);
                var index = +$(element.children()[0]).context.id;

                if ($(this).hasClass("wishListIconNotSelected")) {
                    var wishListed = scope.infoList.items[index];
                    wishList.addItem(wishListed, scope.currentCategory);
                    $(this).addClass("wishListIconSelected").removeClass("wishListIconNotSelected");
                    tooltipOptions.title = "Remove from Wish List";
                }
                else if ($(this).hasClass("wishListIconSelected")) {
                    var unwishListed = scope.infoList.items[index];
                    wishList.removeItem(unwishListed, scope.currentCategory);
                    $(this).removeClass("wishListIconSelected").addClass("wishListIconNotSelected");
                    tooltipOptions.title = "Add to Wish List";
                }
                $(this).tooltip("hide")
                    .attr("data-original-title", tooltipOptions.title)
                    .tooltip("fixTitle")
                    .tooltip(tooltipOptions);
              //  console.log("wishList.getItems: ", wishList.getItems(scope.currentCategory));
            });

            element.on("click", function(e) {
                e.stopPropagation();
                scope.index = +$(element.children()[0]).context.id;
                selectedItem.data = scope.infoList.items[scope.index];
                scope.itemPath = selectedItem.data.title.toLowerCase().split(/[\s]+/).join("-");
                $location.path("jewelry/" + scope.pageNumber + "/" + scope.currentCategory + "/" + scope.itemPath + "/" + scope.index);
                scope.$apply();
            });

        }
    };
}]);

/* This directive is responsible for creating the view of each item and uses jQuery
 * to manipulate the its presentation */
retailerApp.directive('collapsible', ['$window', function($window) {
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
           var firstLetterCaps = word.charAt(0).toUpperCase(),
               minusFirstLetter = word.slice(1, word.length);
           return firstLetterCaps + minusFirstLetter;
       }
   };
});

