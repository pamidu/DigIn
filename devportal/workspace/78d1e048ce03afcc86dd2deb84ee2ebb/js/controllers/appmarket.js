
 var marketApp = angular.module('mainApp', ['ngMaterial','directivelibrary','uiMicrokernel', 'ui.router','angular.filter','ngAnimate'])
	
	marketApp.config(function($stateProvider, $urlRouterProvider) {
    
		$urlRouterProvider.otherwise('/market_apps');
    
		$stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
       
         .state('apps', {
            url: '/market_apps',
            templateUrl: 'partials/market_apps.html',
			controller: 'ListCtrl'
        })
		
		.state('app', {
            url: '/selected_app',
            templateUrl: 'partials/selected_app.html',
			controller: 'Download'
        })
		
	});
	
	marketApp.controller('ListCtrl', function ($scope,$rootScope,$rootElement) {
	
		//$rootElement.data("$$ngAnimateState").running = false;
        setTimeout(function(){
			  $('.bxslider').bxSlider({
				auto: true,
				speed:800
			  });
			  
			  	// animation stuff
		
		
		},100);
		
		
	});
	marketApp.controller('AppCtrl', function ($scope,$objectstore, $mdDialog, $rootElement, $auth, $helpers) {
			
		$scope.cbfree = "-1";
		$scope.cbpaid = "-1";
		
		// This is useful to make the marketplace show the download button or not depending if the user has logged on.
		$scope.authenticated = "";
		if ($helpers.getCookie("securityToken") !=null)
		{
			$auth.checkSession();
			$scope.authenticated = true;
		}else
		{
			$scope.authenticated = false;
		}
		
		
		
		//$rootElement.data("$$ngAnimateState").running = false;
		$scope.allApps;

		//Filtration codes
				 
		 $scope.showAllCategories = true;
		$scope.checkSelection = true;
		
		$scope.enableCategorySelection = function()
		{
			if($scope.checkSelection == true)
			{
				$scope.checkSelection = false;
				
			}else
			{
				$scope.checkSelection = true;
				$scope.categorySelection = null;
			}
		}
		 
		 
		 $scope.showAllapps = true;
		$scope.disablePriceSelection = true;
		
		$scope.enableRadioBtns = function()
		{
			if($scope.disablePriceSelection == true)
			{
				$scope.disablePriceSelection = false;
				
			}else
			{
				$scope.disablePriceSelection = true;
				$scope.paidOrFree = null;
			}
		}
		
		//This is the standard App Icon if the original App Icon fails to load
		$scope.imagePath = 'img/standard.png';
		
		//open selected application
		$scope.open = function (app) {
			console.log(app);
			
			location.href = '#/selected_app';
			$scope.showTemplates = true;
			$scope.appDetails = app;
			$scope.starRating1 = app.rating;
			
		}
		
		//Go back to main view
		$scope.goBack = function () {
			location.href = '#/market_apps';
			$scope.showTemplates = false;
		}
	//get all apps from DB
     var client = $objectstore.getClient("duoworld.duoweb.info","appStoreApps", true);
      
         client.onGetMany(function(data){
               if (data)
			   {
					$scope.allApps = data;
					//console.log($scope.allApps);
					for (i = 0, len = $scope.allApps.length; i<len; ++i){
			
						if(!$scope.allApps[i].iconUrl)
						{
							$scope.allApps[i].iconUrl = "img/standard.png";
						}
						
						if(isNaN($scope.allApps[i].price) == false)
						{
							$scope.allApps[i].Paid = "Paid";
						}else if($scope.allApps[i].price == "Free" || $scope.allApps[i].price == 0)
						{
							$scope.allApps[i].Paid = "Free";
						}
					}
					console.log($scope.allApps);
               }

         });
		 
		  client.onError(function(data){
             alert ("Error occured");
         });
            
         client.getByKeyword('*');
		 
		$scope.getCatLetter=function(catName){
			var catogeryLetter = "img/material alperbert/avatar_tile_"+catName.charAt(0).toLowerCase()+"_28.png";
			return catogeryLetter;
		 }         
       
		//Rating stuff
	
		$scope.hoverRating1 = $scope.hoverRating2 = $scope.hoverRating3 = 0;

		$scope.click1 = function (param,appDetails) {
			if($scope.authenticated == true)
			{
				console.log(param);	
				if(!appDetails.voteCount)
				{
					appDetails.voteCount = "0";//if there is no no vote count
				}
				
				appDetails.voteCount = parseFloat(appDetails.voteCount) + 1;
				
				appDetails.rating = (parseFloat(appDetails.rating) + param);

				//console.log(appDetails.rating);
				
				var client = $objectstore.getClient("duoworld.duoweb.info","appStoreApps", true);
				var sinOrPur;
				if(parseInt(param) == 1)
				{
					sinOrPur = "star";
				}else
				{
					sinOrPur = "stars";
				}

					client.onComplete(function(data){ 
						$mdDialog.show(
						  $mdDialog.alert()
							.parent(angular.element(document.body))
							.title('Thank you!')
							.content('You have rated '+ param + ' '+ sinOrPur +' for this application')
							.ariaLabel('Alert Dialog Demo')
							.ok('OK')
							.targetEvent(param)
						);
					});

					client.onError(function(data){
						$mdDialog.show(
						  $mdDialog.alert()
							.parent(angular.element(document.body))
							.title('Error!')
							.content('OK, this is embarrassing. We were unable to cast your vote.')
							.ariaLabel('Alert Dialog Demo')
							.ok('OK')
							.targetEvent(param)
						);
					});

			client.insert([appDetails], {KeyProperty:"id"});
				
			}else
			{
				$mdDialog.show(
				  $mdDialog.alert()
					.parent(angular.element(document.body))
					.title('Error!')
					.content('Please login and to rate this application.')
					.ariaLabel('Alert Dialog Demo')
					.ok('OK')
					.targetEvent(param)
				);
			}	
		};
		/*
		$scope.mouseHover1 = function (param) {
			console.log('mouseHover(' + param + ')');
			$scope.hoverRating1 = param;
		};

		$scope.mouseLeave1 = function (param) {
			console.log('mouseLeave(' + param + ')');
			$scope.hoverRating1 = param + '*';
		};
		*/
		
	
   });

	//Download Selected App (App ID)
	marketApp.controller('Download',['$scope','$http', '$helpers', '$mdDialog','$request','$objectstore',function ($scope,$http, $helpers, $mdDialog, $request,$objectstore) {
		$scope.buttonText = "";
		var price = "";

		$scope.initialize = function(app)
		{

			price = parseFloat(app.price);
			
			if(!price == 0)
			{
				$scope.buttonText = "$"+ price +" Buy";
			}else
			{
				$scope.buttonText = "Install";
			}
			
			$objectstore.getClient("application").onGetOne(function(data){
				console.log(data);

				 if (data.ApplicationID){
					$scope.buttonText = "Uninstall";
				 }

			}).onError(function(){
			 //not available
			}).getByKey(app.id)
		}
		
		 var showaddcardPopup = function(app,ev) {
			$mdDialog.show({
				controller: "addCardController",
				templateUrl: 'partials/dialog2.tmpl.php',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				locals: {appObject: app}
			});
		}
		
		var showMyAccountcardPopup = function(app,ev) {
			$mdDialog.show({
				controller: "showMyAccountController",
				templateUrl: 'partials/myaccounts.php',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				locals: {appObject: app}
			});
		}		
		
		$scope.download=function (app,ev) {

			if(!price == 0)
			{
				//Open iframe here to make payment for application and download it if successful 

				getAllCards(function(data) {
					accounts = data;
					if(accounts.length === 0){
						showaddcardPopup(app,ev);
					}else{
						showMyAccountcardPopup(app,ev);
					}
                })
				 
			}else
			{

			   $http({
				method:'GET',
				url:'/../../../payapi/install.php?appCode='+app.id
			  }).success(function(data){
					console.log(data);
				
					var confirm = $mdDialog.confirm()
						  .title('Install')
						  .content('You have successfully installed the '+ app.name +'!')
						  .targetEvent(ev)
						  .ok('Ok')
					$mdDialog.show(confirm).then(function() {
					  location.href = '#/market_apps';
					});
			  }).error(function(data){
				console.log('error')
			  })
			  
			}//Free app installation
		}
		
		$scope.uninstall = function(app,ev)
		{
				$objectstore.getClient("application").onComplete(function(){
					var confirm = $mdDialog.confirm()
						  .title('Uninstall')
						  .content('You have successfully uninstalled the '+ app.name +'!')
						  .targetEvent(ev)
						  .ok('Ok')
					$mdDialog.show(confirm).then(function() {
					  location.href = '#/market_apps';
					});
				}).onError(function(){
					console.log("error uninstalling");
				}).delete(app, {"KeyProperty":"id"})
		}
		
		 var getAllCards = function(func) 
		 {
			var rel = "/account/get";
			var results = null;
			$request.get(rel, function(data) {
				func(data);
			});
		 }
	  }]);
	  
	  
	 
	  marketApp.controller('addCardController',['$scope', '$mdDialog','$request','appObject',function ($scope, $mdDialog,$request, appObject) {
          
                $scope.account = {};
          
                var loadCards = function() {
                    $request.get("/account/get", function(accArray){
                        if(accArray.length != 0) {
                            $scope.account = accArray[0];
                        }else{
                            $scope.account.AccountCards = [];
                        }
                    });
                }
                
                loadCards();
				
				 $scope.payinfoSubmit =function(card) {
                     if($scope.account.AccountCards.length === 0){
                         addAccount(card);
                     }else {
                        addCard(card);
                     }
				 }
				 
				 var addCard = function(payment) {
                     console.log(payment);
					$scope.account.AccountCards.push({
						"CardNo" : payment.CardNo,
						"Name": payment.Name,
						"CardType": "Master",
						"DeliveyAddress": payment.DeliveyAddress,
						"BillingAddress": payment.BillingAddress,
						"CSV": payment.CSV,
						"ExpiryYear": payment.ExpiryYear,
						"ExpiryMonth": payment.ExpiryMonth,
						"Active":true,
						"verified":true
						
					});
                     
                    storeDetails();
				 }
				 
				 var addAccount = function(payment) {
					$scope.account.DeliveyAddress = payment.DeliveyAddress;
					$scope.account.BillingAddress = payment.BillingAddress;
					$scope.account.PhoneNumber = "0771234568";
					$scope.account.AccountCards.push({
						"CardNo" : payment.CardNo,
						"Name": payment.Name,
						"CardType": "Master",
						"DeliveyAddress": payment.DeliveyAddress,
						"BillingAddress": payment.BillingAddress,
						"CSV": payment.CSV,
						"ExpiryYear": payment.ExpiryYear,
						"ExpiryMonth": payment.ExpiryMonth,
						"Active":true,
						"verified":true
						
					})
                    
                    storeDetails();
				 }
                 
                 var storeDetails = function(obj) {
                    $request.post("/account/false", $scope.account, function(data) {
						$mdDialog.show({
							controller: "showMyAccountController",
							templateUrl: 'partials/myaccounts.php',
							parent: angular.element(document.body),
                            locals: {appObject: appObject}
						})
						.then(function(answer) {
							//$scope.status = 'You said the information was "' + answer + '".';
						}, function() {
							//$scope.status = 'You cancelled the dialog.';
						});
                    })
                 }
				 
				 
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };
            }]);
			
			
			marketApp.controller('showMyAccountController',['$scope', '$mdDialog','$request', 'appObject',function ($scope, $mdDialog, $request, appObject) {
                
				$scope.accounts = [];
				$scope.selectedAccount = "";
				$scope.disablePayment = true;
				$scope.selectedCard = null;
				
				$scope.change = function()
				{
					if($scope.disablePayment == true)
					{
						$scope.disablePayment = false;
					}else
					{
						$scope.disablePayment = true;
					}
				}
				
              $request.get("/account/get",function(data)
			  {
					console.log(data);
					$scope.accounts = data;
			  })
			  
			  $scope.selectAccount = function(index, account)
			  {
						$scope.selectedAccount = account;
						$scope.selectedCard = index;
						console.log($scope.selectedAccount);
						
			  }
			  			  
			  $scope.makePayment = function(card,account) {

                  var paystrip = {
                    "AccountId": account[0].AccountId,
                    "Cards": card,
                    "Items": [{
						"ItemRefID": appObject.id,
						"ItemType": "App",
						"Description": appObject.description,
						"UnitPrice": parseFloat(appObject.price),
						"UOM": "Unit",
						"Qty": 1,
						"Subtotal": parseFloat(appObject.price),
						"Discount": 0,
						"Tax": 0,
						"TotalPrice": parseFloat(appObject.price),
						"TaxDetails": ""
					}]
                  }
//                     
                    $request.post("/transaction/paystrip/", paystrip, function(result) {
                        console.log(result);
						/*if(result.hasOwnProperty("error"))
						{
							
						}*/
						
						$mdDialog.show({
							controller: "sucesspageController",
							templateUrl: 'partials/sucesspage.php',
							parent: angular.element(document.body),
							clickOutsideToClose:true,
							locals: {successObject: result}
							
						})
				
						
                    })

              }

                $scope.payinfoSubmit = function()
                {
                    $scope.makePayment($scope.selectedAccount,$scope.accounts);
					$scope.disablePayment = true;
                }
				
                $scope.showaddcardPopup = function(app,ev)
                {
                    $mdDialog.show({
                        controller: "addCardController",
                        templateUrl: 'partials/dialog2.tmpl.php',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true,
                        locals: {appObject: app}
                    });

                }
                
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };
            }]);
			
			
		marketApp.controller('sucesspageController',['$scope','$mdDialog','successObject',function ($scope,$mdDialog,successObject) {
			$scope.status = "";
			$scope.Message = "";
			
			if(successObject.hasOwnProperty("Error"))
			{
				$scope.status = "Error";
				$scope.Message = successObject.Message;
			}else
			{
				$scope.result = successObject;
	
				successObject.TranDate = successObject.TranDate.slice(0, 10);
				successObject.Total = successObject.Total * -1;
						
					
				$scope.status = "Success";
			}
						
			
			$scope.ok = function() {
				$mdDialog.cancel();
				location.href = '#/market_apps';
            };

		}]);
			
			
	  marketApp.filter('ceil', function() {
		  return function(input) {
			var input = input || 0;
			return Math.ceil(input);
		  };
		});
		
		//Hide the Account Numbers in show all Accounts
		 marketApp.filter('hideNumbers', function() {
		  return function(input) {
			return input.replace(/.(?=.{4})/g, 'x');
		  };
		});
		
		
		marketApp.factory("$request", function($http) {
                
                function getHost() {
                    return "http://" + window.location.hostname + "/payapi";
                }
                
                function postRequest(rel, obj, func) {
                    var url = getHost() + rel;
                    $http.post(url, obj).success(function(data, status) {
                        func(data);
                    }).error(function(data, status) {
                        console.log(data);
                    });
                    
                }
                
                function getRequest(rel, func) {
                    var url = getHost() + rel;
                    $http.get(url).success(function(data, status) {
                        func(data);
                    }).error(function(data, status) {
                        console.log(data);
                    });
                }
                
                return {
                    get : getRequest,
                    post : postRequest
                }
            })