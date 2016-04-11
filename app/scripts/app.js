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
      .when('/:category', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl as main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
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
