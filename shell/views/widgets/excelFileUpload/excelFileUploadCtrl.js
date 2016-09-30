routerApp.controller('excelFileUploadCtrl',[ '$scope','$mdDialog', '$state' ,'$http','notifications','$mdSidenav',function ($scope,$mdDialog, $state ,$http, notifications,$mdSidenav){
		
	var vm = this;
	vm.files = []; //Files imported array
	
	vm.fileChanged = function(e)
	{
		if( !e ) e = window.event;
		var x = e.target||e.srcElement;
		
		for (i = 0, len = e.target.files.length; i<len; ++i){

			var file = e.target.files[i];
			//console.log(file);
			vm.files.push(file);
			$scope.$apply();
		}

	}
	
	function AsyncIterator (arr, cReqs){

		var funcComplete, funcPc, funcCompleteOne, funcProcess;
		var completeFlags = {};
		
		function nextElement(pIndex){
			completeFlags[pIndex] = 1;
			var processObj = {
				index: pIndex,
				complete: function (success, data){
					if (funcCompleteOne)
						funcCompleteOne({index: this.index, success: success, data: data});
					completeProcessing(this.index);
				},
				changeProgress: function(val){
					if (funcPc)
						funcPc({index: this.index, value: val});
				} 
			}

			if (funcProcess)
				funcProcess(arr[pIndex], processObj);

		}

		function completeProcessing(index){
			completeFlags[index] = 2;
			var nextIndex=-1;
			for (i in completeFlags){
				if (completeFlags[i] == 0){
					nextIndex = i;
					break;
				}
			}
			if (nextIndex == -1){
				var canTrigger = true;
				for (i in completeFlags)
				if (completeFlags[i] != 2){
					canTrigger = false;
					break;
				}
				
				if (funcComplete && canTrigger)
				{
					funcComplete();
				}
			}else {
				nextElement(nextIndex);
			}			
		}

		return {
			onComplete: function(f){
				
				funcComplete = f;
			},
			onProgressChanged : function(f){
				funcPc = f;
			},
			onCompleteOne: function(f){
				funcCompleteOne = f;
			},
			onProcessOne: function(f){
				funcProcess = f;
			},
			Process: function(){

				if (!cReqs)
					cReqs = 1;
				
				if (cReqs > arr.length)
					cReqs = arr.length;
				
				for (var i=0;i<arr.length;i++)
					completeFlags[i] = 0;
					

				for (var i=0;i<cReqs;i++)
					nextElement(i);
				
				
			}
		}
	}
	
	
	//start of page one Folder name configuring
	vm.currentNavItem = 'page1';
	vm.newCollection = false;
	
	vm.goto = function()
	{
		vm.collection = ""; // Empty the form
		$scope.step1.$setUntouched();
		$scope.step1.$setPristine();
		vm.newCollection = !vm.newCollection;
	}
	//end of page one Folder name configuring
	
	//start of configuring pages
	vm.currentStep = 0;	
    vm.selectedStep = 0;
    vm.stepProgress = 1;
    vm.maxStep = 3;
    vm.showBusyText = false;
    vm.stepData = [
        { step: 1, completed: false, optional: false, data: {}, busyText: "Adding to Collection..." },
        { step: 2, completed: false, optional: false, data: {}, busyText: "Uploading Files..."  },
        { step: 3, completed: false, optional: false, data: {} },
    ];

    vm.enableNextStep = function nextStep() {
        //do not exceed into max step
        if (vm.selectedStep >= vm.maxStep) {
            return;
        }
        //do not increment vm.stepProgress when submitting from previously completed step
        if (vm.selectedStep === vm.stepProgress - 1) {
            vm.stepProgress = vm.stepProgress + 1;
        }
        vm.selectedStep = vm.selectedStep + 1;
    }

    vm.moveToPreviousStep = function moveToPreviousStep() {
        if (vm.selectedStep > 0) {
            vm.selectedStep = vm.selectedStep - 1;
        }
    }
	//end of configuring pages
	
	
    vm.submitCurrentStep = function submitCurrentStep(stepData, isSkip) {
		vm.currentStep = stepData.step -1;

		var submitObject = {domain: window.location.host, filename: vm.collection.folderName, folderName: vm.collection.folderName, schema: ""};
		vm.showBusyText = true;
		var req = {
			method: "POST",
			url: "views/widgets/excelFileUpload/test.php",
			headers: {
				"Content-Type": "application/json"
				//"SecurityKey" : $auth.getSecurityToken()
			},
			data: submitObject
		};
		$http(req).then(function(data)
		{
			notifications.toast(1,"Post successful");
			stepData.completed = true;
			vm.showBusyText = false;
            stepData.data.completed = true;
			vm.enableNextStep();
		},
		function(data)
		{
			notifications.toast(0,"Error Occured");
		});
	
    }
	
	vm.upload = function(e, stepData)
	{
		vm.currentStep = stepData.step -1;
		
		if(vm.files.length != 0)
		{
			vm.showBusyText = true;
			
			var iterator = new AsyncIterator(vm.files, 2);
			
			iterator.onProcessOne(function(item, controller){
				$http({
					url: "views/widgets/excelFileUpload/test.php",
					method: 'POST',
					data: item,
					uploadEventHandlers: {
						progress: function(e) {
							if(e.lengthComputable) {
								var progress = (e.loaded / e.total) * 100;
								controller.changeProgress(progress);
							}
						}
					}
				}).then(function(data){
					controller.complete(true, data);
				},
				
				function(data)
				{
					controller.complete(false, {});
				});   
			});
			
			iterator.onCompleteOne(function(data){
				console.log(data.index);
			});

			iterator.onProgressChanged(function(pObj){
				vm.files[pObj.index].progressCounter = pObj.value;
			});
			
			iterator.onComplete(function(){
				console.log("upload complete");
				vm.showBusyText = false;
				//move to next step when success
				stepData.data.completed = true;

				vm.enableNextStep();
			});
			iterator.Process();
		}else{
			notifications.toast(0,"There are no files to be uploaded.");
		}
	}	
	
	vm.goToDashboard = function()
	{
		$state.go("home.Dashboards");
		$mdSidenav('right').toggle();
	}
	
}])

routerApp.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeFunc);
    }
  };
});