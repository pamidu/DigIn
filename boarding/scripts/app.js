var app = angular.module('app', ['ngMaterial', 'ngMessages', 'md-steppers','stripe-payment-tools','ngCookies','configuration']);

app.config(["$httpProvider", function ($httpProvider) {

    $httpProvider.defaults.headers.post['Content-Type'] = 'multipart/form-data';
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded";
}]);


app.controller('MainCtrl', function ($scope, $rootScope, $q, $timeout, paymentGateway,$mdDialog,$cookies,$http,Digin_Tenant,Digin_Domain,Digin_Engine_API,apis_Path,onsite,dbType,tenantId) {

    var vm = this;

     if(onsite){
        var tenant={
            name: '',
            address: '',
            users: ''
        };
        $scope.tenant=tenant;
        tenant.name=tenantId;
    }
   

    vm.companyPricePlans = [
        {
            package_id:1001, //Use for digin service as package id, for numeric id
            id : "Free",
            name:"Free",
            sp:"Free",
            //currancy:"$",
            numberOfUsers:1,
            storage: "",
            bandwidth: "",
            //perMonth: 0,
            //perYear: 10,
            //StorageStr:" of Storage",
            //BandwidthStr:" of Bandwidth)",
            //per: "/ User",
            //permonth:" / Per User (Monthly)",
            //peryear:" / Per User (Yearly)",
            Description: "30 days trial",
            price:0,
            valStorage:10,
            valData:100
        },
        {
            package_id:1002,
            id : "personal_space",
            name:"Personal Space",
            currancy:"$",
            numberOfUsers:1,
            storage: "10 GB",  //only for display
            bandwidth: "100 GB",//only for display
            StorageStr:" of Storage",
            BandwidthStr:" of Bandwidth",
            perMonth: 10,
            perYear: 10,
            per: "/User",
            permonthStr:" /User (Monthly)",
            peryearStr:" /User (Yearly)",
            Description: "",
            price:10,
            valStorage:10,
            valData:100
        },
        {
            package_id:1003,
            id : "mini_team",
            name:"We Are A Mini Team",
            currancy:"$",
            numberOfUsers:5,
            storage: "10 GB",
            bandwidth: "100 GB",
            StorageStr:" of Storage",
            BandwidthStr:" of Bandwidth",
            perMonth: 8,
            perYear: 6.99,
            per: "/User",
            permonthStr:" /User (Monthly)",
            peryearStr:" /User (Yearly)",
            Description: "",
            price:40,
            valStorage:10,
            valData:100
        },
        {   
            package_id:1004,
            id : "world",
            name:"We Are the World",
            currancy:"$",
            numberOfUsers:10,
            storage: "10 GB",
            bandwidth: "100 GB",
            StorageStr:" of Storage",
            BandwidthStr:" of Bandwidth",
            perMonth: 6,
            perYear: 4.99,
            per: "/User",
            permonthStr:" /User (Monthly)",
            peryearStr:" /User (Yearly)",
            Description: "",
            price:60,
            valStorage:10,
            valData:100
        }];
            

        
    vm.selectedStep = 0;
    vm.stepProgress = 1;
    vm.maxStep = 3;
    vm.showBusyText = false;
    vm.stepData = [
        { step: 1, completed: false, optional: false, data: {} },
        { step: 2, completed: false, optional: false, data: {} },
        { step: 3, completed: false, optional: false, data: {} },
    ];

    vm.enableNextStep = function nextStep() {
        //do not exceed into max step
        if (vm.selectedStep >= vm.maxStep) {
            return;
        }
        //do not increment vm.stepProgress when submitting from previously completed step
        if (vm.selectedStep === vm.stepProgress - 1) {
            vm.stepProgress = vm.stepProgress + 1;
        }
        vm.selectedStep = vm.selectedStep + 1;
    }


    vm.moveToPreviousStep = function moveToPreviousStep() {
        if (vm.selectedStep > 0) {
            vm.selectedStep = vm.selectedStep - 1;
        }
    }


    //#Get tenant secutity token#//
    $scope.getTenantToken=function(plan,ev)
    {       
        if(onsite){
            $rootScope.createdTenantID=tenantId+'.'+Digin_Domain;
        }
        if($rootScope.createdTenantID==undefined){
            $rootScope.createdTenantID=$scope.tenant.name+'.'+Digin_Domain;
        }
        
        $scope.getToken = function (cb) {
            $http({method: 'GET',       
                 url: '/auth/GetSession/'+decodeURIComponent($cookies.get('securityToken'))+'/'+$rootScope.createdTenantID, 
                headers: {'Securitytoken':decodeURIComponent($cookies.get('securityToken'))}
                })
            .success(function (response) {
                $scope.TenantSecToken=response.SecurityToken;     
                cb(true);     

            }).error(function (error) {
                cb(false);
            });  
        }

        $scope.getToken(function(data){   
            if(data){   
                $scope.initializedDB(plan,ev);         
            }
        });
    }

    

    //#initialize digin data set
    $scope.initializedDB=function(plan,ev){
        $scope.createDataSet = function (cb) {      
                displayProgress('Initialising dataset...');
                
                /*
                if(dbType=="mssql"){
                    $scope.data = {"db": "mssql"}
                }
                else if(dbType=="bigquery"){
                    $scope.data = {"db": "bigquery"}
                }
                else{
                    $scope.data = {"db": "bigquery"}
                }
                */

                $scope.data = {"db": dbType}

                $http({
                        method: 'POST',
                        url: Digin_Engine_API+'set_init_user_settings',
                        data: angular.toJson($scope.data),
                        headers: {
                            'SecurityToken': $scope.TenantSecToken
                        }
                    })
                    .success(function (response) {
                        /*if (response.Is_Success == true) {
                            cb (true);
                        }
                        else {  
                            if(onsite){
                                cb (true);
                            }
                            else{                                
                                cb (false);
                            }
                        }*/

                        cb (true);
                        


                    })
                    .error(function (error) {
                        displayError('Data set creation fail');
                        cb (true);
                        $mdDialog.hide();
                    });
        }

        $scope.createDataSet(function(data){
            if(data){                 
                if(plan.id=="Free"){
                    //vm.addPackage(plan, $scope.TenantSecToken);
                    vm.chkPackageExistOrNot(plan, $scope.TenantSecToken);
                    $rootScope.trial=true;
                    $rootScope.btnMessage="Congratulations...!";
                    $rootScope.btnMessage2="This trial version is valid only for 30 days.";
                    $mdDialog.hide();
                    localStorage.setItem('firstLogin',true);
                    $rootScope.btnContinue="Go to Home";
                    /*vm.enableNextStep();*/
                }
                else if(plan.id=="onsite"){
                    //vm.addPackage(plan, $scope.TenantSecToken);
                    vm.chkPackageExistOrNot(plan, $scope.TenantSecToken);
                    $rootScope.trial=false;
                    $rootScope.btnMessage="Congratulations...!";
                    $rootScope.btnMessage2="Company creation process for this onsite version is completed successfully.";
                    
                    $mdDialog.hide();
                    localStorage.setItem('firstLogin',true);
                    $rootScope.btnContinue="Go to Home";
                   /*vm.enableNextStep();
                   vm.enableNextStep();*/
                }
                else{
                    //--------------------load stripe payement detail window
                    
                        var stripeConfig = {
                            publishKey: 'pk_test_cFGvxmetyz9eV82nGBhdQ8dS',
                            title: 'DigIn',
                            description: "Beyond BI",
                            logo: 'img/small-logo.png',
                            label: 'Pay amounting $'+plan.price
                        };
                       
                        var stripegateway = paymentGateway.setup('stripe').configure(stripeConfig);
                        stripegateway.open(ev,function(token, args) {
                            console.log(token);
                            if(token!=null || token!="" || token!=undefined){ 
                                vm.proceedPayment(token,plan);
                            }
                            else
                            {
                                displayError("Error while retriving token from stripe");
                            }
                        }); 

                            /*vm.addPackage(plan, $scope.TenantSecToken);
                            $rootScope.btnMessage="Congratulations...!";
                            $rootScope.btnMessage2="Tenant creation completed successfully.";
                            localStorage.setItem('firstLogin',true);
                            $rootScope.btnContinue="Go to Home";
                            $mdDialog.hide();
                            vm.enableNextStep();*/
                    
                    //------------------
                }
                
            }
            
            //$mdDialog.hide();
        });
        
    }   
       
    vm.chkPackageExistOrNot=function(plan,TenantSecToken){
        displayProgress("Initializing package...");
        $http.get(Digin_Engine_API + "get_packages?get_type=detail&SecurityToken=" + $scope.TenantSecToken)
        .success(function(data) {
            $scope.PackageDetail=data.Result;
            if($scope.PackageDetail.length>0){ 
                if(plan.id=="Free"){
                    $rootScope.trial=true;
                    $rootScope.btnMessage="Congratulations...!";
                    $rootScope.btnMessage2="This trial version is valid only for 30 days.";
                    $mdDialog.hide();
                    localStorage.setItem('firstLogin',true);
                    $rootScope.btnContinue="Go to Home";
                    $mdDialog.hide();
                    vm.enableNextStep();
                }
                else if(plan.id=="onsite"){
                    $mdDialog.hide();
                    vm.enableNextStep();
                    vm.enableNextStep();
                }   
            }
            else{
                vm.addPackage(plan, $scope.TenantSecToken);
            }
        })
        .error(function() {
            console.log("error");
            vm.addPackage(plan, $scope.TenantSecToken);
        });
    }

         
    //#Add package to digin engine#//
    vm.addPackage = function(plan,SecurityToken) { 
        displayProgress("Creating package...");                       
        if(onsite){
            $scope.detail=[{
                        "package_id":"1005",
                        "package_name":"onsite",
                        "package_attribute": "",
                        "package_value":0,
                        "package_price":0,
                        "is_default":true,
                        "is_new": true
                        },{
                        "package_id":null,
                        "package_name":"additional",
                        "package_attribute": "users",
                        "package_value":$scope.tenant.users,
                        "package_price":0,
                        "is_default":false,
                        "is_new": true
                        }];
        }
        else{
            $scope.detail=[{
                        "package_id":plan.package_id,
                        "package_name":plan.name,
                        "package_attribute": "",
                        "package_value":0,
                        "package_price":0,
                        "is_default":true,
                        "is_new": true
                        }];
        }
            
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
            console.log(response);
            if(plan.id=="Free"){
                $rootScope.trial=true;
                $rootScope.btnMessage="Congratulations...!";
                $rootScope.btnMessage2="This trial version is valid only for 30 days.";
                $mdDialog.hide();
                localStorage.setItem('firstLogin',true);
                $rootScope.btnContinue="Go to Home";
                $mdDialog.hide();
                vm.enableNextStep();
            }
            else if(plan.id=="onsite"){
                $mdDialog.hide();
                vm.enableNextStep();
                vm.enableNextStep();
            } 
            else{
                $mdDialog.hide();
                vm.enableNextStep();
            }
        })
        .error(function(data) {
            console.log(data);
        });
    }
    
    vm.submitCurrentStep = function submitCurrentStep(tenant, isSkip) { 
        if($scope.tenant==undefined){
            return;
        }
        else if($scope.tenant.name=="" || $scope.tenant.name==undefined){
            return;
        }
        /*else if($scope.tenant.company=="" || $scope.tenant.company==undefined){
            return;
        }*/
        else if($scope.tenant.address=="" || $scope.tenant.address==undefined){
            return;
        }
        else if (onsite){
            if($scope.tenant.users=="" || $scope.tenant.users==undefined){
            return;
            }
        }
        else{
            
        }
           
        displayProgress("Submitting data...");
           
        if(tenant=='Cancel')
        {
            $rootScope.createdTenantID="";
            $rootScope.btnMessage="Thank you...!";
            $rootScope.btnContinue="Exit";
            
            var deferred = $q.defer();
            vm.showBusyText = true;
            console.log('On before submit');
            if (!tenant.completed && !isSkip) {
                //simulate $http
                $timeout(function () {
                    vm.showBusyText = false;
                    console.log('On submit success');
                    deferred.resolve({ status: 200, statusText: 'success', data: {} });
                    //move to next step when success
                    tenant.completed = true;
                    vm.enableNextStep();
                }, 1000)
                $mdDialog.hide();
            } else {
                vm.showBusyText = false;
                vm.enableNextStep();
                $mdDialog.hide();
            }
           
            
        }
        else{
                var SecToken = decodeURIComponent($cookies.get('securityToken'));
                //var userInfo = JSON.parse(decodeURIComponent($cookies.get('authData')));
                
                var tenantcode=tenant.name;
                tenantcode=tenantcode.toLowerCase();
                tenantcode=tenantcode.replace(/ /g, '');
                $scope.tenant.name=tenantcode;
               
                $http({
                    method: 'GET',
                    url: apis_Path+"usertenant/tenant/" + tenant.name + '.' + Digin_Domain,
                    headers: {
                        'Content-Type': 'application/json'
                    } 
                })
                .success(function (response) {
                    console.log(response);
                    if(response.TenantID==null || response.TenantID==""){
                            var companyDetail="";
                            if(tenant!=null || tenant!="" || tenant!=undefined){
                                companyDetail=tenant;
                            }
                            $rootScope.companyDetail=companyDetail;
                            
                            var deferred = $q.defer();
                            vm.showBusyText = true;
                            console.log('On before submit');
                            if (!tenant.completed && !isSkip) {
                                //simulate $http
                                $mdDialog.hide();
                                $timeout(function () {
                                    vm.showBusyText = false;
                                    console.log('On submit success');
                                    deferred.resolve({ status: 200, statusText: 'success', data: {} });
                                    //move to next step when success                                    
                                    tenant.completed = true;
                                    if(onsite){
                                        $scope.plan=[];
                                        $scope.plan.id='onsite'
                                        vm.createTenant($scope.plan,event);
                                    }else{
                                        vm.enableNextStep();
                                    }                                                                       
                                }, 1000)
                            } else {
                                $mdDialog.hide();
                                vm.showBusyText = false;                                
                                if(onsite){
                                    $scope.plan=[];
                                    $scope.plan.id='onsite'
                                    vm.createTenant($scope.plan,event);
                                }
                                else{
                                    vm.enableNextStep();
                                }
                                
                            }                           
                    }
                    else
                    {
                        $mdDialog.hide();
                        if(onsite){
                            $scope.plan=[];
                            $scope.plan.id='onsite'
                            $scope.getTenantToken($scope.plan,null); 
                        }
                        else{
                            displayError("This tenant name is already registered...");
                        }
                        
                    }
                    
                    //displayError("This tenant name is already registered...");
                }).error(function (error) {
                    $mdDialog.hide();
                    displayError(error.Message);
                });
                
                            //#for testing-------
                            /*
                            var companyDetail="";
                            if(tenant!=null || tenant!="" || tenant!=undefined){
                                companyDetail=tenant;
                            }
                            $rootScope.companyDetail=companyDetail;
                            
                            var deferred = $q.defer();
                            vm.showBusyText = true;
                            console.log('On before submit');
                            if (!tenant.completed && !isSkip) {
                                //simulate $http
                                $timeout(function () {
                                    vm.showBusyText = false;
                                    console.log('On submit success');
                                    deferred.resolve({ status: 200, statusText: 'success', data: {} });
                                    //move to next step when success
                                    tenant.completed = true;
                                    vm.enableNextStep();
                                }, 1000)
                            } else {
                                vm.showBusyText = false;
                                vm.enableNextStep();
                            }
                            */
                            //---------------------
            }
            
            $mdDialog.hide();
        
    }

    //#Get selected plan object#//
    vm.iscontinue=false;
    vm.selectPlan = function selectPlan(ev,plan,index) {
        if(plan=="" || plan==undefined){
            vm.iscontinue=false;
        }
        else{
             vm.plan = plan;
             vm.iscontinue=true;
             for (var i = 0, len = vm.companyPricePlans.length; i < len; i++) {
                vm.companyPricePlans[i].isSelected = false;
            }
             vm.companyPricePlans[index].isSelected = true;
        }
    };
    

    //#load card detail window from stripe*/
    vm.loadCardDetail = function loadCardDetail(ev) {
        if(vm.plan=="" || vm.plan==undefined){
            return;
        }
        else{
            vm.createTenant (vm.plan,ev);
        }
    }
    
    
    
    
    //#create tenant#//
    vm.createTenant = function createTenant(plan,ev) {
                    
        displayProgress('Creating tenant...');

        /*Tenant creation process*/  
        var userInfo ="";
        var userInfo = JSON.parse(decodeURIComponent($cookies.get('authData')));
        
        var email=userInfo.Email;
        var TenantID = email.replace('@', "");
            TenantID = TenantID.replace('.', "");
            TenantID = TenantID.replace('.', "");

            //TenantID ="testa5"; //*only for testing.. remove after testing         
            //tenant.name, tenant.company,tenant.type,tenant.accessLevel,tenant.businessModel
            var companyDetail= $rootScope.companyDetail;
            
        $scope.tenantDtl = {
            "TenantID": companyDetail.name,
            "TenantType":"Company", //companyDetail.type,
            "Name": companyDetail.name,
            "Shell": "",
            "Statistic": {
                "CompanyName": companyDetail.name,
                "CompanyAddress": companyDetail.address,
                "Plan": plan.id
            },
            "Private": true,
            "OtherData": {
                "CompanyName": companyDetail.name,
                "SampleAttributs": "Values",
                "catagory": companyDetail.businessModel
            }
        };
 
        console.log($scope.tenantDtl);      
        
        $http({
            method: 'POST',
            url: apis_Path+'usertenant/tenant/',
            data: angular.toJson($scope.tenantDtl),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .success(function (response) {
            //var res=decodeURIComponent(response);
            if (response.Success == true) {
                $rootScope.createdTenantID=response.Data.TenantID;
                $scope.getTenantToken(plan,ev); 
            }
            else {  
                $mdDialog.hide();
                console.log(response.Message);
                $scope.getTenantToken(plan,ev);
                //displayError(response.Message);
            }
        })
        .error(function (error) {
            $mdDialog.hide();
            displayError(error);
        }); 
    }

    
    /*proceed with payement*/
    vm.proceedPayment = function proceedPayment(token,plan) {
        displayProgress('Proceed with payment...');

        var sampleObj = {
            "token":token.id,
            "plan" : {
                "attributes":  [
                    {"tag":"Package","feature": plan.id,"amount": plan.price,"quantity":1,"action":"add"}
                ],
                "subscription": "month",
                "quantity": 1 
            }
        }
        
        /*var sampleObj = {
            "token":token.id,
            "plan" : {
                "attributes":  [
                    {"tag":"Package","feature": "Gold Package","amount": 20,"quantity":0,"action":"add"},
                    {"tag":"user","feature": "Additional +1 user","amount": 10, "quantity":5,"action":"add"}
                ],
                "subscription": "month",
                "quantity": 1 
            }
        }*/
        
        $http({
            url : "/include/duoapi/paymentgateway/puchasePackage",
            //url : "http://staging.digin.io/include/duoapi/paymentgateway/puchasePackage",
            method : "POST",
            headers: {
                'Content-Type': 'application/json',
                'securityToken': $scope.TenantSecToken
            },
            data : sampleObj
        }).then(function(response){
                console.log()
                    if(response.statusText=="OK"){
                        if(response.data.status==true){
                            vm.addPackage(plan, $scope.TenantSecToken);
                            $rootScope.btnMessage="Congratulations...!";
                            $rootScope.btnMessage2="Tenant creation completed successfully.";
                            localStorage.setItem('firstLogin',true);
                            $rootScope.btnContinue="Go to Home";
                            $mdDialog.hide();
                            vm.enableNextStep();
                        }
                        else{
                            displayError(response.data.result);
                            $scope.plan=[]
                            $scope.plan.package_id="1005";
                            $scope.plan.name="Free";
                            displayError("Direct to free package.");
                            vm.addPackage($scope.plan, $scope.TenantSecToken);     

                        }    
                    }
                    else
                    {
                        displayError("Error occured while completing payment procees...");
                        $scope.plan=[]
                            $scope.plan.package_id="1005";
                            $scope.plan.name="Free";
                        displayError("Direct to free package.");
                        vm.addPackage($scope.plan, $scope.TenantSecToken);  
                    }
                $mdDialog.hide();
        },function(response){
            console.log(response)
            $mdDialog.hide();
            displayError("Error occured while completing payment procees...");
            $scope.plan=[]
                            $scope.plan.package_id="1005";
                            $scope.plan.name="Free";
            displayError("Direct to free package.");
            vm.addPackage($scope.plan, $scope.TenantSecToken);  
        })
    }

    //#common pre loader
    var displayProgress = function (message) {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>'+message+'</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>'
            , parent: angular.element(document.body)
            , clickOutsideToClose: false
        });
    };

    //#common error message
    var displayError = function (message) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Process fail !').textContent('' + message + '').ariaLabel('Fail to complete.').ok('OK'));
    };
    
    //#goto Welcome page
    vm.continueBtn = function continueBtn() {
        if($rootScope.btnContinue=="Go to Home"){
            localStorage.setItem('tenantCreated', true);
            window.location = "http://" +$rootScope.createdTenantID;
        }
        else{
            window.location = "http://www.digin.io";
        }
    }
    


});





///------------------
/*
routerApp.service('loginSvc',['$http','notifications','$rootScope','Digin_Domain','Digin_Engine_API', function($http,notifications,$rootScope,Digin_Domain,Digin_Engine_API){

     this.login = function () {
                $http({
                    method: 'POST',
                    url: 'http://'+Digin_Domain+'/apis/authorization/userauthorization/login',
                    headers: {'Content-Type': 'application/json'},
                    data: $scope.signindetails
                }).success(function (data) {
                    if (data.Success === true) {

                        var token=data.Data.SecurityToken;

                        //#create Dataset
                        $http.get(Digin_Engine_API + 'get_user_settings?SecurityToken=' + token + '&Domain=' + Digin_Domain)
                        .success(function (result) {
                            if(result.Is_Success==true){
                                if(result.Custom_Message=="No user settings saved for given user and domain")
                                {
                                        //console.og(result.Result);
                                        localStorage.setItem('initialLogin',true);
                                        this.createDataSet(token);
                                }
                                else
                                {
                                    localStorage.setItem('initialLogin',false);   
                                }

                                $window.location.href = "/s.php?securityToken=" + data.Data.SecurityToken;   
                            }
                        })
                        .error(function (error) {
                            console.log(error);
                        });

                    }
                    else {
                        
                    }
                }).error(function (data) {

                });
            };

            this.createDataSet = function (secToken) {
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
                        console.log(response.Message);
                    }
                    else {  
                        //displayError('Data set creation fail');
                        console.log(response.Message);
                    }

                })
                .error(function (error) {
                    //displayError('Data set creation fail');
                    console.log(error);
                });
            };    

}]);

*/