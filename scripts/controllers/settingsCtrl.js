routerApp.controller('settingsCtrl', ['$scope','$rootScope', '$http', '$state','$mdDialog','Digin_Base_URL',function($scope,$rootScope,$http,$state,$mdDialog,Digin_Base_URL) {
    var featureObj = localStorage.getItem("featureObject");
    getJSONData($http,'features',function(data){
      $scope.featureOrigin = data;
      var obj = JSON.parse(featureObj);      
      if(featureObj === null){ 
        $scope.features =data;
        $scope.selected = [];
      }
      else {
        $scope.selected = [];
        for(i=0;i<obj.length;i++){
          if(obj[i].stateStr === "Enabled")
            $scope.selected.push(obj[i]);
        }
        $scope.features = obj;
        
      }
    });


    

		  $scope.toggle = function (item, list) {
    
		    var idx = list.indexOf(item);
		    if (idx > -1) {
          list.splice(idx, 1);
          item.state = false;
          item.stateStr = "Disabled";
        }
		    else{
          list.push(item);
          item.state = true;
          item.stateStr = "Enabled";
        } 
		  };

      $scope.test = function (item) {
       
        return false;
      };

      $scope.finish = function(){
        for(i=0;i<$scope.selected.length;i++){
          for(j=0;j<$scope.featureOrigin.length;j++){
            if($scope.featureOrigin[j].title == $scope.selected[i].title){
              $scope.featureOrigin[j].state = true;
              $scope.featureOrigin[j].stateStr = "Enabled";
            }
          }
        }

        getJSONData($http,'menu',function(data){

            var orignArray = [];
            for(i=0;i<$scope.featureOrigin.length;i++){
              if($scope.featureOrigin[i].state==true)
                orignArray.push($scope.featureOrigin[i]);
            }
            $scope.menu = orignArray.concat(data);
             
        });
        localStorage.setItem("featureObject", JSON.stringify($scope.featureOrigin));
        $mdDialog.show({
            controller: 'settingsCtrl',
      templateUrl: 'views/settings-save.html',
        resolve: {
          
        }
    })
        
      };

      $scope.saveSettingsDetails = function(){
        window.location = Digin_Base_URL + "home.html";
      };

      $scope.closeDialog = function(){
        $mdDialog.hide();
      };
    }
    ]);
