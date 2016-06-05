(function(jq) {
    'use strict';
    /**
     * Created by alexandermarkowski on 5/25/16.
     */


    var retailerApp = angular.module('retailerApp');

    retailerApp.factory("categoryData", [function () {
        return {categories: [], categoriesAndSubs: {}};
    }]);

    retailerApp.controller("navController", ["$scope", "$location", "baseUrl", function ($scope, $location, baseUrl) {


        $scope.setCategory = function (category) {
            $location.path([baseUrl, 0, category].join("/"));
            jq("body, html").animate({scrollTop: 0}, 0);
        };

        $scope.setSubCategory = function (subCategory) {
            $location.path([baseUrl, 0, $scope.currentNavCategory, subCategory].join("/"));
        };

        $scope.isCurrentNavCategory = function (category) {
            return $scope.currentNavCategory === category;
        };

    }]);

    retailerApp.directive("navMenu", ["categoryData", function (categoryData) {
        return {
            restrict: "E",
            templateUrl: "views/navMenu.html",
            replace: true,
            link: function (scope, element) {
                var $jewelryMenu = jq(element[0].getElementsByClassName("jewelryMenu")),
                    $navCategories = jq(element[0].getElementsByClassName("navCategories")[0]),
                    navCategoriesHeight = (categoryData.categories.length * 40);

                scope.currentNavCategory = categoryData.categories[0];
                scope.menuSubCategories = categoryData.categoriesAndSubs[scope.currentNavCategory];

                jq(".navSubCategories").css({"minHeight": navCategoriesHeight});


                function displayCategories() {
                    $navCategories.css({"visibility": "visible"});
                    $jewelryMenu.css({"backgroundColor": "rgb(175, 196, 207)"});

                    scope.displaySubCategories = function (category) {
                        scope.currentNavCategory = category;
                        scope.menuSubCategories = categoryData.categoriesAndSubs[category];
                    };

                    $navCategories.children().on("click", function (e) {
                        e.stopPropagation();
                        $navCategories.css({"visibility": "hidden"});
                        $jewelryMenu.css({"backgroundColor": "#e7e7e7"});
                        //  element.off("mouseover");
                    });
                }

                element.on('mouseover', function () {
                    displayCategories();
                }).on("mouseout", function () {
                    $navCategories.css({"visibility": "hidden"});
                    $jewelryMenu.css({"backgroundColor": "#e7e7e7"});
                });
            }
        };
    }]);

}(jQuery));