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

      if($scope.user.name=="" || $scope.user.name==undefined){
        notifications.toast('0', 'Invalid user name.');
      }
      else if($scope.user.company=="" || $scope.user.company==undefined){
        notifications.toast('0', 'Invalid company name.');
      }
      else if($scope.user.contactNo=="" || $scope.user.contactNo==undefined){
        notifications.toast('0', 'Contact number can not be a blank.');
      }
      else{
        $scope.userProfile ={
           "BannerPicture":"img/cover.png",
           "BillingAddress":$scope.user.street,
           "Company":$scope.user.company,
           "Country":$scope.user.country.name,
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
      }  

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


  
  
  $scope.allCountries = [
      {
        code: 'AF',
        name: 'Afghanistan'
      }, {
        code: 'AL',
        name: 'Albania'
      }, {
        code: 'DZ',
        name: 'Algeria'
      }, {
        code: 'AS',
        name: 'American Samoa'
      }, {
        code: 'AD',
        name: 'Andorre'
      }, {
        code: 'AO',
        name: 'Angola'
      }, {
        code: 'AI',
        name: 'Anguilla'
      }, {
        code: 'AQ',
        name: 'Antarctica'
      }, {
        code: 'AG',
        name: 'Antigua and Barbuda'
      }, {
        code: 'AR',
        name: 'Argentina'
      }, {
        code: 'AM',
        name: 'Armenia'
      }, {
        code: 'AW',
        name: 'Aruba'
      }, {
        code: 'AU',
        name: 'Australia'
      }, {
        code: 'AT',
        name: 'Austria'
      }, {
        code: 'AZ',
        name: 'Azerbaijan'
      }, {
        code: 'BS',
        name: 'Bahamas'
      }, {
        code: 'BH',
        name: 'Bahrain'
      }, {
        code: 'BD',
        name: 'Bangladesh'
      }, {
        code: 'BB',
        name: 'Barbade'
      }, {
        code: 'BY',
        name: 'Belarus'
      }, {
        code: 'BE',
        name: 'Belgium'
      }, {
        code: 'BZ',
        name: 'Belize'
      }, {
        code: 'BJ',
        name: 'Benin'
      }, {
        code: 'BM',
        name: 'Bermuda'
      }, {
        code: 'BT',
        name: 'Bhutan'
      }, {
        code: 'BO',
        name: 'Bolivia'
      }, {
        code: 'BQ',
        name: 'Bonaire, Sint Eustatius and Saba'
      }, {
        code: 'BA',
        name: 'Bosnia and Herzegovina'
      }, {
        code: 'BW',
        name: 'Botswana'
      }, {
        code: 'BV',
        name: 'Bouvet Island'
      }, {
        code: 'BR',
        name: 'Brazil'
      }, {
        code: 'IO',
        name: 'British Indian Ocean Territory'
      }, {
        code: 'VG',
        name: 'British Virgin Islands'
      }, {
        code: 'BN',
        name: 'Brunei'
      }, {
        code: 'BG',
        name: 'Bulgaria'
      }, {
        code: 'BF',
        name: 'Burkina Faso'
      }, {
        code: 'BI',
        name: 'Burundi'
      }, {
        code: 'KH',
        name: 'Cambodia'
      }, {
        code: 'CM',
        name: 'Cameroon'
      }, {
        code: 'CA',
        name: 'Canada'
      }, {
        code: 'CV',
        name: 'Cape Verde'
      }, {
        code: 'KY',
        name: 'Cayman Islands'
      }, {
        code: 'CF',
        name: 'Central African Republic'
      }, {
        code: 'TD',
        name: 'Chad'
      }, {
        code: 'CL',
        name: 'Chile'
      }, {
        code: 'CN',
        name: 'China'
      }, {
        code: 'CX',
        name: 'Christmas Island'
      }, {
        code: 'CC',
        name: 'Cocos (Keeling) Islands'
      }, {
        code: 'CO',
        name: 'Colombia'
      }, {
        code: 'KM',
        name: 'Comoros'
      }, {
        code: 'CG',
        name: 'Congo'
      }, {
        code: 'CD',
        name: 'Congo (Dem. Rep.)'
      }, {
        code: 'CK',
        name: 'Cook Islands'
      }, {
        code: 'CR',
        name: 'Costa Rica'
      }, {
        code: 'ME',
        name: 'Crna Gora'
      }, {
        code: 'HR',
        name: 'Croatia'
      }, {
        code: 'CU',
        name: 'Cuba'
      }, {
        code: 'CW',
        name: 'Curaçao'
      }, {
        code: 'CY',
        name: 'Cyprus'
      }, {
        code: 'CZ',
        name: 'Czech Republic'
      }, {
        code: 'CI',
        name: "Côte D'Ivoire"
      }, {
        code: 'DK',
        name: 'Denmark'
      }, {
        code: 'DJ',
        name: 'Djibouti'
      }, {
        code: 'DM',
        name: 'Dominica'
      }, {
        code: 'DO',
        name: 'Dominican Republic'
      }, {
        code: 'TL',
        name: 'East Timor'
      }, {
        code: 'EC',
        name: 'Ecuador'
      }, {
        code: 'EG',
        name: 'Egypt'
      }, {
        code: 'SV',
        name: 'El Salvador'
      }, {
        code: 'GQ',
        name: 'Equatorial Guinea'
      }, {
        code: 'ER',
        name: 'Eritrea'
      }, {
        code: 'EE',
        name: 'Estonia'
      }, {
        code: 'ET',
        name: 'Ethiopia'
      }, {
        code: 'FK',
        name: 'Falkland Islands'
      }, {
        code: 'FO',
        name: 'Faroe Islands'
      }, {
        code: 'FJ',
        name: 'Fiji'
      }, {
        code: 'FI',
        name: 'Finland'
      }, {
        code: 'FR',
        name: 'France'
      }, {
        code: 'GF',
        name: 'French Guiana'
      }, {
        code: 'PF',
        name: 'French Polynesia'
      }, {
        code: 'TF',
        name: 'French Southern Territories'
      }, {
        code: 'GA',
        name: 'Gabon'
      }, {
        code: 'GM',
        name: 'Gambia'
      }, {
        code: 'GE',
        name: 'Georgia'
      }, {
        code: 'DE',
        name: 'Germany'
      }, {
        code: 'GH',
        name: 'Ghana'
      }, {
        code: 'GI',
        name: 'Gibraltar'
      }, {
        code: 'GR',
        name: 'Greece'
      }, {
        code: 'GL',
        name: 'Greenland'
      }, {
        code: 'GD',
        name: 'Grenada'
      }, {
        code: 'GP',
        name: 'Guadeloupe'
      }, {
        code: 'GU',
        name: 'Guam'
      }, {
        code: 'GT',
        name: 'Guatemala'
      }, {
        code: 'GG',
        name: 'Guernsey and Alderney'
      }, {
        code: 'GN',
        name: 'Guinea'
      }, {
        code: 'GW',
        name: 'Guinea-Bissau'
      }, {
        code: 'GY',
        name: 'Guyana'
      }, {
        code: 'HT',
        name: 'Haiti'
      }, {
        code: 'HM',
        name: 'Heard and McDonald Islands'
      }, {
        code: 'HN',
        name: 'Honduras'
      }, {
        code: 'HK',
        name: 'Hong Kong'
      }, {
        code: 'HU',
        name: 'Hungary'
      }, {
        code: 'IS',
        name: 'Iceland'
      }, {
        code: 'IN',
        name: 'India'
      }, {
        code: 'ID',
        name: 'Indonesia'
      }, {
        code: 'IR',
        name: 'Iran'
      }, {
        code: 'IQ',
        name: 'Iraq'
      }, {
        code: 'IE',
        name: 'Ireland'
      }, {
        code: 'IM',
        name: 'Isle of Man'
      }, {
        code: 'IL',
        name: 'Israel'
      }, {
        code: 'IT',
        name: 'Italy'
      }, {
        code: 'JM',
        name: 'Jamaica'
      }, {
        code: 'JP',
        name: 'Japan'
      }, {
        code: 'JE',
        name: 'Jersey'
      }, {
        code: 'JO',
        name: 'Jordan'
      }, {
        code: 'KZ',
        name: 'Kazakhstan'
      }, {
        code: 'KE',
        name: 'Kenya'
      }, {
        code: 'KI',
        name: 'Kiribati'
      }, {
        code: 'KP',
        name: 'Korea (North)'
      }, {
        code: 'KR',
        name: 'Korea (South)'
      }, {
        code: 'KW',
        name: 'Kuwait'
      }, {
        code: 'KG',
        name: 'Kyrgyzstan'
      }, {
        code: 'LA',
        name: 'Laos'
      }, {
        code: 'LV',
        name: 'Latvia'
      }, {
        code: 'LB',
        name: 'Lebanon'
      }, {
        code: 'LS',
        name: 'Lesotho'
      }, {
        code: 'LR',
        name: 'Liberia'
      }, {
        code: 'LY',
        name: 'Libya'
      }, {
        code: 'LI',
        name: 'Liechtenstein'
      }, {
        code: 'LT',
        name: 'Lithuania'
      }, {
        code: 'LU',
        name: 'Luxembourg'
      }, {
        code: 'MO',
        name: 'Macao'
      }, {
        code: 'MK',
        name: 'Macedonia'
      }, {
        code: 'MG',
        name: 'Madagascar'
      }, {
        code: 'MW',
        name: 'Malawi'
      }, {
        code: 'MY',
        name: 'Malaysia'
      }, {
        code: 'MV',
        name: 'Maldives'
      }, {
        code: 'ML',
        name: 'Mali'
      }, {
        code: 'MT',
        name: 'Malta'
      }, {
        code: 'MH',
        name: 'Marshall Islands'
      }, {
        code: 'MQ',
        name: 'Martinique'
      }, {
        code: 'MR',
        name: 'Mauritania'
      }, {
        code: 'MU',
        name: 'Mauritius'
      }, {
        code: 'YT',
        name: 'Mayotte'
      }, {
        code: 'MX',
        name: 'Mexico'
      }, {
        code: 'FM',
        name: 'Micronesia'
      }, {
        code: 'MD',
        name: 'Moldova'
      }, {
        code: 'MC',
        name: 'Monaco'
      }, {
        code: 'MN',
        name: 'Mongolia'
      }, {
        code: 'MS',
        name: 'Montserrat'
      }, {
        code: 'MA',
        name: 'Morocco'
      }, {
        code: 'MZ',
        name: 'Mozambique'
      }, {
        code: 'MM',
        name: 'Myanmar'
      }, {
        code: 'NA',
        name: 'Namibia'
      }, {
        code: 'NR',
        name: 'Nauru'
      }, {
        code: 'NP',
        name: 'Nepal'
      }, {
        code: 'NL',
        name: 'Netherlands'
      }, {
        code: 'AN',
        name: 'Netherlands Antilles'
      }, {
        code: 'NC',
        name: 'New Caledonia'
      }, {
        code: 'NZ',
        name: 'New Zealand'
      }, {
        code: 'NI',
        name: 'Nicaragua'
      }, {
        code: 'NE',
        name: 'Niger'
      }, {
        code: 'NG',
        name: 'Nigeria'
      }, {
        code: 'NU',
        name: 'Niue'
      }, {
        code: 'NF',
        name: 'Norfolk Island'
      }, {
        code: 'MP',
        name: 'Northern Mariana Islands'
      }, {
        code: 'NO',
        name: 'Norway'
      }, {
        code: 'OM',
        name: 'Oman'
      }, {
        code: 'PK',
        name: 'Pakistan'
      }, {
        code: 'PW',
        name: 'Palau'
      }, {
        code: 'PS',
        name: 'Palestine'
      }, {
        code: 'PA',
        name: 'Panama'
      }, {
        code: 'PG',
        name: 'Papua New Guinea'
      }, {
        code: 'PY',
        name: 'Paraguay'
      }, {
        code: 'PE',
        name: 'Peru'
      }, {
        code: 'PH',
        name: 'Philippines'
      }, {
        code: 'PN',
        name: 'Pitcairn'
      }, {
        code: 'PL',
        name: 'Poland'
      }, {
        code: 'PT',
        name: 'Portugal'
      }, {
        code: 'PR',
        name: 'Puerto Rico'
      }, {
        code: 'QA',
        name: 'Qatar'
      }, {
        code: 'RO',
        name: 'Romania'
      }, {
        code: 'RU',
        name: 'Russia'
      }, {
        code: 'RW',
        name: 'Rwanda'
      }, {
        code: 'RE',
        name: 'Réunion'
      }, {
        code: 'BL',
        name: 'Saint Barthélemy'
      }, {
        code: 'SH',
        name: 'Saint Helena'
      }, {
        code: 'KN',
        name: 'Saint Kitts and Nevis'
      }, {
        code: 'LC',
        name: 'Saint Lucia'
      }, {
        code: 'MF',
        name: 'Saint Martin'
      }, {
        code: 'PM',
        name: 'Saint Pierre and Miquelon'
      }, {
        code: 'VC',
        name: 'Saint Vincent and the Grenadines'
      }, {
        code: 'WS',
        name: 'Samoa'
      }, {
        code: 'SM',
        name: 'San Marino'
      }, {
        code: 'SA',
        name: 'Saudi Arabia'
      }, {
        code: 'SN',
        name: 'Senegal'
      }, {
        code: 'RS',
        name: 'Serbia'
      }, {
        code: 'SC',
        name: 'Seychelles'
      }, {
        code: 'SL',
        name: 'Sierra Leone'
      }, {
        code: 'SG',
        name: 'Singapore'
      }, {
        code: 'SX',
        name: 'Sint Maarten'
      }, {
        code: 'SK',
        name: 'Slovakia'
      }, {
        code: 'SI',
        name: 'Slovenia'
      }, {
        code: 'SB',
        name: 'Solomon Islands'
      }, {
        code: 'SO',
        name: 'Somalia'
      }, {
        code: 'ZA',
        name: 'South Africa'
      }, {
        code: 'GS',
        name: 'South Georgia and the South Sandwich Islands'
      }, {
        code: 'SS',
        name: 'South Sudan'
      }, {
        code: 'ES',
        name: 'Spain'
      }, {
        code: 'LK',
        name: 'Sri Lanka'
      }, {
        code: 'SD',
        name: 'Sudan'
      }, {
        code: 'SR',
        name: 'Suriname'
      }, {
        code: 'SJ',
        name: 'Svalbard and Jan Mayen'
      }, {
        code: 'SZ',
        name: 'Swaziland'
      }, {
        code: 'SE',
        name: 'Sweden'
      }, {
        code: 'SE',
        name: 'Sweden'
      }, {
        code: 'SL',
        name: 'Sri Lanka'
      }, {
        code: 'SY',
        name: 'Syria'
      }, {
        code: 'ST',
        name: 'São Tomé and Príncipe'
      }, {
        code: 'TW',
        name: 'Taiwan'
      }, {
        code: 'TJ',
        name: 'Tajikistan'
      }, {
        code: 'TZ',
        name: 'Tanzania'
      }, {
        code: 'TH',
        name: 'Thailand'
      }, {
        code: 'TG',
        name: 'Togo'
      }, {
        code: 'TK',
        name: 'Tokelau'
      }, {
        code: 'TO',
        name: 'Tonga'
      }, {
        code: 'TT',
        name: 'Trinidad and Tobago'
      }, {
        code: 'TN',
        name: 'Tunisia'
      }, {
        code: 'TR',
        name: 'Turkey'
      }, {
        code: 'TM',
        name: 'Turkmenistan'
      }, {
        code: 'TC',
        name: 'Turks and Caicos Islands'
      }, {
        code: 'TV',
        name: 'Tuvalu'
      }, {
        code: 'UG',
        name: 'Uganda'
      }, {
        code: 'UA',
        name: 'Ukraine'
      }, {
        code: 'AE',
        name: 'United Arab Emirates'
      }, {
        code: 'GB',
        name: 'United Kingdom'
      }, {
        code: 'UM',
        name: 'United States Minor Outlying Islands'
      }, {
        code: 'US',
        name: 'United States of America'
      }, {
        code: 'UY',
        name: 'Uruguay'
      }, {
        code: 'UZ',
        name: 'Uzbekistan'
      }, {
        code: 'VU',
        name: 'Vanuatu'
      }, {
        code: 'VA',
        name: 'Vatican City'
      }, {
        code: 'VE',
        name: 'Venezuela'
      }, {
        code: 'VN',
        name: 'Vietnam'
      }, {
        code: 'VI',
        name: 'Virgin Islands of the United States'
      }, {
        code: 'WF',
        name: 'Wallis and Futuna'
      }, {
        code: 'EH',
        name: 'Western Sahara'
      }, {
        code: 'YE',
        name: 'Yemen'
      }, {
        code: 'ZM',
        name: 'Zambia'
      }, {
        code: 'ZW',
        name: 'Zimbabwe'
      }, {
        code: 'AX',
        name: 'Åland Islands'
      }
    ];
  
  
  
  
  
  
  
  
  
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
                    if (data.Error) {;
            notifications.toast('0', data.Message);
                    } else {
            notifications.toast('1', 'Passoword is changed successfully.');
                        $mdDialog.hide();
                    }

                }).error(function () {
                    notifications.toast('0',"Error occurred while changing the password.");
                });

        } else {
      notifications.toast('0', 'Passwords does not match.');
        }
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
      ' <md-dialog-content style="padding:20px;">'+
      '   <div layout="row" layout-align="start center">'+
      '     <md-progress-circular class="md-accent" md-mode="indeterminate" md-diameter="40" style=" padding-right: 45px"></md-progress-circular>'+
      '     <span style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;">'+displayText+'</span>'+
      '   </div>'+
      ' </md-dialog-content>'+
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

routerApp.directive('validNumber', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return; 
      }

      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
            var val = '';
        }
        var clean = val.replace( /[^0-9]+/g, '');
        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
});