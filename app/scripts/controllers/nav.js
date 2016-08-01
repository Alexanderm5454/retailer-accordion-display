(function(jq) {
    'use strict';
    /**
     * Created by Alexander Markowski on 5/25/16.
     */

    var retailerApp = angular.module('retailerApp');

    retailerApp.controller("NavController", NavController);
    NavController.$inject = ["$scope", "urlPath"];

    function NavController($scope, urlPath) {
        $scope.setCategory = function(category) {
            urlPath.loadCategoryPage(0, category);
            jq("body, html").animate({scrollTop: 0}, 0);
        };

        $scope.setSubCategory = function(subCategory) {
            urlPath.loadCategoryPage(0, $scope.currentNavCategory, subCategory);
        };

        $scope.isCurrentNavCategory = function (category) {
            return $scope.currentNavCategory === category;
        };
    }

}(jQuery));