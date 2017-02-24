DiginApp.service('saveDashboardService' , ['$rootScope','$http','Digin_Engine_API','notifications','pouchDbServices','$state','DashboardService','$mdDialog','$interval', function($rootScope,$http,Digin_Engine_API,notifications,pouchDbServices,$state,DashboardService,$mdDialog,$interval) {

this.IsSavingINprogress = false;
var localThis = this;

  this.saveDashboard = function(dashboardName,refreshInterval,type,scope) {
    var metricArray = [];
    //save metric chart for notifications
    //create metric widget array
    angular.forEach($rootScope.currentDashboard.pages, function(page){
      angular.forEach(page.widgets,function(widget){
        var notification_id = "";
        if (typeof(widget.widgetData.commonSrc) != "undefined") {
          if (widget.widgetData.selectedChart.chartType == "metric") {
            metricObj = {};
            metricObj = {
              notification_id: null,
              actual_value: widget.widgetData.commonSrc.query,
              target_value: widget.widgetData.selectedChart.initObj.notificationValue,
              trigger_type: widget.widgetData.selectedChart.initObj.targetRange,
              is_tv_constant: widget.widgetData.selectedChart.initObj.notificationConstant,
              dashboard_name: dashboardName,
              widget_name: widget.widgetName,
              dbname:widget.widgetData.commonSrc.src.src,
              datasource_id:widget.widgetData.commonSrc.src.id,
              widget_id:widget.widgetID,
              prefix: widget.widgetData.widData.scale,
              prefix_position: widget.widgetData.widData.scalePosition,
              page_id:page.pageID
            }
            if (widget.widgetData.notification_id === undefined) {
              notification_id = null
            } else {
              notification_id = widget.widgetData.notification_id
            }
            metricObj["notification_id"] = notification_id;
            metricArray.push(metricObj);
          }
        }
      });
    });
    // metric chart notification settings
    if (metricArray.length > 0) {
      var userInfo= JSON.parse(decodeURIComponent(getCookie('authData')));
      $http({
        method: 'POST',                  
        url: Digin_Engine_API + 'process_notifications',
        data: angular.fromJson(CircularJSON.stringify(metricArray)),
        headers: {  
          'Content-Type': 'application/json',
          'SecurityToken':userInfo.SecurityToken
        }
      }).success(function(response){
        if(response.Is_Success){
          angular.forEach($rootScope.currentDashboard.pages, function(page){
            angular.forEach(page.widgets,function(widget){
              angular.forEach(response.Result,function(row){
                if(row.widget_id == widget.widgetID && row.page_id == page.pageID){
                  widget.widgetData.notification_id = row.notification_id;
                }
              });
            });
          });

		  notifications.startLoading(1,"Dashboard Saved Successfully");
          saveDashboardFun(dashboardName,refreshInterval,type,scope);
        } else {
		  notifications.startLoading(0,"Error in saving metric KPI notifications.");
          saveDashboardFun(dashboardName,refreshInterval,type,scope);
        }
      })
      .error(function(error){
		notifications.startLoading(0,"Error in saving metric KPI notifications.");
        saveDashboardFun(dashboardName,refreshInterval,type,scope);
      })
    } else {
      saveDashboardFun(dashboardName,refreshInterval,type,scope);
    }

  }
  this.createuuid = function () {
              return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
  }
  var saveDashboardFun = function(dashboardName,refreshInterval,type,scope) {
    localThis.IsSavingINprogress =true;
    var pagesArray = [];
    var dynamicPages = [];
    var pageObject;
    var retObj;
    var dashboardObject;
    var pages = $rootScope.currentDashboard.pages;
    for(var i = 0; i < pages.length; i++){
      var dynamicWidgets = [];
      //get widgets here
      var widgetsArray = [];
      var widgets = $rootScope.currentDashboard.pages[i].widgets;
      //create the widgets array of each page
      retObj = setWidgets(widgets,i);
      widgetsArray = retObj[0];
      dynamicWidgets = retObj[1];

      //if the widget is a forecast remove filters from the widget
      for(var w=0; w< $rootScope.currentDashboard.pages[i].widgets.length ;w++)
      {
        if($rootScope.currentDashboard.pages[i].widgets[w].widgetName == "forecast")
          $rootScope.currentDashboard.pages[i].widgets[w].widgetData.filterStr = "";
      }

      //if the page is a temporary / new page 
      if($rootScope.currentDashboard.pages[i].pageID.toString().substr(0, 4) == "temp" && $rootScope.online ){
        pageObject = {
          "widgets": widgetsArray,
          "pageID": null,
          "pageName": pages[i].pageName,
          "pageData": null
        }
      } else {
        pageObject = {
          "widgets": widgetsArray,
          "pageID": pages[i].pageID,
          "pageName": pages[i].pageName,
          "pageData": pages[i].pageData 
        }
      }
      pagesArray.push(pageObject);
      dynamicPages.push({
        widgets : dynamicWidgets
      });
    }
    if(typeof $rootScope.currentDashboard.deletions == "undefined") {
      $rootScope.currentDashboard.deletions = {
        "componentIDs":[],
        "pageIDs":[],
        "widgetIDs":[]
      }
    }
    if($rootScope.currentDashboard.compID == null){
      dashboardObject = {
        "pages" : pagesArray,
        "compClass": null,
        "compType": 'dashboard',
        "compCategory": null,
        "compID": null,
        "compName": dashboardName,
        "refreshInterval": refreshInterval,
        "deletions": $rootScope.currentDashboard.deletions
      }
    } else {
      dashboardObject = {
        "pages" : pagesArray,
        "compClass": $rootScope.currentDashboard.compClass,
        "compType": 'dashboard',
        "compCategory": $rootScope.currentDashboard.compCategory,
        "compID": $rootScope.currentDashboard.compID,
        "compName": dashboardName,
        "refreshInterval": refreshInterval,
        "deletions": $rootScope.currentDashboard.deletions
      }
    }
    var tempDashboardObj = angular.copy(dashboardObject);
    //map data to all charts
    for ( var i = 0; i < dynamicPages.length; i++){
      for ( var j = 0; j < dynamicPages[i].widgets.length; j++){
        if (dynamicPages[i].widgets[j].isChart){
          var chartType = $rootScope.currentDashboard.pages[i].widgets[j].widgetData.selectedChart.chartType;
          mapChartData(chartType,i,j,dynamicPages[i].widgets[j].data);
        }
      }
    }
    var userInfo= JSON.parse(decodeURIComponent(getCookie('authData')));
    $http({
      method: 'POST',                  
      url: Digin_Engine_API+'store_component',
      data: angular.fromJson(CircularJSON.stringify(tempDashboardObj)),
      headers: {  
        'Content-Type': 'application/json',
        'SecurityToken':userInfo.SecurityToken
      }
    })
    .success(function(response){
      if (response.Is_Success) {
        //assign the id name type refresh interval to dashboard
        var selectedPage = $rootScope.selectedPage;
        $rootScope.currentDashboard.compID = response.Result;
        dashboardObject.compID = response.Result;
        $rootScope.currentDashboard.compName = dashboardName;
        $rootScope.currentDashboard.compType = 'dashboard';
        $rootScope.currentDashboard.refreshInterval = refreshInterval;
        $rootScope.refreshInterval = $rootScope.currentDashboard.refreshInterval;
        // Insert data into pouchDb
        if ($rootScope.currentDashboard.refreshInterval == '0'){
          $interval.cancel($rootScope.interval);
          $rootScope.interval = undefined;
          $rootScope.refreshInterval == undefined;
        } else {
          $interval.cancel($rootScope.interval);
          $rootScope.interval = undefined;
          $rootScope.refreshInterval = $rootScope.currentDashboard.refreshInterval * 1000;
          $rootScope.refreshDashboard();
        }

         var db = $rootScope.db;
          db.get($rootScope.page_id, function (err, doc) {
              if (err) {
              }
              else {
                  db.remove(doc)
                  .catch(function (err) {
                      //fail silently
                  });                            
              }
          });
          $rootScope.privateFun.getAllDashboards();
          $rootScope.page_id = "";
         
          $rootScope.currentDashboard = [];
          $rootScope.page_id = "";
          $rootScope.currentDashboard = {

              "pages": null,
              "compClass": null,
              "compType": null,
              "compCategory": null,
              "compID": null,
              "compName": null,
              "refreshInterval": null,
          }

          $rootScope.currentDashboard.pages = [];
          var page = {
              "widgets": [],
              "pageID": "temp" + localThis.createuuid(),
              "pageName": "DEFAULT",
              "pageData": null
          }
          $rootScope.currentDashboard.pages.push(page); 
          $rootScope.currentView = "Home";
          $state.go('home.welcomeSearch');
          localThis.IsSavingINprogress = false;

        if (type == 'dashboard'){
             setState(true,scope);
        }
		
		notifications.startLoading(1,"Dashboard Saved Successfully");
      } else {
		notifications.startLoading(0,"Failed Saving Dashboard. Please Try Again!");
      }
     
    })
    .error(function(error){
      // Insert data into pouchDb
      pouchDbServices.insertPouchDB(dashboardObject,null,undefined);
	  notifications.startLoading(0,"Failed Saving Dashboard. Please Try Again!");
      if (type == 'dashboard'){
        setState(false,scope);
      }
    });
  }

  var setWidgets = function(widgets,i) {
    var widgetObject;
    var returnArray = [];
    var dynamicWidgets = [];
    var metricObj = {};
    //get widgets here
    var widgetsArray = [];
    for (var j = 0; j < widgets.length; ++j) {
      var chart = "";
      var flag = false;
      // Remove data from the charts when it is being saved
      if (typeof(widgets[j].widgetData.selectedChart) != "undefined"){
        var flag = true;
        console.log(widgets[j].widgetData.selectedChart.chartType);
        var dataArray = [];
        chart = widgets[j].widgetData.selectedChart.chartType;
        switch (widgets[j].widgetData.selectedChart.chartType) {
          case 'boxplot':
            var seriesPlotData = widgets[j].widgetData.highchartsNG.series[0].data;
            var seriesOutData = widgets[j].widgetData.highchartsNG.series[1].data;
            var category = widgets[j].widgetData.highchartsNG.xAxis.categories;
            widgets[j].widgetData.highchartsNG.series[0].data = [];
            widgets[j].widgetData.highchartsNG.series[1].data = [];
            widgets[j].widgetData.highchartsNG.xAxis.categories = [];
            dataArray.push(seriesPlotData,seriesOutData,category);
            break;
          case 'pivotSummary':
            var summary = widgets[j].widgetData.widData.summary;
            dataArray.push(summary);
            widgets[j].widgetData.widData.summary = [];
            break;
          case 'histogram':
            var data = widgets[j].widgetData.highchartsNG.series[0].data;
            var category = widgets[j].widgetData.highchartsNG.xAxis.categories;
            dataArray.push(data,category);                                        
            widgets[j].widgetData.highchartsNG.series[0].data = [];
            widgets[j].widgetData.highchartsNG.xAxis.categories = [];
            break;
          case 'bubble':
            var bubble = widgets[j].widgetData.highchartsNG.series;
            dataArray.push(bubble);
            widgets[j].widgetData.highchartsNG.series = [];
            break;
          case 'forecast':
            var series = widgets[j].widgetData.highchartsNG.series;
            dataArray.push(series);
            widgets[j].widgetData.highchartsNG.series = [];
            break;
          case 'd3sunburst':
            var flag = false;
            break;
          case 'd3hierarchy':
            var flag = false;
            console.log("d3hierarchy");
            break;
          case 'metric':
            // var series = widgets[j].widgetData.selectedChart.initObj.trendChart.series;
            // var decValue = widgets[j].widgetData.widData.decValue;
            // var value = widgets[j].widgetData.widData.value;
            // dataArray.push(decValue,value,series);
            // widgets[j].widgetData.widData.decValue = "";
            // widgets[j].widgetData.widData.value = "";
            // widgets[j].widgetData.selectedChart.initObj.trendChart.series = [];
            break;
          case 'highCharts':
            var series = widgets[j].widgetData.highchartsNG.series[0].data;
            dataArray.push(series);
            widgets[j].widgetData.highchartsNG.series[0].data = [];
            break;
          case 'Tabular':
            var series = widgets[j].widgetData.widData.userList;
            dataArray.push(series);
            widgets[j].widgetData.widData.userList = [];
            break;
        }
      }
      //if the widget is a temporary / new widget 
      if($rootScope.currentDashboard.pages[i].widgets[j].widgetID.toString().substr(0, 4) == "temp" && $rootScope.online){
        widgetObject = {
          "widgetID": null,
          "widgetName": widgets[j].widgetName,
          "widgetData": widgets[j].widgetData,
          sizeX: widgets[j].sizeX,
          sizeY: widgets[j].sizeY,
          row: widgets[j].row,
          col: widgets[j].col
        }
      }
      else{
        widgetObject = {   
          "widgetID": widgets[j].widgetID,
          "widgetName": widgets[j].widgetName,
          "widgetData": widgets[j].widgetData,
          sizeX: widgets[j].sizeX,
          sizeY: widgets[j].sizeY,
          row: widgets[j].row,
          col: widgets[j].col
        }
      }
      widgetsArray.push(widgetObject);
      dynamicWidgets.push({
        data: dataArray,
        isChart: flag,
        chart: chart
        });
    }
    returnArray[0] = widgetsArray;
    returnArray[1] = dynamicWidgets;
    return(returnArray);
  }

  var mapChartData = function(chartType,i,j,data) {
    switch (chartType) {
      case 'boxplot':
        $rootScope.currentDashboard.pages[i].widgets[j].widgetData.highchartsNG.series[0].data = data[0];
        $rootScope.currentDashboard.pages[i].widgets[j].widgetData.highchartsNG.series[1].data = data[1];
        $rootScope.currentDashboard.pages[i].widgets[j].widgetData.highchartsNG.xAxis.categories = data[2];
        break;
      case 'pivotSummary':
        $rootScope.currentDashboard.pages[i].widgets[j].widgetData.widData.summary = data[0];
        break;
      case 'histogram':
        $rootScope.currentDashboard.pages[i].widgets[j].widgetData.highchartsNG.series[0].data = data[0];
        $rootScope.currentDashboard.pages[i].widgets[j].widgetData.highchartsNG.xAxis.categories = data[1];
        break;
      case 'bubble':
        $rootScope.currentDashboard.pages[i].widgets[j].widgetData.highchartsNG.series = data[0];
        break;
      case 'forecast':
        $rootScope.currentDashboard.pages[i].widgets[j].widgetData.highchartsNG.series = data[0];
        break;
      case 'sunburst':
        break;
      case 'hierarchy':
        break;
      case 'highCharts':
         $rootScope.currentDashboard.pages[i].widgets[j].widgetData.highchartsNG.series[0].data = data[0];
        break;
      case 'metric':
        // $rootScope.currentDashboard.pages[i].widgets[j].widgetData.widData.decValue = data[0];
        // $rootScope.currentDashboard.pages[i].widgets[j].widgetData.widData.value = data[1];
        // $rootScope.currentDashboard.pages[i].widgets[j].widgetData.selectedChart.initObj.trendChart.series = data[2];
        break;
      case 'Tabular':
        $rootScope.currentDashboard.pages[i].widgets[j].widgetData.widData.userList= data[0];
        break;
    }
  }

  var setState = function(status,scope) {
    if (status) {
      scope.isLoadingDashBoardSave = false;
      scope.isButtonDashBoardSave=true;
      //$state.go('home.welcomeSearch'); 
       $mdDialog.hide();
    } else {
      scope.isLoadingDashBoardSave = false;
      scope.isButtonDashBoardSave=true;
       $mdDialog.hide();
    }
  }

  this.checkDashboardName = function(name) {
    var noDuplicate = true;
    if(typeof DashboardService.dashboards != "undefined" ){
      DashboardService.dashboards.forEach(function(key){
        if(key.dashboardName.toUpperCase() == name.toUpperCase()){
          if($rootScope.currentDashboard.compID == null){
            noDuplicate = false;
          }
          else{
            DashboardService.dashboards.forEach(function(key){
            if(key.dashboardName.toUpperCase() == name.toUpperCase() ){
              if(key.dashboardID != $rootScope.currentDashboard.compID)
                noDuplicate = false;
              }
            });
          }
        }
      });
    }
    return noDuplicate;
  }

}]);
