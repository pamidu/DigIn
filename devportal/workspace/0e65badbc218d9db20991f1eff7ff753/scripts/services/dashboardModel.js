app.factory('DashboardModel', function($objectstore){
  var dashboards = [];
  return {
  
  getDashboards: function(key,callback) {
    var client = $objectstore.getClient("adminduowebinfo.space.duoworld.duoweb.info", "duodigin_dashboard",true)
    client.getByKey(key);
      client.onGetOne(function(data){
        callback(data);
      });        
    }
  }    
  
});