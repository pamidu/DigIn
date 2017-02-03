DiginApp.controller('sharedashboardgroupsCtrl', [ '$scope', '$mdDialog','$rootScope', '$http','notifications','Digin_Engine_API','$state','apis_Path', function( $scope, $mdDialog,$rootScope, $http,notifications,Digin_Engine_API,$state,apis_Path ) {

    $scope.users =[];
    $scope.groups=[];
    $scope.selected = [];
    $scope.selectedgroups = [];

    $scope.isVisble= false;

    $scope.$parent.currentView = "Dashboard Share";
    

    $http.get(apis_Path+'usercommon/getSharableObjects')
       .then(function(result) {

            $scope.isVisble= true;
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

            //------ for users ------------------------------------------------
               $scope.toggle = function (users, list) {
                var idx = list.indexOf(users);
                if (idx > -1) {
                  list.splice(idx, 1);
                  
                }
                else {
                  list.push(users);
                 
                }
              };

              $scope.exists = function (users, list) {
                return list.indexOf(users) > -1;
              };

              $scope.isIndeterminate = function() {
                return ($scope.selected.length !== 0 &&
                    $scope.selected.length !== $scope.users.length);
              };

              $scope.isChecked = function() {
                return $scope.selected.length === $scope.users.length;
              };

              $scope.toggleAll = function() {
                if ($scope.selected.length === $scope.users.length) {
                  $scope.selected = [];
                } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                  $scope.selected = $scope.users.slice(0);
                }
              };

             //-------------------------------------------------------------
             
             //-------------for groups -------------------------------------
               $scope.toggleGroup = function (item, list) {
                var idx = list.indexOf(item);
                if (idx > -1) {
                  list.splice(idx, 1);
                }
                else {
                  list.push(item);
                }
              };

              $scope.existsGroup = function (item, list) {
                return list.indexOf(item) > -1;
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

             //------------------------------------------------------------- 
            
        },function errorCallback(response) {
            notifications.toast(0, "Falied to get users");
     });    

       $scope.closeReort = function(){
        $state.go('home.welcomeSearch');
       }

       $scope.getArray = function (){ 
         
            if($scope.selected.length > 0 || $scope.selectedgroups.length > 0){

              var dashboardId = $rootScope.dashboard.compID;
              var idArr =[];

              //to get users
              for(var i=0; i<$scope.selected.length; i++){
                var user ={"comp_id":dashboardId,"is_user":true,"id":$scope.selected[i].UserID,"security_level":"write"};
                idArr.push(user);
              }

              //to get groups
              for(var i=0; i<$scope.selectedgroups.length; i++){
                var group ={"comp_id":dashboardId,"is_user":false,"id":$scope.selectedgroups[i].UserID,"security_level":"write"};
                idArr.push(group);
              }

              var shareObject  ={
                "method":"component_internal",
                "comp_type":"dashboard",
                "share_data":idArr,
                "unshare_data":[]
              };

              console.log(JSON.stringify(shareObject));
              var userInfo= JSON.parse(decodeURIComponent(getCookie('authData')));
              $http({
                  method: 'POST',
                  
                  url: Digin_Engine_API +'share_components',
                  data: angular.fromJson(JSON.stringify(shareObject)),
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
                }

              })
              .error(function(error){  
                notifications.toast(0, error.Custom_Message);
               
              }); 

            }else{
              notifications.toast(0, "You have not select any user or group to share");
            }
       }
      


}]);
