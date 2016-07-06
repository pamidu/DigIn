(function (_m){
	
	window.devportal.controller = _m;
	window.devportal.categories = ["Finance","Production ","Operations Management","Sales & Marketing","Legal","Social Media","Business Intelligence","Subscription and Billing","Other"];

	_m.config(function($stateProvider, $urlRouterProvider) {
	    
	    $urlRouterProvider.otherwise('/home');
	    var p = window.devportal.partials;
	    $stateProvider
			.state('home', {url:'/home', templateUrl:'views/partials/home/home.html', controller:p.home})
			.state('create', {url:'/create', templateUrl:'views/partials/create/create.html', controller:p.create})
			.state('edit', {url:'/edit/:appKey', templateUrl:'views/partials/edit/edit.html', controller:p.edit})
			.state('run', {url:'/run/:appKey', templateUrl:'views/partials/run/run.html', controller:p.run})
			.state('publish', {url:'/publish/:appKey', templateUrl:'views/partials/publish/publish.html', controller:p.publish})
			.state('desc', {url:'/desc/:appKey', templateUrl:'views/partials/desc/desc.html', controller:p.desc})
			.state('share', {url:'/share/:appKey', templateUrl:'views/partials/share/share.html', controller:p.share})
			.state('bundle', {url:'/bundle/:appKey', templateUrl:'views/partials/bundle/bundle.html', controller:p.bundle})
			.state('test', {url:'/test/:appKey', templateUrl:'views/partials/test/test.html', controller:p.test})
	});

	_m.controller("shellController", function($scope, hotkeys, $dev, $auth, $state){
		$scope.isBusy = true;
		$auth.checkSession();
		$dev.states().busy(function(){$scope.isBusy = true;});
		$dev.states().idle(function(){$scope.isBusy = false;});

		$scope.selectedMode = 'md-fling';
		$scope.navigate = function(r){ 
			if (!$state.is(r)){
				if (localStorage.getItem("createProjectState"))
					localStorage.removeItem("createProjectState");
				$dev.states().setBusy(); $state.go(r);				
			}
		}

	});

	_m.directive('ngRclick', function($parse) {
	    return function(scope, element, attrs) {
	        var fn = $parse(attrs.ngRclick);
	        element.bind('contextmenu', function(event) {
	            scope.$apply(function() {
	                event.preventDefault();
	                fn(scope, {$event:event});
	            });
	        });
	    };
	});


	_m.directive("ngFileSelect",function(){    
		return {
			scope: {ngFileSelect: '='},
			link: function($scope,el){          
			  el.bind("change", function(e){          
			    var file = (e.srcElement || e.target).files[0];
			    $scope.ngFileSelect(file);
			  });          
			}        
	  	}
	});

	_m.directive('ngIframeload',function(){
		
	    return {
	    	scope: {ngIframeload: '='},
	        link:function($scope,el){
	        	el.bind("load", function(e){
	                $scope.$apply(function(){
	                	if ($scope.ngIframeload) $scope.ngIframeload();
	                });
	        	});
	        }
	    };
	});

	_m.directive('ngEnter', function () {
	    return function (scope, element, attrs) {
	        element.bind("keydown keypress", function (event) {
	            if(event.which === 13) {
	                scope.$apply(function (){
	                    scope.$eval(attrs.ngEnter);
	                });
	 
	                event.preventDefault();
	            }
	        });
	    };
	});

	_m.factory("$fileReader", ["$q", "$log", function ($q, $log) {
 
        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () { deferred.resolve(reader.result);});
            };
        };
 
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () { deferred.reject(reader.result);});
            };
        };
 
        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",{total: event.total,loaded: event.loaded});
            };
        };
 
        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };
 
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();
             
            var reader = getReader(deferred, scope);         
            reader.readAsDataURL(file);
             
            return deferred.promise;
        };
 
        return { readAsDataUrl: readAsDataURL };
    }]);

})(angular.module("shellApp", ["ui.router", "ui.ace", "treeControl", "ngAnimate","ngMaterial","ngMdIcons" ,"cfp.hotkeys", "devPortalLogic", "uiMicrokernel"]))
