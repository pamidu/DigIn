routerApp.controller('showFileShareDetailsCtrl',
	function ($scope,$rootScope,$mdDialog,users,groups){

	$scope.users = ["1","2","3","4","5","6","7","8","9"];
    $scope.groups = ['1','2','3','4','5','6','7'];


    $scope.selectedUsersRead = [];
    $scope.selectedUsersWrite = []; 


    $scope.selectedGroupRead = [];
    $scope.selectedGroupWrite = []; 

	 $scope.closeDialog =function(){
	        $mdDialog.hide();
	    }


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

		

});