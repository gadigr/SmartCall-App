app.controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout, $ionicHistory) {
    // Form data for the login modal
    $scope.loginData = {};

	$scope.contact = function() {
		if(window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                console.log("Response -> " + result);
            }, 
            "משוב על אפליקציית סמארט-קליק", // Subject
            "",                      // Body
            ["eli@afikim-c.co.il"],    // To
            null,                    // CC
            null,                    // BCC
            false,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
        }
	};
	
    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    };

});
