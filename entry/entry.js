/**
 * Created by Damith on 6/10/2016.
 */
var routerApp = angular.module('digin-entry', ['ngAnimate', 'ui.router','uiMicrokernel', 'configuration'
    ,'ngToast','ngSanitize','ngMessages']);

routerApp
    .config(["$httpProvider", "$stateProvider", "$urlRouterProvider",
                  function ($httpProvider, $stateProvider, $urlRouterProvider) {

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

    }]);

routerApp
    .controller("signin-ctrl", ['$scope', '$http',  '$window','$state', 
        '$rootScope', 'focus','ngToast','Digin_Auth',
    function ($scope, $http, $window, $state,$rootScope, focus,ngToast,Digin_Auth) {
        
        $scope.signindetails = {};
        $scope.isLoggedin = false; 
        
        $scope.error = {
            isUserName: false,
            isPwd: false,
            event: 0,
            isLoading: false
        };
        
        $scope.signup = function () {
            $scope.isLoggedin = false;
            $state.go('signup');
        };

        $scope.onClickSignUp = function () {
            $state.go('signup');
        };

        // $scope.startReportService = function () {
        //     dynamicallyReportSrv.startReportServer(reqParameter).success(function (res) {
        //             return true;
        //         }).error(function (err) {
        //             return false;
        //     });
        // };

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
                        dismissOnClick: 'true'
                    });
                },               
            }
        })();

        $scope.login = function () {
            $http({
                method: 'POST',
                url: 'http://digin.io/apis/authorization/userauthorization/login',
                headers: {'Content-Type':'application/json'},
                data: $scope.signindetails
            }).success(function(data) {
                if(data.Success) {
                    document.cookie = "securityToken=" + data.Data.AuthData.SecurityToken + "; path=/";
                    document.cookie = "authData=" + JSON.stringify(data.Data.AuthData) + "; path=/";
                    //$scope.startReportService();
                    //window.location.href = "/"; 
                    window.location.href = "http://localhost:8080/git/digin/#/welcome";
                }
                else{
                    mainFun.fireMsg('0', '<strong>Error : </strong> Invalid login detail...!');
                }
            }).error(function(data) {
                console.log(data);
                mainFun.fireMsg('0', '<strong>Error : </strong> Invalid login detail...!');
            }); 
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
    .controller('signup-ctrl', ['$scope','$http', '$state',  'focus', 
     'Digin_Domain','Digin_Engine_API','Digin_Tenant','Digin_Mail','ngToast',
        function ($scope,  $http,  $state, focus, 
            Digin_Domain,Digin_Engine_API,Digin_Tenant,Digin_Mail,ngToast) {

        $scope.onClickSignIn = function () {
            $scope.isLoggedin = false;
            $state.go('signin');
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


        $scope.createDataSet = function (mailTo, fName) {

            var dtSetName = mailTo.replace('@', "_");
            dtSetName = dtSetName.replace('.', '_');

            $http.get(Digin_Engine_API+'createDataset?dataSetName=' + dtSetName + '&tableName=' + dtSetName + '&db=BigQuery&Domain=' + Digin_Domain)
                .success(function (response) {
                    $scope.sendConfirmationMail(mailTo, fName, dtSetName);
                }).error(function (error) {
                    //alert("Fail !");
            });
        }


        $scope.isUserExist = function (email, cb) {
            $http.get(Digin_Tenant+'GetUser/' + email)
                .success(function (response) {
                    cb(true);
                }).error(function (error) {
                    cb(false);
            });
        }

        //*Send confirmation mail for registration
        $scope.sendConfirmationMail = function (mailTo, fName, dtSetName) {
            $scope.mailData = {
                "type": "email",
                "to": mailTo,
                "subject": "Digin-RegistrationConfirmation",
                "from": "Digin <noreply-digin@duoworld.com>",
                "Namespace": "com.duosoftware.com",
                "TemplateID": "registration_confirmation2",
                "DefaultParams": {
                    "@@name@@": fName,
                    "@@dataSet@@": dtSetName
                },
                "CustomParams": {
                    "@@name@@": fName,
                    "@@dataSet@@": dtSetName
                }
            };

            console.log($scope.mailData);

            $http({
                method: 'POST',
                url: Digin_Mail+'command/notification',
                data: angular.toJson($scope.mailData),
                headers: {
                    'Content-Type': 'application/json',
                    'securitytoken': '1234567890'
                }
            })
                .success(function (response) {
                    //alert(JSON.stringify(response));
                })
                .error(function (error) {
                    //alert("Fail !");
                });
        }

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
                        dismissOnClick: 'true'
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
                validateEmail: function (email) {
                    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(email);
                },
                signUpUser: function () {
                    var fullname = signUpUsr.firstName + " " + signUpUsr.lastName;
                    $scope.user = {
                        "EmailAddress": signUpUsr.email,
                        "Name": fullname,
                        "Password": signUpUsr.pwd,
                        "ConfirmPassword": signUpUsr.cnfrPwd,
                        "Domain": signUpUsr.firstName + "." + Digin_Domain
                    };
                    $scope.error.isLoading = true;
                    $http({
                        method: 'POST',

                        url: Digin_Tenant+'UserRegistation/',
                        data: angular.toJson($scope.user),
                        headers: {
                            'Content-Type': 'application/json'
                        }

                    }).success(function (data, status, headers, config) {
                        $scope.User_Name = data.Name;
                        $scope.User_Email = data.EmailAddress;
                        //*setting the name of the profile
                        var userDetails = {
                            name: fullname,
                            phone: '',
                            email: $scope.user.EmailAddress,
                            company: $scope.user.Domain,
                            country: "",
                            zipcode: "",
                            bannerPicture: 'fromObjectStore',
                            id: "admin@duosoftware.com"
                        };

                        //*Create Data Set
                        $scope.createDataSet(signUpUsr.email, signUpUsr.firstName);

                        if (!data.Active) {
                            $scope.error.isLoading = false;
                            $state.go('signin');
                            mainFun.fireMsg('1', 'Successfully created your profile,Please check your Email for verification!');

                            
                            //*setting userdetails
                           // var client = $objectstore.getClient(Digin_Domain, "profile", true);
                            // client.onError(function (data) {
                            //     $state.go('signin');
                            //     mainFun.fireMsg('1', 'Successfully created your profile,Please check your Email for verification!');

                            // });
                            // client.onComplete(function (data) {
                            //     $state.go('signin');
                            //     mainFun.fireMsg('1', 'Successfully created your profile,Please check your Email for verification!');
                            // });
                            // client.update(userDetails, {
                            //     KeyProperty: "email"
                            // });
                            setTimeout(function () {
                                //location.href = "http://duoworld.duoweb.info/successpage";
                                $scope.showFailure = false;
                                $scope.showRegistration = false;
                                $scope.showSuccess = true;
                            }, delay);
                        } else {
                            $scope.error.isLoading = false;
                            mainFun.fireMsg('0', ' There is a problem in registering or you have already been registered!!');
                            setTimeout(function () {
                                $scope.showFailure = true;
                                $scope.showRegistration = false;
                                $scope.showSuccess = false;
                                //location.href="http://duoworld.duoweb.info/signup/";
                            }, 3000);
                        }
                    }).error(function (data, status, headers, config) {
                        $scope.error.isLoading = false;
                        mainFun.fireMsg('0', 'Please Try again !!');
                        setTimeout(function () {
                            //location.href = "http://duoworld.duoweb.info/login.php?r=http://dw.duoweb.info/s.php#/duoworld-framework/dock";
                            $scope.showFailure = true;
                            $scope.showRegistration = false;
                            $scope.showSuccess = false;
                        }, 4000)

                    });
                },
            }
        })();

        $scope.submit = function () {
            mainFun.validationClear();
            console.log(signUpUsr);
            //*validation
            if (signUpUsr.firstName == '' || angular.isUndefined(signUpUsr.firstName)) {
                mainFun.fireMsg('0', '<strong>Error : </strong>first name is required..');
                $scope.error.isFirstName = true;
                focus('firstName');
                return;
            } else if (signUpUsr.lastName == '' || angular.isUndefined(signUpUsr.lastName)) {
                mainFun.fireMsg('0', '<strong>Error : </strong>last name is required..');
                $scope.error.isLastName = true;
                focus('lastName');
                return;
            }
            else if (signUpUsr.email == '' || angular.isUndefined(signUpUsr.email)) {
                mainFun.fireMsg('0', '<strong>Error : </strong>email address is required..');
                $scope.error.isEmail = true;
                focus('email');
                return;
            }
            else if (!mainFun.validateEmail(signUpUsr.email)) {
                mainFun.fireMsg('0', '<strong>Error : </strong>invalid email address is required..');
                $scope.error.isEmail = true;
                focus('email');
                return;
            }
            else if (signUpUsr.pwd == '' || angular.isUndefined(signUpUsr.pwd)) {
                mainFun.fireMsg('0', '<strong>Error : </strong>password  is required..');
                $scope.error.isPassword = true;
                focus('password');
                return;
            }
            else if (signUpUsr.pwd != signUpUsr.cnfrPwd) {
                mainFun.fireMsg('0', '<strong>Error : </strong>Password not match..');
                $scope.error.isPassword = true;
                $scope.error.isRetypeCnfrm = true;
                focus('cnfrmPwd');
                return;
            }
            else {
                //validation TRUE
                $scope.isUserExist(signUpUsr.email, function (data) {
                    if (data) {
                        mainFun.fireMsg('0', '<strong>Error : </strong>User email already exist...');
                        $scope.error.isEmail = true;
                        focus('email');
                        return;
                    } else {
                        mainFun.signUpUser();
                        return;
                    }
                });
            }
        }
    }
])
;

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


