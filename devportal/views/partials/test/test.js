window.devportal.partials.test = function($scope, $dev, $state,$fileReader){
	$dev.states().setIdle();
	
    $scope.onFileSelect = function(file){
    	$scope.fileForm = file;
        $fileReader.readAsDataUrl(file, $scope).then(function(result,b,c) {
      		$scope.imageSrc = result;
      	});
    }

    $scope.submit = function(){
    	/*
    	$dev.editor().uploadFile("123","/test.txt", $scope.fileForm).success(function(){
    		alert ("Success");
    	}).error(function(){
			alert ("Error");
    	});
*/

    	$dev.project().iconUpload("123",$scope.fileForm ? $scope.fileForm : "N/A").success(function(){
    		alert ("Success");
    	}).error(function(){
			alert ("Error");
    	});
    };
}