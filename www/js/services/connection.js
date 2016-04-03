angular.module('connectionService', ['ngCordova'])
    .factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork) {

        return {
            isOnline: function() {
                if (ionic.Platform.isWebView()) {
                    return $cordovaNetwork.isOnline();
                } else {
                    return navigator.onLine;
                }
            },
            isOffline: function() {
                if (ionic.Platform.isWebView()) {
                    return !$cordovaNetwork.isOnline();
                } else {
                    return !navigator.onLine;
                }
            },
            startWatching: function() {
                if (ionic.Platform.isWebView()) {

                    $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
                        console.log("went online");
                        $rootScope.offline = false;
                    });

                    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
                        console.log("went offline");
                        $rootScope.offline = true;
                    });

                } else {

                    window.ononline = function() {
                        console.log("went online");
                        $rootScope.offline = false;
                    }

                    window.onoffline = function() {
                        console.log("went offline");
                        $rootScope.offline = true;
                    }

                    window.addEventListener("online", function(e) {
                        console.log("went online");
                        $rootScope.offline = false;
                    }, false);

                    window.addEventListener("offline", function(e) {
                        console.log("went offline");
                        $rootScope.offline = true;
                    }, false);
                }
            }
        }
    })
