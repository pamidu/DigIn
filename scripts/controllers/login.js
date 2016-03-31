//var app = angular.module("diginLogin", ['ngMaterial']);

routerApp.controller("LoginCtrl", ['$scope', '$http', '$animate', '$window',
    '$auth', '$state', '$rootScope', 'ngToast', 'focus',
    function ($scope, $http, $animate, $window, $auth, $state,
              $rootScope, ngToast, focus) {
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


        var privateFun = (function () {
            return {
                //Old login-----------------------------------
                login: function () {
                    $scope.error.isLoading = true;
                    $auth.login($scope.txtUname, $scope.txtPwd, "duoworld.duoweb.info");
                    $auth.onLoginResult(function () {
                        $scope.isLoggedin = true;
                        
                        $rootScope.username = $scope.txtUname;
                        localStorage.setItem('username', $scope.txtUname);
                        //var userInfo = $auth.getSession();
                        var userInfo = JSON.parse(getCookie("authData"));

                        //console.log("user data:"+JSON.stringify(userInfo));
                        // $rootScope.name = userInfo.Name;
                        // localStorage.setItem('name', userInfo.Name);
                        // $rootScope.email = userInfo.Email;
                        // localStorage.setItem('email', userInfo.Email);
                        $state.go('welcome');

                    });

                    $auth.onLoginError(function (event, data) {
                        $scope.error.isLoading = false;
                        privateFun.fireMsg('0', '<strong>Error : </strong>' + data.message);
                        $scope.error.isUserName = true;
                        $scope.error.isPwd = true;
                        focus('txtUname');
                    });
                },
                //---------------------------------------------------------------------------------

                /*
                login: function () {
                    $scope.error.isLoading = true;
                    var req = {
                         method: 'POST',
                         url: 'http://digin.io/apis/authorization/userauthorization/login',
                         headers: {
                           'Content-Type': "application/json"
                         },
                         data:{ Username:$scope.txtUname,Password:$scope.txtPwd }
                    }    
                                 
                    $http(req)
                    .then(function(data){
                        alert(JSON.stringify(data));
                        $state.go('welcome');
                    }, 
                    function(data){
                        $scope.error.isLoading = false;
                        privateFun.fireMsg('0', '<strong>Error : </strong>' + data.message);
                        $scope.error.isUserName = true;
                        $scope.error.isPwd = true;
                        focus('txtUname');
                    });
                },
                */
                
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
                        dismissOnClick: true
                    });
                },
                validationClear: function () {
                    $scope.error = {
                        isUserName: false,
                        isPwd: false,
                        event: 0,
                        isLoading: false
                    }
                }
            }
        })();

        //on click login  button - Login user
        $scope.login = function () {
            privateFun.validationClear();
            var loginDetails = {
                userName: $scope.txtUname,
                pwd: $scope.txtPwd
            };

            if (loginDetails.userName == '' || angular.isUndefined(loginDetails.userName)) {
                privateFun.fireMsg('0', '<strong>Error : </strong>invalid login user name..Please check.');
                $scope.error.isUserName = true;
                focus('txtUname');
                return;
            } else if (loginDetails.pwd == '' || angular.isUndefined(loginDetails.pwd)) {
                privateFun.fireMsg('0', '<strong>Error : </strong>invalid login password.Please check.');
                $scope.error.isPwd = true;
                focus('password');
                return;
            } else {
                privateFun.login();
            }
        };


//        //Register user??
//        $scope.registerUser = function() {
//            $Auth.register({
//                UserID:$scope.txtUname,
//                EmailAddress: $scope.txtUname,
//                Name: $scope.txtUname,
//                Password: $scope.txtPwd,
//                ConfirmPassword:$scope.txtPwd,
//                Active: true
//            }).success(function(data) {
//                if (data.error) {
//                    alert("Err!");
//                }
//
//                if (data.success) {
//                    alert("Success!");
//                }
//            });
//        };

    }]).directive('keyEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                //13 press key Enter
                scope.$apply(function () {
                    scope.$eval(attrs.keyEnter);
                });
                event.preventDefault();
            }
        });
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