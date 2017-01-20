/**
 * Created by Damith on 6/10/2016.
 */
// var routerApp = angular.module('digin-entry', ['ngMaterial','ngAnimate', 'ui.router', 'uiMicrokernel', 'configuration'
//     , 'ngToast', 'ngSanitize', 'ngMessages','ngAria']);

var routerApp = angular.module('digin-entry', ['ngMaterial','ngAnimate', 'ui.router', 'configuration'
    , 'ngToast', 'ngSanitize', 'ngMessages','ngAria','ngCookies']);






routerApp
    .config(["$httpProvider", "$stateProvider", "$urlRouterProvider",
        function ($httpProAvider, $stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/signin');
            $stateProvider
                .state("signin", {
                    url: "/signin",
                    controller: "signin-ctrl",
                    templateUrl: "partial-signin.php",
                    data: {
                        requireLogin: false
                    }
                })
                .state("signup", {
                    url: "/signup",
                    controller: "signup-ctrl",
                    templateUrl: "partial-signup.php",
                    data: {
                        requireLogin: false
                    }
                })
                .state("password", {
                    url: "/password",
                    controller: "signin-ctrl",
                    templateUrl: "partial-forgerPw.php",
                    data: {
                        requireLogin: false
                    }
                })
                .state("change", {
                    url: "/change",
                    controller: "signin-ctrl",
                    templateUrl: "partial-changePw.php",
                    data: {
                        requireLogin: false
                    }
                })
                .state("termsNconditions", {
                    url: "/termsNconditions",
                    controller: "signup-ctrl",
                    templateUrl: "termsconditions.php",
                    data: {
                        requireLogin: false
                    }
                })
                .state("registered", {
                    url: "/registered",
                    controller: "signup-ctrl",
                    templateUrl: "completed.php",
                    data: {
                        requireLogin: false
                    }
                })
        }]);

routerApp
    .controller("signin-ctrl", ['$scope', '$http', '$window', '$state',
        '$rootScope', 'focus', 'ngToast', 'Digin_Auth','Digin_Domain','$mdDialog','Local_Shell_Path','IsLocal','Digin_Engine_API','$location','Digin_Tenant','$cookies','$filter','apis_Path','auth_Path','include_Path','onsite',
        function ($scope, $http, $window, $state, $rootScope, focus, ngToast, Digin_Auth,Digin_Domain,$mdDialog,Local_Shell_Path,IsLocal,Digin_Engine_API,$location,Digin_Tenant,$cookies,$filter,apis_Path,auth_Path,include_Path,onsite) {
    
            
    
            $scope.signindetails = {};
            $scope.isLoggedin = false;
            $scope.activated=false;
            $scope.activatedemail="";
            localStorage.setItem('termsNconditions',false);

            $scope.error = {
                isUserName: false,
                isPwd: false,
                event: 0,
                isLoading: false
            };


            //-----activated user - Signin-----------
            var activated = ($location.search()).activated;
            //var activatedemail= ($location.search()).id;
            //var activatedemail= Base64.decode(($location.search()).ox);
            
            var activatedemail= decodeURIComponent($cookies.get('userName'));
            //document.cookie = "userName=" + '' + "; path=/";
            
            if(activatedemail=="undefined"){
                activatedemail="";
                $scope.activatedemail="";
            }
            else{
                 $scope.signindetails.Username=activatedemail;
                 //$scope.activatedemail=activatedemail;
            }

          
            $scope.activated=false;
            if(activated==undefined){
                $scope.activated=false;
            }
            else{
                $scope.activated=true;
            }
            
            //document.cookie = "userName=" + '' + "; path=/";
            
           /* $scope.activatedemail="";
            if(activatedemail==undefined){
                $scope.activatedemail="";
            }
            else{
                $scope.activatedemail=activatedemail;
            }*/
            //------------------------------------

            
            $scope.signup = function () {
                $scope.isLoggedin = false;
                $state.go('signup');
            };

            $scope.onClickSignUp = function () {
                $state.go('signup');
                $scope.activated=false;
            };

            $scope.onClickSignIn = function () {
                $state.go('signin');
                $scope.activated=false;
            };

            $scope.onClickForgetPw = function () {
                $state.go('password');
            };

            $scope.onClickChangePw = function () {
                $state.go('change');
            };

            var mainFun = (function () {
                return {
                    fireMsg: function (msgType, content) {
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
                            dismissOnClick: true,
                            animation: 'slide',
                            dismissOnClick: 'true',
                            timeout: 50000
                        });
                    }
                }
            })();



            //#check tenant package status
            $scope.checkPackageStatus=function(status){
                $scope.statusDetail={"status":status}
                $http({
                method: 'PUT',
                url: Digin_Engine_API+'authorization/userauthorization/login',
                data: angular.toJson($scope.statusDetail),
                headers: {
                     'Content-Type': 'application/json',
                    'SecurityToken': SecurityToken
                    }
                
                }).success(function (data) {
                    fireMsg('1', data);  
                }).error(function (data) {      
                    fireMsg('0', data);;
                });
            };




            //'Username password incorrect' User name or password incorrect, please try again. 
            $scope.login = function () {

                if ($scope.signindetails.Username == '' || angular.isUndefined($scope.signindetails.Username)) {
                    mainFun.fireMsg('0', '<strong>Error : </strong>Username is required..');
                    $scope.error.isUserName = true;
                    focus('$scope.signindetails.Username');
                    return;
                }
                else if ($scope.signindetails.Password == '' || angular.isUndefined($scope.signindetails.Password)) {
                    mainFun.fireMsg('0', '<strong>Error : </strong>Password is required..');
                    $scope.error.isPwd = true;
                    focus('$scope.signindetails.Password');
                    return;
                }

                displayProgress();
                $http({
                    method: 'POST',
                    url: 'http://'+Digin_Domain+apis_Path+'authorization/userauthorization/login',
                    //url: '/apis/authorization/userauthorization/login',
                    headers: {'Content-Type': 'application/json'},
                    data: $scope.signindetails
                }).success(function (data) {
                    if (data.Success === true) {
                        
                        if(onsite){
                            $scope.authData=data.Data.AuthData;
                            $scope.token=data.Data.SecurityToken;
                            //$scope.checkTenantName(tenantId);
                            $scope.proceedLogin($scope.authData,$scope.token);
                        }
                        else{
                            //#check whether user is blocked or not
                            $scope.checkUsage(data.Data.SecurityToken,data.Data);
                        }
                        
                        /*
                        //#loggin direct to shell
                        if(IsLocal==false) { 
                            //#Added for live servers ------------------------------
                            $window.location.href = "/s.php?securityToken=" + data.Data.SecurityToken;
                        }  
                        else{
                        //#Added for local host ------------------------------
                             document.cookie = "securityToken=" + data.Data.SecurityToken + "; path=/";
                             document.cookie = "authData=" + encodeURIComponent(JSON.stringify(data.Data.AuthData)) + "; path=/";
                             window.location.href = Local_Shell_Path; //#got from config.js in entry/assets/js/config.js  (ex:"http://localhost:8080/git/digin/shell")
                        }
                        */
                        
                        
                    }
                    else {
                        $mdDialog.hide();
                        if(data.Message=="Email Address is not verified."){
                            if(onsite){
                                mainFun.fireMsg('0', "Your account is still inactive, Please contact system administrator.");
                            }
                            else{
                                mainFun.fireMsg('0', "This email address is not verified, please verify your email.");
                            }
                            
                        }else if(data.Message.slice(0,22) == "User account is locked")
                        {
                            mainFun.fireMsg('0', "Your account is locked, try again in 2 minutes.");
                        }
                        else if('Username password incorrect')
                        {
                            mainFun.fireMsg('0', "User name or password is incorrect, please try again.");
                        }
                        else{
                            mainFun.fireMsg('0', data.Message);
                        }
                    }
                }).error(function (data) {
                    console.log(data);
                    $mdDialog.hide();
                    mainFun.fireMsg('0', data.Message);
                });
            };

            


            //------------check Customer START-------------------------------
            $scope.checkCustomer = function(Securitytoken, authData) {
                $scope.checkCust = function (cb) {
                    $http({ 
                    //url :"http://prod.digin.io/include/duoapi/paymentgateway/getCustomerInformations",    
                    url: 'http://'+Digin_Domain+include_Path+"duoapi/paymentgateway/getCustomerInformations",
                    method: "POST",
                    headers: {'Content-Type': 'application/json',
                              'securityToken':Securitytoken }
                    }).then(function(response) {
                        if (response.statusText == "OK") {
                                console.log(response)
                                $scope.custStatus = response.data.status;
                                //$scope.custActive=response.data.data[0].active;
                                cb(true);
                        }
                        else {

                        }
                    }, function(response) {
                       cb(false);
                    })
                }

                $scope.checkCust(function(data){
                    if(data){                        
                        $scope.checkSubscription(Securitytoken, authData);
                    }
                })

            }
            
            //------------check Customer END-------------------------------


            //------------check subscription START-------------------------------
            $scope.checkSubscription = function(Securitytoken,authData) {
                $scope.checkStatus = function (cb) {
                    $http({
                        //url :"http://prod.digin.io/include/duoapi/paymentgateway/checkSubscription", 
                        url: 'http://'+Digin_Domain+include_Path+"duoapi/paymentgateway/checkSubscription",
                        method: "POST",
                        headers: {'Content-Type': 'application/json',
                                  'securityToken':Securitytoken }
                    })
                    .success(function(response) {
                        $scope.subscriptionStatus = response.status;
                        $scope.paymentStatus = response.response[0].status;
                        $scope.createdDate=new Date(response.response[0].createdDate* 1000);
                        $scope.currentPeriod=new Date(response.response[0].currentPeriod* 1000);
                        $scope.currentPeriodEnd=new Date(response.response[0].currentPeriodEnd* 1000);
                        $scope.existPackageInfo=response.response[0].otherInfo;
                        
                        cb(true);
                    }).error(function(error) {
                        console.log(response)
                        cb(false);
                    })
                }



                $scope.checkStatus(function(data){
                    if(data){
                        if($scope.custStatus){ //#if subscription status true
                            //#check pay status "trialing","due"
                            if($scope.paymentStatus=="trialing"){
                                //#can login 
                                $scope.proceedLogin(authData, Securitytoken);
                            }
                            else if($scope.paymentStatus=="due"){
                                //#can login - show as payment pending state    
                                $scope.proceedLogin(authData, Securitytoken);
                            }
                            else if($scope.paymentStatus=="active"){
                                //#can login - show as payment pending state    
                                $scope.proceedLogin(authData, Securitytoken);
                            }
                            else{

                            }
                            
                        }
                        else{
                            //#if customer status false
                            //#Account may be free/deacticated/cancelled/
                                if($scope.subscriptionStatus==true){
                                    //#Account deactivated
                                    displayError("Your account has been deactivated...");
                                }
                                else{
                                    if($scope.paymentStatus=="canceled"){
                                        //#Account deactivated
                                        displayError("Your account has been cancelled ...");
                                    }
                                    else{
                                        //#This is free user
                                        //$scope.checkTrialExpiry(authData,Securitytoken);
                                        $scope.checkExpiry(authData,Securitytoken);
                                    }
                                }
                        }

                    }
                })                
            }
            
            $scope.proceedLogin=function(authData, token){
                if(onsite){  
                }
                else{
                    $scope.comparePackage(token);
                }

                //#loggin direct to shell
                if(IsLocal==false) { 
                    //#Added for live servers ------------------------------
                    $window.location.href = "/s.php?securityToken=" + token;
                }  
                else{
                //#Added for local host ------------------------------
                     document.cookie = "securityToken=" + token + "; path=/";
                     document.cookie = "authData=" + encodeURIComponent(JSON.stringify(authData)) + "; path=/";
                     window.location.href = Local_Shell_Path; //#got from config.js in entry/assets/js/config.js  (ex:"http://localhost:8080/git/digin/shell")
                }
            }


            //------------check subscriptions END-------------------------------------

        

            //------------compare subscription and digin package detail and update digin package detail to get actual expiry-------------------------------
            $scope.checkExpiry = function(authData,SecurityToken) {
                $scope.getExpiry = function (cb) {
                    $http.get(Digin_Engine_API + "get_packages?get_type=detail&SecurityToken=" + SecurityToken)
                    .success(function(data) {
                        $scope.PackageDetail=data.Result;
                        if($scope.PackageDetail.length>0){ 
                            for(i=0; i<$scope.PackageDetail.length; i++)
                            {
                                if($scope.PackageDetail[i].package_name!="additional")
                                {
                                    $scope.remainingDays=$scope.PackageDetail[i].remaining_days;
                                    i=$scope.PackageDetail.length;
                                    cb(true);   
                                }                               
                            }
                        }
                    
                    })
                    .error(function() {
                        console.log("error");
                    });
                }

                $scope.getExpiry(function(data){
                    if(data){                        
                        if($scope.remainingDays>0){
                            $scope.proceedLogin(authData, SecurityToken);
                        }
                        else{
                            //#trial period has been expired
                            var confirm = $mdDialog.confirm()
                                .title('Package subscription')
                                .textContent('The trial period has been expired, subscribe a package to proceed. ')
                                .ariaLabel('Lucky day')
                                //.targetEvent(ev)
                                .ok('Subscribe')
                                .cancel('Cancel');
                                $mdDialog.show(confirm).then(function() {
                                    //*Go to My Account
                                    //*If agreed to subscribe, direct myAccount page
                                    mainFun.fireMsg(0, "direct only myAccount");
                                    return; 
                                }, function() {
                                    //*Exit
                                    //*if not going to update Exit from system
                                    $scope.process="logout";
                                    return;
                                });     
                        }
                    }
                })

            }
            
            //------------check Customer END-------------------------------

            
            
            $scope.comparePackage = function(SecurityToken) {
                $scope.compare = function (cb) {
                    $http.get(Digin_Engine_API + "get_packages?get_type=detail&SecurityToken=" + SecurityToken)
                    .success(function(data) {
                        $scope.PackageDetail=data.Result;

                        $scope.dateDiff=0;
                        
                        if(data.Result.length!=0){
                            if($scope.PackageDetail.length>0)
                            { 
                                for(i=0; i<$scope.PackageDetail.length; i++)
                                {
                                    if($scope.PackageDetail[i].package_name!="Free")
                                    {
                                        $scope.expiryDate=$scope.PackageDetail[i].expiry_datetime;
                                        i=$scope.PackageDetail;
                                    }
                                }
                                                    
                                $scope.currentPeriodEnd=$filter('date')($scope.currentPeriodEnd, "yyyy/MM/dd");
                                $scope.expiryDate=$filter('date')($scope.expiryDate, "yyyy/MM/dd");
                                
                                $scope.currentPeriodEnd=new Date($scope.currentPeriodEnd)
                                $scope.expiryDate=new Date($scope.expiryDate)

                                $scope.dateDiff=($scope.currentPeriodEnd-$scope.expiryDate)/(1000 * 60 * 60 * 24)
                                        
                                if($scope.dateDiff>1)
                                {
                                    $scope.additionaluser=0;
                                    $scope.additionaldata=0;
                                    $scope.additionalstorage=0;   
                                    $scope.plan=[];

                                    for(i=0; i<$scope.existPackageInfo.length; i++)
                                    {                   
                                        if($scope.existPackageInfo[i].tag=="Package")
                                        {
                                            if($scope.existPackageInfo[i].feature=="personal_space"){                                               
                                                $scope.plan.name='Personal Space';
                                                $scope.plan.package_id='1002';
                                            }
                                            else if($scope.existPackageInfo[i].feature=="mini_team"){
                                                $scope.plan.name='We Are A Mini Team';
                                                $scope.plan.package_id='1003';
                                            }
                                            else if($scope.existPackageInfo[i].feature="world"){                              
                                                $scope.plan.name='We Are the World';
                                                $scope.plan.package_id='1004';;
                                            }
                                            else{
                                                $scope.plan.name='Free';
                                                $scope.plan.package_id='1001';;
                                            }
                                        }
                                        else
                                        {
                                            if($scope.existPackageInfo[i].tag=="user")
                                            {
                                                if($scope.existPackageInfo[i].action=="add")
                                                {
                                                    additionaluser=additionaluser+$scope.existPackageInfo[i].quantity;
                                                }
                                                if($scope.existPackageInfo[i].action=="remove")
                                                {
                                                    additionaluser=additionaluser-$scope.existPackageInfo[i].quantity;
                                                }
                                            }
                                            else if($scope.existPackageInfo[i].tag=="data")
                                            {
                                                if($scope.existPackageInfo[i].action=="add")
                                                {
                                                    additionaldata=additionaldata+$scope.existPackageInfo[i].quantity;
                                                }
                                                if($scope.existPackageInfo[i].action=="remove")
                                                {
                                                    additionaldata=additionaldata-$scope.existPackageInfo[i].quantity;
                                                }
                                            }
                                            else if($scope.existPackageInfo[i].tag=="storage")
                                            {
                                                if($scope.existPackageInfo[i].action=="add")
                                                {
                                                    additionalstorage=additionalstorage+$scope.existPackageInfo[i].quantity;
                                                }
                                                if($scope.existPackageInfo[i].action=="remove")
                                                {
                                                    additionalstorage=additionalstorage-$scope.existPackageInfo[i].quantity;
                                                }
                                            }
                                        }
                                    }

                                    cb(true);
                                    
                                }
                                else{
                                    
                                    cb(true)
                                }
                                                                                    
                            }
                            else{
                                cb(true)
                            }
                        }
                        else{
                           $scope.plan=[];
                           $scope.plan.package_id='1001';
                           $scope.plan.name='Free';
                           $scope.AddMainPackageToDigin($scope.plan,SecurityToken);
                        } 
                    })
                    .error(function() {
                        //console.log("error");
                    });
                }
            
                $scope.compare(function(data){
                    if(data){  
                        if ($scope.dateDiff>1)   {
                                $scope.AddMainPackageToDigin(SecurityToken);    
                                $scope.AddAdditionalFeaturesToDigin(SecurityToken); 
                        }   
                        else{
                            
                        }                       
                    }
                })

            }
            
            
            //#Add main package to digin engine#//
            $scope.AddMainPackageToDigin = function(SecurityToken) {
                $scope.detail=[{
                                "package_id":$scope.plan.package_id,
                                "package_name":$scope.plan.name,
                                "package_attribute": "",
                                "package_value":0,
                                "package_price":0,
                                "is_default":true,
                                "is_new": false
                            }];
                    
                $http({
                    method: 'POST',
                    url: Digin_Engine_API + 'activate_packages/',
                    data: angular.toJson($scope.detail),
                    headers: {
                        'Content-Type': 'application/json',
                        'SecurityToken': SecurityToken
                    }
                })
                .success(function(response) {  
                    //console.log(response);
                })
                .error(function(data) {
                    //console.log(data);
                });
            }

            //#Add additional features to digin engine#//
            $scope.AddAdditionalFeaturesToDigin = function(SecurityToken) {
                var objDigin=[];

                if($scope.additionaluser!=0){
                    var usersDigin = [{
                        "package_id":null,
                        "package_name":"additional",
                        "package_attribute": "users",
                        "package_value": parseInt($scope.additionaluser),
                        "package_price": parseInt($scope.additionaluser)*5,
                        "is_default":false,
                        "is_new": true
                    }];
                    objDigin.push(usersDigin[0]); 
                }
                else if($scope.additionaldata!=0){
                    var dataDigin = [{
                        "package_id":null,
                        "package_name":"additional",
                        "package_attribute": "data",
                        "package_value":parseInt($scope.additionaldata),
                        "package_price": parseInt($scope.additionaldata)*10,
                        "is_default":false ,
                        "is_new":true
                    }];
                    objDigin.push(dataDigin[0]);
                }
                else if($scope.additionalstorage!=0){
                    var storageDigin = [{
                        "package_id":null,
                        "package_name":"additional",
                        "package_attribute": "storage",
                        "package_value":parseInt($scope.additionalstorage),
                        "package_price":parseInt($scope.additionalstorage)*8,
                        "is_default":false ,
                        "is_new":true
                    }];
                    objDigin.push(storageDigin[0]); 
                }
                
                if(objDigin.length>0){
                    $http({
                        method: 'POST',
                        url: Digin_Engine_API + 'activate_packages/',
                        data: angular.toJson(objDigin),
                        headers: {
                            'Content-Type': 'application/json',
                            'SecurityToken': SecurityToken
                        }
                    })
                    .success(function(response) { 
                        console.log(response);                  
                    })
                    .error(function(data) {
                        console.log(data);
                    });
                }
                
            }




            //#-***********************************************************************
            $scope.checkUsage = function (SecurityToken,result) {    
                $scope.getUsageSummary = function (cb) {
                    $http({
                        method: 'GET',
                        url:"http://"+Digin_Domain+auth_Path+"tenant/GetTenants/" + SecurityToken,
                        headers: {'Content-Type': 'application/json'}
                    })
                    .success(function(data){
                        if(data.length==0){ //#this is new customer tenant not yet created
                            //*This is a new user so, can't see usage details yet
                            //*continue with user login 
                            //$scope.process="login";
                            //cb(true);
                            //return;

                            $scope.proceedLogin(result.AuthData,SecurityToken);

                        }
                        else if(data[0].TenantID==null || data[0].TenantID==""){  //#this is new customer tenant not yet created
                            //*This is a new user so, can't see usage details yet
                            //*continue with user login 
                            //$scope.process="login";
                            //cb(true);
                            //return;

                             $scope.proceedLogin(result.AuthData,SecurityToken);

                        }
                        else{
                            $http({method: 'GET', 
                            url: 'http://'+Digin_Domain+auth_Path+'GetSession/'+SecurityToken+'/'+data[0].TenantID, 
                            headers: {'Securitytoken':SecurityToken}
                            })
                            .success(function (response) {
                                //#get usage summary------------------------------
                                $rootScope.TenantSecToken=response.SecurityToken;
                                $http.get(Digin_Engine_API + "get_usage_summary?SecurityToken=" + $rootScope.TenantSecToken)
                                .success(function(data) {
                                    //#if user blocked 
                                if(data.Result.exceed_blocked.storage==true || data.Result.exceed_blocked.data==true || data.Result.exceed_blocked.users==true ){
                                     //#Do what will do if blocked
                                     var blockReason;
                                     if(data.Result.exceed_blocked.storage==true){blockReason="storage";}
                                     else if(data.Result.exceed_blocked.data==true){blockReason="data";}
                                     else if(data.Result.exceed_blocked.users==true){blockReason="users";}
                                     else{blockReason="";}
                                     
                                            var confirm = $mdDialog.confirm()
                                            .title('Update Account')
                                            .textContent('Currently your account have been blocked, please update '+blockReason)
                                            .ariaLabel('Lucky day')
                                            //.targetEvent(ev)
                                            .ok('Go to My Account')
                                            .cancel('Exit');
                                            $mdDialog.show(confirm).then(function() {
                                                //*Go to My Account
                                                //*If agreed to update, direct myAccount page
                                                $scope.process="myAccount";
                                                cb(true);
                                                return;
                                                
                                            }, function() {
                                                //*Exit
                                                //*if not going to update Exit from system
                                                $scope.process="logout";
                                                cb(true);
                                                return;
                                            });     
                                     }
                                     //#if user not blocked
                                else
                                {
                                        //*continue with user login 
                                    $scope.process="login";
                                    cb(true);
                                    return;
                                }
                            }).error(function() {
                                console.log("error");
                                return;
                            });
                                //------------------------------------------------
                        }).error(function (error) {
                            console.log("error");
                            return;
                        });
                    }
                }).error(function(error){
                    console.log("error");
                });
                }

                $scope.getUsageSummary(function(data){
                    if(data){
                        if($scope.process=="myAccount"){
                            //# go to my Account
                            alert("Go to my account!");
                            $window.location.href = "/s.php?securityToken=" + SecurityToken;
                        }
                        else if($scope.process=="logout"){
                            //#logout
                            //alert("Need to logout!");
                            $window.location = "/logout.php";
                        }
                        else if($scope.process=="login"){
                            $scope.checkCustomer($rootScope.TenantSecToken,result.AuthData);
                            
                                /*
                                //#loggin direct to shell
                                if(IsLocal==false) { 
                                    //#Added for live servers ------------------------------
                                    $window.location.href = "/s.php?securityToken=" + SecurityToken;
                                }  
                                else{
                                //#Added for local host ------------------------------
                                     document.cookie = "securityToken=" + SecurityToken + "; path=/";
                                     document.cookie = "authData=" + encodeURIComponent(JSON.stringify(result.AuthData)) + "; path=/";
                                     window.location.href = Local_Shell_Path; //#got from config.js in entry/assets/js/config.js  (ex:"http://localhost:8080/git/digin/shell")
                                }
                                */
                        }
                        else
                        {
                            console.log("error");
                        }
                    }
                });
            };
            //-***********************************************************************  
        
        
        
        
        
        
        /*

            //#get tenant token before user get login#//
            $scope.checkUsage = function (SecurityToken) {
                $http({
                    method: 'GET',
                    url: "/auth/tenant/GetTenants/" + SecurityToken,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .success(function(data){
                    if(data[0].TenantID==null || data[0].TenantID==""){
                        //*This is a new user so, can't see usage details yet
                    }
                    else{
                        $http({method: 'GET', 
                        url: '/auth/GetSession/'+SecurityToken+'/'+data[0].TenantID, 
                        headers: {'Securitytoken':SecurityToken}
                        })
                        .success(function (response) {
                            $scope.TenantSecToken=response.SecurityToken;  
                            $scope.getUsageSummary(response.SecurityToken);      
                        }).error(function (error) {
                            console.log("error");
                        });
                    }
                }).error(function(error){
                    console.log("error");
                });
            }


            //#get usage summary#//
            $scope.getUsageSummary=function(SecurityToken){
                $http.get(Digin_Engine_API + "get_usage_summary?SecurityToken=" + SecurityToken)
                .success(function(data) {
                    //#if user blocked 
                     if(!data.Result.is_blocked){
                     //#Do what will do if blocked
                            var confirm = $mdDialog.confirm()
                            .title('Update Account')
                            .textContent('Currently your account have been blocked, please update user account')
                            .ariaLabel('Lucky day')
                            //.targetEvent(ev)
                            .ok('Go to My Account')
                            .cancel('Exit');
                            $mdDialog.show(confirm).then(function() {
                                //*Go to My Accoun
                                //*If agreed to update direct myAccount 
                                $scope.isContinue=true;
                            }, function() {
                                //*Exit
                                //*if not going to update Exit system
                                $scope.isContinue=false;
                            });     
                     }
                     //#if user not blocked
                     else{
                        //*continue with user login 
                     }
                }).error(function() {
                    console.log("error");
                });
            }
            

        */   




            /*$scope.createDataSet = function (secToken) {
                //displayProgress('Processing, please wait...!');
                $scope.data = {"db": "bigquery"}

                $http({
                    method: 'POST',
                    url: Digin_Engine_API+'set_init_user_settings',
                    data: angular.toJson($scope.data),
                    headers: {
                        'SecurityToken': secToken
                    }
                })
                .success(function (response) {
                    if (response.Success == true) {
                        //displaySuccess('Success...!');
                        $mdDialog.hide();
                        console.log(response.Message);
                    }
                    else {  
                        //displayError('Data set creation fail');
                        $mdDialog.hide();
                        console.log(response.Message);
                    }

                })
                .error(function (error) {
                    //displayError('Data set creation fail');
                    $mdDialog.hide();
                    console.log(error);
                });
            };   */ 
            
            
            /*
            $scope.isDataSetNotExist=function (secToken, cb){
                $http.get(Digin_Engine_API + 'get_user_settings?SecurityToken=' + secToken + '&Domain=' + Digin_Domain)
                .success(function (res) {
                    if(response.Is_Success==true && response.Custom_Message=='No user settings saved for given user and domain')     
                    {
                        cb(true);
                    }
                    else
                    {
                        
                    }
                })
                .error(function (error) {
                    cb(false);
                });
            };    
            */



            $scope.isUserExist = function (email, cb) {
                $http.get(auth_Path+'GetUser/' + email)
                    .success(function (response) {
                        cb(true);
                    }).error(function (error) {
                    //alert("Fail !"); 
                    cb(false);
                });
            }



            //#pre-loader progress - with message
            var displayProgress = function (message) {
                $mdDialog.show({
                    template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>'+message+'</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>'
                    , parent: angular.element(document.body)
                    , clickOutsideToClose: false
                });
            };

            //#pre-loader progress - without message
            var displayProgress = function () {
                $mdDialog.show({
                    template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="column" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' +  '       </div>' + '   </md-dialog-content>' + '</md-dialog>'
                    , parent: angular.element(document.body)
                    , clickOutsideToClose: false
                });
            };


            //#pre-loader error
            var displayError = function (message) {
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Process fail !').textContent('' + message + '').ariaLabel('Fail to complete.').ok('OK'));
            };

            //#pre-loader success
            var displaySuccess = function (message) {
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Process Completed !').textContent('' + message + '').ariaLabel('Fail to complete.').ok('OK'));
            };


            //#load forgot password
            $scope.validateEmail=function(){
                if($scope.email==undefined){
                    mainFun.fireMsg('0', 'Email can not be a blank.');
                    return false;
                }
                else{
                    displayProgress("Change password processing.")
                    $scope.ChangePassword();
                }
                return true;
            };


            $scope.ChangePassword=function(){
                $http.get('http://'+Digin_Domain+auth_Path+'GetUser/'+$scope.email)
                    .success(function(response){
                        if(response.Error){
                            $mdDialog.hide();
                            mainFun.fireMsg('0', '</strong>Invalid email address or this email address not exist.');                          
                        }
                        else if(response.Active==false){
                            $mdDialog.hide();
                            mainFun.fireMsg('0', '</strong>This account is not yet verified.');
                        }
                        else{
                            $scope.sendMail();
                        }   
                    }).error(function(error){  
                        $mdDialog.hide(); 
                        mainFun.fireMsg('0', '<strong>Error : </strong>Please try again...!');
                    });  
            };

            $scope.sendMail=function(){
                $http.get('http://'+Digin_Domain+apis_Path+'authorization/userauthorization/forgotpassword/'+$scope.email)
                //http://digin.io/apis/authorization/userauthorization/forgotpassword/chamila@duosoftware.com
                .success(function(response){
                    if(response.Success){
                        console.log(response);
                        $mdDialog.hide();
                        mainFun.fireMsg('1', "Successfully reset your password, please check your mail.");
                        //displaySuccess('Succussfully reset your password, Please check your mail for new password...');
                        $scope.email='';
                        $state.go('signin');
                    }
                    else{
                        console.log(response);
                        $mdDialog.hide();
                        fireMsg('0', response.Message);
                    }
                }).error(function(error){  
                    $mdDialog.hide(); 
                    mainFun.fireMsg('0', error);
                });     
            };
       

            //Send request to change password 
            $scope.submitPassword = function()
            {
                //Get reset password by auth
                var oid = ($location.search()).o;
                if(oid==undefined){
                    mainFun.fireMsg('0','Error occurred while changing the password');
                }
                else{
                    
                    //document.cookie = "securityToken=" + ($location.search()).x + "; path=/";                 
                    //document.cookie = "authData="+ encodeURIComponent("SecurityToken="+($location.search()).x+"Domain=pio.prod.digin.io") + "; path=/";           
                    if ($scope.newPassword === $scope.confirmNewPassword) {
                        $http.get(auth_Path+'ChangePassword/' + oid + '/' + encodeURIComponent($scope.newPassword))
                            .success(function (data) {

                                if (data.Error == "true") {
                                    mainFun.fireMsg('0',data);
                                } else {
                                    mainFun.fireMsg('1',"Password changed successfully.");
                                    $window.location = "/logout.php";
                                }

                            }).error(function () {
                                mainFun.fireMsg('0','Error occurred while changing the password');
                            });

                    } else {
                        mainFun.fireMsg('0','Passwords are not matching.');
                    }
                }
            }


    








    }])

    .directive('keyEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.keyEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    })

    .factory('focus', function ($timeout, $window) {
        return function (id) {
            $timeout(function () {
                var element = $window.document.getElementById(id);
                console.log(element);
                if (element)
                    element.focus();
            });
        };
    });




// ------------------------------------------------------------------------
//#signup controller
routerApp
    .controller('signup-ctrl', ['$scope', '$http', '$state', 'focus',
        'Digin_Domain','Digin_Tenant', 'Digin_Engine_API','ngToast','$mdDialog','$location','$timeout','apis_Path','auth_Path','include_Path','onsite','tenantId',
        function ($scope, $http, $state, focus,
                  Digin_Domain,Digin_Tenant, Digin_Engine_API, ngToast,$mdDialog,$location,$timeout,apis_Path,auth_Path,include_Path,onsite,tenantId) {

            //-------------test --
            /*
                $http({
                    method: 'GET',
                    url: Digin_Engine_API + "get_usage_summary?SecurityToken=null&tenant_id="+tenantId+'.'+Digin_Domain,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .success(function(data){
                    if(data.Result.length>0){
                        var tenant=tenantId+'.'+Digin_Domain;
                        $scope.tenantUsers=data.Result.usage+'.'+tenant.length;
                        if($scope.tenantUsers>=$scope.licencedUsers){
                            displayError('Number of licence users has been exceeded.');
                        }
                        else{
                            $scope.regUrl= 'http://'+Digin_Domain+apis_Path+'authorization/offline/tenantuserregistration/'+tenantId+ '.' + Digin_Domain;
                            $scope.registerUser();
                        }
                    }
                    else{
                        displayError('Tenant usage summary is fail.');
                    }                   
                }).error(function(error){
                    console.log("error");
                });
        
            */
            //test end----------------------------------
            
            
           //----------------Password strength validation-------------------------------------
            //$scope.minLengthMsg = false;
            //$scope.strengthText="test";

            $scope.$on('strength_text',function(ev,data){
                $scope.strengthText=data;
                if($scope.strengthText=="very weak1"){
                    $scope.strenghtNote="Password must contain at least 1 number";
                    $scope.errorNote=true;
                }
                else if($scope.strengthText=="very weak2"){
                    $scope.strenghtNote="Password must contain at least 1 charactor";
                    $scope.errorNote=true;
                }
                else
                {
                    $scope.errorNote=false;
                    $scope.error.isPassword = false;
                }
            })
            //-----------------------------------------------------

            $scope.onClickSignIn = function () {
                $scope.isLoggedin = false;
                $scope.freeze=false;
                $scope.activated=false;

                localStorage.setItem('termsNconditions',false);
                localStorage.setItem('fname',"");
                localStorage.setItem('lname',"");
                localStorage.setItem('email',"");
                localStorage.setItem('fpw',"");
                localStorage.setItem('spw',"");

                $state.go('signin');
            };

            $scope.clickAgreed = function () {
                localStorage.setItem('termsNconditions',true);
                $state.go('signup');
            };

            $scope.clickNotAgreed = function () {
                localStorage.setItem('termsNconditions',false)
                $state.go('signup');
            };

            $scope.change = function(agree) {
                localStorage.setItem('termsNconditions',agree);
                //alert(agree);
            };

            $scope.onClickTermConditions = function () {
                localStorage.setItem('fname',signUpUsr.firstName);
                localStorage.setItem('lname',signUpUsr.lastName);
                localStorage.setItem('email',signUpUsr.email);
                localStorage.setItem('fpw',signUpUsr.pwd);
                localStorage.setItem('spw',signUpUsr.cnfrPwd);
                $state.go('termsNconditions');
            };


            var delay = 2000;
            $scope.User_Name = "";
            $scope.User_Email = "";


            var signUpUsr = {
                firstName: '',
                lastName: '',
                email: '',
                pwd: '',
                cnfrPwd: ''
            };
            $scope.signUpUsr = signUpUsr;
            $scope.regex = {
                email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                number: /^\d+$/
            };

            $scope.error = {
                isFirstName: false,
                isLastName: false,
                isEmail: false,
                isPassword: false,
                isRetypeCnfrm: false,
                isLoading: false
            };
            
            $scope.agreed=localStorage.getItem('termsNconditions');
 
            if(localStorage.getItem('fname')==null){signUpUsr.firstName="";}else{signUpUsr.firstName=localStorage.getItem('fname')};
            if(localStorage.getItem('lname')==null){signUpUsr.lastName="";}else{signUpUsr.lastName=localStorage.getItem('lname')};
            if(localStorage.getItem('email')==null){signUpUsr.email="";} else if(localStorage.getItem('email')=="undefined"){signUpUsr.email="";} else {signUpUsr.email=localStorage.getItem('email')};
            if(localStorage.getItem('fpw')==null){signUpUsr.pwd="";}else{signUpUsr.pwd=localStorage.getItem('fpw')};
            if(localStorage.getItem('spw')==null){signUpUsr.cnfrPwd="";}else{signUpUsr.cnfrPwd=localStorage.getItem('spw')}; 
            
            //-----invite user - Signup-----------
            var email = ($location.search()).email;
            var token = ($location.search()).code;
            $scope.freeze=false;
            if(email==undefined){
                $scope.freeze=false;
            }
            else{
                signUpUsr.email=email;
                $scope.freeze=true;
            }
            //------------------------------------        


            //#pre-loader progress
            var displayProgress = function (message) {
                $mdDialog.show({
                    template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>'+message+'</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>'
                    , parent: angular.element(document.body)
                    , clickOutsideToClose: false
                });
            };

            var mainFun = (function () {
                return {
                    fireMsg: function (msgType, content) {
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
                            dismissOnClick: true,
                            animation: 'slide',
                            dismissOnClick: 'true',
                            timeout: 3000
                        });
                    },
                    validationClear: function () {
                        $scope.error = {
                            isFirstName: false,
                            isLastName: false,
                            isEmail: false,
                            isDomainName: false,
                            isPassword: false,
                            isRetypeCnfrm: false
                        };
                    },

                    
                    dataClear: function () {
                        signUpUsr.firstName = '';
                        signUpUsr.lastName = '';
                        signUpUsr.email = '';
                        signUpUsr.pwd = '';
                        signUpUsr.cnfrPwd = '';
                        $scope.freeze=false;
                        
                        localStorage.setItem('termsNconditions',false);
                        localStorage.setItem('fname',"");
                        localStorage.setItem('lname',"");
                        localStorage.setItem('email',"");
                        localStorage.setItem('fpw',"");
                        localStorage.setItem('spw',"");
                        
                    },

                    validateEmail: function (email) {
                        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return re.test(email);
                    },

                    

                    acceptRequest:function(email,token){
                        $http.get(apis_Path+'usertenant/tenant/request/accept/' + email + '/' + token, {
                            headers: {'Content-Type':'application/json'}
                        })
                        .success(function (response) {
                            if (response.Success === true) {
                                $mdDialog.hide();


                                $state.go('registered');

                                /*
                                mainFun.fireMsg('1', 'You account has been successfully created, please check your email to complete your registration!');
                                $timeout(function () {
                                       window.location = "http://"+Digin_Domain+"/entry";
                                }, 5000);
                                */

                               
                            }
                            else
                            {
                                mainFun.fireMsg('0',response.Message);
                            }
                        }).error(function (error) {
                            mainFun.fireMsg('0','Tenant invitation is not accepted successfully.');
                        });
                    },


                    signUpUser: function () {
                        var fullname = signUpUsr.firstName + " " + signUpUsr.lastName;
                        $scope.user = {
                            "EmailAddress": signUpUsr.email,
                            "Name": fullname,
                            "Password": signUpUsr.pwd,
                            "ConfirmPassword": signUpUsr.cnfrPwd
                            //,
                            //"Domain": signUpUsr.firstName + "." + Digin_Domain
                        };

                        $scope.error.isLoading = true;

                        $scope.regUrl="";

                            if(onsite){
                                var tenantcode=tenantId;
                                tenantcode=tenantcode.toLowerCase();
                                tenantcode=tenantcode.replace(/ /g, '');
                               
                                $http({
                                    method: 'GET',
                                    url: 'http://'+Digin_Domain+apis_Path+"usertenant/tenant/" + tenantcode + '.' + Digin_Domain,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    } 
                                })
                                .success(function (response) {
                                    console.log(response);
                                    if(response.TenantID==null || response.TenantID==""){
                                        //#tenant not exist
                                        //$scope.regUrl= Digin_Tenant+'/InvitedUserRegistration';
                                        $scope.regUrl= 'http://'+Digin_Domain+apis_Path+'authorization/offline/userregistration';
                                        $scope.registerUser();
                                    }
                                    else
                                    {
                                        //#tenant exist 
                                        //#not for first time registration-Onsite
                                        //$scope.regUrl= Digin_Tenant+'/RegisterTenantUserWithTenant/'+tenantId+ '.' + Digin_Domain;
                                        $scope.checkLicence();
                                    }
                                    
                                }).error(function (error) {
                                    mainFun.fireMsg(0,error);
                                   
                                });
                            }else{
                                //#Normal registration process 
                                $scope.regUrl='http://'+Digin_Domain+apis_Path+'authorization/userauthorization/userregistration';
                                $scope.registerUser();
                            }
                    },
                }
            })();


            $scope.registerUser=function(){
                $http({
                        method: 'POST',
                        url: $scope.regUrl,
                        data: angular.toJson($scope.user),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).success(function (data, status) {
                        //*Create Data Set
                        //$scope.createDataSet(signUpUsr.email, signUpUsr.firstName);

                        $scope.error.isLoading = false;

                        if(onsite){
                            $scope.error.isLoading = false;
                            $mdDialog.hide();

                            if (data.Success == false) {
                                if(data.Message=="Already Registered."){
                                    mainFun.fireMsg('0','This user name is already registered, please try again!');
                                }else{
                                    mainFun.fireMsg('0',data.Message);
                                }                               
                            }
                            else{
                                $scope.initUserForOnsite();
                                $mdDialog.hide();
                                $state.go('registered'); 
                            }    
                        }
                        else{

                            //$state.go('signin');

                            if (data.Success === false) {
                                $mdDialog.hide();
                                if(data.Message=="Already Registered."){
                                    mainFun.fireMsg('0','This email address you entered is already registered, please try again!');
                                }else{
                                    mainFun.fireMsg('0',data.Message);
                                }                               
                            }
                            else { 
                                // For invited users---------
                                if($scope.freeze==true){
                                    mainFun.acceptRequest(email,token);
                                }
                                else{
                                    $mdDialog.hide();
                                    $state.go('registered');    

                                    /*
                                    mainFun.fireMsg('1', 'You account has been successfully created, please check your email to complete your registration!');
                                    $timeout(function () {
                                       window.location = "http://"+Digin_Domain+"/entry";
                                    }, 5000);
                                    */                                   
                                }
                            }
                        }
                    }).error(function (data, status) {

                        $scope.error.isLoading = false;
                        $mdDialog.hide();
                        
                        if(onsite) {
                            if(data=="Already Registered."){
                                mainFun.fireMsg('0','The username you entered is already registered, please try again!');
                            }
                            else{
                                mainFun.fireMsg('0', 'Please Try again...!');
                            }
                        }
                        else{
                            mainFun.fireMsg('0', 'Please Try again...!');
                        }

                    });
            };


            $scope.initUserForOnsite=function(){
                $http({
                    url: Digin_Engine_API+'onsite_user_save',
                    method: "POST",
                    data: angular.toJson({"tenant":tenantId+'.'+Digin_Domain}),
                    headers: {'Content-Type': 'application/json'}
                })
                .success(function(response) {
                    console.log(response);
                }).error(function(error) {
                    console.log(error);
                })
            }


            //#offline licencing process
             $scope.checkLicence = function() {
                $scope.licencedUsers=1;
                $scope.checkusers = function (cb) {
                    $http.get(Digin_Engine_API + "get_packages?get_type=detail&SecurityToken=null&tanent="+tenantId+'.'+Digin_Domain)
                    //$http.get(Digin_Engine_API + "get_packages?get_type=detail&SecurityToken=&TenantID=122")
                    .success(function(data) {
                        if(data.Is_Success==true){
                            if(data.Result.length>0){
                                for(i=0; i<=data.Result.length; i++){
                                    if(data.Result[i].package_name=='additional'){
                                        $scope.licencedUsers=data.Result[i].package_value_sum;  
                                        i=data.Result.length;
                                        cb(true);
                                    }   
                                }   
                            }
                        }       
                    }, function(response) {
                       cb(false);
                    })
                }

                $scope.checkusers(function(data){
                    if(data){                        
                        $scope.checkTenantUsersCount();
                    }
                })

            }
                
            //#get exist tenat users count
            $scope.checkTenantUsersCount=function(){

                $http({
                    method: 'GET',
                    url: Digin_Engine_API + "get_usage_summary?SecurityToken=null&tenant_id="+tenantId+'.'+Digin_Domain,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .success(function(data){
                    if(data.Result.usage.length>0){
                        $scope.tenantUsers=data.Result.usage.length;
                        var tenant=tenantId+ '.' + Digin_Domain;
                        //tenant="testchamila4.dev.digin.io";
                        var users=data.Result.usage[0][tenant];
                        $scope.tenantUsers=Object.keys(users).length;
                        //var users=data.Result.usage0]["testchamila4.dev.digin.io"]
                        //$scope.tenantUsers=keys(users).length;
                        if($scope.tenantUsers>=$scope.licencedUsers){
                            displayError('Number of licence users has been exceeded.');
                        }
                        else{
                            $scope.regUrl= 'http://'+Digin_Domain+apis_Path+'authorization/offline/tenantuserregistration/'+tenantId+ '.' + Digin_Domain;
                            $scope.registerUser();
                        }
                    }
                    else{
                        displayError('Tenant usage summary is fail.');
                    }   
                }).error(function(error){
                    console.log("error");
                });

                //#------------ remove whn receieved above method
                /*
                $scope.tenantUsers=0;
                $scope.tenantUsers=data.Result.Usage.tenantId.length;


                    if($scope.licencedUsers==$scope.tenantUsers){
                        displayError('Number of licence users has been exceeded.');
                    }
                    else{ 
                        $scope.regUrl= 'http://'+Digin_Domain+apis_Path+'authorization/offline/tenantuserregistration/'+tenantId+ '.' + Digin_Domain;
                        $scope.registerUser();
                    }
                */
            }
                
            $scope.submit = function () {
                mainFun.validationClear();

                console.log(signUpUsr);
                //*validation
                if(onsite){              
                    if (signUpUsr.firstName == '' || angular.isUndefined(signUpUsr.firstName)) {
                        mainFun.fireMsg('0', '<strong>Error : </strong>First name is required..');
                        $scope.error.isFirstName = true;
                        focus('firstName');
                        return;
                    } else if (signUpUsr.lastName == '' || angular.isUndefined(signUpUsr.lastName)) {
                        mainFun.fireMsg('0', '<strong>Error : </strong>Last name is required.');
                        $scope.error.isLastName = true;
                        focus('lastName');
                        return;
                    }
                    else if (signUpUsr.email == '') {
                        mainFun.fireMsg('0', '<strong>Error : </strong>Username is required.');
                        $scope.error.isEmail = true;
                        focus('email');
                        return;
                    }
                    else if (angular.isUndefined(signUpUsr.email)) {
                        mainFun.fireMsg('0', '<strong>Error : </strong>Invalid username.');
                        $scope.error.isEmail = true;
                        focus('email');
                        return;
                    }
                    else if (signUpUsr.pwd == '' || angular.isUndefined(signUpUsr.pwd)) {
                        mainFun.fireMsg('0', '<strong>Error : </strong>Password is required.');
                        $scope.error.isPassword = true;
                        focus('password');
                        return;
                    }else if($scope.errorNote){
                        mainFun.fireMsg('0', '<strong>Error : </strong>Password is required.');
                        $scope.error.isPassword = true;
                        focus('password');
                        return;
                    }
                    else if (signUpUsr.pwd != signUpUsr.cnfrPwd) {
                        mainFun.fireMsg('0', '<strong>Error : </strong>Password does not match.');
                        $scope.error.isPassword = true;
                        $scope.error.isRetypeCnfrm = true;
                        focus('cnfrmPwd');
                        return;
                    }
                    else if(localStorage.getItem('termsNconditions')=="false")
                    {
                        mainFun.fireMsg('0', '<strong>Error : </strong>Please read and accept the terms and conditions.');
                        $scope.error.isagreed = true;
                        focus('agreed');
                        return;
                    }
                    else {
                        displayProgress('User registration is processing.');
                        mainFun.signUpUser();  
                    }     
                }
                else{
                    if (signUpUsr.firstName == '' || angular.isUndefined(signUpUsr.firstName)) {
                        mainFun.fireMsg('0', '<strong>Error : </strong>First name is required..');
                        $scope.error.isFirstName = true;
                        focus('firstName');
                        return;
                    } else if (signUpUsr.lastName == '' || angular.isUndefined(signUpUsr.lastName)) {
                        mainFun.fireMsg('0', '<strong>Error : </strong>Last name is required.');
                        $scope.error.isLastName = true;
                        focus('lastName');
                        return;
                    }

                    else if (signUpUsr.email == '') {
                        mainFun.fireMsg('0', '<strong>Error : </strong>Email address is required.');
                        $scope.error.isEmail = true;
                        focus('email');
                        return;
                    }
                    else if (angular.isUndefined(signUpUsr.email)) {
                        mainFun.fireMsg('0', '<strong>Error : </strong>Invalid email address.');
                        $scope.error.isEmail = true;
                        focus('email');
                        return;
                    }
                    else if (!mainFun.validateEmail(signUpUsr.email)) {
                        mainFun.fireMsg('0', '<strong>Error : </strong>Invalid email address.');
                        $scope.error.isEmail = true;
                        focus('email');
                        return;
                    }

                    else if (signUpUsr.pwd == '' || angular.isUndefined(signUpUsr.pwd)) {
                        mainFun.fireMsg('0', '<strong>Error : </strong>Password is required.');
                        $scope.error.isPassword = true;
                        focus('password');
                        return;
                    }
                    else if (signUpUsr.pwd != signUpUsr.cnfrPwd) {
                        mainFun.fireMsg('0', '<strong>Error : </strong>Password does not match.');
                        $scope.error.isPassword = true;
                        $scope.error.isRetypeCnfrm = true;
                        focus('cnfrmPwd');
                        return;
                    }
                    else if(localStorage.getItem('termsNconditions')=="false")
                    {
                        mainFun.fireMsg('0', '<strong>Error : </strong>Please read and accept the terms and conditions.');
                        $scope.error.isagreed = true;
                        focus('agreed');
                        return;
                    }
                    else {
                        displayProgress('User registration is processing.');
                         mainFun.signUpUser();  
                    }
                }
            };




            //Password strength alert
            $scope.showAlert = function(ev) {
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('This is an alert title')
                    .textContent('You can specify some description text in here.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                    .targetEvent(ev)
                );
            };


            




        }
    ]);


//*Password verification
routerApp.directive('passwordVerify', function () {
    return {
        require: "ngModel",
        scope: {
            passwordVerify: '='
        },
        link: function (scope, element, attrs, ctrl) {
            scope.$watch(function () {
                var combined;
                if (scope.passwordVerify || ctrl.$viewValue) {
                    combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                }
                return combined;
            }, function (value) {
                if (value) {
                    ctrl.$parsers.unshift(function (viewValue) {
                        var origin = scope.passwordVerify;
                        if (origin !== viewValue) {
                            ctrl.$setValidity("passwordVerify", false);
                            return undefined;
                        } else {
                            ctrl.$setValidity("passwordVerify", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
}).factory('focus', function ($timeout, $window) {
    return function (id) {
        $timeout(function () {
            var element = $window.document.getElementById(id);
            console.log(element);
            if (element)
                element.focus();
        });
    };
});



//Password Strength Directive - Start
/*
routerApp.directive('passwordStrengthIndicator',passwordStrengthIndicator);
function passwordStrengthIndicator() {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs, ngModel) {

            scope.strengthText = "";

            var strength = {
                measureStrength: function (p) {
                    var _passedMatches = 0;
                    var _regex = /[$@&+#-/:-?{-~!^_`\[\]]/g;
                    if (/[a-z]+/.test(p)) {
                        _passedMatches++;
                    }
                    if (/[A-Z]+/.test(p)) {
                        _passedMatches++;
                    }
                    if (_regex.test(p)) {
                        _passedMatches++;
                    }
                    return _passedMatches;
                }
            };

            var indicator = element.children();
            var dots = Array.prototype.slice.call(indicator.children());
            var weakest = dots.slice(-1)[0];
            var weak = dots.slice(-2);
            var strong = dots.slice(-3);
            var strongest = dots.slice(-4);

            element.after(indicator);

            var listener = scope.$watch('ngModel', function (newValue) {
                angular.forEach(dots, function (el) {
                    el.style.backgroundColor = '#EDF0F3';
                });
                if (ngModel.$modelValue) {
                    var c = strength.measureStrength(ngModel.$modelValue);
                    if (ngModel.$modelValue.length > 7 && c > 2) {
                        angular.forEach(strongest, function (el) {
                            el.style.backgroundColor = '#039FD3';
                            scope.strengthText = "very strong";

                        });
                   
                    } else if (ngModel.$modelValue.length > 5 && c > 1) {
                        angular.forEach(strong, function (el) {
                            el.style.backgroundColor = '#72B209';
                            scope.strengthText = "strong";

                        });
                    } else if (ngModel.$modelValue.length > 3 && c > 0) {
                        angular.forEach(weak, function (el) {
                            el.style.backgroundColor = '#E09015';
                            scope.strengthText = "weak";
                        });
                    } else {
                        weakest.style.backgroundColor = '#D81414';
                        scope.strengthText = "very weak";
                    }

                    scope.$emit('strength_text',scope.strengthText);
                }
            });

            

            scope.$on('$destroy', function () {
                return listener();
            });
        },
        template: '<span id="password-strength-indicator"><span></span><span></span><span></span><span></span><md-tooltip>Password strength is {{strengthText}}</md-tooltip></span>'
    };
}*/
//Password Strength Directive - End


//#Pw strength directive test ------------------start-------
routerApp.directive('passwordStrengthIndicator',passwordStrengthIndicator);
function passwordStrengthIndicator() {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs, ngModel) {

            scope.strengthText = "";

            var strength = {
                measureStrength: function (p) {
                    var _passedMatches = 0;
                    var _regex = /[$@&+#-/:-?{-~!^_`\[\]]/g;
                    if (/[a-z]+/.test(p)) {
                        _passedMatches = 1;
                    }
                    if (/[A-Z]+/.test(p)) {
                        _passedMatches = 1;
                    }
                    if (/[0-9]+/.test(p)) {
                       _passedMatches = 2;
                    }
                    if (/[a-z]+/.test(p) && /[0-9]+/.test(p)) {
                        _passedMatches = 3;
                    }
                    if (/[A-Z]+/.test(p) && /[0-9]+/.test(p)) {
                        _passedMatches = 3;
                    }
                    if (/[A-Z]+/.test(p) && /[a-z]+/.test(p) && /[0-9]+/.test(p)) {
                        _passedMatches = 4;
                    }
                    if (/[A-Z]+/.test(p) && /[a-z]+/.test(p) && /[0-9]+/.test(p) && _regex.test(p)) {
                        _passedMatches = 5;
                    }
                    //if (_regex.test(p)) {
                    //    _passedMatches++;
                    //}
                    return _passedMatches;
                }
            };

            var indicator = element.children();
            var dots = Array.prototype.slice.call(indicator.children());
            var weakest = dots.slice(-1)[0];
            var weak = dots.slice(-2);
            var strong = dots.slice(-3);
            var strongest = dots.slice(-4);

            element.after(indicator);

            var listener = scope.$watch('ngModel', function (newValue) {
                angular.forEach(dots, function (el) {
                    el.style.backgroundColor = '#EDF0F3';
                });
                if (ngModel.$modelValue) {
                    var c = strength.measureStrength(ngModel.$modelValue);
                    if (ngModel.$modelValue.length > 7 && c > 4) {
                        angular.forEach(strongest, function (el) {
                            el.style.backgroundColor = '#039FD3';
                            scope.strengthText = "very strong";
                        });
                    } else if (ngModel.$modelValue.length > 5 && c > 3) {
                        angular.forEach(strong, function (el) {
                            el.style.backgroundColor = '#72B209';
                            scope.strengthText = "strong";
                        });
                    } else if (ngModel.$modelValue.length > 5 && c > 2) {
                        angular.forEach(weak, function (el) {
                            el.style.backgroundColor = '#E09015';
                            scope.strengthText = "weak";
                        });
                    }
                    else if (ngModel.$modelValue.length > 5 && c >1) {
                        angular.forEach(weak, function (el) {
                            el.style.backgroundColor = '#D81414';
                            scope.strengthText = "very weak2";
                        });
                    }else if (ngModel.$modelValue.length > 5 && c >0) {
                        angular.forEach(weak, function (el) {
                            el.style.backgroundColor = '#D81414';
                            scope.strengthText = "very weak1";
                        });
                    } else {
                        weakest.style.backgroundColor = '#D81414';
                        scope.strengthText = "very weak";
                    }

                    scope.$emit('strength_text',scope.strengthText);
                }
            });

            

            scope.$on('$destroy', function () {
                return listener();
            });
        },
        template: '<span id="password-strength-indicator"><span></span><span></span><span></span><span></span><md-tooltip>Password strength is {{strengthText}}</md-tooltip></span>'
    };
}