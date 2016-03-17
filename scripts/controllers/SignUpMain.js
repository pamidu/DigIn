// var app = angular.module('Fsignup', ['uiMicrokernel', 'ngMaterial']);

routerApp.controller('signUpCtrl', ['$scope', '$mdToast', '$animate',
    '$http', '$objectstore', '$state', 'ngToast', 'focus',
    function ($scope, $mdToast, $animate, $http, $objectstore, $state,
              ngToast, focus) {


        $scope.onClickSignIn = function () {
            $scope.isLoggedin = false;
            $state.go('login');
        };


        var delay = 2000;
        $scope.User_Name = "";
        $scope.User_Email = "";

        var signUpUsr = {
            firstName: '',
            lastName: '',
            email: '',
            domainName: '',
            namespace: 'digin.io',
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
            isDomainName: false,
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
                        "Domain": signUpUsr.domainName + "" + signUpUsr.namespace
                    };
                    $scope.error.isLoading = true;

                    $http({
                        method: 'POST',
                        url: 'http://104.197.27.7:3048/UserRegistation/',
                        data: angular.toJson($scope.user),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }

                    }).success(function (data, status, headers, config) {
                        $scope.User_Name = data.Name;
                        $scope.User_Email = data.EmailAddress;
                        //setting the name of the profile
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
                        if (!data.Active) {
                            $scope.error.isLoading = false;
                            //setting the userdetails
                            var client = $objectstore.getClient("duosoftware.com", "profile", true);
                            client.onError(function (data) {
                                mainFun.fireMsg('1', 'Successfully created your profile,Please check your Email for verification!');
                            });
                            client.onComplete(function (data) {
                                mainFun.fireMsg('1', 'Successfully created your profile,Please check your Email for verification!');
                            });
                            client.update(userDetails, {
                                KeyProperty: "email"
                            });
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
                }
            }
        })();

        $scope.submit = function () {
            mainFun.validationClear();
            console.log(signUpUsr);
            //validation
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
            } else if (signUpUsr.domainName == '' || angular.isUndefined(signUpUsr.domainName)) {
                mainFun.fireMsg('0', '<strong>Error : </strong>domain name  is required..');
                $scope.error.isDomainName = true;
                focus('domainName');
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
                mainFun.signUpUser();
                return;
            }
        }
    }])
;

//Password verification
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
