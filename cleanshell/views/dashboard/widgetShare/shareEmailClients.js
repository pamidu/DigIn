DiginApp.controller('shareEmailClients', ['$scope','$mdDialog','widget','DashboardName','widgetShareService',function ($scope,$mdDialog,widget,DashboardName,widgetShareService) {

    $scope.widget = widget;
    $scope.DashboardName = DashboardName;
    $scope.widgetName="";

    if(typeof $scope.widget.widgetData.widName != "undefined")
        $scope.widgetName=$scope.widget.widgetData.widName;
    else
        $scope.widgetName=$scope.widget.widgetName;


     $scope.shareOptions = [{
        provider: "Gmail",
        icon: "views/dashboard/widgetShare/icons/gmail.svg"
        }, {
            provider: "Yahoo",
            icon: "views/dashboard/widgetShare/icons/yahoo.svg"
        }, 
         {
             provider: "outlook",
             icon: "views/dashboard/widgetShare/icons/outlook.svg"
         }, 
        {
            provider: "Other",
            icon: "views/dashboard/widgetShare/icons/mail.svg"
        }];


    $scope.closeDialog = function() {

        $mdDialog.hide();
    };

    $scope.openeMailClent = function(ev, provider) {
        var widget =$scope.widget;
        var URL = widgetShareService.getShareWidgetURL(ev, widget,$scope.getreturnEmail,provider);
    };

   $scope.getreturnEmail = function(ev, URL,provider){
    

    var emailSubject = 'DigIn - '+$scope.DashboardName+' : '+$scope.widgetName+'';
    var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
    var sender = userInfo.Email;

    var emailBody = 'Hi,%0D%0A%0D%0ACheck Out '+$scope.DashboardName+' : '+$scope.widgetName+' shared by '+sender
    +'.%0D%0A%0D%0APowered by DigIn.io.%0A%0D%0A(URL of the widget '+URL+')%0D%0A%0D%0ARegards,%0D%0A%0D%0ADigIn Team.';
      
      if(provider=="Other"){
            $mdDialog.show({
                controller: 'localEmailClient',
                templateUrl: 'views/dashboard/widgetShare/loginEmail.html',
                targetEvent: ev,
                locals: {
                    URL: URL,
                    DashboardName:$scope.DashboardName,
                    widgetName:$scope.widgetName

                }
            })
        }else if(provider=="Gmail"){
            //#First open up the authentication dialog
            window.open('https://mail.google.com/mail/?view=cm&fs=1&to=&su='+emailSubject+'&body='+emailBody+'&bcc=','_blank'); 
        }
        else if(provider=="Yahoo"){
            window.open('http://compose.mail.yahoo.com/?to=&subject='+emailSubject+'&body='+emailBody+'','_blank');
        }
        else if(provider=="outlook"){
            window.open('https://outlook.live.com/?path=/mail/action/compose&to=&subject='+emailSubject+'&body='+emailBody+'','_blank');
        }
   } 
}]);



DiginApp.controller('localEmailClient', ['$scope','$mdDialog','URL','DashboardName','widgetName','$http','notifications','Digin_CEB',function ($scope,$mdDialog,URL,DashboardName,widgetName,$http,notifications,Digin_CEB) {
    
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
            //console.log(JSON.stringify($scope.mailData));
            $http({
                method: 'POST',
                url: Digin_CEB+'/command/notification',
                data: $scope.mailData,
                headers:{
                    'Content-Type': 'application/json',
                    'securityToken': token
                }
            }).then(function(response){
                console.log(response)
                notifications.toast('1', 'Mail sent successfully!');
                $mdDialog.cancel();
            },function(response){
                console.log(response)
                notifications.toast('0', 'Mail sending fail!');
            })   
        }  
        else{
            notifications.toast('0', 'Please check your email addresses!');
        }
    }

    $scope.validateEmail = function(email){
        var pattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
        return pattern.test(email);    
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