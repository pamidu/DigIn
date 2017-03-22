////////////////////////////////
// File : DiginDashboardSavingServices.js
// Owner  : Gevindu
// Last changed date : 2017/03/22
// Version : 3.1.0.7
// Modified By : Gevindu
/////////////////////////////////


(function (){

	 DiginServiceLibraryModule.factory('DiginDashboardSavingServices',['Digin_Engine_API', '$http','$rootScope', function(Digin_Engine_API,$http,$rootScope) { 

	 	return{
	 		saveDashboard: function() {

	 			$rootScope;
	 			dashboardObject = {
			        "pages" : pagesArray,
			        "compClass": null,
			        "compType": 'dashboard',
			        "compCategory": null,
			        "compID": null,
			        "compName": dashboardName,
			        "refreshInterval": refreshInterval,
			        "filterDetails": $rootScope.dashboard.filterDetails,
			        "deletions": $rootScope.dashboard.deletions
			     }

                return $http({
                    method: 'POST',
                    url: Digin_Engine_API + 'store_componen/',
                    data: angular.toJson(Dashboard),
                    headers: {
                        'Content-Type': 'application/json',
                        'securityToken' : $rootScope.authObject.securityToken
                    }
                })
            }
	 	}

	 }]);
})();