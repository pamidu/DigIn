function main(){
	scope.getDataFromWF = function(){
		Inarguments = {"InSessionID":scope.SessionID}
		$processManager.getClient().invoke("ACTUAL","appcode", Inarguments).onComplete(function(response){
			scope.wfdata = response
			console.log(response)         
		}).onError(function(){});      

	}        

	scope.getPESessionDetails = function(){
		console.log("retieving more details");            
		$http({                
			method: 'GET',                
			url: 'http://duoworld.duoweb.info:8093/processengine/GetSessionDetails/'+scope.SessionID+'/PE'
		}).success(function (data, status) {
			scope.moreDetails = data.SessionDetails;
			scope.sessionmessage = data.Message;
			console.log(data);
		}).error(function (data, status) {                
			console.log(data);            
		});    
	}        

	scope.getWFSessionDetails = function(){    
		console.log("retieving more details");            
		$http({                
			method: 'GET',                
			url: 'http://duoworld.duoweb.info:8093/processengine/GetSessionDetails/'+scope.SessionID+'/WF'            
		}).success(function (data, status) {
			scope.WFDetails = data.SessionDetails;                
			scope.WFMessage = data.Message;                
			console.log(data);            
		}).error(function (data, status) {                
			console.log(data);            
		});    
	}}