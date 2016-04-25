app.controller('publicCtrl', function($scope, $cordovaToast, ionicDatePicker, $ionicLoading, $cordovaKeyboard, $rootScope, $cordovaNetwork, $ionicPopup, $state, ionicMaterialInk, $timeout, ClientsService, $localStorage) {

    ionicMaterialInk.displayEffect();

    $scope.search = {};

    $scope.privateApp = {};

    $scope.isOnline = true;
    // $scope.network = $cordovaNetwork.getNetwork();
    // $scope.isOnline = $cordovaNetwork.isOnline();
    // $scope.$apply();

    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
        $scope.isOnline = true;
        $scope.network = $cordovaNetwork.getNetwork();
        console.log('oonline');
        $scope.$apply();
    });

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
        console.log("got offline");
        $scope.isOnline = false;
        $scope.network = $cordovaNetwork.getNetwork();
        console.log('offline');
        $scope.$apply();
    });


    /*$scope.addPrivateApp = function() {
   nCode = prompt('הכנס קוד מוקד פרטי:');
   if (nCode) {
     ClientsService.getData(function (data) {
       newItem = data.filter(function(item) {
         return (item.privateCode == nCode);
       })[0];

       if (newItem) {
         privateApps = localStorage.privateApps ? JSON.parse(localStorage.privateApps) : [];
         if (privateApps.indexOf(newItem.privateCode) < 0) {
           $scope.items.push(newItem);
           privateApps.push(newItem.privateCode);
           localStorage.privateApps = JSON.stringify(privateApps);
         }
       } else {
         alert('לא נמצא מוקד פרטי מתאים');
       }
     });
   }
  };*/

    $scope.toggleSearch = function() {
        $scope.search.show = !$scope.search.show;
        if (!$scope.search.show) {
            $scope.search.txt = '';
        }
    };

    $scope.addPrivateApp = function() {
        $scope.isOpen = true;

        if (window.cordova) {
            // $cordovaKeyboard.show();
        }
        $scope.privateAppPopup = $ionicPopup.alert({
            title: 'הוספת מוקד פרטי',
            templateUrl: "popupPrivateTemplate.html",
            scope: $scope,
            buttons: [{
                text: 'ביטול',
                onTap: function(e) {
                    $scope.privateApp = {};
                }
            }, {
                text: 'הוסף',
                type: 'button-default',
                onTap: function(e) {
                    nCode = $scope.privateApp.code;
                    $scope.isOpen = false;
                    ClientsService.getData(function(data) {
                        newItem = data.filter(function(item) {
                            return (item.privateCode == nCode);
                        })[0];

                        if (newItem) {
                            privateApps = localStorage.privateApps ? JSON.parse(localStorage.privateApps) : [];
                            if (privateApps.indexOf(newItem.privateCode) < 0) {
                                $scope.items.push(newItem);
                                privateApps.push(newItem.privateCode);
                                localStorage.privateApps = JSON.stringify(privateApps);
                            }
                        } else {
                            $ionicPopup.alert({
                                title: 'הוספת מוקד פרטי',
                                template: 'לא נמצא מוקד פרטי מתאים',
                                buttons: [{
                                    text: 'חזור'
                                }]
                            });
                        }
                    });

                    $scope.privateApp = {};
                }
            }]
        });
    };

    $scope.updateSearch = function(txt) {
        $scope.search.txt = txt;
    };


    $scope.$on('$stateChangeSuccess', function() {
        function exec() {
            $scope.isPrivate = ($state.params.private === 'true');
            if ($scope.isPrivate) {
                $scope.title = 'מוקדים פרטיים';
            } else {
                $scope.title = 'כל המוקדים';
            }
        }

        if (!$scope.$$phase) {
            $scope.$apply(exec);
        } else {
            exec();
        }

    });

    $scope.openDatePicker = function() {
        var workdays = [];
        for (var i = 0; i < $scope.selectedTenant.workdays.length; i++) {
            if ($scope.selectedTenant.workdays[i].inactive) {
                workdays.push(i);
            }
        }

        console.log(workdays);

        $scope.datepickerObject = {
            todayLabel: 'היום', //Optional
            closeLabel: 'חזור', //Optional
            setLabel: 'בחר', //Optional
            setButtonType: 'button-assertive', //Optional
            todayButtonType: 'button-assertive', //Optional
            closeButtonType: 'button-assertive', //Optional
            from: new Date(),
            inputDate: new Date(), //Optional
            mondayFirst: false, //Optional
            weeksList: ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"], //Optional
            monthsList: ["יאנ", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"], //Optional
            templateType: 'popup', //Optional
            showTodayButton: 'true', //Optional
            disableWeekdays: workdays,
            modalHeaderColor: 'bar-positive', //Optional
            modalFooterColor: 'bar-positive', //Optional from: Date.today().setTimeToNow().add({days:-1}), //Optional
            callback: function(val) { //Mandatory
                if (val) {
                    $scope.selectedDate = new Date(val);
                    console.log($scope.selectedTenant.workdays[$scope.selectedDate.getDay()]);
                    if (!$scope.selectedTenant.workdays[$scope.selectedDate.getDay()].allday) {
                        $scope.timePickerObject.updateWorkHours(
                            Date.parse($scope.selectedTenant.workdays[$scope.selectedDate.getDay()].start),
                            Date.parse($scope.selectedTenant.workdays[$scope.selectedDate.getDay()].end),
                            "שעות עבודה: " +
                            $scope.selectedTenant.workdays[$scope.selectedDate.getDay()].end + " - " +
                            $scope.selectedTenant.workdays[$scope.selectedDate.getDay()].start);
                    }
                    $rootScope.$broadcast('showTimePopup', {});
                } else {
                    return;
                }
            },
            dateFormat: 'dd-MM-yyyy', //Optional
            closeOnSelect: false, //Optional
        };

        ionicDatePicker.openDatePicker($scope.datepickerObject);
    }

    $scope.timePickerObject = {
        inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
        step: 15, //Optional
        format: 24, //Optional
        titleLabel: 'בחירת שעה', //Optional
        setLabel: 'בחר', //Optional
        closeLabel: 'חזור', //Optional
        // startTime:Date.parse($scope.selectedTenant.workdays[$scope.selectedDate.getDay()].start),
        // endTime:Date.parse($scope.selectedTenant.workdays[$scope.selectedDate.getDay()].end),
        setButtonType: 'button-positive', //Optional
        closeButtonType: 'button-stable', //Optional
        callback: function(val, err) { //Mandatory
            if (err) {
                $cordovaToast.showShortBottom("לא ניתן לקבוע שיחה מחוץ לשעות עבודה");
            } else {
                if (val) {
                    time = new Date(val * 1000);
                    var dt = Date.parse($scope.selectedDate)
                    dt.set({ hour: time.getUTCHours(), minute: time.getUTCMinutes() });
                    // console.log(dt);
                    $scope.sendDetails(dt);
                } else {

                    ionicDatePicker.openDatePicker($scope.datepickerObject);
                    // $rootScope.$broadcast('showDatePopup', {});
                }
            }
        }
    };




    $scope.initClientsData = function() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> <br/>טוען מוקדים...'
        });
        ClientsService.getData(function(data) {
            $ionicLoading.hide();
            if (!$scope.isPrivate) {
                $scope.items = data.filter(function(item) {
                    return (item.isPublic);
                });
            } else {
                $scope.items = data.filter(function(item) {
                    return ((item.privateCode) && ((localStorage.privateApps) && (JSON.parse(localStorage.privateApps).indexOf(item.privateCode) >= 0)));
                });
            }
        });

    };

    $scope.initClientsData();

    $scope.doRefresh = function() {
        $scope.initClientsData()

        $scope.$broadcast('scroll.refreshComplete');

    };

    $scope.$on('ngLastRepeat.clientlist', function(e) {
        $scope.materialize();
    });

    $scope.materialize = function() {
        $timeout(function() {
            ionicMaterialInk.displayEffect();
        }, 0);
    };

    $scope.showTenantsPopup = function(item) {
        $scope.selectedApp = item;
        source = item.image ? item.image : 'img/phone.png';
        if ($scope.selectedApp.tenants.length > 1) {
            $scope.TenantsPopup = $ionicPopup.alert({
                title: item.name + " - בחירת שלוחה",
                // subTitle: "<img class=\"card-item\" src=\'" + source + "\' />",
                templateUrl: "popupTenantsTemplate.html",
                scope: $scope,
                buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                    text: 'חזור',
                    type: 'button-default',
                    onTap: function(e) {
                        $scope.selectedApp = {};
                    }
                }]
            });
        } else {
            $scope.showTimePopup($scope.selectedApp.tenants[0]);
        }
    };

    $scope.showTimePopup = function(item) {
        $scope.now = Date.today().setTimeToNow();
        console.log($scope.now);
        $scope.selectedTenant = item;
        $scope.displayEffect = ionicMaterialInk.displayEffect;
        $scope.TimePopup = $ionicPopup.alert({
            title: $scope.selectedApp.name + " - " + item.name,
            subTitle: "מתי לחזור אליך?",
            templateUrl: "popupTimeTemplate.html",
            scope: $scope,
            buttons: [{
                text: 'חזור',
                type: 'button-default',
                onTap: function(e) {
                    $scope.selectedTenant = {};
                }
            }]
        });
    }

    $scope.sendDetails = function(selectedTime) {
        if ($scope.TimePopup) {
            $scope.TimePopup.close();
            if ($scope.TenantsPopup) {
                $scope.TenantsPopup.close();
            }
        }

        var phone = $localStorage.myAppData.phone;
        console.log(selectedTime);
        // var phone = "0525675119";
        var xmlData = "<XmlTemplate><WebServiceURL>https://sec-phoneplus.com/DistributionWebService/DialerDistribution.asmx/ImportFromXml</WebServiceURL><TenantID>" + $scope.selectedTenant.tenantID + "</TenantID><TenantName>" + $scope.selectedTenant.name + "</TenantName><ApplicationID>" + $scope.selectedTenant.appID + "</ApplicationID><ApplicationVersion>1</ApplicationVersion><ApplicationName>" + $scope.selectedApp.name + "</ApplicationName><SecID>" + $scope.selectedTenant.secID + "</SecID><DialerRequestTime>" + selectedTime.toString('yyyy-MM-dd HH:mm:ss') + "</DialerRequestTime><PhoneNum>" + phone + "</PhoneNum><PhoneNum2></PhoneNum2><PhoneNum3></PhoneNum3><AgentExtNumber>" + $scope.selectedApp.agentExt + "</AgentExtNumber><Info1></Info1><Info2></Info2><Info3></Info3><Info4></Info4><Info5>SmartClick</Info5></XmlTemplate>";
        // var xmlData = ﻿"<XmlTemplate><WebServiceURL>https://sec-phoneplus.com/DistributionWebService/MessageDistribution.asmx/ImportFromXml</WebServiceURL><TenantID>1289</TenantID><TenantName>תזכור קולי הדגמה אפיקים</TenantName><ApplicationID>3238</ApplicationID><ApplicationVersion>1</ApplicationVersion><ApplicationName>תזכור קולי הדגמה </ApplicationName><SecID>cf56f82b-9cf9-4398-a870-af2528c926cf</SecID><DistributionRequestTime>"+selectedTime.toString('yyyy-MM-dd HH:mm:ss')+"</DistributionRequestTime><OutboundReasonID>3</OutboundReasonID><AgentExtNumber></AgentExtNumber><TargetTelNumber1>0525675119</TargetTelNumber1><TargetTelNumber2></TargetTelNumber2><TargetTelNumber3></TargetTelNumber3><PPWSinfo1></PPWSinfo1><PPWSinfo2></PPWSinfo2><PPWSinfo3></PPWSinfo3><PPWSinfo4></PPWSinfo4><PPWSinfo5></PPWSinfo5><PPWSvoice2 Caption=\"date\">2015-05-28</PPWSvoice2><PPWSvoice4 Caption=\"day name\">2015-05-28</PPWSvoice4><PPWSvoice6 Caption=\"time\">10:00:00</PPWSvoice6><PPWSvoice8 Caption=\"time\">12:00:00</PPWSvoice8><PPWSvoice10 Caption=\"service number\">7788</PPWSvoice10></XmlTemplate>";
        console.log(xmlData);

        $.ajax({
            type: "POST",
            url: 'https://sec-phoneplus.com/DistributionWebService/DialerDistribution.asmx/ImportFromXml',
            // url: 'https://sec-phoneplus.com/DistributionWebService/MessageDistribution.asmx/ImportFromXml',
            data: xmlData,
            success: function(jqXHR) {
                $ionicPopup.show({
                    title: 'הבקשה התקבלה',
                    buttons: [
                        { text: 'אישור' }
                    ]
                });

            },
            error: function(jqXHR, ajaxOptions, thrownError) {

                $ionicPopup.alert({
                    title: 'התרחשה שגיאה',
                    template: '<span class="alert-text">נסה שנית במועד מאוחר יותר</span>',
                    buttons: [
                        { text: 'אישור' }
                    ]
                });
                console.log(jqXHR);
                console.log(ajaxOptions);
                console.log(thrownError);
            }
        });

        $.ajax({
            type: "GET",
            url: 'https://smartcall-management.firebaseio.com/logs.json',
            success: function(data) {
                $.ajax({
                    type: "PUT",
                    url: 'https://smartcall-management.firebaseio.com/logs/' + data.length + '.json',
                    data: JSON.stringify({
                        appID: $scope.selectedApp.appID,
                        appName: $scope.selectedApp.name,
                        phone: phone,
                        tenantName: $scope.selectedTenant.name,
                        when: (new Date()).valueOf()
                    }),
                    success: function() {
                        console.log('Successfully logged request!');
                    },
                    error: function(jqXHR, ajaxOptions, thrownError) {
                        console.log('Error logging request: ', thrownError);
                    }
                });
            }
        });
    }

    $timeout(function() {
        ionicMaterialInk.displayEffect();
    }, 0);

});
