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

	 			

	 			// for(var i = 0; i < dashboardCopy.pages.length; i++){
	 			// 	for(var j = 0; j < dashboardCopy.pages[i].widgets.length; j++){
	 					
	 			// 		chartUtilitiesFactory.removeDataPoints(dashboardCopy.pages[i].widgets[j].widgetData.widgetConfig);
	 			// 	}
	 			// }

                $http({
                    method: 'POST',
                    url: "http://192.168.0.101:8080/" + 'store_component/',
                    data: angular.toJson(dashboardCopy),
                    headers: {
                        'Content-Type': 'application/json',
                        'securityToken' : $rootScope.authObject.SecurityToken
                    }
                }).then(function(data){
                	console.log(data);
                },function(err){
                	console.log(err);
                });
            }
	 	}

	 }]);
})();