app.controller('publicCtrl', function ($scope, $ionicPopup, $stateParams, ionicMaterialInk, $timeout, ClientsService, $localStorage) {

  ionicMaterialInk.displayEffect();

  $scope.images = [];

  ClientsService.getData(function (data) {
    $scope.items = data;
  });

  $scope.$on('ngLastRepeat.clientlist',function(e) {
    $scope.materialize();
  });

  $scope.materialize = function(){
    $timeout(function(){
      ionicMaterialInk.displayEffect();
    },0);
  };

  $scope.showTenantsPopup = function(item) {
    $scope.selectedApp = item;
    var alertPopup = $ionicPopup.alert({
      title: item.name,
      subTitle: "<img src=\'" + item.image +"\' />",
      templateUrl: "popupTenantsTemplate.html",
      scope: $scope,
      buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
        text: 'חזור',
        type: 'button-default',
        onTap: function(e) {
          //$scope.selected = {};
        }
      }]
    });

    $scope.showTimePopup = function(item) {
      var alertPopup = $ionicPopup.alert({
        title: $scope.selectedApp.name,
        subTitle: item.name,
        templateUrl: "popupTimeTemplate.html",
        scope: $scope,
        buttons: [{
          text: 'חזור',
          type: 'button-default',
          onTap: function (e) {
            return null;
          }
        }]
      });
    }

      $scope.sendDetails = function(selectedTenant){
      //var phone = $localStorage.myAppData.phone;
      console.log(selectedTenant);
      var phone = "0525675119";
      var xmlData = "<XmlTemplate><WebServiceURL>https://sec-phoneplus.com/DistributionWebService/DialerDistribution.asmx/ImportFromXml</WebServiceURL><TenantID>"+selectedTenant.tenantID+"</TenantID><TenantName>"+selectedTenant.name+"</TenantName><ApplicationID>"+$scope.selectedApp.appID+"</ApplicationID><ApplicationVersion>1</ApplicationVersion><ApplicationName>"+$scope.selectedApp.name+"</ApplicationName><SecID>"+selectedTenant.secID+"</SecID><DialerRequestTime>"+new Date().toString('yyyy-MM-dd HH:mm:ss')+"</DialerRequestTime><PhoneNum>" + phone + "</PhoneNum><PhoneNum2></PhoneNum2><PhoneNum3></PhoneNum3><AgentExtNumber></AgentExtNumber><Info1></Info1><Info2></Info2><Info3></Info3><Info4></Info4><Info5></Info5></XmlTemplate>";
      console.log(xmlData);

      $.ajax({
        type: "POST",
        url: 'https://sec-phoneplus.com/DistributionWebService/DialerDistribution.asmx/ImportFromXml',
        data: xmlData,
        success: function (jqXHR) {
          alert('Success');
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
          alert('שגיאה:\r\n' + jqXHR.responseText);
          alert('2: '+ ajaxOptions);
          alert('3: '+ thrownError);

          console.log(jqXHR);
          console.log(ajaxOptions);
          console.log(thrownError);
        }
      });

    }

    $timeout(function() {
      //ionic.material.ink.displayEffect();
      ionicMaterialInk.displayEffect();
    }, 0);
  };
});
