routerApp.controller('dashboardSetupCtrl', function($scope, $mdDialog, $location, $http, Digin_Engine_API1) {
    
    //theme colors array
    $scope.colorArr = [{value:'#F44336'},{value:'#E91E63'},{value:'#9C27B0'},{value:'#673AB7'},{value:'#3F51B5'},{value:'#2196F3'},{value:'#03A9F4'},{value:'#00BCD4'},{value:'#009688'},{value:'#4CAF50'},{value:'#8BC34A'},{value:'#CDDC39'},{value:'#FFEB3B'},{value:'#FFC107'},{value:'#FF9800'},{value:'#FF5722'},{value:'#795548'},{value:'#9E9E9E'},{value:'#607D8B'}];
    
    $scope.selectedColorObj = {
        primaryPalette: "",
        accentPalette: ""
    };
    
    //add user view state
    $scope.addUsrState = false;
    
    //breaking the coloArr into chunks of 6 colors    
    $scope.chunkedColorArr = chunk($scope.colorArr, 6);
    
    /*adding a new user
        #addState : bool - true if the add user view is enabled
    */
    $scope.addNewUser = function(addState){
        $scope.addUsrState = addState;
        if(!addState){
            //do the form validations + the adding of the user here
        }
    };
    
    $scope.updateAccount = function(){
        
    };
    
});

