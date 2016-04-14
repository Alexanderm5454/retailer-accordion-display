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

    $scope.setCategory = function(category) {
        $location.path("jewelry/" + category);
    };

    $scope.item = selectedItem.data;

    (function() {
        if (!$scope.item || JSON.stringify($scope.item) === JSON.stringify({})) {
            items.init(function() {
                $scope.categories = items.categories;
                items.setItems(function () {
                    $scope.infoList.items = items.infoList.items;
                    var path = $location.path().slice(-3),
                        index = -1;
                    for (var i = 0, len = $scope.infoList.items.length; i < len; i++) {
                        if (path.indexOf(i.toString()) > -1) {
                            index = i;
                            break;
                        }
                    }
                    $scope.item = $scope.infoList.items[index];
                });
            });
        } else {
            items.init(function() {
                $scope.categories = items.categories;
            });
        }
    }());

}]);
