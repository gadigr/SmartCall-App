app.controller('IntroCtrl', function($scope, $cordovaToast, $cordovaInAppBrowser, $state, $window, $cordovaNetwork, $localStorage, $ionicPopup) {
    // here we store wizard data
    $scope.button = "שלח SMS לאימות";
    $scope.step2 = { phone: "", ver: "" };
    $scope.smsSent = false;
    $scope.message = "";
    $scope.regex = "^0[0-9]{9}$";

    function persistWizardData() {
        // set flag to indicate wizard has been run
        $localStorage.myAppRun = true;

        // save additional data
        $localStorage.myAppData = {
            phone: $scope.step2.phone,
        };
    }

    $scope.sendSMS = function(number) {
        $scope.sentCode = Math.floor(1000 + Math.random() * 9000);

        // console.log($scope.sentCode);

        // send verification
        var xmlData = ﻿"<XmlTemplate><WebServiceURL>https://sec-phoneplus.com/DistributionWebService/MessageDistribution.asmx/ImportFromXml</WebServiceURL><TenantID>1884</TenantID><TenantName>סמראט פון משלוח סמס מאשר</TenantName><ApplicationID>4479</ApplicationID><ApplicationVersion>1</ApplicationVersion><ApplicationName>משלוח סמס מאשר</ApplicationName><SecID>ad663fb8-096f-4944-9b0b-46f9248f5c5f</SecID><DistributionRequestTime>" + new Date().toString('yyyy-MM-dd HH:mm:ss') + "</DistributionRequestTime><OutboundReasonID>4</OutboundReasonID><AgentExtNumber></AgentExtNumber><TargetTelNumber1>" + number + "</TargetTelNumber1><TargetTelNumber2></TargetTelNumber2><TargetTelNumber3></TargetTelNumber3><PPWSinfo1></PPWSinfo1><PPWSinfo2></PPWSinfo2><PPWSinfo3></PPWSinfo3><PPWSinfo4></PPWSinfo4><PPWSinfo5></PPWSinfo5><PPWStext1 Caption=\"Free SMS\">" + $scope.sentCode + "</PPWStext1></XmlTemplate>";

        // console.log(xmlData);

        $.ajax({
            type: "POST",
            url: 'https://sec-phoneplus.com/DistributionWebService/MessageDistribution.asmx/ImportFromXml',
            data: xmlData,
            success: function(jqXHR) {
                console.log('all good');
                $cordovaToast.showShortBottom("קוד נשלח כעת");
            },
            error: function(jqXHR, ajaxOptions, thrownError) {

                $cordovaToast.showShortBottom("אירעה שגיאה בשליחת קוד");

                console.log(jqXHR);
                console.log(ajaxOptions);
                console.log(thrownError);
            }
        });
    }

    $scope.openBrowser = function() {

        $cordovaInAppBrowser.open('http://www.smartcall.com', '_system', { location: "yes" })
            .then(function(event) {
                // success

            })
            .catch(function(event) {
                // error

            });


        // $cordovaInAppBrowser.close();

    };

    $scope.verifyNumber = function(code) {
        // verify code sent

        if (code === String($scope.sentCode)) {

            $scope.verified = true;
        } else {
            $cordovaToast.showShortBottom("קוד האימות שגוי, נסה שנית...");
        }
    }

    $scope.start = function(navToPrivate) {
        persistWizardData();

        //$state.go('app.clients', {}, {reload:true});
        $window.location.reload();


            $state.transitionTo('app.clients', {private:navToPrivate}, {
                reload: true,
                inherit: false,
                notify: true
            });


    }

})
