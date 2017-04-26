DiginApp.controller('themeCtrl',[ '$scope', '$rootScope','$mdDialog','colorManager','notifications','DiginServices','PouchServices','$interval', function ($scope,$rootScope,$mdDialog, colorManager,notifications,DiginServices,PouchServices,$interval){
		$scope.$parent.currentView = "Themes";
		
		
		$scope.themeColor = [
			{name:"Join the Dark side", imageUrl:"devil.png", theme:"Dark", backgroundColor: "rgb(66,66,66)", color: "white"},
			{name:"Come to the Light", imageUrl:"angel.png", theme:"Light", backgroundColor: "rgb(187, 187, 187)", color: "black" }
		]
		
		$scope.palette = [
			{name:"Default", imageUrl:"default.png", theme:"default"},
			{name:"Red", imageUrl:"red.png", theme:"redTheme"},
			{name:"Purple", imageUrl:"purple.png", theme:"purpleTheme"},
			{name:"Orange", imageUrl:"orange.png", theme:"orangeTheme"},
			{name:"Blue", imageUrl:"blue.png", theme:"blueTheme"},
			{name:"Green", imageUrl:"green.png", theme:"greenTheme"}
		]
		
		$scope.mainTheme = function(ev,color)
		{
			colorManager.changeMainTheme(color);
			
			confirm(ev);
		}
		
		var oldTheme = angular.copy($rootScope.theme);
		
		$scope.changeTheme = function(ev,color)
		{
			if($rootScope.lightOrDark == "Dark")
			{
				colorManager.changeTheme(color.theme+"Dark");
			}else
			{
				colorManager.changeTheme(color.theme);
			}
			confirm(ev);

		}
		
		function confirm(ev)
		{
			if($rootScope.theme != oldTheme)
			{
				confirmThemeChange(ev).then(function(answer) 
				{
					if(answer == 'yes')
					{
						//save theme in database
						oldTheme = angular.copy($rootScope.theme);
						$scope.userSettings.theme_config = $rootScope.theme;
						PouchServices.storeAndUpdateUserSettings($scope.userSettings);	
						
						var userSettingsSaveObj = {theme_config: $rootScope.theme};
						
						DiginServices.updateUserSettings(userSettingsSaveObj).then(function(data) {
							if(data.Is_Success == true){
								notifications.toast(1,"Theme saved");
							}else{
								notifications.toast(1,"Falied to update Theme");
							}
						});
						
					}else{
						colorManager.changeTheme(oldTheme);
					}
				})
			}
		}
		
		
		
		function confirmThemeChange(ev)
		{
			var showData = {title: "Change Theme", content: "Do you want to keep this theme?", okText: "keep Changes", noText: "Revert" };
	
			return $mdDialog.show({
				  controller: 'confirmDialogCtrl',
				  template: 	'<md-dialog aria-label="confirm dialog">'+
                                        '<form>'+
                                            '<md-content layout-padding>'+
                                                '<h2 class="md-title" style="margin-top:0px">{{showData.title}}</h2>'+
												'<p>{{showData.content}}<br/> Reverting to Previous theme in <span style="width:30px;">{{times}}</span> seconds</p>'+
                                                '<md-dialog-actions layout="row">'+
                                                    '<span flex></span>'+
                                                    '<md-button ng-if="showData.okText" ng-click="confirmReply(\'yes\')">'+
                                                        '{{showData.okText}}'+
                                                    '</md-button>'+
                                                    '<md-button ng-if="showData.noText" ng-click="confirmReply(\'no\')">'+
                                                        '{{showData.noText}}'+
                                                    '</md-button>'+
                                                    '<md-button ng-if="showData.cancelText" ng-click="$root.cancel()">'+
                                                        '{{showData.cancelText}}'+
                                                    '</md-button>'+
                                                '</md-dialog-actions>'+
                                            '</md-content>'+
                                        '</form>'+
                                    '</md-dialog>',
				  parent: angular.element(document.body),
				  targetEvent: ev,
				  clickOutsideToClose:true,
				  hasBackdrop:false,
				  locals: {showData: showData}
				})
				.then(function(answer) {
					return answer;
				});
		}
		
		document.body.style.zoom = $scope.zoomLevel;
		
		$scope.increaseFontSize = function()
		{
			var currentZoom = "";
			if(document.body.style.zoom != "120%")
			{
				currentZoom = parseInt(document.body.style.zoom.slice(0, -1));
				$scope.$parent.zoomLevel = String(currentZoom + 10) + "%";
				document.body.style.zoom = $scope.$parent.zoomLevel;
			}
			
		}
		
		$scope.reduceFontSize = function()
		{
			var currentZoom = "";
			if(document.body.style.zoom != "70%")
			{
				currentZoom = parseInt(document.body.style.zoom.slice(0, -1));
				$scope.$parent.zoomLevel = String(currentZoom - 10) + "%";
				document.body.style.zoom = $scope.$parent.zoomLevel;
			}
		}
		

}])

DiginApp.controller('confirmDialogCtrl',['$scope', '$mdDialog','$interval', 'showData', function ($scope, $mdDialog,$interval, showData){
	$scope.showData = showData;

	$scope.times = 10;
	var promise = $interval(
	   function () {
		  $scope.times = $scope.times - 1;
		  if($scope.times == 0){ 
			 $mdDialog.hide("no");
		  }
	   }, 1000, 10);
	   
	$scope.confirmReply = function(answer) {
		$interval.cancel(promise);
		$mdDialog.hide(answer);
	};
}])