routerApp.controller('excelFileUploadCtrl', ['$scope', '$mdDialog', '$state', '$http', 'notifications', '$mdSidenav', 'Digin_Domain', 'Upload', 'Digin_Engine_API', '$diginurls', '$diginengine', function($scope, $mdDialog, $state, $http, notifications, $mdSidenav, Digin_Domain, Upload, Digin_Engine_API, $diginurls, $diginengine) {


    $scope.files = []; //Files imported array
    $scope.Folders = [];
    $scope.selectedFolder;
    $scope.fileChanged = function(e) {
        if (!e) e = window.event;
        var x = e.target || e.srcElement;

        for (i = 0, len = e.target.files.length; i < len; ++i) {

            var file = e.target.files[i];
            //console.log(file);
            $scope.files.push(file);
            $scope.$apply();
        }
        /*var fr = new FileReader();
			fr.onload = function(e) {
			    console.log(e.target.result);
			};
			fr.readAsText(e.target.files[0]);
			*/

    }
    $scope.client = $diginengine.getClient("BigQuery");
    $scope.client.getFolders(function(res, status) {

        $scope.Folders = res;

    });




    function AsyncIterator(arr, cReqs) {

        var funcComplete, funcPc, funcCompleteOne, funcProcess;
        var completeFlags = {};

        function nextElement(pIndex) {
            completeFlags[pIndex] = 1;
            var processObj = {
                index: pIndex,
                complete: function(success, data) {
                    if (funcCompleteOne)
                        funcCompleteOne({
                            index: this.index,
                            success: success,
                            data: data
                        });
                    completeProcessing(this.index);
                },
                changeProgress: function(val) {
                    if (funcPc)
                        funcPc({
                            index: this.index,
                            value: val
                        });
                }
            }

            if (funcProcess)
                funcProcess(arr[pIndex], processObj);

        }

        function completeProcessing(index) {
            completeFlags[index] = 2;
            var nextIndex = -1;
            for (i in completeFlags) {
                if (completeFlags[i] == 0) {
                    nextIndex = i;
                    break;
                }
            }
            if (nextIndex == -1) {
                var canTrigger = true;
                for (i in completeFlags)
                    if (completeFlags[i] != 2) {
                        canTrigger = false;
                        break;
                    }

                if (funcComplete && canTrigger) {
                    funcComplete();
                }
            } else {
                nextElement(nextIndex);
            }
        }

        return {
            onComplete: function(f) {

                funcComplete = f;
            },
            onProgressChanged: function(f) {
                funcPc = f;
            },
            onCompleteOne: function(f) {
                funcCompleteOne = f;
            },
            onProcessOne: function(f) {
                funcProcess = f;
            },
            Process: function() {

                if (!cReqs)
                    cReqs = 1;

                if (cReqs > arr.length)
                    cReqs = arr.length;

                for (var i = 0; i < arr.length; i++)
                    completeFlags[i] = 0;


                for (var i = 0; i < cReqs; i++)
                    nextElement(i);


            }
        }
    }


    //start of page one Folder name configuring
    $scope.currentNavItem = 'page1';
    $scope.newCollection = false;

    $scope.goto = function() {
            $scope.collection = ""; // Empty the form
            $scope.step1.$setUntouched();
            $scope.step1.$setPristine();
            $scope.newCollection = !$scope.newCollection;
        }
        //end of page one Folder name configuring

    //start of configuring pages
    $scope.currentStep = 0;
    $scope.selectedStep = 0;
    $scope.stepProgress = 1;
    $scope.maxStep = 3;
    $scope.showBusyText = false;
    $scope.stepData = [{
        step: 1,
        completed: false,
        optional: false,
        data: {},
        busyText: "Adding to Collection..."
    }, {
        step: 2,
        completed: false,
        optional: false,
        data: {},
        busyText: "Uploading Files..."
    }, {
        step: 3,
        completed: false,
        optional: false,
        data: {}
    }, ];

    $scope.enableNextStep = function nextStep() {
        //do not exceed into max step
        if ($scope.selectedStep >= $scope.maxStep) {
            return;
        }
        //do not increment $scope.stepProgress when submitting from previously completed step
        if ($scope.selectedStep === $scope.stepProgress - 1) {
            $scope.stepProgress = $scope.stepProgress + 1;
        }
        $scope.selectedStep = $scope.selectedStep + 1;
    }

    $scope.moveToPreviousStep = function moveToPreviousStep() {
            if ($scope.selectedStep > 0) {
                $scope.selectedStep = $scope.selectedStep - 1;
            }
        }
        //end of configuring pages


    $scope.submitCurrentStep = function submitCurrentStep(stepData, isSkip) {
        $scope.currentStep = stepData.step - 1;

        var submitObject = {
            domain: window.location.host,
            filename: $scope.collection.folderName,
            folderName: $scope.collection.folderName,
            schema: ""
        };
        $scope.showBusyText = true;
        var req = {
            method: "POST",
            url: "views/widgets/excelFileUpload/test.php",
            headers: {
                "Content-Type": "application/json"
                    //"SecurityKey" : $auth.getSecurityToken()
            },
            data: $scope.files
        };
        $http(req).then(function(data) {
                notifications.toast(1, "Post successful");
                stepData.completed = true;
                $scope.showBusyText = false;
                stepData.data.completed = true;
                $scope.enableNextStep();
            },
            function(data) {
                notifications.toast(0, "Error Occured");
            });

    }


    $scope.upload = function(files) {
        console.log(files);
        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
        var uploadFlag;
        var storeFlag;
        if (files && files.length) {
            $scope.preloader = true;
            $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
            $scope.otherdata = { "file_type":"datasource",  "folder_name": $scope.collection.folderName};
            for (var i = 0; i < files.length; i++) {
                var lim = i == 0 ? "" : "-" + i;
               
                Upload.upload({
                    url: Digin_Engine_API + 'file_upload',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    data: {
                        file: files[i],
                        db: 'BigQuery',
                        SecurityToken: userInfo.SecurityToken,
                        filename: files[i].name,
                        other_data: JSON.stringify($scope.otherdata)
                    }

                }).success(function(data) {
                    console.log(data);
                    uploadFlag = true;
                    console.log($scope.reports);
                    $scope.preloader = false;
                    $scope.diginLogo = 'digin-logo-wrapper2';
                    if (uploadFlag && storeFlag) {
                        fireMsg('1', 'Successfully uploaded!');
                        privateFun.getAllReport();
                    }
                }).error(function(data) {
                    console.log(data);
                    uploadFlag = false;
                    fireMsg('0', 'Error uploading file!');
                    $scope.preloader = false;
                    $scope.diginLogo = 'digin-logo-wrapper2';
                });
 

              
            }
        }
    };

    $scope.goToDashboard = function() {
        $state.go("home.Dashboards");
        $mdSidenav('right').toggle();
    }


    $scope.getFileDetails = function(e) {

        $scope.files = [];
        $scope.$apply(function() {

            // STORE THE FILE OBJECT IN AN ARRAY.
            for (var i = 0; i < e.files.length; i++) {
                $scope.files.push(e.files[i])
            }

        });
    };


    // UPDATE PROGRESS BAR.
    function updateProgress(e) {
        if (e.lengthComputable) {
            document.getElementById('pro').setAttribute('value', e.loaded);
            document.getElementById('pro').setAttribute('max', e.total);
        }
    }

    // CONFIRMATION.
    function transferComplete(e) {
        alert("Files uploaded successfully.");
    }

}])

routerApp.directive('customOnChange', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeFunc);
        }
    };
});
