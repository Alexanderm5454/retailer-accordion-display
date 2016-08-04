(function(jq) {
    'use strict';

    /**
     * @ngdoc function
     * @name retailerApp.controller:ItemCtrl
     * @description
     * # ItemCtrl
     * Controller of the retailerApp
     */

    var retailerApp = angular.module('retailerApp');

    retailerApp.controller("ItemCtrl", ItemCtrl);
    ItemCtrl.$inject = ["$scope", "$location", "selectedItem", "items", "categoryData", "urlPath"];

    function ItemCtrl($scope, $location, selectedItem, items, categoryData, urlPath) {
        $scope.infoList = {items: []};
        $scope.pageNumber = 0;
        $scope.pathDisplay = [];
        $scope.categoriesAndSubs = [];

        $scope.item = selectedItem.data;

        $scope.setCategory = function(index, category) {
            var mainCategory = category,
                subCategory = null;
            if (index > 0) {
                mainCategory = $scope.item.category;
                subCategory = category;
            }
            urlPath.loadCategoryPage(urlPath.path.pageNumber, mainCategory, subCategory);
        };


        $scope.loadItem = function() {
            $scope.categories = categoryData.categories;
            if (!$scope.item || JSON.stringify($scope.item) === JSON.stringify({})) {
                var fullPath = $location.path().split("/"),
                    path = parseInt(fullPath[fullPath.length - 1], 10),
                    index = -1;

                items.setItems($scope.categories, function() {
                    for (var i = 0, len = items.infoList.items.length; i < len; i++) {
                        if (path === i) {
                            index = i;
                            break;
                        }
                    }
                    $scope.item = items.infoList.items[index];
                });

            } else {
                jq("body, html").animate({scrollTop: 0}, 0);
            }

            $scope.categoriesAndSubs.push($scope.item.category);
            if ($scope.item.sub_categories.length > 0) {
                for (var i = 0, len = $scope.item.sub_categories.length; i < len; i++) {
                    $scope.categoriesAndSubs.push($scope.item.sub_categories[i]);
                }
            }

            /* For use with ES6 (uses the ... operator not defined in ES5)
             $scope.categoriesAndSubs = $scope.item.sub_categories.length ? [$scope.item.category,...$scope.item.sub_categories] :
             [$scope.item.category];
             */
        };
    }


}(jQuery));