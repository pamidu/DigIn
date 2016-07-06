/* 
----------------------Summary-------------------------------
| all the object store related functions goes here         |
------------------------------------------------------------
|      # object constructor: initialize                    |
|      # get all from an index: getAll                     | 
|      # saving an object :  saveObject                    |
------------------------------------------------------------
 */


routerApp.service('ObjectStoreService',['$objectstore', function($objectstore){

    /*Summary 
    parameters {ind : index to create the client object}
    returns {client object}*/
    this.initialize = function(ind){
    	return $objectstore.getClient("com.duosoftware.com", ind);
    };

    /*Summary 
    parameters {client : client object requesting data
                callback : function which request data}
    returns {}*/
    this.getAll = function(client,callback) {
        client.getByFiltering("*");
    	client.onGetMany(function(data){
    		callback(data);
    	});
    	
    };

    this.getSingle = function(client,key,callback){
        client.onGetOne(function(data){
            callback(data);
        });
        client.getByKey(key);        
    };

    /*Summary 
    parameters {client : client object requesting data
                obj : object we are sending to the object store
                prop : keyproperty of the object
                callback : function which request data}
    returns {}*/
    this.saveObject = function(client,obj,prop,callback) {
        //console.log(JSON.stringify(obj));
    	client.insert([obj], {KeyProperty:prop});

    	client.onComplete(function(data){
    	callback({state: 'success',
    				d: data });
    	});
    	client.onError(function(data){
    	callback({state: 'error',
    				d: data });
    	});
    };          
}]);