routerApp.service('DashboardService',function()
{
	return { 
		dashboard : {
    '1': {
       widgets: [

      ]
    }

	},
	 update: function(dashboards1) {      
       
      this.dashboard = dashboards1;
    }
   };
});

 