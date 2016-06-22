routerApp.controller('dashboardSetupCtrl', function ($scope, $mdDialog, $location, $http,
                                                     Digin_Engine_API, ngToast, $rootScope, $apps, $objectstore, Upload, 
                                                     Digin_Domain, Digin_Tenant, $state) {

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

    };

    //-------------------------------------------
    // $scope.myCol = [{
    //     url: './image.jpg',
    //     name: 'Some Title',
    //     email: 'test@text.com',
    //     list: [{email: 'test_two@text.com', url: 'image_two.jpg'}]
    // },{
    //     name: 'Another Title',
    //     list: [{email: 'test@text.com', url: 'image.jpg'}]
    // }];

    // $scope.returnedValues = [];

    //-----------
    
    //$scope.listItems = [{ name: "Mini Cooper", id: 0 }, { name: "Lexus IS250", id: 1 }, { name: "Ford F150", id: 2 }, { name: "Toyota Prius", id: 3 }];
    //---------------------------------------------

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

    $scope.sharableObjs= $scope.sharableObjs;
    $scope.sharableUsers = $scope.sharableUsers;
    $scope.sharableGroups = $scope.sharableGroups;
    //$scope.sharableGroupsDtls = $scope.sharableGroupsDtls;


    $scope.currentPane = null;

    //breaking the coloArr into chunks of 6 colors    
    $scope.chunkedColorArr = chunk($scope.colorArr, 6);


//invite user ***
    $scope.inviteUser = function () {

        //var userInfo = JSON.parse(getCookie("authData"));
        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
        //-----Add user
        
        //http://duotest.digin.io/auth/tenant/AddUser/chamila@duosoftware.com/user
        $http.get(baseUrl + '/auth/tenant/AddUser/' + $scope.user.email + '/user', {
                headers: {'Securitytoken': userInfo.SecurityToken}
            })
            .success(function (response) {
                //alert(JSON.stringify(response));
                //------if invited check invited or ----------
                if (response) {
                    $http.get(Digin_Tenant + '/GetUser/' + $scope.user.email, {})
                        .success(function (data) {
                            //alert(JSON.stringify(data));
                            fireMsg('1', 'Successfully invited !');
                            $scope.user.email = '';
                        });
                }
                else {
                }
            }).error(function (error) {
            //console.log(error);
            fireMsg('0', 'Invitation not sent !');
        });
    };



    // $scope.goToPerson = function (person, event) {
    //     $mdDialog.show(
    //         $mdDialog.alert()
    //             .title('Navigating')
    //             //.textContent('Inspect ' + person)
    //             .ariaLabel('Person inspect demo')
    //             .ok('Neat!')
    //             .targetEvendt(event)
    //     );
    // };

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

    // $scope.updateAccount = function () {
    //     if ($scope.image == "") {
    //         $rootScope.image = "styles/css/images/DiginLogo.png";
    //     }
    //     else {
    //         $rootScope.image = $scope.image;
    //     }

    //     $scope.getURL();
    //     $scope.image = "";

    //     if ($scope.headerbar) {
    //         document.getElementById('mainHeadbar').style.display = "block";
    //     }
    //     else {
    //         $scope.pinHeaderbar(false);
    //         document.getElementById('mainHeadbar').style.display = "none";
    //     }
    // };

//#Update account ***
    $scope.openLogoUploadWindow = function () {
        $mdDialog.show({
                controller: function fileUploadCtrl($scope, $rootScope, $mdDialog, fileUpload, $http, Upload) {

                    var userInfo = JSON.parse(getCookie("authData"));
                    var filename;

                    $scope.diginLogo = 'digin-logo-wrapper2';
                    $scope.preloader = false;
                    $scope.finish = function () {
                        $mdDialog.hide();
                    }
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    }

                    $scope.$watch('files', function () {
                        $scope.upload($scope.files);
                    });

                    $scope.$watch('file', function () {
                        if ($scope.file != null) {
                            $scope.files = [$scope.file];
                        }
                    });

                    $scope.upload = function (files) {
                        if (files && files.length) {
                            $scope.preloader = true;
                            $scope.diginLogo = 'digin-logo-wrapper2 digin-sonar';
                            for (var i = 0; i < files.length; i++) {
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
                                        file: files[i]
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
                            }
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

    //--------msg s------
    // var privateFun = (function () {
    //     return {
    //         fireMsg: function (msgType, content) {
    //             ngToast.dismiss();
    //             var _className;
    //             if (msgType == '0') {
    //                 _className = 'danger';
    //             } else if (msgType == '1') {
    //                 _className = 'success';
    //             }
    //             ngToast.create({
    //                 className: _className,
    //                 content: content,
    //                 horizontalPosition: 'center',
    //                 verticalPosition: 'top',
    //                 dismissOnClick: true
    //             });
    //         }
    //     }
    // })();
    //---------msg e---------


//------TESTING START

    // $scope.selectedItem = null;
    // $scope.searchText = null;

    // $scope.querySearch = querySearch;

    // $scope.sharableUsers = [{
    //     Name: 'Steve',
    //     UserID: '500'
    // }, {
    //     Name: 'Shane',
    //     UserID: '100'
    // }, {
    //     Name: 'Ryan',
    //     UserID: '200'
    // }, {
    //     Name: 'Nick',
    //     UserID: '300'
    // }, {
    //     Name: 'Iann',
    //     UserID: '400'
    // }];

    // $scope.ContactChip = [];

    // function querySearch(query) {
    //     //$scope.getAllContacts();
    //     var results = [];
    //     for (i = 0, len = $scope.sharableUsers.length; i < len; ++i) {
    //         //if ($scope.ContactDetails[i].groupname.indexOf(query.toLowerCase()) != -1) {
    //         if ($scope.sharableUsers[i].name.indexOf(query) != -1) {
    //             //if ($scope.ContactDetails[i].name.indexOf(query.toLowerCase()) != -1) {
    //             results.push($scope.sharableUsers[i]);
    //         }
    //     }
    //     return results;
    // }

    //Get users in a specific group
    // $scope.viewUsersInGroup = function (group, cb) {
    //     $http.get(baseUrl + '/apis/usercommon/getUserFromGroup/' + group)
    //         .success(function (response) {
    //             if (cb)cb(response);
    //             else $scope.users = response;
    //         });
    // };




    // $scope.expandCallback = function (index, id) {
    //     console.log('expanded pane:', index, id);
    //     if (typeof $scope.currentPane != null)
    //         $scope.accordion.collapse($scope.currentPane)
    //     $scope.currentPane = id;
    // };


    //Get groups shared for specific apps //***
    $scope.viewGroupsInApp = function (appId, event) {
        //$http.get('http://digin.io/apis/usercommon/getUserFromGroup/'+app)
        $http.get(baseUrl + '/apis/usercommon/getUserFromGroup/' + appId)
            .success(function (response) {
                $scope.users = response;
            });
    };

    //Get all existing user groups
    // $scope.getAllGroups = function () {
    //     $scope.load = true;
    //     $http.get('http://' + Digin_Domain + '/apis/usercommon/getAllGroups')
    //         .success(function (response) {
    //             $scope.groups = response;
    //             $scope.load = false;
    //         });
    // };


   

    //Get all apps
    //$scope.getAllApps = function () {
        //$scope.apps=$scope.dashboards;

        // $objectstore.getClient("duodigin_dashboard")
        //     .onGetMany(function (data) {
        //         if (data) {
        //             allApps = data;
        //         }
        //         $scope.apps = data;
        //     })
        //     .getByKeyword("*");
    //};





    //Get all contact in tenent
    // $scope.getAllContacts = function () {
    //     $http.get(Digin_Tenant + '/tenant/GetUsers/' + $mainDomain)
    //         .success(function (response) {
    //             $scope.sharableUsers = response;
    //         });
    // };


    // $scope.goToGroup = function (group, event) {
    //     $mdDialog.show(
    //         $mdDialog.alert()
    //             .title('Navigating')
    //             //.textContent('Inspect ' + person)
    //             .ariaLabel('Group inspect demo')
    //             .ok('Neat!')
    //             .targetEvent(event)
    //     );
    // };

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
            "users":  $scope.selectedUsers,
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
                "users":  $scope.selectedUsers,
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
            $scope.selectedUsers = [];
            $scope.groupName = '';
            
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
            //Save group detail
            var grpId = $scope.pickedObj[i].groupId;
            var grpName = $scope.pickedObj[i].groupname;
            $scope.GrpDtl = {
                "id": grpId,
                "image": "",
                "name": grpName,
                "type": "Group"
            };
            $http({
                method: 'POST',
                url: baseUrl+'/apis/usercommon/saveUiShareData',
                data: angular.toJson($scope.GrpDtl)
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
        //$scope.viewUsersInGroup(group, function (data) {
            $mdDialog.show({
                controller: dashboardgroupCtrl,
                templateUrl: 'views/addUsersToGroup.html',
                resolve: {},
                locals: {grpId:group,grpName:grpName,pickedUsers:pickedUsers,allUsers:allUsers},
            });
        //});

    };


    //********
    var dashboardgroupCtrl = function ($scope, grpId,grpName, pickedUsers, allUsers) {

        $scope.grpId = grpId;
        $scope.grpName = grpName;
        $scope.pickedUsers = pickedUsers;
        $scope.allUsers = allUsers;
    
        //------------Add users to group*******
        $scope.addUsersToGroup = function () {
            //Add user to group
            $scope.userDtl = {
                "groupId": grpId,
                "users": pickedUsers
            };

            $http({
                method: 'POST',
                url: baseUrl+'/apis/usercommon/addUserToGroup',
                data: angular.toJson($scope.userDtl)
            })
                .success(function (response) {
                    //alert("Success...!");
                    fireMsg('1', 'User/s added successfully !');
                })
                .error(function (error) {
                    //alert("Fail...!");
                });

            $mdDialog.hide();
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



//----------New user registration controler


        $scope.isUserExist=function (email, cb) {  
            $http.get('http://104.197.27.7:3048/GetUser/'+email)
            .success(function(response){
                cb(true);  
            }).error(function(error){   
                //alert("Fail !"); 
                cb(false);
            });     
        };

        //Send confirmation mail for registration
         $scope.sendConfirmationMail=function (mailTo,fName,dtSetName) {
            $scope.mailData ={
                 "type": "email",
                 "to": mailTo,
                 "subject": "Digin-RegistrationConfirmation",
                 "from": "Digin <noreply-digin@duoworld.com>",
                 "Namespace": "com.duosoftware.com",
                 "TemplateID": "registration_confirmation2",
                 "DefaultParams": {
                  "@@name@@": fName,
                  "@@dataSet@@":dtSetName
                 },
                 "CustomParams": {
                  "@@name@@": fName,
                  "@@dataSet@@":dtSetName
                 }
                };

                $http({
                        method: 'POST',
                        url: 'http://104.197.27.7:3500/command/notification',
                        data: angular.toJson($scope.mailData),
                        headers: {'Content-Type': 'application/json',
                                  'securitytoken': '1234567890'
                                }
                })
                .success(function(response){
                    //alert(JSON.stringify(response)); 
                    fireMsg('1', 'Profile  created successfully and, sent email for verification...!'); 
                    $scope.fname='';
                    $scope.lname='';
                    $scope.email='';
                    $scope.fname.focus;

                })
                .error(function(error){   
                    //alert("Fail !");  
                    fireMsg('0', 'Failed to create profile...!');                      
                });     
        };


       
        $scope.validateEmail= function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };

        $scope.registerUser= function () {

            var fullname = $scope.fname + " " + $scope.lname;
            $scope.user = {
                "EmailAddress": $scope.email,
                "Name": fullname,
                "Password": "user@123",
                "ConfirmPassword": "user@123",
                "Domain": $scope.domain
            };
            $scope.error.isLoading = true;

            $http({
                method: 'POST',
                url: 'http://104.197.27.7:3048/UserRegistation/',
                data: angular.toJson($scope.user),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }

            }).success(function (data, status, headers, config) {
              
                $scope.error.isLoading = false;
                var email=$scope.email;
                var dtSetName = email.replace('@', "_");
                    dtSetName = dtSetName.replace('.', '_');
                $scope.sendConfirmationMail($scope.email,$scope.fname,dtSetName);
                //fireMsg('1', 'Successfully created your profile,Please check your Email for verification!');

            }).error(function (data, status, headers, config) {
                $scope.error.isLoading = false;
             
            });
        };
       

        $scope.CreateUser = function () {
            //validation
            if ($scope.fname == '' || angular.isUndefined($scope.fname)) {
                fireMsg  ('0', '<strong>Error : </strong>first name is required..');
                //$scope.error.isFirstName = true;
                focus('$scope.fname');
                return;
            } else if ($scope.lname == '' || angular.isUndefined($scope.lname)) {
                fireMsg('0', '<strong>Error : </strong>last name is required..');
                //$scope.error.isLastName = true;
                focus('$scope.lname');
                return;
            }
            else if ($scope.email == '' || angular.isUndefined($scope.email)) {
                fireMsg('0', '<strong>Error : </strong>email address is required..');
                //$scope.error.isEmail = true;
                focus('$scope.email');
                return;
            }
            else if (!$scope.validateEmail($scope.email)) {
                fireMsg('0', '<strong>Error : </strong>invalid email address is required..');
                //$scope.error.isEmail = true;
                focus('$scope.email');
                return;
            } 
            else {
                //validation TRUE
                    $scope.isUserExist($scope.email, function(data){
                    if(data){
                        fireMsg('0', '<strong>Error : </strong>User email already exist...');
                        //$scope.error.isEmail = true;
                        focus('$scope.email');
                        return;
                    }else{
                        $scope.registerUser();
                        return;
                    }
                });
            }
        }
   










//-----------------
















});


