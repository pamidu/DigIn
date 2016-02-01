routerApp.directive('commonDataSrc', function($http,$log,$mdSidenav,CommonDataSrc) {

   return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: 'views/common-data-src/ViewCommonDataSrc.html',
      link: function(scope, element) {
         scope.datasources = [
               {name: "DuoStore"},
               {name: "BigQuery"},
               {name: "CSV/Excel"},
               {name: "Rest/SOAP Service"},
               {name: "SpreadSheet"}
           ];
         
         scope.toggleRight = buildToggler('right');
         scope.isOpenRight = function(){
           return $mdSidenav('right').isOpen();
         };
         
         scope.onChangeSource = function(src){
            CommonDataSrc.getTables(src, function(data){
               scope.dataTables = data;
            });
         };
         
         scope.onChangeTable = function(tbl){
            CommonDataSrc.getFields(tbl, function(data){
               scope.dataFields = data;
            });
         };
         
         function buildToggler(navID) {
            return function() {
              $mdSidenav(navID)
                .toggle()
                .then(function () {
                  $log.debug("toggle " + navID + " is done");
                });
            }
          }
         
      }
   }
});