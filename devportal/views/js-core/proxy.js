(function(ps){
	var $h;
	var $o;
	var s_e, s_b, s_i;
	var ct;

	function gh(b){
	    var h = window.location.hostname;
	    if (h.indexOf("localhost") !=-1 || h.indexOf("127.0.0.1") !=-1)
	    	h="localhost";

	    return h + (b ? b :"/devportal");
	}

	function BP(){
		var sfn,ffn, u, b,l,fd,par;
		function call(){
			if (sfn && ffn){
				if (s_b) s_b();
				if (u){
					var hd;
					if (ct != "-"){
						ct = ct ? ct : "application/json";
					 	hd = {'Content-Type': ct};
					} else hd = {};
					var reqObj = {method: b ? "POST" : "GET" ,url: "http://" + gh() + u, headers: hd};
					if (b) reqObj.data = b;
					if (ct == "-") reqObj.transformResponse= undefined;
					if (fd){
						var frd = new FormData();
        				frd.append('file', fd);
        				reqObj.data = frd;
					}

					$h(reqObj).
					  success(function(data, status, headers, config) {
					  	if (s_i) s_i();
						if (status == 200){
							if (par && angular.isString(data))
								data = JSON.parse(data);

							sfn(data);
						} 			  
						else ffn(data);
					  }).
					  error(function(data, status, headers, config) {
					  	if (s_i) s_i();
				  		ffn(data);
				  		if (s_e) s_e();
					  });
				}else{
					l(sfn,ffn);
					if (s_i) s_i();
				}
			}
		}
		return {
			success: function(f){sfn=f;call();return this;},
			error: function(f){ffn=f;call();return this;},
			p: function(ur){u=ur;return this;},
			b: function(j){b =j;return this;},
			l: function(lo){l=lo},
			ct: function(c){ct=c},
			fd: function(d){fd=d},
			parse: function(){par=true;}
		}
	}

	ps.factory('$dev', function($http, $objectstore, $mdDialog, $state){
		$h = $http;
		$o = $objectstore;
		return {
			project: function(){ return new ProjectProxy();},
			templates: function(){ return new TemplateProxy();},
			share: function(){ return new UserProxy();},
			states : function(){return new StateProxy();},
			editor : function(){return new EditorProxy();},
			dialog: function(){return new DiaogProxy($mdDialog);},
			navigation: function(){return new NavigationProxy(this, $state);}
		}	
	});

	function DiaogProxy($mdDialog){
		var p = {};
		var yf,nf,of;

		p.yes = function(f){yf = f; return p;}
		p.no = function(f){nf = f; return p;}
		p.ok = function(f){ok = f; return p;}
		p.alert = function(m,t){
			t = t ? t : "DuoWorld DevStudio";
		    $mdDialog.show(
		      $mdDialog.alert()
		        .clickOutsideToClose(true)
		        .title(t)
		        .content(m)
		        .ok('Ok')
		        .targetEvent(of)
		    );
		};
		p.confirm = function(m,t){
			t = t ? t : "DuoWorld DevStudio";
		    var cd = $mdDialog.confirm()
		          .title(t)
		          .content(m)
		          .ok('Yes')
		          .cancel('No');

		    $mdDialog.show(cd).then(yf, nf);

		};
		p.input = function(m,t,vf){
			t = t ? t : "DuoWorld DevStudio";
		    $mdDialog.show({
		      controller: function($scope){
		      	$scope.title = t;
		      	$scope.message = m;
		      	$scope.answer;

		      	$scope.validate = function(){
		      		var isValid = true;

		      		if (!$scope.answer) return true;
	      			if ($scope.answer.length == 0) return true;

		      		if (vf) isValid = vf($scope.answer);
		      		return !isValid;
		      	}

		      	$scope.ok = function(){
					$mdDialog.hide($scope.answer);
		      	};

		      	$scope.cancel= function(){
		      		$mdDialog.cancel();
		      	};

		      	$scope.enter = function(){
		      		if (!$scope.validate())
		      			$mdDialog.hide($scope.answer);
		      	}
		      },
		      templateUrl: 'views/partials/inputbox/inputbox.html'
		      //targetEvent: ev,
		      //title:t,
		      //clickOutsideToClose:true
		      
		    })
		    .then(yf, nf);

		}
		return p;
	}

	function StateProxy(){
		var p = BP();
		p.busy = function(f){s_b = f; return p;}
		p.idle = function(f){s_i = f; return p;}
		p.error = function(f){s_e = f; return p;}
		p.setBusy = function(){if (s_b) s_b();};
		p.setIdle = function(){if (s_i) s_i();};
		return p;
	}

	function ProjectProxy(){
		var p = BP();
		p.edit = function(k,d){p.p("/project/update/" + k).b(d);return p;}
		p.editDescriptor = function(k,d){p.p("/project/editdesc/" + k).b(d);return p;}
		p.download = function(k,n){ window.open("http://" + gh() + "/project/download/" + k  +"/" + n);}
		p.share = function(u){p.l(t_upload);return p;}
		p.create = function(j){p.p("/project/create").b(j); return p;}
		p.getKeys = function(n){p.p("/project/create/key/" + n).parse(); return p;}
		p.all = function(){p.p("/project/getuser").parse(); return p;}
		p.allTenant = function(){p.p("/project/gettenant").parse(); return p;}
		p.get = function(u){p.p("/project/get/" + u).parse(); return p;}
		p.files = function(i){p.p("/project/files/" + i).parse(); return p;}
		p.iconUpload = function(k,d){p.p("/project/iconupload/" + k).b(d).ct("multipart/form-data"); return p;}
		p.docUpload = function(k,d){p.p("/project/docupload/" + k).b(d).ct("multipart/form-data"); return p;}
		p.getShareUsers = function(){p.p("/project/share/getusers").parse(); return p;}
		p.shares = function(k){p.p("/project/share/get/" + k).parse(); return p;}
		p.updateShares = function(k,s){p.p("/project/share/update/" + k).b(s); return p;}
		p.getBundle = function(k){p.p("/project/getBundle/" + k).parse(); return p;}
		p.saveBundle = function(k,s){p.p("/project/saveBundle/" + k).b(s); return p;}
		p.publish = function(k,s){p.p("/project/publish/" + k).b(s); return p;}
		p.settings = function(k){p.p("/project/settings/" + k).parse(); return p;}
		p.getScope = function(k){p.p("/project/scope/" + k).parse(); return p;}
		return p;
	}
	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	
	function EditorProxy(){
		var p = BP();
		p.get = function(k,f){p.p("/editor/file/" + k  + "/" + Base64.encode(f.substring(1))); return p;}
		p.save = function(k,f,d){p.p("/editor/save/" + k  + "/" + Base64.encode(f.substring(1))).b(d).ct("-"); return p;}
		p.delete = function(k,f){p.p("/editor/delete/" + k +"/" + Base64.encode(f.substring(1))); return p;}
		p.rename = function(k,n,f){p.p("/editor/rename/" + k + "/" + n + "/" + Base64.encode(f.substring(1)) ); return p;}
		p.newFolder = function(k,f){p.p("/editor/newfolder/" + k + "/" + Base64.encode(f)); return p;}
		p.newFile = function(k,f,d){p.p("/editor/newfile/" + k + "/" + Base64.encode(f)).b(d).ct("-"); return p;}
		p.getUrl = function(k,f){ return "http://" + gh() + "/editor/file/" + k  + "/" + Base64.encode(f.substring(1));}
		p.upload = function(k,f,d){p.p("/editor/fileupload/" + k  + "/" + Base64.encode(f.substring(1))).b(d).ct("multipart/form-data"); return p;}
		//p.uploadFile =
		return p;
	}

	function TemplateProxy(){
		var p = BP();
		p.categories = function(){p.p("/templates/categories").parse(); return p;}
		p.templates = function(c){p.p("/templates/byid/" + c).parse();return p;}
		p.snippetCategories = function(){p.p("/templates/snippets/categories").parse(); return p;}
		p.snippetTemplates = function(c){p.p("/templates/snippets/byid/" + c).parse();return p;}
		p.fileCategories = function(){p.p("/templates/snippets/categories").parse(); return p;}
		p.fileTemplates = function(c){p.p("/templates/snippets/byid/" + c).parse();return p;}
		p.settings = function(c,t){p.p("/templates/settings/" + c + "/" + t).parse();return p;}
		return p;
	}

	function UserProxy(){
		var p = BP();
		p.share = function(a,u){p.p("/user/share?pid=" + a + "&uid=" + u); return p;}
		p.search = function(c){p.l(u_search); return p;}
		return p;
	}

	function NavigationProxy($dev, $state){
		var p = BP();
		p.getProjectCache = function(k,cb){
			if (localStorage.getItem("project:" + k)) cb(JSON.parse(localStorage.getItem("project:" + k)));	
			else {
				$dev.project().get(k).success(function(data){
					localStorage.setItem("project:" + k, JSON.stringify(data));
					cb(data);
				}).error(function(){cb({});});
			}
		}

		p.title = function(k,s){
			if (s) s = "(" + s + ") ";
			else s = "";

			window.document.title = "DuoWorld DevStudio";

			if (k)
			p.getProjectCache(k, function(po){
				if (po.appKey) window.document.title = "DuoWorld DevStudio "+  s + "[" + po.name + "]";
			});			
		}
		p.newTab = function(){window.open(window.location);}
		p.edit = function(k){p.getProjectCache(k, function(po){ $state.go((po.editor ? po.editor : "edit"), {appKey: k});});}
		return p;
	}
})(angular.module("devPortalLogic", ["uiMicrokernel"]));
