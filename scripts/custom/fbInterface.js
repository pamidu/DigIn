var fbInterface = new function(){
	this.test = "facebook";

	this.state = "";

	this.getFbLoginState = function(scope, analysis){
        FB.getLoginStatus(function(response) {
            if(!analysis){
               fbInterface.setLoginButtonValue(response.status,scope);
               fbInterface.getUserPages(scope);
            }else{               
               fbInterface.setPageLoginButtonValue(response.status,scope);
               fbInterface.getUserPages(scope);
            }
            
        });
	};

	this.loginToFb =  function(scope, analysis, callback){
		FB.login(function(response) {
            fbInterface.setLoginButtonValue(response.status,scope);
            fbInterface.getUserPages(scope, function(){
               if(analysis) scope.lblPageLogin='Logout';
               localStorage.setItem('authResponse', JSON.stringify(response.authResponse));
               if(callback) callback(response);
            });            
        }, {
            scope: 'manage_pages,read_insights'
        });
	};

	this.logoutFromFb =  function(scope, analysis){
		FB.logout(function(response) {
            fbInterface.setLoginButtonValue(response.status,scope);
            scope.accounts = [];
            scope.userAccountName = '';
            scope.fbPages = [];
            if(analysis) scope.lblPageLogin='Login';
        });
	};

	this.authenticate = function(scope){
        if (this.state === 'connected') {
        	//alert('connected');
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
   
   this.setPageLoginButtonValue = function(state,scope){
      this.state = state;
      if(state!= 'connected') scope.lblPageLogin='Login';
      else scope.lblPageLogin='Logout';
   };

	this.getUserAccount = function(scope,callback){
		FB.api('/me', function(response) {
            console.log('Successful login for: ' + JSON.stringify(response));
            scope.accounts.push(response.name);
            scope.userAccountName = response.name;
            callback(response);
        });
	};

	this.getUserPages = function(scope, cb){
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
                       if(cb) cb();
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
   
   this.getSearchedPages = function(scope, analysis,query){
      if(this.state!= 'connected'){
         this.loginToFb(scope,analysis,function(res){
//            alert(JSON.stringify(res));
//            alert(res.access_token);
            fbInterface.searchFromFb(scope, 'page', res.authResponse.accessToken, query);
         });
      }
      else{
//         alert(JSON.stringify(scope.authResponse));
         var authObject = JSON.parse(localStorage.getItem('authResponse'));
         fbInterface.searchFromFb(scope, 'page', authObject.accessToken, query);        
      }
   };
   
   this.searchFromFb = function(scope, type, token, query){
      console.log('access token:'+token);     
      var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(e) {
        console.log(this);
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
               console.log('search results:'+xhr.response);
               console.log('fb Pages:'+JSON.stringify(scope.fbPages));
               var searchRes = JSON.parse(xhr.response).data;
               searchRes.forEach(function(entry){
                  scope.fbPages.push({
	                            id: entry.id,
	                            accessToken: token,
	                            name: entry.name,
	                            category: entry.category
	                        });
               });
               
            } else {
                console.error("XHR didn't work: ", xhr.status);
            }
        }
    }
    xhr.ontimeout = function() {
        console.error("request timedout: ", xhr);
    }
    xhr.open("get","https://graph.facebook.com/search?q="+query+"&type="+type+"&access_token="+token,true);
    xhr.send();    
      
   };


}