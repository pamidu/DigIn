// 'use strict';
var p_boarding_module = angular.module("platformBoardingModule", ["ui.router", "ngAnimate", "ngMaterial", "ngMessages", "cloudcharge","ngCookies"]);
p_boarding_module.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default').primaryPalette('light-blue').accentPalette('blue-grey');
});


//Platform entry view route configuration - Start
p_boarding_module.config(['$stateProvider', '$urlRouterProvider', function ($sp, $urp) {
    $urp.otherwise('/plan');
    $sp.state('plan', {
        url: '/plan'
        , templateUrl: 'plan.html'
        , controller: 'boarding-createcompany-ctrl'
    });
}]);
//Platform entry view route configuration - End



// p_boarding_module.controller("boarding-parent-ctrl", ["$scope", "$timeout", "$state", "$location", function ($scope, $timeout, $state, $location) {
//     $scope.navigateJoinCompanyProcess = function () {
//         $state.go('joincompany');
//     };
//     $scope.navigateCreateCompanyProcess = function () {
//         $state.go('createcompany');
//     };
//     $scope.navigateCustomerBoardingProcess = function () {
//         $state.go('main');
//     };
// }]);



//Platform boarding view main controller - start
p_boarding_module.controller("boarding-main-ctrl", ["$scope", function ($scope) {}]);



//Create company view Controller - Start
p_boarding_module.controller("boarding-createcompany-ctrl", ["$window", "$scope", "$http", "$state", "$location", "$mdDialog", "$charge", "$rootScope","$cookies", function ($window, $scope, $http, $state, $location, $mdDialog, $charge, $rootScope, $cookies) {
    
        $scope.companyPricePlans = [
            {
                id: "FREE",
                name: "FREE",
                number:"1",

                title1: "Features",
                features: "Dashboards, Reports",

                title2: "Free Data Usage",
                storage: "10 GB",
                QuerryPMonth: "500 GB",
                Monthly_Susbcription_FeePUser: "USD 6.99/Month",
                Annual_Subscription_FeePUser: "USD 4.99/Month",

                title3: "Additional Data Usage",
                Storage_25_GBPMonth: "USD 4.99",
                Storage_100_GBPMonth: "USD 9.99",
                Storage_1_TBPMonth: "USD 24.99",
                Querry_1_TBPMonth:"USD 9.99",

                img: 'images/personal.png'
            },
            {
                id: "IMAGINE_IT",
                name: "IMAGINE IT",
                number:"0",

                title1: "Features",
                features: "Dashboards, Reports",

                title2: "Free Data Usage",
                storage: "10 GB",
                QuerryPMonth: "500 GB",
                Monthly_Susbcription_FeePUser: "USD 6.99/Month",
                Annual_Subscription_FeePUser: "USD 4.99/Month",

                title3: "Additional Data Usage",
                Storage_25_GBPMonth: "USD 4.99",
                Storage_100_GBPMonth: "USD 9.99",
                Storage_1_TBPMonth: "USD 24.99",
                Querry_1_TBPMonth:"USD 9.99",

                img: 'images/mini_team.png'
            },
            {
                id: "START_VISUALIZING_IT",
                name: "START VISUALIZING IT",
                number:"1",
                
                title1: "Features",
                features: "Dashboards, Reports, Insert Algorithm, Social Media Analytics",

                title2: "Free Data Usage",
                storage: "50 GB",
                QuerryPMonth: "1 TB",
                Monthly_Susbcription_FeePUser: "USD 14.99/Month",
                Annual_Subscription_FeePUser: "USD 10.99/Month",

                title3: "Additional Data Usage",
                Storage_25_GBPMonth: "USD 4.99",
                Storage_100_GBPMonth: "USD 9.99",
                Storage_1_TBPMonth: "USD 24.99",
                Querry_1_TBPMonth:"USD 9.99",

                img: 'images/world.png'
        }
        ]


    $scope.createCompanySuccess = false;
    $scope.hostedDomain = $window.location.host;
    $scope.businessType = [];
    $scope.companyLocation = [];
    $scope.createCompanyDetails = {
        "TenantID": ""
        , "Name": "", // "Shell": "",
        "Statistic": {
            "DataDown": "1GB"
            , "DataUp": "1GB"
            , "NumberOfUsers": "1"
        }
        , "Private": true
        , "OtherData": {
            "CompanyType": ""
            , "CompanyLocation": ""
        }
        , "TenantType": "Company"
    };
    $scope.loadBusinessType = function () {
        $http.get('data/business.json').
        success(function (data, status, headers, config) {
            $scope.businessType = data;
        }).
        error(function (data, status, headers, config) {
            console.log('cant load business types !');
        });
    };
    $scope.loadLocations = function () {
        $http.get('data/countries.json').
        success(function (data, status, headers, config) {
            $scope.companyLocation = data;
        }).
        error(function (data, status, headers, config) {
            console.log('cant load countries !');
        });
    };
    $scope.showPlans = function () {
        $rootScope.createCompanyDetails = $scope.createCompanyDetails;
        if ($scope.createCompanyDetails.TenantType == 'dev') {
            $scope.submitCreateCompanyDetails();
        }
        else {
            //$state.go('plans');
            displaycreateCompanyDetailsSubmissionProgress('Submitting your company details, please wait...');
            $state.go('plans');
            $http({
                methiod: "GET"
                , url: '/services/duosoftware.paymentgateway.service/stripe/SubscriberCheck'
                , headers: {
                    "securityToken": $rootScope.SecurityToken
                }
            }).
            success(function (data, status, headers, config) {
                console.log(data);
                data = JSON.parse(data)
                $mdDialog.hide();
                if (data.status) {
                    //$scope.submitCreateCompanyDetails();
                    displaycreateCompanyDetailsSubmissionError('Sorry, You have already registered!');
                }
                else {
                    $state.go('plans');
                }
            }).
            error(function (data, status, headers, config) {
                console.log(data);
                $mdDialog.hide();
                displaycreateCompanyDetailsSubmissionError('Sorry, ' + data.Message);
            });
        }
    };

    function placeOrder(fn) {
        var sessionInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
        $http({
            method: 'POST'
            , url: '/services/duosoftware.cloudChargeAPI/cloudChargeAPI/placeOrder'
            , headers: {
                'Content-Type': 'application/json'
                , 'securityToken': $helpers.getCookie('securityToken')
            }
            , data: {
                "userName": sessionInfo.Username
                , "ProductCode": $scope.selectedPlan.id
                , "payByAdvance": false
            }
        }).success(function (data) {
            fn(data);
        }).error(function (data) {
            fn(data);
        });
    }

    function cloudchargeService() {
        $http({
            method: 'POST'
            , url: '/services/duosoftware.tenant.service/db/creation'
            , headers: {
                'Content-Type': 'application/json'
                , 'securityToken': $rootScope.SecurityToken
            }
            , data: {
                "dbname": $rootScope.TenantID
            }
        }).success(function (data, status, headers, config) {
            $mdDialog.hide();
            console.log(data);
            if (data.status == "001") {
                var confirm = $mdDialog.confirm().title('All Good!,Tenant Created Successfully!').textContent('You will be redirected to ' + $rootScope.TenantID + ' once you clicked the confimtion').ariaLabel('Lucky day').ok('Got It!').cancel('');
                $mdDialog.show(confirm).then(function () {
                    window.location.href = "http://" + $rootScope.TenantID;
                }, function () {});
            }
            else {
                displaycreateCompanyDetailsSubmissionError('Sorry, we are having problems creating your company at this moment. Please try again later.');
                // resetFormPrestine();
            }
        }).error(function (data) {
            $mdDialog.hide();
            displaycreateCompanyDetailsSubmissionError('Sorry, we are having problems creating your company at this moment. Please try again later.');
            resetFormPrestine();
        });
    };
    $scope.submitCreateCompanyDetails = function () {
        console.log($rootScope.createCompanyDetails);
        var payload = angular.toJson(defaultDataInjection($rootScope.createCompanyDetails));
        console.log(payload);
        displaycreateCompanyDetailsSubmissionProgress();
        $http({
            method: 'POST'
            , url: 'http://digin.io/apis/usertenant/tenant/'
            , headers: {
                'Content-Type': 'application/json'
            }
            , data: payload
        }).success(function (data, status, headers, config) {
            //$mdDialog.hide();
            console.log(data);
            if (data.Success === true) {
                $rootScope.TenantID = data.Data.TenantID;
                placeOrder(function (data) {
                        if (data.hasOwnProperty('results') && data.results) cloudchargeService();
                        else console.log(data) // error placeing order.
                    })
                    // resetFormPrestine();   
            }
            else {
                displaycreateCompanyDetailsSubmissionError('Sorry, we are having problems creating your company at this moment. Please try again later.');
                // resetFormPrestine();
            }
        }).error(function (data) {
            $mdDialog.hide();
            displaycreateCompanyDetailsSubmissionError('Sorry, we are having problems creating your company at this moment. Please try again later.');
            resetFormPrestine();
        });
    };

	
//#Tenent creation process
    $scope.createTenant = function (package) {

        displayProgress('Tenant creation is processing, please wait...!');

        var userInfo ="";
        var userInfo = JSON.parse(decodeURIComponent($cookies.get('authData')));
        var email=userInfo.Email;
        var TenantID = email.replace('@', "");
            TenantID = TenantID.replace('.', "");
            TenantID = TenantID.replace('.', "");

        $scope.tenantDtl = {
            "TenantID": TenantID,
            "TenantType": "Company",
            "Name": userInfo.Name,
            "Shell": "",
            "Statistic": {
                "CompanyName": "Company",
                "Plan": package
            },
            "Private": true,
            "OtherData": {
                "CompanyName": "Company",
                "SampleAttributs": "Values",
                "catagory": ""
            }
        };

        console.log($scope.tenantDtl);		
        $http({
            method: 'POST',
            //url: 'http://digin.io/apis/usertenant/tenant/',
            url: '/apis/usertenant/tenant/',
            data: angular.toJson($scope.tenantDtl),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .success(function (response) {
            //var res=decodeURIComponent(response);
            if (response.Success == true) {
                $mdDialog.hide();
                localStorage.setItem('firstLogin',true);
                window.location = "http://" + response.Data.TenantID;
                //window.location ="http://digin.io/entry";
            }
            else {  
                $mdDialog.hide();
                console.log(response.Message);
            }

        })
        .error(function (error) {

        });
    };    


$scope.selectPlan = function (package) //This is the click event for adding a company tenant in add.html
        {
            if(package=="FREE"){

                $scope.createTenant(package);
            }
            else{
                newCard(package);
            }
        }
/*
    $scope.selectPlan = function (package) //This is the click event for adding a company tenant in add.html
        {
            $scope.selectedPlan = package;
            if (parseInt(package.amount) === 0) { //Free company tenant
                $scope.submitCreateCompanyDetails();
            }
            else {
                newCard(package);
                //                displaycreateCompanyDetailsSubmissionProgress();
                //                $charge.payment().getAccounts().success(function (data) { //check for payment methods
                //                    $mdDialog.hide();
                //                    if (Array.isArray(data) && data.length > 0) showCards(data[0], package); //If user already has a account show cards
                //                    else newCard(null, package); //Else prompt to add a card
                //                }).error(function (data) {
                //                    $mdDialog.hide();
                //                    displaycreateCompanyDetailsSubmissionError('Sorry, we are having problems creating your company at this moment. Please try again later.');
                //                    console.log(data);
                //                })
            } //End of paid company tenant
        }
*/
    var newCard = function (package) {
        $mdDialog.show({
            controller: "addCardCtrl"
            , templateUrl: 'partials/newCard.html'
            , parent: angular.element(document.body)
            , clickOutsideToClose: false
            , locals: {
                cardObject: ""
                , account: ""
            }
        }).then(function (account) {
            account.package = package;
            displaycreateCompanyDetailsSubmissionProgress('Payment processing, please wait...');
            makePayment(account);
            //showCards(account, $rootScope.package);
        });
    }

    function makePayment(data) {
        var payload = {
            "card_number": data.CardNo
            , "exp_month": data.ExpiryMonth
            , "exp_year": data.ExpiryYear
            , "cvc": data.CSV
            , "plan": data.package.id
        }
        $http({
            method: 'POST'
            , url: '/services/duosoftware.paymentgateway.service/stripe/FirstPayment'
            , headers: {
                "securityToken": $rootScope.SecurityToken
            }
            , data: payload
        }).success(function (e) {
            console.log(e);
            $mdDialog.hide();
            if (e.status) {
                $scope.submitCreateCompanyDetails();
            }
            else {
                displaycreateCompanyDetailsSubmissionError('Sorry,' + data.result);
            }
        }).error(function (e) {
            $mdDialog.hide();
            console.log(e);
            displaycreateCompanyDetailsSubmissionError('Sorry, we are having problems creating your company at this moment. Please try again later.');
        });
    }

    // var platformRedirectLink = $window.location.protocol+"//"+$window.location.host+"/shell";
    // var authorizationSuccessFull = function(){
    // 	location.replace(platformRedirectLink);
    // };

    var resetFormPrestine = function () {
        $scope.createCompanyDetails = {};
        // $scope.joinCompanyForm.$setPristine();
    };

    var defaultDataInjection = function (data) {
        data.TenantID = data.TenantID + "." + $scope.hostedDomain;
        return data;
    };

    var displaycreateCompanyDetailsSubmissionError = function (message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Failed to create company !').textContent('' + message + '').ariaLabel('Failed to create company.').ok('Got it!'));
    };

    var displaycreateCompanyDetailsSubmissionProgress = function () {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>Submitting your company details, please wait...</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>'
            , parent: angular.element(document.body)
            , clickOutsideToClose: false
        });
    };

    //#common pre loader
    var displayProgress = function (message) {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>'+message+'</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>'
            , parent: angular.element(document.body)
            , clickOutsideToClose: false
        });
    };

    //#pre-loader success
    var displaySuccess = function (message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Process Completed !').textContent('' + message + '').ariaLabel('Successfully completed.').ok('OK'));
    };

    //#common error
    var displayError = function (message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Process fail !').textContent('' + message + '').ariaLabel('Fail to complete.').ok('OK'));
    };
   
    // var userInfo = JSON.parse(decodeURIComponent($cookies.get('authData')));
    // $rootScope.SecurityToken =userInfo.securityToken;

    function getPlans() {
        $http({
            method: "GET"
            , url: '/services/duosoftware.paymentgateway.service/stripe/planAll'
            , headers: {
                "securityToken": $rootScope.SecurityToken
            }
        }).
        success(function (data, status, headers, config) {
            $scope.companyPricePlans = data;
            console.log(data);
            //            for (a = 0; a < data.data.length; a++) {
            //                $scope.companyPricePlans.push(data.data[a].plan);
            //            };
            //            console.log($scope.companyPricePlans);
        }).
        error(function (data, status, headers, config) {
            console.log(data);
        });
    };
    //getPlans();
}]);
//Create company view Controller - End


