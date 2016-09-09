routerApp.controller('shareEmailClients', ['$scope','$mdDialog','widget',function ($scope,$mdDialog,widget) {

     $scope.shareOptions = [{
        provider: "Gmail",
        icon: "styles/css/images/icons/facebook.svg"
        }, {
            provider: "Yahoo",
            icon: "styles/css/images/icons/googleplus.svg"
        }, {
            provider: "twitter",
            icon: "styles/css/images/icons/twitter.svg"
        }, {
            provider: "email",
            icon: "styles/css/images/icons/linkedin.svg"
        }];


    $scope.closeDialog = function() {

        $mdDialog.hide();
    };

    $scope.openeMailClent = function(provider) {
        var widget =$scope.widget;
        if(provider=="email"){
            $mdDialog.show({
                controller: 'emailCtrl',
                templateUrl: 'views/loginEmail.html',
                resolve: {

                }
            })
        }else if(provider=="twitter"){
            
        }
        
    };

  
}]);

