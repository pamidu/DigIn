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
            angular.forEach(filterFields,function(field){
                if(field.name == cat){
                    for (var j=0; j<res.length;j++){
                  	    // angular.forEach(res,function(key){
                        console.log(res[j]);
                        for (var k in res[j]){
                            if (Object.prototype.hasOwnProperty.call(res[j], k)) {
                                if (typeof res[j][k] == "string") {
                                    for (var i =0; i<field.valueArray.length;i++){
                                        if(field.valueArray[i].value == res[j][k]){
                                            if(!field.valueArray[i].status){
                                                res.splice(j,1);
                                                break;
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
      	        }
            });
        }
	}

});
