DiginApp.controller('facebookCtrl',[ '$scope','$rootScope','$mdDialog','Digin_Domain','fbUrl','$sce', function ($scope,$rootScope,$mdDialog,Digin_Domain,fbUrl,$sce){
		$scope.$parent.currentView = "Facebook";

		$scope.fbUrl = $sce.trustAsResourceUrl('http://' + Digin_Domain+fbUrl);
}])