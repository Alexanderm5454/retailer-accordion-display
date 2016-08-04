(function() {
    'use strict';

    /**
     * @ngdoc overview
     * @name retailerApp
     * @description
     * # retailerApp
     *
     * Main module of the application.
     */

    var retailerApp = angular.module('retailerApp');

    retailerApp.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('ls');
    }])
        .run(["$rootScope", "$http", "categoryData", function ($rootScope, $http, categoryData) {
            /* On a new session we make an ajax call for the top level categories
             *  if it's a continuation of a session top level categories are retrieved from sessionStorage */
            var categoriesAndSubs = {},
                categories = [];

            function getCategories(callback) {
                if (!sessionStorage.getItem("categories") || !sessionStorage.getItem("categoriesAndSubs")) {
                    $http.get('/scripts/json/categories.json').
                        then(function (response) {
                            categoriesAndSubs = response.data.categories;
                            for (var cat in response.data.categories) {
                                if (response.data.categories.hasOwnProperty(cat)) {
                                    categories.push(cat);
                                }
                            }
                            sessionStorage.setItem("categories", categories);
                            sessionStorage.setItem("categoriesAndSubs", JSON.stringify(categoriesAndSubs));
                            if (callback && typeof callback === 'function') {
                                callback();
                            }
                        }, function (response) {
                            console.error('response: ', response);
                        }
                    );

                } else {
                    /* sessionStorage stores data a string so its data must be converted to an array */
                    categories = sessionStorage.getItem("categories").split(",");
                    categoriesAndSubs = JSON.parse(sessionStorage.getItem("categoriesAndSubs"));
                    if (callback && typeof callback === 'function') {
                        callback();
                    }

                }
            }

            getCategories(function () {
                $rootScope.categories = categories;
                categoryData.categories = categories;
                categoryData.categoriesAndSubs = categoriesAndSubs;
            });

        }])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/about', {
                    templateUrl: 'views/about.html',
                    controller: 'AboutCtrl'
                })
                .when('/jewelry/wish-list/:category', {
                    templateUrl: 'views/wish-list.html',
                    controller: "wishListCtrl"
                })
                .when('/jewelry/:pageNumber/:category', {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                })
                .when('/jewelry/:pageNumber/:category/:subCategory/sort/price/:sortBy', {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                })
                .when('/jewelry/:pageNumber/:category/sort/price/:sortBy', {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                })
                .when('/jewelry/:pageNumber/:category/:subCategory', {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                })
                .when('/jewelry/:pageNumber/:category/:itemPath/:index', {
                    templateUrl: 'views/item.html',
                    controller: 'ItemCtrl'
                })
                .when('/jewelry/wish-list', {
                    templateUrl: 'views/wish-list.html',
                    controller: "wishListCtrl"
                })
                .when('/about', {
                    templateUrl: 'views/about.html',
                    controller: 'AboutCtrl',
                    controllerAs: 'about'
                })
                .otherwise({
                    redirectTo: '/jewelry/0/earrings'
                });
        });

}());