routerApp.controller('showFolderDetailsCtrl',function ($scope,$rootScope,$mdDialog,$http,Digin_Engine_API,Digin_Domain,$state,notifications,folder,users){


  $scope.folder = folder;
  $scope.users = users;

  $scope.folderName = folder.datasource_name
  $scope.files = [];

  for(var i =0; i< $scope.folder.file_uploads.length; i++ ){

    $scope.files.push($scope.folder.file_uploads[i]);
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
    
$scope.closeDialog =function(){
        $mdDialog.hide();
  }



  $scope.selectedFiles = [];

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

     $scope.closeDialog =function(){
        $mdDialog.hide();
    }

  $scope.deleteFilesInsideFolder = function(){
     if($scope.selectedFiles.length > 0 ){

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
                                            "file_type":"directory_file",
                                            "datasource_id":$scope.folder.datasource_id,
                                            "shared_user_Id":$scope.folder.shared_by,
                                            "deletion_type":"permanent",
                                            "upload_id" : $scope.selectedFiles[i].upload_id
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
                                        cb();

                                        $scope.selectedFiles = [];
                                        
                                    }

                                  })
                                  .error(function(error){  
                                    notifications.toast(0, "Error occurred during deletion, please try again");
                                                                       
                                  }); 
                        }, function() {
                                              
                        });  

     }
     else{
             notifications.toast(0, "Please select the file you wish to Delete");
         }
    }


});