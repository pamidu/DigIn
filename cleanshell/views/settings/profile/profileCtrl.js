DiginApp.controller('profileCtrl',[ '$scope','$mdDialog', function ($scope,$mdDialog){
	
	$scope.$parent.currentView = "Settings";
		
	$scope.editModeOn = false;
	$scope.profile_pic = "images/settings/new_user.png";
	
	$scope.profile = (function () {
		return {
			clickEdit: function () {
				$scope.editModeOn = true;
			},
			changeUserProfile: function (){
				console.log($scope.user);
				$scope.editModeOn = true;
				//$scope.updateProfileData();
			},
			cancel: function (){
				console.log($scope.user);
			},
			changePassword: function (ev) {
				$mdDialog.show({
				  controller: "changePasswordCtrl",
				  templateUrl: 'views/settings/profile/change-password.html',
				  parent: angular.element(document.body),
				  targetEvent: ev,
				  clickOutsideToClose:true
				})
				.then(function(answer) {
				})
			},
			uploadProfilePicture: function(ev)
			{
				$mdDialog.show({
				  controller: "uploadProfilePictureCtrl",
				  templateUrl: 'views/settings/profile/uploadProfilePicture.html',
				  parent: angular.element(document.body),
				  targetEvent: ev,
				  clickOutsideToClose:true
				})
				.then(function(answer) {
				})
			},
			closeSetting: function () {
				$state.go('home');
			}
		};
    })();
	
}])

DiginApp.controller('changePasswordCtrl',['$scope','$mdDialog','$http','notifications' ,function ($scope,$mdDialog,$http,notifications) {

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.submit = function()
  {
	   
        if ($scope.newPassword === $scope.confirmNewPassword) {

            console.log(window.location.host + '/auth/ChangePassword/' + encodeURIComponent($scope.oldPassword) + '/' + encodeURIComponent($scope.newPassword));
            $http.get('/auth/ChangePassword/' + encodeURIComponent($scope.oldPassword) + '/' + encodeURIComponent($scope.newPassword))
                .success(function (data) {

                    if (data == "true") {
						console.log("Passoword Successfully Changed");
                        notifications.toast("Passoword Successfully Changed", "success");
                        $mdDialog.hide();
                    } else {
						console.log("Error");
                        notifications.toast(data, "error");
                    }

                }).error(function () {
					console.log("Error occurred while changing the password");
                    notifications.toast("Error occurred while changing the password", "error", 3000);
                });

        } else {
            notifications.toast("New Password Confirmation invalid", "error", 4000);
        }
		//$mdDialog.hide($scope.email);
  }
}])

DiginApp.controller('uploadProfilePictureCtrl',['$scope','$mdDialog','$http','notifications' ,function ($scope,$mdDialog,$http,notifications) {
	
	$scope.fileChanged = function(e)
	{
		if( !e ) e = window.event;
		var x = e.target||e.srcElement;
		
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onload = function(){
			$scope.theImage1 = reader.result;
			$scope.$apply();
		};
		reader.readAsDataURL(file);
	}
	
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
	$scope.submit = function()
	{
		var profileImg = document.getElementById('profileImg');
		var profileImgSrc = someimage.src;
		console.log(profileImgSrc);
	}
}])