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
        	controller: 'TwoCtrl'
        })

        .state('main.three', {
        	url: '/tabthree',
        	templateUrl: 'partials/tabthree.html',
        	controller: 'ThreeCtrl'
        })

        .state('main.four', {
        	url: '/tabfour',
        	templateUrl: 'partials/tabfour.html',
        	controller: 'FourCtrl'
        })

        .state('main.share',{
        	url: '/share?applicationKey',
        	templateUrl: 'partials/share.html',
        	controller: 'shareCtrl'
        });

    })

.controller('ViewCtrl', function ($scope, $http, $state, $auth, $objectstore, $v6urls, $apps,$mdToast) {
	//$scope.loading=false;
	$scope.nodata=false;
	
	var last = {
		bottom: false,
		top: false,
		left: false,
		right: true
	};
	
	$scope.toastPosition = angular.extend({},last);
	
	$scope.getToastPosition = function() {
		sanitizePosition();
		return Object.keys($scope.toastPosition)
		.filter(function(pos) { return $scope.toastPosition[pos]; })
		.join(' ');
	};
	
	function sanitizePosition() {
		var current = $scope.toastPosition;
		if ( current.bottom && last.top ) current.top = false;
		if ( current.top && last.bottom ) current.bottom = false;
		if ( current.right && last.left ) current.left = false;
		if ( current.left && last.right ) current.right = false;
		last = angular.extend({},current);
	}
	
	$apps.getAppsForUser();

	var baseUrl = "http://" + window.location.hostname;
	
	//load all group when save
	function loadGroupData(){
		$http.get(baseUrl + "/apis/usercommon/getAllGroups") 
		.success(function(data) 
		{
			$scope.getallgroup = data;
			
			if (data) {
				$scope.getallgroup = data;
				$scope.Sharegetallgroup = angular.copy($scope.getallgroup);
				console.log(data);
			}
		}).error(function(){
			
			alert ("Sorry!.. There was a error");
		});
		
	}

	loadGroupData(function(data){
		$scope.getallgroup = data;
	});
	

//chips ctrl....................................................................

function loadContacts() {
	$http.get(baseUrl + "/devportal/project/share/getusers")
	.success(function(data) 
	{
		$scope.getuser = data;
		
		
		if(data.length > 0){
			createAllContacts(data);
			console.log(data);
		}
	}).error(function(){

		alert ("Sorry!.. There was a error");
	});
}

function createAllContacts(data){
	$scope.allContacts = data.map(function (c, index) {
		var contact = {
			name: c.Name,
			email: c.EmailAddress,
			image:'img/user.png'
		};

		contact._lowername = contact.name.toLowerCase();
		return contact;
	});

	if ($scope.allContacts.length === 0 ){
		$scope.allContacts = 
		[{"_lowername":"administrator" ,"email":"admin@duoweb.info","image":"img/user.png","name":"Administrator"}]; 
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

})

.controller('TwoCtrl', function ($scope, $http, $state, $auth, $objectstore, $v6urls, $apps, $mdDialog) {
	
	$scope.loading=true;

	$apps.onAppsRetrieved(function(e,apps){
 //here are the apps
 $scope.app=apps.apps;
 console.log(apps.apps);
 $scope.loading=false;
 
});

	$apps.getAppsForUser();

	var baseUrl = "http://" + window.location.hostname;
	
	//load all group when save
	function loadGroupData(){
		$http.get(baseUrl + "/apis/usercommon/getAllGroups") 
		.success(function(data) 
		{
			$scope.getallgroup = data;
			
			if (data) {
				$scope.getallgroup = data;
				$scope.Sharegetallgroup = angular.copy($scope.getallgroup);
				console.log(data);
			}
		}).error(function(){
			
			alert ("Oops! There was a problem retrieving the Groups");
		});
		
	}

	loadGroupData(function(data){
		$scope.getallgroup = data;
	});
	

//chips ctrl....................................................................

function loadContacts() {
	$http.get(baseUrl + "/devportal/project/share/getusers")
	.success(function(data) 
	{
		$scope.getuser = data;
		
		
		if(data.length > 0){
			createAllContacts(data);
			console.log(data);
		}
	}).error(function(){

		alert ("Oops! There was a problem retrieving the User");
	});
}

function createAllContacts(data){
	$scope.allContacts = data.map(function (c, index) {
		var contact = {
			name: c.Name,
			email: c.EmailAddress,
			image:'img/user.png'
		};

		contact._lowername = contact.name.toLowerCase();
		return contact;
	});

	if ($scope.allContacts.length === 0 ){
		$scope.allContacts = 
		[{"_lowername":"administrator" ,"email":"admin@duoweb.info","image":"img/user.png","name":"Administrator"}]; 
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

$scope.applicationKey="";

})

.controller('shareCtrl', function ($scope, $http, $state, $auth, $objectstore, $v6urls, $apps, $mdDialog, $stateParams,$mdToast) {
	
	$scope.shareusers=[];
	
	var baseUrl = "http://" + window.location.hostname;
	
	$scope.appkey = $stateParams.applicationKey;
	console.log($scope.appkey);
	console.log($stateParams.applicationKey);
	
	$scope.shareUser = function(data) {
		
		console.log(data);
		
		var gettingUser=[];
		for(var i = 0; i < data.length; i++){
			console.log(data[i].email);
			gettingUser.push(data[i].email);
			console.log($scope.gettingUser);
			
            var userbinding = gettingUser.join(","); //join ',' selected user
            console.log(userbinding);
        }
        
        //Original Array
        $scope.orginalArray=data;
        console.log($scope.orginalArray);
        
        //Duplicate Array create when remove user
        $scope.duplicateArray=data;
        console.log($scope.duplicateArray);
        
        $http.get(baseUrl + "/apps/" +$scope.appkey+ "?share=" +userbinding)
        .success(function(data) 
        {
        	if(data.success==true)
        	{
        		$mdToast.show(
        			$mdToast.simple()
        			.textContent('Shared Users Suceesfully!')
        			.position($scope.getToastPosition())
        			.hideDelay(3000)
        			); 
        	}

        }).error(function(){
        	alert ("Oops! There was a error");
        });
        
    };
    
})

.controller('ThreeCtrl', function ($scope, $http, $state, $auth, $objectstore, $v6urls, $apps, $mdDialog, $mdToast) {
	$scope.loading=true;
	var baseUrl = "http://" + window.location.hostname;

	function loaduser(){
		$http.get(baseUrl + "/devportal/project/share/getusers")
		.success(function(data) 
		{
			$scope.adduser=data;
			console.log(data);
			$scope.loading=false;
		});
	}
	
	loaduser();
	
	$scope.enter = function(keyEvent,text)
	{
		if (keyEvent.which === 13)
		{
			$http.get( $v6urls.auth + "/tenant/AddUser/"+text+"/user")
			.success(function(data){
				$scope.user=data;
				console.log(data);

				if(data=="true"){
					console.log(data);
					$http.get($v6urls.auth + "/GetUser/"+ text)
					.success(function(data){
						$scope.getUser=data;
						console.log(data);
						
						var contactUser = {
							Name: data.Name,
							EmailAddress: data.EmailAddress,
							image:'img/user.png'
						};
						$scope.adduser.push(contactUser);
						$mdToast.show(
							$mdToast.simple()
							.textContent( data.Name + ' Suceesfully Invited')
							.position($scope.getToastPosition())
							.hideDelay(3000)
							); 
						
					});
					
				}
				else{

					$mdDialog.show(
						$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.title('Alert')
						.content('This Email does not exeist.')
						.ariaLabel('Alert Dialog Demo')
						.ok('Got it!')
						.targetEvent(keyEvent)
						);

				}
			});
		}
	};
	
	var client = $objectstore.getClient('duoworld.duoweb.info', "profilepictures", true);
	client.onGetOne(function (data) {
		if (data)
			console.log(data);
                //made the profile picture a rootscope variable, so it could be accessible from anywhere without another service call
                $scope.profilePicture = data.Body;
            });
	client.onError(function (data) {
		Toast("Error occured while fetching profile picture");
	});
	client.getByKey($auth.getUserName());
})

.controller('FourCtrl', function ($scope, $http, $state, $auth, $objectstore, $v6urls, $apps, $mdDialog) {
	
	var baseUrl = "http://" + window.location.hostname;

	function loadGroupData(){
		$http.get(baseUrl + "/apis/usercommon/getAllGroups") 
		.success(function(data) 
		{
        // 		$scope.getallgroup = data;
        if (data) {
        	$scope.getallgroup = data;
        	console.log(data);
        }
    }).error(function(){
    	
    	alert ("Oops! There was a error");
    });
    
}

loadGroupData(function(data){
	$scope.getallgroup = data;
});

// .............................
$scope.createGroup = function(ev){
	$mdDialog.show({
		controller: DialogController,
		templateUrl: 'partials/createGroup.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true
	})
	.then(function(answer) {
		loadGroupData(function(data){
			$scope.getallgroup = data;
		});
		
	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.addNewUsersToGroup = function(getusers, ev){
	$mdDialog.show({
		controller: DialogaddNewUsersToGroupController,
		templateUrl: 'partials/addNewUsersToGroup.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		locals: { getusers: getusers },
		clickOutsideToClose:true
	})
	.then(function(answer) {
		loadGroupData();		
	}, function() {
		$scope.status = 'You cancelled the dialog.';
	});
};

$scope.removeGroup = function(data, ev){
	     //console.log(data);
	     var confirm = $mdDialog.confirm()
	     .title('Would you like to delete this group?')
	     .content('This group is deleting')
	     .ariaLabel('Lucky day')
	     .targetEvent(ev)
	     .ok('Please do it!')
	     .cancel('Sounds like a scam');
	     
	     $mdDialog.show(confirm).then(function() {
	     	console.log( data);
	     	$http.get(baseUrl + "/apis/usercommon/removeUserGroup/"+ data.groupId) 
	     	.success(function(data) 
	     	{
	     		$scope.deletegroup=data;
	     		console.log(data);
	     		
	     		loadGroupData(function(data){
	     			$scope.getallgroup = data;
	     		});
	     	});
	     	
	     }, function() {
	     	$scope.status = 'You decided to keep your debt.';
	     });
	     
	 };
	 
	 $scope.selected = [];
	 
	 $scope.toggle = function (user, list) {
	 	var idx = list.indexOf(user);
	 	if (idx > -1) list.splice(idx, 1);
	 	else list.push(user);
	 	console.log(list);
	 	
	 };
	 
	 $scope.exists = function (user, list) {
	 	return list.indexOf(user) > -1;
	 };
	 
	 $scope.deleteSelectedUser = function(data,ev){
	 	console.log(data);
	 	console.log($scope.selected);
	 	
	 	$scope.usersFromeGroup ={};
	 	$scope.usersFromeGroup.groupId =data.groupId;
	 	$scope.usersFromeGroup.users = $scope.selected;

	 	console.log($scope.usersFromeGroup);
	 	
	 	var confirm = $mdDialog.confirm()
	 	.title('Would you like to delete this selected user or users?')
	 	.content('users will be deleting..')
	 	.ariaLabel('Lucky day')
	 	.targetEvent(ev)
	 	.ok('yes')
	 	.cancel('No');
	 	
	 	$mdDialog.show(confirm).then(function() {
	 		
	 		$http({
	 			method : 'POST',
	 			url : baseUrl + "/usergroup/removeUsersFromGroup",
	 			data : $scope.usersFromeGroup
	 		}).then(function(response) {
	 			console.log(response);
	 			$mdDialog.hide();
	 			loadGroupData();
	 		}, function(response) {
	 			console.log(response);
	 		});
	 		
	 	}, function() {
	 		$scope.status = 'You decided to keep your debt.';
	 	});
	 	
	 	
	 	
	 	
	 };
	 
	 
	})

/*Image SRC Error Directive (UI Helper Directive) - start*/
.directive('errSrc', function () {
	return {
		link: function (scope, element, attrs) {
			element.bind('error', function () {
				if (attrs.src != attrs.errSrc) {
					attrs.$set('src', attrs.errSrc);
				}
			});

			attrs.$observe('ngSrc', function (value) {
				if (!value && attrs.errSrc) {
					attrs.$set('src', attrs.errSrc);
				}
			});
		}
	};
});
/*Image SRC Error Directive (UI Helper Directive) - end*/

function DialogController($scope, $http ,$mdDialog, $objectstore,  $v6urls) {
	
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
				image:'img/user.png'
			};
			console.log(c);
			contact._lowername = contact.name.toLowerCase();
			return contact;
		});

		if ($scope.allContacts.length === 0 ){
			$scope.allContacts = 
			[{"_lowername":"administrator" ,"email":"admin@duoweb.info","image":"img/user.png","name":"Administrator"}]; 
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
	
	$scope.userGroup ={};
	
	$scope.userGroup.groupId = "-999";
	$scope.userGroup.groupname="";
	$scope.userGroup.users = [];
	$scope.userGroup.parentId = "";
	
	$scope.selectedUsers = [];
	$scope.SaveGroup = function() {
		console.log($scope.selectedUsers);
		//post user group name and users
		$scope.userGroup.users = $scope.selectedUsers.map(function(obj,index){
		//	obj.email._lowername = obj.email.toLowerCase();
		return obj.email;
	});
		
		console.log($scope.userGroup);
		
		$http({
			method : 'POST',
			url : baseUrl + "/apis/usercommon/addUserGroup",
			data : $scope.userGroup
		}).then(function(response) {
			console.log(response);
			$mdDialog.hide();
		}, function(response) {
			console.log(response);
		});
	};

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
}

function DialogaddNewUsersToGroupController($scope, $http ,$mdDialog, $objectstore, $v6urls, getusers,$mdToast) {
	
	var baseUrl = "http://" + window.location.hostname;
	
	console.log(getusers);

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
				image:'img/user.png'
			};
			console.log(c);
			contact._lowername = contact.name.toLowerCase();
			return contact;
		});

		if ($scope.allContacts.length === 0 ){
			$scope.allContacts = 
			[{"_lowername":"administrator" ,"email":"admin@duoweb.info","image":"img/user.png","name":"Administrator"}]; 
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
	
	$scope.addUsersTogroup ={};
	
	$scope.addUsersTogroup.groupId = getusers.groupId;
	$scope.addUsersTogroup.users = [];
	
	
	$scope.selectedUsers=[];
	
	$scope.AddUserToGroup = function(){
		
		console.log($scope.selectedUsers);
		
		for(var i=0; i < getusers.users.length; i++){
			console.log(getusers.users[i]);
			for(var s=0; s<$scope.selectedUsers.length;s++)
			{
				console.log($scope.selectedUsers[s].email);
				
				if(getusers.users[i] == $scope.selectedUsers[s].email)
				{
					$scope.selectedUsers.splice(s,1);
					console.log($scope.selectedUsers);
					break;
				}
				
			}
			
		}
		
			//post user group name and users
			$scope.addUsersTogroup.users = $scope.selectedUsers.map(function(obj,index){
		//	obj.email._lowername = obj.email.toLowerCase();
		return obj.email;
	});
			
			console.log($scope.addUsersTogroup);
			
			$http({
				method : 'POST',
				url : baseUrl + "/usergroup/addUserToGroup",
				data : $scope.addUsersTogroup
			}).then(function(response) {
				console.log(response);
				$mdDialog.hide();
			}, function(response) {
				console.log(response);
			});
			
			
		};
		
		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};
	}

