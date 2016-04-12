'use strict';

/**
 * @ngdoc function
 * @name retailerApp.controller:ItemCtrl
 * @description
 * # ItemCtrl
 * Controller of the retailerApp
 */

var retailerApp = angular.module('retailerApp');

retailerApp.controller('ItemCtrl', ["$scope", "selectedItem", function($scope, selectedItem) {

    $scope.item = selectedItem.data;
    (function() {
        console.log("$scope.item: ", $scope.item);
    }());
}]);
