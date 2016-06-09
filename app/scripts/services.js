(function(jq) {
    'use strict';

    var retailerApp = angular
    .module('retailerApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'LocalStorageModule'
    ]);

    retailerApp.value("itemsPerPage", 15);
    retailerApp.value("baseUrl", 'jewelry');

    retailerApp.factory("urlPath", ["$location", "baseUrl", "itemsPerPage", function ($location, baseUrl, itemsPerPage) {
        return {
            loadItemPage: function(item) {
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

    retailerApp.factory("categoryData", [function () {
        return {categories: [], categoriesAndSubs: {}};
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

            removeItem: function(unwishListed) {
                /* Removes an item from wishListItems and if its corresponding category
                 * is an empty object the category is removed as well */
                if (typeof unwishListed === "object" && unwishListed.hasOwnProperty("id")) {
                    _itemsFromLocalStorage();
                    var id = unwishListed.id,
                        category = unwishListed.category;
                    if (category in items) {
                        if (id in items[category]) {
                            delete items[category][id];
                            if (angular.equals(items[category], {})) {
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
            categoriesAndSubs: {},
            infoList: {items: []},
            itemsPerPage: itemsPerPage,
            pageNumber: 0,
            numberOfPages: 1,

            init: function (callback) {
                /* On a new session we make an ajax call for the top level categories
                 *  if it's a continuation of a session top level categories are retrieved from sessionStorage */
                var self = this;
                $http.get('/scripts/json/categories.json').
                    then(function(response) {
                        self.categoriesAndSubs = response.data.categories;
                        for (var cat in response.data.categories) {
                            if (response.data.categories.hasOwnProperty(cat)) {
                                self.categories.push(cat)
                            }
                        }
                          /* categories is an array; it is saved as a string in sessionStorage */
                        sessionStorage.setItem("categories", self.categories);
                        sessionStorage.setItem("categoriesAndSubs", JSON.stringify(self.categoriesAndSubs));
                        if (callback && typeof callback === 'function') {
                            callback();
                        }
                    }, function(response) {
                        console.error('response: ', response);
                    }
                );
            },

            /* Gets the category from $location.path(), checks if category from
             * $location.path() matches a category in categories from the ajax call or sessionStorage,
             * then the items to be displayed are set to this.infoList.items  */
            setItems: function(categories, callback) {
                this.categories = categories || [];
                if ($location.path()) {
                    var path = $location.path().split("/"),
                        categoryPath = path[3],
                        self = this;

                    if (this.categories.length === 0) {
                        this.init();
                    }

                    for (var i = 0, len = this.categories.length; i < len; i++) {
                        if (categoryPath === this.categories[i]) {
                            this.currentCategory = this.categories[i];
                            break;
                        }
                    }

                    if (!this.currentCategory) {
                        this.currentCategory = "earrings";
                    }

                    var display = function() {
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

}(jQuery));