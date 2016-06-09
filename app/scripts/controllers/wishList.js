(function(jq) {
    'use strict';

    var retailerApp = angular.module("retailerApp");

    retailerApp.controller("wishListCtrl", ["$scope", "wishList", "$location", "categoryData", "baseUrl", "urlPath",
        function ($scope, wishList, $location, categoryData, baseUrl, urlPath) {
            $scope.infoList = {items: []};
            $scope.category = "";
            $scope.pageNumber = 0;

            $scope.loadWishList = function () {
                var path = $location.path().split("/"),
                    tmpItemsObject = {};
                $scope.categories = categoryData.categories;
                if (path.length === 4) {
                    $scope.category = path[3];
                    tmpItemsObject = wishList.getItems($scope.category);
                    for (var itm in tmpItemsObject) {
                        if (tmpItemsObject.hasOwnProperty(itm)) {
                            $scope.infoList.items.push(tmpItemsObject[itm]);
                        }
                    }
                } else {
                    $scope.infoList.items = wishList.getArrayItems();
                }
            };

            $scope.setCategory = function (category) {
                $location.path([baseUrl, "wish-list", category].join("/"));
            };

            $scope.sortItemsByPrice = function(order) {

            }

        }]);

    retailerApp.directive("wishListItem", ["selectedItem", "$location", "wishList", "urlPath", function (selectedItem, $location, wishList, urlPath) {
        return {
            restrict: "E",
            templateUrl: "views/wishListItem.html",
            link: function (scope, element) {

                var $removeButton = jq(element.children().find(".removeFromWishList"));

                element.on("click", function (e) {
                    e.stopPropagation();
                    scope.index = +jq(element.children()[0]).context.id;
                    selectedItem.data = scope.infoList.items[scope.index];
                    urlPath.loadItemPage(selectedItem.data);
                    scope.$apply();
                });


                $removeButton.on("click", function (e) {
                    e.stopPropagation();
                    var $element = jq(element.children()[0]);
                    $element.fadeOut(800, function () {
                        var index = +$element.context.id,
                            removedItem = scope.infoList.items[index];
                        wishList.removeItem(removedItem);
                        scope.infoList.items.length = 0;
                        scope.loadWishList();
                        scope.$apply();
                        $element.fadeIn(0);
                    });
                });
            }
        };
    }]);

}(jQuery));