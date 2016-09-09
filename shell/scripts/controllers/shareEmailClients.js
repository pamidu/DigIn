routerApp.controller('shareEmailClients', ['$scope','$mdDialog','widget','ShareWidgetService',function ($scope,$mdDialog,widget,ShareWidgetService) {

    $scope.widget = widget;
     $scope.shareOptions = [{
        provider: "Gmail",
        icon: "styles/css/images/icons/gmail.svg"
        }, {
            provider: "Yahoo",
            icon: "styles/css/images/icons/yahoo.svg"
        }, 
        // {
        //     provider: "twitter",
        //     icon: "styles/css/images/icons/twitter.svg"
        // }, 
        {
            provider: "Other",
            icon: "styles/css/images/icons/mail.svg"
        }];


    $scope.closeDialog = function() {

        $mdDialog.hide();
    };

    $scope.openeMailClent = function(provider) {
        var widget =$scope.widget;
        var URL = ShareWidgetService.getShareWidgetURL(widget);
        
        if(provider=="Other"){
            $mdDialog.show({
                controller: 'emailCtrl',
                templateUrl: 'views/loginEmail.html',
                resolve: {

                }
            })
        }else if(provider=="Gmail"){
            https://mail.google.com/mail/?to=inbox@example.com&bcc=admin@example.com&subject=Hey#compose
            window.open('https://mail.google.com/mail/?view=cm&fs=1&to=&su=shared a link with u ....&body='+URL+'&bcc=','_blank');
            
        }
        else if(provider=="Yahoo"){
            window.open('http://compose.mail.yahoo.com/?to=&subject=shared a link with u ....&body='+URL+'','_blank');
        }
        
    };

  
}]);

