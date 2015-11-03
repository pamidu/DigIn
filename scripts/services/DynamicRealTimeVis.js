routerApp.service('DynamicVisualization',['$objectstore', function($objectstore, $timeout){

    this.testRepeat = function(widget){
    	if(typeof widget != 'undefined'){
    		if(typeof widget.widData.sync != 'undefined') {
	    		console.log('test DynamicVisualization repeat');
		    	$timeout(this.testRepeat(widget), widget.widData.sync);
		    }
    	}    	
    	return 'test DynamicVisualization';
    };

}]);