DiginServiceLibraryModule.factory('DiginServices', ['$rootScope','$http', 'notifications', 'Digin_Engine_API', 'Digin_Domain',
	'auth_Path', 'chartSyncServices','Upload', function($rootScope,$http,notifications, Digin_Engine_API, Digin_Domain,auth_Path,chartSyncServices,Upload) {
	var cache = {};
	return {
        getUserSettings: function() {
             //return the promise directly.
             return $http.get(Digin_Engine_API+'get_user_settings?SecurityToken='+$rootScope.authObject.SecurityToken+'&Domain='+Digin_Domain)
                       .then(function(result) {
                            //resolve the promise as the data
                            return result.data.Result;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get User Settings");
						 });
        },postUserSettings: function(userSettings) {
        	notifications.startLoading(null, "Saving Settings...");
        	console.log(userSettings);

			var req = {
				method: 'POST',
				url: Digin_Engine_API + 'store_user_settings/',
				headers: {
                    'Content-Type': 'application/json',
					'Securitytoken' : $rootScope.authObject.SecurityToken
				},
				data: angular.toJson(userSettings)
			}
			return $http(req).then(function(result){
				notifications.finishLoading();
				return result.data;
			}, function(error){
				notifications.toast(0, "Failed to save Settings");
				notifications.finishLoading();
			});

		},updateUserSettings: function(userSettings)
		{
		   	notifications.startLoading(null, "Saving Settings...");
			
			var req = {
				method: 'POST',
				url: Digin_Engine_API + 'update_user_settings/',
				headers: {
                    'Content-Type': 'application/json',
					'Securitytoken' : $rootScope.authObject.SecurityToken
				},
				data: angular.toJson(userSettings)
			}
			
			return $http(req).then(function(result){
				notifications.finishLoading();
				return result.data;
			}, function(error){
				notifications.toast(0, "Failed to save Settings");
				notifications.finishLoading();
			});
			
		},getSession: function() {
             //return the promise directly.
             return $http.get(auth_Path+'GetSession/' + getCookie('securityToken') + '/Nil')
                       .then(function(result) {
                            //resolve the promise as the data
                            return result.data;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Session");
						 });
        },getTenant: function() {
             //return the promise directly.
             return $http.get('/auth/tenant/GetTenant/' + window.location.hostname)
                       .then(function(result) {
                            //resolve the promise as the data
                            return result.data;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get User Settings");
						 });
        },getDiginComponents: function() {
             //return the promise directly.
             return $http.get(Digin_Engine_API+'get_all_components?SecurityToken='+$rootScope.authObject.SecurityToken+'&Domain='+Digin_Domain) //jsons/everything.json
                       .then(function(result) {
                            //resolve the promise as the data
                            return result.data.Result;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Digin Components");
						 });
        }, getComponent: function(ev, dashboardId) {
             //return the promise directly.
			 notifications.startLoading(ev, "Getting Dashboard");
			 
                return $http.get(Digin_Engine_API +'get_component_by_comp_id?comp_id='+dashboardId+'&SecurityToken='+$rootScope.authObject.SecurityToken+'&Domain'+Digin_Domain)
                       .then(function(result) {
                            //resolve the promise as the data
							notifications.finishLoading();
							return result.data.Result;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Dashboard or report");
								notifications.finishLoading();
						 });
        }, deleteComponent: function(ev,dashboardId, permanent) {
			notifications.startLoading(ev, "Deleting Dashboard...");
			var reqParam = [{
                "comp_id": dashboardId.toString(),
                "permanent_delete": permanent
            }];
			
			var req = {
				 method: 'DELETE',
				 url: Digin_Engine_API + 'delete_components/',
				 headers: {
					'Securitytoken' : $rootScope.authObject.SecurityToken
				 },
				 data: angular.toJson(reqParam)
			}
			return $http(req).then(function(result){
					notifications.finishLoading();
					return result.data;
				}, function(error){
					notifications.toast(0, "Failed to delete dashboard");
					notifications.finishLoading();
				});
        }, getWidgetTypes: function() {
             //return the promise directly.
		 
             return $http.get('jsons/widgetType.json')
                       .then(function(result) {
							return result.data.Result;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Widgets");
						 });
        }, getWidgets: function() {
             //return the promise directly.
			 
             return $http.get('jsons/widgets.json')
                       .then(function(result) {
							return result.data.Result;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get Widgets");
						 });
        }, getRootObjectById: function(id,obj) {
             //return the promise directly.
			 for(i=0;i<obj.length;i++){
					if(obj[i].widgetID == id) return i;
				}		
        },getDBConfigs: function() {
             //return the promise directly.
             return $http.get('jsons/dbConfig.json')
                       .then(function(result) {
                            //resolve the promise as the data
                            return result.data;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get DB Configs");
						 });
        },getChartTypes: function() {
             //return the promise directly.
             return $http.get('jsons/chartTypes.json')
                       .then(function(result) {
                            //resolve the promise as the data
                            return result.data;
                        },function errorCallback(response) {
								console.log(response);
								notifications.toast(0, "Falied to get DB Configs");
						});
        },syncPages: function(dashboard,pageIndex,cb,is_sync) {
        	var count = 0;
			if (!dashboard.pages[pageIndex].isSeen) {
				angular.forEach(dashboard.pages[pageIndex].widgets,function(widget){
					if (widget.widgetData.chartType.chartType == "highCharts") {
						dashboard.pages[pageIndex].isSeen = true;
						widget.widgetData.syncOn = true;
						// send is_sync parameter as true
						chartSyncServices.sync(widget.widgetData,function(widgetData){
							widgetData.syncOn = false;
							count++;
							if (count == dashboard.pages[pageIndex].widgets.length) { cb(dashboard); }
						}, is_sync);
					} 
					else if(widget.widgetData.chartType.chartType == "tabular"){
						widget.widgetData.widgetConfig.runtimeQuery = "";
						widget.widgetData.widgetConfig.runtimefilterString = "";

						dashboard.pages[pageIndex].isSeen = true;
						widget.widgetData.syncOn = true;
						// send is_sync parameter as true
						chartSyncServices.sync(widget.widgetData,function(widgetData){
							widgetData.syncOn = false;
							count++;
							if (count == dashboard.pages[pageIndex].widgets.length) { cb(dashboard); }
						}, is_sync);
					}
					else {
						count++;
						if (count == dashboard.pages[pageIndex].widgets.length) { cb(dashboard); }
					}
				})
			}
        },getShareWidgetURL:function(widget,callback,provider){
        	var svgTag = "";
	        var date = new Date().getTime();
	        var widType =  widget.widgetData.chartType.chartType;
	        var fileNamepng= widType + date +".png";
	        var fileName = widType + date +".svg";
	        var widgetName = "";

	        if(typeof widget.widgetName != "undefined"){
	          if(widget.widgetData.widName != "")
	            widgetName = widget.widgetName;
	        }

	        if(widType=="highCharts" || widType=="histogram"  || widType=="forecast" || widType=="boxplot" || widType=="metric"){

	          var highchartsObj = angular.copy(widget.widgetData.widgetConfig);
	          if ( highchartsObj.title !== undefined) {
	            highchartsObj.title.text = widgetName;
	          }

	          var chart = angular.copy(highchartsObj.getHighcharts());
	          if ( highchartsObj.title !== undefined ) {
	            chart.setTitle({
	              text: widgetName
	            });
	          }          

	          svg = chart.getSVG();
	          var file = new File([svg], fileName, {type: "image/svg+xml"});
	        }
	        /*else if(widType=="hierarchy" || widType=="sunburst"){
	          var id = "#" + widget.widgetData.widData.id;
	          var element = $("" + id + "");
	          var svgTag = element[0].children[0];

	          //--------------------------------------------------------------------------------------
	           if(widgetName != ""){
	              var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
	              newElement.setAttribute('x',200);
	              newElement.setAttribute('y',550);
	              newElement.setAttribute('fill','#000000');
	              newElement.setAttribute('font-size',17);
	              newElement.setAttribute('font-family','Verdana');

	              newElement.innerHTML = widgetName;
	              svgTag.appendChild(newElement);
	            }
	          //--------------------------------------------------------------------------------------

	          var svgTag =element[0].children[0].innerHTML;
	          svgTag ='<svg viewBox="0 0 500 600" width="100%" height="100%">'+svgTag+ '</svg>';
	          var file = new File([svgTag], fileName, {type: "image/svg+xml"});
	           

	        }*/else if(widType=="bubble"){
	           var highchartsObj = angular.copy(widget.widgetData.widgetConfig);
	           highchartsObj.title.text = widgetName;
	           var chart = angular.copy(highchartsObj.getHighcharts());
	            chart.setTitle({
	              text: widgetName
	          	})
	           svg = chart.getSVG();
	           var file = new File([svg], fileName, {type: "image/svg+xml"});
	        }

	        var userInfo= JSON.parse(decodeURIComponent(getCookie('authData')));
	           	Upload.upload({
	            url: Digin_Engine_API + 'file_upload',
	            headers: {'Content-Type': 'multipart/form-data',},
	            data: {
	                db: 'BigQuery',
	                SecurityToken: userInfo.SecurityToken,
	                other_data:'widget_image',
	                file: file
	            }
	        }).success(function (data) {
		        if(data.Is_Success == true){
		          	var tenent = window.location.hostname;
		            //var url = "http://" + Digin_Domain + data.Result + "/digin_user_data/" + userInfo.UserID + "/" + userInfo.Username + "/shared_files/" +fileName;
		            var url = "http://" + Digin_Domain + data.Result + "/digin_user_data/" + userInfo.UserID + "/" + tenent + "/shared_files/" +fileNamepng;
		            callback(url,provider);
		        }else{
		          notifications.toast(0, data.Custom_Message);
		        }
	        }).error(function (data) {
	           
	        });
        }
   }
}]);//END OF DiginServices