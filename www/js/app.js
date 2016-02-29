// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ionic.wizard', 'ionic-material', 'clientsService', 'ngStorage', 'ionic-datepicker', 'ionic-timepicker']);

app.run(function ($ionicPlatform, $ionicPopup) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

      //$ionicPlatform.registerBackButtonAction(function(event) {
      //  if (true) { // your check here
      //    $ionicPopup.confirm({
      //      title: 'System warning',
      //      template: 'are you sure you want to exit?'
      //    }).then(function(res) {
      //      if (res) {
      //        ionic.Platform.exitApp();
      //      }
      //    })
      //  }
      //}, 100);

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

app.config(function ($stateProvider, $urlRouterProvider) {
  // set default route to wizard
  var defaultRoute = '/app/intro';

  // check whether wizard has been run in order to change default route
  // we cannot inject ngStorage dependency in a config module, so we need to use plain localStorage object
  if (localStorage.getItem('ngStorage-myAppRun')) {
    console.log('wizard has been run - skip!');
    defaultRoute = '/app/clients/false';
  }


    $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
      .state('app.intro', {
        url: '/intro',
        views: {
          'menuContent': {
            templateUrl: 'templates/intro.html',
            controller: 'IntroCtrl'
          }
        }

      })
      .state('app.clients', {
        url: '/clients/:private',
        views: {
          'menuContent': {
            templateUrl: 'templates/public_clients.html',
            controller: 'publicCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(defaultRoute);
});
