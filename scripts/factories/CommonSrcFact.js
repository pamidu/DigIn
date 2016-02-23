routerApp.factory('$csContainer', function () {
    var srcObj = {};
    return {
        fillCSContainer: function(obj) {
            srcObj = obj;
        },
        fetchSrcObj: function(){
            return srcObj;
        }
    };
});