angular
    .module('mainApp', ['ngMaterial','directivelibrary','uiMicrokernel', 'ngAnimate'])
	
   .controller('AppCtrl', function ($scope, $mdDialog, $objectstore, $timeout, $q) {
	
	
		$scope.template = {};
		
		$scope.submit = function(){
			$scope.submitted = true; // Disable the submit button until the form is submitted successfully to the database (ng-disabled)
			
			console.log($scope.template);
			
			
			var client = $objectstore.getClient("TemplateCompanies");
			
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
				   .content('Compaany Details Successfully Saved')
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
				$scope.template.companyNo = "-999";
                client.insert($scope.template, {KeyProperty:"companyNo"}); 
			
        }
		
   })//END OF AppCtrl
   

   
    
	
	