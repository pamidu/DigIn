/* use strict */

app.controller('MessageController',['$scope','$mdDialog','$rootScope', function($scope,$mdDialog,$rootScope) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.publish = function(){
        console.log("Publish button was clicked.");
    }
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.save = function(data,event) {
        if(angular.isDefined(data)){
            var returnObj = {
                "data" : data,
                "event" : event
            }
            $mdDialog.hide(returnObj);
        }
    };

    //dynamic themeing
    $scope.theme =  sessionStorage.cur_theme ||'default';
    $rootScope.changeColor = function(){
     //$scope.theme = color.theme;
    $scope.theme =  sessionStorage.cur_theme ||'default';
     $scope.themeList = ThemeService();
     console.log('Current Theme',  $scope.theme);
    $scope.clickIconMorph = function(value){
       console.log(value);
      if (value != undefined) {
         $scope.theme = value + '-theme';
          sessionStorage.setItem("cur_theme",$scope.theme);
        console.log('Changed theme',  $scope.theme, value);
          $scope.accent_color = value;
        //$scope.$apply();
        //$scope.$digest();
      }
    };
  }//end of dynamic themeing

}]);
