routerApp.controller('shareEmailClients', ['$scope','$mdDialog','widget','ShareWidgetService',function ($scope,$mdDialog,widget,ShareWidgetService) {

    $scope.widget = widget;
     $scope.shareOptions = [{
        provider: "Gmail",
        icon: "styles/css/images/icons/gmail.svg"
        }, {
            provider: "Yahoo",
            icon: "styles/css/images/icons/yahoo.svg"
        }, 
         {
             provider: "outlook",
             icon: "styles/css/images/icons/outlook.svg"
         }, 
        {
            provider: "Other",
            icon: "styles/css/images/icons/mail.svg"
        }];


    $scope.closeDialog = function() {

        $mdDialog.hide();
    };

    

    $scope.openeMailClent = function(provider) {
        var widget =$scope.widget;
        var URL = ShareWidgetService.getShareWidgetURL(widget,$scope.getreturnEmail,provider);
  
    };


   $scope.getreturnEmail = function(URL,provider){

      if(provider=="Other"){
            $mdDialog.show({
                controller: 'localEmailClient',
                templateUrl: 'views/loginEmail.html',
                resolve: {},
                locals: {
                    URL: URL
                }
            })
        }else if(provider=="Gmail"){

            //First open up the authentication dialog
            https://mail.google.com/mail/?to=inbox@example.com&bcc=admin@example.com&subject=Hey#compose
            window.open('https://mail.google.com/mail/?view=cm&fs=1&to=&su=Digin shared a link with u ....&body='+URL+'&bcc=','_blank');
            
        }
        else if(provider=="Yahoo"){
            window.open('http://compose.mail.yahoo.com/?to=&subject=Digin shared a link with u ....&body='+URL+'','_blank');

        }
        else if(provider=="outlook"){
            window.location.href ='mailto:?subject=Digin shared a link with u ....&body='+URL+'';

        }

   }

  
}]);

routerApp.controller('localEmailClient', ['$scope','$mdDialog','URL','$http','ngToast',function ($scope,$mdDialog,URL,$http,ngToast) {

    $scope.emailBody=URL,
    $scope.emailSubject="Digin shared a link with u ....",
    $scope.emailTo;
    $scope.emailCc;
    var isCClistOk = true;
    $scope.sendEmail=function () {

            if(typeof $scope.emailCc != "undefined")
                isCClistOk = $scope.checkCCList($scope.emailCc);

          if($scope.validateEmail($scope.emailTo) && isCClistOk){
            
            
            $scope.mailData =   {
                "type": "email",
                "to": $scope.emailTo,
                "cc" : $scope.emailCc,
                "subject": $scope.emailSubject,
                "from": "Digin <noreply-digin@duoworld.com>",
                "Namespace": "com.duosoftware.com",
                "TemplateID": "T_Email_GENERAL",
                "DefaultParams": {
                    "@@CNAME@@": "",
                    "@@TITLE@@": "",
                    "@@MESSAGE@@": $scope.emailBody,
                    "@@CNAME@@": "",
                    "@@APPLICATION@@":"",
                    "@@FOOTER@@": "Copyright DigIn 2016",
                    "@@LOGO@@": ""
                },
                "CustomParams": {
                    "@@CNAME@@": "",
                    "@@TITLE@@": "",
                    "@@MESSAGE@@": "",
                    "@@CNAME@@": "",
                    "@@APPLICATION@@": "Digin.io",
                    "@@FOOTER@@": "Copyright DigIn 2016",
                    "@@LOGO@@": ""
                }
            };

            var token =getCookie("securityToken");

            console.log(JSON.stringify($scope.mailData));
            $http({
                method: 'POST',
                url: 'http://104.196.114.113:3500/command/notification',
                data: $scope.mailData,
                headers:{
                    'Content-Type': 'application/json',
                    'securityToken': token
                }
            }).then(function(response){
                console.log(response)
                $scope.fireMsg('1', 'Mail sent successfully!');
                $scope.close();
            },function(response){
                console.log(response)
                $scope.fireMsg('0', 'Mail sending fail!');
            })   

        }  
        else{
            $scope.fireMsg('0', 'Please check your email addresses!');
        }
    }

    $scope.close = function() {

            $mdDialog.hide();
    };

    $scope.closeDialog = function() {

            $mdDialog.hide();
    };

    $scope.validateEmail = function(email){

        var pattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
        return pattern.test(email);    
    }

    $scope.fireMsg=function (msgType, content) {
            ngToast.dismiss();

            var _className;
            if (msgType == '0') {
                _className = 'danger';
            } else if (msgType == '1') {
                _className = 'success';
            }
                ngToast.create({
                    className: _className,
                    content: content,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    dismissOnClick: true
                    });
    }

    $scope.checkCCList = function(ccList){

        var str = ccList;
        var res = str.split(",");

        for(var i =0 ; i < res.length ; i++){

            if(!$scope.validateEmail(res[i]))
                return false;
        }

        return true;
    }



}]);    