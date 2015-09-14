  $(window).load(function() {
     $('#pagePreLoader').hide();
  });

  routerApp.controller('elasticController',['$scope','$http','$objectstore','$mdDialog','$rootScope',function($scope,$http,$objectstore,

$mdDialog,$rootScope){
  $scope.indexes = [];  

    $scope.checkedFields = [];
     $scope.excelNamespace = "";
       $scope.excelClass = "";
     var client = $objectstore.getClient("com.duosoftware.com"," ");
     client.onGetMany(function(data){
      if (data){
          $scope.indexes = data;        
      }
     }); 
       client.onError(function(data){
           
      }); 

       $scope.alert = function ()
       {
 $mdDialog.show({
            controller: 'successCtrl',  
      templateUrl: 'views/file-success.html',
        resolve: {
          
        }
    })
     
       }
     $scope.toggleCheck = function (index) {
     if ($scope.checkedFields.indexOf(index) === -1) {
            $scope.checkedFields.push(index);
        } else {
           $scope.checkedFields.splice($scope.checkedFields.indexOf(index), 1);
        }
    };
     client.getClasses("com.duosoftware.com");
       $scope.getFields = function(){
           $scope.selectedFields = [];
        var client = $objectstore.getClient("com.duosoftware.com",$scope.ind);
       client.onGetMany(function(data){
      if (data){               
              data.forEach(function(entry) {
              $scope.selectedFields.push({ name: entry, checked: false });
        
            });    
      }
      });

     client.getFields("com.duosoftware.com",$scope.ind);
      }  
        
      $scope.getData = function(){

        $('#pagePreLoader').show();
         var parameter = "";
         $scope.QueriedData = [];
          for (param in $scope.checkedFields)
            {
             
               parameter += " " + $scope.checkedFields[param].name;
               $rootScope.header  = [];
               $rootScope.header.push({name:$scope.checkedFields[param].name,field:$scope.checkedFields[param].name});
            }         
       var client = $objectstore.getClient("com.duosoftware.com","");
       client.onGetMany(function(data){
        if (data){          

              $rootScope.DashboardData =[];
              $rootScope.DashboardData = data;
               $mdDialog.show({
              
      controller: 'ShowTableCtrl',
      templateUrl: 'views/data-explorer.html',
      
       
    });
      setTimeout(function() {
       $('#pagePreLoader').hide(); 
    }, 1000);
          
          }
      }); 
      client.getSelected(parameter);    
      }  


       $scope.executeQuery = function(widget){
            
       var client = $objectstore.getClient("com.duosoftware.com","Voters");
       client.onGetMany(function(data){
        if (data){                     
              $rootScope.DashboardData =[];
              $rootScope.DashboardData = data;
               $mdDialog.show({
      controller: 'ShowTableCtrl',
      templateUrl: 'views/data-explorer.html',
      
       
           })
            
          }
      }); 
      client.getByFiltering(widget.query);    
      }  

       $scope.buildchart = function(widget){
          $('#pagePreLoader').show();
        var parameter = "";
         $scope.QueriedData = [];
         $scope.chartSeries = [];
         $rootScope.header =[];
          for (param in $scope.checkedFields )
            {

               parameter += " " + $scope.checkedFields[param].name;
               $rootScope.header.push({name:$scope.checkedFields[param].name,field:$scope.checkedFields[param].name});
            }       
          
       var client = $objectstore.getClient("com.duosoftware.com",$scope.ind);
       client.onGetMany(function(datai){
        if (datai){                     

              $rootScope.DashboardData =[];
              $rootScope.DashboardData = datai;             
              widget.chartConfig.series  = [];
             
                   widget.chartConfig.series  = $rootScope.DashboardData.map(function(elm) {
                      var _fieldData = [];

                     _fieldData.push(parseInt(elm[widget.dataname]))
                            return { name: elm[widget.seriesname], data:_fieldData};
                               });             
                widget.chartSeries = [];
                widget.chartSeries =widget.chartConfig.series;
               
                 $('#pagePreLoader').hide();
          }
          
      }); 
      client.getSelected(parameter);    
      }  
 }]);