DiginApp.controller('myAccountCtrl',[ '$scope','$rootScope', '$stateParams', '$mdDialog','UserServices', 'notifications','paymentGateway','$http','colorManager','onsite', function ($scope, $rootScope,$stateParams,$mdDialog,UserServices,notifications,paymentGateway,$http,colorManager,onsite){
	
	var vm = this;
	
	$scope.$parent.currentView = "Settings";
	colorManager.reinforceTheme();
	
	$scope.onsite = onsite;
	
	vm.selectedPage = $stateParams.pageNo;
	
	var userObject = {}; //if the user cancels editing replace $scope.user with this
	$scope.user = {};
	$scope.editModeOn = false;
	
	UserServices.getProfile(function(data) {
		userObject = angular.copy(data);
		$scope.user = data;
		$scope.Company = angular.copy($scope.$parent.myTenant.OtherData.CompanyName);
	})
	
	$scope.usageDetails = {};
	UserServices.getUsageSummary().then(function(data) {
		notifications.log(data, new Error());
		if(data.Is_Success == "True")
		{
			$scope.usageDetails = data.Result.usage[0][$rootScope.authObject.Domain][$rootScope.authObject.UserID];
			notifications.log($scope.usageDetails, new Error());
		}else{
			notifications.log("error", new Error());
		}
	})
	
	var monthlyData = {}; //This will hold the result from the service call
	var fromDate = "";
	var toDate = "";
	
	(function () {
		var d = new Date();
	
		var month = '' + (d.getMonth() + 1);
		var day = '' + d.getDate();
		var year = d.getFullYear();
		
		if (month.length < 2){month = '0' + month;}
		if (day.length < 2){day = '0' + day;}
		
		toDate = [year, month, day].join('-');
		
		fromDate = d.setDate(d.getDate() - 30);
		
		var monthe = '' + (d.getMonth() + 1);
		var daye = '' + d.getDate();
		var yeare = d.getFullYear();

		if (monthe.length < 2){ monthe = '0' + monthe; }
		if (daye.length < 2){ daye = '0' + daye; }

		fromDate = [yeare, monthe, daye].join('-');
	}());


	UserServices.getUsageDetails(fromDate, toDate).then(function(data) {
		monthlyData = data.Result[0][$rootScope.authObject.Domain][$rootScope.authObject.UserID];
		for (var detail in monthlyData) {
				chartXLabels.push(detail);
			if (monthlyData.hasOwnProperty(detail)) {
				chartSeries[0].data.push(monthlyData[detail].totalBytesBilled / 1024);
				chartSeries[1].data.push(monthlyData[detail].totalBytesProcessed / 1024);
				chartSeries[2].data.push(monthlyData[detail].download_bq / 1024);
			}
        }
		generateMonthlyUsageChart();
	})
	
	var chartXLabels = [];
    var chartSeries = [{
        "name": "totalBytesBilled",
        "data": []
    }, {
        "name": "totalBytesProcessed",
        "data": []
    }, {
        "name": "download_bq",
        "data": []
    }];
	
	function generateMonthlyUsageChart()
	{
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
					categories: chartXLabels
				},
				size: {
					width: 600,
					height: 412
				},
				series: chartSeries,
				title: {
					text: 'Monthly usage'
				},
				credits: {
					enabled: false
				},
					loading: false
		}
	}
  
	
	$scope.profile_pic = "images/settings/new_user.png";
	
	$scope.profile = (function () {
		return {
			clickEdit: function () {
				$scope.editModeOn = true;
			},
			changeUserProfile: function (ev){
				$scope.editModeOn = true;
				UserServices.updateProfile(ev,$scope.user).then(function(result) {
					if(result.IsSuccess == true)
					{
						$scope.editModeOn = false;
						notifications.toast(1, "Profile Updated");
						userObject = $scope.user;
					}else{
						notifications.toast(0, result.Message);
					}
				})
			},
			cancel: function (){
				$scope.user = angular.copy(userObject);
				$scope.editModeOn = false;
			},
			changePassword: function (ev) {
				$mdDialog.show({
				  controller: "changePasswordCtrl",
				  templateUrl: 'views/settings/myAccount/change-password.html',
				  parent: angular.element(document.body),
				  targetEvent: ev,
				  clickOutsideToClose:true
				})
				.then(function(answer) {
				})
			},
			uploadProfilePicture: function(ev)
			{
				$mdDialog.show({
				  controller: "uploadProfilePictureCtrl",
				  templateUrl: 'views/settings/myAccount/uploadProfilePicture.html',
				  parent: angular.element(document.body),
				  targetEvent: ev,
				  clickOutsideToClose:true
				})
				.then(function(answer) {
				})
			},
			closeSetting: function () {
				$state.go('home');
			}
		};
    })();
	
	/*setTimeout(function(){
		Highcharts.chart('container', {
			  title: {
				text: 'Bandwidth Usage'
			  },
			  chart: {
				type: "line"
				
				},

			  xAxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
				  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
				]
			  },

			  series: [{
				data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
			  }]
		});
	}, 1000);*/
	
	$scope.uploadCompanyLogo = function(ev)
	{
		$mdDialog.show({
		  controller: "uploadCompanyLogoCtrl",
		  templateUrl: 'views/settings/myAccount/uploadCompanyLogo.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:true
		})
		.then(function(answer) {
		})
	}
	

	
	vm.allCountries=[{code:"AF",name:"Afghanistan"},{code:"AL",name:"Albania"},{code:"DZ",name:"Algeria"},{code:"AS",name:"American Samoa"},{code:"AD",name:"Andorre"},{code:"AO",name:"Angola"},{code:"AI",name:"Anguilla"},{code:"AQ",name:"Antarctica"},{code:"AG",name:"Antigua and Barbuda"},{code:"AR",name:"Argentina"},{code:"AM",name:"Armenia"},{code:"AW",name:"Aruba"},{code:"AU",name:"Australia"},{code:"AT",name:"Austria"},{code:"AZ",name:"Azerbaijan"},{code:"BS",name:"Bahamas"},{code:"BH",name:"Bahrain"},{code:"BD",name:"Bangladesh"},{code:"BB",name:"Barbade"},{code:"BY",name:"Belarus"},{code:"BE",name:"Belgium"},{code:"BZ",name:"Belize"},{code:"BJ",name:"Benin"},{code:"BM",name:"Bermuda"},{code:"BT",name:"Bhutan"},{code:"BO",name:"Bolivia"},{code:"BQ",name:"Bonaire, Sint Eustatius and Saba"},{code:"BA",name:"Bosnia and Herzegovina"},{code:"BW",name:"Botswana"},{code:"BV",name:"Bouvet Island"},{code:"BR",name:"Brazil"},{code:"IO",name:"British Indian Ocean Territory"},{code:"VG",name:"British Virgin Islands"},{code:"BN",name:"Brunei"},{code:"BG",name:"Bulgaria"},{code:"BF",name:"Burkina Faso"},{code:"BI",name:"Burundi"},{code:"KH",name:"Cambodia"},{code:"CM",name:"Cameroon"},{code:"CA",name:"Canada"},{code:"CV",name:"Cape Verde"},{code:"KY",name:"Cayman Islands"},{code:"CF",name:"Central African Republic"},{code:"TD",name:"Chad"},{code:"CL",name:"Chile"},{code:"CN",name:"China"},{code:"CX",name:"Christmas Island"},{code:"CC",name:"Cocos (Keeling) Islands"},{code:"CO",name:"Colombia"},{code:"KM",name:"Comoros"},{code:"CG",name:"Congo"},{code:"CD",name:"Congo (Dem. Rep.)"},{code:"CK",name:"Cook Islands"},{code:"CR",name:"Costa Rica"},{code:"ME",name:"Crna Gora"},{code:"HR",name:"Croatia"},{code:"CU",name:"Cuba"},{code:"CW",name:"Curaçao"},{code:"CY",name:"Cyprus"},{code:"CZ",name:"Czech Republic"},{code:"CI",name:"Côte D'Ivoire"},{code:"DK",name:"Denmark"},{code:"DJ",name:"Djibouti"},{code:"DM",name:"Dominica"},{code:"DO",name:"Dominican Republic"},{code:"TL",name:"East Timor"},{code:"EC",name:"Ecuador"},{code:"EG",name:"Egypt"},{code:"SV",name:"El Salvador"},{code:"GQ",name:"Equatorial Guinea"},{code:"ER",name:"Eritrea"},{code:"EE",name:"Estonia"},{code:"ET",name:"Ethiopia"},{code:"FK",name:"Falkland Islands"},{code:"FO",name:"Faroe Islands"},{code:"FJ",name:"Fiji"},{code:"FI",name:"Finland"},{code:"FR",name:"France"},{code:"GF",name:"French Guiana"},{code:"PF",name:"French Polynesia"},{code:"TF",name:"French Southern Territories"},{code:"GA",name:"Gabon"},{code:"GM",name:"Gambia"},{code:"GE",name:"Georgia"},{code:"DE",name:"Germany"},{code:"GH",name:"Ghana"},{code:"GI",name:"Gibraltar"},{code:"GR",name:"Greece"},{code:"GL",name:"Greenland"},{code:"GD",name:"Grenada"},{code:"GP",name:"Guadeloupe"},{code:"GU",name:"Guam"},{code:"GT",name:"Guatemala"},{code:"GG",name:"Guernsey and Alderney"},{code:"GN",name:"Guinea"},{code:"GW",name:"Guinea-Bissau"},{code:"GY",name:"Guyana"},{code:"HT",name:"Haiti"},{code:"HM",name:"Heard and McDonald Islands"},{code:"HN",name:"Honduras"},{code:"HK",name:"Hong Kong"},{code:"HU",name:"Hungary"},{code:"IS",name:"Iceland"},{code:"IN",name:"India"},{code:"ID",name:"Indonesia"},{code:"IR",name:"Iran"},{code:"IQ",name:"Iraq"},{code:"IE",name:"Ireland"},{code:"IM",name:"Isle of Man"},{code:"IL",name:"Israel"},{code:"IT",name:"Italy"},{code:"JM",name:"Jamaica"},{code:"JP",name:"Japan"},{code:"JE",name:"Jersey"},{code:"JO",name:"Jordan"},{code:"KZ",name:"Kazakhstan"},{code:"KE",name:"Kenya"},{code:"KI",name:"Kiribati"},{code:"KP",name:"Korea (North)"},{code:"KR",name:"Korea (South)"},{code:"KW",name:"Kuwait"},{code:"KG",name:"Kyrgyzstan"},{code:"LA",name:"Laos"},{code:"LV",name:"Latvia"},{code:"LB",name:"Lebanon"},{code:"LS",name:"Lesotho"},{code:"LR",name:"Liberia"},{code:"LY",name:"Libya"},{code:"LI",name:"Liechtenstein"},{code:"LT",name:"Lithuania"},{code:"LU",name:"Luxembourg"},{code:"MO",name:"Macao"},{code:"MK",name:"Macedonia"},{code:"MG",name:"Madagascar"},{code:"MW",name:"Malawi"},{code:"MY",name:"Malaysia"},{code:"MV",name:"Maldives"},{code:"ML",name:"Mali"},{code:"MT",name:"Malta"},{code:"MH",name:"Marshall Islands"},{code:"MQ",name:"Martinique"},{code:"MR",name:"Mauritania"},{code:"MU",name:"Mauritius"},{code:"YT",name:"Mayotte"},{code:"MX",name:"Mexico"},{code:"FM",name:"Micronesia"},{code:"MD",name:"Moldova"},{code:"MC",name:"Monaco"},{code:"MN",name:"Mongolia"},{code:"MS",name:"Montserrat"},{code:"MA",name:"Morocco"},{code:"MZ",name:"Mozambique"},{code:"MM",name:"Myanmar"},{code:"NA",name:"Namibia"},{code:"NR",name:"Nauru"},{code:"NP",name:"Nepal"},{code:"NL",name:"Netherlands"},{code:"AN",name:"Netherlands Antilles"},{code:"NC",name:"New Caledonia"},{code:"NZ",name:"New Zealand"},{code:"NI",name:"Nicaragua"},{code:"NE",name:"Niger"},{code:"NG",name:"Nigeria"},{code:"NU",name:"Niue"},{code:"NF",name:"Norfolk Island"},{code:"MP",name:"Northern Mariana Islands"},{code:"NO",name:"Norway"},{code:"OM",name:"Oman"},{code:"PK",name:"Pakistan"},{code:"PW",name:"Palau"},{code:"PS",name:"Palestine"},{code:"PA",name:"Panama"},{code:"PG",name:"Papua New Guinea"},{code:"PY",name:"Paraguay"},{code:"PE",name:"Peru"},{code:"PH",name:"Philippines"},{code:"PN",name:"Pitcairn"},{code:"PL",name:"Poland"},{code:"PT",name:"Portugal"},{code:"PR",name:"Puerto Rico"},{code:"QA",name:"Qatar"},{code:"RO",name:"Romania"},{code:"RU",name:"Russia"},{code:"RW",name:"Rwanda"},{code:"RE",name:"Réunion"},{code:"BL",name:"Saint Barthélemy"},{code:"SH",name:"Saint Helena"},{code:"KN",name:"Saint Kitts and Nevis"},{code:"LC",name:"Saint Lucia"},{code:"MF",name:"Saint Martin"},{code:"PM",name:"Saint Pierre and Miquelon"},{code:"VC",name:"Saint Vincent and the Grenadines"},{code:"WS",name:"Samoa"},{code:"SM",name:"San Marino"},{code:"SA",name:"Saudi Arabia"},{code:"SN",name:"Senegal"},{code:"RS",name:"Serbia"},{code:"SC",name:"Seychelles"},{code:"SL",name:"Sierra Leone"},{code:"SG",name:"Singapore"},{code:"SX",name:"Sint Maarten"},{code:"SK",name:"Slovakia"},{code:"SI",name:"Slovenia"},{code:"SB",name:"Solomon Islands"},{code:"SO",name:"Somalia"},{code:"ZA",name:"South Africa"},{code:"GS",name:"South Georgia and the South Sandwich Islands"},{code:"SS",name:"South Sudan"},{code:"ES",name:"Spain"},{code:"LK",name:"Sri Lanka"},{code:"SD",name:"Sudan"},{code:"SR",name:"Suriname"},{code:"SJ",name:"Svalbard and Jan Mayen"},{code:"SZ",name:"Swaziland"},{code:"SE",name:"Sweden"},{code:"SE",name:"Sweden"},{code:"SL",name:"Sri Lanka"},{code:"SY",name:"Syria"},{code:"ST",name:"São Tomé and Príncipe"},{code:"TW",name:"Taiwan"},{code:"TJ",name:"Tajikistan"},{code:"TZ",name:"Tanzania"},{code:"TH",name:"Thailand"},{code:"TG",name:"Togo"},{code:"TK",name:"Tokelau"},{code:"TO",name:"Tonga"},{code:"TT",name:"Trinidad and Tobago"},{code:"TN",name:"Tunisia"},{code:"TR",name:"Turkey"},{code:"TM",name:"Turkmenistan"},{code:"TC",name:"Turks and Caicos Islands"},{code:"TV",name:"Tuvalu"},{code:"UG",name:"Uganda"},{code:"UA",name:"Ukraine"},{code:"AE",name:"United Arab Emirates"},{code:"GB",name:"United Kingdom"},{code:"UM",name:"United States Minor Outlying Islands"},{code:"US",name:"United States of America"},{code:"UY",name:"Uruguay"},{code:"UZ",name:"Uzbekistan"},{code:"VU",name:"Vanuatu"},{code:"VA",name:"Vatican City"},{code:"VE",name:"Venezuela"},{code:"VN",name:"Vietnam"},{code:"VI",name:"Virgin Islands of the United States"},{code:"WF",name:"Wallis and Futuna"},{code:"EH",name:"Western Sahara"},{code:"YE",name:"Yemen"},{code:"ZM",name:"Zambia"},{code:"ZW",name:"Zimbabwe"},{code:"AX",name:"Åland Islands"}];
	
	
	vm.warning = false;
	
	vm.companyPricePlans = [
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
	
	vm.paymentCards = [
		{
			last4: "8431",
			brand: "American Express",
			country: "US",
			exp_month: 5,
			exp_year: 2019,
			background : "#136e59",
			image: "amex_s.png",
			default: false
		},{
			last4: "8445",
			brand: "Visa",
			country: "US",
			exp_month: 6,
			exp_year: 2020,
			background : "#11141d",
			image: "visa_s.png",
			default: true
		},{
			last4: "3125",
			brand: "Master",
			country: "US",
			exp_month: 6,
			exp_year: 2025,
			background : "#0066a8",
			image: "master_s.png",
			default: false
		}
	];
	
	vm.makeDefault = function()
	{
		console.log("make Default");
	}
	
	vm.updatePackage = function(ev)
	{
		location.href = '#/addaLaCarte';
	}
	
	vm.addCard = function(ev)
	{
		alert("open add card window");
	}
	
	
	//#load stripe payement detail window
	vm.loadStripe=function(ev,plan){	
		var stripeConfig = {
			publishKey: 'pk_test_cFGvxmetyz9eV82nGBhdQ8dS',
			title: 'DigIn',
			description: "Beyond BI",
			logo: 'images/small-logo.png',
			label: 'New Card'
		};
	   
		var stripegateway = paymentGateway.setup('stripe').configure(stripeConfig);
		stripegateway.open(ev, function(token, args) {
			console.log(token);
			if(token!=null || token!="" || token!=undefined){
				vm.upgradePackage(token,plan);
			}
			else
			{
				displayError("Error while retriving token from stripe");
			}
	});
	}	

	
	
	//#Customize existing package
	vm.customizePackage=function(plan){	
		var pkgObj = {
            "plan" : {
				"features": [
					{"tag":"storage","feature": "25GB storage","quantity":0,"amount": 30,"action":"remove"},
					{"tag":"user","feature": "Additional users","amount": 15,"quantity":5,"action":"add"}
				]
			}
        }
				
        $http({
            url : "/include/duoapi/paymentgateway/customizePackage",
            method : "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data : pkgObj
        }).then(function(response){
			console.log(response)
            $mdDialog.hide();
        },function(response){
            console.log(response)
            $mdDialog.hide();
        })
		
	}
	
	
	//#Upgrade exisitng package into another package
	vm.upgradePackage=function(token,plan){	
		var pkgObj = {
            "token":token.id,
            "plan" : {
                "attributes":  [
                    {"tag":"Package","feature": "Gold Package","amount": 20,"quantity":0,"action":"add"},
                    {"tag":"user","feature": "Additional +1 user","amount": 10, "quantity":5,"action":"add"}
                ],
                "subscription": "month",
                "quantity": 1 
            }
        }
		
        $http({
            url : "/include/duoapi/paymentgateway/upgradePackage",
            method : "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data : pkgObj
        }).then(function(response){
			console.log(response)
            $mdDialog.hide();
        },function(response){
            console.log(response)
            $mdDialog.hide();
        })
		
	}
	$scope.paymentLoading = false;
	$scope.getPaymentHistory = function()
	{
		$scope.paymentLoading = true;
	}
	
	
	
}])

DiginApp.controller('changePasswordCtrl',['$scope','$mdDialog','$http','DiginServices','notifications' ,function ($scope,$mdDialog,$http,DiginServices,notifications) {

  $scope.submit = function()
  {
	   
        if ($scope.newPassword === $scope.confirmNewPassword) {

			DiginServices.changePassword($scope.oldPassword ,$scope.newPassword).then(function(result) {
				if(result.Error == false)
				{
					notifications.toast(1, "Passoword Changed");
					$mdDialog.hide(result);
				}else{
					notifications.toast(0, result.Message);
				}
			})

        } else {
            notifications.toast(0,"New Password Confirmation invalid");
        }
		//$mdDialog.hide($scope.email);
  }
}])

DiginApp.controller('uploadProfilePictureCtrl',['$scope','$mdDialog','$http','notifications' ,function ($scope,$mdDialog,$http,notifications) {
	
	$scope.fileChanged = function(e)
	{
		if( !e ) e = window.event;
		var x = e.target||e.srcElement;
		
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onload = function(){
			$scope.theImage1 = reader.result;
			$scope.$apply();
		};
		reader.readAsDataURL(file);
	}
	
	$scope.submit = function()
	{
		var profileImg = document.getElementById('profileImg');
		var profileImgSrc = someimage.src;
		console.log(profileImgSrc);
	}
}])

DiginApp.controller('uploadCompanyLogoCtrl',['$scope','$mdDialog','$http','notifications' ,function ($scope,$mdDialog,$http,notifications) {
	
	$scope.fileChanged = function(e)
	{
		if( !e ) e = window.event;
		var x = e.target||e.srcElement;
		
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onload = function(){
			$scope.theImage1 = reader.result;
			$scope.$apply();
		};
		reader.readAsDataURL(file);
	}
	
	$scope.submit = function()
	{
		var profileImg = document.getElementById('profileImg');
		var profileImgSrc = profileImg.src;
		console.log(profileImgSrc);
	}
}])