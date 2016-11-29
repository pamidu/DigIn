routerApp.controller('systemSettingsCtrl',[ '$scope','$rootScope','$mdDialog', 'notifications','$http','Digin_Engine_API','Digin_Domain','$state','ProfileService','userAdminFactory', function ($scope,$rootScope,$mdDialog,notifications,$http,Digin_Engine_API,Digin_Domain,$state,ProfileService,userAdminFactory){

	if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
	{
		$('md-tabs-wrapper').css('background-color',"rgb(48,48,48)", 'important');
	}else{
		$('md-tabs-wrapper').css('background-color',"white", 'important');
	}
	$scope.selectedStep = 0;
    $scope.status = false;
	
	$scope.goToNextStep = function()
	{
		console.log("next");
		$scope.selected = 1;
	}
    $scope.stepData = [{
        step: 1,
        completed: false,
        optional: false,
        data: {},
        busyText: "Proceeding to step 2"
    }, {
        step: 2,
        completed: false,
        optional: false,
        data: {},
        busyText: "Uploading File"
    }, {
        step: 3,
        completed: false,
        optional: false,
        data: {}
    }];
    $scope.submitCurrentStep = function(stepData)
    {
        stepData.completed = true;
        stepData.data.completed = true;
        $scope.incrementStep();
    }
    $scope.incrementStep = function()
    {
        $scope.selectedStep++;
    }
    $scope.moveToPreviousStep = function()
    {
        $scope.selectedStep--;
    }
    userAdminFactory.getUserLevel();

    $scope.sizes = [
        "5",
        "10",
        "15",
        "30"
    ];

    $scope.toppings = [
        {name: '1'},
        {name: '2'},
        {name: '3'},
        {name: '4'},
        {name: '5'},
        {name: '6'},
        {name: '7'},
        {name: '8'},
        {name: '9'},
        {name: '10'}
    ];

    $scope.requests = [
        {name: '1000'},
        {name: '2000'},
        {name: '3000'},
        {name: '4000'},
        {name: '5000'},
    ];

    $scope.clearDetails = [
        {name: "Clear Cache"}
    ];


    //#View sittings detail
    if($rootScope.userSettings==undefined)
        {
        }
    else{
            $scope.cacheLifetime=$rootScope.userSettings.cache_lifetime;
            $scope.noOfWidget=$rootScope.userSettings.widget_limit;
            $scope.reqLimit=$rootScope.userSettings.query_limit;
            var userSettingsTemp = JSON.parse($rootScope.userSettings.components);
            if (userSettingsTemp.saveExplicit) {
                $scope.components=true;
            } else {
                $scope.components=false;
            }
    }
    
    
    
    
//#update refresh widget settings
    $scope.updateSettings = function () {
            if($rootScope.userLevel=='user'){
                   notifications.toast('0','You are not permitted to do this operation, allowed only for administrator'); 
                   return;
            }
            else if ($scope.cacheLifetime == undefined) {
                notifications.toast('0', 'Invalid cache lifetime settings.');
                return;
            }
            /*else if ($scope.noOfWidget == undefined) {
                notifications.toast('0', 'Invalid widgets settings!');
                return;
            }*/
            else if ($scope.reqLimit == undefined) {
                notifications.toast('0', 'Invalid request limit settings.');
                return;
            }
            else if ($scope.cacheLifetime <= 0) {
                notifications.toast('0', 'Invalid cache lifetime settings.');
                return;
            }
            else {
            }

            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
            
            //#chk undefined values
            var dp_name="";
            var logo_name="";
            var components; var userRole; var cacheLifetime; var widgetLimit; var themeConfig; var queryLimit;
            components = JSON.parse($rootScope.userSettings.components);
            components.saveExplicit = $scope.components;
            components = JSON.stringify(components);
            if($rootScope.userSettings.user_role==undefined) {userRole="";} else {userRole=$rootScope.userSettings.user_role}
            if($scope.cacheLifetime==undefined) {cacheLifetime=0;} else {cacheLifetime=parseInt($scope.cacheLifetime)}
            if($scope.noOfWidget==undefined) {widgetLimit=6;} else {widgetLimit=parseInt($scope.noOfWidget)}
            if($scope.reqLimit==undefined) {queryLimit=0;} else {queryLimit=parseInt($scope.reqLimit)}
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
                "dp_name" : dp_name,
                "theme_config": themeConfig
            }
        
            $http({
                method: 'POST',
                url: Digin_Engine_API + 'store_user_settings/',
                data: angular.toJson($scope.settings),
                headers: {
                    'Content-Type': 'application/json',
                    'SecurityToken': userInfo.SecurityToken
                }
            })
                .success(function (response) {
                    //alert("Success...!");
                    notifications.toast('1', 'User settings saved successfully.');
                    var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
                    $http.get(Digin_Engine_API + 'get_user_settings?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain)
                    .success(function (data) {
                    $rootScope.userSettings=data.Result;  
                    ProfileService.widget_limit = data.Result.widget_limit;       
                    })
                    .error(function (data) {        
                    });
                })
                .error(function (error) {
                    notifications.toast('0', 'Please re-check the settings.');
                });

    };


    //#Clear cache
    $scope.clearCache = function () {
        
        if($rootScope.userLevel=='user'){
                   notifications.toast('0','You are not permitted to do this operation, allowed only for administrator'); 
                   return;
            }
            
        var confirm = $mdDialog.confirm()
            .title('Do you want to clear cache ?')
            .targetEvent(event)
            .ok('Yes!')
            .cancel('No!');
        $mdDialog.show(confirm).then(function () {
            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
            if ($scope.clearDetail == undefined) {
                notifications.toast('0', 'Select cache clear option !');
                return;
            }
            else {
            }

            $http({
                method: 'POST',
                url: Digin_Engine_API + 'clear_cache',
                headers: {
                    'Content-Type': 'Content-Type:application/json',
                    'SecurityToken': userInfo.SecurityToken
                }
            })
                .success(function (response) {
                    notifications.toast('1', 'Cache cleared successfully.');
                })
                .error(function (error) {
                    notifications.toast('0', 'Please select the cache clear option');
                });
        }, function () {

        });
    };


    //*Settings routing ---------------- 
    var slide = false;
    $scope.route = function (state) {
          $state.go('home.welcomeSearch');
    };


    // ------- Data set settings functions goes here 


    $scope.goToNextStep = function()
    {
        console.log("next");
        $scope.selected = 1;
    }


    $scope.files =["1","2","3","4","5","6","7","8","9"];
    $scope.folders=['1','2','3','4','5','6','7'];


    $scope.loadFilesFolder  = function(){

        $http.get('/apis/usercommon/getSharableObjects')
           .then(function(result) {
                
            },function errorCallback(response) {
                notifications.toast(0, "Falied to get users");
         }); 


    }








    $scope.selectedFiles = [];
    $scope.selectedFolders = [];

    // --- files goes her ----------------------------------------------
     $scope.toggle = function (file, list) {
        var idx = list.indexOf(file);
        if (idx > -1) {
          list.splice(idx, 1);
          
        }
        else {
          list.push(file);
         
        }
      };

      $scope.exists = function (file, list) {
        return list.indexOf(file) > -1;
      };

      $scope.isIndeterminate = function() {
        return ($scope.selectedFiles.length !== 0 &&
            $scope.selectedFiles.length !== $scope.files.length);
      };

      $scope.isChecked = function() {
        return $scope.selectedFiles.length === $scope.files.length;
      };

      $scope.toggleAll = function() {
        if ($scope.selectedFiles.length === $scope.files.length) {
          $scope.selectedFiles = [];
        } else if ($scope.selectedFiles.length === 0 || $scope.selectedFiles.length > 0) {
          $scope.selectedFiles = $scope.files.slice(0);
        }
      };

    //-----------------------------------------------------------------------------


    //--- folders goes here -------------------------------------------------------
         $scope.toggleFolder = function (folder, list) {
            var idx = list.indexOf(folder);
            if (idx > -1) {
              list.splice(idx, 1);
              
            }
            else {
              list.push(folder);
             
            }
         };

          $scope.existsFolder = function (folder, list) {
            return list.indexOf(folder) > -1;
          };

          $scope.isIndeterminateFolder = function() {
            return ($scope.selectedFolders.length !== 0 &&
                $scope.selectedFolders.length !== $scope.folders.length);
          };

          $scope.isCheckedFolder = function() {
            return $scope.selectedFolders.length === $scope.folders.length;
          };

          $scope.toggleAllFolder = function() {
            if ($scope.selectedFolders.length === $scope.folders.length) {
              $scope.selectedFolders = [];
            } else if ($scope.selectedFolders.length === 0 || $scope.selectedFolders.length > 0) {
              $scope.selectedFolders = $scope.folders.slice(0);
            }
          };



    $scope.closeDialog =function(){
        $mdDialog.hide();
    }







}])