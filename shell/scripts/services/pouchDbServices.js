////////////////////////////////
// File : QueryBuilderCtrl
// Owner  : Dilani
// Last changed date : 2016/12/20
// Version : 3.1.0.2
// Modified By : Gevindu
/////////////////////////////////
routerApp.service('pouchDbServices',function($rootScope,$http,Digin_Engine_API,Digin_Domain,pouchDB,filterService,$qbuilder){

    this.tempRootscopePageId;

    var thisService = this;

     this.insertPouchDB = function(dashboardObject,dashboardId,cb){
          if ( typeof($rootScope.page_id) != "undefined" || $rootScope.page_id != ""){
                thisService.tempRootscopePageId = $rootScope.page_id;
          }

          if(dashboardObject == null){
              var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));
              $http({
                      method: 'GET',
                      url: Digin_Engine_API + 'get_component_by_comp_id?comp_id=' + dashboardId + '&SecurityToken=' + userInfo.SecurityToken + '&Domain=' + Digin_Domain
                  })
                      .success(function (data) {
                          if (data.Is_Success) {
                              var dashboard = angular.fromJson(CircularJSON.stringify(data.Result));
                                var count=0;
                                var index=0;
                                var metricArray = [];
                                if(dashboard.pages[index].widgets.length == 0)
                                  settoPouch(dashboard,true,cb);

                                for (var i = 0; i < dashboard.pages[index].widgets.length; i++) {
                                    dashboard.pages[index]["isSeen"] = true;
                                    var widget = dashboard.pages[index].widgets[i];
                                    console.log('syncing...');
                                    if (typeof(widget.widgetData.commonSrc) != "undefined") {
                                        widget.widgetData.syncState = false;
                                        //Clear the filter indication when the chart is re-set
                                        widget.widgetData.filteredState = false;
                                        filterService.clearFilters(widget); 
                                        if (widget.widgetData.selectedChart.chartType != "d3hierarchy" && widget.widgetData.selectedChart.chartType != "d3sunburst") {
                                            $qbuilder.sync(widget.widgetData, function (data) {
                                              count++;
                                              if(dashboard.pages[0].widgets.length == count){
                                                  dashboardJson = angular.fromJson(CircularJSON.stringify(dashboard));
                                                  settoPouch(dashboardJson,true,cb);
                                                  $rootScope.dashboard = dashboard;
                                               }
                                            });

                                        }else{
                                          count++;
                                           if(dashboard.pages[0].widgets.length == count){
                                                  dashboardJson = angular.fromJson(CircularJSON.stringify(dashboard));
                                                  settoPouch(dashboardJson,true,cb);
                                                  $rootScope.dashboard = dashboard;
                                               }
                                        }
                                    }else{
                                      count++;
                                      if(dashboard.pages[0].widgets.length == count){
                                          dashboardJson = angular.fromJson(CircularJSON.stringify(dashboard));
                                          settoPouch(dashboardJson,true,cb);
                                          $rootScope.dashboard = dashboard;
                                       }
                                    }
                                }
                          }
                           
                      })
                      .error(function (error) {

                      });  

            }
            else if(dashboardId == null){
              var dashboard = angular.fromJson(CircularJSON.stringify(dashboardObject));
                                var count=0;
                                var index =0;
                               
                                for (var i = 0; i < dashboard.pages[index].widgets.length; i++) {
                                    dashboard.pages[index]["isSeen"] = true;
                                    var widget = dashboard.pages[index].widgets[i];
                                    console.log('syncing...');
                                    if (typeof(widget.widgetData.commonSrc) != "undefined") {
                                        widget.widgetData.syncState = false;
                                        //Clear the filter indication when the chart is re-set
                                        widget.widgetData.filteredState = false;
                                        filterService.clearFilters(widget); 
                                        if (widget.widgetData.selectedChart.chartType != "d3hierarchy" && widget.widgetData.selectedChart.chartType != "d3sunburst") {
                                            $qbuilder.sync(widget.widgetData, function (data) {
                                              count++;
                                              if(dashboard.pages[0].widgets.length == count){
                                                  dashboardJson = angular.fromJson(CircularJSON.stringify(dashboard));
                                                  settoPouch(dashboardJson,true,cb);
                                               }
                                              
                                            });

                                        }else{
                                          count++;
                                           if(dashboard.pages[0].widgets.length == count){
                                                  dashboardJson = angular.fromJson(CircularJSON.stringify(dashboard));
                                                  settoPouch(dashboardJson,true,cb);
                                                  $rootScope.dashboard = dashboard;
                                               }
                                        }
                                    }else{
                                      count++;
                                      if(dashboard.pages[0].widgets.length == count){
                                          dashboardJson = angular.fromJson(CircularJSON.stringify(dashboard));
                                          settoPouch(dashboardJson,true,cb);
                                          $rootScope.dashboard = dashboard;
                                       }
                                    }
                                
                                }
                           
            }
           
        }


        //dashboard - dashboard object
        //flag - whether to call the getAllDashboards method or not
        var settoPouch = function(dashboard,flag,cb){

            var db = $rootScope.db;
             // set a new id to a new record to be inserted
              if ( typeof(thisService.tempRootscopePageId) == "undefined" || thisService.tempRootscopePageId == ""){
                  var id = "temp" + Math.floor(Math.random() * 10000000);
              }
              else {
                  var id = thisService.tempRootscopePageId;
              }
                
                db.get( id , function(err, doc){
                      if (err){
                          if (err.status = '404') { // if the document does not exist
                              //Inserting Document into pouchDB
                              var dashboardDoc = {
                                  _id : id,
                                  dashboard : dashboard
                              }
                              db.put(dashboardDoc, function(err, response) {
                                  if (err) {
                                      return console.log(err);
                                      if (flag){
                                        $rootScope.privateFun.getAllDashboards();
                                      }
                                      
                                  } else {
                                      console.log("Document created successfully");
                                      if (flag){
                                        $rootScope.privateFun.getAllDashboards();
                                      }
                                       if(typeof cb != "undefined"){
                                        cb();
                                      }
                                  }
                              });
                            console.log("not found error status is" + err.status);
                            //update the rootscope with the corrent document id of pouchdb
                            $rootScope.page_id = id;
                          }
                         }
                      else {
                              dashboardDoc = {
                                  dashboard : dashboard,
                                  _id : id,
                                  _rev : doc._rev
                              }
                              db.put(dashboardDoc, function(err, response) {
                                  if (err) {
                                    if (flag){
                                      $rootScope.privateFun.getAllDashboards();
                                    }
                                  return console.log(err);
                              } else {
                                    if (flag){
                                      $rootScope.privateFun.getAllDashboards();
                                    }
                                  console.log("Document updated successfully");
                                   if(typeof cb != "undefined"){
                                        cb();
                                      }
                              }
                          });
                      }
                  });

        }


        this.pageSync = function(dashboard,cb){
          
            if ( typeof($rootScope.page_id) != "undefined" || $rootScope.page_id != ""){
                  thisService.tempRootscopePageId = $rootScope.page_id;
            }

            dashboardJson = angular.fromJson(CircularJSON.stringify(dashboard));
            settoPouch(dashboardJson,false,cb);
        };

});