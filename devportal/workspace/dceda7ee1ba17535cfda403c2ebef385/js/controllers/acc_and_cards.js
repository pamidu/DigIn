angular
    .module('mainApp', ['ngMaterial','directivelibrary','uiMicrokernel', 'ui.router', 'ngAnimate'])
	
		.config(function($stateProvider, $urlRouterProvider) {
    
		$urlRouterProvider.otherwise('/main/tabone');
    
		$stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
       
         .state('main', {
            url: '/main',
            templateUrl: 'partials/main.html',
            controller: 'ViewCtrl'
        })
		
		.state('main.one', {
            url: '/tabone',
            templateUrl: 'partials/tabone.html',
			controller: 'ViewCtrl'
        })
		
		.state('main.two', {
            url: '/tabtwo',
            templateUrl: 'partials/tabtwo.html',
			controller: 'ViewCtrl'
        })
		
		.state('add', {
            url: '/add',
            templateUrl: 'partials/AddAccount.html',
            controller: 'addAccountCtrl'
        })
		
	})

	.controller('addAccountCtrl', function ($scope, $objectstore, $mdDialog, $window, $objectstore) {
	
	
		var self = this;
		// list of `state` value/display objects
		loadAll();
		self.selectedItem  = null;
		self.searchText    = null;
		self.querySearch   = querySearch;
		// ******************************
		// Internal methods
		// ******************************
		/**
		 * Search for tenants... use $timeout to simulate
		 * remote dataservice call.
		 */

		function querySearch (query) {
				  
			//Custom Filter
			var results=[];
			for (i = 0, len = $scope.allCompanies.length; i<len; ++i){
				//console.log($scope.allCompanies[i].value.value);
				
				if($scope.allCompanies[i].value.indexOf(query.toLowerCase()) !=-1)
				{
					results.push($scope.allCompanies[i]);
				} 
			}
			return results;
		}

		 // Build `tenants` list of key/value pairs
		 
		 $scope.allCompanies = [];
		 
		function loadAll() {
		
			var client = $objectstore.getClient("TemplateCompanies");
			client.onGetMany(function(data){
			  if (data){
				
				for (i = 0, len = data.length; i<len; ++i){
						$scope.allCompanies.push ({display: data[i].CompanyID, value:data[i].TenantID.toLowerCase()});
					}

				return $scope.allCompanies;
			  }
			 }); 
			 client.onError(function(data){
			  $mdDialog.show(
			   $mdDialog.alert()
				 .parent(angular.element(document.body))
				 .title('Sorry')
				 .content('There is no Companies available')
				 .ariaLabel('Alert Dialog Demo')
				 .ok('OK')
				 .targetEvent(data)
			  );
			 });

		 client.getByFiltering("*");
		
		}
			
		$scope.template = {};
		
		$scope.submit = function(){
			$scope.submitted = true; // Disable the submit button until the form is submitted successfully to the database (ng-disabled)
			
			$scope.template.tags = $scope.tags;
			$scope.template.company = self.selectedItem;
			console.log($scope.template);
			
			
			var client = $objectstore.getClient("TemplateTest");
			
			client.onComplete(function(data){
			
				self.searchText = "";
				$scope.submitted = false; // Make submit button enabled again (ng-disabled)
				$scope.template = ""; // Empty the form
				$scope.editForm.$setUntouched();
				$scope.editForm.$setPristine();
				
				$mdDialog.show(
				 $mdDialog.alert()
				   .parent(angular.element(document.body))
				   .title('')
				   .content('Template Details Successfully Saved')
				   .ariaLabel('Alert Dialog Demo')
				   .ok('OK')
				   .targetEvent(data)
				);     
				window.scrollTo(0,0);
			});
              
			client.onError(function(data){
				$mdDialog.show(
			     $mdDialog.alert()
				   .parent(angular.element(document.body))
				   .title('Sorry')
				   .content('Error saving template details')
				   .ariaLabel('Alert Dialog Demo')
				   .ok('OK')
				   .targetEvent(data)
			  );
	  
			});
				$scope.template.favourite = false;
				$scope.template.uniqueRecord = "-999";
                client.insert($scope.template, {KeyProperty:"uniqueRecord"}); 
			
        }
				
		
	})
	
	.controller('ViewCtrl', function ($scope,$state, $objectstore, $mdDialog,$rootScope ) {
		
	

	$scope.deletemultiple = function(){

console.log($rootScope.testarr);

		var client = $objectstore.getClient("TemplateTest");

            client.onComplete(function(data){

              $mdDialog.show(
				 $mdDialog.alert()
				 .parent(angular.element(document.body))
						.title('')
						.content('Template Record Successfully Deleted')
						.ariaLabel('')
						.ok('OK')
						.targetEvent(data)            
						);   
				$state.go($state.current, {}, {
                    reload: true
                });
			 
            });

           client.onError(function(data){
				$mdDialog.show(
				 $mdDialog.alert()
				 .parent(angular.element(document.body))
						//.title('This is embarracing')
						.content('Error Deleting Template Record')
						.ariaLabel('')
						.ok('OK')
						.targetEvent(data)
						);

            });
					//console.log(index);
					
                   client.deleteMultiple($rootScope.testarr,"uniqueRecord");
				   //deleteform.uniqueRecord = null;
				   


	}
		
		
		var self = this;
		// list of `state` value/display objects
		loadAll();
		self.selectedItem  = null;
		self.searchText    = null;
		self.querySearch   = querySearch;
		// ******************************
		// Internal methods
		// ******************************
		/**
		 * Search for tenants... use $timeout to simulate
		 * remote dataservice call.
		 */

		function querySearch (query) {
				  
			//Custom Filter
			var results=[];
			for (i = 0, len = $scope.allCompanies.length; i<len; ++i){
				//console.log($scope.allCompanies[i].value.value);
				
				if($scope.allCompanies[i].value.indexOf(query.toLowerCase()) !=-1)
				{
					results.push($scope.allCompanies[i]);
				} 
			}
			return results;
		}

		 // Build `tenants` list of key/value pairs
		 
		 $scope.allCompanies = [];
		 
		function loadAll() {
		
			var client = $objectstore.getClient("TemplateCompanies");
			client.onGetMany(function(data){
			  if (data){
				
				for (i = 0, len = data.length; i<len; ++i){
						$scope.allCompanies.push ({display: data[i].CompanyID, value:data[i].TenantID.toLowerCase()});
					}

				return $scope.allCompanies;
			  }
			 }); 
			 client.onError(function(data){
			  $mdDialog.show(
			   $mdDialog.alert()
				 .parent(angular.element(document.body))
				 .title('Sorry')
				 .content('There is no Companies available')
				 .ariaLabel('Alert Dialog Demo')
				 .ok('OK')
				 .targetEvent(data)
			  );
			 });

		 client.getByFiltering("*");
		
		}
		
		
	
		$scope.mainarr = [];
		var client = $objectstore.getClient("TemplateTest");
		 client.onGetMany(function(data){
		  if (data){
		   $rootScope.template =data;
		   $scope.mainarr = angular.copy(data);

		   
		   for (i = 0, len = $scope.template.length; i<len; ++i){
				//self.selectedItem[i] = $scope.template[i].banks;
							
				
				if(!$rootScope.template[i].tags)
				{
					$rootScope.template[i].tags = [];
				}
		   }
		   console.log($rootScope.template);

			return $rootScope.template;
		  }
		 }); 
		 client.onError(function(data){
		  $mdDialog.show(
		   $mdDialog.alert()
			 .parent(angular.element(document.body))
			 .title('Sorry')
			 .content('There is no products available')
			 .ariaLabel('Alert Dialog Demo')
			 .ok('OK')
			 .targetEvent(data)
		  );
		 });

		 client.getByFiltering("*");
		 
		 $rootScope.template = [];
		$scope.checkedarr = [];
		$rootScope.testarr = [];
		$rootScope.SearchbarShow = true;
		 $scope.selectItem = function(item)
		{
			$scope.testvariable = true;

			for (var i = $scope.checkedarr.length - 1; i >= 0; i--) {
				if ($scope.checkedarr[i] == item.uniqueRecord) {
					$scope.checkedarr.splice(i,1);
					$scope.testvariable = false;
					item.favourite = !item.favourite;
				}
			};

			if ($scope.testvariable) {
				$scope.checkedarr.push(item.uniqueRecord);
				item.favourite = !item.favourite;
			};

			$rootScope.testarr = $scope.checkedarr;
			 
			console.log($scope.checkedarr);	
			$scope.testvar = true;
			for (var i = $rootScope.template.length - 1; i >= 0; i--) {
			 	if ($rootScope.template[i].favourite == true) {
			 		$rootScope.SearchbarShow = false;
			 		$scope.testvar = false;

			 	};
			 }; 
			 if ($scope.testvar ) {
			 	$rootScope.SearchbarShow = true;
			 };
			
		}

		$scope.backfunc = function(){

			$rootScope.SearchbarShow = true;
			
			 for (var i = $rootScope.template.length - 1; i >= 0; i--) {
			 	$rootScope.template[i].favourite = false;
			 };
		}
		 
	$scope.deleteRecord = function(ev,deleteform,index){
	
		//console.log(deleteform);
		var confirm = $mdDialog.confirm()
		 .parent(angular.element(document.body))
         .title('')
         .content('Are You Sure You Want To Delete This Record?')
         .ok('Delete')
         .cancel('Cancel')
         .targetEvent(ev);

		$mdDialog.show(confirm).then(function() {
			var client = $objectstore.getClient("TemplateTest");

            client.onComplete(function(data){

              $mdDialog.show(
				 $mdDialog.alert()
				 .parent(angular.element(document.body))
						.title('')
						.content('Template Record Successfully Deleted')
						.ariaLabel('')
						.ok('OK')
						.targetEvent(data)            
						);   
				
				//PROBLEM AREA
				$state.go($state.current, {}, {
                    reload: true
                });
            });

           client.onError(function(data){
				$mdDialog.show(
				 $mdDialog.alert()
				 .parent(angular.element(document.body))
						//.title('This is embarracing')
						.content('Error Deleting Template Record')
						.ariaLabel('')
						.ok('OK')
						.targetEvent(data)
						);

            });
					//console.log(index);
					
                   client.deleteSingle(deleteform.uniqueRecord,"uniqueRecord");
				   //deleteform.uniqueRecord = null;
				   

		}, function() {      
		  $mdDialog.hide();
		});
	        
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
   

   
    
	
	