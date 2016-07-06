window.devportal.partials.share = function($scope,$rootScope, $http, $dev, $state, $rootScope, $stateParams, $auth, $objectstore,$helpers){
	$scope.appKey = $stateParams.appKey;
	$dev.navigation().title();

    $dev.project().getShareUsers().success(function(data){
	    	$scope.allContacts = data.map(function (c, index) {
	        var contact = {
	          name: c.Name,
	          email: c.EmailAddress,
	          image:'views/images/user.png'
	        };
	        contact._lowername = contact.name.toLowerCase();
	        return contact;
	      });

	    	if ($scope.allContacts.length ==0 )
	    		$scope.allContacts = [{"_lowername":"administrator" ,"email":"admin@duoweb.info","image":"views/images/user.png","name":"Administrator"}];

		$dev.project().shares($stateParams.appKey).success(function(data){
			$scope.contacts = data.shares;
			$dev.states().setIdle();
		}).error(function(data){
			$dev.dialog().alert ("Error Retrieving Project Details");
			$dev.states().setIdle();
		});

    }).error (function(){
    	$dev.dialog().alert ("Error retrieving users");
    });


    function querySearch (query) {return query ? $scope.allContacts.filter(createFilterFor(query)) : [];}
    function createFilterFor(query) { return function filterFn(contact) {return (contact._lowername.indexOf(angular.lowercase(query)) != -1);};}

    $scope.querySearch = querySearch;
    $scope.allContacts = [];
    $scope.contacts = [];
    $scope.filterSelected = true;

    $scope.updateShares = function(){
    	$dev.project().updateShares($scope.appKey, $scope.contacts).success(function(){

    	}).error(function(){
    		$dev.dialog().alert ("Error updating shares");
    	});
    }
	
	$scope.edit = function(){$dev.navigation().edit($scope.appKey);}
}