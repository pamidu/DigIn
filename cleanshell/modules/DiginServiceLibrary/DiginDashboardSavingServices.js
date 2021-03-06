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

	 DiginServiceLibraryModule.factory('DiginDashboardSavingServices',['Digin_Engine_API', '$http','$rootScope','chartUtilitiesFactory',
	 	'notifications','PouchServices', 'filterServices', 
	 	function(Digin_Engine_API,$http,$rootScope,chartUtilitiesFactory,notifications,PouchServices,filterServices) { 

	 	return{
	 		saveDashboard: function(ev, newDashboardDetails) {
	 			
				$rootScope.currentDashboard.compName = newDashboardDetails.dashboardName;
				$rootScope.currentDashboard.refreshInterval = newDashboardDetails.refreshInterval
				//create a angular copy of the dashboard
	 			var dashboardCopy =  angular.copy($rootScope.currentDashboard);

	 			// remove dashboard filter related parameters
	 			angular.forEach(dashboardCopy.filterDetails,function(db_filter){
	 				if (db_filter.name !== undefined) delete db_filter.name;
	 				if (db_filter.fieldvalues !== undefined) delete db_filter.fieldvalues;

	 			});

				delete dashboardCopy.isFiltered;
	 			
	 			//remove data 
	 			for(var i = 0; i < dashboardCopy.pages.length; i++){
	 				delete dashboardCopy.pages[i].isSeen;
	 				delete dashboardCopy.pages[i].isFiltered;
	 				for(var j = 0; j < dashboardCopy.pages[i].widgets.length; j++){
	 					
	 					if(dashboardCopy.pages[i].widgets[j].widgetData.chartType.chartType == "highCharts"){
	 							// this.removeHighChartsData(dashboardCopy.pages[i].widgets[j].widgetData.widgetConfig);
	 							// remove filter related data
	 							filterServices.removeFilterData(dashboardCopy.pages[i].widgets[j]);
	 					}
	 				}
	 			}
				notifications.startLoading(ev,"Saving '"+newDashboardDetails.dashboardName+"' dashboard, Please wait...");
                return $http({
						method: 'POST',
						url:  Digin_Engine_API + 'store_component/',//http://192.168.0.101:8080 //Digin_Engine_API
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
									$rootScope.currentDashboard.pages[i].widgets[j].widgetID = result.data.Result.pages[i].widget_ids[j].widget_id;
									if($rootScope.currentDashboard.pages[i].widgets[j].widgetData.chartType.chartType=="metric"){
									 $rootScope.currentDashboard.pages[i].widgets[j].notification_data[0].notification_id = result.data.Result.pages[i].widget_ids[j].notification_ids[0];
									}
								}
							}
							
							$rootScope.selectedDashboard = angular.copy($rootScope.currentDashboard);
							notifications.finishLoading();
							notifications.toast(1,"Changes Successfully Saved");
							newDashboardDetails.compID = result.data.Result.comp_id;
							console.log(newDashboardDetails);
							PouchServices.saveAndUpdateDashboard($rootScope.currentDashboard);
							return newDashboardDetails;
						}
					},function(err){
						notifications.finishLoading();
						notifications.toast(0,"Error saving Dashboard");
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
	 
	 DiginServiceLibraryModule.factory('PouchServices',['Digin_Engine_API','pouchDB', '$http','$rootScope','notifications','DiginServices', function(Digin_Engine_API,pouchDB,$http,$rootScope,notifications,DiginServices) { 

		function persistData(dashboard)
		{
			  var dashboardDoc = {
				  _id : dashboard.compID.toString(),
				  dashboard : dashboard
			  }
			  
			  $rootScope.localDb.put(dashboardDoc, function(err, response) {
				  if (err) {
					  console.log(err);
					  
				  }else {
					  console.log("Document created successfully");

				  }
			  });
		}
		

			
		return{
			storeAndUpdateUserSettings: function(userSettings){
				
				$rootScope.localDb.get( $rootScope.authObject.Email , function(err, doc){
					if(err)
					{
						if(err.status === 404)
						{
							var userSettingsDoc = {
								_id : $rootScope.authObject.Email,
								userSettings : userSettings
							}
							
							$rootScope.localDb.put(userSettingsDoc, function(err, response) {
							  if (err) {
								  console.log(err);
								  
							  }else {
								  console.log("userSettings doc created successfully");
							  }
							})
						}
								
					}else{
						var userSettingsDoc = {
							_id : $rootScope.authObject.Email,
							userSettings : userSettings,
							_rev : doc._rev
						}
						$rootScope.localDb.put(userSettingsDoc, function(err, response) {
							if (err) {
								console.log("error in updating");
							}else {
								console.log("userSettings doc updated successfully");
							}
						});
					}
				})
			},getUserSettings: function(){
				return $rootScope.localDb.get($rootScope.authObject.Email).then(function (doc) {
						return doc.userSettings;
					}).catch(function (err) {//if the dashboard is not saved locally
						
					});
			},getDiginComponents: function(){
				
				if($rootScope.online == true)
				{
					return DiginServices.getDiginComponents().then(function(data) {
								return data;
							})
				}else{
					return $rootScope.localDb.allDocs({
							include_docs: true,
							attachments: true
						}).catch(function (err) {
							console.log(err);
						}).then(function (data) {
							console.log(data);
							var dashboards = [];
							angular.forEach(data.rows, function (row) {
								//console.log(row.doc.dashboard);
								var thisDashboard = row.doc.dashboard;
								dashboards.push({compID: thisDashboard.compID, compName: thisDashboard.compName, compType: thisDashboard.compType});
							})
							//console.log(dashboards);
							return dashboards;
						});
				}
				
			},
			getDashboard: function(ev, dashboardId){
				return $rootScope.localDb.get(dashboardId.toString()).then(function (doc) {
					console.log(doc.dashboard);
						/*return DiginServices.getComponent(ev, dashboardId).then(function(data) {
							data.deletions = {
												"componentIDs":[],
												"pageIDs":[],
												"widgetIDs":[]
											 };
							persistData(data);
							return data;
						});*/
						return doc.dashboard;
					}).catch(function (err) {//if the dashboard is not saved locally
					
						return DiginServices.getComponent(ev, dashboardId).then(function(data) {
							data.deletions = {
												"componentIDs":[],
												"pageIDs":[],
												"widgetIDs":[]
											 };
							persistData(data);
							return data;
						});
					});
			},
			saveAndUpdateDashboard: function(selectedDB) {
				console.log(selectedDB.compID.toString());
				$rootScope.localDb.get( selectedDB.compID.toString() , function(err, doc){
					console.log(err);
					console.log(doc.dashboard);
					if(err)
					{
						if(err.status === 404)
						{
							var dashboardDoc = {
								_id : selectedDB.compID.toString(),
								dashboard : angular.copy($rootScope.currentDashboard)
							}
							
							$rootScope.localDb.put(dashboardDoc, function(err, response) {
							  if (err) {
								  console.log(err);
								  
							  }else {
								  console.log("dashboard doc created successfully");
							  }
							})
						}
								
					}else{
						
						var updatedDashboard = JSON.parse(JSON.stringify(angular.copy($rootScope.currentDashboard)));

						for (var i = 0, len = updatedDashboard.pages.length; i<len; ++i){
							delete updatedDashboard.pages[i].isFiltered;
							delete updatedDashboard.pages[i].isSeen;	
						}

						var dashboardDoc = {
							_id : selectedDB.compID.toString(),
							dashboard : updatedDashboard,
							_rev : doc._rev
						}
						$rootScope.localDb.put(dashboardDoc, function(err, response) {
							if (err) {
								console.log("error in updating");
							}else {
								console.log("dashboard doc updated successfully");
							}
						});
					}
				})
					
			}//end of saveAndUpdateDashboard factory
		}//end of PouchServices return
	}]);//end of PouchServices
})();