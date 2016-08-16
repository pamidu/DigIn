/**
 * Created by Damith on 7/26/2016.
 */

routerApp.controller('userProfileCtrl', function ($scope,$rootScope, $state, $mdDialog,notifications,profile,$http) {

    console.log('user profile ctrl load');
    var baseUrl = "http://" + window.location.hostname;
	
    //profile view mode
    $scope.intProfile=function(){
        profile.getProfile();
    };

    $scope.editModeOn = true;
	
    	$scope.user = {
            name:  $rootScope.profile_Det.Name,
            company:  $rootScope.profile_Det.Company, 
            email: $rootScope.profile_Det.Email,
            contactNo: $rootScope.profile_Det.PhoneNumber,
            street: $rootScope.profile_Det.BillingAddress,
            country: $rootScope.profile_Det.Country,
            zip: $rootScope.profile_Det.ZipCode
        };

        $scope.closeWindow=function(){
            $state.go('home.welcomeSearch');
        };


        $scope.updateProfileData= function () {
          
            $scope.userProfile ={
                 "BannerPicture":"img/cover.png",
                 "BillingAddress":$scope.user.street,
                 "Company":$scope.user.company,
                 "Country":$scope.user.country,
                 "Email":$scope.user.email,
                 "Name":$scope.user.name,
                 "PhoneNumber":$scope.user.contactNo,
                 "ZipCode":$scope.user.zip
            };
        

            $http({
                method: 'POST',
                url:'http://omalduosoftwarecom.prod.digin.io/apis/profile/userprofile',
                //url: baseUrl+'/apis/profile/userprofile',
                data: angular.toJson($scope.userProfile),
                headers: {
                     'Content-Type': 'application/json',
                }
            }).success(function (data) {
                $scope.error.isLoading = false;
                console.log(data);
 
                if(data.IsSuccess==false){
                    notifications.toast('0', 'Fail to update user profile.');
                }
                else
                {
                    notifications.toast('1', 'User profile updated successfully.');
                    $scope.frmProfile.$setUntouched();
                    profile.getProfile();
                }
                
            }).error(function (data) {
                $scope.error.isLoading = false;            
            });
        };


	
    $scope.profile = (function () {
        return {
            clickEdit: function () {
                $scope.editModeOn = false;
            },
			changeUserProfile: function (){
				console.log($scope.user);
				$scope.editModeOn = true;
                $scope.updateProfileData();
			},
            changePassword: function (ev) {
                $mdDialog.show({
				  controller: "changePasswordCtrl",
				  templateUrl: 'views/profile-settings/change-password.html',
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
				  templateUrl: 'views/profile-settings/uploadProfilePicture.html',
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
        }
    })();

    //UI animation
	
    var uiAnimation = (function () {
        return {
            openEditPanel: function (id, status) {
                $(id).animate({
                    opacity: '1'
                })
            },
            closeEditPanel: function (id, status) {
                $(id).animate({
                    opacity: '0'
                })
            }
        }
    })();


});

routerApp.controller('changePasswordCtrl',['$scope','$mdDialog','$http','notifications' ,function ($scope,$mdDialog,$http,notifications) {

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

routerApp.controller('uploadProfilePictureCtrl',['$scope','$mdDialog','$http','notifications' ,function ($scope,$mdDialog,$http,notifications) {
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
	$scope.submit = function()
	{
		
	}
}])

//Password Strength Directive - Start
routerApp.directive('passwordStrengthIndicator',passwordStrengthIndicator);

function passwordStrengthIndicator() {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs, ngModel) {

        	scope.strengthText = "";

            var strength = {
                measureStrength: function (p) {
                    var _passedMatches = 0;
                    var _regex = /[$@&+#-/:-?{-~!^_`\[\]]/g;
                    if (/[a-z]+/.test(p)) {
                        _passedMatches++;
                    }
                    if (/[A-Z]+/.test(p)) {
                        _passedMatches++;
                    }
                    if (_regex.test(p)) {
                        _passedMatches++;
                    }
                    return _passedMatches;
                }
            };

            var indicator = element.children();
            var dots = Array.prototype.slice.call(indicator.children());
            var weakest = dots.slice(-1)[0];
            var weak = dots.slice(-2);
            var strong = dots.slice(-3);
            var strongest = dots.slice(-4);

            element.after(indicator);

            var listener = scope.$watch('ngModel', function (newValue) {
                angular.forEach(dots, function (el) {
                    el.style.backgroundColor = '#EDF0F3';
                });
                if (ngModel.$modelValue) {
                    var c = strength.measureStrength(ngModel.$modelValue);
                    if (ngModel.$modelValue.length > 7 && c > 2) {
                        angular.forEach(strongest, function (el) {
                            el.style.backgroundColor = '#039FD3';
                            scope.strengthText = "is very strong";
                        });
                   
                    } else if (ngModel.$modelValue.length > 5 && c > 1) {
                        angular.forEach(strong, function (el) {
                            el.style.backgroundColor = '#72B209';
                            scope.strengthText = "is strong";
                        });
                    } else if (ngModel.$modelValue.length > 3 && c > 0) {
                        angular.forEach(weak, function (el) {
                            el.style.backgroundColor = '#E09015';
                            scope.strengthText = "is weak";
                        });
                    } else {
                        weakest.style.backgroundColor = '#D81414';
                        scope.strengthText = "is very weak";
                    }
                }
            });

            scope.$on('$destroy', function () {
                return listener();
            });
        },
        template: '<span id="password-strength-indicator"><span></span><span></span><span></span><span></span><md-tooltip>password strength {{strengthText}}</md-tooltip></span>'
    };
}
//Password Strength Directive - End


window.directiveResources = {};
	

    
routerApp.service('notifications',['ngToast','$mdDialog', function(ngToast,$mdDialog){

    this.toast=function (msgType, content) {
        ngToast.dismiss();
        var _className;
        if (msgType == '0') {
            _className = 'danger';
        } else if (msgType == '1') {
            _className = 'success';
        }
        ngToast.create({
            className: _className,
            content: content,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            dismissOnClick: true,
            dismissButton:true
        });
    }
	
	this.alertDialog = function(title, content){
		$mdDialog.show(
		  $mdDialog.alert()
			.parent(angular.element(document.querySelector('input[name="editForm"]')))
			.clickOutsideToClose(true)
			.title(title)
			.textContent(content)
			.ariaLabel('Alert Dialog Demo')
			.ok('Got it!')
		);
	}
	
	this.startLoading = function(displayText) {
		$mdDialog.show({
		  template: 
			'<md-dialog ng-cloak style="max-width:400px;">'+
			'	<md-dialog-content style="padding:20px;">'+
			'		<div layout="row" layout-align="start center">'+
			'			<md-progress-circular class="md-accent" md-mode="indeterminate" md-diameter="40" style=" padding-right: 45px"></md-progress-circular>'+
			'			<span style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;">'+displayText+'</span>'+
			'		</div>'+
			'	</md-dialog-content>'+
			'</md-dialog>',
		  parent: angular.element(document.body),
		  clickOutsideToClose:false
		})
	}
	this.finishLoading = function(){
		$mdDialog.hide();
	}
}]);


routerApp.service('profile',['$rootScope','$http', function($rootScope,$http){

    this.getProfile = function() {
        var baseUrl = "http://" + window.location.hostname;
        $http.get('http://omalduosoftwarecom.prod.digin.io/apis/profile/userprofile/omal@duosoftware.com') 
        //$http.get(baseUrl+'/apis/profile/userprofile/'+$scope.username)
            .success(function(response){
                console.log(response);
                //#load exisitging data
                $rootScope.profile_Det=response;
                $rootScope.address=response.BillingAddress;
                $rootScope.company=response.Company;
                $rootScope.country=response.Country;
                $rootScope.email=response.Email;
                $rootScope.name=response.Name;
                $rootScope.phoneNo=response.PhoneNumber;
                $rootScope.zipCode=response.ZipCode;
        }).
        error(function(error){   
        });  
    }


}]);