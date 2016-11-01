routerApp.service('saveDashboardService',function($rootScope,$http,Digin_Engine_API,Digin_Domain,ngToast,pouchDbServices,$state,DashboardService,$mdDialog) {

  this.saveDashboard = function(dashboardName,refreshInterval,type,scope) {
    var pagesArray = [];
    var dynamicPages = [];
    var pageObject;
    var retObj;
    var dashboardObject;
    var pages = $rootScope.dashboard.pages;
    for(var i = 0; i < pages.length; i++){
      var dynamicWidgets = [];
      //get widgets here
      var widgetsArray = [];
      var widgets = $rootScope.dashboard.pages[i].widgets;
      //create the widgets array of each page
      retObj = setWidgets(widgets,i);
      widgetsArray = retObj[0];
      dynamicWidgets = retObj[1];

      //if the page is a temporary / new page 
      if($rootScope.dashboard.pages[i].pageID.substr(0, 4) == "temp" && $rootScope.online ){
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
    if(typeof $rootScope.dashboard.deletions == "undefined") {
      $rootScope.dashboard.deletions = {
        "componentIDs":[],
        "pageIDs":[],
        "widgetIDs":[]
      }
    }
    if($rootScope.dashboard.compID == null){
      dashboardObject = {
        "pages" : pagesArray,
        "compClass": null,
        "compType": 'dashboard',
        "compCategory": null,
        "compID": null,
        "compName": dashboardName,
        "refreshInterval": refreshInterval,
        "deletions": $rootScope.dashboard.deletions
      }
    } else {
      dashboardObject = {
        "pages" : pagesArray,
        "compClass": $rootScope.dashboard.compClass,
        "compType": 'dashboard',
        "compCategory": $rootScope.dashboard.compCategory,
        "compID": $rootScope.dashboard.compID,
        "compName": dashboardName,
        "refreshInterval": refreshInterval,
        "deletions": $rootScope.dashboard.deletions
      }
    }
    var tempDashboardObj = angular.copy(dashboardObject);
    //map data to all charts
    for ( var i = 0; i < dynamicPages.length; i++){
      for ( var j = 0; j < dynamicPages[i].widgets.length; j++){
        if (dynamicPages[i].widgets[j].isChart){
          var chartType = $rootScope.dashboard.pages[i].widgets[j].widgetData.selectedChart.chartType;
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
      //assign the id name type refresh interval to dashboard
      var selectedPage = $rootScope.selectedPage;
      $rootScope.dashboard.compID = response.Result;
      dashboardObject.compID = response.Result;
      $rootScope.dashboard.compName = dashboardName;
      $rootScope.dashboard.compType = 'dashboard';
      $rootScope.dashboard.refreshInterval = refreshInterval;
      // Insert data into pouchDb
      pouchDbServices.insertPouchDB(null,response.Result,function(){
          if (type == 'dashboard'){
            setState(true,scope);
          }
      }); 
      ngToast.create({
        className: 'success',
        content: 'Dashboard Saved Successful',
        horizontalPosition: 'center',
        verticalPosition: 'top',
        dismissOnClick: true
      });
     
    })
    .error(function(error){
      // Insert data into pouchDb
      pouchDbServices.insertPouchDB(dashboardObject,null);
      ngToast.create({
        className: 'danger',
        content: 'Failed Saving Dashboard. Please Try Again!',
        horizontalPosition: 'center',
        verticalPosition: 'top',
        dismissOnClick: true
      });
      if (type == 'dashboard'){
        setState(false,scope);
      }
    });

  }

  var setWidgets = function(widgets,i) {
    var widgetObject;
    var returnArray = [];
    var dynamicWidgets = [];
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
            var decValue = widgets[j].widgetData.widData.decValue;
            var value = widgets[j].widgetData.widData.value;
            dataArray.push(decValue,value);
            widgets[j].widgetData.widData.decValue = "";
            widgets[j].widgetData.widData.value = "";
            break;
          case 'highCharts':
            var series = widgets[j].widgetData.highchartsNG.series.data;
            dataArray.push(series);
            widgets[j].widgetData.highchartsNG.series.data = [];
            break;
        }
      }
      //if the widget is a temporary / new widget 
      if($rootScope.dashboard.pages[i].widgets[j].widgetID.substr(0, 4) == "temp" && $rootScope.online){
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
        $rootScope.dashboard.pages[i].widgets[j].widgetData.highchartsNG.series[0].data = data[0];
        $rootScope.dashboard.pages[i].widgets[j].widgetData.highchartsNG.series[1].data = data[1];
        $rootScope.dashboard.pages[i].widgets[j].widgetData.highchartsNG.xAxis.categories = data[2];
        break;
      case 'pivotSummary':
        $rootScope.dashboard.pages[i].widgets[j].widgetData.widData.summary = data[0];
        break;
      case 'histogram':
        $rootScope.dashboard.pages[i].widgets[j].widgetData.highchartsNG.series[0].data = data[0];
        $rootScope.dashboard.pages[i].widgets[j].widgetData.highchartsNG.xAxis.categories = data[1];
        break;
      case 'bubble':
        $rootScope.dashboard.pages[i].widgets[j].widgetData.highchartsNG.series = data[0];
        break;
      case 'forecast':
        $rootScope.dashboard.pages[i].widgets[j].widgetData.highchartsNG.series = data[0];
        break;
      case 'sunburst':
        break;
      case 'hierarchy':
        break;
      case 'highCharts':
        $rootScope.dashboard.pages[i].widgets[j].widgetData.highchartsNG.series.data = data[0];
        break;
      case 'metric':
        $rootScope.dashboard.pages[i].widgets[j].widgetData.widData.decValue = data[0];
        $rootScope.dashboard.pages[i].widgets[j].widgetData.widData.value = data[1];
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
          if($rootScope.dashboard.compID == null){
            noDuplicate = false;
          }
          else{
            DashboardService.dashboards.forEach(function(key){
            if(key.dashboardName.toUpperCase() == name.toUpperCase() ){
              if(key.dashboardID != $rootScope.dashboard.compID)
                noDuplicate = false;
              }
            });
          }
        }
      });
    }
    return noDuplicate;
  }

});
