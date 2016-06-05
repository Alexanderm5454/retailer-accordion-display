(function(jq) {
    'use strict';

    /**
     * @author Alexander Markowski
     * @ngdoc function
     * @name retailerApp.controller:MainCtrl
     * @description
     * # MainCtrl
     * Controller of the retailerApp
     */
    var retailerApp = angular.module('retailerApp');

    retailerApp.value("itemsPerPage", 15);
    retailerApp.value("baseUrl", 'jewelry');

    retailerApp.factory("urlPath", ["$location", "baseUrl", "itemsPerPage", function ($location, baseUrl, itemsPerPage) {
        return {
            loadItemPage: function (item) {
                var index = item.index,
                    pageNumber = 0;

                if (index >= itemsPerPage) {
                    pageNumber = Math.ceil((index + 1) / itemsPerPage) - 1;
                    index = item.index - (itemsPerPage * pageNumber);
                }
                $location.path([baseUrl, pageNumber, item.category, item.slug, index].join("/"));
            }
        };

    }]);

    retailerApp.factory("selectedItem", function () {
        return {"data": {}};
    });


    retailerApp.factory("wishList", ["localStorageService", function (localStorageService) {
        var items = {};
        /* items.wishListArray is used to output wish listed items in the order they were selected */
        items.wishListArray = [];

        function _itemsFromLocalStorage() {
            if (localStorageService.get("wishListItems")) {
                items = localStorageService.get("wishListItems");
            }
        }

        return {
            addItem: function (wishListed) {
                /* Adds an item to wishListItems items under its corresponding category */
                if (typeof wishListed === "object" && wishListed.hasOwnProperty("id")) {
                    var id = wishListed.id,
                        category = wishListed.category;
                    _itemsFromLocalStorage();
                    if (!(category in items)) {
                        items[category] = {};
                    }
                    if (!(id in items[category])) {
                        items[category][id] = wishListed;
                        items.wishListArray.push(wishListed);
                        localStorageService.set("wishListItems", items);
                    }
                    console.log("items: ", items);
                } else {
                    console.error("addItem function parameter 'wishListed' must be an object");
                }
            },

            removeItem: function (unwishListed) {
                /* Removes an item from wishListItems and if its corresponding category
                 * is an empty object the category is removed as well */
                if (typeof unwishListed === "object" && unwishListed.hasOwnProperty("id")) {
                    _itemsFromLocalStorage();
                    var id = unwishListed.id,
                        category = unwishListed.category;
                    if (category in items) {
                        if (id in items[category]) {
                            delete items[category][id];
                            if (JSON.stringify(items[category]) === JSON.stringify({})) {
                                delete items[category];
                            }
                        }
                    }
                    var deleteIndex = -1;
                    for (var i = 0, len = items.wishListArray.length; i < len; i++) {
                        if (items.wishListArray[i].title === unwishListed.title) {
                            deleteIndex = i;
                            break;
                        }
                    }
                    if (deleteIndex !== -1) {
                        items.wishListArray.splice(deleteIndex, 1);
                    }
                    localStorageService.set("wishListItems", items);
                    console.log("items: ", items);
                }
            },

            getItems: function (category) {
                _itemsFromLocalStorage();
                return items[category] || {};
            },

            getArrayItems: function () {
                _itemsFromLocalStorage();
                return items.wishListArray || [];
            }
        };
    }]);

    retailerApp.factory("items", ['$http', "$location", "itemsPerPage", "baseUrl", function ($http, $location, itemsPerPage, baseUrl) {

        var allItems = {};

        /* Items associated with specific categories are
         * in files named as that category.
         * Array of category objects are placed in object
         * allItems as {'categoryName': 'arrayOfCategoryItems'}
         */
        function _getCategoryItems(category, callback) {
            var categoryFile = category + '.json';
            $http.get('/scripts/json/' + categoryFile).
                then(function (response) {
                    allItems[category] = response.data.items;
                    sessionStorage.setItem(category, JSON.stringify(allItems[category]));
                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                }, function (response) {
                    console.error('response: ', response);
                });
        }

        return {
            currentCategory: "",
            currentSubCategory: "",
            categories: [],
            infoList: {items: []},
            itemsPerPage: itemsPerPage,
            pageNumber: 0,
            numberOfPages: 1,

            init: function (callback) {
                /* On a new session we make an ajax call for the top level categories
                 *  if it's a continuation of a session top level categories are retrieved from sessionStorage */
                if (!sessionStorage.getItem("categories")) {
                    var self = this;
                    $http.get('/scripts/json/categories.json').
                        then(function (response) {
                            self.categories = response.data.categories;
                            /* categories is an array; it is saved as a string in sessionStorage */
                            sessionStorage.setItem("categories", self.categories);
                            if (callback && typeof callback === 'function') {
                                callback();
                            }
                        }, function (response) {
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

            /* Gets the category from $location.path(), checks if category from
             * $location.path() matches a category in categories from the ajax call or sessionStorage,
             * then the items to be displayed are set to this.infoList.items  */
            setItems: function (categories, callback) {
                this.categories = categories;
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
                    var display = function () {
                        self.infoList.items.length = 0;
                        var sliceFrom,
                            sliceTo,
                            pathPageNumber = parseInt(path[2], 10),
                            currentItems = allItems[self.currentCategory];

                        if (path.length === 5) {
                            var tempItems = [];
                            self.currentSubCategory = path[4];
                            for (var m = 0, len_m = currentItems.length; m < len_m; m++) {
                                if (currentItems[m].sub_categories) {
                                    for (var n = 0, len_n = currentItems[m].sub_categories.length; n < len_n; n++) {
                                        if (currentItems[m].sub_categories[n] === self.currentSubCategory) {
                                            tempItems.push(currentItems[m]);
                                        }
                                    }
                                }
                            }
                            currentItems = tempItems;
                        } else {
                            self.currentSubCategory = '';
                        }

                        self.numberOfPages = Math.ceil(currentItems.length / self.itemsPerPage);

                        for (var j = 0, len_j = self.numberOfPages; j < len_j; j++) {
                            if (pathPageNumber === j) {
                                self.pageNumber = j;
                                break;
                            }
                        }
                        sliceFrom = self.pageNumber * self.itemsPerPage;
                        sliceTo = sliceFrom + self.itemsPerPage;
                        self.infoList.items = currentItems.slice(sliceFrom, sliceTo);
                        if (callback && typeof callback === 'function') {
                            callback();
                        }
                    };
                    if (sessionStorage.getItem(this.currentCategory)) {
                        allItems[this.currentCategory] = JSON.parse(sessionStorage.getItem(this.currentCategory));
                        display();
                    } else {
                        if (this.currentCategory === '') {
                            $location.path([baseUrl, this.categories[0]].join("/"));
                        }
                        _getCategoryItems(this.currentCategory, display);
                    }
                }
            }

        };

    }]);


    retailerApp.controller('MainCtrl', ['$scope', '$http', '$timeout', '$location', 'localStorageService', "categoryData", "items", "wishList", "baseUrl",
        function ($scope, $http, $timeout, $location, localStorageService, categoryData, items, wishList, baseUrl) {
            //  $scope.categories = [];
            $scope.subCategories = [];
            $scope.currentCategory = '';
            $scope.currentSubCategory = '';
            $scope.infoList = {
                items: []
            };
            $scope.pageNumber = 0;
            $scope.numberOfPages = 1;
            $scope.showPageNumbers = false;


            items.setItems(categoryData.categories, function () {
                $scope.infoList.items = items.infoList.items;
                $scope.pageNumber = items.pageNumber;
                $scope.numberOfPages = items.numberOfPages;
            });
            $scope.currentCategory = items.currentCategory;
            $scope.currentSubCategory = items.currentSubCategory;
            $scope.subCategories = categoryData.categoriesAndSubs[$scope.currentCategory];


            var wishListItems = wishList.getItems(items.currentCategory);
            $scope.inWishList = function (id) {
                return id in wishListItems;
            };

            /* Sets the category to be displayed */
            $scope.setCategory = function (category) {
                $scope.pageNumber = 0;
                $location.path([baseUrl, $scope.pageNumber, category].join("/"));
                jq("body, html").animate({scrollTop: 0}, 0);
            };

            $scope.setSubCategory = function (subCategory) {
                $location.path([baseUrl, 0, $scope.currentCategory, subCategory].join("/"));
            };


            $scope.pageNav = function (direction) {
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
                    $location.path([baseUrl, $scope.pageNumber, $scope.currentCategory].join("/"));
                    jq("body, html").animate({scrollTop: 0}, 0);
                }
            };


            $scope.numberOfPagesDisplay = function () {
                $scope.showPageNumbers = $scope.numberOfPages > 1;
                return new Array($scope.numberOfPages);
            };

            $scope.setPageNumber = function (number) {
                $scope.pageNumber = number;
                $location.path([baseUrl, $scope.pageNumber, $scope.currentCategory].join("/"));
                jq("body, html").animate({scrollTop: 0}, 0);
            };


            /* Sorts only items currently in infoList.items, i.e. what is currently in view */
            $scope.sortItemsByPrice = function (order) {
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

    /* Creates an item to be displayed on a category page */
    retailerApp.directive("grid", ["selectedItem", "wishList", "urlPath", function (selectedItem, wishList, urlPath) {
        return {
            restrict: 'E',
            templateUrl: "views/grid.html",
            link: function (scope, element) {
                var $wishListIcon = jq(element.find(".wishListIcon")[0]);
                var tooltipOptions = {
                    'delay': {"show": 400, "hide": 100},
                    'title': "Add to Wish List"
                };

                /* Displays add the add/remove to/from wish list icon and determines which tooltip to display */
                element.on("mouseover", function () {
                    var wishListIcon = element.find(".wishListIcon")[0];
                    wishListIcon.style.visibility = "visible";
                    if ($wishListIcon.hasClass("wishListIconSelected")) {
                        tooltipOptions.title = "Remove from Wish List";
                    }
                    $wishListIcon.attr("data-toggle", "tooltip").tooltip(tooltipOptions);
                }).on("mouseout", function () {
                    if (element.find(".wishListIconNotSelected")[0]) {
                        element.find(".wishListIconNotSelected")[0].style.visibility = "hidden";
                    }
                });

                /* Adds/removes the item from the wish list and updates the add/remove to/from icon accordingly */
                $wishListIcon.on("click", function (e) {
                    e.stopPropagation();
                    var index = +jq(element.children()[0]).context.id;

                    if (jq(this).hasClass("wishListIconNotSelected")) {
                        var wishListed = scope.infoList.items[index];
                        wishList.addItem(wishListed);
                        jq(this).addClass("wishListIconSelected").removeClass("wishListIconNotSelected");
                        tooltipOptions.title = "Remove from Wish List";
                    }
                    else if (jq(this).hasClass("wishListIconSelected")) {
                        var unwishListed = scope.infoList.items[index];
                        wishList.removeItem(unwishListed);
                        jq(this).removeClass("wishListIconSelected").addClass("wishListIconNotSelected");
                        tooltipOptions.title = "Add to Wish List";
                    }
                    jq(this).tooltip("hide")
                        .attr("data-original-title", tooltipOptions.title)
                        .tooltip("fixTitle")
                        .tooltip(tooltipOptions);
                });

                /* Sets the page to the full page view of the item */
                element.on("click", function (e) {
                    e.stopPropagation();
                    scope.index = +jq(element.children()[0]).context.id;
                    selectedItem.data = scope.infoList.items[scope.index];
                    urlPath.loadItemPage(selectedItem.data);
                    scope.$apply();
                });

            }
        };
    }]);


    /* Capitalizes the first letter of a string that is passed through the filter */
    retailerApp.filter('firstLetterCaps', function () {
        return function (word) {
            if (word) {
                var firstLetterCaps = word.charAt(0).toUpperCase(),
                    minusFirstLetter = word.slice(1, word.length);
                return firstLetterCaps + minusFirstLetter;
            }
        };
    });

}(jQuery));