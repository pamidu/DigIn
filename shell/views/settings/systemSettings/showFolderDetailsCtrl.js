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

});