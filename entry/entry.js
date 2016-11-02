/**
 * Created by Damith on 6/10/2016.
 */
// var routerApp = angular.module('digin-entry', ['ngMaterial','ngAnimate', 'ui.router', 'uiMicrokernel', 'configuration'
//     , 'ngToast', 'ngSanitize', 'ngMessages','ngAria']);

var routerApp = angular.module('digin-entry', ['ngMaterial','ngAnimate', 'ui.router', 'configuration'
    , 'ngToast', 'ngSanitize', 'ngMessages','ngAria','pouchdb',]);


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
        '$rootScope', 'focus', 'ngToast', 'Digin_Auth','Digin_Domain','$mdDialog','Local_Shell_Path','IsLocal','Digin_Engine_API','$location','Digin_Tenant','pouchDB',
        function ($scope, $http, $window, $state, $rootScope, focus, ngToast, Digin_Auth,Digin_Domain,$mdDialog,Local_Shell_Path,IsLocal,Digin_Engine_API,$location,Digin_Tenant,pouchDB) {

            var db = new PouchDB('login');
                
            var doc_login = {
              "_id": "login",
              "initialLogin": "true"
            };
            db.put(doc_login);
        

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
            
            $scope.activated=false;
            if(activated==undefined){
                $scope.activated=false;
            }
            else{
                $scope.activated=true;
            }
            
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



            //'Username password incorrect' User name or password incorrect, please try again. 
            $scope.login = function () {

                displayProgress();
                $http({
                    method: 'POST',
                    url: 'http://'+Digin_Domain+'/apis/authorization/userauthorization/login',
                    //url: '/apis/authorization/userauthorization/login',
                    headers: {'Content-Type': 'application/json'},
                    data: $scope.signindetails
                }).success(function (data) {
                    if (data.Success === true) {
                        
                        

                        //#check whether user is blocked or not
                        $scope.checkUsage(data.Data.SecurityToken,data.Data);

                        
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
                        if(data.Message=="Email Address is not varified."){
                            mainFun.fireMsg('0', "This email address is not verified, please verify your email.");
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

            


            //------------check subscriptions START-------------------------------
  
            $scope.checkSubscription = function(Securitytoken) {
                $scope.checkStatus = function (cb) {
                    $http({
                        //url : "http://staging.digin.io/include/duoapi/paymentgateway/checkSubscription",
                        url: "/include/duoapi/paymentgateway/checkSubscription",
                        method: "POST",
                        headers: {'Content-Type': 'application/json',
                                  'securityToken':Securitytoken }
                    })
                    .success(function(response) {
                        //console.log(response)
                        if (response.statusText == "OK") {
                            $scope.custStatus = response.data.status;
                            cb(true);
                        }
                    }).error(function(error) {
                        console.log(response)
                        cb(false);
                    })
                }

                $scope.checkStatus(function(data){
                    if(data){
                        if(!$scope.custStatus){ //if trial, need to chk remaining days
                            $scope.checkTrialExpiry(Securitytoken);
                        }
                        else{//proceed with usage detail to check blocking status

                        }

                    }
                })
                
            }
            


   






            //------------check subscriptions END-------------------------------------

        

            //#get trial expiry #//
            
            $scope.checkTrialExpiry=function(SecurityToken){
                $http.get(Digin_Engine_API + "get_packages?get_type=detail&SecurityToken=" + getCookie('securityToken'))
                .success(function(data) {
                    $scope.PackageDetail=data.data.Result;
                    if($scope.PackageDetail.length>0){ 
                        for(i=0; i<$scope.PackageDetail.length; i++){
                            if($scope.PackageDetail[i].package_name=="Free"){
                                $scope.remainingDays=$scope.PackageDetail[i].remaining_days;
                            }
                        }
                    }
                    else{
                        $scope.remainingDays=30;
                    }
                })
                .error(function() {
                    console.log("error");
                });
            }





            //#-***********************************************************************
            $scope.checkUsage = function (SecurityToken,result) {    
                $scope.getUsageSummary = function (cb) {
                    $http({
                        method: 'GET',
                        url:"http://"+Digin_Domain+ "/auth/tenant/GetTenants/" + SecurityToken,
                        headers: {'Content-Type': 'application/json'}
                    })
                    .success(function(data){
                        if(data.length==0){
                            //*This is a new user so, can't see usage details yet
                            //*continue with user login 
                            $scope.process="login";
                            cb(true);
                            return;
                        }
                        else if(data[0].TenantID==null || data[0].TenantID==""){
                            //*This is a new user so, can't see usage details yet
                            //*continue with user login 
                            $scope.process="login";
                            cb(true);
                            return;
                        }
                        else{
                            $http({method: 'GET', 
                            url: 'http://'+Digin_Domain+'/auth/GetSession/'+SecurityToken+'/'+data[0].TenantID, 
                            headers: {'Securitytoken':SecurityToken}
                            })
                            .success(function (response) {
                                //#get usage summary------------------------------
                                $http.get(Digin_Engine_API + "get_usage_summary?SecurityToken=" + SecurityToken)
                                .success(function(data) {
                                    //#if user blocked 
                                     if(data.Result.is_blocked){
                                     //#Do what will do if blocked
                                            var confirm = $mdDialog.confirm()
                                            .title('Update Account')
                                            .textContent('Currently your account have been blocked, please update user account')
                                            .ariaLabel('Lucky day')
                                            //.targetEvent(ev)
                                            .ok('Go to My Account')
                                            .cancel('Exit');
                                            $mdDialog.show(confirm).then(function() {
                                                //*Go to My Account
                                                //*If agreed to update direct myAccount 
                                                $scope.process="myAccount";
                                                cb(true);
                                                return;
                                                
                                            }, function() {
                                                //*Exit
                                                //*if not going to update Exit system
                                                $scope.process="logout";
                                                cb(true);
                                                return;
                                            });     
                                     }
                                     //#if user not blocked
                                     else{
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
                $http.get('/auth/GetUser/' + email)
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
                $http.get('http://'+Digin_Domain+'/auth/GetUser/'+$scope.email)
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
                $http.get('http://'+Digin_Domain+'/apis/authorization/userauthorization/forgotpassword/'+$scope.email)
                //http://digin.io/apis/authorization/userauthorization/forgotpassword/chamila@duosoftware.com
                .success(function(response){
                    if(response.Success){
                        console.log(response);
                        $mdDialog.hide();
                        mainFun.fireMsg('1', "Successfully reset your password, please check your mail.");
                        //displaySuccess('uccussfully reset your password, Please check your mail for new password...');
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
                        $http.get('/auth/ChangePassword/' + oid + '/' + encodeURIComponent($scope.newPassword))
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
        'Digin_Domain', 'Digin_Engine_API','ngToast','$mdDialog','$location','$timeout',
        function ($scope, $http, $state, focus,
                  Digin_Domain, Digin_Engine_API, ngToast,$mdDialog,$location,$timeout) {


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
                        $http.get('/apis/usertenant/tenant/request/accept/' + email + '/' + token, {
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
                        $http({
                            method: 'POST',
                            url: 'http://'+Digin_Domain+'/apis/authorization/userauthorization/userregistration',
                            //url: '/apis/authorization/userauthorization/userregistration',
                            data: angular.toJson($scope.user),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).success(function (data, status) {
                            //*Create Data Set
                            //$scope.createDataSet(signUpUsr.email, signUpUsr.firstName);

                            $scope.error.isLoading = false;
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
                        }).error(function (data, status) {
                            $scope.error.isLoading = false;
                            $mdDialog.hide();
                            mainFun.fireMsg('0', 'Please Try again...!');
                        });
                    },
                }
            })();


            $scope.submit = function () {
                mainFun.validationClear();

                console.log(signUpUsr);
                //*validation
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


