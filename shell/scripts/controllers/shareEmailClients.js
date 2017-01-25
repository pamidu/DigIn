routerApp.controller('shareEmailClients', ['$scope','$mdDialog','widget','DashboardName','ShareWidgetService',function ($scope,$mdDialog,widget,DashboardName,ShareWidgetService) {

    $scope.widget = widget;
    $scope.DashboardName = DashboardName;
    $scope.widgetName="";

    if(typeof $scope.widget.widgetData.widName != "undefined")
        $scope.widgetName=$scope.widget.widgetData.widName;
    else
        $scope.widgetName=$scope.widget.widgetName;


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


    var emailSubject = 'DigIn - '+$scope.DashboardName+' : '+$scope.widgetName+'';
    var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
    var sender = userInfo.Email;

    var emailBody = 'Hi,%0D%0A%0D%0ACheck Out '+$scope.DashboardName+' : '+$scope.widgetName+' shared by '+sender
    +'.%0D%0A%0D%0APowered by DigIn.io.%0A%0D%0A(URL of the widget '+URL+')%0D%0A%0D%0ARegards,%0D%0A%0D%0ADigIn Team.';
      
      if(provider=="Other"){
            $mdDialog.show({
                controller: 'localEmailClient',
                templateUrl: 'views/loginEmail.html',
                resolve: {},
                locals: {
                    URL: URL,
                    DashboardName:$scope.DashboardName,
                    widgetName:$scope.widgetName

                }
            })
        }else if(provider=="Gmail"){

            //First open up the authentication dialog
            //https://mail.google.com/mail/?to=inbox@example.com&bcc=admin@example.com&subject=Hey#compose
            window.open('https://mail.google.com/mail/?view=cm&fs=1&to=&su='+emailSubject+'&body='+emailBody+'&bcc=','_blank');
            
        }
        else if(provider=="Yahoo"){

    //          emailBody = 'Hi,%0D%0ACheck Out '+$scope.DashboardName+' : '+$scope.widgetName+' shared by '+sender
    // +'.%0D%0APowered by DigIn.io.%0D%0A(URL of the widget '+URL+')%0D%0ARegards,%0D%0ADigIn Team.';
  
            window.open('http://compose.mail.yahoo.com/?to=&subject='+emailSubject+'&body='+emailBody+'','_blank');

        }
        else if(provider=="outlook"){
            //window.location.href ='mailto:?subject='+emailSubject+'&body='+emailBody+'';

            window.open('https://outlook.live.com/?path=/mail/action/compose&to=&subject='+emailSubject+'&body='+emailBody+'','_blank');




        }

   }

  
}]);

routerApp.controller('localEmailClient', ['$scope','$mdDialog','URL','DashboardName','widgetName','$http','ngToast',function ($scope,$mdDialog,URL,DashboardName,widgetName,$http,ngToast) {

    var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
    var sender = userInfo.Email;
    $scope.emailBody='Check Out '+DashboardName+' : '+widgetName+' shared by '+sender+'.<br><br>powered by DigIn.io(link to '+URL+')<br><br>Regards,<br><br>DigIn Team.';
    $scope.emailSubject='DigIn - '+DashboardName+' : '+widgetName+'';
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
                    "@@dashboardName@@": DashboardName+' : '+widgetName,
                    "@@fromMail@@": sender,
                    "@@URL@@": URL,
                },
                "CustomParams": {
                    "@@dashboardName@@": DashboardName+' : '+widgetName,
                    "@@fromMail@@": sender,
                    "@@URL@@": URL,
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