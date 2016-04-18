'use strict';

/**
 * @ngdoc function
 * @name retailerApp.controller:ItemCtrl
 * @description
 * # ItemCtrl
 * Controller of the retailerApp
 */

var retailerApp = angular.module('retailerApp');

retailerApp.controller('ItemCtrl', ["$scope", "$location", "selectedItem", "items", function($scope, $location, selectedItem, items) {
    $scope.infoList = {items: []};
    $scope.pageNumber = 0;

    $scope.setCategory = function(category) {
        $location.path("jewelry/" + $scope.pageNumber + "/" + category);
    };

    $scope.item = selectedItem.data;

    $scope.loadItem = function() {
        if (!$scope.item || JSON.stringify($scope.item) === JSON.stringify({})) {
            items.init(function() {
                $scope.categories = items.categories;
                items.setItems(function() {
                    var path = $location.path().split("/")[5],
                        index = -1;
                    for (var i = 0, len = items.infoList.items.length; i < len; i++) {
                        if (path === i.toString()) {
                            index = i;
                            break;
                        }
                    }
                    $scope.item = items.infoList.items[index];
                });
            });
        } else {
            items.init(function () {
                $scope.categories = items.categories;
                $("body, html").animate({scrollTop: 0}, 0);
            });
        }
    };


}]);
