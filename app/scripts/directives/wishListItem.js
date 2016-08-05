(function(jq) {
    'use strict';

    var retailerApp = angular.module("retailerApp");
    retailerApp.directive("wishListItem", wishListItem);
    wishListItem.$inject = ["selectedItem", "wishList", "urlPath"];

    function wishListItem(selectedItem, wishList, urlPath) {
        return {
            restrict: "E",
            replace: true,

            scope: {
                wishItem: "=info"
            },
            templateUrl: "views/wishListItem.html",
            link: function(scope, element) {

                var $removeButton = jq(element.children().find(".removeFromWishList"));


                element.on("click", function(e) {
                    e.stopPropagation();
                    selectedItem.data = scope.wishItem;
                    urlPath.loadItemPage(selectedItem.data);
                    scope.$apply();
                });

                $removeButton.on("click", function(e) {
                    e.stopPropagation();
                    scope.$apply(function() {
                        var $element = jq(element.children()[0]);
                        $element.fadeOut(800, function () {
                            var index = +$element.context.id,
                                removedItem = scope.infoList.items[index];
                            wishList.removeItem(removedItem);
                            scope.infoList.items.length = 0;
                            scope.loadWishList();
                            $element.fadeIn(0);
                        });
                    });
                });
            }
        };

    }

}(jQuery));