DiginApp.controller('shareCtrl', ['Socialshare', '$scope', '$mdDialog', 'widget','DashboardName','DiginServices', function(Socialshare, $scope, $mdDialog, widget,DashboardName,DiginServices) {

    $scope.widget = widget;
    $scope.DashboardName = DashboardName;
    $scope.shareOptions = [{
        provider: "facebook",
        icon: "views/dashboard/widgetShare/icons/facebook.svg"
    }, {
        provider: "google",
        icon: "views/dashboard/widgetShare/icons/googleplus.svg"
    }, {
        provider: "twitter",
        icon: "views/dashboard/widgetShare/icons/twitter.svg"
    }, {
        provider: "linkedin",
        icon: "views/dashboard/widgetShare/icons/linkedin.svg"
    }, {
        provider: "email",
        icon: "views/dashboard/widgetShare/icons/email.svg"
    }];

    $scope.close = function() {

        $mdDialog.hide();
    };
    $scope.openProvider = function(provider) {
        var widget = $scope.widget;
        if (provider == "email") {
            $mdDialog.show({
                controller: 'shareEmailClients',
                templateUrl: 'views/dashboard/widgetShare/shareEmailClients.html',
                resolve: {},
                locals: {
                    widget: widget,
                    DashboardName: DashboardName
                }
            })
        } else {

            DiginServices.getShareWidgetURL(widget, $scope.getreturnSocial, provider);

        }
    };


    $scope.getreturnSocial = function(url, provider) {
        //var url = 'http://prod.digin.io/digin_data/digin_user_data/1fe2dfa9c6c56c8492b9c78107eb5ae3/nordirisrhytacom.prod.digin.io/DPs/4.jpg';
        if (provider == "pinterest") {
            window.open('https://pinterest.com/pin/create/button/?url=' + url + '', '_blank');
        } else if (provider == "tumblr") {
            window.open('http://www.tumblr.com/share/link?url=' + url + '', '_blank');
        } else {
            Socialshare.share({
                'provider': provider,
                'attrs': {

                    'socialshareUrl': url,
                    'socialsharePopupHeight': '400',
                    'socialsharePopupWidth': '400'


                }
            });
        }

    }

}]);
