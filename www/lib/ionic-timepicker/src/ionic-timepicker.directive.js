//By Rajeshwar Patlolla
//https://github.com/rajeshwarpatlolla

(function() {
    'use strict';

    angular.module('ionic-timepicker')
        .directive('ionicTimepicker', ionicTimepicker);

    ionicTimepicker.$inject = ['$ionicPopup'];

    function ionicTimepicker($ionicPopup, $cordovaToast) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                inputObj: "=inputObj"
            },
            link: function(scope, element, attrs) {

                var today = new Date();
                var currentEpoch = ((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60);

                //set up base variables and options for customization
                scope.inputEpochTime = scope.inputObj.inputEpochTime ? scope.inputObj.inputEpochTime : currentEpoch;
                scope.step = scope.inputObj.step ? scope.inputObj.step : 15;
                scope.format = scope.inputObj.format ? scope.inputObj.format : 24;
                scope.titleLabel = scope.inputObj.titleLabel ? scope.inputObj.titleLabel : 'Time Picker';
                scope.subTitle = scope.inputObj.subTitle ? scope.inputObj.subTitle : '';
                scope.setLabel = scope.inputObj.setLabel ? scope.inputObj.setLabel : 'Set';
                scope.closeLabel = scope.inputObj.closeLabel ? scope.inputObj.closeLabel : 'Close';
                scope.setButtonType = scope.inputObj.setButtonType ? scope.inputObj.setButtonType : 'button-positive';
                scope.closeButtonType = scope.inputObj.closeButtonType ? scope.inputObj.closeButtonType : 'button-stable';
                scope.startTime = scope.inputObj.startTime ? scope.inputObj.startTime : Date.parse('00:00');
                scope.endTime = scope.inputObj.endTime ? scope.inputObj.endTime : Date.parse('23:59');


                scope.inputObj.updateWorkHours = function(start, end, subTitle) {
                    scope.startTime = start ? start : Date.parse('00:00');
                    scope.endTime = end ? end : Date.parse('23:59');
                    scope.subTitle = subTitle ? subTitle : '';


                }



                var obj = { epochTime: scope.inputEpochTime, step: scope.step, format: scope.format };
                scope.time = { hours: 0, minutes: 0, meridian: "" };
                var objDate = new Date(obj.epochTime * 1000); // Epoch time in milliseconds.

                //Increasing the hours
                scope.increaseHours = function() {
                    scope.time.hours = Number(scope.time.hours);
                    if (obj.format == 12) {
                        if (scope.time.hours != 12) {
                            scope.time.hours += 1;
                        } else {
                            scope.time.hours = 1;
                        }
                    }
                    if (obj.format == 24) {
                        if (scope.time.hours < scope.endTime.getHours()) {
                            scope.time.hours = (scope.time.hours + 1) % 24;
                        } else {
                            // scope.time.minutes = scope.endTime.getMinutes();
                            // scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
                        }
                    }
                    scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
                };

                //Decreasing the hours
                scope.decreaseHours = function() {
                    scope.time.hours = Number(scope.time.hours);
                    if (obj.format == 12) {
                        if (scope.time.hours > 1) {
                            scope.time.hours -= 1;
                        } else {
                            scope.time.hours = 12;
                        }
                    }
                    if (obj.format == 24) {
                        if (scope.time.hours > scope.startTime.getHours()) {
                            scope.time.hours = (scope.time.hours + 23) % 24;
                        } else {
                            // scope.time.minutes = scope.startTime.getMinutes();
                            // scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
                        }

                    }
                    scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
                };

                //Increasing the minutes
                scope.increaseMinutes = function() {
                    scope.time.minutes = Number(scope.time.minutes);

                    scope.time.minutes = (scope.time.minutes + obj.step) % 60;
                    scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;

                };

                //Decreasing the minutes
                scope.decreaseMinutes = function() {
                    scope.time.minutes = Number(scope.time.minutes);

                    scope.time.minutes = (scope.time.minutes + (60 - obj.step)) % 60;
                    scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;

                };

                //Changing the meridian
                scope.changeMeridian = function() {
                    scope.time.meridian = (scope.time.meridian === "AM") ? "PM" : "AM";
                };

                //onclick of the button
                scope.$on('showTimePopup', function(event, data) {
                    if (typeof scope.inputObj.inputEpochTime === 'undefined' || scope.inputObj.inputEpochTime === null) {
                        objDate = new Date();
                    } else {
                        objDate = new Date();

                        if (scope.startTime > objDate) {
                            objDate.setHours(scope.startTime.getHours());
                        }

                        if (scope.endTime < objDate){
                            objDate.setHours(scope.endTime.getHours());
                        }

                    }
                    //if (scope.inputObj.showPopup) {
                    if (obj.format == 12) {
                        scope.time.meridian = (objDate.getUTCHours() >= 12) ? "PM" : "AM";
                        scope.time.hours = (objDate.getUTCHours() > 12) ? ((objDate.getUTCHours() - 12)) : (objDate.getUTCHours());
                        scope.time.minutes = (objDate.getUTCMinutes());

                        scope.time.hours = (scope.time.hours < 10) ? ("0" + scope.time.hours) : (scope.time.hours);
                        scope.time.minutes = (scope.time.minutes < 10) ? ("0" + scope.time.minutes) : (scope.time.minutes);

                        if (scope.time.hours === 0 && scope.time.meridian === "AM") {
                            scope.time.hours = 12;
                        }

                        $ionicPopup.show({
                            templateUrl: 'ionic-timepicker-12-hour.html',
                            title: scope.titleLabel,
                            subTitle: "",
                            scope: scope,
                            buttons: [{
                                text: scope.closeLabel,
                                type: scope.closeButtonType,
                                onTap: function(e) {
                                    scope.inputObj.callback(undefined);
                                }
                            }, {
                                text: scope.setLabel,
                                type: scope.setButtonType,
                                onTap: function(e) {

                                    scope.loadingContent = true;

                                    var totalSec = 0;

                                    if (scope.time.hours != 12) {
                                        totalSec = (scope.time.hours * 60 * 60) + (scope.time.minutes * 60);
                                    } else {
                                        totalSec = scope.time.minutes * 60;
                                    }

                                    if (scope.time.meridian === "AM") {
                                        totalSec += 0;
                                    } else if (scope.time.meridian === "PM") {
                                        totalSec += 43200;
                                    }
                                    scope.etime = totalSec;


                                    scope.inputObj.callback(scope.etime);
                                }
                            }]
                        });

                    } else if (obj.format == 24) {

                        scope.time.hours = (objDate.getHours());
                        scope.time.minutes = 0;

                        scope.time.hours = (scope.time.hours < 10) ? ("0" + scope.time.hours) : (scope.time.hours);
                        scope.time.minutes = (scope.time.minutes < 10) ? ("0" + scope.time.minutes) : (scope.time.minutes);

                        $ionicPopup.show({
                            templateUrl: 'ionic-timepicker-24-hour.html',
                            title: scope.titleLabel,
                            subTitle: scope.subTitle,
                            scope: scope,
                            buttons: [{
                                text: scope.setLabel,
                                type: scope.setButtonType,
                                onTap: function(e) {

                                    scope.loadingContent = true;

                                    var totalSec = 0;

                                    if (scope.time.hours != 24) {
                                        totalSec = (scope.time.hours * 60 * 60) + (scope.time.minutes * 60);
                                    } else {
                                        totalSec = scope.time.minutes * 60;
                                    }
                                    scope.etime = totalSec;
                                    var theTime = Date.parse(scope.time.hours + ":" + scope.time.minutes);

                                    if (theTime >= scope.startTime &&
                                        theTime <= scope.endTime) {
                                        scope.inputObj.callback(scope.etime);
                                    } else {
                                        scope.inputObj.callback(undefined, 'not in time');
                                    }

                                    // scope.inputObj.callback(scope.etime);
                                }
                            }, {
                                text: scope.closeLabel,
                                type: scope.closeButtonType,
                                onTap: function(e) {
                                    scope.inputObj.callback(undefined);
                                }
                            }]
                        });
                    }
                    //}
                });
            }
        };
    }

})();
