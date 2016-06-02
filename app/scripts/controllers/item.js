'use strict';

/**
 * @ngdoc function
 * @name retailerApp.controller:ItemCtrl
 * @description
 * # ItemCtrl
 * Controller of the retailerApp
 */

var retailerApp = angular.module('retailerApp');

retailerApp.controller('ItemCtrl', ["$scope", "$location", "selectedItem", "items", "categoryData", "baseUrl",
    function($scope, $location, selectedItem, items, categoryData, baseUrl) {
    $scope.infoList = {items: []};
    $scope.pageNumber = 0;
    $scope.setCategory = function(category) {
        $location.path([baseUrl, $scope.pageNumber, category].join("/"));
    };

    $scope.item = selectedItem.data;


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
            $("body, html").animate({scrollTop: 0}, 0);
        }
    };

}]);


retailerApp.directive("wishListButton", ["wishList", function(wishList) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "views/wishListButton.html",
        link: function(scope, element) {
            scope.wishListButtonText = "Add to Wish List";
            var wishListItems = wishList.getArrayItems(),
                inWishList = false;

            scope.inWishListArray = function(id) {
                for (var i = 0, len = wishListItems.length; i < len; i++) {
                    if (wishListItems[i].id === id) {
                        scope.wishListButtonText = "Remove from Wish List";
                        inWishList = true;
                        break;
                    }
                }
                return inWishList;
            };

            $(element).on("click", function() {
               if (inWishList) {
                   wishList.removeItem(scope.item);
                   inWishList = false;
                   $(this).removeClass("itemInWishList").addClass("itemNotInWishList");
                   $(this).text("Add to Wish List");
               } else {
                   wishList.addItem(scope.item);
                   inWishList = true;
                   $(this).removeClass("itemNotInWishList").addClass("itemInWishList");
                   $(this).text("Remove from Wish List");
               }
            });
        }
    }
}]);