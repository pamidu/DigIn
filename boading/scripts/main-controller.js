var app = angular.module('wizard', ['ngMaterial', 'ngImgCrop', 'ksSwiper', 'ui.router', 'ngAnimate', 'ngCookies']);

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('light-blue')
        .accentPalette('deep-orange');
});

app.controller('main-controller', function ($scope, $mdSidenav, $mdDialog, $state, $cookies, $http) {
    $scope.config = {
        "companyConfiguration": {
            "title": "",
            "logo": "images/tennantassets/diginLogo.png",
            "banner": "images/diginLogo.png"
        },
        "shellConfiguration": {
            "docklayoutconfiguration": {
                "pannelcollection": [
                    {
                        "shellRelationship": "DuoWorld Alpha Shell v 1.0",
                        "panelDescription": "Framework shell applications panel",
                        "panelTitle": "applications",
                        "pannnelDirectiveContentTemplate": "partials/panel-templates/applications-pannel.html",
                        "panelArrangement": 0,
                        "pannelContentCollectionType": "application-component",
                        "row": 0,
                        "col": 0,
                        "panelType": "Applications"
                    },
                    {
                        "shellRelationship": "DuoWorld Alpha Shell v 1.0",
                        "panelDescription": "Framework shell custom panel",
                        "panelTitle": "collection",
                        "pannnelDirectiveContentTemplate": "partials/panel-templates/collections-pannel.html",
                        "panelArrangement": 1,
                        "pannelContentCollectionType": "various-component",
                        "row": 0,
                        "col": 1,
                        "panelType": "Collections"
                    }
                ],
                "dockoptions": {
                    "transitioneffect": "crossFade",
                    "layoutdirection": "horizontal",
                    "pagination": false,
                    "looppannels": true
                }
            },
            "themeconfiguration": {
                "palettename": "indigo",
                "primarypalette": "#3F51B5",
                "accentpalette": "#E91E63"
            },
            "backgroundconfiguration": [
                {
                    "backgroundtype": "solid",
                    "backgroundtypeactive": false,
                    "backgroundcolor": "#FF4081"
                },
                {
                    "backgroundtype": "gradient",
                    "backgroundtypeactive": false,
                    "backgroundgradientconfig": {
                        "color1": "#FF4081",
                        "color2": "#3F51B5",
                        "orientation": "diagonalup"
                    }
                },
                {
                    "backgroundtype": "image",
                    "backgroundtypeactive": true,
                    "backgroundimageconfig": {
                        "imageurl": "images/shellassets/background/blur-background12.jpg",
                        "imageblur": {
                            "status": true,
                            "amount": 10
                        },
                        "textureoverlay": false,
                        "vignetteoverlay": false
                    }
                }
            ]
        },
        "defaultAppConfiguration": []
    };
    $scope.state = "branding";
    $scope.configIndex = 0;
    $scope.profilePicture = "images/appIcons/contacts.png";
    $scope.device = "desktop";

    $scope.colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'
    ];

    $scope.wallpapers = [
        {
            imgUrl: 'images/shellassets/background/blur-background01.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background01.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background02.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background02.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background03.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background03.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background04.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background04.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background05.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background05.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background06.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background06.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background07.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background07.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background08.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background08.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background09.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background09.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background10.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background10.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background11.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background11.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background12.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background01.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background13.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background13.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background14.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background14.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background15.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background15.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background16.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background16.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background17.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background17.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background18.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background18.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background19.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background19.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background20.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background20.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background21.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background21.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background22.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background22.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background23.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background23.jpg'
        },
        {
            imgUrl: 'images/shellassets/background/blur-background24.jpg',
            thumb: 'images/shellassets/background/250x250_blur-background24.jpg'
        }
    ];
    $scope.apps = [{
        title: "app1",
        icon: "images/appIcons/clock.png"
    }, {
        title: "app2",
        icon: "images/appIcons/brain.png"
    }, {
        title: "app3",
        icon: "images/appIcons/bubbles.png"
    }, {
        title: "app4",
        icon: "images/appIcons/contacts.png"
    }, {
        title: "app5",
        icon: "images/appIcons/converse.png"
    }];

    $scope.companyPricePlans = [
        {
            id: "personal_space",
            name: "Personal Space",
            numberOfUsers: "1",
            numberOfApps: "Unlimited",
            storage: "10 GB",
            price: "0",
            per: "/ Mo",
            Description: "desc",
            img: 'images/personal.png'
        },
        {
            id: "mini_team",
            name: "We Are A Mini Team",
            numberOfUsers: "5",
            numberOfApps: "Unlimited",
            storage: "10 GB",
            price: "0",
            per: "/ Mo",
            Description: "desc",
            img: 'images/mini_team.png'
        },
        {
            id: "world",
            name: "We Are the World",
            numberOfUsers: "Unlimited",
            numberOfApps: "Unlimited",
            storage: "10 GB",
            price: "4.99",
            per: "/ User",
            Description: "desc",
            img: 'images/world.png'
        }]

    $scope.assignPrimaryColor = function (b) {
        $scope.config.shellConfiguration.themeconfiguration.primarypalette = b;
    };
    $scope.assignAccentColor = function (b) {
        $scope.config.shellConfiguration.themeconfiguration.accentpalette = b;
    }

    $scope.setBackground = function (c) {
        $scope.config.shellConfiguration.backgroundconfiguration[2].backgroundimageconfig.imageurl = c;
    };

    $scope.uploadLogo = function () {
        $scope.myImage = '';
        document.getElementById("fileInput").click();
    };


    $scope.myImage = '';
    $scope.myCroppedImage = "images/tennantassets/customizedlogo_white.png";

    $scope.handleFileSelect = function (evt) {
        console.log(evt);
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;

            });
        };
        reader.readAsDataURL(file);
    };

    $scope.showLiveDemo = function () {
        console.log("showing live demo");
        var frame = angular.element('.frame');
        var view = angular.element('.view');
        var backdrop = angular.element('.backdrop');
        frame.css({
            'right': '10vw',
            'top': '10vh'
        });
        view.css({
            'left': '10vw',
            'top': '15vh'
        });
        backdrop.css({
            'visibility': 'visible'
        });
    };

    $scope.closeLiveDemo = function () {
        console.log("closing live demo");
        var frame = angular.element('.frame');
        var view = angular.element('.view');
        var backdrop = angular.element('.backdrop');

        frame.css({
            'right': '-20vw',
            'top': '15vh'
        });
        view.css({
            'left': '40vw',
            'top': '20vh'
        });
        backdrop.css({
            'visibility': 'hidden'
        });
    };

    //search bar start
    $scope.searchBarRevealed = false;
    $scope.revealSearchBar = function () {
        $scope.searchBarRevealed = !$scope.searchBarRevealed;
        $scope.globalSearchKeyword = "";
    };
    //end of search bar

    /*toggle left menu*/

    $scope.toggleLeftMenu = function () {
        $mdSidenav('left').toggle();
    };

    $scope.finish = function (ev) {
        //$scope.config.defaultAppConfiguration = $scope.selected;
        console.log($scope.config);
        $mdDialog.show(
            $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Your Shell is ready to go live!')
                .textContent('this is super easy right?')
                .ariaLabel('Alert Dialog Demo')
                .ok('Yeah!')
                .targetEvent(ev)
        );
    };

    $scope.selected = [];
    $scope.config.defaultAppConfiguration = $scope.selected;
    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        } else {
            list.push(item);
        }
    };
    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };
    $scope.isIndeterminate = function () {
        return ($scope.selected.length !== 0 &&
        $scope.selected.length !== $scope.appss.length);
    };
    $scope.isChecked = function () {
        return $scope.selected.length === $scope.apps.length;
    };
    $scope.toggleAll = function () {
        if ($scope.selected.length === $scope.apps.length) {
            $scope.selected = [];
        } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
            $scope.selected = $scope.apps.slice(0);
        }
        $scope.config.defaultAppConfiguration = $scope.selected;
    };

    //#Tenent creation process
	$scope.createTenant = function (plan) {
        
        var userInfo = JSON.parse(decodeURIComponent($cookies.get('authData')));
        var email=userInfo.Email;
        var domainName = email.replace('@', "");
            domainName = domainName.replace('.', "");
			domainName = domainName.replace('.', "");

        $scope.tenantDtl = {
            "TenantID": domainName,
            "TenantType": "Company",
            "Name": userInfo.Name.replace(' ', ''),
            "Shell": "",
            "Statistic": {
                "CompanyName": "Company",
                "Plan": plan
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
            url: 'http://digin.io/apis/usertenant/tenant/',
            data: angular.toJson($scope.tenantDtl),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .success(function (response) {
            //var res=decodeURIComponent(response);
            if (response.Success == true) {
                window.location = "http://" + response.Data.TenantID;
				//window.location ="http://digin.io/entry";
            }
            else {	
                console.log(response.Message);
            }

        })
        .error(function (error) {

        });
    };
   

});

/*Pannel Title Directive (UI Component Directive) - start*/
app.directive('panneltitleComponent', panneltitleComponentFunc);

function panneltitleComponentFunc() {
    var linkFunction = function (scope, elem, attrs) {

    };

    return {
        restrict: 'E',
        scope: {
            title: '='
        },
        template: '<div class="panelTitleHolder"><h1>{{title}}<h1></div>',
        link: linkFunction
    };
};
/*Pannel Title Directive (UI Component Directive) - end*/

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // var allApps;
    // var fetchedCustomAppStates = [];

    $urlRouterProvider.otherwise("/plan");
    $stateProvider
    //---------------------- dock state -----------------------------------------------------
        .state('step1', {
            url: '/tennantCreation',
            templateUrl: 'partials/step1.html'
        })
        //---------------------- launcher state (parent to all below states) --------------------
        .state('step2', {
            url: '',
            templateUrl: 'partials/step2.html'
        })
        .state('step3', {
            url: '/shellCustomization',
            templateUrl: 'partials/step3.html'
        })


}]);
