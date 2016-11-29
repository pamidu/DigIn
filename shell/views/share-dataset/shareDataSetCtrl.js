routerApp.controller('shareDataSetCtrl',function ($scope,$rootScope,$mdDialog,notifications,$http,Digin_Engine_API,Digin_Domain,$state,ProfileService,userAdminFactory){



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


    //------------------------ Users and groups goes here -----------------------------------------------------


    $scope.users = ["1","2","3","4","5","6","7","8","9"];
    $scope.groups = ['1','2','3','4','5','6','7'];

    $scope.getUserandGroups = function(){

          $http.get('http://iamadmin.dev.digin.io/apis/usercommon/getSharableObjects')
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


    $scope.share = function(){
        alert($scope.selectedUsersRead);
        alert($scope.selectedUsersWrite);
      }


    $scope.closeDialog =function(){
        $mdDialog.hide();
    }





      $scope.openFileShareDetails = function(){

        alert("Hi");
         $mdDialog.show({
                controller: 'showFileShareDetailsCtrl',
                templateUrl: 'views/share-dataset/showFileShareDetails.html',
                resolve: {},
                locals: {
                    users: $scope.users,
                    groups: $scope.groups
                    //file
                }
            })
      }


});