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

    MainCtrl.$inject = ['$scope', '$location', "categoryData", "items", "wishList", "baseUrl", "urlPath"];
    retailerApp.controller("MainCtrl", MainCtrl);

    function MainCtrl($scope, $location, categoryData, items, wishList, baseUrl, urlPath) {
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


        $scope.wishListItems = wishList.getItems(items.currentCategory);

        /* Sets the category to be displayed */
        $scope.setCategory = function (category) {
            $scope.pageNumber = 0;
            urlPath.loadCategoryPage($scope.pageNumber, category);
            jq("body, html").animate({scrollTop: 0}, 0);
        };

        $scope.setSubCategory = function (subCategory) {
            urlPath.loadCategoryPage(0, $scope.currentCategory, subCategory);

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

        $scope.setPageNumber = function (number) {
            $scope.pageNumber = number;
            $location.path([baseUrl, $scope.pageNumber, $scope.currentCategory].join("/"));
            jq("body, html").animate({scrollTop: 0}, 0);
        };


        /* Sorts only items currently in infoList.items, i.e. what is currently in view */
        $scope.sortItemsByPrice = function (order) {
            $scope.sortBy = "Price:" + order;
            urlPath.loadCategoryPage(0, $scope.currentCategory, $scope.currentSubCategory, $scope.sortBy);
        };
    }

}(jQuery));