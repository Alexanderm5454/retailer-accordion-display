'use strict';

/**
 * @ngdoc overview
 * @name retailerApp
 * @description
 * # retailerApp
 *
 * Main module of the application.
 */
angular
  .module('retailerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'LocalStorageModule'
  ])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider) {
      localStorageServiceProvider.setPrefix('ls');
    }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/jewelry/:category', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl as main'
      })
      .when('/jewelry/:category/:itemPath', {
        templateUrl: 'views/item.html',
        controller: 'ItemCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
