routerApp.controller('dashboardSetupCtrl', function($scope, $mdDialog, $location, $http, Digin_Engine_API1, ngToast,$rootScope) {
    
    //theme colors array
    $scope.colorArr = [{value:'#F44336'},{value:'#E91E63'},{value:'#9C27B0'},{value:'#673AB7'},{value:'#3F51B5'},{value:'#2196F3'},{value:'#03A9F4'},{value:'#00BCD4'},{value:'#009688'},{value:'#4CAF50'},{value:'#8BC34A'},{value:'#CDDC39'},{value:'#FFEB3B'},{value:'#FFC107'},{value:'#FF9800'},{value:'#FF5722'},{value:'#795548'},{value:'#9E9E9E'},{value:'#607D8B'}];
    
    $scope.selectedColorObj = {
        primaryPalette: "",
        accentPalette: ""
    };
    
    //add user view state
    $scope.addUsrState = false;
    
    //breaking the coloArr into chunks of 6 colors    
    $scope.chunkedColorArr = chunk($scope.colorArr, 6);
    
    /*adding a new user
        #addState : bool - true if the add user view is enabled
    */
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

            var userInfo = JSON.parse(getCookie("authData"));
            //-----Check exist or not
            $http.get('http://104.197.27.7:3048/tenant/AddUser/'+$scope.user.email+'/user', {
                headers: {'Securitytoken': userInfo.SecurityToken}
            })
              .success(function(response){
                  //alert(JSON.stringify(response));
                  //------if invited----------
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
        { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: false },
        { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false }
      ];

    $scope.goToPerson = function(person, event) {
        $mdDialog.show(
          $mdDialog.alert()
            .title('Navigating')
            //.textContent('Inspect ' + person)
            .ariaLabel('Person inspect demo')
            .ok('Neat!')
            .targetEvent(event)
        );
    };



      $scope.sizes = [
          "5-min",
          "10-min",
          "15-min",
          "30-min"
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
  




    /*
    $scope.doSecondaryAction = function(event) {
        $mdDialog.show(
        $mdDialog.alert()
            .title('Secondary Action')
            //.textContent('Secondary actions can be used for one click actions')
            .ariaLabel('Secondary click demo')
            .ok('Neat!')
            .targetEvent(event)
        );
    };
    */

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

    //-----------------
    $scope.headerbar = true;

    $scope.updateAccount = function(){          
        if($scope.image==""){
            $rootScope.image = "styles/css/images/innerlogo.png";
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
            // $('#content1').css("top", "0px");
            // $('#content1').css("height", "calc(100vh)");
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



});

