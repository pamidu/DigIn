DiginApp.controller('showFileShareDetailsCtrl',
  function ($scope,$rootScope,$mdDialog,users,groups,file,tag,$http,Digin_Engine_API,notifications,cb){


  
  $scope.fileName = file.datasource_name;
  $scope.users =[];
  var userInfo= JSON.parse(decodeURIComponent(getCookie('authData')));
  for(var i =0; i< file.shared_users.length ;i++){
    if(file.shared_users[i].user_id != userInfo.UserID)
        $scope.users.push(file.shared_users[i]); 
  }
  
  $scope.groups = file.shared_user_groups;

  $scope.tenenTUsers =users ;
  $scope.tenenTGroups = groups;




 $scope.getUserName = function(Id){

        var name;
        for(var i=0; i< $scope.tenenTUsers.length; i++){

                if($scope.tenenTUsers[i].UserID == Id){
                    name = $scope.tenenTUsers[i].Id
                    break;
                }
            }
        return name;
  }

  $scope.getGroupName = function(Id){

        var name;
        for(var i=0; i< $scope.tenenTGroups.length; i++){

                if($scope.tenenTGroups[i].UserID == Id){
                    name = $scope.tenenTGroups[i].Name
                    break;
                }
            }
        return name;
    }



  $scope.fileFolder = file;

  $scope.selectedUsers = [];
  $scope.selectedgroups = []; 


  $scope.closeDialog =function(){
        $mdDialog.hide();
  }


  // --- Users goes her ----------------------------------------------
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
        return ($scope.selectedUsers.length !== 0 &&
            $scope.selectedUsers.length !== $scope.users.length);
      };

      $scope.isChecked = function() {
        return $scope.selectedUsers.length === $scope.users.length;
      };

      $scope.toggleAll = function() {
        if ($scope.selectedUsers.length === $scope.users.length) {
          $scope.selectedUsers = [];
        } else if ($scope.selectedUsers.length === 0 || $scope.selectedUsers.length > 0) {
          $scope.selectedUsers = $scope.users.slice(0);
        }
      };

    //-----------------------------------------------------------------------------

        //--- folders goes here -------------------------------------------------------
         $scope.toggleGroup = function (folder, list) {
            var idx = list.indexOf(folder);
            if (idx > -1) {
              list.splice(idx, 1);
              
            }
            else {
              list.push(folder);
             
            }
         };

          $scope.existsGroup = function (folder, list) {
            return list.indexOf(folder) > -1;
          };

          $scope.isIndeterminateGroup = function() {
            return ($scope.selectedgroups.length !== 0 &&
                $scope.selectedgroups.length !== $scope.groups.length);
          };

          $scope.isCheckedGroup = function() {
            return $scope.selectedgroups.length === $scope.groups.length;
          };

          $scope.toggleAllGroup = function() {
            if ($scope.selectedgroups.length === $scope.groups.length) {
              $scope.selectedgroups = [];
            } else if ($scope.selectedgroups.length === 0 || $scope.selectedgroups.length > 0) {
              $scope.selectedgroups = $scope.groups.slice(0);
            }
          };

          $scope.selectedUsers = [];
          $scope.selectedgroups = []; 
          
        $scope.unShare = function(){

                if($scope.selectedUsers.length > 0 || $scope.selectedgroups.length > 0 ){
                  var confirm = $mdDialog.confirm()
                  .title('Unshare the Data Set')
                  .textContent('Would you like to unshare the data set?')
                  .ariaLabel('')
                  .targetEvent()
                  .ok('Yes')
                  .cancel('No');

                    $mdDialog.show(confirm).then(function() {

                      var unshareObj = [];
                      var compId = file.datasource_id;

                    for(var i=0; i< $scope.selectedUsers.length ;i++){

                        var obj = {
                          "comp_id":compId,
                          "is_user":true,
                          "id":$scope.selectedUsers[i].user_id,
                          "security_level":$scope.selectedUsers[i].security_level
                        }

                        unshareObj.push(obj);
                    }

                    for(var i=0; i< $scope.selectedgroups.length ;i++){

                        var obj = {
                          "comp_id":compId,
                          "is_user":false,
                          "id":$scope.selectedgroups[i].user_group_id,
                          "security_level":$scope.selectedgroups[i].security_level
                        }

                        unshareObj.push(obj);
                    }


                    var finalUnshareObj = {
                        "method":"component_internal",
                        "comp_type":"datasource",
                        "share_data":[],
                        "unshare_data":unshareObj
                    }

                    var userInfo= JSON.parse(decodeURIComponent(getCookie('authData')));
                      $http({
                          method: 'POST',
                          url: Digin_Engine_API +'share_components',
                          data: angular.fromJson(JSON.stringify(finalUnshareObj)),
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
                            $scope.selectedgroups = [];
                            $scope.selectedUsers  = [];
                            cb();
                        }

                      })
                      .error(function(error){  
                        notifications.toast(0, "Error occurred during un-share, please try again");
                       
                      });


                    }, function() {
                       
                                 
                    });
                    
                  }else{
                      notifications.toast(0, "Please select users or groups you wish to unshare");
                  }

          }

});