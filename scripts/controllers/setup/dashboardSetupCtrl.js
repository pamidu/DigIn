routerApp.controller('dashboardSetupCtrl', function ($scope, $mdDialog, $location, $http,
                                                     Digin_Engine_API, ngToast, $rootScope, $apps, $objectstore, Upload, Digin_Domain, Digin_Tenant, $state) {

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


    //theme colors array
    $scope.colorArr = [{value: '#F44336'}, {value: '#E91E63'}, {value: '#9C27B0'}, {value: '#673AB7'}, {value: '#3F51B5'}, {value: '#2196F3'}, {value: '#03A9F4'}, {value: '#00BCD4'}, {value: '#009688'}, {value: '#4CAF50'}, {value: '#8BC34A'}, {value: '#CDDC39'}, {value: '#FFEB3B'}, {value: '#FFC107'}, {value: '#FF9800'}, {value: '#FF5722'}, {value: '#795548'}, {value: '#9E9E9E'}, {value: '#607D8B'}];
    $scope.apps=$scope.dashboards;

    $scope.selectedColorObj = {
        primaryPalette: "",
        accentPalette: ""
    };


    //add user view state
    $scope.addUsrState = false;
    $scope.groups = [];
    $scope.currentPane = null;
    //breaking the coloArr into chunks of 6 colors    
    $scope.chunkedColorArr = chunk($scope.colorArr, 6);

    /*adding a new user
     #addState : bool - true if the add user view is enabled
     */

    $scope.initSettings = function () {
        //$('#pagePreLoader').show();
        $scope.load = true;
        //$http.get('http://digin.io/apis/usercommon/getAllGroups')
        $http.get('http://' + Digin_Domain + '/apis/usercommon/getAllGroups')
            .success(function (response) {
                $scope.groups = response;
                //$('#pagePreLoader').hide();
                $scope.load = false;
            });
    };


    //not used
    $scope.addNewUser = function (addState) {
        $scope.addUsrState = addState;
        if (!addState) {
            //do the form validations + the adding of the user here
        }
    };

    //not used
    $scope.inviteNewUser = function (inviteState) {
        $scope.inviteUsrState = inviteState;
        if (!inviteState) {
            //do the form validations + the adding of the user here

            //var userInfo = JSON.parse(getCookie("authData"));
            var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
            //-----Add user
            $http.get(Digin_Tenant + '/tenant/AddUser/' + $scope.user.email + '/user', {
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
                            });
                    }
                    else {
                        fireMsg('1', 'User can not be invited !');
                    }
                }).error(function (error) {
                //console.log(error);
                fireMsg('0', 'Invitation not sent !');
            });

        }
    };

    //invite user ***
    $scope.inviteUser = function () {

        //var userInfo = JSON.parse(getCookie("authData"));
        var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
        //-----Add user
        $http.get(Digin_Tenant + '/tenant/AddUser/' + $scope.user.email + '/user', {
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

    //----------------------
    $scope.people = [
        {name: 'Janet Perkins', img: 'img/100-0.jpeg', newMessage: true},
        {name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: true},
        {name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false}
    ];

    $scope.goToPerson = function (person, event) {
        $mdDialog.show(
            $mdDialog.alert()
                .title('Navigating')
                //.textContent('Inspect ' + person)
                .ariaLabel('Person inspect demo')
                .ok('Neat!')
                .targetEvendt(event)
        );
    };


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

    $scope.updateAccount = function () {
        if ($scope.image == "") {
            $rootScope.image = "styles/css/images/DiginLogo.png";
        }
        else {
            $rootScope.image = $scope.image;
        }

        $scope.getURL();
        $scope.image = "";

        if ($scope.headerbar) {
            document.getElementById('mainHeadbar').style.display = "block";
        }
        else {
            $scope.pinHeaderbar(false);
            document.getElementById('mainHeadbar').style.display = "none";
        }
    };

    //Update account
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
    var privateFun = (function () {
        return {
            fireMsg: function (msgType, content) {
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
        }
    })();
    //---------msg e---------


//------TESTING START

    $scope.selectedItem = null;
    $scope.searchText = null;

    $scope.querySearch = querySearch;

    $scope.ContactDetails = [{
        Name: 'Steve',
        UserID: '500'
    }, {
        Name: 'Shane',
        UserID: '100'
    }, {
        Name: 'Ryan',
        UserID: '200'
    }, {
        Name: 'Nick',
        UserID: '300'
    }, {
        Name: 'Iann',
        UserID: '400'
    }];

    $scope.ContactChip = [];

    function querySearch(query) {
        //$scope.getAllContacts();
        var results = [];
        for (i = 0, len = $scope.ContactDetails.length; i < len; ++i) {
            //if ($scope.ContactDetails[i].groupname.indexOf(query.toLowerCase()) != -1) {
            if ($scope.ContactDetails[i].name.indexOf(query) != -1) {
                //if ($scope.ContactDetails[i].name.indexOf(query.toLowerCase()) != -1) {
                results.push($scope.ContactDetails[i]);
            }
        }
        return results;
    }

    //Get users in a specific group
    $scope.viewUsersInGroup = function (group, cb) {
        $http.get('http://' + Digin_Domain + '/apis/usercommon/getUserFromGroup/' + group)
            //$http.get('http://192.168.2.33/apis/usercommon/getUserFromGroup/'+group)
            .success(function (response) {
                if (cb)cb(response);
                else $scope.users = response;
            });
    };

    $scope.expandCallback = function (index, id) {
        console.log('expanded pane:', index, id);
        if (typeof $scope.currentPane != null)
            $scope.accordion.collapse($scope.currentPane)
        $scope.currentPane = id;
    };


    //Get groups shared for specific apps //***
    $scope.viewGroupsInApp = function (app, event) {
        //$http.get('http://digin.io/apis/usercommon/getUserFromGroup/'+app)
        $http.get('http://' + Digin_Domain + '/apis/usercommon/getUserFromGroup/' + app)
            .success(function (response) {
                $scope.users = response;
            });
    };

    //Get all existing users
    $scope.getAllGroups = function () {
        //$('#pagePreLoader').show();
        $scope.load = true;
        //$http.get('http://digin.io/apis/usercommon/getAllGroups')
        $http.get('http://' + Digin_Domain + '/apis/usercommon/getAllGroups')
            .success(function (response) {
                $scope.groups = response;
                //$('#pagePreLoader').hide();
                $scope.load = false;
            });
    };

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
    $scope.getAllContacts = function () {
        $http.get(Digin_Tenant + '/tenant/GetUsers/' + $mainDomain)
            .success(function (response) {
                $scope.ContactDetails = response;
            });
    };


    $scope.goToGroup = function (group, event) {
        $mdDialog.show(
            $mdDialog.alert()
                .title('Navigating')
                //.textContent('Inspect ' + person)
                .ariaLabel('Group inspect demo')
                .ok('Neat!')
                .targetEvent(event)
        );
    };

    //Add user group ***
    $scope.createGroup = function () {
        $scope.grpDtl = {
            "groupId": "-999",
            "groupname": $scope.groupName,
            //"users":["01","02"],
            "users": $scope.ContactChip,
            "parentId": ""
        };
        $http({
            method: 'POST',
            url: 'http://' + Digin_Domain + '/apis/usercommon/addUserGroup',
            //url: 'http://192.168.2.33/apis/usercommon/addUserGroup',
            data: angular.toJson($scope.grpDtl)
        })
            .success(function (response) {
                //alert("Success...!");
            })
            .error(function (error) {
                //alert("Fail...!");
            });

        $scope.groups.push($scope.grpDtl);
        $scope.groupName = '';
        ngToast.create({
            className: 'success',
            content: 'User group deleted Successfully...!',
            horizontalPosition: 'center',
            verticalPosition: 'top',
            dismissOnClick: true
        });

    };

    //------------Delete  group***
    $scope.deleteGroup = function (group, event, index) {
        var confirm = $mdDialog.confirm()
            .title('Do you want to delete this group ?')
            .targetEvent(event)
            .ok('Yes!')
            .cancel('No!');
        $mdDialog.show(confirm).then(function () {
            //$http.get('http://digin.io/apis/usercommon/removeUserGroup/'+ group)
            $http.get('http://' + Digin_Domain + '/apis/usercommon/removeUserGroup/' + group)
                .success(function (response) {
                });

            $scope.groups.splice(index, 1);
            ngToast.create({
                className: 'success',
                content: 'User group deleted Successfully...!',
                horizontalPosition: 'center',
                verticalPosition: 'top',
                dismissOnClick: true
            });
        }, function () {

        });
    };


    //------------Delete user from group
    $scope.deleteUserFromGroup = function (group, user) {
        var confirm = $mdDialog.confirm()
            .title('Do you want to delete this this user form this group ?')
            .targetEvent(event)
            .ok('Yes!')
            .cancel('No!');

        $mdDialog.show(confirm).then(function () {
            $scope.UsrDtl = {
                "groupId": group,
                "users": user
            };
            $http({
                method: 'POST',
                //url: 'http://digin.io/apis/usercommon/removeUserFromGroup',
                url: 'http://' + Digin_Domain + '/apis/usercommon/removeUserFromGroup',
                data: angular.toJson($scope.UsrDtl)
            })
                .success(function (response) {
                    //alert("Success...!");
                })
                .error(function (error) {
                    //alert("Fail...!");
                });

        }, function () {

        });
    };

    $scope.loadShareWindow = function (appName) {

        $mdDialog.show({
            controller: dashboardshareCtrl,
            templateUrl: 'views/shareApp.html',
            resolve: {},
            locals: {appData: {appname: appName}, userGroups: $scope.groups},
        });
    };

    var dashboardshareCtrl = function ($rootScope, $scope, appData, userGroups) {
        $scope.selectedItem = null;
        $scope.searchText = null;
        $scope.querySearch = querySearch;
        $scope.ContactDetails = userGroups;
        $scope.ContactChip = [];

        function querySearch(query) {
            var results = [];
            for (i = 0, len = $scope.ContactDetails.length; i < len; ++i) {
                if ($scope.ContactDetails[i].groupname.indexOf(query) != -1) {
                    //if ($scope.ContactDetails[i].groupname.indexOf(query.toLowerCase()) != -1) {
                    results.push($scope.ContactDetails[i]);
                }
            }
            return results;
        }

        // $scope.add1 = function(){
        //     $scope.addUsersToGroup();
        // }


        $scope.shareAppToGroup = function () {
            //Get each selected group
            for (i = 0, len = $scope.ContactChip.length; i < len; ++i) {
                var i = 0;

                function test() {
                    //Save group detail
                    var grpId = $scope.ContactChip[i].groupId;
                    var grpName = $scope.ContactChip[i].groupname;
                    $scope.GrpDtl = {
                        "id": grpId,
                        "image": "",
                        "name": grpName,
                        "type": "Group"
                    };
                    $http({
                        method: 'POST',
                        //url: 'http://digin.io/apis/usercommon/saveUiShareData',
                        url: 'http://' + Digin_Domain + '/apis/usercommon/saveUiShareData',
                        data: angular.toJson($scope.GrpDtl)
                    })
                        .success(function (response) {
                            i++;
                            if (i < $scope.ContactChip.length)
                                test();
                            else
                                alert("Success...!");

                        })
                        .error(function (error) {
                            alert("Fail...!");
                        });
                };
            }
        };


        $scope.closeDialog = function () {
            $mdDialog.hide();
        };

    };


    //------------Add users to group
    $scope.loadAddUsersWindow = function (group) {
        $scope.viewUsersInGroup(group, function (data) {
            $mdDialog.show({
                controller: dashboardgroupCtrl,
                templateUrl: 'views/addUsersToGroup.html',
                resolve: {},
                locals: {grpId: group, users: data},
            });
        });

    };


    var dashboardgroupCtrl = function ($scope, grpId, users) {

        $scope.selectedItem = null;
        $scope.searchText = null;
        $scope.querySearch = querySearch;

        $scope.ContactDetails = [{
            Name: 'Steve',
            UserID: '500'
        }, {
            Name: 'Shane',
            UserID: '100'
        }, {
            Name: 'Ryan',
            UserID: '200'
        }, {
            Name: 'Nick',
            UserID: '300'
        }, {
            Name: 'Iann',
            UserID: '400'
        }];

        $scope.ContactChip = users;

        function querySearch(query) {
            //$scope.getAllContacts();
            var results = [];
            for (i = 0, len = $scope.ContactDetails.length; i < len; ++i) {
                //if ($scope.ContactDetails[i].groupname.indexOf(query.toLowerCase()) != -1) {
                if ($scope.ContactDetails[i].Name.indexOf(query.toLowerCase()) != -1) {
                    results.push($scope.ContactDetails[i]);
                }
            }
            return results;
        }


        // $scope.add1 = function(){
        //     $scope.addUsersToGroup();
        // }

        //------------Add users to group
        $scope.addUsersToGroup = function () {

            //*Remove all users group
            // $scope.UsrDtl ={
            //     "groupId":grpId,
            //     "users":$scope.ContactChip
            // };
            // $http({
            //     method: 'POST',
            //     //url: 'http://digin.io/apis/usercommon/removeUserFromGroup',
            //     url: 'http://192.168.2.33/apis/usercommon/removeUserFromGroup',
            //     data: angular.toJson($scope.UsrDtl)
            // })
            // .success(function(response){
            // })
            // .error(function(error){   
            // }); 


            //Add user to group
            $scope.userDtl = {
                "groupId": grpId,
                "users": $scope.ContactChip
            };

            $http({
                method: 'POST',
                //url: 'http://digin.io/apis/usercommon/addUserToGroup',
                url: 'http://' + Digin_Domain + '/apis/usercommon/addUserToGroup',
                data: angular.toJson($scope.userDtl)
            })
                .success(function (response) {
                    //alert("Success...!");
                })
                .error(function (error) {
                    //alert("Fail...!");
                });


            // $scope.UsrDtl ={
            //     "groupId":grpId,
            //     "users":$scope.ContactChip
            // };

            // var ContaLen=parseInt($scope.ContactChip.length);
            // var result = [];
            // for(var i = 0; i < ContaLen; i++)
            // {
            //     result.push($scope.UsrDtl.users[i].UserID);
            // };

            // $scope.userDtl2 ={
            //     "groupId":grpId,
            //     "users":result
            // };

            // $http({
            //         method: 'POST',
            //         //url: 'http://digin.io/apis/usercommon/addUserToGroup',
            //         url: 'http://'+Digin_Domain+'/apis/usercommon/addUserToGroup',
            //         //data: {"groupId":grpId,"users":$scope.userDtl.users[i].UserID}
            //         data: angular.toJson($scope.userDtl2)
            // })
            // .success(function(response){
            //     //alert("Success...!");


            // })
            // .error(function(error){
            //     //alert("Fail...!");
            // });

            //  //$scope.getAllGroups();

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
});


