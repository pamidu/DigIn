window.devportal.partials.edit = function($scope, $dev, $rootScope, $state, $stateParams,$fileReader,$mdDialog){

	var canNavigateToLast = false;
	var selectedTabFile;

	function SettingsManager(){
		return{
			treeOptions:{
		    	nodeChildren: "files", dirSelectable: true,
		    	injectClasses: {ul: "a1",li: "a2", liSelected: "a7",iExpanded: "a3", iCollapsed: "a4", iLeaf: "a5", label: "a6", labelSelected: "a8"}
			}
		}

	}

	$scope.settings = new SettingsManager();

	function EditorSession(f){
		var editor;
		var code;
		var um;
		var node;

		function loadInEditor(c){
			var modelist = ace.require("ace/ext/modelist")
			var mode = modelist.getModeForPath(f).mode;
			editor.session.setMode(mode);
			editor.setValue(c);
			editor.setValue(editor.getValue(), 1);
			
			ace.require("ace/ext/language_tools");
			editor.setOptions({enableBasicAutocompletion: true});
		}

		return {
			aceLoaded : function(e) {
				editor = e;

				

				if (code){
					loadInEditor(code);
					code = undefined;
				}
				um = new ace.UndoManager();
				e.getSession().setUndoManager(um);

				e.commands.addCommand({
				    name: "replace",
				    bindKey: {win: "Ctrl-D", mac: "Command-Option-F"},
				    exec: function(e) {
				   		
				    }
				});

				if (canNavigateToLast){
					canNavigateToLast = false;
					$scope.sessions.navigate(f);
				}

				if (selectedTabFile == f){
					selectedTabFile = undefined;
					$scope.sessions.navigate(f);
				}
			},
			aceChanged : function(e) { 

			},
			getSettings : function(){
				return {useWrapMode:true, showGutter:true, theme:'kuroir', mode:'javascript', onLoad:this.aceLoaded, onChange:this.aceChanged, lineNumber:5, enableBasicAutocompletion: true};
			},
			getCode : function(e){
				if (editor) return editor.getValue();
				else return code;				
			},
			refreshCode: function(){
				code = editor.getValue();
				delete editor;
			},
			setCode: function (c){

				if (editor) loadInEditor(c);
				else code = c;

		        //$fileReader.readAsDataUrl(c, $scope).then(function(result,b,c) {
		      	//	console.log(result);
		      	//});
			},
			getFilename: function(){return f;},
			setFileName: function(fl){f=fl;},
			getNode: function(){return node;},
			setNode: function(n){node=n;},
			getHeader: function(){return f.substring(f.lastIndexOf("/") + 1);},
			cut: function(){editor.session._emit('cut');console.log ("cut");},
			copy: function(){
				var text = editor.getSession().doc.getTextRange(editor.selection.getRange());
				clipboard.setData('text/plain', text);
			},
			paste: function(){document.execCommand("paste", null, null);console.log ("paste");},
			undo:function(){um.undo()},
			redo: function(){um.redo()},
			save: function(){
				localStorage.setItem($scope.appKey + ":" + f, this.getCode());
				$dev.editor().save($scope.appKey,f,this.getCode()).success(function(data){

				}).error(function(data){
					$dev.dialog().alert ("Error Saving document : " + f);
				});
			},
			getViewer: function (){
				var ext = f.substring(f.lastIndexOf(".") + 1,f.length);
				var mime = Stretchr.Filetypes.mimeFor(ext);
				var view = mime.indexOf("/") == -1 ? mime : mime.substring(0, mime.indexOf("/"));
				return view;
			},
			snippet: function(){
			    $mdDialog.show({
			      controller: window.devportal.partials.newsnippet,
			      templateUrl: 'views/partials/newsnippet/newsnippet.html',
			      clickOutsideToClose:true
			      
			    })
			    .then(function(data){
			    	editor.insert(data);
			    }, function(){});
			}
		}
	}


	function SessionManager(){
		var openFiles = [];

		function previous(){
			var ps = localStorage.getItem("openFiles:" + $scope.appKey);
			selectedTabFile = localStorage.getItem("selectedTab:" + $scope.appKey);
			if (ps)
				openFiles = JSON.parse(ps);

			for (i in openFiles){
				var s = new EditorSession(openFiles[i]);
				var data = localStorage.getItem($scope.appKey + ":" + openFiles[i]);
				s.setCode(data);
				$scope.allSessions[openFiles[i]] = s;
			}
		}

		previous();

		var offFn = $scope.$on('$routeChangeStart', function(next, current) { 
	   		for (fi in openFiles)
	   			localStorage.removeItem($scope.appKey + ":" + openFiles[i]);
	   		localStorage.removeItem("openFiles:" + $scope.appKey);
	   		offFn();
	 	});

		return{
			saveAll: function(){
				for (si in $scope.allSessions) $scope.allSessions[si].save();
			},
			all : function(){return $scope.allSessions;},
			current: function(){return $scope.currentSession;},
			load : function(n){
				$scope.currentFile = n;
				if (!n.files){
					var f = n.folder + "/" + n.name;
					openFiles.push(f);
					localStorage.setItem("openFiles:" + $scope.appKey, JSON.stringify(openFiles))
					if (!$scope.allSessions[f]){
						$dev.editor().get($scope.appKey, f).success(function(data){
							if (typeof data === "object") data = JSON.stringify(data);
							localStorage.setItem($scope.appKey + ":" + f, data);
							var s = new EditorSession(f);
							s.setNode(n);
							s.setCode(data);
							$scope.allSessions[f] = s;
							$scope.currentSession = s;
							canNavigateToLast = true;
						}).error(function(data){

						});		

					} else {
						$scope.currentSession = $scope.allSessions[f];		
						this.navigate(f);
					}
				}
			},
			select:function(n){
				$scope.currentFile = n;
			},
			navigate: function(f){
				var fc=-1;
				for (var fi in $scope.allSessions){
					fc++;
					if  (fi == f) break;
				}
				$scope.selectedTabIndex = fc;
			},
			del: function(s){
				if (s){
					var fn = s.getFilename();
					delete $scope.allSessions[fn];
					localStorage.removeItem($scope.appKey + ":" + fn);
					openFiles.splice(openFiles.indexOf(fn),1);
					localStorage.setItem("openFiles:" + $scope.appKey, JSON.stringify(openFiles));
				}
			},
			delByPath: function(p){
				this.del($scope.allSessions[p]);
			},
			rename: function (cn,nn){
				if ($scope.allSessions[cn]){
					var cs = $scope.allSessions[cn];
					cs.setFileName(nn);
					cs.refreshCode();
					delete $scope.allSessions[cn];
					$scope.allSessions[nn] = cs;

					localStorage.removeItem($scope.appKey + ":" + cn);
					localStorage.setItem($scope.appKey + ":" + nn, $scope.allSessions[nn].getCode())

					openFiles.splice(openFiles.indexOf(cn),1, nn);
					localStorage.setItem("openFiles:" + $scope.appKey, JSON.stringify(openFiles));
				}
			}

		}
	}

	$scope.$watch("selectedTabIndex", function(){
		var count=-1;
		var fcs;
		for (si in $scope.allSessions){
			count++;
			if (count == $scope.selectedTabIndex){
				fcs = $scope.allSessions[si];
				break;
			}
		}

		if (fcs){
				$scope.currentSession = fcs;
				var n = fcs.getNode();
				if (n){
					var fol = (n.folder) ? "" : n.folder;
					localStorage.setItem("selectedTab:" + $scope.appKey, fol + fcs.getFilename());
				}	
		}

	});

	$scope.currentFile;
	$scope.selectedSession;
	$scope.currentSession;
	$scope.allSessions = {};
	$scope.binaryData = {};

	function FileManager(){

		function assignParents(p, n){
			n.parent =p;

			if (n.files) 
				for(ni in n.files) 
					assignParents(n, n.files[ni]);
		}	

		function newEntry(nfn, f){
			var p,fl;

			if (!$scope.currentFile){
				p = fl = $scope.fileList;
			}else{
				if ($scope.currentFile.files){
					p = $scope.currentFile;
					fl = $scope.currentFile.files;
				}
			}

			if (fl && p){
				var fol = (p==fl) ? "" : (p.folder + "/" + p.name);
				var ni = {name:nfn, folder:fol, parent: (p==fl) ? null : p};
				if (f) ni.files = [];
				fl.push(ni);
			}
		}

		function getAll(){
			$dev.project().files($scope.appKey).success(function(data){
				for(ni in data) 
					assignParents(null, data[ni]);
				$scope.fileList = data;

			}).error(function(){

			});
		}
		getAll();

		return{
			newFolder: function(){
				$dev.dialog().yes(function(nfn){
					var fol = ($scope.currentFile) ? $scope.currentFile.files ? ($scope.currentFile.folder + "/" + $scope.currentFile.name) : $scope.currentFile.folder : "";
					$dev.editor().newFolder($scope.appKey,fol + "/" + nfn).success(function(){
						newEntry(nfn,true);
					}).error(function(){
						$dev.dialog().alert ("Error Creating new folder");
					});					
				}).input("Please enter new folder name");
			},
			newFile: function(){
				$dev.dialog().yes(function(nfn){
					var fol = ($scope.currentFile) ? $scope.currentFile.files ? ($scope.currentFile.folder + "/" + $scope.currentFile.name) : $scope.currentFile.folder : "";

					$dev.editor().newFile($scope.appKey,fol + "/" + nfn,"Works!!!").success(function(){
						newEntry(nfn,false);
					}).error(function(){
						$dev.dialog().alert ("Error Creating new file");
					});			
				}).input("Please enter new file name");
			},
			delete: function(){
				if ($scope.currentFile){
					$dev.dialog().yes(function(){
						$dev.editor().delete($scope.appKey, $scope.currentFile.folder + "/" + $scope.currentFile.name).success(function(){
							var p,fl;
							if ($scope.currentFile.parent){
								p = $scope.currentFile.parent;
								fl = p.files;
							}else
								p = fl  = $scope.fileList;
							
							if ($scope.currentFile.files){ //folder
								for (fi in $scope.currentFile.files){
										$scope.sessions.delByPath($scope.currentFile.files[fi].folder + "/" + $scope.currentFile.files[fi].name);
								}
							}else{
								$scope.sessions.delByPath($scope.currentFile.folder + "/" + $scope.currentFile.name);
							}						

							fl.splice(fl.indexOf($scope.currentFile),1);
							$scope.currentFile = undefined;
						}).error(function(){

						});
					}).confirm("Are you sure you want to delete : " + $scope.currentFile.name);

				}
			},
			rename: function(){
				
				if ($scope.currentFile){

					$dev.dialog().yes(function(nfn){
						var cn = ($scope.currentFile.folder + "/" + $scope.currentFile.name);
						var nn = ($scope.currentFile.folder + "/" + nfn);
						
						$dev.editor().rename($scope.appKey, nfn, cn).success(function(){
							if ($scope.currentFile.files){//folder modify its open windows

							}else{ //file modify file
								$scope.sessions.rename(cn,nn);
							}						

							$scope.currentFile.name = nfn;
						}).error(function(){
							$dev.dialog().alert ("Error Renaming File");
						});
					}).input("Please enter new file name : " + $scope.currentFile.name);					
				}

			},
			checkIn: function(){},
			checkOut: function(){},
			getLatest: function(){},
			undoChanges: function(){},
			uploadFile: function(){
				if (!$scope.uploadFile)
				$scope.uploadFile = function(file){
					var fol = ($scope.currentFile) ? $scope.currentFile.files ? ($scope.currentFile.folder + "/" + $scope.currentFile.name) : $scope.currentFile.folder : "";

					$dev.editor().upload($scope.appKey, fol + "/" + file.name, file).success(function(){
						newEntry(file.name,false);
					}).error(function(){
						$dev.dialog().alert ("Error Uploading File");
					});
				}
				 document.getElementById("idFileUpload").click();
			},
			downloadFile: function(){
				window.open($dev.editor().getUrl($scope.appKey, $scope.currentFile.folder + "/" + $scope.currentFile.name));
			},
			getAll: function(){ getAll();}
		}
	}

	function ProjectManager(){
		return{
			share : function(){$state.go("share", {appKey:$scope.appKey});},
			run : function(){$state.go("run", {appKey:$scope.appKey});},
			debug : function(){},
			publish : function(){$state.go("publish", {appKey:$scope.appKey});},	
			editDescription : function(){$state.go("desc", {appKey:$scope.appKey});}		
		}
	}
	
	$scope.appKey = $stateParams.appKey;

	$scope.sessions = new SessionManager();
	$scope.files = new FileManager();
	$scope.project = new ProjectManager();

	$dev.states().setIdle();
    $scope.openNewTab = function(){$dev.navigation().newTab();}
    
	$dev.navigation().title($scope.appKey);
	
	//$scope.isMenuToggled = false;
	$scope.toggleMenu = function($mdOpenMenu){
		$mdOpenMenu();
		//$scope.isMenuToggled = true;
	}

	$scope.checkifOpen = function($mdOpenMenu,$event){
		//if($scope.isMenuToggled)
		//$mdOpenMenu($event)
		//console.log($event);
	}

/*
 var editorDiv = element.find('.ace-text-editor');
var editor = ace.edit(editorDiv.get(0));
scope.$on('updateSizes', function () { // fired in my app when things resize
    editorDiv.width(element.parent().width());
    editorDiv.height(element.parent().height());
    editor.resize();
    
}); 
*/      

}