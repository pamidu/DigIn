p_boarding_module.controller('addCardCtrl', function ($scope, $rootScope, $mdDialog, account, cardObject, $charge, $mdToast) {
    $scope.card = {}; // form object
    $scope.newCard = true; //  this can either be adding new card or editing an exisiting card
    $scope.disableaddBtn = false;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var startYear = yyyy;
    $scope.years = [];
    for (i = 0, len = 30; i < len; ++i) {
        $scope.years.push(yyyy.toString());
        yyyy = yyyy + 1;
    }
    var monthName = "";
    $scope.months = [];
    $scope.yearChanged = function (selectedYear) {
        $scope.months = [];
        if (parseInt(selectedYear) == startYear) {
            for (i = 1, len = 13; i < len; ++i) {
                monthName = i;
                if (monthName >= mm) {
                    if (monthName.toString().length == 1) {
                        monthName = "0" + i;
                    }
                    $scope.months.push(monthName.toString());
                }
            }
        }
        else {
            for (i = 1, len = 13; i < len; ++i) {
                monthName = i;
                if (monthName.toString().length == 1) {
                    monthName = "0" + i;
                }
                $scope.months.push(monthName);
            }
        }
    }
    if (cardObject) // if it is an exisiting card
    {
        $scope.yearChanged(cardObject.ExpiryYear);
        $scope.card = cardObject;
        $scope.newCard = false;
    }
    $scope.card.CardType = "";
    $scope.cardTypes = [{
            type: "Visa"
            , validPatterns: ['41', '42', '43', '44', '45', '46', '47', '48', '49']
            , imageUrl: "images/visa_s.png"
            , regExPattern: /^4[0-9]{12}(?:[0-9]{3})?$/
        }
        , {
            type: "Master Card"
            , validPatterns: ['51', '52', '53', '54', '55']
            , imageUrl: "images/master_s.png"
            , regExPattern: /^5[1-5][0-9]{14}$/
        }
        , {
            type: "American Express"
            , validPatterns: ['37', '34']
            , imageUrl: "images/amex_s.png"
            , regExPattern: /^3[47][0-9]{13}$/
        }
						];
    $rootScope.$watch('cardTypeRoot', function () {
        $scope.card.CardType = $rootScope.cardTypeRoot;
    })
    $scope.cancel = function () {
        $mdDialog.cancel();
    }
    
    $scope.submit = function () {
        var validExpiry = false;
        var validCardNo = false;
        var validCVS = false;
        //var validPhoneNumber = false;
        if ($scope.card.ExpiryYear == null || $scope.card.ExpiryMonth == null) {
            toast("Please select the expiry date");
        }
        else {
            validExpiry = true;
        }
        try {
            if ($scope.card.CardType.regExPattern.test($scope.card.CardNo) == false) {
                toast("You card no. is invalid"); //card type chosen but still invalid
            }
            else {
                validCardNo = true;
            }
        }
        catch (exception) {
            toast("You card no. is invalid"); //card type doesn't even exist
        }
        if (!$scope.card.CSV) {
            toast("Invalid CVV Number");
        }
        else {
            //
            if ($scope.card.CardType.type === "Visa" || $scope.card.CardType.type === "Master Card") {
                if ($scope.card.CSV.length === 3) {
                    validCVS = true;
                }
                else {
                    toast("CVV Number for " + $scope.card.CardType.type + " cards should contain 3 digits");
                }
            }
            else if ($scope.card.CardType.type === "American Express") {
                if ($scope.card.CSV.length === 4) {
                    validCVS = true;
                }
                else {
                    toast("CVV Number for American Express cards should contain 4 digits");
                }
            }
        }
        /*if(!$scope.account.PhoneNumber)
        {
        	notifications.toast("Enter a valid phone number with 9 digits", "error", 4000);
        }else{
        	validPhoneNumber = true;
        }*/
        if (validCardNo === true && validExpiry === true && validCVS === true) {
            $scope.disableaddBtn = true;
            $rootScope.showGlobalProgress = true;
            var addCardObj = angular.copy($scope.card);
            addCardObj.CardType = addCardObj.CardType.type;
            // if (account == null) {
            account = {};
            account.DeliveyAddress = "DeliveyAddress"; //userObject.DeliveyAddress,
            account.BillingAddress = "BillingAddress"; //userObject.BillingAddress,
            account.PhoneNumber = "777777777"; //userObject.PhoneNumber,
            account.AccountBalance = 0;
            account.AccountCards = []
                //}
            var replaceThis = "";
            for (i = 0, len = account.AccountCards.length; i < len; ++i) {
                if (account.AccountCards[i].guid == addCardObj.guid) {
                    replaceThis = i;
                }
                else { //console.log(i,'new card');
                }
            }
            if (replaceThis || replaceThis === 0) {
                account.AccountCards.splice(replaceThis, 1);
                console.log(replaceThis, 'replace this card');
            }
            if (addCardObj.CardType == "Master" || addCardObj.CardType == "Master Card") {
                addCardObj.cardImage = "images/master_s.png";
            }
            else if (addCardObj.CardType == "Visa") {
                addCardObj.cardImage = "images/visa_s.png";
            }
            else if (addCardObj.CardType == "Amex" || addCardObj.CardType == "American Express") {
                addCardObj.cardImage = "images/amex_s.png";
            }
            account.AccountCards.push(addCardObj);
            console.log(account);
            var addedOrEdited = "Added";
            if ($scope.newCard === false) {
                addedOrEdited = "Edited";
            }
            $mdDialog.hide(addCardObj);
            //			$charge.payment().newCard(account).success(function(data) {
            //                $scope.disableaddBtn = false;
            //                $rootScope.showGlobalProgress = false;
            //                toast("Card Successfully "+addedOrEdited, "success");
            //                $mdDialog.hide(data);
            //            }).error(function(data) {
            //                $scope.disableaddBtn = false;
            //                $rootScope.showGlobalProgress = false;
            //                console.log(data);
            //                toast("Error, Failed to add card");
            //            })
        }
    }

    function toast(a) {
        $mdToast.show($mdToast.simple().textContent(a).position('bottom right').hideDelay(3000));
    };
})