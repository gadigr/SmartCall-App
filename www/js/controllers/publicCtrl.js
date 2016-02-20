app.controller('publicCtrl', function ($scope, $ionicPopup, $state, ionicMaterialInk, $timeout, ClientsService, $localStorage) {

  ionicMaterialInk.displayEffect();

  $scope.search = {};
  
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
  
  $scope.datepickerObject = {
    titleLabel: 'בחירת תאריך',  //Optional
    todayLabel: 'היום',  //Optional
    closeLabel: 'סגור',  //Optional
    setLabel: 'בחר',  //Optional
    setButtonType : 'button-assertive',  //Optional
    todayButtonType : 'button-assertive',  //Optional
    closeButtonType : 'button-assertive',  //Optional
    inputDate: new Date(),  //Optional
    mondayFirst: false,  //Optional
    weekDaysList: ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"], //Optional
    monthList: ["יאנ", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"], //Optional
    templateType: 'popup', //Optional
    showTodayButton: 'true', //Optional
    modalHeaderColor: 'bar-positive', //Optional
    modalFooterColor: 'bar-positive', //Optional
    from: new Date(), //Optional
    callback: function (val) {  //Mandatory
      $scope.selectedDate = val;פ
    },
    dateFormat: 'dd-MM-yyyy', //Optional
    closeOnSelect: false, //Optional
  };

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
    $scope.TenantsPopup = $ionicPopup.alert({
      title: item.name,
      subTitle: "<img src=\'" + item.image +"\' />",
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

    $scope.showTimePopup = function(item) {
      $scope.now = Date.today().setTimeToNow();;
      console.log($scope.now);
      $scope.selectedTenant = item;
      $scope.displayEffect =  ionicMaterialInk.displayEffect;
      $scope.TimePopup = $ionicPopup.alert({
        title: $scope.selectedApp.name + " - " + item.name,
        subTitle: "מתי לחזור אליך?",
        templateUrl: "popupTimeTemplate.html",
        scope: $scope,
        buttons: [{
          text: 'חזור',
          type: 'button-default',
          onTap: function (e) {
            $scope.selectedTenant = {};
          }
        }]
      });
    }

      $scope.sendDetails = function(selectedTime){
        if($scope.TimePopup){
          $scope.TimePopup.close();
          $scope.TenantsPopup.close();
        }

      //var phone = $localStorage.myAppData.phone;
      console.log(selectedTime);
      var phone = "0525675119";
      var xmlData = "<XmlTemplate><WebServiceURL>https://sec-phoneplus.com/DistributionWebService/DialerDistribution.asmx/ImportFromXml</WebServiceURL><TenantID>"+$scope.selectedTenant.tenantID+"</TenantID><TenantName>"+$scope.selectedTenant.name+"</TenantName><ApplicationID>"+$scope.selectedApp.appID+"</ApplicationID><ApplicationVersion>1</ApplicationVersion><ApplicationName>"+$scope.selectedApp.name+"</ApplicationName><SecID>"+$scope.selectedTenant.secID+"</SecID><DialerRequestTime>"+selectedTime.toString('yyyy-MM-dd HH:mm:ss')+"</DialerRequestTime><PhoneNum>" + phone + "</PhoneNum><PhoneNum2></PhoneNum2><PhoneNum3></PhoneNum3><AgentExtNumber></AgentExtNumber><Info1></Info1><Info2></Info2><Info3></Info3><Info4></Info4><Info5></Info5></XmlTemplate>";
      console.log(xmlData);

      $.ajax({
        type: "POST",
        url: 'https://sec-phoneplus.com/DistributionWebService/DialerDistribution.asmx/ImportFromXml',
        data: xmlData,
        success: function (jqXHR) {
          alert('Success');
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
          //alert('שגיאה:\r\n' + jqXHR.responseText);
          //alert('2: '+ ajaxOptions);
          //alert('3: '+ thrownError);

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
