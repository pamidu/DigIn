var fbInterface = new function(){
	this.test = "facebook";

	this.state = "";

	this.getFbLoginState = function(scope){
		//alert(scope);
		//setLoginButtonValue("response.status");
		//scope.actIndicator = "false";
        FB.getLoginStatus(function(response) {
            fbInterface.setLoginButtonValue(response.status,scope);
            fbInterface.getUserPages(scope);
        });
	};

	this.loginToFb =  function(scope){
		FB.login(function(response) {
            fbInterface.setLoginButtonValue(response.status,scope);
            fbInterface.getUserPages(scope);
        }, {
            scope: 'manage_pages,read_insights'
        });
	};

	this.logoutFromFb =  function(scope){
		FB.logout(function(response) {
            fbInterface.setLoginButtonValue(response.status,scope);
            scope.accounts = [];
            scope.userAccountName = '';
        });
	};

	this.authenticate = function(scope){
        if (this.state === 'connected') {
        	alert('connected');
        	scope.connectBtnLabel = 'Remove Account';
        } else if (this.state === 'not_authorized') {
            //todo...
        } else {
            //todo...
            scope.connectBtnLabel = 'Add Account';
        }
	};

	this.setLoginButtonValue = function(state,scope){
		this.state = state;
		if(state!= 'connected') scope.connectBtnLabel='Add Account';
        else scope.connectBtnLabel='Remove Account';
	};

	this.getUserAccount = function(scope,callback){
		FB.api('/me', function(response) {
            console.log('Successful login for: ' + JSON.stringify(response));
            scope.accounts.push(response.name);
            scope.userAccountName = response.name;
            callback(response);
        });
	};

	this.getUserPages = function(scope){
		fbInterface.getUserAccount(scope,function(data){
	        FB.api(
	            "/" + data.id + "/accounts",
	            function(response) {
	            	$('#actIndicator').remove();
	                scope.fbPages = [];
	                console.log('page response:' + JSON.stringify(response));
	                if (response && !response.error) {
	                    for (i = 0; i < response.data.length; i++) {
	                        var tempFbPg = {
	                            id: '',
	                            accessToken: '',
	                            name: '',
	                            category: ''
	                        };
	                        tempFbPg.id = response.data[i].id;
	                        tempFbPg.accessToken = response.data[i].access_token;
	                        tempFbPg.name = response.data[i].name;
	                        tempFbPg.category = response.data[i].category;
	                        scope.fbPages.push(tempFbPg);
	                    }
	                    console.log('fbPages array:' + JSON.stringify(scope.fbPages));
	                }
	            }
	        );
		});

	};

	this.getPageData = function(scope, callback){
	    FB.api(
            "/"+scope.fbPageModel,
            function (response) {
              if (response && !response.error) {
                console.log(response.likes);                
                callback(response);
              }
            }
        );
	};

	/*
		dateObj={
			until: new Date(),
			range: 7
		}
	*/

	this.getPageViewsInsight = function(pageId, dateObj, callback){
		var boundaryStamp = getBoundaryTimestamps(dateObj.range,dateObj.until);
		var tes = "/"+pageId+"/insights/page_views_unique?debug=all&method=get&pretty=0&suppress_http_code=1&since="+boundaryStamp.sinceStamp+"&until="+boundaryStamp.untilStamp+"&limit=10";
      	console.log(tes);
	    FB.api(
            "/"+pageId+"/insights/page_views_unique?debug=all&method=get&pretty=0&suppress_http_code=1&since="+boundaryStamp.sinceStamp+"&until="+boundaryStamp.untilStamp+"&limit=10",
            function (response) {
              if (response && !response.error) {                         
                callback(response);
              }
            }
        );
	};
	
	this.getPageLikesInsight = function(pageId, dateObj, callback){
		var boundaryStamp = getBoundaryTimestamps(dateObj.range,dateObj.until);
		var tes = "/"+pageId+"/insights/page_fan_adds?debug=all&method=get&pretty=0&suppress_http_code=1&since="+boundaryStamp.sinceStamp+"&until="+boundaryStamp.untilStamp+"&limit=10";
      	console.log(tes);
	    FB.api(
            "/"+pageId+"/insights/page_fan_adds?debug=all&method=get&pretty=0&suppress_http_code=1&since="+boundaryStamp.sinceStamp+"&until="+boundaryStamp.untilStamp+"&limit=10",
            function (response) {
              if (response && !response.error) {                         
                callback(response);
              }
            }
        );
	};

	this.getPageLikesObj = function(data){
		var likeCountArray = [];
		var startingDayStr;
		var res = data.data[0].values;
            var i = 0;
            res.forEach(function(item){
                if(i==0) startingDayStr =res[i].end_time;
                    likeCountArray.push(res[i].value);
                i++;
            });
        var startingDay = new Date(startingDayStr);
        var day =  1000 * 60 * 60 * 24;
        return {
        	likeArr : likeCountArray,
        	start : startingDay,
        	interval : day
        };

	};


}