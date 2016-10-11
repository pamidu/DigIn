routerApp.controller('excelFileUploadCtrl', ['$scope', '$mdDialog', '$state', '$http', 'notifications', '$mdSidenav', 'Digin_Domain', 'Upload', 'Digin_Engine_API', '$diginurls', '$diginengine', function($scope, $mdDialog, $state, $http, notifications, $mdSidenav, Digin_Domain, Upload, Digin_Engine_API, $diginurls, $diginengine) {


    $scope.files = []; //Files imported array
    $scope.Folders = [];
    $scope.FileName;
    var uploadFlag = false;
    $scope.isExist = false;
    $scope.selectedPath;
    $scope.schemaCollection = [];
    $scope.client = $diginengine.getClient("BigQuery");
    $scope.client.getFolders(function(res, status) {

        $scope.Folders = res;

    });
    $scope.fieldTypeObj = ["STRING","BYTES","INTEGER","FLOAT","BOOLEAN","RECORD","TIMESTAMP","DATE","TIME","DATETIME"];

    //start of page one Folder name configuring
    $scope.currentNavItem = 'page1';
    $scope.newCollection = false;

    $scope.goto = function() {

            $scope.step1.$setUntouched();
            $scope.step1.$setPristine();
            $scope.newCollection = !$scope.newCollection;
        }
        //end of page one Folder name configuring

    //start of configuring pages
    $scope.currentStep = 0;
    $scope.schema = [];
    $scope.selectedStep = 0;
    $scope.stepProgress = 1;
    $scope.maxStep = 3;
    $scope.showBusyText = false;
    $scope.stepData = [{
        step: 1,
        completed: false,
        optional: false,
        data: {},
        busyText: "Proceeding to step 2"
    }, {
        step: 2,
        completed: false,
        optional: false,
        data: {},
        busyText: "Uploading File"
    }, {
        step: 3,
        completed: false,
        optional: false,
        data: {}
    }, ];

    $scope.enableNextStep = function nextStep() {

        if ($scope.selectedPath == "File" && uploadFlag == false) {
            $scope.stepProgress = 2;
            $scope.selectedStep = 2;
            $scope.schema = [];
            return;

        } else {
            //do not exceed into max step
            if ($scope.selectedStep >= $scope.maxStep) {
                return;
            }
            //do not increment $scope.stepProgress when submitting from previously completed step
            if ($scope.selectedStep === $scope.stepProgress - 1) {
                $scope.stepProgress = $scope.stepProgress + 1;
            }
            $scope.selectedStep = $scope.selectedStep + 1;
            $scope.stepProgress = $scope.selectedStep;
        }

    }
    $scope.selectFile = function(folder) {

        $scope.folderName = folder.file;
        $scope.isExist = true;
    }

    $scope.moveToPreviousStep = function moveToPreviousStep() {

            if ($scope.selectedPath == "File" && uploadFlag == false) {

                $scope.selectedStep = $scope.selectedStep - 2;
                $scope.schema = [];

            } else if ($scope.selectedStep > 0) {
                $scope.selectedStep = $scope.selectedStep - 1;
            }
        }
        //end of configuring pages


    $scope.submitCurrentStep = function submitCurrentStep(stepData, isSkip) {
        $scope.currentStep = stepData.step - 1;


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
        $scope.files = files;

        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
        var uploadFlag;
        var storeFlag;
        $scope.schemaCollection = [];
        if (files && files.length) {
            $scope.preloader = true;
            $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
            if ($scope.selectedPath == "File") {
                $scope.otherdata = {
                    "file_type": "datasource",
                    "folder_name": ""
                };
            } else {
                $scope.otherdata = {
                    "file_type": "datasource",
                    "folder_name": $scope.folderName
                };

            }
            for (var i = 0; i < files.length; i++) {
                var lim = i == 0 ? "" : "-" + i;
                $scope.FileName = files[i].name;
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
                    $scope.schema = data.Result;
                    angular.forEach($scope.schema,function(key){
                        key.type = key.type.toUpperCase();
                    });
                    $scope.schemaCollection.push($scope.schema);
                    uploadFlag = true;
                    $scope.preloader = false;
                    notifications.toast(1, "Schema retrieved  successfully");


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

    $scope.UploadWithUpdate = function() {
        $scope.preloader = true;
        if ($scope.files.length <= 0) {
            notifications.toast(0, "Please add a file");
            return;
        }
        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));

        if ($scope.selectedPath == "File") {
            $scope.folderName = '';
            $scope.folder_type = 'singlefile';
        } else {
            if ($scope.isExist) {
                $scope.folder_type = 'exist';
                $scope.schema = [];
            } else {
                $scope.folder_type = 'new';

            }
        }
        for (var i = 0; i < $scope.files.length; i++) {
            Upload.upload({
                url: Digin_Engine_API + 'insert_data',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: {
                    schema: JSON.stringify($scope.schema),
                    db: 'BigQuery',
                    SecurityToken: userInfo.SecurityToken,
                    filename: $scope.files[i].name,
                    folder_name: $scope.folderName,
                    folder_type: $scope.folder_type

                }

            }).success(function(data) {
                console.log(data);
                notifications.toast(1, "Successfully uploaded to the datawarehouse");
                uploadFlag = true;
                $scope.preloader = false;
                $scope.enableNextStep();

            }).error(function(data) {
                console.log(data);
                uploadFlag = false;
                notifications.toast(0, "There is an errror while uploading the file");
                $scope.preloader = false;
                $scope.diginLogo = 'digin-logo-wrapper2';
            });

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
