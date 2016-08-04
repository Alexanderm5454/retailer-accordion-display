(function(jq) {
    'use strict';

    /* Creates an item to be displayed on a category page*/

    var retailerApp = angular.module("retailerApp");

    retailerApp.directive("grid", grid);
    grid.$inject = ["selectedItem", "wishList", "urlPath"];

    function grid(selectedItem, wishList, urlPath) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                gridItem: "=info"
            },
            templateUrl: "views/directives/grid.html",

            link: function(scope, element) {
                var $wishListIcon = jq(element.find(".wishListIcon")[0]);
                var tooltipOptions = {
                    'delay': {"show": 400, "hide": 100},
                    'title': "Add to Wish List"
                };

                scope.inWishList = function(id) {
                    return id in scope.$parent.$parent.wishListItems;
                };


                /* Displays add the add/remove to/from wish list icon and determines which tooltip to display */
                element.on("mouseover", function() {
                    var wishListIcon = element.find(".wishListIcon")[0];
                    wishListIcon.style.visibility = "visible";
                    if ($wishListIcon.hasClass("wishListIconSelected")) {
                        tooltipOptions.title = "Remove from Wish List";
                    }
                    $wishListIcon.attr("data-toggle", "tooltip").tooltip(tooltipOptions);
                }).on("mouseout", function() {
                    if (element.find(".wishListIconNotSelected")[0]) {
                        element.find(".wishListIconNotSelected")[0].style.visibility = "hidden";
                    }
                });

                /* Adds/removes the item from the wish list and updates the add/remove to/from icon accordingly */
                $wishListIcon.on("click", function(e) {
                    e.stopPropagation();
                    var item = scope.gridItem;

                    if (jq(this).hasClass("wishListIconNotSelected")) {
                        wishList.addItem(item);
                        jq(this).addClass("wishListIconSelected").removeClass("wishListIconNotSelected");
                        tooltipOptions.title = "Remove from Wish List";
                    }
                    else if (jq(this).hasClass("wishListIconSelected")) {
                        wishList.removeItem(item);
                        jq(this).removeClass("wishListIconSelected").addClass("wishListIconNotSelected");
                        tooltipOptions.title = "Add to Wish List";
                    }
                    jq(this).tooltip("hide")
                        .attr("data-original-title", tooltipOptions.title)
                        .tooltip("fixTitle")
                        .tooltip(tooltipOptions);
                });

                /* Sets the page to the full page view of the item */
                element.on("click", function(e) {
                    e.stopPropagation();
                    scope.$apply(function() {
                        selectedItem.data = scope.gridItem;
                        urlPath.loadItemPage(selectedItem.data);
                    });
                });

            }
        };
    }

}(jQuery));