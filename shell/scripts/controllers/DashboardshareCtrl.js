routerApp.controller('shareCtrl', ['Socialshare', '$scope','$mdDialog','widget',function (Socialshare,$scope,$mdDialog,widget) {

    $scope.widget = widget;
     $scope.shareOptions = [{
        provider: "facebook",
        icon: "styles/css/images/icons/facebook.svg"
    }, {
        provider: "google",
        icon: "styles/css/images/icons/googleplus.svg"
    }, {
        provider: "twitter",
        icon: "styles/css/images/icons/twitter.svg"
    }, {
        provider: "linkedin",
        icon: "styles/css/images/icons/linkedin.svg"
    }, {
        provider: "pinterest",
        icon: "styles/css/images/icons/pinterest.svg"
    }, {
        provider: "tumblr",
        icon: "styles/css/images/icons/tumblr.svg"
    },{
        provider: "email",
        icon: "styles/css/images/icons/email.svg"
    }];

    $scope.close = function() {

        $mdDialog.hide();
    };
    $scope.openProvider = function(provider) {
        var widget =$scope.widget;
        if(provider=="email"){
            $mdDialog.show({
                controller: 'shareEmailClients',
                templateUrl: 'views/shareEmailClients.html',
                resolve: {},
                locals: {
                    widget: widget
                }
            })
        }
        else {
         
           Socialshare.share({
                  'provider': provider,
                  'attrs': {

                    'socialshareUrl': 'http://720kb.net',
                    'socialsharePopupHeight':'400',
                    'socialsharePopupWidth':'400'
                    

                  }
            });
        }
    };

  
}]);

