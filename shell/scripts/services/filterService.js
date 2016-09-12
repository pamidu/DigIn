// Service for filter functionality

routerApp.service('filterService',function(){

	this.filterAggData = function(res,filterFields) {
		// filter only the selected fields from the result returned by the service
        if (filterFields.length > 0){
            for (c in res[0]) {
                 if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                    if (typeof res[0][c] == "string"){
                        cat = c;
                    }
                }
            }
            if (cat !== undefined){
                angular.forEach(filterFields,function(field){
                    if(field.name == cat){
                        for (var i=0;i<field.valueArray.length;i++){
                            angular.forEach(res,function(key){
                                for(var k in key){
                                    if (Object.prototype.hasOwnProperty.call(key,k)){
                                        if(typeof key[k] == "string") {
                                            if(field.valueArray[i].value == key[k]){
                                                if(!field.valueArray[i].status){
                                                    res.splice(res.indexOf(key),1);
                                                    break;
                                                }
                                            }                    
                                        }
                                    }
                                }
                            })
                        }
                    }
                });
            }
        }
	};
});
