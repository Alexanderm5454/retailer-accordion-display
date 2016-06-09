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



    retailerApp.controller('MainCtrl', ['$scope', '$http', '$timeout', '$location', 'localStorageService', "categoryData", "items", "wishList", "baseUrl", "urlPath",
        function ($scope, $http, $timeout, $location, localStorageService, categoryData, items, wishList, baseUrl, urlPath) {
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
            $scope.sortBy = urlPath.path.sortByPrice;


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
            $scope.setCategory = function(category) {
                $scope.pageNumber = 0;
                urlPath.loadCategoryPage($scope.pageNumber, category);
                jq("body, html").animate({scrollTop: 0}, 0);
            };

            $scope.setSubCategory = function(subCategory) {
                urlPath.loadCategoryPage(0, $scope.currentCategory, subCategory);

             //   $location.path([baseUrl, 0, $scope.currentCategory, subCategory].join("/"));

            };


            $scope.pageNav = function (direction) {
                var pageNumberChange = false;
                if (direction === "next" && $scope.pageNumber < $scope.numberOfPages - 1) {
                    $scope.pageNumber++;
                    pageNumberChange = true;
                }
                else if (direction === "next" && $scope.pageNumber >= $scope.numberOfPages - 1) {
                    $scope.pageNumber = 0;
                    pageNumberChange = true;
                }
                else if (direction === "previous" && $scope.pageNumber > 0) {
                    $scope.pageNumber--;
                    pageNumberChange = true;
                }
                else if (direction === "previous" && $scope.pageNumber <= 0) {
                    $scope.pageNumber = $scope.numberOfPages - 1;
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

            $scope.setPageNumber = function(number) {
                $scope.pageNumber = number;
                $location.path([baseUrl, $scope.pageNumber, $scope.currentCategory].join("/"));
                jq("body, html").animate({scrollTop: 0}, 0);
            };


            /* Sorts only items currently in infoList.items, i.e. what is currently in view */
            $scope.sortItemsByPrice = function(order) {
                $scope.sortBy = "Price:" + order;
                urlPath.loadCategoryPage(0, $scope.currentCategory, $scope.currentSubCategory, $scope.sortBy);
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
                element.on("click", function(e) {
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
        return function(word) {
            if (word) {
                var wordsArray = word.split(/[\s]+/),
                    firstLetterCaps = "",
                    minusFirstLetter = "";
                if (wordsArray.length === 1) {
                     firstLetterCaps = word.charAt(0).toUpperCase();
                     minusFirstLetter = word.slice(1, word.length);
                    return firstLetterCaps + minusFirstLetter;
                } else if (wordsArray.length > 1) {
                    var words = wordsArray.map(function(wordInArray) {
                        firstLetterCaps = wordInArray.charAt(0).toUpperCase();
                        minusFirstLetter = wordInArray.slice(1, wordInArray.length);
                        return firstLetterCaps + minusFirstLetter;
                    });
                    return words.join(" ");
                }

            }
        };
    });

}(jQuery));