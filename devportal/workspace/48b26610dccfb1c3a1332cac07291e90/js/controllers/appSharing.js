angular
.module('mainApp', ['ngMaterial','directivelibrary','uiMicrokernel', 'ui.router', 'ngAnimate'])

.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/main/tabtwo');

	$stateProvider

        // HOME STATES AND NESTED VIEWS ========================================

        .state('main', {
        	url: '/main',
        	templateUrl: 'partials/main.html',
        	controller: 'ViewCtrl'
        })

        .state('main.two', {
        	url: '/tabtwo',
        	templateUrl: 'partials/tabtwo.html',
        	controller: 'ViewCtrl'
        })

        .state('main.three', {
        	url: '/tabthree',
        	templateUrl: 'partials/tabthree.html',
        	controller: 'ViewCtrl'
        })

        .state('main.share',{
        	url: '/share',
        	templateUrl: 'partials/share.html',
        	controller: 'ViewCtrl'

        });

    })

.controller('ViewCtrl', function ($scope, $http, $state, $auth, $objectstore, $v6urls) {

	var session = $auth.checkSession();
	console.log(session);

	
	$http.get($v6urls.auth + "/tenant/GetTenants/" + $auth.getSecurityToken())
	.success(function(data) 
	{
		$scope.tenantOwern = data;
		console.log(data);

		function adduser(data){
			console.log($scope.tenantOwern);
			$http.get($v6urls.auth + "/auth/tenant/AddUser/"+$scope.email+"/user")
			.success(function(data) {
				var adduser=data;
				console.log(data);
			})
		}
	});




//chips ctrl....................................................................

var baseUrl = "http://" + window.location.hostname;
function loadContacts() {
	$http.get(baseUrl + "/devportal/project/share/getusers")
	.success(function(data) 
	{
		$scope.getuser = data;
		console.log(data);
		if(data.length > 0){
			createAllContacts(data);
		}
	}).error(function(){

		alert ("Erro Occured!!");
	});
}

function createAllContacts(data){
	$scope.allContacts = data.map(function (c, index) {
		var contact = {
			name: c.Name,
			email: c.EmailAddress,
			image:'img/duo.jpg'
		};

		contact._lowername = contact.name.toLowerCase();
		return contact;
	});

	if ($scope.allContacts.length == 0 ){
		$scope.allContacts = 
		[{"_lowername":"administrator" ,"email":"admin@duoweb.info","image":"img/duo.jpg","name":"Administrator"}]; 
	}
}

function querySearch (query) {
	return query ? $scope.allContacts.filter(createFilterFor(query)) : [];
}

function createFilterFor(query) {
	return function filterFn(contact) {
		return (contact._lowername.indexOf(angular.lowercase(query)) != -1);
	};
}

$scope.querySearch = querySearch;
$scope.allContacts = [];
$scope.contacts = [];
$scope.filterSelected = true;

loadContacts();
// chips ctrl CLOSE

$scope.enter = function(keyEvent,text)
{
	if (keyEvent.which === 13)
	{
		$http.get($v6urls.auth + "/tenant/SearchTenants/"+text+"/50/1")
		.success(function(data)
		{
			$scope.tenant=data;
			console.log(data);
		});
		
	}
}

})

.controller('AppCtrl', function ($scope, $mdDialog,$auth, $location, $state, $timeout, $q,  $objectstore) {

	//	$auth.checkSession();
	$scope.addInvoice = function(){
		$('#add').animate({width:"100%",height:"100%", borderRadius:"0px", right:"0px", bottom:"0px", opacity: 0.25},400, function() { 
			location.href = '#/add';
		});
	}
	
	$scope.viewInvoice = function(){
		$('#view').animate({width:"100%",height:"100%", borderRadius:"0px", right:"0px", bottom:"0px", opacity: 0.25},400, function() { 
			location.href = '#/main.one';
		});

	}

	$scope.changeTab = function(ind){
		switch (ind) {
			case 0:
			$location.url("/main/tabone");

			break;
			case 1:
			$location.url("/main/tabtwo");

			break;
		}
	}; 
	$scope.today = "";


	
	$scope.demo = {
		topDirections: ['left', 'up'],
		bottomDirections: ['down', 'right'],
		isOpen: false,
		availableModes: ['md-fling', 'md-scale'],
		selectedMode: 'md-fling',
		availableDirections: ['up', 'down', 'left', 'right'],
		selectedDirection: 'up'
	};
	


	

	$scope.back = function()
	{
		location.href = '#/main';
	}



	$scope.showCode = function(AccountVerification)
	{

		$mdDialog.show(
			$mdDialog.alert()
			.parent(angular.element(document.body))
			.title('Verification Code')
			.content('Your account Verification code is '+ AccountVerification)
			.ariaLabel('Alert Dialog Demo')
			.ok('OK')
			);


	}

	function getDate()
	{
		var today = new Date();
		var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			if(dd<10) {
				dd='0'+dd
			} 
			var monthNames = {1:"January", 2:"February", 3:"March", 4:"April",5:"May", 6:"June", 7:"July", 8:"August", 9:"September", 10:"October", 11:"November", 12:"December" };
			
			var monthName = monthNames[mm];
			
			if(mm<10) {
				mm='0'+mm
			} 
			
			

			today = monthName+' '+dd+', '+yyyy;
			$scope.today = today;
		}
		getDate();

		

		$scope.tags = ['Apple', 'Banana', 'Orange'];


   })//END OF AppCtrl
.directive('accordion', [function () {
	return {
		restrict: 'E',
		replace:true,
		transclude:true,
		scope:{

		},
		controller:function($scope,$element){
			var activePanel=null;
			this.openPanel=function(panel){
				if(this.activePanel!=null){
					if(panel.active){
						this.activePanel.active=false;
						this.activePanel=null;
						panel.icon='keyboard_arrow_down';
					}else{
						this.activePanel.active=false;
						this.activePanel.icon='keyboard_arrow_down';
						this.activePanel=panel;
						this.activePanel.active=true;
						panel.icon='keyboard_arrow_up';	
					}
				}else{
					this.activePanel=panel;
					this.activePanel.active=true;
					panel.icon='keyboard_arrow_up';
				}
			}

		},
		template:'<div class="accordion" ng-transclude></div>',
		link: function (scope, element, attrs) {
		}
	};
}])


.directive('accordionPanel', [function () {
	return {
		require: '^accordion',
		restrict: 'E',
		transclude:true,
		replace:true,
		scope:{
			title:'@'
		},
		template:'<section class="accordion-panel">'+
		'<md-button ng-click="toggle();">'+
		'<div flex="" layout="row">'+
		'<span class="accordion-panel-title">{{title}}</span>'+
		'<span flex=""></span>'+
		'<span ng-if="childNodes > 0"><ng-md-icon icon="{{icon}}"></ng-md-icon></span></div>'+
		'</md-button>'+
		'<md-content class="md-padding animate-show" ng-show="active" ng-transclude></md-content>'+
		'</section>',
		link: function (scope, element, attrs, accordionCtrl) {
			var elem=element[0];
			elem.id='panel_'+scope.$id;

			scope.childNodes=document.querySelector("#"+elem.id+" md-content").children.length;

			scope.icon='keyboard_arrow_down';
			scope.active=false;
			scope.title=scope.title;

			scope.toggle=function(){
				accordionCtrl.openPanel(scope);
			}
		}
	};
}]);





