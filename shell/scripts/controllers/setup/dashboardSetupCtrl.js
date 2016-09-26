routerApp.controller('dashboardSetupCtrl', function ($scope, $mdDialog, $location, $http,
                                                     Digin_Engine_API, ngToast, $rootScope, $apps, $objectstore, Upload,
                                                     Digin_Domain, Digin_Tenant, $state,ProfileService) {
    
    
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

	$scope.usageDetails = {};
	$http.get("http://prod.digin.io:1929/get_usage_summary?SecurityToken="+getCookie('securityToken'))
	.success(function(data){
		console.log(data.Result);
		$scope.usageDetails = data.Result;
	}).error(function(){
		console.log("error");
	});
    
    
    //*Settings routing ---------------- 
    var slide = false;
    $scope.route = function (state) {
		  $state.go('home.welcomeSearch');
    };

    $scope.userSetingsUrl =$rootScope.image ? $rootScope.image : "styles/css/images/setting/account_settings.png";
    $rootScope.$watch('image', function(newValue, oldValue) {
        $scope.userSetingsUrl =$rootScope.image;
    });


    //theme colors array
    $scope.colorArr = [{value: '#F44336'}, {value: '#E91E63'}, {value: '#9C27B0'}, {value: '#673AB7'}, {value: '#3F51B5'}, {value: '#2196F3'}, {value: '#03A9F4'}, {value: '#00BCD4'}, {value: '#009688'}, {value: '#4CAF50'}, {value: '#8BC34A'}, {value: '#CDDC39'}, {value: '#FFEB3B'}, {value: '#FFC107'}, {value: '#FF9800'}, {value: '#FF5722'}, {value: '#795548'}, {value: '#9E9E9E'}, {value: '#607D8B'}];
    
    //# load from parent
    var baseUrl = "http://" + window.location.hostname;
 //#to get tenant ID for logged user
        $http.get(Digin_Tenant+'/tenant/GetTenants/'+getCookie('securityToken'))
            .success(function (data) {
                console.log(data);
                $rootScope.TenantID = data[0].TenantID;
            }).error(function () {
                //alert("Oops! There was a problem retrieving the groups");
        });


    //var baseUrl = "http://" + $rootScope.TenantID;
    //baseUrl="http://duotest.digin.io";
    //baseUrl="http://chamiladuosoftwarecom.space.duoworld.com";
    $scope.domain=JSON.parse(decodeURIComponent(getCookie('authData'))).Domain;
    //baseUrl="http://"+$scope.domain;


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
    //$scope.myCroppedImage=$rootScope.myCroppedImage;
    $scope.profile_pic=$rootScope.profile_pic;

    $scope.currentPane = null;

    //breaking the coloArr into chunks of 6 colors    
    $scope.chunkedColorArr = chunk($scope.colorArr, 6);


//invite user ***  
/*
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
*/

    
    

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

                                displayProgress('Uploading...'); 

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
                                        other_data: 'logo',
                                        file: files[0]
                                    }
                                }).success(function (data) {

                                    //#chk undefined values
                                    var dp_name="";
                                    var logo_name="";
                                    var components; var userRole; var cacheLifetime; var widgetLimit; var themeConfig; var queryLimit;
                                    if($rootScope.userSettings.components==undefined) {components=0;} else {components=$rootScope.userSettings.components}
                                    if($rootScope.userSettings.user_role==undefined) {userRole="";} else {userRole=$rootScope.userSettings.user_role}
                                    if($rootScope.userSettings.cache_lifetime==undefined) {cacheLifetime=0;} else {cacheLifetime=$rootScope.userSettings.cache_lifetime}
                                    if($rootScope.userSettings.widget_limit==undefined) {widgetLimit=0;} else {widgetLimit=$rootScope.userSettings.widget_limit}
                                    if($rootScope.userSettings.query_limit==undefined) {queryLimit=0;} else {queryLimit=$rootScope.userSettings.query_limit}
                                    if($rootScope.userSettings.dp_path==undefined) {dp_name="";} else {dp_name=$rootScope.userSettings.dp_path.split("/").pop();}
                                    if($rootScope.userSettings.logo_path==undefined) {logo_name="";} else {logo_name=$rootScope.userSettings.logo_path.split("/").pop();}
                                    if($rootScope.userSettings.theme_config==undefined) {themeConfig="";} else {themeConfig=$rootScope.userSettings.theme_config}     
                                         

                                    //#store to user settings---------------------
                                    $scope.settings = {
                                        "email": userInfo.Email,
                                        "components": components,
                                        "user_role":userRole,
                                        "cache_lifetime":cacheLifetime,
                                        "widget_limit": widgetLimit,
                                        "query_limit": queryLimit,
                                        "logo_name": filename,
                                        "dp_name" : dp_name,
                                        "theme_config": themeConfig
                                        // "SecurityToken": userInfo.SecurityToken,
                                        // "Domain": Digin_Domain
                                    }
                                
                                    $http({
                                        method: 'POST',
                                        url: Digin_Engine_API + 'store_user_settings/',
                                        data: angular.toJson($scope.settings),
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'SecurityToken': userInfo.SecurityToken
                                            //'Domain': Digin_Domain
                                        }
                                    })
                                        .success(function (response) {
                                            $http.get(Digin_Engine_API + 'get_user_settings?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain)
                                                .success(function (data) {
                                                    console.log(data);
                                                    $rootScope.userSettings=data.Result;
                                                    var logoPath = Digin_Engine_API.split(":")[0] + ":" + Digin_Engine_API.split(":")[1];
                                                    $rootScope.image = logoPath + data.Result.logo_path;
                                                    $scope.image=logoPath + data.Result.logo_path;
                                                    $rootScope.imageUrl = logoPath + data.Result.logo_path;                                             
                                                    $scope.preloader = false;
                                                    $mdDialog.hide();
                                                    fireMsg('1', 'Logo Successfully uploaded!');
                                                });
                                        })
                                        .error(function (data) {
                                            $rootScope.image = "styles/css/images/DiginLogo.png";
                                            $mdDialog.hide();
                                            fireMsg('0', 'There was an error while uploading logo.');
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
                //$scope.getURL();
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
        else if($scope.groupName==undefined){
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
        
        if($scope.sharableUsers==undefined){
              
        }
        else{
            for (i = 0; i<$scope.sharableUsers.length;  i++) {
                var uName=$scope.sharableUsers[i].Name.toLowerCase();
                if (uName.indexOf(lowercaseQuery) != -1) {
                    results.push($scope.sharableUsers[i]);
                }
            }
            return results;
        }
    }

    //-----------


    //Add user group ***    
    $scope.createGroup = function () {

        //Validate group name
        if($scope.isValidGroupName1()==false){
            fireMsg('0', 'User group name can not be empty.');
            return;
        };

        if($scope.isValidGroupName2()==false){
            fireMsg('0', 'This user group is already created.');
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
                content: 'User group created successfully.',
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
    // $scope.deleteGroup = function (group, index,event) {
    //     var confirm = $mdDialog.confirm()
    //         .title('Do you want to delete this group ?')
    //         .targetEvent(event)
    //         .ok('Yes!')
    //         .cancel('No!');
    //     $mdDialog.show(confirm).then(function () {
    //         //$http.get(baseUrl+'/apis/usercommon/removeUserGroup/'+group)
    //         $http.get(baseUrl+'/apis/usercommon/removeUserGroup/'+group)
    //             .success(function (response) {
    //                 $rootScope.sharableGroupsDtls.splice(index, 1);
    //                 ngToast.create({
    //                     className: 'success',
    //                     content: 'User group deleted successfully.',
    //                     horizontalPosition: 'center',
    //                     verticalPosition: 'top',
    //                     dismissOnClick: true
    //                 });
    //             });
    //         }, function () {
    //     });
    // };


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
                    fireMsg('1', 'Deletion fail, please try again !');
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
            $scope.newSelected=[]; 
            $scope.remainUsers=[]; 
            
            if(allUsers==undefined){
              
            }
            else{
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

        //------------
        $scope.selectedItem = null;
        $scope.searchText = null;
        $scope.querySearch = querySearch;
        
        $scope.ContactChip = [];

          function querySearch(query) {
            var lowercaseQuery = angular.lowercase(query);
            var results = [];
            
            if($scope.remainUsers==undefined){}
            else{
                for (i = 0; i<$scope.remainUsers.length;  i++) {
                    var uName=$scope.remainUsers[i].Name.toLowerCase();
                    if (uName.indexOf(lowercaseQuery) != -1) {
                        results.push($scope.remainUsers[i]);
                    }
                }
                return results;
            }
        }
        //-----------






        //------------Add users to group*******
        $scope.addUsersToGroup = function (newSelected) {
            //Add user to group
            $scope.userDtl = {
                "groupId": grpId,
                "users": newSelected
            };

            
            if ($scope.userDtl==[]){fireMsg('0', 'You have not selected any user.'); return;}
            if ($scope.userDtl.users.length==0){fireMsg('0', 'You have not selected any user.'); return;}
            
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


                                 fireMsg('1', 'User/s added successfully.');
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
            fireMsg('0', 'Invalid cache lifetime settings.');
            return;
        }
        else if ($scope.noOfWidget == undefined) {
            fireMsg('0', 'Invalid widgets settings!');
            return;
        }
        else if ($scope.reqLimit == undefined) {
            fireMsg('0', 'Invalid request limit settings.');
            return;
        }
        else if ($scope.cacheLifetime <= 0) {
            fireMsg('0', 'Invalid cache lifetime settings.');
            return;
        }
        else {
        }

        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
        
        //#chk undefined values
        var dp_name="";
        var logo_name="";
        var components; var userRole; var cacheLifetime; var widgetLimit; var themeConfig; var queryLimit;
        if($rootScope.userSettings.components==undefined) {components=0;} else {components=$rootScope.userSettings.components}
        if($rootScope.userSettings.user_role==undefined) {userRole="";} else {userRole=$rootScope.userSettings.user_role}
        if($scope.cacheLifetime==undefined) {cacheLifetime=0;} else {cacheLifetime=parseInt($scope.cacheLifetime)}
        if($scope.noOfWidget==undefined) {widgetLimit=0;} else {widgetLimit=parseInt($scope.noOfWidget)}
        if($scope.reqLimit==undefined) {queryLimit=0;} else {queryLimit=parseInt($scope.reqLimit)}
        if($rootScope.userSettings.dp_path==undefined) {dp_name="";} else {dp_name=$rootScope.userSettings.dp_path.split("/").pop();}
        if($rootScope.userSettings.logo_path==undefined) {logo_name="";} else {logo_name=$rootScope.userSettings.logo_path.split("/").pop();}
        if($rootScope.userSettings.theme_config==undefined) {themeConfig="";} else {themeConfig=$rootScope.userSettings.theme_config}     
        
        //#store to user settings---------------------
        $scope.settings = {
            "email": userInfo.Email,
            "components": components,
            "user_role":userRole,
            "cache_lifetime":cacheLifetime,
            "widget_limit": widgetLimit,
            "query_limit": queryLimit,
            "logo_name": logo_name,
            "dp_name" : dp_name,
            "theme_config": themeConfig
            // "SecurityToken": userInfo.SecurityToken,
            // "Domain": Digin_Domain
        }
    
        $http({
            method: 'POST',
            url: Digin_Engine_API + 'store_user_settings/',
            data: angular.toJson($scope.settings),
            headers: {
                'Content-Type': 'application/json',
                'SecurityToken': userInfo.SecurityToken
                //'Domain': Digin_Domain
            }
        })
            .success(function (response) {
                //alert("Success...!");
                fireMsg('1', 'User settings saved successfully.');
                var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
                $http.get(Digin_Engine_API + 'get_user_settings?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain)
                .success(function (data) {
                $rootScope.userSettings=data.Result;  
                ProfileService.widget_limit = data.Result.widget_limit;       
                })
                .error(function (data) {        
                });
            })
            .error(function (error) {
                fireMsg('0', 'Please re-check the settings.');
            });
    };

    //#View sittings detail
    
    
    
    //$scope.viewSettings=function(){
        if($rootScope.userSettings==undefined)
        {
        }
        else{
            $scope.cacheLifetime=$rootScope.userSettings.cache_lifetime;
            $scope.noOfWidget=$rootScope.userSettings.widget_limit;
            $scope.reqLimit=$rootScope.userSettings.query_limit;
        }
    //};

    //#Clear cache
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
                url: Digin_Engine_API + 'clear_cache',
                headers: {
                    'Content-Type': 'Content-Type:application/json',
                    'SecurityToken': userInfo.SecurityToken
                    //'Domain': userInfo.Domain
                }
            })
                .success(function (response) {
                    fireMsg('1', 'Cache cleared successfully.');
                })
                .error(function (error) {
                    fireMsg('0', 'Please select the cache clear option');
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
            displayProgress('Processing...');
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
                $mdDialog.hide();
                fireMsg('1', 'User profile created successfully and, sent email for account verification.');  
                $scope.frmNewUser.$setUntouched();
                $scope.fname = '';
                $scope.lname = '';
                $scope.email = '';
            }).error(function (data) {
                $scope.error.isLoading = false; 
                $mdDialog.hide();       
                fireMsg('0', 'Registration process failed.');
            });
        };
       

        $scope.CreateUser = function () {
            //validation
            if ($scope.fname == '' || angular.isUndefined($scope.fname)) {
                fireMsg  ('0', '</strong>First name is required.');
                focus('$scope.fname');
                return;
             } //else if ($scope.lname == '' || angular.isUndefined($scope.lname)) {
            //     fireMsg('0', '<strong>Error : </strong>Last name is required..');
            //     focus('$scope.lname');
            //     return;
            // }
            else if ($scope.email == '' || angular.isUndefined($scope.email)) {
                fireMsg('0', '</strong>Email address is required.');
                focus('$scope.email');
                return;
            }
            else if (!$scope.validateEmail($scope.email)) {
                fireMsg('0', '</strong>Invalid email address.');
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
                        fireMsg('0', '</strong>This user email address already exist.');
                    }   
                }).error(function(error){   
                    fireMsg('0', '</strong>Please try again.');
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

    //#User Profile settings - data validation
    $scope.updateProfile=function(){
        if ($scope.address == '' || angular.isUndefined($scope.address)) {
            fireMsg  ('0', '</strong>Billing address is required.');
            focus('$scope.address');
            return;
        } 
        else if ($scope.name == '' || angular.isUndefined($scope.name)) {
            fireMsg  ('0', '</strong>Name is required.');
            focus('$scope.name');
            return;
        } 
        else if ($scope.phoneNo == '' || angular.isUndefined($scope.phoneNo)) {
            fireMsg  ('0', '</strong>Contact number is required.');
            focus('$scope.phoneNo');
            return;
        } 
        else{
             $scope.updateProfileData();
        }
    };


    //#Update User Profile settings
    $scope.updateProfileData= function () {
            var fullname = $scope.fname + " " + $scope.lname;
            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));

            $scope.userProfile ={
                 "BannerPicture":"img/cover.png",
                 "BillingAddress":$scope.address,
                 "Company":$scope.company,
                 "Country":$scope.country,
                 "Email":userInfo.Email,//$scope.email,
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
                console.log(data);
 
                if(data.IsSuccess==false){
                    fireMsg('0', 'Fail to update user profile.');
                }
                else
                {
                    fireMsg('1', 'User profile updated successfully.');
                    $scope.frmProfile.$setUntouched();
                    $scope.viewUserProfile();
                }
                
            }).error(function (data) {
                $scope.error.isLoading = false;            
            });
     };


    $scope.viewUserProfile=function(){
        var baseUrl = "http://" + window.location.hostname;
        //$http.get('http://omalduosoftwarecom.prod.digin.io/apis/profile/userprofile/omal@duosoftware.com') 
        $http.get(baseUrl+'/apis/profile/userprofile/'+$scope.username)
            .success(function(response){
                console.log(response);
                //#load exisitging data
                $rootScope.profile_Det=response;
                $rootScope.address=response.BillingAddress;
                $rootScope.company=response.Company;
                $rootScope.country=response.Country;
                $rootScope.email=response.Email;
                $rootScope.name=response.Name;
                $rootScope.phoneNo=response.PhoneNumber;
                $rootScope.zipCode=response.ZipCode;
            }).error(function(error){   
                //fireMsg('0', '<strong>Error : </strong>Please try again...!');
            });  
    };


    //*Profile picture
    $scope.selectImage=false;
    $scope.selectProfile=true;

    //#pre-loader progress - with message
    var displayProgress = function (message) {
        $mdDialog.show({
            template: '<md-dialog ng-cloak>' + '   <md-dialog-content>' + '       <div style="height:auto; width:auto; padding:10px;" class="loadInidcatorContainer" layout="row" layout-align="start center">' + '           <md-progress-circular class="md-primary" md-mode="indeterminate" md-diameter="40"></md-progress-circular>' + '           <span>'+message+'</span>' + '       </div>' + '   </md-dialog-content>' + '</md-dialog>'
            , parent: angular.element(document.body)
            , clickOutsideToClose: false
        });
    };


    $scope.selectProfileImg = function () {
        $scope.selectProfile=false;
        $scope.selectImage=true;
    };


    $rootScope.myImage='';
    $scope.myCroppedImage='';

    var handleFileSelect=function(evt) {
          var file=evt.currentTarget.files[0];
          var reader = new FileReader();
          reader.onload = function (evt) {
            $scope.$apply(function($scope){
                $rootScope.myImage=evt.target.result;
                $rootScope.file=file;
            });
          };
          reader.readAsDataURL(file);  
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);


    //#conver dataURL into base64
    function base64ToBlob(base64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = 1024;
        var byteCharacters = atob(base64Data);
        var bytesLength = byteCharacters.length;
        var slicesCount = Math.ceil(bytesLength / sliceSize);
        var byteArrays = new Array(slicesCount);

        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);

            var bytes = new Array(end - begin);
            for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    };


    //#validate image saving and call saving function
    $scope.saveImage = function () {
        if($rootScope.file==undefined){
            fireMsg('0', 'Please select profile picture to upload.');
        }
        else{
            //*Croped image
                var name=$rootScope.file.name;
                var file = base64ToBlob($scope.myCroppedImage.replace('data:image/png;base64,',''), 'image/jpeg');
                file.name=name;
                //uploader.addToQueue(file);
                $scope.upload(file);

            //*Original image
                //$scope.upload($rootScope.file);
                //$scope.upload();

            $scope.selectProfile=true;
            $scope.selectImage=false;
        }          
    };


    $scope.cancelImage = function () {
        $scope.selectProfile=true;
        $scope.selectImage=false;       
    };



    //#Function to save profile image
    $scope.upload = function (file) {
        displayProgress('Uploading...');
        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
        Upload.upload({
            url: Digin_Engine_API + 'file_upload',
            headers: {'Content-Type': 'multipart/form-data',},
            data: {
                db: 'BigQuery',
                SecurityToken: userInfo.SecurityToken,
                Domain: Digin_Domain,
                other_data:'dp',
                file: file
            }
        }).success(function (data) {

            //#chk undefined values
            var dp_name="";
            var logo_name="";
            var components; var userRole; var cacheLifetime; var widgetLimit; var themeConfig; var queryLimit;
            if($rootScope.userSettings.components==undefined) {components=0;} else {components=$rootScope.userSettings.components}
            if($rootScope.userSettings.user_role==undefined) {userRole="";} else {userRole=$rootScope.userSettings.user_role}
            if($rootScope.userSettings.cache_lifetime==undefined) {cacheLifetime=0;} else {cacheLifetime=$rootScope.userSettings.cache_lifetime}
            if($rootScope.userSettings.widget_limit==undefined) {widgetLimit=0;} else {widgetLimit=$rootScope.userSettings.widget_limit}
            if($rootScope.userSettings.query_limit==undefined) {queryLimit=0;} else {queryLimit=$rootScope.userSettings.query_limit}
            if($rootScope.userSettings.dp_path==undefined) {dp_name="";} else {dp_name=$rootScope.userSettings.dp_path.split("/").pop();}
            if($rootScope.userSettings.logo_path==undefined) {logo_name="";} else {logo_name=$rootScope.userSettings.logo_path.split("/").pop();}
            if($rootScope.userSettings.theme_config==undefined) {themeConfig="";} else {themeConfig=$rootScope.userSettings.theme_config}     
                 

            //#store to user settings---------------------
            $scope.settings = {
                "email": userInfo.Email,
                "components": components,
                "user_role":userRole,
                "cache_lifetime":cacheLifetime,
                "widget_limit": widgetLimit,
                "query_limit": queryLimit,
                "logo_name": logo_name,
                "dp_name" : file.name,
                "theme_config": themeConfig
                // "SecurityToken": userInfo.SecurityToken,
                // "Domain": Digin_Domain
            }

            $http({
                method: 'POST',
                url: Digin_Engine_API + 'store_user_settings/',
                data: angular.toJson($scope.settings),
                headers: {
                    'Content-Type': 'application/json',
                    'SecurityToken': userInfo.SecurityToken
                    //'Domain': Digin_Domain
                }
            })
                .success(function (response) {
                    $http.get(Digin_Engine_API + 'get_user_settings?SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain)
                        .success(function (data) {
                            console.log(data);
                            $rootScope.userSettings=data.Result;
                            var logoPath = Digin_Engine_API.split(":")[0] + ":" + Digin_Engine_API.split(":")[1];
                            $scope.profile_pic = logoPath + data.Result.dp_path;
                            $rootScope.profile_pic = logoPath + data.Result.dp_path;
                            ProfileService.UserDataArr.BannerPicture= $rootScope.profile_pic;
                            $scope.getURL();
                            $mdDialog.hide();
                            fireMsg('1', 'Profile picture uploaded successfully.');
                        });
                })
                .error(function (data) {
                    $scope.profile_pic = "styles/css/images/setting/user100x100.png";
                    $rootScope.profile_pic = "styles/css/images/setting/user100x100.png";
                    $mdDialog.hide();
                    fireMsg('0', 'There was an error while uploading profile picture !');
                });
        });

    };





    //#load select profile picture window
    /* $scope.loadSelectProfilePictureWindow = function () {

           
            $mdDialog.show({
                controller: selectProfilePictureCtrl,
                templateUrl: 'views/settings/selectProfilePicture.html',
                resolve: {},
                locals: {},
            });
    };


    var selectProfilePictureCtrl = function ($scope) {
        $scope.close = function () {
            $mdDialog.hide();
        };

        $scope.myImage='';
        $scope.myCroppedImage='';

        var handleFileSelect=function(evt) {
              var file=evt.currentTarget.files[0];
              var reader = new FileReader();
              reader.onload = function (evt) {
                $scope.$apply(function($scope){
                    $scope.myImage=evt.target.result;
                });
              };
              reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    };*/
  

    //#load password change window
     $scope.loadPasswordChangeWindow = function () {
            $mdDialog.show({
                controller: passwordCtrl,
                templateUrl: 'views/settings/changePassword.html',
                resolve: {},
                locals: {},
            });
    };

    var passwordCtrl = function ($scope) {

        $scope.close = function () {
            $mdDialog.hide();
        };


        $scope.validate=function(){
            if($scope.newPassword!=$scope.confirmPassword){
                fireMsg('0', 'Password do not match, Please reenter.');
                return false;
            }
            else if($scope.newPassword==undefined){
                fireMsg('0', 'New password can not be a blank.');
                return false;
            }
            else if($scope.oldPassword==undefined){
                fireMsg('0', 'Old password can not be a blank.');
                return false;
            }
            else if($scope.confirmPassword==undefined){
                fireMsg('0', 'Confirmed password can not be a blank.');
                return false;
            }
            return true;
        };

        $scope.ChangePassword=function(){
            if($scope.validate()==true){
                $http.get(baseUrl+'/auth/ChangePassword/'+$scope.oldPassword+'/'+$scope.newPassword)
                //http://chamiladuosoftwarecom.space.duoworld.com/auth/ChangePassword/chamila@duo/chamila@duo
                .success(function(response){
                    if(response.Error){
                        console.log(response);
                        fireMsg('0', response.Message);
                    }
                    else{
                        console.log(response);
                        fireMsg('1', "Password changed successfully.");
                        $mdDialog.hide();
                    }
      
                }).error(function(error){   
                    fireMsg('0', error);
                });     
            }
        };

    };


    //#password reset
    //http://duoworld.com/apis/authorization/userauthorization/forgotpassword/chamila@duosoftware.com

}).directive('phoneInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
}).filter('tel', function () {
    return function (tel) {
        console.log(tel);
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 2);
                number = value.slice(2);
        }

        if(number){
            if(number.length>2){
                number = number.slice(0, 2) + ' ' + number.slice(2,10);
            }
            if(number.length>6){
                number = number.slice(0, 2) + ' ' + number.slice(2,7)+ ' ' + number.slice(7,11);
            }
            else{
                number = number;
            }

            return ("+" + city + " " + number).trim();
        }
        else{
            return "+" + city;
        }

    };
});   //+31 42 1123 4567


routerApp.controller('userGroupsCtrl',['$scope','$http','$rootScope', '$mdDialog','sharableObjs','$state','notifications', function ($scope,$http,$rootScope, $mdDialog,sharableObjs,$state,notifications) {
	
	console.log("start of userGroupsCtrl");

    $scope.route = function () {
          $state.go('home.welcomeSearch');
    };

    sharableObjs.getSharableObjects();
    sharableObjs.getAllGroups();

    $rootScope.groups = [];
    $rootScope.groups =$rootScope.sharableGroupsDtls;

					
	$scope.addGroup = function(ev)
	{
		$mdDialog.show({
					  controller: "addGroupCtrl",
					  templateUrl: 'views/settings/addGroup.html',
					  parent: angular.element(document.body),
					  targetEvent: ev,
					  clickOutsideToClose:true
					})
					.then(function(answer) {
					})
	}
	
	// $scope.addUser = function(ev)
	// {
	// 	$mdDialog.show({
	// 		  controller: "addUserCtrl",
	// 		  templateUrl: 'views/settings/addUser.html',
	// 		  parent: angular.element(document.body),
	// 		  targetEvent: ev,
	// 		  clickOutsideToClose:true
	// 		})
	// 		.then(function(answer) {
	// 		})
		  
	// }
	
    //------------Add users to group
    $scope.loadAddUsersWindow = function (group,grpName, pickedUsers, allUsers) {

            //*get can sharable users
            $scope.newSelected=[]; 
            $scope.remainUsers=[]; 
            
            if(allUsers==undefined){
              
            }
            else{
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

        //------------
        $scope.selectedItem = null;
        $scope.searchText = null;
        $scope.querySearch = querySearch;
        
        $scope.ContactChip = [];

          function querySearch(query) {
            var lowercaseQuery = angular.lowercase(query);
            var results = [];
            
            if($scope.remainUsers==undefined){}
            else{
                for (i = 0; i<$scope.remainUsers.length;  i++) {
                    var uName=$scope.remainUsers[i].Name.toLowerCase();
                    if (uName.indexOf(lowercaseQuery) != -1) {
                        results.push($scope.remainUsers[i]);
                    }
                }
                return results;
            }
        }
        //-----------






        //------------Add users to group*******
        $scope.addUsersToGroup = function (newSelected) {
            var baseUrl = "http://" + window.location.hostname;
            //Add user to group
            $scope.userDtl = {
                "groupId": grpId,
                "users": newSelected
            };

            
            if ($scope.userDtl==[]){notifications.toast ('0', 'You have not selected any user.'); return;}
            if ($scope.userDtl.users.length==0){notifications.toast ('0', 'You have not selected any user.'); return;}
            
            $http({
                method: 'POST',
                url: baseUrl+'/apis/usercommon/addUserToGroup',
                //url: 'http://omalduosoftwarecom.prod.digin.io/apis/usercommon/addUserToGroup',
                data: angular.toJson($scope.userDtl)
            })
                .success(function (response) {
                    //alert("Success...!");
                    //for (var j = 0; j < newSelected.length; j++) {
                        //$rootScope.sharableGroupsDtls.push({groupId: grpId, groupname: grpName,users:newSelected[j]});
                    //}

                    //

                    
                    //$http.get("http://omalduosoftwarecom.prod.digin.io/apis/usercommon/getAllGroups")
                    $http.get(baseUrl + "/apis/usercommon/getAllGroups")
                        .success(function(data) 
                        {
                            console.log(data); 
                            $rootScope.sharableGroupsDtls = [];
                            $rootScope.groups = [];
                            for (var i = 0; i < data.length; i++) {
                                $scope.users=[];  //$scope.userNames=[];
                                for (var j = 0; j < data[i].users.length; j++) {
                                    $scope.users.push({Id: data[i].users[j].Id, Name: data[i].users[j].Name, mainTitle:data[i].users[j].mainTitle});     
                                }    
                                $rootScope.sharableGroupsDtls.push({groupId: data[i].groupId, groupname: data[i].groupname,users:$scope.users});
                                $rootScope.groups.push({groupId: data[i].groupId, groupname: data[i].groupname,users:$scope.users});
                            }
                                //console.log($rootScope.sharableGroupsDtls);


                                 notifications.toast('1', 'User/s added successfully.');
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


	// $scope.deleteUser = function(ev)
	// {
	// 	   var confirm = $mdDialog.confirm()
	// 		  .title('Delete User')
	// 		  .textContent('Are you sure you want to delete this user')
	// 		  .ariaLabel('Delete User')
	// 		  .targetEvent(ev)
	// 		  .ok('Delete')
	// 		  .cancel('Cancel');
	// 	$mdDialog.show(confirm).then(function() {
	// 		console.log("User Deleted");
	// 	})
	// }
	
    $scope.deleteUserFromGroup = function (group, user) {
        var baseUrl = "http://" + window.location.hostname;
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
                //url: 'http://omalduosoftwarecom.prod.digin.io/apis/usercommon/removeUserFromGroup',
                url: baseUrl+'/apis/usercommon/removeUserFromGroup',
                data: angular.toJson($scope.UsrDtl)
            })
                .success(function (response) {
                    //alert("Success...!");
                    $rootScope.privateFun.getAllSharableObj();
                    notifications.toast('1', 'User deleted Successfully !');
                })
                .error(function (error) {
                    //alert("Fail...!");
                    notifications.toast('1', 'Deletion fail, please try again !');
                });

        }, function () {

        });
    };



    //#Delete  group
    $scope.deleteGroup = function (index,group,event) {
         var baseUrl = "http://" + window.location.hostname;

        var confirm = $mdDialog.confirm()
             .title('Delete User Group')
              .textContent('Are you sure, you want to delete this user group')
              .ariaLabel('Delete user group')
              .targetEvent(event)
            .ok('Yes!')
            .cancel('No!');
        $mdDialog.show(confirm).then(function () {
            //$http.get('http://omalduosoftwarecom.prod.digin.io/apis/usercommon/removeUserGroup/'+group)
            $http.get(baseUrl+'/apis/usercommon/removeUserGroup/'+group)
                .success(function (response) {
                    $rootScope.sharableGroupsDtls.splice(index, 1);
                    $rootScope.groups.splice(index, 1);
                    notifications.toast('1','User group deleted successfully.');
                });
            }, function () {
        });
	    
    }


}]);




routerApp.controller('addGroupCtrl',['$scope','$rootScope','$http', '$mdDialog','notifications','sharableObjs', function ($scope,$rootScope,$http, $mdDialog,notifications,sharableObjs) {
	
     var baseUrl = "http://" + window.location.hostname;

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

    //#validate group exist or not****
    $scope.isValidGroupName1=function(){
        if($scope.groupName==""){
            notifications.toast('0', 'Group name can not be empty... !');
            return false;
        }
        else if($scope.groupName==undefined){
            notifications.toast('0', 'Group name can not be empty... !');
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


	$scope.submit = function()
	{
        //Validate group name
        if($scope.isValidGroupName1()==false){
            notifications.toast('0', 'User group name can not be empty.');
            return;
        };

        if($scope.isValidGroupName2()==false){
            notifications.toast('0', 'This user group is already created.');
            return;
        };

        $scope.grpDtl = {
            "groupId": "-999",
            "groupname": $scope.groupName,
            "users":  [],
            "parentId": ""
        };
        $http({
            method: 'POST',
            //url: 'http://omalduosoftwarecom.prod.digin.io/apis/usercommon/addUserGroup', 
            url: baseUrl + '/apis/usercommon/addUserGroup',          
            data: angular.toJson($scope.grpDtl)
        })
        .success(function (response) {
            $scope.grpDtl = {
                "groupId": response.Data[0].ID,
                "groupname": $scope.groupName,
                "users":  [],
                "parentId": ""
            };
            $rootScope.sharableGroupsDtls.push($scope.grpDtl);
            $rootScope.groups.push($scope.grpDtl);
            notifications.toast('1','User group created successfully !');
            $scope.groupName = '';
            
        })
        .error(function (error) {
            //alert("Fail...!");
        });


		$mdDialog.hide();
	}



	
}])

routerApp.controller('addUserCtrl',['$scope', '$mdDialog', function ($scope, $mdDialog) {
	
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.submit = function()
	{
		$mdDialog.hide();
	}
	
}])


routerApp.service('sharableObjs',['$rootScope','$http', function($rootScope,$http){

    var baseUrl = "http://" + window.location.hostname;

    this.getSharableObjects = function() {

        //$http.get("http://omalduosoftwarecom.prod.digin.io/apis/usercommon/getSharableObjects")
        $http.get(baseUrl + "/apis/usercommon/getSharableObjects")
            .success(function (data) {
                console.log(data);
                $rootScope.sharableObjs = [];
                $rootScope.sharableUsers = [];
                $rootScope.sharableGroups = [];

                for (var i = 0; i < data.length; i++) {
                    if (data[i].Type == "User") {
                        $rootScope.sharableObjs.push({id: data[i].Id, name: data[i].Name});
                        $rootScope.sharableUsers.push({Id: data[i].Id, Name: data[i].Name});
                    }
                    else if (data[i].Type == "Group") {
                        $rootScope.sharableObjs.push({id: data[i].Id, name: data[i].Name});
                        $rootScope.sharableGroups.push({groupId: data[i].Id, groupname: data[i].Name});
                    }
                }
                console.log($rootScope.sharableObjs);
                console.log($rootScope.sharableUsers);
                console.log($rootScope.sharableGroups);
        
            }).error(function () {
            //alert("Oops! There was a problem retrieving the User");
        });
    };


    this.getAllGroups=function(){       
        //$http.get("http://omalduosoftwarecom.prod.digin.io/apis/usercommon/getAllGroups")
        $http.get(baseUrl + "/apis/usercommon/getAllGroups")
                .success(function (data) {
                    console.log(data);
                    $rootScope.sharableGroupsDtls = [];

                    for (var i = 0; i < data.length; i++) {
                        $rootScope.users = [];  
                        for (var j = 0; j < data[i].users.length; j++) {
                           $rootScope.users.push({
                                Id: data[i].users[j].Id,
                                Name: data[i].users[j].Name,
                                mainTitle: data[i].users[j].mainTitle
                            });
                        }
                        $rootScope.sharableGroupsDtls.push({
                            groupId: data[i].groupId,
                            groupname: data[i].groupname,
                            users: $rootScope.users
                        });
                    }
                    console.log($rootScope.sharableGroupsDtls);

                }).error(function () {
                //alert("Oops! There was a problem retrieving the groups");
            });
    }


}]);





routerApp.controller('emailShareCtrl',['$scope','notifications', function ($scope,notifications) {
    
    
}])