var linkedinInterface = new function(){

	this.state = "";
    this.data ={};

	this.getLinkedinState = function(scope){
		var linkedin = IN.User.isAuthorized();
        console.log('linkedin login status:'+scope.linkedInState);
        linkedinInterface.setLoginButtonValue(linkedin,scope);
        linkedinInterface.getUserOverview(scope);
	};

	this.loginToLinkedin = function(scope){
		IN.User.authorize(function(){
	        console.log('logged into linkedIn');
	        linkedinInterface.setLoginButtonValue(true,scope);
        	linkedinInterface.getUserOverview(scope);
	    });
	};

	this.logoutFromLinkedin = function(scope){
		IN.User.logout(function(){                    
            scope.accounts = [];
            scope.userAccountName = '';
            linkedinInterface.setLoginButtonValue(false,scope);
            console.log('logged out from linkedIn');
        });
	};

	this.getUserOverview = function(scope){
		var url = '/people/~:(id,first-name,last-name,num-connections,picture-url,headline,current-share,email-address,public-profile-url)?format=json';
        IN.API.Raw().url(url).method('GET').body().result(function(res){
            console.log(JSON.stringify(res));
            var username = res.firstName + ' ' + res.lastName;
            scope.accounts.push(username);
            scope.userAccountName = username;
            scope.result = res;
        });
	};

    this.getUserAccountOverview = function(scope,callback){
        var url = '/people/~:(id,first-name,last-name,num-connections,picture-url,headline,current-share,num-connections-capped,email-address,positions)?format=json';
        IN.API.Raw().url(url).method('GET').body().result(function(res){
            callback(res);
        });
    };

	this.setLoginButtonValue = function(state,scope){
		this.state = state;
		if(!state) scope.connectBtnLabel='Add Account';
        else scope.connectBtnLabel='Remove Account';
	};

}