routerApp.controller('summarizeCtrl', ['$scope','$http','$objectstore','$mdDialog','$rootScope','$q','$timeout',
 function ($scope,$http,$objectstore,$mdDialog,$rootScope,$q,$timeout)
 {
	   $scope.indexes = [];
 
     var self = this;
     self.selectedItem  = null;
     self.searchText    = null;
     self.querySearch   = querySearch;
     self.simulateQuery = false;
     self.isDisabled    = false; 
   
     $scope.selectedFields = [];
     var parameter = "";
     $scope.products = [];
    
     
        $scope.getFields = function(index){
           $scope.selectedFields = [];
        var client = $objectstore.getClient("com.duosoftware.com",index.display);
       client.onGetMany(function(data){
      if (data){               
              $scope.selectedFields = data;
              var client = $objectstore.getClient("com.duosoftware.com",index.display);
              client.onGetMany(function(datae){
                if (datae){ 
                    $scope.products = [];
                   for (var i = 0; i <datae.length; i++) {
                         var data = datae[i],
                         product = {};
                         for (var j = 0; j < $scope.selectedFields.length; j++) {
                         var field = $scope.selectedFields[j];
                         product[field] = data[field];
                        }
                       $scope.products.push(product);
                  }
                  pivotUi() ;
                 }
               });
             client.getByFiltering("*");

         }
      });
     
     client.getFields("com.duosoftware.com",index.display);
      }  
       $scope.remove = function() {
            // Easily hides most recent dialog shown...
           // no specific instance reference is needed.
            $mdDialog.hide();
        };
  
        function pivotUi() {
        var renderers = $.extend($.pivotUtilities.renderers, $.pivotUtilities.gchart_renderers, $.pivotUtilities.d3_renderers);
            $("#tableoutput").pivotUI($scope.products, {
                 renderers: renderers,
                rows: [$scope.selectedFields[0]],
                cols:[$scope.selectedFields[1]],
              
                rendererName: "Table"         
            });
        }
        function querySearch (query) {
      var results = query ? $rootScope.indexes.filter( createFilterFor(query) ) : [],
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
}]);