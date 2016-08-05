(function(jq) {
    'use strict';

    var retailerApp = angular.module("retailerApp");


    retailerApp.controller("WishListCtrl", ["$scope", "wishList", "$location", "categoryData", "baseUrl", "urlPath",
        function ($scope, wishList, $location, categoryData, baseUrl, urlPath) {
            $scope.infoList = {items: []};
            $scope.category = "";
            $scope.pageNumber = 0;

            $scope.loadWishList = function() {
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
                console.log("$scope.infoList.items: ", $scope.infoList.items);
            };

            $scope.setCategory = function(category) {
                $location.path([baseUrl, "wish-list", category].join("/"));
            };

            $scope.sortItemsByPrice = function(order) {

            }

        }]);


}(jQuery));