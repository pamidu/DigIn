(function($angular){

var directiveapp  = angular.module('12thdirective',['uiMicrokernel']);




directiveapp.directive('sortOption',function(){
	return{
		restrict: 'E',
		template: "<div layout style='width:50px;'><md-menu md-position-mode='target-right target' style='z-index:99;box-shadow:0px 1px 5px 0px rgba(0, 0, 0, 0.084); background:rgb(250,250,250); height:40px; width:50px;'> <md-button type='button' aria-label='Open demo menu' class='md-icon-button' ng-click='$mdOpenMenu()'> <md-icon md-svg-icon='img/ic_reorder_24px.svg' style='margin-top: -9px;'></md-icon> </md-button> <md-menu-content width='4'> <div ng-repeat='item in sortarr track by $index'> <md-menu-item> <md-button ng-click='starfunc(item,$index)'> <div layout='row'> <p flex>{{item.name}}</p> <div> <md-icon md-svg-icon='img/ic_arrow_drop_up_48px.svg' style='margin-top:4px; position: absolute; left: 150px;' ng-show='item.upstatus'></md-icon> </div> <div> <md-icon md-svg-icon='img/ic_arrow_drop_down_24px.svg' style='margin-top:9px;position: absolute; left: 150px;' ng-show='item.downstatus'></md-icon> </div> <md-icon md-menu-align-target md-svg-icon='{{item.src}}' style='margin: auto 3px auto 0;'></md-icon> </div> </md-button> </md-menu-item> <md-divider ng-show='item.divider'></md-divider></div> </md-menu-content></md-menu></div>",
		scope:{
			nameArray:'=',
			serchItem:'=',
			star:'='

		},
		link: function(scope,element,rootScope){


			
			scope.sortarr = [];

			scope.element = {}

			for (var i = 0; i < scope.nameArray.length; i++) {
				scope.element = {}
				scope.element.name = scope.nameArray[i].name;
				scope.element.id = scope.nameArray[i].id;
				scope.element.src = scope.nameArray[i].src;	
				scope.element.divider = scope.nameArray[i].divider;					
				scope.element.upstatus = false;	

				if (scope.element.name == "Date") {
					scope.element.downstatus = true;	
					scope.sortarr.push(scope.element);
				
				}else{
					scope.element.downstatus = false;	
					scope.sortarr.push(scope.element);
				
				}
				 
			};
			console.log(scope.sortarr)
			 
        // $scope.self = this;
             scope.indexno = 1;

			scope.starfunc = function(item,index) {

				 if (item.id === "Starred") {
                	scope.star = "true";                
				}
				else{
					scope.star = "";

                if (item.upstatus == false && item.downstatus == false) {
                    item.upstatus = !item.upstatus;
                    scope.sortarr[scope.indexno].upstatus = false;
                    scope.sortarr[scope.indexno].downstatus = false;
                    scope.indexno  = index;
                }
                else{
                 item.upstatus = !item.upstatus;
                 item.downstatus = !item.downstatus;             
                 }                
                               
                self.searchText = null;
                 
                if (item.upstatus) {
                     scope.serchItem = item.id;
                }
                if (item.downstatus) {
                    scope.serchItem = '-'+item.id;
                }
				}
           	  }
		   }

		}
 

});



 //FILE UPLOADER DIRECTIVE AND FACTORY START

directiveapp.directive('fileUpLoaderNew',['$uploader',"$rootScope", "$mdToast",'UploaderService', function($uploader,$rootScope, $mdToast, UploaderService) {
	  return {
		restrict: 'E',
		template: "<div ng-init='showUploadButton=false;showDeleteButton=false;showUploadTable=false;'><div id='drop-files' ondragover='return false' layout='column' layout-align='space-around center'><div id='uploaded-holder' flex ><div id='dropped-files' ng-show='showUploadTable'><table id='Tabulate' ></table></div></div><div flex ><md-button class='md-raised' id='deletebtn' ng-show='showDeleteButton' class='md-raised' style='color:rgb(244,67,54);margin-left:30px;'><md-icon md-svg-src='img/directive_library/ic_delete_24px.svg'></md-icon></md-button></div><div flex><md-icon md-svg-src='img/directive_library/ic_cloud_upload_24px.svg'></md-icon><text style='font-size:12px;margin-left:10px'>{{label}}<text></div></div></div>",
		scope:{			 
			label:'@',
			uploadType:'@'
		},
		link: function(scope,element){
			// Makes sure the dataTransfer information is sent when we
			// Drop the item in the drop box.
			jQuery.event.props.push('dataTransfer');	
			// file/s on a single drag and drop
			var files;			
			// total of all the files dragged and dropped
			var filesArray = [];
			var sampleArray = [];
			
			// Bind the drop event to the dropzone.
			element.find("#drop-files").bind('drop', function(e) {					
				// Stop the default action, which is to redirect the page
				// To the dropped file				
				  files = e.dataTransfer.files || e.dataTransfer.files;		
			 	  for(indexx = 0; indexx < files.length; indexx++) {
						filesArray.push(files[indexx]);
						UploaderService.setArray(files[indexx]);
						UploaderService.BasicArray(filesArray[indexx].name,filesArray[indexx].size);
						sampleArray.push({'name': filesArray[indexx].name, 'size': filesArray[indexx].size});						 
					}
			var newHtml = "<tr class='md-table-headers-row'><th class='md-table-header' style='Padding:0px 16px 10px 0'>Name</th><th class='md-table-header' style='Padding:0px 16px 10px 0'>Type</th><th class='md-table-header' style='Padding:0px 16px 10px 0'>Size</th></tr>";
			  for (var i = 0; i < filesArray.length; i++) {
					 var tableRow = "<tr><td class='upload-table' style='float:left'>" + filesArray[i].name + "</td><td class='upload-table'>" +
					 filesArray[i].type+ "</td><td class='upload-table'>" +
					 filesArray[i].size +" bytes"+ "</td></tr>";
					 newHtml += tableRow;
				}				
				element.find("#Tabulate").html(newHtml);
				  $rootScope.$apply(function(){
					scope.showUploadButton = true;
					scope.showDeleteButton = true;
					scope.showUploadTable = true;
				 })
				});
			
			function restartFiles() {				
				// We need to remove all the images and li elements as
				// appropriate. We'll also make the upload button disappear
				  $rootScope.$apply(function(){
					scope.showUploadButton = false;
					scope.showDeleteButton = false;
					scope.showUploadTable = false;
				 })			
				// And finally, empty the array
				UploaderService.removeArray(filesArray,scope.uploadType);
				UploaderService.removebasicArray(sampleArray);
				 filesArray = [];
			
				return false;
			}
				  
			// Just some styling for the drop file container.
			element.find('#drop-files').bind('dragenter', function() {
				$(this).css({'box-shadow' : 'inset 0px 0px 20px rgba(0, 0, 0, 0.1)', 'border' : '2px dashed rgb(255,64,129)'});
				return false;
			});
			
			element.find('#drop-files').bind('drop', function() {
				$(this).css({'box-shadow' : 'none', 'border' : '2px dashed rgba(0,0,0,0.2)'});
				return false;
			});
			
		
			element.find('#deletebtn').click(restartFiles);
					
		} //end of link
	  };
	}]);

directiveapp.factory('UploaderService', function($rootScope){
		  $rootScope.testArray = [];
		  $rootScope.basicinfo = [];		  
  return {   
   
  setArray: function(newVal) {
        $rootScope.testArray.push(newVal);
     	return $rootScope.testArray;
    },
  loadArray: function() {    
	    return $rootScope.testArray;
   },
   loadBasicArray: function() {    
	    return $rootScope.basicinfo;
   },
  BasicArray: function(name,size) {
		$rootScope.basicinfo.push({'name': name , 'size': size});
   		console.log($rootScope.basicinfo);
     	return $rootScope.basicinfo;
   },
  removeArray: function(arr,type){	   
		  	for (var i = arr.length - 1; i >= 0; i--) {
		   	$rootScope.testArray.splice(arr[i], 1);
		   	};
		   	console.log($rootScope.testArray);
		   	return $rootScope.testArray;
 },
 
   removebasicArray: function(arr){	 
	   	for (var i = arr.length - 1; i >= 0; i--) {
	   		$rootScope.basicinfo.splice(arr[i], 1);
	   	};
	   	console.log($rootScope.basicinfo);
	   	return $rootScope.basicinfo;		
   }
  } 
});

 //FILE UPLOADER DIRECTIVE AND FACTORY END

})(window.angular);