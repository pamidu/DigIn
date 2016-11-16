DiginApp.controller('themeCtrl',[ '$scope', '$rootScope','$mdDialog','colorManager', function ($scope,$rootScope,$mdDialog, colorManager){
		$scope.$parent.currentView = "Themes";

		$scope.palette = [
			{name:"Default", imageUrl:"default.png", theme:"default"},
			{name:"Red", imageUrl:"red.png", theme:"redTheme"},
			{name:"Purple", imageUrl:"purple.png", theme:"purpleTheme"},
			{name:"Orange", imageUrl:"orange.png", theme:"orangeTheme"},
			{name:"Blue", imageUrl:"blue.png", theme:"blueTheme"},
			{name:"Green", imageUrl:"green.png", theme:"greenTheme"},
		]

		
		$scope.changeTheme = function(color)
		{
			/*console.log(color);
			//angular.element(".md-primary").css('background-color', color.primaryColor,'important');*/
			//$rootScope.theme = color.theme;
			colorManager.changeTheme(color);
			

			/*$(".hover-color").hover(function() {
			  $(this).css("color","blue")
			});*/
			
		}

}])