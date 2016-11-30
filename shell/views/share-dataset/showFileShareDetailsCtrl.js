routerApp.controller('showFileShareDetailsCtrl',
  function ($scope,$rootScope,$mdDialog,users,groups,file){

  $scope.users = ["1","2","3","4","5","6","7","8","9"];
  $scope.groups = ['1','2','3','4','5','6','7'];

  $scope.file = file;

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





    // // ----------------------- users read---------------------------------------------------------------

    //  $scope.toggleUsersRead = function (folder, list, listother) {
    //     var idx = list.indexOf(folder);
    //     if (idx > -1) {
    //       list.splice(idx, 1);

    //       var indO = listother.indexOf(folder);
    //         if(indO > -1)
    //         listother.splice(indO, 1);
          
    //     }
    //     else {
    //       list.push(folder);
         
    //     }
    //  };

    //   $scope.existsUsersRead = function (folder, list) {
    //     return list.indexOf(folder) > -1;
    //   };

    // //---------------------- user write------------------------

    //  $scope.toggleUsersWrite = function (folder, list, listother) {
    //     var idx = list.indexOf(folder);
    //     if (idx > -1) {
    //       list.splice(idx, 1);
          
    //     }
    //     else {
    //       list.push(folder);

    //        var indO = listother.indexOf(folder);
    //         if(indO < 0)
    //         listother.push(folder);
         
    //     }

       

    //  };

    //   $scope.existsUsersWrite = function (folder, list) {
    //     return list.indexOf(folder) > -1;
    //   };

    

});