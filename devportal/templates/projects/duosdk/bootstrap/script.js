function main(){
	scope.customer = {};

	scope.submit = function(){
		var client = $objectstore.getClient("com.duosoftware.test","customer");


		client.onComplete(function(data){ 
			alert ("Successfully Saved!!!");
		});

		client.onError(function(data){
			alert ("Error occured!!");
		});

		client.insert([scope.customer], {KeyProperty:"id"});
	};

	scope.load = function(){
		var client = $objectstore.getClient("com.duosoftware.test","customer");


		client.onGetMany(function(data){
			if (data)
				if(data.length >0)
				scope.customer = data[0];
		});	

		client.getByFiltering("id:" + scope.customer.id);
	};

	scope.clear = function(){
		scope.customer = {};
	}


}