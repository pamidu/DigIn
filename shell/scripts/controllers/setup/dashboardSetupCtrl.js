routerApp.controller('dashboardSetupCtrl', function ($scope, $mdDialog, $location, $http,
                                                     Digin_Engine_API, ngToast, $rootScope, $apps, $objectstore, Upload, 
                                                     Digin_Domain, Digin_Tenant, $state) {
    
    
    //main menu json
    $scope.menuJson = [{
        "name": "Account setting",
        "route": "user",
        "icon": "styles/css/images/setting/account_setting100x100.png"
    }, {
        "name": "New user",
        "route": "createUser",
        "icon": "styles/css/images/setting/user100x100.png"
    }, {
        "name": "Invite user",
        "route": "account",
        "icon": "styles/css/images/setting/invite_user100x100.png"
    }, {
        "name": "Group",
        "route": "group",
        "icon": "styles/css/images/setting/group100x100.png"
    }, {
        "name": "Share ",
        "route": "share",
        "icon": "styles/css/images/setting/share100x100.png"
    }, {
        "name": "User setting",
        "route": "userSettings",
        "icon": "styles/css/images/setting/user_setting100x100.png"
    },
    {
        "name": "User Profile",
        "route": "userProfile",
        "icon": "styles/css/images/setting/user100x100.png"
    }];

    
    //*Settings routing ---------------- 
    var slide = false;
    $scope.route = function (state) {
        if (state == "account") {
            $state.go('home.user');
        }
        else if (state == "group") {
            $state.go('home.group');
        }
        else if (state == "share") {
            $state.go('home.share');
        }
        else if (state == "user") {
            $state.go('home.account');
        }
        else if (state == "createUser") {
            $state.go('home.createUser');
        }
        else if (state == "userSettings") {
            $state.go('home.userSettings');
        }
        else if (state == "closeMain") {
            $state.go('home.Dashboards');
        }
        else if (state == "back") {
            $state.go('home.Settings');
        }
        else if (state == "userProfile") {
            $state.go('home.userProfile');
        }
    };


    //theme colors array
    $scope.colorArr = [{value: '#F44336'}, {value: '#E91E63'}, {value: '#9C27B0'}, {value: '#673AB7'}, {value: '#3F51B5'}, {value: '#2196F3'}, {value: '#03A9F4'}, {value: '#00BCD4'}, {value: '#009688'}, {value: '#4CAF50'}, {value: '#8BC34A'}, {value: '#CDDC39'}, {value: '#FFEB3B'}, {value: '#FFC107'}, {value: '#FF9800'}, {value: '#FF5722'}, {value: '#795548'}, {value: '#9E9E9E'}, {value: '#607D8B'}];
    
    //# load from parent
    var baseUrl = "http://" + window.location.hostname;
    //baseUrl="http://duotest.digin.io";
    //baseUrl="http://chamiladuosoftwarecom.space.duoworld.com";
    $scope.domain=JSON.parse(decodeURIComponent(getCookie('authData'))).Domain;


    $scope.apps=$scope.dashboards;
   
    $scope.selectedColorObj = {
        primaryPalette: "",
        accentPalette: ""
    };


    //add user view state
    $scope.addUsrState = false;
    
    $scope.selectedItems = [];
    $scope.selectedUsers = [];

    $scope.sharableObjs= $rootScope.sharableObjs;
    $scope.sharableUsers = $rootScope.sharableUsers;
    $scope.sharableGroups = $rootScope.sharableGroups;
    //$scope.sharableGroupsDtls = $scope.sharableGroupsDtls;


    $scope.currentPane = null;

    //breaking the coloArr into chunks of 6 colors    
    $scope.chunkedColorArr = chunk($scope.colorArr, 6);


//invite user ***  
$scope.inviteUser = function () {
    $scope.exist=false;
    $http.get(baseUrl+'/devportal/project/share/getusers')
        .success(function (response) {
            for(var i=0; i<response.length; i++){
                if($scope.user.email==response[i].EmailAddress){
                    $scope.exist=true;
                }
            };

            if($scope.exist==true){
                fireMsg('0', '<strong>Error : </strong>This user is already invited...');
                return;
            }
            else{
                $scope.invite();
            }

        }).error(function (error) {
           
        });
}

$scope.invite = function () {
        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
        $http.get(baseUrl + '/auth/tenant/AddUser/' + $scope.user.email + '/user', {
                headers: {'Securitytoken': userInfo.SecurityToken}
            })
            .success(function (response) {
                if(response=="false"){
                    fireMsg('0', '<strong>Error : </strong>This user not registered for Digin...!');
                }
                else{
                    //privateFun.getAllSharableObj();
                        //$scope.sharableObjs= $rootScope.sharableObjs;
                        //$scope.sharableUsers = $rootScope.sharableUsers;
                        //$scope.sharableGroups = $rootScope.sharableGroups;
                    fireMsg('1', '<strong>Success : </strong>Invitation sent successfully...!');
                    $scope.user.email='';
                }
            }).error(function (error) {
                fireMsg('0', 'Invitation not sent !');
        });
};



//*User Settngs Page
    $scope.sizes = [
        "5",
        "10",
        "15",
        "30"
    ];

    $scope.toppings = [
        {name: '1'},
        {name: '2'},
        {name: '3'},
        {name: '4'},
        {name: '5'},
        {name: '6'},
        {name: '7'},
        {name: '8'},
        {name: '9'},
        {name: '10'}
    ];

    $scope.requests = [
        {name: '1000'},
        {name: '2000'},
        {name: '3000'},
        {name: '4000'},
        {name: '5000'},
    ];

    $scope.clearDetails = [
        {name: "Clear Cache"}
    ];

    //-----------------
    $scope.headerbar = true;

//#Update account ***
    $scope.openLogoUploadWindow = function () {
        $mdDialog.show({
                controller: function fileUploadCtrl($scope, $rootScope, $mdDialog, fileUpload, $http, Upload) {

                    var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
                    var filename;

                    $scope.diginLogo = 'digin-logo-wrapper2';
                    $scope.preloader = false;
                    $scope.finish = function () {
                        $mdDialog.hide();
                    }
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    }

                    //$scope.$watch('files', function () {
                    //    $scope.upload($scope.files);
                    //});

                    $scope.$watch('file', function () {
                        if ($scope.file != null) {
                            $scope.files = [$scope.file];
                        }
                    });

                    $scope.upload = function (files) {
                        if (files && files.length) {
                            $scope.preloader = true;
                            $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
                            //for (var i = 0; i < files.length; i++) {
                                var i=0;
                                var lim = i == 0 ? "" : "-" + i;
                                console.log(userInfo);
                                filename = $scope.files[0].name;

                                Upload.upload({
                                    url: Digin_Engine_API + 'file_upload',
                                    headers: {'Content-Type': 'multipart/form-data',},
                                    data: {
                                        db: 'BigQuery',
                                        SecurityToken: userInfo.SecurityToken,
                                        Domain: Digin_Domain,
                                        other_data: 'userfile',
                                        file: files[0]
                                    }
                                }).success(function (data) {

                                    //store to user settings----------------------
                                    $scope.settings = {
                                        "email": userInfo.Email,
                                        "components": "dashboard1",
                                        "user_role": "admin",
                                        "cache_lifetime": 30,
                                        "widget_limit": 7,
                                        "query_limit": 1000,
                                        "logo_name": filename,
                                        "theme_config": "bla bla",
                                        "SecurityToken": userInfo.SecurityToken,
                                        "Domain": Digin_Domain
                                    }

                                    $http({
                                        method: 'POST',
                                        url: Digin_Engine_API + 'store_user_settings/',
                                        data: angular.toJson($scope.settings),
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'SecurityToken': userInfo.SecurityToken,
                                            'Domain': Digin_Domain
                                        }
                                    })
                                        .success(function (response) {
                                            $http.get(Digin_Engine_API + 'get_user_settings?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain)
                                                .success(function (data) {
                                                    console.log(data);
                                                    var logoPath = Digin_Engine_API.split(":")[0] + ":" + Digin_Engine_API.split(":")[1];
                                                    $rootScope.image = logoPath + data.Result.logo_path;
                                                    $scope.preloader = false;
                                                    $mdDialog.hide();
                                                    fireMsg('1', 'Logo Successfully uploaded!');
                                                });
                                        })
                                        .error(function (data) {
                                            $rootScope.image = "styles/css/images/DiginLogo.png";
                                            fireMsg('0', 'There was an error while uploading logo !');
                                            $scope.preloader = false;
                                        });
                                });
                            //}
                        }
                    };
                },
                templateUrl: 'views/logoUpload.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
            })
            .then(function (answer) {
                $scope.getURL();
            });
    };


    function fireMsg(msgType, content) {
        ngToast.dismiss();
        var _className;
        if (msgType == '0') {
            _className = 'danger';
        } else if (msgType == '1') {
            _className = 'success';
        }
        ngToast.create({
            className: _className,
            content: content,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            dismissOnClick: true
        });
    }


    //Get groups shared for specific apps //***
    $scope.viewGroupsInApp = function (appId, event) {
        //$http.get('http://digin.io/apis/usercommon/getUserFromGroup/'+app)
        $http.get(baseUrl + '/apis/usercommon/getUserFromGroup/' + appId)
            .success(function (response) {
                $scope.users = response;
            });
    };






    //validate group exist or not****
    $scope.isValidGroupName1=function(){
        if($scope.groupName==""){
            fireMsg('0', 'Group name can not be empty... !');
            return false;
        }
        else{
            return true;
        }
    };

    $scope.isValidGroupName2=function(){
        for (var i = 0; i < $rootScope.sharableGroupsDtls.length; i++) {
            var groupName=$rootScope.sharableGroupsDtls[i].groupname;
                if($scope.groupName==groupName){
                    return false;
                }
        }
        return true;
    };

    //------------
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.querySearch = querySearch;
    


    $scope.ContactChip = [];

      function querySearch(query) {
        var lowercaseQuery = angular.lowercase(query);
        var results = [];
        for (i = 0; i<$scope.sharableUsers.length;  i++) {
            var uName=$scope.sharableUsers[i].Name.toLowerCase();
            if (uName.indexOf(lowercaseQuery) != -1) {
                results.push($scope.sharableUsers[i]);
            }
        }
        return results;
    }

    //-----------


    //Add user group ***    
    $scope.createGroup = function () {

        //Validate group name
        if($scope.isValidGroupName1()==false){
            fireMsg('0', 'User group can not be empty..!');
            return;
        };

        if($scope.isValidGroupName2()==false){
            fireMsg('0', 'This user group is already created...!');
            return;
        };

        $scope.grpDtl = {
            "groupId": "-999",
            "groupname": $scope.groupName,
            //"users":  $scope.selectedUsers,
            "users":  $scope.ContactChip,
            "parentId": ""
        };
        $http({
            method: 'POST',
            url: baseUrl + '/apis/usercommon/addUserGroup',          
            data: angular.toJson($scope.grpDtl)
        })
        .success(function (response) {
            $scope.grpDtl = {
                "groupId": response.Data[0].ID,
                "groupname": $scope.groupName,
                //"users":  $scope.selectedUsers,
                "users":  $scope.ContactChip,
                "parentId": ""
            };
            $rootScope.sharableGroupsDtls.push($scope.grpDtl);
            ngToast.create({
                className: 'success',
                content: 'User group creates Successfully...!',
                horizontalPosition: 'center',
                verticalPosition: 'top',
                dismissOnClick: true
            }); 
            //$scope.selectedUsers = [];
            $scope.groupName = '';
            $scope.ContactChip = [];
            
        })
        .error(function (error) {
            //alert("Fail...!");
        });
  
    };

    //------------Delete  group***
    $scope.deleteGroup = function (group, index) {
        var confirm = $mdDialog.confirm()
            .title('Do you want to delete this group ?')
            .targetEvent(event)
            .ok('Yes!')
            .cancel('No!');
        $mdDialog.show(confirm).then(function () {
            //$http.get(baseUrl+'/apis/usercommon/removeUserGroup/'+group)
            $http.get(baseUrl+'/apis/usercommon/removeUserGroup/'+group)
                .success(function (response) {
                    $rootScope.sharableGroupsDtls.splice(index, 1);
                    ngToast.create({
                        className: 'success',
                        content: 'User group deleted Successfully...!',
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        dismissOnClick: true
                    });
                });
            }, function () {
        });
    };


    //------------Delete user from group ****
    $scope.deleteUserFromGroup = function (group, user) {
        var confirm = $mdDialog.confirm()
            .title('Do you want to delete this user ?')
            .targetEvent(event)
            .ok('Yes!')
            .cancel('No!');

        $mdDialog.show(confirm).then(function () {
            $scope.UsrDtl = {
                "groupId": group,
                "users": [user]
            };
            $http({
                method: 'POST',
                url: baseUrl+'/apis/usercommon/removeUserFromGroup',
                data: angular.toJson($scope.UsrDtl)
            })
                .success(function (response) {
                    //alert("Success...!");
                    $rootScope.privateFun.getAllSharableObj();
                    fireMsg('1', 'User deleted Successfully !');
                })
                .error(function (error) {
                    //alert("Fail...!");
                    fireMsg('1', 'Deletion fail..., Please try again !');
                });

        }, function () {

        });
    };

    //# Dashboard sharing 
    $scope.loadShareWindow = function (appId, appName) {    
        $scope.chk = function (cb) {
            $http.get(baseUrl+'/apis/usercommon/loadUiShareData/APP_SHELL_MY_ACCOUNT')//+appName
                .success(function (response) {
                    $scope.pickedObj=response;
                     cb(true);
                }).error(function (error) {
                    cb(false);
            });
        }

        $scope.chk(function(data){
            if(data){
                $mdDialog.show({
                    controller: dashboardshareCtrl,
                    templateUrl: 'views/shareApp.html',
                    resolve: {},
                    locals: {appId:appId, appName:appName, sharableObj:$scope.sharableObjs,pickedObj:$scope.pickedObj},
                });
            }
        });
    };

    $scope.viewSharedListWindow=function(appId, appName){
         $scope.chked = function (cb) {
            $http.get(baseUrl+'/apis/usercommon/loadUiShareData/APP_SHELL_MY_ACCOUNT')//+appName
                .success(function (response) {
                    $scope.pickedObj=response;
                     cb(true);
                }).error(function (error) {
                    cb(false);
            });
        }

        $scope.chked(function(data){
            if(data){
                $mdDialog.show({
                    controller: dashboardshareCtrl,
                    templateUrl: 'views/shareAppList.html',
                    resolve: {},
                    locals: {appId:appId, appName:appName, sharableObj:$scope.sharableObjs,pickedObj:$scope.pickedObj},
                });
            }
        });
    }


    var dashboardshareCtrl = function ($rootScope, $scope, appId, appName,sharableObj,pickedObj) {
        $scope.appId = appId;
        $scope.appName = appName;
        $scope.pickedObj = pickedObj;
        $scope.sharableObj = sharableObj;

        $scope.shareApp = function () {

            //*get all obj
            $scope.dataArr=[];

            for (var i = 0; i < pickedObj.length; i++) {
                //Save all obj
                var Id = pickedObj[i].id;
                var Name = pickedObj[i].name;
                $scope.Dtl = {
                    "id": Id,
                    "name": Name,
                    "type": "Group"
                };

                $scope.dataArr.push($scope.Dtl);
            }  

            //*Save detail
             $http({
                method: 'POST',
                url: baseUrl+'/apis/usercommon/saveUiShareData',
                data: angular.toJson($scope.dataArr)
            })
            .success(function (response) {
                alert("success...!");

            })
            .error(function (error) {
                alert("Fail...!");
            });
        };



        $scope.closeDialog = function () {
            $mdDialog.hide();
        };

    };


    //------------Add users to group
    $scope.loadAddUsersWindow = function (group,grpName, pickedUsers, allUsers) {

            //*get can sharable users

            $scope.remainUsers=[]; 
            for (var i=0; i< allUsers.length; i++) {
                 var exist=false;
                for(var j=0; j< pickedUsers.length; j++){
                    if (allUsers[i].Id ==  pickedUsers[j].Id) { 
                        exist=true;
                    }
                }   

                if(exist==false) {
                    $scope.remainUsers.push(allUsers[i]);  
                }           
            }   
            console.log($scope.remainUsers);
            //------------


            $mdDialog.show({
                controller: dashboardgroupCtrl,
                templateUrl: 'views/addUsersToGroup.html',
                resolve: {},
                locals: {grpId:group,grpName:grpName,remainUsers:$scope.remainUsers},
            });
    };


    //********
    var dashboardgroupCtrl = function ($scope, grpId,grpName,remainUsers) {

        $scope.grpId = grpId;
        $scope.grpName = grpName;
        $scope.remainUsers = remainUsers;
        $scope.newSelected=[];
    
        //------------Add users to group*******
        $scope.addUsersToGroup = function (newSelected) {
            //Add user to group
            $scope.userDtl = {
                "groupId": grpId,
                "users": newSelected
            };


            if ($scope.userDtl==[]){return;}
            $http({
                method: 'POST',
                url: baseUrl+'/apis/usercommon/addUserToGroup',
                data: angular.toJson($scope.userDtl)
            })
                .success(function (response) {
                    //alert("Success...!");
                    //for (var j = 0; j < newSelected.length; j++) {
                        //$rootScope.sharableGroupsDtls.push({groupId: grpId, groupname: grpName,users:newSelected[j]});
                    //}

                    
                      $http.get(baseUrl + "/apis/usercommon/getAllGroups")
                        .success(function(data) 
                        {
                            console.log(data); 
                            $rootScope.sharableGroupsDtls = [];
                            
                            for (var i = 0; i < data.length; i++) {
                                $scope.users=[];  //$scope.userNames=[];
                                for (var j = 0; j < data[i].users.length; j++) {
                                    $scope.users.push({Id: data[i].users[j].Id, Name: data[i].users[j].Name, mainTitle:data[i].users[j].mainTitle});     
                                }    
                                $rootScope.sharableGroupsDtls.push({groupId: data[i].groupId, groupname: data[i].groupname,users:$scope.users});
                            }
                                console.log($rootScope.sharableGroupsDtls);


                                 fireMsg('1', 'User/s added successfully !');
                                 $mdDialog.hide();


                        }).error(function(){
                            //alert ("Oops! There was a problem retrieving the groups");
                        });



                   
                })
                .error(function (error) {
                    //alert("Fail...!");
                });

            
        };


        $scope.closeDialog = function () {
            $mdDialog.hide();
        };
    };


    $scope.doSecondaryAction = function (user, event) {
        var confirm = $mdDialog.confirm()
            .title('Do you want to delete ' + user)
            .targetEvent(event)
            .ok('Yes!')
            .cancel('No!');
        $mdDialog.show(confirm).then(function () {
            console.log(JSON.stringify(user));
            $scope.status = 'Yes';
        }, function () {
            //alert('No!');
            $scope.status = 'No';
        });

    };


    //------TESTING END

//update refresh widget settings
    $scope.updateSettings = function () {

        if ($scope.cacheLifetime == undefined) {
            fireMsg('0', 'Invalid cache lifetime settings!');
            return;
        }
        else if ($scope.noOfWidget == undefined) {
            fireMsg('0', 'Invalid widgets settings!');
            return;
        }
        else if ($scope.reqLimit == undefined) {
            fireMsg('0', 'Invalid request limit settings!');
            return;
        }
        else if ($scope.cacheLifetime <= 0) {
            fireMsg('0', 'Invalid cache lifetime settings!');
            return;
        }
        else {
        }

        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));

        $scope.settings = {
            //"user_id": userInfo.UserID,
            "email": userInfo.Email,
            "components": "dashboard1",
            "user_role": "admin",
            "cache_lifetime": $scope.cacheLifetime,
            "widget_limit": $scope.noOfWidget,
            "query_limit": $scope.reqLimit,
            "logo_name": "",
            "theme_config": "bla bla",
            "SecurityToken": userInfo.SecurityToken,
            "Domain": userInfo.Domain
        }

        $http({
            method: 'POST',
            url: Digin_Engine_API + 'store_user_settings/',
            data: angular.toJson($scope.settings),
            headers: {
                'Content-Type': 'application/json',
                'SecurityToken': userInfo.SecurityToken,
                'Domain': Digin_Domain
            }
        })
            .success(function (response) {
                //alert("Success...!");
                fireMsg('1', 'User settings saved Successfully !');
            })
            .error(function (error) {
                fireMsg('0', 'Please re-check the settings !');
            });
    };


//Clear cache
    $scope.clearCache = function () {
        var confirm = $mdDialog.confirm()
            .title('Do you want to clear cache ?')
            .targetEvent(event)
            .ok('Yes!')
            .cancel('No!');
        $mdDialog.show(confirm).then(function () {
            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
            if ($scope.clearDetail == undefined) {
                fireMsg('0', 'Select cache clear option !');
                return;
            }
            else {
            }

            $http({
                method: 'POST',
                url: Digin_LogoUploader + 'clear_cache',
                headers: {
                    'Content-Type': 'Content-Type:application/json',
                    'SecurityToken': userInfo.SecurityToken,
                    'Domain': userInfo.Domain
                }
            })
                .success(function (response) {
                    fireMsg('1', 'Cache Cleared Successfully !');
                })
                .error(function (error) {
                    fireMsg('0', 'Please select the cache clear option !');
                });
        }, function () {

        });
    };
    //------------------



//----------New user registration controler***
       
        $scope.validateEmail= function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };

        $scope.registerUser= function () {

            var fullname = $scope.fname + " " + $scope.lname;

            $scope.user ={
            "EmailAddress": $scope.email,
            "Name": fullname,
            "Password": "password",
            "ConfirmPassword": "password",
            "Active": false
            };
            
            
            $scope.error.isLoading = true;
            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
            
            $http({
                method: 'POST',
                url: '/auth/RegisterTenantUser',
                data: angular.toJson($scope.user),
                headers: {
                     'Content-Type': 'application/json',
                    'Securitytoken': userInfo.SecurityToken
                }
            }).success(function (data) {
              
                $scope.error.isLoading = false;
                fireMsg('1', 'User profile created successfully and, sent email for account verification!');
                $scope.fname = '';
                $scope.lname = '';
                $scope.email = '';
            }).error(function (data) {
                $scope.error.isLoading = false;            
            });
        };
       

        $scope.CreateUser = function () {
            //validation
            if ($scope.fname == '' || angular.isUndefined($scope.fname)) {
                fireMsg  ('0', '<strong>Error : </strong>first name is required..');
                focus('$scope.fname');
                return;
            } else if ($scope.lname == '' || angular.isUndefined($scope.lname)) {
                fireMsg('0', '<strong>Error : </strong>last name is required..');
                focus('$scope.lname');
                return;
            }
            else if ($scope.email == '' || angular.isUndefined($scope.email)) {
                fireMsg('0', '<strong>Error : </strong>email address is required..');
                focus('$scope.email');
                return;
            }
            else if (!$scope.validateEmail($scope.email)) {
                fireMsg('0', '<strong>Error : </strong>invalid email address is required..');
                focus('$scope.email');
                return;
            } 
            else {
            
                $http.get('/auth/GetUser/'+$scope.email)
                .success(function(response){
                    if(response.Error){
                        $scope.registerUser(); 
                    }
                    else{
                        fireMsg('0', '<strong>Error : </strong>User email already exist...!');
                    }   
                }).error(function(error){   
                    fireMsg('0', '<strong>Error : </strong>Please try again...!');
                });  
                
                
            }
        }
     


    //update code damith
    //on click then view addNew window
    $scope.addNewGroup = function () {
        $("#addNewUserGroup").animate({left: '0px'});
    };
    $scope.addNewGroupClose = function () {
        $("#addNewUserGroup").animate({left: '-100%'});
    };


    //#User Profile settings
<<<<<<< HEAD
        //#User Profile settings
    $scope.updateProfile= function () {

            var fullname = $scope.fname + " " + $scope.lname;

            $scope.userProfile ={
                 "BannerPicture":"img/cover.png",
                 "BillingAddress":$scope.address,
                 "Company":$scope.company,
                 "Country":$scope.country,
                 "Email":$scope.email,
                 "Name":$scope.name,
                 "PhoneNumber":$scope.phoneNo,
                 "ZipCode":$scope.zipCode
            };
            
            
            $scope.error.isLoading = true;

            $http({
                method: 'POST',
                //url:'http://test.digin.io/apis/profile/userprofile',
                url: baseUrl+'/apis/profile/userprofile',
                data: angular.toJson($scope.userProfile),
                headers: {
                     'Content-Type': 'application/json',
                }
            }).success(function (data) {
                $scope.error.isLoading = false;
                fireMsg('1', 'User profile updated successfully !');
                $scope.fname = '';
                $scope.lname = '';
                $scope.email = '';
            }).error(function (data) {
                $scope.error.isLoading = false;            
            });
     };


    $scope.viewUserProfile=function(){
        $http.get('http://test.digin.io/apis/profile/userprofile/test@duosoftware.com')
        //$http.get(baseUrl+'/apis/profile/userprofile/'+$scope.username)
            .success(function(response){
                //#load exisitging data
                // $scope.address=BillingAddress
                // $scope.company=Company
                // $scope.country=Country
                // $scope.email=Email
                // $scope.name=Name
                // $scope.phoneNo=PhoneNumber
                // $scope.zipCode=ZipCode
            }).error(function(error){   
                //fireMsg('0', '<strong>Error : </strong>Please try again...!');
            });  
    };
=======
    // $scope.updateProfile= function () {
>>>>>>> 505a7e583f43fe45aea8a3fc8d4a6ab86bf288e4

    //         var fullname = $scope.fname + " " + $scope.lname;

    //         $scope.userProfile ={
    //              "BannerPicture":"img/cover.png",
    //              "BillingAddress":$scope.address,
    //              "Company":$scope.company,
    //              "Country":$scope.country,
    //              "Email":$scope.email,
    //              "Name":$scope.name,
    //              "PhoneNumber":$scope.phoneNo,
    //              "ZipCode":$scope.zipCode
    //         };
            
            
    //         $scope.error.isLoading = true;
    //         var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
            
    //         $http({
    //             method: 'POST',
    //             //url: 'http://test.digin.io/apis/profile/getuserprofile/dilani@duosoftware.com',
    //             url: baseUrl+'/apis/profile/getuserprofile/dilani@duosoftware.com',
    //             data: angular.toJson($scope.userProfile),
    //             headers: {
    //                  'Content-Type': 'application/json',
    //                 'Securitytoken': userInfo.SecurityToken
    //             }
    //         }).success(function (data) {
              
    //             $scope.error.isLoading = false;
    //             fireMsg('1', 'User profile created successfully and, sent email for account verification!');
    //             $scope.fname = '';
    //             $scope.lname = '';
    //             $scope.email = '';
    //         }).error(function (data) {
    //             $scope.error.isLoading = false;            
    //         });
    //     };











});


