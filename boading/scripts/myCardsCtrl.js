p_boarding_module.controller('myCardsCtrl', function ($scope, $rootScope, $mdDialog, $charge, account, package,$mdToast) {
    
    $scope.disablePayBtn = false;

    $scope.account = account; // get users account which contains the cards
    $scope.appDetails = package;

    for (i = 0, len = $scope.account.AccountCards.length; i<len; ++i){
		//console.log($scope.cards.AccountCards[i]);
		if($scope.account.AccountCards[i].CardType == "Master" || $scope.account.AccountCards[i].CardType == "Master Card")
		{
			$scope.account.AccountCards[i].cardImage = "img/master_s.png";
		}else if($scope.account.AccountCards[i].CardType == "Visa")
		{
			$scope.account.AccountCards[i].cardImage = "img/visa_s.png";
		}else if($scope.account.AccountCards[i].CardType == "Amex" || $scope.account.AccountCards[i].CardType == "American Express")
		{
			$scope.account.AccountCards[i].cardImage = "img/amex_s.png";
		}
	}

    $scope.cancel = function()
	{
	    $mdDialog.hide();
	}
	
	$scope.newCard = function(ev) {
        $mdDialog.hide({purchase: false, event:ev, account: account, package: package});    
     }
    
	$scope.selectCard = function(index, account)
    {
		$scope.selectedAccount = account;

		angular.element('.cards').css('background', 'transparent');
		angular.element('#card'+index).css('background', '#bccdb8'); //highlight the selected card
			
    }
    
    $scope.editCard = function(ev, card)
	{
		$mdDialog.show({
			controller: 'addCardCtrl',
			templateUrl: 'partials/newCard.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:false,
			locals: {cardObject: card, account: $scope.account}
		})
		.then(function(answer) {
              if(answer) //show my cards if user edit the card only
              {
                $mdDialog.show({
    				controller: "myCardsCtrl",
    				templateUrl: 'partials/myCards.html',
    				parent: angular.element(document.body),
    				targetEvent: ev,
    				clickOutsideToClose:true,
    				locals: {account: answer, package: $rootScope.package}
    		    });
              }
        });
		
	}
	
	$scope.showAgreement = function(ev)
    {
	    $mdDialog.show({
          controller: 'agreementCtrl',
          templateUrl: 'partials/agreement.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(answer) { //show myCards after user closes agreement
              $mdDialog.show({
				controller: "myCardsCtrl",
				templateUrl: 'partials/myCards.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				locals: {account: account, package: package}
			});
        });
    }
     
     $scope.submit = function()
     {
         if($scope.agree === true && $scope.selectedAccount)
         {
            $scope.disablePayBtn = true;
		    $rootScope.showGlobalProgress = true;
             
             var paystrip = {
                "AccountId": account.AccountId,
                "Cards": $scope.selectedAccount,
                "Items": [{
    				"ItemRefID": package.id,
    				"ItemType": "Tenant",
    				"Description": package.description,
    				"UnitPrice": parseFloat(package.price),
    				"UOM": "Unit",
    				"Qty": 1,
    				"Subtotal": parseFloat(package.price),
    				"Discount": 0,
    				"Tax": 0,
    				"TotalPrice": parseFloat(package.price),
    				"TaxDetails": ""
    			}]
              }
              console.log(paystrip);
              
                
              $charge.payment().pay(paystrip).success(function(data) {  //make payment
                    console.log(data);
                    if(data.Error === true)
                    {
                        toast("Payment Error "+ data.Message);
                    }else{
                        $mdDialog.hide({purchase: true}); // close dialog and create tenant
                    }
                    $scope.disablePayBtn = false;
		            $rootScope.showGlobalProgress = false;

                }).error(function(data) {
                    $scope.disablePayBtn = false;
		            $rootScope.showGlobalProgress = false;
                    toast("Payment Error, There was an error in payment");
                });
        }else
        {
            toast("Plese select a card and agree to the terms");
        }

    }
    
    function toast (a) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(a)
        .position('bottom right')
        .hideDelay(3000)
    );
  };
});

p_boarding_module.controller('agreementCtrl', function($mdDialog, $scope){
    $scope.closeAgreement = function()
    {
        $mdDialog.hide();
    }
    
});
