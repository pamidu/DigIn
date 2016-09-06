/**
 * Created by Damith on 7/26/2016.
 */

routerApp.controller('userProfileCtrl', function ($scope,$rootScope, $state, $mdDialog,notifications,profile,$http, Upload,
                                                     Digin_Domain, Digin_Tenant,$mdDialog, $location,Digin_Engine_API, $apps,ProfileService) {

    console.log('user profile ctrl load');
    var baseUrl = "http://" + window.location.hostname;
	
    //*Profile picture
    $scope.selectImage=false;
    $scope.selectProfile=true;


    //profile view mode
    $scope.intProfile=function(){
        profile.getProfile();
    };

	
	$scope.closeWindow = function(){
		$state.go('home.welcomeSearch');
	}

     //#pre-loader progress - with message
    var displayProgress = function (message) {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>'+message+'</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>'
            , parent: angular.element(document.body)
            , clickOutsideToClose: false
        });
    };


    $scope.selectProfileImg = function () {
        $scope.selectProfile=false;
        $scope.selectImage=true;
    };


    $rootScope.myImage='';
    $scope.myCroppedImage='';

    var handleFileSelect=function(evt) {

          var file=evt.currentTarget.files[0];
          console.log(file);
          var reader = new FileReader();
          reader.onload = function (evt) {
            $scope.$apply(function($scope){
                $rootScope.myImage=evt.target.result;
                $rootScope.file=file;
            });
          };
          reader.readAsDataURL(file);  
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);


    //#conver dataURL into base64
    function base64ToBlob(base64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = 1024;
        var byteCharacters = atob(base64Data);
        var bytesLength = byteCharacters.length;
        var slicesCount = Math.ceil(bytesLength / sliceSize);
        var byteArrays = new Array(slicesCount);

        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);

            var bytes = new Array(end - begin);
            for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    };


    //#validate image saving and call saving function
    $scope.saveImage = function () {
        if($rootScope.file==undefined){
            notifications.toast('0', 'Please select profile picture to upload.');
        }
        else{
            //*Croped image
                var name=$rootScope.file.name;
                var file = base64ToBlob($scope.myCroppedImage.replace('data:image/png;base64,',''), 'image/jpeg');
                file.name=name;
                //uploader.addToQueue(file);
                $scope.upload(file);

            //*Original image
                //$scope.upload($rootScope.file);
                //$scope.upload();

            $scope.selectProfile=true;
            $scope.selectImage=false;
        }          
    };


    $scope.cancelImage = function () {
        $scope.selectProfile=true;
        $scope.selectImage=false;       
    };



    //#Function to save profile image
    $scope.upload = function (file) {
        displayProgress('Uploading...');
        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
        Upload.upload({
            url: Digin_Engine_API + 'file_upload',
            headers: {'Content-Type': 'multipart/form-data',},
            data: {
                db: 'BigQuery',
                SecurityToken: userInfo.SecurityToken,
                Domain: Digin_Domain,
                other_data:'dp',
                file: file
            }
        }).success(function (data) {

            //#chk undefined values
            var dp_name="";
            var logo_name="";
            var components; var userRole; var cacheLifetime; var widgetLimit; var themeConfig; var queryLimit;
            if($rootScope.userSettings.components==undefined) {components=0;} else {components=$rootScope.userSettings.components}
            if($rootScope.userSettings.user_role==undefined) {userRole="";} else {userRole=$rootScope.userSettings.user_role}
            if($rootScope.userSettings.cache_lifetime==undefined) {cacheLifetime=0;} else {cacheLifetime=$rootScope.userSettings.cache_lifetime}
            if($rootScope.userSettings.widget_limit==undefined) {widgetLimit=0;} else {widgetLimit=$rootScope.userSettings.widget_limit}
            if($rootScope.userSettings.query_limit==undefined) {queryLimit=0;} else {queryLimit=$rootScope.userSettings.query_limit}
            if($rootScope.userSettings.dp_path==undefined) {dp_name="";} else {dp_name=$rootScope.userSettings.dp_path.split("/").pop();}
            if($rootScope.userSettings.logo_path==undefined) {logo_name="";} else {logo_name=$rootScope.userSettings.logo_path.split("/").pop();}
            if($rootScope.userSettings.theme_config==undefined) {themeConfig="";} else {themeConfig=$rootScope.userSettings.theme_config}     
                 

            //#store to user settings---------------------
            $scope.settings = {
                "email": userInfo.Email,
                "components": components,
                "user_role":userRole,
                "cache_lifetime":cacheLifetime,
                "widget_limit": widgetLimit,
                "query_limit": queryLimit,
                "logo_name": logo_name,
                "dp_name" : file.name,
                "theme_config": themeConfig
                // "SecurityToken": userInfo.SecurityToken,
                // "Domain": Digin_Domain
            }

            $http({
                method: 'POST',
                url: Digin_Engine_API + 'store_user_settings/',
                data: angular.toJson($scope.settings),
                headers: {
                    'Content-Type': 'application/json',
                    'SecurityToken': userInfo.SecurityToken
                    //'Domain': Digin_Domain
                }
            })
                .success(function (response) {
                    $http.get(Digin_Engine_API + 'get_user_settings?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain)
                        .success(function (data) {
                            console.log(data);
                            $rootScope.userSettings=data.Result;
                            var logoPath = Digin_Engine_API.split(":")[0] + ":" + Digin_Engine_API.split(":")[1];
                            $scope.profile_pic = logoPath + data.Result.dp_path;
                            $rootScope.profile_pic = logoPath + data.Result.dp_path;
                            ProfileService.UserDataArr.BannerPicture= $rootScope.profile_pic;
                            $scope.getURL();
                            $mdDialog.hide();
                            notifications.toast('1', 'Profile picture uploaded successfully.');
                        });
                })
                .error(function (data) {
                    $scope.profile_pic = "styles/css/images/setting/user100x100.png";
                    $rootScope.profile_pic = "styles/css/images/setting/user100x100.png";
                    ProfileService.UserDataArr.BannerPicture= $rootScope.profile_pic;
                    $mdDialog.hide();
                    notifications.toast('0', 'There was an error while uploading profile picture !');
                });
        });

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
          var baseUrl = "http://" + window.location.hostname;
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
                //url:'http://omalduosoftwarecom.prod.digin.io/apis/profile/userprofile',
                url: baseUrl+'/apis/profile/userprofile',
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
    				// $mdDialog.show({
    				//   controller: "uploadProfilePictureCtrl",
    				//   templateUrl: 'views/profile-settings/uploadProfilePicture.html',
    				//   parent: angular.element(document.body),
    				//   targetEvent: ev,
    				//   clickOutsideToClose:true
    				// })
    				// .then(function(answer) {
    				// })
                     $scope.selectProfile=false;
                     $scope.selectImage=true;

    			},
                closeSetting: function () {
                    $state.go('home');
                }
        };



   







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
					
					try{
						data = data.replace(/(\r\n|\n|\r)/gm,"");
					}catch(exception){} //The true or false comes with a linebreak therefore this is to remove the linebreak if it exisit
					
					console.log(data);
                    if (data == "true") {
						console.log("Passoword Successfully Changed");
                        notifications.toast(1,"Passoword Successfully Changed");
                        $mdDialog.hide();
                    } else {
                        notifications.toast(0, data.Message);
                    }

                }).error(function () {
					console.log("Error occurred while changing the password");
                    notifications.toast(0, "Error occurred while changing the password");
                });

        } else {
            notifications.toast(0, "New Password Confirmation invalid");
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


routerApp.service('profile',['$rootScope','$http','ProfileService', function($rootScope,$http,ProfileService){

    this.getProfile = function() {
        var baseUrl = "http://" + window.location.hostname;
        //$http.get('http://omalduosoftwarecom.prod.digin.io/apis/profile/userprofile/omal@duosoftware.com') 
        $http.get(baseUrl+'/apis/profile/userprofile/'+$rootScope.profile_Det.Email)
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
                response.BannerPicture=ProfileService.UserDataArr.BannerPicture;
                ProfileService.InitProfileData(response);

        }).
        error(function(error){   
        });  
    }


}]);