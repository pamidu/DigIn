routerApp.factory('DashboardService', function (ObjectStoreService, $rootScope, $mdDialog) {
    var dashboards = [];
    return {

        getDashboards: function (newDash) {
            var client = ObjectStoreService.initialize("duodigin_dashboard");

            if (typeof (newDash) === 'undefined') {
                ObjectStoreService.getAll(client, function (data) {
                    if (data) $rootScope.dashboardsObj = data;
                    else $rootScope.dashboardsObj = [];

                    var duoDashboards = $rootScope.dashboardsObj;

                    for (var i = 0; i < duoDashboards.length; i++) {
                        var obj1 = duoDashboards[i];

                        if (obj1.name.length > 20) {
                            obj1.splitName = obj1.name.substring(0, 21) + '...';
                        } else obj1.splitName = obj1.name;
                        dashboards.push(obj1);
                    }

                });
            } else {                
                if (newDash.name.length > 20) newDash.splitName = newDash.name.substring(0, 21) + '...';
                else newDash.splitName = newDash.name;
                dashboards = $rootScope.dashboardsObj;
            }

            return dashboards;
        }
    }

});
