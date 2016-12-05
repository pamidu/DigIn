routerApp.controller('systemSettingsCtrl',[ '$scope','$rootScope','$mdDialog', 'notifications','$http','Digin_Engine_API','Digin_Domain','$state','ProfileService','userAdminFactory', function ($scope,$rootScope,$mdDialog,notifications,$http,Digin_Engine_API,Digin_Domain,$state,ProfileService,userAdminFactory){

	if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
	{
		$('md-tabs-wrapper').css('background-color',"rgb(48,48,48)", 'important');
	}else{
		$('md-tabs-wrapper').css('background-color',"white", 'important');
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


    $scope.files =[];
    $scope.folders=[];

    $scope.users = [];
    $scope.groups = [];

    var userInfo= JSON.parse(decodeURIComponent(getCookie('authData')));
    $scope.loadFilesFolder  = function(){

        $scope.files =[];
        $scope.folders=[];

         $http.get(Digin_Engine_API+'GetTables?db=BigQuery&SecurityToken='+userInfo.SecurityToken+'')
           .then(function(result) {
                for(var i = 0; i < result.data.Result.length; i++){
                    if(result.data.Result[i].upload_type == "csv-singlefile"){
                      $scope.files.push(result.data.Result[i]);
                    }else{
                      $scope.folders.push(result.data.Result[i]);
                    }

                }
            },function errorCallback(response) {
                notifications.toast(0, "Falied to Load Data Set");
         }); 

        // var response = {"Exception": null, "Result": [{"datasource_id": "888", "created_tenant": "iamadmin.dev.digin.io", "created_user": "3e5685e2c1a575e286784f4fa98d8bec", "shared_user_groups": [], "upload_type": null, "file_uploads": [{"uploaded_datetime": null, "uploaded_user": null, "upload_id": null, "modified_datetime": null, "file_name": null}], "created_datetime": "2016-11-18T14:41:16", "shared_users": ["3e5685e2c1a575e286784f4fa98d8bec"], "security_level": "write", "datasource_name": "table_name", "shared_by": "33b90429cb058a94fbe2c2b0e67303c7", "datasource_type": "table", "schema": {"logo_name": "comp_Arch.png", "theme_config": "bla bla", "query_limit": 1000, "user_role": "admin", "cache_lifetime": null, "widget_limit": 7, "components": "dashboard1", "dp_name": "fe", "SecurityToken": "1e9fe96bb7a42eb87342b44a6b82f03c", "email": "marlonabeykoodn@gmail.com"}}, {"datasource_id": "1480094864372", "created_tenant": "prod.digin.io", "created_user": "eeb90d0d1cf1304350dfaf0e2da9c769", "shared_user_groups": [], "upload_type": "csv-directory", "file_uploads": [{"uploaded_datetime": "2016-11-25T17:30:08", "uploaded_user": "232d2f787798dda9383f01867d9e4add", "upload_id": "444", "modified_datetime": "2016-11-25T17:30:08", "file_name": "manually_added.csv"}, {"uploaded_datetime": "2016-11-25T17:29:08", "uploaded_user": "232d2f787798dda9383f01867d9e4add", "upload_id": "1480094947714", "modified_datetime": "2016-11-25T17:29:08", "file_name": "results-2015.csv"}], "created_datetime": "2016-11-25T17:28:08", "shared_users": [], "security_level": "write", "datasource_name": "test72", "shared_by": "33b90429cb058a94fbe2c2b0e67303c7", "datasource_type": "table", "schema": [{"type": "integer", "mode": "nullable", "name": "index_id"}, {"type": "string", "mode": "nullable", "name": "name"}, {"type": "string", "mode": "nullable", "name": "gender"}, {"type": "integer", "mode": "nullable", "name": "count"}]}], "Is_Success": true, "Custom_Message": "Tables retrieved!"}
        // for(var i = 0; i < response.Result.length; i++){

        //     if(response.Result[i].upload_type == null){
        //         $scope.files.push(response.Result[i]);
        //     }else{
        //       $scope.folders.push(response.Result[i]);
        //     }

        // }
    }



    

    $scope.getUserandGroups = function(){

          $http.get('/apis/usercommon/getSharableObjects')
           .then(function(result) {

                var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
                var CurUser = userInfo.Email;
                ////return result.data;
                 for (var i = 0, len = result.data.length; i<len; ++i) {
                    if (result.data[i].Type == "User") {
                      if(CurUser != result.data[i].Id)
                          $scope.users.push(result.data[i]);
                    }else if (result.data[i].Type == "Group") {
                        $scope.groups.push(result.data[i]);
                    }
                }
                
            },function errorCallback(response) {
                notifications.toast(0, "Falied to get users");
         });  



    }

    $scope.getUserandGroups();
    $scope.loadFilesFolder();


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


   $scope.showInsideFolder  =  function(folder) {

           $mdDialog.show({
                controller: 'showFolderDetailsCtrl',
                templateUrl: 'views/settings/systemSettings/showFolderDetails.html',
                resolve: {},
                locals: {
                    users: $scope.users,
                    folder: folder
                }
            })
    }

    $scope.getDate = function(datetime){

        var res = datetime.split("T");
        return res[0];
    }

    $scope.getUserName = function(Id){

        var name;
        for(var i=0; i< $scope.users.length; i++){

                if($scope.users[i].UserID == Id){
                    name = $scope.users[i].Id
                    break;
                }
            }
        return name;
    }
    

        $scope.DeleteFilesFolders = function(){

         if($scope.selectedFiles.length > 0 || $scope.selectedFolders.length > 0 ){
                      var confirm = $mdDialog.confirm()
                      .title('Delete Data Set')
                      .textContent('Would you like to delete the data set?')
                      .ariaLabel('')
                      .targetEvent()
                      .ok('Yes')
                      .cancel('No');

                        $mdDialog.show(confirm).then(function() {

                                //get delete files
                                    var deleteObj=[];
                                    for(var i = 0; i< $scope.selectedFiles.length; i++){
                                        
                                        var obj = {
                                            "file_type":"single",
                                            "datasource_id":$scope.selectedFiles[i].datasource_id,
                                            "shared_user_Id":$scope.selectedFiles[i].shared_by,
                                            "deletion_type":"permanent"
                                        };
                                        deleteObj.push(obj);
                                    }


                                    //get delete folders
                                    for(var i = 0; i< $scope.selectedFolders.length; i++){
                                        
                                        var obj = {
                                            "file_type":"folder",
                                            "datasource_id":$scope.selectedFolders[i].datasource_id,
                                            "shared_user_Id":$scope.selectedFolders[i].shared_by,
                                            "deletion_type":"permanent"
                                        };
                                        deleteObj.push(obj);
                                    }

                                  var userInfo= JSON.parse(decodeURIComponent(getCookie('authData')));
                                  $http({
                                      method: 'POST',
                                      
                                      url: Digin_Engine_API +'datasource_delete',
                                      data: angular.fromJson(JSON.stringify(deleteObj)),
                                      headers: {  
                                                  'Content-Type': 'application/json',
                                                  'SecurityToken': userInfo.SecurityToken
                                      }
                                  })
                                  .success(function(response){
                                     
                                      if(response.Is_Success == false){
                                         notifications.toast(0, response.Custom_Message);
                                    }
                                    else{
                                        notifications.toast(1, response.Custom_Message);
                                        $scope.loadFilesFolder();
                                        $scope.selectedFolders = [];
                                        $scope.selectedFiles = [];
                                        
                                    }

                                  })
                                  .error(function(error){  
                                    notifications.toast(0, error.Custom_Message);
                                   
                                  }); 
                        }, function() {
                   
                             
                        });  
          }else{
              notifications.toast(0, "Please select files or folders you wish to Delete");
          }
                

        }


}])