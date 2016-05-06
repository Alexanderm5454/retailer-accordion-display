'use strict';

var retailerApp = angular.module("retailerApp");

retailerApp.controller("wishListCtrl", ["$scope", "wishList", "items", "$location", function($scope, wishList, items, $location) {
    $scope.infoList = {items: []};

    $scope.loadWishList = function() {
        if (items.categories.length > 0) {
            $scope.categories = items.categories;
        } else {
            items.init(function() {
                $scope.categories = items.categories;
            });
        }

        for (var i = 0, len = $scope.categories.length; i < len; i++) {
            var currentWishListItems = wishList.getItems($scope.categories[i]);
            for (var item in currentWishListItems) {
                if (currentWishListItems.hasOwnProperty(item)) {
                    $scope.infoList.items.push(currentWishListItems[item]);
                }
            }
        }

    };

    $scope.setCategory = function(category) {
        $scope.pageNumber = 0;
        $location.path("jewelry/" + $scope.pageNumber + "/" + category);
        $("body, html").animate({scrollTop: 0}, 0);
    };
}]);

retailerApp.directive("wishListItem", ["selectedItem", "$location", "wishList", function(selectedItem, $location, wishList) {
    return {
        restrict: "E",
        templateUrl: "views/wishListItem.html",
        link: function(scope, element) {

            var $removeButton = $(element.children().find(".removeFromWishList"));

            element.on("click", function(e) {
                e.stopPropagation();
                scope.index = +$(element.children()[0]).context.id;
                selectedItem.data = scope.infoList.items[scope.index];
                scope.itemPath = selectedItem.data.title.toLowerCase().split(/[\s]+/).join("-");
                $location.path("/jewelry/wish-list/" + scope.itemPath + "/" + scope.index);
                scope.$apply();
            });


            $removeButton.on("click", function(e) {
                e.stopPropagation();
                var $element = $(element.children()[0]);
                $element.fadeOut(800, function() {
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