
routerApp.controller('dashboardSetupCtrl', function($scope, $mdDialog, $location, $http,
 Digin_Engine_API1, ngToast,$rootScope,$apps,$objectstore) {
    
    //theme colors array
    $scope.colorArr = [{value:'#F44336'},{value:'#E91E63'},{value:'#9C27B0'},{value:'#673AB7'},{value:'#3F51B5'},{value:'#2196F3'},{value:'#03A9F4'},{value:'#00BCD4'},{value:'#009688'},{value:'#4CAF50'},{value:'#8BC34A'},{value:'#CDDC39'},{value:'#FFEB3B'},{value:'#FFC107'},{value:'#FF9800'},{value:'#FF5722'},{value:'#795548'},{value:'#9E9E9E'},{value:'#607D8B'}];
    
    $scope.selectedColorObj = {
        primaryPalette: "",
        accentPalette: ""
    };
    
    //add user view state
    $scope.addUsrState = false;
    $scope.groups = []; 
    $scope.currentPane= null;
    //breaking the coloArr into chunks of 6 colors    
    $scope.chunkedColorArr = chunk($scope.colorArr, 6);
    
    /*adding a new user
        #addState : bool - true if the add user view is enabled
    */

    $scope.initSettings= function(){
        //$('#pagePreLoader').show();
        $scope.load=true;
        //$http.get('http://digin.io/apis/usercommon/getAllGroups')
        $http.get('http://192.168.2.33/apis/usercommon/getAllGroups')
            .success(function (response) {
                $scope.groups = response;
                //$('#pagePreLoader').hide();
                $scope.load=false;
            });
    };

    

    $scope.addNewUser = function(addState){
        $scope.addUsrState = addState;
        if(!addState){
            //do the form validations + the adding of the user here
        }
    };

    $scope.inviteNewUser = function(inviteState){
        $scope.inviteUsrState = inviteState;
        if(!inviteState){
            //do the form validations + the adding of the user here

            //var userInfo = JSON.parse(getCookie("authData"));
            var userInfo=JSON.parse(decodeURIComponent(getCookie('authData')));
            //-----Add user
            $http.get('http://104.197.27.7:3048/tenant/AddUser/'+$scope.user.email+'/user', {
                headers: {'Securitytoken': userInfo.SecurityToken}
            })
              .success(function(response){
                  //alert(JSON.stringify(response));
                  //------if invited check invited or ----------
                  if(response){
                    $http.get('http://104.197.27.7:3048/GetUser/'+$scope.user.email, {
                    })
                      .success(function (data) {
                          //alert(JSON.stringify(data)); 
                          fireMsg('1', 'Successfully invited !');
                      });  
                  }
                  else{
                  }
              }).error(function(error){
                   //console.log(error);
                    fireMsg('0', 'Invitation not sent !');
            });



            /*  
            if(response){
                $http({
                    method: 'GET',
                    url: "http://104.197.27.7:3048/auth/GetUsers" + user.email,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                }
                }).
                    success(function (response) {
                });
                
            }
            else{

            }
            */

        }
    };
    

    //----------------------
     $scope.people = [
        { name: 'Janet Perkins', img: 'img/100-0.jpeg', newMessage: true },
        { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: true },
        { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false }
      ];

    $scope.goToPerson = function(person, event) {
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
        { name: '1' },
        { name: '2' },
        { name: '3' },
        { name: '4' },
        { name: '5' },
        { name: '6' },
        { name: '7' },
        { name: '8' },
        { name: '9' },
        { name: '10' }
    ];
  
    $scope.requests = [
        { name: '1000' },
        { name: '2000' },
        { name: '3000' },
        { name: '4000' },
        { name: '5000' },
      ];

  $scope.clearDetails = [
        { name: "Clear Cache" }
      ];





    //-----------------
    $scope.headerbar = true;

    $scope.updateAccount = function(){          
        if($scope.image==""){
            $rootScope.image = "styles/css/images/DiginLogo.png";
        }
        else{
            $rootScope.image = $scope.image;
        }

        $scope.getURL();
        $scope.image = "";

        if($scope.headerbar){
            document.getElementById('mainHeadbar').style.display = "block";
        }
        else{
            $scope.pinHeaderbar(false);
            document.getElementById('mainHeadbar').style.display = "none";
        }        
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
            Name : 'Steve',
            UserID : '500'
        },{
            Name : 'Shane',
            UserID : '100'
        },{
            Name : 'Ryan',
            UserID : '200'
        },{
            Name : 'Nick',
            UserID : '300'
        },{
            Name : 'Iann',
            UserID : '400'
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
    $scope.viewUsersInGroup=function(group,cb)
    {
        //$http.get('http://digin.io/apis/usercommon/getUserFromGroup/'+group)
        $http.get('http://192.168.2.33/apis/usercommon/getUserFromGroup/'+group)
            .success(function (response) {
                if(cb)cb(response);
                else $scope.users = response;
            });
    };

    $scope.expandCallback = function (index, id) {
      console.log('expanded pane:', index, id);
      if(typeof $scope.currentPane != null)
      $scope.accordion.collapse($scope.currentPane)
      $scope.currentPane = id;
    };



    //Get groups shared for specific apps
    $scope.viewGroupsInApp=function(app, event)
    {
        //$http.get('http://digin.io/apis/usercommon/getUserFromGroup/'+app)
        $http.get('http://192.168.2.33/apis/usercommon/getUserFromGroup/'+app)
            .success(function (response) {
                $scope.users = response;
            });
    };

    //Get all existing users
    $scope.getAllGroups=function()
    {
        //$('#pagePreLoader').show();
        $scope.load=true;
        //$http.get('http://digin.io/apis/usercommon/getAllGroups')
        $http.get('http://192.168.2.33/apis/usercommon/getAllGroups')
            .success(function (response) {
                $scope.groups = response;
                //$('#pagePreLoader').hide();
                $scope.load=false;
            });
    };

      //Get all apps
    $scope.getAllApps=function()
    {
        //$('#pagePreLoader').show();
         $scope.load=true;
        $objectstore.getClient("duodigin_dashboard")
            .onGetMany(function (data) {
                if (data) {
                    allApps = data;
                    // if (canCacheApps)
                    //     localStorage.setItem("userDashboards", JSON.stringify(allApps));
                }
                $scope.apps=data;
                //$('#pagePreLoader').hide();
                $scope.load=false;
            })
            .getByKeyword("*");


    };

    //Get all contact in tenent
    $scope.getAllContacts=function()
    {
        $http.get('http://104.197.27.7:3048/tenant/GetUsers/'+$mainDomain)
            .success(function (response) {
                $scope.ContactDetails = response;
            });
    };


    $scope.goToGroup = function(group, event) {
        $mdDialog.show(
          $mdDialog.alert()
            .title('Navigating')
            //.textContent('Inspect ' + person)
            .ariaLabel('Group inspect demo')
            .ok('Neat!')
            .targetEvent(event)
        );
    };

    //Add user group
    $scope.createGroup = function() {
        $scope.grpDtl ={
            "groupId":"-999",
            "groupname":$scope.groupName,
            //"users":["01","02"],
            "users":$scope.ContactChip,
            "parentId":""
        };
        $http({
                method: 'POST',
                //url: 'http://digin.io/apis/usercommon/addUserGroup',
                url: 'http://192.168.2.33/apis/usercommon/addUserGroup',
                data: angular.toJson($scope.grpDtl)
        })
        .success(function(response){
            //alert("Success...!"); 
        })
        .error(function(error){   
            //alert("Fail...!");                        
        });   

        $scope.getAllGroups();
        $scope.groups.push($scope.grpDtl);
        
        $scope.grpName='';
        
    };

    //------------Delete  group
    $scope.deleteGroup = function(group,event) {
        var confirm=$mdDialog.confirm()
            .title('Do you want to delete this group ?')                            
            .targetEvent(event)
            .ok('Yes!')
            .cancel('No!');
        $mdDialog.show(confirm).then(function(){
            //$http.get('http://digin.io/apis/usercommon/removeUserGroup/'+ group)
            $http.get('http://192.168.2.33/apis/usercommon/removeUserGroup/'+ group)
            .success(function (response) {
                //alert('Deleted...!');
                $scope.getAllGroups();
            });
        },function(){

        });

        $scope.getAllGroups();
    };


       //------------Delete  group
    $scope.deleteUserFromGroup = function(group,user) {
        var confirm=$mdDialog.confirm()
            .title('Do you want to delete this this user form this group ?')                            
            .targetEvent(event)
            .ok('Yes!')
            .cancel('No!');

        $mdDialog.show(confirm).then(function(){
            $scope.UsrDtl ={
                "groupId":group,
                "users":user
            };
            $http({
                method: 'POST',
                //url: 'http://digin.io/apis/usercommon/removeUserFromGroup',
                url: 'http://192.168.2.33/apis/usercommon/removeUserFromGroup',
                data: angular.toJson($scope.UsrDtl)
            })
            .success(function(response){
                alert("Success...!");                     
            })
            .error(function(error){   
                alert("Fail...!");                        
            }); 

        },function(){

        });
    };

    $scope.loadShareWindow = function(appName) {

        $mdDialog.show({
                controller: dashboardshareCtrl,
                templateUrl: 'views/shareApp.html',
                resolve: {},
                locals:{appData:{appname: appName},userGroups:$scope.groups}, 
        });
    };

    var dashboardshareCtrl = function($rootScope,$scope, appData, userGroups){
        $scope.selectedItem = null;
        $scope.searchText = null;
        $scope.querySearch = querySearch;
        $scope.ContactDetails =userGroups;    
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
            for(i = 0, len =$scope.ContactChip.length; i < len; ++i)
            {
                var i = 0;
                function test(){
                    //Save group detail
                    var grpId=$scope.ContactChip[i].groupId;
                        var grpName=$scope.ContactChip[i].groupname;
                        $scope.GrpDtl ={
                        "id":grpId,
                        "image":"",
                        "name":grpName,
                        "type":"Group"
                        };
                        $http({
                                method: 'POST',
                                //url: 'http://digin.io/apis/usercommon/saveUiShareData',
                                url: 'http://192.168.2.33/apis/usercommon/saveUiShareData',
                                data: angular.toJson($scope.GrpDtl)
                        })
                        .success(function(response){
                            i++;
                            if(i<$scope.ContactChip.length)
                                test();
                            else
                                alert("Success...!");   
                                               
                        })
                        .error(function(error){   
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
    $scope.loadAddUsersWindow = function(group) {
        $scope.viewUsersInGroup(group,function(data){
            $mdDialog.show({
                    controller: dashboardgroupCtrl,
                    templateUrl: 'views/addUsersToGroup.html',
                    resolve: {},
                    locals:{grpId: group,users: data}, 
            });
        });
        
    };


    var dashboardgroupCtrl = function($scope, grpId,users){
       
        $scope.selectedItem = null;
        $scope.searchText = null;
        $scope.querySearch = querySearch;

        $scope.ContactDetails = [{
            Name : 'Steve',
            UserID : '500'
        },{
            Name : 'Shane',
            UserID : '100'
        },{
            Name : 'Ryan',
            UserID : '200'
        },{
            Name : 'Nick',
            UserID : '300'
        },{
            Name : 'Iann',
            UserID : '400'
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
            //     "groupId":group,
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
            $scope.userDtl ={
                "groupId":grpId,
                "users":$scope.ContactChip
            };
            $http({
                    method: 'POST',
                    //url: 'http://digin.io/apis/usercommon/addUserToGroup',
                    url: 'http://192.168.2.33/apis/usercommon/addUserToGroup',
                    data: angular.toJson($scope.userDtl)
            })
            .success(function(response){
                //alert("Success...!");   
                                   
            })
            .error(function(error){   
                //alert("Fail...!");                        
            });  

            //$scope.getAllGroups();
           

        };


        $scope.closeDialog = function () {
            $mdDialog.hide();
        };
    };


    $scope.doSecondaryAction = function(user,event) {
        var confirm=$mdDialog.confirm()
            .title('Do you want to delete '+ user)                            
            .targetEvent(event)
            .ok('Yes!')
            .cancel('No!');
        $mdDialog.show(confirm).then(function(){
            console.log(JSON.stringify(user));
            $scope.status = 'Yes';
        },function(){
            //alert('No!');
            $scope.status = 'No';
        });
   
    };


    //------TESTING END

//update refresh widget settings
    $scope.updateSettings = function() {

        if($scope.cacheLifetime==undefined)
        {
            fireMsg('0', 'Invalid cache lifetime settings!');
            return;
        }
        else if($scope.noOfWidget==undefined)
        {
            fireMsg('0', 'Invalid widgets settings!');
            return;
        }
        else if($scope.reqLimit==undefined)
        {
            fireMsg('0', 'Invalid request limit settings!');
            return;
        }
        else if($scope.cacheLifetime<=0)
        {
            fireMsg('0', 'Invalid cache lifetime settings!');
            return;
        }
        else
        {}

        var userInfo=JSON.parse(decodeURIComponent(getCookie('authData')));

        $scope.settings ={
          "user_id": userInfo.UserID,
          "email": userInfo.Email,
          "components":"dashboard1",
          "user_role":"admin",
          // "refresh_interval":parseInt($scope.refreshInterval),
          // "widget_limit":parseInt($scope.noOfWidget),
          // "query_limit":parseInt($scope.reqLimit),
          "cache_lifetime":$scope.cacheLifetime,
          "widget_limit":$scope.noOfWidget,
          "query_limit":$scope.reqLimit,
          "image_path":"/var",
          "theme_config": "bla bla",
          "SecurityToken":userInfo.SecurityToken,
          "Domain":userInfo.Domain
        }

        $http({
                method: 'POST',
                url: 'http://192.168.2.33:8080/store_user_settings/',
                data: angular.toJson($scope.settings),
                headers: {'Content-Type': 'application/javascript'}
        })
        .success(function(response){
            //alert("Success...!"); 
             fireMsg('1', 'User settings saved Successfully !');
        })
        .error(function(error){   
            fireMsg('0', 'Please re-check the settings !');
        });   
    };



//Clear cache
    $scope.clearCache = function() {
        var confirm = $mdDialog.confirm()
            .title('Do you want to clear cache ?')
            .targetEvent(event)
            .ok('Yes!')
            .cancel('No!');
            $mdDialog.show(confirm).then(function () {
                var userInfo=JSON.parse(decodeURIComponent(getCookie('authData')));
                    if($scope.clearDetail==undefined)
                    {
                        fireMsg('0', 'Select cache clear option !');
                        return;
                    }
                    else
                    {}
                                
                        $http({
                            method: 'POST',
                            url: 'http://192.168.2.33:8080/clear_cache',
                            headers: {'Content-Type': 'Content-Type:application/json',
                            'SecurityToken':userInfo.SecurityToken,
                            'Domain':userInfo.Domain
                        }
                        })
                        .success(function(response){
                            fireMsg('1', 'Cache Cleared Successfully !');
                        })
                        .error(function(error){   
                            fireMsg('0', 'Please select the cache clear option !');
                        });  
            }, function () {              
                           
            });           
    };





});


