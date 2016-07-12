/**
 * Created by Damith on 6/10/2016.
 */
var routerApp = angular.module('digin-entry', ['ngAnimate', 'ui.router', 'uiMicrokernel', 'configuration'
    , 'ngToast', 'ngSanitize', 'ngMessages']);

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
    .controller("signin-ctrl", ['$scope', '$http', '$window', '$state',
        '$rootScope', 'focus', 'ngToast', 'Digin_Auth',
        function ($scope, $http, $window, $state, $rootScope, focus, ngToast, Digin_Auth) {

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
                    }
                }
            })();

            $scope.login = function () {
                $http({
                    method: 'POST',
                    url: 'http://digin.io/apis/authorization/userauthorization/login',
                    headers: {'Content-Type': 'application/json'},
                    data: $scope.signindetails

                }).success(function (data) {
                    if (data.Success === true) {
                        $window.location.href = "/s.php?securityToken=" + data.Data.SecurityToken;

                        //#Added for local host ------------------------------
                         // document.cookie = "securityToken=" + data.Data.SecurityToken + "; path=/";
                         // document.cookie = "authData=" + encodeURIComponent(JSON.stringify(data.Data.AuthData)) + "; path=/";
                         // window.location.href = "http://localhost/digin_git/four/DigIn/shell";
                        //#------------------------------
                    }
                    else {
                        mainFun.fireMsg('0', data.Message);
                    }
                }).error(function (data) {
                    console.log(data);
                    mainFun.fireMsg('0', data.Message);
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
    .controller('signup-ctrl', ['$scope', '$http', '$state', 'focus',
        'Digin_Domain', 'Digin_Engine_API', 'Digin_Tenant', 'Digin_Mail', 'ngToast',
        function ($scope, $http, $state, focus,
                  Digin_Domain, Digin_Engine_API, Digin_Tenant, Digin_Mail, ngToast) {

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

                    dataClear: function () {
                        signUpUsr.firstName = '';
                        signUpUsr.lastName = '';
                        signUpUsr.email = '';
                        signUpUsr.pwd = '';
                        signUpUsr.cnfrPwd = '';
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
                            "ConfirmPassword": signUpUsr.cnfrPwd
                            //,
                            //"Domain": signUpUsr.firstName + "." + Digin_Domain
                        };
                        $scope.error.isLoading = true;
                        $http({
                            method: 'POST',
                            url: 'http://digin.io/apis/authorization/userauthorization/userregistration',
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
                                mainFun.fireMsg('0', data.Message);
                            }
                            else {
                                mainFun.fireMsg('1', 'You are succussfully registerd, Please check your email for verification...!');
                                mainFun.dataClear();
                            }
                        }).error(function (data, status) {
                            $scope.error.isLoading = false;
                            mainFun.fireMsg('0', 'Please Try again !!');
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

                    mainFun.signUpUser();
                    //return;

                }
            }
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


