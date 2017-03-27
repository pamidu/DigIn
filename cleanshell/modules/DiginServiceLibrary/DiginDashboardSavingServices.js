////////////////////////////////
// File : DiginDashboardSavingServices.js
// Owner  : Gevindu
// Last changed date : 2017/03/22
// Version : 3.1.0.7
// Modified By : Gevindu
/////////////////////////////////


(function (){

	 DiginServiceLibraryModule.factory('DiginDashboardSavingServices',['Digin_Engine_API', '$http','$rootScope','chartUtilitiesFactory', function(Digin_Engine_API,$http,$rootScope,chartUtilitiesFactory) { 

	 	return{
	 		saveDashboard: function() {


	 			//create a angular copy of the dashboard

	 			var dashboardCopy =  angular.copy($rootScope.currentDashboard);

	 			for(var i = 0; i < $rootScope.currentDashboard.pages.length; i++){
	 				for(var j = 0; j < $rootScope.currentDashboard.pages[i].widgets.length; j++){
	 					
	 					chartUtilitiesFactory.removeDataPoints(dashboardCopy.pages[i].widgets[j].widgetData.widgetConfig);
	 				}
	 			}

               return $http({
                    method: 'POST',
                    url: Digin_Engine_API + 'store_componen/',
                    data: angular.toJson(dashboardCopy),
                    headers: {
                        'Content-Type': 'application/json',
                        'securityToken' : $rootScope.authObject.securityToken
                    }
                })
            }
	 	}

	 }]);
})();