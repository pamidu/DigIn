////////////////////////////////
// File : DiginDashboardSavingServices.js
// Owner  : Gevindu
// Last changed date : 2017/03/22
// Version : 3.1.0.7
// Modified By : Gevindu

//this function should do
//clear data from the object
//assing Ids for the object
//add object to the pouch 
/////////////////////////////////


(function (){

	 DiginServiceLibraryModule.factory('DiginDashboardSavingServices',['Digin_Engine_API', '$http','$rootScope','chartUtilitiesFactory','notifications', function(Digin_Engine_API,$http,$rootScope,chartUtilitiesFactory,notifications) { 

	 	return{
	 		saveDashboard: function() {
	 			//create a angular copy of the dashboard
	 			var dashboardCopy =  angular.copy($rootScope.currentDashboard);
	 			
	 			//remove data 
	 			for(var i = 0; i < dashboardCopy.pages.length; i++){
	 				for(var j = 0; j < dashboardCopy.pages[i].widgets.length; j++){
	 					
	 					if(dashboardCopy.pages[i].widgets[j].widgetData.chartType.chartType == "highCharts"){
	 							//this.removeHighChartsData(dashboardCopy.pages[i].widgets[j].widgetData.widgetConfig);
	 					}
	 				}
	 			}

                $http({
                    method: 'POST',
                    url: 'http://192.168.0.101:8080/' + 'store_component/',
                    data: angular.toJson(dashboardCopy),
                    headers: {
                        'Content-Type': 'application/json',
                        'securityToken' : $rootScope.authObject.SecurityToken
                    }
                }).then(function(result){
                	if(result.data.Is_Success){

                		//assing the ID's to the Dashboard, Pages and Widgets
                		$rootScope.currentDashboard.compID = result.data.Result.comp_id;

                		for(var i = 0; i < $rootScope.currentDashboard.pages.length; i++){
                			$rootScope.currentDashboard.pages[i].pageID = result.data.Result.pages[i].page_id

                			for(var j=0 ; j < $rootScope.currentDashboard.pages[i].widgets.length; j++){

                				$rootScope.currentDashboard.pages[i].widgets[j].widgetID = result.data.Result.pages[i].widget_ids[j]
                			}
                		}


						notifications.finishLoading();
						notifications.toast(1,"Changes Successfully Saved");
                	}
                },function(err){
                	console.log(err);
                });
            },
		 	removeHighChartsData: function(object){
		 		for(var i=0 ; i < object.series.length; i++){
		 			object.series[i].data = [];
		 		}
		 	}
	 	}

	 }]);
})();