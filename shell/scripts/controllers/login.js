//var app = angular.module("diginLogin", ['ngMaterial']);

routerApp.controller("LoginCtrl", ['$scope', '$http', '$animate', '$window',
    '$auth', '$state', '$rootScope', 'ngToast', 'focus', 'dynamicallyReportSrv',
    'Digin_Engine_API', 'Digin_Tomcat_Base', 'Digin_Domain',
    function ($scope, $http, $animate, $window, $auth, $state,
              $rootScope, ngToast, focus, dynamicallyReportSrv, Digin_Engine_API, Digin_Tomcat_Base, Digin_Domain) {

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
            var reqParameter = {
                apiBase: Digin_Engine_API,
                tomCatBase: Digin_Tomcat_Base,
                token: '',
                reportName: '',
                queryFiled: ''
            };
            var getSession = function () {
                reqParameter.token = getCookie("securityToken");
            };
            var startReportService = function () {
                dynamicallyReportSrv.startReportServer(reqParameter).success(function (res) {
                    return true;
                }).error(function (err) {
                    return false;
                });
            };//end
            return {
                //Old login-----------------------------------
                login: function () {
                    $scope.error.isLoading = true;

                    //check first time login or not
                    var DetailExist = decodeURIComponent(getCookie('authData'));


                    //$auth.login($scope.txtUname, $scope.txtPwd, "duoworld.duoweb.info");
                    $auth.login($scope.txtUname, $scope.txtPwd, Digin_Domain);

                    $auth.onLoginResult(function () {
                        $scope.isLoggedin = true;

                        $rootScope.username = $scope.txtUname;
                        localStorage.setItem('username', $scope.txtUname);
                        //var userInfo = $auth.getSession();
                        //var userInfo = JSON.parse(getCookie("authData"));

                        //console.log("user data:"+JSON.stringify(userInfo));
                        // $rootScope.name = userInfo.Name;
                        // localStorage.setItem('name', userInfo.Name);
                        // $rootScope.email = userInfo.Email;
                        // localStorage.setItem('email', userInfo.Email);
                        getSession();
                        startReportService();

                        //window.location.href = "/";
                        //$state.go('pricing');

                        if (DetailExist == "undefined") {
                            $state.go('welcome');
                        }
                        else {
                            $state.go('home');
                        }

                    });

                    $auth.onLoginError(function (event, data) {
                        $scope.error.isLoading = false;
                        privateFun.fireMsg('0', '<strong>Error : </strong>invalid login user name or password..');
                        $scope.error.isUserName = true;
                        $scope.error.isPwd = true;
                        focus('txtUname');
                    });
                },
                validateEmail: function (email) {
                    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(email);
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


        $scope.isUserExist = function (email, cb) {
            $http.get('http://104.197.27.7:3048/GetUser/' + email)
                .success(function (response) {
                    cb(true);
                }).error(function (error) {
                //alert("Fail !"); 
                cb(false);
            });
        };


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
            } else if (!privateFun.validateEmail(loginDetails.userName)) {
                privateFun.fireMsg('0', '<strong>Error : </strong>invalid login user name..Please check.');
                $scope.error.isUserName = true;
                focus('txtUname');
                return;
            } else if (loginDetails.pwd == '' || angular.isUndefined(loginDetails.pwd)) {
                privateFun.fireMsg('0', '<strong>Error : </strong>invalid login password.Please check.');
                $scope.error.isPwd = true;
                focus('password');
                return;
            }
            else {
                //privateFun.login();
                $scope.isUserExist(loginDetails.userName, function (data) {
                    if (data) {
                        privateFun.login();
                    } else {

                        privateFun.fireMsg('0', '<strong>Error : </strong>Invalid login username. Please check.');
                        $scope.error.isUserName = true;
                        focus('txtUname');
                        return;
                    }
                });
            }
        };

        //Go to

        $scope.isLoadTermCondition = false;
        $scope.goToTermCondition = function (state) {
            $scope.isLoadTermCondition = state;
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

        //new update
        //damith
        //check sign up status


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