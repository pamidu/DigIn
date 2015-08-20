routerApp.controller('shareCtrl', ['$scope','$rootScope','$objectstore','$mdDialog', function ($scope,$rootScope,
$objectstore,$mdDialog) {

        // html2canvas(document.body, {
        //                 onrendered: function(canvas) {
                            
        //                     $rootScope.a = canvas;
                                               
        //                     alert("Snapshot Taken");
        //                 }
        // });

        
	
  $scope.closeDialog = function() {
            // Easily hides most recent dialog shown...
           // no specific instance reference is needed.
            $mdDialog.hide();
        };

  /*html2canvas(document.body, {
	            onrendered: function(canvas) {
	            	
	                $rootScope.a = canvas;
	                	               
	                alert("Snapshot Taken");
	            }
  });*/

  

$scope.openEmail = function () {

	$mdDialog.show({
                controller: 'emailCtrl',
                templateUrl: 'views/loginEmail.html',
                resolve: {

                }
            })
  };

}]);

