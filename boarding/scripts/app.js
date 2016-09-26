var app = angular.module('app', ['ngMaterial', 'ngMessages', 'md-steppers','stripe-payment-tools','ngCookies']);

app.controller('MainCtrl', function ($scope, $rootScope, $q, $timeout, paymentGateway,$mdDialog,$cookies,$http) {

    var vm = this;

	vm.price=100;

    vm.companyPricePlans = [
        {
            id : "Free",
            name:"Free",
            numberOfUsers:"1",
            storage: "10 GB",
            bandwidth: "100 GB",
            perMonth: "Free",
            perYear: "$10",
            per: "/ User",
            Description: "desc"
        },
        {
            id : "personal_space",
            name:"Personal Space",
            numberOfUsers:"1",
            storage: "10 GB",
            bandwidth: "100 GB",
            perMonth: "$10",
            perYear: "$10",
            per: "/ User",
            Description: "desc"
        },
        {
            id : "mini_team",
            name:"We Are A Mini Team",
            numberOfUsers:"5",
            storage: "10 GB",
            bandwidth: "100 GB",
            perMonth: "$8",
            perYear: "$6.99 ",
            per: "/ User",
            Description: "desc"
        },
        {
            id : "world",
            name:"We Are the World",
            numberOfUsers:"10",
            storage: "10 GB",
            bandwidth: "100 GB",
            perMonth: "$6",
            perYear: "$4.99",
            per: "/ User",
            Description: "desc"
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

    vm.submitCurrentStep = function submitCurrentStep(tenant, isSkip) { 
        if(tenant=='Cancel'){
            $rootScope.createdTenantID="";
            $rootScope.btnMessage="Thank you...!";
            $rootScope.btnContinue="Exit";
        }
        else{
            var companyDetail="";
            if(tenant!=null || tenant!="" || tenant!=undefined){
                companyDetail=tenant;
            }
            $rootScope.companyDetail=companyDetail;
        }
        
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
    }

    //*load card detail window from stripe*/
    vm.loadCardDetail = function loadCardDetail(ev, plan) {
					
		displayProgress('Processing...!');

		/*Tenant creation process*/	 
        var userInfo ="";
        var userInfo = JSON.parse(decodeURIComponent($cookies.get('authData')));
        var email=userInfo.Email;
        var TenantID = email.replace('@', "");
            TenantID = TenantID.replace('.', "");
            TenantID = TenantID.replace('.', "");

            TenantID ="testa5"; //*only for testing.. remove after testing         
            //tenant.name, tenant.company,tenant.type,tenant.accessLevel,tenant.businessModel
            var companyDetail= $rootScope.companyDetail;
            
        $scope.tenantDtl = {
            "TenantID": TenantID,
            "TenantType":"Company", //companyDetail.type,
            "Name": companyDetail.name,
            "Shell": "",
            "Statistic": {
                "CompanyName": companyDetail.company,
                "Plan": plan.id
            },
            "Private": true,
            "OtherData": {
                "CompanyName": companyDetail.company,
                "SampleAttributs": "Values",
                "catagory": ""
            }
        };
 
        console.log($scope.tenantDtl);      
        
        $http({
            method: 'POST',
            url: '/apis/usertenant/tenant/',
            data: angular.toJson($scope.tenantDtl),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .success(function (response) {
            //var res=decodeURIComponent(response);
            if (response.Success == true) {
				$rootScope.createdTenantID=response.Data.TenantID;
				
				if(plan.id=="Free"){
					$rootScope.trial=true;
					$rootScope.btnMessage="Congratulations...! This trial version is valid only for 30 days.";
					$mdDialog.hide();
					localStorage.setItem('firstLogin',true);
					$rootScope.btnContinue="Continue";
					vm.enableNextStep();
				}
				else{
					//--------------------load stripe payement detail window
					var stripeConfig = {
						publishKey: 'pk_test_cFGvxmetyz9eV82nGBhdQ8dS',
						title: 'DigIn',
						description: "Beyond BI",
						logo: 'img/small-logo.png',
						label: 'New Card'
					};
                   
					var stripegateway = paymentGateway.setup('stripe').configure(stripeConfig);
					stripegateway.open(ev, function(token, args) {
						console.log(token);
						if(token!=null || token!="" || token!=undefined){
							vm.proceedPayment(token,plan);
						}
						else
						{
							displayError("Error while retriving token from stripe");
						}
					});	
					//------------------
				}
            }
            else {  
                $mdDialog.hide();
                console.log(response.Message);
            }
        })
        .error(function (error) {
            $mdDialog.hide();
			displayError(error);
        }); 
    }

	
    /*proceed with payement*/
    vm.proceedPayment = function proceedPayment(token,plan) {
        displayProgress('Processing...');

		var price=vm.price;
		
		var sampleObj = {
            "token":token.id,
            "plan" : {
                "attributes":  [
                    {"tag":"Package","feature": plan.id,"amount": price*100,"quantity":1,"action":"add"},
                    {"tag":"user","feature": "Additional +1 user","amount": 10, "quantity":5,"action":"add"}
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
            url : "/include/duoapi/paymentgateway/addPackage",
            method : "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data : sampleObj
        }).then(function(response){
            console.log(response)
                if(response.statusText=="OK"){
                    $rootScope.btnMessage="Congratulations...! Tenant creation completed successfully.";
					localStorage.setItem('firstLogin',true);
					$rootScope.btnContinue="Continue";
					$mdDialog.hide();
					vm.enableNextStep();  
                }
            $mdDialog.hide();
        },function(response){
            console.log(response)
            $mdDialog.hide();
			displayError("Error while completing payment procees...");
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
        if($rootScope.btnContinue=="Continue"){
            window.location = "http://" +$rootScope.createdTenantID;
        }
        else{
            window.location = "http://www.digin.io";
        }
    }
    
    
    
});



