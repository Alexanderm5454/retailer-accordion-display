(function(jq) {
    'use strict';

    var retailerApp = angular.module("retailerApp");

    retailerApp.directive("wishListButton", wishListButton);
    wishListButton.$inject = ["wishList"];

    function wishListButton(wishList) {
        return {
            restrict: "E",
            replace: true,

            templateUrl: "views/directives/wishListButton.html",
            link: function(scope, element) {
                scope.wishListButtonText = "Add to Wish List";
                var wishListItems = wishList.getArrayItems(),
                    inWishList = false;

                scope.inWishListArray = function (id) {
                    for (var i = 0, len = wishListItems.length; i < len; i++) {
                        if (wishListItems[i].id === id) {
                            scope.wishListButtonText = "Remove from Wish List";
                            inWishList = true;
                            break;
                        }
                    }
                    return inWishList;
                };

                jq(element).on("click", function() {
                    if (inWishList) {
                        wishList.removeItem(scope.item);
                        inWishList = false;
                        jq(this).removeClass("itemInWishList").addClass("itemNotInWishList");
                        jq(this).text("Add to Wish List");
                    } else {
                        wishList.addItem(scope.item);
                        inWishList = true;
                        jq(this).removeClass("itemNotInWishList").addClass("itemInWishList");
                        jq(this).text("Remove from Wish List");
                    }
                });
            }
        };
    }


}(jQuery));