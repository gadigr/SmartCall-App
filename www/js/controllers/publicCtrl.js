app.controller('publicCtrl', function ($scope, $rootScope, $ionicPopup, $state, ionicMaterialInk, $timeout, ClientsService, $localStorage) {

  ionicMaterialInk.displayEffect();

  $scope.search = {};

  $scope.addPrivateApp = function() {
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

  $scope.timePickerObject = {
    inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
    step: 15,  //Optional
    format: 24,  //Optional
    titleLabel: 'בחירת שעה',  //Optional
    setLabel: 'בחר',  //Optional
    closeLabel: 'חזור',  //Optional
    setButtonType: 'button-positive',  //Optional
    closeButtonType: 'button-stable',  //Optional
    callback: function (val) {    //Mandatory
      if (val) {
        time =  new Date(val * 1000);
        var dt  = Date.parse( $scope.selectedDate)
        dt.set({hour: time.getUTCHours(), minute: time.getUTCMinutes()});
        console.log(dt);
        $scope.sendDetails(dt);
      }
      else {
        $rootScope.$broadcast('showDatePopup',{});
      }
    }
  };

  $scope.datepickerObject = {
    titleLabel: 'בחירת תאריך',  //Optional
    todayLabel: 'היום',  //Optional
    closeLabel: 'חזור',  //Optional
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
    from: Date.today().setTimeToNow().add({days:-1}), //Optional
    callback: function (val) {  //Mandatory
      if (val){
        $scope.selectedDate = val;
        console.log($scope.selectedDate);
        $rootScope.$broadcast('showTimePopup',{});
      }
      else {
        return ;
      }
    },
    dateFormat: 'dd-MM-yyyy', //Optional
    closeOnSelect: false, //Optional
  };

  ClientsService.getData(function (data) {
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
	source = item.image ? item.image : '../img/phone.png';
    $scope.TenantsPopup = $ionicPopup.alert({
      title: item.name,
	  subTitle: "<img src=\'" + source +"\' />",
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
      $scope.now = Date.today().setTimeToNow();
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

          alert('הבקשה התקבלה - נחזור אליך בהקדם');

        },
        error: function (jqXHR, ajaxOptions, thrownError) {
          //alert('שגיאה:\r\n' + jqXHR.responseText);
          //alert('2: '+ ajaxOptions);
          //alert('3: '+ thrownError);

          alert('התרחשה שגיאה - אנא נסה שנית מאוחר יותר');
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
      //ionic.material.ink.displayEffect();
      ionicMaterialInk.displayEffect();
    }, 0);
  };
});
