app.controller('IntroCtrl', function($scope, $state,$window, $localStorage) {
  // here we store wizard data
  $scope.button = "שלח SMS לאימות";
  $scope.step2 = {};

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
    if(!$scope.showVerify)
    {
      // send verification
      $scope.showVerify = true;
      $scope.button = "ערוך מס' טלפון";
    }
    else {
      $scope.showVerify = false;
      $scope.button = "שלח SMS בשנית";
    }
  }

  $scope.verifyNumber = function(code) {
    // verify code sent

    if (true)
    {
      $scope.start();
    }
  }

  $scope.start = function() {
    persistWizardData();

    //$state.go('app.clients', {}, {reload:true});
    $window.location.reload();
    $state.transitionTo('app.clients', {}, {
      reload: true,
      inherit: false,
      notify: true
    });
  }

})
