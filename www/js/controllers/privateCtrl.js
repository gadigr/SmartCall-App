app.controller('privateCtrl', function ($scope, $ionicPopup, $stateParams, ionicMaterialInk, $timeout, ClientsService) {

  ionicMaterialInk.displayEffect();

  $scope.images = [];
  console.log('cont');
  ClientsService.getData(function (data) {
    $scope.items = data;

    console.log($scope.items);
  });


  $scope.$on('ngLastRepeat.clientlist',function(e) {
    $scope.materialize();
  });

  $scope.materialize = function(){
    $timeout(function(){
      ionicMaterialInk.displayEffect();
    },0);
  };

  $scope.showPopup = function(item) {
    var alertPopup = $ionicPopup.alert({
      title: item.name,
      subTitle: "<img src=\'" + item.image +"\' />",
      templateUrl: "popupTemplate.html",
      buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
        text: 'חזור',
        type: 'button-default',
        onTap: function(e) {
          // e.preventDefault() will stop the popup from closing when tapped.
          //e.preventDefault();
        }
      }]
    });

    $timeout(function() {
      //ionic.material.ink.displayEffect();
      ionicMaterialInk.displayEffect();
    }, 0);
  };
});
