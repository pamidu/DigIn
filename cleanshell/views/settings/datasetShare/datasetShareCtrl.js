DiginApp.controller('datasetShareCtrl', ['$scope','$rootScope','$mdDialog','notifications','$http','Digin_Engine_API','Digin_Domain','$state','ProfileService','userAdminFactory','notifications','apis_Path','dbType',function ($scope,$rootScope,$mdDialog,notifications,$http,Digin_Engine_API,Digin_Domain,$state,ProfileService,userAdminFactory,notifications,apis_Path,dbType){

  $scope.$parent.currentView = "Share Dataset";
	$scope.step1 = {};
    $scope.goToNextStep = function()
    {
        $scope.selected = 1;
		$scope.step1.completed = true;
    }
 
    $scope.files = [];
    $scope.folders=[];

    $scope.sharedFiles = []; 
    $scope.sharedFolders = [];

     $scope.route = function (state) {
          $state.go('home.welcomeSearch');
    };

    var userInfo= JSON.parse(decodeURIComponent(getCookie('authData')));

    $scope.loadFilesFolder  = function(){


      $scope.files = [];
      $scope.folders=[];

      $scope.selectedFiles = [];
      $scope.selectedFolders = [];

       $http.get(Digin_Engine_API+'GetTables?db='+dbType+'&SecurityToken='+userInfo.SecurityToken+'')
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

        // var response = {"Exception":null,"Result":[{"datasource_id":"888","created_tenant":"iamadmin.dev.digin.io","created_user":"3e5685e2c1a575e286784f4fa98d8bec","shared_user_groups":[{"user_group_id":"89c620a90f8283bf59a646e6cf9b9556","component_id":"888","security_level":"write"}],"upload_type":null,"file_uploads":[{"uploaded_datetime":null,"uploaded_user":null,"upload_id":null,"modified_datetime":null,"file_name":null}],"created_datetime":"2016-11-18T14:41:16","shared_users":[{"user_id":"3e5685e2c1a575e286784f4fa98d8bec","component_id":"888asdasda","security_level":"read"}],"security_level":"write","datasource_name":"table_name","shared_by":"33b90429cb058a94fbe2c2b0e67303c7","datasource_type":"table","schema":{"logo_name":"comp_Arch.png","theme_config":"bla bla","query_limit":1000,"user_role":"admin","cache_lifetime":null,"widget_limit":7,"components":"dashboard1","dp_name":"fe","SecurityToken":"1e9fe96bb7a42eb87342b44a6b82f03c","email":"marlonabeykoodn@gmail.com"}},{"datasource_id":"1480094864372","created_tenant":"prod.digin.io","created_user":"eeb90d0d1cf1304350dfaf0e2da9c769","shared_user_groups":[{"user_group_id":"d1dec654017e42ae2e52571b1bb632a8","component_id":"80980809","security_level":"red"}],"upload_type":"csv-directory","file_uploads":[{"uploaded_datetime":"2016-11-25T17:30:08","uploaded_user":"e4acf86aecd025a8cc550e4c1a7087f0","upload_id":"444","modified_datetime":"2016-11-25T17:30:08","file_name":"manually_added.csv"},{"uploaded_datetime":"2016-11-25T17:29:08","uploaded_user":"232d2f787798dda9383f01867d9e4add","upload_id":"1480094947714","modified_datetime":"2016-11-25T17:29:08","file_name":"results-2015.csv"}],"created_datetime":"2016-11-25T17:28:08","shared_users":[{"user_id":"bdc4f1bfdd1b2784b87b70d01495c471","component_id":"1232dasda","security_level":"red"}],"security_level":"write","datasource_name":"test72","shared_by":"33b90429cb058a94fbe2c2b0e67303c7","datasource_type":"table","schema":[{"type":"integer","mode":"nullable","name":"index_id"},{"type":"string","mode":"nullable","name":"name"},{"type":"string","mode":"nullable","name":"gender"},{"type":"integer","mode":"nullable","name":"count"}]},{"datasource_id":"1480094864372","created_tenant":"prod.digin.io","created_user":"eeb90d0d1cf1304350dfaf0e2da9c769","shared_user_groups":[{"user_group_id":"d1dec654017e42ae2e52571b1bb632a8","component_id":"80980809","security_level":"red"}],"upload_type":null,"file_uploads":[{"uploaded_datetime":"2016-11-25T17:30:08","uploaded_user":"e4acf86aecd025a8cc550e4c1a7087f0","upload_id":"444","modified_datetime":"2016-11-25T17:30:08","file_name":"manually_added.csv"},{"uploaded_datetime":"2016-11-25T17:29:08","uploaded_user":"232d2f787798dda9383f01867d9e4add","upload_id":"1480094947714","modified_datetime":"2016-11-25T17:29:08","file_name":"results-2015.csv"}],"created_datetime":"2016-11-25T17:28:08","shared_users":[{"user_id":"3e5685e2c1a575e286784f4fa98d8bec","component_id":"1232dasda","security_level":"red"}],"security_level":"write","datasource_name":"test72","shared_by":"","datasource_type":"table","schema":[{"type":"integer","mode":"nullable","name":"index_id"},{"type":"string","mode":"nullable","name":"name"},{"type":"string","mode":"nullable","name":"gender"},{"type":"integer","mode":"nullable","name":"count"}]}],"Is_Success":true,"Custom_Message":"Tables retrieved!"}

        // for(var i = 0; i < response.Result.length; i++){

        //     if(response.Result[i].upload_type == null){
        //       $scope.files.push(response.Result[i]);
        //     }else{
        //       $scope.folders.push(response.Result[i]);
        //     }

        // }
    }

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


    //------------------------ Users and groups goes here -----------------------------------------------------


    $scope.users = [];
    $scope.Allusers = [];
    $scope.groups = [];

    $scope.getUserandGroups = function(){

          $http.get(apis_Path+'usercommon/getSharableObjects')
           .then(function(result) {

                var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
                var CurUser = userInfo.Email;
                ////return result.data;
                 for (var i = 0, len = result.data.length; i<len; ++i) {
                    if (result.data[i].Type == "User") {
                      $scope.Allusers.push(result.data[i]);
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



    $scope.selectedUsersRead = [];
    $scope.selectedUsersWrite = []; 


    $scope.selectedGroupRead = [];
    $scope.selectedGroupWrite = []; 



    // ----------------------- users read---------------------------------------------------------------

     $scope.toggleUsersRead = function (folder, list, listother) {
        var idx = list.indexOf(folder);
        if (idx > -1) {
          list.splice(idx, 1);

          var indO = listother.indexOf(folder);
            if(indO > -1)
            listother.splice(indO, 1);
          
        }
        else {
          list.push(folder);
         
        }
     };

      $scope.existsUsersRead = function (folder, list) {
        return list.indexOf(folder) > -1;
      };

    //---------------------- user write------------------------

     $scope.toggleUsersWrite = function (folder, list, listother) {
        var idx = list.indexOf(folder);
        if (idx > -1) {
          list.splice(idx, 1);
          
        }
        else {
          list.push(folder);

           var indO = listother.indexOf(folder);
            if(indO < 0)
            listother.push(folder);
         
        }

       

     };

      $scope.existsUsersWrite = function (folder, list) {
        return list.indexOf(folder) > -1;
      };


    $scope.closeDialog =function(){
        $mdDialog.hide();
    }

    $scope.callbackResetUnshare = function(){
        $scope.loadFilesFolder();
    };



      $scope.openFileShareDetails = function(file,tag){

          if(file.shared_by == null || file.shared_by ==""){
             $mdDialog.show({
                  controller: 'showFileShareDetailsCtrl',
                  templateUrl: 'views/share-dataset/showFileShareDetails.html',
                  resolve: {},
                  locals: {
                      users: $scope.Allusers,
                      groups: $scope.groups,
                      file:file,
                      tag:tag,
                      cb:$scope.callbackResetUnshare
                  }
              })
          }
      }



      $scope.shareDataSet = function(){

        var shareObj = [];

        if(($scope.selectedFiles.length > 0 ||  $scope.selectedFolders.length > 0) && ($scope.selectedUsersRead.length >0 ||  $scope.selectedGroupRead.length >0))
        {

          // get users files and folders
          shareObj.concat($scope.getSharableObject($scope.selectedFiles,$scope.selectedUsersRead,$scope.selectedUsersWrite,shareObj,true)); 
          shareObj.concat($scope.getSharableObject($scope.selectedFolders,$scope.selectedUsersRead,$scope.selectedUsersWrite,shareObj,true)); 
          
          // get groups files and folders 
          shareObj.concat($scope.getSharableObject($scope.selectedFiles,$scope.selectedGroupRead,$scope.selectedGroupWrite,shareObj,false)); 
          shareObj.concat($scope.getSharableObject($scope.selectedFolders,$scope.selectedGroupRead,$scope.selectedGroupWrite,shareObj,false)); 



          var finalshareObj = {
                "method":"component_internal",
                "comp_type":"datasource",
                "share_data":shareObj,
                "unshare_data":[]
            }

            if(finalshareObj.share_data.length > 0){

                   var userInfo= JSON.parse(decodeURIComponent(getCookie('authData')));
                  $http({
                      method: 'POST',
                      url: Digin_Engine_API +'share_components',
                      data: angular.fromJson(JSON.stringify(finalshareObj)),
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
                        
                        $scope.selectedUsersRead = [];
                        $scope.selectedUsersWrite = []; 


                        $scope.selectedGroupRead = [];
                        $scope.selectedGroupWrite = []; 

                        $scope.selectedFiles = [];
                        $scope.selectedFolders = [];

                    }

                  })
                  .error(function(error){  
                    notifications.toast(0, "Error occurred during share, please try again");
                   
                  });

            }else{
              notifications.toast(0, "Your trying to share with already shared users or you dont have permition to share");
            }

        }else if(($scope.selectedFiles.length +  $scope.selectedFolders.length) == 0){
           notifications.toast(0, "Please select a file or a folder");
        }else if(($scope.selectedUsersRead.length + $scope.selectedGroupRead.length) == 0){
          notifications.toast(0, "Please select a user or a group");
        }
            }

     

      $scope.getSharableObject = function(selectedArray,readArray,writeArr,shareObj,isUser){

         for(var i = 0; i< selectedArray.length ; i++ ){
              for(var j = 0; j< readArray.length ; j++ ){

                  if(!$scope.isExist(readArray[j].UserID,selectedArray[i].shared_users) && !$scope.isShared(selectedArray[i].shared_by) && !$scope.isCurrntUser(selectedArray[i].created_tenant,readArray[j].UserID))
                  {
                    var obj = {
                        "comp_id":selectedArray[i].datasource_id,
                        "is_user":isUser,
                        "id":readArray[j].UserID,
                        "security_level":$scope.getPermition(readArray[j].Id,writeArr)

                    };

                    shareObj.push(obj);
                    console.log();
                  }
              }
          }

          return shareObj;

      }

      $scope.isShared = function(sharedUser){
          var isShared = true;
          if(sharedUser == null || sharedUser == "")
              isShared = false;

          return isShared;
      }

      $scope.isExist = function(Id, array){
        var isExist = false;

        for(var i =0; i < array.length ; i++){

            if(Id == array[i].user_id){
                isExist = true;
                break;
            }

        }

        return isExist;
      }

      $scope.isCurrntUser = function(created_tenant,created_user){
        var isCurrntUser = false;
        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
        var curUserId = userInfo.UserID;
        var curTenent = $rootScope.TenantID;


        if(created_tenant == curTenent && created_user == curUserId)
            isCurrntUser = true; 

       return isCurrntUser; 
      }


      $scope.getPermition = function(userId, writeArr){

        var permition = "read";

        for(var i =0; i < writeArr.length ; i++){

            if(userId == writeArr[i].Id){
              permition = "write";
              break;
            }
        }


        return permition;

      }


      $scope.getDate = function(datetime){

        var res = datetime.split("T");
        return res[0];
      }

    $scope.getUserName = function(Id){

        var name;
        for(var i=0; i< $scope.Allusers.length; i++){

                if($scope.Allusers[i].UserID == Id){
                    name = $scope.Allusers[i].Id
                    break;
                }
            }
        return name;
    }


}]);