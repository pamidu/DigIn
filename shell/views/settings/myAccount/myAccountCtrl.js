routerApp.controller('myAccountCtrl', function($scope, $rootScope, $state, $mdDialog, notifications, profile, $http, Upload,
    Digin_Domain, Digin_Tenant, $location, Digin_Engine_API, $apps, ProfileService, paymentGateway, paymentGatewaySvc, $stateParams,userAdminFactory,$timeout,pouchDB) {


    var vm = this;

    $scope.$parent.currentView = "Settings";
    vm.selectedPage = $stateParams.pageNo;
    console.log(vm.selectedPage);

    
    var db = new PouchDB('packaging');

    $scope.usersRate = 5;
    $scope.storageRate = 8;
    $scope.bandwithRate = 10;
    

    //#Subscription START----------------------

    //#Getcurrent Packge Details 
    userAdminFactory.getPackageDetail();
    //userAdminFactory.getTenant(window.location.hostname);
    //userAdminFactory.getPackageSummary();
     userAdminFactory.getUserLevel();
    
    //#Get customer detail#//
    //paymentGatewaySvc.getCustomerInformations();

    //#Get customer status as active - true || false #//
    //paymentGatewaySvc.checkSubscription();
    paymentGatewaySvc.checkSubscription();
    
    //#Get customer detail#//
    //paymentGatewaySvc.getCustomerInformations();

    //#Get customer status as active - true || false #//
    //paymentGatewaySvc.checkSubscription();
    
    //#----chk customer-------------------------------------------------------------
    
    $http({
            //url : "http://staging.digin.io/include/duoapi/paymentgateway/getCustomerInformations",
            url: "/include/duoapi/paymentgateway/getCustomerInformations",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            //console.log(response)
            if (response.statusText == "OK") {
                if (response.data.status == true) {
                    console.log(response)
                    $rootScope.custStatus = response.data.status;
                    $rootScope.custActive=response.data.data[0].active;

                    var doc={
                            "_id":"cusstatus",
                            "name":"cusstatus",
                            "status":response.data.status,
                            "active":response.data.data[0].active
                            }
                    db.put(doc)
                    
                    
                } else {
                    $rootScope.custStatus = response.data.response;
                    $rootScope.custActive=0;
                }
            }
        }, function(response) {
            //console.log(response)
            notifications.toast("0", "Error occured while retriving the account detail.");
        })
    
    
   
    //-------------------------------------------------------------------------------
    
    
    //#Check subscription ----------------------------------------------------------
    //$scope.checkSubscription = function() {
      /*  var packagename="";
        var packageprice=0;
        var packageuser=0;
        var packagedata=0;
        var packagestorage=0;
        var additionaluser=0;
        var additionaldata=0;
        var additionalstorage=0;
    
    
        $http({
            //url : "http://staging.digin.io/include/duoapi/paymentgateway/checkSubscription",
            url: "/include/duoapi/paymentgateway/checkSubscription",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            //console.log(response)
            if (response.statusText == "OK") {
                $rootScope.custStatus = response.data.status;
                
                if(response.data.status){
                    
                    for(i=0; i<response.data.response[0].otherInfo.length; i++)
                    {                   
                        if(response.data.response[0].otherInfo[i].tag=="Package")
                        {
                            packagename=response.data.response[0].otherInfo[i].feature;
                            packageprice=response.data.response[0].otherInfo[i].amount;
                            if(packagename=="personal_space"){
                                packagename='Personal Space';
                                packageuser=1;
                                packagedata=10;
                                packagestorage=100;
                            }
                            else if(packagename=="mini_team"){
                                packagename='We Are A Mini Team';
                                packageuser=5;
                                packagedata=10;
                                packagestorage=100;
                            }
                            else if(packagename=="world"){                              
                                packagename='We Are the World';
                                packageuser=10;
                                packagedata=10;
                                packagestorage=100;
                            }
                            else{
                                packagename='Free';
                                packageuser=1;
                                packagedata=10;
                                packagestorage=100; 
                            }                               
                        }
                        else
                        {
                            if(response.data.response[0].otherInfo[i].tag=="user")
                            {
                                if(response.data.response[0].otherInfo[i].action=="add")
                                {
                                    additionaluser=additionaluser+response.data.response[0].otherInfo[i].quantity;
                                }
                                if(response.data.response[0].otherInfo[i].action=="remove")
                                {
                                    additionaluser=additionaluser-response.data.response[0].otherInfo[i].quantity;
                                }
                                
                            }
                            if(response.data.response[0].otherInfo[i].tag=="data")
                            {
                                if(response.data.response[0].otherInfo[i].action=="add")
                                {
                                    additionaldata=additionaluser+response.data.response[0].otherInfo[i].quantity;
                                }
                                if(response.data.response[0].otherInfo[i].action=="remove")
                                {
                                    additionaldata=additionaluser-response.data.response[0].otherInfo[i].quantity;
                                }
                            }
                            if(response.data.response[0].otherInfo[i].tag=="storage")
                            {
                                if(response.data.response[0].otherInfo[i].action=="add")
                                {
                                    additionalstorage=additionaluser+response.data.response[0].otherInfo[i].quantity;
                                }
                                if(response.data.response[0].otherInfo[i].action=="remove")
                                {
                                    additionalstorage=additionaluser-response.data.response[0].otherInfo[i].quantity;
                                }
                            }
                            
                        }   
                    }           
                }

                
                var doc={
                        "_id":"packgedetail",
                        "name":"packgedetail",
                        "packagename":packagename,
                        "packageprice":packageprice,
                        "packageuser":packageuser,
                        "packagedata":packagedata,
                        "packagestorage":packagestorage,
                        "additionaluser":additionaluser,
                        "additionaldata":additionaldata,
                        "additionalstorage":additionalstorage
                        }
                db.put(doc);
                
                var doc={
                        "_id":"chkstatus",
                        "name":"chkstatus",
                        "status":response.data.status,
                        "paystatus":response.data.response[0].status
                        }
                db.put(doc);

            
            $rootScope.packageName=packagename;
            $rootScope.packagePrice=packageprice;
            $rootScope.defaultUsers=packageuser;
            $rootScope.defaultData=packagedata;
            $rootScope.defaultStorage=packagestorage;
            $rootScope.extraUsers=additionaluser;
            $rootScope.extraData=additionaldata;
            $rootScope.extraStorage=additionalstorage;
            
            
            }   
        }, function(response) {
            console.log(response)
            notifications.toast("0", "Error occured while retriving the account detail.");
        })
*/
   // }
//--------------------------------------------------------  


    
    
    
    
//----get card info------------------------------------------   
    $http({
        //url : "http://staging.digin.io/include/duoapi/paymentgateway/getCardInformation",
        url: "/include/duoapi/paymentgateway/getCardInformation",
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(response) {
        //console.log(response)
        if (response.statusText == "OK") {
            if (response.data.status == true) {
                //Success
                vm.getFormattedCardList(response.data.data);
            } else {
                //fail
                //displayError(response.data);
                vm.paymentCards = [];
            }
        }
    }, function(response) {
        //console.log(response)
        vm.paymentCards = [];
        //displayError("Error while upgrade the package...");
        //$mdDialog.hide();
    })
 
//------------------------------------------------
    //#Get card information
    vm.paymentCards = [];
    
    $scope.getCardsList=function(){
        $http({
            //url : "http://staging.digin.io/include/duoapi/paymentgateway/getCardInformation",
            url: "/include/duoapi/paymentgateway/getCardInformation",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            //console.log(response)
            if (response.statusText == "OK") {
                if (response.data.status == true) {
                    //Success
                    vm.getFormattedCardList(response.data.data);
                } else {
                    //fail
                    //displayError(response.data);
                    vm.paymentCards = [];
                }
            }
        }, function(response) {
            //console.log(response)
            vm.paymentCards = [];
            //displayError("Error while upgrade the package...");
            //$mdDialog.hide();
        })
    }
        


    //#Add card formats
    vm.getFormattedCardList = function(card) {
        for (var i = 0; i < card.length; i++) {
            if (card[i].brand == "American Express") {
                card[i].background = "#136e59";
                card[i].image = "amex_s.png";
                if (i == 0) {
                    card[0].defaultCard = true;
                } else {
                    card[i].defaultCard = false;
                }
            } else if (card[i].brand == "Visa") {
                card[i].background = "#11141d";
                card[i].image = "visa_s.png";
                if (i == 0) {
                    card[0].defaultCard = true;
                } else {
                    card[i].defaultCard = false;
                }
            } else if (card[i].brand == "MasterCard") {
                card[i].background = "#0066a8";
                card[i].image = "master_s.png";
                if (i == 0) {
                    card[0].defaultCard = true;
                } else {
                    card[i].defaultCard = false;
                }
            } else {}
        }

        vm.paymentCards = card;
    }


    $scope.chartXLabels = [];
    $scope.chartSeries = [{
        "name": "totalBytesBilled",
        "data": []
    }, {
        "name": "totalBytesProcessed",
        "data": []
    }, {
        "name": "download_bq",
        "data": []
    }];

  
    //#get usage summary#//
    $scope.usageDetails = {};
    $http.get(Digin_Engine_API + "get_usage_summary?SecurityToken=" + getCookie('securityToken'))
        .success(function(data) {
            console.log(data.Result);
            $scope.result = data.Result;
            $scope.UserID = JSON.parse(decodeURIComponent(getCookie('authData'))).UserID;
            $scope.domain = JSON.parse(decodeURIComponent(getCookie('authData'))).Domain;
            $scope.emaildid = JSON.parse(decodeURIComponent(getCookie('authData'))).Username;
            $scope.usageDetails = $scope.result.usage[0][$scope.domain][$scope.UserID];

        }).error(function() {
            console.log("error");
        });

    //#get usage Detail datewise#//
    $scope.usageDetailsDatewise = {};
    $scope.toDate = new Date();
    var d = new Date();
    month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    $scope.toDate = [year, month, day].join('-');
    $scope.fromDate = d.setDate(d.getDate() - 30);
    monthe = '' + (d.getMonth() + 1),
        daye = '' + d.getDate(),
        yeare = d.getFullYear();

    if (monthe.length < 2) monthe = '0' + monthe;
    if (daye.length < 2) daye = '0' + daye;

    $scope.fromDate = [yeare, monthe, daye].join('-');


    //http://prod.digin.io:1929/get_usage_details?SecurityToken=8d6b7bfe68c7ebafe3c60664e9ea030b&start_date=%272016-09-27%27&end_date=%272016-09-28%27
    $http.get(Digin_Engine_API + "get_usage_details?SecurityToken=" + getCookie('securityToken') + "&start_date=%27" + $scope.fromDate + "%27&end_date=%27" + $scope.toDate + "%27")
        .success(function(data) {
            console.log(data.Result);
            $scope.usageDetailsDatewise = data.Result;
            $scope.UserID = JSON.parse(decodeURIComponent(getCookie('authData'))).UserID;
            $scope.domain = JSON.parse(decodeURIComponent(getCookie('authData'))).Domain;
            $scope.monthlyData = $scope.usageDetailsDatewise[0][$scope.domain][$scope.UserID];
            for (var detail in $scope.monthlyData) {
                $scope.chartXLabels.push(detail);
                if ($scope.monthlyData.hasOwnProperty(detail)) {
                    $scope.chartSeries[0].data.push($scope.monthlyData[detail].totalBytesBilled / 1024);
                    $scope.chartSeries[1].data.push($scope.monthlyData[detail].totalBytesProcessed / 1024);
                    $scope.chartSeries[2].data.push($scope.monthlyData[detail].download_bq / 1024);
                }
            }
            $scope.chartConfig = {
                options: {
                    chart: {
                        type: 'line'
                    },
                    plotOptions: {

                    },
                    yAxis: {
                        title: {
                            text: 'Usage'
                        }
                    }
                },
                xAxis: {
                    title: {
                        text: 'Date'
                    },
                    categories: $scope.chartXLabels
                },
                size: {
                    width: 600,
                    height: 412
                },
                series: $scope.chartSeries,
                title: {
                    text: 'Monthly usage'
                },
                credits: {
                    enabled: false
                },
                loading: false
            }


        }).error(function() {
            console.log("error");
        });





    //#Upload company logo/#/
    $scope.cancel = function() {
        $mdDialog.hide();
    }

    $scope.uploadCompanyLogo = function(ev) {
        $mdDialog.show({
                controller: function fileUploadCtrl($scope, $rootScope, $mdDialog, fileUpload, $http, Upload) {

                    var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
                    var filename;

                    $scope.diginLogo = 'digin-logo-wrapper2';
                    $scope.preloader = false;
                    $scope.finish = function() {
                        $mdDialog.hide();
                    }
                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    }

                    //$scope.$watch('file', function () {
                    if ($scope.file != null) {
                        $scope.files = [$scope.file];
                    }
                    //});

                    $scope.upload = function(files) {
                        if (files && files.length) {
                            $scope.preloader = true;
                            $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';

                            displayProgress('Uploading...');
                            console.log(userInfo);
                            filename = $scope.files[0].name;

                            Upload.upload({
                                url: Digin_Engine_API + 'file_upload',
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                                data: {
                                    db: 'BigQuery',
                                    SecurityToken: userInfo.SecurityToken,
                                    Domain: Digin_Domain,
                                    other_data: 'logo',
                                    file: files[0]
                                }
                            }).success(function(data) {

                                //#chk undefined values
                                var dp_name = "";
                                var logo_name = "";
                                var components;
                                var userRole;
                                var cacheLifetime;
                                var widgetLimit;
                                var themeConfig;
                                var queryLimit;
                                if ($rootScope.userSettings.components == undefined) {
                                    components = 0;
                                } else {
                                    components = $rootScope.userSettings.components
                                }
                                if ($rootScope.userSettings.user_role == undefined) {
                                    userRole = "";
                                } else {
                                    userRole = $rootScope.userSettings.user_role
                                }
                                if ($rootScope.userSettings.cache_lifetime == undefined) {
                                    cacheLifetime = 0;
                                } else {
                                    cacheLifetime = $rootScope.userSettings.cache_lifetime
                                }
                                if ($rootScope.userSettings.widget_limit == undefined) {
                                    widgetLimit = 0;
                                } else {
                                    widgetLimit = $rootScope.userSettings.widget_limit
                                }
                                if ($rootScope.userSettings.query_limit == undefined) {
                                    queryLimit = 0;
                                } else {
                                    queryLimit = $rootScope.userSettings.query_limit
                                }
                                if ($rootScope.userSettings.dp_path == undefined) {
                                    dp_name = "";
                                } else {
                                    dp_name = $rootScope.userSettings.dp_path.split("/").pop();
                                }
                                if ($rootScope.userSettings.logo_path == undefined) {
                                    logo_name = "";
                                } else {
                                    logo_name = $rootScope.userSettings.logo_path.split("/").pop();
                                }
                                if ($rootScope.userSettings.theme_config == undefined) {
                                    themeConfig = "";
                                } else {
                                    themeConfig = $rootScope.userSettings.theme_config
                                }

                                //#store to user settings---------------------
                                $scope.settings = {
                                    "email": userInfo.Email,
                                    "components": components,
                                    "user_role": userRole,
                                    "cache_lifetime": cacheLifetime,
                                    "widget_limit": widgetLimit,
                                    "query_limit": queryLimit,
                                    "logo_name": filename,
                                    "dp_name": dp_name,
                                    "theme_config": themeConfig
                                        // "SecurityToken": userInfo.SecurityToken,
                                        // "Domain": Digin_Domain
                                }

                                $http({
                                        method: 'POST',
                                        url: Digin_Engine_API + 'store_user_settings/',
                                        data: angular.toJson($scope.settings),
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'SecurityToken': userInfo.SecurityToken
                                        }
                                    })
                                    .success(function(response) {
                                        $http.get(Digin_Engine_API + 'get_user_settings?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain)
                                            .success(function(data) {
                                                console.log(data);
                                                $rootScope.userSettings = data.Result;
                                                //var logoPath = Digin_Engine_API.split(":")[0] + ":" + Digin_Engine_API.split(":")[1];
                                                $rootScope.image ='http://' + Digin_Domain  + data.Result.logo_path;
                                                $scope.image = 'http://' + Digin_Domain + data.Result.logo_path;
                                                $rootScope.imageUrl = 'http://' + Digin_Domain + data.Result.logo_path;
                                                $scope.preloader = false;
                                                $mdDialog.hide();
                                                notifications.toast('1', 'Logo Successfully uploaded!');
                                            });
                                    })
                                    .error(function(data) {
                                        $rootScope.image = "styles/css/images/DiginLogo.png";
                                        $mdDialog.hide();
                                        notifications.toast('0', 'There was an error while uploading logo.');
                                    });
                            });
                            //}     
                        }
                    };
                },
                templateUrl: 'views/settings/myAccount/logoUpload.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
            })
            .then(function(answer) {
                //$scope.getURL();
            });
    };


    var vm = this;
    vm.companyPricePlans = [{
        package_id:1002,
        id: "personal_space",
        name: "Personal Space",
        numberOfUsers: 1,
        storage: "10 GB",
        bandwidth: "100 GB",
        perMonth: 10,
        perYear: 10,
        per: "/ User",
        Description: "desc",
        price:10,
        valStorage:10,
        valData:100
    }, {
        package_id:1003,
        id: "mini_team",
        name: "We Are A Mini Team",
        numberOfUsers: 5,
        storage: "10 GB",
        bandwidth: "100 GB",
        perMonth: 8,
        perYear: 6.99,
        per: "/ User",
        Description: "desc",
        price:40,
        valStorage:10,
        valData:100
    }, {
        package_id:1004,
        id: "world",
        name: "We Are the World",
        numberOfUsers: 10,
        storage: "10 GB",
        bandwidth: "100 GB",
        perMonth: 6,
        perYear: 4.99,
        per: "/ User",
        Description: "desc",
        price:60,
        valStorage:10,
        valData:100
    }];
    
    
        
//#Check subscription ----------------------------------------------------------
        var packagename="";       
        $http({
            url: "/include/duoapi/paymentgateway/checkSubscription",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            if (response.statusText == "OK") {
                $rootScope.custStatus = response.data.status;
                
                if(response.data.status){ 
                    for(i=0; i<response.data.response[0].otherInfo.length; i++)
                    {                   
                        if(response.data.response[0].otherInfo[i].tag=="Package")
                        {
                            if(response.data.response[0].otherInfo[i].feature=="personal_space"){
                                packagename='Personal Space';
                            }
                            else if(response.data.response[0].otherInfo[i].feature=="mini_team"){
                                packagename='We Are A Mini Team';
                               
                            }
                            else if(response.data.response[0].otherInfo[i].feature=="world"){                              
                                packagename='We Are the World';                              
                            }
                            else{
                                packagename='Free'; 
                            }                               
                        }
                        else
                        { }   
                    }           
                }else{
                    packagename='Free'; 
                }
       
            $rootScope.packageName=packagename;
            $scope.showExistingPckge();
        
            }   
        }, function(response) {
            //console.log(response)
            //notifications.toast("0", "Error occured while retriving the account detail.");
        })
    
    $scope.showExistingPckge = function() {
        if($rootScope.packageName=="Personal Space"){
            vm.companyPricePlans[0].isSelected = false;
            vm.companyPricePlans[1].isSelected = true;
            vm.companyPricePlans[2].isSelected = true;
            
            vm.companyPricePlans[0].iscurrent = true;
            vm.companyPricePlans[1].iscurrent = false;
            vm.companyPricePlans[2].iscurrent = false;
        }
        else if($rootScope.packageName=="We Are A Mini Team"){
            vm.companyPricePlans[0].isSelected = false;
            vm.companyPricePlans[1].isSelected = false;
            vm.companyPricePlans[2].isSelected = true;
            
            vm.companyPricePlans[0].iscurrent = false;
            vm.companyPricePlans[1].iscurrent = true;
            vm.companyPricePlans[2].iscurrent = false
        }
        else if($rootScope.packageName=="We Are the World"){
            vm.companyPricePlans[0].isSelected = false;
            vm.companyPricePlans[1].isSelected = false;
            vm.companyPricePlans[2].isSelected = false;
            
            vm.companyPricePlans[0].iscurrent = false;
            vm.companyPricePlans[1].iscurrent = false;
            vm.companyPricePlans[2].iscurrent = true
        }
        else{
            vm.companyPricePlans[0].isSelected = true;
            vm.companyPricePlans[1].isSelected = true;
            vm.companyPricePlans[2].isSelected = true;
        }
    }
    
    

    /*
    vm.paymentCards = [{
        id: "card_194OMZLEDsR3ar1xYbp3GCsG",
        last4: "8431",
        brand: "American Express",
        country: "US",
        exp_month: 5,
        exp_year: 2019,
        background: "#136e59",
        image: "amex_s.png",
        default: false
    }, {
        id: "card_191ZDULEDsR3ar1xDxgxVweZ",
        last4: "8445",
        brand: "Visa",
        country: "US",
        exp_month: 6,
        exp_year: 2020,
        background: "#11141d",
        image: "visa_s.png",
        default: true
    }, {
        id: "card_194OC5LEDsR3ar1xE7Q6QVwq",
        last4: "3125",
        brand: "Master",
        country: "US",
        exp_month: 6,
        exp_year: 2025,
        background: "#0066a8",
        image: "master_s.png",
        default: false
    }];
*/

    vm.updatePackage = function(ev) {
        if($rootScope.userLevel=='user'){
           displayError('You are not permitted to do this operation, allowed only for administrator'); 
        }
        else if ($rootScope.packageName=="Free"){
            displayError('You have subscribed only for Free package.'); 
        }
        else{
            location.href = '#/home/addaLaCarte';
        }   
    }
    
    

    vm.deactivateAccount = function(ev) {
        if($rootScope.userLevel=='user'){
           displayError('You are not permitted to do this operation, allowed only for administrator'); 
        }else{
            var confirm = $mdDialog.confirm()
                .title('Account Deactivation')
                .textContent('Are you sure you want to deactivate this account?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                //Yes
                if ($rootScope.custStatus == true) {
                    paymentGatewaySvc.stopSubscriptionImmediate();
                } else {
                    displayError("This customer is already deactivated or have not been subscribed to any package.");
                }
            }, function() {
                //No
            });
        }
            
    };


    vm.addCard = function(ev) {
        displayProgress("Request to add new card...")
        
        $timeout(function () {
              $mdDialog.hide();
        }, 4000);

        var stripeConfig = {
            publishKey: 'pk_test_cFGvxmetyz9eV82nGBhdQ8dS',
            title: 'DigIn',
            description: "Beyond BI",
            logo: '/boarding/img/small-logo',
            label: 'New Card'
        };

        var stripegateway = paymentGateway.setup('stripe').configure(stripeConfig);
        stripegateway.open(ev, function(token, args) {
            console.log(token);
            if (token != null || token != "" || token != undefined) {
                //#insert new card  
                displayProgress("Adding new card...")
                vm.addNewCard(token.id);
            } else {
                $mdDialog.hide();
                //displayError("Error occured while inserting new card.");
            }
        });
    }

    vm.addNewCard = function(token) {
        var pkgObj = {
            "token": token,
            "default": false
        }

        $http({
            url: "/include/duoapi/paymentgateway/addCard",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: pkgObj
        }).then(function(response) {
            //console.log(response)
            if (response.statusText == "OK") {
                if (response.data.status == true) {
                    //Success
                    displaySuccess("New card is added successfully...");
                    vm.getFormattedCardList(response.data.data);
                } else {
                    //fail
                    displayError(response.data.response);
                }
            }
            $mdDialog.hide();
        }, function(response) {
            //console.log(response)
            displayError("Error while adding new card...");
            $mdDialog.hide();
        })
    }

    vm.makeDefault = function(ev, cardId) {
        var confirm = $mdDialog.confirm()
            .title('Change default card')
            .textContent('Do you want to set this card as default card?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('No');
        $mdDialog.show(confirm).then(function() {
            //Yes
            displayProgress("Processing...")
            vm.makeAsDefault(cardId);
        }, function() {
            //No
        });
    }

    vm.makeAsDefault = function(cardId) {
        var pkgObj = {
            "cardId": cardId
        }
        $http({
            url: "/include/duoapi/paymentgateway/setDefaultCard",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: pkgObj
        }).then(function(response) {
            //console.log(response)
            if (response.statusText == "OK") {
                if (response.data.status == true) {
                    //Success
                    vm.getFormattedCardList(response.data.data);
                    displaySuccess("Requested card set as defaut card successfully...");
                } else {
                    //fail
                    displayError(response.data.response);
                }
            }
            $mdDialog.hide();
        }, function(response) {
            //console.log(response)
            displayError("Error while setting default card...");
            $mdDialog.hide();
        })
    }


    vm.deleteCard = function(ev, cardId) {
        var confirm = $mdDialog.confirm()
            .title('Deletion Confirmation')
            .textContent('Do you cant delete this card?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('No');
        $mdDialog.show(confirm).then(function() {
            //Yes
            displayProgress("Processing...")
            vm.deleteCardProcess(cardId);
        }, function() {
            //No
        });
    }

    vm.deleteCardProcess = function(cardId) {
        var pkgObj = {
            "cardId": cardId
        }
        $http({
            url: "/include/duoapi/paymentgateway/deleteCard",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: pkgObj
        }).then(function(response) {
            //console.log(response)
            if (response.statusText == "OK") {
                if (response.data.status == true) {
                    //Success
                    vm.getFormattedCardList(response.data.data);
                    displaySuccess("Requested card deleted successfully...");
                } else {
                    //fail
                    displayError(response.data.response);
                }
            }
            $mdDialog.hide();
        }, function(response) {
            //console.log(response)
            displayError("Error while deleting default card...");
            $mdDialog.hide();
        })
    }





    vm.upgradeConfirmation = function(ev, plan) {
        if($rootScope.userLevel=='user'){
           displayError('You are not permitted to do this operation, allowed only for administrator'); 
        }
        else{
            var confirm = $mdDialog.confirm()
                .title('Upgrade Account')
                .textContent('Do you want to proceed with package upgration process?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                //Yes
                //#for exist customer's package will upgrade
                if ($rootScope.custStatus == true) {
                    vm.upgradePackage(plan);

                }
                //#for non existing customers package cannot be upgraded and initial package need to be purchage
                else {
                    vm.processInitialPurchase(ev, plan);
                }
                
                $scope.showExistingPckge();

            }, function() {
                //No
            });
        }
            
    };


    //#load stripe payement detail window
    vm.processInitialPurchase = function(ev, plan) {

        var stripeConfig = {
            publishKey: 'pk_test_cFGvxmetyz9eV82nGBhdQ8dS',
            title: 'DigIn',
            description: "Beyond BI",
            logo: '/boarding/img/small-logo.png',
            label: 'New Card'
        };

        var stripegateway = paymentGateway.setup('stripe').configure(stripeConfig);
        stripegateway.open(ev, function(token, args) {
            console.log(token);
            if (token != null || token != "" || token != undefined) {
                vm.purchasePackage(token.id, plan);
            } else {
                displayError("Error while retriving token from stripe");
            }
        });
    }

    //#Upgrade exisitng package into another package
    //vm.upgradePackage=function(token,plan){ 
    vm.upgradePackage = function(plan) {

        displayProgress("Proceed with payment.");

        /*var pkgObj = {
                "token":token.id,
                "plan" : {
                    "attributes":  [
                        {"tag":"Package","feature": plan.id,"amount": 20,"quantity":1,"action":"add"},\
                        {"tag":"Storage","feature": "25GB storage","quantity":1,"amount": 30*100,"action":"remove"},
                        {"tag":"user","feature": "Additional users","amount": 15,"quantity":5,"action":"add"}
                    ],
                    "subscription": "month",
                    "quantity": 1 
                }
            }*/
            
        var obj=[{"tag":"Package","feature": plan.id,"amount": plan.price,"quantity":1,"action":"add"}];
        
        db.get('packgedetail').then(function (doc_package) {
          console.log(doc_package);
          
          if(doc_package.additionaluser>0){
             var objUser= [{"tag":"user","feature": "Additional users","amount": $scope.usersRate*doc_package.additionaluser,"quantity":doc_package.additionaluser,"action":"add"}];
             obj.push(objUser[0]);
          }
          if(doc_package.additionaldata>0){
             var objData= [{"tag":"data","feature": "Additional data","amount": $scope.dataRate*doc_package.additionaldata,"quantity":doc_package.additionaldata,"action":"add"}];
             obj.push(objData[0]);
          }
          if(doc_package.additionalstorage>0){
             var objStorage= [{"tag":"sorage","feature": "Additional storage","amount": $scope.storageRate*doc_package.additionalstorage,"quantity":doc_package.additionalstorage,"action":"add"}];  
             obj.push(objStorage[0]);
          }
         
                        var pkgObj = {
                            "plan": {
                                "attributes":obj,
                                "subscription": "month",
                                "quantity": 1
                            }
                        }
        
                /*var pkgObj = {
                    "plan": {
                        "attributes": [{
                            "tag": "Package",
                            "feature": plan.id,
                            "amount": plan.price,
                            "quantity": 1,
                            "action": "add"
                        }],
                        "subscription": "month",
                        "quantity": 1
                    }
                }*/

                $http({
                    //url : "http://staging.digin.io/include/duoapi/paymentgateway/upgradePackage",
                    url: "/include/duoapi/paymentgateway/upgradePackage",
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: pkgObj
                }).then(function(response) {
                    //console.log(response)
                    if (response.statusText == "OK") {
                        if (response.data.status == true) {
                            //Success
                            
                            db.get('packgedetail').then(function (doc_package) {
                              // update their age
                              doc_package.packagename = plan.name;
                              doc_package.packageprice = plan.price;
                              doc_package.packageuser = plan.numberOfUsers;
                              doc_package.packagedata = plan.valData;
                              doc_package.packagestorage = plan.valStorage;
                    
                              $rootScope.packageName=plan.name;
                              $rootScope.packagePrice=plan.price;
                              $rootScope.defaultUsers=plan.numberOfUsers;
                              $rootScope.defaultData=plan.valData;
                              $rootScope.defaultStorage=plan.valStorage;       
                             
                             $scope.showExistingPckge();
                             
                              // put them back
                              return db.put(doc_package);
                            }).then(function () {
                              // fetch mittens again
                              //return db.get('mittens');
                            }).then(function (doc) {
                              //console.log(doc);
                            });
                                                
                            $scope.upgradePackageDigin(plan); //*Insert data into digin servers 
                            //displaySuccess("Your package is upgraded successfully...");
                        } else {
                            //fail
                            displayError(response.data.response);
                        }
                    }
                    $mdDialog.hide();
          
          
          
                }); 
        
        
        
        }, function(response) {
            //console.log(response)
            displayError("Error while upgrade the package...");
            $mdDialog.hide();
        })

    }


    //#Add package to digin engine#//
    $scope.addPackageDigin = function(plan) {
        $scope.detail=[{
                        "package_id":plan.package_id,
                        "package_name":plan.name,
                        "package_attribute": "",
                        "package_value":0,
                        "package_price":0,
                        "is_default":true,
                        "is_new": true
                        }]
            
        $http({
            method: 'POST',
            url: Digin_Engine_API + 'activate_packages/',
            data: angular.toJson($scope.detail),
            headers: {
                'Content-Type': 'application/json',
                'SecurityToken': getCookie('securityToken')
            }
        })
        .success(function(response) {
            userAdminFactory.getPackageDetail();
            //userAdminFactory.getPackageSummary();
            //$scope.getCardsList();            
        })
        .error(function(data) {
            displayError("Fail to upgrade.");
        });
    }
    
    
    //#Upgrade package to digin engine#//
    $scope.upgradePackageDigin = function(plan) {
        $scope.detail=[{
                        "package_id":plan.package_id,
                        "package_name":plan.name,
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
                'SecurityToken': getCookie('securityToken')
            }
        })
        .success(function(response) {
            userAdminFactory.getPackageDetail();
            //userAdminFactory.getPackageSummary();
            displaySuccess("Your package is upgraded successfully...");
            
        })
        .error(function(data) {
            displayError("Fail to upgrade.");
        });
    }
    
    
    
    /*proceed with payement*/
    vm.purchasePackage = function purchasePackage(token, plan) {
        displayProgress('Payment processing...');

        var sampleObj = {
            "token": token,
            "plan": {
                "attributes": [{
                    "tag": "Package",
                    "feature": plan.id,
                    "amount": plan.numberOfUsers * plan.perMonth,
                    "quantity": 1,
                    "action": "add"
                }],
                "subscription": "month",
                "quantity": 1
            }
        }

        $http({
            url: "/include/duoapi/paymentgateway/puchasePackage",
            //url : "http://staging.digin.io/include/duoapi/paymentgateway/puchasePackage",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'securityToken': decodeURIComponent(getCookie('securityToken'))
            },
            data: sampleObj
        }).then(function(response) {
            console.log()
            if (response.statusText == "OK") {
                if (response.data.status == true) {
                    
                    $rootScope.packageName=plan.name;
                    $rootScope.packagePrice=plan.price;
                    $rootScope.defaultUsers=plan.numberOfUsers;
                    $rootScope.defaultData=plan.valData;
                    $rootScope.defaultStorage=plan.valStorage;
                    
                    $scope.showExistingPckge();
                    
                    db.get('packgedetail').then(function (doc_package) {
                    
                        doc_package.packagename=plan.name,
                        doc_package.packageprice=plan.price,
                        doc_package.packageuser=plan.numberOfUsers,
                        doc_package.packagedata=plan.valData,
                        doc_package.packagestorage=plan.valStorage,
                        
                    db.put(doc_package);
                    
                    
                }).then(function () {
                    
                }).then(function (doc) {

                });
                
                //-----cust detail update
                
                            db.get('cusstatus').then(function (doc_cust) {
                              // update their age
                              doc_cust.status = true;
                              doc_cust.active = 1;

                              $rootScope.packageName=packagename;
                              $rootScope.packagePrice=packageprice;
                              $rootScope.defaultUsers=packageuser;
                              $rootScope.defaultData=packagedata;
                              $rootScope.defaultStorage=packagestorage;       
                             
                              // put them back
                              db.put(doc_cust);
                            }).then(function () {

                            }).then(function (doc) {
                            });
                
                   //------------- 
                    
                    $scope.addPackageDigin(plan); //*Insert data into digin servers
                    paymentGatewaySvc.checkSubscription();
                    $scope.getCardsList();
                    displaySuccess("Your package is upgraded successfully...");
                    
                } else {
                    notifications.toast('0', response.data.result);
                }
            } else {
                notifications.toast('0', 'Error occured while completing payment procees.');
            }
            $mdDialog.hide();
        }, function(response) {;
            notifications.toast('0', 'Error occured while completing payment procees');
            $mdDialog.hide();
        })
    }



    //#Reactive subscriptions
    vm.reactiveSubscription = function() {

        $http({
            //url : "http://staging.digin.io/include/duoapi/paymentgateway/reactiveSubscription",
            url: "/include/duoapi/paymentgateway/reactiveSubscription",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            //console.log(response)
            if (response.statusText == "OK") {
                if (response.data.status == true) {
                    //Success
                    //displaySuccess("Your package is upgraded successfully...");
                } else {
                    //fail
                    //displayError(response.data);
                }
            }
            $mdDialog.hide();
        }, function(response) {
            //console.log(response)
            //displayError("Error while upgrade the package...");
            //$mdDialog.hide();
        })

    }





    //#common pre loader
    var displayProgress = function(message) {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>' + message + '</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
    };

    //#common error message
    var displayError = function(message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Process fail !').textContent('' + message + '').ariaLabel('Fail to complete.').ok('OK'));
    };

    //#common error message
    var displaySuccess = function(message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Success !').textContent('' + message + '').ariaLabel('successfully completed.').ok('OK'));
    };


    //#Subscription END----------------------






    //#Profile START---------------------------------
    console.log('user profile ctrl load');
    var baseUrl = "http://" + window.location.hostname;

    //*Profile picture
    $scope.selectImage = false;
    $scope.selectProfile = true;


    //profile view mode
    $scope.intProfile = function() {
        profile.getProfile();
    };


    $scope.closeWindow = function() {
        $state.go('home.welcomeSearch');
    }

    //#pre-loader progress - with message
    var displayProgress = function(message) {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>' + message + '</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
    };


    $scope.selectProfileImg = function() {
        $scope.selectProfile = false;
        $scope.selectImage = true;
    };

    $rootScope.myImage = '';
    $scope.myCroppedImage = '';

    $scope.handleFileSelect = function(evt) {
        var file = evt.currentTarget.files[0];
        console.log(file);
        var reader = new FileReader();
        reader.onload = function(evt) {
            $scope.$apply(function($scope) {
                $rootScope.myImage = evt.target.result;
                $rootScope.file = file;
            });
        };
        reader.readAsDataURL(file);
    };
    // angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);


    //#conver dataURL into base64
    function base64ToBlob(base64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = 1024;
        var byteCharacters = atob(base64Data);
        var bytesLength = byteCharacters.length;
        var slicesCount = Math.ceil(bytesLength / sliceSize);
        var byteArrays = new Array(slicesCount);

        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);

            var bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, {
            type: contentType
        });
    };


    //#validate image saving and call saving function
    $scope.saveImage = function() {
        if ($rootScope.file == undefined) {
            notifications.toast('0', 'Please select profile picture to upload.');
        } else {
            //*Croped image


            var name = $rootScope.file.name;
            var file = base64ToBlob($scope.myCroppedImage.replace('data:image/png;base64,', ''), 'image/jpeg');
            file.name = name;
            console.log(file);
            //uploader.addToQueue(file);
            $scope.upload(file);

            //*Original image
            //$scope.upload($rootScope.file);
            //$scope.upload();

            $scope.selectProfile = true;
            $scope.selectImage = false;
        }
    };


    $scope.cancelImage = function() {
        $scope.selectProfile = true;
        $scope.selectImage = false;
    };



    //#Function to save profile image
    $scope.upload = function(file) {
        displayProgress('Uploading...');
        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
        Upload.upload({
            url: Digin_Engine_API + 'file_upload',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: {
                db: 'BigQuery',
                SecurityToken: userInfo.SecurityToken,
                Domain: Digin_Domain,
                other_data: 'dp',
                file: file
            }
        }).success(function(data) {

            //#chk undefined values
            var dp_name = "";
            var logo_name = "";
            var components;
            var userRole;
            var cacheLifetime;
            var widgetLimit;
            var themeConfig;
            var queryLimit;
            if ($rootScope.userSettings.components == undefined) {
                components = 0;
            } else {
                components = $rootScope.userSettings.components
            }
            if ($rootScope.userSettings.user_role == undefined) {
                userRole = "";
            } else {
                userRole = $rootScope.userSettings.user_role
            }
            if ($rootScope.userSettings.cache_lifetime == undefined) {
                cacheLifetime = 0;
            } else {
                cacheLifetime = $rootScope.userSettings.cache_lifetime
            }
            if ($rootScope.userSettings.widget_limit == undefined) {
                widgetLimit = 0;
            } else {
                widgetLimit = $rootScope.userSettings.widget_limit
            }
            if ($rootScope.userSettings.query_limit == undefined) {
                queryLimit = 0;
            } else {
                queryLimit = $rootScope.userSettings.query_limit
            }
            if ($rootScope.userSettings.dp_path == undefined) {
                dp_name = "";
            } else {
                dp_name = $rootScope.userSettings.dp_path.split("/").pop();
            }
            if ($rootScope.userSettings.logo_path == undefined) {
                logo_name = "";
            } else {
                logo_name = $rootScope.userSettings.logo_path.split("/").pop();
            }
            if ($rootScope.userSettings.theme_config == undefined) {
                themeConfig = "";
            } else {
                themeConfig = $rootScope.userSettings.theme_config
            }


            //#store to user settings---------------------
            $scope.settings = {
                "email": userInfo.Email,
                "components": components,
                "user_role": userRole,
                "cache_lifetime": cacheLifetime,
                "widget_limit": widgetLimit,
                "query_limit": queryLimit,
                "logo_name": logo_name,
                "dp_name": file.name,
                "theme_config": themeConfig
                    // "SecurityToken": userInfo.SecurityToken,
                    // "Domain": Digin_Domain
            }

            $http({
                    method: 'POST',
                    url: Digin_Engine_API + 'store_user_settings/',
                    data: angular.toJson($scope.settings),
                    headers: {
                        'Content-Type': 'application/json',
                        'SecurityToken': userInfo.SecurityToken
                            //'Domain': Digin_Domain
                    }
                })
                .success(function(response) {
                    $http.get(Digin_Engine_API + 'get_user_settings?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain)
                        .success(function(data) {
                            console.log(data);
                            $rootScope.userSettings = data.Result;
                            //var logoPath = Digin_Engine_API.split(":")[0] + ":" + Digin_Engine_API.split(":")[1];
                            $scope.profile_pic = 'http://' + Digin_Domain + data.Result.dp_path;
                            $rootScope.profile_pic = 'http://' + Digin_Domain + data.Result.dp_path;
                            ProfileService.UserDataArr.BannerPicture = $rootScope.profile_pic;
                            $scope.getURL();
                            $mdDialog.hide();
                            notifications.toast('1', 'Profile picture uploaded successfully.');
                        });
                })
                .error(function(data) {
                    $scope.profile_pic = "styles/css/images/setting/user100x100.png";
                    $rootScope.profile_pic = "styles/css/images/setting/user100x100.png";
                    ProfileService.UserDataArr.BannerPicture = $rootScope.profile_pic;
                    $mdDialog.hide();
                    notifications.toast('0', 'There was an error while uploading profile picture !');
                });
        });

    };


    $scope.editModeOn = true;

    if ($rootScope.profile_Det == undefined) {

    } else {
        console.log($rootScope.profile_Det.Country);
        $scope.user = {
            email: $rootScope.profile_Det.Email,
            contactNo: $rootScope.profile_Det.PhoneNumber,
            street: $rootScope.profile_Det.BillingAddress,
            country: $rootScope.profile_Det.Country,
            zip: $rootScope.profile_Det.ZipCode
        };

        $scope.name = $rootScope.profile_Det.Name;  
        $scope.company=$rootScope.TenantName;
    }
    
    /*
        $http({
            url: '/auth/tenant/GetTenant/' + window.location.hostname,
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(result) {
            $scope.company=result.data.OtherData.CompanyName;
        }, function(response) {
            notifications.toast("0", "Error occured while retriving the account detail.");
        })
    */
    


    $scope.closeWindow = function() {
        $state.go('home.welcomeSearch');
    };

    $scope.validname = false;
    $scope.validcompany = false;
    $scope.regex = /^[a-zA-Z0-9]/;

    $scope.$watch('name', function() {
        $scope.validname = $scope.regex.test($scope.name);
    })

    $scope.$watch('company', function() {
        $scope.validcompany = $scope.regex.test($scope.company);
    })


    $scope.updateProfileData = function() {

        var baseUrl = "http://" + window.location.hostname;

        if ($scope.name == "" || $scope.name == undefined) {
            notifications.toast('0', 'Invalid user name.');
        // } else if ($scope.company == "" || $scope.company == undefined) {
        //     notifications.toast('0', 'Invalid company name.');
        // } else if ($scope.user.contactNo == "" || $scope.user.contactNo == undefined) {
        //     notifications.toast('0', 'Contact number can not be a blank.');
        } else if (!$scope.validname) {
            notifications.toast('0', 'Invalid user name.');
        } else if (!$scope.validcompany) {
            notifications.toast('0', 'Invalid company name.');
        } else {
            $scope.userProfile = {
                "BannerPicture": "img/cover.png",
                "BillingAddress": $scope.user.street,
                "Company": $scope.company,
                "Country": $scope.user.country,
                "Email": $scope.user.email,
                "Name": $scope.name,
                "PhoneNumber": $scope.user.contactNo,
                "ZipCode": $scope.user.zip
            };

            $http({
                method: 'POST',
                //url:'http://omalduosoftwarecom.prod.digin.io/apis/profile/userprofile',
                url: baseUrl + '/apis/profile/userprofile',
                data: angular.toJson($scope.userProfile),
                headers: {
                    'Content-Type': 'application/json',
                }
            }).success(function(data) {
                $scope.error.isLoading = false;
                console.log(data);

                if (data.IsSuccess == false) {
                    notifications.toast('0', 'Fail to update user profile.');
                } else {
                    notifications.toast('1', 'User profile updated successfully.');
                    $scope.frmProfile.$setUntouched();
                    profile.getProfile();
                }

            }).error(function(data) {
                $scope.error.isLoading = false;
            });
        }

    };



    $scope.profile = (function() {
        return {
            clickEdit: function() {
                $scope.editModeOn = false;
            },


            changeUserProfile: function() {
                console.log($scope.user);
                $scope.editModeOn = true;
                $scope.updateProfileData();
            },

            changePassword: function(ev) {
                $mdDialog.show({
                        controller: "changePasswordCtrl",
                        templateUrl: 'views/settings/myAccount/change-password.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true
                    })
                    .then(function(answer) {})
            },

            uploadProfilePicture: function(ev) {
                // $mdDialog.show({
                //   controller: "uploadProfilePictureCtrl",
                //   templateUrl: 'views/profile-settings/uploadProfilePicture.html',
                //   parent: angular.element(document.body),
                //   targetEvent: ev,
                //   clickOutsideToClose:true
                // })
                // .then(function(answer) {
                // })
                $scope.selectProfile = false;
                $scope.selectImage = true;

            },
            closeSetting: function() {
                $state.go('home');
            }

        };

    })();

    //UI animation
    var uiAnimation = (function() {
        return {
            openEditPanel: function(id, status) {
                $(id).animate({
                    opacity: '1'
                })
            },
            closeEditPanel: function(id, status) {
                $(id).animate({
                    opacity: '0'
                })
            }
        }
    })();

    $scope.allCountries = [{
        code: "AF",
        name: "Afghanistan"
    }, {
        code: "AL",
        name: "Albania"
    }, {
        code: "DZ",
        name: "Algeria"
    }, {
        code: "AS",
        name: "American Samoa"
    }, {
        code: "AD",
        name: "Andorre"
    }, {
        code: "AO",
        name: "Angola"
    }, {
        code: "AI",
        name: "Anguilla"
    }, {
        code: "AQ",
        name: "Antarctica"
    }, {
        code: "AG",
        name: "Antigua and Barbuda"
    }, {
        code: "AR",
        name: "Argentina"
    }, {
        code: "AM",
        name: "Armenia"
    }, {
        code: "AW",
        name: "Aruba"
    }, {
        code: "AU",
        name: "Australia"
    }, {
        code: "AT",
        name: "Austria"
    }, {
        code: "AZ",
        name: "Azerbaijan"
    }, {
        code: "BS",
        name: "Bahamas"
    }, {
        code: "BH",
        name: "Bahrain"
    }, {
        code: "BD",
        name: "Bangladesh"
    }, {
        code: "BB",
        name: "Barbade"
    }, {
        code: "BY",
        name: "Belarus"
    }, {
        code: "BE",
        name: "Belgium"
    }, {
        code: "BZ",
        name: "Belize"
    }, {
        code: "BJ",
        name: "Benin"
    }, {
        code: "BM",
        name: "Bermuda"
    }, {
        code: "BT",
        name: "Bhutan"
    }, {
        code: "BO",
        name: "Bolivia"
    }, {
        code: "BQ",
        name: "Bonaire, Sint Eustatius and Saba"
    }, {
        code: "BA",
        name: "Bosnia and Herzegovina"
    }, {
        code: "BW",
        name: "Botswana"
    }, {
        code: "BV",
        name: "Bouvet Island"
    }, {
        code: "BR",
        name: "Brazil"
    }, {
        code: "IO",
        name: "British Indian Ocean Territory"
    }, {
        code: "VG",
        name: "British Virgin Islands"
    }, {
        code: "BN",
        name: "Brunei"
    }, {
        code: "BG",
        name: "Bulgaria"
    }, {
        code: "BF",
        name: "Burkina Faso"
    }, {
        code: "BI",
        name: "Burundi"
    }, {
        code: "KH",
        name: "Cambodia"
    }, {
        code: "CM",
        name: "Cameroon"
    }, {
        code: "CA",
        name: "Canada"
    }, {
        code: "CV",
        name: "Cape Verde"
    }, {
        code: "KY",
        name: "Cayman Islands"
    }, {
        code: "CF",
        name: "Central African Republic"
    }, {
        code: "TD",
        name: "Chad"
    }, {
        code: "CL",
        name: "Chile"
    }, {
        code: "CN",
        name: "China"
    }, {
        code: "CX",
        name: "Christmas Island"
    }, {
        code: "CC",
        name: "Cocos (Keeling) Islands"
    }, {
        code: "CO",
        name: "Colombia"
    }, {
        code: "KM",
        name: "Comoros"
    }, {
        code: "CG",
        name: "Congo"
    }, {
        code: "CD",
        name: "Congo (Dem. Rep.)"
    }, {
        code: "CK",
        name: "Cook Islands"
    }, {
        code: "CR",
        name: "Costa Rica"
    }, {
        code: "ME",
        name: "Crna Gora"
    }, {
        code: "HR",
        name: "Croatia"
    }, {
        code: "CU",
        name: "Cuba"
    }, {
        code: "CW",
        name: "CuraÃ§ao"
    }, {
        code: "CY",
        name: "Cyprus"
    }, {
        code: "CZ",
        name: "Czech Republic"
    }, {
        code: "CI",
        name: "CÃ´te D'Ivoire"
    }, {
        code: "DK",
        name: "Denmark"
    }, {
        code: "DJ",
        name: "Djibouti"
    }, {
        code: "DM",
        name: "Dominica"
    }, {
        code: "DO",
        name: "Dominican Republic"
    }, {
        code: "TL",
        name: "East Timor"
    }, {
        code: "EC",
        name: "Ecuador"
    }, {
        code: "EG",
        name: "Egypt"
    }, {
        code: "SV",
        name: "El Salvador"
    }, {
        code: "GQ",
        name: "Equatorial Guinea"
    }, {
        code: "ER",
        name: "Eritrea"
    }, {
        code: "EE",
        name: "Estonia"
    }, {
        code: "ET",
        name: "Ethiopia"
    }, {
        code: "FK",
        name: "Falkland Islands"
    }, {
        code: "FO",
        name: "Faroe Islands"
    }, {
        code: "FJ",
        name: "Fiji"
    }, {
        code: "FI",
        name: "Finland"
    }, {
        code: "FR",
        name: "France"
    }, {
        code: "GF",
        name: "French Guiana"
    }, {
        code: "PF",
        name: "French Polynesia"
    }, {
        code: "TF",
        name: "French Southern Territories"
    }, {
        code: "GA",
        name: "Gabon"
    }, {
        code: "GM",
        name: "Gambia"
    }, {
        code: "GE",
        name: "Georgia"
    }, {
        code: "DE",
        name: "Germany"
    }, {
        code: "GH",
        name: "Ghana"
    }, {
        code: "GI",
        name: "Gibraltar"
    }, {
        code: "GR",
        name: "Greece"
    }, {
        code: "GL",
        name: "Greenland"
    }, {
        code: "GD",
        name: "Grenada"
    }, {
        code: "GP",
        name: "Guadeloupe"
    }, {
        code: "GU",
        name: "Guam"
    }, {
        code: "GT",
        name: "Guatemala"
    }, {
        code: "GG",
        name: "Guernsey and Alderney"
    }, {
        code: "GN",
        name: "Guinea"
    }, {
        code: "GW",
        name: "Guinea-Bissau"
    }, {
        code: "GY",
        name: "Guyana"
    }, {
        code: "HT",
        name: "Haiti"
    }, {
        code: "HM",
        name: "Heard and McDonald Islands"
    }, {
        code: "HN",
        name: "Honduras"
    }, {
        code: "HK",
        name: "Hong Kong"
    }, {
        code: "HU",
        name: "Hungary"
    }, {
        code: "IS",
        name: "Iceland"
    }, {
        code: "IN",
        name: "India"
    }, {
        code: "ID",
        name: "Indonesia"
    }, {
        code: "IR",
        name: "Iran"
    }, {
        code: "IQ",
        name: "Iraq"
    }, {
        code: "IE",
        name: "Ireland"
    }, {
        code: "IM",
        name: "Isle of Man"
    }, {
        code: "IL",
        name: "Israel"
    }, {
        code: "IT",
        name: "Italy"
    }, {
        code: "JM",
        name: "Jamaica"
    }, {
        code: "JP",
        name: "Japan"
    }, {
        code: "JE",
        name: "Jersey"
    }, {
        code: "JO",
        name: "Jordan"
    }, {
        code: "KZ",
        name: "Kazakhstan"
    }, {
        code: "KE",
        name: "Kenya"
    }, {
        code: "KI",
        name: "Kiribati"
    }, {
        code: "KP",
        name: "Korea (North)"
    }, {
        code: "KR",
        name: "Korea (South)"
    }, {
        code: "KW",
        name: "Kuwait"
    }, {
        code: "KG",
        name: "Kyrgyzstan"
    }, {
        code: "LA",
        name: "Laos"
    }, {
        code: "LV",
        name: "Latvia"
    }, {
        code: "LB",
        name: "Lebanon"
    }, {
        code: "LS",
        name: "Lesotho"
    }, {
        code: "LR",
        name: "Liberia"
    }, {
        code: "LY",
        name: "Libya"
    }, {
        code: "LI",
        name: "Liechtenstein"
    }, {
        code: "LT",
        name: "Lithuania"
    }, {
        code: "LU",
        name: "Luxembourg"
    }, {
        code: "MO",
        name: "Macao"
    }, {
        code: "MK",
        name: "Macedonia"
    }, {
        code: "MG",
        name: "Madagascar"
    }, {
        code: "MW",
        name: "Malawi"
    }, {
        code: "MY",
        name: "Malaysia"
    }, {
        code: "MV",
        name: "Maldives"
    }, {
        code: "ML",
        name: "Mali"
    }, {
        code: "MT",
        name: "Malta"
    }, {
        code: "MH",
        name: "Marshall Islands"
    }, {
        code: "MQ",
        name: "Martinique"
    }, {
        code: "MR",
        name: "Mauritania"
    }, {
        code: "MU",
        name: "Mauritius"
    }, {
        code: "YT",
        name: "Mayotte"
    }, {
        code: "MX",
        name: "Mexico"
    }, {
        code: "FM",
        name: "Micronesia"
    }, {
        code: "MD",
        name: "Moldova"
    }, {
        code: "MC",
        name: "Monaco"
    }, {
        code: "MN",
        name: "Mongolia"
    }, {
        code: "MS",
        name: "Montserrat"
    }, {
        code: "MA",
        name: "Morocco"
    }, {
        code: "MZ",
        name: "Mozambique"
    }, {
        code: "MM",
        name: "Myanmar"
    }, {
        code: "NA",
        name: "Namibia"
    }, {
        code: "NR",
        name: "Nauru"
    }, {
        code: "NP",
        name: "Nepal"
    }, {
        code: "NL",
        name: "Netherlands"
    }, {
        code: "AN",
        name: "Netherlands Antilles"
    }, {
        code: "NC",
        name: "New Caledonia"
    }, {
        code: "NZ",
        name: "New Zealand"
    }, {
        code: "NI",
        name: "Nicaragua"
    }, {
        code: "NE",
        name: "Niger"
    }, {
        code: "NG",
        name: "Nigeria"
    }, {
        code: "NU",
        name: "Niue"
    }, {
        code: "NF",
        name: "Norfolk Island"
    }, {
        code: "MP",
        name: "Northern Mariana Islands"
    }, {
        code: "NO",
        name: "Norway"
    }, {
        code: "OM",
        name: "Oman"
    }, {
        code: "PK",
        name: "Pakistan"
    }, {
        code: "PW",
        name: "Palau"
    }, {
        code: "PS",
        name: "Palestine"
    }, {
        code: "PA",
        name: "Panama"
    }, {
        code: "PG",
        name: "Papua New Guinea"
    }, {
        code: "PY",
        name: "Paraguay"
    }, {
        code: "PE",
        name: "Peru"
    }, {
        code: "PH",
        name: "Philippines"
    }, {
        code: "PN",
        name: "Pitcairn"
    }, {
        code: "PL",
        name: "Poland"
    }, {
        code: "PT",
        name: "Portugal"
    }, {
        code: "PR",
        name: "Puerto Rico"
    }, {
        code: "QA",
        name: "Qatar"
    }, {
        code: "RO",
        name: "Romania"
    }, {
        code: "RU",
        name: "Russia"
    }, {
        code: "RW",
        name: "Rwanda"
    }, {
        code: "RE",
        name: "RÃ©union"
    }, {
        code: "BL",
        name: "Saint BarthÃ©lemy"
    }, {
        code: "SH",
        name: "Saint Helena"
    }, {
        code: "KN",
        name: "Saint Kitts and Nevis"
    }, {
        code: "LC",
        name: "Saint Lucia"
    }, {
        code: "MF",
        name: "Saint Martin"
    }, {
        code: "PM",
        name: "Saint Pierre and Miquelon"
    }, {
        code: "VC",
        name: "Saint Vincent and the Grenadines"
    }, {
        code: "WS",
        name: "Samoa"
    }, {
        code: "SM",
        name: "San Marino"
    }, {
        code: "SA",
        name: "Saudi Arabia"
    }, {
        code: "SN",
        name: "Senegal"
    }, {
        code: "RS",
        name: "Serbia"
    }, {
        code: "SC",
        name: "Seychelles"
    }, {
        code: "SL",
        name: "Sierra Leone"
    }, {
        code: "SG",
        name: "Singapore"
    }, {
        code: "SX",
        name: "Sint Maarten"
    }, {
        code: "SK",
        name: "Slovakia"
    }, {
        code: "SI",
        name: "Slovenia"
    }, {
        code: "SB",
        name: "Solomon Islands"
    }, {
        code: "SO",
        name: "Somalia"
    }, {
        code: "ZA",
        name: "South Africa"
    }, {
        code: "GS",
        name: "South Georgia and the South Sandwich Islands"
    }, {
        code: "SS",
        name: "South Sudan"
    }, {
        code: "ES",
        name: "Spain"
    }, {
        code: "LK",
        name: "Sri Lanka"
    }, {
        code: "SD",
        name: "Sudan"
    }, {
        code: "SR",
        name: "Suriname"
    }, {
        code: "SJ",
        name: "Svalbard and Jan Mayen"
    }, {
        code: "SZ",
        name: "Swaziland"
    }, {
        code: "SE",
        name: "Sweden"
    }, {
        code: "SE",
        name: "Sweden"
    }, {
        code: "SL",
        name: "Sri Lanka"
    }, {
        code: "SY",
        name: "Syria"
    }, {
        code: "ST",
        name: "SÃ£o TomÃ© and PrÃ­ncipe"
    }, {
        code: "TW",
        name: "Taiwan"
    }, {
        code: "TJ",
        name: "Tajikistan"
    }, {
        code: "TZ",
        name: "Tanzania"
    }, {
        code: "TH",
        name: "Thailand"
    }, {
        code: "TG",
        name: "Togo"
    }, {
        code: "TK",
        name: "Tokelau"
    }, {
        code: "TO",
        name: "Tonga"
    }, {
        code: "TT",
        name: "Trinidad and Tobago"
    }, {
        code: "TN",
        name: "Tunisia"
    }, {
        code: "TR",
        name: "Turkey"
    }, {
        code: "TM",
        name: "Turkmenistan"
    }, {
        code: "TC",
        name: "Turks and Caicos Islands"
    }, {
        code: "TV",
        name: "Tuvalu"
    }, {
        code: "UG",
        name: "Uganda"
    }, {
        code: "UA",
        name: "Ukraine"
    }, {
        code: "AE",
        name: "United Arab Emirates"
    }, {
        code: "GB",
        name: "United Kingdom"
    }, {
        code: "UM",
        name: "United States Minor Outlying Islands"
    }, {
        code: "US",
        name: "United States of America"
    }, {
        code: "UY",
        name: "Uruguay"
    }, {
        code: "UZ",
        name: "Uzbekistan"
    }, {
        code: "VU",
        name: "Vanuatu"
    }, {
        code: "VA",
        name: "Vatican City"
    }, {
        code: "VE",
        name: "Venezuela"
    }, {
        code: "VN",
        name: "Vietnam"
    }, {
        code: "VI",
        name: "Virgin Islands of the United States"
    }, {
        code: "WF",
        name: "Wallis and Futuna"
    }, {
        code: "EH",
        name: "Western Sahara"
    }, {
        code: "YE",
        name: "Yemen"
    }, {
        code: "ZM",
        name: "Zambia"
    }, {
        code: "ZW",
        name: "Zimbabwe"
    }, {
        code: "AX",
        name: "Ã…land Islands"
    }];



    //----------- Payment History Starts ---------------------------

    $scope.ledgers = [];
    $scope.getPaymentHistory = function(){
        $scope.ledgers = [];        
        //Date validations
        if($scope.startDate === undefined || $scope.startDate == "" || $scope.endDate === undefined || $scope.endDate == "" )
        {
            notifications.toast('0','Please select a date range!');
            return;
        }
        var startDate = moment($scope.startDate);
        var endDate = moment($scope.endDate);        
        if ( startDate > endDate)
        {
            notifications.toast('0','Please select a valid date range!');
            return;
        }
        // $http.get('http://192.168.2.61:8080/get_packages?get_type=ledger&SecurityToken=4ea0b4e5351ebb4df4fdf3cefe298106&start_date=2016-10-15%2000:00:00&end_date=2016-11-15%2000:00:00')
        $http.get(Digin_Engine_API + 'get_packages?get_type=ledger&SecurityToken=' + getCookie('securityToken') + '&start_date=' + $scope.startDate + ' 00:00:00' + '&end_date=' + $scope.endDate + ' 23:59:59')
            .success(function(data) {
                if(data.Is_Success){
                    var newObj = {};
                    if(data.Result.length>0){
                        angular.forEach(data.Result,function(res){
                            newObj = {};
                            newObj["created_datetime"] = res.created_datetime.replace('T',' ');
                            newObj["package_price"] = res.package_Details[0].package_price;
                            newObj["package_name"] = res.package_Details[0].package_name;
                            newObj["details"] = res.package_Details;
                            $scope.ledgers.push(newObj);
                        })
                    }
                } else{
                    notifications.toast('0','Error occurred')
                }
            }).error(function(){
                notifications.toast('0','Error occurred')
            });
    };

    //----------Payment History Ends---------------------------

});

routerApp.controller('changePasswordCtrl', ['$scope', '$mdDialog', '$http', 'notifications', function($scope, $mdDialog, $http, notifications) {

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.submit = function() {
        if ($scope.newPassword === $scope.confirmNewPassword) {

            console.log(window.location.host + '/auth/ChangePassword/' + encodeURIComponent($scope.oldPassword) + '/' + encodeURIComponent($scope.newPassword));
            $http.get('/auth/ChangePassword/' + encodeURIComponent($scope.oldPassword) + '/' + encodeURIComponent($scope.newPassword))
                .success(function(data) {
                    if (data.Error) {;
                        notifications.toast('0', data.Message);
                    } else {
                        notifications.toast('1', 'Password is changed successfully.');
                        $mdDialog.hide();
                    }

                }).error(function() {
                    notifications.toast('0', "Error occurred while changing the password.");
                });

        } else {
            notifications.toast('0', 'Passwords does not match.');
        }
    }
}])

routerApp.controller('uploadProfilePictureCtrl', ['$scope', '$mdDialog', '$http', 'notifications', function($scope, $mdDialog, $http, notifications) {
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.submit = function() {

    }
}])

//Password Strength Directive - Start
routerApp.directive('passwordStrengthIndicator', passwordStrengthIndicator);

function passwordStrengthIndicator() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '='
            },
            link: function(scope, element, attrs, ngModel) {

                scope.strengthText = "";

                var strength = {
                    measureStrength: function(p) {
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

                var listener = scope.$watch('ngModel', function(newValue) {
                    angular.forEach(dots, function(el) {
                        el.style.backgroundColor = '#EDF0F3';
                    });
                    if (ngModel.$modelValue) {
                        var c = strength.measureStrength(ngModel.$modelValue);
                        if (ngModel.$modelValue.length > 7 && c > 2) {
                            angular.forEach(strongest, function(el) {
                                el.style.backgroundColor = '#039FD3';
                                scope.strengthText = "is very strong";
                            });

                        } else if (ngModel.$modelValue.length > 5 && c > 1) {
                            angular.forEach(strong, function(el) {
                                el.style.backgroundColor = '#72B209';
                                scope.strengthText = "is strong";
                            });
                        } else if (ngModel.$modelValue.length > 3 && c > 0) {
                            angular.forEach(weak, function(el) {
                                el.style.backgroundColor = '#E09015';
                                scope.strengthText = "is weak";
                            });
                        } else {
                            weakest.style.backgroundColor = '#D81414';
                            scope.strengthText = "is very weak";
                        }
                    }
                });

                scope.$on('$destroy', function() {
                    return listener();
                });
            },
            template: '<span id="password-strength-indicator"><span></span><span></span><span></span><span></span><md-tooltip>password strength {{strengthText}}</md-tooltip></span>'
        };
    }
    //Password Strength Directive - End


window.directiveResources = {};



routerApp.service('notifications', ['ngToast', '$mdDialog', function(ngToast, $mdDialog) {

    this.toast = function(msgType, content) {
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
            dismissButton: true
        });
    }

    this.alertDialog = function(title, content) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('input[name="editForm"]')))
            .clickOutsideToClose(true)
            .title(title)
            .textContent(content)
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
        );
    }

    this.startLoading = function(displayText) {
        $mdDialog.show({
            template: '<md-dialog ng-cloak style="max-width:400px;">' +
                ' <md-dialog-content style="padding:20px;">' +
                '   <div layout="row" layout-align="start center">' +
                '     <md-progress-circular class="md-accent" md-mode="indeterminate" md-diameter="40" style=" padding-right: 45px"></md-progress-circular>' +
                '     <span style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;">' + displayText + '</span>' +
                '   </div>' +
                ' </md-dialog-content>' +
                '</md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        })
    }
    this.finishLoading = function() {
        $mdDialog.hide();
    }
}]);


routerApp.service('profile', ['$rootScope', '$http', 'ProfileService', function($rootScope, $http, ProfileService) {

    this.getProfile = function() {
        var baseUrl = "http://" + window.location.hostname;
        //$http.get('http://omalduosoftwarecom.prod.digin.io/apis/profile/userprofile/omal@duosoftware.com') 
        $http.get(baseUrl + '/apis/profile/userprofile/' + $rootScope.profile_Det.Email)
            .success(function(response) {
                console.log(response);
                //#load exisitging data
                $rootScope.profile_Det = response;
                $rootScope.address = response.BillingAddress;
                $rootScope.company = response.Company;
                $rootScope.country = response.Country;
                $rootScope.email = response.Email;
                $rootScope.name = response.Name;
                $rootScope.phoneNo = response.PhoneNumber;
                $rootScope.zipCode = response.ZipCode;
                response.BannerPicture = ProfileService.UserDataArr.BannerPicture;
                ProfileService.InitProfileData(response);

            }).
        error(function(error) {});
    }


}]);

routerApp.directive('validNumber', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^0-9]+/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

routerApp.directive('customOnChange', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeFunc);
        }
    };
});

routerApp.controller('addaLaCarteCtrl', ['$scope', '$rootScope', '$mdDialog', '$http', 'notifications', '$state', '$stateParams','Digin_Engine_API','userAdminFactory','pouchDB', function($scope, $rootScope, $mdDialog, $http, notifications, $state, $stateParams,Digin_Engine_API,userAdminFactory,pouchDB) {

    userAdminFactory.getInvitedUsers();


        //#common pre loader
    var displayProgress = function(message) {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>' + message + '</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
    };

    //#common error message
    var displayError = function(message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Process fail !').textContent('' + message + '').ariaLabel('Fail to complete.').ok('OK'));
    };

    //#common error message
    var displaySuccess = function(message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Success !').textContent('' + message + '').ariaLabel('successfully completed.').ok('OK'));
    };

    $scope.usersRate = 5;
    $scope.storageRate = 8;
    $scope.bandwithRate = 10;

    $scope.users=$rootScope.extraUsers;
    $scope.storage=$rootScope.extraStorage;
    $scope.bandwidth=$rootScope.extraData;

    if ($scope.users == "" || $scope.users == undefined) {
        $scope.users = 0;
    }
    if ($scope.storage == "" || $scope.storage == undefined) {
        $scope.storage = 0;
    }
    if ($scope.bandwidth == "" || $scope.bandwidth == undefined) {
        $scope.bandwidth = 0;
    }


    //#Confirm card detail
    $scope.confirmCard = function(event) {

    }

    $scope.route = function(state, pageNo) //pageNo is optional
        {
            $state.go(state, {
                'pageNo': pageNo
            });
        }


    //#Customise package add alacartes#//
    $scope.submit = function(ev) {
        /*if(!$rootScope.userLevel=='admin'){
           displayError('You are not permitted to do this opertion, allowed only for administrator'); 
        }*/
        if($rootScope.sharableUsers.length>(parseInt($rootScope.defaultUsers)+parseInt($scope.users))){
            displayError('There are '+ $rootScope.sharableUsers.length+' active users, Please remove user before update alacarte.');
            $scope.users=$rootScope.extraUsers;
        }
        else{
            var confirm = $mdDialog.confirm()
                .title('Customize Package')
                .textContent('Do you want to proceed with payment?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                //Yes
                if ($rootScope.custStatus == true) {
                    $scope.ProceedCustomizedValidation();
                } else {
                    //notifications.toast('0','This customer is not active customer or currently have not been subsctibed any package.');
                    displayError('For free package user will not allow to add any extra features.');
                }
            }, function() {
                //No
            });
        }
            
    };

    //#common error message
    var displayError = function(message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Process fail !').textContent('' + message + '').ariaLabel('Fail to complete.').ok('OK'));
    };


    $scope.ProceedCustomizedValidation = function() {
        if (($scope.users == "" || $scope.users == undefined) && ($scope.storage == "" || $scope.storage == undefined) && ($scope.bandwidth == "" || $scope.bandwidth == undefined)) {
            notifications.toast("0", "You have not selected any alacarte to customize!");
        } else {

            displayProgress("Processing...")


            var obj = [];
            var objDigin=[];

            //compare users
            if(parseInt($scope.users)>parseInt($rootScope.extraUsers)){ //add
                var users = [{
                    "tag": "user",
                    "feature": "Additional users",
                    "quantity": parseInt($scope.users)-parseInt($rootScope.extraUsers),
                    "amount": (parseInt($scope.users)-parseInt($rootScope.extraUsers)) * $scope.usersRate,
                    "action": "add"
                }];

                var usersDigin = [{
                    "package_id":null,
                    "package_name":"additional",
                    "package_attribute": "users",
                    "package_value": parseInt($scope.users)-parseInt($rootScope.extraUsers),
                    "package_price": (parseInt($scope.users)-parseInt($rootScope.extraUsers)) * $scope.usersRate,
                    "is_default":false,
                    "is_new": true
                }];

                obj.push(users[0]);
                objDigin.push(usersDigin[0]);
            }
            else if(parseInt($scope.users)<parseInt($rootScope.extraUsers)){ //remove
                var users = [{
                    "tag": "user",
                    "feature": "Additional users",
                    "quantity": parseInt($rootScope.extraUsers)-parseInt($scope.users),
                    "amount": (parseInt($rootScope.extraUsers)-parseInt($scope.users)) * $scope.usersRate,
                    "action": "remove"
                }];

                var usersDigin = [{
                    "package_id":null,
                    "package_name":"additional",
                    "package_attribute": "users",
                    "package_value": parseInt($scope.users)-parseInt($rootScope.extraUsers),
                    "package_price": (parseInt($scope.users)-parseInt($rootScope.extraUsers)) * $scope.usersRate,
                    "is_default":false,
                    "is_new": true
                }];

                obj.push(users[0]);
                objDigin.push(usersDigin[0]);
            }
            else{//nothing

            }

            //compare data
            if(parseInt($scope.bandwidth)>parseInt($rootScope.extraData)){ //add
                var data = [{
                    "tag": "data",
                    "feature": "Additional data",
                    "quantity": parseInt($scope.bandwidth)-parseInt($rootScope.extraData),
                    "amount": (parseInt($scope.bandwidth)-parseInt($rootScope.extraData)) * $scope.bandwithRate,
                    "action": "add"
                }];

                var dataDigin = [{
                    "package_id":null,
                    "package_name":"additional",
                    "package_attribute": "data",
                    "package_value":parseInt($scope.bandwidth)-parseInt($rootScope.extraData),
                    "package_price": (parseInt($scope.bandwidth)-parseInt($rootScope.extraData)) * $scope.bandwithRate,
                    "is_default":false ,
                    "is_new":true
                }];

                obj.push(data[0]);
                objDigin.push(dataDigin[0]);
            }
            else if(parseInt($scope.bandwidth)<parseInt($rootScope.extraData)){ //remove
                var data = [{
                    "tag": "data",
                    "feature": "Additional data",
                    "quantity": parseInt($rootScope.extraData)-parseInt($scope.bandwidth),
                    "amount": (-parseInt($rootScope.extraData)-parseInt($scope.bandwidth)) * $scope.bandwithRate,
                    "action": "remove"
                }];

                var dataDigin = [{
                    "package_id":null,
                    "package_name":"additional",
                    "package_attribute": "data",
                    "package_value":parseInt($scope.bandwidth)-parseInt($rootScope.extraData),
                    "package_price": (parseInt($scope.bandwidth)-parseInt($rootScope.extraData)) * $scope.bandwithRate,
                    "is_default":false ,
                    "is_new":true
                }];

                obj.push(data[0]);
                objDigin.push(dataDigin[0]);
            }
            else{//nothing

            }

            //compare storage
            if(parseInt($scope.storage)>parseInt($rootScope.extraStorage)){ //add
                var storage = [{
                    "tag": "storage",
                    "feature": "Additional storage",
                    "quantity": parseInt($scope.storage)-parseInt($rootScope.extraStorage),
                    "amount": (parseInt($scope.storage)-parseInt($rootScope.extraStorage)) * $scope.storageRate,
                    "action": "add"
                }];

                var storageDigin = [{
                    "package_id":null,
                    "package_name":"additional",
                    "package_attribute": "storage",
                    "package_value":parseInt($scope.storage)-parseInt($rootScope.extraStorage),
                    "package_price":(parseInt($scope.storage)-parseInt($rootScope.extraStorage)) * $scope.storageRate,
                    "is_default":false ,
                    "is_new":true
                }];

                obj.push(storage[0]);
                objDigin.push(storageDigin[0]);
            }
            else if(parseInt($scope.storage)<parseInt($rootScope.extraStorage)){ //remove
                var storage = [{
                    "tag": "storage",
                    "feature": "Additional storage",
                    "quantity": parseInt($rootScope.extraStorage)-parseInt($scope.storage),
                    "amount": (parseInt($rootScope.extraStorage)-parseInt($scope.storage)) * $scope.storageRate,
                    "action": "remove"
                }];

                var storageDigin = [{
                    "package_id":null,
                    "package_name":"additional",
                    "package_attribute": "storage",
                    "package_value":parseInt($scope.storage)-parseInt($rootScope.extraStorage),
                    "package_price":(parseInt($scope.storage)-parseInt($rootScope.extraStorage)) * $scope.storageRate,
                    "is_default":false ,
                    "is_new":true
                }];

                obj.push(storage[0]);
                objDigin.push(storageDigin[0]);
            }
            else{//nothing

            }



            var pkgObj = {
                "plan": {
                    "features": obj
                }
            }

            $scope.customizePackage(pkgObj,objDigin);
        }
    }


    $scope.clearData = function() {
        $scope.users = 0;
        $scope.storage = 0;
        $scope.bandwidth = 0;
    }

    //#common pre loader
    var displayProgress = function(message) {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>' + message + '</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
    };


    //#Customize existing package
    $scope.customizePackage = function(pkgObj,objDigin) {

        /*var pkgObj = {
              "plan" :  {
                          "features": [
                {"tag":"user","feature": "Additional users","amount": 15,"quantity":5,"action":"add"},
                            {"tag":"storage","feature": "Additional storage","quantity":0,"amount": 30,"action":"add"},
                {"tag":"bandwidth","feature": "Additional bandwidth","amount": 15,"quantity":5,"action":"add"}
                          ]
                        }
              }*/

              
        $http({
            //url : "http://staging.digin.io/include/duoapi/paymentgateway/customizePackage",
            url: "/include/duoapi/paymentgateway/customizePackage",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: pkgObj
        }).then(function(response) {
            console.log(response)
            if (response.statusText == "OK") {
                if (response.data.status == true) {
                    //Success
                    $scope.updatePackageDigin(objDigin);
                    $mdDialog.hide();
                    //$scope.clearData();
                } else {
                    //fail
                    $mdDialog.hide();
                    
                    if(response.data.response=='Cannot charge a customer that has no active card'){
                        notifications.toast("0", "Please update your card detail.");
                    }else{
                        notifications.toast("0", "Failed to update alaCartes.");
                    }
                    

                }
            } else {

            }
        }, function(response) {
            console.log(response)
            $mdDialog.hide();
            notifications.toast("0", "Error occured while customizing the package.");

        })
    }


    
    
    //#Update package-Digin*// 
    $scope.updatePackageDigin = function(pkgObj) {  

        displayProgress("Updating extra features...")  

        $http({
            method: 'POST',
            url: Digin_Engine_API + 'activate_packages/',
            data: angular.toJson(pkgObj),
            headers: {
                'Content-Type': 'application/json',
                'SecurityToken': getCookie('securityToken')
            }
        })
        .success(function(response) {
            //notifications.toast("1", "AlaCartes added successfully.");
            
                    $rootScope.extraUser=parseInt($scope.users);
                    $rootScope.extraData=parseInt($scope.bandwidth);
                    $rootScope.extraStorage=parseInt($scope.storage);

           
           var db = new PouchDB('packaging');
           db.get('packgedetail').then(function (doc_package) {
                              // update
                        doc_package.additionaluser=parseInt($scope.users);
                        doc_package.additionaldata=parseInt($scope.bandwidth);
                        doc_package.additionalstorage=parseInt($scope.storage);
                        

                             
                             displaySuccess("AlaCartes updated successfully."); 
                                    $mdDialog.hide();


                              // put them back
                               return db.put(doc_package);

                            }).then(function () {
                              // fetch mittens again
                              //return db.get('mittens');
                            }).then(function (doc) {
                              //console.log(doc);
                            });
                            
        }).error(function(data) {
            $mdDialog.hide();
        });
        $mdDialog.hide();
    }
    
    
    
    
}])

routerApp.directive('countdownn', ['Util', '$interval', function(Util, $interval) {
    return {
        restrict: 'A',
        scope: {
            date: '@',
            warning: '='
        },
        link: function(scope, element) {
            var future;
            future = new Date(scope.date);
            $interval(function() {
                var diff;
                diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                var remaining = Util.dhms(diff);
                scope.warning = remaining.warn;
                return element.text(remaining.remaining);
            }, 1000);
        }
    };
}]).directive('datepicker', function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'yy-mm-d',
                changeMonth: true,
                changeYear: true,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    }
}).factory('Util', [function() {
    return {
        dhms: function(t) {
            var days, hours, minutes, seconds;
            days = Math.floor(t / 86400);
            t -= days * 86400;
            hours = Math.floor(t / 3600) % 24;
            t -= hours * 3600;
            minutes = Math.floor(t / 60) % 60;
            t -= minutes * 60;
            seconds = t % 60;
            if (days < 30) {
                return {
                    remaining: [days + ' days ', hours + ' hours ', minutes + ' minutes and ', seconds + ' seconds remaining '].join(' '),
                    warn: true
                };
            } else {
                return {
                    remaining: [days + ' days ', hours + ' hours ', minutes + ' minutes remaining '].join(' '),
                    warn: false
                };
            }
        }
    };
}]);


routerApp.service('paymentGatewaySvc', ['$http', 'notifications', '$rootScope','pouchDB', function($http, notifications, $rootScope,pouchDB) {

    var db = new PouchDB('packaging');

    //#Stop subscription immediate
    this.stopSubscriptionImmediate = function() {
        $http({
            //url : "http://staging.digin.io/include/duoapi/paymentgateway/stopSubscriptionImmediate",
            url: "/include/duoapi/paymentgateway/stopSubscriptionImmediate",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            //console.log(response)
            if (response.statusText == "OK") {
                if (response.data.status == true) {
                    //Success
                    notifications.toast("1", "You account is deactivated.");
                } else {
                    //fail
                    notifications.toast("0", "Account deactivation is failed.");
                }
            }
        }, function(response) {
            //console.log(response)
            notifications.toast("0", "Error occured while deactivating the account.");
        })

    }

    //#Stop subscription immediate
    this.stopSubscriptionEndOfPeriod = function() {

        $http({
            //url : "http://staging.digin.io/include/duoapi/paymentgateway/stopSubscriptionEndOfPeriod",
            url: "/include/duoapi/paymentgateway/stopSubscriptionEndOfPeriod",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            //console.log(response)
            if (response.statusText == "OK") {
                if (response.data.status == true) {
                    //Success
                    notifications.toast("1", response.data.response);
                } else {
                    //fail
                    notifications.toast("0", response.data.response);
                }
            }
        }, function(response) {
            //console.log(response)
            notifications.toast("0", "Error occured while deactivating the account.");
        })

    }

    //#Reactive subscription
    this.reactiveSubscription = function() {
        $http({
            //url : "http://staging.digin.io/include/duoapi/paymentgateway/reinstall",
            url: "/include/duoapi/paymentgateway/reactiveSubscription",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            //console.log(response)
            if (response.statusText == "OK") {
                if (response.data.status == true) {
                    //Success
                    notifications.toast("1", "You account is reactivated.");
                } else {
                    //fail
                    notifications.toast("0", "Account reactivation is failed.");
                }
            }
        }, function(response) {
            //console.log(response)
            notifications.toast("0", "Error occured while reactivating the account.");
        })

    }


    //#get customer informations
   /* this.getCustomerInformations = function() {
        $http({
            //url : "http://staging.digin.io/include/duoapi/paymentgateway/getCustomerInformations",
            url: "/include/duoapi/paymentgateway/getCustomerInformations",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            //console.log(response)
            if (response.statusText == "OK") {
                if (response.data.status == true) {
                    console.log(response)
                    $rootScope.customer = response.data.response;
                    
                    var doc={
                            "_id":"cusstatus",
                            "name":"cusstatus",
                            "status":response.data.status,
                            "active":response.data.data[0].active
                            }
                    db.put(doc)
                    
                    
                } else {
                    $rootScope.customer = {};
                }
            }
        }, function(response) {
            //console.log(response)
            notifications.toast("0", "Error occured while retriving the account detail.");
        })

    }*/

    //#Check subscription
    /*this.checkSubscription = function() {
        var packagename="";
        var packageprice=0;
        var packageuser=0;
        var packagedata=0;
        var packagestorage=0;
        var additionaluser=0;
        var additionaldata=0;
        var additionalstorage=0;
    
    
        $http({
            //url : "http://staging.digin.io/include/duoapi/paymentgateway/checkSubscription",
            url: "/include/duoapi/paymentgateway/checkSubscription",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            //console.log(response)
            if (response.statusText == "OK") {
                $rootScope.custStatus = response.data.status;
                
                if(response.data.status){
                    
                    for(i=0; i<response.data.response[0].otherInfo.length; i++)
                    {                   
                        if(response.data.response[0].otherInfo[i].tag=="Package")
                        {
                            packagename=response.data.response[0].otherInfo[i].feature;
                            packageprice=response.data.response[0].otherInfo[i].amount;
                            if(packagename==""){
                                packageuser=1;
                                packagedata=10;
                                packagestorage=100;
                            }
                            else if(packagename==""){
                                packageuser=5;
                                packagedata=10;
                                packagestorage=100;
                            }
                            else if(packagename==""){
                                packageuser=10;
                                packagedata=10;
                                packagestorage=100;
                            }
                            else{
                                packageuser=0;
                                packagedata=0;
                                packagestorage=0;
                            }                                                           
                        }
                        else
                        {
                            if(response.data.response[0].otherInfo[i].tag=="user")
                            {
                                if(response.data.response[0].otherInfo[i].action=="add")
                                {
                                    additionaluser=additionaluser+response.data.response[0].otherInfo[i].quantity;
                                }
                                if(response.data.response[0].otherInfo[i].action=="remove")
                                {
                                    additionaluser=additionaluser-response.data.response[0].otherInfo[i].quantity;
                                }
                                
                            }
                            if(response.data.response[0].otherInfo[i].tag=="data")
                            {
                                if(response.data.response[0].otherInfo[i].action=="add")
                                {
                                    additionaldata=additionaluser+response.data.response[0].otherInfo[i].quantity;
                                }
                                if(response.data.response[0].otherInfo[i].action=="remove")
                                {
                                    additionaldata=additionaluser-response.data.response[0].otherInfo[i].quantity;
                                }
                            }
                            if(response.data.response[0].otherInfo[i].tag=="storage")
                            {
                                if(response.data.response[0].otherInfo[i].action=="add")
                                {
                                    additionalstorage=additionaluser+response.data.response[0].otherInfo[i].quantity;
                                }
                                if(response.data.response[0].otherInfo[i].action=="remove")
                                {
                                    additionalstorage=additionaluser-response.data.response[0].otherInfo[i].quantity;
                                }
                            }
                            
                        }   
                    }
            
                }
            
                var doc={
                        "_id":"packgedetail",
                        "name":"packgedetail",
                        "packagename":packagename,
                        "packageprice":packageprice,
                        "packageuser":packageuser,
                        "packagedata":packagedata,
                        "packagestorage":packagestorage,
                        "additionaluser":additionaluser,
                        "additionaldata":additionaldata,
                        "additionalstorage":additionalstorage
                        }
                db.put(doc);
                
                var doc={
                        "_id":"chkstatus",
                        "name":"chkstatus",
                        "status":response.data.status,
                        "paystatus":response.data.response[0].status
                        }
                db.put(doc);
            
            }   
        }, function(response) {
            console.log(response)
            notifications.toast("0", "Error occured while retriving the account detail.");
        })

    }*/

    this.checkSubscription = function() {
        var db = new PouchDB('packaging');
        var packagename="";
        var packageprice=0;
        var packageuser=0;
        var packagedata=0;
        var packagestorage=0;
        var additionaluser=0;
        var additionaldata=0;
        var additionalstorage=0;
        var paystatus="";
    
    
        $http({
            //url : "http://staging.digin.io/include/duoapi/paymentgateway/checkSubscription",
            url: "/include/duoapi/paymentgateway/checkSubscription",
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            //console.log(response)
            if (response.statusText == "OK") {
                $rootScope.custStatus = response.data.status;
                
                if(response.data.status){
                    paystatus=response.data.response[0].status;
                        for(i=0; i<response.data.response[0].otherInfo.length; i++)
                        {                   
                            if(response.data.response[0].otherInfo[i].tag=="Package")
                            {
                                packagename=response.data.response[0].otherInfo[i].feature;
                                packageprice=response.data.response[0].otherInfo[i].amount;
                                if(packagename=="personal_space"){
                                    packagename='Personal Space';
                                    packageuser=1;
                                    packagedata=10;
                                    packagestorage=100;
                                }
                                else if(packagename=="mini_team"){
                                    packagename='We Are A Mini Team';
                                    packageuser=5;
                                    packagedata=10;
                                    packagestorage=100;
                                }
                                else if(packagename=="world"){                              
                                    packagename='We Are the World';
                                    packageuser=10;
                                    packagedata=10;
                                    packagestorage=100;
                                }
                                else{
                                    packagename='Free';
                                    packageuser=1;
                                    packagedata=10;
                                    packagestorage=100; 
                                }                               
                            }
                            else
                            {
                                if(response.data.response[0].otherInfo[i].tag=="user")
                                {
                                    if(response.data.response[0].otherInfo[i].action=="add")
                                    {
                                        additionaluser=additionaluser+response.data.response[0].otherInfo[i].quantity;
                                    }
                                    if(response.data.response[0].otherInfo[i].action=="remove")
                                    {
                                        additionaluser=additionaluser-response.data.response[0].otherInfo[i].quantity;
                                    }
                                    
                                }
                                if(response.data.response[0].otherInfo[i].tag=="data")
                                {
                                    if(response.data.response[0].otherInfo[i].action=="add")
                                    {
                                        additionaldata=additionaldata+response.data.response[0].otherInfo[i].quantity;
                                    }
                                    if(response.data.response[0].otherInfo[i].action=="remove")
                                    {
                                        additionaldata=additionaldata-response.data.response[0].otherInfo[i].quantity;
                                    }
                                }
                                if(response.data.response[0].otherInfo[i].tag=="storage")
                                {
                                    if(response.data.response[0].otherInfo[i].action=="add")
                                    {
                                        additionalstorage=additionalstorage+response.data.response[0].otherInfo[i].quantity;
                                    }
                                    if(response.data.response[0].otherInfo[i].action=="remove")
                                    {
                                        additionalstorage=additionalstorage-response.data.response[0].otherInfo[i].quantity;
                                    }
                                }
                                
                        }   
                        }           
                }
                else{
                                packagename='Free';
                                packageuser=1;
                                packagedata=10;
                                packagestorage=100; 
                                paystatus="Free";
                }
                
                var doc={
                        "_id":"packgedetail",
                        "name":"packgedetail",
                        "packagename":packagename,
                        "packageprice":packageprice,
                        "packageuser":packageuser,
                        "packagedata":packagedata,
                        "packagestorage":packagestorage,
                        "additionaluser":additionaluser,
                        "additionaldata":additionaldata,
                        "additionalstorage":additionalstorage
                        }
                db.put(doc);
                
                
                
                var doc={
                        "_id":"chkstatus",
                        "name":"chkstatus",
                        "status":response.data.status,
                        "paystatus":paystatus
                        }
                db.put(doc);
               /*     
            $scope.packageName=packagename;
            $scope.packagePrice=packageprice;
            $scope.defaultUsers=packageuser;
            $scope.defaultData=packagedata;
            $scope.defaultStorage=packagestorage;
            $scope.extraUsers=additionaluser;
            $scope.extraData=additionaldata;
            $scope.extraStorage=additionalstorage;
            */
            
            $rootScope.packageName=packagename;
            $rootScope.packagePrice=packageprice;
            $rootScope.defaultUsers=packageuser;
            $rootScope.defaultData=packagedata;
            $rootScope.defaultStorage=packagestorage;
            $rootScope.extraUsers=additionaluser;
            $rootScope.extraData=additionaldata;
            $rootScope.extraStorage=additionalstorage;
            
            
            }   
        }, function(response) {
            console.log(response)
            notifications.toast("0", "Error occured while retriving the account detail.");
        })
 }
    
    
    
    
    
}]);


routerApp.service('diginPackageSvc', ['$http', 'notifications', '$rootScope','Digin_Engine_API', function($http, notifications, $rootScope,Digin_Engine_API) {
 /*
    //#get package detail#//
    this.getPackageDetail=function(){
        var getDetail=function(cb){
            $http.get(Digin_Engine_API + "get_packages?get_type=detail&SecurityToken=" + getCookie('securityToken'))
            .success(function(data) {
                console.log(data.Result);
                if($rootScope.PackageDetail>0){
                    $rootScope.PackageDetail=data.Result;
                    cb(true);
                }
                else{
                    cb(false);
                    $rootScope.extraUsers=0;
                    $rootScope.extraData=0;
                    $rootScope.extraStorage=0;
                    $rootScope.defaultUsers=0;
                    $rootScope.defaultData=0;
                    $rootScope.defaultStorage=0;
                }
                
            }).error(function() {
                console.log("error");
                cb(false);
            });
        }
        

        var getDetail(function(data){
            if(data){
                for(i=0; i<=$rootScope.PackageDetail.length; i++)
                {
                    if($rootScope.PackageDetail[i].package_name="UserDefine")
                    {
                        if($rootScope.PackageDetail[i].package_attribute=="users")  
                        {
                            $rootScope.extraUsers=$rootScope.PackageSummary[i].package_value_sum;
                        }
                        else if($rootScope.PackageDetail[i].package_attribute=="data"){
                            $rootScope.extraData=$rootScope.PackageSummary[i].package_value_sum;
                        }
                        else if($rootScope.PackageDetail[i].package_attribute=="storage"){
                            $rootScope.extraStorage=$rootScope.PackageSummary[i].package_value_sum;
                        }
                    }
                    else
                    {
                        if($rootScope.PackageDetail[i].package_attribute=="users")
                        {   
                            $rootScope.defaultUsers=$rootScope.PackageDetail[i].package_value_sum;
                        }
                        else if($rootScope.PackageDetail[i].package_attribute=="data"){
                            $rootScope.defaultData=$rootScope.PackageDetail[i].package_value_sum;
                        }
                        else if($rootScope.PackageDetail[i].package_attribute=="storage"){
                            $rootScope.defaultStorage=$rootScope.PackageDetail[i].package_value_sum;
                        }
                    }
                }
            }
        });
    }
             

     //#get package summary#//
    this.getPackageSummary=function(){
        var getSummary=function(cb){
            $http.get(Digin_Engine_API + "get_packages?get_type=summary&SecurityToken=" + getCookie('securityToken'))
            .success(function(data) {
                console.log(data.Result);
                $rootScope.PackageSummary=data.Result;
                if($rootScope.PackageSummary.length>0){
                    data(true);
                }
                else{
                    $rootScope.totUsers=0;
                    $rootScope.totData=0;
                    $rootScope.totStorage=0;
                    data(false);
                }
            }).error(function() {
                console.log("error");
            });
        }
         
         var getSummary(function(data){
             if(data){
                 for(i=0; i<=$rootScope.PackageSummary.length; i++){
                    if($rootScope.PackageSummary[i].package_attribute=="users"){
                        $rootScope.totUsers=$rootScope.PackageSummary[i].package_value_sum;
                    }
                    else if($rootScope.PackageSummary[i].package_attribute=="data"){
                        $rootScope.totData=$rootScope.PackageSummary[i].package_value_sum;
                    }
                    else if($rootScope.PackageSummary[i].package_attribute=="storage"){
                        $rootScope.totStorage=$rootScope.PackageSummary[i].package_value_sum;
                    }
                }
             }
         });
         
    }
    
*/
    
    

    
    
    
    
}]);

