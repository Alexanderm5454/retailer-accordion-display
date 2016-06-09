(function(jq) {
    'use strict';
    /**
     * Created by alexandermarkowski on 5/25/16.
     */


    var retailerApp = angular.module('retailerApp');


    retailerApp.controller("navController", ["$scope", "$location", "baseUrl", "urlPath", function ($scope, $location, baseUrl, urlPath) {


        $scope.setCategory = function(category) {
            urlPath.loadCategoryPage(0, category);
            jq("body, html").animate({scrollTop: 0}, 0);
        };

        $scope.setSubCategory = function(subCategory) {
            urlPath.loadCategoryPage(0, $scope.currentNavCategory, subCategory);
        };

        $scope.isCurrentNavCategory = function (category) {
            return $scope.currentNavCategory === category;
        };

    }]);

    retailerApp.directive("navMenu", ["categoryData", function(categoryData) {
        return {
            restrict: "E",
            templateUrl: "views/navMenu.html",
            replace: true,
            link: function (scope, element) {
                var $jewelryMenu = jq(element[0].getElementsByClassName("jewelryMenu")),
                    $navCategories = jq(element[0].getElementsByClassName("navCategories")[0]),
                    navCategoriesHeight = categoryData.categories.length ? (categoryData.categories.length * 40): 160;

                scope.currentNavCategory = categoryData.categories[0];
                scope.menuSubCategories = categoryData.categoriesAndSubs[scope.currentNavCategory];

                jq(".navSubCategories").css({"minHeight": navCategoriesHeight + "px"});


                function displayCategories() {
                    $navCategories.css({"visibility": "visible"});
                    $jewelryMenu.css({"backgroundColor": "rgb(175, 196, 207)"});

                    scope.displaySubCategories = function(category) {
                        scope.currentNavCategory = category;
                        scope.menuSubCategories = categoryData.categoriesAndSubs[category];
                    };

                    $navCategories.children().on("click", function(e) {
                        e.stopPropagation();
                        $navCategories.css({"visibility": "hidden"});
                        $jewelryMenu.css({"backgroundColor": "#e7e7e7"});
                        element.off("mouseover");
                    });

                    $(".container").on("mouseover", function() {
                        element.off("mouseover");
                    });
                }

                $jewelryMenu.on("mouseover", function() {
                    element.on('mouseover', function(e) {
                        e.stopPropagation();
                        displayCategories();
                    }).on("mouseout", function(e) {
                        e.stopPropagation();
                        $navCategories.css({"visibility": "hidden"});
                        $jewelryMenu.css({"backgroundColor": "#e7e7e7"});
                    });
                });
            }
        };
    }]);

}(jQuery));