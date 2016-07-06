app.directive('diginDashboard', function(DashboardModel) {
	
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: 'views/dashboardView.html',
      link: function (scope, element) {
        DashboardModel.getDashboards('Dashboard',function(dash){
    		console.log(JSON.stringify(dash));
        for(i=0;i<dash.data.length;i++){
          dash.data[i]['fullscreenState'] = false;
        }
        scope.dashboard = {};
        scope.dashboard.widgets = dash.data;
    		var test = dash.culture;
    		scope.name = test;
    	});
      
    }
      
    };
 });


var cardTemplate = '<md-card ng-repeat="widget in dashboard.widgets" ng-style="{\'height\':widget.height,\'width\':widget.width,\'min-height\':h,\'min-width\':w,\'left\':widget.left, \'top\':widget.top}">'+
    '<md-content class=\'md-padding\' ng-style="{\'height\':widget.mheight}" style="overflow:auto;" layout="row" flex>'+
        '<div style="height:100%;width:100%">'+
          '{{widget.directiveView}}'+
        '</div>'+
    '</md-content>'+
    '<md-toolbar class="digin-widget-toolbar">'+
       '<div class="md-toolbar-tools">'+
          '<h2>'+
            '<span>{{widget.uniqueType}}</span>'+
          '</h2>'+
          '<span flex></span>'+
      '</div>'+
    '</md-toolbar>'+
'</md-card>';
