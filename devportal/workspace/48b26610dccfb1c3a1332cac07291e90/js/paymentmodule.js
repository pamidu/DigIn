(function(ps){
	var $h;
	function gh(){
	    var h = window.location.hostname;
	    if (h.indexOf("localhost") !=-1 || h.indexOf("127.0.0.1") !=-1)
	    	h="paydemo.epayments.lk";
	    return h + "/payapi";
	}
	function BP(){
		var sfn,ffn, u, b;
		function call(){
			if (sfn && ffn){
			var reqObj = {method: b ? "POST" : "GET" ,url: "http://" + gh() + u, headers: {'Content-Type': 'application/json'}};
			if (b) reqObj.data = b;
			$h(reqObj).
			  success(function(data, status, headers, config) {
				if (status == 200) sfn(data);			  
				else ffn(data);
			  }).
			  error(function(data, status, headers, config) {
		  		ffn(data);
			  });

			}
		}
		return {
			success: function(f){sfn=f;call();return this;},
			error: function(f){ffn=f;call();return this;},
			p: function(ur){u=ur;return this;},
			b: function(j){b =j;return this;}
		}
	}

	ps.factory('$pay', function($http){
		$h = $http;
		return {
			bank: function(){ return new BankProxy();},
			account: function(){ return new AccountProxy();},
			document:function(){ return new DocProxy();},
			transaction:function(){ return new TransactionProxy();},
			registration:function(){ return new RegistrationProxy();},
			institute:function(){ return new InstituteProxy();},
			profile:function(){ return new ProfileProxy();},
			company:function(){ return new CompanyProxy();},
		}	
	});


	function AccountProxy(){
		var p = BP();
		p.getUserAccounts = function(s,t){p.p("/account/?skip=" + s + "&take=" + t); return p;}
		p.all = function(s,t){p.p("/account/?skip=" + s + "&take=" + t); return p;}
		p.search = function(q,s,t){p.p("/account/search/?skip=" + s + "&take=" + t + "&q=" + q); return p;}
		p.add = function(a){p.p("/account/").b(a); return p;}
		p.info = function(i){p.p("/account/" + i); return p;}
		p.status = function(i){p.p("/account/status/" + i); return p;}
		p.getVerificationCode = function(i){p.p("/account/vcode/" + i); return p;}
		//p.statusUpdate = function(i){p.p("/account/status/" + i).body(i); return p;}
		return p;
	}

	function BankProxy(){
		var p = BP();
		p.all = function(s,t){p.p("/bank/"); return p;}
		p.get = function(i){p.p("/bank/" + i); return p;}
		p.confirmAccount = function(i,v){p.p("/bank/confirmaccount/" + i + "/" + v); return p;}
		p.rejectAccount = function(i,v){p.p("/bank/rejectaccount/" + i + "/" + v); return p;}
		p.pendingAccount = function(i,v){p.p("/bank/pendingaccount/" + i + "/" + v); return p;}
		
		p.accountHolders = function(ty,s,t){p.p("/bank/accountholders/?type=" + ty + "&skip="+ s + "&take=" + t); return p;}
		//+ "&skip="+ s + "&take=" + t + "&keyword=" + str
		p.searchAccountHolders = function(ty,str,s,t){p.p("/bank/accountholders/search?type=" + ty); return p;}
		return p;
	}

	function CompanyProxy(){
		var p = BP();
		p.all = function(s,t){p.p("/company/"); return p;}
		p.get = function(i){p.p("/company/" + i); return p;}
		p.getFields = function(i){p.p("/company/fields/" + i); return p;}
		p.saveFields = function(i){p.p("/company/fields").b(i); return p;}
		return p;
	}


	function DocProxy(){
		var p = BP();
		p.accountConfirm = function(i){p.p("/documents/confirmacc/" + i); return p;}
		p.transactionReciept = function(i){p.p("/documents/tranreciept/" + i); return p;}
		return p;
	}
	
	function ProfileProxy(){
		var p = BP();
		p.details = function(i){p.p("/profile/" + i); return p;}
		return p;
	}
	function InstituteProxy(){
		var p = BP();
		p.all = function(s,t){p.p("/institute/?skip=" + s + "&take=" + t); return p;}
		p.search = function(q,s,t){p.p("/institute/search/?skip=" + s + "&take=" + t + "&q=" + q); return p;}
		return p;
	}

	function TransactionProxy(){
		var p = BP();
		p.newId = function(){p.p("/transaction/newid"); return p;}
		p.all = function(){p.p("/transaction"); return p;}
		p.get = function(i){p.p("/transaction/" + i); return p;}
		p.pay = function(i){p.p("/transaction/pay").b(i); return p;}
		p.status = function(i){p.p("/transaction/status/" + i); return p;}
		p.accept = function(i,s){p.p("/transaction/accept/" + i + "/" + s); return p;}
		p.reject = function(i,s){p.p("/transaction/reject/" + i + "/" + s); return p;}
		return p;
	}

	function RegistrationProxy(){
		var p = BP();
		p.register = function(i){p.p("/registration/register/").b(i); return p;}
		p.registerBank = function(i,n){p.p("/registration/bankregister/" + i +"?name=" + n); return p;}
		p.registerCompany = function(i,n){p.p("/registration/companyregister/" + i +"?name=" + n); return p;}
		return p;
	}

})(angular.module("paymentGateway", []));